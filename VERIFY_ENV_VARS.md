# How to Verify Environment Variables Are Working

## Problem: Frontend not fetching data from backend

Your backend is working perfectly. The issue is that **Cloudflare Pages doesn't have the environment variables set** or **they weren't picked up during build**.

---

## Quick Test (Do This First!)

### 1. Check Current Deployed Site

Open your deployed site: https://litein-municipal.pages.dev

Open browser console (F12) and paste:

```javascript
// Check what your app is using
console.log('API URL configured:', import.meta.env.VITE_API_URL);
console.log('All env vars:', import.meta.env);

// Test if backend is reachable
fetch('https://litein-municipal.onrender.com/api/news')
  .then(r => r.json())
  .then(d => console.log('✅ Backend works! Got', d.data.length, 'news items'))
  .catch(e => console.error('❌ Cannot reach backend:', e.message));
```

**Expected Results:**
- `API URL configured:` should show `https://litein-municipal.onrender.com`
- Backend test should show "✅ Backend works!"

**If you see:**
- `API URL configured: undefined` → Env vars not set on Cloudflare
- `❌ Cannot reach backend: Failed to fetch` → CORS issue (but we fixed this)

---

## Solution Steps

### Step 1: Set Environment Variables on Cloudflare Pages

1. **Login to Cloudflare Dashboard**
2. Go to **Workers & Pages** → **Pages**
3. Click your project (e.g., "litein-municipal")
4. Go to **Settings** → **Environment variables**

### Step 2: Add Variables for Production

Click "Add variable" and add these **THREE** variables:

#### Variable 1:
- **Variable name:** `VITE_API_URL`
- **Value:** `https://litein-municipal.onrender.com`
- **Environment:** Production (check the box)

#### Variable 2:
- **Variable name:** `VITE_SUPABASE_URL`
- **Value:** `https://kgbplquapfidrwnhtdnq.supabase.co`
- **Environment:** Production (check the box)

#### Variable 3:
- **Variable name:** `VITE_SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnYnBscXVhcGZpZHJ3bmh0ZG5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5OTA2ODgsImV4cCI6MjA5NjU2NjY4OH0.aUDo_oYKBCQv1DHsbE3TVyf-owx6FdBx8oOpFFzapU4`
- **Environment:** Production (check the box)

Click **"Save"** after each variable.

### Step 3: Force Rebuild

After adding variables, you MUST trigger a new build:

**Option A: Via Cloudflare Dashboard**
1. Go to **Deployments** tab
2. Find the latest deployment
3. Click the three dots (⋯) on the right
4. Click **"Retry deployment"**

**Option B: Via Git Push**
```bash
cd "c:\Users\HP\Documents\LITEIN MUNICIPAL BOARD\frontend"
git commit --allow-empty -m "chore: rebuild with environment variables"
git push
```

### Step 4: Wait for Build to Complete

1. Stay on the **Deployments** page
2. Wait for status to change to **"Success"** (usually 2-5 minutes)
3. Click on the deployment to see build logs

### Step 5: Check Build Logs

In the build logs, search for "VITE_" and verify you see:
```
VITE_API_URL=https://litein-municipal.onrender.com
```

If you don't see this, the variables weren't picked up.

### Step 6: Test Again

1. Open your site in a **new incognito/private window** (to avoid cache)
2. Open DevTools (F12) → Console
3. Run the test script from Step 1 above
4. You should now see the correct API URL
5. News should load on the homepage

---

## Alternative: Add Debug Component

To see the issue directly on your site, temporarily add the debug component:

### 1. Open `frontend/src/App.jsx`

Add at the top:
```javascript
import DebugInfo from './components/DebugInfo'
```

Add at the bottom of your JSX (before closing tag):
```javascript
{import.meta.env.DEV && <DebugInfo />}
```

### 2. Commit and Push

```bash
cd frontend
git add .
git commit -m "debug: add environment variable debugging"
git push
```

### 3. Check Deployed Site

After deployment, you'll see a debug panel at the bottom showing:
- Whether env vars are set
- Whether backend is reachable
- Exact values being used

### 4. Remove After Fixing

Once fixed, remove the `<DebugInfo />` component and push again.

---

## Common Issues

### Issue 1: "Variables are set but still showing NOT SET"

**Cause:** Old build is cached

**Fix:** 
1. Hard refresh: `Ctrl + Shift + R`
2. Or open in incognito window
3. Or clear browser cache

### Issue 2: "Rebuild doesn't pick up variables"

**Cause:** Variables might be set for wrong environment

**Fix:**
1. Double-check variables are for **Production** environment
2. Make sure there are no typos in variable names
3. Variable names must start with `VITE_` for Vite to pick them up

### Issue 3: "Backend test works but app doesn't load news"

**Cause:** Different issue in app code

**Fix:**
1. Check browser console for specific errors
2. Check Network tab to see actual request URL
3. Verify response in Network tab

---

## Verification Checklist

After completing all steps:

- [ ] Environment variables added on Cloudflare Pages
- [ ] All 3 variables (`VITE_API_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
- [ ] Set for "Production" environment
- [ ] New deployment triggered
- [ ] Build completed successfully
- [ ] Build logs show variables being set
- [ ] Opened site in incognito window
- [ ] Console test shows correct API URL
- [ ] Backend test passes
- [ ] News loads on homepage

---

## Still Not Working?

If you've completed ALL steps above and it still doesn't work:

1. **Take Screenshots:**
   - Cloudflare environment variables page
   - Build logs showing variable values
   - Browser console with test results
   - Browser Network tab showing failed requests

2. **Check Exact URLs:**
   - Your Cloudflare Pages URL: _______________
   - Your Render backend URL: _______________

3. **Test Backend Directly:**
   ```bash
   curl https://litein-municipal.onrender.com/health
   curl https://litein-municipal.onrender.com/api/news
   ```

4. **Share This Info:**
   - Browser console output
   - Network tab screenshot
   - Build log snippet showing env vars
