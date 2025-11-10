# Styx Cafe Admin Panel - Complete Deployment Guide

## 🎯 Deployment Strategy

Deploy the admin panel as a **separate Emergent project** to get it running on `admin.styxcafe.in`.

---

## ✅ What's Ready

### 1. Deployment Package Created ✅
- **Location**: `/tmp/styx-admin-panel-deploy.zip`
- **Size**: 21 MB
- **Contents**: Complete admin panel with all dependencies

### 2. Super Admin User Created ✅
```
📧 Email: styxcafe@gmail.com
🔑 Password: 10101984#rR
👥 Role: superadmin
✅ Status: Active in database
```

### 3. Backend API Ready ✅
- **URL**: https://styxcafe.in/api
- **CORS**: Configured for admin.styxcafe.in
- **Endpoints**: Super admin auth working

### 4. DNS Already Configured ✅
```
styxcafe.in → 34.57.15.54
admin.styxcafe.in → 34.57.15.54
```

---

## 🚀 Deployment Steps

### Step 1: Download Deployment Package

The deployment package is ready at: `/tmp/styx-admin-panel-deploy.zip`

**Contents:**
- Complete React/Vite admin panel source code
- Environment configuration (.env)
- Deployment documentation
- Quick start guide
- README with full instructions

### Step 2: Create New Emergent Project

1. **Go to Emergent Dashboard**
   - URL: https://app.emergent.sh
   - Login to your account

2. **Create New Project**
   - Click "New Project" or "Create"
   - Project Name: "Styx Cafe Admin Panel"
   - Template: React / Vite (or Frontend)

### Step 3: Upload Admin Panel

**Option A: Upload ZIP File**
1. Upload `/tmp/styx-admin-panel-deploy.zip`
2. Extract in project root
3. Emergent will auto-detect `package.json`

**Option B: GitHub Integration (Recommended)**
1. Create new GitHub repository
2. Upload the package contents
3. Connect repository to Emergent project
4. Auto-deploy on push

**Option C: Manual File Upload**
1. Upload files from `/tmp/admin-panel-deploy/`
2. Ensure all directories are preserved
3. Check `package.json` is in root

### Step 4: Configure Environment Variables

In the new Emergent project settings, add these environment variables:

```env
VITE_API_URL=https://styxcafe.in/api
VITE_GOOGLE_API_KEY=AIzaSyCp8LWxhq-nPpEs4msUOj_JX-3HXhFoFF8
VITE_RAZOR_LIVE_KEY=rzp_test_XKXEVtmAb8x7DN
VITE_RAZOR_LIVE_SECRET=FFmzsGqrPoTvQXifCAavr8Zl
VITE_RAZOR_LIVE_TOKEN=cnpwX3Rlc3RfN0JoTGFGcHZwUDBlN2s6QXRxQ0gyVjhuUWhNb3hSSkNUYnFxc05w
```

### Step 5: Deploy

Emergent will automatically:
1. Install dependencies (`yarn install`)
2. Build the project (`yarn build`)
3. Deploy to preview URL

You'll get a URL like: `https://admin-xyz.preview.emergentagent.com`

### Step 6: Test Preview URL

1. Visit the preview URL
2. Navigate to `/superadmin/login`
3. Login with:
   - Email: styxcafe@gmail.com
   - Password: 10101984#rR
4. Verify dashboard loads
5. Check API connectivity (no CORS errors)

### Step 7: Configure Custom Domain

1. **In Emergent Project Settings**:
   - Find "Custom Domain" or "Domains" section
   - Click "Add Domain"
   - Enter: `admin.styxcafe.in`
   - Click "Add" or "Verify"

2. **DNS Verification**:
   - DNS is already pointing to Emergent ✅
   - Emergent will auto-verify

3. **SSL Certificate**:
   - Emergent provisions SSL automatically
   - Usually takes 5-15 minutes
   - You'll see status change to "Active"

4. **Test Custom Domain**:
   - Visit: https://admin.styxcafe.in
   - Should redirect to HTTPS
   - Login should work

---

## 🔍 Verification Checklist

### After Preview Deployment
- [ ] Preview URL loads without errors
- [ ] Admin login page accessible
- [ ] Super admin login page accessible
- [ ] Login works (test with super admin credentials)
- [ ] Dashboard loads after login
- [ ] API calls successful (check browser console)
- [ ] No CORS errors

