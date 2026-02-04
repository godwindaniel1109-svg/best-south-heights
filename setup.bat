@echo off
REM Quick Start Guide for Pennysavia USA (Windows)

echo.
echo 🚀 Pennysavia USA - Quick Start (Windows)
echo =========================================
echo.

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found. Please install Node.js 16+ from https://nodejs.org
    exit /b 1
)

echo ✅ Node.js found:
node --version

echo.
echo 📦 Installing frontend dependencies...
call npm install

echo.
echo ⚙️  Backend setup...
echo.

REM Check backend folder
if not exist "backend" (
    echo ❌ backend/ folder not found
    exit /b 1
)

cd backend
echo 📦 Installing backend dependencies...
call npm install

echo.
echo 🔐 Checking backend .env file...
if not exist ".env" (
    if exist ".env.example" (
        copy .env.example .env >nul
        echo ✅ Created .env from .env.example
        echo ⚠️  Fill in your Telegram credentials in backend\.env:
        echo    - TELEGRAM_BOT_TOKEN
        echo    - TELEGRAM_ADMIN_CHAT_ID
    ) else (
        echo ❌ .env.example not found
        exit /b 1
    )
) else (
    echo ✅ .env file exists
)

cd ..

echo.
echo =========================================
echo ✅ Setup Complete!
echo.
echo 🎬 To start development:
echo.
echo    PowerShell/Terminal 1 - Frontend:
echo    npm run dev
echo.
echo    PowerShell/Terminal 2 - Backend:
echo    cd backend
echo    npm run dev
echo.
echo 📖 For deployment, see DEPLOY.md
echo.
pause
