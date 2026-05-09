require(‘dotenv’).config();
const TelegramBot = require(‘node-telegram-bot-api’);
const axios = require(‘axios’);

require(’./server’);

const BOT_TOKEN = process.env.BOT_TOKEN || ‘YOUR_BOT_TOKEN_HERE’;

const WALLETS = {
SOL: process.env.SOL_WALLET || ‘AsSdLVZRX8BAdi5u4PGHefiAFdcsR8nRAaFBKpzhPtc2’,
BNB: process.env.BNB_WALLET || ‘bnb189gjjucwltdpnlemrveakf0q6xg0smfqdh6869’,
ETH: process.env.ETH_WALLET || ‘0x589e85724Eb0d8Fc8C1e5A0b3B429483c91F90E3’,
};

const ADMIN_ID = process.env.ADMIN_ID || null;

const SERVICES = {
dexscreener: {
label: ‘DexScreener’,
emoji: ‘📊’,
fullName: ‘DexScreener — Multi-Chain Token Intelligence Platform’,
payChains: [‘ETH’, ‘BNB’, ‘SOL’],
usdPriced: true,
platformDescription: ‘DexScreener is the world's leading real-time DEX trading analytics platform. Your token's DexScreener presence is the first impression serious investors get.’,
services: {
update: {
label: ‘Profile Update Service’,
description: ‘Comprehensive token profile optimization — logo, name, website, socials, description.’,
longDesc: ‘An incomplete profile drives away serious investors. We ensure your token appears polished, professional, and trustworthy.’,
tiers: [
{ id: ‘basic’, label: ‘Essentials Package’, priceUSD: 50, delivery: ‘24 hours’, details: ‘New projects’ },
{ id: ‘premium’, label: ‘Professional Package’, priceUSD: 120, delivery: ‘6-12 hours’, details: ‘Serious projects’ },
],
requiresChain: true,
},
trending: {
label: ‘Trending Placement Service’,
description: ‘Premium placement in DexScreener's trending section — where thousands of traders hunt opportunities daily.’,
longDesc: ‘Being featured in trending creates instant visibility to active buyers and drives organic buying pressure.’,
tiers: [
{ id: ‘bronze’, label: ‘Quick Surge (6h)’, priceUSD: 150, delivery: ‘30 min’, details: ‘Flash pumps’ },
{ id: ‘silver’, label: ‘Momentum Build (12h)’, priceUSD: 280, delivery: ‘30 min’, details: ‘Sustained growth’ },
{ id: ‘gold’, label: ‘Full Day Dominance (24h)’, priceUSD: 500, delivery: ‘30 min’, details: ‘Maximum exposure’ },
],
requiresChain: true,
},
volume: {
label: ‘Trading Volume Amplification’,
description: ‘Strategic 24h trading volume boost using real wallet activity. High volume drives trader attention.’,
longDesc: ‘Volume is crucial. Our service deploys distributed wallets with natural trading patterns.’,
tiers: [
{ id: ‘basic’, label: ‘Baseline Activity’, priceUSD: 80, delivery: ‘1 hour’, details: ‘Establishes presence’ },
{ id: ‘medium’, label: ‘Momentum Push’, priceUSD: 180, delivery: ‘1 hour’, details: ‘Chart rankings’ },
{ id: ‘heavy’, label: ‘Volume Explosion’, priceUSD: 350, delivery: ‘1 hour’, details: ‘Top charts’ },
],
requiresChain: true,
},
boost: {
label: ‘Complete Market Domination’,
description: ‘Ultimate strategy: heavy volume + trending placement. When traders see both, FOMO is unstoppable.’,
longDesc: ‘Market domination requires visibility and credibility. This package pairs devastating volume with trending.’,
tiers: [
{ id: ‘starter’, label: ‘Launch Day Surge’, priceUSD: 200, delivery: ‘30 min’, details: ‘Strong entry’ },
{ id: ‘pro’, label: ‘Professional Launch’, priceUSD: 400, delivery: ‘30 min’, details: ‘Proven sweet-spot’ },
{ id: ‘ultra’, label: ‘Maximum Dominance’, priceUSD: 750, delivery: ‘30 min’, details: ‘Absolute control’ },
],
requiresChain: true,
},
},
},

pumpfun: {
label: ‘Pump.fun’,
emoji: ‘🔥’,
fullName: ‘Pump.fun — Solana's #1 Community-Driven Launch Platform’,
payChains: [‘SOL’],
usdPriced: false,
nativeCurrency: ‘SOL’,
platformDescription: ‘Pump.fun is Solana's leading token launch platform with $500M+ daily volume. Success means rapid holder acquisition.’,
services: {
boost: {
label: ‘Volume & Holder Boost’,
description: ‘Accelerate your token with volume bursts and real holder acquisition.’,
longDesc: ‘Our service deploys Solana wallets to generate trading volume AND holder acquisition simultaneously.’,
tiers: [
{ id: ‘basic’, label: ‘Community Starter’, priceAmount: 0.5, delivery: ‘15 min’, details: ‘Initial presence’ },
{ id: ‘medium’, label: ‘Growth Accelerator’, priceAmount: 1.0, delivery: ‘15 min’, details: ‘Strong momentum’ },
{ id: ‘mega’, label: ‘Front-Page Domination’, priceAmount: 2.0, delivery: ‘15 min’, details: ‘Maximum visibility’ },
],
},
trending: {
label: ‘Pump.fun Trending Placement’,
description: ‘Place your token in trending — watched by 100,000+ traders daily.’,
longDesc: ‘Being featured acts as a credibility signal and creates a self-reinforcing cycle of visibility.’,
tiers: [
{ id: ‘basic’, label: ‘Trending Push’, priceAmount: 1.5, delivery: ‘20 min’, details: ‘Discovery entry’ },
{ id: ‘premium’, label: ‘Elite Trending (Top 10)’, priceAmount: 3.0, delivery: ‘20 min’, details: ‘Maximum pressure’ },
],
},
volume: {
label: ‘Trading Volume Surge’,
description: ‘Generate authentic trading volume using real Solana wallets.’,
longDesc: ‘A token with substantial volume feels safe and liquid. Our service creates authentic market activity.’,
tiers: [
{ id: ‘basic’, label: ‘Liquidity Foundation’, priceAmount: 0.5, delivery: ‘30 min’, details: ‘Baseline trading’ },
{ id: ‘medium’, label: ‘Volume Acceleration’, priceAmount: 1.0, delivery: ‘30 min’, details: ‘Chart visibility’ },
{ id: ‘heavy’, label: ‘Volume Explosion’, priceAmount: 2.0, delivery: ‘30 min’, details: ‘Max appearance’ },
],
},
graduation: {
label: ‘Graduation Acceleration’,
description: ‘Fast-track to graduation ($69K) and Raydium migration.’,
longDesc: ‘Pump.fun graduation is the holy grail. Our service uses strategic volume bursts to accelerate progress.’,
tiers: [
{ id: ‘assist’, label: ‘Completion Assist (40-60%)’, priceAmount: 2.5, delivery: ‘30 min’, details: ‘Mid-stage push’ },
{ id: ‘boost’, label: ‘Graduation Boost (60-80%)’, priceAmount: 4.0, delivery: ‘30 min’, details: ‘Heavy push’ },
{ id: ‘express’, label: ‘Express (80%+)’, priceAmount: 6.0, delivery: ‘15 min’, details: ‘Maximum speed’ },
],
},
},
},

fourmeme: {
label: ‘Four.Meme’,
emoji: ‘🐸’,
fullName: ‘Four.Meme — BSC's Premier Meme Coin Launchpad’,
payChains: [‘BNB’],
usdPriced: false,
nativeCurrency: ‘BNB’,
platformDescription: ‘Four.Meme is the leading meme token launchpad on BNB Chain with tens of thousands of active traders.’,
services: {
boost: {
label: ‘Community & Volume Boost’,
description: ‘Grow your token's holder base and trading volume.’,
longDesc: ‘Our service deploys real BNB wallets to increase both holders and volume simultaneously.’,
tiers: [
{ id: ‘basic’, label: ‘Community Foundation’, priceAmount: 0.3, delivery: ‘15 min’, details: ‘Initial growth’ },
{ id: ‘medium’, label: ‘Community Growth’, priceAmount: 0.6, delivery: ‘15 min’, details: ‘Chart momentum’ },
{ id: ‘mega’, label: ‘BSC Dominance’, priceAmount: 1.0, delivery: ‘15 min’, details: ‘Maximum presence’ },
],
},
trending: {
label: ‘Trending Placement Service’,
description: ‘Secure premium positioning in Four.Meme's trending section.’,
longDesc: ‘Four.Meme's trending page is the primary discovery mechanism for meme coins.’,
tiers: [
{ id: ‘basic’, label: ‘Trending Visibility’, priceAmount: 0.5, delivery: ‘20 min’, details: ‘Discovery entry’ },
{ id: ‘premium’, label: ‘Elite Trending’, priceAmount: 1.0, delivery: ‘20 min’, details: ‘Maximum exposure’ },
],
},
volume: {
label: ‘Trading Volume Generation’,
description: ‘Create authentic trading volume using distributed BNB wallets.’,
longDesc: ‘A token with volume appears healthy. Our service creates convincing market action.’,
tiers: [
{ id: ‘basic’, label: ‘Volume Foundation’, priceAmount: 0.3, delivery: ‘30 min’, details: ‘Baseline activity’ },
{ id: ‘medium’, label: ‘Volume Growth’, priceAmount: 0.6, delivery: ‘30 min’, details: ‘Trader attention’ },
{ id: ‘heavy’, label: ‘Volume Dominance’, priceAmount: 1.0, delivery: ‘30 min’, details: ‘Top-tier volume’ },
],
},
},
},

flapsh: {
label: ‘Flap.sh’,
emoji: ‘⚡’,
fullName: ‘Flap.sh — Advanced BSC Token Growth Platform’,
payChains: [‘BNB’],
usdPriced: false,
nativeCurrency: ‘BNB’,
platformDescription: ‘Flap.sh is BSC's growing premium token platform combining community energy with advanced analytics.’,
services: {
boost: {
label: ‘Growth Acceleration Package’,
description: ‘Accelerate your token with coordinated holder acquisition and trading volume.’,
longDesc: ‘Our service pairs real wallet acquisition with strategic volume, signaling healthy momentum.’,
tiers: [
{ id: ‘basic’, label: ‘Launch Momentum’, priceAmount: 0.3, delivery: ‘15 min’, details: ‘Initial phase’ },
{ id: ‘medium’, label: ‘Momentum Builder’, priceAmount: 0.6, delivery: ‘15 min’, details: ‘Sustained growth’ },
{ id: ‘mega’, label: ‘Growth Explosion’, priceAmount: 1.0, delivery: ‘15 min’, details: ‘Maximum presence’ },
],
},
trending: {
label: ‘Trending Breakthrough’,
description: ‘Place your token in Flap.sh's trending section for maximum discovery.’,
longDesc: ‘Flap.sh trending placement means visibility to the platform's most engaged traders.’,
tiers: [
{ id: ‘basic’, label: ‘Trending Entry’, priceAmount: 0.5, delivery: ‘20 min’, details: ‘Foundation visibility’ },
{ id: ‘premium’, label: ‘Premium Trending’, priceAmount: 1.0, delivery: ‘20 min’, details: ‘Maximum exposure’ },
],
},
volume: {
label: ‘Volume Optimization’,
description: ‘Strategically generate trading volume using distributed BNB wallets.’,
longDesc: ‘Volume is credibility. Our service creates convincing market activity.’,
tiers: [
{ id: ‘basic’, label: ‘Baseline Volume’, priceAmount: 0.3, delivery: ‘30 min’, details: ‘Trading presence’ },
{ id: ‘medium’, label: ‘Volume Push’, priceAmount: 0.6, delivery: ‘30 min’, details: ‘Significant volume’ },
{ id: ‘heavy’, label: ‘Volume Peak’, priceAmount: 1.0, delivery: ‘30 min’, details: ‘Maximum performance’ },
],
},
},
},
};

