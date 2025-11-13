# Preview Access Configuration

## ✅ Configuration Complete

The application is now configured to work with the Emergent Agent preview URL.

## 🌐 Access URLs

### Frontend (React + Vite)
- **Preview URL**: https://cafe-backend.preview.emergentagent.com
- **Local**: http://localhost:3000

### Backend API (Node.js + Express)
- **Local**: http://localhost:8001
- The backend is accessible from the frontend via the configured CORS settings

## 🔧 Configurations Applied

### 1. Vite Configuration (`/app/frontend/vite.config.js`)

```javascript
server: {
  host: '0.0.0.0',
  port: 3000,
  allowedHosts: [
    'styxcafe-revamp.preview.emergentagent.com',
    'localhost',
    '.preview.emergentagent.com'
  ],
  hmr: {
    clientPort: 443,
    protocol: 'wss'
  }
}
```

**What this does:**
- `allowedHosts`: Allows the preview domain to access the dev server
- `hmr.clientPort: 443`: Hot Module Replacement works over HTTPS
- `hmr.protocol: 'wss'`: Uses WebSocket Secure for live reload

### 2. Backend CORS Configuration (`/app/backend/index.js`)

```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:8001',
  'https://cafe-backend.preview.emergentagent.com',
  'https://your-production-domain.com'
];
```

**What this does:**
- Allows the preview frontend to make API calls to the backend
- Enables credentials (cookies) to be sent with requests

## ✅ What's Working Now

1. **Preview URL Access**: You can now access the application via the preview URL
2. **Hot Module Replacement**: Changes to code will auto-reload in the browser
3. **API Communication**: Frontend can communicate with the backend API
4. **CORS**: Cross-Origin requests are properly handled
5. **WebSocket**: Live reload works over secure WebSocket connection

## 🚀 How to Access

### Option 1: Preview URL (Recommended)
Simply navigate to:
```
https://cafe-backend.preview.emergentagent.com
```

### Option 2: Local Development
```bash
# Frontend
http://localhost:3000

# Backend API
http://localhost:8001
```

## 🔍 Troubleshooting

### If you see "Blocked request" error:
1. Check that services are running:
   ```bash
   supervisorctl status
   ```

2. Verify configuration:
   ```bash
   cat /app/frontend/vite.config.js | grep allowedHosts -A 5
   ```

3. Restart services:
   ```bash
   supervisorctl restart frontend
   supervisorctl restart backend
   ```

### If frontend doesn't load:
1. Check frontend logs:
   ```bash
   tail -f /var/log/supervisor/frontend.out.log
   ```

2. Check for errors:
   ```bash
   tail -f /var/log/supervisor/frontend.err.log
   ```

### If API calls fail:
1. Check backend is running:
   ```bash
   curl http://localhost:8001/
   ```

2. Check backend logs:
   ```bash
   tail -f /var/log/supervisor/backend.out.log
   ```

3. Verify CORS configuration in `/app/backend/index.js`

## 📝 Environment Variables

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:8001
VITE_GOOGLE_API_KEY=AIzaSyCp8LWxhq-nPpEs4msUOj_JX-3HXhFoFF8
VITE_RAZOR_LIVE_KEY=rzp_test_XKXEVtmAb8x7DN
VITE_RAZOR_LIVE_SECRET=FFmzsGqrPoTvQXifCAavr8Zl
VITE_RAZOR_LIVE_TOKEN=cnpwX3Rlc3RfN0JoTGFGcHZwUDBlN2s6QXRxQ0gyVjhuUWhNb3hSSkNUYnFxc05w
```

### Backend (`.env`)
```env
PORT=8001
DB_URL=mongodb://localhost:27017/styxcafe
SECRET_KEY=styxcafe_secret_key_2024_secure_token_here
JWT_EXPIRY=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

## 🎯 Next Steps

1. **Access the preview URL** and verify the application loads
2. **Create a Super Admin account** via the signup page
3. **Set up your first cafe** in the Super Admin panel
4. **Create membership plans** to test the membership management feature
5. **Explore all features** (bookings, inventory, games, etc.)

## 📊 Service Status

Check service status at any time:
```bash
supervisorctl status
```

Expected output:
```
backend     RUNNING   pid XXXX, uptime X:XX:XX
frontend    RUNNING   pid XXXX, uptime X:XX:XX
mongodb     RUNNING   pid XXXX, uptime X:XX:XX
```

## 🔐 Security Notes

- The current configuration allows all origins in development mode
- For production deployment, you should:
  - Restrict `allowedOrigins` to specific domains
  - Use environment variables for CORS configuration
  - Enable HTTPS for the backend
  - Set secure JWT secrets
  - Configure MongoDB authentication

## 📚 Related Documentation

- [Main README](/app/README.md)
- [Membership Guide](/app/MEMBERSHIP_GUIDE.md)
- [Setup Script](/app/setup.sh)

---

**Last Updated**: November 2025
**Status**: ✅ Configured and Working
