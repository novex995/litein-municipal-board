# 🚨 URGENT SECURITY CHECKLIST

## Your .env files were pushed to GitHub - Action Required!

Since your `.env` files with real API keys and secrets were pushed to GitHub, anyone who viewed the repository could have seen:
- Supabase keys
- Gmail password
- JWT secret
- Brevo API key

## IMMEDIATE ACTIONS REQUIRED:

### 1. ✅ Rotate Supabase Keys (HIGHEST PRIORITY)

1. Go to: https://supabase.com/dashboard/project/kgbplquapfidrwnhtdnq/settings/api
2. Under "Project API keys":
   - Click "Regenerate" for `service_role` key
   - Click "Regenerate" for `anon` key
3. Copy the new keys
4. Update your local `.env` files:
   ```
   backend/.env
   SUPABASE_SERVICE_KEY=<new-service-role-key>
   SUPABASE_ANON_KEY=<new-anon-key>
   
   frontend/.env
   VITE_SUPABASE_ANON_KEY=<new-anon-key>
   ```
5. **Update Cloudflare Pages (Render) environment variables:**
   - Go to your deployment settings
   - Update `VITE_SUPABASE_ANON_KEY` with new anon key

### 2. ✅ Change Gmail App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Delete the old app password for "Mail"
3. Generate a NEW app password
4. Update `backend/.env`:
   ```
   GMAIL_APP_PASSWORD=<new-app-password>
   ```
5. **Update your backend deployment** (Render/Railway/etc):
   - Update `GMAIL_APP_PASSWORD` environment variable

### 3. ✅ Generate New JWT Secret

1. Generate a new secret:
   ```bash
   # In PowerShell
   -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
   ```
2. Update `backend/.env`:
   ```
   JWT_SECRET=<new-generated-secret>
   ```
3. **Update backend deployment:**
   - Update `JWT_SECRET` environment variable

### 4. ✅ Rotate Brevo API Key (if used)

1. Go to: https://app.brevo.com/settings/keys/api
2. Create a new API key
3. Delete the old key
4. Update `backend/.env`:
   ```
   BREVO_API_KEY=<new-api-key>
   ```

### 5. ✅ Check Supabase Auth Settings

1. Go to: https://supabase.com/dashboard/project/kgbplquapfidrwnhtdnq/auth/users
2. Review all users - look for any unauthorized accounts
3. If you see suspicious users, delete them
4. Consider enabling 2FA for your Supabase account

### 6. ✅ Update Backend Deployment

After updating all environment variables locally:

**For Render:**
1. Go to Render dashboard
2. Navigate to your backend service
3. Go to "Environment" tab
4. Update all the new values:
   - `SUPABASE_SERVICE_KEY`
   - `SUPABASE_ANON_KEY`
   - `GMAIL_APP_PASSWORD`
   - `JWT_SECRET`
5. Click "Save Changes"
6. Redeploy the service

**For Railway/Other:**
- Similar process - update env vars and redeploy

### 7. ✅ Update Frontend Deployment (Cloudflare Pages)

1. Go to Cloudflare Pages dashboard
2. Navigate to your project settings
3. Go to "Environment Variables"
4. Update:
   ```
   VITE_SUPABASE_ANON_KEY=<new-anon-key>
   VITE_API_URL=https://litein-municipal.onrender.com (or your backend URL)
   ```
5. Redeploy

### 8. ✅ Clean Up GitHub Repository

Since the secrets are already in git history, you need to clean them:

**Option A: Delete and Recreate Repo (Easiest)**
1. Go to GitHub: https://github.com/Dunco244/litein-municipal/settings
2. Scroll to bottom → "Delete this repository"
3. Create a new repo
4. Push clean code (without .env files - they're already in .gitignore)

**Option B: Use BFG Repo-Cleaner (Advanced)**
1. Download: https://rtyley.github.io/bfg-repo-cleaner/
2. Run: `bfg --delete-files .env --delete-files '*.env'`
3. Force push cleaned history

### 9. ✅ Monitor for Unauthorized Access

For the next few days:
- Check Supabase logs for unusual activity
- Monitor Gmail account for suspicious logins
- Check your backend logs for unauthorized requests
- Review database for any unauthorized changes

### 10. ✅ Prevent Future Exposure

✅ Already done:
- `.gitignore` created (blocks .env files)
- `.env.example` files created
- Local .env files removed from git tracking

Still need to do:
- Commit and push the .gitignore changes
- Verify .env files don't appear in GitHub

## Quick Status Check

Run this to verify .env files won't be pushed again:
```bash
cd "c:\Users\HP\Documents\LITEIN MUNICIPAL BOARD"
git status
```

You should see:
- `.env` files listed under "Untracked files" or not listed at all
- If they appear under "Changes to be committed" → STOP and remove them

## After Completing All Steps:

- [ ] All new API keys generated
- [ ] Local .env files updated
- [ ] Backend deployment environment variables updated
- [ ] Frontend deployment environment variables updated
- [ ] Backend redeployed
- [ ] Frontend redeployed
- [ ] Tested that the app still works
- [ ] GitHub repo cleaned or recreated
- [ ] No suspicious activity detected

## Testing Your Deployment

After updating everything:

1. **Test Frontend:**
   - Visit: https://litein-municipal.pages.dev
   - Try logging in
   - Check console for errors

2. **Test Backend:**
   - Visit: https://your-backend.onrender.com/api/health
   - Should respond successfully

3. **Test Database:**
   - Try creating a test complaint
   - Check if it saves to Supabase

## Need Help?

If anything doesn't work after updating:
1. Check backend logs (Render/Railway dashboard)
2. Check browser console (F12)
3. Verify all env variables are set correctly
4. Restart services if needed

## Time Estimate

- Rotating keys: 10-15 minutes
- Updating deployments: 5-10 minutes
- Testing: 5 minutes
- **Total: ~30 minutes**

## WHY THIS IS IMPORTANT

Your exposed credentials could allow attackers to:
- Access your database
- Read/modify/delete data
- Send emails from your account
- Rack up API usage costs
- Compromise user data

**Do this immediately!** 🚨

---

After completing this checklist, your system will be secure again with fresh credentials that were never exposed publicly.
