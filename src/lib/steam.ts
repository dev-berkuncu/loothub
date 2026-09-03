import axios from 'axios';
import slugify from 'slugify';
import { Deal, CheapSharkDealItem } from './types';
import { saveDeal, getDealById, getAllDeals, saveDealsBatch } from './db';

// Clean HTML tags from Steam description
function cleanHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/<br\s*[\/]?>/gi, '\n')
    .replace(/<\/?[^>]+(>|$)/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

// Translate English text to Turkish using MyMemory free API
async function translateToTurkish(text: string): Promise<string> {
  if (!text) return '';
  // Check if text is already Turkish (contains common Turkish characters or patterns)
  const isLikelyTurkish = /[ığüşöçİĞÜŞÖÇ]/.test(text) && /\b(bir|ve|ile|oyun|için|bu|olarak)\b/i.test(text);
  if (isLikelyTurkish) return text;

  try {
    const cleanText = text.replace(/[\n\r]+/g, ' ').slice(0, 450);
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(cleanText)}&langpair=en|tr`;
    const res = await axios.get(url, {
      timeout: 5000,
      headers: {
        'User-Agent': 'SteamDealsBot/1.0 (contact@steamdealsbot.com)',
      },
    });

    const match = res.data?.responseData?.translatedText;
    if (match && !match.includes('MYMEMORY WARNING') && match.length > 10) {
      return match;
    }
  } catch {
    // ignore
  }
  return text;
}

// Generate rich Turkish game overview if translation fails or for enrichment
function buildTurkishGameDescription(
  title: string,
  shortDesc: string,
  genres: string[],
  steamRatingPercent: number,
  steamRatingText: string,
  savings: number,
  salePrice: number,
  publisher?: string
): string {
  const genreStr = genres && genres.length > 0 ? genres.slice(0, 3).join(', ') : 'video oyunu';
  const ratingTextTr = steamRatingPercent >= 80 ? 'Çok Olumlu' : steamRatingPercent >= 60 ? 'Olumlu' : 'Karışık';

  let intro = `${title}, Steam mağazasında ${genreStr} kategorisinde yer alan popüler bir yapımdır. `;
  
  if (shortDesc && shortDesc.length > 15) {
    intro += `\n\n${shortDesc}\n\n`;
  }

  intro += `🎮 Oyuncu Değerlendirmesi: Steam topluluğu tarafından %${steamRatingPercent} oranında "${ratingTextTr}" olarak puanlanmıştır. `;
  if (publisher) {
    intro += `Yayıncılığı ${publisher} tarafından üstlenilen oyun, `;
  } else {
    intro += `Oyun, `;
  }
  intro += `şu anda %${Math.round(savings)} indirim fırsatıyla $${salePrice.toFixed(2)} fiyat etiketiyle oyunculara sunulmaktadır.`;

  return intro;
}

// Generate helpful Turkish review summary and pros/cons based on tags & rating
function generateGameHighlights(title: string, genres: string[], steamRatingPercent: number, savings: number) {
  const highlights: string[] = [];
  const pros: string[] = [];
  const cons: string[] = [];

  if (savings >= 75) {
    highlights.push(`🔥 %${Math.round(savings)} oranında devasa indirim fırsatı.`);
    pros.push('Tarihi dip fiyata çok yakın bütçe dostu fiyat');
  } else if (savings >= 50) {
    highlights.push(`🏷️ %${Math.round(savings)} oranında cazip fiyat indirimi.`);
    pros.push('Fiyat/Performans oranı oldukça yüksek');
  }

  if (steamRatingPercent >= 85) {
    highlights.push(`⭐ Steam topluluğundan %${steamRatingPercent} oranında "Çok Olumlu" puan.`);
    pros.push('Kullanıcı yorumları ve oyuncu memnuniyeti üst seviyede');
  } else if (steamRatingPercent >= 70) {
    highlights.push(`👍 Oyuncuların %${steamRatingPercent}'i tarafından tavsiye ediliyor.`);
    pros.push('Kendi türünde kaliteli ve keyifli bir deneyim sunuyor');
  }

  if (genres.length > 0) {
    highlights.push(`🎮 Türler: ${genres.slice(0, 4).join(', ')}.`);
  }

  // Genre-specific insights
  if (genres.some((g) => /rpg|rol yapma/i.test(g))) {
    pros.push('Derin hikaye örgüsü ve karakter gelişimi');
    cons.push('Öğrenme eğrisi ve oynanış süresi uzun olabilir');
  }
  if (genres.some((g) => /action|aksiyon/i.test(g))) {
    pros.push('Hızlı ve dinamik oynanış mekanikleri');
  }
  if (genres.some((g) => /strategy|strateji/i.test(g))) {
    pros.push('Taktiksel derinlik ve yüksek tekrar oynanabilirlik');
    cons.push('Detaylı yönetim ve sabır gerektirebilir');
  }
  if (genres.some((g) => /multiplayer|çok oyunculu/i.test(g))) {
    pros.push('Arkadaşlarla veya çevrim içi oyuncularla eşsiz eğlence');
    cons.push('Aktif oyuncu sayısı dönemsel olarak değişebilir');
  }

  if (cons.length === 0) {
    cons.push('Sistem gereksinimlerini kontrol etmeniz tavsiye edilir');
  }

  return { highlights, pros, cons };
}

