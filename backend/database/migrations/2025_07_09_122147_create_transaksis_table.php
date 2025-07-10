<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    // database/migrations/YYYY_MM_DD_HHMMSS_create_transaksis_table.php

public function up(): void
{
    Schema::create('transaksis', function (Blueprint $table) {
        $table->id();
        $table->date('date'); // Untuk tanggal transaksi
        $table->enum('type', ['Pemasukan', 'Pengeluaran']); // Jenis transaksi
        $table->decimal('amount', 15, 2); // Jumlah uang

        // Ini untuk relasi ke tabel kantongs
        // Hanya akan diisi jika tipenya 'Pengeluaran'
        $table->foreignId('kantong_id')->nullable()->constrained('kantongs')->onDelete('set null');

        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaksis');
    }
};
