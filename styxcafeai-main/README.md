# Styx Cafe Management System

A comprehensive full-stack cafe management system with advanced features for bookings, inventory, membership management, and more.

## 🚀 Tech Stack

### Frontend
- **React 18** with Vite
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Bootstrap** & **React-Bootstrap** for UI
- **Chart.js** for analytics
- **Google Maps API** for location features
- **Razorpay** for payment integration
- **AOS** for animations

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Multer** for file uploads
- **Nodemailer** for email notifications
- **Razorpay** & **Stripe** for payments

## 📁 Project Structure

```
/app
├── frontend/          # React + Vite frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   │   ├── Admin/   # Admin panel
│   │   │   ├── SuperAdmin/  # Super admin panel
│   │   │   └── User/    # User-facing pages
│   │   ├── routes/      # Route configuration
│   │   ├── store/       # Redux store & slices
│   │   └── App.jsx      # Main app component
│   ├── public/          # Static assets
│   └── package.json
│
└── backend/           # Node.js + Express backend
    ├── component/
    │   ├── admin/       # Admin APIs
    │   ├── superadmin/  # Super admin APIs
    │   │   ├── membership/  # Membership management
    │   │   ├── cafe/        # Cafe management
    │   │   ├── games/       # Games management
    │   │   └── location/    # Location management
    │   ├── user/        # User APIs
    │   └── auth/        # Authentication
    ├── db/              # Database connection
    ├── middleware/      # Express middleware
    ├── utils/           # Helper functions
    └── index.js         # Server entry point
```

## 🎯 Features

### Super Admin Panel
- **Cafe Management**: Create, edit, and manage multiple cafe locations
- **Location Management**: Manage cafe locations with Google Maps integration
- **Membership Plans**: Create and manage membership packages
  - Weekly, Monthly, Quarterly, and Yearly plans
  - Custom pricing and benefits
  - Member tracking and analytics
- **Games Management**: Configure available games and tables
- **Subscription Management**: Handle cafe subscriptions
- **Dashboard**: Overview analytics and reports

### Admin Panel
- **Dashboard**: Real-time analytics and insights
- **Booking Management**:
  - Slot creation and management
  - Booking checkout and payment processing
  - Booking history and reports
- **Games Management**:
  - Snooker tables
  - Turf/cricket grounds
  - Pickleball tables
  - Cafe seating
- **Customer Management**:
  - Customer profiles
  - Booking history
  - Credit transactions
- **User Management**: Staff member accounts
- **Inventory Management**:
  - Vendor management
  - Item and item group management
  - Purchase orders and bills
  - Sales orders and invoices
  - Stock tracking
  - Payment tracking
- **Reports**:
  - Booking reports
  - Commission reports
  - Sales analytics

### User Features
- User registration and login
- View available games and tables
- Book slots online
- Payment integration (Razorpay)
- Booking history

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v20+)
- MongoDB (v7+)
- npm or yarn

### Backend Setup

1. **Install dependencies:**
```bash
cd /app/backend
npm install
```

2. **Configure environment variables:**
Create `.env` file:
```env
PORT=8001
DB_URL=mongodb://localhost:27017/styxcafe
SECRET_KEY=your_secret_key_here
JWT_EXPIRY=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
SMTP_EMAIL=your_email@example.com
SMTP_PASSWORD=your_password
RAZOR_LIVE_KEY=your_razorpay_key
RAZOR_LIVE_SECRET=your_razorpay_secret
RAZOR_LIVE_TOKEN=your_razorpay_token
SUPERADMIN_SECRET_KEY=superadmin_secret_key
```

3. **Start MongoDB:**
```bash
mongod --dbpath /data/db
```

4. **Start the backend:**
```bash
npm start
# Backend runs on http://localhost:8001
```

### Frontend Setup

1. **Install dependencies:**
```bash
cd /app/frontend
npm install
```

2. **Configure environment variables:**
Create `.env` file:
```env
VITE_GOOGLE_API_KEY=your_google_maps_api_key
VITE_API_URL=http://localhost:8001
VITE_RAZOR_LIVE_KEY=your_razorpay_key
VITE_RAZOR_LIVE_SECRET=your_razorpay_secret
VITE_RAZOR_LIVE_TOKEN=your_razorpay_token
```

3. **Start the frontend:**
```bash
npm run dev
# Frontend runs on http://localhost:3000
```

### Using Supervisor (Production)

Both services are configured to run with supervisor:

