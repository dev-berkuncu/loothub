import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';

dotenv.config();

async function testPublicUrlTweet() {
  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY!,
    appSecret: process.env.TWITTER_API_SECRET!,
    accessToken: process.env.TWITTER_ACCESS_TOKEN!,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET!,
  });

  const randomCode = Math.random().toString(36).substring(7);
  const tweetText = `🚨 DEV STEAM İNDİRİMİ! 🎮

🎮 The Witcher 3: Wild Hunt
📉 %75 İndirim: $49.99 ➔ $12.49
⭐ Steam Puanı: %95 (Çok Olumlu)
🏷️ Tür: RPG, Açık Dünya

👇 Oyun detayları ve inceleme rehberi:
🔗 https://store.steampowered.com/app/292030

#Steam #Steamİndirim #OyunFırsatı #${randomCode}`;

  try {
    console.log('Sending real game deal tweet...');
    const res = await client.v2.tweet(tweetText);
    console.log('\n🎉🎉🎉 MÜKEMMEL! OYUN İNDİRİM TWEETİ BAŞARIYLA ATILDI! 🚀🚀🚀');
    console.log('Tweet ID:', res.data.id);
    console.log('Tweet Linki:', `https://x.com/i/status/${res.data.id}`);
  } catch (err: any) {
    console.error('Error:', err?.data || err?.message || err);
  }
}

testPublicUrlTweet();
