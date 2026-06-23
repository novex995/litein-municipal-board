# Deploy to Cyclic.sh (100% Free, No Credit Card, Always On)

## Why Cyclic?
- ✅ No credit card required
- ✅ No sleeping/spin-down
- ✅ Built for Node.js/Express
- ✅ GitHub auto-deploy
- ✅ 10k requests/month (enough for municipal board site)
- ✅ Environment variables support
- ✅ Faster than Render free tier

---

## 🚀 Deployment Steps (10 Minutes)

### Step 1: Prepare Your Backend

Make sure your `backend/package.json` has a start script:

```json
{
  "scripts": {
    "start": "node src/server.js"
  }
}
```

### Step 2: Push to GitHub (if not already)

```bash
cd "c:\Users\HP\Documents\LITEIN MUNICIPAL BOARD"
git add .
git commit -m "deploy: prepare for Cyclic"
git push
```

### Step 3: Sign Up on Cyclic

1. Go to https://www.cyclic.sh/
2. Click **"Deploy Now"** or **"Get Started"**
3. Sign in with GitHub
4. Authorize Cyclic to access your repositories

### Step 4: Deploy Your Backend

1. Click **"Link Your Own"** or **"Connect Repository"**
2. Select your repository: `litein-municipal` or similar
3. Cyclic will auto-detect it's a Node.js app
4. Click **"Connect"**

### Step 5: Configure Build Settings

**If asked:**
- **Root Directory:** `backend`
- **Build Command:** Leave empty (not needed)
- **Start Command:** `npm start` (auto-detected)
- **Node Version:** 18 or 20

### Step 6: Add Environment Variables

1. In Cyclic dashboard, go to **"Variables"** tab
2. Click **"Add Variable"** for each:

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

### Step 7: Deploy

Click **"Deploy"** or wait for auto-deploy to complete.

### Step 8: Get Your URL

After deployment:
1. Cyclic will give you a URL like: `https://your-app-name.cyclic.app`
2. Copy this URL
3. Test it: `https://your-app-name.cyclic.app/health`

### Step 9: Update Frontend

Update `frontend/.env`:
```
VITE_API_URL=https://your-app-name.cyclic.app
```

### Step 10: Update Cloudflare Pages

1. Go to Cloudflare Dashboard
2. Your project → Settings → Environment variables
3. Update `VITE_API_URL` to your new Cyclic URL
4. Trigger new deployment

---

## ✅ Verification

Test your new backend:
```bash
curl https://your-app-name.cyclic.app/health
curl https://your-app-name.cyclic.app/api/news
```

Both should return 200 OK with data.

---

## 🎉 Benefits Over Render

✅ No sleeping - always responds instantly
✅ Faster cold starts (if any)
✅ Simpler dashboard
✅ Better free tier performance

---

## 📊 Limitations

- 10k requests per month (monitor in dashboard)
- 1GB memory
- Should be plenty for municipal board site

If you exceed limits, you can:
1. Upgrade to paid ($5/month)
2. Or switch back to Render
3. Or use multiple free services

---

## 🔄 Auto-Deploy

Every time you push to GitHub:
- Cyclic automatically rebuilds and deploys
- Zero downtime deployments
- Rollback available in dashboard

---

## 🛠️ Troubleshooting

### Issue: Build fails
**Solution:** Make sure `package.json` has `"start": "node src/server.js"`

### Issue: App crashes
**Solution:** Check logs in Cyclic dashboard → Logs tab

### Issue: Environment variables not working
**Solution:** Make sure you clicked "Save" after adding each variable

### Issue: CORS errors
**Solution:** Backend already configured to allow `.pages.dev` domains

---

## 📞 Need Help?

Cyclic has great docs: https://docs.cyclic.sh/
Or check their Discord community
