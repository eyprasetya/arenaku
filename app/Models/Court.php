<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Court extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price_per_hour',
        'location',
        'status',
        'image_url',
        'max_players',
    ];

    protected $casts = [
        'price_per_hour' => 'decimal:2',
    ];

    public function timeSlots(): HasMany
    {
        return $this->hasMany(TimeSlot::class);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    /**
     * Get available slots for a specific date
     */
    public function getAvailableSlotsForDate($date)
    {
        return $this->timeSlots()
            ->where('date', $date)
            ->where('status', 'available')
            ->orderBy('start_time')
            ->get();
    }

    /**
     * Get booked slots for a specific date
     */
    public function getBookedSlotsForDate($date)
    {
        return $this->timeSlots()
            ->where('date', $date)
            ->where('status', 'booked')
            ->orderBy('start_time')
            ->get();
    }
}
