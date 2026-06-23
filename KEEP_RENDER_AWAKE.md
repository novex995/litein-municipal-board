# Keep Render Backend Awake (Free Solution)

## Problem
Render free tier spins down after 15 minutes of inactivity, causing 30-60 second delays on first request.

## Solution: Free Cron Job Ping Service

Use a free cron service to ping your backend every 14 minutes to keep it awake.

---

## 🆓 Free Cron Services (No Credit Card)

### Option 1: cron-job.org ⭐ Recommended

1. **Sign Up:** https://cron-job.org/en/signup.php
   - Free forever
   - No credit card needed

2. **Create Cron Job:**
   - Login and click **"Create cron job"**
   - **Title:** Keep Render Awake
   - **URL:** `https://litein-municipal.onrender.com/health`
   - **Schedule:** Every 14 minutes
     - Minute: `*/14`
     - Hour: `*`
     - Day: `*`
     - Month: `*`
   - **Save**

3. **Done!** Your backend will stay awake 24/7

---

### Option 2: UptimeRobot

1. **Sign Up:** https://uptimerobot.com/
   - Free forever
   - Monitor up to 50 sites

2. **Add Monitor:**
   - Click **"Add New Monitor"**
   - **Monitor Type:** HTTP(s)
   - **Friendly Name:** Litein Municipal Backend
   - **URL:** `https://litein-municipal.onrender.com/health`
   - **Monitoring Interval:** 5 minutes (minimum on free tier)
   - **Save**

3. **Bonus:** You also get uptime monitoring and alerts!

---

### Option 3: Koyeb's Free Cron (No Account Needed!)

Use GitHub Actions to ping your service:

1. **Create file:** `.github/workflows/keep-alive.yml`

```yaml
name: Keep Render Awake

on:
  schedule:
    - cron: '*/14 * * * *'  # Every 14 minutes
  workflow_dispatch:  # Manual trigger

jobs:
  keep-alive:
    runs-on: ubuntu-latest
    steps:
      - name: Ping Render Backend
        run: |
          curl https://litein-municipal.onrender.com/health
          echo "✅ Backend pinged successfully"
```

2. **Commit and push:**
```bash
git add .github/workflows/keep-alive.yml
git commit -m "ci: add keep-alive workflow"
git push
```

3. **Enable in GitHub:**
   - Go to your repo on GitHub
   - Click **Actions** tab
   - Enable workflows if prompted

---

## 🎯 Recommended: cron-job.org

**Why:**
- ✅ Most reliable
- ✅ True cron (every 14 mins exactly)
- ✅ Simple dashboard
- ✅ Email notifications if fails
- ✅ No GitHub Actions minutes used

---

## ⚙️ Advanced: Self-Ping (Not Recommended)

You could add self-ping to your backend, but this:
- ❌ Uses your own resources
- ❌ Might violate Render ToS
- ❌ Less reliable

**If you insist:**
```javascript
// Add to backend/src/server.js (NOT RECOMMENDED)
if (process.env.NODE_ENV === 'production') {
  setInterval(async () => {
    try {
      await fetch(`${process.env.RENDER_EXTERNAL_URL}/health`);
      console.log('Self-ping successful');
    } catch (error) {
      console.error('Self-ping failed:', error.message);
    }
  }, 840000); // 14 minutes
}
```

---

## 📊 Comparison

| Service | Free? | Credit Card? | Interval | Reliability |
|---------|-------|--------------|----------|-------------|
| cron-job.org | ✅ | ❌ | Custom | ⭐⭐⭐⭐⭐ |
| UptimeRobot | ✅ | ❌ | 5 min | ⭐⭐⭐⭐⭐ |
| GitHub Actions | ✅ | ❌ | Custom | ⭐⭐⭐⭐ |
| Self-ping | ✅ | ❌ | Custom | ⭐⭐⭐ |

---

## 🎉 Result

After setup:
- ✅ First load is instant (no 50-second wait)
- ✅ Users get fast response times
- ✅ Better user experience
- ✅ Still 100% free

---

## 💡 Pro Tip: Business Hours Only

If you want to save resources and only keep awake during business hours (8 AM - 6 PM Kenya time):

**cron-job.org schedule:**
- Minute: `*/14`
- Hour: `8-18` (8 AM to 6 PM)
- Timezone: Select Africa/Nairobi

This way it sleeps overnight when no one is using it, and stays awake during work hours.

---

## ✅ Setup Checklist

- [ ] Sign up for cron-job.org (or UptimeRobot)
- [ ] Create cron job to ping every 14 minutes
- [ ] Test: Check if backend responds instantly
- [ ] Set up email alerts for downtime (optional)
- [ ] Monitor for a few days to confirm it works

---

## 🚨 Important Notes

1. **Don't use intervals less than 5 minutes** - Too aggressive
2. **Render allows this** - It's a common practice on free tier
3. **Monitor your usage** - Make sure you don't exceed Render limits
4. **Have a backup plan** - Keep Cyclic.sh as alternative

---

## 🔄 If This Still Doesn't Work

Consider switching to Cyclic.sh (see `DEPLOY_TO_CYCLIC.md`):
- No sleeping at all
- No need for keep-alive hacks
- Always instant response
- Still 100% free, no credit card