### After Custom Domain Setup
- [ ] `https://admin.styxcafe.in` resolves
- [ ] SSL certificate is valid (green padlock)
- [ ] Admin login works at `/admin/login`
- [ ] Super admin login works at `/superadmin/login`
- [ ] All routes accessible
- [ ] Backend API calls work
- [ ] Assets load correctly

---

## 🔐 Login Credentials

### Super Admin (Platform Administrator)
```
URL: https://admin.styxcafe.in/superadmin/login
Email: styxcafe@gmail.com
Password: 10101984#rR
Role: superadmin
```

**Capabilities:**
- View and manage all cafes
- View and manage all locations
- Create/edit/delete admin users
- System-wide settings
- Platform analytics

### Admin (Cafe Owner)
```
URL: https://admin.styxcafe.in/admin/login
Email: styx.mumbai@example.com
Password: admin123
Role: admin
Cafe: Styx Cafe - Andheri West
```

**Capabilities:**
- Manage their cafe
- Handle bookings
- Manage customers
- Inventory tracking
- Reports and analytics

---

## 🏗️ Architecture After Deployment

```
┌─────────────────────────────────────────┐
│         Internet Users                   │
└──────────┬──────────────┬───────────────┘
           │              │
           ▼              ▼
   ┌──────────────┐  ┌──────────────┐
   │ styxcafe.in  │  │admin.styxcafe│
   │              │  │    .in       │
   │  Customer    │  │              │
   │  Frontend    │  │ Admin Panel  │
   │              │  │              │
   │ (Project 1)  │  │ (Project 2)  │
   └──────┬───────┘  └──────┬───────┘
          │                  │
          └────────┬─────────┘
                   ▼
          ┌────────────────┐
          │  Backend API   │
          │                │
          │ /api/auth/*    │
          │ /api/user/*    │
          │ /api/admin/*   │
          │ /api/superadmin│
          │                │
          │ (Project 1)    │
          └────────┬───────┘
                   ▼
          ┌────────────────┐
          │    MongoDB     │
          │                │
          │  - customers   │
          │  - superadmins │
          │  - caves       │
          │  - bookings    │
          └────────────────┘
```

**Key Points:**
- Two separate Emergent deployments
- Shared backend API
- Shared database
- Independent scaling and management

---

## 🛠️ Technical Details

### Build Configuration
- **Framework**: React 18 with Vite 6
- **Build Command**: `yarn build`
- **Output**: `dist/` directory
- **Serve**: Static files (HTML, CSS, JS)

### Environment
- **Node Version**: 18+ (Emergent default)
- **Package Manager**: Yarn (recommended)
- **Build Time**: ~1-2 minutes

### Bundle Size
- **Total**: ~3-4 MB (gzipped)
- **Initial Load**: ~500 KB
- **Lazy Loaded**: Routes split automatically

---

## 🐛 Troubleshooting

### Issue: Build Fails on Emergent

**Check:**
1. All files uploaded correctly
2. `package.json` in project root
3. Environment variables set
4. Emergent logs for specific error

**Solution:**
```bash
# Locally test the build
cd /tmp/admin-panel-deploy
yarn install
yarn build
# If this works, issue is with Emergent config
```

### Issue: Preview URL Shows 404

**Possible Causes:**
- Build failed (check logs)
- Routes not configured for SPA
- `index.html` not in right location

**Solution:**
- Check Emergent build logs
- Ensure `dist/index.html` exists after build
- Verify Vite config is correct

### Issue: API Calls Fail (CORS)

**Check:**
1. Backend at `styxcafe.in` is running
2. `.env` has correct `VITE_API_URL`
3. Backend CORS allows admin subdomain

**Solution:**
```bash
# Test backend from admin panel domain
curl https://styxcafe.in/api/auth/login \
  -H "Origin: https://admin.styxcafe.in" \
  -H "Content-Type: application/json" \
  -d '{"email":"styxcafe@gmail.com","password":"10101984#rR"}'
```

### Issue: Login Doesn't Work

**Verify:**
1. Super admin exists in database
2. Backend `/api/auth/login` endpoint works
3. JWT secret is set in backend
4. No JavaScript errors in browser console

