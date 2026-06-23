# Deploy Backend to Railway (New GitHub Account)

## 🎯 Overview

We'll:
1. Push your code to the new GitHub repository (novex995/litein-municipal-board)
2. Deploy backend to Railway
3. Update frontend to use Railway backend URL
4. Redeploy frontend on Cloudflare Pages

---

## 📋 Step 1: Push Code to New GitHub Repository

### Check Current Git Status

```bash
cd "c:\Users\HP\Documents\LITEIN MUNICIPAL BOARD"
git remote -v
```

### Remove Old Remote and Add New One

```bash
# Remove old remote (if exists)
git remote remove origin

# Add new remote (your new GitHub account)
git remote add origin https://github.com/novex995/litein-municipal-board.git

# Verify
git remote -v
```

### Push to New Repository

```bash
# Make sure everything is committed
git add .
git commit -m "initial: litein municipal board project"

# Push to new repository
git branch -M main
git push -u origin main
```

**If prompted for credentials:**
- Username: `novex995`
- Password: Use a **Personal Access Token** (not your password)

**To create Personal Access Token:**
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes: `repo` (full control)
4. Generate and copy the token
5. Use it as password when pushing

---

## 📋 Step 2: Deploy Backend to Railway

### 2.1: Sign Up / Login to Railway

1. Go to https://railway.app/
2. Click "Login with GitHub"
3. Authorize Railway to access your GitHub account (novex995)

### 2.2: Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Select your repository: **`novex995/litein-municipal-board`**
4. Railway will auto-detect it's a monorepo

### 2.3: Configure Backend Service

1. Railway might ask which service to deploy
2. Click **"Add Service"** if needed
3. Configure:
   - **Name:** litein-backend (or any name)
   - **Root Directory:** `backend`
   - **Build Command:** Leave empty
   - **Start Command:** `npm start`

**Or if Railway shows settings:**
- Go to **Settings** tab
- **Root Directory:** `backend`
- **Start Command:** `node src/server.js` or `npm start`

### 2.4: Add Environment Variables

1. Click on your service (backend)
2. Go to **"Variables"** tab
3. Click **"+ New Variable"** for each:

```
NODE_ENV=production
PORT=5000
SUPABASE_URL=https://kgbplquapfidrwnhtdnq.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnYnBscXVhcGZpZHJ3bmh0ZG5xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDk5MDY4OCwiZXhwIjoyMDk2NTY2Njg4fQ.EzR-FH98TTyI2TFkJw9vhQUmRs_t6--fzR8BECxcnXQ
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnYnBscXVhcGZpZHJ3bmh0ZG5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5OTA2ODgsImV4cCI6MjA5NjU2NjY4OH0.aUDo_oYKBCQv1DHsbE3TVyf-owx6FdBx8oOpFFzapU4
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-make-it-long-and-random
FRONTEND_URL=https://litein-municipal.pages.dev
GMAIL_USER=novex995@gmail.com
GMAIL_APP_PASSWORD=uzbnfvuoyfxpjlgs
```

**Important:** Generate a strong JWT_SECRET:
```bash
# On your machine, generate a random secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Copy the output and use it as JWT_SECRET value.

### 2.5: Generate Domain

1. Go to **"Settings"** tab
2. Scroll to **"Domains"**
3. Click **"Generate Domain"**
4. Railway will give you a URL like: `litein-backend.up.railway.app`
5. **Copy this URL** - you'll need it!

### 2.6: Deploy

1. Click **"Deploy"** or it auto-deploys
2. Watch the logs in **"Deployments"** tab
3. Wait for status to show **"Success"** (usually 2-5 minutes)

### 2.7: Test Backend

```bash
# Test health endpoint
curl https://your-app-name.up.railway.app/health

