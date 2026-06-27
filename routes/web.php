<?php

use App\Http\Controllers\CourtController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

// Public routes
Route::get('/courts', function () {
    $courts = \App\Models\Court::where('status', 'active')->get();
    return inertia('Courts', ['courts' => $courts]);
})->name('courts.index');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    // Booking routes
    Route::get('/bookings', fn() => inertia('MyBookings'))->name('bookings.index');
    Route::get('/bookings/{booking}/payment', function (\App\Models\Booking $booking) {
        return inertia('Payment', ['booking' => $booking]);
    })->name('bookings.payment');
});

require __DIR__.'/settings.php';
