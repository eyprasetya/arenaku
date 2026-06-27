import React from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

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

interface BookingCardProps {
    booking: Booking;
    onCancel?: (bookingId: number) => void;
    onPay?: (bookingId: number) => void;
}

const statusConfig = {
    pending: {
        label: 'Pending',
        color: 'bg-yellow-100 text-yellow-800',
        icon: '⏳',
    },
    confirmed: {
        label: 'Dikonfirmasi',
        color: 'bg-green-100 text-green-800',
        icon: '✅',
    },
    completed: {
        label: 'Selesai',
        color: 'bg-blue-100 text-blue-800',
        icon: '✓',
    },
    cancelled: {
        label: 'Dibatalkan',
        color: 'bg-red-100 text-red-800',
        icon: '✗',
    },
};

export const BookingCard: React.FC<BookingCardProps> = ({
    booking,
    onCancel,
    onPay,
}) => {
    const status = statusConfig[booking.status];
    const bookingDate = new Date(booking.booking_date);
    const bookingDateTime = `${format(bookingDate, 'dd MMMM yyyy', { locale: id })} ${booking.start_time}`;

    return (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
            <div className="p-4">
                {/* Header */}
                <div className="mb-4 flex items-start justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">
                            {booking.court.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                            📍 {booking.court.location}
                        </p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-sm font-semibold ${status.color}`}>
                        {status.icon} {status.label}
                    </span>
                </div>

                {/* Details */}
                <div className="mb-4 space-y-2 border-y border-gray-200 py-3">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Tanggal & Jam</span>
                        <span className="font-semibold text-gray-900">
                            {bookingDateTime}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Durasi</span>
                        <span className="font-semibold text-gray-900">
                            {booking.start_time} - {booking.end_time}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Total Harga</span>
                        <span className="text-lg font-bold text-blue-600">
                            Rp {Number(booking.total_price).toLocaleString('id-ID')}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    {booking.status === 'pending' && (
                        <>
                            <button
                                onClick={() => onPay?.(booking.id)}
                                className="flex-1 rounded-lg bg-blue-600 py-2 font-semibold text-white transition-colors hover:bg-blue-700"
                            >
                                Bayar Sekarang
                            </button>
                            <button
                                onClick={() => onCancel?.(booking.id)}
                                className="flex-1 rounded-lg border border-red-600 py-2 font-semibold text-red-600 transition-colors hover:bg-red-50"
                            >
                                Batalkan
                            </button>
                        </>
                    )}

                    {booking.status === 'confirmed' && (
                        <button
                            onClick={() => onCancel?.(booking.id)}
                            className="w-full rounded-lg border border-red-600 py-2 font-semibold text-red-600 transition-colors hover:bg-red-50"
                        >
                            Batalkan Booking
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
