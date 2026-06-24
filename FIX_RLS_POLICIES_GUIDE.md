# Fix RLS Policies for Projects & News

## Problem
**Error:** "new row violates row-level security policy for table 'projects'"

**Cause:** Supabase Row-Level Security (RLS) is blocking INSERT/UPDATE operations because there are no policies allowing the backend to create or update projects and news.

## Solution: Add RLS Policies

### Step 1: Open Supabase SQL Editor

1. Go to https://supabase.com/dashboard
2. Select your project: **kgbplquapfidrwnhtdnq**
3. Click **SQL Editor** in the left sidebar
4. Click **New query**

### Step 2: Run the Fix SQL Script

Copy and paste this SQL script into the editor:

```sql
-- ========================================
-- FIX ALL ADMIN TABLES RLS POLICIES
-- ========================================

-- PROJECTS TABLE
DROP POLICY IF EXISTS "Service role can insert projects" ON public.projects;
DROP POLICY IF EXISTS "Service role can update projects" ON public.projects;
DROP POLICY IF EXISTS "Service role can delete projects" ON public.projects;

CREATE POLICY "Service role can insert projects"
  ON public.projects FOR INSERT TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update projects"
  ON public.projects FOR UPDATE TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "Service role can delete projects"
  ON public.projects FOR DELETE TO service_role
  USING (true);

-- PROJECT_IMAGES TABLE  
DROP POLICY IF EXISTS "Anyone can view project images" ON public.project_images;
DROP POLICY IF EXISTS "Service role can insert project images" ON public.project_images;
DROP POLICY IF EXISTS "Service role can update project images" ON public.project_images;
DROP POLICY IF EXISTS "Service role can delete project images" ON public.project_images;

CREATE POLICY "Anyone can view project images"
  ON public.project_images FOR SELECT
  USING (true);

CREATE POLICY "Service role can insert project images"
  ON public.project_images FOR INSERT TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update project images"
  ON public.project_images FOR UPDATE TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "Service role can delete project images"
  ON public.project_images FOR DELETE TO service_role
  USING (true);

-- NEWS TABLE
DROP POLICY IF EXISTS "Service role can insert news" ON public.news;
DROP POLICY IF EXISTS "Service role can update news" ON public.news;
DROP POLICY IF EXISTS "Service role can delete news" ON public.news;

CREATE POLICY "Service role can insert news"
  ON public.news FOR INSERT TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update news"
  ON public.news FOR UPDATE TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "Service role can delete news"
  ON public.news FOR DELETE TO service_role
  USING (true);

-- PROJECT_UPDATES TABLE
DROP POLICY IF EXISTS "Anyone can view project updates" ON public.project_updates;
DROP POLICY IF EXISTS "Service role can insert project updates" ON public.project_updates;
DROP POLICY IF EXISTS "Service role can update project updates" ON public.project_updates;
DROP POLICY IF EXISTS "Service role can delete project updates" ON public.project_updates;

CREATE POLICY "Anyone can view project updates"
  ON public.project_updates FOR SELECT
  USING (true);

CREATE POLICY "Service role can insert project updates"
  ON public.project_updates FOR INSERT TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update project updates"
  ON public.project_updates FOR UPDATE TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "Service role can delete project updates"
  ON public.project_updates FOR DELETE TO service_role
  USING (true);

-- Verify policies
SELECT 
  tablename, 
  policyname, 
  cmd AS operation
FROM pg_policies
WHERE tablename IN ('projects', 'project_images', 'news', 'project_updates')
ORDER BY tablename, cmd;
```

### Step 3: Execute the Script

1. Click **Run** button (or press Ctrl+Enter)
2. Wait for success message
3. You should see a list of policies at the bottom

### Step 4: Verify Policies Were Created

Run this query to verify:

```sql
SELECT 
  tablename, 
  policyname, 
  cmd AS operation,
  roles
FROM pg_policies
WHERE tablename IN ('projects', 'project_images', 'news', 'project_updates')
ORDER BY tablename, cmd, policyname;
```

