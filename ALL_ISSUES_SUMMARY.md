# All Issues & Solutions Summary

## Date: 2026-06-24

---

## Issue 1: Projects & News Cannot Be Created/Updated ⚠️ URGENT

### Error Message:
```
"new row violates row-level security policy for table 'projects'"
```

### Root Cause:
Supabase Row-Level Security (RLS) is missing INSERT/UPDATE policies for:
- `projects` table
- `news` table
- `project_images` table
- `project_updates` table

### Solution: ✅ RUN SQL SCRIPT IN SUPABASE

**IMMEDIATE FIX (5 minutes):**

1. **Open Supabase SQL Editor:**
   - Go to: https://supabase.com/dashboard
   - Select project: `kgbplquapfidrwnhtdnq`
   - Click **SQL Editor** → **New query**

2. **Run this script:**
   - File: `database/fix_all_admin_tables_rls.sql`
   - Copy entire contents
   - Paste in SQL Editor
   - Click **Run**

3. **Verify:**
   - You should see success message
   - Check policies were created

4. **Test:**
   - Go to admin dashboard
   - Create a new project → Should work ✅
   - Update a news article → Should work ✅

### Status:
- ⏳ **SQL script ready** (not yet executed)
- ⏳ **Waiting for you to run in Supabase**
- 📄 **Detailed guide:** `FIX_RLS_POLICIES_GUIDE.md`
- 📄 **Quick reference:** `QUICK_FIX_RLS.txt`

---

## Issue 2: News Articles Cannot Be Updated (Permission Denied)

### Error Message:
```
"Failed to update news article: You do not have permission to edit this article"
```

### Root Cause:
Backend enforces that only:
- The **author** of the article, OR
- **Municipal Manager** (role: `municipal_manager`), OR
- **Super Admin** (role: `super_admin`)

can edit articles.

### Solution: ✅ GRANT ADMIN ROLE

**Option 1: Make your user an admin**
```sql
-- Run in Supabase SQL Editor
UPDATE users 
SET role = 'municipal_manager' 
WHERE email = 'your-email@example.com';
```

**Option 2: Log in as article author**
- Check who created the article in Supabase `news` table
- Log in with that user's credentials

### Status:
- ✅ **Detailed error logging added** (shows exact reason for denial)
- ⏳ **Awaiting GitHub push** (network issue earlier)
- 📄 **Troubleshooting guide:** `NEWS_UPDATE_TROUBLESHOOTING.md`
- 📄 **Quick reference:** `QUICK_FIX_NEWS_UPDATE.txt`

---

## Issue 3: Email Service Changed to Brevo

### Background:
Gmail SMTP not working reliably on Railway hosting platform.

### Solution: ✅ SWITCHED TO BREVO

**Changes Made:**
1. Updated `backend/src/services/emailService.js`:
   - Now uses Brevo (primary)
   - Falls back to Gmail (backup)
   - Auto-detects which service is configured

2. Environment variables already set in Railway:
   - `BREVO_API_KEY` ✅
   - `BREVO_EMAIL_FROM` ✅

3. Backend will automatically use Brevo after deployment

### Status:
- ✅ **Code updated locally**
- ⏳ **Awaiting GitHub push** (network issue)
- ⏳ **Railway auto-deploy pending**
- 📄 **Setup guide:** `BREVO_EMAIL_SETUP.md`
- 📄 **Migration summary:** `BREVO_MIGRATION_SUMMARY.md`

---

## Issue 4: Frontend API URL Fallback

### Problem:
Frontend code had old Render URL as fallback instead of Railway URL.

### Solution: ✅ UPDATED ALL FILES

**Files Updated:**
- `frontend/src/config/api.js` - Central config
- `frontend/src/pages/Home.jsx` - News fetching
- `frontend/src/components/DebugInfo.jsx` - Debug tools
- All other components using old fallback

**New Fallback:**
- Old: `https://litein-municipal.onrender.com`
- New: `https://litein-municipal-board-production.up.railway.app`

### Status:
- ✅ **All files updated**
- ⏳ **Awaiting GitHub push**
- ⏳ **Cloudflare Pages redeploy pending**

---

## Deployment Status

### Local Changes (Committed):
```
✅ Commit 1: Cloudflare environment variables documentation
✅ Commit 2: Fix API URL fallbacks to use Railway
✅ Commit 3: Switch email service to Brevo
✅ Commit 4: Add detailed error logging for news updates
✅ Commit 5: Add SQL scripts and guides to fix RLS policies
```

