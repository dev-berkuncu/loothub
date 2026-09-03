import axios from 'axios';
import slugify from 'slugify';
import { Deal, CheapSharkDealItem } from './types';
import { saveDeal, getDealById } from './db';

// Store ID Mapping for CheapShark
export const STORE_MAP: Record<
  string,
  {
    store: 'steam' | 'epic' | 'gog' | 'humble';
    storeName: string;
    defaultUrl: (dealID: string, steamAppID?: string) => string;
  }
> = {
  '1': {
    store: 'steam',
    storeName: 'Steam',
    defaultUrl: (dealID, steamAppID) =>
      steamAppID
        ? `https://store.steampowered.com/app/${steamAppID}`
        : `https://www.cheapshark.com/redirect?dealID=${dealID}`,
  },
  '7': {
    store: 'gog',
    storeName: 'GOG',
    defaultUrl: (dealID) => `https://www.cheapshark.com/redirect?dealID=${dealID}`,
  },
  '11': {
    store: 'humble',
    storeName: 'Humble Store',
    defaultUrl: (dealID) => `https://www.cheapshark.com/redirect?dealID=${dealID}`,
  },
  '25': {
    store: 'epic',
    storeName: 'Epic Games',
    defaultUrl: (dealID) => `https://www.cheapshark.com/redirect?dealID=${dealID}`,
  },
};

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
  const isLikelyTurkish = /[ığüşöçİĞÜŞÖÇ]/.test(text) && /\b(bir|ve|ile|oyun|için|bu|olarak)\b/i.test(text);
  if (isLikelyTurkish) return text;

  try {
    const cleanText = text.replace(/[\n\r]+/g, ' ').slice(0, 450);
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(cleanText)}&langpair=en|tr`;
    const res = await axios.get(url, {
      timeout: 5000,
      headers: {
        'User-Agent': 'LootHub/1.0 (contact@sociaera.online)',
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

// Generate rich Turkish game overview
function buildTurkishGameDescription(
  title: string,
  shortDesc: string,
  genres: string[],
  ratingPercent: number,
  ratingText: string,
  savings: number,
  salePrice: number,
  storeName: string,
  publisher?: string
): string {
  const genreStr = genres && genres.length > 0 ? genres.slice(0, 3).join(', ') : 'video oyunu';
  const ratingTextTr = ratingPercent >= 80 ? 'Çok Olumlu' : ratingPercent >= 60 ? 'Olumlu' : 'Karışık';

  let intro = `${title}, ${storeName} mağazasında ${genreStr} kategorisinde yer alan dikkat çekici bir yapımdır. `;

  if (shortDesc && shortDesc.length > 15) {
    intro += `\n\n${shortDesc}\n\n`;
  }

  if (ratingPercent > 0) {
    intro += `🎮 Topluluk Değerlendirmesi: Oyuncular tarafından %${ratingPercent} oranında "${ratingTextTr}" olarak puanlanmıştır. `;
  }

  if (publisher) {
    intro += `Yayıncılığı ${publisher} tarafından üstlenilen oyun, `;
  } else {
    intro += `Oyun, `;
  }

  if (salePrice === 0) {
    intro += `şu anda %100 indirim fırsatıyla tamamen ÜCRETSİZ olarak oyunculara sunulmaktadır.`;
  } else {
    intro += `şu anda %${Math.round(savings)} indirim fırsatıyla $${salePrice.toFixed(2)} fiyat etiketiyle sunulmaktadır.`;
  }

  return intro;
}

// Generate helpful Turkish review summary and pros/cons
function generateGameHighlights(
  title: string,
  genres: string[],
  ratingPercent: number,
  savings: number,
  storeName: string
) {
  const highlights: string[] = [];
  const pros: string[] = [];
  const cons: string[] = [];

  if (savings >= 100) {
    highlights.push(`🎁 %100 Ücretsiz oyun promosyonu.`);
    pros.push('Tamamen ücretsiz ve kalıcı lisans');
  } else if (savings >= 75) {
    highlights.push(`🔥 %${Math.round(savings)} oranında devasa indirim fırsatı.`);
    pros.push('Tarihi dip fiyata çok yakın bütçe dostu fiyat');
  } else if (savings >= 50) {
    highlights.push(`🏷️ %${Math.round(savings)} oranında cazip fiyat indirimi.`);
    pros.push('Fiyat/Performans oranı oldukça yüksek');
  }

  highlights.push(`🏪 Platform: ${storeName}`);

  if (ratingPercent >= 85) {
    highlights.push(`⭐ Topluluktan %${ratingPercent} oranında "Çok Olumlu" puan.`);
    pros.push('Kullanıcı memnuniyeti ve oynanış kalitesi üst seviyede');
  } else if (ratingPercent >= 70) {
    highlights.push(`👍 Oyuncuların %${ratingPercent}'i tarafından tavsiye ediliyor.`);
    pros.push('Kendi türünde keyifli bir deneyim sunuyor');
  }

  if (genres.length > 0) {
    highlights.push(`🎮 Türler: ${genres.slice(0, 4).join(', ')}.`);
  }

  if (genres.some((g) => /rpg|rol yapma/i.test(g))) {
    pros.push('Derin hikaye örgüsü ve karakter gelişimi');
    cons.push('Öğrenme eğrisi ve oynanış süresi uzun olabilir');
  }
  if (genres.some((g) => /action|aksiyon/i.test(g))) {
    pros.push('Hızlı ve dinamik oynanış mekanikleri');
  }
  if (genres.some((g) => /strategy|strateji/i.test(g))) {
    pros.push('Taktiksel derinlik ve yüksek tekrar oynanabilirlik');
  }

  if (cons.length === 0) {
    cons.push('Sistem gereksinimlerini kontrol etmeniz tavsiye edilir');
  }

  return { highlights, pros, cons };
}

