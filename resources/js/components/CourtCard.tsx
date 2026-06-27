import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import React, { useState } from 'react';

interface Court {
    id: number;
    name: string;
    description: string;
    price_per_hour: number;
    location: string;
    image_url: string;
    max_players: number;
}

interface CourtCardProps {
    court: Court;
    onSelect: (court: Court) => void;
}

export const CourtCard: React.FC<CourtCardProps> = ({ court, onSelect }) => {
    return (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-transform hover:scale-105 hover:shadow-lg">
            {/* Image */}
            <div className="relative h-48 bg-gray-200">
                {court.image_url ? (
                    <img
                        src={court.image_url}
                        alt={court.name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600">
                        <span className="text-3xl text-white">🏸</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="mb-2 text-lg font-bold text-gray-900">{court.name}</h3>
                <p className="mb-3 text-sm text-gray-600">{court.description}</p>

                {/* Location */}
                <div className="mb-3 flex items-center gap-2 text-sm text-gray-700">
                    <span>📍</span>
                    <span>{court.location}</span>
                </div>

                {/* Info */}
                <div className="mb-4 flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                        Max {court.max_players} pemain
                    </span>
                </div>

                {/* Price and Button */}
                <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-blue-600">
                        Rp {Number(court.price_per_hour).toLocaleString('id-ID')}
                        <span className="text-xs text-gray-600">/jam</span>
                    </div>
                    <button
                        onClick={() => onSelect(court)}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                    >
                        Pesan
                    </button>
                </div>
            </div>
        </div>
    );
};