const DEXSCREENER_CHAINS = [
‘Ethereum’, ‘BNB Chain’, ‘Polygon’, ‘Arbitrum’,
‘Avalanche’, ‘Fantom’, ‘Solana’, ‘Base’,
‘Cronos’, ‘Kava’, ‘TRON’, ‘TON’, ‘SUI’,
];

const CRYPTO_INFO = {
ETH: { label: ‘Ethereum (ETH)’, wallet: WALLETS.ETH, network: ‘Ethereum Mainnet’, rate: 3000 },
BNB: { label: ‘BNB (BNB)’, wallet: WALLETS.BNB, network: ‘BNB Smart Chain’, rate: 600 },
SOL: { label: ‘Solana (SOL)’, wallet: WALLETS.SOL, network: ‘Solana Mainnet’, rate: 150 },
};

function usdToCrypto(usd, symbol) {
const rate = CRYPTO_INFO[symbol]?.rate || 1;
const amount = usd / rate;
if (symbol === ‘ETH’ || symbol === ‘BNB’) return amount.toFixed(4);
return amount.toFixed(3);
}

const bot = new TelegramBot(BOT_TOKEN, { polling: { interval: 300, params: { timeout: 20 } } });
const sessions = {};

function getSession(chatId) {
if (!sessions[chatId]) sessions[chatId] = {};
return sessions[chatId];
}

