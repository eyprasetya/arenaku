#!/bin/bash

# Arena Badminton Setup Script
# Script ini akan setup aplikasi dari scratch

set -e

echo "🏸 Setup Arena Badminton Application"
echo "===================================="

# 1. Copy .env
echo "📝 Setting up environment..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

# 2. Install PHP dependencies
echo "📦 Installing PHP dependencies..."
composer install
echo "✅ PHP dependencies installed"

# 3. Generate app key
echo "🔑 Generating app key..."
php artisan key:generate
echo "✅ App key generated"

# 4. Create database & migrate
echo "🗄️  Creating database & running migrations..."
php artisan migrate:fresh --seed
echo "✅ Database migrated and seeded"

# 5. Install Node dependencies
echo "📦 Installing Node dependencies..."
npm install
echo "✅ Node dependencies installed"

# 6. Build frontend
echo "🏗️  Building frontend assets..."
npm run build
echo "✅ Frontend assets built"

# 7. Cache config
echo "💾 Caching configuration..."
php artisan config:cache
php artisan route:cache
echo "✅ Configuration cached"

echo ""
echo "🎉 Setup Complete!"
echo ""
echo "To start development:"
echo "  Terminal 1: php artisan serve"
echo "  Terminal 2: npm run dev"
echo "  Terminal 3 (optional): php artisan inertia:start-ssr"
echo ""
echo "Access the application at: http://localhost:8000"
