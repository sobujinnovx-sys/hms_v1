#!/bin/bash
set -e

echo "=== Building Healthcare Management System ==="
echo "Current directory: $(pwd)"
echo "Python version: $(python --version)"
echo "Node version: $(node --version 2>/dev/null || echo 'Node not available')"

# Install backend dependencies
echo ""
echo "=== Installing backend dependencies ==="
cd backend
pip install -r requirements.txt

# Run database migrations (if database is available)
echo ""
echo "=== Running database migrations ==="
alembic upgrade head || echo "Migration skipped (database may not be available yet)"

cd ..

# Build frontend
if [ -d "frontend" ]; then
  echo ""
  echo "=== Building frontend ==="
  cd frontend
  npm install
  npm run build
  cd ..
fi

echo ""
echo "=== Build complete ==="
