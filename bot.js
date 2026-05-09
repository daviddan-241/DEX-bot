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
    fullName: 'DexScreener - Multi-Chain Token Intelligence Platform',
    payChains: ['ETH', 'BNB', 'SOL'],
    usdPriced: true,
    platformDescription: 'DexScreener is the world\'s leading real-time DEX trading analytics platform. Maximize visibility with trending status and high-speed volume bots.',
    services: {
      update: {
        label: 'Profile Update Service',
        description: 'Comprehensive token profile optimization on DexScreener',
        longDesc: 'When traders search your token on DexScreener, they see your profile first. An incomplete profile drives away serious investors. Our Profile Update service ensures your token appears polished, professional, and trustworthy. We update your logo (high-res PNG), project name, official website, Twitter/X account, Telegram community, Discord server, and full project description.',
        tiers: [
          {
            id: 'basic',
            label: 'Essentials Package',
            priceUSD: 50,
            delivery: '24 hours',
            details: 'Perfect for new projects establishing their presence',
            includes: [
              'High-resolution logo upload',
              'Project name verification',
              'Official website URL',
              'Twitter/X link',
              'Telegram community URL',
              'Basic description'
            ]
          },
          {
            id: 'premium',
            label: 'Professional Package',
            priceUSD: 120,
            delivery: '6-12 hours',
            details: 'For serious projects seeking maximum market appeal',
            includes: [
              'Everything in Essentials',
              'Premium banner image',
              'Extended description',
              'Discord server link',
              'GitHub repository link',
              'Medium/Blog link',
              'Priority support'
            ]
          }
        ],
        requiresChain: true,
      },
      trending: {
        label: 'Trending Placement Service',
        description: 'Secure premium placement in DexScreener\'s trending section',
        longDesc: 'DexScreener\'s Trending section is the #1 discovery mechanism on the platform. Thousands of professional traders and retail investors check the trending page hourly. When your token appears in trending, you\'re instantly visible to the most active buyer demographic. This creates a self-fulfilling prophecy: visibility drives buying pressure, which increases volume, which reinforces your trending status. Our algorithm-optimized approach uses calculated activity patterns to trigger DexScreener\'s trending algorithm.',
        tiers: [
          {
            id: 'bronze',
            label: 'Quick Surge (6 hours)',
            priceUSD: 150,
            delivery: '30 minutes',
            details: 'Ideal for flash pumps and rapid community activation',
            includes: [
              '6 consecutive hours in trending',
              'Real distributed wallet activity',
              'Natural-looking trade patterns',
              'Anti-detection algorithms',
              'Real-time monitoring'
            ]
          },
          {
            id: 'silver',
            label: 'Momentum Build (12 hours)',
            priceUSD: 280,
            delivery: '30 minutes',
            details: 'Best for sustained growth and community building',
            includes: [
              'Everything in Quick Surge',
              '12 total hours in trending',
              'Holder count increase (20-50 wallets)',
              'Enhanced volume algorithms',
              '24/7 support during campaign'
            ]
          },
          {
            id: 'gold',
            label: 'Dominance Full Day (24 hours)',
            priceUSD: 500,
            delivery: '30 minutes',
            details: 'Maximum market exposure for serious launches',
            includes: [
              'Everything in Momentum Build',
              '24 full hours in trending',
              'Large holder acquisition (100+ wallets)',
              'Premium volume push',
              'VIP priority support',
              'Post-campaign performance report'
            ]
          }
        ],
        requiresChain: true,
      },
      volume: {
        label: 'Trading Volume Amplification',
        description: 'Strategic 24h trading volume boost using real wallet activity',
        longDesc: 'Volume is one of the first metrics traders examine. A token with zero volume looks abandoned. A token with substantial volume looks active, liquid, and worthy of serious investment. Our Volume Amplification service deploys a network of sophisticated distributed wallets to generate natural-looking trading patterns. We randomize trade sizes, timing, and intervals to bypass anti-bot filters while creating convincing market activity. Your token moves up DexScreener\'s volume rankings, attracts attention from volume-hunting traders, and builds confidence.',
        tiers: [
          {
            id: 'basic',
            label: 'Baseline Activity',
            priceUSD: 80,
            delivery: '1 hour',
            details: 'Establishes trading presence and market legitimacy',
            includes: [
              'Distributed wallet network activation',
              'Randomized trade sizes',
              'Natural timing intervals',
              'Real blockchain transactions',
              'Anti-bot pattern variation'
            ]
          },
          {
            id: 'medium',
            label: 'Momentum Push',
            priceUSD: 180,
            delivery: '1 hour',
            details: 'Significant volume for chart rankings and trader attention',
            includes: [
              'Everything in Baseline Activity',
              'Higher transaction frequency',
              'Larger average trade amounts',
              'Chart ranking boost',
              'Real holder diversity (30-50 wallets)'
            ]
          },
          {
            id: 'heavy',
            label: 'Volume Explosion',
            priceUSD: 350,
            delivery: '1 hour',
            details: 'Top-tier volume for maximum market presence',
            includes: [
              'Everything in Momentum Push',
              'Maximum transaction frequency',
              'Premium wallet network (100+ addresses)',
              'Top 10 volume charts',
              'Sustained 24hr activity',
              'FOMO-inducing market activity'
            ]
          }
        ],
        requiresChain: true,
      },
      boost: {
        label: 'Complete Market Domination Package',
        description: 'Ultimate strategy: heavy volume + trending placement combined',
        longDesc: 'Market domination requires both visibility and credibility. Our Complete Domination Package pairs heavy volume algorithms with trending placement, creating a psychological double-impact. When a trader searches your token and sees it trending WITH substantial volume, the logical conclusion is: "This is the move right now. Everyone is buying." This combination has launched hundreds of tokens to 10x+ returns. Volume proves liquidity, trending proves opportunity.',
        tiers: [
          {
            id: 'starter',
            label: 'Launch Day Surge',
            priceUSD: 200,
            delivery: '30 minutes',
            details: 'Perfect for strong initial market entry',
            includes: [
              'Baseline Volume Package (24h)',
              '6-hour trending placement',
              'Combined visibility + credibility',
              'Coordinated volume-trending algorithm',
              'Sustained market pressure'
            ]
          },
          {
            id: 'pro',
            label: 'Professional Launch',
            priceUSD: 400,
            delivery: '30 minutes',
            details: 'The proven sweet-spot for serious projects',
            includes: [
              'Heavy Volume Package (24h)',
              '12-hour trending placement',
              'Holder acquisition (50-100 wallets)',
              'Dual-algorithm optimization',
              'Extended market domination',
              'Priority technical support'
            ]
          },
          {
            id: 'ultra',
            label: 'Maximum Market Dominance',
            priceUSD: 750,
            delivery: '30 minutes',
            details: 'Absolute market control for serious projects',
            includes: [
              'Volume Explosion Package (24h)',
              '24-hour trending placement',
              'Maximum holder acquisition (200+ wallets)',
              'Triple-layer algorithm optimization',
              'Full day market presence',
              'Premium wallet network',
              'VIP 24/7 account manager',
              'Post-campaign analytics report',
              'Guaranteed top 5 volume + top 10 trending'
            ]
          }
        ],
        requiresChain: true,
      },
    },
  },

  pumpfun: {
    label: 'Pump.fun',
    emoji: '🔥',
    fullName: 'Pump.fun - Solana\'s #1 Community-Driven Launch Platform',
    payChains: ['SOL'],
    usdPriced: false,
    nativeCurrency: 'SOL',
    platformDescription: 'Pump.fun is Solana\'s leading token launch platform with $500M+ in daily volume. Success on Pump.fun means rapid holder acquisition, instant community validation, and potential graduation to Raydium.',
    services: {
      boost: {
        label: 'Volume & Holder Boost',
        description: 'Accelerate your Pump.fun token with coordinated volume bursts and real holder acquisition',
        longDesc: 'Pump.fun\'s algorithm prioritizes tokens with growing holder counts and active trading. Our Boost service deploys sophisticated Solana wallets to generate both trading volume AND genuine holder acquisition simultaneously. This dual approach creates the appearance of organic community growth while generating buying pressure. When the algorithm sees rising holders + rising volume, it interprets legitimate momentum.',
        tiers: [
          {
            id: 'basic',
            label: 'Community Starter',
            priceAmount: 0.5,
            delivery: '15 minutes',
            details: 'Build initial community and trading presence',
            includes: [
              '20-40 new wallet holders',
              'Light-to-moderate buy/sell volume',
              'Real Solana wallet activity',
              'Natural trading interval timing',
              'Algorithm-friendly activity patterns'
            ]
          },
          {
            id: 'medium',
            label: 'Growth Accelerator',
            priceAmount: 1.0,
            delivery: '15 minutes',
            details: 'Strong momentum and visible community growth',
            includes: [
              '50-100 new wallet holders',
              'Moderate volume surge (500-2000 transactions)',
              'Enhanced trending algorithm triggers',
              'Real holder diversity',
              'Sustained activity across multiple hours'
            ]
          },
          {
            id: 'mega',
            label: 'Front-Page Domination',
            priceAmount: 2.0,
            delivery: '15 minutes',
            details: 'Maximum community growth and market visibility',
            includes: [
              '150-250 new wallet holders',
              'Heavy volume surge (5000+ transactions)',
              'Front-page ranking push',
              'Premium distributed wallet network',
              'Multi-cycle trading patterns',
              'Sustained 24+ hour visibility',
              'Organic trader FOMO triggering'
            ]
          }
        ],
      },
      trending: {
        label: 'Pump.fun Trending Placement',
        description: 'Place your token in Pump.fun\'s trending section - watched by 100,000+ traders daily',
        longDesc: 'Pump.fun\'s Trending section is where opportunities are born. Thousands of sophisticated Solana traders check this page multiple times hourly, hunting for tokens with momentum. Being featured acts as a credibility signal - the algorithm validates your token. This creates self-reinforcing cycle: visibility attracts traders, new traders generate volume, volume keeps you trending.',
        tiers: [
          {
            id: 'basic',
            label: 'Trending Push',
            priceAmount: 1.5,
            delivery: '20 minutes',
            details: 'Entry into the trending discovery flow',
            includes: [
              '4-6 hours in trending section',
              'Algorithm-optimized activity patterns',
              'Real Solana distributed wallets',
              'Natural trading behavior',
              'Real-time trending monitoring'
            ]
          },
          {
            id: 'premium',
            label: 'Elite Trending (Top 10)',
            priceAmount: 3.0,
            delivery: '20 minutes',
            details: 'Maximum discovery and organic buying pressure',
            includes: [
              'Top 10 trending placement guarantee',
              '8-12 hours in trending section',
              'Holder count increase (50-100 wallets)',
              'Premium volume push during trending',
              'Multi-chain algorithm triggers',
              'Priority trending status',
              'Sustained visibility for opportunity window'
            ]
          }
        ],
      },
      volume: {
        label: 'Trading Volume Surge',
        description: 'Generate authentic trading volume using real Solana wallet activity',
        longDesc: 'Volume is the lifeblood of market momentum. A token with low volume feels illiquid and risky. A token with substantial volume feels safe and liquid. Our Volume Surge service activates a premium network of Solana wallets with carefully randomized patterns. We vary amounts, random timing, and mixed sequences. This creates authentic activity that passes detection.',
        tiers: [
          {
            id: 'basic',
            label: 'Liquidity Foundation',
            priceAmount: 0.5,
            delivery: '30 minutes',
            details: 'Establishes baseline trading activity',
            includes: [
              'Distributed Solana wallet network',
              'Randomized trade amounts',
              'Natural timing patterns',
              'Bot-detection bypass algorithms',
              'Real blockchain transactions'
            ]
          },
          {
            id: 'medium',
            label: 'Volume Acceleration',
            priceAmount: 1.0,
            delivery: '30 minutes',
            details: 'Significant volume for chart visibility',
            includes: [
              'Everything in Liquidity Foundation',
              'Higher transaction frequency (2-3x)',
              'Larger average trade sizes',
              'Chart ranking improvement',
              'Multiple trading cycles'
            ]
          },
          {
            id: 'heavy',
            label: 'Volume Explosion',
            priceAmount: 2.0,
            delivery: '30 minutes',
            details: 'Maximum trading volume and market appearance',
            includes: [
              'Everything in Volume Acceleration',
              'Premium wallet network (50+ addresses)',
              'Maximum transaction frequency',
              'Top volume charts on Pump.fun',
              'Sustained multi-hour activity',
              'Holder activity included'
            ]
          }
        ],
      },
      graduation: {
        label: 'Graduation Acceleration',
        description: 'Fast-track your Pump.fun token to graduation and Raydium migration',
        longDesc: 'Pump.fun graduation is the holy grail - reaching $69K bonding curve means migration to Raydium, a real DEX. Graduation signals serious legitimacy and opens CEX listing doors. Our service uses strategic volume bursts to accelerate progress. We analyze current position and deploy exact activity needed.',
        tiers: [
          {
            id: 'assist',
            label: 'Completion Assist (40-60%)',
            priceAmount: 2.5,
            delivery: '30 minutes',
            details: 'Mid-stage push for tokens with progress',
            includes: [
              'Bonding curve acceleration (40-60%)',
              'Timed volume burst patterns',
              'Real buy pressure generation',
              'Algorithm-friendly activity pacing',
              'Progress monitoring and adjustments'
            ]
          },
          {
            id: 'boost',
            label: 'Graduation Boost (60-80%)',
            priceAmount: 4.0,
            delivery: '30 minutes',
            details: 'Heavy push for tokens nearing graduation',
            includes: [
              'Everything in Completion Assist',
              'Heavy volume burst acceleration',
              'Bonding curve completion push (60-80%)',
              'FOMO-inducing market activity',
              'Premium distributed wallet network',
              'Support monitoring'
            ]
          },
          {
            id: 'express',
            label: 'Express Graduation (Ready to Launch)',
            priceAmount: 6.0,
            delivery: '15 minutes',
            details: 'Maximum acceleration for tokens 80%+ complete',
            includes: [
              'Everything in Graduation Boost',
              'Maximum volume push patterns',
              'Fastest bonding curve completion',
              'Guaranteed graduation attempt',
              'VIP priority support',
              'Raydium migration monitoring',
              'Post-graduation tracking'
            ]
          }
        ],
      },
    },
  },

  fourmeme: {
    label: 'Four.Meme',
    emoji: '🐸',
    fullName: 'Four.Meme - BSC\'s Premier Meme Coin Launchpad',
    payChains: ['BNB'],
    usdPriced: false,
    nativeCurrency: 'BNB',
    platformDescription: 'Four.Meme is the leading meme token launchpad on BNB Chain with tens of thousands of traders hunting for the next viral opportunity.',
    services: {
      boost: {
        label: 'Community & Volume Boost',
        description: 'Rapidly grow token holder base and trading volume on Four.Meme',
        longDesc: 'Four.Meme success formula: holders + volume = credibility. Our service deploys real BNB wallets to increase both holder count and trading simultaneously. When BSC community sees growing holders + active trading, they interpret legitimate momentum and join organically. This creates network effect where algorithmic boost attracts real traders.',
        tiers: [
          {
            id: 'basic',
            label: 'Community Foundation',
            priceAmount: 0.3,
            delivery: '15 minutes',
            details: 'Establish initial holder base and activity',
            includes: [
              '15-30 new BNB wallet holders',
              'Light-to-moderate trading volume',
              'Real BNB Chain wallet network',
              'Natural transaction timing',
              'Foundational community signal'
            ]
          },
          {
            id: 'medium',
            label: 'Community Growth',
            priceAmount: 0.6,
            delivery: '15 minutes',
            details: 'Visible growth and chart momentum',
            includes: [
              '40-80 new BNB wallet holders',
              'Moderate trading volume surge',
              'Four.Meme chart ranking improvement',
              'Trending section push',
              'Real holder diversity'
            ]
          },
          {
            id: 'mega',
            label: 'BSC Dominance',
            priceAmount: 1.0,
            delivery: '15 minutes',
            details: 'Maximum community presence on BSC',
            includes: [
              '100-200 new BNB wallet holders',
              'Heavy trading volume surge',
              'Front-page placement on Four.Meme',
              'Trending section guarantee',
              'Premium BNB wallet network',
              'Sustained 24+ hour visibility',
              'Organic trader attraction'
            ]
          }
        ],
      },
      trending: {
        label: 'Trending Placement Service',
        description: 'Secure premium positioning in Four.Meme\'s trending section',
        longDesc: 'Four.Meme trending page is the primary discovery mechanism for meme coins on BSC. Thousands of experienced traders check trending hourly. When your token appears there, it signals market recognition. Professional traders are watching. Our service uses algorithm-optimized activity to trigger trending filters.',
        tiers: [
          {
            id: 'basic',
            label: 'Trending Visibility',
            priceAmount: 0.5,
            delivery: '20 minutes',
            details: 'Entry into trending discovery section',
            includes: [
              '4-6 hours in Four.Meme trending',
              'Algorithm-optimized BNB activity',
              'Real wallet network engagement',
              'Natural trading behavior patterns',
              'Trending status monitoring'
            ]
          },
          {
            id: 'premium',
            label: 'Elite Trending Position',
            priceAmount: 1.0,
            delivery: '20 minutes',
            details: 'Top positioning for maximum BSC exposure',
            includes: [
              'Top 5 trending placement',
              '8-12 hours in trending section',
              'Holder acquisition (40-80 wallets)',
              'Volume boost during trending period',
              'Extended opportunity window',
              'Real organic trader conversion'
            ]
          }
        ],
      },
      volume: {
        label: 'Trading Volume Generation',
        description: 'Create authentic trading volume using distributed BNB wallets',
        longDesc: 'A token with volume appears healthy and liquid. Our Volume Generation deploys randomized BNB wallet activity to create convincing market action. We vary sizes, randomize timing, mix buy/sell to mimic organic while bypassing detection. Result: your token climbs volume rankings.',
        tiers: [
          {
            id: 'basic',
            label: 'Volume Foundation',
            priceAmount: 0.3,
            delivery: '30 minutes',
            details: 'Establish baseline trading activity',
            includes: [
              'Distributed BNB wallet network',
              'Randomized trade amounts',
              'Natural transaction timing',
              'Baseline chart visibility',
              'Real blockchain activity'
            ]
          },
          {
            id: 'medium',
            label: 'Volume Growth',
            priceAmount: 0.6,
            delivery: '30 minutes',
            details: 'Meaningful volume for trader attention',
            includes: [
              'Everything in Volume Foundation',
              'Higher transaction frequency',
              'Improved chart rankings',
              'Larger trade sizes',
              'Multi-cycle daily activity'
            ]
          },
          {
            id: 'heavy',
            label: 'Volume Dominance',
            priceAmount: 1.0,
            delivery: '30 minutes',
            details: 'Top-tier volume on BSC',
            includes: [
              'Everything in Volume Growth',
              'Premium wallet network (60+ addresses)',
              'Maximum transaction frequency',
              'Top volume charts',
              'Sustained multi-hour activity',
              'Holder activity included'
            ]
          }
        ],
      },
    },
  },

  flapsh: {
    label: 'Flap.sh',
    emoji: '⚡',
    fullName: 'Flap.sh - Advanced BSC Token Growth Platform',
    payChains: ['BNB'],
    usdPriced: false,
    nativeCurrency: 'BNB',
    platformDescription: 'Flap.sh is BSC\'s growing premium token platform combining Pump.fun energy with advanced analytics. Early presence builds credibility.',
    services: {
      boost: {
        label: 'Growth Acceleration Package',
        description: 'Accelerate your Flap.sh token with holder acquisition and volume',
        longDesc: 'Flap.sh rewards tokens showing simultaneous holder growth and momentum. Our service pairs real wallet acquisition with strategic volume, signaling healthy momentum. Attracts real traders interested in early, growing communities.',
        tiers: [
          {
            id: 'basic',
            label: 'Launch Momentum',
            priceAmount: 0.3,
            delivery: '15 minutes',
            details: 'Initial growth phase activation',
            includes: [
              '15-30 new BNB wallet holders',
              'Moderate trading volume',
              'Real Flap.sh wallet network',
              'Natural transaction patterns',
              'Foundation growth signal'
            ]
          },
          {
            id: 'medium',
            label: 'Momentum Builder',
            priceAmount: 0.6,
            delivery: '15 minutes',
            details: 'Sustained growth and visibility',
            includes: [
              '40-80 new wallet holders',
              'Moderate-to-heavy volume',
              'Flap.sh ranking improvement',
              'Chart visibility boost',
              'Real community signal'
            ]
          },
          {
            id: 'mega',
            label: 'Growth Explosion',
            priceAmount: 1.0,
            delivery: '15 minutes',
            details: 'Maximum platform presence',
            includes: [
              '100-200 new wallet holders',
              'Heavy trading volume',
              'Premium wallet network',
              'Top platform positioning',
              'Sustained visibility',
              'Organic trader attraction'
            ]
          }
        ],
      },
      trending: {
        label: 'Trending Breakthrough',
        description: 'Place your token in Flap.sh trending for maximum discovery',
        longDesc: 'Flap.sh trending means visibility to platform\'s most engaged traders. Our service uses sophisticated triggers to secure premium positioning.',
        tiers: [
          {
            id: 'basic',
            label: 'Trending Entry',
            priceAmount: 0.5,
            delivery: '20 minutes',
            details: 'Foundation trending visibility',
            includes: [
              '4-6 hours in trending section',
              'Algorithm-optimized activity',
              'Real BNB wallet engagement',
              'Natural trading patterns',
              'Status monitoring'
            ]
          },
          {
            id: 'premium',
            label: 'Premium Trending',
            priceAmount: 1.0,
            delivery: '20 minutes',
            details: 'Maximum trending platform exposure',
            includes: [
              'Top trending placement',
              '8-12 hours visible status',
              'Holder growth included',
              'Volume push included',
              'Extended opportunity window'
            ]
          }
        ],
      },
      volume: {
        label: 'Volume Optimization',
        description: 'Strategically generate volume using distributed BNB wallets',
        longDesc: 'Volume is credibility on Flap.sh. Our service creates market activity that builds confidence.',
        tiers: [
          {
            id: 'basic',
            label: 'Baseline Volume',
            priceAmount: 0.3,
            delivery: '30 minutes',
            details: 'Establish trading presence',
            includes: [
              'Distributed BNB wallets',
              'Randomized trade patterns',
              'Natural timing',
              'Baseline visibility',
              'Bot-detection safe'
            ]
          },
          {
            id: 'medium',
            label: 'Volume Push',
            priceAmount: 0.6,
            delivery: '30 minutes',
            details: 'Significant trading volume',
            includes: [
              'Everything in Baseline Volume',
              'Higher frequency trading',
              'Chart ranking boost',
              'Larger trade sizes',
              'Multi-cycle activity'
            ]
          },
          {
            id: 'heavy',
            label: 'Volume Peak',
            priceAmount: 1.0,
            delivery: '30 minutes',
            details: 'Maximum volume performance',
            includes: [
              'Everything in Volume Push',
              'Premium wallet network',
              'Maximum frequency',
              'Top charts positioning',
              'Sustained activity'
            ]
          }
        ],
      },
    },
  },
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

