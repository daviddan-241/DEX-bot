require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
require('./server');

const BOT_TOKEN = process.env.BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';
const ADMIN_ID = process.env.ADMIN_ID || null;

const WALLETS = {
  SOL: process.env.SOL_WALLET || 'AsSdLVZRX8BAdi5u4PGHefiAFdcsR8nRAaFBKpzhPtc2',
  BNB: process.env.BNB_WALLET || 'bnb189gjjucwltdpnlemrveakf0q6xg0smfqdh6869',
  ETH: process.env.ETH_WALLET || '0x589e85724Eb0d8Fc8C1e5A0b3B429483c91F90E3',
};

const SERVICES = {
  dexscreener: {
    label: 'DexScreener',
    emoji: '📊',
    fullName: 'DexScreener',
    payChains: ['ETH', 'BNB', 'SOL'],
    usdPriced: true,
    platformDescription: 'DexScreener - Multi-Chain Token Intelligence Platform. Maximize visibility with trending status and high-speed volume bots.',
    services: {
      update: { label: 'Profile Update', description: 'Update token profile', longDesc: 'Professional profile ensures traders see legitimacy.', tiers: [{ id: 'basic', label: 'Essentials', priceUSD: 50, delivery: '24h', details: 'New projects' }, { id: 'premium', label: 'Professional', priceUSD: 120, delivery: '6-12h', details: 'Serious projects' }], requiresChain: true },
      trending: { label: 'Trending Placement', description: 'Premium trending section placement', longDesc: 'Trending creates instant visibility to active buyers.', tiers: [{ id: 'bronze', label: 'Quick Surge (6h)', priceUSD: 150, delivery: '30m', details: 'Flash activity' }, { id: 'silver', label: 'Momentum (12h)', priceUSD: 280, delivery: '30m', details: 'Sustained growth' }, { id: 'gold', label: 'Full Day (24h)', priceUSD: 500, delivery: '30m', details: 'Max exposure' }], requiresChain: true },
      volume: { label: 'Volume Boost', description: 'Strategic trading volume boost', longDesc: 'High volume attracts traders and boosts visibility.', tiers: [{ id: 'basic', label: 'Baseline', priceUSD: 80, delivery: '1h', details: 'Establishes presence' }, { id: 'medium', label: 'Momentum', priceUSD: 180, delivery: '1h', details: 'Chart rankings' }, { id: 'heavy', label: 'Explosion', priceUSD: 350, delivery: '1h', details: 'Top charts' }], requiresChain: true },
      boost: { label: 'Complete Domination', description: 'Volume + Trending combined', longDesc: 'Market domination requires visibility and credibility.', tiers: [{ id: 'starter', label: 'Launch Surge', priceUSD: 200, delivery: '30m', details: 'Strong entry' }, { id: 'pro', label: 'Professional', priceUSD: 400, delivery: '30m', details: 'Proven strategy' }, { id: 'ultra', label: 'Maximum', priceUSD: 750, delivery: '30m', details: 'Total control' }], requiresChain: true }
    }
  },
  pumpfun: {
    label: 'Pump.fun',
    emoji: '🔥',
    fullName: 'Pump.fun',
    payChains: ['SOL'],
    usdPriced: false,
    nativeCurrency: 'SOL',
    platformDescription: 'Pump.fun - Supercharge your Solana launches with tailored volume and holders.',
    services: {
      boost: { label: 'Volume & Holders', description: 'Coordinated volume and holder acquisition', longDesc: 'Real wallet activity creates organic growth signals.', tiers: [{ id: 'basic', label: 'Community Starter', priceAmount: 0.5, delivery: '15m', details: 'Initial presence' }, { id: 'medium', label: 'Growth Accelerator', priceAmount: 1.0, delivery: '15m', details: 'Strong momentum' }, { id: 'mega', label: 'Front-Page', priceAmount: 2.0, delivery: '15m', details: 'Max visibility' }] },
      trending: { label: 'Trending Placement', description: 'Trending section placement', longDesc: 'Being featured signals credibility.', tiers: [{ id: 'basic', label: 'Trending Push', priceAmount: 1.5, delivery: '20m', details: 'Discovery' }, { id: 'premium', label: 'Elite Top 10', priceAmount: 3.0, delivery: '20m', details: 'Maximum pressure' }] },
      volume: { label: 'Volume Surge', description: 'Authentic trading volume', longDesc: 'High volume feels safe to traders.', tiers: [{ id: 'basic', label: 'Liquidity', priceAmount: 0.5, delivery: '30m', details: 'Baseline' }, { id: 'medium', label: 'Acceleration', priceAmount: 1.0, delivery: '30m', details: 'Chart push' }, { id: 'heavy', label: 'Explosion', priceAmount: 2.0, delivery: '30m', details: 'Maximum' }] },
      graduation: { label: 'Graduation Boost', description: 'Fast-track to graduation', longDesc: 'Graduation unlocks CEX listing opportunities.', tiers: [{ id: 'assist', label: 'Assist (40-60%)', priceAmount: 2.5, delivery: '30m', details: 'Mid-stage' }, { id: 'boost', label: 'Boost (60-80%)', priceAmount: 4.0, delivery: '30m', details: 'Heavy push' }, { id: 'express', label: 'Express (80%+)', priceAmount: 6.0, delivery: '15m', details: 'Maximum speed' }] }
    }
  },
  fourmeme: {
    label: 'Four.Meme',
    emoji: '🐸',
    fullName: 'Four.Meme',
    payChains: ['BNB'],
    usdPriced: false,
    nativeCurrency: 'BNB',
    platformDescription: 'Four.Meme - Dominate the BSC meme coin charts like a pro.',
    services: {
      boost: { label: 'Community Boost', description: 'Holder acquisition and volume', longDesc: 'Real wallet activity signals momentum.', tiers: [{ id: 'basic', label: 'Foundation', priceAmount: 0.3, delivery: '15m', details: 'Initial' }, { id: 'medium', label: 'Growth', priceAmount: 0.6, delivery: '15m', details: 'Momentum' }, { id: 'mega', label: 'Dominance', priceAmount: 1.0, delivery: '15m', details: 'Maximum' }] },
      trending: { label: 'Trending Placement', description: 'Trending section placement', longDesc: 'Being featured signals market validation.', tiers: [{ id: 'basic', label: 'Visibility', priceAmount: 0.5, delivery: '20m', details: 'Entry' }, { id: 'premium', label: 'Elite', priceAmount: 1.0, delivery: '20m', details: 'Maximum' }] },
      volume: { label: 'Volume Generation', description: 'Authentic trading volume', longDesc: 'Volume appears healthy and liquid.', tiers: [{ id: 'basic', label: 'Foundation', priceAmount: 0.3, delivery: '30m', details: 'Baseline' }, { id: 'medium', label: 'Growth', priceAmount: 0.6, delivery: '30m', details: 'Push' }, { id: 'heavy', label: 'Dominance', priceAmount: 1.0, delivery: '30m', details: 'Maximum' }] }
    }
  },
  flapsh: {
    label: 'Flap.sh',
    emoji: '⚡',
    fullName: 'Flap.sh',
    payChains: ['BNB'],
    usdPriced: false,
    nativeCurrency: 'BNB',
    platformDescription: 'Flap.sh - Automate your BSC project volume and trending status.',
    services: {
      boost: { label: 'Growth Acceleration', description: 'Holder acquisition and volume', longDesc: 'Real wallet activity signals healthy momentum.', tiers: [{ id: 'basic', label: 'Launch', priceAmount: 0.3, delivery: '15m', details: 'Initial' }, { id: 'medium', label: 'Builder', priceAmount: 0.6, delivery: '15m', details: 'Growth' }, { id: 'mega', label: 'Explosion', priceAmount: 1.0, delivery: '15m', details: 'Maximum' }] },
      trending: { label: 'Trending Breakthrough', description: 'Trending section placement', longDesc: 'Visibility to engaged traders.', tiers: [{ id: 'basic', label: 'Entry', priceAmount: 0.5, delivery: '20m', details: 'Foundation' }, { id: 'premium', label: 'Premium', priceAmount: 1.0, delivery: '20m', details: 'Maximum' }] },
      volume: { label: 'Volume Optimization', description: 'Strategic volume generation', longDesc: 'Volume builds investor confidence.', tiers: [{ id: 'basic', label: 'Baseline', priceAmount: 0.3, delivery: '30m', details: 'Presence' }, { id: 'medium', label: 'Push', priceAmount: 0.6, delivery: '30m', details: 'Volume' }, { id: 'heavy', label: 'Peak', priceAmount: 1.0, delivery: '30m', details: 'Maximum' }] }
    }
  }
};

