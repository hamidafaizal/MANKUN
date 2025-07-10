<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaksi extends Model
{
    use HasFactory;

    // TAMBAHKAN BLOK DI BAWAH INI
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'date',
        'type',
        'amount',
        'kantong_id',
    ];

    /**
     * Mendapatkan kantong yang terkait dengan transaksi.
     */
    public function kantong()
    {
        return $this->belongsTo(Kantong::class);
    }
}