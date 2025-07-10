<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    /**
     * Mengambil semua pengaturan dalam format key-value.
     */
    public function index()
    {
        // Mengubah koleksi menjadi format: { "key1": "value1" }
        $settings = Setting::all()->pluck('value', 'key');
        return response()->json($settings);
    }

    /**
     * Menyimpan atau memperbarui semua pengaturan yang dikirim.
     */
    public function store(Request $request)
    {
        // Mengambil semua data yang dikirim dari frontend
        $settingsData = $request->all();

        // Looping untuk setiap key-value pair
        foreach ($settingsData as $key => $value) {
            // Memperbarui atau membuat pengaturan baru berdasarkan 'key'
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        return response()->json(['message' => 'Pengaturan berhasil disimpan.']);
    }
}