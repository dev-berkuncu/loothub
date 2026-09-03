import { TwitterApi } from 'twitter-api-v2';

const consumerKey = '3siTQTLu95sytNtVAGXItVGJq';
const consumerSecret = 'qnfapWKcavLMOxgvuGWwyDKiVhiPh9ldGR4dQjIEBEisYncfZ1';
const oauth2AccessToken = 'UzhBTGNIbUs5WWJDdi1iNWhpU3dHem9fTTdDUUQwU3dKOUpvdmw1dHRLZFBLOjE3ODgzODUxMDYwODU6MToxOmF0OjE';
const oauth2RefreshToken = 'RUszUGkxSXFsek52ZFVuR0xxWC1iRUdHOFVJcTZWYmpKZmZUbU9ZVEt1RGt6OjE3ODgzODUxMDYwODU6MTowOnJ0OjE';

async function testAll() {
  console.log('--- TEST 1: OAuth 2.0 Direct Access Token ---');
  try {
    const client = new TwitterApi(oauth2AccessToken);
    const res = await client.v2.tweet(`🎮 Steam İndirim & Fırsat Botu resmi olarak yayında! 🚀 (${Date.now()}) #Steam #Gamer`);
    console.log('🎉🎉🎉 SUCCESS WITH OAUTH 2.0!', res);
    return;
  } catch (err: any) {
    console.log('OAuth 2.0 error:', err.code, err.data?.detail || err.message);
  }

  console.log('\n--- TEST 2: App Login with Consumer Key & Secret ---');
  try {
    const client = new TwitterApi({
      appKey: consumerKey,
      appSecret: consumerSecret,
    });
    const appOnly = await client.appLogin();
    console.log('✅ Consumer Key & Secret are 100% VALID and verified by Twitter!');
  } catch (err: any) {
    console.log('Consumer key test error:', err.code, err.data?.errors || err.message);
  }
}

testAll();
