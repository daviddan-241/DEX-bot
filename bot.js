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

const SERVICES = {
  dexscreener: {
    label: 'DexScreener',
    emoji: '📊',
    fullName: 'DexScreener - Multi-Chain Token Intelligence Platform',
    payChains: ['ETH', 'BNB', 'SOL'],
    usdPriced: true,
    platformDescription: 'DexScreener is the world\'s leading real-time DEX trading analytics platform, trusted by over 1 million crypto traders monthly. Your token\'s DexScreener presence is often the first impression professional investors get. Our services ensure your token looks legitimate, active, and investable.',
    services: {
      update: {
        label: 'Profile Update Service',
        description: 'Comprehensive token profile optimization on DexScreener. This service updates every critical aspect of your token\'s public profile — from logo and name to website links and all social media channels. A complete, professional profile signals legitimacy to traders and attracts serious investment.',
        longDesc: 'When traders search your token on DexScreener, the first thing they see is your profile. An incomplete or poorly maintained profile creates doubt and drives away sophisticated investors. Our Profile Update service ensures your token appears polished, professional, and trustworthy. We update your logo (high-res PNG), project name, official website, Twitter/X account, Telegram community, Discord server, and full project description with all key metrics.',
        tiers: [
          { 
            id: 'basic', 
            label: 'Essentials Package', 
            priceUSD: 50, 
            delivery: '24 hours',
            details: 'Perfect for new projects establishing their presence',
            includes: [
              'High-resolution logo upload (256x256)',
              'Project name verification',
              'Official website URL linking',
              'Twitter/X verified link',
              'Telegram community URL',
              'Basic description up to 500 characters'
            ]
          },
          { 
            id: 'premium', 
            label: 'Professional Package', 
            priceUSD: 120, 
            delivery: '6-12 hours',
            details: 'For serious projects seeking maximum market appeal',
            includes: [
              'Everything in Essentials Package',
              'Premium banner image (1200x400)',
              'Extended project description (2000+ characters)',
              'Discord server integration',
              'GitHub repository link',
              'Medium/Blog articles link',
              'Priority DexScreener support liaison'
            ]
          },
        ],
        requiresChain: true,
      },
      trending: {
        label: 'Trending Placement Service',
        description: 'Secure premium placement in DexScreener\'s trending section — the discovery hub where thousands of active traders hunt for the next big opportunity every single day. Trending placement drives explosive organic buying pressure.',
        longDesc: 'DexScreener\'s Trending section is the #1 discovery mechanism on the platform. Thousands of professional traders and retail investors check the trending page hourly, looking for emerging opportunities with momentum. When your token appears in trending, you\'re instantly visible to the most active buyer demographic in crypto. This creates a self-fulfilling prophecy: visibility drives buying pressure, which increases volume, which reinforces your trending status. Our algorithm-optimized approach uses calculated buy/sell activity patterns to trigger DexScreener\'s trending algorithm, placing your token in front of precisely the audiences most likely to invest.',
        tiers: [
          { 
            id: 'bronze', 
            label: 'Quick Surge (6 hours)', 
            priceUSD: 150, 
            delivery: '30 minutes',
            details: 'Ideal for flash pumps and rapid community activation',
            includes: [
              '6 consecutive hours in trending section',
              'Real distributed wallet activity',
              'Natural-looking trade patterns',
              'Anti-detection volume algorithms',
              'Real-time monitoring dashboard'
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
              '12 total hours in trending (can be split)',
              'Holder count increase (20-50 real wallets)',
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
              '24 full hours in trending section',
              'Large holder acquisition (100+ wallets)',
              'Premium volume push (maximum algorithm)',
              'VIP priority support with dedicated account manager',
              'Post-campaign performance report with analytics'
            ]
          },
        ],
        requiresChain: true,
      },
      volume: {
        label: 'Trading Volume Amplification',
        description: 'Strategic 24h trading volume boost using real wallet activity across multiple blockchains. High volume creates the appearance of organic market interest and pushes tokens into volume leaderboards.',
        longDesc: 'Volume is one of the first metrics traders examine. A token with zero volume looks abandoned. A token with substantial volume looks active, liquid, and worthy of serious investment. Our Volume Amplification service deploys a network of sophisticated, distributed wallets to generate natural-looking trading patterns — buy/sell sequences that mimic organic market behavior rather than bot-like monotony. We randomize trade sizes, timing, and intervals to bypass anti-bot filters while creating convincing market activity. Your token moves up DexScreener\'s volume rankings, attracts attention from volume-hunting traders, and builds confidence among potential investors.',
        tiers: [
          { 
            id: 'basic', 
            label: 'Baseline Activity', 
            priceUSD: 80, 
            delivery: '1 hour',
            details: 'Establishes trading presence and market legitimacy',
            includes: [
              'Distributed wallet network activation',
              'Randomized trade sizes (no patterns)',
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
              'DexScreener volume chart ranking boost',
              'Real holder diversity (30-50 different wallets)'
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
              'Premium wallet network (100+ distributed addresses)',
              'Top 10 volume charts on DexScreener',
              'Sustained 24hr activity with multiple trading cycles',
              'FOMO-inducing market activity'
            ]
          },
        ],
        requiresChain: true,
      },
      boost: {
        label: 'Complete Market Domination Package',
        description: 'The ultimate DexScreener strategy: combine devastating trading volume WITH trending placement for unstoppable market momentum. When traders see high volume AND trending status simultaneously, FOMO becomes irresistible.',
        longDesc: 'Market domination requires both visibility and credibility. Our Complete Domination Package pairs heavy volume algorithms with trending placement — creating a psychological double-impact on traders. When a trader searches your token and sees it trending WITH substantial volume, the logical conclusion is: "This is the move right now. Everyone else is buying. If I don\'t move fast, I\'ll miss it." This combination has launched hundreds of successful tokens to 10x+ returns. Volume proves liquidity exists, trending proves the market recognizes the opportunity, and together they create the perfect conditions for explosive organic buying pressure that feeds on itself.',
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
              'Combined visibility + credibility effect',
              'Coordinated volume-trending algorithm',
              '5+ hour sustained market pressure'
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
              'Dual-algorithm optimization (volume + trending)',
              'Extended market domination (12+ hours visible activity)',
              'Priority technical support throughout campaign'
            ]
          },
          { 
            id: 'ultra', 
            label: 'Maximum Market Dominance', 
            priceUSD: 750, 
            delivery: '30 minutes',
            details: 'Absolute market control for serious projects',
            includes: [
              'Volume Explosion Package (full 24h)',
              '24-hour trending placement',
              'Maximum holder acquisition (200+ wallets)',
              'Triple-layer algorithm optimization',
              'Full day market presence with multiple trading cycles',
              'Premium wallet network (100+ premium-tier addresses)',
              'VIP concierge support with 24/7 account manager',
              'Detailed post-campaign analytics and performance report',
              'Guaranteed top 5 volume + top 10 trending for 24hrs'
            ]
          },
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
    platformDescription: 'Pump.fun is Solana\'s leading token launch platform with $500M+ in daily volume. Success on Pump.fun means rapid holder acquisition, instant community validation, and the potential for graduation to Raydium — the gateway to major exchange listings. Early momentum is everything.',
    services: {
      boost: {
        label: 'Volume & Holder Boost',
        description: 'Accelerate your Pump.fun token with coordinated volume bursts and real holder acquisition. Higher holder count + trading activity = better algorithm ranking and organic investor attention.',
        longDesc: 'Pump.fun\'s algorithm prioritizes tokens with growing holder counts and active trading. Our Boost service deploys sophisticated Solana wallets to generate both trading volume AND genuine holder acquisition simultaneously. This dual approach creates the appearance of organic community growth while simultaneously generating buying pressure that attracts real traders. When the Pump.fun algorithm sees rising holders + rising volume, it interprets this as legitimate project momentum and naturally elevates your token in rankings, feeds, and trending sections.',
        tiers: [
          { 
            id: 'basic', 
            label: 'Community Starter', 
            priceAmount: 0.5, 
            delivery: '15 minutes',
            details: 'Build initial community and trading presence',
            includes: [
              '20-40 new wallet holders added',
              'Light-to-moderate buy/sell volume',
              'Real Solana wallet network activity',
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
              'Real holder diversity across addresses',
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
              'Front-page ranking push on Pump.fun',
              'Premium distributed wallet network',
              'Multi-cycle trading patterns',
              'Sustained 24+ hour activity visibility',
              'Organic trader FOMO triggering'
            ]
          },
        ],
      },
      trending: {
        label: 'Pump.fun Trending Placement',
        description: 'Place your token in Pump.fun\'s trending section — the main discovery page watched by 100,000+ active Solana traders daily. Trending visibility converts to instant volume and community calls.',
        longDesc: 'Pump.fun\'s Trending section is where opportunities are born. Thousands of sophisticated Solana traders check this page multiple times per hour, hunting for tokens with momentum. Being featured in trending acts as a credibility signal — the algorithm itself has validated your token as worth watching. This creates a self-reinforcing cycle: visibility attracts traders, new traders generate volume, volume keeps you trending, more traders arrive. Our Trending service uses algorithm-optimized activity patterns to trigger Pump.fun\'s trending filters, securing premium placement that converts to real buying pressure.',
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
              'Real-time trending status monitoring'
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
              'Premium volume push during trending period',
              'Multi-chain algorithm triggers',
              'Priority trending algorithm status',
              'Sustained visibility for extended opportunity window'
            ]
          },
        ],
      },
      volume: {
        label: 'Trading Volume Surge',
        description: 'Generate authentic-looking trading volume on Pump.fun using real Solana wallet activity. High volume attracts traders, improves liquidity perception, and boosts algorithm visibility.',
        longDesc: 'Volume is the lifeblood of market momentum. A token with low volume feels illiquid and risky. A token with substantial volume feels safe and liquid — traders can buy or sell without slippage concerns. Our Volume Surge service activates a premium network of Solana wallets with carefully randomized trading patterns: varying amounts, random timing intervals, and mixed buy/sell sequences. This creates authentic market activity that passes Pump.fun\'s bot detection while genuinely improving your token\'s liquidity profile.',
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
              'Multiple trading cycles throughout day'
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
          },
        ],
      },
      graduation: {
        label: 'Graduation Acceleration',
        description: 'Fast-track your Pump.fun token to graduation (reaching $69K bonding curve completion) and migration to Raydium DEX. Graduation unlocks CEX listing opportunities and serious institutional interest.',
        longDesc: 'Pump.fun graduation is the holy grail — it means your token reaches the $69,000 bonding curve cap and migrates to Raydium, a real DEX where billions in daily volume flows. Graduation signals serious legitimacy and opens doors to major exchange listings. Our Graduation Acceleration service uses strategic, timed volume bursts to accelerate bonding curve progress. We analyze your token\'s current position and deploy exactly the right amount of activity to move toward the finish line without appearing artificial. Many successful tokens credit our graduation service for pushing them over the finish line when community momentum stalled.',
        tiers: [
          { 
            id: 'assist', 
            label: 'Completion Assist (40-60%)', 
            priceAmount: 2.5, 
            delivery: '30 minutes',
            details: 'Mid-stage push for tokens with moderate progress',
            includes: [
              'Bonding curve acceleration (40-60% completion target)',
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
              'Support monitoring throughout process'
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
              'Fastest possible bonding curve completion',
              'Guaranteed graduation attempt',
              'VIP priority support during critical window',
              'Raydium migration monitoring',
              'Post-graduation performance tracking'
            ]
          },
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
    platformDescription: 'Four.Meme is the leading meme token launchpad on BNB Chain, with tens of thousands of active traders hunting for the next viral opportunity. Early social proof and community growth trigger explosive organic buying from the BSC community.',
    services: {
      boost: {
        label: 'Community & Volume Boost',
        description: 'Rapidly grow your Four.Meme token\'s holder base and trading volume. Real BNB wallet activity creates the social proof that attracts organic community investment.',
        longDesc: 'Four.Meme\'s success formula is simple: holders + volume = credibility. Our Community & Volume Boost deploys a network of real BNB Chain wallets to simultaneously increase both holder count and trading activity. When the BSC community sees a token with growing holders and active trading, they interpret it as legitimate project momentum and join in organically. This creates a powerful network effect where your algorithmic boost attracts real traders, whose real activity further validates your token and attracts even more real investors.',
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
              'Real holder diversity (BNB addresses)'
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
              'Premium BNB wallet network activity',
              'Sustained 24+ hour visibility',
              'Organic trader attraction'
            ]
          },
        ],
      },
      trending: {
        label: 'Trending Placement Service',
        description: 'Secure premium positioning in Four.Meme\'s trending section — where BSC\'s most active traders discover emerging opportunities with momentum.',
        longDesc: 'Four.Meme\'s trending page is the primary discovery mechanism for meme coins on BNB Chain. Thousands of experienced BSC traders check trending hourly. When your token appears there, it sends a powerful signal: "The market recognizes this opportunity. Professional traders are watching." Our Trending service uses algorithm-optimized activity to trigger Four.Meme\'s trending filters, guaranteeing premium placement that converts to real buying activity.',
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
          },
        ],
      },
      volume: {
        label: 'Trading Volume Generation',
        description: 'Create authentic trading volume on Four.Meme using distributed BNB wallets with natural trading patterns. Volume attracts traders and improves algorithm visibility.',
        longDesc: 'A token with volume appears healthy and liquid. Our Volume Generation service deploys randomized BNB wallet activity to create convincing market action. We vary trade sizes, randomize timing, and mix buy/sell sequences to mimic organic trading while bypassing bot detection. The result: your token climbs volume rankings, attracts volume-hunting traders, and builds confidence among potential investors.',
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
          },
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
    platformDescription: 'Flap.sh is BSC\'s growing premium token platform, combining Pump.fun\'s community energy with advanced analytics. Early presence builds credibility and attracts both retail and sophisticated BSC investors.',
    services: {
      boost: {
        label: 'Growth Acceleration Package',
        description: 'Accelerate your Flap.sh token with coordinated holder acquisition and trading volume. Real BNB wallet activity creates the social proof for organic investor attraction.',
        longDesc: 'Flap.sh\'s algorithm rewards tokens showing simultaneous holder growth and trading momentum. Our Growth Acceleration service pairs real wallet holder acquisition with strategic trading volume, creating the appearance of organic community expansion. This dual approach signals healthy project momentum and naturally attracts real traders interested in early, growing communities.',
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
          },
        ],
      },
      trending: {
        label: 'Trending Breakthrough',
        description: 'Place your token in Flap.sh\'s trending section for maximum platform discovery and trader attention.',
        longDesc: 'Flap.sh trending placement means visibility to the platform\'s most engaged traders. Our Trending Breakthrough service uses sophisticated algorithm triggers to secure premium positioning that converts to real market activity and organic investor interest.',
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
          },
        ],
      },
      volume: {
        label: 'Volume Optimization',
        description: 'Strategically generate trading volume on Flap.sh using distributed BNB wallets with authentic trading behavior.',
        longDesc: 'Volume is credibility on Flap.sh. Our Volume Optimization service deploys smart BNB wallet networks with randomized trading patterns to create convincing market activity that builds investor confidence.',
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
          },
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
    console.error('Token fetch error:', e.message);
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
  one_time_keyboard: false,
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
  rows.push([{ text: '← Back to Main' }]);
  return { keyboard: rows, resize_keyboard: true };
}

