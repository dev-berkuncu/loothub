import fs from 'fs';
import path from 'path';
import { Deal, TweetLog, SystemSettings } from './types';

const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dealsFile = path.join(dataDir, 'deals.json');
const tweetLogsFile = path.join(dataDir, 'tweet_logs.json');
const settingsFile = path.join(dataDir, 'settings.json');

// Helper to safely read JSON
function readJson<T>(filePath: string, defaultValue: T): T {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2), 'utf-8');
      return defaultValue;
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data) as T;
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return defaultValue;
  }
}

// Helper to safely write JSON atomically
function writeJson<T>(filePath: string, data: T): void {
  try {
    const tempPath = `${filePath}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempPath, filePath);
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
  }
}

// Get all deals from JSON
export function getAllDeals(): Deal[] {
  return readJson<Deal[]>(dealsFile, []);
}

// Save or update a single deal
export function saveDeal(deal: Deal): void {
  const deals = getAllDeals();
  const index = deals.findIndex((d) => d.id === deal.id);
  if (index >= 0) {
    deals[index] = {
      ...deals[index],
      ...deal,
      updatedAt: new Date().toISOString(),
    };
  } else {
    deals.push(deal);
  }
  writeJson(dealsFile, deals);
}

// Save multiple deals efficiently
export function saveDealsBatch(newDeals: Deal[]): void {
  const deals = getAllDeals();
  const dealMap = new Map(deals.map((d) => [d.id, d]));

  for (const deal of newDeals) {
    if (dealMap.has(deal.id)) {
      const existing = dealMap.get(deal.id)!;
      dealMap.set(deal.id, {
        ...existing,
        ...deal,
        postedToTwitter: existing.postedToTwitter || deal.postedToTwitter,
        twitterPostId: existing.twitterPostId || deal.twitterPostId,
        twitterPostedAt: existing.twitterPostedAt || deal.twitterPostedAt,
        updatedAt: new Date().toISOString(),
      });
    } else {
      dealMap.set(deal.id, deal);
    }
  }

  writeJson(dealsFile, Array.from(dealMap.values()));
}

export function getDealBySlug(slug: string): Deal | null {
  const deals = getAllDeals();
  return deals.find((d) => d.slug === slug) || null;
}

export function getDealById(id: string): Deal | null {
  const deals = getAllDeals();
  return deals.find((d) => d.id === id) || null;
}

export function getDealBySteamAppId(steamAppId: string): Deal | null {
  const deals = getAllDeals();
  return deals.find((d) => d.steamAppId === steamAppId) || null;
}

export interface GetDealsFilter {
  search?: string;
  category?: string;
  minSavings?: number;
  maxPrice?: number;
  minRating?: number;
  unpostedOnly?: boolean;
  featuredOnly?: boolean;
  sortBy?: 'savings' | 'price_asc' | 'price_desc' | 'rating' | 'newest';
  limit?: number;
  offset?: number;
}

export function getDeals(filter: GetDealsFilter = {}): { deals: Deal[]; total: number } {
  let deals = getAllDeals();

  if (filter.search) {
    const q = filter.search.toLowerCase();
    deals = deals.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        (d.shortDescription && d.shortDescription.toLowerCase().includes(q))
    );
  }

  if (filter.minSavings) {
    deals = deals.filter((d) => d.savingsPercentage >= filter.minSavings!);
  }

  if (filter.maxPrice !== undefined) {
    deals = deals.filter((d) => d.salePrice <= filter.maxPrice!);
  }

  if (filter.minRating) {
    deals = deals.filter((d) => d.steamRatingPercent >= filter.minRating!);
  }

  if (filter.unpostedOnly) {
    deals = deals.filter((d) => !d.postedToTwitter);
  }

  if (filter.featuredOnly) {
    deals = deals.filter((d) => d.featured);
  }

  if (filter.category && filter.category !== 'all') {
    const cat = filter.category.toLowerCase();
    deals = deals.filter((d) => d.genres && d.genres.some((g) => g.toLowerCase().includes(cat)));
  }

  // Sorting
  deals.sort((a, b) => {
    if (filter.sortBy === 'price_asc') return a.salePrice - b.salePrice;
    if (filter.sortBy === 'price_desc') return b.salePrice - a.salePrice;
    if (filter.sortBy === 'rating') return (b.steamRatingPercent || 0) - (a.steamRatingPercent || 0);
    if (filter.sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    // Default: savings desc
    return b.savingsPercentage - a.savingsPercentage;
  });

  const total = deals.length;
  const limit = filter.limit || 24;
  const offset = filter.offset || 0;
  const paginatedDeals = deals.slice(offset, offset + limit);

  return { deals: paginatedDeals, total };
}

export function markDealAsPostedToTwitter(dealId: string, tweetId: string): void {
  const deals = getAllDeals();
  const deal = deals.find((d) => d.id === dealId);
  if (deal) {
    deal.postedToTwitter = true;
    deal.twitterPostId = tweetId;
    deal.twitterPostedAt = new Date().toISOString();
    deal.updatedAt = new Date().toISOString();
    writeJson(dealsFile, deals);
  }
}

export function logTweet(log: Omit<TweetLog, 'id' | 'createdAt'>): void {
  const logs = readJson<TweetLog[]>(tweetLogsFile, []);
  const newLog: TweetLog = {
    ...log,
    id: logs.length > 0 ? Math.max(...logs.map((l) => l.id)) + 1 : 1,
    createdAt: new Date().toISOString(),
  };
  logs.unshift(newLog);
  // Keep last 200 logs
  writeJson(tweetLogsFile, logs.slice(0, 200));
}

export function getTweetLogs(limit = 50): TweetLog[] {
  const logs = readJson<TweetLog[]>(tweetLogsFile, []);
  return logs.slice(0, limit);
}

export function getSetting<T>(key: string, defaultValue: T): T {
  const settings = readJson<Record<string, any>>(settingsFile, {});
  if (settings[key] !== undefined) {
    return settings[key] as T;
  }
  return defaultValue;
}

export function setSetting(key: string, value: any): void {
  const settings = readJson<Record<string, any>>(settingsFile, {});
  settings[key] = value;
  writeJson(settingsFile, settings);
}

export function getAllSettings(): SystemSettings {
  return {
    autoTweetEnabled: getSetting('autoTweetEnabled', process.env.AUTO_TWEET_ENABLED === 'true'),
    minDiscountPercentage: getSetting('minDiscountPercentage', Number(process.env.MIN_DISCOUNT_PERCENTAGE) || 30),
    minSteamRatingPercentage: getSetting('minSteamRatingPercentage', Number(process.env.MIN_STEAM_RATING_PERCENTAGE) || 60),
    postIntervalMinutes: getSetting('postIntervalMinutes', Number(process.env.POST_INTERVAL_MINUTES) || 60),
    siteName: getSetting('siteName', process.env.SITE_NAME || 'Steam İndirimleri & Fırsatlar'),
    siteUrl: getSetting('siteUrl', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
    twitterApiKey: getSetting('twitterApiKey', process.env.TWITTER_API_KEY || ''),
    twitterApiSecret: getSetting('twitterApiSecret', process.env.TWITTER_API_SECRET || ''),
    twitterAccessToken: getSetting('twitterAccessToken', process.env.TWITTER_ACCESS_TOKEN || ''),
    twitterAccessTokenSecret: getSetting('twitterAccessTokenSecret', process.env.TWITTER_ACCESS_TOKEN_SECRET || ''),
    googleAdsenseId: getSetting('googleAdsenseId', process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID || ''),
  };
}
