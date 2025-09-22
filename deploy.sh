#!/bin/bash

# Masskan Murima Deployment Script
# This script handles deployment of both frontend and backend

set -e

echo "🚀 Starting Masskan Murima Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."

    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi

    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi

    if ! command -v python &> /dev/null; then
        print_error "Python is not installed. Please install Python first."
        exit 1
    fi

    if ! command -v pip &> /dev/null; then
        print_error "pip is not installed. Please install pip first."
        exit 1
    fi

    print_success "All dependencies are installed."
}

# Deploy backend
deploy_backend() {
    print_status "Deploying Django backend..."

    cd django-backend

    # Create virtual environment if it doesn't exist
    if [ ! -d "venv" ]; then
        print_status "Creating Python virtual environment..."
        python -m venv venv
    fi

    # Activate virtual environment
    source venv/bin/activate

    # Install dependencies
    print_status "Installing Python dependencies..."
    pip install -r requirements.txt

    # Run migrations
    print_status "Running database migrations..."
    python manage.py migrate

    # Collect static files
    print_status "Collecting static files..."
    python manage.py collectstatic --noinput

    # Create superuser if it doesn't exist
    print_status "Checking for Django superuser..."
    echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(username='admin').exists() or User.objects.create_superuser('admin', 'admin@masskan-murima.com', 'admin123')" | python manage.py shell

    print_success "Django backend deployed successfully!"

    cd ..
}

# Deploy frontend
deploy_frontend() {
    print_status "Deploying React frontend..."

    # Install dependencies
    print_status "Installing Node.js dependencies..."
    npm install

    # Build the application
    print_status "Building the application..."
    npm run build

    print_success "React frontend built successfully!"
}

# Update environment variables for production
update_env_vars() {
    print_status "Updating environment variables for production..."

    # Update .env file for production
    cat > .env << EOL
# Production Environment Variables
VITE_SUPABASE_URL=https://bjpezohjzktqpvfhdutb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqcGV6b2hqemt0cXB2ZmhkdXRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwNzk0MDMsImV4cCI6MjA3MDY1NTQwM30.L52z5uCuDrLJmnq8m4BVJkGl4PZGUupQbVqx-lWkwS8

# Production Django API URL
VITE_DJANGO_API_URL=https://api.masskan-murima.com/api

# App Configuration
VITE_APP_NAME=Masskan Murima
VITE_APP_URL=https://masskan-murima.vercel.app

# Production
VITE_NODE_ENV=production
EOL

    print_success "Environment variables updated for production."
}

# Run pre-deployment checks
run_checks() {
    print_status "Running pre-deployment checks..."

    # Check if .env files exist
    if [ ! -f ".env" ]; then
        print_warning ".env file not found. Creating one..."
        update_env_vars
    fi

    if [ ! -f "django-backend/.env" ]; then
        print_warning "Django .env file not found. Please create it with production settings."
    fi

    # Check if build directory exists
    if [ -d "dist" ]; then
        print_status "Removing old build directory..."
        rm -rf dist
    fi

    print_success "Pre-deployment checks completed."
}

# Main deployment function
main() {
    print_status "Starting Masskan Murima deployment process..."

    check_dependencies
    run_checks
    deploy_backend
    deploy_frontend
    update_env_vars

    print_success "🎉 Deployment completed successfully!"
    print_status ""
    print_status "Next steps:"
    print_status "1. Deploy the 'dist' folder to your web server (Vercel, Netlify, etc.)"
    print_status "2. Deploy the Django backend to Railway, Render, or similar"
    print_status "3. Update DNS settings if needed"
    print_status "4. Test the deployed application"
    print_status ""
    print_status "Django Admin: http://your-backend-url/admin/"
    print_status "Default admin credentials: admin / admin123"
}

# Run main function
main "$@"
