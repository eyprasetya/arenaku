# 🏸 Arena Badminton - Online Badminton Court Booking System

[![GitHub Repository](https://img.shields.io/badge/GitHub-arenaku-blue)](https://github.com/eyprasetya/arenaku)
[![Laravel](https://img.shields.io/badge/Laravel-13.17-red)](https://laravel.com)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-blue)](https://www.postgresql.org)

Aplikasi booking online lapangan badminton dengan fitur lengkap, UI/UX modern, dan responsif untuk semua perangkat.

## 🚀 Fitur Utama

- 🏸 **Listing Lapangan** - Tampilkan semua lapangan dengan informasi lengkap
- 📅 **Booking Per Jam** - Pilih tanggal dan jam dengan slot-slot yang tersedia
- 💳 **Multiple Payment Methods** - Dukung berbagai metode pembayaran
- 📱 **Fully Responsive** - Akses dari desktop, tablet, dan mobile
- 🎨 **Modern UI/UX** - Built dengan React, TypeScript, dan Tailwind CSS
- 📊 **Manajemen Booking** - Lihat, batalkan, atau ubah booking dengan mudah
- 🔐 **Secure & Authorized** - User hanya bisa akses booking mereka sendiri
- ⚡ **Real-time Updates** - Slot availability update secara real-time

## 📋 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Laravel 13.17, PHP 8.3 |
| **Frontend** | React 19, TypeScript, Inertia.js |
| **Database** | PostgreSQL |
| **Styling** | Tailwind CSS 4 |
| **Build Tool** | Vite |
| **UI Components** | Radix UI |

## 📦 Project Structure

```
arenaku/
├── app/
│   ├── Http/Controllers/
│   │   ├── CourtController.php          # API endpoints lapangan
│   │   ├── BookingController.php        # API endpoints booking
│   │   └── PaymentController.php        # API endpoints pembayaran
│   ├── Http/Requests/
│   │   ├── StoreBookingRequest.php      # Validasi booking
│   │   └── StorePaymentRequest.php      # Validasi pembayaran
│   ├── Models/
│   │   ├── Court.php                    # Model lapangan
│   │   ├── TimeSlot.php                 # Model slot waktu
│   │   ├── Booking.php                  # Model booking
│   │   ├── Payment.php                  # Model pembayaran
│   │   └── User.php                     # Model user (updated)
│   └── Policies/
│       ├── BookingPolicy.php            # Authorization policies
│       └── PaymentPolicy.php
│
├── database/
│   ├── migrations/
│   │   ├── *_create_courts_table.php
│   │   ├── *_create_time_slots_table.php
│   │   ├── *_create_bookings_table.php
│   │   └── *_create_payments_table.php
│   └── seeders/
│       └── CourtsTableSeeder.php
│
├── resources/js/
│   ├── pages/
│   │   ├── Courts.tsx                   # Court listing & booking
│   │   ├── MyBookings.tsx               # User bookings management
│   │   └── Payment.tsx                  # Payment processing
│   └── components/
│       ├── CourtCard.tsx                # Court display card
│       ├── BookingForm.tsx              # Booking creation form
│       └── BookingCard.tsx              # Booking display card
│
├── routes/
│   ├── web.php                          # Web routes (Inertia)
│   └── api.php                          # API routes
│
└── config/
    └── inertia.php
```

## ⚙️ Installation & Setup

### Prerequisites
- PHP 8.3 or higher
- Node.js 18+ & npm/pnpm
- PostgreSQL
- Composer

### Automatic Setup (Recommended)

**For Windows:**
```bash
setup.bat
```

**For Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

### Manual Setup

1. **Clone & Install Dependencies**
```bash
cd arenaku
composer install
npm install
```

2. **Environment Setup**
```bash
cp .env.example .env
php artisan key:generate
```

3. **Database Configuration** (Edit .env)
```env
DB_CONNECTION=pgsql
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=arenaku
DB_USERNAME=postgres
DB_PASSWORD=@C4k_7ud
```

4. **Run Migrations & Seeds**
```bash
php artisan migrate:fresh --seed
```

5. **Build Assets**
```bash
npm run build
```

### Development Server

Open 3 terminal tabs:

**Terminal 1 - Laravel Backend:**
```bash
php artisan serve
```

**Terminal 2 - Vite Dev Server:**
```bash
npm run dev
```

**Terminal 3 - SSR Server (Optional):**
```bash
php artisan inertia:start-ssr
```

Access: **http://localhost:8000**

## 📡 API Documentation

### Base URL
```
http://localhost:8000/api
```

### Public Endpoints

#### List All Courts
```http
GET /api/courts
```
Response:
```json
[
  {
    "id": 1,
    "name": "Lapangan A",
    "description": "Lapangan standar dengan pencahayaan modern",
    "price_per_hour": 150000,
    "location": "Lantai 1",
    "image_url": null,
    "max_players": 4
  }
]
```

#### Get Court Details with Slots
```http
GET /api/courts/{id}?date=2025-06-27
```
Response:
```json
{
  "court": {...},
  "date": "2025-06-27",
  "available_slots": [
    {"id": 1, "start_time": "08:00", "end_time": "09:00"},
    {"id": 2, "start_time": "10:00", "end_time": "11:00"}
  ],
  "booked_slots": [
    {"start_time": "09:00", "end_time": "10:00"}
  ]
}
```

#### Get Available Dates
```http
GET /api/courts/{id}/available-dates
```

### Protected Endpoints (Require Authentication)

#### List User's Bookings
```http
GET /api/bookings
Authorization: Bearer {token}
```

#### Create Booking
```http
POST /api/bookings
Authorization: Bearer {token}
Content-Type: application/json

{
  "court_id": 1,
  "booking_date": "2025-06-27",
  "start_time": "08:00",
  "end_time": "10:00",
  "player_names": "Rudi, Andi",
  "notes": "Keterangan tambahan"
}
```

#### Cancel Booking
```http
POST /api/bookings/{id}/cancel
Authorization: Bearer {token}

{
  "reason": "Alasan pembatalan"
}
```

#### Create Payment
```http
POST /api/payments
Authorization: Bearer {token}
Content-Type: application/json

{
  "booking_id": 1,
  "payment_method": "credit_card"
}
```

#### Get User's Payments
```http
GET /api/user/payments
Authorization: Bearer {token}
```

#### Request Refund
```http
POST /api/payments/{id}/refund
Authorization: Bearer {token}
```

## 🎨 User Interface Pages

### 1. **Courts** (`/courts`)
- Display semua lapangan dalam grid layout
- Info lengkap: nama, lokasi, harga, deskripsi
- Sidebar form untuk booking
- Responsive untuk mobile
- Filter tanggal & jam

### 2. **My Bookings** (`/bookings`)
- List semua booking user
- Status badges (Pending, Confirmed, Completed, Cancelled)
- Action buttons (Bayar, Batalkan)
- Pagination untuk data banyak
- Detail booking lengkap

### 3. **Payment** (`/bookings/{id}/payment`)
- Ringkasan booking detail
- Multiple payment method options
- Konfirmasi pembayaran
- Success/Error handling
- Reference code tracking

## 🔐 Security & Authorization

- ✅ User authentication via Fortify
- ✅ User dapat hanya melihat booking mereka sendiri
- ✅ Policies untuk kontrolAuthorization
- ✅ CSRF protection
- ✅ Input validation
- ✅ SQL injection prevention (Eloquent ORM)

## 📊 Database Schema

### Courts Table
```sql
- id (PK)
- name: string
- description: text
- price_per_hour: decimal(10,2)
- location: string
- status: enum(active, inactive)
- image_url: string
- max_players: integer
- timestamps
```

### TimeSlots Table
```sql
- id (PK)
- court_id (FK)
- date: date
- start_time: time
- end_time: time
- status: enum(available, booked, maintenance)
- timestamps
- unique(court_id, date, start_time)
```

### Bookings Table
```sql
- id (PK)
- user_id (FK)
- court_id (FK)
- booking_date: date
- start_time: time
- end_time: time
- duration_hours: integer
- total_price: decimal(10,2)
- status: enum(pending, confirmed, completed, cancelled)
- player_names: string
- notes: text
- cancelled_at: timestamp
- cancellation_reason: string
- timestamps
```

### Payments Table
```sql
- id (PK)
- booking_id (FK)
- user_id (FK)
- amount: decimal(10,2)
- payment_method: enum(...)
- status: enum(pending, completed, failed, refunded)
- transaction_id: string (unique)
- reference_code: string (unique)
- payment_details: json
- paid_at: timestamp
- failure_reason: text
- timestamps
```

## 🧪 Testing

```bash
# Run all tests
php artisan test

# Run specific test file
php artisan test tests/Feature/BookingTest.php

# Run with coverage
php artisan test --coverage
```

## 🚀 Deployment

### Build for Production
```bash
# Build frontend
npm run build

# Cache configuration
php artisan config:cache
php artisan route:cache

# Optimize autoloader
composer install --optimize-autoloader --no-dev
```

### Pre-Deployment Checklist
- [ ] Update `.env` untuk production
- [ ] Set `APP_ENV=production` dan `APP_DEBUG=false`
- [ ] Setup database backups
- [ ] Configure email notifications
- [ ] Setup payment gateway integration
- [ ] Configure logging & monitoring
- [ ] Setup HTTPS/SSL
- [ ] Configure CDN untuk static assets
- [ ] Setup cron jobs jika diperlukan

## 🔄 Workflow

### Booking Flow
1. User melihat daftar lapangan
2. Pilih lapangan dan pilih tanggal
3. Pilih jam mulai dan jam selesai
4. Harga otomatis terhitung
5. Klik "Lanjutkan ke Pembayaran"
6. Pilih metode pembayaran
7. Proses pembayaran
8. Booking confirmed

### Cancellation Flow
1. User buka "Booking Saya"
2. Pilih booking dengan status "Pending" atau "Confirmed"
3. Klik "Batalkan Booking"
4. Konfirmasi pembatalan
5. Slot waktu kembali tersedia
6. Booking status menjadi "Cancelled"

## 🎯 Future Enhancements

- [ ] Admin dashboard untuk manage lapangan
- [ ] Email notifications untuk booking confirmation
- [ ] SMS reminders sebelum jam booking
- [ ] Rating & review system
- [ ] Promo/discount codes
- [ ] Recurring bookings (mingguan/bulanan)
- [ ] Team booking dengan sharing
- [ ] Analytics & reporting dashboard
- [ ] Integration dengan payment gateway (Midtrans, Stripe, Xendit)
- [ ] WhatsApp integration untuk notifikasi
- [ ] Member loyalty program
- [ ] Multiple court support (multi-lokasi)

## 📝 Development Notes

### Coding Standards
- Follow PSR-12 untuk PHP code
- Use TypeScript strict mode
- ESLint + Prettier untuk JavaScript
- Use database transactions untuk operasi penting

### Git Workflow
```bash
# Feature branch
git checkout -b feature/feature-name

# Commit dengan message yang jelas
git commit -m "feat: deskripsi fitur"

# Push dan buat Pull Request
git push origin feature/feature-name
```

## 📞 Support & Contact

- **Email**: ey.prasetya@gmail.com
- **GitHub**: [eyprasetya/arenaku](https://github.com/eyprasetya/arenaku)

## 📄 License

This project is open source and available under the MIT License.

---

**Version**: 1.0.0  
**Last Updated**: 27 June 2025  
**Status**: Active Development ✅

### Contributors
- Ey Prasetya (eyprasetya)

---

## Getting Help

Jika Anda mengalami masalah atau error:

1. Cek dokumentasi di `BADMINTON_APP_SETUP.md`
2. Buka issue di GitHub
3. Hubungi tim development

Terima kasih telah menggunakan Arena Badminton! 🏸
