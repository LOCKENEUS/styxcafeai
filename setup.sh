#!/bin/bash

# Styx Cafe Management System - Setup Script
# This script helps you set up and run the application

echo "=========================================="
echo "Styx Cafe Management System - Setup"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored messages
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check if MongoDB is running
echo "Checking MongoDB status..."
if pgrep -x "mongod" > /dev/null; then
    print_success "MongoDB is running"
else
    print_warning "MongoDB is not running. Starting MongoDB..."
    sudo systemctl start mongodb || mongod --fork --logpath /var/log/mongodb.log --dbpath /data/db
    sleep 2
    if pgrep -x "mongod" > /dev/null; then
        print_success "MongoDB started successfully"
    else
        print_error "Failed to start MongoDB"
        exit 1
    fi
fi

# Check if Node.js is installed
echo ""
echo "Checking Node.js installation..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js is installed (${NODE_VERSION})"
else
    print_error "Node.js is not installed. Please install Node.js v20 or higher"
    exit 1
fi

# Check if npm is installed
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_success "npm is installed (v${NPM_VERSION})"
else
    print_error "npm is not installed"
    exit 1
fi

# Backend setup
echo ""
echo "=========================================="
echo "Setting up Backend..."
echo "=========================================="
cd /app/backend

# Check if .env exists
if [ ! -f .env ]; then
    print_warning ".env file not found. Creating from .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        print_success "Created .env file. Please update it with your credentials"
    else
        print_error ".env.example not found"
    fi
else
    print_success "Backend .env file exists"
fi

# Install backend dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
    if [ $? -eq 0 ]; then
        print_success "Backend dependencies installed"
    else
        print_error "Failed to install backend dependencies"
        exit 1
    fi
else
    print_success "Backend dependencies already installed"
fi

# Frontend setup
echo ""
echo "=========================================="
echo "Setting up Frontend..."
echo "=========================================="
cd /app/frontend

# Check if .env exists
if [ ! -f .env ]; then
    print_warning ".env file not found. Creating from .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        print_success "Created .env file. Please update it with your credentials"
    else
        print_error ".env.example not found"
    fi
else
    print_success "Frontend .env file exists"
fi

# Install frontend dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
    if [ $? -eq 0 ]; then
        print_success "Frontend dependencies installed"
    else
        print_error "Failed to install frontend dependencies"
        exit 1
    fi
else
    print_success "Frontend dependencies already installed"
fi

# Check if supervisor is available
echo ""
echo "=========================================="
echo "Checking Supervisor..."
echo "=========================================="
if command -v supervisorctl &> /dev/null; then
    print_success "Supervisor is installed"
    
    # Check supervisor status
    echo ""
    echo "Current service status:"
    supervisorctl status
    
    echo ""
    read -p "Do you want to restart all services? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Restarting services..."
        supervisorctl restart backend
        supervisorctl restart frontend
        sleep 3
        echo ""
        echo "Service status:"
        supervisorctl status
    fi
else
    print_warning "Supervisor not found. You'll need to start services manually"
    echo ""
    echo "To start backend:"
    echo "  cd /app/backend && npm start"
    echo ""
    echo "To start frontend:"
    echo "  cd /app/frontend && npm run dev"
fi

# Final information
echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
print_success "Backend: http://localhost:8001"
print_success "Frontend: http://localhost:3000"
echo ""
echo "Default credentials:"
echo "  - Check your backend .env for SUPERADMIN_SECRET_KEY"
echo "  - Use the signup page to create a new account"
echo ""
echo "Documentation:"
echo "  - Main README: /app/README.md"
echo "  - Membership Guide: /app/MEMBERSHIP_GUIDE.md"
echo ""
echo "To check logs:"
echo "  Backend:  tail -f /var/log/supervisor/backend.out.log"
echo "  Frontend: tail -f /var/log/supervisor/frontend.out.log"
echo ""
echo "To restart services:"
echo "  supervisorctl restart backend"
echo "  supervisorctl restart frontend"
echo "  supervisorctl restart all"
echo ""
print_success "Happy coding! 🚀"
echo ""
