<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePaymentRequest extends FormRequest
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
            'booking_id' => 'required|integer|exists:bookings,id',
            'payment_method' => 'required|in:credit_card,debit_card,bank_transfer,e_wallet',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'booking_id.required' => 'Booking ID harus disertakan',
            'booking_id.exists' => 'Booking tidak ditemukan',
            'payment_method.required' => 'Metode pembayaran harus dipilih',
            'payment_method.in' => 'Metode pembayaran tidak valid',
        ];
    }
}
