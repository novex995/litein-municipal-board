# 🚀 Cloudflare Pages Environment Variable Setup

## Quick Guide: Add VITE_API_URL to Cloudflare Pages

### Step-by-Step Instructions:

1. **Go to Cloudflare Dashboard**
   - Visit: https://dash.cloudflare.com

2. **Navigate to Your Project**
   - Click **"Workers & Pages"** in the left sidebar
   - OR Click **"Pages"** in the left sidebar
   - Find and click **"litein-municipal"** project

3. **Go to Settings**
   - Click the **"Settings"** tab at the top

4. **Open Environment Variables**
   - Scroll down to **"Environment variables"** section
   - Click **"Add variable"** or **"Edit variables"** button

5. **Add the Variable**
   ```
   Variable name:  VITE_API_URL
   Value:          https://litein-municipal.onrender.com
   ```
   
   **Important:**
   - Type the variable name EXACTLY as shown (case-sensitive!)
   - Use YOUR actual Render backend URL
   - Do NOT include `/api` at the end
   - Do NOT add quotes around the value

6. **Choose Environment** (if asked)
   - Select **"Production"** 
   - You can also add it to "Preview" if you want

7. **Save**
   - Click **"Save"** or **"Deploy"** button
   - Cloudflare will automatically trigger a new deployment

8. **Wait for Deployment**
   - Go to **"Deployments"** tab
   - Wait for the new deployment to show **"Success"** (usually 2-3 minutes)

9. **Test Your Website**
   - Visit: https://litein-municipal.pages.dev
   - Open browser console (F12)
   - Check that API calls now go to your Render backend
   - No more "localhost:5000" errors!

---

## 📸 Visual Reference

```
Cloudflare Dashboard
  └─ Workers & Pages (or Pages)
       └─ litein-municipal
            └─ Settings Tab
                 └─ Environment variables section
                      └─ [Add variable] button
                           ├─ Variable name: VITE_API_URL
                           └─ Value: https://litein-municipal.onrender.com
```

---

## ✅ Verification

After adding and deploying:

1. **Check the variable is set:**
   - Go back to Settings → Environment variables
   - You should see `VITE_API_URL` listed

2. **Check the deployment:**
   - Go to Deployments tab
   - Latest deployment should show "Success"

3. **Test the website:**
   - Visit your site
   - Open DevTools (F12) → Console tab
   - Look for API requests - they should go to your Render backend
   - No "localhost" errors!

---

## 🔧 Troubleshooting

### Variable not taking effect?
- Make sure you saved the variable
- Check if a new deployment was triggered
- Manually trigger a redeploy: Go to Deployments → Click three dots → "Retry deployment"

### Still seeing localhost errors?
- Clear browser cache (Ctrl+Shift+Delete)
- Do a hard refresh (Ctrl+Shift+R)
- Check the variable name is spelled correctly (case-sensitive!)

### Deployment failed?
- Check build logs in the Deployments tab
- Verify the variable value is correct (no typos in URL)

---

## 📞 Need Help?

If you're stuck:
1. Screenshot the Environment variables page
2. Screenshot the latest deployment log
3. Screenshot the browser console errors
4. Share these for troubleshooting

---

**That's it! Just this one variable and your site will work perfectly! 🎉**
