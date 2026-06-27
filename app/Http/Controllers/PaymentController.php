<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    /**
     * Get payment details
     */
    public function show(Payment $payment)
    {
        $this->authorize('view', $payment);

        return $payment->load(['booking', 'user']);
    }

    /**
     * Create payment for booking
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'booking_id' => 'required|exists:bookings,id',
            'payment_method' => 'required|in:credit_card,debit_card,bank_transfer,e_wallet',
        ]);

        $booking = Booking::findOrFail($validated['booking_id']);

        // Check authorization
        if ($booking->user_id !== auth()->id()) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        // Check if payment already exists
        $existingPayment = Payment::where('booking_id', $booking->id)
            ->whereIn('status', ['pending', 'completed'])
            ->first();

        if ($existingPayment) {
            return response()->json([
                'message' => 'Payment already exists for this booking',
                'payment' => $existingPayment,
            ], 422);
        }

        // Create payment
        $payment = Payment::create([
            'booking_id' => $booking->id,
            'user_id' => auth()->id(),
            'amount' => $booking->total_price,
            'payment_method' => $validated['payment_method'],
            'reference_code' => Payment::generateReferenceCode(),
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Payment created',
            'payment' => $payment,
        ], 201);
    }

    /**
     * Process payment (webhook from payment gateway)
     */
    public function processPayment(Request $request)
    {
        $validated = $request->validate([
            'payment_id' => 'required|exists:payments,id',
            'transaction_id' => 'required|string',
            'status' => 'required|in:success,failed',
        ]);

        $payment = Payment::findOrFail($validated['payment_id']);

        if ($validated['status'] === 'success') {
            $payment->update([
                'transaction_id' => $validated['transaction_id'],
            ]);
            $payment->markAsCompleted();

            return response()->json([
                'message' => 'Payment completed successfully',
                'payment' => $payment,
            ]);
        } else {
            $payment->markAsFailed('Payment failed at gateway');

            return response()->json([
                'message' => 'Payment failed',
                'payment' => $payment,
            ], 422);
        }
    }

    /**
     * Get user's payments
     */
    public function userPayments()
    {
        return auth()->user()->payments()
            ->with(['booking.court'])
            ->orderByDesc('created_at')
            ->paginate(10);
    }

    /**
     * Request refund
     */
    public function requestRefund(Payment $payment, Request $request)
    {
        $this->authorize('update', $payment);

        if ($payment->status !== 'completed') {
            return response()->json([
                'message' => 'Only completed payments can be refunded',
            ], 422);
        }

        $payment->refund();

        return response()->json([
            'message' => 'Refund processed',
            'payment' => $payment,
        ]);
    }
}
