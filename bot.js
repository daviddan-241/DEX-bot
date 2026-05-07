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
platformDescription: ‘DexScreener is the world's leading real-time DEX trading analytics platform, trusted by over 1 million crypto traders monthly. Your token's DexScreener presence is often the first impression professional investors get.’,
services: {
update: {
label: ‘Profile Update Service’,
description: ‘Comprehensive token profile optimization on DexScreener — logo, name, website, all social media channels, and description.’,
longDesc: ‘When traders search your token on DexScreener, they see your profile first. An incomplete profile drives away serious investors. Our service ensures your token appears polished, professional, and trustworthy with high-res logos, updated socials, and professional descriptions.’,
tiers: [
{ id: ‘basic’, label: ‘Essentials Package’, priceUSD: 50, delivery: ‘24 hours’, details: ‘Perfect for new projects’, includes: [‘Logo upload’, ‘Name verification’, ‘Website link’, ‘Twitter/X + Telegram’, ‘Basic description’] },
{ id: ‘premium’, label: ‘Professional Package’, priceUSD: 120, delivery: ‘6-12 hours’, details: ‘For serious projects’, includes: [‘Everything in Essentials’, ‘Banner image’, ‘Extended description’, ‘Discord + GitHub’, ‘Priority support’] },
],
requiresChain: true,
},
trending: {
label: ‘Trending Placement Service’,
description: ‘Secure premium placement in DexScreener's trending section — where thousands of traders hunt for opportunities daily.’,
longDesc: ‘DexScreener's Trending section is the #1 discovery mechanism. Being featured there creates instant visibility to active buyers, driving organic buying pressure and validating your token's legitimacy.’,
tiers: [
{ id: ‘bronze’, label: ‘Quick Surge (6h)’, priceUSD: 150, delivery: ‘30 min’, details: ‘Flash pumps and activation’, includes: [‘6 hours trending’, ‘Real wallet activity’, ‘Natural patterns’, ‘Anti-bot algorithms’, ‘Monitoring’] },
{ id: ‘silver’, label: ‘Momentum Build (12h)’, priceUSD: 280, delivery: ‘30 min’, details: ‘Sustained growth’, includes: [‘12 hours trending’, ‘Holder increase’, ‘Enhanced algorithms’, ‘24/7 support’] },
{ id: ‘gold’, label: ‘Full Day Dominance (24h)’, priceUSD: 500, delivery: ‘30 min’, details: ‘Maximum exposure’, includes: [‘24 hours trending’, ‘100+ holder acquisition’, ‘Premium volume push’, ‘VIP support’, ‘Performance report’] },
],
requiresChain: true,
},
volume: {
label: ‘Trading Volume Amplification’,
description: ‘Strategic 24h trading volume boost using real wallet activity. High volume creates organic market interest and pushes tokens into volume leaderboards.’,
longDesc: ‘Volume is crucial for attracting traders. Our service deploys distributed wallets with natural trading patterns to create convincing market activity while bypassing anti-bot filters.’,
tiers: [
{ id: ‘basic’, label: ‘Baseline Activity’, priceUSD: 80, delivery: ‘1 hour’, details: ‘Establishes presence’, includes: [‘Distributed wallets’, ‘Randomized trades’, ‘Natural timing’, ‘Real blockchain’, ‘Anti-bot patterns’] },
{ id: ‘medium’, label: ‘Momentum Push’, priceUSD: 180, delivery: ‘1 hour’, details: ‘Chart rankings’, includes: [‘Everything Baseline’, ‘Higher frequency’, ‘Larger trades’, ‘Chart boost’, ‘30-50 holder diversity’] },
{ id: ‘heavy’, label: ‘Volume Explosion’, priceUSD: 350, delivery: ‘1 hour’, details: ‘Top charts’, includes: [‘Everything Momentum’, ‘Max frequency’, ‘100+ wallet network’, ‘Top 10 charts’, ‘FOMO activity’] },
],
requiresChain: true,
},
boost: {
label: ‘Complete Market Domination’,
description: ‘Ultimate strategy: heavy volume + trending placement combined. When traders see high volume AND trending, FOMO becomes irresistible.’,
longDesc: ‘Market domination requires both visibility and credibility. This package pairs devastating volume with trending placement, creating a psychological double-impact that drives explosive organic buying.’,
tiers: [
{ id: ‘starter’, label: ‘Launch Day Surge’, priceUSD: 200, delivery: ‘30 min’, details: ‘Strong market entry’, includes: [‘Baseline volume’, ‘6h trending’, ‘Visibility + credibility’, ‘Coordinated algorithm’, ‘5+ hour pressure’] },
{ id: ‘pro’, label: ‘Professional Launch’, priceUSD: 400, delivery: ‘30 min’, details: ‘Proven sweet-spot’, includes: [‘Heavy volume’, ‘12h trending’, ‘50-100 holders’, ‘Dual-algorithm’, ‘Priority support’] },
{ id: ‘ultra’, label: ‘Maximum Dominance’, priceUSD: 750, delivery: ‘30 min’, details: ‘Absolute control’, includes: [‘Volume explosion’, ‘24h trending’, ‘200+ holders’, ‘Triple-layer algo’, ‘VIP concierge’, ‘Performance report’] },
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
platformDescription: ‘Pump.fun is Solana's leading token launch platform with $500M+ daily volume. Success means rapid holder acquisition and potential graduation to Raydium — the gateway to major exchange listings.’,
services: {
boost: {
label: ‘Volume & Holder Boost’,
description: ‘Accelerate your token with coordinated volume bursts and real holder acquisition. Higher holders + volume = better rankings and organic investor attention.’,
longDesc: ‘Our service deploys sophisticated Solana wallets to generate both trading volume AND holder acquisition. This dual approach creates organic community growth signals that attract real traders and elevate your token in rankings.’,
tiers: [
{ id: ‘basic’, label: ‘Community Starter’, priceAmount: 0.5, delivery: ‘15 min’, details: ‘Initial presence’, includes: [‘20-40 holders’, ‘Light volume’, ‘Real wallets’, ‘Natural timing’, ‘Algorithm-friendly’] },
{ id: ‘medium’, label: ‘Growth Accelerator’, priceAmount: 1.0, delivery: ‘15 min’, details: ‘Strong momentum’, includes: [‘50-100 holders’, ‘Moderate volume’, ‘Trending triggers’, ‘Real diversity’, ‘Multi-hour activity’] },
{ id: ‘mega’, label: ‘Front-Page Domination’, priceAmount: 2.0, delivery: ‘15 min’, details: ‘Maximum visibility’, includes: [‘150-250 holders’, ‘Heavy volume’, ‘Front-page push’, ‘Premium network’, ‘FOMO triggering’] },
],
},
trending: {
label: ‘Pump.fun Trending Placement’,
description: ‘Place your token in Pump.fun's trending section — watched by 100,000+ traders daily. Trending converts to instant volume and community calls.’,
longDesc: ‘Pump.fun's Trending section is where opportunities are born. Being featured acts as a credibility signal and creates a self-reinforcing cycle of visibility attracting real traders.’,
tiers: [
{ id: ‘basic’, label: ‘Trending Push’, priceAmount: 1.5, delivery: ‘20 min’, details: ‘Discovery entry’, includes: [‘4-6 hours trending’, ‘Algorithm-optimized’, ‘Real wallets’, ‘Natural behavior’, ‘Monitoring’] },
{ id: ‘premium’, label: ‘Elite Trending (Top 10)’, priceAmount: 3.0, delivery: ‘20 min’, details: ‘Maximum pressure’, includes: [‘Top 10 guaranteed’, ‘8-12 hours’, ‘50-100 holders’, ‘Premium volume’, ‘Priority status’] },
],
},
volume: {
label: ‘Trading Volume Surge’,
description: ‘Generate authentic trading volume using real Solana wallets. High volume attracts traders and improves liquidity perception.’,
longDesc: ‘A token with substantial volume feels safe and liquid. Our service activates premium Solana wallets with randomized patterns to create authentic market activity.’,
tiers: [
{ id: ‘basic’, label: ‘Liquidity Foundation’, priceAmount: 0.5, delivery: ‘30 min’, details: ‘Baseline trading’, includes: [‘Distributed wallets’, ‘Randomized amounts’, ‘Natural timing’, ‘Bot-bypass algorithms’, ‘Real blockchain’] },
{ id: ‘medium’, label: ‘Volume Acceleration’, priceAmount: 1.0, delivery: ‘30 min’, details: ‘Chart visibility’, includes: [‘Everything Basic’, ‘Higher frequency’, ‘Larger trades’, ‘Chart ranking’, ‘Multi-cycle activity’] },
{ id: ‘heavy’, label: ‘Volume Explosion’, priceAmount: 2.0, delivery: ‘30 min’, details: ‘Max appearance’, includes: [‘Everything Medium’, ‘50+ wallet network’, ‘Max frequency’, ‘Top charts’, ‘Holder activity’] },
],
},
graduation: {
label: ‘Graduation Acceleration’,
description: ‘Fast-track your token to graduation ($69K bonding curve) and Raydium migration. Graduation unlocks CEX listing opportunities.’,
longDesc: ‘Pump.fun graduation is the holy grail. Our service uses strategic volume bursts to accelerate bonding curve progress without appearing artificial.’,
tiers: [
{ id: ‘assist’, label: ‘Completion Assist (40-60%)’, priceAmount: 2.5, delivery: ‘30 min’, details: ‘Mid-stage push’, includes: [‘40-60% acceleration’, ‘Timed bursts’, ‘Real buy pressure’, ‘Algorithm-friendly’, ‘Progress monitoring’] },
{ id: ‘boost’, label: ‘Graduation Boost (60-80%)’, priceAmount: 4.0, delivery: ‘30 min’, details: ‘Heavy push’, includes: [‘Everything Assist’, ‘Heavy bursts’, ‘60-80% push’, ‘FOMO activity’, ‘Premium network’] },
{ id: ‘express’, label: ‘Express (80%+)’, priceAmount: 6.0, delivery: ‘15 min’, details: ‘Maximum speed’, includes: [‘Everything Boost’, ‘Max patterns’, ‘Fastest completion’, ‘Guaranteed attempt’, ‘VIP support’, ‘Migration monitoring’] },
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
platformDescription: ‘Four.Meme is the leading meme token launchpad on BNB Chain, with tens of thousands of active traders hunting for viral opportunities. Early growth triggers organic BSC community buying.’,
services: {
boost: {
label: ‘Community & Volume Boost’,
description: ‘Grow your token's holder base and trading volume. Real BNB wallet activity creates social proof for organic investment.’,
longDesc: ‘Our service deploys real BNB wallets to increase both holders and volume simultaneously. This dual approach signals healthy momentum and naturally attracts real traders.’,
tiers: [
{ id: ‘basic’, label: ‘Community Foundation’, priceAmount: 0.3, delivery: ‘15 min’, details: ‘Initial growth’, includes: [‘15-30 holders’, ‘Light volume’, ‘Real wallets’, ‘Natural timing’, ‘Foundational signal’] },
{ id: ‘medium’, label: ‘Community Growth’, priceAmount: 0.6, delivery: ‘15 min’, details: ‘Chart momentum’, includes: [‘40-80 holders’, ‘Moderate volume’, ‘Chart improvement’, ‘Trending push’, ‘Real diversity’] },
{ id: ‘mega’, label: ‘BSC Dominance’, priceAmount: 1.0, delivery: ‘15 min’, details: ‘Maximum presence’, includes: [‘100-200 holders’, ‘Heavy volume’, ‘Front-page placement’, ‘Trending guarantee’, ‘Premium network’] },
],
},
trending: {
label: ‘Trending Placement Service’,
description: ‘Secure premium positioning in Four.Meme's trending section — where BSC's most active traders discover opportunities.’,
longDesc: ‘Four.Meme's trending page is the primary discovery mechanism. When your token appears there, it signals market validation and converts to real buying activity.’,
tiers: [
{ id: ‘basic’, label: ‘Trending Visibility’, priceAmount: 0.5, delivery: ‘20 min’, details: ‘Discovery entry’, includes: [‘4-6 hours trending’, ‘Algorithm-optimized’, ‘Real engagement’, ‘Natural patterns’, ‘Monitoring’] },
{ id: ‘premium’, label: ‘Elite Trending’, priceAmount: 1.0, delivery: ‘20 min’, details: ‘Maximum exposure’, includes: [‘Top 5 placement’, ‘8-12 hours’, ‘40-80 holders’, ‘Volume boost’, ‘Extended window’] },
],
},
volume: {
label: ‘Trading Volume Generation’,
description: ‘Create authentic trading volume on Four.Meme using distributed BNB wallets with natural patterns.’,
longDesc: ‘A token with volume appears healthy and liquid. Our service creates convincing market action while bypassing bot detection.’,
tiers: [
{ id: ‘basic’, label: ‘Volume Foundation’, priceAmount: 0.3, delivery: ‘30 min’, details: ‘Baseline activity’, includes: [‘Distributed wallets’, ‘Randomized amounts’, ‘Natural timing’, ‘Baseline visibility’, ‘Real blockchain’] },
{ id: ‘medium’, label: ‘Volume Growth’, priceAmount: 0.6, delivery: ‘30 min’, details: ‘Trader attention’, includes: [‘Everything Basic’, ‘Higher frequency’, ‘Chart rankings’, ‘Larger trades’, ‘Multi-cycle’] },
{ id: ‘heavy’, label: ‘Volume Dominance’, priceAmount: 1.0, delivery: ‘30 min’, details: ‘Top-tier volume’, includes: [‘Everything Growth’, ‘60+ wallet network’, ‘Max frequency’, ‘Top charts’, ‘Holder activity’] },
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
platformDescription: ‘Flap.sh is BSC's growing premium token platform combining community energy with advanced analytics. Early presence builds credibility and attracts both retail and sophisticated investors.’,
services: {
boost: {
label: ‘Growth Acceleration Package’,
description: ‘Accelerate your token with coordinated holder acquisition and trading volume. Real BNB wallet activity creates social proof.’,
longDesc: ‘Our service pairs real wallet acquisition with strategic volume, signaling healthy momentum and attracting real traders interested in early, growing communities.’,
tiers: [
{ id: ‘basic’, label: ‘Launch Momentum’, priceAmount: 0.3, delivery: ‘15 min’, details: ‘Initial phase’, includes: [‘15-30 holders’, ‘Moderate volume’, ‘Real wallets’, ‘Natural patterns’, ‘Growth signal’] },
{ id: ‘medium’, label: ‘Momentum Builder’, priceAmount: 0.6, delivery: ‘15 min’, details: ‘Sustained growth’, includes: [‘40-80 holders’, ‘Moderate-heavy volume’, ‘Ranking improvement’, ‘Chart boost’, ‘Community signal’] },
{ id: ‘mega’, label: ‘Growth Explosion’, priceAmount: 1.0, delivery: ‘15 min’, details: ‘Maximum presence’, includes: [‘100-200 holders’, ‘Heavy volume’, ‘Premium network’, ‘Top positioning’, ‘Organic attraction’] },
],
},
trending: {
label: ‘Trending Breakthrough’,
description: ‘Place your token in Flap.sh's trending section for maximum discovery and trader attention.’,
longDesc: ‘Flap.sh trending placement means visibility to the platform's most engaged traders, converting to real market activity.’,
tiers: [
{ id: ‘basic’, label: ‘Trending Entry’, priceAmount: 0.5, delivery: ‘20 min’, details: ‘Foundation visibility’, includes: [‘4-6 hours trending’, ‘Algorithm-optimized’, ‘Real engagement’, ‘Natural patterns’, ‘Monitoring’] },
{ id: ‘premium’, label: ‘Premium Trending’, priceAmount: 1.0, delivery: ‘20 min’, details: ‘Maximum exposure’, includes: [‘Top placement’, ‘8-12 hours visible’, ‘Holder growth’, ‘Volume push’, ‘Extended window’] },
],
},
volume: {
label: ‘Volume Optimization’,
description: ‘Strategically generate trading volume using distributed BNB wallets with authentic behavior.’,
longDesc: ‘Volume is credibility. Our service creates convincing market activity that builds investor confidence.’,
tiers: [
{ id: ‘basic’, label: ‘Baseline Volume’, priceAmount: 0.3, delivery: ‘30 min’, details: ‘Trading presence’, includes: [‘Distributed wallets’, ‘Randomized patterns’, ‘Natural timing’, ‘Baseline visibility’, ‘Bot-safe’] },
{ id: ‘medium’, label: ‘Volume Push’, priceAmount: 0.6, delivery: ‘30 min’, details: ‘Significant volume’, includes: [‘Everything Basic’, ‘Higher frequency’, ‘Chart boost’, ‘Larger trades’, ‘Multi-cycle’] },
{ id: ‘heavy’, label: ‘Volume Peak’, priceAmount: 1.0, delivery: ‘30 min’, details: ‘Maximum performance’, includes: [‘Everything Push’, ‘Premium network’, ‘Max frequency’, ‘Top charts’, ‘Sustained activity’] },
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

function chainKB(platformKey, serviceKey) {
const rows = [];
for (let i = 0; i < DEXSCREENER_CHAINS.length; i += 2) {
const row = [{ text: DEXSCREENER_CHAINS[i] }];
if (DEXSCREENER_CHAINS[i + 1]) row.push({ text: DEXSCREENER_CHAINS[i + 1] });
rows.push(row);
}
rows.push([{ text: ‘Back to Main Menu’ }]);
return { keyboard: rows, resize_keyboard: true };
}

function payChainKB(platformKey, serviceKey, tierId) {
const chains = SERVICES[platformKey].payChains;
const rows = chains.map(c =>
[{ text: CRYPTO_INFO[c].label }]
);
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

bot.on(‘callback_query’, async (query) => {
const chatId = query.message.chat.id;
const data = query.data;
const session = getSession(chatId);

try {
await bot.answerCallbackQuery(query.id);

```
// Platform selection
if (data.startsWith('platform_')) {
  const platformKey = data.replace('platform_', '');
  session.platform = platformKey;
  session.step = 'service';
  const pv = SERVICES[platformKey];
  
  let msg = `<b>${pv.emoji} ${pv.fullName}</b>\n\n`;
  msg += `<b>Overview:</b> ${pv.platformDescription}\n\n`;
  msg += `<b>Select a service:</b>`;
  
  await bot.editMessageText(msg, {
    chat_id: chatId,
    message_id: query.message.message_id,
    parse_mode: 'HTML',
    reply_markup: serviceKB(platformKey)
  });
  return;
}

// Service selection
if (data.startsWith('service_')) {
  const parts = data.replace('service_', '').split('_');
  const platformKey = parts[0];
  const serviceKey = parts[1];
  session.platform = platformKey;
  session.service = serviceKey;
  const sv = SERVICES[platformKey].services[serviceKey];
  const isPriceInUSD = SERVICES[platformKey].usdPriced;

  let detailMsg = `<b>${sv.label}</b>\n\n`;
  detailMsg += `${sv.description}\n\n`;
  detailMsg += `${sv.longDesc}\n\n`;
  detailMsg += `<b>Available Tiers:</b>\n\n`;

  sv.tiers.forEach((t, i) => {
    const price = isPriceInUSD ? `$${t.priceUSD}` : `${t.priceAmount}`;
    detailMsg += `${i + 1}. <b>${t.label}</b> (${price})\n   ${t.details}\n`;
  });

  if (sv.requiresChain) {
    session.step = 'chain';
    detailMsg += '\n<b>First, select your blockchain:</b>';
    await bot.editMessageText(detailMsg, {
      chat_id: chatId,
      message_id: query.message.message_id,
      parse_mode: 'HTML',
      reply_markup: chainKB(platformKey, serviceKey)
    });
  } else {
    session.step = 'tier';
    await bot.editMessageText(detailMsg, {
      chat_id: chatId,
      message_id: query.message.message_id,
      parse_mode: 'HTML',
      reply_markup: tierKB(platformKey, serviceKey, isPriceInUSD)
    });
  }
  return;
}

// Chain selection
if (data.startsWith('chain_')) {
  const parts = data.replace('chain_', '').split('_');
  const platformKey = parts[0];
  const serviceKey = parts[1];
  const chain = parts.slice(2).join('_');
  
  session.chain = chain;
  session.step = 'tier';
  const sv = SERVICES[platformKey].services[serviceKey];
  const isPriceInUSD = SERVICES[platformKey].usdPriced;
  
  let msg = `✅ <b>Blockchain: ${chain}</b>\n\n<b>Tiers:</b>\n\n`;
  
  sv.tiers.forEach((t, i) => {
    const price = isPriceInUSD ? `$${t.priceUSD}` : `${t.priceAmount}`;
    msg += `${i + 1}. ${t.label} — ${price}\n   ${t.details}\n`;
  });
  
  await bot.editMessageText(msg, {
    chat_id: chatId,
    message_id: query.message.message_id,
    parse_mode: 'HTML',
    reply_markup: tierKB(platformKey, serviceKey, isPriceInUSD)
  });
  return;
}

// Tier selection
if (data.startsWith('tier_')) {
  const parts = data.replace('tier_', '').split('_');
  const platformKey = parts[0];
  const serviceKey = parts[1];
  const tierId = parts[2];
  
  const sv = SERVICES[platformKey].services[serviceKey];
  const tier = sv.tiers.find(t => t.id === tierId);
  session.tier = tier;
  
  const platformData = SERVICES[platformKey];
  
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
    await bot.editMessageText(msg, {
      chat_id: chatId,
      message_id: query.message.message_id,
      parse_mode: 'HTML',
      reply_markup: payChainKB(platformKey, serviceKey, tierId)
    });
  } else {
    session.payChain = platformData.payChains[0];
    session.step = 'ca';
    await bot.editMessageText(
      `✅ <b>Tier & Payment Selected</b>\n\n${tier.label}\nPayment: ${CRYPTO_INFO[session.payChain].label}\n\n<b>Send your token Contract Address:</b>`,
      {
        chat_id: chatId,
        message_id: query.message.message_id,
        parse_mode: 'HTML'
      }
    );
  }
  return;
}

// Pay chain selection
if (data.startsWith('paychain_')) {
  const parts = data.replace('paychain_', '').split('_');
  const platformKey = parts[0];
  const serviceKey = parts[1];
  const tierId = parts[2];
  const chainSymbol = parts[3];
  
  session.payChain = chainSymbol;
  session.step = 'ca';
  const platformData = SERVICES[platformKey];
  const tier = session.tier;
  const cryptoAmount = platformData.usdPriced ? usdToCrypto(tier.priceUSD, chainSymbol) : tier.priceAmount;
  const displayPrice = platformData.usdPriced ? `$${tier.priceUSD} (~${cryptoAmount} ${chainSymbol})` : `${cryptoAmount} ${chainSymbol}`;
  
  await bot.editMessageText(
    `✅ <b>Payment Method Selected</b>\n\nNetwork: ${CRYPTO_INFO[chainSymbol].network}\nAmount: ${displayPrice}\n\n<b>Send your token CA:</b>`,
    {
      chat_id: chatId,
      message_id: query.message.message_id,
      parse_mode: 'HTML'
    }
  );
  return;
}

// Token confirmation
if (data.startsWith('confirm_yes_')) {
  const parts = data.replace('confirm_yes_', '').split('_');
  const platformKey = parts[0];
  const serviceKey = parts[1];
  const tierId = parts[2];
  
  session.step = 'payment';
  const platformData = SERVICES[platformKey];
  const tier = session.tier;
  const chainInfo = CRYPTO_INFO[session.payChain];
  let displayAmount;

  if (platformData.usdPriced) {
    const crypto = usdToCrypto(tier.priceUSD, session.payChain);
    displayAmount = `$${tier.priceUSD} USD (~${crypto} ${session.payChain})`;
  } else {
    displayAmount = `${tier.priceAmount} ${session.payChain}`;
  }

  let orderMsg = `<b>📋 ORDER SUMMARY</b>\n\n`;
  orderMsg += `Platform: ${platformData.label}\n`;
  orderMsg += `Service: ${SERVICES[platformKey].services[serviceKey].label}\n`;
  orderMsg += `Tier: ${tier.label}\n`;
  orderMsg += `Token: ${session.tokenInfo.name} ($${session.tokenInfo.symbol})\n\n`;
  orderMsg += `<b>💰 PAYMENT</b>\n\n`;
  orderMsg += `Amount: <b>${displayAmount}</b>\n`;
  orderMsg += `Network: <b>${chainInfo.network}</b>\n`;
  orderMsg += `Delivery: <b>${tier.delivery}</b>\n\n`;
  orderMsg += `<b>WALLET (TAP TO COPY):</b>\n`;
  orderMsg += `<code>${chainInfo.wallet}</code>\n\n`;
  orderMsg += `<b>⚠️ Important:</b>\n` +
    `• Send exactly the amount\n` +
    `• Use correct network\n` +
    `• Save your TxHash\n\n` +
    `When done, confirm with your TxHash.`;

  await bot.editMessageText(orderMsg, {
    chat_id: chatId,
    message_id: query.message.message_id,
    parse_mode: 'HTML',
    reply_markup: paymentKB(platformKey, serviceKey, tierId)
  });

  await notifyAdmin({
    platform: platformData.label,
    service: SERVICES[platformKey].services[serviceKey].label,
    tier: tier.label,
    tokenName: session.tokenInfo.name,
    tokenSymbol: session.tokenInfo.symbol,
    ca: session.tokenInfo.address,
    amount: displayAmount,
    username: query.from?.username,
    userId: query.from?.id,
  });
  return;
}

if (data === 'confirm_no') {
  session.step = 'ca';
  await bot.editMessageText(
    `<b>Send a different Contract Address:</b>`,
    {
      chat_id: chatId,
      message_id: query.message.message_id,
      parse_mode: 'HTML'
    }
  );
  return;
}

// Payment sent
if (data.startsWith('payment_sent_')) {
  session.step = 'txhash';
  await bot.editMessageText(
    `<b>📨 Provide your transaction hash (TxHash):</b>`,
    {
      chat_id: chatId,
      message_id: query.message.message_id,
      parse_mode: 'HTML'
    }
  );
  return;
}

// Cancel
if (data === 'cancel') {
  clearSession(chatId);
  await bot.editMessageText(
    `❌ <b>Order cancelled.</b> Type /start to begin again.`,
    {
      chat_id: chatId,
      message_id: query.message.message_id,
      parse_mode: 'HTML',
      reply_markup: mainMenuKB()
    }
  );
  return;
}

// Back buttons
if (data === 'back_main') {
  clearSession(chatId);
  await bot.editMessageText(
    `<b>🚀 DEX BOOSTING BOT</b>\n\nYour Professional Token Growth Partner\n\n` +
    `📊 DexScreener — Updates, trending, volume\n` +
    `🔥 Pump.fun — Solana growth & graduation\n` +
    `🐸 Four.Meme — BSC community & charts\n` +
    `⚡ Flap.sh — BSC growth & trending\n\n` +
    `<b>Select a platform:</b>`,
    {
      chat_id: chatId,
      message_id: query.message.message_id,
      parse_mode: 'HTML',
      reply_markup: mainMenuKB()
    }
  );
  return;
}

if (data === 'about') {
  await bot.editMessageText(
    `<b>ℹ️ ABOUT</b>\n\nProfessional token growth services.\n\n` +
    `🔐 <b>SECURITY:</b> No private keys, on-chain verification\n` +
    `⚡ <b>DELIVERY:</b> 15-30 minutes\n` +
    `💰 <b>PRICING:</b> Transparent, no hidden fees\n` +
    `📞 <b>SUPPORT:</b> 24/7 @Dave_211\n\n` +
    `Version 2.0 — Multi-Platform Edition`,
    {
      chat_id: chatId,
      message_id: query.message.message_id,
      parse_mode: 'HTML',
      reply_markup: mainMenuKB()
    }
  );
  return;
}

if (data === 'support') {
  await bot.editMessageText(
    `<b>🛟 SUPPORT</b>\n\n24/7 assistance available.\n\n` +
    `<b>Contact:</b> @Dave_211\n` +
    `<b>Response Time:</b> ~15 minutes\n\n` +
    `Include: Order details, TxHash, CA, Issue\n\n` +
    `We're here to help! 👍`,
    {
      chat_id: chatId,
      message_id: query.message.message_id,
      parse_mode: 'HTML',
      reply_markup: mainMenuKB()
    }
  );
  return;
}
```

} catch (err) {
console.error(‘Callback error:’, err.message);
}
});

// Text message handler (CA and TxHash)
bot.on(‘message’, async (msg) => {
const chatId = msg.chat.id;
const text = msg.text?.trim() || ‘’;
const session = getSession(chatId);

try {
if (text === ‘/start’) {
clearSession(chatId);
await bot.sendMessage(chatId,
`<b>🚀 DEX BOOSTING BOT</b>\n\nYour Professional Token Growth Partner\n\n` +
`📊 DexScreener — Token updates, trending, volume\n` +
`🔥 Pump.fun — Solana token growth & graduation\n` +
`🐸 Four.Meme — BSC community building & charts\n` +
`⚡ Flap.sh — BSC token growth & trending\n\n` +
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
    msg += `<b>TOKEN CA (TAP TO COPY):</b>\n`;
    msg += `<code>${tokenInfo.address}</code>\n\n`;
    msg += `<b>Correct token?</b>`;

    const platformKey = session.platform;
    const serviceKey = session.service;
    const tierId = session.tier.id;

    if (tokenInfo.imageUrl) {
      try {
        await bot.sendPhoto(chatId, tokenInfo.imageUrl, { 
          caption: msg,
          parse_mode: 'HTML',
          reply_markup: confirmTokenKB(platformKey, serviceKey, tierId)
        });
      } catch {
        await bot.sendMessage(chatId, msg, { 
          parse_mode: 'HTML',
          reply_markup: confirmTokenKB(platformKey, serviceKey, tierId)
        });
      }
    } else {
      await bot.sendMessage(chatId, msg, { 
        parse_mode: 'HTML',
        reply_markup: confirmTokenKB(platformKey, serviceKey, tierId)
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
  confirmMsg += `<b>TXHASH (TAP TO COPY):</b>\n`;
  confirmMsg += `<code>${text}</code>\n\n`;
  confirmMsg += `⏱ <b>Order begins in ${tier.delivery}</b>\n\n` +
    `No results in 1 hour? Contact @Dave_211\n\n` +
    `Thanks for choosing Dex Boosting Bot! 🚀`;

  await bot.sendMessage(chatId, confirmMsg, { 
    parse_mode: 'HTML', 
    reply_markup: mainMenuKB() 
  });

  if (ADMIN_ID) {
    const adminMsg = `<b>✅ PAYMENT CONFIRMED</b>\n\n` +
      `Token: ${session.tokenInfo.name} ($${session.tokenInfo.symbol})\n` +
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