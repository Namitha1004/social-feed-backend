# Deployment Guide for Render.com

This guide explains how to deploy the Social Feed Backend to Render.com using SQLite.

## Prerequisites

1. GitHub account
2. Render.com account (free tier)
3. Git installed locally

## Step 1: Prepare Your Repository

### Files to Commit

Make sure these files are in your repository:
- ✅ All source code (`src/`)
- ✅ `package.json`
- ✅ `prisma/schema.prisma`
- ✅ `Dockerfile` (optional, Render can build without it)
- ✅ `render.yaml` (for blueprint deployment)
- ✅ `.env.example` (for reference)
- ✅ `README.md`

### Files NOT to Commit

These should be in `.gitignore`:
- ❌ `.env`
- ❌ `node_modules/`
- ❌ `dev.db` (local database)
- ❌ `prisma/migrations/` (optional, Render will create them)

## Step 2: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Ready for Render deployment"

# Add your GitHub remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/social-feed-backend.git

# Push to GitHub
git push -u origin main
```

## Step 3: Deploy on Render.com

### Option A: Using Blueprint (Recommended)

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub account if not already connected
4. Select your repository: `social-feed-backend`
5. Render will detect `render.yaml` automatically
6. Review the settings (they're pre-configured)
7. Click **"Apply"**

### Option B: Manual Setup

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `social-feed-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm ci && npx prisma generate`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

5. **Add Environment Variables**:
   ```
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=file:/data/dev.db
   JWT_SECRET=<generate a strong secret>
   JWT_REFRESH_SECRET=<generate another strong secret>
   JWT_ACCESS_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

6. **Add Persistent Disk**:
   - Click **"Disks"** tab
   - Click **"Link New Disk"**
   - **Name**: `data-disk`
   - **Mount Path**: `/data`
   - **Size**: `1 GB` (free tier limit)

7. Click **"Create Web Service"**

## Step 4: First Deployment

On first deploy, Render will:
1. Install dependencies
2. Generate Prisma Client
3. Create the database file at `/data/dev.db`
4. Run migrations (if any) or push schema

## Step 5: Verify Deployment

Once deployed, test your API:

```bash
# Health check
curl https://your-app-name.onrender.com/health

# Root endpoint
curl https://your-app-name.onrender.com/
```

## Important Notes

### Database Persistence

- SQLite database is stored at `/data/dev.db` (persistent disk)
- Data persists across deployments
- **Backup**: Consider exporting data periodically

### Environment Variables

- `JWT_SECRET` and `JWT_REFRESH_SECRET` are auto-generated in `render.yaml`
- You can manually set them in Render dashboard for more control

### Free Tier Limitations

- Service may spin down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- 750 hours/month free (enough for 24/7 if you're the only user)

### Updating the App

Just push to your `main` branch:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

Render will automatically redeploy.

## Troubleshooting

### Database Not Found

If you see database errors:
1. Check that persistent disk is mounted at `/data`
2. Verify `DATABASE_URL=file:/data/dev.db` in environment variables
3. Check Render logs for initialization errors

### Build Fails

- Ensure `prisma` is in `dependencies` (not `devDependencies`)
- Check that `postinstall` script runs: `npx prisma generate`

### Service Won't Start

- Check Render logs for errors
- Verify all environment variables are set
- Ensure port is set to `3000` (Render auto-assigns PORT env var)

## Production Checklist

- [ ] All environment variables set
- [ ] Persistent disk mounted at `/data`
- [ ] Database initialized successfully
- [ ] Health endpoint responding
- [ ] API endpoints working
- [ ] CORS configured (if needed for frontend)

