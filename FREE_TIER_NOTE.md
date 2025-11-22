# ⚠️ Important: Free Tier Limitations

## SQLite on Render Free Tier

**Important**: Render's free tier does **NOT support persistent disks**. This means:

### Data Persistence
- ✅ Data persists during the service's uptime
- ❌ Data is **LOST** when the service:
  - Redeploys (git push)
  - Spins down after 15 minutes of inactivity
  - Restarts for any reason

### Current Configuration

The database is stored at: `./data/dev.db` (in the app directory)

This works for:
- ✅ Development and testing
- ✅ Demo purposes
- ✅ Learning/experimentation

**NOT suitable for:**
- ❌ Production with real users
- ❌ Data that must persist

## Solutions

### Option 1: Accept Ephemeral Data (Current Setup)
- Data exists only while service is running
- Good for testing/demos
- No additional setup needed

### Option 2: Use Render PostgreSQL (Free Tier)
Render offers a **free PostgreSQL database** that persists data:

1. In Render Dashboard: **"New +"** → **"PostgreSQL"**
2. Create a free PostgreSQL database
3. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
4. Update `render.yaml`:
   ```yaml
   - key: DATABASE_URL
     fromDatabase:
       name: your-db-name
       property: connectionString
   ```

### Option 3: External Database Service
- **Supabase** (free tier PostgreSQL)
- **Railway** (free tier PostgreSQL)
- **Neon** (free tier PostgreSQL)

### Option 4: Upgrade to Paid Plan
- Render paid plans support persistent disks
- Data will persist across deployments

## Current Setup Works For

✅ Testing API endpoints
✅ Development
✅ Learning
✅ Demo projects
✅ Non-critical applications

## Migration Path

If you need persistent data later:
1. Create a Render PostgreSQL database (free)
2. Update Prisma schema to use PostgreSQL
3. Run migrations
4. Deploy

The code structure supports both SQLite and PostgreSQL - just change the datasource provider!