function tierKB(tiers, isPriceInUSD = false) {
  const rows = tiers.map(t => {
    const price = isPriceInUSD ? `$${t.priceUSD}` : `${t.priceAmount}`;
    return [{ text: `${t.label} — ${price}` }];
  });
  rows.push([{ text: '← Back' }]);
  return { keyboard: rows, resize_keyboard: true };
}

function chainKB() {
  const rows = [];
  for (let i = 0; i < DEXSCREENER_CHAINS.length; i += 2) {
    const row = [{ text: DEXSCREENER_CHAINS[i] }];
    if (DEXSCREENER_CHAINS[i + 1]) row.push({ text: DEXSCREENER_CHAINS[i + 1] });
    rows.push(row);
  }
  rows.push([{ text: '← Back to Main' }]);
  return { keyboard: rows, resize_keyboard: true };
}

function payChainKB(chains) {
  const rows = chains.map(c => [{ text: CRYPTO_INFO[c].label }]);
  rows.push([{ text: '← Back' }]);
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
  const msg = `📊 NEW ORDER RECEIVED\n\n` +
    `Platform: ${data.platform}\n` +
    `Service: ${data.service}\n` +
    `Tier: ${data.tier}\n` +
    `Token: ${data.tokenName} ($${data.tokenSymbol})\n` +
    `CA: ${data.ca}\n` +
    `Amount: ${data.amount}\n` +
    `User: @${data.username || 'unknown'} (ID: ${data.userId})`;
  try {
    await bot.sendMessage(ADMIN_ID, msg);
  } catch (e) {
    console.error('Admin notify error:', e.message);
  }
}

