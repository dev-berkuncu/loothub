import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';

dotenv.config();

async function testBoth() {
  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY!.trim(),
    appSecret: process.env.TWITTER_API_SECRET!.trim(),
    accessToken: process.env.TWITTER_ACCESS_TOKEN!.trim(),
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET!.trim(),
  });

  const testText = `🎮 Steam Fırsat Botu Testi (${Date.now()}) #Steam`;

  console.log('--- Test 1: Testing v2.tweet ---');
  try {
    const res2 = await client.v2.tweet(testText);
    console.log('✅ v2.tweet SUCCESS:', res2);
    return;
  } catch (err: any) {
    console.log('❌ v2.tweet Failed:', err.code, err.data || err.message);
  }

  console.log('\n--- Test 2: Testing v1.tweet ---');
  try {
    const res1 = await client.v1.tweet(testText);
    console.log('✅ v1.tweet SUCCESS:', res1);
    return;
  } catch (err: any) {
    console.log('❌ v1.tweet Failed:', err.code, err.data || err.message);
  }

  console.log('\n--- Test 3: Testing app-only bearer ---');
  try {
    const appOnly = await client.appLogin();
    console.log('✅ App Login Success! Bearer token acquired.');
  } catch (err: any) {
    console.log('❌ App Login Failed:', err.code, err.data || err.message);
  }
}

testBoth();
