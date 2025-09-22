# 🚀 Masskan Murima Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying the Masskan Murima application, which consists of:
- **Frontend**: React + TypeScript + Vite
- **Backend**: Django REST API with Django authentication
- **Database**: Django ORM with SQLite/PostgreSQL

## Prerequisites

- Node.js 18+
- Python 3.11+
- Docker & Docker Compose (optional)
- Git

## Quick Start

### 1. Clone and Setup

```bash
git clone <repository-url>
cd masskan-murima-nexus-main

# Run the automated deployment script
./deploy.sh
```

### 2. Manual Setup

#### Backend Setup
```bash
cd django-backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run development server
python manage.py runserver
```

#### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Deployment Options

### Option 1: Vercel + Railway (Recommended)

#### Frontend Deployment (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel:
   ```
   VITE_DJANGO_API_URL=https://your-railway-app.railway.app/api
   VITE_APP_NAME=Masskan Murima
   VITE_APP_URL=https://your-vercel-app.vercel.app
   ```
3. Deploy automatically

#### Backend Deployment (Railway)
1. Connect your GitHub repository to Railway
2. Set the root directory to `django-backend`
3. Set environment variables:
   ```
   SECRET_KEY=your-production-secret-key
   DEBUG=False
   ALLOWED_HOSTS=your-railway-domain.railway.app
   DATABASE_URL=postgresql://...
   CORS_ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
   ```
4. Deploy automatically

### Option 2: Docker Deployment

#### Using Docker Compose
```bash
# Build and run all services
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

#### Manual Docker Deployment
```bash
# Build backend
cd django-backend
docker build -t masskan-backend .

# Build frontend
cd ..
docker build -f Dockerfile.frontend -t masskan-frontend .

# Run containers
docker run -p 8000:8000 masskan-backend
docker run -p 3000:3000 masskan-frontend
```

### Option 3: Traditional Hosting

#### Backend (Heroku, DigitalOcean, etc.)
```bash
# Install gunicorn
pip install gunicorn

# Run with gunicorn
gunicorn myproject.wsgi:application --bind 0.0.0.0:$PORT
```

#### Frontend (Netlify, Vercel, etc.)
```bash
# Build for production
npm run build

# Deploy the 'dist' folder
```

## Environment Variables

### Frontend (.env)
```bash
VITE_DJANGO_API_URL=http://localhost:8000/api
VITE_APP_NAME=Masskan Murima
VITE_APP_URL=https://your-frontend-domain.com
```

### Backend (django-backend/.env)
```bash
SECRET_KEY=your-production-secret-key
DEBUG=False
ALLOWED_HOSTS=your-domain.com,api.your-domain.com
DATABASE_URL=sqlite:///db.sqlite3
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
```

## Database Configuration

### Django Database
The Django backend can use either:
- SQLite (development) - Default configuration
- PostgreSQL (production) - Recommended for production

For PostgreSQL, update `DATABASE_URL` in the environment variables:
```bash
DATABASE_URL=postgresql://user:password@host:5432/database_name
```

## Security Checklist

### Pre-Deployment
- [ ] Change Django SECRET_KEY
- [ ] Set DEBUG=False in production
- [ ] Configure ALLOWED_HOSTS
- [ ] Set up CORS properly
- [ ] Use HTTPS in production
- [ ] Configure proper database credentials

### Authentication
- [ ] Django JWT tokens are properly configured
- [ ] User registration and login working
- [ ] Admin access is properly restricted
- [ ] Password policies are enforced

### API Security
- [ ] Rate limiting is implemented
- [ ] Input validation is in place
- [ ] SQL injection protection
- [ ] XSS protection enabled

## Monitoring & Maintenance

### Health Checks
- Backend health check: `GET /api/health/`
- Frontend health check: Application loads successfully

### Logs
- Django logs: Available in Railway/Heroku dashboard
- Frontend logs: Available in Vercel dashboard
- Database logs: Available in PostgreSQL/Railway dashboard

### Backups
- Database backups: Configure in Railway/PostgreSQL provider
- File backups: Configure in your hosting provider

## Troubleshooting

### Common Issues

#### Backend Connection Issues
```bash
# Check if backend is running
curl http://localhost:8000/api/health/

# Check Django logs
python manage.py check
```

#### Frontend Build Issues
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

#### Authentication Issues
```bash
# Check Django JWT configuration
# Verify tokens are being sent correctly
# Check CORS settings
# Test login endpoint: POST /api/auth/login/
```

#### Database Issues
```bash
# Run Django migrations
python manage.py migrate

# Check database connectivity
python manage.py dbshell
```

## Performance Optimization

### Frontend
- Enable gzip compression
- Use CDN for static assets
- Implement lazy loading
- Optimize images

### Backend
- Use database indexing
- Implement caching (Redis)
- Use connection pooling
- Optimize queries

## Scaling

### Horizontal Scaling
- Use load balancers
- Implement session storage (Redis)
- Database read replicas

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Implement caching layers

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the logs
3. Test API endpoints with Postman/curl
4. Contact the development team

## API Endpoints

### Authentication
- `POST /api/auth/login/` - User login
- `POST /api/auth/register/` - User registration
- `GET /api/auth/me/` - Get current user info

### Dashboard
- `GET /api/dashboard/` - User dashboard data
- `GET /api/admin/dashboard/` - Admin dashboard data

### Properties
- `GET /api/properties/` - List properties
- `POST /api/properties/` - Create property (authenticated)
- `GET /api/properties/{id}/` - Get property details

### Health Check
- `GET /api/health/` - Application health status

## Version History

- v1.0.0: Initial deployment
- Features: Properties, Bookings, Marketplace, Authentication
- Backend: Django REST API with JWT authentication
- Frontend: React + TypeScript
- Database: Django ORM with SQLite/PostgreSQL
