<?php

namespace App\Http\Controllers;

use App\Models\Court;
use Illuminate\Http\Request;

class CourtController extends Controller
{
    /**
     * Get all courts
     */
    public function index()
    {
        return Court::where('status', 'active')
            ->select(['id', 'name', 'description', 'price_per_hour', 'location', 'image_url', 'max_players'])
            ->get();
    }

    /**
     * Get single court with available slots
     */
    public function show(Court $court, Request $request)
    {
        $date = $request->query('date', now()->toDateString());

        $availableSlots = $court->getAvailableSlotsForDate($date);
        $bookedSlots = $court->getBookedSlotsForDate($date);

        return [
            'court' => $court->only(['id', 'name', 'description', 'price_per_hour', 'location', 'image_url', 'max_players']),
            'date' => $date,
            'available_slots' => $availableSlots->map(fn ($slot) => [
                'id' => $slot->id,
                'start_time' => $slot->start_time,
                'end_time' => $slot->end_time,
            ]),
            'booked_slots' => $bookedSlots->map(fn ($slot) => [
                'start_time' => $slot->start_time,
                'end_time' => $slot->end_time,
            ]),
        ];
    }

    /**
     * Get available dates for next 30 days
     */
    public function getAvailableDates(Court $court)
    {
        $dates = [];
        for ($i = 0; $i < 30; $i++) {
            $date = now()->addDays($i)->toDateString();
            $hasAvailableSlots = $court->getAvailableSlotsForDate($date)->count() > 0;
            if ($hasAvailableSlots) {
                $dates[] = [
                    'date' => $date,
                    'formatted' => now()->parse($date)->format('d M Y'),
                    'day' => now()->parse($date)->format('l'),
                ];
            }
        }

        return $dates;
    }
}
