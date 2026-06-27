import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { BookingCard } from '@/components/BookingCard';

interface Booking {
    id: number;
    court: {
        id: number;
        name: string;
        location: string;
    };
    booking_date: string;
    start_time: string;
    end_time: string;
    total_price: number;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    created_at: string;
}

export default function MyBookings() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await fetch('/api/bookings');
                if (response.ok) {
                    const data = await response.json();
                    setBookings(data.data || []);
                } else {
                    setError('Gagal memuat booking');
                }
            } catch (err) {
                setError('Terjadi kesalahan');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const handleCancel = async (bookingId: number) => {
        if (!confirm('Apakah Anda yakin ingin membatalkan booking ini?')) return;

        try {
            const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute('content') || '',
                },
            });

            if (response.ok) {
                setBookings((prev) =>
                    prev.map((b) =>
                        b.id === bookingId ? { ...b, status: 'cancelled' } : b
                    )
                );
                alert('Booking berhasil dibatalkan');
            }
        } catch (err) {
            alert('Gagal membatalkan booking');
        }
    };

    const handlePay = (bookingId: number) => {
        window.location.href = `/bookings/${bookingId}/payment`;
    };

    return (
        <>
            <Head title="Booking Saya" />

            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-8 text-white">
                    <div className="mx-auto max-w-4xl px-4">
                        <h1 className="text-3xl font-bold">Booking Saya</h1>
                        <p className="mt-2 text-blue-100">
                            Kelola semua booking lapangan badminton Anda
                        </p>
                    </div>
                </div>

                <div className="mx-auto max-w-4xl px-4 py-8">
                    {loading ? (
                        <div className="text-center">
                            <p className="text-gray-600">Memuat booking...</p>
                        </div>
                    ) : error ? (
                        <div className="rounded-lg bg-red-50 p-4 text-red-800">
                            {error}
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-12 text-center">
                            <p className="mb-4 text-lg font-semibold text-gray-600">
                                Belum ada booking
                            </p>
                            <a
                                href="/courts"
                                className="inline-block rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700"
                            >
                                Pesan Lapangan
                            </a>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {bookings.map((booking) => (
                                <BookingCard
                                    key={booking.id}
                                    booking={booking}
                                    onCancel={handleCancel}
                                    onPay={handlePay}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
