<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'court_id' => 'required|integer|exists:courts,id',
            'booking_date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'player_names' => 'nullable|string|max:500',
            'notes' => 'nullable|string|max:1000',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'court_id.required' => 'Lapangan harus dipilih',
            'court_id.exists' => 'Lapangan tidak ditemukan',
            'booking_date.required' => 'Tanggal booking harus dipilih',
            'booking_date.date' => 'Format tanggal tidak valid',
            'booking_date.after_or_equal' => 'Tanggal booking harus hari ini atau yang akan datang',
            'start_time.required' => 'Jam mulai harus dipilih',
            'start_time.date_format' => 'Format jam tidak valid (gunakan HH:MM)',
            'end_time.required' => 'Jam selesai harus dipilih',
            'end_time.after' => 'Jam selesai harus setelah jam mulai',
        ];
    }
}
