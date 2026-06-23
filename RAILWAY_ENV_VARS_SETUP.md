# Railway Environment Variables Setup

## Your Backend URL
```
https://litein-municipal-board-production.up.railway.app
```

---

## Required Environment Variables for Railway

Go to your Railway service → **Variables** tab and add these:

### 1. Node Environment
```
NODE_ENV=production
PORT=5000
```

### 2. Supabase Configuration
```
SUPABASE_URL=https://kgbplquapfidrwnhtdnq.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnYnBscXVhcGZpZHJ3bmh0ZG5xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDk5MDY4OCwiZXhwIjoyMDk2NTY2Njg4fQ.EzR-FH98TTyI2TFkJw9vhQUmRs_t6--fzR8BECxcnXQ
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnYnBscXVhcGZpZHJ3bmh0ZG5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5OTA2ODgsImV4cCI6MjA5NjU2NjY4OH0.aUDo_oYKBCQv1DHsbE3TVyf-owx6FdBx8oOpFFzapU4
```

### 3. JWT Secret (IMPORTANT - Generate a new one!)
```bash
# Generate a secure JWT secret:
# On your computer, run this in terminal:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Copy the output and use it as JWT_SECRET value
JWT_SECRET=<paste-generated-secret-here>
```

Example (GENERATE YOUR OWN!):
```
JWT_SECRET=a8f5f167f44f4964e6c998dee827110c03234f92c38e5cfe0d50d7e3a9e3c5f8b2d4e1c3a5f6b7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1
```

### 4. Frontend URL (CORS)
```
FRONTEND_URL=https://litein-municipal.pages.dev
```

### 5. Email Configuration
```
GMAIL_USER=novex995@gmail.com
GMAIL_APP_PASSWORD=uzbnfvuoyfxpjlgs
```

### 6. SMS Configuration (Optional - can add later)
```
SMS_API_KEY=your_africas_talking_api_key
SMS_USERNAME=your_africas_talking_username
```

---

## How to Add Variables in Railway

1. **Go to Railway Dashboard**
2. **Click your service** (litein-municipal-board)
3. **Click "Variables" tab**
4. **Click "+ New Variable"**
5. **Add each variable:**
   - Variable name: `NODE_ENV`
   - Value: `production`
   - Click anywhere to save
6. **Repeat for all variables above**

---

## Verify Variables Are Set

After adding all variables, Railway will auto-redeploy. Check:

1. Go to **Deployments** tab
2. Wait for deployment to complete (green checkmark)
3. Click on the deployment
4. Check **Deploy Logs** for any errors

---

## Test Backend

Once deployed, test your endpoints:

```bash
# Test health endpoint
curl https://litein-municipal-board-production.up.railway.app/health

# Expected response:
# {"status":"OK","timestamp":"...","uptime":...,"environment":"production"}

# Test news endpoint
curl https://litein-municipal-board-production.up.railway.app/api/news

# Expected response:
# {"success":true,"data":[...]}
```

---

## Frontend Configuration (Already Done ✅)

Your Cloudflare Pages environment variables are already set:

- ✅ `VITE_API_URL` = `https://litein-municipal-board-production.up.railway.app`
- ✅ `VITE_SUPABASE_URL` = `https://kgbplquapfidrwnhtdnq.supabase.co`
- ✅ `VITE_SUPABASE_ANON_KEY` = Set

---

## CORS Configuration (Already Done ✅)

Your backend already allows:
- ✅ All `*.pages.dev` domains (Cloudflare Pages)
- ✅ `localhost` for development
- ✅ Specific frontend URL from `FRONTEND_URL` env var

---

## Complete Checklist

### Railway Backend:
- [ ] All environment variables added
- [ ] JWT_SECRET is a strong random value (not default)
- [ ] Service deployed successfully
- [ ] Health endpoint responds (200 OK)
- [ ] News API returns data
- [ ] No errors in Deploy Logs

### Cloudflare Frontend:
- [ ] VITE_API_URL points to Railway URL
- [ ] Environment variables set for Production
- [ ] Site redeployed after env var changes
- [ ] Hard refresh browser (Ctrl+Shift+R)
- [ ] News loads on homepage
- [ ] No CORS errors in console

---

## URLs Summary

| Service | URL |
|---------|-----|
| **Backend API** | `https://litein-municipal-board-production.up.railway.app` |
| **Frontend** | `https://litein-municipal.pages.dev` |
| **Health Check** | `https://litein-municipal-board-production.up.railway.app/health` |
| **News API** | `https://litein-municipal-board-production.up.railway.app/api/news` |

---

## Troubleshooting

### Backend Not Responding
1. Check Railway Deploy Logs for errors
2. Verify all environment variables are set
3. Check if service is running (should show "Online")
4. Test from Railway's built-in terminal

### CORS Errors on Frontend
1. Make sure `FRONTEND_URL` is set on Railway
2. Check backend logs for CORS rejection messages
3. Verify Cloudflare Pages URL matches

### Frontend Shows "Failed to Fetch"
1. Hard refresh: Ctrl+Shift+R (clear cache)
2. Open in incognito window
3. Check browser console for specific error
4. Verify VITE_API_URL in Cloudflare Pages env vars
5. Make sure frontend was redeployed after env var change

---

## Security Notes

1. **JWT_SECRET**: Must be a long random string (64+ characters)
2. **Don't commit .env files**: Already in .gitignore
3. **Environment variables**: Only set on hosting platforms, not in code
4. **GMAIL_APP_PASSWORD**: This is an app-specific password, not your Gmail password
5. **Supabase keys**: ANON key is safe for frontend, SERVICE key only for backend

---

## Next Steps

After everything is working:

1. **Test all features:**
   - Homepage loads news
   - Submit grievance form
   - Projects page loads
   - Newsletter subscription
   - Admin login

2. **Monitor Railway usage:**
   - Check dashboard for usage
   - You have $5/month free credit
   - Monitor to stay within limits

3. **Set up monitoring:**
   - Railway provides metrics
   - Check logs regularly
   - Set up error alerts (optional)

4. **Custom domain (optional):**
   - Railway supports custom domains
   - Cloudflare supports custom domains
   - Configure DNS accordingly
