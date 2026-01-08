#!/bin/bash

# Healthcare Management System - Setup Script
# This script sets up the complete development environment

set -e

echo "🏥 Healthcare Management System - Setup Script"
echo "=============================================="

# Check for required tools
echo "Checking prerequisites..."
command -v git >/dev/null 2>&1 || { echo "❌ Git is not installed"; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "❌ Docker is not installed"; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo "❌ Docker Compose is not installed"; exit 1; }

echo "✅ All prerequisites found"

# Setup Backend
echo -e "\n📦 Setting up Backend..."
cd backend

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate || . venv/Scripts/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please update backend/.env with your configuration"
fi

echo "✅ Backend setup complete"

# Setup Frontend
echo -e "\n📦 Setting up Frontend..."
cd ../frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing Node dependencies..."
    npm install
fi

# Create .env file if needed
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    echo "VITE_API_URL=http://localhost:8000" > .env
fi

echo "✅ Frontend setup complete"

# Back to root
cd ..

echo -e "\n🐳 Docker Images..."
echo "Building Docker images..."
docker-compose build

echo -e "\n✅ Setup Complete!"
echo ""
echo "🚀 To start development:"
echo "  1. Update backend/.env with your MySQL credentials"
echo "  2. Run: docker-compose up -d"
echo "  3. Access:"
echo "     - API: http://localhost:8000"
echo "     - Frontend: http://localhost:3000"
echo "     - Swagger: http://localhost:8000/docs"
echo "     - Nginx: http://localhost"
echo ""
echo "📚 Documentation:"
echo "  - README.md - Project overview"
echo "  - DEPLOYMENT.md - Production deployment"
echo "  - KUBERNETES.md - Kubernetes setup"