**Test Backend:**
```bash
curl -X POST https://styxcafe.in/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"styxcafe@gmail.com","password":"10101984#rR"}'
# Should return token and user data
```

### Issue: Custom Domain SSL Error

**Wait Time:**
- SSL provisioning takes 5-15 minutes
- DNS propagation can take up to 1 hour

**Verify:**
```bash
# Check DNS
dig +short admin.styxcafe.in
# Should return Emergent's IP

# Check SSL
curl -I https://admin.styxcafe.in
# Should return 200 OK with valid SSL
```

---

## 📞 Support Resources

### Emergent Platform Support
- **Discord**: https://discord.gg/VzKfwCXC4A
- **Email**: support@emergent.sh
- **Docs**: https://docs.emergent.sh
- **Status**: https://status.emergent.sh

### Common Support Questions

**Q: How long does deployment take?**
A: Usually 2-5 minutes for build + deploy. Custom domain setup adds 5-15 minutes for SSL.

**Q: Can I use a different backend?**
A: Yes, change `VITE_API_URL` to point to your backend.

**Q: Do I need to deploy backend separately?**
A: No, admin panel uses existing backend at styxcafe.in.

**Q: How do I update the admin panel?**
A: Update code, commit to GitHub (if using Git integration), or re-upload files. Emergent auto-rebuilds.

**Q: Can I preview before going live?**
A: Yes, use the preview URL to test before configuring custom domain.

---

## 📋 Post-Deployment Tasks

### 1. Update Customer Frontend
The customer website needs to know about the new admin URL:

**Already Done!** ✅
- Frontend `.env` has `REACT_APP_ADMIN_PANEL_URL=https://admin.styxcafe.in`
- Login dropdown links to correct admin panel URL

### 2. Backend CORS Update
**Already Done!** ✅
- Backend CORS includes `https://admin.styxcafe.in`
- No additional configuration needed

### 3. Test All Login Flows
- [ ] Customer login on main site
- [ ] Admin login on admin panel
- [ ] Super admin login on admin panel
- [ ] Logout from each
- [ ] Password reset flows

### 4. Performance Optimization
- [ ] Enable caching in Emergent settings
- [ ] Verify gzip compression
- [ ] Check Lighthouse scores
- [ ] Test on mobile devices

### 5. Security Checks
- [ ] HTTPS enforced
- [ ] No exposed API keys in frontend
- [ ] JWT tokens in HTTP-only cookies
- [ ] CORS properly configured
- [ ] Rate limiting on backend

---

## 🎉 Success Criteria

You'll know deployment is successful when:

✅ `https://admin.styxcafe.in` loads with green padlock
✅ Super admin can login successfully
✅ Dashboard displays without errors
✅ API calls work (check Network tab)
✅ All routes are accessible
✅ No console errors
✅ Mobile responsive
✅ Fast load times (< 3 seconds)

---

## 📊 Monitoring & Maintenance

### Check Regularly
1. **Uptime**: Monitor both domains
2. **SSL**: Verify certificates don't expire
3. **Performance**: Check load times
4. **Errors**: Monitor error logs
5. **Usage**: Track admin logins

### Emergent Features
- Built-in monitoring
- Automatic SSL renewal
- Usage analytics
- Error tracking
- Performance metrics

---

## 🔄 Future Updates

To update the admin panel:

**Via GitHub:**
1. Make changes to code
2. Commit and push to GitHub
3. Emergent auto-deploys

**Via Upload:**
1. Make changes locally
2. Create new deployment package
3. Upload to Emergent
4. Rebuild automatically

---

## 📝 Summary

### Completed ✅
- Deployment package created
- Super admin user set up
- Backend API ready
- Documentation complete
- DNS configured

### To Do 📋
1. Create new Emergent project
2. Upload admin panel package
3. Set environment variables
4. Test preview URL
5. Configure custom domain
6. Verify SSL
7. Test all login flows

### Timeline ⏱️
- **Setup**: 10-15 minutes
- **Build & Deploy**: 2-5 minutes
- **Custom Domain + SSL**: 10-20 minutes
- **Total**: ~30-45 minutes

---

**Last Updated**: November 10, 2025
**Status**: ✅ Ready for Deployment
**Package Location**: `/tmp/styx-admin-panel-deploy.zip`