function clearSession(chatId) {
delete sessions[chatId];
}

async function fetchTokenInfo(address) {
try {
const res = await axios.get(`https://api.dexscreener.com/latest/dex/tokens/${address}`, { timeout: 10000 });
const pairs = res.data?.pairs;
if (!pairs || pairs.length === 0) return null;
const pair = pairs[0];
return {
name: pair.baseToken?.name || ‘Unknown’,
symbol: pair.baseToken?.symbol || ‘???’,
address: pair.baseToken?.address || address,
chain: pair.chainId || ‘unknown’,
price: pair.priceUsd || ‘0’,
marketCap: pair.marketCap ? ‘$’ + Number(pair.marketCap).toLocaleString() : ‘N/A’,
liquidity: pair.liquidity?.usd ? ‘$’ + Number(pair.liquidity.usd).toLocaleString() : ‘N/A’,
volume24h: pair.volume?.h24 ? ‘$’ + Number(pair.volume.h24).toLocaleString() : ‘N/A’,
priceChange24h: pair.priceChange?.h24 || ‘0’,
imageUrl: pair.info?.imageUrl || null,
};
} catch (e) {
console.error(‘Token fetch error:’, e.message);
return null;
}
}

function mainMenuKB() {
return {
keyboard: [
[{ text: ‘📊 DexScreener’ }, { text: ‘🔥 Pump.fun’ }],
[{ text: ‘🐸 Four.Meme’ }, { text: ‘⚡ Flap.sh’ }],
[{ text: ‘About’ }, { text: ‘Support’ }],
],
resize_keyboard: true,
one_time_keyboard: false,
};
}

