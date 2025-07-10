<?php

namespace App\Http\Controllers;

use App\Models\Transaksi;
use App\Models\Kantong;
use App\Models\Setting;
use App\Models\Investor; // DIUBAH: Menambahkan model Investor
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
                // DIUBAH: Memanggil fungsi baru dengan logika perhitungan yang kompleks
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

    // DIUBAH: Logika applyPemasukan diubah total sesuai alur yang disetujui
    private function applyPemasukan($totalPemasukan)
    {
        // Langkah 1: Alokasi ke Kantong Saldo (Operasional, dll.)
        $sisaPemasukan = $totalPemasukan;
        $kantongOperasional = Kantong::where('is_deletable', true)->get();
        $allocations = Setting::where('key', 'like', 'allocation_%')->get()->keyBy('key');

        foreach ($kantongOperasional as $kantong) {
            $settingKey = 'allocation_' . $kantong->id;
            if ($allocations->has($settingKey)) {
                $percentage = (float) $allocations[$settingKey]->value;
                if ($percentage > 0) {
                    $alokasiAmount = ($totalPemasukan * $percentage) / 100;
                    $kantong->amount += $alokasiAmount;
                    $kantong->save();
                    $sisaPemasukan -= $alokasiAmount;
                }
            }
        }

        // Langkah 2: Sisa pemasukan menjadi laba bersih untuk dibagi
        $labaBersih = $sisaPemasukan;
        $investors = Investor::all();
        $totalInvestorHp = $investors->sum('hp_units');
        $totalUntukPerusahaan = 0;

        if ($totalInvestorHp > 0 && $investors->count() > 0) {
            // Langkah 3 & 4: Hitung hak dan bagian untuk setiap investor
            foreach ($investors as $investor) {
                // Valuasi berdasarkan porsi HP
                $valuasi = $investor->hp_units / $totalInvestorHp;
                $hakInvestorDariLaba = $labaBersih * $valuasi;

                // Hitung bagian akhir
                $bagianUntukInvestor = $hakInvestorDariLaba * ($investor->profit_share / 100);
                $bagianUntukPerusahaan = $hakInvestorDariLaba - $bagianUntukInvestor;
                
                // Tambahkan sisa bagian perusahaan ke total
                $totalUntukPerusahaan += $bagianUntukPerusahaan;

                // Buat atau temukan kantong untuk investor ini dan tambahkan saldonya
                // Asumsi: Nama investor unik dan dijadikan judul kantong
                $kantongInvestor = Kantong::firstOrCreate(
                    ['title' => $investor->name],
                    ['amount' => 0, 'is_deletable' => true]
                );
                $kantongInvestor->amount += $bagianUntukInvestor;
                $kantongInvestor->save();
            }
        } else {
            // Jika tidak ada investor, semua laba bersih menjadi milik perusahaan
            $totalUntukPerusahaan = $labaBersih;
        }

        // Langkah 5: Masukkan total bagian perusahaan ke Saldo Utama
        $saldoUtama = Kantong::where('is_deletable', false)->firstOrFail();
        $saldoUtama->amount += $totalUntukPerusahaan;
        $saldoUtama->save();
    }

    // DIUBAH: Logika revertTransaksi juga disesuaikan
    private function revertTransaksi(Transaksi $transaksi)
    {
        if ($transaksi->type === 'Pemasukan') {
            $totalPemasukanLama = $transaksi->amount;
            
            // Langkah 1: Batalkan alokasi ke Kantong Saldo
            $sisaPemasukanLama = $totalPemasukanLama;
            $kantongOperasional = Kantong::where('is_deletable', true)->get();
            $allocations = Setting::where('key', 'like', 'allocation_%')->get()->keyBy('key');

            foreach ($kantongOperasional as $kantong) {
                $settingKey = 'allocation_' . $kantong->id;
                 if ($allocations->has($settingKey)) {
                    $percentage = (float) $allocations[$settingKey]->value;
                    if ($percentage > 0) {
                        $alokasiAmount = ($totalPemasukanLama * $percentage) / 100;
                        $kantong->amount -= $alokasiAmount;
                        $kantong->save();
                        $sisaPemasukanLama -= $alokasiAmount;
                    }
                }
            }

            // Langkah 2-4: Batalkan alokasi ke investor dan perusahaan
            $labaBersihLama = $sisaPemasukanLama;
            $investors = Investor::all();
            $totalInvestorHp = $investors->sum('hp_units');
            $totalUntukPerusahaanLama = 0;

            if ($totalInvestorHp > 0 && $investors->count() > 0) {
                foreach ($investors as $investor) {
                    $valuasi = $investor->hp_units / $totalInvestorHp;
                    $hakInvestorDariLaba = $labaBersihLama * $valuasi;
                    $bagianUntukInvestor = $hakInvestorDariLaba * ($investor->profit_share / 100);
                    $bagianUntukPerusahaan = $hakInvestorDariLaba - $bagianUntukInvestor;
                    $totalUntukPerusahaanLama += $bagianUntukPerusahaan;

                    $kantongInvestor = Kantong::where('title', $investor->name)->first();
                    if ($kantongInvestor) {
                        $kantongInvestor->amount -= $bagianUntukInvestor;
                        $kantongInvestor->save();
                    }
                }
            } else {
                $totalUntukPerusahaanLama = $labaBersihLama;
            }

            // Langkah 5: Batalkan penambahan ke Saldo Utama
            $saldoUtama = Kantong::where('is_deletable', false)->firstOrFail();
            $saldoUtama->amount -= $totalUntukPerusahaanLama;
            $saldoUtama->save();

        } else { // Jika Pengeluaran
            if ($transaksi->kantong) {
                $transaksi->kantong->amount += $transaksi->amount;
                $transaksi->kantong->save();
            }
        }
    }
}
