# User Frontend Guide - StyxCafe Client Application

## Overview

The User Frontend is a customer-facing application built with React and TypeScript that allows users to discover cafes, book venues, and manage their bookings.

## 🌐 Access URLs

- **User Frontend (Client)**: http://localhost:3001
- **Admin Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8001

## 🎯 Features

### 1. **Authentication**
- **OTP-based Login**: Secure login using mobile number and OTP
- **Registration**: New user signup with name, email, and contact details
- **Session Management**: Persistent login with cookies
- **Logout**: Secure logout functionality

### 2. **Cafe Discovery**
- **Browse Cafes**: List all available cafes with images and details
- **Filter Cafes**: Search and filter by location, amenities, price range
- **Cafe Details**: View detailed information about each cafe
  - Images gallery
  - Location on map
  - Available games and facilities
  - Pricing information
  - Operating hours

### 3. **Venue Booking**
- **Browse Games**: View available games (Snooker, Turf, Pickleball, etc.)
- **Book Slots**: Select date, time, and duration
- **Checkout**: Secure payment processing with Razorpay
- **Booking Confirmation**: Order confirmation and invoice generation

### 4. **User Dashboard**
- **Profile Management**: Update personal information and profile picture
- **Booking History**: View all past and upcoming bookings
- **Active Bookings**: Track ongoing reservations
- **Cancelled Bookings**: View cancellation history
- **Invoices**: Download booking invoices
- **Wallet**: Manage wallet balance and transactions

### 5. **Additional Pages**
- **About Us**: Company information
- **Contact Us**: Contact form and details
- **FAQ**: Frequently asked questions
- **Terms & Conditions**: Legal terms
- **Privacy Policy**: Privacy information
- **Gallery**: Image gallery of venues
- **Events**: View upcoming events

## 🔧 Technical Stack

### Frontend
- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Redux Toolkit**: State management
- **React Router**: Navigation
- **Ant Design**: UI component library
- **Bootstrap**: Responsive layout
- **Axios**: HTTP client
- **PrimeReact**: Additional UI components

### Integration
- **Google Maps**: Location services
- **Razorpay**: Payment gateway
- **AOS**: Scroll animations
- **React DatePicker**: Date selection
- **ApexCharts**: Data visualization

## 📁 Project Structure

```
/app/user-frontend/
├── src/
│   ├── feature-module/
│   │   ├── auth/              # Authentication pages
│   │   │   ├── loginOffcanvas.tsx
│   │   │   └── register.tsx
│   │   ├── home/              # Landing page
│   │   ├── listing/           # Cafe listings
│   │   │   ├── listing-grid-sidebar.tsx
│   │   │   └── food-items.tsx
│   │   ├── venues/            # Venue & booking pages
│   │   │   ├── venue-details.tsx
│   │   │   ├── venue-games.tsx
│   │   │   ├── cage-checkout.tsx
│   │   │   ├── cage-order-confirm.tsx
│   │   │   └── invoice.tsx
│   │   ├── user/              # User dashboard
│   │   │   ├── user-dashboard.tsx
│   │   │   ├── user-profile.tsx
│   │   │   ├── user-bookings.tsx
│   │   │   ├── user-wallet.tsx
│   │   │   └── ...
│   │   ├── pages/             # Additional pages
│   │   ├── common/            # Shared components
│   │   └── router/            # Route configuration
│   ├── core/
│   │   ├── data/
│   │   │   ├── redux/         # Redux store & slices
│   │   │   │   ├── store.ts
│   │   │   │   ├── slices/
│   │   │   │   │   ├── authSlice.ts
│   │   │   │   │   └── ...
│   │   │   │   └── axiosClient.ts
│   │   │   └── img/           # Image components
│   │   └── ...
│   ├── style/                 # CSS, SCSS, fonts, images
│   ├── context/               # React context
│   ├── environment.tsx        # Environment config
│   └── index.tsx              # Entry point
├── public/                    # Static assets
├── package.json
├── tsconfig.json
└── .env
```

