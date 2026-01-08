#!/bin/bash
set -e

echo "Starting Healthcare Management System..."

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
pip install -r requirements.txt

# Run database migrations
echo "Running database migrations..."
alembic upgrade head

# Start backend in background
echo "Starting backend server..."
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Install and build frontend
echo "Installing frontend dependencies..."
cd ../frontend
npm install

echo "Building frontend..."
npm run build

# Start serving frontend with a simple HTTP server
echo "Starting frontend server..."
npx http-server dist -p 3000 &
FRONTEND_PID=$!

# Start nginx (if available)
if command -v nginx &> /dev/null; then
    echo "Starting nginx..."
    nginx -g "daemon off;" &
    NGINX_PID=$!
fi

# Wait for processes
wait $BACKEND_PID $FRONTEND_PID
