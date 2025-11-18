# Styx Cafe - Quick Reference Guide

## 🔗 URLs

### Production URLs
- **Customer Site**: https://styxcafe.in
- **Admin Panel**: https://admin.styxcafe.in (pending deployment)
- **Central Backend**: https://unified-backend-4.emergent.host

### API Endpoints
- **Base URL**: https://unified-backend-4.emergent.host
- **API Path**: https://unified-backend-4.emergent.host/api

---

## 🔑 Login Credentials

### Super Admin
```
Email: styxcafe@gmail.com
Password: 10101984#rR
URL: /superadmin/login
```

### Admin (Cafe Owner)
```
Email: styx.mumbai@example.com
Password: admin123
URL: /admin/login
```

---

## 🚀 Quick Commands

### Check Services
```bash
sudo supervisorctl status
```

### Restart Services
```bash
# Restart customer website
sudo supervisorctl restart user-website

# Restart admin panel
sudo supervisorctl restart admin-panel

# Restart all
sudo supervisorctl restart all
```

### View Logs
```bash
# Customer website
tail -f /var/log/supervisor/user-website.out.log

# Admin panel
tail -f /var/log/supervisor/admin-panel.out.log
```

### Rebuild Frontends
```bash
# Customer frontend
cd /app/frontend && yarn build

# Admin panel
cd /app/styx-admin-panel && yarn build
```

---

## 📁 Important Directories

### Customer Frontend
- **Source**: `/app/frontend/`
- **Build**: `/app/frontend/build/`
- **Config**: `/app/frontend/.env`

### Admin Panel
- **Source**: `/app/styx-admin-panel/`
- **Build**: `/app/styx-admin-panel/dist/`
- **Config**: `/app/styx-admin-panel/.env`
- **Deploy Package**: `/tmp/styx-admin-panel-deploy.zip`

### Backend (Disabled)
- **Source**: `/app/backend/`
- **Status**: Stopped and disabled

---

## 🔧 Environment Variables

### Customer Frontend
```bash
cat /app/frontend/.env
```
Key variable: `REACT_APP_API_URL`

### Admin Panel
```bash
cat /app/styx-admin-panel/.env
```
Key variable: `VITE_API_URL`

Both should point to: `https://unified-backend-4.emergent.host/api`

---

## 📖 Documentation Files

- **`FRONTEND_ONLY_MIGRATION_COMPLETE.md`** - Migration details
- **`ADMIN_DEPLOYMENT_COMPLETE_GUIDE.md`** - Admin panel deployment
- **`SUPERADMIN_SETUP_COMPLETE.md`** - Super admin setup
- **`ADMIN_SUBDOMAIN_DEPLOYMENT_STATUS.md`** - Subdomain deployment status

---

## 🐛 Quick Troubleshooting

### API Calls Not Working
```bash
# 1. Check backend is accessible
curl https://unified-backend-4.emergent.host/

# 2. Check frontend env variables
grep API_URL /app/frontend/.env
grep API_URL /app/styx-admin-panel/.env

# 3. Rebuild frontends if env changed
cd /app/frontend && yarn build
cd /app/styx-admin-panel && yarn build

# 4. Restart services
sudo supervisorctl restart all
```

### Service Not Running
```bash
# Check status
sudo supervisorctl status

# Start service
sudo supervisorctl start user-website
sudo supervisorctl start admin-panel

# Check logs for errors
tail -50 /var/log/supervisor/user-website.err.log
tail -50 /var/log/supervisor/admin-panel.err.log
```

---

## ⚡ Current Architecture

```
Frontends (Local)              Central Backend (Cloud)
├─ Customer Website        →   unified-backend-4.emergent.host
└─ Admin Panel (pending)   →   ↓
                               Database (Cloud)
```

**Key Points:**
- ✅ Both frontends are frontend-only
- ✅ All API calls go to central backend
- ✅ Local backend is disabled
- ✅ No local database dependency

---

**Last Updated**: November 18, 2025
