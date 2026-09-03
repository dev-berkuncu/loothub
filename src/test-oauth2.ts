import { TwitterApi } from 'twitter-api-v2';

const oauth2AccessToken = 'Q2FUUnRZUWVKSVWejh0eVo1U2p0WVpMOFlTZU9NSG5WeEpfM2JfVHh2M0hkOjE3ODgzODQ5OTMyMTg6MToxOmF0OjE';

async function testOAuth2() {
  console.log('Testing Twitter API with OAuth 2.0 User Access Token...');
  const client = new TwitterApi(oauth2AccessToken);

  try {
    const randomCode = Math.random().toString(36).substring(7);
    const tweetText = `🎮 Steam İndirim & Fırsat Botu resmi olarak aktif edildi! 🔥\n\nEn popüler oyun indirimleri, tarihi dip fiyatlar ve incelemeler için takipte kalın! #${randomCode} #Steam #Steamİndirim #OyunFırsatı`;
    
    console.log('Sending Tweet:', tweetText);
    const res = await client.v2.tweet(tweetText);
    console.log('\n🎉🎉🎉 BAŞARILI! TWEET TWITTER HESABINIZDA PAYLAŞILDI! 🎉🎉🎉');
    console.log('Tweet ID:', res.data.id);
    console.log('Tweet Linki:', `https://twitter.com/user/status/${res.data.id}`);
  } catch (error: any) {
    console.error('❌ OAuth 2.0 Error:', error?.data || error?.message || error);
  }
}

testOAuth2();
