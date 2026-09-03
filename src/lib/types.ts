export interface Deal {
  id: string; // CheapShark dealID or unique ID
  steamAppId?: string;
  store: 'steam' | 'epic' | 'gog' | 'humble';
  storeName: string; // e.g. "Steam", "Epic Games", "GOG", "Humble Store"
  storeUrl: string;
  title: string;
  slug: string;
  normalPrice: number;
  salePrice: number;
  savingsPercentage: number;
  currency: string; // usually USD or EUR
  headerImage: string;
  capsuleImage?: string;
  screenshots: string[]; // JSON array of URLs
  genres: string[]; // JSON array of genre strings
  steamRatingText?: string; // e.g. "Very Positive", "Overwhelmingly Positive"
  steamRatingPercent?: number; // e.g. 88
  steamRatingCount?: number;
  metacriticScore?: number;
  releaseDate?: string;
  publisher?: string;
  developer?: string;
  shortDescription?: string;
  detailedDescription?: string;
  summaryHighlights?: string[]; // JSON array of bullet points
  pros?: string[]; // Why buy?
  cons?: string[]; // Potential downsides
  minimumRequirements?: string;
  recommendedRequirements?: string;
  steamUrl?: string;
  affiliateUrl?: string;
  isHistoricalLow: boolean;
  isFree?: boolean;
  postedToTwitter: boolean;
  twitterPostId?: string;
  twitterPostedAt?: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TweetLog {
  id: number;
  dealId: string;
  dealTitle: string;
  tweetId: string;
  tweetText: string;
  imageUrl?: string;
  status: "SUCCESS" | "FAILED" | "DRY_RUN";
  errorMessage?: string;
  createdAt: string;
}

export interface SystemSettings {
  autoTweetEnabled: boolean;
  minDiscountPercentage: number;
  minSteamRatingPercentage: number;
  postIntervalMinutes: number;
  siteName: string;
  siteUrl: string;
  twitterApiKey?: string;
  twitterApiSecret?: string;
  twitterAccessToken?: string;
  twitterAccessTokenSecret?: string;
  googleAdsenseId?: string;
}

export interface CheapSharkDealItem {
  internalName: string;
  title: string;
  metacriticLink?: string;
  dealID: string;
  storeID: string;
  gameID: string;
  salePrice: string;
  normalPrice: string;
  isOnSale: string;
  savings: string;
  metacriticScore: string;
  steamRatingText: string;
  steamRatingPercent: string;
  steamRatingCount: string;
  steamAppID: string;
  releaseDate: number;
  lastChange: number;
  dealRating: string;
  thumb: string;
}
