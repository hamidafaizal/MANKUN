<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Kantong;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Menambahkan kolom 'priority' dengan nilai default
        Schema::table('kantongs', function (Blueprint $table) {
            $table->integer('priority')->default(99)->after('is_deletable');
        });

        // Menetapkan prioritas awal untuk kantong yang sudah ada
        // Ini untuk memastikan kantong lama memiliki urutan yang logis
        if (Schema::hasTable('kantongs')) {
            // Prioritas 1 untuk Gaji Karyawan
            $gajiKaryawan = Kantong::where('title', 'Gaji Karyawan')->first();
            if ($gajiKaryawan) {
                $gajiKaryawan->priority = 1;
                $gajiKaryawan->save();
            }

            // Urutkan kantong operasional lainnya setelah Gaji Karyawan
            $otherKantongs = Kantong::where('title', '!=', 'Gaji Karyawan')
                                    ->where('is_deletable', true)
                                    ->orderBy('id')
                                    ->get();

            $priorityCounter = 2;
            foreach ($otherKantongs as $kantong) {
                $kantong->priority = $priorityCounter++;
                $kantong->save();
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('kantongs', function (Blueprint $table) {
            $table->dropColumn('priority');
        });
    }
};