## 🚀 Setup & Installation

### 1. Install Dependencies
```bash
cd /app/user-frontend
npm install
```

### 2. Configure Environment
Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:8001
REACT_APP_GOOGLE_API_KEY=AIzaSyCp8LWxhq-nPpEs4msUOj_JX-3HXhFoFF8
REACT_APP_RAZOR_LIVE_KEY=rzp_test_XKXEVtmAb8x7DN
REACT_APP_RAZOR_LIVE_SECRET=FFmzsGqrPoTvQXifCAavr8Zl
REACT_APP_RAZOR_LIVE_TOKEN=cnpwX3Rlc3RfN0JoTGFGcHZwUDBlN2s6QXRxQ0gyVjhuUWhNb3hSSkNUYnFxc05w
PORT=3001
```

### 3. Start Development Server
```bash
npm start
```

The app will be available at `http://localhost:3001`

### 4. Using Supervisor
```bash
# Check status
supervisorctl status user-frontend

# Start
supervisorctl start user-frontend

# Restart
supervisorctl restart user-frontend

# View logs
tail -f /var/log/supervisor/user-frontend.out.log
```

## 🔐 Authentication Flow

### Registration
1. User provides: Name, Email, Contact Number
2. Backend creates user account
3. User is automatically logged in
4. Session cookie is set

### OTP-based Login
1. User enters mobile number
2. Click "Send OTP"
3. Backend sends OTP via SMS (or email)
4. User enters OTP
5. Click "Verify OTP"
6. Upon success, user is logged in
7. Session cookie is set

### Session Management
- JWT tokens stored in HTTP-only cookies
- Automatic token refresh
- Persistent login across browser sessions
- Secure logout clears all sessions

## 📡 API Integration

### Base URL
```javascript
// Configured in /src/core/data/redux/axiosClient.ts
axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.withCredentials = true; // For cookies
```

### Key Endpoints Used

#### Authentication
```
POST /auth/user/register          - Register new user
POST /auth/user/login             - Login with credentials
POST /auth/user/send-otp          - Send OTP to mobile
POST /auth/user/verify-otp        - Verify OTP and login
POST /auth/user/logout            - Logout user
POST /auth/user/auth-check        - Check auth status
GET  /auth/user/me                - Get current user
```

#### Cafes & Venues
```
GET  /user/filterCafes            - Get filtered cafe list
GET  /user/cafeDetails/:id        - Get cafe details
GET  /user/gameDetails/:id        - Get game details
GET  /user/recent-cafe            - Get recently added cafes
GET  /user/locations              - Get all locations
GET  /user/cafe/items/:id         - Get cafe menu items
```

#### Bookings
```
POST /user/booking/create         - Create new booking
GET  /user/booking/list           - Get user bookings
GET  /user/booking/:id            - Get booking details
PUT  /user/booking/:id            - Update booking
DELETE /user/booking/:id          - Cancel booking
```

#### Profile
```
GET  /user/profile                - Get user profile
PUT  /user/profile                - Update user profile
```

## 🎨 UI Components

### Reusable Components
- **ImageWithBasePath**: Dynamic image loader
- **Breadcrumbs**: Navigation breadcrumbs
- **Header**: Main navigation header
- **Footer**: Site footer
- **Loader**: Loading spinner
- **Modals**: Reusable modal dialogs

### Page Components
- **HomePage**: Landing page with search and featured cafes
- **ListingGrid**: Grid view of cafes with filters
- **VenueDetails**: Detailed cafe information
- **VenueGames**: Available games at a venue
- **CageCheckout**: Booking checkout page
- **UserDashboard**: User profile and bookings
- **Invoice**: Booking invoice generator

## 🔍 Redux State Management

### Auth Slice
```typescript
interface AuthState {
  isAuthenticated: boolean;
  user: UserType | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}
```

