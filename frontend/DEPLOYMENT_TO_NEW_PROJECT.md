# Styx Cafe Admin Panel - Standalone Deployment Guide

## 🎯 Overview

This guide will help you deploy the Styx Cafe Admin Panel as a **separate Emergent project** that can be accessed via `admin.styxcafe.in`.

---

## 📦 What's Included

This admin panel is a standalone React (Vite) application that:
- ✅ Connects to the existing backend API at `https://styxcafe.in/api`
- ✅ Supports both Admin and Super Admin login
- ✅ Includes all admin dashboard features
- ✅ Ready for production deployment

---

## 🚀 Deployment Steps

### Step 1: Create New Emergent Project

1. **Go to Emergent Dashboard**
   - Navigate to https://app.emergent.sh

2. **Create New Project**
   - Click "New Project" or "Create Project"
   - Name: "Styx Cafe Admin Panel"
   - Choose: React/Frontend template

### Step 2: Prepare Files for Upload

You need to upload these files from `/app/styx-admin-panel/`:

**Required Files:**
```
styx-admin-panel/
├── public/
│   ├── assets/          (all subdirectories)
│   └── favicon.ico
├── src/                 (entire directory)
├── index.html
├── package.json
├── vite.config.js
├── .env
└── README.md
```

**Create a ZIP file:**
```bash
cd /app
zip -r styx-admin-panel-deploy.zip styx-admin-panel/ \
  -x "styx-admin-panel/node_modules/*" \
  -x "styx-admin-panel/dist/*" \
  -x "styx-admin-panel/.git/*"
```

### Step 3: Upload to New Emergent Project

1. **Upload the ZIP** or individual files to the new project
2. **Or use Git**: Push to a new GitHub repo and connect it to Emergent

### Step 4: Configure Environment Variables

In the new Emergent project, set these environment variables:

```env
VITE_API_URL=https://styxcafe.in/api
VITE_GOOGLE_API_KEY=AIzaSyCp8LWxhq-nPpEs4msUOj_JX-3HXhFoFF8
VITE_RAZOR_LIVE_KEY=rzp_test_XKXEVtmAb8x7DN
VITE_RAZOR_LIVE_SECRET=FFmzsGqrPoTvQXifCAavr8Zl
VITE_RAZOR_LIVE_TOKEN=cnpwX3Rlc3RfN0JoTGFGcHZwUDBlN2s6QXRxQ0gyVjhuUWhNb3hSSkNUYnFxc05w
```

### Step 5: Build & Deploy

The Emergent platform will automatically:
- Install dependencies (`yarn install`)
- Build the project (`yarn build`)
- Deploy to a preview URL

You'll get a URL like: `https://styx-inventory.preview.emergentagent.com`

### Step 6: Configure Custom Domain

1. **In Emergent Dashboard**:
   - Go to your new admin panel project
   - Find "Custom Domain" or "Domains" section
   - Add: `admin.styxcafe.in`

2. **DNS Configuration** (Already done! ✅):
   - Your DNS already points to Emergent's IP
   - Emergent will handle SSL automatically

3. **Wait for SSL**:
   - Emergent will provision SSL certificate
   - Usually takes 5-10 minutes

---

## 🔧 Backend Configuration

### Update CORS in Main Backend

The main backend at `styxcafe.in` needs to allow the new admin domain:

**File:** `/app/backend/main.py` (on main project)

Add to allowed origins:
```python
allowed_origins = [
    # ... existing origins ...
    "https://admin.styxcafe.in",
    # ... rest ...
]
```

This is **already configured** in the current backend! ✅

---

## 📋 Verification Checklist

After deployment, verify:

### 1. Admin Panel Access
- [ ] Navigate to `https://admin.styxcafe.in`
- [ ] Page loads without errors
- [ ] See login page

### 2. Admin Login
```
URL: https://admin.styxcafe.in/admin/login
Email: styx.mumbai@example.com
Password: admin123
```
- [ ] Can login successfully
- [ ] Redirects to dashboard
- [ ] Dashboard loads data from API

### 3. Super Admin Login
```
URL: https://admin.styxcafe.in/superadmin/login
Email: styxcafe@gmail.com
Password: 10101984#rR
```
- [ ] Can login successfully
- [ ] Redirects to super admin dashboard
- [ ] Can view all cafes/locations

### 4. API Connectivity
- [ ] Open browser console (F12)
- [ ] Check Network tab
- [ ] API calls go to `https://styxcafe.in/api`
- [ ] No CORS errors

---

## 🏗️ Project Structure

