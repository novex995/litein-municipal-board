# Fix GitHub Token Issue

## Problem
Current token is being denied permission (403 error) when trying to push.

## Possible Causes
1. Token doesn't have write permissions (`repo` scope)
2. Token expired or invalid
3. Repository settings restricting push access

---

## Solution: Create New Token with Correct Permissions

### Step 1: Delete Old Token
1. Go to: https://github.com/settings/tokens
2. Find the token you just created
3. Click "Delete" to remove it

### Step 2: Create New Token with Full Permissions

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Fill in details:
   - **Note:** `Litein Municipal Full Access`
   - **Expiration:** 90 days or No expiration
   
4. **Select ALL these scopes** (this is critical):
   - ✅ **repo** (check the main checkbox, all sub-items will be checked)
     - ✅ repo:status
     - ✅ repo_deployment
     - ✅ public_repo
     - ✅ repo:invite
     - ✅ security_events
   - ✅ **workflow** (Update GitHub Action workflows)
   - ✅ **write:packages** (Upload packages to GitHub Package Registry)
   - ✅ **delete:packages** (Delete packages from GitHub Package Registry)

5. Click **"Generate token"**
6. **COPY THE NEW TOKEN** immediately
7. Save it somewhere safe

---

## Alternative: Use GitHub Desktop (Easiest)

If tokens keep failing, use GitHub Desktop:

### Install GitHub Desktop
1. Download: https://desktop.github.com/
2. Install and open
3. Sign in with novex995 account

### Add Repository
1. File → Add Local Repository
2. Choose: `C:\Users\HP\Documents\LITEIN MUNICIPAL BOARD`
3. GitHub Desktop will recognize it

### Publish to GitHub
1. Click "Publish repository" button
2. Choose: novex995/litein-municipal-board
3. Uncheck "Keep this code private" (if it's public)
4. Click "Publish Repository"

Done! Much easier than token issues.

---

## Alternative: Use SSH Keys (Most Reliable)

### Step 1: Generate SSH Key
```powershell
cd ~
ssh-keygen -t ed25519 -C "novex995@gmail.com"
# Press Enter for all prompts (use defaults)
```

### Step 2: Add SSH Key to GitHub
```powershell
# Copy your public key
Get-Content ~/.ssh/id_ed25519.pub | clip
```

1. Go to: https://github.com/settings/keys
2. Click "New SSH key"
3. Title: "Windows Laptop"
4. Key: Paste (Ctrl+V)
5. Click "Add SSH key"

### Step 3: Change Remote to SSH
```powershell
cd "c:\Users\HP\Documents\LITEIN MUNICIPAL BOARD"
git remote set-url origin git@github.com:novex995/litein-municipal-board.git
```

### Step 4: Push
```powershell
git push -u origin main
```

---

## Quick Alternative: Create New Repo and Upload

If everything fails:

### Step 1: Create New Empty Repository
1. Go to https://github.com/new
2. Repository name: `litein-municipal`
3. Description: `Litein Municipal Board Website`
4. Public or Private (your choice)
5. **DO NOT** initialize with README, .gitignore, or license
6. Click "Create repository"

### Step 2: Upload Files via GitHub Web Interface
1. On the empty repository page, click "uploading an existing file"
2. Drag and drop your entire project folder
3. Commit message: "Initial commit"
4. Click "Commit changes"

**OR use GitHub CLI:**

```powershell
# Install GitHub CLI
winget install --id GitHub.cli

# Authenticate
gh auth login
# Choose: GitHub.com, HTTPS, Yes (authenticate), Login with browser
# Complete authentication in browser

# Push repository
cd "c:\Users\HP\Documents\LITEIN MUNICIPAL BOARD"
gh repo create novex995/litein-municipal-board --public --source=. --push
```

---

## Recommended: Use GitHub Desktop

This is the SIMPLEST solution and avoids all token/SSH issues:

1. Download GitHub Desktop: https://desktop.github.com/
2. Install and sign in (novex995)
3. File → Add Local Repository → Choose your folder
4. Publish repository
5. Done!

After that, Railway deployment will work perfectly.

---

## If You Have the New Token

Once you have regenerated the token with full `repo` scope:

```powershell
cd "c:\Users\HP\Documents\LITEIN MUNICIPAL BOARD"

# Set remote with new token
git remote set-url origin https://novex995:YOUR_NEW_TOKEN_HERE@github.com/novex995/litein-municipal-board.git

# Push
git push -u origin main
```

Replace `YOUR_NEW_TOKEN_HERE` with the actual token.

---

## Check Token Permissions

To verify a token has the right permissions:

```powershell
$token = "YOUR_TOKEN_HERE"
$headers = @{Authorization="token $token"}
$response = Invoke-RestMethod -Uri "https://api.github.com/user" -Headers $headers
Write-Host "Logged in as: $($response.login)"

# Check scopes
$scopeResponse = Invoke-WebRequest -Uri "https://api.github.com/user" -Headers $headers
$scopeResponse.Headers['X-OAuth-Scopes']
```

Should show: `repo, workflow` at minimum.
