import axios from 'axios';

async function checkTokiTori() {
  console.log('--- 1. CheapShark API Check ---');
  const csRes = await axios.get('https://www.cheapshark.com/api/1.0/deals?title=Toki%20Tori%202&storeID=1', {
    headers: { 'User-Agent': 'SteamDealsBot/1.0' }
  });
  console.log('CheapShark Results:', csRes.data);

  console.log('\n--- 2. Steam Store API Check (US vs TR) ---');
  const steamAppId = '201420'; // Toki Tori 2+
  
  // US Store
  const steamUs = await axios.get(`https://store.steampowered.com/api/appdetails?appids=${steamAppId}&cc=us`);
  console.log('Steam US price_overview:', steamUs.data?.[steamAppId]?.data?.price_overview);

  // TR Store (MENA-USD)
  const steamTr = await axios.get(`https://store.steampowered.com/api/appdetails?appids=${steamAppId}&cc=tr`);
  console.log('Steam TR price_overview:', steamTr.data?.[steamAppId]?.data?.price_overview);
}

checkTokiTori();
