<?php

namespace App\Http\Controllers;

use App\Models\Kantong;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class KantongController extends Controller
{
    /**
     * Menampilkan semua data kantong.
     */
    public function index()
    {
        $kantongs = Kantong::all();
        return response()->json($kantongs);
    }

    /**
     * Menyimpan kantong baru ke database.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255|unique:kantongs',
            'amount' => 'nullable|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $kantong = Kantong::create([
            'title' => $request->title,
            'amount' => $request->amount ?? 0,
        ]);

        return response()->json($kantong, 201);
    }

    /**
     * Menampilkan satu data kantong spesifik.
     */
    public function show(Kantong $kantong)
    {
        return response()->json($kantong);
    }

    /**
     * Memperbarui data kantong di database.
     */
    public function update(Request $request, Kantong $kantong)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255|unique:kantongs,title,' . $kantong->id,
            'amount' => 'sometimes|nullable|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        
        // DIUBAH: Mencegah perubahan nama kantong "Saldo Utama"
        if (!$kantong->is_deletable && $request->has('title') && $request->title !== $kantong->title) {
            return response()->json(['error' => 'Nama Saldo Utama tidak dapat diubah.'], 403);
        }

        $kantong->update($request->all());

        return response()->json($kantong);
    }

    /**
     * Menghapus data kantong dari database.
     */
    public function destroy(Kantong $kantong)
    {
        // DIUBAH: Menambahkan perlindungan agar Saldo Utama tidak bisa dihapus
        if (!$kantong->is_deletable) {
            return response()->json(['error' => 'Saldo Utama tidak dapat dihapus.'], 403); // 403 Forbidden
        }

        $kantong->delete();

        return response()->json(null, 204);
    }
}
