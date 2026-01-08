@echo off
REM Healthcare Management System - Setup Script (Windows)
REM This script sets up the complete development environment

echo.
echo 🏥 Healthcare Management System - Setup Script
echo =============================================

REM Check for Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed
    exit /b 1
)

REM Check for Node.js
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed
    exit /b 1
)

REM Check for Docker
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not installed
    exit /b 1
)

echo ✅ All prerequisites found

REM Setup Backend
echo.
echo 📦 Setting up Backend...
cd backend

REM Create virtual environment
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing Python dependencies...
pip install -r requirements.txt

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo Creating .env file...
    copy .env.example .env
    echo ⚠️  Please update backend\.env with your configuration
)

echo ✅ Backend setup complete

REM Setup Frontend
echo.
echo 📦 Setting up Frontend...
cd ..\frontend

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing Node dependencies...
    call npm install
)

REM Create .env file if needed
if not exist ".env" (
    echo Creating .env file...
    (
        echo VITE_API_URL=http://localhost:8000
    ) > .env
)

echo ✅ Frontend setup complete

REM Back to root
cd ..

echo.
echo 🐳 Docker Images...
echo Building Docker images...
docker-compose build

echo.
echo ✅ Setup Complete!
echo.
echo 🚀 To start development:
echo   1. Update backend\.env with your MySQL credentials
echo   2. Run: docker-compose up -d
echo   3. Access:
echo      - API: http://localhost:8000
echo      - Frontend: http://localhost:3000
echo      - Swagger: http://localhost:8000/docs
echo      - Nginx: http://localhost
echo.
echo 📚 Documentation:
echo   - README.md - Project overview
echo   - DEPLOYMENT.md - Production deployment
echo   - KUBERNETES.md - Kubernetes setup
