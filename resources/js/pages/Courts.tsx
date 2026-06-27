import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { CourtCard } from '@/components/CourtCard';
import { BookingForm } from '@/components/BookingForm';

interface Court {
    id: number;
    name: string;
    description: string;
    price_per_hour: number;
    location: string;
    image_url: string;
    max_players: number;
}

export default function Courts() {
    const { courts } = usePage().props as { courts: Court[] };
    const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);

    const handleBooking = async (data: any) => {
        try {
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute('content') || '',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const result = await response.json();
                alert('Booking berhasil dibuat! Silakan lanjutkan ke pembayaran.');
                window.location.href = `/bookings/${result.booking.id}`;
            } else {
                const error = await response.json();
                alert(error.message || 'Error creating booking');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Terjadi kesalahan. Silakan coba lagi.');
        }
    };

    return (
        <>
            <Head title="Booking Lapangan" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-8 text-white">
                    <div className="mx-auto max-w-6xl px-4">
                        <h1 className="text-4xl font-bold">🏸 Arena Badminton</h1>
                        <p className="mt-2 text-blue-100">
                            Pesan lapangan badminton favorit Anda dengan mudah
                        </p>
                    </div>
                </div>

                <div className="mx-auto max-w-6xl px-4 py-8">
                    {/* Main Content */}
                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Courts List */}
                        <div className="lg:col-span-2">
                            <h2 className="mb-4 text-2xl font-bold text-gray-900">
                                Daftar Lapangan
                            </h2>
                            <div className="grid gap-4 md:grid-cols-2">
                                {courts.map((court) => (
                                    <CourtCard
                                        key={court.id}
                                        court={court}
                                        onSelect={(selected) => setSelectedCourt(selected)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Booking Form Sidebar */}
                        <div className="lg:col-span-1">
                            {selectedCourt ? (
                                <BookingForm
                                    court={selectedCourt}
                                    onBooking={handleBooking}
                                />
                            ) : (
                                <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center">
                                    <p className="text-lg font-semibold text-gray-600">
                                        Pilih lapangan untuk mulai booking
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
