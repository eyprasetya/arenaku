# 🏸 Arena Badminton - Aplikasi Booking Online

Aplikasi booking online lapangan badminton dengan fitur booking per jam, pembayaran, dan UI/UX modern yang responsive.

## 🚀 Fitur Utama

- ✅ **Listing Lapangan** - Tampilkan semua lapangan dengan harga per jam
- ✅ **Booking Jadwal Per Jam** - Pilih tanggal dan jam dengan slot-slot yang tersedia
- ✅ **Manajemen Booking** - Lihat, batalkan, atau ubah booking
- ✅ **Sistem Pembayaran** - Multiple payment methods (Credit Card, Debit Card, Bank Transfer, E-Wallet)
- ✅ **Riwayat Pembayaran** - Track semua transaksi pembayaran
- ✅ **Responsive Design** - Bisa diakses dari desktop, tablet, dan mobile
- ✅ **Modern UI/UX** - Built with React, Tailwind CSS, dan Inertia.js

## 📋 Tech Stack

- **Backend**: Laravel 13.17
- **Frontend**: React + TypeScript
- **UI Framework**: Tailwind CSS
- **Database**: PostgreSQL (sesuai konfigurasi)
- **Build Tool**: Vite
- **API Communication**: Inertia.js

## 📦 Struktur Project

```
arenaku/
├── app/
│   ├── Http/Controllers/
│   │   ├── CourtController.php          # API lapangan
│   │   ├── BookingController.php        # API booking
│   │   └── PaymentController.php        # API pembayaran
│   ├── Models/
│   │   ├── Court.php                    # Model lapangan
│   │   ├── TimeSlot.php                 # Model slot waktu
│   │   ├── Booking.php                  # Model booking
│   │   └── Payment.php                  # Model pembayaran
│   └── Policies/
│       ├── BookingPolicy.php
│       └── PaymentPolicy.php
├── database/
│   ├── migrations/
│   │   ├── *_create_courts_table.php
│   │   ├── *_create_time_slots_table.php
│   │   ├── *_create_bookings_table.php
│   │   └── *_create_payments_table.php
│   └── seeders/
│       ├── CourtsTableSeeder.php        # Seed data lapangan
│       └── DatabaseSeeder.php
├── resources/js/
│   ├── pages/
│   │   ├── Courts.tsx                   # Halaman listing & booking
│   │   ├── MyBookings.tsx               # Halaman booking saya
│   │   └── Payment.tsx                  # Halaman pembayaran
│   └── components/
│       ├── CourtCard.tsx                # Komponen kartu lapangan
│       ├── BookingForm.tsx              # Form booking
│       └── BookingCard.tsx              # Kartu booking
├── routes/
│   ├── web.php                          # Routes web
│   └── api.php                          # Routes API
└── config/
    └── inertia.php
```

## ⚙️ Setup & Installation

### 1. Prerequisites
- PHP 8.3+
- Node.js 18+
- PostgreSQL (atau database lain sesuai `.env`)
- Composer

### 2. Instalasi & Migrasi Database

```bash
# Clone atau masuk ke project directory
cd d:\app\php\arenaku

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate app key
php artisan key:generate

# Setup database (edit .env terlebih dahulu untuk DB credentials)
php artisan migrate --seed
```

**Database Configuration (.env)**:
```env
DB_CONNECTION=pgsql
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=arenaku
DB_USERNAME=postgres
DB_PASSWORD=@C4k_7ud
```

### 3. Install Node Dependencies

```bash
npm install
# atau
pnpm install
```

### 4. Menjalankan Development Server

**Terminal 1 - Laravel Backend:**
```bash
php artisan serve
# Server akan jalan di http://localhost:8000
```

**Terminal 2 - Vite Dev Server:**
```bash
npm run dev
# atau
pnpm dev
```

**Terminal 3 - SSR Server (optional):**
```bash
php artisan inertia:start-ssr
```

## 📱 API Documentation

### Base URL
```
http://localhost:8000/api
```

### Public Routes

**GET** `/courts` - Daftar semua lapangan aktif
```json
[
  {
    "id": 1,
    "name": "Lapangan A",
    "price_per_hour": 150000,
    "location": "Lantai 1",
    "image_url": null,
    "max_players": 4
  }
]
```

