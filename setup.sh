#!/bin/bash
# Quick Start Guide for Pennysavia USA

echo "🚀 Pennysavia USA - Quick Start"
echo "================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 16+ from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Frontend setup
echo "📦 Installing frontend dependencies..."
npm install

echo ""
echo "⚙️  Backend setup..."
echo ""

# Backend setup
if [ ! -d "backend" ]; then
    echo "❌ backend/ folder not found"
    exit 1
fi

cd backend
echo "📦 Installing backend dependencies..."
npm install

echo ""
echo "🔐 Checking backend .env file..."
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "✅ Created .env from .env.example"
        echo "⚠️  Fill in your Telegram credentials in backend/.env:"
        echo "   - TELEGRAM_BOT_TOKEN"
        echo "   - TELEGRAM_ADMIN_CHAT_ID"
    else
        echo "❌ .env.example not found"
        exit 1
    fi
else
    echo "✅ .env file exists"
fi

cd ..

echo ""
echo "================================"
echo "✅ Setup Complete!"
echo ""
echo "🎬 To start development:"
echo ""
echo "   Terminal 1 - Frontend:"
echo "   npm run dev"
echo ""
echo "   Terminal 2 - Backend:"
echo "   cd backend && npm run dev"
echo ""
echo "📖 For deployment, see DEPLOY.md"
echo ""
