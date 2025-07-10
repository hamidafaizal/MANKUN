<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    // database/migrations/YYYY_MM_DD_HHMMSS_create_kantongs_table.php

public function up(): void
{
    Schema::create('kantongs', function (Blueprint $table) {
        $table->id();
        $table->string('title'); // Untuk nama kantong, contoh: Gaji Host
        $table->decimal('amount', 15, 2)->default(0); // Untuk saldo kantong
        $table->timestamps(); // Kolom created_at dan updated_at
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kantongs');
    }
};