// Fetch Steam Storefront details for screenshots, description, requirements, regional pricing
async function fetchSteamAppDetails(steamAppId: string) {
  try {
    const url = `https://store.steampowered.com/api/appdetails?appids=${steamAppId}&cc=tr&l=turkish`;
    const res = await axios.get(url, {
      timeout: 8000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    const data = res.data?.[steamAppId];
    if (data?.success && data.data) {
      return data.data;
    }
  } catch (error: any) {
    try {
      const fallbackUrl = `https://store.steampowered.com/api/appdetails?appids=${steamAppId}&cc=tr`;
      const resFallback = await axios.get(fallbackUrl, { timeout: 6000 });
      const dataFallback = resFallback.data?.[steamAppId];
      if (dataFallback?.success && dataFallback.data) {
        return dataFallback.data;
      }
    } catch {
      // ignore
    }
  }
  return null;
}

export async function syncSteamDeals(limit = 40): Promise<{ added: number; updated: number; total: number }> {
  try {
    // 1. CheapShark API for Top Steam Deals (Store ID 1 = Steam)
    const cheapSharkUrl = `https://www.cheapshark.com/api/1.0/deals?storeID=1&sortBy=Deal%20Rating&pageSize=${limit}&desc=0`;
    const response = await axios.get<CheapSharkDealItem[]>(cheapSharkUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'SteamDealsBot/1.0 (contact@steamdealsbot.com)',
        'Accept': 'application/json',
      },
    });
    const deals = response.data;

    let addedCount = 0;
    let updatedCount = 0;

    for (const item of deals) {
      if (!item.steamAppID) continue;

      const steamRatingPercent = parseInt(item.steamRatingPercent, 10) || 0;
      const steamRatingCount = parseInt(item.steamRatingCount, 10) || 0;
      const metacriticScore = parseInt(item.metacriticScore, 10) || undefined;

      // Unique slug
      let cleanTitle = item.title.trim();
      let baseSlug = slugify(cleanTitle, { lower: true, strict: true, locale: 'tr' });
      if (!baseSlug) {
        baseSlug = `deal-${item.steamAppID}`;
      }
      const slug = `${baseSlug}-${item.steamAppID}`;

      // Check existing deal
      const existingDeal = getDealById(item.dealID);

      // Default to CheapShark prices, then override with exact Steam TR price if available
      let normalPrice = parseFloat(item.normalPrice);
      let salePrice = parseFloat(item.salePrice);
      let savingsPercentage = Math.round(parseFloat(item.savings));

      // Fetch Steam rich details
      let headerImage = `https://cdn.akamai.steamstatic.com/steam/apps/${item.steamAppID}/header.jpg`;
      let capsuleImage = item.thumb || `https://cdn.akamai.steamstatic.com/steam/apps/${item.steamAppID}/capsule_616x353.jpg`;
      let screenshots: string[] = [];
      let genres: string[] = [];
      let releaseDate = item.releaseDate ? new Date(item.releaseDate * 1000).toLocaleDateString('tr-TR') : undefined;
      let publisher = '';
      let developer = '';
      let rawShortDesc = '';
      let rawDetailedDesc = '';
      let minimumRequirements = '';
      let recommendedRequirements = '';

      const steamDetails = await fetchSteamAppDetails(item.steamAppID);
      if (steamDetails) {
        // Use exact Steam TR (MENA-USD) price if available
        if (steamDetails.price_overview) {
          normalPrice = steamDetails.price_overview.initial / 100;
          salePrice = steamDetails.price_overview.final / 100;
          savingsPercentage = steamDetails.price_overview.discount_percent || savingsPercentage;
        }

        if (steamDetails.header_image) headerImage = steamDetails.header_image;
        if (steamDetails.capsule_image) capsuleImage = steamDetails.capsule_image;

        if (Array.isArray(steamDetails.screenshots)) {
          screenshots = steamDetails.screenshots.map((s: any) => s.path_full || s.path_thumbnail).filter(Boolean);
        }

        if (Array.isArray(steamDetails.genres)) {
          genres = steamDetails.genres.map((g: any) => g.description).filter(Boolean);
        }

        if (steamDetails.publishers && steamDetails.publishers.length > 0) {
          publisher = steamDetails.publishers.join(', ');
        }

        if (steamDetails.developers && steamDetails.developers.length > 0) {
          developer = steamDetails.developers.join(', ');
        }

        rawShortDesc = cleanHtml(steamDetails.short_description || '');
        rawDetailedDesc = cleanHtml(steamDetails.detailed_description || steamDetails.about_the_game || '');

        if (steamDetails.pc_requirements) {
          minimumRequirements = cleanHtml(steamDetails.pc_requirements.minimum || '');
          recommendedRequirements = cleanHtml(steamDetails.pc_requirements.recommended || '');
        }

        if (steamDetails.release_date?.date) {
          releaseDate = steamDetails.release_date.date;
        }
      }

      if (screenshots.length === 0) {
        screenshots = [
          `https://cdn.akamai.steamstatic.com/steam/apps/${item.steamAppID}/ss_1.jpg`,
          `https://cdn.akamai.steamstatic.com/steam/apps/${item.steamAppID}/ss_2.jpg`,
        ];
      }

      // Translate short description to Turkish if needed
      let turkishShortDesc = await translateToTurkish(rawShortDesc);
      const fullTurkishDescription = buildTurkishGameDescription(
        cleanTitle,
        turkishShortDesc,
        genres,
        steamRatingPercent,
        item.steamRatingText || 'Olumlu',
        savingsPercentage,
        salePrice,
        publisher
      );

      const { highlights, pros, cons } = generateGameHighlights(cleanTitle, genres, steamRatingPercent, savingsPercentage);

      const now = new Date().toISOString();
      const dealRecord: Deal = {
        id: item.dealID,
        steamAppId: item.steamAppID,
        title: cleanTitle,
        slug: existingDeal ? existingDeal.slug : slug,
        normalPrice,
        salePrice,
        savingsPercentage,
        currency: 'USD',
        headerImage,
        capsuleImage,
        screenshots,
        genres,
        steamRatingText: item.steamRatingText || 'Olumlu',
        steamRatingPercent,
        steamRatingCount,
        metacriticScore,
        releaseDate,
        publisher,
        developer,
        shortDescription: fullTurkishDescription,
        detailedDescription: rawDetailedDesc,
        summaryHighlights: highlights,
        pros,
        cons,
        minimumRequirements,
        recommendedRequirements,
        steamUrl: `https://store.steampowered.com/app/${item.steamAppID}`,
        affiliateUrl: `https://store.steampowered.com/app/${item.steamAppID}?utm_source=steamdealsbot`,
        isHistoricalLow: savingsPercentage >= 75,
        postedToTwitter: existingDeal ? existingDeal.postedToTwitter : false,
        twitterPostId: existingDeal?.twitterPostId,
        twitterPostedAt: existingDeal?.twitterPostedAt,
        featured: savingsPercentage >= 60 && steamRatingPercent >= 80,
        createdAt: existingDeal ? existingDeal.createdAt : now,
        updatedAt: now,
      };

      saveDeal(dealRecord);
      if (existingDeal) {
        updatedCount++;
      } else {
        addedCount++;
      }

      // Small delay between requests
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    return { added: addedCount, updated: updatedCount, total: deals.length };
  } catch (error: any) {
    console.error('Error syncing Steam deals:', error.message);
    throw error;
  }
}