### Actions
- `registerUser`: Register new user
- `loginUser`: Login with credentials
- `sendLoginOTP`: Send OTP to mobile
- `verifyLoginOTP`: Verify OTP and login
- `logoutUser`: Logout current user
- `checkAuth`: Verify authentication status

## 🎯 User Journey

### First-Time Visitor
1. **Landing Page**: Browse featured cafes and search
2. **Cafe Listing**: View all available cafes
3. **Filter**: Apply location, price, amenities filters
4. **Cafe Details**: Select a cafe to view details
5. **Login/Register**: Sign up or login to book
6. **Select Game**: Choose game/venue type
7. **Book Slot**: Select date, time, duration
8. **Checkout**: Enter payment details
9. **Confirmation**: Receive booking confirmation
10. **Dashboard**: View booking in user dashboard

### Returning User
1. **Auto-Login**: Automatic authentication
2. **Dashboard**: View active bookings
3. **Quick Book**: Fast booking for favorite cafes
4. **Wallet**: Use wallet balance for bookings
5. **Profile**: Update preferences

## 🛠️ Development Tips

### Adding New Pages
1. Create component in `feature-module/`
2. Add route in `router/all_routes.tsx`
3. Update `router/router.tsx`
4. Add navigation links if needed

### Redux Integration
1. Create slice in `core/data/redux/slices/`
2. Add to store in `core/data/redux/store.ts`
3. Use `useSelector` and `useDispatch` in components

### API Calls
```typescript
// In component
import { useDispatch, useSelector } from 'react-redux';
import { fetchCafes } from '../../core/data/redux/slices/cafeSlice';

const Component = () => {
  const dispatch = useDispatch();
  const { cafes, loading } = useSelector(state => state.cafe);
  
  useEffect(() => {
    dispatch(fetchCafes());
  }, [dispatch]);
  
  return <div>{/* UI */}</div>;
};
```

### Styling
- Use existing CSS classes from `style/` directory
- Follow Bootstrap grid system
- Add custom styles in component-specific SCSS files
- Use Ant Design components for consistent UI

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration works
- [ ] OTP login flow works
- [ ] Cafe listing displays correctly
- [ ] Filters work properly
- [ ] Cafe details page loads
- [ ] Booking flow completes
- [ ] Payment integration works
- [ ] User dashboard shows bookings
- [ ] Profile update works
- [ ] Logout works properly

### Test User Credentials
Create test users via registration or use:
```
Phone: 9876543210
OTP: (will be sent to phone/email)
```

## 🔧 Troubleshooting

### Frontend won't start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check port availability
netstat -tuln | grep 3001

# Check logs
tail -f /var/log/supervisor/user-frontend.err.log
```

### API calls failing
1. Verify backend is running on port 8001
2. Check CORS configuration in backend
3. Verify `REACT_APP_API_URL` in `.env`
4. Check browser console for errors

### Authentication issues
1. Clear browser cookies
2. Check backend `/auth/user/*` endpoints
3. Verify JWT configuration in backend
4. Check Redux DevTools for auth state

### Images not loading
1. Verify image paths in backend uploads
2. Check static file serving in backend
3. Use relative paths for images
4. Check browser Network tab

## 📚 Additional Resources

### Documentation
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Ant Design](https://ant.design/)

### Related Docs
- [Main README](/app/README.md)
- [Backend API](/app/backend/)
- [Admin Frontend](/app/frontend/)
- [Membership Guide](/app/MEMBERSHIP_GUIDE.md)

## 🎉 Summary

The User Frontend provides a complete customer-facing application for the StyxCafe platform, enabling users to:
- Discover and explore cafes
- View detailed venue information
- Book games and facilities
- Make secure payments
- Manage their bookings and profile

All integrated seamlessly with the backend API and ready for deployment!

---

**Port**: 3001  
**Status**: ✅ Running  
**Last Updated**: November 2025
