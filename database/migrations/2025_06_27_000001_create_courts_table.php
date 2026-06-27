<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('courts', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Lapangan A, Lapangan B, etc
            $table->text('description')->nullable();
            $table->decimal('price_per_hour', 10, 2); // Harga per jam
            $table->string('location'); // Lokasi lapangan
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->string('image_url')->nullable();
            $table->integer('max_players')->default(4);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courts');
    }
};
