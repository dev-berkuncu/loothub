import axios from 'axios';
import slugify from 'slugify';
import { Deal, CheapSharkDealItem } from './types';
import { saveDeal, getDealById } from './db';

// Clean HTML tags from Steam description
function cleanHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/<br\s*[\/]?>/gi, '\n')
    .replace(/<\/?[^>]+(>|$)/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .trim();
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
  if (genres.some(g => /rpg|rol yapma/i.test(g))) {
    pros.push('Derin hikaye örgüsü ve karakter gelişimi');
    cons.push('Öğrenme eğrisi ve oynanış süresi uzun olabilir');
  }
  if (genres.some(g => /action|aksiyon/i.test(g))) {
    pros.push('Hızlı ve dinamik oynanış mekanikleri');
  }
  if (genres.some(g => /strategy|strateji/i.test(g))) {
    pros.push('Taktiksel derinlik ve yüksek tekrar oynanabilirlik');
    cons.push('Detaylı yönetim ve sabır gerektirebilir');
  }
  if (genres.some(g => /multiplayer|çok oyunculu/i.test(g))) {
    pros.push('Arkadaşlarla veya çevrim içi oyuncularla eşsiz eğlence');
    cons.push('Aktif oyuncu sayısı dönemsel olarak değişebilir');
  }

  if (cons.length === 0) {
    cons.push('Sistem gereksinimlerini kontrol etmeniz tavsiye edilir');
  }

  return { highlights, pros, cons };
}

// Fetch Steam Storefront details for screenshots, description, requirements
async function fetchSteamAppDetails(steamAppId: string) {
  try {
    const url = `https://store.steampowered.com/api/appdetails?appids=${steamAppId}&cc=us&l=turkish`;
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
    // If Turkish fails or times out, try standard fallback
    try {
      const fallbackUrl = `https://store.steampowered.com/api/appdetails?appids=${steamAppId}&cc=us`;
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

      const normalPrice = parseFloat(item.normalPrice);
      const salePrice = parseFloat(item.salePrice);
      const savingsPercentage = Math.round(parseFloat(item.savings));
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

      // Fetch Steam rich details if new deal
      let headerImage = `https://cdn.akamai.steamstatic.com/steam/apps/${item.steamAppID}/header.jpg`;
      let capsuleImage = item.thumb || `https://cdn.akamai.steamstatic.com/steam/apps/${item.steamAppID}/capsule_616x353.jpg`;
      let screenshots: string[] = [];
      let genres: string[] = [];
      let releaseDate = item.releaseDate ? new Date(item.releaseDate * 1000).toLocaleDateString('tr-TR') : undefined;
      let publisher = '';
      let developer = '';
      let shortDescription = '';
      let detailedDescription = '';
      let minimumRequirements = '';
      let recommendedRequirements = '';

      if (!existingDeal) {
        const steamDetails = await fetchSteamAppDetails(item.steamAppID);
        if (steamDetails) {
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

          shortDescription = cleanHtml(steamDetails.short_description || '');
          detailedDescription = cleanHtml(steamDetails.detailed_description || steamDetails.about_the_game || '');

          if (steamDetails.pc_requirements) {
            minimumRequirements = cleanHtml(steamDetails.pc_requirements.minimum || '');
            recommendedRequirements = cleanHtml(steamDetails.pc_requirements.recommended || '');
          }

          if (steamDetails.release_date?.date) {
            releaseDate = steamDetails.release_date.date;
          }
        }
      } else {
        screenshots = existingDeal.screenshots;
        genres = existingDeal.genres;
        publisher = existingDeal.publisher || '';
        developer = existingDeal.developer || '';
        shortDescription = existingDeal.shortDescription || '';
        detailedDescription = existingDeal.detailedDescription || '';
        minimumRequirements = existingDeal.minimumRequirements || '';
        recommendedRequirements = existingDeal.recommendedRequirements || '';
        releaseDate = existingDeal.releaseDate || releaseDate;
      }

      if (screenshots.length === 0) {
        screenshots = [
          `https://cdn.akamai.steamstatic.com/steam/apps/${item.steamAppID}/ss_1.jpg`,
          `https://cdn.akamai.steamstatic.com/steam/apps/${item.steamAppID}/ss_2.jpg`,
        ];
      }

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
        shortDescription: shortDescription || `${cleanTitle}, Steam mağazasında %${savingsPercentage} indirim ile satışta!`,
        detailedDescription,
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

      // Small delay between Steam detail requests to be polite
      if (!existingDeal) {
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    }

    return { added: addedCount, updated: updatedCount, total: deals.length };
  } catch (error: any) {
    console.error('Error syncing Steam deals:', error.message);
    throw error;
  }
}
