# Render Deployment Guide

This guide provides step-by-step instructions for deploying the Healthcare Management System to Render.

## Prerequisites

- GitHub account with the repository
- Render account (free tier available at https://render.com)
- MySQL database (you can use Render's MySQL service or a managed service like AWS RDS)

## Deployment Steps

### 1. Connect GitHub Repository to Render

1. Go to https://render.com and sign in/up
2. Click "New +" and select "Web Service"
3. Click "Connect a repository" and authorize GitHub
4. Select your repository: `sobujinnovx-sys/hms_v1`
5. Select branch: `main`

### 2. Configure the Web Service

**Name:** `healthcare-backend`

**Environment:** Python

**Build Command:**
```bash
cd backend && pip install -r requirements.txt
```

**Start Command:**
```bash
cd backend && gunicorn app.main:app --workers 3 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT --timeout 30
```

**Plan:** Free (or paid if needed)

### 3. Set Environment Variables

In the Render dashboard for your service, add these environment variables:

```
DATABASE_URL=mysql+pymysql://user:password@host:3306/healthcare_db
JWT_SECRET_KEY=your-very-secure-random-key-here
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24
DEBUG=False
LOG_LEVEL=INFO
VITE_API_URL=https://<your-backend-domain>.onrender.com
```

**Important:** 
- Replace `<your-backend-domain>` with your actual Render service domain
- Generate a strong, random JWT_SECRET_KEY
- Set `DEBUG=False` in production
- For MySQL database, you can use:
  - AWS RDS (recommended for production)
  - Render's MySQL service
  - Other managed MySQL providers (PlanetScale, Railway, etc.)

### 4. Deploy Frontend (Static Site)

To deploy the frontend as a static site:

1. Click "New +" and select "Static Site"
2. Connect your GitHub repository
3. **Root Directory:** `frontend`
4. **Build Command:** `npm install && npm run build`
5. **Publish Directory:** `dist`

**Environment Variables:**
```
VITE_API_URL=https://<your-backend-domain>.onrender.com
NODE_ENV=production
```

### 5. Connect to Database

The application uses MySQL. Options:

**Option A: AWS RDS (Recommended for Production)**
1. Create an RDS MySQL instance
2. Create a database named `healthcare_db`
3. Update `DATABASE_URL` environment variable with your RDS endpoint

**Option B: Render MySQL (if available)**
1. Create a Render MySQL database
2. Use the connection string provided by Render

**Option C: Other Managed Services**
- PlanetScale (MySQL-compatible)
- Railway
- DigitalOcean Managed Databases

### 6. Run Database Migrations

The migrations will run automatically on each deployment via the `release` command in the Procfile:
```
release: cd backend && alembic upgrade head || true
```

To manually run migrations after first deployment:
1. Connect to your service via Render shell
2. Run: `cd backend && alembic upgrade head`

### 7. Verify Deployment

1. Check the "Logs" section in Render dashboard
2. Visit your service URL to verify it's running
3. Test API endpoints: `https://<your-backend-domain>.onrender.com/api/v1/docs`

## Troubleshooting

### Build Fails: "Could not open requirements.txt"
- Ensure you have `requirements.txt` in the root directory (it should reference `backend/requirements.txt`)
- Verify the build command points to the correct directory

### Service Won't Start
- Check logs in Render dashboard
- Verify environment variables are set correctly
- Ensure database connection string is valid

### Database Connection Errors
- Verify `DATABASE_URL` format: `mysql+pymysql://user:password@host:port/database`
- Check MySQL server is accessible from Render
- Ensure firewall rules allow Render's IP addresses

### Frontend Not Loading
- Verify `VITE_API_URL` points to correct backend domain
- Check that frontend build directory is set to `dist`
- Clear browser cache and try again

### Slow Initial Load
- Free tier services may have cold starts
- Consider upgrading to paid plan for better performance
- Monitor response times in application logs

## Monitoring & Maintenance

### View Logs
1. Go to service dashboard
2. Click "Logs" tab
3. Filter by date/time if needed

### Monitor Performance
- Use Render's built-in metrics
- Monitor database query performance
- Check application error logs regularly

### Update Secrets
1. Go to environment variables
2. Update `JWT_SECRET_KEY` periodically
3. Never commit secrets to repository

### Database Backups
- If using AWS RDS: Enable automated backups
- If using other services: Follow their backup procedures
- Test restores periodically

## Domain Configuration

To use a custom domain:

1. Go to your Render service
2. Navigate to "Settings"
3. Add custom domain
4. Update DNS records with the CNAME provided by Render

## Scaling

As your application grows:

1. Upgrade from Free plan to paid plans
2. Enable auto-scaling if available
3. Consider read replicas for database
4. Implement caching with Redis
5. Use CDN for frontend assets

## Security Best Practices

1. ✅ Set `DEBUG=False` in production
2. ✅ Use strong, random JWT_SECRET_KEY
3. ✅ Enable HTTPS (automatic with Render)
4. ✅ Restrict database access by IP
5. ✅ Regularly update dependencies
6. ✅ Use environment variables for secrets (never commit them)
7. ✅ Enable database encryption at rest
8. ✅ Regular security audits and updates

## Support & Resources

- Render Documentation: https://render.com/docs
- FastAPI Documentation: https://fastapi.tiangolo.com
- Alembic Documentation: https://alembic.sqlalchemy.org
- MySQL Documentation: https://dev.mysql.com/doc
