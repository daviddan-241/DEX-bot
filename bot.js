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
fullName: ‘DexScreener’,
payChains: [‘ETH’, ‘BNB’, ‘SOL’],
usdPriced: true,
platformDescription: ‘DexScreener - Real-time DEX analytics platform. Update profiles, secure trending placement, boost volume.’,
services: {
update: {
label: ‘Profile Update’,
description: ‘Update token profile - logo, name, website, socials’,
longDesc: ‘Professional profile ensures traders see your token as legitimate and investable.’,
tiers: [
{ id: ‘basic’, label: ‘Essentials’, priceUSD: 50, delivery: ‘24h’, details: ‘New projects’ },
{ id: ‘premium’, label: ‘Professional’, priceUSD: 120, delivery: ‘6-12h’, details: ‘Serious projects’ },
],
requiresChain: true,
},
trending: {
label: ‘Trending Placement’,
description: ‘Premium trending section placement - thousands of traders daily’,
longDesc: ‘Trending creates instant visibility to active buyers and drives organic momentum.’,
tiers: [
{ id: ‘bronze’, label: ‘Quick Surge (6h)’, priceUSD: 150, delivery: ‘30m’, details: ‘Flash activity’ },
{ id: ‘silver’, label: ‘Momentum (12h)’, priceUSD: 280, delivery: ‘30m’, details: ‘Sustained growth’ },
{ id: ‘gold’, label: ‘Full Day (24h)’, priceUSD: 500, delivery: ‘30m’, details: ‘Max exposure’ },
],
requiresChain: true,
},
volume: {
label: ‘Volume Boost’,
description: ‘Strategic trading volume - real wallet activity’,
longDesc: ‘High volume attracts traders and boosts algorithm visibility.’,
tiers: [
{ id: ‘basic’, label: ‘Baseline’, priceUSD: 80, delivery: ‘1h’, details: ‘Establishes presence’ },
{ id: ‘medium’, label: ‘Momentum’, priceUSD: 180, delivery: ‘1h’, details: ‘Chart rankings’ },
{ id: ‘heavy’, label: ‘Explosion’, priceUSD: 350, delivery: ‘1h’, details: ‘Top charts’ },
],
requiresChain: true,
},
boost: {
label: ‘Complete Domination’,
description: ‘Volume + Trending combined - unstoppable momentum’,
longDesc: ‘Market domination: visibility + credibility = explosive organic buying.’,
tiers: [
{ id: ‘starter’, label: ‘Launch Surge’, priceUSD: 200, delivery: ‘30m’, details: ‘Strong entry’ },
{ id: ‘pro’, label: ‘Professional’, priceUSD: 400, delivery: ‘30m’, details: ‘Proven strategy’ },
{ id: ‘ultra’, label: ‘Maximum’, priceUSD: 750, delivery: ‘30m’, details: ‘Total control’ },
],
requiresChain: true,
},
},
},

pumpfun: {
label: ‘Pump.fun’,
emoji: ‘🔥’,
fullName: ‘Pump.fun’,
payChains: [‘SOL’],
usdPriced: false,
nativeCurrency: ‘SOL’,
platformDescription: ‘Pump.fun - Solana token growth. Boost holders, trending, volume, graduation.’,
services: {
boost: {
label: ‘Volume & Holders’,
description: ‘Coordinated volume bursts and holder acquisition’,
longDesc: ‘Real wallet activity creates organic growth signals and attracts traders.’,
tiers: [
{ id: ‘basic’, label: ‘Community Starter’, priceAmount: 0.5, delivery: ‘15m’, details: ‘Initial presence’ },
{ id: ‘medium’, label: ‘Growth Accelerator’, priceAmount: 1.0, delivery: ‘15m’, details: ‘Strong momentum’ },
{ id: ‘mega’, label: ‘Front-Page’, priceAmount: 2.0, delivery: ‘15m’, details: ‘Max visibility’ },
],
},
trending: {
label: ‘Trending Placement’,
description: ‘Trending section placement - 100k+ traders daily’,
longDesc: ‘Trending signals credibility and drives real organic buying.’,
tiers: [
{ id: ‘basic’, label: ‘Trending Push’, priceAmount: 1.5, delivery: ‘20m’, details: ‘Discovery’ },
{ id: ‘premium’, label: ‘Elite Top 10’, priceAmount: 3.0, delivery: ‘20m’, details: ‘Maximum pressure’ },
],
},
volume: {
label: ‘Volume Surge’,
description: ‘Authentic trading volume using real wallets’,
longDesc: ‘High volume feels safe and liquid to traders.’,
tiers: [
{ id: ‘basic’, label: ‘Liquidity’, priceAmount: 0.5, delivery: ‘30m’, details: ‘Baseline’ },
{ id: ‘medium’, label: ‘Acceleration’, priceAmount: 1.0, delivery: ‘30m’, details: ‘Chart push’ },
{ id: ‘heavy’, label: ‘Explosion’, priceAmount: 2.0, delivery: ‘30m’, details: ‘Maximum’ },
],
},
graduation: {
label: ‘Graduation Boost’,
description: ‘Fast-track to graduation and Raydium migration’,
longDesc: ‘Graduation unlocks CEX listing opportunities.’,
tiers: [
{ id: ‘assist’, label: ‘Assist (40-60%)’, priceAmount: 2.5, delivery: ‘30m’, details: ‘Mid-stage’ },
{ id: ‘boost’, label: ‘Boost (60-80%)’, priceAmount: 4.0, delivery: ‘30m’, details: ‘Heavy push’ },
{ id: ‘express’, label: ‘Express (80%+)’, priceAmount: 6.0, delivery: ‘15m’, details: ‘Maximum speed’ },
],
},
},
},

