import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';

dotenv.config();

async function testTweet() {
  console.log('--- Twitter API Canlı Tweet Testi ---');
  
  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY!,
    appSecret: process.env.TWITTER_API_SECRET!,
    accessToken: process.env.TWITTER_ACCESS_TOKEN!,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET!,
  });

  try {
    const randomCode = Math.random().toString(36).substring(7);
    const tweetText = `🎮 Steam İndirim & Fırsat Botu başarıyla kuruldu! (${new Date().toLocaleTimeString('tr-TR')}) #${randomCode} #Steam #OyunFırsatı`;
    
    console.log('Tweet gönderiliyor:', tweetText);
    const tweet = await client.v2.tweet(tweetPayload(tweetText));
    console.log('\n🎉 TEBRİKLER! TWEET BAŞARIYLA ATILDI! 🚀');
    console.log('Tweet ID:', tweet.data.id);
    console.log('Tweet Metni:', tweet.data.text);
  } catch (error: any) {
    console.error('❌ Hata:', error?.data || error?.message || error);
  }
}

function tweetPayload(text: string) {
  return { text };
}

testTweet();
