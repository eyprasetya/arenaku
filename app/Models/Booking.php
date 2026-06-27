<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'court_id',
        'booking_date',
        'start_time',
        'end_time',
        'duration_hours',
        'total_price',
        'status',
        'player_names',
        'notes',
    ];

    protected $casts = [
        'booking_date' => 'date',
        'total_price' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function court(): BelongsTo
    {
        return $this->belongsTo(Court::class);
    }

    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class);
    }

    /**
     * Check if booking can be cancelled
     */
    public function canBeCancelled(): bool
    {
        return in_array($this->status, ['pending', 'confirmed']);
    }

    /**
     * Cancel booking
     */
    public function cancel($reason = null): void
    {
        $this->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
            'cancellation_reason' => $reason,
        ]);

        // Mark time slots as available again
        TimeSlot::where('court_id', $this->court_id)
            ->where('date', $this->booking_date)
            ->whereBetween('start_time', [$this->start_time, $this->end_time])
            ->where('status', 'booked')
            ->markAsAvailable();
    }

    /**
     * Confirm booking
     */
    public function confirm(): void
    {
        $this->update(['status' => 'confirmed']);
    }

    /**
     * Get formatted date time
     */
    public function getFormattedDateTime(): string
    {
        return $this->booking_date->format('d M Y') . ' ' . $this->start_time . ' - ' . $this->end_time;
    }
}