fourmeme: {
label: ‘Four.Meme’,
emoji: ‘🐸’,
fullName: ‘Four.Meme’,
payChains: [‘BNB’],
usdPriced: false,
nativeCurrency: ‘BNB’,
platformDescription: ‘Four.Meme - BSC meme launchpad. Community, trending, volume.’,
services: {
boost: {
label: ‘Community Boost’,
description: ‘Holder acquisition and trading volume’,
longDesc: ‘Real wallet activity signals momentum to BSC community.’,
tiers: [
{ id: ‘basic’, label: ‘Foundation’, priceAmount: 0.3, delivery: ‘15m’, details: ‘Initial’ },
{ id: ‘medium’, label: ‘Growth’, priceAmount: 0.6, delivery: ‘15m’, details: ‘Momentum’ },
{ id: ‘mega’, label: ‘Dominance’, priceAmount: 1.0, delivery: ‘15m’, details: ‘Maximum’ },
],
},
trending: {
label: ‘Trending Placement’,
description: ‘Trending section placement for discovery’,
longDesc: ‘Being featured signals market validation.’,
tiers: [
{ id: ‘basic’, label: ‘Visibility’, priceAmount: 0.5, delivery: ‘20m’, details: ‘Entry’ },
{ id: ‘premium’, label: ‘Elite’, priceAmount: 1.0, delivery: ‘20m’, details: ‘Maximum’ },
],
},
volume: {
label: ‘Volume Generation’,
description: ‘Authentic trading volume creation’,
longDesc: ‘Volume appears healthy and liquid.’,
tiers: [
{ id: ‘basic’, label: ‘Foundation’, priceAmount: 0.3, delivery: ‘30m’, details: ‘Baseline’ },
{ id: ‘medium’, label: ‘Growth’, priceAmount: 0.6, delivery: ‘30m’, details: ‘Push’ },
{ id: ‘heavy’, label: ‘Dominance’, priceAmount: 1.0, delivery: ‘30m’, details: ‘Maximum’ },
],
},
},
},

flapsh: {
label: ‘Flap.sh’,
emoji: ‘⚡’,
fullName: ‘Flap.sh’,
payChains: [‘BNB’],
usdPriced: false,
nativeCurrency: ‘BNB’,
platformDescription: ‘Flap.sh - BSC token growth platform. Holders, trending, volume.’,
services: {
boost: {
label: ‘Growth Acceleration’,
description: ‘Holder acquisition and volume coordination’,
longDesc: ‘Real wallet activity signals healthy momentum.’,
tiers: [
{ id: ‘basic’, label: ‘Launch’, priceAmount: 0.3, delivery: ‘15m’, details: ‘Initial’ },
{ id: ‘medium’, label: ‘Builder’, priceAmount: 0.6, delivery: ‘15m’, details: ‘Growth’ },
{ id: ‘mega’, label: ‘Explosion’, priceAmount: 1.0, delivery: ‘15m’, details: ‘Maximum’ },
],
},
trending: {
label: ‘Trending Breakthrough’,
description: ‘Trending section placement’,
longDesc: ‘Visibility to engaged traders.’,
tiers: [
{ id: ‘basic’, label: ‘Entry’, priceAmount: 0.5, delivery: ‘20m’, details: ‘Foundation’ },
{ id: ‘premium’, label: ‘Premium’, priceAmount: 1.0, delivery: ‘20m’, details: ‘Maximum’ },
],
},
volume: {
label: ‘Volume Optimization’,
description: ‘Strategic volume generation’,
longDesc: ‘Volume builds investor confidence.’,
tiers: [
{ id: ‘basic’, label: ‘Baseline’, priceAmount: 0.3, delivery: ‘30m’, details: ‘Presence’ },
{ id: ‘medium’, label: ‘Push’, priceAmount: 0.6, delivery: ‘30m’, details: ‘Volume’ },
{ id: ‘heavy’, label: ‘Peak’, priceAmount: 1.0, delivery: ‘30m’, details: ‘Maximum’ },
],
},
},
},
};

