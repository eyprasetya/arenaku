<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Court;
use App\Models\TimeSlot;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class BookingController extends Controller
{
    /**
     * Get user's bookings
     */
    public function index(Request $request)
    {
        return auth()->user()->bookings()
            ->with(['court:id,name,location'])
            ->select(['id', 'court_id', 'booking_date', 'start_time', 'end_time', 'total_price', 'status', 'created_at'])
            ->orderByDesc('booking_date')
            ->paginate(10);
    }

    /**
     * Create new booking
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'court_id' => 'required|exists:courts,id',
            'booking_date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'player_names' => 'nullable|string|max:500',
            'notes' => 'nullable|string|max:1000',
        ]);

        $court = Court::findOrFail($validated['court_id']);

        // Validate time slots availability
        $startTime = $validated['start_time'];
        $endTime = $validated['end_time'];
        $date = $validated['booking_date'];

        // Check if slots are available
        $unavailableSlots = TimeSlot::where('court_id', $validated['court_id'])
            ->where('date', $date)
            ->where('status', '!=', 'available')
            ->whereBetween('start_time', [$startTime, $endTime])
            ->exists();

        if ($unavailableSlots) {
            throw ValidationException::withMessages([
                'time_slot' => 'Selected time slot is not available',
            ]);
        }

        // Calculate duration and price
        $startDateTime = \Carbon\Carbon::parse($startTime);
        $endDateTime = \Carbon\Carbon::parse($endTime);
        $durationHours = $endDateTime->diffInHours($startDateTime);
        $totalPrice = $court->price_per_hour * $durationHours;

        // Create booking
        $booking = Booking::create([
            'user_id' => auth()->id(),
            'court_id' => $validated['court_id'],
            'booking_date' => $date,
            'start_time' => $startTime,
            'end_time' => $endTime,
            'duration_hours' => $durationHours,
            'total_price' => $totalPrice,
            'player_names' => $validated['player_names'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'status' => 'pending',
        ]);

        // Mark time slots as booked
        TimeSlot::where('court_id', $validated['court_id'])
            ->where('date', $date)
            ->whereBetween('start_time', [$startTime, $endTime])
            ->update(['status' => 'booked']);

        return response()->json([
            'message' => 'Booking created successfully',
            'booking' => $booking,
        ], 201);
    }

    /**
     * Get booking details
     */
    public function show(Booking $booking)
    {
        $this->authorize('view', $booking);

        return $booking->load(['court', 'payment']);
    }

    /**
     * Cancel booking
     */
    public function cancel(Booking $booking, Request $request)
    {
        $this->authorize('update', $booking);

        if (!$booking->canBeCancelled()) {
            return response()->json([
                'message' => 'Booking cannot be cancelled in its current status',
            ], 422);
        }

        $reason = $request->input('reason', null);
        $booking->cancel($reason);

        return response()->json([
            'message' => 'Booking cancelled successfully',
            'booking' => $booking,
        ]);
    }

    /**
     * Confirm booking after payment
     */
    public function confirm(Booking $booking)
    {
        $this->authorize('update', $booking);

        if ($booking->status !== 'pending') {
            return response()->json([
                'message' => 'Booking is already confirmed',
            ], 422);
        }

        $booking->confirm();

        return response()->json([
            'message' => 'Booking confirmed',
            'booking' => $booking,
        ]);
    }
}
