<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB; // DIUBAH: Tambahkan ini

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('kantongs', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->decimal('amount', 15, 2)->default(0);
            // DIUBAH: Menambahkan kolom untuk menandai kantong yang tidak bisa dihapus
            $table->boolean('is_deletable')->default(true);
            $table->timestamps();
        });

        // DIUBAH: Menambahkan "Saldo Utama" secara default saat migrasi
        DB::table('kantongs')->insert([
            'title' => 'Saldo Utama',
            'amount' => 0,
            'is_deletable' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kantongs');
    }
};
