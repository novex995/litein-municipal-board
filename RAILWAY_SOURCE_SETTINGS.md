# Set Railway Root Directory to Backend

## Current Issue
Railway is showing 404 "Application not found" because it's trying to run from the repository root instead of the `backend/` folder.

---

## Solution: Configure Source Settings in Railway

### Step 1: Go to Service Settings

1. **Open Railway Dashboard:** https://railway.app
2. **Click** on your service (litein-municipal-board)
3. **Click** the "Settings" tab (or gear icon ⚙️)

### Step 2: Find "Source" Section

Scroll down or click **"Source"** from the right-side menu.

### Step 3: Set Root Directory

Look for these fields:

```
┌─ Source ──────────────────────────┐
│                                   │
│ Root Directory                    │
│ ┌───────────────────────────────┐ │
│ │ backend                       │ │ ← Type this
│ └───────────────────────────────┘ │
│                                   │
│ Watch Paths                       │
│ ┌───────────────────────────────┐ │
│ │ backend/**                    │ │ ← Already set
│ └───────────────────────────────┘ │
│                                   │
└───────────────────────────────────┘
```

**Enter:** `backend` in the Root Directory field

### Step 4: Save and Redeploy

1. The setting should auto-save
2. Railway will automatically redeploy
3. Or manually trigger redeploy from Deployments tab

---

## Alternative: Check Build Settings

If "Source" doesn't have Root Directory field, check these settings:

### In Settings Tab:

1. **Start Command:**
   ```
   npm start
   ```
   (Railway should auto-detect this from package.json)

2. **Build Command:** (leave empty or)
   ```
   npm install
   ```

3. **Root Directory:** `backend`

---

## Verify Deployment

After Railway redeploys (takes 2-5 minutes):

### Test Health Endpoint:
```bash
curl https://litein-municipal-board-production.up.railway.app/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "timestamp": "2026-06-23T...",
  "uptime": 123.456,
  "environment": "production"
}
```

### Test News API:
```bash
curl https://litein-municipal-board-production.up.railway.app/api/news
```

**Expected Response:**
```json
{
  "success": true,
  "data": [...]
}
```

---

## If Railway UI Doesn't Show Root Directory Option

Railway might detect the root directory automatically if you have `railway.toml` in the repository root (which we just pushed).

### Check railway.toml File:

The file exists at the root of your repository with:

```toml
[build]
builder = "NIXPACKS"
buildCommand = "cd backend && npm install"

[deploy]
startCommand = "cd backend && npm start"
healthcheckPath = "/health"
healthcheckTimeout = 30
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10

[environments.production]
watch = ["backend/**"]
```

This should tell Railway to:
1. Build from the backend directory
2. Start from the backend directory
3. Watch backend files for changes

---

## Watch the Deployment

1. **Go to** "Deployments" tab in Railway
2. **Click** on the latest deployment
3. **Check "Build Logs"** for errors
4. **Check "Deploy Logs"** for runtime errors

### Look for These Lines:

**In Build Logs:**
```
✓ Building
✓ Installing dependencies
✓ npm install completed
```

**In Deploy Logs:**
```
✓ Litein Municipal Board API Server
✓ Environment: production
✓ Port: 5000
✓ Health: /health
```

---

## Common Errors & Solutions

### Error: "Cannot find module"
**Cause:** Build ran in wrong directory  
**Fix:** Set root directory to `backend`

### Error: "ENOENT: no such file or directory, open 'package.json'"
**Cause:** Railway looking for package.json in root instead of backend/  
**Fix:** Set root directory to `backend`

### Error: "Application not found (404)"
**Cause:** Service not deployed or wrong route  
**Fix:** 
1. Check deployment status (should be green)
2. Verify root directory is set
3. Check deploy logs for errors

### Error: "Port 5000 is already in use"
**Cause:** Railway runs multiple instances  
**Fix:** Change to use Railway's PORT env var (already done in code)

---

## Visual Steps with Screenshots Reference

Since you're in the Railway dashboard:

1. **Current Tab:** Settings ✅
2. **Look for:** "Source" button on right sidebar
3. **Click:** Source
4. **Find:** Root Directory field
5. **Type:** `backend`
6. **Result:** Railway auto-saves and redeploys

---

## After Successful Deployment

Your backend will be live at:
```
https://litein-municipal-board-production.up.railway.app
```

### Endpoints Available:
- `/health` - Health check
- `/api/news` - Get news articles
- `/api/projects` - Get projects
- `/api/complaints` - Submit/view complaints
- `/api/auth/login` - Admin login
- `/api/newsletter/subscribe` - Newsletter signup

### Update Frontend:

Your Cloudflare Pages is already configured with:
```
VITE_API_URL=https://litein-municipal-board-production.up.railway.app
```

Just make sure to **redeploy the frontend** after backend is live and working.

---

## Need Help?

If you can't find the Root Directory setting:

1. Take a screenshot of the Settings tab
2. Look for any "monorepo" or "workspace" settings
3. Check if railway.toml is working (check build logs)
4. Railway support: https://railway.app/discord