```
styx-admin-panel/
├── public/
│   └── assets/
│       ├── AboutImg/
│       ├── AdminProfile/
│       ├── BannerImg/
│       ├── BookingImg/
│       ├── DashboardImg/
│       ├── FeedbackImg/
│       ├── GameImg/
│       ├── LoginImg/
│       ├── Logo/
│       ├── MembershipImg/
│       └── SuperAdminImg/
├── src/
│   ├── components/
│   ├── pages/
│   │   ├── Admin/           # Admin pages
│   │   ├── SuperAdmin/      # Super admin pages
│   │   └── User/            # User pages
│   ├── routes/
│   │   └── AppRoutes.jsx    # All routes defined
│   ├── store/
│   │   └── slices/
│   │       └── authSlice.js # Redux auth state
│   ├── App.jsx
│   └── main.jsx
├── .env                      # Environment variables
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 🔑 Login Credentials

### Admin (Cafe Owner)
```
Email: styx.mumbai@example.com
Password: admin123
Role: admin
```

### Super Admin (Platform Administrator)
```
Email: styxcafe@gmail.com
Password: 10101984#rR
Role: superadmin
```

---

## 🌐 URLs After Deployment

### Main Customer Website
- **URL**: https://styxcafe.in
- **Purpose**: Customer booking interface
- **Backend**: Integrated

### Admin Panel (New Deployment)
- **URL**: https://admin.styxcafe.in
- **Purpose**: Admin & Super Admin management
- **Backend**: Uses main backend API
- **Deployment**: Separate Emergent project

### Backend API
- **URL**: https://styxcafe.in/api
- **Purpose**: Shared API for both frontends
- **Deployment**: Main Emergent project

---

## 🔧 Technical Details

### Dependencies
- **React**: 18.3.1
- **Vite**: 6.2.0
- **Redux Toolkit**: 2.5.1
- **React Router**: 7.1.5
- **Bootstrap**: 5.3.3
- **Axios**: 1.7.9

### Build Output
- **Format**: Static files (HTML, CSS, JS)
- **Output Directory**: `dist/`
- **Deployment**: Serve as static site

### Environment
- **Node Version**: 18+ recommended
- **Package Manager**: Yarn (recommended) or npm
- **Build Time**: ~1-2 minutes

---

## 🚨 Important Notes

### Backend Dependency
- Admin panel **requires** the main backend to be running
- Backend API: `https://styxcafe.in/api`
- Both admin and customer sites use the same backend

### Authentication
- Uses JWT tokens stored in HTTP-only cookies
- Token expiry: 7 days for super admin, 18 hours for customers
- Tokens stored in localStorage for frontend state

### CORS Configuration
- Backend already configured to allow `admin.styxcafe.in`
- No additional CORS setup needed

---

## 🐛 Troubleshooting

### Issue: Build Fails
**Solution:**
```bash
cd /app/styx-admin-panel
rm -rf node_modules
yarn install
yarn build
```

### Issue: API Calls Fail (CORS Error)
**Solution:**
- Verify `.env` has correct `VITE_API_URL`
- Check backend CORS allows `admin.styxcafe.in`
- Restart backend if CORS updated

### Issue: Login Doesn't Work
**Solution:**
- Check backend is running: `curl https://styxcafe.in/api/auth/login`
- Verify super admin exists in database
- Check browser console for errors

### Issue: Custom Domain Not Working
**Solution:**
- Wait 10-15 minutes for DNS propagation
- Check Emergent dashboard for SSL status
- Verify DNS points to correct IP

---

## 📞 Support

### Emergent Platform
- **Discord**: https://discord.gg/VzKfwCXC4A
- **Email**: support@emergent.sh
- **Docs**: https://docs.emergent.sh

### Common Questions

**Q: Can I use a different backend?**
A: Yes, just update `VITE_API_URL` in `.env` to point to your backend.

**Q: Do I need to deploy the backend separately?**
A: No, the admin panel uses the existing backend at `styxcafe.in`.

**Q: Can I customize the admin panel?**
A: Yes! All source code is included in `src/` directory.

**Q: How do I add more admin users?**
A: Use the super admin panel to create/manage admin users.

---

## ✅ Deployment Checklist

### Pre-Deployment
- [x] Admin panel built and tested
- [x] Environment variables configured
- [x] Backend CORS updated
- [x] Super admin user created
- [x] DNS configured

### During Deployment
- [ ] Create new Emergent project
- [ ] Upload admin panel files
- [ ] Set environment variables
- [ ] Build completes successfully
- [ ] Preview URL accessible

### Post-Deployment
- [ ] Configure custom domain (admin.styxcafe.in)
- [ ] SSL certificate provisioned
- [ ] Test admin login
- [ ] Test super admin login
- [ ] Verify API connectivity
- [ ] Check all routes working

---

## 🎉 Success!

Once deployed, you'll have:
- ✅ Main site at `styxcafe.in`
- ✅ Admin panel at `admin.styxcafe.in`
- ✅ Shared backend API
- ✅ Separate deployments for easy management

---

**Last Updated**: November 10, 2025
**Version**: 1.0.0
**Status**: ✅ Ready for Deployment