function serviceKB(platformKey) {
const svc = SERVICES[platformKey];
const keys = Object.keys(svc.services);
const rows = [];
for (let i = 0; i < keys.length; i += 2) {
const row = [{ text: svc.services[keys[i]].label }];
if (keys[i + 1]) row.push({ text: svc.services[keys[i + 1]].label });
rows.push(row);
}
rows.push([{ text: ‘Back to Main Menu’ }]);
return { keyboard: rows, resize_keyboard: true };
}

function tierKB(platformKey, serviceKey, isPriceInUSD = false) {
const sv = SERVICES[platformKey].services[serviceKey];
const rows = sv.tiers.map(t => {
const price = isPriceInUSD ? `$${t.priceUSD}` : `${t.priceAmount}`;
return [{ text: `${t.label} ▸ ${price}` }];
});
rows.push([{ text: ‘Back to Main Menu’ }]);
return { keyboard: rows, resize_keyboard: true };
}

function chainKB() {
const rows = [];
for (let i = 0; i < DEXSCREENER_CHAINS.length; i += 2) {
const row = [{ text: DEXSCREENER_CHAINS[i] }];
if (DEXSCREENER_CHAINS[i + 1]) row.push({ text: DEXSCREENER_CHAINS[i + 1] });
rows.push(row);
}
rows.push([{ text: ‘Back to Main Menu’ }]);
return { keyboard: rows, resize_keyboard: true };
}

function payChainKB(chains) {
const rows = chains.map(c => [{ text: CRYPTO_INFO[c].label }]);
rows.push([{ text: ‘Back to Main Menu’ }]);
return { keyboard: rows, resize_keyboard: true };
}

function confirmTokenKB() {
return {
keyboard: [
[{ text: ‘✓ Confirm Token’ }],
[{ text: ‘✎ Different Address’ }],
[{ text: ‘Back to Main Menu’ }],
],
resize_keyboard: true,
};
}

