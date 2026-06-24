# News Article Update Troubleshooting Guide

## Issue: "Failed to update news article"

### Common Causes & Solutions

#### 1. **Permission Denied** (Most Common)
**Symptom:** Error message says "Failed to update news article"

**Cause:** The logged-in user doesn't have permission to edit the article.

**Who Can Edit:**
- ✅ The **author** of the article (the person who created it)
- ✅ **Municipal Manager** (role: `municipal_manager`)
- ✅ **Super Admin** (role: `super_admin`)

**Solution:**
- Check if you're logged in as the user who created the article
- OR log in as Municipal Manager or Super Admin
- Check the article's author in the database (Supabase → `news` table → `author_id` column)

---

#### 2. **Authentication Token Expired**
**Symptom:** Error says "Authentication required. Please log in again."

**Solution:**
1. Log out from the admin dashboard
2. Log in again
3. Try updating the article

---

#### 3. **Article Not Found**
**Symptom:** Error says "News article not found"

**Cause:** The article ID is invalid or the article was deleted

**Solution:**
- Refresh the news list
- Check if the article still exists in Supabase `news` table

---

#### 4. **Database/Network Error**
**Symptom:** Generic error or timeout

**Solution:**
- Check internet connection
- Verify Railway backend is running
- Check Supabase database status

---

## How to Debug (Step-by-Step)

### Step 1: Open Browser DevTools
1. In the admin dashboard, press **F12** to open DevTools
2. Go to **Console** tab
3. Try to update the article again
4. Look for the detailed error logs

### Step 2: Check the Logs

You should see logs like:

```javascript
🔄 Updating news article: { id: 'abc123', formData: {...} }
📡 Response status: 403
📦 Response data: { success: false, error: "You do not have permission..." }
```

### Step 3: Identify the Error

#### If you see **status: 403** (Permission Denied)
```json
{
  "success": false,
  "error": "You do not have permission to edit this article"
}
```
**Fix:** Log in as the article's author or as an admin.

#### If you see **status: 404** (Not Found)
```json
{
  "success": false,
  "error": "News article not found"
}
```
**Fix:** The article doesn't exist. Refresh the page.

#### If you see **status: 401** (Unauthorized)
```json
{
  "success": false,
  "error": "Authentication required"
}
```
**Fix:** Log in again. Your session expired.

#### If you see **status: 500** (Server Error)
```json
{
  "success": false,
  "error": "Failed to update news article: <error detail>"
}
```
**Fix:** Check Railway logs for backend errors.

---

## Check User Permissions in Supabase

### Step 1: Open Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Select your project: `kgbplquapfidrwnhtdnq`
3. Go to **Table Editor** → `users` table

### Step 2: Find Your User
Look for the user you're logged in as and check the `role` column:

| Role | Can Edit Any Article? |
|------|----------------------|
| `citizen` | ❌ No |
| `municipal_staff` | ❌ Only their own |
| `department_head` | ❌ Only their own |
| `municipal_manager` | ✅ Yes (any article) |
| `super_admin` | ✅ Yes (any article) |

### Step 3: Check Article Author
1. Go to **Table Editor** → `news` table
2. Find the article you want to edit
3. Check the `author_id` column
4. Does it match your user ID? If yes, you can edit it.

---

## Quick Fix: Make Your User an Admin

If you need to edit all articles:

### Option 1: Update User Role in Supabase
```sql
-- In Supabase SQL Editor
UPDATE users 
SET role = 'municipal_manager' 
WHERE email = 'your-email@example.com';
```

### Option 2: Create a Super Admin User
```sql
-- In Supabase SQL Editor
UPDATE users 
SET role = 'super_admin' 
WHERE email = 'admin@liteinmunicipal.go.ke';
```

---

## Testing the Fix

### Test 1: Check Authentication
1. Open browser DevTools (F12)
2. Go to **Application** → **Local Storage**
3. Check if `auth_token` exists
4. If missing, log in again

### Test 2: Check API Response
1. Open DevTools → **Network** tab
2. Try to update the article
3. Find the API request: `PUT /api/news/{id}`
4. Click on it → **Response** tab
5. Read the error message

### Test 3: Check Railway Logs
1. Go to Railway dashboard
2. Click on your backend project
3. Go to **Deployments** → Latest deployment
4. Check logs for error messages

---

## Backend Error Logs (Railway)

After the update, the backend will log detailed information:

```
📝 Update news request: {
  id: 'abc-123',
  userId: 'user-456',
  userRole: 'municipal_staff',
  updates: { title: 'New Title', category: 'Announcement' }
}

✓ Found article: 'Old Title' Author: 'user-789'

🔐 Permission check: {
  userRole: 'municipal_staff',
  isAdmin: false,
  isAuthor: false,      // <-- THIS IS THE PROBLEM
  articleAuthor: 'user-789',
  currentUser: 'user-456'
}

❌ Permission denied: User not author or admin
```

This clearly shows:
- You're logged in as `user-456`
- The article was created by `user-789`
- You're not an admin
- **Therefore, you can't edit it**

---

## Solution Summary

### For Citizens & Staff
You can only edit articles **you created**. To edit others' articles, contact an admin.

### For Admins
Make sure you're logged in with a user that has role:
- `municipal_manager` OR
- `super_admin`

### To Grant Admin Access
```sql
-- Run in Supabase SQL Editor
UPDATE users 
SET role = 'municipal_manager' 
WHERE email = 'your-email@example.com';
```

---

## Need More Help?

1. Check the browser console (F12) for detailed error logs
2. Check Railway deployment logs for backend errors
3. Verify your user role in Supabase `users` table
4. Verify the article's `author_id` in Supabase `news` table

---

Last updated: 2026-06-24
