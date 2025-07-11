<?php

namespace App\Http\Controllers;

use App\Models\Transaksi;
use App\Models\Kantong;
use App\Models\Setting;
use App\Models\Investor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Exception;

class TransaksiController extends Controller
{
    public function index()
    {
        $transaksis = Transaksi::with('kantong')->latest()->get();
        return response()->json($transaksis);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'date' => 'required|date',
            'type' => 'required|in:Pemasukan,Pengeluaran',
            'amount' => 'required|numeric|min:1',
            'kantong_id' => 'required_if:type,Pengeluaran|exists:kantongs,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        DB::beginTransaction();
        try {
            if ($request->type === 'Pemasukan') {
                $this->applyPemasukan($request->amount);
                $transaksi = Transaksi::create($request->except('kantong_id'));
            } else {
                $kantong = Kantong::findOrFail($request->kantong_id);
                if ($kantong->amount < $request->amount) {
                    throw new Exception('Saldo kantong tidak mencukupi.');
                }
                $kantong->amount -= $request->amount;
                $kantong->save();
                $transaksi = Transaksi::create($request->all());
            }

            DB::commit();
            $newTransaksi = Transaksi::with('kantong')->find($transaksi->id);
            return response()->json($newTransaksi, 201);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Gagal menyimpan transaksi: ' . $e->getMessage()], 500);
        }
    }

    public function show(Transaksi $transaksi)
    {
        return response()->json($transaksi->load('kantong'));
    }

