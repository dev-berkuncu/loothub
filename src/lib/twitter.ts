import { TwitterApi } from 'twitter-api-v2';
import axios from 'axios';
import { Deal } from './types';
import { getAllSettings, markDealAsPostedToTwitter, logTweet } from './db';

// Generate engaging Turkish tweet text
export function formatTweetText(deal: Deal, siteUrl: string): string {
  // If siteUrl is localhost (which Twitter blocks), use direct store URL
  let dealUrl = `${siteUrl.replace(/\/$/, '')}/deal/${deal.slug}`;
  if (dealUrl.includes('localhost') || dealUrl.includes('127.0.0.1')) {
    dealUrl = deal.storeUrl || deal.steamUrl || `https://store.steampowered.com/app/${deal.steamAppId || ''}`;
  }

  const isFree = deal.isFree || deal.salePrice === 0;
  const oldPriceFormatted = `$${deal.normalPrice.toFixed(2)}`;
  const newPriceFormatted = isFree ? 'ÜCRETSİZ!' : `$${deal.salePrice.toFixed(2)}`;

  let ratingBadge = '';
  if ((deal.steamRatingPercent || 0) > 0) {
    ratingBadge = `\n⭐ Topluluk Puanı: %${deal.steamRatingPercent} (${deal.steamRatingText || 'Çok Olumlu'})`;
  }

  let genreTag = '';
  if (deal.genres && deal.genres.length > 0) {
    genreTag = `\n🏷️ Tür: ${deal.genres.slice(0, 3).join(', ')}`;
  }

  const storeName = deal.storeName || 'Steam';
  let hook = `🔥 ${storeName}'de Kaçırılmayacak Fırsat! 🎮`;
  if (isFree) {
    hook = `🎁 ${storeName} Haftalık ÜCRETSİZ Oyunu! Kaçırmayın! 🎮`;
  } else if (deal.savingsPercentage >= 75) {
    hook = `🚨 DEV ${storeName.toUpperCase()} İNDİRİMİ! Kaçırmayın! 🎮`;
  } else if (deal.isHistoricalLow) {
    hook = `⚡ Tarihi Dip Fiyat! ${storeName} İndirimi 🎮`;
  }

  const uniqueTag = `Deal_${deal.steamAppId || deal.id.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6)}_${Date.now().toString().slice(-4)}`;

  const discountLine = isFree
    ? `🎁 %100 Ücretsiz: ${oldPriceFormatted} ➔ 0 TL / ÜCRETSİZ`
    : `📉 %${Math.round(deal.savingsPercentage)} İndirim: ${oldPriceFormatted} ➔ ${newPriceFormatted}`;

  const tweet = `${hook}

🎮 ${deal.title}
${discountLine}${ratingBadge}${genreTag}

👇 Oyun incelemesi ve fırsat detayları:
🔗 ${dealUrl}

#Sociaera #GamingDeals #${storeName.replace(/\s+/g, '')} #${uniqueTag}`;

  return tweet;
}

// Download image as Buffer for Twitter media upload
async function fetchImageBuffer(url: string): Promise<Buffer | null> {
  try {
    const res = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 8000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    });
    return Buffer.from(res.data);
  } catch (error: any) {
    console.warn(`Failed to download image for tweet: ${url}`, error.message);
    return null;
  }
}

export async function postDealToTwitter(deal: Deal, customText?: string): Promise<{
  success: boolean;
  status: 'SUCCESS' | 'DRY_RUN' | 'FAILED';
  tweetId?: string;
  tweetText: string;
  errorMessage?: string;
}> {
  const settings = getAllSettings();
  const siteUrl = settings.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const tweetText = customText || formatTweetText(deal, siteUrl);

  const hasCredentials = Boolean(
    settings.twitterApiKey &&
    settings.twitterApiSecret &&
    settings.twitterAccessToken &&
    settings.twitterAccessTokenSecret
  );

  // If no credentials configured, perform DRY_RUN simulation
  if (!hasCredentials) {
    const simulatedTweetId = `sim_${Date.now()}`;
    console.log('--- [TWITTER DRY RUN / SIMULATION MODE] ---');
    console.log(tweetText);
    console.log(`Attached Image: ${deal.headerImage}`);
    console.log('------------------------------------------');

    markDealAsPostedToTwitter(deal.id, simulatedTweetId);
    logTweet({
      dealId: deal.id,
      dealTitle: deal.title,
      tweetId: simulatedTweetId,
      tweetText,
      imageUrl: deal.headerImage,
      status: 'DRY_RUN',
      errorMessage: 'Twitter API anahtarları girilmediği için simülasyon olarak kaydedildi.',
    });

    return {
      success: true,
      status: 'DRY_RUN',
      tweetId: simulatedTweetId,
      tweetText,
    };
  }

  // Live Twitter Posting with TwitterApi v2
  try {
    const client = new TwitterApi({
      appKey: settings.twitterApiKey!,
      appSecret: settings.twitterApiSecret!,
      accessToken: settings.twitterAccessToken!,
      accessSecret: settings.twitterAccessTokenSecret!,
    });

    // Send tweet with v2 API
    const { data: createdTweet } = await client.v2.tweet(tweetText);

    markDealAsPostedToTwitter(deal.id, createdTweet.id);
    logTweet({
      dealId: deal.id,
      dealTitle: deal.title,
      tweetId: createdTweet.id,
      tweetText,
      imageUrl: deal.headerImage,
      status: 'SUCCESS',
    });

    return {
      success: true,
      status: 'SUCCESS',
      tweetId: createdTweet.id,
      tweetText,
    };
  } catch (error: any) {
    console.error('Twitter API Post Error:', error);
    const errorMsg = error?.data?.detail || error?.message || 'Bilinmeyen Twitter API hatası';

    logTweet({
      dealId: deal.id,
      dealTitle: deal.title,
      tweetId: '',
      tweetText,
      imageUrl: deal.headerImage,
      status: 'FAILED',
      errorMessage: errorMsg,
    });

    return {
      success: false,
      status: 'FAILED',
      tweetText,
      errorMessage: errorMsg,
    };
  }
}
