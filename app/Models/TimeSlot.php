<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TimeSlot extends Model
{
    use HasFactory;

    protected $fillable = [
        'court_id',
        'date',
        'start_time',
        'end_time',
        'status',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function court(): BelongsTo
    {
        return $this->belongsTo(Court::class);
    }

    /**
     * Check if slot is available
     */
    public function isAvailable(): bool
    {
        return $this->status === 'available';
    }

    /**
     * Mark slot as booked
     */
    public function markAsBooked(): void
    {
        $this->update(['status' => 'booked']);
    }

    /**
     * Mark slot as available
     */
    public function markAsAvailable(): void
    {
        $this->update(['status' => 'available']);
    }
}
