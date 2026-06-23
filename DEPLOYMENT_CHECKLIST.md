# Deployment Checklist - Litein Municipal Board

## ✅ Step 1: Fix CORS in Your Node.js Backend - COMPLETED ✓

Your backend (`server.js`) now has proper CORS configuration:

```javascript
app.use(cors({
  origin: ['https://litein-municipal.pages.dev', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}))
```

---

## ✅ Step 2: Replace localhost:5000 with Environment Variable - COMPLETED ✓

All hardcoded `localhost:5000` references have been replaced with:
```javascript
${import.meta.env.VITE_API_URL || 'http://localhost:5000'}
```

**Files Updated:**
- ✓ Home.jsx (news feed + newsletter)
- ✓ StaffLogin.jsx
- ✓ NewsDetail.jsx  
- ✓ media/News.jsx
- ✓ All Dashboard files (Admin, Staff, Manager, etc.)
- ✓ admin/ProjectsManagement.jsx
- ✓ admin/NewsManagement.jsx
- ✓ services/api.js
- ✓ config/api.js

---

## ✅ Step 3: Update .env File - ALREADY CONFIGURED ✓

Your `frontend/.env` already has the production backend URL:
```
VITE_API_URL=https://litein-municipal.onrender.com
```

---

## ⏳ Step 4: Add Environment Variable in Cloudflare Pages

Go to: **Cloudflare Dashboard → Pages → litein-municipal → Settings → Environment Variables**

Add this variable:

```
Variable name: VITE_API_URL
Value: https://litein-municipal.onrender.com
```

**Important:** Make sure this matches your actual Render backend URL.

---

## ⏳ Step 5: Push Changes to GitHub

Push both backend and frontend changes:

```bash
# Push backend changes (CORS configuration)
cd backend
git add .
git commit -m "Configure CORS for Cloudflare Pages deployment"
git push

# Push frontend changes (environment variable usage)
cd ../frontend  
git add .
git commit -m "Replace hardcoded localhost URLs with environment variables"
git push

# Or push everything at once from root
cd "c:\Users\HP\Documents\LITEIN MUNICIPAL BOARD"
git add .
git commit -m "Fix CORS and use environment variables for API URLs"
git push origin main
```

This will trigger:
- ✅ Render to auto-redeploy your backend
- ✅ Cloudflare Pages to auto-redeploy your frontend

---

## Quick Verification Checklist

- [x] CORS added in Node.js backend with Cloudflare URL
- [x] All hardcoded localhost URLs replaced with environment variables
- [x] Frontend .env file configured with production backend URL
- [ ] Backend changes pushed to GitHub (Render will redeploy)
- [ ] Frontend changes pushed to GitHub (Cloudflare will redeploy)
- [ ] `VITE_API_URL` added in Cloudflare Pages environment variables
- [ ] Test website after deployment

---

## Testing After Deployment

1. **Visit your production site:** `https://litein-municipal.pages.dev`

2. **Open browser console** (F12 → Console tab)

3. **Check for errors:**
   - ✅ No more "ERR_CONNECTION_REFUSED" errors
   - ✅ No more "localhost:5000" references
   - ✅ API calls going to `https://litein-municipal.onrender.com`

4. **Test functionality:**
   - News feed loads on homepage
   - Newsletter subscription works
   - Staff login works
   - Dashboard data loads

---

## Backend URLs

**Local Backend:** `http://localhost:5000`  
**Production Backend (Render):** `https://litein-municipal.onrender.com`

**Frontend URLs:**
- **Local:** `http://localhost:5173`
- **Production (Cloudflare Pages):** `https://litein-municipal.pages.dev`

---

## Troubleshooting

### If CORS errors persist:
1. Verify backend is deployed on Render
2. Check Render logs for any startup errors
3. Test backend health: `https://litein-municipal.onrender.com/health`
4. Clear browser cache (Ctrl+Shift+Delete)

### If API calls still use localhost:
1. Verify `VITE_API_URL` is set in Cloudflare Pages
2. Check Cloudflare Pages build logs
3. Trigger a manual redeploy in Cloudflare Pages

---

**Last Updated:** June 23, 2026  
**Status:** Ready to deploy! Just push the changes to GitHub.
