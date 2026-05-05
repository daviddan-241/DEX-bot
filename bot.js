require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Keep-alive HTTP server (required for Render + UptimeRobot)
require('./server');

// ─────────────────────────────────────────────
//  CONFIG — fill these in before running
// ─────────────────────────────────────────────
const BOT_TOKEN = process.env.BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';

const WALLETS = {
  SOL: process.env.SOL_WALLET || 'AsSdLVZRX8BAdi5u4PGHefiAFdcsR8nRAaFBKpzhPtc2',
  BNB: process.env.BNB_WALLET || 'bnb189gjjucwltdpnlemrveakf0q6xg0smfqdh6869',
  ETH: process.env.ETH_WALLET || '0x589e85724Eb0d8Fc8C1e5A0b3B429483c91F90E3',
};

const ADMIN_ID = process.env.ADMIN_ID || null; // optional: your Telegram user ID for order alerts

// ─────────────────────────────────────────────
//  PRICING TABLE
// ─────────────────────────────────────────────
const SERVICES = {
  dexscreener: {
    label: '📊 DexScreener',
    chain: 'Multi-chain',
    currency: 'ETH/BNB/SOL',
    services: {
      update: {
        label: '🔄 DexScreener Update',
        description: 'Update your Token Info, Logo, Banner, and Socials',
        tiers: [
          { id: 'basic', label: 'Basic Update', desc: 'Logo + Name + Socials', price: 0.05, currency: 'ETH' },
          { id: 'premium', label: 'Premium Update', desc: 'Full profile with banner', price: 0.1, currency: 'ETH' },
        ],
        requiresChain: true,
      },
      trending: {
        label: '🔥 DexScreener Trending',
        description: 'Get your token trending on DexScreener',
        tiers: [
          { id: 'bronze', label: 'Bronze Trend', desc: '6-hour trending push', price: 0.2, currency: 'ETH' },
          { id: 'silver', label: 'Silver Trend', desc: '12-hour trending push', price: 0.35, currency: 'ETH' },
          { id: 'gold', label: 'Gold Trend', desc: '24-hour trending push', price: 0.6, currency: 'ETH' },
        ],
        requiresChain: true,
      },
      volume: {
        label: '📈 DexScreener Volume',
        description: 'Boost your trading volume on DexScreener',
        tiers: [
          { id: 'basic', label: 'Basic Volume', desc: 'Light volume boost', price: 0.1, currency: 'ETH' },
          { id: 'medium', label: 'Medium Volume', desc: 'Moderate volume boost', price: 0.2, currency: 'ETH' },
          { id: 'heavy', label: 'Heavy Volume', desc: 'Maximum volume boost', price: 0.4, currency: 'ETH' },
        ],
        requiresChain: true,
      },
      boost: {
        label: '🚀 DexScreener Boost',
        description: 'Maximize visibility with trending & volume combo',
        tiers: [
          { id: 'starter', label: 'Starter Boost', desc: 'Volume + 6h trending', price: 0.3, currency: 'ETH' },
          { id: 'pro', label: 'Pro Boost', desc: 'Heavy volume + 12h trending', price: 0.5, currency: 'ETH' },
          { id: 'ultra', label: 'Ultra Boost', desc: 'Max volume + 24h trending', price: 0.9, currency: 'ETH' },
        ],
        requiresChain: true,
      },
    },
  },
  pumpfun: {
    label: '🔥 Pump.fun',
    chain: 'Solana',
    currency: 'SOL',
    services: {
      boost: {
        label: '🚀 Pump.fun Boost',
        description: 'Boost your Pump.fun token with volume and holder activity',
        tiers: [
          { id: 'basic', label: 'Basic Pump', desc: 'Light volume and holder increase', price: 0.5, currency: 'SOL' },
          { id: 'medium', label: 'Medium Pump', desc: 'Moderate volume and holder boost', price: 1.0, currency: 'SOL' },
          { id: 'mega', label: 'Mega Pump', desc: 'Heavy volume and maximum holder boost', price: 2.0, currency: 'SOL' },
        ],
      },
      trending: {
        label: '📊 Pump.fun Trending',
        description: 'Get your token trending on Pump.fun',
        tiers: [
          { id: 'basic', label: 'Trend Push', desc: 'Push to trending section', price: 1.5, currency: 'SOL' },
          { id: 'premium', label: 'Top Trend', desc: 'Top trending placement', price: 3.0, currency: 'SOL' },
        ],
      },
      volume: {
        label: '📈 Pump.fun Volume',
        description: 'Supercharge your Pump.fun trading volume',
        tiers: [
          { id: 'basic', label: 'Basic Volume', desc: 'Light volume boost', price: 0.5, currency: 'SOL' },
          { id: 'medium', label: 'Medium Volume', desc: 'Moderate volume boost', price: 1.0, currency: 'SOL' },
          { id: 'heavy', label: 'Heavy Volume', desc: 'Maximum volume boost', price: 2.0, currency: 'SOL' },
        ],
      },
      graduation: {
        label: '🎓 Pump.fun Graduation',
        description: 'Help your token reach graduation faster',
        tiers: [
          { id: 'assist', label: 'Graduation Assist', desc: 'Moderate push towards graduation', price: 2.5, currency: 'SOL' },
          { id: 'boost', label: 'Graduation Boost', desc: 'Strong push with volume burst', price: 4.0, currency: 'SOL' },
          { id: 'express', label: 'Graduation Express', desc: 'Maximum graduation assistance', price: 6.0, currency: 'SOL' },
        ],
      },
    },
  },
  fourmeme: {
    label: '🐸 Four.Meme',
    chain: 'BSC',
    currency: 'BNB',
    services: {
      boost: {
        label: '🚀 Four.Meme Boost',
        description: 'Boost your Four.Meme BSC token with volume and holder activity',
        tiers: [
          { id: 'basic', label: 'Basic Pump', desc: 'Light volume and holder increase', price: 0.3, currency: 'BNB' },
          { id: 'medium', label: 'Medium Pump', desc: 'Moderate volume and holder boost', price: 0.6, currency: 'BNB' },
          { id: 'mega', label: 'Mega Pump', desc: 'Heavy volume and maximum holder boost', price: 1.0, currency: 'BNB' },
        ],
      },
      trending: {
        label: '📊 Four.Meme Trending',
        description: 'Dominate the Four.Meme trending section',
        tiers: [
          { id: 'basic', label: 'Trend Push', desc: 'Push to trending section', price: 0.5, currency: 'BNB' },
          { id: 'premium', label: 'Top Trend', desc: 'Top trending placement', price: 1.0, currency: 'BNB' },
        ],
      },
      volume: {
        label: '📈 Four.Meme Volume',
        description: 'Automate your BSC project volume',
        tiers: [
          { id: 'basic', label: 'Basic Volume', desc: 'Light volume boost', price: 0.3, currency: 'BNB' },
          { id: 'medium', label: 'Medium Volume', desc: 'Moderate volume boost', price: 0.6, currency: 'BNB' },
          { id: 'heavy', label: 'Heavy Volume', desc: 'Maximum volume boost', price: 1.0, currency: 'BNB' },
        ],
      },
    },
  },
  flapsh: {
    label: '⚡ Flap.sh',
    chain: 'BSC',
    currency: 'BNB',
    services: {
      boost: {
        label: '🚀 Flap.sh Boost',
        description: 'Boost your Flap.sh BSC token with volume and holder activity',
        tiers: [
          { id: 'basic', label: 'Basic Pump', desc: 'Light volume and holder increase', price: 0.3, currency: 'BNB' },
          { id: 'medium', label: 'Medium Pump', desc: 'Moderate volume and holder boost', price: 0.6, currency: 'BNB' },
          { id: 'mega', label: 'Mega Pump', desc: 'Heavy volume and maximum holder boost', price: 1.0, currency: 'BNB' },
        ],
      },
      trending: {
        label: '📊 Flap.sh Trending',
        description: 'Automate your BSC project trending status',
        tiers: [
          { id: 'basic', label: 'Trend Push', desc: 'Push to trending section', price: 0.5, currency: 'BNB' },
          { id: 'premium', label: 'Top Trend', desc: 'Top trending placement', price: 1.0, currency: 'BNB' },
        ],
      },
      volume: {
        label: '📈 Flap.sh Volume',
        description: 'Automate your BSC project volume and trending status',
        tiers: [
          { id: 'basic', label: 'Basic Volume', desc: 'Light volume boost', price: 0.3, currency: 'BNB' },
          { id: 'medium', label: 'Medium Volume', desc: 'Moderate volume boost', price: 0.6, currency: 'BNB' },
          { id: 'heavy', label: 'Heavy Volume', desc: 'Maximum volume boost', price: 1.0, currency: 'BNB' },
        ],
      },
    },
  },
};