bot.on('message', async (msg) => {
  if (!msg.text) return;
  
  const chatId = msg.chat.id;
  const text = msg.text.trim();
  const session = getSession(chatId);

  try {
    if (text === '/start') {
      clearSession(chatId);
      await bot.sendMessage(chatId,
        `🚀 WELCOME TO DEX BOOSTING BOT\n\n` +
        `Your Professional Token Growth Partner\n\n` +
        `We deliver premium token boosting services across the leading blockchain platforms:\n\n` +
        `📊 DexScreener — Token profile updates, trending placement, and trading volume\n` +
        `🔥 Pump.fun — Solana token growth and graduation acceleration\n` +
        `🐸 Four.Meme — BSC community building and chart domination\n` +
        `⚡ Flap.sh — BSC token growth and trending placement\n\n` +
        `💡 How It Works:\n` +
        `1. Select your platform\n` +
        `2. Choose your service and tier\n` +
        `3. Provide your token contract address\n` +
        `4. Send payment in your preferred crypto\n` +
        `5. Watch your token take off 🚀\n\n` +
        `Select a platform to begin:`,
        { reply_markup: MAIN_KB }
      );
      return;
    }

    if (text === 'About') {
      await bot.sendMessage(chatId,
        `ℹ️ ABOUT DEX BOOSTING BOT\n\n` +
        `Professional token growth services for serious projects.\n\n` +
        `🔐 SECURITY FIRST\n` +
        `• No private keys required\n` +
        `• On-chain payment verification\n` +
        `• Transparent transaction tracking\n\n` +
        `⚡ FAST DELIVERY\n` +
        `• Orders begin within 15-30 minutes\n` +
        `• Real distributed wallet networks\n` +
        `• Anti-bot algorithm optimization\n\n` +
        `💰 TRANSPARENT PRICING\n` +
        `• DexScreener: Prices in USD\n` +
        `• Others: Native platform currency\n` +
        `• No hidden fees\n\n` +
        `📞 24/7 SUPPORT\n` +
        `Contact: @Dave_211\n\n` +
        `Version 2.0 — Multi-Platform Edition`,
        { reply_markup: MAIN_KB }
      );
      return;
    }

    if (text === 'Support') {
      await bot.sendMessage(chatId,
        `🛟 SUPPORT\n\n` +
        `Our team is available 24/7 for assistance.\n\n` +
        `📧 Primary Contact: @Dave_211\n` +
        `⏱ Average Response Time: 15 minutes\n\n` +
        `When contacting support, please include:\n` +
        `• Your order details\n` +
        `• Transaction hash (if payment-related)\n` +
        `• Token contract address\n` +
        `• Specific issue description\n\n` +
        `We value your business and commit to resolving issues quickly.`,
        { reply_markup: MAIN_KB }
      );
      return;
    }

    if (text === '← Back to Main') {
      clearSession(chatId);
      await bot.sendMessage(chatId, '← Returning to main menu...', { reply_markup: MAIN_KB });
      return;
    }

    if (PLATFORM_MAP[text]) {
      session.platform = PLATFORM_MAP[text];
      session.step = 'service';
      const pv = SERVICES[session.platform];
      await bot.sendMessage(chatId,
        `${pv.emoji} ${pv.fullName}\n\n` +
        `${pv.platformDescription}\n\n` +
        `Select a service to view detailed offerings:`,
        { reply_markup: serviceKB(session.platform) }
      );
      return;
    }

    if (session.step === 'service') {
      const found = findServiceByLabel(text);
      if (found) {
        session.platform = found.platformKey;
        session.service = found.serviceKey;
        const sv = SERVICES[found.platformKey].services[found.serviceKey];
        const isPriceInUSD = SERVICES[found.platformKey].usdPriced;

        let detailMsg = `${sv.label}\n\n${sv.description}\n\n${sv.longDesc}\n\n` +
          `💰 SELECT YOUR TIER:\n\n`;

        sv.tiers.forEach((t, i) => {
          const price = isPriceInUSD ? `$${t.priceUSD}` : `${t.priceAmount} ${SERVICES[found.platformKey].nativeCurrency}`;
          detailMsg += `${i + 1}. ${t.label}\n`;
          detailMsg += `   Price: ${price}\n`;
          detailMsg += `   Delivery: ${t.delivery}\n`;
          detailMsg += `   ${t.details}\n`;
          detailMsg += `   Includes: ${t.includes.slice(0, 3).join(' • ')}\n\n`;
        });

        if (sv.requiresChain) {
          session.step = 'chain';
          detailMsg += 'First, select the blockchain where your token is deployed:';
          await bot.sendMessage(chatId, detailMsg, { reply_markup: chainKB() });
        } else {
          session.step = 'tier';
          detailMsg += 'Select your preferred tier above:';
          await bot.sendMessage(chatId, detailMsg, { reply_markup: tierKB(sv.tiers, isPriceInUSD) });
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
        
        let msg = `✅ Blockchain Selected: ${text}\n\n`;
        msg += `SELECT YOUR TIER:\n\n`;
        
        sv.tiers.forEach((t, i) => {
          const price = isPriceInUSD ? `$${t.priceUSD}` : `${t.priceAmount}`;
          msg += `${i + 1}. ${t.label} — ${price}\n`;
          msg += `   ${t.delivery} delivery\n`;
          msg += `   ${t.details}\n\n`;
        });
        
        await bot.sendMessage(chatId, msg, { reply_markup: tierKB(sv.tiers, isPriceInUSD) });
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
          let msg = `✅ Tier Selected: ${tier.label}\n\n`;
          msg += `💳 SELECT PAYMENT METHOD:\n\n`;
          
          platformData.payChains.forEach((c, i) => {
            const info = CRYPTO_INFO[c];
            const cryptoAmount = platformData.usdPriced ? usdToCrypto(tier.priceUSD, c) : tier.priceAmount;
            const displayPrice = platformData.usdPriced ? `$${tier.priceUSD} USD (~${cryptoAmount} ${c})` : `${cryptoAmount} ${c}`;
            msg += `${i + 1}. ${info.label} — ${displayPrice}\n`;
          });
          
          msg += '\nChoose your preferred payment network:';
          await bot.sendMessage(chatId, msg, { reply_markup: payChainKB(platformData.payChains) });
        } else {
          session.payChain = platformData.payChains[0];
          session.step = 'ca';
          await bot.sendMessage(chatId,
            `✅ Tier & Payment Method Selected\n\n` +
            `${tier.label}\n` +
            `Payment: ${CRYPTO_INFO[session.payChain].label}\n\n` +
            `Next: Send your token Contract Address (CA)`,
            { reply_markup: { remove_keyboard: true } }
          );
        }
        return;
      }
    }

    if (session.step === 'paychain') {
      const chainSymbol = findPayChain(text);
      if (chainSymbol) {
        session.payChain = chainSymbol;
        session.step = 'ca';
        const platformData = SERVICES[session.platform];
        const tier = session.tier;
        const cryptoAmount = platformData.usdPriced ? usdToCrypto(tier.priceUSD, chainSymbol) : tier.priceAmount;
        const displayPrice = platformData.usdPriced ? `$${tier.priceUSD} USD (~${cryptoAmount} ${chainSymbol})` : `${cryptoAmount} ${chainSymbol}`;
        
        await bot.sendMessage(chatId,
          `✅ Payment Method Selected\n\n` +
          `Network: ${CRYPTO_INFO[chainSymbol].network}\n` +
          `Amount: ${displayPrice}\n\n` +
          `Now send your token Contract Address (CA):`,
          { reply_markup: { remove_keyboard: true } }
        );
        return;
      }
    }

    if (session.step === 'ca') {
      if (text.length < 26 || text.length > 68) {
        await bot.sendMessage(chatId, '⚠️ Invalid address format. Please send a valid token contract address.');
        return;
      }

      await bot.sendMessage(chatId, '🔍 Verifying token on DexScreener...');
      const tokenInfo = await fetchTokenInfo(text);

      if (tokenInfo) {
        session.tokenInfo = tokenInfo;
        session.step = 'confirm';

        let msg = `✅ TOKEN FOUND\n\n`;
        msg += `Name: ${tokenInfo.name}\n`;
        msg += `Symbol: $${tokenInfo.symbol}\n`;
        msg += `Chain: ${tokenInfo.chain}\n`;
        msg += `Price: $${Number(tokenInfo.price).toFixed(8)}\n`;
        msg += `Market Cap: ${tokenInfo.marketCap}\n`;
        msg += `24h Volume: ${tokenInfo.volume24h}\n`;
        msg += `Liquidity: ${tokenInfo.liquidity}\n\n`;
        msg += `Is this the correct token?`;

        if (tokenInfo.imageUrl) {
          try {
            await bot.sendPhoto(chatId, tokenInfo.imageUrl, { caption: msg });
          } catch (e) {
            await bot.sendMessage(chatId, msg);
          }
        } else {
          await bot.sendMessage(chatId, msg);
        }

        await bot.sendMessage(chatId, 'Confirm or try a different address:', {
          reply_markup: {
            keyboard: [
              [{ text: '✅ Confirm Token' }],
              [{ text: '🔄 Different Address' }],
              [{ text: '← Back' }],
            ],
            resize_keyboard: true,
          },
        });
      } else {
        await bot.sendMessage(chatId,
          `❌ Token not found on DexScreener.\n\n` +
          `Please verify:\n` +
          `• Address is correct\n` +
          `• Token is on a supported chain\n` +
          `• Token has liquidity pairs\n\n` +
          `Try again or contact support.`
        );
      }
      return;
    }

    if (session.step === 'confirm') {
      if (text === '✅ Confirm Token') {
        session.step = 'payment';
        const platformData = SERVICES[session.platform];
        const tier = session.tier;
        const chainInfo = CRYPTO_INFO[session.payChain];
        let displayAmount;

        if (platformData.usdPriced) {
          const crypto = usdToCrypto(tier.priceUSD, session.payChain);
          displayAmount = `$${tier.priceUSD} USD ≈ ${crypto} ${session.payChain}`;
        } else {
          displayAmount = `${tier.priceAmount} ${session.payChain}`;
        }

        let orderMsg = `📋 ORDER SUMMARY\n\n`;
        orderMsg += `Platform: ${platformData.label}\n`;
        orderMsg += `Service: ${SERVICES[session.platform].services[session.service].label}\n`;
        orderMsg += `Tier: ${tier.label}\n`;
        orderMsg += `Token: ${session.tokenInfo.name} ($${session.tokenInfo.symbol})\n\n`;
        orderMsg += `💰 PAYMENT DETAILS\n\n`;
        orderMsg += `Amount: ${displayAmount}\n`;
        orderMsg += `Network: ${chainInfo.network}\n`;
        orderMsg += `Delivery: ${tier.delivery}\n\n`;
        orderMsg += `SEND TO:\n${chainInfo.wallet}\n\n`;
        orderMsg += `⚠️ IMPORTANT:\n` +
          `• Send EXACTLY the amount specified\n` +
          `• Use the correct network (${chainInfo.network})\n` +
          `• Double-check the address\n` +
          `• Save your transaction hash\n\n` +
          `After sending, confirm and provide your TxHash.`;

        await bot.sendMessage(chatId, orderMsg, {
          reply_markup: {
            keyboard: [
              [{ text: '✅ Payment Sent' }],
              [{ text: '❌ Cancel' }],
            ],
            resize_keyboard: true,
          },
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

      if (text === '🔄 Different Address') {
        session.step = 'ca';
        await bot.sendMessage(chatId, 'Send a different token Contract Address:');
        return;
      }

      if (text === '← Back') {
        session.step = 'tier';
        const sv = SERVICES[session.platform].services[session.service];
        const isPriceInUSD = SERVICES[session.platform].usdPriced;
        await bot.sendMessage(chatId, 'Select your tier:', { reply_markup: tierKB(sv.tiers, isPriceInUSD) });
        return;
      }
    }

    if (session.step === 'payment') {
      if (text === '✅ Payment Sent') {
        session.step = 'txhash';
        await bot.sendMessage(chatId, '📨 Provide your transaction hash (TxHash) for verification:');
        return;
      }

      if (text === '❌ Cancel') {
        clearSession(chatId);
        await bot.sendMessage(chatId, '❌ Order cancelled. Type /start to begin again.', { reply_markup: MAIN_KB });
        return;
      }
    }

    if (session.step === 'txhash') {
      const platformData = SERVICES[session.platform];
      const tier = session.tier;
      const sv = SERVICES[session.platform].services[session.service];
      let displayAmount;

      if (platformData.usdPriced) {
        const crypto = usdToCrypto(tier.priceUSD, session.payChain);
        displayAmount = `$${tier.priceUSD} USD (~${crypto} ${session.payChain})`;
      } else {
        displayAmount = `${tier.priceAmount} ${session.payChain}`;
      }

      let confirmMsg = `✅ PAYMENT CONFIRMED\n\n`;
      confirmMsg += `Thank you! Your order has been received.\n\n`;
      confirmMsg += `📋 ORDER DETAILS:\n\n`;
      confirmMsg += `Platform: ${platformData.label}\n`;
      confirmMsg += `Service: ${sv.label}\n`;
      confirmMsg += `Tier: ${tier.label}\n`;
      confirmMsg += `Token: ${session.tokenInfo.name} ($${session.tokenInfo.symbol})\n`;
      confirmMsg += `Amount: ${displayAmount}\n\n`;
      confirmMsg += `🔗 TxHash: ${text}\n\n`;
      confirmMsg += `⏱ Your order will begin within ${tier.delivery}.\n\n`;
      confirmMsg += `If you don't see results within 1 hour, contact Support.\n\n`;
      confirmMsg += `Thank you for using Dex Boosting Bot! 🚀`;

      await bot.sendMessage(chatId, confirmMsg, { reply_markup: MAIN_KB });

      if (ADMIN_ID) {
        const adminMsg = `✅ PAYMENT CONFIRMED\n\n` +
          `Token: ${session.tokenInfo.name}\n` +
          `CA: ${session.tokenInfo.address}\n` +
          `Amount: ${displayAmount}\n` +
          `TxHash: ${text}\n` +
          `Platform: ${platformData.label}\n` +
          `Tier: ${tier.label}`;
        try {
          await bot.sendMessage(ADMIN_ID, adminMsg);
        } catch (e) {
          console.error('Admin confirm error:', e.message);
        }
      }

      clearSession(chatId);
      return;
    }

  } catch (err) {
    console.error('Error:', err.message);
    await bot.sendMessage(chatId, '⚠️ An error occurred. Type /start to try again.', { reply_markup: MAIN_KB }).catch(() => {});
  }
});

bot.on('polling_error', (err) => console.error('Polling:', err.code));
bot.on('error', (err) => console.error('Error:', err.message));

console.log('✅ Dex Boosting Bot Started - Production Ready');
