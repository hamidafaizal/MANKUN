<?php

namespace App\Http\Controllers;

use App\Models\Transaksi;
use App\Models\Kantong;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class TransaksiController extends Controller
{
    // ... (fungsi index, store, show, dan update tetap sama) ...
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
                $totalPemasukan = $request->amount;
                $sisaPemasukan = $totalPemasukan;
                $allocations = Setting::where('key', 'like', 'allocation_%')->get();
                foreach ($allocations as $setting) {
                    if ((float)$setting->value > 0) {
                        $kantongId = str_replace('allocation_', '', $setting->key);
                        $percentage = (float) $setting->value;
                        $kantong = Kantong::find($kantongId);
                        if ($kantong) {
                            $alokasiAmount = ($totalPemasukan * $percentage) / 100;
                            $kantong->amount += $alokasiAmount;
                            $kantong->save();
                            $sisaPemasukan -= $alokasiAmount;
                        }
                    }
                }
                $kasUtama = Kantong::firstOrCreate(['title' => 'Kas Utama'], ['amount' => 0]);
                $kasUtama->amount += $sisaPemasukan;
                $kasUtama->save();
                $transaksi = Transaksi::create($request->except('kantong_id'));
            } else {
                $kantong = Kantong::find($request->kantong_id);
                if ($kantong->amount < $request->amount) {
                    DB::rollBack();
                    return response()->json(['error' => 'Saldo kantong tidak mencukupi.'], 400);
                }
                $kantong->amount -= $request->amount;
                $kantong->save();
                $transaksi = Transaksi::create($request->all());
            }

            DB::commit();
            $newTransaksi = Transaksi::with('kantong')->find($transaksi->id);
            return response()->json($newTransaksi, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Gagal menyimpan transaksi.', 'message' => $e->getMessage()], 500);
        }
    }

    public function show(Transaksi $transaksi)
    {
        return response()->json($transaksi);
    }
    
    public function update(Request $request, Transaksi $transaksi)
    {
        return response()->json(['message' => 'Fungsi update belum diimplementasikan.'], 501);
    }

    /**
     * Menghapus data transaksi.
     */
    public function destroy(Transaksi $transaksi)
    {
        // DIUBAH: Menambahkan logika untuk menghapus transaksi
        DB::beginTransaction();
        try {
            // Jika yang dihapus adalah pengeluaran, kembalikan saldonya ke kantong
            if ($transaksi->type === 'Pengeluaran' && $transaksi->kantong) {
                $transaksi->kantong->amount += $transaksi->amount;
                $transaksi->kantong->save();
            }
            // Catatan: Logika untuk mengembalikan alokasi dari Pemasukan lebih rumit dan bisa ditambahkan nanti
            
            $transaksi->delete();
            DB::commit();
            return response()->json(null, 204); // 204 No Content, artinya berhasil

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Gagal menghapus transaksi.', 'message' => $e->getMessage()], 500);
        }
    }
}