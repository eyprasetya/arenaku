import React, { useState, useEffect } from 'react';
import { format, addDays } from 'date-fns';
import { id } from 'date-fns/locale';

interface TimeSlot {
    id: number;
    start_time: string;
    end_time: string;
}

interface BookingFormProps {
    court: any;
    onBooking: (data: any) => void;
    isLoading?: boolean;
}

export const BookingForm: React.FC<BookingFormProps> = ({
    court,
    onBooking,
    isLoading = false,
}) => {
    const [selectedDate, setSelectedDate] = useState<string>(
        format(new Date(), 'yyyy-MM-dd')
    );
    const [selectedStartTime, setSelectedStartTime] = useState<string>('08:00');
    const [selectedEndTime, setSelectedEndTime] = useState<string>('09:00');
    const [playerNames, setPlayerNames] = useState<string>('');
    const [notes, setNotes] = useState<string>('');
    const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
    const [bookedSlots, setBookedSlots] = useState<TimeSlot[]>([]);

    // Fetch available slots
    useEffect(() => {
        const fetchSlots = async () => {
            try {
                const response = await fetch(
                    `/api/courts/${court.id}?date=${selectedDate}`
                );
                const data = await response.json();
                setAvailableSlots(data.available_slots);
                setBookedSlots(data.booked_slots);
            } catch (error) {
                console.error('Error fetching slots:', error);
            }
        };

        fetchSlots();
    }, [selectedDate, court.id]);

    // Generate time options (30 minute intervals)
    const generateTimeOptions = () => {
        const times = [];
        for (let hour = 6; hour <= 22; hour++) {
            for (let minute of ['00', '30']) {
                times.push(`${String(hour).padStart(2, '0')}:${minute}`);
            }
        }
        return times;
    };

    // Calculate price
    const calculatePrice = () => {
        const [startH, startM] = selectedStartTime.split(':').map(Number);
        const [endH, endM] = selectedEndTime.split(':').map(Number);
        const startMinutes = startH * 60 + startM;
        const endMinutes = endH * 60 + endM;
        const hours = (endMinutes - startMinutes) / 60;
        return hours * Number(court.price_per_hour);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const bookingData = {
            court_id: court.id,
            booking_date: selectedDate,
            start_time: selectedStartTime,
            end_time: selectedEndTime,
            player_names: playerNames,
            notes: notes,
        };

        onBooking(bookingData);
    };

    const timeOptions = generateTimeOptions();
    const price = calculatePrice();
    const nextDays = Array.from({ length: 30 }, (_, i) =>
        format(addDays(new Date(), i), 'yyyy-MM-dd')
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-6 rounded-lg bg-white p-6 shadow-md">
            <h2 className="text-2xl font-bold text-gray-900">
                Pesan {court.name}
            </h2>

            {/* Date Selection */}
            <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Tanggal
                </label>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                />
                <div className="mt-2 flex flex-wrap gap-2">
                    {nextDays.slice(0, 7).map((day) => (
                        <button
                            key={day}
                            type="button"
                            onClick={() => setSelectedDate(day)}
                            className={`rounded px-3 py-1 text-xs font-semibold transition ${
                                selectedDate === day
                                    ? 'bg-blue-600 text-white'
                                    : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            {format(new Date(day), 'dd MMM', { locale: id })}
                        </button>
                    ))}
                </div>
            </div>

            {/* Time Selection */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Jam Mulai
                    </label>
                    <select
                        value={selectedStartTime}
                        onChange={(e) => {
                            setSelectedStartTime(e.target.value);
                            if (e.target.value >= selectedEndTime) {
                                const nextHour = `${String(parseInt(e.target.value) + 1).padStart(2, '0')}:00`;
                                setSelectedEndTime(nextHour);
                            }
                        }}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                    >
                        {timeOptions.map((time) => (
                            <option key={time} value={time}>
                                {time}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Jam Selesai
                    </label>
                    <select
                        value={selectedEndTime}
                        onChange={(e) => setSelectedEndTime(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                    >
                        {timeOptions
                            .filter((time) => time > selectedStartTime)
                            .map((time) => (
                                <option key={time} value={time}>
                                    {time}
                                </option>
                            ))}
                    </select>
                </div>
            </div>

            {/* Booked Slots Info */}
            {bookedSlots.length > 0 && (
                <div className="rounded-lg bg-yellow-50 p-3">
                    <p className="text-sm font-semibold text-yellow-800">
                        ⚠️ Slot yang sudah dipesan:
                    </p>
                    <p className="text-xs text-yellow-700">
                        {bookedSlots
                            .map(
                                (slot) =>
                                    `${slot.start_time} - ${slot.end_time}`
                            )
                            .join(', ')}
                    </p>
                </div>
            )}

            {/* Player Names */}
            <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Nama Pemain Lainnya (Optional)
                </label>
                <input
                    type="text"
                    value={playerNames}
                    onChange={(e) => setPlayerNames(e.target.value)}
                    placeholder="Nama pemain yang akan bermain"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                />
            </div>

            {/* Notes */}
            <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Catatan (Optional)
                </label>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Catatan tambahan untuk booking"
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                />
            </div>

            {/* Price Summary */}
            <div className="rounded-lg bg-blue-50 p-4">
                <div className="flex items-center justify-between">
                    <span className="text-gray-700">
                        {selectedStartTime} - {selectedEndTime}
                    </span>
                    <span className="text-xl font-bold text-blue-600">
                        Rp {price.toLocaleString('id-ID')}
                    </span>
                </div>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-blue-600 py-3 font-bold text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"
            >
                {isLoading ? 'Memproses...' : 'Lanjutkan ke Pembayaran'}
            </button>
        </form>
    );
};
