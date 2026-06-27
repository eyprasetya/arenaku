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
        Schema::create('time_slots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('court_id')->constrained('courts')->onDelete('cascade');
            $table->date('date'); // Tanggal
            $table->time('start_time'); // Jam mulai (08:00)
            $table->time('end_time'); // Jam selesai (09:00)
            $table->enum('status', ['available', 'booked', 'maintenance'])->default('available');
            $table->timestamps();

            $table->unique(['court_id', 'date', 'start_time']);
            $table->index(['date', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('time_slots');
    }
};