# Test news endpoint
curl https://your-app-name.up.railway.app/api/news
```

Both should return 200 OK with data.

---

## 📋 Step 3: Update Frontend Configuration

### 3.1: Update Local .env

Edit `frontend/.env`:
```env
VITE_API_URL=https://your-app-name.up.railway.app
VITE_SUPABASE_URL=https://kgbplquapfidrwnhtdnq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnYnBscXVhcGZpZHJ3bmh0ZG5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5OTA2ODgsImV4cCI6MjA5NjU2NjY4OH0.aUDo_oYKBCQv1DHsbE3TVyf-owx6FdBx8oOpFFzapU4
```

Replace `your-app-name.up.railway.app` with your actual Railway URL.

### 3.2: Update Backend CORS (if needed)

The backend `server.js` already allows `.pages.dev` domains, but let's also add Railway URL:

Edit `backend/.env`:
```env
FRONTEND_URL=https://litein-municipal.pages.dev
```

The CORS is already configured to allow this in `backend/src/server.js`.

### 3.3: Commit and Push Changes

```bash
cd "c:\Users\HP\Documents\LITEIN MUNICIPAL BOARD"
git add .
git commit -m "feat: configure for Railway deployment"
git push
```

Railway will auto-deploy the backend update.

---

## 📋 Step 4: Update Cloudflare Pages

### 4.1: Update Environment Variables

1. Go to Cloudflare Dashboard
2. Workers & Pages → Your Project → Settings → Environment variables
3. Update or add for **Production**:

```
VITE_API_URL=https://your-app-name.up.railway.app
```

(Replace with your actual Railway URL)

### 4.2: Trigger Redeploy

**Option A:** Via Dashboard
1. Go to **Deployments** tab
2. Click ⋯ on latest deployment
3. Click **"Retry deployment"**

**Option B:** Via Git Push
```bash
cd frontend
git commit --allow-empty -m "chore: trigger rebuild with Railway backend"
git push
```

### 4.3: Wait for Build

Wait 2-5 minutes for Cloudflare to rebuild and deploy.

---

## ✅ Step 5: Verify Everything Works

### Test Backend
```bash
curl https://your-app-name.up.railway.app/health
curl https://your-app-name.up.railway.app/api/news
```

### Test Frontend
1. Open https://litein-municipal.pages.dev in incognito window
2. Open DevTools (F12) → Console
3. Paste:
```javascript
console.log('API URL:', import.meta.env.VITE_API_URL);
fetch('https://your-app-name.up.railway.app/api/news')
  .then(r => r.json())
  .then(d => console.log('✅ Backend works!', d.data.length, 'items'))
  .catch(e => console.error('❌ Error:', e.message));
```

### Test on Site
1. Homepage should load news
2. No console errors
3. All features working

---

## 🎉 Benefits of Railway

✅ **No sleeping** - Always-on, instant responses
✅ **Fast** - Better performance than Render free tier
✅ **Simple** - Easy dashboard and logs
✅ **Auto-deploy** - Push to GitHub = auto deploy
✅ **Generous free tier** - $5 free credit monthly (enough for your app)
✅ **Better DX** - Developer experience is excellent

---

## 📊 Railway Free Tier Limits

- **$5 free credit per month** (execution time based)
- **500 hours** of execution (more than enough)
- **100 GB egress** bandwidth
- **Shared CPU & 512MB RAM**

Your municipal board site will easily fit within these limits.

---

## 🔄 Auto-Deploy Setup

Railway automatically deploys when you push to GitHub:

```bash
# Make any changes
cd "c:\Users\HP\Documents\LITEIN MUNICIPAL BOARD"

# Commit and push
git add .
git commit -m "your message"
git push

# Railway auto-deploys backend
# Cloudflare auto-deploys frontend (if connected to same repo)
```

---

## 🐛 Troubleshooting

### Issue: Git push asks for password repeatedly

**Solution:** Use credential helper
```bash
git config --global credential.helper wincred
```

### Issue: Railway build fails

**Solution:** Check logs in Railway dashboard
- Make sure `package.json` has `"start": "node src/server.js"`
- Verify root directory is set to `backend`

### Issue: Environment variables not working

**Solution:** 
- Double-check spelling (case-sensitive)
- Redeploy after adding variables
- Check Railway logs for errors

### Issue: CORS errors on frontend

**Solution:**
- Make sure backend deployed with updated CORS
- Check Railway logs for CORS rejections
- Verify frontend URL matches in backend env vars

### Issue: Railway deployment says "Blocked"

**Solution:** 
- This happens if your previous Railway account was flagged
- Contact Railway support: https://railway.app/discord
- Or use alternative: Cyclic.sh (see previous guide)

---

## 📝 Complete Checklist

Backend:
- [ ] Code pushed to GitHub (novex995/litein-municipal-board)
- [ ] Railway project created
- [ ] Backend service configured (root: backend)
- [ ] All environment variables added
- [ ] Domain generated
- [ ] Deployment successful
- [ ] Health endpoint responds
- [ ] News API returns data

Frontend:
- [ ] Local `.env` updated with Railway URL
- [ ] Cloudflare env vars updated
- [ ] Cloudflare redeployed
- [ ] Site loads without errors
- [ ] News appears on homepage
- [ ] No CORS errors in console

---

## 🚀 Next Steps

1. Monitor Railway usage in dashboard
2. Set up custom domain (optional)
3. Enable Railway notifications
4. Add monitoring/alerts
5. Document your Railway setup for team

---

## 💰 Cost Monitoring

Railway shows usage in real-time:
1. Go to Railway dashboard
2. Click on your project
3. See **"Usage"** tab
4. Monitor your $5 monthly credit

Your app should use approximately $1-2 per month, well within free tier.

---

## 🆘 If Railway Blocks You Again

If your new account also gets blocked (unlikely):

**Alternative 1:** Cyclic.sh
- See `DEPLOY_TO_CYCLIC.md`
- No credit card, no blocking
- Always-on, no sleeping

**Alternative 2:** Render + Keep-Alive
- See `KEEP_RENDER_AWAKE.md`
- Use free cron service to keep awake

**Alternative 3:** Fly.io
- Better than Railway
- But requires credit card for verification
