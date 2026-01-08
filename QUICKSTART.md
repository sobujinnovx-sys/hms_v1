# Quick Start Guide

## 5-Minute Setup

### 1. Clone & Enter Directory
```bash
cd FastApi-React
```

### 2. Run Setup Script

**On macOS/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

**On Windows:**
```cmd
setup.bat
```

### 3. Update Configuration
Edit `backend/.env`:
```
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/healthcare_db
JWT_SECRET_KEY=your-secret-key-here
```

### 4. Start Services
```bash
docker-compose up -d
```

### 5. Run Migrations
```bash
docker-compose exec backend alembic upgrade head
```

### 6. Access the Application

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |
| Nginx Proxy | http://localhost |

## Test Credentials

After first run, create test users through the API:

**Admin User:**
- Email: admin@example.com
- Password: admin123

**Doctor User:**
- Email: doctor@example.com
- Password: doctor123

**Receptionist:**
- Email: receptionist@example.com
- Password: reception123

## Common Commands

```bash
# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Enter backend container
docker-compose exec backend bash

# Run migrations
docker-compose exec backend alembic upgrade head
docker-compose exec backend alembic downgrade -1

# Run tests
docker-compose exec backend pytest tests/ -v

# Stop services
docker-compose down

# Remove volumes (careful!)
docker-compose down -v

# Rebuild images
docker-compose build --no-cache
```

## Troubleshooting

### Port Already in Use
```bash
# Find and kill process on port 8000
lsof -i :8000
kill -9 <PID>

# Or use different port in docker-compose.yml
```

### Database Connection Error
```bash
# Check MySQL is running
docker-compose logs mysql

# Reset database
docker-compose down -v
docker-compose up -d
docker-compose exec backend alembic upgrade head
```

### Frontend Not Loading
```bash
# Clear node cache
rm -rf frontend/node_modules
docker-compose exec frontend npm install
```

## Environment Files

### Backend (.env)
```ini
# Database
DATABASE_URL=mysql+pymysql://user:pass@host:port/db

# JWT
JWT_SECRET_KEY=your-secret-key
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# App
DEBUG=True
LOG_LEVEL=INFO
```

### Frontend (.env)
```ini
VITE_API_URL=http://localhost:8000
```

## Next Steps

1. **Read Full Documentation**: See [README.md](README.md)
2. **Deploy to Production**: See [DEPLOYMENT.md](DEPLOYMENT.md)
3. **Kubernetes Setup**: See [KUBERNETES.md](KUBERNETES.md)
4. **API Documentation**: Visit http://localhost:8000/docs
5. **Frontend Source**: Check `frontend/src` directory

## Support

- Check logs: `docker-compose logs`
- Review Docker containers: `docker ps`
- Verify network: `docker network ls`
- Check database: `docker exec healthcare_mysql mysql -u root -p`

## Quick Database Access

```bash
# Access MySQL CLI
docker-compose exec mysql mysql -u root -p healthcare_db

# Useful queries
SHOW TABLES;
SELECT * FROM users;
DESCRIBE patients;
```

Happy coding! 🚀
