# Quick Deploy Guide - Render.com

## 🚀 Exact Commands to Run

### Step 1: Prepare Git Repository

```bash
# Navigate to project directory
cd C:\Users\Admin\social-feed-backend

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for Render deployment with SQLite"

# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/social-feed-backend.git

# Push to GitHub
git push -u origin main
```

### Step 2: Deploy on Render.com

#### Option A: Using Blueprint (Easiest)

1. Go to: https://dashboard.render.com
2. Click **"New +"** → **"Blueprint"**
3. Connect GitHub (if not connected)
4. Select repository: `social-feed-backend`
5. Click **"Apply"** (settings are auto-configured from `render.yaml`)

#### Option B: Manual Setup

1. Go to: https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `social-feed-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm ci && npx prisma generate`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

5. **Environment Variables** (click "Add Environment Variable" for each):
   ```
   NODE_ENV = production
   PORT = 3000
   DATABASE_URL = file:/data/dev.db
   JWT_SECRET = <click "Generate" or use a strong random string>
   JWT_REFRESH_SECRET = <click "Generate" or use a strong random string>
   JWT_ACCESS_EXPIRES_IN = 15m
   JWT_REFRESH_EXPIRES_IN = 7d
   RATE_LIMIT_WINDOW_MS = 900000
   RATE_LIMIT_MAX_REQUESTS = 100
   ```

6. Click **"Create Web Service"**

**⚠️ Note**: Free tier doesn't support persistent disks. Database data will be lost on redeploy. See `FREE_TIER_NOTE.md` for details.

### Step 3: Verify Deployment

After deployment completes (usually 2-5 minutes), test:

```bash
# Replace YOUR_APP_NAME with your Render app name
curl https://YOUR_APP_NAME.onrender.com/health
```

You should see:
```json
{"success":true,"message":"Server is running","timestamp":"..."}
```

## 📋 What Gets Pushed to GitHub

✅ **DO Commit:**
- All `src/` files
- `package.json`
- `prisma/schema.prisma`
- `render.yaml`
- `Dockerfile`
- `.dockerignore`
- `README.md`
- `DEPLOYMENT.md`
- `.env.example`
- `.gitignore`

❌ **DON'T Commit:**
- `.env` (contains secrets)
- `node_modules/` (auto-installed)
- `dev.db` (local database)
- `prisma/migrations/` (optional, Render creates them)

## 🔧 Render Settings Summary

| Setting | Value |
|---------|-------|
| **Build Command** | `npm ci && npx prisma generate` |
| **Start Command** | `npm start` |
| **Plan** | Free |
| **Database Path** | `file:./data/dev.db` |
| **Data Persistence** | ⚠️ Ephemeral (lost on redeploy) |

## 🎯 After Deployment

Your API will be available at:
```
https://YOUR_APP_NAME.onrender.com/api
```

Example endpoints:
- `GET https://YOUR_APP_NAME.onrender.com/health`
- `GET https://YOUR_APP_NAME.onrender.com/`
- `POST https://YOUR_APP_NAME.onrender.com/api/auth/register`
- `POST https://YOUR_APP_NAME.onrender.com/api/auth/login`

## ⚠️ Important Notes

1. **Free Tier**: Service may spin down after 15 min inactivity
2. **First Request**: May take 30-60 seconds if service was sleeping
3. **Database**: Stored at `/data/dev.db` (persistent across deployments)
4. **Auto-Deploy**: Pushing to `main` branch triggers automatic redeploy

## 🔄 Updating Your App

```bash
# Make changes, then:
git add .
git commit -m "Your update message"
git push origin main
```

Render will automatically redeploy!

