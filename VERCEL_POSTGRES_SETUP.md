# Vercel Postgres Setup Guide

## Quick Start (5 minutes)

### Step 1: Create Vercel Postgres Database
1. Go to https://vercel.com/dashboard
2. Select your `protocole-core` project
3. Click **Storage** tab
4. Click **Create Database** → **Postgres**
5. Choose a region and confirm

Vercel will automatically add these environment variables:
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NO_SSL` 
- `POSTGRES_URL_SSL`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_HOST`
- `POSTGRES_PORT`
- `POSTGRES_DATABASE`

### Step 2: Redeploy
Once database is created, simply push a new commit or redeploy from Vercel dashboard. The app will auto-connect.

### Step 3: Verify
Dashboard at `https://quiz.protocolecore.com/dashboard` will now show quiz submissions.

## Environment Variables

Your Vercel Postgres connection string will be in `POSTGRES_PRISMA_URL`. The app automatically reads this.

## What's Ready

- ✅ Quiz API: collects and logs submissions
- ✅ Dashboard API: fetches results from Postgres
- ✅ Local dev: uses SQLite (in `prisma/dev.db`)
- ✅ Production: automatically uses Vercel Postgres

## No Additional Code Changes Needed

The current code is ready to go. Just set up the database and deploy!

## Troubleshooting

**Dashboard still shows "0 résultats"?**
- Check that the database was created successfully in Vercel
- Verify environment variables are set in Vercel dashboard
- Click "Redeploy" in Vercel to apply new environment variables

**Need to test locally?**
```bash
npm run dev
# Navigate to http://localhost:3000/dashboard
# Should show empty (uses local SQLite)
```

That's it! 🚀
