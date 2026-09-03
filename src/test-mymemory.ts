import axios from 'axios';

async function translateMyMemory(text: string): Promise<string> {
  if (!text) return '';
  try {
    const clean = text.slice(0, 450); // MyMemory limit
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(clean)}&langpair=en|tr`;
    const res = await axios.get(url, { timeout: 4000 });
    const match = res.data?.responseData?.translatedText;
    if (match && !match.includes('MYMEMORY WARNING')) {
      return match;
    }
  } catch (err: any) {
    console.warn('MyMemory err:', err.message);
  }
  return '';
}

async function test() {
  const sample = "Subnautica is an underwater adventure game set on an alien ocean planet. A massive, open world full of wonder and peril awaits you!";
  const res = await translateMyMemory(sample);
  console.log('Result:', res);
}

test();
