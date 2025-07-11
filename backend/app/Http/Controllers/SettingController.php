<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use App\Models\Kantong; // <-- TAMBAHKAN INI
use Illuminate\Http\Request;

class SettingController extends Controller
{
    /**
     * Mengambil semua pengaturan dalam format key-value.
     */
    public function index()
    {
        $settings = Setting::all()->pluck('value', 'key');
        return response()->json($settings);
    }

    /**
     * DIUBAH: Menyimpan atau memperbarui pengaturan volume dan prioritas.
     */
    public function store(Request $request)
    {
        // Mengambil data alokasi yang dikirim dari frontend
        $allocations = $request->input('allocations', []);

        // Looping untuk menyimpan target volume dan prioritas
        foreach ($allocations as $index => $allocationData) {
            if (isset($allocationData['id']) && isset($allocationData['volume'])) {
                // Simpan target volume di tabel 'settings'
                Setting::updateOrCreate(
                    ['key' => 'allocation_volume_' . $allocationData['id']],
                    ['value' => $allocationData['volume']]
                );

                // Simpan urutan prioritas di tabel 'kantongs'
                // Prioritas 1 adalah yang paling atas (index 0)
                Kantong::where('id', $allocationData['id'])->update(['priority' => $index + 1]);
            }
        }

        return response()->json(['message' => 'Pengaturan berhasil disimpan.']);
    }
}
