# 🚀 Dex Boosting Bot

A professional multi-platform Telegram token boosting bot supporting:
- 📊 DexScreener (Update, Trending, Volume, Boost)
- 🔥 Pump.fun (Boost, Trending, Volume, Graduation)
- 🐸 Four.Meme (Boost, Trending, Volume)
- ⚡ Flap.sh (Boost, Trending, Volume)

---

## ⚡ Quick Setup (5 minutes)

### 1. Get a Bot Token
1. Open Telegram → search **@BotFather**
2. Send `/newbot`
3. Follow the steps and copy your **bot token**

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Your Bot
```bash
cp .env.example .env
```
Open `.env` and fill in:
- `BOT_TOKEN` — from BotFather
- `SOL_WALLET` — your Solana address (for Pump.fun orders)
- `BNB_WALLET` — your BNB Chain address (for Four.Meme / Flap.sh)
- `ETH_WALLET` — your Ethereum address (for DexScreener)
- `ADMIN_ID` — (optional) your Telegram user ID for order alerts

### 4. Run the Bot
```bash
npm start
```

Or with auto-restart on changes:
```bash
npm run dev
```

---

## 📁 File Structure
```
dex-boost-bot/
├── bot.js          ← main bot logic
├── package.json    ← dependencies
├── .env.example    ← config template
├── .env            ← your config (create this)
└── README.md
```

---

## 💰 Payment Flow

1. User selects platform → service → tier
2. User sends their token Contract Address (CA)
3. Bot fetches real token info from DexScreener API
4. Bot shows token name, symbol, market cap, image
5. User confirms token
6. Bot shows exact payment amount + your wallet address
7. User sends payment and submits TxHash
8. You get an admin alert with full order details
9. You fulfill the order manually

---

## 🔧 Customizing Prices

Edit the `SERVICES` object in `bot.js` to change any tier prices:

```js
{ id: 'basic', label: 'Basic Pump', desc: 'Light volume...', price: 0.5, currency: 'SOL' },
```

Change `price` and `currency` as needed.

---

## 🌐 Hosting Options

**Free/Cheap:**
- [Railway.app](https://railway.app) — free tier, easy deploy
- [Render.com](https://render.com) — free tier
- [Heroku](https://heroku.com) — paid but reliable

**VPS (recommended for production):**
- DigitalOcean, Vultr, Hetzner
- Run with `pm2` for reliability:
```bash
npm install -g pm2
pm2 start bot.js --name dex-boost-bot
pm2 save
pm2 startup
```

---

## 📬 Support
Built for professional use. Edit `supportMsg()` in bot.js to add your support handle.
