# 🚀 Deployment Guide — GitHub + Render + UptimeRobot

---

## STEP 1 — Push to GitHub

```bash
# In your project folder:
git init
git add .
git commit -m "Initial bot deploy"

# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/dex-boosting-bot.git
git branch -M main
git push -u origin main
```

---

## STEP 2 — Deploy on Render

1. Go to **https://render.com** → Sign up / Log in
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account → select your repo
4. Fill in these settings:

| Field | Value |
|-------|-------|
| **Name** | dex-boosting-bot |
| **Environment** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `node bot.js` |
| **Plan** | Free |

5. Scroll to **Environment Variables** → Add:

| Key | Value |
|-----|-------|
| `BOT_TOKEN` | (paste from BotFather) |
| `ADMIN_ID` | (your Telegram user ID — get from @userinfobot) |

Wallets are already hardcoded in the bot but you can also add them here as overrides.

6. Click **"Create Web Service"**
7. Wait ~2 minutes for deploy
8. Copy your Render URL — looks like: `https://dex-boosting-bot.onrender.com`

---

## STEP 3 — Set Up UptimeRobot (keeps bot alive 24/7)

Render free tier sleeps after 15 minutes of no traffic. UptimeRobot pings it every 5 minutes to keep it awake.

1. Go to **https://uptimerobot.com** → Sign up free
2. Click **"+ Add New Monitor"**
3. Fill in:

| Field | Value |
|-------|-------|
| **Monitor Type** | HTTP(s) |
| **Friendly Name** | Dex Boosting Bot |
| **URL** | `https://dex-boosting-bot.onrender.com/health` |
| **Monitoring Interval** | Every 5 minutes |

4. Click **"Create Monitor"**

✅ Your bot is now live 24/7.

---

## STEP 4 — Verify Everything Works

1. Open Telegram → search your bot name
2. Send `/start`
3. You should see the welcome message with platform buttons
4. Test the full flow: pick a platform → service → tier → paste a real token CA

---

## STEP 5 — Future Updates

Whenever you change code:
```bash
git add .
git commit -m "Update: description of change"
git push
```
Render auto-deploys on every push to `main`. ✅

---

## 📋 Quick Reference

| Thing | Where |
|-------|-------|
| Bot token | Render env vars → `BOT_TOKEN` |
| Admin alerts | Render env vars → `ADMIN_ID` |
| Change prices | `bot.js` → `SERVICES` object → `price` field |
| Change support handle | `bot.js` → `supportMsg()` function |
| Health check URL | `https://YOUR-RENDER-URL.onrender.com/health` |
| UptimeRobot ping URL | `https://YOUR-RENDER-URL.onrender.com/health` |
