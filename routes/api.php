<?php

use App\Http\Controllers\BookingController;
use App\Http\Controllers\CourtController;
use App\Http\Controllers\PaymentController;
use Illuminate\Support\Facades\Route;

Route::prefix('api')->group(function () {
    // Public routes - Court listing
    Route::get('/courts', [CourtController::class, 'index']);
    Route::get('/courts/{court}', [CourtController::class, 'show']);
    Route::get('/courts/{court}/available-dates', [CourtController::class, 'getAvailableDates']);

    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        // Bookings
        Route::get('/bookings', [BookingController::class, 'index']);
        Route::post('/bookings', [BookingController::class, 'store']);
        Route::get('/bookings/{booking}', [BookingController::class, 'show']);
        Route::post('/bookings/{booking}/cancel', [BookingController::class, 'cancel']);
        Route::post('/bookings/{booking}/confirm', [BookingController::class, 'confirm']);

        // Payments
        Route::post('/payments', [PaymentController::class, 'store']);
        Route::get('/payments/{payment}', [PaymentController::class, 'show']);
        Route::get('/user/payments', [PaymentController::class, 'userPayments']);
        Route::post('/payments/{payment}/refund', [PaymentController::class, 'requestRefund']);
        Route::post('/payments/process', [PaymentController::class, 'processPayment']);
    });
});
