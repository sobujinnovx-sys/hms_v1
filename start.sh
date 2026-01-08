#!/bin/bash
set -e

echo "Starting Healthcare Management System..."
echo "Current directory: $(pwd)"
echo "Python version: $(python --version)"
echo "Node version: $(node --version)"

# Install and build frontend
if [ -d "frontend" ]; then
  echo "Building frontend..."
  cd frontend
  npm install
  npm run build
  cd ..
fi

# Install backend dependencies
if [ -d "backend" ]; then
  echo "Installing backend dependencies..."
  cd backend
  pip install -r requirements.txt
  
  # Run database migrations
  echo "Running database migrations..."
  alembic upgrade head || true
  
  cd ..
fi

echo "Deployment setup complete"
