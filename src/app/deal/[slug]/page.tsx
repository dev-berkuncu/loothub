import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  TrendingDown,
  ThumbsUp,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Sparkles,
  Calendar,
  Building2,
  Share2,
  ArrowLeft,
  ShoppingBag,
} from 'lucide-react';
import { getDealBySlug, getDeals } from '@/lib/db';
import AdBanner from '@/components/AdBanner';
import DealCard from '@/components/DealCard';

interface PageProps {
  params: {
    slug: string;
  };
}

// Generate dynamic SEO metadata for Google & Twitter Cards
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const deal = getDealBySlug(params.slug);
  if (!deal) {
    return {
      title: 'Oyun Bulunamadı | SteamFırsat',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const title = `${deal.title} %${Math.round(deal.savingsPercentage)} İndirimde! ($${deal.salePrice.toFixed(2)})`;
  const description = `${deal.title}, Steam mağazasında %${Math.round(deal.savingsPercentage)} indirimle $${deal.salePrice.toFixed(2)} fiyatına düştü. Steam Puanı: %${deal.steamRatingPercent}. Oyun incelemesi, sistem gereksinimleri ve detaylar.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteUrl}/deal/${deal.slug}`,
      siteName: 'SteamFırsat',
      images: [
        {
          url: deal.headerImage,
          width: 460,
          height: 215,
          alt: deal.title,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [deal.headerImage],
    },
  };
}

export default function DealDetailPage({ params }: PageProps) {
  const deal = getDealBySlug(params.slug);

  if (!deal) {
    notFound();
  }

  // Fetch 4 similar or top deals for recommendations
  const { deals: relatedDeals } = getDeals({
    limit: 4,
    category: deal.genres?.[0] || undefined,
  });

  const filteredRelated = relatedDeals.filter((d) => d.id !== deal.id).slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-steam-blue transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Tüm İndirimlere Geri Dön
        </Link>

        {deal.postedToTwitter && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-blue-900/40 text-blue-400 border border-blue-800/50 flex items-center gap-1 font-semibold">
            <Share2 className="w-3 h-3" />
            Twitter&apos;da Paylaşıldı
          </span>
        )}
      </div>

      {/* Top Banner & Main Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Images & Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-steam-card border border-steam-accent shadow-2xl">
            <Image
              src={deal.headerImage}
              alt={deal.title}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-steam-discount text-steam-green font-black text-base shadow-xl border border-steam-green/40 backdrop-blur-md">
              <TrendingDown className="w-5 h-5" />
              <span>-%{Math.round(deal.savingsPercentage)} İndirim</span>
            </div>
          </div>

          {/* Screenshots Gallery */}
          {deal.screenshots && deal.screenshots.length > 0 && (
            <div className="grid grid-cols-4 gap-2 pt-2">
              {deal.screenshots.slice(0, 4).map((img, i) => (
                <div
                  key={i}
                  className="relative aspect-[16/9] rounded-lg overflow-hidden border border-steam-accent/60 bg-steam-card"
                >
                  <Image
                    src={img}
                    alt={`${deal.title} Ekran Görüntüsü ${i + 1}`}
                    fill
                    sizes="25vw"
                    className="object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Pricing, CTA & Metadata Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-steam-card border border-steam-accent/60 shadow-xl space-y-6">
            <div>
              {/* Genres */}
              {deal.genres && deal.genres.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {deal.genres.map((g) => (
                    <span
                      key={g}
                      className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-steam-accent/40 text-steam-blue border border-steam-accent/60"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              )}

              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-snug">
                {deal.title}
              </h1>

              {/* Developer & Release Info */}
              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-400">
                {deal.publisher && (
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-steam-blue" />
                    {deal.publisher}
                  </span>
                )}
                {deal.releaseDate && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-steam-blue" />
                    {deal.releaseDate}
                  </span>
                )}
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-xl bg-steam-darker/90 border border-steam-accent/70 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 uppercase font-semibold">İndirimli Fiyat</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">
                    ${deal.salePrice.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    ${deal.normalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-steam-green font-bold block">
                  Tasarruf: ${(deal.normalPrice - deal.salePrice).toFixed(2)}
                </span>
                {deal.isHistoricalLow && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-orange-600/90 text-white font-bold inline-block mt-1">
                    Tarihi Dip Fiyat
                  </span>
                )}
              </div>
            </div>

            {/* Steam Review Score Badge */}
            <div className="p-4 rounded-xl bg-steam-accent/20 border border-steam-accent/50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-steam-blue/20 text-steam-blue flex items-center justify-center font-black">
                <ThumbsUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">
                  Steam İnceleme Puanı: %{deal.steamRatingPercent}
                </p>
                <p className="text-xs text-gray-400">
                  {deal.steamRatingText || 'Çok Olumlu'} ({deal.steamRatingCount.toLocaleString()} kullanıcı incelemesi)
                </p>
              </div>
            </div>

            {/* Action Buttons (Monetization & Store Links) */}
            <div className="space-y-3 pt-2">
              {/* Primary Steam Buy Button */}
              <a
                href={deal.affiliateUrl || deal.steamUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-steam-green to-lime-600 hover:from-lime-500 hover:to-lime-600 text-steam-darker font-black text-sm transition-all flex items-center justify-center gap-2 shadow-lg glow-green"
              >
                <ShoppingBag className="w-4 h-4" />
                Steam&apos;de Görüntüle ve Satın Al
                <ExternalLink className="w-4 h-4 ml-1 opacity-70" />
              </a>

              {/* Optional Affiliate Alternative Link */}
              <a
                href={deal.steamUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-steam-card hover:bg-steam-accent/50 border border-steam-accent text-steam-blue font-bold text-xs transition-all flex items-center justify-center gap-2"
              >
                Resmi Steam Mağaza Sayfası
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Mid Content Ad Banner */}
      <AdBanner slot="deal-middle-ad" className="my-6" />

      {/* Detailed Content Tabs / Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Cols: Game Analysis & System Specs */}
        <div className="lg:col-span-8 space-y-8">
          {/* Why Buy Section */}
          <div className="p-6 md:p-8 rounded-2xl bg-steam-card border border-steam-accent/60 shadow-xl space-y-6">
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              Neden Bu Oyunu Almalısınız?
            </h2>

            {/* Highlights */}
            {deal.summaryHighlights && deal.summaryHighlights.length > 0 && (
              <div className="space-y-2">
                {deal.summaryHighlights.map((hl, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-sm text-gray-200">
                    <span className="text-steam-blue mt-1">▪</span>
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Pros & Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-steam-accent/40">
              {/* Pros */}
              <div className="p-4 rounded-xl bg-steam-darker/60 border border-green-900/40 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-green-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  Öne Çıkan Artıları
                </h3>
                <ul className="space-y-2 text-xs text-gray-300">
                  {deal.pros && deal.pros.length > 0 ? (
                    deal.pros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-green-400">✔</span>
                        <span>{pro}</span>
                      </li>
                    ))
                  ) : (
                    <li>Yüksek indirim oranı ve kaliteli oynanış</li>
                  )}
                </ul>
              </div>

              {/* Cons */}
              <div className="p-4 rounded-xl bg-steam-darker/60 border border-red-900/30 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  Dikkat Edilmesi Gerekenler
                </h3>
                <ul className="space-y-2 text-xs text-gray-300">
                  {deal.cons && deal.cons.length > 0 ? (
                    deal.cons.map((con, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-red-400">⚠</span>
                        <span>{con}</span>
                      </li>
                    ))
                  ) : (
                    <li>Sistem gereksinimlerini kontrol etmeyi unutmayın</li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Description Section */}
          {deal.shortDescription && (
            <div className="p-6 md:p-8 rounded-2xl bg-steam-card border border-steam-accent/60 shadow-xl space-y-4">
              <h2 className="text-xl font-extrabold text-white">Oyun Hakkında</h2>
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                {deal.shortDescription}
              </p>
            </div>
          )}

          {/* System Requirements */}
          {(deal.minimumRequirements || deal.recommendedRequirements) && (
            <div className="p-6 md:p-8 rounded-2xl bg-steam-card border border-steam-accent/60 shadow-xl space-y-4">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-steam-blue" />
                Sistem Gereksinimleri
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-300">
                {deal.minimumRequirements && (
                  <div className="p-4 rounded-xl bg-steam-darker/60 border border-steam-accent/40 space-y-2">
                    <h3 className="font-bold text-steam-blue uppercase tracking-wider">
                      Minimum Gereksinimler
                    </h3>
                    <div className="whitespace-pre-line leading-relaxed font-mono text-[11px] text-gray-400">
                      {deal.minimumRequirements}
                    </div>
                  </div>
                )}

                {deal.recommendedRequirements && (
                  <div className="p-4 rounded-xl bg-steam-darker/60 border border-steam-accent/40 space-y-2">
                    <h3 className="font-bold text-steam-green uppercase tracking-wider">
                      Önerilen Gereksinimler
                    </h3>
                    <div className="whitespace-pre-line leading-relaxed font-mono text-[11px] text-gray-400">
                      {deal.recommendedRequirements}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right 4 Cols: Sidebar Ads & Twitter Bot Widget */}
        <div className="lg:col-span-4 space-y-6">
          {/* Sidebar Ad Unit */}
          <AdBanner slot="sidebar-detail-ad" format="rectangle" className="min-h-[250px]" />

          {/* Twitter Auto-Bot Card Widget */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-steam-card to-steam-accent/30 border border-steam-accent/60 space-y-3">
            <div className="flex items-center gap-2 text-steam-blue font-bold text-sm">
              <Share2 className="w-4 h-4" />
              Twitter İndirim Paylaşımı
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Bu oyun Steam üzerinde indirime girdiğinde Twitter botumuz tarafından otomatik olarak paylaşıldı veya sıraya alındı.
            </p>
            <div className="p-3 rounded-lg bg-steam-darker/80 border border-steam-accent/50 text-[11px] text-gray-300 font-mono">
              🔥 Steam&apos;de Dev İndirim! 🎮<br />
              🎮 {deal.title}<br />
              📉 %{Math.round(deal.savingsPercentage)} İndirim: ${deal.normalPrice.toFixed(2)} ➔ ${deal.salePrice.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations / Related Deals */}
      {filteredRelated.length > 0 && (
        <div className="space-y-4 pt-10 border-t border-steam-accent/40">
          <h2 className="text-xl font-extrabold text-white">İlginizi Çekebilecek Benzer İndirimler</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {filteredRelated.map((relDeal) => (
              <DealCard key={relDeal.id} deal={relDeal} />
            ))}
          </div>
        </div>
      )}

      {/* Bottom Ad Banner */}
      <AdBanner slot="deal-bottom-ad" className="my-8" />
    </div>
  );
}
