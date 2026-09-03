import dotenv from 'dotenv';
import { syncSteamDeals } from './lib/steam';
import { getDeals, getTweetLogs } from './lib/db';
import { postDealToTwitter } from './lib/twitter';

dotenv.config();

async function runTest() {
  console.log('--- 1. Testing Steam & CheapShark Deal Sync ---');
  const syncResult = await syncSteamDeals(10);
  console.log('Sync Result:', syncResult);

  console.log('\n--- 2. Querying Database ---');
  const { deals, total } = getDeals({ limit: 5 });
  console.log(`Total Deals in DB: ${total}`);
  deals.forEach((d, idx) => {
    console.log(`[${idx + 1}] ${d.title} | %${d.savingsPercentage} OFF | $${d.normalPrice} -> $${d.salePrice} | Rating: %${d.steamRatingPercent}`);
  });

  if (deals.length > 0) {
    console.log('\n--- 3. Testing Twitter Bot (Dry-Run / Simulation) ---');
    const topDeal = deals[0];
    const tweetResult = await postDealToTwitter(topDeal);
    console.log('Tweet Result:', tweetResult);
  }

  console.log('\n--- 4. Checking Tweet Logs ---');
  const logs = getTweetLogs(5);
  console.log('Recent Logs count:', logs.length);
  logs.forEach((log) => {
    console.log(`- [${log.status}] ${log.dealTitle} (ID: ${log.tweetId})`);
  });

  console.log('\n✅ All tests passed successfully!');
}

runTest().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