// Fetch Steam Storefront details for rich metadata if steamAppId exists
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
  } catch {
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

// Sync Epic Games Weekly Free Games
export async function syncEpicFreeGames(): Promise<number> {
  try {
    const url = 'https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?locale=tr-TR&country=TR';
    const res = await axios.get(url, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    const elements = res.data?.data?.Catalog?.searchStore?.elements || [];
    const now = new Date();
    let freeCount = 0;

    for (const el of elements) {
      const offers = el.promotions?.promotionalOffers?.[0]?.promotionalOffers || [];
      const isFreeNow = offers.some((o: any) => {
        const start = new Date(o.startDate);
        const end = new Date(o.endDate);
        return o.discountSetting?.discountPercentage === 0 && now >= start && now <= end;
      });

      if (!isFreeNow) continue;

      const title = el.title.trim();
      const slug = slugify(title, { lower: true, strict: true, locale: 'tr' }) + '-epic-free';
      const dealId = `epic_free_${el.id}`;
      const existingDeal = getDealById(dealId);

      const rawPrice = el.price?.totalPrice?.originalPrice || 0;
      const normalPrice = rawPrice > 0 ? rawPrice / 100 : 19.99;

      const imageUrl =
        el.keyImages?.find(
          (img: any) =>
            img.type === 'DieselStoreFrontWide' ||
            img.type === 'Thumbnail' ||
            img.type === 'OfferImageWide' ||
            img.type === 'VaultClosed'
        )?.url ||
        el.keyImages?.[0]?.url ||
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f';

      const productSlug = el.productSlug || el.urlSlug || el.offerMappings?.[0]?.pageSlug || '';
      const storeUrl = productSlug
        ? `https://store.epicgames.com/tr/p/${productSlug}`
        : 'https://store.epicgames.com/tr/free-games';

      const shortDesc = cleanHtml(
        el.description ||
          `${title}, Epic Games Store Haftalık Ücretsiz Oyunlar kampanyasıyla kısa süreliğine ücretsiz dağıtılmaktadır.`
      );

      const screenshots = el.keyImages?.map((k: any) => k.url).filter(Boolean) || [imageUrl];

      const dealRecord: Deal = {
        id: dealId,
        store: 'epic',
        storeName: 'Epic Games',
        storeUrl,
        steamUrl: storeUrl,
        affiliateUrl: storeUrl,
        title,
        slug: existingDeal ? existingDeal.slug : slug,
        normalPrice,
        salePrice: 0,
        savingsPercentage: 100,
        currency: 'USD',
        headerImage: imageUrl,
        capsuleImage: imageUrl,
        screenshots: screenshots.slice(0, 5),
        genres: ['Ücretsiz Oyun', 'Epic Games', 'Promosyon'],
        steamRatingText: 'Çok Olumlu',
        steamRatingPercent: 95,
        steamRatingCount: 1500,
        releaseDate: new Date().toLocaleDateString('tr-TR'),
        publisher: el.seller?.name || 'Epic Games',
        developer: el.developer || 'Epic Games',
        shortDescription: `${title}, Epic Games Store Haftalık Ücretsiz Oyunlar kampanyası kapsamında %100 indirimle 0 TL / $0.00 fiyatla sunulmaktadır. Hesabınıza kalıcı olarak ekleyebilirsiniz!\n\n${shortDesc}`,
        detailedDescription: shortDesc,
        summaryHighlights: [
          '🎁 Epic Games Haftalık Ücretsiz Oyunu',
          '🔥 %100 İndirim ile $0.00 (Kalıcı olarak kütüphanenize eklenir)',
          '⚡ Sınırlı süre geçerli promosyon fırsatı',
          '🏪 Platform: Epic Games Store',
        ],
        pros: ['Tamamen ücretsiz ve kalıcı lisans', 'Herhangi bir abonelik veya ek ücret gerektirmez'],
        cons: ['Süreli promosyondur, kampanya bitmeden kütüphaneye eklenmelidir'],
        isHistoricalLow: true,
        isFree: true,
        postedToTwitter: existingDeal ? existingDeal.postedToTwitter : false,
        featured: true,
        createdAt: existingDeal ? existingDeal.createdAt : now.toISOString(),
        updatedAt: now.toISOString(),
      };

      saveDeal(dealRecord);
      freeCount++;
    }

    return freeCount;
  } catch (err: any) {
    console.warn('Epic free games sync error:', err.message);
    return 0;
  }
}

// Sync all deals from Steam (1), GOG (7), Humble Store (11), Epic Games (25)
export async function syncAllDeals(limit = 45): Promise<{ added: number; updated: number; total: number }> {
  try {
    // 1. Sync Epic Games Free Promotions First
    await syncEpicFreeGames();

    // 2. Query CheapShark for Multi-Store Top Deals (Steam: 1, GOG: 7, Humble: 11, Epic: 25)
    const cheapSharkUrl = `https://www.cheapshark.com/api/1.0/deals?storeID=1,7,11,25&sortBy=Deal%20Rating&pageSize=${limit}&desc=0`;
    const response = await axios.get<CheapSharkDealItem[]>(cheapSharkUrl, {
      timeout: 12000,
      headers: {
        'User-Agent': 'LootHub/1.0 (contact@sociaera.online)',
        'Accept': 'application/json',
      },
    });
    const deals = response.data;

    let addedCount = 0;
    let updatedCount = 0;

    for (const item of deals) {
      const storeConfig = STORE_MAP[item.storeID] || STORE_MAP['1'];
      const store = storeConfig.store;
      const storeName = storeConfig.storeName;

      let normalPrice = parseFloat(item.normalPrice);
      let salePrice = parseFloat(item.salePrice);
      let savingsPercentage = Math.round(parseFloat(item.savings));
      const steamRatingPercent = parseInt(item.steamRatingPercent, 10) || 0;
      const steamRatingCount = parseInt(item.steamRatingCount, 10) || 0;
      const metacriticScore = parseInt(item.metacriticScore, 10) || undefined;

      // Clean Title & Slug
      const cleanTitle = item.title.trim();
      let baseSlug = slugify(cleanTitle, { lower: true, strict: true, locale: 'tr' });
      if (!baseSlug) {
        baseSlug = `deal-${item.gameID}`;
      }
      const storeSuffix = store !== 'steam' ? `-${store}` : '';
      const slug = `${baseSlug}${storeSuffix}-${item.steamAppID || item.gameID}`;

      // Check existing deal
      const existingDeal = getDealById(item.dealID);

      let headerImage = item.thumb || `https://images.unsplash.com/photo-1550745165-9bc0b252726f`;
      let capsuleImage = item.thumb;
      let screenshots: string[] = [];
      let genres: string[] = [];
      let releaseDate = item.releaseDate ? new Date(item.releaseDate * 1000).toLocaleDateString('tr-TR') : undefined;
      let publisher = '';
      let developer = '';
      let rawShortDesc = '';
      let rawDetailedDesc = '';
      let minimumRequirements = '';
      let recommendedRequirements = '';

      // If Steam App ID exists, fetch rich Steam media and Turkish regional pricing
      if (item.steamAppID) {
        headerImage = `https://cdn.akamai.steamstatic.com/steam/apps/${item.steamAppID}/header.jpg`;
        const steamDetails = await fetchSteamAppDetails(item.steamAppID);

        if (steamDetails) {
          // If on Steam store, use Steam TR (MENA-USD) exact price
          if (store === 'steam' && steamDetails.price_overview) {
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
      }

      if (screenshots.length === 0) {
        screenshots = [headerImage];
      }

      // Turkish Description
      let turkishShortDesc = await translateToTurkish(rawShortDesc);
      const fullTurkishDescription = buildTurkishGameDescription(
        cleanTitle,
        turkishShortDesc,
        genres,
        steamRatingPercent,
        item.steamRatingText || 'Olumlu',
        savingsPercentage,
        salePrice,
        storeName,
        publisher
      );

      const { highlights, pros, cons } = generateGameHighlights(
        cleanTitle,
        genres,
        steamRatingPercent,
        savingsPercentage,
        storeName
      );

      const storeUrl = storeConfig.defaultUrl(item.dealID, item.steamAppID || undefined);
      const now = new Date().toISOString();

      const dealRecord: Deal = {
        id: item.dealID,
        steamAppId: item.steamAppID || undefined,
        store,
        storeName,
        storeUrl,
        steamUrl: storeUrl,
        affiliateUrl: storeUrl,
        title: cleanTitle,
        slug: existingDeal ? existingDeal.slug : slug,
        normalPrice,
        salePrice,
        savingsPercentage,
        currency: 'USD',
        headerImage,
        capsuleImage,
        screenshots,
        genres: genres.length > 0 ? genres : [storeName, 'İndirim'],
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
        isHistoricalLow: savingsPercentage >= 75,
        isFree: salePrice === 0,
        postedToTwitter: existingDeal ? existingDeal.postedToTwitter : false,
        twitterPostId: existingDeal?.twitterPostId,
        twitterPostedAt: existingDeal?.twitterPostedAt,
        featured: savingsPercentage >= 60 && (steamRatingPercent >= 80 || salePrice === 0),
        createdAt: existingDeal ? existingDeal.createdAt : now,
        updatedAt: now,
      };

      saveDeal(dealRecord);
      if (existingDeal) {
        updatedCount++;
      } else {
        addedCount++;
      }

      // Small throttle
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    return { added: addedCount, updated: updatedCount, total: deals.length };
  } catch (error: any) {
    console.error('Error syncing multi-store deals:', error.message);
    throw error;
  }
}

// Backward compatibility alias
export const syncSteamDeals = syncAllDeals;
