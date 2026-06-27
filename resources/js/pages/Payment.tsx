import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';

interface Payment {
    id: number;
    booking_id: number;
    amount: number;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    reference_code: string;
    payment_method?: string;
}

interface BookingDetail {
    id: number;
    court: {
        name: string;
        location: string;
    };
    booking_date: string;
    start_time: string;
    end_time: string;
    total_price: number;
    status: string;
}

export default function Payment() {
    const { booking } = usePage().props as { booking: BookingDetail };
    const [selectedMethod, setSelectedMethod] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState(false);

    const paymentMethods = [
        {
            id: 'credit_card',
            name: '💳 Kartu Kredit',
            description: 'Visa, Mastercard, atau Amex',
        },
        {
            id: 'debit_card',
            name: '🏧 Kartu Debit',
            description: 'Semua bank',
        },
        {
            id: 'bank_transfer',
            name: '🏦 Transfer Bank',
            description: 'Transfer antar bank',
        },
        {
            id: 'e_wallet',
            name: '📱 E-Wallet',
            description: 'GCash, Grab Pay, dll',
        },
    ];

    const handlePayment = async () => {
        if (!selectedMethod) {
            alert('Pilih metode pembayaran');
            return;
        }

        setIsProcessing(true);

        try {
            // Create payment
            const paymentResponse = await fetch('/api/payments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    booking_id: booking.id,
                    payment_method: selectedMethod,
                }),
            });

            if (paymentResponse.ok) {
                const paymentData = await paymentResponse.json();
                alert('Pembayaran berhasil diproses!');
                window.location.href = '/bookings';
            } else {
                alert('Gagal memproses pembayaran');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Terjadi kesalahan');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <>
            <Head title="Pembayaran" />

            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-8 text-white">
                    <div className="mx-auto max-w-2xl px-4">
                        <h1 className="text-3xl font-bold">Pembayaran</h1>
                        <p className="mt-2 text-blue-100">Selesaikan pembayaran untuk booking Anda</p>
                    </div>
                </div>

                <div className="mx-auto max-w-2xl px-4 py-8">
                    <div className="grid gap-8 md:grid-cols-2">
                        {/* Booking Summary */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
                            <h2 className="mb-4 text-xl font-bold text-gray-900">
                                Ringkasan Booking
                            </h2>

                            <div className="space-y-3 border-b border-gray-200 pb-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Lapangan</span>
                                    <span className="font-semibold text-gray-900">
                                        {booking.court.name}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Lokasi</span>
                                    <span className="font-semibold text-gray-900">
                                        {booking.court.location}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tanggal</span>
                                    <span className="font-semibold text-gray-900">
                                        {new Date(booking.booking_date).toLocaleDateString(
                                            'id-ID',
                                            {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            }
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Jam</span>
                                    <span className="font-semibold text-gray-900">
                                        {booking.start_time} - {booking.end_time}
                                    </span>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="mt-4 flex justify-between">
                                <span className="text-lg font-bold text-gray-900">Total</span>
                                <span className="text-2xl font-bold text-blue-600">
                                    Rp{' '}
                                    {Number(booking.total_price).toLocaleString('id-ID')}
                                </span>
                            </div>
                        </div>

                        {/* Payment Methods */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
                            <h2 className="mb-4 text-xl font-bold text-gray-900">
                                Pilih Metode Pembayaran
                            </h2>

                            <div className="space-y-3">
                                {paymentMethods.map((method) => (
                                    <label
                                        key={method.id}
                                        className={`flex cursor-pointer items-start rounded-lg border-2 p-4 transition ${
                                            selectedMethod === method.id
                                                ? 'border-blue-600 bg-blue-50'
                                                : 'border-gray-200 hover:bg-gray-50'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value={method.id}
                                            checked={selectedMethod === method.id}
                                            onChange={(e) =>
                                                setSelectedMethod(e.target.value)
                                            }
                                            className="mt-1"
                                        />
                                        <div className="ml-3">
                                            <p className="font-semibold text-gray-900">
                                                {method.name}
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                {method.description}
                                            </p>
                                        </div>
                                    </label>
                                ))}
                            </div>

                            {/* Payment Button */}
                            <button
                                onClick={handlePayment}
                                disabled={isProcessing || !selectedMethod}
                                className="mt-6 w-full rounded-lg bg-blue-600 py-3 font-bold text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"
                            >
                                {isProcessing
                                    ? 'Memproses...'
                                    : 'Lanjutkan Pembayaran'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