const DEXSCREENER_CHAINS = ['Ethereum', 'BNB Chain', 'Polygon', 'Arbitrum', 'Avalanche', 'Fantom', 'Solana', 'Base', 'Cronos', 'Kava', 'TRON', 'TON', 'SUI'];
const CRYPTO_INFO = {
  ETH: { label: 'Ethereum (ETH)', wallet: WALLETS.ETH, network: 'Ethereum Mainnet', rate: 3000 },
  BNB: { label: 'BNB (BNB)', wallet: WALLETS.BNB, network: 'BNB Smart Chain', rate: 600 },
  SOL: { label: 'Solana (SOL)', wallet: WALLETS.SOL, network: 'Solana Mainnet', rate: 150 },
};

function usdToCrypto(usd, symbol) {
  const rate = CRYPTO_INFO[symbol]?.rate || 1;
  const amount = usd / rate;
  return (symbol === 'ETH' || symbol === 'BNB') ? amount.toFixed(4) : amount.toFixed(3);
}

const bot = new TelegramBot(BOT_TOKEN, { polling: { interval: 300, params: { timeout: 20 } } });
const sessions = {};

function getSession(id) { return sessions[id] = sessions[id] || {}; }
function clearSession(id) { delete sessions[id]; }

async function fetchTokenInfo(address) {
  try {
    const res = await axios.get('https://api.dexscreener.com/latest/dex/tokens/' + address, { timeout: 10000 });
    const pairs = res.data?.pairs;
    if (!pairs || pairs.length === 0) return null;
    const pair = pairs[0];
    return {
      name: pair.baseToken?.name || 'Unknown',
      symbol: pair.baseToken?.symbol || '???',
      address: pair.baseToken?.address || address,
      chain: pair.chainId || 'unknown',
      price: pair.priceUsd || '0',
      marketCap: pair.marketCap ? '$' + Number(pair.marketCap).toLocaleString() : 'N/A',
      liquidity: pair.liquidity?.usd ? '$' + Number(pair.liquidity.usd).toLocaleString() : 'N/A',
      volume24h: pair.volume?.h24 ? '$' + Number(pair.volume.h24).toLocaleString() : 'N/A',
      imageUrl: pair.info?.imageUrl || null,
    };
  } catch (e) {
    console.error('Fetch error:', e.message);
    return null;
  }
}

