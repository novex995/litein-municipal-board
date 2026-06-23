# Push to GitHub using Git Bash

## Problem
Current token is being denied (403 error). This means the token doesn't have write permissions.

---

## Solution: Generate New Token with Write Access

### Step 1: Create Token with Correct Permissions

1. **Go to:** https://github.com/settings/tokens
2. **Delete old token** (the one that's not working)
3. **Click:** "Generate new token" → "Generate new token (classic)"
4. **Fill in:**
   - **Note:** `Litein Municipal Deployment`
   - **Expiration:** 90 days
   
5. **Select scopes - THIS IS CRITICAL:**
   - ✅ Check **`repo`** (the main checkbox at the top)
     - This will automatically check all sub-items:
     - repo:status
     - repo_deployment
     - public_repo
     - repo:invite
     - security_events
   - ✅ Check **`workflow`** (optional but recommended)

6. **Click "Generate token"**
7. **COPY THE TOKEN** - starts with `github_pat_` or `ghp_`

---

## Step 2: Open Git Bash

1. Press **Windows key**
2. Type **"Git Bash"**
3. Click to open
4. Navigate to your project:
   ```bash
   cd "/c/Users/HP/Documents/LITEIN MUNICIPAL BOARD"
   ```

---

## Step 3: Push Using Git Bash

In Git Bash, run these commands one by one:

```bash
# 1. Set your identity
git config user.name "novex995"
git config user.email "novex995@gmail.com"

# 2. Set remote with your NEW token (replace TOKEN with actual token)
git remote set-url origin https://novex995:YOUR_NEW_TOKEN_HERE@github.com/novex995/litein-municipal-board.git

# 3. Verify remote
git remote -v

# 4. Add and commit any changes
git add .
git commit -m "chore: prepare for deployment"

# 5. Push to GitHub
git push -u origin main
```

**Replace `YOUR_NEW_TOKEN_HERE` with the token you just copied.**

---

## Alternative: Use Simpler Authentication

If you keep having token issues, Git Bash can use the credential manager:

```bash
# In Git Bash
cd "/c/Users/HP/Documents/LITEIN MUNICIPAL BOARD"

# Remove token from URL (use plain URL)
git remote set-url origin https://github.com/novex995/litein-municipal-board.git

# Enable credential storage
git config --global credential.helper wincred

# Try to push (it will ask for credentials)
git push -u origin main
```

**When prompted:**
- **Username:** `novex995`
- **Password:** Paste your token (the new one you generated)

Git Bash will save these credentials for future use.

---

## Quick Script Method

I created a script for you. After generating the new token:

1. **Edit the file:** `push-to-github.sh`
2. **Replace the old token** with your new token (line 12)
3. **In Git Bash, run:**
   ```bash
   cd "/c/Users/HP/Documents/LITEIN MUNICIPAL BOARD"
   chmod +x push-to-github.sh
   ./push-to-github.sh
   ```

---

## Verify Token Has Correct Permissions

Before using it, test the token in Git Bash:

```bash
# Test token (replace TOKEN with your actual token)
curl -H "Authorization: token YOUR_TOKEN_HERE" https://api.github.com/user

# Should return your user info with "login": "novex995"
```

If it returns 401 or 403, the token is still wrong.

---

## Visual Checklist for Token Creation

When creating token on https://github.com/settings/tokens:

```
☐ Token name: "Litein Municipal Deployment"
☐ Expiration: 90 days (or No expiration)

Scopes to check:
☑ repo (main checkbox - checks all sub-items)
  ☑ repo:status
  ☑ repo_deployment  
  ☑ public_repo
  ☑ repo:invite
  ☑ security_events
☐ workflow (optional)

☐ Click "Generate token"
☐ Copy token immediately (can't see it again!)
```

---

## Common Git Bash Issues

### Issue: "Permission denied"
**Cause:** Token doesn't have `repo` scope checked

**Solution:** Regenerate token with `repo` scope

### Issue: Git Bash doesn't recognize commands
**Cause:** Not in Git Bash terminal

**Solution:** Make sure you opened "Git Bash" not "CMD" or "PowerShell"

### Issue: "Failed to push"
**Cause:** Network or authentication issue

**Solution:** 
```bash
# Clear credentials
git config --global --unset credential.helper

# Try again with fresh authentication
git push -u origin main
```

---

## After Successful Push

Once you see:
```
✅ Successfully pushed to GitHub!
```

1. **Verify:** Go to https://github.com/novex995/litein-municipal-board
2. **Check:** Files should be visible
3. **Next:** Deploy to Railway (see `DEPLOY_TO_RAILWAY_NEW_ACCOUNT.md`)

---

## Need Help?

If still stuck after trying all this:

1. **Take screenshot** of the error in Git Bash
2. **Check token permissions** at https://github.com/settings/tokens
3. **Try GitHub Desktop** as last resort (easiest option)

The most common issue is: **Token doesn't have `repo` scope checked.**
