# Cloudflare Pages Environment Variables Setup

## Problem
The frontend deployed on Cloudflare Pages shows "Error fetching news: SyntaxError: Unexpected token < in JSON" because it cannot access the Railway backend API.

## Root Cause
Environment variables from your local `.env` file are NOT automatically available in Cloudflare Pages deployments. You must set them in the Cloudflare dashboard.

## Solution

### Step 1: Access Cloudflare Pages Dashboard
1. Go to https://dash.cloudflare.com/
2. Click on **Workers & Pages** in the left sidebar
3. Find and click on your project: **litein-municipal-board**

### Step 2: Add Environment Variables
1. Click on the **Settings** tab
2. Scroll down to **Environment variables** section
3. Click **Add variable** button

### Step 3: Add Required Variables

Add the following environment variables:

#### Production Environment
| Variable Name | Value |
|--------------|-------|
| `VITE_API_URL` | `https://litein-municipal-board-production.up.railway.app` |
| `VITE_SUPABASE_URL` | `https://kgbplquapfidrwnhtdnq.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnYnBscXVhcGZpZHJ3bmh0ZG5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5OTA2ODgsImV4cCI6MjA5NjU2NjY4OH0.aUDo_oYKBCQv1DHsbE3TVyf-owx6FdBx8oOpFFzapU4` |

**Important:** Make sure to select **Production** environment when adding each variable.

### Step 4: Trigger Redeploy
After adding all environment variables, you need to redeploy:

**Option A: Push a new commit**
```bash
cd frontend
git add .
git commit -m "Trigger redeploy for env vars"
git push
```

**Option B: Manual redeploy**
1. In Cloudflare Pages dashboard
2. Go to **Deployments** tab
3. Find the latest deployment
4. Click the three dots menu
5. Click **Retry deployment**

### Step 5: Verify
1. Wait for deployment to complete (usually 1-3 minutes)
2. Visit your site: https://litein-municipal-board.pages.dev/
3. Open browser DevTools (F12) → Console tab
4. Check if news articles load without errors
5. Look for successful API calls in Network tab

## Common Issues

### Issue 1: Environment Variables Not Applied
**Solution:** Redeploy after adding variables. Environment variables are only applied during build time, not immediately.

### Issue 2: Still Getting CORS Errors
**Solution:** Verify the Railway backend has the correct CORS configuration:
- Check `backend/.env` has: `FRONTEND_URL=https://litein-municipal-board.pages.dev`
- Redeploy Railway backend if you changed this

### Issue 3: 404 Errors from API
**Solution:** 
- Verify `VITE_API_URL` has NO trailing slash
- Should be: `https://litein-municipal-board-production.up.railway.app`
- NOT: `https://litein-municipal-board-production.up.railway.app/`

## Testing Locally vs Production

### Local Development
- Uses `frontend/.env` file
- Works with `npm run dev`
- Environment: Development

### Production (Cloudflare Pages)
- Uses Cloudflare dashboard environment variables
- Accessed via `https://litein-municipal-board.pages.dev/`
- Environment: Production

## Quick Test Commands

Test if backend is working:
```bash
curl https://litein-municipal-board-production.up.railway.app/api/news?limit=3
```

Test if frontend can reach backend (run in browser console):
```javascript
fetch('https://litein-municipal-board-production.up.railway.app/api/news?limit=3')
  .then(r => r.json())
  .then(d => console.log(d))
```

## Status
- ✅ Backend deployed on Railway: Working correctly
- ✅ Frontend deployed on Cloudflare Pages: Working
- ❌ **Environment variables needed**: Add to Cloudflare dashboard
- ⏳ **Action required**: Follow steps above

Last updated: 2026-06-24