const DEXSCREENER_CHAINS = [
  'Ethereum', 'BNB Chain', 'Polygon', 'Arbitrum',
  'Avalanche', 'Fantom', 'Solana', 'Base',
  'Cronos', 'Kava', 'TRON', 'TON', 'SUI',
];

// ─────────────────────────────────────────────
//  BOT INIT
// ─────────────────────────────────────────────
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Session store: chatId → session object
const sessions = {};

function getSession(chatId) {
  if (!sessions[chatId]) sessions[chatId] = {};
  return sessions[chatId];
}

function clearSession(chatId) {
  sessions[chatId] = {};
}

// ─────────────────────────────────────────────
//  TOKEN LOOKUP
// ─────────────────────────────────────────────
async function fetchTokenInfo(address) {
  try {
    const res = await axios.get(`https://api.dexscreener.com/latest/dex/tokens/${address}`, { timeout: 8000 });
    const pairs = res.data?.pairs;
    if (!pairs || pairs.length === 0) return null;
    const pair = pairs[0];
    return {
      name: pair.baseToken?.name || 'Unknown',
      symbol: pair.baseToken?.symbol || '???',
      address: pair.baseToken?.address || address,
      chain: pair.chainId || 'unknown',
      price: pair.priceUsd || '0',
      marketCap: pair.marketCap ? `$${Number(pair.marketCap).toLocaleString()}` : 'N/A',
      liquidity: pair.liquidity?.usd ? `$${Number(pair.liquidity.usd).toLocaleString()}` : 'N/A',
      volume24h: pair.volume?.h24 ? `$${Number(pair.volume.h24).toLocaleString()}` : 'N/A',
      priceChange24h: pair.priceChange?.h24 || '0',
      dexUrl: pair.url || null,
      imageUrl: pair.info?.imageUrl || null,
      platform: pair.dexId || 'dexscreener',
    };
  } catch (e) {
    return null;
  }
}

