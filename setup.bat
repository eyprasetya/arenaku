@echo off
REM Arena Badminton Setup Script for Windows
REM Script ini akan setup aplikasi dari scratch

setlocal enabledelayedexpansion

echo.
echo 🏸 Setup Arena Badminton Application
echo ====================================
echo.

REM 1. Copy .env
echo 📝 Setting up environment...
if not exist .env (
    copy .env.example .env
    echo ✅ .env file created
) else (
    echo ✅ .env file already exists
)

REM 2. Install PHP dependencies
echo.
echo 📦 Installing PHP dependencies...
call composer install
echo ✅ PHP dependencies installed

REM 3. Generate app key
echo.
echo 🔑 Generating app key...
call php artisan key:generate
echo ✅ App key generated

REM 4. Create database and migrate
echo.
echo 🗄️  Creating database and running migrations...
call php artisan migrate:fresh --seed
echo ✅ Database migrated and seeded

REM 5. Install Node dependencies
echo.
echo 📦 Installing Node dependencies...
call npm install
echo ✅ Node dependencies installed

REM 6. Build frontend
echo.
echo 🏗️  Building frontend assets...
call npm run build
echo ✅ Frontend assets built

REM 7. Cache config
echo.
echo 💾 Caching configuration...
call php artisan config:cache
call php artisan route:cache
echo ✅ Configuration cached

echo.
echo 🎉 Setup Complete!
echo.
echo To start development:
echo   Terminal 1: php artisan serve
echo   Terminal 2: npm run dev
echo   Terminal 3 (optional): php artisan inertia:start-ssr
echo.
echo Access the application at: http://localhost:8000
echo.
pause
