# Port Configuration Guide

## Current Setup (After Port Swap)

### Preview URL Mapping
**https://styx-inventory.preview.emergentagent.com/** → Port 3000 (Sporty Frontend)

### Port Assignments

| Service | Port | URL | Description |
|---------|------|-----|-------------|
| **Sporty Frontend** | 3000 | http://localhost:3000 | **PRIMARY** - Modern sports booking platform (shown on preview URL) |
| Styx Admin Panel | 3001 | http://localhost:3001 | Admin interface for Styx Cafe |
| Styx Customer Website | 3002 | http://localhost:3002 | Original Styx Cafe customer frontend |
| Backend API | 8001 | http://localhost:8001 | Node.js/Express backend for all apps |

## What Changed?

### Before Port Swap:
- Port 3000: Styx Customer Website (old)
- Port 3001: Styx Admin Panel
- Port 3002: Sporty Frontend (new)

### After Port Swap:
- Port 3000: **Sporty Frontend** ← Preview URL now points here
- Port 3001: Styx Admin Panel (unchanged)
- Port 3002: Styx Customer Website (moved here)

## Files Modified

1. **`/etc/supervisor/conf.d/sporty-frontend.conf`**
   - Changed from port 3002 to port 3000

2. **`/etc/supervisor/conf.d/supervisord.conf`**
   - Changed user-website from port 3000 to port 3002

3. **`/app/sporty-frontend/.env`**
   - Updated PORT=3000

4. **`/app/sporty-frontend/vite.config.js`**
   - Updated server.port to 3000

5. **`/app/styx-website/.env`**
   - Updated PORT=3002

## Why This Change?

The preview URL (`https://styx-inventory.preview.emergentagent.com/`) is configured to route traffic to **port 3000** by default. By moving the Sporty frontend to port 3000, the preview URL now correctly displays the new Sporty application instead of the old Styx website.

## Verification

### Check Services Status
```bash
sudo supervisorctl status
```

Expected output:
- sporty-frontend: RUNNING (on port 3000)
- user-website: RUNNING or STOPPED (on port 3002)
- admin-panel: RUNNING (on port 3001)
- backend: RUNNING (on port 8001)

### Test Ports
```bash
netstat -tlnp | grep -E ":(3000|3001|3002|8001)"
```

### Access URLs
- Sporty: http://localhost:3000 or https://styx-inventory.preview.emergentagent.com/
- Admin: http://localhost:3001
- Styx Website: http://localhost:3002
- Backend: http://localhost:8001

## Restart Services

If you need to restart services after making changes:

```bash
# Restart individual service
sudo supervisorctl restart sporty-frontend

# Restart all services
sudo supervisorctl restart all

# Check logs
tail -f /var/log/supervisor/sporty-frontend.out.log
```

## Rollback Instructions

If you need to revert to the old configuration:

1. Edit `/etc/supervisor/conf.d/sporty-frontend.conf` - change port to 3002
2. Edit `/etc/supervisor/conf.d/supervisord.conf` - change user-website port to 3000
3. Update `/app/sporty-frontend/.env` - set PORT=3002
4. Update `/app/sporty-frontend/vite.config.js` - set port to 3002
5. Update `/app/styx-website/.env` - set PORT=3000
6. Restart services: `sudo supervisorctl restart sporty-frontend user-website`

## Important Notes

- The preview URL automatically routes to port 3000
- Hot reload is enabled, so code changes reflect automatically
- Backend port (8001) should never be changed as it's configured in multiple .env files
- All frontend apps connect to the same backend on port 8001
