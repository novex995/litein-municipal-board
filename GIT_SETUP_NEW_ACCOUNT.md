# Git Setup for New GitHub Account (novex995)

## Problem
Git is still using old account credentials (Dunco244) instead of new account (novex995).

## Solution: Update Git Credentials

### Option 1: Use GitHub Personal Access Token (Recommended)

#### Step 1: Create Personal Access Token

1. **Login to GitHub** with your new account (novex995)
2. Go to: https://github.com/settings/tokens
3. Click **"Generate new token"** → **"Generate new token (classic)"**
4. Fill in:
   - **Note:** `Litein Municipal Board Deployment`
   - **Expiration:** 90 days (or "No expiration")
   - **Select scopes:** 
     - ✅ `repo` (Full control of private repositories)
     - ✅ `workflow` (Update GitHub Action workflows)
5. Click **"Generate token"**
6. **COPY THE TOKEN NOW** - You can't see it again!
   - It looks like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

#### Step 2: Clear Old Credentials

**On Windows:**
```powershell
# Open Credential Manager
rundll32.exe keymgr.dll,KRShowKeyMgr

# Or search "Credential Manager" in Start menu
```

1. Click **"Windows Credentials"**
2. Look for entries containing `github.com`
3. Delete all GitHub-related credentials
4. Close Credential Manager

#### Step 3: Push with New Token

```bash
cd "c:\Users\HP\Documents\LITEIN MUNICIPAL BOARD"
git push -u origin main
```

**When prompted:**
- **Username:** `novex995`
- **Password:** Paste your Personal Access Token (the `ghp_...` token)

Git will save these credentials for future pushes.

---

### Option 2: Update Remote URL with Token Embedded

If you don't want to enter credentials each time, embed the token in the URL:

```bash
cd "c:\Users\HP\Documents\LITEIN MUNICIPAL BOARD"

# Format: https://TOKEN@github.com/USERNAME/REPO.git
git remote set-url origin https://ghp_YOUR_TOKEN_HERE@github.com/novex995/litein-municipal-board.git
```

**Replace `ghp_YOUR_TOKEN_HERE` with your actual token.**

Then push:
```bash
git push -u origin main
```

**⚠️ Warning:** This stores your token in plain text in `.git/config`. Only use this on your personal computer.

---

### Option 3: Use GitHub CLI (Easiest)

```bash
# Install GitHub CLI (if not installed)
winget install --id GitHub.cli

# Authenticate
gh auth login

# Follow prompts:
# - What account? GitHub.com
# - Protocol? HTTPS
# - Authenticate? Login with a web browser
# - Copy the code shown, press Enter
# - Login with novex995 account in browser
# - Authorize GitHub CLI

# Now push
cd "c:\Users\HP\Documents\LITEIN MUNICIPAL BOARD"
git push -u origin main
```

---

## Quick Commands Summary

```bash
# 1. Clear old credentials (Windows Credential Manager)
rundll32.exe keymgr.dll,KRShowKeyMgr
# Delete all github.com entries

# 2. Push (will prompt for credentials)
cd "c:\Users\HP\Documents\LITEIN MUNICIPAL BOARD"
git push -u origin main

# When prompted:
# Username: novex995
# Password: [Your Personal Access Token]
```

---

## Verify After Push

After successful push:

1. **Go to:** https://github.com/novex995/litein-municipal-board
2. **Check:** Files should be visible
3. **Verify:** See your commit message: "initial: litein municipal board with deployment docs"

---

## Troubleshooting

### Issue: "Support for password authentication was removed"

**Cause:** GitHub no longer accepts passwords for git operations.

**Solution:** You MUST use a Personal Access Token instead of your GitHub password.

### Issue: Still shows old username (Dunco244)

**Solution:** Configure git user
```bash
git config --global user.name "novex995"
git config --global user.email "novex995@gmail.com"
```

### Issue: Token rejected

**Cause:** Token expired or wrong scope

**Solution:** 
1. Generate new token with `repo` scope
2. Make sure you copied the entire token (starts with `ghp_`)

---

## Next Step: Deploy to Railway

Once your code is on GitHub (novex995/litein-municipal-board), follow:

**📄 See:** `DEPLOY_TO_RAILWAY_NEW_ACCOUNT.md`

The deployment steps are:
1. ✅ Code pushed to GitHub (you're here)
2. Login to Railway with GitHub (novex995)
3. Connect repository
4. Configure backend service
5. Add environment variables
6. Deploy!

---

## Security Note

**Never commit `.env` files with secrets to GitHub!**

Make sure `.gitignore` includes:
```
.env
.env.local
.env.production
```

Your environment variables should only exist:
- ✅ Locally in `.env` files (not committed)
- ✅ On Railway dashboard (environment variables)
- ✅ On Cloudflare Pages (environment variables)

Check `.gitignore`:
```bash
cat .gitignore | findstr env
```

Should show `.env` is ignored.
