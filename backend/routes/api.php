<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\KantongController; // <-- TAMBAHKAN INI
use App\Http\Controllers\TransaksiController;
use App\Http\Controllers\SettingController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// TAMBAHKAN BARIS DI BAWAH INI
Route::apiResource('kantongs', KantongController::class);
Route::apiResource('transaksis', TransaksiController::class);

//rute setting
Route::get('/settings', [SettingController::class, 'index']);
Route::post('/settings', [SettingController::class, 'store']);