```bash
# Start all services
sudo supervisorctl start all

# Check status
sudo supervisorctl status

# Restart services
sudo supervisorctl restart backend
sudo supervisorctl restart frontend

# View logs
tail -f /var/log/supervisor/backend.out.log
tail -f /var/log/supervisor/frontend.out.log
```

## 🌐 Access URLs:
- **Admin Frontend**: http://localhost:3000 (Super Admin & Admin Panel)
- **User Frontend**: http://localhost:3001 (Customer-facing application)
- **Backend API**: http://localhost:8001
- **Database**: mongodb://localhost:27017/styxcafe

## 🎮 Membership Management

The membership management system allows super admins to create and manage different membership tiers for customers.

### Features:
- ✅ Create membership plans with custom validity periods
- ✅ Set pricing and usage limits
- ✅ Multiple benefit details per plan
- ✅ Assign memberships to specific cafes
- ✅ Track active and expired memberships
- ✅ Edit and delete membership plans

### API Endpoints:

```
POST   /superadmin/membership          # Create membership
GET    /superadmin/membership/:id      # Get membership by ID
PATCH  /superadmin/membership/:id      # Update membership
DELETE /superadmin/membership/:id      # Delete membership
GET    /superadmin/membership/list/:id # Get all memberships for a cafe
```

### Membership Schema:
```javascript
{
  cafe: ObjectId,           // Reference to cafe
  name: String,             // Membership name (e.g., "Gold", "Platinum")
  details: [String],        // Array of benefits
  validity: String,         // "Weekly", "Monthly", "Quarterly", "Yearly"
  limit: Number,            // Usage limit
  price: Number,            // Membership price
  is_active: Boolean,       // Active status
  is_deleted: Boolean       // Soft delete flag
}
```

## 🔐 Authentication

The system uses JWT-based authentication with refresh tokens stored in HTTP-only cookies.

### User Roles:
- **Super Admin**: Full system access
- **Admin**: Cafe-level access
- **User**: Customer access

## 📊 API Documentation

### Base URL
```
Development: http://localhost:8001
```

### Authentication Routes
```
POST /auth/login          # User login
POST /auth/signup         # User registration
POST /auth/refresh-token  # Refresh access token
POST /auth/logout         # User logout
```

### Admin Routes
```
GET  /admin/dashboard     # Dashboard data
GET  /admin/bookings      # List bookings
POST /admin/bookings      # Create booking
GET  /admin/games         # List games
POST /admin/games         # Create game
GET  /admin/customers     # List customers
POST /admin/customers     # Create customer
GET  /admin/inventory/*   # Inventory endpoints
```

### Super Admin Routes
```
GET  /superadmin/cafes         # List cafes
POST /superadmin/cafes         # Create cafe
GET  /superadmin/locations     # List locations
POST /superadmin/membership    # Create membership
```

## 🎨 UI Components

The frontend uses a consistent design system with:
- Custom Bootstrap theme
- Responsive layouts for mobile and desktop
- Loading states and error handling
- Toast notifications for user feedback
- Animated transitions (AOS)
- Data visualization with Chart.js

## 📝 Development Notes

### Hot Reload
Both frontend and backend support hot reload during development:
- Frontend: Vite hot module replacement
- Backend: Nodemon for automatic restarts

### Database
- MongoDB connection with automatic retry logic
- Mongoose schema validation
- Soft delete implementation for data retention

### File Uploads
- Handled by Multer middleware
- Uploaded files stored in `/app/backend/uploads`
- Accessible via `/uploads` static route

## 🚀 Deployment

### Backend Deployment
1. Set `NODE_ENV=production` in `.env`
2. Use process manager (PM2 or Supervisor)
3. Configure reverse proxy (Nginx)
4. Set up MongoDB replica set for production

### Frontend Deployment
1. Build the production bundle: `npm run build`
2. Serve the `dist` folder with a static server
3. Configure environment variables for production API

## 🛠️ Troubleshooting

### Backend won't start
- Check MongoDB is running: `ps aux | grep mongod`
- Verify `.env` file exists with correct values
- Check logs: `tail -f /var/log/supervisor/backend.err.log`

### Frontend build errors
- Clear node_modules: `rm -rf node_modules && npm install`
- Check for version conflicts in `package.json`
- Verify Vite configuration

### Database connection issues
- Ensure MongoDB is running on port 27017
- Check DB_URL in backend `.env`
- Verify network connectivity

## 📄 License

Private - All rights reserved

## 👥 Contributors

- Development Team at Lockene Technologies

## 📞 Support

For support and queries, contact the development team.

---

**Last Updated:** November 2025
**Version:** 1.0.0
