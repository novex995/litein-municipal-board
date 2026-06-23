# Deployment Diagnostics & Fixes

## Issue: Frontend Cannot Fetch Data from Backend

### Symptoms
- Console shows: `Error fetching news: TypeError: Failed to fetch`
- Multiple network errors in browser console
- Frontend deployed on Cloudflare Pages
- Backend deployed on Render

---

## Root Causes & Solutions

### 1. **Backend Not Running or Wrong URL**

**Check:**
```bash
# Test if your backend is accessible
curl https://litein-municipal.onrender.com/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "timestamp": "...",
  "uptime": ...,
  "environment": "production"
}
```

**Fixes:**
- Verify your Render service name matches: `litein-municipal`
- Check Render dashboard to ensure service is running
- Look for startup errors in Render logs
- Ensure Render service hasn't been suspended (free tier auto-suspends after inactivity)

---

### 2. **CORS Origin Mismatch**

**Issue:** Your Cloudflare Pages URL might be different from what's configured in backend CORS.

**Current Backend CORS Config:**
```javascript
origin: ['https://litein-municipal.pages.dev', 'http://localhost:5173']
```

**Check Your Actual Cloudflare URL:**
1. Go to Cloudflare Pages dashboard
2. Find your deployment URL (it might be `litein-municipal-xyz.pages.dev`)
3. Copy the exact URL

**Fix:** Update backend `server.js` CORS configuration:
```javascript
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'https://litein-municipal.pages.dev',
      'https://litein-municipal-board.pages.dev', // Add variations
      'http://localhost:5173',
      'http://localhost:5000'
    ];
    
    // Allow any *.pages.dev domain for Cloudflare Pages
    if (origin.endsWith('.pages.dev')) {
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
```

---

### 3. **Environment Variables Not Set on Cloudflare Pages**

**Check:**
1. Go to Cloudflare Pages dashboard
2. Click on your project
3. Go to Settings → Environment Variables
4. Verify `VITE_API_URL` is set to: `https://litein-municipal.onrender.com`

**Required Environment Variables on Cloudflare:**
```
VITE_API_URL=https://litein-municipal.onrender.com
VITE_SUPABASE_URL=https://kgbplquapfidrwnhtdnq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**After adding/updating:**
- Trigger a new deployment (Deployments → Retry deployment)

---

### 4. **Environment Variables Not Set on Render**

**Check Render Environment Variables:**
1. Go to Render dashboard
2. Click on your backend service
3. Go to Environment tab
4. Verify ALL variables from `.env` are present

**Required Variables:**
```
NODE_ENV=production
PORT=5000
SUPABASE_URL=https://kgbplquapfidrwnhtdnq.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT_SECRET=your-secure-jwt-secret-here
FRONTEND_URL=https://litein-municipal.pages.dev
GMAIL_USER=novex995@gmail.com
GMAIL_APP_PASSWORD=uzbnfvuoyfxpjlgs
```

---

### 5. **Render Service Sleeping (Free Tier)**

**Issue:** Render free tier spins down after 15 minutes of inactivity.

**Symptoms:**
- First request takes 30-60 seconds
- Subsequent requests are fast
- Frontend times out on first load

**Solutions:**
1. **Wait for spin-up**: First request can take 30-60 seconds
2. **Keep-alive service**: Set up a cron job to ping every 14 minutes
3. **Upgrade to paid plan**: Paid plans don't spin down

**Quick Test:**
```bash
# Wait 60 seconds and try again
curl https://litein-municipal.onrender.com/health
```

---

## Step-by-Step Fix Process

### Step 1: Verify Backend is Running
```bash
# Test health endpoint
curl https://litein-municipal.onrender.com/health

# Test news endpoint
curl https://litein-municipal.onrender.com/api/news
```

### Step 2: Check Browser Network Tab
1. Open deployed site
2. Open DevTools (F12)
3. Go to Network tab
4. Refresh page
5. Look for failed requests
6. Check:
   - Request URL (is it correct?)
   - Status Code (what error?)
   - Response (any CORS errors?)

### Step 3: Test CORS
Open browser console on your Cloudflare Pages site and run:
```javascript
fetch('https://litein-municipal.onrender.com/health')
  .then(r => r.json())
  .then(d => console.log('✅ Backend accessible:', d))
  .catch(e => console.error('❌ Error:', e))
```

### Step 4: Check Exact URLs
1. **Cloudflare Pages URL**: Check your actual deployment URL
2. **Render Backend URL**: Verify in Render dashboard
3. Update CORS configuration if needed

---

## Quick Fixes to Apply Now

### Fix 1: Update Backend CORS (Relaxed)
This allows any Cloudflare Pages subdomain:

```javascript
// In backend/src/server.js
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (origin.endsWith('.pages.dev') || origin.includes('localhost')) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
```

### Fix 2: Add OPTIONS Handler
```javascript
// In backend/src/server.js - before routes
app.options('*', cors()); // Enable pre-flight for all routes
```

### Fix 3: Add Logging
```javascript
// In backend/src/server.js - after CORS
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});
```

---

## Testing Checklist

- [ ] Backend `/health` endpoint responds
- [ ] Backend `/api/news` endpoint responds
- [ ] Cloudflare environment variables are set
- [ ] Render environment variables are set
- [ ] CORS allows your Cloudflare Pages domain
- [ ] Frontend `.env` has correct `VITE_API_URL`
- [ ] Both services redeployed after changes

---

## Common Gotchas

1. **Build vs Runtime Env Vars**: Cloudflare needs env vars set BEFORE build
2. **Trailing Slashes**: Don't mix `https://api.com` and `https://api.com/`
3. **HTTPS Required**: Mixed content (HTTP backend, HTTPS frontend) will fail
4. **Case Sensitivity**: URLs are case-sensitive
5. **Rebuild Required**: Changes to env vars require rebuild/redeploy

---

## Still Not Working?

1. Check Render logs for errors
2. Check Cloudflare deployment logs
3. Verify Supabase is accessible
4. Test with Postman/curl to isolate frontend vs backend issue
5. Share specific error messages
