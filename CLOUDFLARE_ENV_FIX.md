# Cloudflare Pages Environment Variable Fix

## 🔥 CRITICAL ISSUE IDENTIFIED

Your backend is working perfectly! The issue is that **Vite environment variables are embedded at BUILD TIME**, not runtime.

This means:
1. You must set env vars BEFORE building on Cloudflare Pages
2. Changes to env vars require a NEW deployment (rebuild)
3. The current deployed build might have wrong/missing `VITE_API_URL`

---

## ✅ Step-by-Step Fix

### Step 1: Set Environment Variables on Cloudflare Pages

1. Go to **Cloudflare Dashboard** → **Pages**
2. Click your project name
3. Go to **Settings** → **Environment variables**
4. Add these for **Production** (and Preview if needed):

| Variable Name | Value |
|--------------|-------|
| `VITE_API_URL` | `https://litein-municipal.onrender.com` |
| `VITE_SUPABASE_URL` | `https://kgbplquapfidrwnhtdnq.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnYnBscXVhcGZpZHJ3bmh0ZG5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5OTA2ODgsImV4cCI6MjA5NjU2NjY4OH0.aUDo_oYKBCQv1DHsbE3TVyf-owx6FdBx8oOpFFzapU4` |

**IMPORTANT:** Make sure there are NO typos and NO trailing slashes!

### Step 2: Trigger a New Deployment

After adding environment variables, you MUST rebuild:

**Option A: Trigger Retry (Easiest)**
1. Go to **Deployments** tab
2. Click the three dots on latest deployment
3. Click **"Retry deployment"**

**Option B: Push a Change**
```bash
cd frontend
git commit --allow-empty -m "chore: trigger rebuild with env vars"
git push
```

### Step 3: Verify Build Logs

1. Go to Cloudflare **Deployments** tab
2. Click on the running/latest deployment
3. Look for the **Build log**
4. Search for `VITE_API_URL` - you should see it being picked up

Expected to see something like:
```
Building with environment variables:
VITE_API_URL=https://litein-municipal.onrender.com
```

### Step 4: Clear Browser Cache & Test

After new deployment succeeds:

1. **Hard refresh** your site: `Ctrl + Shift + R` (or `Cmd + Shift + R` on Mac)
2. Or open in **Incognito/Private window**
3. Open **DevTools** (F12) → **Console**
4. Look for any errors

### Step 5: Verify in Browser

Run this in the browser console on your deployed site:

```javascript
// Check what URL the app is trying to use
console.log('API URL:', import.meta.env.VITE_API_URL);

// Test direct fetch
fetch('https://litein-municipal.onrender.com/api/news')
  .then(r => r.json())
  .then(d => console.log('✅ Backend works! News count:', d.data.length))
  .catch(e => console.error('❌ Error:', e));
```

---

## 🔍 Verification Checklist

- [ ] Environment variables added on Cloudflare Pages
- [ ] New deployment triggered
- [ ] Build completed successfully
- [ ] Build logs show `VITE_API_URL` being set
- [ ] Hard refresh browser (Ctrl+Shift+R)
- [ ] Console shows no "Failed to fetch" errors
- [ ] News loads on homepage

---

## 🐛 Still Not Working?

### Debug 1: Check Built Files

The built JavaScript files should contain your Render URL. After deployment:

1. Open your site: https://litein-municipal.pages.dev
2. Open DevTools → Sources/Debugger tab
3. Find `assets/index-[hash].js` files
4. Search (Ctrl+F) for `litein-municipal.onrender.com`
5. If NOT found → env vars weren't picked up during build

### Debug 2: Check Network Tab

1. Open your site
2. Open DevTools → Network tab
3. Refresh page
4. Filter by "news"
5. Click on the failed request
6. Check:
   - **Request URL**: Should be `https://litein-municipal.onrender.com/api/news`
   - **Status**: What error code?
   - **Headers**: Check Response headers for CORS

### Debug 3: Test Both Endpoints Separately

In browser console on deployed site:

```javascript
// Test 1: Direct backend (should work)
fetch('https://litein-municipal.onrender.com/api/news', {
  method: 'GET',
  headers: { 'Origin': 'https://litein-municipal.pages.dev' }
})
.then(r => r.json())
.then(d => console.log('✅ Direct fetch works:', d.data.length))
.catch(e => console.error('❌ Direct fetch failed:', e));

// Test 2: Using app's env var (should work after fix)
const API_URL = import.meta.env.VITE_API_URL || 'fallback-url';
console.log('App is using API URL:', API_URL);
```

---

## 🎯 Root Cause Explained

**Why this happens:**

1. Vite bundles your app at **build time**
2. It replaces `import.meta.env.VITE_API_URL` with the actual value
3. If env var isn't set during build → it uses fallback or `undefined`
4. The bundled JS file has hardcoded values
5. Changing env vars after build = no effect

**This is different from Node.js:**
- Node.js reads `.env` at runtime ✅
- Vite embeds env vars during build ⚠️

**The fix:**
- Set env vars in Cloudflare Pages settings
- Rebuild/redeploy to pick up changes
- Env vars become part of bundled code

---

## 📝 Prevention for Future

### Always Remember:

1. **Any change to `VITE_*` env vars requires rebuild**
2. **Test locally first:**
   ```bash
   cd frontend
   npm run build
   npm run preview  # Test production build locally
   ```

3. **Check build logs** after every deployment

4. **Use build-time detection:**
   ```javascript
   // In your code, log during development
   if (import.meta.env.DEV) {
     console.log('Using API:', import.meta.env.VITE_API_URL);
   }
   ```

---

## 🚀 Quick Test Commands

After fixing, verify everything works:

```bash
# Test backend health
curl https://litein-municipal.onrender.com/health

# Test backend news API
curl https://litein-municipal.onrender.com/api/news

# Test CORS with origin header
curl -H "Origin: https://litein-municipal.pages.dev" https://litein-municipal.onrender.com/api/news -I
```

All should return 200 OK with proper CORS headers.
