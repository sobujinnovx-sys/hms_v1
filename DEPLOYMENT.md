# Production Deployment Guide

This guide covers deploying the Healthcare Management System to production environments.

## Table of Contents

1. [AWS EC2 Deployment](#aws-ec2-deployment)
2. [DigitalOcean Droplet Deployment](#digitalocean-droplet-deployment)
3. [GCP VM Deployment](#gcp-vm-deployment)
4. [Database Setup](#database-setup)
5. [SSL Configuration](#ssl-configuration)
6. [Monitoring & Logging](#monitoring--logging)
7. [Backup & Recovery](#backup--recovery)

## Prerequisites

- Domain name pointing to your server
- SSH access to the server
- Docker & Docker Compose installed
- Git installed on the server

## AWS EC2 Deployment

### 1. Launch EC2 Instance

```bash
# Instance specifications (recommended)
# - AMI: Ubuntu Server 22.04 LTS
# - Instance Type: t3.medium or larger
# - Storage: 30GB+ EBS
# - Security Group: Allow HTTP (80), HTTPS (443), SSH (22)
```

### 2. Connect to Instance

```bash
ssh -i your-key.pem ubuntu@<public-ip>
```

### 3. Install Dependencies

```bash
# Update system
sudo apt update
sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
newgrp docker

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Git
sudo apt install -y git

# Install Nginx
sudo apt install -y nginx

# Install Certbot (for SSL)
sudo apt install -y certbot python3-certbot-nginx
```

### 4. Clone Repository

```bash
cd /home/ubuntu
git clone <your-repo-url>
cd FastApi-React

# Create .env file
cp backend/.env.example backend/.env
nano backend/.env  # Edit with production values
```

### 5. Update Docker Compose for Production

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: healthcare_mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
      MYSQL_DATABASE: ${DB_NAME}
      MYSQL_USER: ${DB_USER}
      MYSQL_PASSWORD: ${DB_PASSWORD}
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./mysql-backup:/backup
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: healthcare_backend
    restart: always
    environment:
      DATABASE_URL: mysql+pymysql://${DB_USER}:${DB_PASSWORD}@mysql:3306/${DB_NAME}
      JWT_SECRET_KEY: ${JWT_SECRET_KEY}
      DEBUG: "False"
    ports:
      - "8000:8000"
    depends_on:
      mysql:
        condition: service_healthy
    volumes:
      - ./backend/logs:/app/logs

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: healthcare_frontend
    restart: always
    ports:
      - "3000:3000"
    environment:
      VITE_API_URL: https://${DOMAIN}/api

volumes:
  mysql_data:
```

### 6. Configure Nginx

Create `/etc/nginx/sites-available/healthcare`:

```nginx
upstream backend {
    server localhost:8000;
}

upstream frontend {
    server localhost:3000;
}

server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    client_max_body_size 20M;

    # API routes
    location /api/ {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 300s;
    }

    # Swagger docs
    location /docs {
        proxy_pass http://backend/docs;
        proxy_set_header Host $host;
    }

    location /openapi.json {
        proxy_pass http://backend/openapi.json;
    }

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/healthcare /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 7. SSL Certificate Setup

```bash
sudo certbot certonly --nginx -d your-domain.com -d www.your-domain.com
```

### 8. Start Services

```bash
docker-compose -f docker-compose.prod.yml up -d

# Run migrations
docker-compose -f docker-compose.prod.yml exec backend alembic upgrade head

# Check status
docker-compose -f docker-compose.prod.yml ps
```

## DigitalOcean Droplet Deployment

### 1. Create Droplet

```bash
# Specifications
# - Image: Ubuntu 22.04 LTS
# - Size: Basic (4GB RAM, 2 vCPU)
# - Region: Choose nearest to users
```

### 2. Initial Setup

```bash
# SSH into droplet
ssh root@<droplet-ip>

# Add non-root user
adduser appuser
usermod -aG sudo appuser
```

### 3. Continue with AWS EC2 Steps 3-8

The rest of the setup is identical to AWS EC2.

### 4. Enable Firewall

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## GCP VM Deployment

### 1. Create VM Instance

```bash
# Using gcloud CLI
gcloud compute instances create healthcare-server \
  --image-family=ubuntu-2204-lts \
  --image-project=ubuntu-os-cloud \
  --machine-type=e2-medium \
  --zone=us-central1-a
```

### 2. Setup Firewall Rules

```bash
gcloud compute firewall-rules create allow-http \
  --allow=tcp:80

gcloud compute firewall-rules create allow-https \
  --allow=tcp:443

gcloud compute firewall-rules create allow-ssh \
  --allow=tcp:22
```

### 3. Continue with AWS EC2 Steps 2-8

## Database Setup

### 1. Create Backup Directory

```bash
mkdir -p /home/appuser/backups
chmod 700 /home/appuser/backups
```

### 2. Backup Script

Create `/home/appuser/backup-db.sh`:

```bash
#!/bin/bash

BACKUP_DIR="/home/appuser/backups"
DB_NAME="healthcare_db"
DB_USER="healthcare_user"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/healthcare_db_$TIMESTAMP.sql"

# Backup database
docker-compose exec -T mysql mysqldump -u$DB_USER -p$DB_PASSWORD $DB_NAME > $BACKUP_FILE

# Compress
gzip $BACKUP_FILE

# Keep only last 7 days
find $BACKUP_DIR -name "healthcare_db_*.sql.gz" -mtime +7 -delete

echo "Backup completed: $BACKUP_FILE.gz"
```

### 3. Schedule Backups

```bash
chmod +x /home/appuser/backup-db.sh

# Add to crontab (daily at 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * /home/appuser/backup-db.sh") | crontab -
```

## SSL Configuration

### 1. Auto-renewal

```bash
sudo certbot renew --dry-run
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### 2. Security Headers

Add to Nginx config:

```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header X-XSS-Protection "1; mode=block" always;
```

## Monitoring & Logging

### 1. Docker Logs

```bash
# View logs
docker-compose -f docker-compose.prod.yml logs -f backend

# Save logs
docker-compose -f docker-compose.prod.yml logs backend > backend.log
```

### 2. Setup Prometheus & Grafana (Optional)

Add to `docker-compose.prod.yml`:

```yaml
prometheus:
  image: prom/prometheus
  volumes:
    - ./prometheus.yml:/etc/prometheus/prometheus.yml
  ports:
    - "9090:9090"

grafana:
  image: grafana/grafana
  ports:
    - "3001:3000"
  environment:
    - GF_SECURITY_ADMIN_PASSWORD=admin
```

### 3. Application Monitoring

Monitor key metrics:

```bash
# Disk usage
df -h

# Memory usage
free -h

# CPU usage
top

# Docker container stats
docker stats
```

## Backup & Recovery

### 1. Restore Database

```bash
# Decompress backup
gunzip healthcare_db_20240108_020000.sql.gz

# Restore
cat healthcare_db_20240108_020000.sql | \
  docker-compose exec -T mysql mysql -u$DB_USER -p$DB_PASSWORD $DB_NAME
```

### 2. Full System Backup

```bash
# Backup everything
tar -czf healthcare_backup_$(date +%Y%m%d).tar.gz /home/appuser/FastApi-React

# Copy to remote storage
scp healthcare_backup_*.tar.gz backup-server:/backups/
```

## Troubleshooting

### 1. Check Service Status

```bash
docker-compose -f docker-compose.prod.yml ps
systemctl status nginx
systemctl status docker
```

### 2. View Logs

```bash
# Backend logs
docker-compose -f docker-compose.prod.yml logs backend --tail 100

# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# System logs
sudo journalctl -u nginx -n 50
```

### 3. Common Issues

**Port already in use:**

```bash
sudo lsof -i :8000
sudo kill -9 <PID>
```

**Database connection failed:**

```bash
docker-compose -f docker-compose.prod.yml exec mysql mysql -u$DB_USER -p$DB_PASSWORD -e "SELECT 1"
```

**SSL certificate expired:**

```bash
sudo certbot renew --force-renewal
sudo systemctl restart nginx
```

## Performance Optimization

### 1. Database Optimization

```sql
-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_patients_email ON patients(email);
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_medical_records_patient_id ON medical_records(patient_id);
```

### 2. Caching

Add Redis caching to `docker-compose.prod.yml`:

```yaml
redis:
  image: redis:7-alpine
  container_name: healthcare_redis
  ports:
    - "6379:6379"
```

### 3. Load Balancing

For high traffic, use Nginx upstream balancing or cloud load balancers.

## Security Checklist

- [ ] Change default passwords
- [ ] Enable firewall
- [ ] Configure SSL/TLS
- [ ] Set up regular backups
- [ ] Enable application logging
- [ ] Restrict SSH access (key-based only)
- [ ] Keep system packages updated
- [ ] Use strong JWT secret key
- [ ] Enable CORS restrictions
- [ ] Setup monitoring and alerts

## Support

For deployment issues, check:
1. Docker logs
2. Nginx logs
3. Application error logs
4. System resource usage
