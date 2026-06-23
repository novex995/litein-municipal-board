# Fix Railway Build Error - Set Root Directory

## Error
```
Deployment failed during the build process
Config Error: Set the root directory to "backend" in the service settings
```

## Cause
Railway is trying to build from the repository root (`/`), but your Node.js backend is in the `backend/` subdirectory.

---

## Solution: Set Root Directory

### Step 1: Go to Service Settings

1. **In Railway dashboard:** https://railway.app/project/your-project
2. **Click** on your service name (litein-municipal-board)
3. **Click** the **Settings** tab (⚙️ gear icon on left sidebar)

### Step 2: Configure Root Directory

1. **Scroll down** to find **"Root Directory"** or **"Service Settings"**
2. **Look for:** "Root Directory" or "Source" section
3. **Enter:** `backend` (just the word "backend", no slashes)
4. **Save** (it might auto-save)

### Step 3: Set Other Settings (If Needed)

While you're in Settings, verify these:

- **Root Directory:** `backend`
- **Build Command:** (leave empty or `npm install`)
- **Start Command:** `npm start` or `node src/server.js`
- **Node Version:** 18.x or 20.x (leave default if not specified)

### Step 4: Trigger Redeploy

1. **Go to** "Deployments" tab
2. **Click** the three dots (...) on the failed deployment
3. **Click** "Redeploy"

Or just wait a few seconds - Railway might auto-deploy after settings change.

---

## Expected Result

After setting root directory, you should see:

```
✓ Initialization (00:02)
✓ Build > Build image (00:45)
✓ Build > Start container
✓ Deploy
```

And your backend will be live!

---

## Visual Checklist

In Railway Settings tab:

```
Service Settings
├─ Root Directory: backend         ← SET THIS
├─ Build Command: (auto-detected)
├─ Start Command: npm start
└─ Environment: production
```

---

## If Build Still Fails

### Check package.json

Make sure `backend/package.json` has:

```json
{
  "scripts": {
    "start": "node src/server.js"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### Check Environment Variables

In Railway, go to **"Variables"** tab and verify all these are set:

```
NODE_ENV=production
PORT=5000
SUPABASE_URL=https://kgbplquapfidrwnhtdnq.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
SUPABASE_ANON_KEY=your-anon-key
JWT_SECRET=your-jwt-secret
FRONTEND_URL=https://litein-municipal.pages.dev
GMAIL_USER=novex995@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password
```

---

## Alternative: Use railway.toml

If UI settings don't work, create a configuration file:

**Create:** `railway.toml` in repository root

```toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "npm start"
healthcheckPath = "/health"
healthcheckTimeout = 30
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10

[[services]]
name = "backend"
source = "backend"
```

**Commit and push:**
```bash
cd "/c/Users/HP/Documents/LITEIN MUNICIPAL BOARD"
git add railway.toml
git commit -m "chore: add Railway configuration"
git push
```

Railway will pick up the config automatically.

---

## Quick Navigation

**In Railway Dashboard:**

1. Left sidebar → Click your service
2. Tabs at top:
   - **Details** - Overview
   - **Build Logs** - See build errors
   - **Deploy Logs** - See runtime logs
   - **Settings** ⚙️ - Configure root directory
   - **Variables** - Environment variables
   - **Networking** - Generate domain

---

## After Successful Deploy

1. **Go to Settings** → **Networking**
2. **Click** "Generate Domain"
3. **Copy** your Railway URL (e.g., `litein-backend-production.up.railway.app`)
4. **Use this URL** in your Cloudflare Pages environment variables

---

## Test Your Backend

After deployment succeeds:

```bash
# Test health endpoint
curl https://your-app.up.railway.app/health

# Test news API
curl https://your-app.up.railway.app/api/news
```

Both should return 200 OK.

---

## Common Issues

### Issue: "Could not find package.json"
**Cause:** Root directory not set correctly  
**Fix:** Make sure it's exactly `backend` (no `/` or extra spaces)

### Issue: "Module not found"
**Cause:** npm install didn't run  
**Fix:** Check Build Logs, verify package.json exists in backend folder

### Issue: "Port already in use"
**Cause:** Multiple services trying to use same port  
**Fix:** Railway handles this automatically, just redeploy

---

## Screenshot Reference

When in Settings, you should see something like:

```
┌─ Service Settings ─────────────────┐
│                                    │
│ Root Directory                     │
│ ┌────────────────────────────────┐ │
│ │ backend                        │ │
│ └────────────────────────────────┘ │
│                                    │
│ Start Command                      │
│ ┌────────────────────────────────┐ │
│ │ npm start                      │ │
│ └────────────────────────────────┘ │
│                                    │
└────────────────────────────────────┘
```

---

## Next Steps

Once Railway deploys successfully:

1. ✅ Get Railway URL from Networking tab
2. ✅ Update Cloudflare Pages VITE_API_URL
3. ✅ Redeploy frontend
4. ✅ Test entire application

See `DEPLOY_TO_RAILWAY_NEW_ACCOUNT.md` for complete guide.