// ─────────────────────────────────────────────
//  KEYBOARDS
// ─────────────────────────────────────────────
const MAIN_MENU_KB = {
  keyboard: [
    [{ text: 'DexScreener' }, { text: 'Pump.fun' }],
    [{ text: 'Four.Meme' }, { text: 'Flap.sh' }],
    [{ text: 'ℹ️ About' }, { text: '🛟 Support' }],
  ],
  resize_keyboard: true,
  persistent: true,
};

function platformServicesKb(platform) {
  const svc = SERVICES[platform];
  const keys = Object.keys(svc.services);
  const rows = [];
  for (let i = 0; i < keys.length; i += 2) {
    const row = [{ text: svc.services[keys[i]].label }];
    if (keys[i + 1]) row.push({ text: svc.services[keys[i + 1]].label });
    rows.push(row);
  }
  rows.push([{ text: '⬅️ Back to Main Menu' }]);
  return { keyboard: rows, resize_keyboard: true };
}

function tiersKb(tiers, backText) {
  const rows = tiers.map(t => [{ text: `${t.label} (${t.price.toFixed(4)} ${t.currency})` }]);
  rows.push([{ text: '⬅️ Back' }]);
  return { keyboard: rows, resize_keyboard: true };
}

function chainsKb() {
  const rows = [];
  for (let i = 0; i < DEXSCREENER_CHAINS.length; i += 2) {
    const row = [{ text: DEXSCREENER_CHAINS[i] }];
    if (DEXSCREENER_CHAINS[i + 1]) row.push({ text: DEXSCREENER_CHAINS[i + 1] });
    rows.push(row);
  }
  rows.push([{ text: '⬅️ Back to Main Menu' }]);
  return { keyboard: rows, resize_keyboard: true };
}

