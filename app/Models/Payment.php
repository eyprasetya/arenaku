<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_id',
        'user_id',
        'amount',
        'payment_method',
        'status',
        'transaction_id',
        'reference_code',
        'payment_details',
        'paid_at',
        'failure_reason',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'payment_details' => 'json',
        'paid_at' => 'datetime',
    ];

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Generate unique reference code
     */
    public static function generateReferenceCode(): string
    {
        return 'PAY-' . date('YmdHis') . '-' . rand(1000, 9999);
    }

    /**
     * Mark payment as completed
     */
    public function markAsCompleted(): void
    {
        $this->update([
            'status' => 'completed',
            'paid_at' => now(),
        ]);

        // Update booking status
        $this->booking->confirm();
    }

    /**
     * Mark payment as failed
     */
    public function markAsFailed($reason = null): void
    {
        $this->update([
            'status' => 'failed',
            'failure_reason' => $reason,
        ]);
    }

    /**
     * Process refund
     */
    public function refund(): void
    {
        $this->update(['status' => 'refunded']);
        $this->booking->cancel('User requested refund');
    }
}
