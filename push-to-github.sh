#!/bin/bash

# Script to push code to GitHub using Git Bash
# Run this in Git Bash terminal

echo "🚀 Pushing Litein Municipal Board to GitHub..."

# Set git user (if not already set)
git config user.name "novex995"
git config user.email "novex995@gmail.com"

# Set the remote URL with token embedded
echo "📝 Setting remote URL..."
git remote set-url origin https://novex995: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@github.com/novex995/litein-municipal-board.git

# Verify remote
echo "🔍 Verifying remote..."
git remote -v

# Check current branch
echo "🌿 Current branch:"
git branch

# Add all files
echo "📦 Adding files..."
git add .

# Check status
echo "📊 Status:"
git status

# Commit if there are changes
if [ -n "$(git status --porcelain)" ]; then
  echo "💾 Committing changes..."
  git commit -m "chore: prepare for deployment with documentation"
fi

# Push to GitHub
echo "⬆️ Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
  echo "✅ Successfully pushed to GitHub!"
  echo "🌐 View your repository: https://github.com/novex995/litein-municipal-board"
  echo ""
  echo "📋 Next step: Deploy to Railway"
  echo "   See: DEPLOY_TO_RAILWAY_NEW_ACCOUNT.md"
else
  echo "❌ Push failed!"
  echo ""
  echo "Possible solutions:"
  echo "1. Regenerate token with 'repo' scope at: https://github.com/settings/tokens"
  echo "2. Use GitHub Desktop (easier): https://desktop.github.com/"
  echo "3. Check: FIX_GITHUB_TOKEN.md for detailed troubleshooting"
fi