function confirmKb() {
  return {
    keyboard: [
      [{ text: '✅ Confirm Token' }],
      [{ text: '🔄 Enter Different Address' }],
      [{ text: '⬅️ Back to Tiers' }, { text: '❌ Cancel' }],
    ],
    resize_keyboard: true,
  };
}

function paymentKb() {
  return {
    keyboard: [
      [{ text: '✅ I\'ve Sent Payment' }],
      [{ text: '❌ Cancel Order' }],
    ],
    resize_keyboard: true,
  };
}

// ─────────────────────────────────────────────
//  MESSAGES
// ─────────────────────────────────────────────
function welcomeMsg() {
  return `👋 *Welcome to the Multi-Platform Token Booster Bot!*

Ready to send your token to the moon? 🚀
We provide industry-leading automated volume, holders, and Trending services across the top crypto platforms with unmatched reliability and speed.

⚠️ *IMPORTANT NOTICE:*
We are an independent service that connects directly to platform APIs to ensure your project's data remains accurate and top-performing at all times.

✨ *Why Choose Us?*
• *Trusted by Professionals:* Verified provider for top-tier crypto projects.
• *Direct API Integration:* Official channels — 100% safety and performance.
• *24/7 Premium Support:* Our team is always ready to help you scale.

📊 *Our Supported Platforms:*
🖥 *DexScreener* — Maximize visibility with trending status and high-speed volume bots.
🔥 *Pump.fun* — Supercharge your Solana launches with tailored volume & holders.
🐸 *Four.Meme* — Dominate the BSC meme coin charts like a pro.
⚡ *Flap.sh* — Automate your BSC project volume and trending status.

👇 *Select a platform below to get started!*`;
}

function aboutMsg() {
  return `ℹ️ *About Dex Boosting Bot*

We are a premium multi-platform token boosting service trusted by hundreds of crypto projects worldwide.

🔐 *Security First*
All payments are verified on-chain. We never ask for private keys or seed phrases.

⚡ *Fast Delivery*
Most orders begin within 5-15 minutes of payment confirmation.

📞 *Support*
Available 24/7 — use the Support button to reach our team.

_Version 1.0 | Multi-Platform Edition_`;
}

function supportMsg() {
  return `🛟 *Support*

Need help? Our team is available 24/7.

📬 Contact: @YourSupportHandle
💬 Response time: Usually within 15 minutes

_Please include your order details and transaction hash when reaching out._`;
}

// ─────────────────────────────────────────────
//  PLATFORM KEY FROM LABEL
// ─────────────────────────────────────────────
const PLATFORM_TEXT_MAP = {
  'DexScreener': 'dexscreener',
  'Pump.fun': 'pumpfun',
  'Four.Meme': 'fourmeme',
  'Flap.sh': 'flapsh',
};

function findPlatformByServiceLabel(label) {
  for (const [pk, pv] of Object.entries(SERVICES)) {
    for (const [sk, sv] of Object.entries(pv.services)) {
      if (sv.label === label) return { platformKey: pk, serviceKey: sk };
    }
  }
  return null;
}

function findTierByLabel(tiers, text) {
  return tiers.find(t => text.startsWith(t.label));
}

// ─────────────────────────────────────────────
//  WALLET PER CURRENCY
// ─────────────────────────────────────────────
function getWallet(currency) {
  if (currency === 'SOL') return WALLETS.SOL;
  if (currency === 'BNB') return WALLETS.BNB;
  return WALLETS.ETH;
}

// ─────────────────────────────────────────────
//  SEND ORDER ALERT TO ADMIN
// ─────────────────────────────────────────────
async function notifyAdmin(order) {
  if (!ADMIN_ID) return;
  const msg = `🔔 *NEW ORDER*\n\nPlatform: ${order.platform}\nService: ${order.service}\nTier: ${order.tier}\nToken: ${order.tokenName} (${order.tokenSymbol})\nCA: \`${order.tokenAddress}\`\nAmount: ${order.price} ${order.currency}\nUser: @${order.username || 'unknown'} (${order.userId})`;
  await bot.sendMessage(ADMIN_ID, msg, { parse_mode: 'Markdown' });
}