You should see policies like:
- `Service role can insert projects`
- `Service role can update projects`
- `Service role can delete projects`
- Similar policies for news, project_images, project_updates

### Step 5: Test in Admin Dashboard

1. Go to your admin dashboard: https://litein-municipal-board.pages.dev/admin/dashboard
2. Try to **create a new project**
3. Try to **update an existing news article**
4. Both should work now! ✅

## What This Does

### Before (Blocked):
```
❌ Backend tries to INSERT project
❌ RLS blocks: "No policy allows INSERT"
❌ Error: "row violates row-level security policy"
```

### After (Allowed):
```
✅ Backend tries to INSERT project
✅ RLS checks: "Service role can insert projects" policy
✅ Policy returns: true (allowed)
✅ Project created successfully!
```

## Understanding RLS

### What is RLS?
Row-Level Security controls WHO can read/write data in your database.

### How It Works:
1. **Service Role** = Your backend (bypasses most RLS)
2. **Authenticated** = Logged-in users
3. **Anon** = Anonymous/public users

### Policy Structure:
```sql
CREATE POLICY "policy_name"
  ON table_name
  FOR operation        -- SELECT, INSERT, UPDATE, DELETE
  TO role             -- service_role, authenticated, anon
  USING (condition)   -- When can they read?
  WITH CHECK (condition);  -- When can they write?
```

## Why This Happened

### Original Setup:
- ✅ Projects had SELECT policy (anyone can view)
- ❌ No INSERT policy (couldn't create)
- ❌ No UPDATE policy (couldn't edit)
- ❌ No DELETE policy (couldn't remove)

### Fixed Setup:
- ✅ SELECT policy (anyone can view)
- ✅ INSERT policy (service role can create)
- ✅ UPDATE policy (service role can edit)
- ✅ DELETE policy (service role can remove)

## Troubleshooting

### Issue: Policies not working
**Solution:** Make sure Railway has correct `SUPABASE_SERVICE_KEY` environment variable

### Issue: Still getting RLS error
**Solution:** 
1. Check Railway logs for authentication errors
2. Verify service key in Railway variables matches Supabase
3. Try redeploying Railway backend

### Issue: Policy creation failed
**Solution:** 
1. Drop existing policies first (included in script)
2. Make sure you have admin access to Supabase
3. Check for typos in table names

## Security Notes

### Is This Safe? ✅ YES

**Why?**
- Service role key is SECRET (not exposed to frontend)
- Only backend has service role key
- Frontend users can't directly access service role
- Backend still checks authentication and user roles
- Double protection: RLS + Backend auth middleware

### Who Can Create Projects?

#### Through Backend API:
- ✅ Municipal Manager (verified by backend)
- ✅ Super Admin (verified by backend)
- ❌ Regular users (rejected by backend auth middleware)

#### Direct Database Access:
- ✅ Service role (backend)
- ❌ Authenticated users (blocked by RLS)
- ❌ Anonymous users (blocked by RLS)

## Files Created

1. `database/fix_all_admin_tables_rls.sql` - Complete fix script
2. `database/fix_projects_policies_simple.sql` - Simple version
3. `database/fix_projects_rls.sql` - Detailed explanation version
4. `FIX_RLS_POLICIES_GUIDE.md` - This guide

## Quick Reference

### Check Current Policies
```sql
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE tablename = 'projects';
```

### Drop All Project Policies
```sql
DROP POLICY IF EXISTS "policy_name" ON public.projects;
```

### Enable RLS (if disabled)
```sql
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
```

### Disable RLS (NOT RECOMMENDED)
```sql
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
```

## Status After Fix

- ✅ Projects: Can CREATE, UPDATE, DELETE
- ✅ News: Can CREATE, UPDATE, DELETE  
- ✅ Project Images: Can CREATE, UPDATE, DELETE
- ✅ Project Updates: Can CREATE, UPDATE, DELETE
- ✅ Backend authentication still enforced
- ✅ RLS security maintained

---

**Run the SQL script in Supabase SQL Editor and you're done!** 🎉

Last updated: 2026-06-24