function getSession(id) {
  return sessions[id] = sessions[id] || {};
}

function clearSession(id) {
  delete sessions[id];
}

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
  return {
    keyboard: [
      [{ text: '📊 DexScreener' }, { text: '🔥 Pump.fun' }],
      [{ text: '🐸 Four.Meme' }, { text: '⚡ Flap.sh' }],
      [{ text: 'About' }, { text: 'Support' }]
    ],
    resize_keyboard: true
  };
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
  return {
    keyboard: [
      [{ text: '✓ Confirm Token' }],
      [{ text: '✎ Different Address' }],
      [{ text: 'Back to Main Menu' }]
    ],
    resize_keyboard: true
  };
}

function paymentKB() {
  return {
    keyboard: [
      [{ text: '✓ Payment Sent' }],
      [{ text: '✗ Cancel Order' }]
    ],
    resize_keyboard: true
  };
}

async function notifyAdmin(data) {
  if (!ADMIN_ID) return;
  const msg = 'NEW ORDER\n\nPlatform: ' + data.platform + '\nService: ' + data.service + '\nTier: ' + data.tier + '\nToken: ' + data.tokenName + '\nCA: ' + data.ca + '\nAmount: ' + data.amount + '\nUser: @' + (data.username || 'unknown');
  try {
    await bot.sendMessage(ADMIN_ID, msg);
  } catch (e) {
    console.error('Admin:', e.message);
  }
}

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text?.trim() || '';
  const session = getSession(chatId);

  try {
    if (text === '/start') {
      clearSession(chatId);
      await bot.sendMessage(chatId, '👋 Welcome to the Multi-Platform Token Booster Bot!\n\nReady to send your token to the moon? 🚀\n\nWe provide industry-leading automated services across the top crypto platforms.\n\n📊 DexScreener - Maximize visibility with trending status\n🔥 Pump.fun - Supercharge your Solana launches\n🐸 Four.Meme - Dominate BSC meme coin charts\n⚡ Flap.sh - Automate your BSC project\n\n💡 Select a platform to get started:', { reply_markup: mainKB() });
      return;
    }

    if (text === 'About') {
      await bot.sendMessage(chatId, '✨ Why Choose Us?\n\n• Trusted by Professionals: We are verified providers for top-tier crypto projects.\n• Direct API Integration: We use official channels for safety.\n• 24/7 Premium Support: Our team helps you scale.\n\n⚠️ IMPORTANT: This bot is an independent service with unmatched reliability and speed.\n\nContact: @Dave_211', { reply_markup: mainKB() });
      return;
    }

    if (text === 'Support') {
      await bot.sendMessage(chatId, '🛟 24/7 Support Available\n\nPrimary Contact: @Dave_211\nAverage Response Time: ~15 minutes\n\nWhen contacting support, include:\n• Order details\n• Transaction hash\n• Token contract address\n• Issue description\n\nWe value your business!', { reply_markup: mainKB() });
      return;
    }

    if (text === 'Back to Main Menu') {
      clearSession(chatId);
      await bot.sendMessage(chatId, '👋 Select a platform:', { reply_markup: mainKB() });
      return;
    }

    const pmatch = Object.keys(SERVICES).find(k => SERVICES[k].label === text.replace(/^[📊🔥🐸⚡] /, ''));
    if (pmatch) {
      session.platform = pmatch;
      session.step = 'service';
      const pv = SERVICES[pmatch];
      await bot.sendMessage(chatId, pv.emoji + ' ' + pv.fullName + '\n\n' + pv.platformDescription + '\n\nSelect a service:', { reply_markup: serviceKB(pmatch) });
      return;
    }

    if (session.step === 'service' && session.platform) {
      const sv = Object.values(SERVICES[session.platform].services).find(s => s.label === text);
      if (sv) {
        session.service = Object.keys(SERVICES[session.platform].services).find(k => SERVICES[session.platform].services[k].label === text);
        let msg = sv.label + '\n\n' + sv.description + '\n\n' + sv.longDesc + '\n\nAvailable Tiers:\n';
        sv.tiers.forEach((t, i) => {
          const p = SERVICES[session.platform].usdPriced ? '$' + t.priceUSD : t.priceAmount;
          msg += '\n' + (i + 1) + '. ' + t.label + ' (' + p + ')\n   ' + t.details;
        });

        if (sv.requiresChain) {
          session.step = 'chain';
          msg += '\n\nFirst, select the blockchain where your token is deployed:';
          await bot.sendMessage(chatId, msg, { reply_markup: chainKB() });
        } else {
          session.step = 'tier';
          const isUSD = SERVICES[session.platform].usdPriced;
          msg += '\n\nSelect your preferred tier:';
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
      let msg = '✅ Blockchain Selected: ' + text + '\n\nAvailable Tiers:\n';
      sv.tiers.forEach((t, i) => {
        const p = isUSD ? '$' + t.priceUSD : t.priceAmount;
        msg += '\n' + (i + 1) + '. ' + t.label + ' (' + p + ')\n   ' + t.delivery + ' delivery\n   ' + t.details;
      });
      msg += '\n\nSelect your tier:';
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
          let msg = '✅ Tier Selected: ' + tier.label + '\n\nPayment Methods:\n';
          pd.payChains.forEach((c, i) => {
            const amt = pd.usdPriced ? '$' + tier.priceUSD + ' (~' + usdToCrypto(tier.priceUSD, c) + ' ' + c + ')' : tier.priceAmount + ' ' + c;
            msg += '\n' + (i + 1) + '. ' + CRYPTO_INFO[c].label + ' — ' + amt;
          });
          msg += '\n\nChoose your preferred payment network:';
          await bot.sendMessage(chatId, msg, { reply_markup: payKB(pd.payChains) });
        } else {
          session.payChain = pd.payChains[0];
          session.step = 'ca';
          await bot.sendMessage(chatId, '✅ Tier & Payment Method Selected\n\n' + tier.label + '\nPayment: ' + CRYPTO_INFO[session.payChain].label + '\n\nNow send your token Contract Address (CA):', { reply_markup: { remove_keyboard: true } });
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
        await bot.sendMessage(chatId, '✅ Payment Method Selected\n\nNetwork: ' + CRYPTO_INFO[cs].network + '\nAmount: ' + disp + '\n\nNow send your token Contract Address (CA):', { reply_markup: { remove_keyboard: true } });
        return;
      }
    }

    if (session.step === 'ca' && text.length > 20) {
      await bot.sendMessage(chatId, '🔍 Verifying token on DexScreener...');
      const info = await fetchTokenInfo(text);

      if (info) {
        session.tokenInfo = info;
        session.step = 'confirm';
        let msg = '✅ TOKEN FOUND\n\nName: ' + info.name + '\nSymbol: $' + info.symbol + '\nChain: ' + info.chain + '\nPrice: $' + Number(info.price).toFixed(8) + '\nMarket Cap: ' + info.marketCap + '\n24h Volume: ' + info.volume24h + '\nLiquidity: ' + info.liquidity + '\n\nCA: ' + info.address + '\n\nIs this the correct token?';

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
        await bot.sendMessage(chatId, '❌ Token not found on DexScreener.\n\nPlease verify:\n• Address is correct\n• Token is on a supported chain\n• Token has liquidity pairs\n\nTry again or contact support.');
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

        let msg = '📋 ORDER SUMMARY\n\nPlatform: ' + pd.label + '\nService: ' + SERVICES[session.platform].services[session.service].label + '\nTier: ' + tier.label + '\nToken: ' + session.tokenInfo.name + ' ($' + session.tokenInfo.symbol + ')\n\n💰 PAYMENT DETAILS\n\nAmount: ' + disp + '\nNetwork: ' + ci.network + '\nDelivery: ' + tier.delivery + '\n\nSEND TO (tap to copy):\n' + ci.wallet + '\n\n⚠️ IMPORTANT:\n• Send EXACTLY the amount specified\n• Use the correct network (' + ci.network + ')\n• Double-check the wallet address\n• Save your transaction hash\n\nWhen done, confirm with "Payment Sent":';

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
        await bot.sendMessage(chatId, 'Send a different token Contract Address:', { reply_markup: { remove_keyboard: true } });
        return;
      }
    }

    if (session.step === 'payment') {
      if (text === '✓ Payment Sent') {
        session.step = 'txhash';
        await bot.sendMessage(chatId, '📨 Provide your transaction hash (TxHash) for verification:', { reply_markup: { remove_keyboard: true } });
        return;
      }

      if (text === '✗ Cancel Order') {
        clearSession(chatId);
        await bot.sendMessage(chatId, '❌ Order cancelled. Type /start to begin again.', { reply_markup: mainKB() });
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

      let msg = '✅ PAYMENT CONFIRMED\n\nThank you! Your order has been received.\n\n📋 ORDER DETAILS:\n\nPlatform: ' + pd.label + '\nService: ' + sv.label + '\nTier: ' + tier.label + '\nToken: ' + session.tokenInfo.name + ' ($' + session.tokenInfo.symbol + ')\nAmount: ' + disp + '\n\n🔗 TxHash (tap to copy):\n' + text + '\n\n⏱ Your order will begin within ' + tier.delivery + '.\n\nIf you don\'t see results within 1 hour, contact Support.\n\nThank you for using Dex Boosting Bot! 🚀';

      await bot.sendMessage(chatId, msg, { reply_markup: mainKB() });

      if (ADMIN_ID) {
        const admsg = '✅ PAYMENT CONFIRMED\n\nToken: ' + session.tokenInfo.name + '\nCA: ' + session.tokenInfo.address + '\nAmount: ' + disp + '\nTxHash: ' + text + '\nPlatform: ' + pd.label + '\nTier: ' + tier.label;
        try {
          await bot.sendMessage(ADMIN_ID, admsg);
        } catch (e) {
          console.error('Admin:', e.message);
        }
      }

      clearSession(chatId);
    }

  } catch (err) {
    console.error('Error:', err.message);
    await bot.sendMessage(chatId, '⚠️ An error occurred. Type /start to try again.', { reply_markup: mainKB() }).catch(() => {});
  }
});

bot.on('polling_error', (err) => console.error('Polling:', err.code));
bot.on('error', (err) => console.error('Error:', err.message));

console.log('✅ Bot Started - Production Ready');