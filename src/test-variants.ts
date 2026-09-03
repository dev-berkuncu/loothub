import { TwitterApi } from 'twitter-api-v2';

const consumerKey = 'M7fb67QhTQBcuk3HZaJehRoH';
const consumerSecret = 'JGwT03yaeo66mjmcPmBdmcepjFi7GrfIWqibPxLJbxyM4YkAxK';
const accessToken = '226111671-baQntCTeqI3MIV3nBqqgshciM54ccZQKwjk5ga1F';
const tokenSecrets = [
  'jAgfGGJslYGRYm2sKkQx8qIL17vhaNDBvCOxmCKpXFqUY',
  'jAgfGGJslYGRYm2sKkQx8qIL17vhaNDBvC0xmCKpXFqUY',
  'jAgfGGJslYGRYm2sKkQx8qIL17vhaNDBvCOxmCKpXFqUy',
  'jAgfGGJslYGRYm2sKkQx8qIL17vhaNDBvC0xmCKpXFqUy',
];

async function tryVariants() {
  for (let i = 0; i < tokenSecrets.length; i++) {
    const sec = tokenSecrets[i];
    console.log(`Testing variation ${i + 1}...`);
    const client = new TwitterApi({
      appKey: consumerKey,
      appSecret: consumerSecret,
      accessToken: accessToken,
      accessSecret: sec,
    });

    try {
      const res = await client.v2.tweet(`🎮 Steam İndirim & Fırsat Botu (${Date.now()}) #Steam`);
      console.log(`🎉 SUCCESS ON VARIATION ${i + 1}!`, res);
      return;
    } catch (err: any) {
      console.log(`Failed var ${i + 1}:`, err.code, err.data?.detail || err.message);
    }
  }
}

tryVariants();
