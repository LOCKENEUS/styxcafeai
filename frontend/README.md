# Styx Cafe Admin Panel

A comprehensive admin and super admin dashboard for managing the Styx Cafe booking platform.

## 🚀 Quick Start

### Installation
```bash
yarn install
```

### Development
```bash
yarn dev
```
Runs on `http://localhost:3000`

### Production Build
```bash
yarn build
```
Output in `dist/` directory

## 🔑 Login Credentials

### Admin Login
- **URL**: `/admin/login`
- **Email**: styx.mumbai@example.com
- **Password**: admin123

### Super Admin Login
- **URL**: `/superadmin/login`
- **Email**: styxcafe@gmail.com
- **Password**: 10101984#rR

## 🌐 Environment Variables

Create a `.env` file:

```env
VITE_API_URL=https://styxcafe.in/api
VITE_GOOGLE_API_KEY=your_google_api_key
VITE_RAZOR_LIVE_KEY=your_razorpay_key
VITE_RAZOR_LIVE_SECRET=your_razorpay_secret
VITE_RAZOR_LIVE_TOKEN=your_razorpay_token
```

## 📦 Features

### Admin Features
- Dashboard with analytics
- Booking management
- Customer management
- Games and slots management
- Inventory tracking
- Payment processing
- Reports and analytics

### Super Admin Features
- All admin features
- Multi-cafe management
- Location management
- Admin user management
- System-wide settings
- Platform analytics

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **UI**: Bootstrap 5 + React Bootstrap
- **State Management**: Redux Toolkit
- **Routing**: React Router v7
- **Charts**: Chart.js
- **Maps**: Google Maps API
- **Payments**: Razorpay + Stripe
- **Icons**: React Icons + Lucide

## 📁 Project Structure

```
src/
├── components/        # Reusable components
├── pages/
│   ├── Admin/        # Admin pages
│   ├── SuperAdmin/   # Super admin pages
│   └── User/         # User pages
├── routes/           # Route configurations
├── store/            # Redux store & slices
├── App.jsx
└── main.jsx
```

## 🔗 API Integration

This admin panel connects to the backend API:
- **Base URL**: Configured via `VITE_API_URL`
- **Authentication**: JWT tokens in HTTP-only cookies
- **Role-based**: Different routes for admin vs super admin

## 📖 Full Documentation

See `DEPLOYMENT_TO_NEW_PROJECT.md` for complete deployment guide.

## 🐛 Troubleshooting

### Build fails
```bash
rm -rf node_modules dist
yarn install
yarn build
```

### API not connecting
- Check `.env` file exists
- Verify `VITE_API_URL` is correct
- Check backend CORS settings

## 📄 License

Proprietary - Styx Cafe Platform

---

**Version**: 1.0.0
**Last Updated**: November 10, 2025