    public function update(Request $request, Transaksi $transaksi)
    {
        // ... (Logika update memerlukan penyesuaian serupa, untuk saat ini kita fokus pada store & destroy)
        // Untuk sementara, logika update akan sama dengan store, setelah revert.
        $validator = Validator::make($request->all(), [
            'date' => 'required|date',
            'type' => 'required|in:Pemasukan,Pengeluaran',
            'amount' => 'required|numeric|min:1',
            'kantong_id' => 'required_if:type,Pengeluaran|exists:kantongs,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        DB::beginTransaction();
        try {
            $this->revertTransaksi($transaksi);

            if ($request->type === 'Pemasukan') {
                $this->applyPemasukan($request->amount);
            } else {
                $kantongBaru = Kantong::findOrFail($request->kantong_id);
                if ($kantongBaru->amount < $request->amount) {
                    throw new Exception('Saldo kantong tidak mencukupi untuk pembaruan.');
                }
                $kantongBaru->amount -= $request->amount;
                $kantongBaru->save();
            }
            
            $transaksi->update($request->all());

            DB::commit();
            return response()->json($transaksi->load('kantong'));
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Gagal memperbarui transaksi: ' . $e->getMessage()], 500);
        }
    }

    public function destroy(Transaksi $transaksi)
    {
        DB::beginTransaction();
        try {
            $this->revertTransaksi($transaksi);
            $transaksi->delete();
            DB::commit();
            return response()->json(null, 204);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Gagal menghapus transaksi: ' . $e->getMessage()], 500);
        }
    }

    // --- FUNGSI HELPER ---

    // DIUBAH TOTAL: Logika applyPemasukan sekarang berbasis volume dan prioritas
    private function applyPemasukan($totalPemasukan)
    {
        $sisaPemasukan = $totalPemasukan;

        // Langkah 1: Ambil semua kantong operasional dan target volumenya, urutkan berdasarkan prioritas
        $investorNames = Investor::pluck('name');
        $operationalKantongs = Kantong::where('is_deletable', true)
                                ->whereNotIn('title', $investorNames)
                                ->orderBy('priority', 'asc')
                                ->get();

        $allocationSettings = Setting::where('key', 'like', 'allocation_volume_%')
                                 ->get()
                                 ->pluck('value', 'key');

        // Langkah 2: Isi kantong operasional sesuai prioritas dan target volume
        foreach ($operationalKantongs as $kantong) {
            if ($sisaPemasukan <= 0) break;

            $settingKey = 'allocation_volume_' . $kantong->id;
            $targetVolume = (float) ($allocationSettings[$settingKey] ?? 0);
            $kekurangan = max(0, $targetVolume - (float) $kantong->amount);

            if ($kekurangan > 0) {
                $danaUntukKantongIni = min($sisaPemasukan, $kekurangan);
                $kantong->amount += $danaUntukKantongIni;
                $kantong->save();
                $sisaPemasukan -= $danaUntukKantongIni;
            }
        }

        // Langkah 3: Sisa pemasukan menjadi laba bersih untuk dibagi
        $labaBersih = $sisaPemasukan;
        $investors = Investor::all();
        $totalInvestorHp = $investors->sum('hp_units');
        $totalUntukPerusahaan = 0;

        if ($totalInvestorHp > 0 && $investors->count() > 0) {
            foreach ($investors as $investor) {
                $valuasi = $investor->hp_units / $totalInvestorHp;
                $hakInvestorDariLaba = $labaBersih * $valuasi;
                $bagianUntukInvestor = $hakInvestorDariLaba * ($investor->profit_share / 100);
                $bagianUntukPerusahaan = $hakInvestorDariLaba - $bagianUntukInvestor;
                
                $totalUntukPerusahaan += $bagianUntukPerusahaan;

                $kantongInvestor = Kantong::firstOrCreate(
                    ['title' => $investor->name],
                    ['amount' => 0, 'is_deletable' => true, 'priority' => 999] // Investor kantong has low priority
                );
                $kantongInvestor->amount += $bagianUntukInvestor;
                $kantongInvestor->save();
            }
        } else {
            $totalUntukPerusahaan = $labaBersih;
        }

        // Langkah 4: Masukkan total bagian perusahaan ke Saldo Utama
        $saldoUtama = Kantong::where('is_deletable', false)->firstOrFail();
        $saldoUtama->amount += $totalUntukPerusahaan;
        $saldoUtama->save();
    }

    // DIUBAH: Logika revertTransaksi disesuaikan (meski tidak sempurna tanpa histori)
    private function revertTransaksi(Transaksi $transaksi)
    {
        if ($transaksi->type === 'Pemasukan') {
            // Karena logika pengisian volume bersifat stateful, revert yang sempurna sulit dilakukan.
            // Pendekatan yang paling aman adalah mengurangi dari Saldo Utama terlebih dahulu,
            // lalu dari kantong investor, dan terakhir dari kantong operasional secara terbalik.
            // Ini adalah pendekatan yang disederhanakan untuk menghindari kompleksitas berlebih.
            
            $amountToRevert = $transaksi->amount;

            // 1. Tarik dari Saldo Utama & Investor (representasi laba)
            $saldoUtama = Kantong::where('is_deletable', false)->first();
            $investorKantongs = Kantong::whereIn('title', Investor::pluck('name'))->get();

            // Asumsi kasar: Laba adalah yang terakhir masuk, jadi tarik dari sini dulu.
            // Tarik dari Saldo Utama
            $revertedFromUtama = min($saldoUtama->amount, $amountToRevert);
            $saldoUtama->amount -= $revertedFromUtama;
            $saldoUtama->save();
            $amountToRevert -= $revertedFromUtama;

            // Tarik dari kantong investor secara proporsional
            if ($amountToRevert > 0) {
                foreach ($investorKantongs as $kInvestor) {
                    $revertedFromInvestor = min($kInvestor->amount, $amountToRevert / $investorKantongs->count()); // Pembagian kasar
                    $kInvestor->amount -= $revertedFromInvestor;
                    $kInvestor->save();
                    $amountToRevert -= $revertedFromInvestor;
                }
            }

            // 2. Tarik sisa dari kantong operasional (reverse priority)
            if ($amountToRevert > 0) {
                $operationalKantongs = Kantong::where('is_deletable', true)
                                        ->whereNotIn('title', Investor::pluck('name'))
                                        ->orderBy('priority', 'desc')
                                        ->get();
                foreach ($operationalKantongs as $kOperasional) {
                    if ($amountToRevert <= 0) break;
                    $revertedFromOps = min($kOperasional->amount, $amountToRevert);
                    $kOperasional->amount -= $revertedFromOps;
                    $kOperasional->save();
                    $amountToRevert -= $revertedFromOps;
                }
            }

        } else { // Jika Pengeluaran
            if ($transaksi->kantong) {
                $transaksi->kantong->amount += $transaksi->amount;
                $transaksi->kantong->save();
            }
        }
    }
}
