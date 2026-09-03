import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';
import { getDeals } from './lib/db';
import { formatTweetText } from './lib/twitter';

dotenv.config();

async function testAllGames() {
  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY!,
    appSecret: process.env.TWITTER_API_SECRET!,
    accessToken: process.env.TWITTER_ACCESS_TOKEN!,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET!,
  });

  const { deals } = getDeals({ limit: 5 });

  for (const deal of deals) {
    const text = formatTweetText(deal, 'https://store.steampowered.com');
    console.log(`\nPosting deal for: ${deal.title}...`);
    try {
      const res = await client.v2.tweet(text);
      console.log(`🎉 SUCCESS! Posted ${deal.title}! Tweet ID:`, res.data.id);
      console.log(`🔗 https://x.com/i/status/${res.data.id}`);
      break;
    } catch (err: any) {
      console.log(`❌ Failed for ${deal.title}:`, err?.data?.detail || err.message);
    }
  }
}

testAllGames();