function paymentKB() {
return {
keyboard: [
[{ text: ‘✓ Payment Sent’ }],
[{ text: ‘✗ Cancel Order’ }],
],
resize_keyboard: true,
};
}

async function notifyAdmin(data) {
if (!ADMIN_ID) return;
const msg = `📊 <b>NEW ORDER</b>\n\n` +
`<b>Platform:</b> ${data.platform}\n` +
`<b>Service:</b> ${data.service}\n` +
`<b>Tier:</b> ${data.tier}\n` +
`<b>Token:</b> ${data.tokenName} ($${data.tokenSymbol})\n` +
`<b>CA:</b> <code>${data.ca}</code>\n` +
`<b>Amount:</b> ${data.amount}\n` +
`<b>User:</b> @${data.username || 'unknown'} (${data.userId})`;
try {
await bot.sendMessage(ADMIN_ID, msg, { parse_mode: ‘HTML’ });
} catch (e) {
console.error(‘Admin error:’, e.message);
}
}

bot.on(‘message’, async (msg) => {
const chatId = msg.chat.id;
const text = msg.text?.trim() || ‘’;
const session = getSession(chatId);

try {
if (text === ‘/start’) {
clearSession(chatId);
await bot.sendMessage(chatId,
`<b>🚀 DEX BOOSTING BOT</b>\n\nYour Professional Token Growth Partner\n\n` +
`📊 DexScreener — Updates, trending, volume\n` +
`🔥 Pump.fun — Solana growth & graduation\n` +
`🐸 Four.Meme — BSC community & charts\n` +
`⚡ Flap.sh — BSC growth & trending\n\n` +
`<b>How it works:</b>\n` +
`1️⃣ Select platform\n` +
`2️⃣ Choose service & tier\n` +
`3️⃣ Provide token CA\n` +
`4️⃣ Send payment\n` +
`5️⃣ Watch your token 🚀\n\n` +
`<b>Select a platform:</b>`,
{ parse_mode: ‘HTML’, reply_markup: mainMenuKB() }
);
return;
}

```
if (text === 'About') {
  await bot.sendMessage(chatId,
    `<b>ℹ️ ABOUT</b>\n\nProfessional token growth services.\n\n` +
    `🔐 <b>SECURITY:</b> No private keys, on-chain verification\n` +
    `⚡ <b>DELIVERY:</b> 15-30 minutes\n` +
    `💰 <b>PRICING:</b> Transparent, no hidden fees\n` +
    `📞 <b>SUPPORT:</b> 24/7 @Dave_211\n\n` +
    `Version 2.0 — Multi-Platform Edition`,
    { parse_mode: 'HTML', reply_markup: mainMenuKB() }
  );
  return;
}

if (text === 'Support') {
  await bot.sendMessage(chatId,
    `<b>🛟 SUPPORT</b>\n\n24/7 assistance available.\n\n` +
    `<b>Contact:</b> @Dave_211\n` +
    `<b>Response Time:</b> ~15 minutes\n\n` +
    `Include: Order details, TxHash, CA, Issue\n\n` +
    `We're here to help! 👍`,
    { parse_mode: 'HTML', reply_markup: mainMenuKB() }
  );
  return;
}

if (text === 'Back to Main Menu') {
  clearSession(chatId);
  await bot.sendMessage(chatId,
    `<b>🚀 DEX BOOSTING BOT</b>\n\nSelect a platform:`,
    { parse_mode: 'HTML', reply_markup: mainMenuKB() }
  );
  return;
}

// Platform selection
if (Object.keys(SERVICES).some(k => SERVICES[k].label === text || SERVICES[k].emoji + ' ' + SERVICES[k].label === text)) {
  const platformKey = Object.keys(SERVICES).find(k => 
    SERVICES[k].label === text.replace(/^📊 |^🔥 |^🐸 |^⚡ /, '')
  );
  
  if (platformKey) {
    session.platform = platformKey;
    session.step = 'service';
    const pv = SERVICES[platformKey];
    
    let msg = `<b>${pv.emoji} ${pv.fullName}</b>\n\n`;
    msg += `${pv.platformDescription}\n\n`;
    msg += `<b>Services Available:</b>`;
    
    await bot.sendMessage(chatId, msg, { 
      parse_mode: 'HTML', 
      reply_markup: serviceKB(platformKey)
    });
    return;
  }
}

// Service selection
if (session.step === 'service' && session.platform) {
  const sv = Object.values(SERVICES[session.platform].services).find(s => s.label === text);
  if (sv) {
    session.service = Object.keys(SERVICES[session.platform].services).find(k => 
      SERVICES[session.platform].services[k].label === text
    );
    
    let detailMsg = `<b>${sv.label}</b>\n\n`;
    detailMsg += `${sv.description}\n\n`;
    detailMsg += `${sv.longDesc}\n\n`;
    detailMsg += `<b>Available Tiers:</b>\n\n`;

    sv.tiers.forEach((t, i) => {
      const price = SERVICES[session.platform].usdPriced ? `$${t.priceUSD}` : `${t.priceAmount}`;
      detailMsg += `${i + 1}. <b>${t.label}</b> (${price})\n   ${t.details}\n`;
    });

    if (sv.requiresChain) {
      session.step = 'chain';
      detailMsg += '\n<b>Select your blockchain:</b>';
      await bot.sendMessage(chatId, detailMsg, { 
        parse_mode: 'HTML', 
        reply_markup: chainKB()
      });
    } else {
      session.step = 'tier';
      const isPriceInUSD = SERVICES[session.platform].usdPriced;
      await bot.sendMessage(chatId, detailMsg, { 
        parse_mode: 'HTML', 
        reply_markup: tierKB(session.platform, session.service, isPriceInUSD)
      });
    }
    return;
  }
}

// Chain selection
if (session.step === 'chain' && DEXSCREENER_CHAINS.includes(text)) {
  session.chain = text;
  session.step = 'tier';
  const sv = SERVICES[session.platform].services[session.service];
  const isPriceInUSD = SERVICES[session.platform].usdPriced;
  
  let msg = `✅ <b>Blockchain: ${text}</b>\n\n<b>Select Tier:</b>\n\n`;
  
  sv.tiers.forEach((t, i) => {
    const price = isPriceInUSD ? `$${t.priceUSD}` : `${t.priceAmount}`;
    msg += `${i + 1}. ${t.label} — ${price}\n   ${t.details}\n`;
  });
  
  await bot.sendMessage(chatId, msg, { 
    parse_mode: 'HTML', 
    reply_markup: tierKB(session.platform, session.service, isPriceInUSD)
  });
  return;
}

// Tier selection
if (session.step === 'tier') {
  const sv = SERVICES[session.platform].services[session.service];
  const tier = sv.tiers.find(t => text.includes(t.label));
  if (tier) {
    session.tier = tier;
    const platformData = SERVICES[session.platform];
    
    if (platformData.payChains.length > 1) {
      session.step = 'paychain';
      let msg = `✅ <b>Tier: ${tier.label}</b>\n\n<b>Payment Methods:</b>\n\n`;
      
      platformData.payChains.forEach((c) => {
        const info = CRYPTO_INFO[c];
        const cryptoAmount = platformData.usdPriced ? usdToCrypto(tier.priceUSD, c) : tier.priceAmount;
        const displayPrice = platformData.usdPriced ? `$${tier.priceUSD} (~${cryptoAmount} ${c})` : `${cryptoAmount} ${c}`;
        msg += `${info.label} — ${displayPrice}\n`;
      });
      
      msg += '\n<b>Select payment network:</b>';
      await bot.sendMessage(chatId, msg, { 
        parse_mode: 'HTML', 
        reply_markup: payChainKB(platformData.payChains)
      });
    } else {
      session.payChain = platformData.payChains[0];
      session.step = 'ca';
      await bot.sendMessage(chatId,
        `✅ <b>Tier & Payment Selected</b>\n\n${tier.label}\nPayment: ${CRYPTO_INFO[session.payChain].label}\n\n<b>Send your token Contract Address:</b>`,
        { parse_mode: 'HTML', reply_markup: { remove_keyboard: true } }
      );
    }
    return;
  }
}

// Pay chain selection
if (session.step === 'paychain') {
  const chainSymbol = Object.keys(CRYPTO_INFO).find(k => CRYPTO_INFO[k].label === text);
  if (chainSymbol) {
    session.payChain = chainSymbol;
    session.step = 'ca';
    const platformData = SERVICES[session.platform];
    const tier = session.tier;
    const cryptoAmount = platformData.usdPriced ? usdToCrypto(tier.priceUSD, chainSymbol) : tier.priceAmount;
    const displayPrice = platformData.usdPriced ? `$${tier.priceUSD} (~${cryptoAmount} ${chainSymbol})` : `${cryptoAmount} ${chainSymbol}`;
    
    await bot.sendMessage(chatId,
      `✅ <b>Payment Method Selected</b>\n\nNetwork: ${CRYPTO_INFO[chainSymbol].network}\nAmount: ${displayPrice}\n\n<b>Send your token Contract Address:</b>`,
      { parse_mode: 'HTML', reply_markup: { remove_keyboard: true } }
    );
    return;
  }
}

// Handle CA input
if (session.step === 'ca' && text && text.length > 20) {
  await bot.sendMessage(chatId, '🔍 <b>Verifying token...</b>', { parse_mode: 'HTML' });
  const tokenInfo = await fetchTokenInfo(text);

  if (tokenInfo) {
    session.tokenInfo = tokenInfo;
    
    let msg = `<b>✅ TOKEN FOUND</b>\n\n`;
    msg += `Name: ${tokenInfo.name}\n`;
    msg += `Symbol: $${tokenInfo.symbol}\n`;
    msg += `Chain: ${tokenInfo.chain}\n`;
    msg += `Price: $${Number(tokenInfo.price).toFixed(8)}\n`;
    msg += `Market Cap: ${tokenInfo.marketCap}\n`;
    msg += `24h Volume: ${tokenInfo.volume24h}\n`;
    msg += `Liquidity: ${tokenInfo.liquidity}\n\n`;
    msg += `<b>TOKEN CA (tap to copy):</b>\n`;
    msg += `<code>${tokenInfo.address}</code>\n\n`;
    msg += `<b>Correct token?</b>`;

    session.step = 'confirm';

    if (tokenInfo.imageUrl) {
      try {
        await bot.sendPhoto(chatId, tokenInfo.imageUrl, { 
          caption: msg,
          parse_mode: 'HTML',
          reply_markup: confirmTokenKB()
        });
      } catch {
        await bot.sendMessage(chatId, msg, { 
          parse_mode: 'HTML',
          reply_markup: confirmTokenKB()
        });
      }
    } else {
      await bot.sendMessage(chatId, msg, { 
        parse_mode: 'HTML',
        reply_markup: confirmTokenKB()
      });
    }
  } else {
    await bot.sendMessage(chatId,
      `❌ <b>Token not found.</b>\n\nVerify:\n• Address is correct\n• Token on supported chain\n• Has liquidity pairs`,
      { parse_mode: 'HTML' }
    );
  }
  return;
}

// Token confirmation
if (session.step === 'confirm') {
  if (text === '✓ Confirm Token') {
    session.step = 'payment';
    const platformData = SERVICES[session.platform];
    const tier = session.tier;
    const chainInfo = CRYPTO_INFO[session.payChain];
    let displayAmount;

    if (platformData.usdPriced) {
      const crypto = usdToCrypto(tier.priceUSD, session.payChain);
      displayAmount = `$${tier.priceUSD} (~${crypto} ${session.payChain})`;
    } else {
      displayAmount = `${tier.priceAmount} ${session.payChain}`;
    }

    let orderMsg = `<b>📋 ORDER SUMMARY</b>\n\n`;
    orderMsg += `Platform: ${platformData.label}\n`;
    orderMsg += `Service: ${SERVICES[session.platform].services[session.service].label}\n`;
    orderMsg += `Tier: ${tier.label}\n`;
    orderMsg += `Token: ${session.tokenInfo.name} ($${session.tokenInfo.symbol})\n\n`;
    orderMsg += `<b>💰 PAYMENT</b>\n\n`;
    orderMsg += `Amount: <b>${displayAmount}</b>\n`;
    orderMsg += `Network: <b>${chainInfo.network}</b>\n`;
    orderMsg += `Delivery: <b>${tier.delivery}</b>\n\n`;
    orderMsg += `<b>WALLET (tap to copy):</b>\n`;
    orderMsg += `<code>${chainInfo.wallet}</code>\n\n`;
    orderMsg += `<b>⚠️ Important:</b>\n` +
      `• Send exactly the amount\n` +
      `• Use correct network\n` +
      `• Save your TxHash\n\n` +
      `When done, tap "Payment Sent"`;

    await bot.sendMessage(chatId, orderMsg, { 
      parse_mode: 'HTML', 
      reply_markup: paymentKB()
    });

    await notifyAdmin({
      platform: platformData.label,
      service: SERVICES[session.platform].services[session.service].label,
      tier: tier.label,
      tokenName: session.tokenInfo.name,
      tokenSymbol: session.tokenInfo.symbol,
      ca: session.tokenInfo.address,
      amount: displayAmount,
      username: msg.from?.username,
      userId: msg.from?.id,
    });
    return;
  }

  if (text === '✎ Different Address') {
    session.step = 'ca';
    await bot.sendMessage(chatId, '<b>Send a different Contract Address:</b>', { parse_mode: 'HTML' });
    return;
  }
}

// Payment sent
if (session.step === 'payment') {
  if (text === '✓ Payment Sent') {
    session.step = 'txhash';
    await bot.sendMessage(chatId, '<b>📨 Provide your transaction hash (TxHash):</b>', { 
      parse_mode: 'HTML',
      reply_markup: { remove_keyboard: true }
    });
    return;
  }

  if (text === '✗ Cancel Order') {
    clearSession(chatId);
    await bot.sendMessage(chatId, '❌ <b>Order cancelled.</b> Type /start to begin again.', { 
      parse_mode: 'HTML',
      reply_markup: mainMenuKB()
    });
    return;
  }
}

// Handle TxHash input
if (session.step === 'txhash' && text && text.length > 10) {
  const platformData = SERVICES[session.platform];
  const tier = session.tier;
  const sv = SERVICES[session.platform].services[session.service];
  let displayAmount;

  if (platformData.usdPriced) {
    const crypto = usdToCrypto(tier.priceUSD, session.payChain);
    displayAmount = `$${tier.priceUSD} (~${crypto} ${session.payChain})`;
  } else {
    displayAmount = `${tier.priceAmount} ${session.payChain}`;
  }

  let confirmMsg = `<b>✅ PAYMENT CONFIRMED</b>\n\n`;
  confirmMsg += `Thank you! Order received.\n\n`;
  confirmMsg += `<b>ORDER DETAILS:</b>\n`;
  confirmMsg += `Platform: ${platformData.label}\n`;
  confirmMsg += `Service: ${sv.label}\n`;
  confirmMsg += `Tier: ${tier.label}\n`;
  confirmMsg += `Token: ${session.tokenInfo.name}\n`;
  confirmMsg += `Amount: ${displayAmount}\n\n`;
  confirmMsg += `<b>TXHASH (tap to copy):</b>\n`;
  confirmMsg += `<code>${text}</code>\n\n`;
  confirmMsg += `<b>⏱ Order begins in ${tier.delivery}</b>\n\n` +
    `No results in 1 hour? Contact @Dave_211\n\n` +
    `Thanks for using Dex Boosting Bot! 🚀`;

  await bot.sendMessage(chatId, confirmMsg, { 
    parse_mode: 'HTML', 
    reply_markup: mainMenuKB()
  });

  if (ADMIN_ID) {
    const adminMsg = `<b>✅ PAYMENT CONFIRMED</b>\n\n` +
      `Token: ${session.tokenInfo.name}\n` +
      `CA: <code>${session.tokenInfo.address}</code>\n` +
      `Amount: ${displayAmount}\n` +
      `TxHash: <code>${text}</code>\n` +
      `Platform: ${platformData.label}\n` +
      `Tier: ${tier.label}`;
    try {
      await bot.sendMessage(ADMIN_ID, adminMsg, { parse_mode: 'HTML' });
    } catch (e) {
      console.error('Admin error:', e.message);
    }
  }

  clearSession(chatId);
}
```

} catch (err) {
console.error(‘Error:’, err.message);
await bot.sendMessage(chatId, ‘⚠️ Error occurred. Type /start’, { reply_markup: mainMenuKB() }).catch(() => {});
}
});

bot.on(‘polling_error’, (err) => console.error(‘Polling:’, err.code));
bot.on(‘error’, (err) => console.error(‘Error:’, err.message));

console.log(‘✅ Bot Started’);