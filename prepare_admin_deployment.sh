#!/bin/bash

# Styx Cafe Admin Panel - Deployment Package Creator
# This script creates a clean package ready for deployment to a new Emergent project

set -e

echo "========================================"
echo "Styx Admin Panel Deployment Package"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Directories
SOURCE_DIR="/app/styx-admin-panel"
OUTPUT_DIR="/tmp/admin-panel-deploy"
ARCHIVE_NAME="styx-admin-panel-deploy.zip"

# Step 1: Clean up old package
echo -e "${YELLOW}[1/5]${NC} Cleaning up old deployment package..."
rm -rf "$OUTPUT_DIR"
rm -f "/tmp/$ARCHIVE_NAME"
mkdir -p "$OUTPUT_DIR"
echo -e "${GREEN}✓ Cleanup complete${NC}"
echo ""

# Step 2: Copy necessary files
echo -e "${YELLOW}[2/5]${NC} Copying admin panel files..."

# Create directory structure
mkdir -p "$OUTPUT_DIR/public"
mkdir -p "$OUTPUT_DIR/src"

# Copy main files
cp "$SOURCE_DIR/package.json" "$OUTPUT_DIR/"
cp "$SOURCE_DIR/vite.config.js" "$OUTPUT_DIR/"
cp "$SOURCE_DIR/index.html" "$OUTPUT_DIR/"
cp "$SOURCE_DIR/.env" "$OUTPUT_DIR/"
cp "$SOURCE_DIR/README.md" "$OUTPUT_DIR/"
cp "$SOURCE_DIR/DEPLOYMENT_TO_NEW_PROJECT.md" "$OUTPUT_DIR/"
cp "$SOURCE_DIR/eslint.config.js" "$OUTPUT_DIR/" 2>/dev/null || true

# Copy public directory
if [ -d "$SOURCE_DIR/public" ]; then
    cp -r "$SOURCE_DIR/public"/* "$OUTPUT_DIR/public/" 2>/dev/null || true
fi

# Copy src directory
if [ -d "$SOURCE_DIR/src" ]; then
    cp -r "$SOURCE_DIR/src"/* "$OUTPUT_DIR/src/" 2>/dev/null || true
fi

echo -e "${GREEN}✓ Files copied${NC}"
echo ""

# Step 3: Create .gitignore
echo -e "${YELLOW}[3/5]${NC} Creating .gitignore..."
cat > "$OUTPUT_DIR/.gitignore" << 'EOF'
# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Production
/dist
/build

# Misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db
EOF
echo -e "${GREEN}✓ .gitignore created${NC}"
echo ""

# Step 4: Create deployment README
echo -e "${YELLOW}[4/5]${NC} Creating quick start guide..."
cat > "$OUTPUT_DIR/QUICK_START.md" << 'EOF'
# Quick Start - Styx Admin Panel Deployment

## 📦 What's in this package

This is a complete, ready-to-deploy admin panel for Styx Cafe.

## 🚀 Deployment Options

### Option 1: Deploy to New Emergent Project (Recommended)

1. **Create a new Emergent project**
   - Go to https://app.emergent.sh
   - Create new project
   - Choose React/Vite template

2. **Upload these files**
   - Upload all files from this package
   - Or connect via GitHub

3. **Set environment variables in Emergent**
   ```
   VITE_API_URL=https://styxcafe.in/api
   VITE_GOOGLE_API_KEY=AIzaSyCp8LWxhq-nPpEs4msUOj_JX-3HXhFoFF8
   VITE_RAZOR_LIVE_KEY=rzp_test_XKXEVtmAb8x7DN
   VITE_RAZOR_LIVE_SECRET=FFmzsGqrPoTvQXifCAavr8Zl
   VITE_RAZOR_LIVE_TOKEN=cnpwX3Rlc3RfN0JoTGFGcHZwUDBlN2s6QXRxQ0gyVjhuUWhNb3hSSkNUYnFxc05w
   ```

4. **Configure custom domain**
   - Add domain: `admin.styxcafe.in`
   - Emergent will handle SSL

### Option 2: Deploy via GitHub

1. **Create new GitHub repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Styx Admin Panel"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Connect to Emergent**
   - Link GitHub repo to Emergent project
   - Configure environment variables
   - Deploy!

## 🔑 Login Credentials

### Super Admin
- Email: styxcafe@gmail.com
- Password: 10101984#rR
- URL: /superadmin/login

### Admin (Cafe Owner)
- Email: styx.mumbai@example.com
- Password: admin123
- URL: /admin/login

## 📖 Full Documentation

See `DEPLOYMENT_TO_NEW_PROJECT.md` for complete guide.

## ⚡ Local Testing

```bash
# Install dependencies
yarn install

# Start dev server
yarn dev

# Build for production
yarn build
```

---

**Need help?** See DEPLOYMENT_TO_NEW_PROJECT.md or contact support.
EOF
echo -e "${GREEN}✓ Quick start guide created${NC}"
echo ""

# Step 5: Create ZIP archive
echo -e "${YELLOW}[5/5]${NC} Creating deployment archive..."
cd /tmp
zip -r "$ARCHIVE_NAME" admin-panel-deploy/ -q
echo -e "${GREEN}✓ Archive created${NC}"
echo ""

# Final output
echo "========================================"
echo -e "${GREEN}Deployment Package Ready!${NC}"
echo "========================================"
echo ""
echo "📦 Package Location:"
echo "   /tmp/$ARCHIVE_NAME"
echo ""
echo "📁 Package Contents:"
echo "   - Complete admin panel source code"
echo "   - Environment configuration"
echo "   - Deployment documentation"
echo "   - Quick start guide"
echo ""
echo "📊 Package Size:"
du -h "/tmp/$ARCHIVE_NAME"
echo ""
echo "🚀 Next Steps:"
echo "   1. Download the ZIP file: /tmp/$ARCHIVE_NAME"
echo "   2. Create new Emergent project"
echo "   3. Upload or connect via GitHub"
echo "   4. Configure custom domain: admin.styxcafe.in"
echo ""
echo "📖 See QUICK_START.md in the package for detailed instructions"
echo ""
echo "✅ Done!"
