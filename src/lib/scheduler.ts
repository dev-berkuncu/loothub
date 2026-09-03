import { syncSteamDeals } from './steam';
import { getDeals, getAllSettings } from './db';
import { postDealToTwitter } from './twitter';

export async function runAutomationCycle(): Promise<{
  syncResult: { added: number; updated: number; total: number };
  tweetResult?: { posted: boolean; dealTitle?: string; status?: string; tweetId?: string; error?: string };
}> {
  console.log('[Scheduler] Starting automated cycle...');
  
  // 1. Sync deals
  const syncResult = await syncSteamDeals(50);
  console.log(`[Scheduler] Deals synced. Added: ${syncResult.added}, Updated: ${syncResult.updated}`);

  const settings = getAllSettings();
  let tweetResult: any = { posted: false };

  // 2. Check if Auto Tweet is enabled
  if (settings.autoTweetEnabled) {
    const unposted = getDeals({
      unpostedOnly: true,
      minSavings: settings.minDiscountPercentage || 30,
      minRating: settings.minSteamRatingPercentage || 50,
      sortBy: 'savings',
      limit: 1,
    });

    if (unposted.deals.length > 0) {
      const topDeal = unposted.deals[0];
      console.log(`[Scheduler] Posting top unposted deal: ${topDeal.title} (%${topDeal.savingsPercentage} off)`);
      const postRes = await postDealToTwitter(topDeal);
      tweetResult = {
        posted: postRes.success,
        dealTitle: topDeal.title,
        status: postRes.status,
        tweetId: postRes.tweetId,
        error: postRes.errorMessage,
      };
    } else {
      console.log('[Scheduler] No eligible unposted deals found matching filter criteria.');
      tweetResult = {
        posted: false,
        status: 'SKIPPED',
        error: 'Kriterlere uyan paylaşılmamış yeni indirim bulunamadı.',
      };
    }
  }

  return { syncResult, tweetResult };
}
