import axios from 'axios';

async function translateToTurkish(text: string): Promise<string> {
  if (!text) return '';
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=tr&dt=t&q=${encodeURIComponent(text)}`;
    const res = await axios.get(url, {
      timeout: 5000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    });

    if (Array.isArray(res.data?.[0])) {
      const translated = res.data[0].map((item: any) => item[0]).join('');
      return translated || text;
    }
  } catch (err: any) {
    console.warn('Translation fallback error:', err.message);
  }
  return text;
}

async function test() {
  const englishSample = "Hitman 2: Silent Assassin is a stealth action video game developed by IO Interactive. Players take the role of an assassin named Agent 47 as he executes contract kills.";
  const turkish = await translateToTurkish(englishSample);
  console.log('Original:\n', englishSample);
  console.log('\nTranslated to Turkish:\n', turkish);
}

test();