const DEXSCREENER_CHAINS = [‘Ethereum’, ‘BNB Chain’, ‘Polygon’, ‘Arbitrum’, ‘Avalanche’, ‘Fantom’, ‘Solana’, ‘Base’, ‘Cronos’, ‘Kava’, ‘TRON’, ‘TON’, ‘SUI’];

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
console.error(‘Token fetch:’, e.message);
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

function tierKB(platformKey, serviceKey, isPriceInUSD) {
const sv = SERVICES[platformKey].services[serviceKey];
const rows = sv.tiers.map(t => {
const price = isPriceInUSD ? ‘$’ + t.priceUSD : t.priceAmount;
return [{ text: t.label + ’ - ’ + price }];
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

function confirmKB() {
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
const msg = ‘📊 NEW ORDER\n\n’ +
’Platform: ’ + data.platform + ‘\n’ +
’Service: ’ + data.service + ‘\n’ +
’Tier: ’ + data.tier + ‘\n’ +
‘Token: ’ + data.tokenName + ’ ($’ + data.tokenSymbol + ‘)\n’ +
’CA: ’ + data.ca + ‘\n’ +
‘Amount: ’ + data.amount + ‘\n’ +
‘User: @’ + (data.username || ‘unknown’) + ’ (’ + data.userId + ‘)’;
try {
await bot.sendMessage(ADMIN_ID, msg);
} catch (e) {
console.error(‘Admin notify:’, e.message);
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
‘🚀 DEX BOOSTING BOT\n\nYour Professional Token Growth Partner\n\n’ +
‘📊 DexScreener - Updates, trending, volume\n’ +
‘🔥 Pump.fun - Solana growth & graduation\n’ +
‘🐸 Four.Meme - BSC community\n’ +
‘⚡ Flap.sh - BSC growth\n\n’ +
‘Select a platform:’,
{ reply_markup: mainMenuKB() }
);
return;
}

```
if (text === 'About') {
  await bot.sendMessage(chatId,
    'ℹ️ ABOUT\n\nProfessional token growth services.\n\n' +
    '🔐 No private keys\n' +
    '⚡ 15-30 min delivery\n' +
    '💰 Transparent pricing\n' +
    '📞 Support: @Dave_211',
    { reply_markup: mainMenuKB() }
  );
  return;
}

if (text === 'Support') {
  await bot.sendMessage(chatId,
    '🛟 SUPPORT\n\n24/7 available\n\n' +
    'Contact: @Dave_211\n' +
    'Response: ~15 min',
    { reply_markup: mainMenuKB() }
  );
  return;
}

if (text === 'Back to Main Menu') {
  clearSession(chatId);
  await bot.sendMessage(chatId, '🚀 Select a platform:', { reply_markup: mainMenuKB() });
  return;
}

const platformMatch = Object.keys(SERVICES).find(k => SERVICES[k].label === text.replace(/^[📊🔥🐸⚡] /, ''));
if (platformMatch) {
  session.platform = platformMatch;
  session.step = 'service';
  const pv = SERVICES[platformMatch];
  await bot.sendMessage(chatId, pv.emoji + ' ' + pv.fullName + '\n\n' + pv.platformDescription + '\n\nSelect a service:', { reply_markup: serviceKB(platformMatch) });
  return;
}

if (session.step === 'service' && session.platform) {
  const sv = Object.values(SERVICES[session.platform].services).find(s => s.label === text);
  if (sv) {
    session.service = Object.keys(SERVICES[session.platform].services).find(k => SERVICES[session.platform].services[k].label === text);
    let msg = sv.label + '\n\n' + sv.description + '\n\n' + sv.longDesc + '\n\nTiers:\n';
    sv.tiers.forEach((t, i) => {
      const price = SERVICES[session.platform].usdPriced ? '$' + t.priceUSD : t.priceAmount;
      msg += '\n' + (i + 1) + '. ' + t.label + ' (' + price + ') - ' + t.details;
    });

    if (sv.requiresChain) {
      session.step = 'chain';
      msg += '\n\nSelect blockchain:';
      await bot.sendMessage(chatId, msg, { reply_markup: chainKB() });
    } else {
      session.step = 'tier';
      const isPriceInUSD = SERVICES[session.platform].usdPriced;
      await bot.sendMessage(chatId, msg, { reply_markup: tierKB(session.platform, session.service, isPriceInUSD) });
    }
    return;
  }
}

if (session.step === 'chain' && DEXSCREENER_CHAINS.includes(text)) {
  session.chain = text;
  session.step = 'tier';
  const sv = SERVICES[session.platform].services[session.service];
  const isPriceInUSD = SERVICES[session.platform].usdPriced;
  let msg = 'Blockchain: ' + text + '\n\nTiers:\n';
  sv.tiers.forEach((t, i) => {
    const price = isPriceInUSD ? '$' + t.priceUSD : t.priceAmount;
    msg += '\n' + (i + 1) + '. ' + t.label + ' (' + price + ') - ' + t.details;
  });
  await bot.sendMessage(chatId, msg, { reply_markup: tierKB(session.platform, session.service, isPriceInUSD) });
  return;
}

if (session.step === 'tier') {
  const sv = SERVICES[session.platform].services[session.service];
  const tier = sv.tiers.find(t => text.includes(t.label));
  if (tier) {
    session.tier = tier;
    const platformData = SERVICES[session.platform];
    
    if (platformData.payChains.length > 1) {
      session.step = 'paychain';
      let msg = 'Tier: ' + tier.label + '\n\nPayment Methods:\n';
      platformData.payChains.forEach(c => {
        const amount = platformData.usdPriced ? '$' + tier.priceUSD + ' (~' + usdToCrypto(tier.priceUSD, c) + ' ' + c + ')' : tier.priceAmount + ' ' + c;
        msg += '\n' + CRYPTO_INFO[c].label + ' - ' + amount;
      });
      msg += '\n\nSelect network:';
      await bot.sendMessage(chatId, msg, { reply_markup: payChainKB(platformData.payChains) });
    } else {
      session.payChain = platformData.payChains[0];
      session.step = 'ca';
      await bot.sendMessage(chatId, 'Tier: ' + tier.label + '\nPayment: ' + CRYPTO_INFO[session.payChain].label + '\n\nSend token Contract Address:', { reply_markup: { remove_keyboard: true } });
    }
    return;
  }
}

if (session.step === 'paychain') {
  const chainSymbol = Object.keys(CRYPTO_INFO).find(k => CRYPTO_INFO[k].label === text);
  if (chainSymbol) {
    session.payChain = chainSymbol;
    session.step = 'ca';
    const platformData = SERVICES[session.platform];
    const tier = session.tier;
    const amount = platformData.usdPriced ? usdToCrypto(tier.priceUSD, chainSymbol) : tier.priceAmount;
    const displayAmount = platformData.usdPriced ? '$' + tier.priceUSD + ' (~' + amount + ' ' + chainSymbol + ')' : amount + ' ' + chainSymbol;
    await bot.sendMessage(chatId, 'Network: ' + CRYPTO_INFO[chainSymbol].network + '\nAmount: ' + displayAmount + '\n\nSend Contract Address:', { reply_markup: { remove_keyboard: true } });
    return;
  }
}

if (session.step === 'ca' && text.length > 20) {
  await bot.sendMessage(chatId, 'Verifying token...');
  const tokenInfo = await fetchTokenInfo(text);

  if (tokenInfo) {
    session.tokenInfo = tokenInfo;
    session.step = 'confirm';
    
    let msg = 'TOKEN FOUND\n\n' +
      'Name: ' + tokenInfo.name + '\n' +
      'Symbol: $' + tokenInfo.symbol + '\n' +
      'Chain: ' + tokenInfo.chain + '\n' +
      'Price: $' + Number(tokenInfo.price).toFixed(8) + '\n' +
      'Market Cap: ' + tokenInfo.marketCap + '\n' +
      '24h Volume: ' + tokenInfo.volume24h + '\n' +
      'Liquidity: ' + tokenInfo.liquidity + '\n\n' +
      'CA: ' + tokenInfo.address + '\n\n' +
      'Correct token?';

    if (tokenInfo.imageUrl) {
      try {
        await bot.sendPhoto(chatId, tokenInfo.imageUrl, { caption: msg, reply_markup: confirmKB() });
      } catch {
        await bot.sendMessage(chatId, msg, { reply_markup: confirmKB() });
      }
    } else {
      await bot.sendMessage(chatId, msg, { reply_markup: confirmKB() });
    }
  } else {
    await bot.sendMessage(chatId, 'Token not found. Check address format and chain.');
  }
  return;
}

if (session.step === 'confirm') {
  if (text === '✓ Confirm Token') {
    session.step = 'payment';
    const platformData = SERVICES[session.platform];
    const tier = session.tier;
    const chainInfo = CRYPTO_INFO[session.payChain];
    let displayAmount;

    if (platformData.usdPriced) {
      const crypto = usdToCrypto(tier.priceUSD, session.payChain);
      displayAmount = '$' + tier.priceUSD + ' (~' + crypto + ' ' + session.payChain + ')';
    } else {
      displayAmount = tier.priceAmount + ' ' + session.payChain;
    }

    let orderMsg = 'ORDER SUMMARY\n\n' +
      'Platform: ' + platformData.label + '\n' +
      'Service: ' + SERVICES[session.platform].services[session.service].label + '\n' +
      'Tier: ' + tier.label + '\n' +
      'Token: ' + session.tokenInfo.name + ' ($' + session.tokenInfo.symbol + ')\n\n' +
      'PAYMENT\n\n' +
      'Amount: ' + displayAmount + '\n' +
      'Network: ' + chainInfo.network + '\n' +
      'Delivery: ' + tier.delivery + '\n\n' +
      'WALLET (tap to copy):\n' +
      chainInfo.wallet + '\n\n' +
      'IMPORTANT\n' +
      '• Send exactly amount\n' +
      '• Use correct network\n' +
      '• Save your TxHash';

    await bot.sendMessage(chatId, orderMsg, { reply_markup: paymentKB() });

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
    await bot.sendMessage(chatId, 'Send different Contract Address:', { reply_markup: { remove_keyboard: true } });
    return;
  }
}

if (session.step === 'payment') {
  if (text === '✓ Payment Sent') {
    session.step = 'txhash';
    await bot.sendMessage(chatId, 'Provide transaction hash (TxHash):', { reply_markup: { remove_keyboard: true } });
    return;
  }

  if (text === '✗ Cancel Order') {
    clearSession(chatId);
    await bot.sendMessage(chatId, 'Order cancelled. Type /start', { reply_markup: mainMenuKB() });
    return;
  }
}

if (session.step === 'txhash' && text.length > 10) {
  const platformData = SERVICES[session.platform];
  const tier = session.tier;
  const sv = SERVICES[session.platform].services[session.service];
  let displayAmount;

  if (platformData.usdPriced) {
    const crypto = usdToCrypto(tier.priceUSD, session.payChain);
    displayAmount = '$' + tier.priceUSD + ' (~' + crypto + ' ' + session.payChain + ')';
  } else {
    displayAmount = tier.priceAmount + ' ' + session.payChain;
  }

  let confirmMsg = 'PAYMENT CONFIRMED\n\n' +
    'Thank you! Order received.\n\n' +
    'ORDER DETAILS\n\n' +
    'Platform: ' + platformData.label + '\n' +
    'Service: ' + sv.label + '\n' +
    'Tier: ' + tier.label + '\n' +
    'Token: ' + session.tokenInfo.name + '\n' +
    'Amount: ' + displayAmount + '\n\n' +
    'TXHASH (tap to copy):\n' +
    text + '\n\n' +
    'Order begins in ' + tier.delivery + '\n\n' +
    'No results in 1 hour? Contact @Dave_211\n\n' +
    'Thanks for using Dex Boosting Bot!';

  await bot.sendMessage(chatId, confirmMsg, { reply_markup: mainMenuKB() });

  if (ADMIN_ID) {
    const adminMsg = 'PAYMENT CONFIRMED\n\n' +
      'Token: ' + session.tokenInfo.name + '\n' +
      'CA: ' + session.tokenInfo.address + '\n' +
      'Amount: ' + displayAmount + '\n' +
      'TxHash: ' + text + '\n' +
      'Platform: ' + platformData.label + '\n' +
      'Tier: ' + tier.label;
    try {
      await bot.sendMessage(ADMIN_ID, adminMsg);
    } catch (e) {
      console.error('Admin:', e.message);
    }
  }

  clearSession(chatId);
}
```

} catch (err) {
console.error(‘Error:’, err.message);
await bot.sendMessage(chatId, ‘Error. Type /start’, { reply_markup: mainMenuKB() }).catch(() => {});
}
});

bot.on(‘polling_error’, (err) => console.error(‘Polling:’, err.code));
bot.on(‘error’, (err) => console.error(‘Error:’, err.message));

console.log(‘Bot Started’);