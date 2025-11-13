# Customer Website API Configuration Fix

## Problem
The customer website at `https://styxcafe-revamp.preview.emergentagent.com/` is trying to call:
```
REQUEST: http://localhost:8001/user/recent-cafe
```

This causes CORS error: `strict-origin-when-cross-origin` because:
1. The website is deployed (HTTPS)
2. It's trying to call localhost (HTTP)
3. Localhost is not accessible from the deployed website

## Solution

The customer website needs to be updated to use the correct backend URL:

### Correct Backend URL
```
https://cc1406e7-8328-4a1b-a2a0-928d2f749a14.preview.emergentagent.com
```

### Files That Need Update (in the deployed customer website)

1. **Environment Configuration** (if exists):
   ```javascript
   // .env or config.js
   VITE_API_URL=https://cc1406e7-8328-4a1b-a2a0-928d2f749a14.preview.emergentagent.com
   VITE_SOCKET_URL=https://cc1406e7-8328-4a1b-a2a0-928d2f749a14.preview.emergentagent.com
   ```

2. **API Service File** (likely in src/services/ or src/api/):
   ```javascript
   // Change from:
   const API_BASE_URL = 'http://localhost:8001';
   
   // To:
   const API_BASE_URL = 'https://cc1406e7-8328-4a1b-a2a0-928d2f749a14.preview.emergentagent.com';
   ```

3. **Or use environment variable**:
   ```javascript
   const API_BASE_URL = import.meta.env.VITE_API_URL || 
                        'https://cc1406e7-8328-4a1b-a2a0-928d2f749a14.preview.emergentagent.com';
   ```

## Backend CORS Configuration (Already Fixed ✓)

The backend at `/app/backend_nodejs/index.js` already includes:
- ✅ `https://styxcafe-revamp.preview.emergentagent.com`
- ✅ `http://styxcafe-revamp.preview.emergentagent.com`
- ✅ All `.emergentagent.com` domains

## Updated Source Code (Ready for Deployment)

We've already updated the source code at:
- `/app/styxcafeai-main/sporty-frontend/`
- `.env` file configured with correct URLs
- `src/services/api.js` uses environment variables
- `src/services/socket.js` configured for production

## To Fix the Live Website

**Option 1: Redeploy from Updated Source**
```bash
cd /app/styxcafeai-main/sporty-frontend
yarn build
# Deploy the build folder to https://styxcafe-revamp.preview.emergentagent.com/
```

**Option 2: Update Environment Variables (if supported by deployment platform)**
Set these environment variables in the deployment:
```
VITE_API_URL=https://cc1406e7-8328-4a1b-a2a0-928d2f749a14.preview.emergentagent.com
VITE_SOCKET_URL=https://cc1406e7-8328-4a1b-a2a0-928d2f749a14.preview.emergentagent.com
```

## API Endpoints Available

All public endpoints are accessible at:
- `/api/user/locations` - Get locations
- `/api/user/recent-cafe` - Get recent cafes
- `/api/user/cafeDetails/:id` - Get cafe details
- `/api/user/gameDetails/:id` - Get game details
- `/api/user/content/hero` - Get hero banners
- `/api/user/content/services` - Get services

## Testing

Test the API directly:
```bash
curl https://cc1406e7-8328-4a1b-a2a0-928d2f749a14.preview.emergentagent.com/api/user/locations
```

Should return location data without CORS errors.