function mainKB() {
  return { keyboard: [[{ text: '📊 DexScreener' }, { text: '🔥 Pump.fun' }], [{ text: '🐸 Four.Meme' }, { text: '⚡ Flap.sh' }], [{ text: 'About' }, { text: 'Support' }]], resize_keyboard: true };
}

function serviceKB(pk) {
  const keys = Object.keys(SERVICES[pk].services);
  const rows = [];
  for (let i = 0; i < keys.length; i += 2) {
    const row = [{ text: SERVICES[pk].services[keys[i]].label }];
    if (keys[i + 1]) row.push({ text: SERVICES[pk].services[keys[i + 1]].label });
    rows.push(row);
  }
  rows.push([{ text: 'Back to Main Menu' }]);
  return { keyboard: rows, resize_keyboard: true };
}

function tierKB(pk, sk, isUSD) {
  const sv = SERVICES[pk].services[sk];
  const rows = sv.tiers.map(t => [{ text: t.label + ' - ' + (isUSD ? '$' + t.priceUSD : t.priceAmount) }]);
  rows.push([{ text: 'Back to Main Menu' }]);
  return { keyboard: rows, resize_keyboard: true };
}

function chainKB() {
  const rows = [];
  for (let i = 0; i < DEXSCREENER_CHAINS.length; i += 2) {
    const row = [{ text: DEXSCREENER_CHAINS[i] }];
    if (DEXSCREENER_CHAINS[i + 1]) row.push({ text: DEXSCREENER_CHAINS[i + 1] });
    rows.push(row);
  }
  rows.push([{ text: 'Back to Main Menu' }]);
  return { keyboard: rows, resize_keyboard: true };
}

