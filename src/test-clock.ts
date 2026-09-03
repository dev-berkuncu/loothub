import axios from 'axios';

async function checkClock() {
  try {
    const res = await axios.get('https://api.x.com');
  } catch (err: any) {
    const twitterDateStr = err.response?.headers?.date;
    console.log('Twitter Server Date Header:', twitterDateStr);
    console.log('Local Machine Date:', new Date().toUTCString());
    if (twitterDateStr) {
      const twitterTime = new Date(twitterDateStr).getTime();
      const localTime = Date.now();
      const diffSeconds = Math.round((twitterTime - localTime) / 1000);
      console.log(`Clock Difference: ${diffSeconds} seconds (${(diffSeconds / 86400).toFixed(1)} days)`);
    }
  }
}

checkClock();
