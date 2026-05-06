require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

require('./server');

const BOT_TOKEN = process.env.BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';

const WALLETS = {
  SOL: process.env.SOL_WALLET || 'AsSdLVZRX8BAdi5u4PGHefiAFdcsR8nRAaFBKpzhPtc2',
  BNB: process.env.BNB_WALLET || 'bnb189gjjucwltdpnlemrveakf0q6xg0smfqdh6869',
  ETH: process.env.ETH_WALLET || '0x589e85724Eb0d8Fc8C1e5A0b3B429483c91F90E3',
};

const ADMIN_ID = process.env.ADMIN_ID || null;

// PRICING — DexScreener in USD, others in native currency
const SERVICES = {
  dexscreener: {
    label: 'DexScreener',
    emoji: '📊',
    payChains: ['ETH', 'BNB', 'SOL'],
    usdPriced: true,
    services: {
      update: {
        label: 'DexScreener Update',
        description: 'Update token profile on DexScreener — logo, name, banner, website, and all social links. Professional profiles attract traders and investors immediately.',
        tiers: [
          { id: 'basic', label: 'Basic Update', priceUSD: 50, delivery: '24 hours', includes: ['Logo upload', 'Name update', 'Website link', 'Twitter + Telegram'] },
          { id: 'premium', label: 'Premium Update', priceUSD: 120, delivery: '6-12 hours', includes: ['Full Basic + Banner', 'Description', 'Discord link', 'Priority'] },
        ],
        requiresChain: true,
      },
      trending: {
        label: 'DexScreener Trending',
        description: 'Place your token in DexScreener trending — seen by thousands of traders daily. Volume-based algorithm push for sustained visibility.',
        tiers: [
          { id: 'bronze', label: 'Bronze (6hr)', priceUSD: 150, delivery: '30 min', includes: ['6-hour trending', 'Volume push', 'Real wallets'] },
          { id: 'silver', label: 'Silver (12hr)', priceUSD: 280, delivery: '30 min', includes: ['12-hour trending', 'Stronger push', 'Holder increase'] },
          { id: 'gold', label: 'Gold (24hr)', priceUSD: 500, delivery: '30 min', includes: ['24-hour trending', 'Max volume', 'Large holders', 'Priority'] },
        ],
        requiresChain: true,
      },
      volume: {
        label: 'DexScreener Volume',
        description: 'Boost trading volume using real wallet activity. High volume signals legitimacy and pushes tokens into volume leaderboards.',
        tiers: [
          { id: 'basic', label: 'Basic Volume', priceUSD: 80, delivery: '1 hour', includes: ['Distributed wallets', 'Natural patterns', 'Volume rank boost'] },
          { id: 'medium', label: 'Medium Volume', priceUSD: 180, delivery: '1 hour', includes: ['Higher frequency', 'Chart push', 'Leaderboard'] },
          { id: 'heavy', label: 'Heavy Volume', priceUSD: 350, delivery: '1 hour', includes: ['Max frequency', 'Top charts', 'FOMO buying'] },
        ],
        requiresChain: true,
      },
      boost: {
        label: 'DexScreener Boost',
        description: 'Complete domination package — heavy volume PLUS trending placement combined. This is what serious projects use.',
        tiers: [
          { id: 'starter', label: 'Starter Boost', priceUSD: 200, delivery: '30 min', includes: ['Basic volume + 6hr trending', 'Launch effect'] },
          { id: 'pro', label: 'Pro Boost', priceUSD: 400, delivery: '30 min', includes: ['Heavy volume + 12hr trending', 'Holders + Priority'] },
          { id: 'ultra', label: 'Ultra Boost', priceUSD: 750, delivery: '30 min', includes: ['Max volume + 24hr trending', 'VIP support + Report'] },
        ],
        requiresChain: true,
      },
    },
  },

  pumpfun: {
    label: 'Pump.fun',
    emoji: '🔥',
    payChains: ['SOL'],
    usdPriced: false,
    nativeCurrency: 'SOL',
    services: {
      boost: {
        label: 'Pump.fun Boost',
        description: 'Boost Pump.fun token with volume and real holders on Solana. Higher holders + volume = higher trust and organic buying.',
        tiers: [
          { id: 'basic', label: 'Basic Pump', priceAmount: 0.5, delivery: '15 min', includes: ['20-40 holders', 'Light volume', 'Natural activity'] },
          { id: 'medium', label: 'Medium Pump', priceAmount: 1.0, delivery: '15 min', includes: ['50-100 holders', 'Moderate volume', 'Trending push'] },
          { id: 'mega', label: 'Mega Pump', priceAmount: 2.0, delivery: '15 min', includes: ['150-250 holders', 'Heavy volume', 'Front page', 'Priority'] },
        ],
      },
      trending: {
        label: 'Pump.fun Trending',
        description: 'Push token into Pump.fun trending section — the main discovery page for thousands of Solana degens hourly.',
        tiers: [
          { id: 'basic', label: 'Trend Push', priceAmount: 1.5, delivery: '20 min', includes: ['4-6 hours trending', 'Algorithm push'] },
          { id: 'premium', label: 'Top Trend', priceAmount: 3.0, delivery: '20 min', includes: ['Top 10 placement', '8-12 hours', 'Holders + Priority'] },
        ],
      },
      volume: {
        label: 'Pump.fun Volume',
        description: 'Supercharge Pump.fun volume using distributed Solana wallets with natural trade patterns.',
        tiers: [
          { id: 'basic', label: 'Basic Volume', priceAmount: 0.5, delivery: '30 min', includes: ['Distributed wallets', 'Natural timing'] },
          { id: 'medium', label: 'Medium Volume', priceAmount: 1.0, delivery: '30 min', includes: ['Higher frequency', 'Chart boost'] },
          { id: 'heavy', label: 'Heavy Volume', priceAmount: 2.0, delivery: '30 min', includes: ['Max frequency', 'Top placement'] },
        ],
      },
      graduation: {
        label: 'Pump.fun Graduation',
        description: 'Fast-track graduation to Raydium. Strategic volume bursts to fill bonding curve faster and reach $69K cap.',
        tiers: [
          { id: 'assist', label: 'Graduation Assist', priceAmount: 2.5, delivery: '30 min', includes: ['40-60% push', 'Volume bursts', 'Monitoring'] },
          { id: 'boost', label: 'Graduation Boost', priceAmount: 4.0, delivery: '30 min', includes: ['60-80% push', 'Heavy bursts', 'Support'] },
          { id: 'express', label: 'Graduation Express', priceAmount: 6.0, delivery: '15 min', includes: ['Max push', 'Guaranteed attempt', 'VIP + Monitoring'] },
        ],
      },
    },
  },

  fourmeme: {
    label: 'Four.Meme',
    emoji: '🐸',
    payChains: ['BNB'],
    usdPriced: false,
    nativeCurrency: 'BNB',
    services: {
      boost: {
        label: 'Four.Meme Boost',
        description: 'Boost Four.Meme BSC token with volume and holders. Real BNB wallet activity gives instant social proof.',
        tiers: [
          { id: 'basic', label: 'Basic Pump', priceAmount: 0.3, delivery: '15 min', includes: ['15-30 holders', 'Light volume'] },
          { id: 'medium', label: 'Medium Pump', priceAmount: 0.6, delivery: '15 min', includes: ['40-80 holders', 'Moderate volume', 'Chart push'] },
          { id: 'mega', label: 'Mega Pump', priceAmount: 1.0, delivery: '15 min', includes: ['100-200 holders', 'Heavy volume', 'Front page'] },
        ],
      },
      trending: {
        label: 'Four.Meme Trending',
        description: 'Get Four.Meme trending — the main discovery page on BSC with millions of active wallets.',
        tiers: [
          { id: 'basic', label: 'Trend Push', priceAmount: 0.5, delivery: '20 min', includes: ['4-6 hours trending'] },
          { id: 'premium', label: 'Top Trend', priceAmount: 1.0, delivery: '20 min', includes: ['Top 5 placement', '8-12 hours', 'Holders'] },
        ],
      },
      volume: {
        label: 'Four.Meme Volume',
        description: 'Automate BSC volume with distributed BNB wallets. Randomized trades make your token appear actively traded.',
        tiers: [
          { id: 'basic', label: 'Basic Volume', priceAmount: 0.3, delivery: '30 min', includes: ['Distributed activity'] },
          { id: 'medium', label: 'Medium Volume', priceAmount: 0.6, delivery: '30 min', includes: ['Higher frequency', 'Chart rank'] },
          { id: 'heavy', label: 'Heavy Volume', priceAmount: 1.0, delivery: '30 min', includes: ['Max frequency', 'Top charts'] },
        ],
      },
    },
  },

  flapsh: {
    label: 'Flap.sh',
    emoji: '⚡',
    payChains: ['BNB'],
    usdPriced: false,
    nativeCurrency: 'BNB',
    services: {
      boost: {
        label: 'Flap.sh Boost',
        description: 'Boost Flap.sh BSC token with volume and holders. Early traction leads to organic discovery by BSC community.',
        tiers: [
          { id: 'basic', label: 'Basic Pump', priceAmount: 0.3, delivery: '15 min', includes: ['15-30 holders', 'Light volume'] },
          { id: 'medium', label: 'Medium Pump', priceAmount: 0.6, delivery: '15 min', includes: ['40-80 holders', 'Moderate volume'] },
          { id: 'mega', label: 'Mega Pump', priceAmount: 1.0, delivery: '15 min', includes: ['100-200 holders', 'Heavy volume'] },
        ],
      },
      trending: {
        label: 'Flap.sh Trending',
        description: 'Place token in Flap.sh trending section for maximum BSC community exposure.',
        tiers: [
          { id: 'basic', label: 'Trend Push', priceAmount: 0.5, delivery: '20 min', includes: ['4-6 hours trending'] },
          { id: 'premium', label: 'Top Trend', priceAmount: 1.0, delivery: '20 min', includes: ['Top placement', '8-12 hours'] },
        ],
      },
      volume: {
        label: 'Flap.sh Volume',
        description: 'Automate Flap.sh volume to signal activity. Distributed BNB wallets with randomized trades.',
        tiers: [
          { id: 'basic', label: 'Basic Volume', priceAmount: 0.3, delivery: '30 min', includes: ['Baseline activity'] },
          { id: 'medium', label: 'Medium Volume', priceAmount: 0.6, delivery: '30 min', includes: ['Healthy activity'] },
          { id: 'heavy', label: 'Heavy Volume', priceAmount: 1.0, delivery: '30 min', includes: ['Max activity'] },
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

const CRYPTO_INFO = {
  ETH: { label: 'Ethereum (ETH)', wallet: WALLETS.ETH, network: 'Ethereum Mainnet', rate: 3000 },
  BNB: { label: 'BNB (BNB)', wallet: WALLETS.BNB, network: 'BNB Smart Chain', rate: 600 },
  SOL: { label: 'Solana (SOL)', wallet: WALLETS.SOL, network: 'Solana Mainnet', rate: 150 },
};

function usdToCrypto(usd, symbol) {
  const rate = CRYPTO_INFO[symbol]?.rate || 1;
  const amount = usd / rate;
  if (symbol === 'ETH' || symbol === 'BNB') return amount.toFixed(4);
  return amount.toFixed(3);
}

const bot = new TelegramBot(BOT_TOKEN, { polling: true });
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
      name: pair.baseToken?.name || 'Unknown',
      symbol: pair.baseToken?.symbol || '???',
      address: pair.baseToken?.address || address,
      chain: pair.chainId || 'unknown',
      price: pair.priceUsd || '0',
      marketCap: pair.marketCap ? '$' + Number(pair.marketCap).toLocaleString() : 'N/A',
      liquidity: pair.liquidity?.usd ? '$' + Number(pair.liquidity.usd).toLocaleString() : 'N/A',
      volume24h: pair.volume?.h24 ? '$' + Number(pair.volume.h24).toLocaleString() : 'N/A',
      priceChange24h: pair.priceChange?.h24 || '0',
      imageUrl: pair.info?.imageUrl || null,
    };
  } catch (e) {
    return null;
  }
}

const MAIN_KB = {
  keyboard: [
    [{ text: 'DexScreener' }, { text: 'Pump.fun' }],
    [{ text: 'Four.Meme' }, { text: 'Flap.sh' }],
    [{ text: 'About' }, { text: 'Support' }],
  ],
  resize_keyboard: true,
};

function serviceKB(platformKey) {
  const svc = SERVICES[platformKey];
  const keys = Object.keys(svc.services);
  const rows = [];
  for (let i = 0; i < keys.length; i += 2) {
    const row = [{ text: svc.services[keys[i]].label }];
    if (keys[i + 1]) row.push({ text: svc.services[keys[i + 1]].label });
    rows.push(row);
  }
  rows.push([{ text: 'Back to Main' }]);
  return { keyboard: rows, resize_keyboard: true };
}

function tierKB(tiers, isPriceInUSD = false) {
  const rows = tiers.map(t => {
    const price = isPriceInUSD ? `$${t.priceUSD}` : `${t.priceAmount}`;
    return [{ text: `${t.label} (${price})` }];
  });
  rows.push([{ text: 'Back' }]);
  return { keyboard: rows, resize_keyboard: true };
}

function chainKB() {
  const rows = [];
  for (let i = 0; i < DEXSCREENER_CHAINS.length; i += 2) {
    const row = [{ text: DEXSCREENER_CHAINS[i] }];
    if (DEXSCREENER_CHAINS[i + 1]) row.push({ text: DEXSCREENER_CHAINS[i + 1] });
    rows.push(row);
  }
  rows.push([{ text: 'Back to Main' }]);
  return { keyboard: rows, resize_keyboard: true };
}

function payChainKB(chains) {
  const rows = chains.map(c => [{ text: CRYPTO_INFO[c].label }]);
  rows.push([{ text: 'Back' }]);
  return { keyboard: rows, resize_keyboard: true };
}

const PLATFORM_MAP = {
  'DexScreener': 'dexscreener',
  'Pump.fun': 'pumpfun',
  'Four.Meme': 'fourmeme',
  'Flap.sh': 'flapsh',
};

function findServiceByLabel(label) {
  for (const [pk, pv] of Object.entries(SERVICES)) {
    for (const [sk, sv] of Object.entries(pv.services)) {
      if (sv.label === label) return { platformKey: pk, serviceKey: sk };
    }
  }
  return null;
}

function findTierByText(tiers, text) {
  return tiers.find(t => text.includes(t.label));
}

function findPayChain(text) {
  for (const [symbol, info] of Object.entries(CRYPTO_INFO)) {
    if (info.label === text) return symbol;
  }
  return null;
}

async function notifyAdmin(data) {
  if (!ADMIN_ID) return;
  const msg = `NEW ORDER:\nPlatform: ${data.platform}\nService: ${data.service}\nTier: ${data.tier}\nToken: ${data.tokenName}\nCA: ${data.ca}\nAmount: ${data.amount} ${data.symbol}\nUser: @${data.username || 'unknown'}`;
  try {
    await bot.sendMessage(ADMIN_ID, msg);
  } catch (e) {
    console.error('Admin notify failed:', e.message);
  }
}

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text?.trim() || '';
  const session = getSession(chatId);

  try {
    if (text === '/start') {
      clearSession(chatId);
      await bot.sendMessage(chatId,
        'Welcome to Dex Boosting Bot!\n\nWe provide volume, trending, and holder boosts across DexScreener, Pump.fun, Four.Meme, and Flap.sh.\n\nDexScreener: All prices in USD, pay in ETH/BNB/SOL\nOthers: Prices in native currency (SOL, BNB)\n\nSelect a platform:',
        { reply_markup: MAIN_KB }
      );
      return;
    }

    if (text === 'About') {
      await bot.sendMessage(chatId,
        'Dex Boosting Bot - Professional Token Boosting Service\n\nSupports:\n- DexScreener (Multi-chain)\n- Pump.fun (Solana)\n- Four.Meme (BSC)\n- Flap.sh (BSC)\n\nPricing: Transparent USD (DexScreener) or native currency.\n\nSupport: @Dave_211',
        { reply_markup: MAIN_KB }
      );
      return;
    }

    if (text === 'Support') {
      await bot.sendMessage(chatId,
        'Support available 24/7\n\nContact: @Dave_211\nResponse time: 15 minutes',
        { reply_markup: MAIN_KB }
      );
      return;
    }

    if (text === 'Back to Main') {
      clearSession(chatId);
      await bot.sendMessage(chatId, 'Select a platform:', { reply_markup: MAIN_KB });
      return;
    }

    if (PLATFORM_MAP[text]) {
      session.platform = PLATFORM_MAP[text];
      session.step = 'service';
      const pv = SERVICES[session.platform];
      await bot.sendMessage(chatId, `${pv.emoji} ${pv.label} Services:`, { reply_markup: serviceKB(session.platform) });
      return;
    }

    if (session.step === 'service') {
      const found = findServiceByLabel(text);
      if (found) {
        session.platform = found.platformKey;
        session.service = found.serviceKey;
        const sv = SERVICES[found.platformKey].services[found.serviceKey];
        const isPriceInUSD = SERVICES[found.platformKey].usdPriced;

        if (sv.requiresChain) {
          session.step = 'chain';
          await bot.sendMessage(chatId, `${sv.label}\n\n${sv.description}\n\nSelect blockchain:`, { reply_markup: chainKB() });
        } else {
          session.step = 'tier';
          const tierList = sv.tiers.map((t, i) => {
            const price = isPriceInUSD ? `$${t.priceUSD}` : `${t.priceAmount} ${SERVICES[found.platformKey].nativeCurrency}`;
            return `${i + 1}. ${t.label} (${price}) - ${t.delivery}`;
          }).join('\n');
          await bot.sendMessage(chatId, `${sv.label}\n\n${sv.description}\n\nTiers:\n${tierList}`, { reply_markup: tierKB(sv.tiers, isPriceInUSD) });
        }
        return;
      }
    }

    if (session.step === 'chain') {
      if (DEXSCREENER_CHAINS.includes(text)) {
        session.chain = text;
        session.step = 'tier';
        const sv = SERVICES[session.platform].services[session.service];
        const isPriceInUSD = SERVICES[session.platform].usdPriced;
        const tierList = sv.tiers.map((t, i) => {
          const price = isPriceInUSD ? `$${t.priceUSD}` : `${t.priceAmount}`;
          return `${i + 1}. ${t.label} (${price})`;
        }).join('\n');
        await bot.sendMessage(chatId, `Chain: ${text} selected\n\n${tierList}`, { reply_markup: tierKB(sv.tiers, isPriceInUSD) });
        return;
      }
    }

    if (session.step === 'tier') {
      const sv = SERVICES[session.platform].services[session.service];
      const tier = findTierByText(sv.tiers, text);
      if (tier) {
        session.tier = tier;
        const platformData = SERVICES[session.platform];

        if (platformData.payChains.length > 1) {
          session.step = 'paychain';
          await bot.sendMessage(chatId, `${tier.label} selected\n\nChoose payment method:`, { reply_markup: payChainKB(platformData.payChains) });
        } else {
          session.payChain = platformData.payChains[0];
          session.step = 'ca';
          await bot.sendMessage(chatId, `${tier.label} selected\n\nSend your token Contract Address:`, { reply_markup: { remove_keyboard: true } });
        }
        return;
      }
    }

    if (session.step === 'paychain') {
      const chainSymbol = findPayChain(text);
      if (chainSymbol) {
        session.payChain = chainSymbol;
        session.step = 'ca';
        await bot.sendMessage(chatId, `Payment: ${text}\n\nSend your token Contract Address:`, { reply_markup: { remove_keyboard: true } });
        return;
      }
    }

    if (session.step === 'ca') {
      await bot.sendMessage(chatId, 'Looking up token...');
      const tokenInfo = await fetchTokenInfo(text);

      if (tokenInfo) {
        session.tokenInfo = tokenInfo;
        session.step = 'confirm';

        let msg = `Token Found:\nName: ${tokenInfo.name}\nSymbol: ${tokenInfo.symbol}\nChain: ${tokenInfo.chain}\nPrice: $${Number(tokenInfo.price).toFixed(8)}\nMarket Cap: ${tokenInfo.marketCap}\n\nCorrect token?`;

        if (tokenInfo.imageUrl) {
          try {
            await bot.sendPhoto(chatId, tokenInfo.imageUrl, { caption: msg });
          } catch {
            await bot.sendMessage(chatId, msg);
          }
        } else {
          await bot.sendMessage(chatId, msg);
        }

        await bot.sendMessage(chatId, 'Confirm or enter different CA:', {
          reply_markup: { keyboard: [
            [{ text: 'Confirm' }],
            [{ text: 'Different Address' }],
            [{ text: 'Back' }],
          ], resize_keyboard: true },
        });
      } else {
        await bot.sendMessage(chatId, 'Token not found. Check the address and try again.');
      }
      return;
    }

    if (session.step === 'confirm') {
      if (text === 'Confirm') {
        session.step = 'payment';
        const platformData = SERVICES[session.platform];
        const tier = session.tier;
        const chainInfo = CRYPTO_INFO[session.payChain];

        let amount, amountStr;
        if (platformData.usdPriced) {
          amount = usdToCrypto(tier.priceUSD, session.payChain);
          amountStr = `$${tier.priceUSD} USD (${amount} ${session.payChain})`;
        } else {
          amount = tier.priceAmount;
          amountStr = `${amount} ${session.payChain}`;
        }

        const msg = `Order Summary:\nPlatform: ${platformData.label}\nService: ${SERVICES[session.platform].services[session.service].label}\nTier: ${tier.label}\nToken: ${session.tokenInfo.name}\n\nAmount: ${amountStr}\nNetwork: ${chainInfo.network}\nSend to: ${chainInfo.wallet}\n\nAfter sending, reply with your TxHash`;

        await bot.sendMessage(chatId, msg, {
          reply_markup: { keyboard: [
            [{ text: 'Payment Sent' }],
            [{ text: 'Cancel' }],
          ], resize_keyboard: true },
        });

        await notifyAdmin({
          platform: platformData.label,
          service: SERVICES[session.platform].services[session.service].label,
          tier: tier.label,
          tokenName: session.tokenInfo.name,
          ca: session.tokenInfo.address,
          amount: platformData.usdPriced ? `$${tier.priceUSD} USD (~${amount})` : amount,
          symbol: session.payChain,
          username: msg.from?.username,
        });
        return;
      }

      if (text === 'Different Address') {
        session.step = 'ca';
        await bot.sendMessage(chatId, 'Send new Contract Address:');
        return;
      }

      if (text === 'Back') {
        session.step = 'tier';
        const sv = SERVICES[session.platform].services[session.service];
        const isPriceInUSD = SERVICES[session.platform].usdPriced;
        await bot.sendMessage(chatId, 'Select tier:', { reply_markup: tierKB(sv.tiers, isPriceInUSD) });
        return;
      }
    }

    if (session.step === 'payment') {
      if (text === 'Payment Sent') {
        session.step = 'txhash';
        await bot.sendMessage(chatId, 'Send your transaction hash (TxHash):');
        return;
      }

      if (text === 'Cancel') {
        clearSession(chatId);
        await bot.sendMessage(chatId, 'Order cancelled.', { reply_markup: MAIN_KB });
        return;
      }
    }

    if (session.step === 'txhash') {
      const platformData = SERVICES[session.platform];
      const tier = session.tier;
      const chainInfo = CRYPTO_INFO[session.payChain];
      let amountDisplay;
      if (platformData.usdPriced) {
        const crypto = usdToCrypto(tier.priceUSD, session.payChain);
        amountDisplay = `$${tier.priceUSD} USD (~${crypto} ${session.payChain})`;
      } else {
        amountDisplay = `${tier.priceAmount} ${session.payChain}`;
      }

      await bot.sendMessage(chatId,
        `Payment Received!\n\nOrder Details:\nToken: ${session.tokenInfo.name}\nTier: ${tier.label}\nAmount: ${amountDisplay}\nTxHash: ${text}\n\nYour order will begin within ${tier.delivery}.\n\nThank you!`,
        { reply_markup: MAIN_KB }
      );

      if (ADMIN_ID) {
        await bot.sendMessage(ADMIN_ID, `PAYMENT CONFIRMED\nToken: ${session.tokenInfo.name}\nTxHash: ${text}\nAmount: ${amountDisplay}`);
      }

      clearSession(chatId);
      return;
    }

  } catch (err) {
    console.error('Error:', err.message);
    await bot.sendMessage(chatId, 'Something went wrong. Type /start to begin again.', { reply_markup: MAIN_KB });
  }
});

bot.on('polling_error', (err) => console.error('Polling error:', err.code));
bot.on('error', (err) => console.error('Bot error:', err.message));

console.log('🚀 Dex Boosting Bot is running...');
