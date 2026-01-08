# Build Instructions

This document provides instructions for building and running the Healthcare Management System in different environments.

## Table of Contents

1. [Local Development](#local-development)
2. [Docker Deployment](#docker-deployment)
3. [Production Build](#production-build)
4. [Render Deployment](#render-deployment)
5. [Troubleshooting](#troubleshooting)

## Local Development

### Prerequisites

- Python 3.10+
- Node.js 16+
- MySQL 8.0+
- Git

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file with configuration
cat > .env << EOF
DATABASE_URL=mysql+pymysql://root:@localhost:3306/healthcare_db
JWT_SECRET_KEY=your-secret-key-change-in-development
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24
DEBUG=True
LOG_LEVEL=INFO
EOF

# Run database migrations
alembic upgrade head

# Start development server
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend API will be available at: `http://localhost:8000`
API documentation: `http://localhost:8000/api/v1/docs`

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file for development
cat > .env.local << EOF
VITE_API_URL=http://localhost:8000
EOF

# Start development server
npm run dev
```

The frontend will be available at: `http://localhost:5173`

## Docker Deployment

### Prerequisites

- Docker 20.10+
- Docker Compose 2.0+

### Build and Run

```bash
# Build all services
docker-compose build

# Run all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop services
docker-compose down
```

Services will be available at:
- Backend API: `http://localhost:8000`
- Frontend: `http://localhost:3000`
- Nginx (if configured): `http://localhost:80`

### Environment Variables for Docker

Create a `.env` file in the root directory:

```bash
# Database
DATABASE_URL=mysql+pymysql://root:password@mysql:3306/healthcare_db

# JWT
JWT_SECRET_KEY=your-super-secret-key
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# Server
DEBUG=False
LOG_LEVEL=INFO

# Frontend
VITE_API_URL=http://backend:8000
```

## Production Build

### Backend

```bash
# Install production dependencies
pip install -r backend/requirements.txt

# Install gunicorn (already in requirements.txt)
# Run database migrations
cd backend && alembic upgrade head

# Start with gunicorn
gunicorn app.main:app \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000 \
  --timeout 30 \
  --access-logfile - \
  --error-logfile -
```

### Frontend

```bash
# Build production bundle
cd frontend
npm install --production
npm run build

# The dist/ directory contains the production-ready files
# Deploy dist/ to a static file server or CDN

# For local testing with a simple server:
npx http-server dist -p 3000
```

### Environment Variables (Production)

Set these environment variables on your production server:

```bash
export DATABASE_URL="mysql+pymysql://user:password@db-host:3306/healthcare_db"
export JWT_SECRET_KEY="very-long-random-secure-key"
export JWT_ALGORITHM="HS256"
export JWT_EXPIRATION_HOURS="24"
export DEBUG="False"
export LOG_LEVEL="INFO"
export WORKERS="4"
export PORT="8000"
```

## Render Deployment

See [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) for detailed Render-specific instructions.

### Quick Start for Render

1. Push your code to GitHub
2. Connect repository to Render
3. Set build command: `cd backend && pip install -r requirements.txt`
4. Set start command: `cd backend && gunicorn app.main:app --workers 3 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT`
5. Add environment variables
6. Deploy

The deployment configuration is in:
- `Procfile` - Process definitions
- `render.yaml` - Render-specific configuration (optional)
- `requirements.txt` - Root-level file that references backend/requirements.txt

## Database Setup

### Local MySQL

```bash
# Create database
mysql -u root -p
CREATE DATABASE healthcare_db;
USE healthcare_db;

# Run migrations (from backend directory)
alembic upgrade head

# Verify tables
SHOW TABLES;
```

### Production MySQL (AWS RDS, PlanetScale, etc.)

```bash
# Update DATABASE_URL with connection string
export DATABASE_URL="mysql+pymysql://user:password@host:port/database"

# Run migrations
alembic upgrade head
```

## Build Artifacts

After building, you'll have:

### Backend
- `backend/app/` - Application code
- `backend/alembic/` - Database migration scripts
- Virtual environment or Docker image with dependencies

### Frontend
- `frontend/dist/` - Production-ready static files
  - `dist/index.html` - Main HTML file
  - `dist/assets/` - CSS and JS bundles
  - `dist/assets/*.css` - Minified stylesheets
  - `dist/assets/*.js` - Bundled JavaScript

## Troubleshooting

### Port Already in Use
```bash
# Find process using port
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows

# Kill the process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### Database Connection Error
- Verify `DATABASE_URL` format
- Check MySQL server is running
- Verify credentials
- Test connection: `mysql -u user -p -h host database`

### Python/Node Version Issues
- Use Python 3.10+ for backend
- Use Node 16+ for frontend
- Check versions: `python --version` and `node --version`

### Dependencies Install Failed
```bash
# Clear cache and reinstall
pip cache purge
pip install -r requirements.txt

# For Node
npm cache clean --force
npm install
```

### Port Already in Use
- Change port: `--port 9000` for uvicorn or Render's `$PORT` variable
- Or kill existing process using the port

### Build Hangs
- Check internet connection
- Try installing with `--no-cache-dir` for pip
- Increase timeout for large installs

## Performance Optimization

### Backend
- Use connection pooling
- Enable caching for frequently accessed data
- Optimize database queries with proper indexing
- Use async endpoints where possible

### Frontend
- Enable gzip compression
- Use lazy loading for routes
- Minify and bundle assets
- Consider CDN for static assets

### Database
- Create proper indexes
- Regular maintenance and optimization
- Monitor slow queries
- Consider read replicas for scaling

## Next Steps

1. Review [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) for platform-specific deployment
2. Check [DEPLOYMENT.md](./DEPLOYMENT.md) for other deployment options
3. Review [README.md](./README.md) for project overview
4. Check [QUICKSTART.md](./QUICKSTART.md) for quick setup guide