### Pending Actions:
```
⏳ Push to GitHub (network connectivity issue)
⏳ Railway auto-deploy (triggers after GitHub push)
⏳ Cloudflare Pages redeploy (triggers after GitHub push)
⏳ Run SQL script in Supabase (manual action required)
```

### When Network is Stable:
```bash
cd "c:\Users\HP\Documents\LITEIN MUNICIPAL BOARD"
git push origin main
```

---

## Priority Order

### 🔥 HIGHEST PRIORITY (Do First):
**Fix RLS Policies in Supabase**
- This is blocking project/news creation NOW
- Takes 5 minutes
- No code deployment needed
- Immediate fix

**Action:**
1. Open Supabase SQL Editor
2. Run: `database/fix_all_admin_tables_rls.sql`
3. Test immediately in admin dashboard

---

### 🟡 MEDIUM PRIORITY (Do Second):
**Push Code to GitHub**
- Enables email sending via Brevo
- Fixes frontend API URLs
- Adds better error logging

**Action:**
1. Wait for stable network
2. Run: `git push origin main`
3. Wait 2-3 minutes for auto-deploy

---

### 🟢 LOW PRIORITY (Optional):
**Grant Admin Permissions**
- Only if you need to edit other users' articles
- Can be done anytime

**Action:**
```sql
UPDATE users 
SET role = 'municipal_manager' 
WHERE email = 'your-email@example.com';
```

---

## Testing Checklist

After fixes are applied:

### Backend (Railway):
- [ ] Check deployment logs show "✓ Using Brevo SMTP"
- [ ] Test email endpoint: `/api/email/test`
- [ ] Check for RLS errors in logs (should be none)

### Frontend (Cloudflare Pages):
- [ ] News articles load on homepage
- [ ] Newsletter subscription works
- [ ] No console errors for API calls

### Admin Dashboard:
- [ ] Can create new projects ✅
- [ ] Can update existing projects ✅
- [ ] Can create news articles ✅
- [ ] Can update news articles ✅
- [ ] Error messages are clear and helpful ✅

### Database (Supabase):
- [ ] RLS policies exist for projects (INSERT, UPDATE, DELETE)
- [ ] RLS policies exist for news (INSERT, UPDATE, DELETE)
- [ ] RLS policies exist for project_images
- [ ] RLS policies exist for project_updates

---

## Documentation Files

### RLS Issues:
- `FIX_RLS_POLICIES_GUIDE.md` - Complete guide
- `QUICK_FIX_RLS.txt` - Quick reference
- `database/fix_all_admin_tables_rls.sql` - SQL script

### News Update Issues:
- `NEWS_UPDATE_TROUBLESHOOTING.md` - Troubleshooting guide
- `QUICK_FIX_NEWS_UPDATE.txt` - Quick reference

### Email Service:
- `BREVO_EMAIL_SETUP.md` - Setup guide
- `BREVO_MIGRATION_SUMMARY.md` - Migration summary
- `PUSH_WHEN_READY.txt` - Push reminder

### Environment Setup:
- `CLOUDFLARE_ENV_VARIABLES.md` - Cloudflare config guide

---

## Summary of Root Causes

| Issue | Root Cause | Solution |
|-------|-----------|----------|
| Cannot create projects | Missing RLS INSERT policy | Add RLS policies in Supabase |
| Cannot update projects | Missing RLS UPDATE policy | Add RLS policies in Supabase |
| Cannot update news | Permission check + Missing RLS | Fix RLS + Grant admin role |
| Email not sending | Gmail blocked on Railway | Switch to Brevo SMTP |
| API calls failing | Old Render URL fallback | Update to Railway URL |

---

## Contact & Support

If issues persist after applying all fixes:

1. **Check Railway Logs:**
   - Railway dashboard → Backend project → Deployments → View logs
   - Look for errors related to Supabase or authentication

2. **Check Browser Console:**
   - F12 → Console tab
   - Look for API errors with detailed messages

3. **Check Supabase Logs:**
   - Supabase dashboard → Logs
   - Filter by table: projects, news

4. **Verify Environment Variables:**
   - Railway: Check all env vars are set correctly
   - Cloudflare: Check `VITE_API_URL` is set

---

**Last Updated:** 2026-06-24  
**Status:** Ready for deployment pending network connectivity

---

## Next Steps

1. ✅ **Run RLS SQL script in Supabase** (5 minutes) - DO THIS FIRST
2. ⏳ **Push to GitHub when network is stable** (1 minute)
3. ⏳ **Wait for auto-deployment** (2-3 minutes)
4. ✅ **Test all functionality** (5 minutes)

**Total Time:** ~15 minutes to complete all fixes
