<?php

namespace App\Http\Controllers;

use App\Models\Kantong;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class KantongController extends Controller
{
    /**
     * Menampilkan semua data kantong.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        // Mengambil semua data dari model Kantong
        $kantongs = Kantong::all();
        // Mengirimkan response dalam bentuk JSON
        return response()->json($kantongs);
    }

    /**
     * Menyimpan kantong baru ke database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // Validasi input dari frontend
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255|unique:kantongs',
            'amount' => 'nullable|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422); // 422 Unprocessable Entity
        }

        // Membuat data baru
        $kantong = Kantong::create([
            'title' => $request->title,
            'amount' => $request->amount ?? 0, // Jika amount tidak ada, defaultnya 0
        ]);

        // Mengirimkan response data yang baru dibuat dengan status 201 (Created)
        return response()->json($kantong, 201);
    }

    /**
     * Menampilkan satu data kantong spesifik.
     *
     * @param  \App\Models\Kantong  $kantong
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Kantong $kantong)
    {
        // Langsung return data kantong yang ditemukan oleh Route Model Binding
        return response()->json($kantong);
    }

    /**
     * Memperbarui data kantong di database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Kantong  $kantong
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Kantong $kantong)
    {
        // Validasi input
        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255|unique:kantongs,title,' . $kantong->id,
            'amount' => 'sometimes|nullable|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Update data kantong
        $kantong->update($request->all());

        // Mengirimkan response data yang sudah diupdate
        return response()->json($kantong);
    }

    /**
     * Menghapus data kantong dari database.
     *
     * @param  \App\Models\Kantong  $kantong
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Kantong $kantong)
    {
        // Hapus data
        $kantong->delete();

        // Kirim response kosong dengan status 204 (No Content)
        return response()->json(null, 204);
    }
}