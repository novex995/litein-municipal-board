# Quick Deployment Fix - CORS & Network Issues

## 🔥 Immediate Actions Required

### 1. Test Backend Availability (Right Now!)

Open a terminal and run:
```bash
curl https://litein-municipal.onrender.com/health
```

**If this fails or times out:**
- Your Render service is down or sleeping
- Go to Render dashboard and check service status
- Wait 60 seconds (free tier needs to spin up)
- Try again

**If it succeeds:**
- Continue to step 2

---

### 2. Update Backend on Render

#### A. Push Updated Code
```bash
cd backend
git add .
git commit -m "fix: update CORS to allow all Cloudflare Pages subdomains"
git push
```

Render should auto-deploy. Check logs for:
```
✓ Environment: production
✓ Port: 5000
```

#### B. Verify Environment Variables on Render
Go to Render Dashboard → Your Service → Environment:

**Make sure these exist:**
```
NODE_ENV=production
SUPABASE_URL=https://kgbplquapfidrwnhtdnq.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnYnBscXVhcGZpZHJ3bmh0ZG5xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDk5MDY4OCwiZXhwIjoyMDk2NTY2Njg4fQ.EzR-FH98TTyI2TFkJw9vhQUmRs_t6--fzR8BECxcnXQ
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnYnBscXVhcGZpZHJ3bmh0ZG5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5OTA2ODgsImV4cCI6MjA5NjU2NjY4OH0.aUDo_oYKBCQv1DHsbE3TVyf-owx6FdBx8oOpFFzapU4
JWT_SECRET=your-jwt-secret-key-change-in-production
FRONTEND_URL=https://litein-municipal.pages.dev
GMAIL_USER=novex995@gmail.com
GMAIL_APP_PASSWORD=uzbnfvuoyfxpjlgs
```

**Missing any?** Add them and trigger manual redeploy.

---

### 3. Check Cloudflare Pages Configuration

#### A. Get Your Exact Cloudflare URL
1. Go to Cloudflare Dashboard → Pages
2. Click your project
3. Look for the deployment URL (e.g., `https://litein-municipal.pages.dev` or `https://litein-municipal-abc123.pages.dev`)
4. **Copy this exact URL**

#### B. Set Environment Variables
1. In Cloudflare Dashboard → Your Project → Settings → Environment Variables
2. Add/verify these for **Production**:

```
VITE_API_URL=https://litein-municipal.onrender.com
VITE_SUPABASE_URL=https://kgbplquapfidrwnhtdnq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnYnBscXVhcGZpZHJ3bmh0ZG5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5OTA2ODgsImV4cCI6MjA5NjU2NjY4OH0.aUDo_oYKBCQv1DHsbE3TVyf-owx6FdBx8oOpFFzapU4
```

#### C. Redeploy Frontend
After adding/changing env vars:
```bash
cd frontend
git add .
git commit -m "chore: verify environment configuration"
git push
```

Or trigger "Retry deployment" in Cloudflare dashboard.

---

### 4. Test CORS from Browser

#### Method 1: Browser Console Test
1. Open your Cloudflare Pages site: https://litein-municipal.pages.dev
2. Open DevTools (F12) → Console
3. Paste and run:

```javascript
fetch('https://litein-municipal.onrender.com/health')
  .then(r => r.json())
  .then(d => console.log('✅ SUCCESS:', d))
  .catch(e => console.error('❌ FAILED:', e.message))
```

**Expected:** `✅ SUCCESS: {status: "OK", ...}`

**If CORS error:** Backend CORS not updated or not redeployed yet

#### Method 2: Test News Endpoint
```javascript
fetch('https://litein-municipal.onrender.com/api/news')
  .then(r => r.json())
  .then(d => console.log('✅ News count:', d.data?.length))
  .catch(e => console.error('❌ FAILED:', e.message))
```

---

### 5. Common Issues & Solutions

#### Issue: "Failed to fetch" in production but works locally
**Cause:** Environment variables not set on Cloudflare Pages  
**Fix:** Step 3B above, then redeploy

#### Issue: CORS error in console
**Cause:** Backend CORS doesn't allow your Cloudflare domain  
**Fix:** Backend update (Step 2), wait for Render redeploy

#### Issue: Backend responds after 30-60 seconds
**Cause:** Render free tier sleeping  
**Solution:** Normal behavior. First request wakes it up.

#### Issue: Network tab shows "net::ERR_NAME_NOT_RESOLVED"
**Cause:** Wrong backend URL in `VITE_API_URL`  
**Fix:** Verify URL in Cloudflare env vars (Step 3B)

---

## ✅ Verification Checklist

After completing steps above:

- [ ] `curl https://litein-municipal.onrender.com/health` returns JSON
- [ ] `curl https://litein-municipal.onrender.com/api/news` returns news array
- [ ] Backend logs show requests coming through (check Render logs)
- [ ] Cloudflare env vars are set correctly
- [ ] Render env vars are set correctly  
- [ ] Browser console test (Step 4) succeeds
- [ ] Frontend loads news without errors
- [ ] No CORS errors in browser Network tab

---

## 🐛 Still Broken? Debug Info Needed

If still not working, gather this info:

1. **Backend URL test:**
   ```bash
   curl -v https://litein-municipal.onrender.com/health
   ```

2. **Browser Network Tab:**
   - Take screenshot of failed request
   - Check: Status Code, Response Headers, Preview

3. **Render Logs:**
   - Copy last 50 lines showing startup and any errors

4. **Cloudflare Deployment Log:**
   - Check if build succeeded
   - Look for environment variable messages

5. **Exact URLs:**
   - Your actual Cloudflare Pages URL
   - Your actual Render backend URL