function payKB(chains) {
  const rows = chains.map(c => [{ text: CRYPTO_INFO[c].label }]);
  rows.push([{ text: 'Back to Main Menu' }]);
  return { keyboard: rows, resize_keyboard: true };
}

function confirmKB() {
  return { keyboard: [[{ text: '✓ Confirm Token' }], [{ text: '✎ Different Address' }], [{ text: 'Back to Main Menu' }]], resize_keyboard: true };
}

function paymentKB() {
  return { keyboard: [[{ text: '✓ Payment Sent' }], [{ text: '✗ Cancel Order' }]], resize_keyboard: true };
}

async function notifyAdmin(data) {
  if (!ADMIN_ID) return;
  const msg = 'NEW ORDER\n\nPlatform: ' + data.platform + '\nService: ' + data.service + '\nTier: ' + data.tier + '\nToken: ' + data.tokenName + '\nCA: ' + data.ca + '\nAmount: ' + data.amount + '\nUser: @' + (data.username || 'unknown');
  try { await bot.sendMessage(ADMIN_ID, msg); } catch (e) { console.error('Admin:', e.message); }
}

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text?.trim() || '';
  const session = getSession(chatId);

  try {
    if (text === '/start') {
      clearSession(chatId);
      await bot.sendMessage(chatId, '👋 Welcome to the Multi-Platform Token Booster Bot!\n\nReady to send your token to the moon? 🚀\n\n📉 DexScreener - Maximize visibility with trending status\n🔥 Pump.fun - Supercharge your Solana launches\n🐸 Four.Meme - Dominate the BSC meme coin charts\n⚡ Flap.sh - Automate your BSC project\n\n💡 Select a platform below:', { reply_markup: mainKB() });
      return;
    }

    if (text === 'About') {
      await bot.sendMessage(chatId, '✨ Why Choose Us?\n\n• Trusted by Professionals\n• Direct API Integration\n• 24/7 Premium Support\n\nContact: @Dave_211', { reply_markup: mainKB() });
      return;
    }

    if (text === 'Support') {
      await bot.sendMessage(chatId, '🛟 24/7 Support Available\n\nContact: @Dave_211\nResponse Time: ~15 minutes', { reply_markup: mainKB() });
      return;
    }

    if (text === 'Back to Main Menu') {
      clearSession(chatId);
      await bot.sendMessage(chatId, '👋 Select platform:', { reply_markup: mainKB() });
      return;
    }

    const pmatch = Object.keys(SERVICES).find(k => SERVICES[k].label === text.replace(/^[📊🔥🐸⚡] /, ''));
    if (pmatch) {
      session.platform = pmatch;
      session.step = 'service';
      const pv = SERVICES[pmatch];
      await bot.sendMessage(chatId, pv.emoji + ' ' + pv.fullName + '\n\n' + pv.platformDescription + '\n\nSelect service:', { reply_markup: serviceKB(pmatch) });
      return;
    }

    if (session.step === 'service' && session.platform) {
      const sv = Object.values(SERVICES[session.platform].services).find(s => s.label === text);
      if (sv) {
        session.service = Object.keys(SERVICES[session.platform].services).find(k => SERVICES[session.platform].services[k].label === text);
        let msg = sv.label + '\n\n' + sv.description + '\n\n' + sv.longDesc + '\n\nTiers:';
        sv.tiers.forEach((t, i) => {
          const p = SERVICES[session.platform].usdPriced ? '$' + t.priceUSD : t.priceAmount;
          msg += '\n' + (i + 1) + '. ' + t.label + ' (' + p + ') - ' + t.details;
        });

        if (sv.requiresChain) {
          session.step = 'chain';
          msg += '\n\nSelect blockchain:';
          await bot.sendMessage(chatId, msg, { reply_markup: chainKB() });
        } else {
          session.step = 'tier';
          const isUSD = SERVICES[session.platform].usdPriced;
          await bot.sendMessage(chatId, msg, { reply_markup: tierKB(session.platform, session.service, isUSD) });
        }
        return;
      }
    }

    if (session.step === 'chain' && DEXSCREENER_CHAINS.includes(text)) {
      session.chain = text;
      session.step = 'tier';
      const sv = SERVICES[session.platform].services[session.service];
      const isUSD = SERVICES[session.platform].usdPriced;
      let msg = 'Blockchain: ' + text + '\n\nTiers:';
      sv.tiers.forEach((t, i) => {
        const p = isUSD ? '$' + t.priceUSD : t.priceAmount;
        msg += '\n' + (i + 1) + '. ' + t.label + ' (' + p + ') - ' + t.details;
      });
      await bot.sendMessage(chatId, msg, { reply_markup: tierKB(session.platform, session.service, isUSD) });
      return;
    }

    if (session.step === 'tier') {
      const sv = SERVICES[session.platform].services[session.service];
      const tier = sv.tiers.find(t => text.includes(t.label));
      if (tier) {
        session.tier = tier;
        const pd = SERVICES[session.platform];

        if (pd.payChains.length > 1) {
          session.step = 'paychain';
          let msg = 'Tier: ' + tier.label + '\n\nPayment Methods:';
          pd.payChains.forEach(c => {
            const amt = pd.usdPriced ? '$' + tier.priceUSD + ' (~' + usdToCrypto(tier.priceUSD, c) + ' ' + c + ')' : tier.priceAmount + ' ' + c;
            msg += '\n' + CRYPTO_INFO[c].label + ' - ' + amt;
          });
          msg += '\n\nSelect network:';
          await bot.sendMessage(chatId, msg, { reply_markup: payKB(pd.payChains) });
        } else {
          session.payChain = pd.payChains[0];
          session.step = 'ca';
          await bot.sendMessage(chatId, 'Tier: ' + tier.label + '\nPayment: ' + CRYPTO_INFO[session.payChain].label + '\n\nSend Contract Address:', { reply_markup: { remove_keyboard: true } });
        }
        return;
      }
    }

    if (session.step === 'paychain') {
      const cs = Object.keys(CRYPTO_INFO).find(k => CRYPTO_INFO[k].label === text);
      if (cs) {
        session.payChain = cs;
        session.step = 'ca';
        const pd = SERVICES[session.platform];
        const tier = session.tier;
        const amt = pd.usdPriced ? usdToCrypto(tier.priceUSD, cs) : tier.priceAmount;
        const disp = pd.usdPriced ? '$' + tier.priceUSD + ' (~' + amt + ' ' + cs + ')' : amt + ' ' + cs;
        await bot.sendMessage(chatId, 'Network: ' + CRYPTO_INFO[cs].network + '\nAmount: ' + disp + '\n\nSend Contract Address:', { reply_markup: { remove_keyboard: true } });
        return;
      }
    }

    if (session.step === 'ca' && text.length > 20) {
      await bot.sendMessage(chatId, 'Verifying token...');
      const info = await fetchTokenInfo(text);

      if (info) {
        session.tokenInfo = info;
        session.step = 'confirm';
        let msg = 'TOKEN FOUND\n\nName: ' + info.name + '\nSymbol: $' + info.symbol + '\nChain: ' + info.chain + '\nPrice: $' + Number(info.price).toFixed(8) + '\nMarket Cap: ' + info.marketCap + '\n24h Volume: ' + info.volume24h + '\nLiquidity: ' + info.liquidity + '\n\nCA: ' + info.address + '\n\nCorrect?';

        if (info.imageUrl) {
          try {
            await bot.sendPhoto(chatId, info.imageUrl, { caption: msg, reply_markup: confirmKB() });
          } catch {
            await bot.sendMessage(chatId, msg, { reply_markup: confirmKB() });
          }
        } else {
          await bot.sendMessage(chatId, msg, { reply_markup: confirmKB() });
        }
      } else {
        await bot.sendMessage(chatId, 'Token not found.');
      }
      return;
    }

    if (session.step === 'confirm') {
      if (text === '✓ Confirm Token') {
        session.step = 'payment';
        const pd = SERVICES[session.platform];
        const tier = session.tier;
        const ci = CRYPTO_INFO[session.payChain];
        let disp;

        if (pd.usdPriced) {
          const c = usdToCrypto(tier.priceUSD, session.payChain);
          disp = '$' + tier.priceUSD + ' (~' + c + ' ' + session.payChain + ')';
        } else {
          disp = tier.priceAmount + ' ' + session.payChain;
        }

        let msg = 'ORDER SUMMARY\n\nPlatform: ' + pd.label + '\nService: ' + SERVICES[session.platform].services[session.service].label + '\nTier: ' + tier.label + '\nToken: ' + session.tokenInfo.name + ' ($' + session.tokenInfo.symbol + ')\n\nPAYMENT\n\nAmount: ' + disp + '\nNetwork: ' + ci.network + '\nDelivery: ' + tier.delivery + '\n\nWALLET:\n' + ci.wallet + '\n\nIMPORTANT\n• Send exact amount\n• Use correct network\n• Save TxHash';

        await bot.sendMessage(chatId, msg, { reply_markup: paymentKB() });

        await notifyAdmin({
          platform: pd.label,
          service: SERVICES[session.platform].services[session.service].label,
          tier: tier.label,
          tokenName: session.tokenInfo.name,
          tokenSymbol: session.tokenInfo.symbol,
          ca: session.tokenInfo.address,
          amount: disp,
          username: msg.from?.username,
          userId: msg.from?.id,
        });
        return;
      }

      if (text === '✎ Different Address') {
        session.step = 'ca';
        await bot.sendMessage(chatId, 'Send different CA:', { reply_markup: { remove_keyboard: true } });
        return;
      }
    }

    if (session.step === 'payment') {
      if (text === '✓ Payment Sent') {
        session.step = 'txhash';
        await bot.sendMessage(chatId, 'Provide TxHash:', { reply_markup: { remove_keyboard: true } });
        return;
      }

      if (text === '✗ Cancel Order') {
        clearSession(chatId);
        await bot.sendMessage(chatId, 'Order cancelled. /start', { reply_markup: mainKB() });
        return;
      }
    }

    if (session.step === 'txhash' && text.length > 10) {
      const pd = SERVICES[session.platform];
      const tier = session.tier;
      const sv = SERVICES[session.platform].services[session.service];
      let disp;

      if (pd.usdPriced) {
        const c = usdToCrypto(tier.priceUSD, session.payChain);
        disp = '$' + tier.priceUSD + ' (~' + c + ' ' + session.payChain + ')';
      } else {
        disp = tier.priceAmount + ' ' + session.payChain;
      }

      let msg = 'PAYMENT CONFIRMED\n\nThanks! Order received.\n\nORDER DETAILS\n\nPlatform: ' + pd.label + '\nService: ' + sv.label + '\nTier: ' + tier.label + '\nToken: ' + session.tokenInfo.name + '\nAmount: ' + disp + '\n\nTXHASH:\n' + text + '\n\nOrder begins in ' + tier.delivery + '\n\nNo results in 1h? @Dave_211\n\nThanks!';

      await bot.sendMessage(chatId, msg, { reply_markup: mainKB() });

      if (ADMIN_ID) {
        const admsg = 'CONFIRMED\n\nToken: ' + session.tokenInfo.name + '\nCA: ' + session.tokenInfo.address + '\nAmount: ' + disp + '\nTxHash: ' + text + '\nPlatform: ' + pd.label + '\nTier: ' + tier.label;
        try { await bot.sendMessage(ADMIN_ID, admsg); } catch (e) { console.error('Admin:', e.message); }
      }

      clearSession(chatId);
    }

  } catch (err) {
    console.error('Error:', err.message);
    await bot.sendMessage(chatId, 'Error. /start', { reply_markup: mainKB() }).catch(() => {});
  }
});

bot.on('polling_error', (err) => console.error('Polling:', err.code));
bot.on('error', (err) => console.error('Error:', err.message));
console.log('Bot Online');