**GET** `/courts/{id}?date=2025-06-27` - Detail lapangan + slot tersedia
```json
{
  "court": { ... },
  "date": "2025-06-27",
  "available_slots": [
    { "id": 1, "start_time": "08:00", "end_time": "09:00" }
  ],
  "booked_slots": [
    { "start_time": "09:00", "end_time": "10:00" }
  ]
}
```

**GET** `/courts/{id}/available-dates` - Daftar tanggal dengan slot tersedia

### Protected Routes (Require Auth)

**POST** `/bookings` - Buat booking baru
```json
{
  "court_id": 1,
  "booking_date": "2025-06-27",
  "start_time": "08:00",
  "end_time": "10:00",
  "player_names": "Rudi, Andi",
  "notes": "Keterangan tambahan"
}
```

**GET** `/bookings` - Daftar booking user

**POST** `/bookings/{id}/cancel` - Batalkan booking

**POST** `/payments` - Buat pembayaran
```json
{
  "booking_id": 1,
  "payment_method": "credit_card"
}
```

**GET** `/user/payments` - Daftar pembayaran user

**POST** `/payments/{id}/refund` - Request refund

## 🎨 UI/UX Pages

### 1. Home / Courts Listing (`/courts`)
- Tampilkan semua lapangan dalam grid card
- Filter berdasarkan harga, lokasi
- Sidebar form untuk membuat booking
- Responsive design untuk mobile

### 2. My Bookings (`/bookings`)
- List semua booking user
- Status badge (Pending, Confirmed, Completed, Cancelled)
- Action buttons (Bayar, Batalkan)
- Pagination untuk banyak data

### 3. Payment (`/bookings/{id}/payment`)
- Ringkasan detail booking
- Multiple payment method options
- Konfirmasi pembayaran
- Success/Error handling

## 🔐 Authorization

- User hanya bisa melihat booking mereka sendiri
- User hanya bisa cancel booking milik mereka
- Payment hanya bisa diakses oleh user yang membuat booking

## 📊 Database Schema

### Courts Table
- id, name, description, price_per_hour, location, status, image_url, max_players

### TimeSlots Table
- id, court_id, date, start_time, end_time, status (available/booked/maintenance)

### Bookings Table
- id, user_id, court_id, booking_date, start_time, end_time, duration_hours, total_price, status, player_names, notes, cancelled_at

### Payments Table
- id, booking_id, user_id, amount, payment_method, status, transaction_id, reference_code, paid_at

## 🧪 Testing

Jalankan test dengan:
```bash
php artisan test

# Atau spesifik test
php artisan test tests/Feature/BookingTest.php
```

## 🚢 Deployment

### Build untuk Production

```bash
# Build frontend assets
npm run build

# Seed production database (jika perlu)
php artisan migrate --seed --force

# Cache configuration
php artisan config:cache
php artisan route:cache
```

### Checklist Pre-Deployment
- [ ] Update `.env` untuk production
- [ ] Set APP_ENV=production
- [ ] Set APP_DEBUG=false
- [ ] Configure payment gateway (jika diperlukan)
- [ ] Setup email notifications
- [ ] Configure backup strategy
- [ ] Setup logging & monitoring

## 📝 Catatan Pengembangan

### Fitur yang bisa ditambahkan di masa depan:
1. **Promo/Discount System** - Kode promo dan diskon untuk booking tertentu
2. **Rating & Review** - User bisa rate lapangan dan memberi review
3. **Admin Dashboard** - Panel untuk manage lapangan, melihat laporan
4. **Email Notifications** - Notifikasi booking confirmation, payment receipt
5. **SMS Reminder** - Ingatkan user 1 jam sebelum booking
6. **Recurring Booking** - Booking reguler mingguan/bulanan
7. **Team Booking** - Fitur booking bersama dengan teman
8. **Court Analytics** - Dashboard laporan pergunaan lapangan

### Integrasi Payment Gateway:
- Midtrans
- Stripe
- Xendit
- PayPal

## 📞 Support & Contact

Untuk pertanyaan atau issue, hubungi tim development.

---

**Last Updated**: 27 Juni 2025
**Version**: 1.0.0