// ─────────────────────────────────────────────
//  MAIN HANDLER
// ─────────────────────────────────────────────
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text?.trim() || '';
  const session = getSession(chatId);

  // ── /start ──────────────────────────────────
  if (text === '/start' || text === '/menu') {
    clearSession(chatId);
    await bot.sendMessage(chatId, welcomeMsg(), {
      parse_mode: 'Markdown',
      reply_markup: MAIN_MENU_KB,
    });
    return;
  }

  // ── About / Support ─────────────────────────
  if (text === 'ℹ️ About') {
    await bot.sendMessage(chatId, aboutMsg(), { parse_mode: 'Markdown', reply_markup: MAIN_MENU_KB });
    return;
  }
  if (text === '🛟 Support') {
    await bot.sendMessage(chatId, supportMsg(), { parse_mode: 'Markdown', reply_markup: MAIN_MENU_KB });
    return;
  }

  // ── Main Menu ────────────────────────────────
  if (text === '⬅️ Back to Main Menu') {
    clearSession(chatId);
    await bot.sendMessage(chatId, '👇 *Select a platform to get started!*', {
      parse_mode: 'Markdown',
      reply_markup: MAIN_MENU_KB,
    });
    return;
  }

  // ── Platform Selection ───────────────────────
  if (PLATFORM_TEXT_MAP[text]) {
    const platformKey = PLATFORM_TEXT_MAP[text];
    session.platform = platformKey;
    session.step = 'service';
    const pv = SERVICES[platformKey];
    await bot.sendMessage(chatId,
      `${pv.label} *Services*\n\nPlease select a service:`,
      { parse_mode: 'Markdown', reply_markup: platformServicesKb(platformKey) }
    );
    return;
  }

  // ── Service Selection ────────────────────────
  if (session.step === 'service') {
    const found = findPlatformByServiceLabel(text);
    if (found) {
      session.platform = found.platformKey;
      session.service = found.serviceKey;
      const svc = SERVICES[found.platformKey].services[found.serviceKey];
      session.step = svc.requiresChain ? 'select_chain' : 'select_tier';

      if (svc.requiresChain) {
        await bot.sendMessage(chatId,
          `*${svc.label} Selected*\n\n${svc.description}\n\nPlease select the blockchain where your token is deployed:`,
          { parse_mode: 'Markdown', reply_markup: chainsKb() }
        );
      } else {
        const tiersText = svc.tiers.map((t, i) =>
          `${i + 1}. *${t.label}* — ${t.desc}\n   Price: ${t.price.toFixed(4)} ${t.currency}`
        ).join('\n\n');
        await bot.sendMessage(chatId,
          `*${svc.label} Selected*\n\n${svc.description}\n\nPlatform: ${SERVICES[found.platformKey].label} (${SERVICES[found.platformKey].chain})\n\n*Select Tier:*\n\n${tiersText}`,
          { parse_mode: 'Markdown', reply_markup: tiersKb(svc.tiers) }
        );
      }
      return;
    }
  }

  // ── Chain Selection (DexScreener) ───────────
  if (session.step === 'select_chain') {
    if (DEXSCREENER_CHAINS.includes(text)) {
      session.chain = text;
      session.step = 'select_tier';
      const svc = SERVICES[session.platform].services[session.service];
      const tiersText = svc.tiers.map((t, i) =>
        `${i + 1}. *${t.label}* — ${t.desc}\n   Price: ${t.price.toFixed(4)} ${t.currency}`
      ).join('\n\n');
      await bot.sendMessage(chatId,
        `Chain: *${text}* selected ✅\n\n*Select Tier:*\n\n${tiersText}`,
        { parse_mode: 'Markdown', reply_markup: tiersKb(svc.tiers) }
      );
      return;
    }
  }

  // ── Tier Selection ───────────────────────────
  if (session.step === 'select_tier') {
    const svc = SERVICES[session.platform]?.services[session.service];
    if (svc) {
      const tier = findTierByLabel(svc.tiers, text);
      if (tier) {
        session.tier = tier;
        session.step = 'awaiting_ca';
        await bot.sendMessage(chatId,
          `✅ *${tier.label}* selected!\n\nNow please send the *Contract Address (CA)* of your token:`,
          { parse_mode: 'Markdown', reply_markup: { keyboard: [[{ text: '⬅️ Back' }]], resize_keyboard: true } }
        );
        return;
      }
    }
  }

  // ── Back from Tier / CA ──────────────────────
  if (text === '⬅️ Back') {
    if (session.step === 'awaiting_ca' || session.step === 'select_tier') {
      session.step = 'service';
      const pv = SERVICES[session.platform];
      await bot.sendMessage(chatId,
        `${pv.label} *Services*\n\nPlease select a service:`,
        { parse_mode: 'Markdown', reply_markup: platformServicesKb(session.platform) }
      );
    } else {
      clearSession(chatId);
      await bot.sendMessage(chatId, '👇 *Select a platform to get started!*', {
        parse_mode: 'Markdown',
        reply_markup: MAIN_MENU_KB,
      });
    }
    return;
  }

  // ── CA Input ─────────────────────────────────
  if (session.step === 'awaiting_ca') {
    await bot.sendMessage(chatId, '🔍 _Looking up your token..._', { parse_mode: 'Markdown' });
    const tokenInfo = await fetchTokenInfo(text);
    if (tokenInfo) {
      session.tokenInfo = tokenInfo;
      session.step = 'confirm_token';

      const infoText =
        `*Token Information:*\n\n` +
        `Name: ${tokenInfo.name}\n` +
        `Symbol: $${tokenInfo.symbol}\n` +
        `Address: \`${tokenInfo.address}\`\n` +
        `Market Cap: ${tokenInfo.marketCap}\n` +
        `Platform: ${tokenInfo.platform}\n` +
        `Price: $${Number(tokenInfo.price).toFixed(8)}\n` +
        `24h Volume: ${tokenInfo.volume24h}\n` +
        `Liquidity: ${tokenInfo.liquidity}`;

      if (tokenInfo.imageUrl) {
        try {
          await bot.sendPhoto(chatId, tokenInfo.imageUrl, {
            caption: infoText + '\n\n*Is this the correct token you want to boost? Please confirm:*',
            parse_mode: 'Markdown',
            reply_markup: confirmKb(),
          });
        } catch {
          await bot.sendMessage(chatId, infoText + '\n\n*Is this the correct token you want to boost? Please confirm:*', {
            parse_mode: 'Markdown',
            reply_markup: confirmKb(),
          });
        }
      } else {
        await bot.sendMessage(chatId, infoText + '\n\n*Is this the correct token you want to boost? Please confirm:*', {
          parse_mode: 'Markdown',
          reply_markup: confirmKb(),
        });
      }
    } else {
      await bot.sendMessage(chatId,
        `❌ *Token not found.*\n\nCould not find token for that address. Please check the CA and try again, or make sure the token is listed on DexScreener.`,
        { parse_mode: 'Markdown' }
      );
    }
    return;
  }

  // ── Token Confirmation ───────────────────────
  if (session.step === 'confirm_token') {
    if (text === '✅ Confirm Token') {
      session.step = 'payment';
      const { tier, tokenInfo, platform, service } = session;
      const wallet = getWallet(tier.currency);
      const pv = SERVICES[platform];

      const orderMsg =
        `📋 *Order Summary*\n\n` +
        `Platform: ${pv.label}\n` +
        `Service: ${pv.services[service].label}\n` +
        `Tier: ${tier.label}\n` +
        `Token: ${tokenInfo.name} ($${tokenInfo.symbol})\n\n` +
        `💰 *Payment Details*\n\n` +
        `Amount: *${tier.price.toFixed(4)} ${tier.currency}*\n` +
        `Send to:\n\`${wallet}\`\n\n` +
        `⚠️ Send *exactly* ${tier.price.toFixed(4)} ${tier.currency} to the address above.\n` +
        `After sending, click ✅ I've Sent Payment and provide your transaction hash.`;

      await bot.sendMessage(chatId, orderMsg, {
        parse_mode: 'Markdown',
        reply_markup: paymentKb(),
      });

      // Notify admin of pending order
      await notifyAdmin({
        platform: pv.label,
        service: pv.services[service].label,
        tier: tier.label,
        tokenName: tokenInfo.name,
        tokenSymbol: tokenInfo.symbol,
        tokenAddress: tokenInfo.address,
        price: tier.price.toFixed(4),
        currency: tier.currency,
        username: msg.from?.username,
        userId: msg.from?.id,
      });

      return;
    }

    if (text === '🔄 Enter Different Address') {
      session.step = 'awaiting_ca';
      await bot.sendMessage(chatId, 'Please send the new Contract Address (CA):', {
        reply_markup: { keyboard: [[{ text: '⬅️ Back' }]], resize_keyboard: true },
      });
      return;
    }

    if (text === '⬅️ Back to Tiers') {
      session.step = 'select_tier';
      const svc = SERVICES[session.platform].services[session.service];
      const tiersText = svc.tiers.map((t, i) =>
        `${i + 1}. *${t.label}* — ${t.desc}\n   Price: ${t.price.toFixed(4)} ${t.currency}`
      ).join('\n\n');
      await bot.sendMessage(chatId,
        `*Select Tier:*\n\n${tiersText}`,
        { parse_mode: 'Markdown', reply_markup: tiersKb(svc.tiers) }
      );
      return;
    }

    if (text === '❌ Cancel') {
      clearSession(chatId);
      await bot.sendMessage(chatId, '❌ Order cancelled. Select a platform to start again.', {
        reply_markup: MAIN_MENU_KB,
      });
      return;
    }
  }

  // ── Payment Confirmation ─────────────────────
  if (session.step === 'payment') {
    if (text === '✅ I\'ve Sent Payment') {
      session.step = 'awaiting_txhash';
      await bot.sendMessage(chatId,
        '📨 Please send your *transaction hash (TxHash)* so we can verify your payment:',
        { parse_mode: 'Markdown', reply_markup: { remove_keyboard: true } }
      );
      return;
    }

    if (text === '❌ Cancel Order') {
      clearSession(chatId);
      await bot.sendMessage(chatId, '❌ Order cancelled.', { reply_markup: MAIN_MENU_KB });
      return;
    }
  }

  // ── TxHash Input ─────────────────────────────
  if (session.step === 'awaiting_txhash') {
    const txHash = text;
    session.txHash = txHash;
    session.step = 'done';

    const { tier, tokenInfo, platform, service } = session;
    const pv = SERVICES[platform];

    const confirmMsg =
      `✅ *Payment Submitted!*\n\n` +
      `Thank you! Your order has been received.\n\n` +
      `📋 *Order Details:*\n` +
      `Platform: ${pv.label}\n` +
      `Service: ${pv.services[service].label}\n` +
      `Tier: ${tier.label}\n` +
      `Token: ${tokenInfo.name} ($${tokenInfo.symbol})\n` +
      `Amount: ${tier.price.toFixed(4)} ${tier.currency}\n\n` +
      `🔗 TxHash: \`${txHash}\`\n\n` +
      `⏱ Your order will begin within *5-15 minutes* after payment confirmation.\n\n` +
      `Need help? Use the Support button.`;

    await bot.sendMessage(chatId, confirmMsg, {
      parse_mode: 'Markdown',
      reply_markup: MAIN_MENU_KB,
    });

    // Notify admin of txhash
    if (ADMIN_ID) {
      await bot.sendMessage(ADMIN_ID,
        `💸 *PAYMENT SUBMITTED*\n\nToken: ${tokenInfo.name} ($${tokenInfo.symbol})\nCA: \`${tokenInfo.address}\`\nPlatform: ${pv.label} | Tier: ${tier.label}\nAmount: ${tier.price.toFixed(4)} ${tier.currency}\nTxHash: \`${txHash}\`\nUser: @${msg.from?.username || 'unknown'} (${msg.from?.id})`,
        { parse_mode: 'Markdown' }
      );
    }
    return;
  }

  // ── Fallback ─────────────────────────────────
  if (!session.step) {
    await bot.sendMessage(chatId, '👇 Use the menu below to get started!', {
      reply_markup: MAIN_MENU_KB,
    });
  }
});

console.log('🚀 Dex Boosting Bot is running...');
