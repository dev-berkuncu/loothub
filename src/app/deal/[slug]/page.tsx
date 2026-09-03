import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Calendar,
  Building2,
  ShieldCheck,
  Gift,
} from 'lucide-react';
import { getDealBySlug, getDeals } from '@/lib/db';
import DealCard from '@/components/DealCard';

interface PageProps {
  params: {
    slug: string;
  };
}

// Generate dynamic SEO metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const deal = getDealBySlug(params.slug);
  if (!deal) {
    return {
      title: 'Kayıt Bulunamadı | Loot Dispatch',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const isFree = deal.isFree || deal.salePrice === 0;
  const storeTitle = deal.storeName || 'Steam';
  const priceText = isFree ? 'ÜCRETSİZ!' : `$${deal.salePrice.toFixed(2)}`;
  const title = `${deal.title} — Editoryal Rapor & ${storeTitle} Fırsatı (${priceText})`;
  const description = `${deal.title}, ${storeTitle} mağazasında %${Math.round(deal.savingsPercentage)} indirim fırsatıyla ${priceText} fiyatına sunuluyor. Editoryal inceleme ve teknik gereksinimler.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteUrl}/deal/${deal.slug}`,
      siteName: 'Loot Dispatch',
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

  const isFree = deal.isFree || deal.salePrice === 0;
  const targetUrl = deal.storeUrl || deal.affiliateUrl || deal.steamUrl || '#';
  const storeLabel = (deal.storeName || 'STEAM').toUpperCase();

  // Related Deals
  const { deals: relatedDeals } = getDeals({
    limit: 4,
    category: deal.genres?.[0] || undefined,
  });

  const filteredRelated = relatedDeals.filter((d) => d.id !== deal.id).slice(0, 4);

  return (
    <div className="space-y-12 max-w-[1240px] mx-auto">
      {/* Top Breadcrumb Navigation */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-xs text-muted hover:text-ink uppercase tracking-mono transition-colors font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          DISPATCH ARŞİVİNE GERİ DÖN
        </Link>
      </div>

      {/* Main Editorial Hero Grid */}
      <article className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Media & Screenshots (Col 7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[var(--radius)] border border-ink bg-paper-deep shadow-sm">
            <img
              src={deal.headerImage}
              alt={deal.title}
              className="w-full h-full object-cover saturate-[0.9] contrast-[1.04]"
            />

            {/* Kind Pill */}
            <span
              className={`kind-pill ${
                isFree ? '!bg-lime !border-ink !font-extrabold' : ''
              }`}
            >
              {isFree ? '🎁 ÜCRETSİZ OYUN' : storeLabel}
            </span>

            {/* Discount Stamp */}
            <strong className="discount-stamp">
              {isFree ? '0.00$' : `−${Math.round(deal.savingsPercentage)}%`}
            </strong>
          </div>

          {/* Screenshots Gallery */}
          {deal.screenshots && deal.screenshots.length > 0 && (
            <div className="grid grid-cols-4 gap-2 pt-1">
              {deal.screenshots.slice(0, 4).map((img, i) => (
                <div
                  key={i}
                  className="aspect-[16/9] rounded-[2px] overflow-hidden border border-line bg-paper-deep"
                >
                  <img
                    src={img}
                    alt={`${deal.title} Ekran Görüntüsü ${i + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 block"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Editorial Brief & Action Card (Col 5) */}
        <div className="lg:col-span-5 rounded-[var(--radius)] border border-ink bg-white/70 p-6 md:p-8 space-y-6 shadow-sm">
          <div>
            {/* Eyebrow */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="font-mono text-[10px] uppercase tracking-mono text-muted">
                DISPATCH SEÇKİSİ
              </span>
              <span className="font-mono text-[10px] uppercase tracking-mono text-muted">·</span>
              <span className="font-mono text-[10px] uppercase tracking-mono font-bold text-ink">
                {storeLabel}
              </span>
              {deal.genres?.[0] && (
                <>
                  <span className="font-mono text-[10px] uppercase tracking-mono text-muted">·</span>
                  <span className="font-mono text-[10px] uppercase tracking-mono text-muted">
                    {deal.genres[0]}
                  </span>
                </>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-extrabold text-ink tracking-tight leading-[0.95] mb-4">
              {deal.title}
            </h1>

            {/* Developer & Release Meta */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted border-y border-line py-3">
              {deal.publisher && (
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-ink" />
                  {deal.publisher}
                </span>
              )}
              {deal.releaseDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-ink" />
                  {deal.releaseDate}
                </span>
              )}
            </div>
          </div>

          {/* Price & Savings Box */}
          <div className="p-4 rounded-[var(--radius)] bg-paper border border-ink flex items-center justify-between">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-mono text-muted block mb-0.5">
                {isFree ? 'PROMOSYON FİYATI' : 'GÜNCEL FİYAT'}
              </span>
              <div className="flex items-baseline gap-2">
                <b className={`text-3xl font-black ${isFree ? 'text-ink bg-lime px-2 py-0.5 rounded-[2px]' : 'text-ink'}`}>
                  {isFree ? 'ÜCRETSİZ' : `$${deal.salePrice.toFixed(2)}`}
                </b>
                {deal.normalPrice > 0 && (
                  <del className="text-sm font-mono text-muted line-through">
                    ${deal.normalPrice.toFixed(2)}
                  </del>
                )}
              </div>
            </div>

            <div className="text-right">
              <span className="font-mono text-xs font-bold text-ink block">
                {isFree ? '%100 TASARRUF' : `TASARRUF: $${(deal.normalPrice - deal.salePrice).toFixed(2)}`}
              </span>
              {deal.isHistoricalLow && (
                <span className="font-mono text-[9px] uppercase tracking-mono bg-orange text-white px-2 py-0.5 rounded-[2px] inline-block mt-1 font-bold">
                  TARİHİ DİP
                </span>
              )}
            </div>
          </div>

          {/* Rating Badge */}
          <div className="p-4 rounded-[var(--radius)] bg-paper-deep border border-line flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-ink text-lime flex items-center justify-center font-bold text-sm shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-mono text-xs font-bold text-ink uppercase tracking-mono">
                {(deal.steamRatingPercent || 0) > 0
                  ? `TOPLULUK PUANI: %${deal.steamRatingPercent}`
                  : `${storeLabel} RESMİ SEÇKİSİ`}
              </p>
              <p className="text-xs text-muted font-sans">
                {(deal.steamRatingPercent || 0) > 0
                  ? `${deal.steamRatingText || 'Çok Olumlu'} (${deal.steamRatingCount?.toLocaleString() || '1.000+'} inceleme)`
                  : `${deal.storeName || 'Mağaza'} üzerinde doğrulanmış resmi indirim`}
              </p>
            </div>
          </div>

          {/* CTA Action Button */}
          <div className="pt-2">
            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-6 rounded-[var(--radius)] bg-ink hover:bg-lime text-paper hover:text-ink font-sans font-extrabold text-sm uppercase tracking-wider transition-all duration-200 border border-ink flex items-center justify-center gap-2 shadow-sm"
            >
              {isFree ? (
                <>
                  <Gift className="w-4 h-4" />
                  {storeLabel}&apos;DE ÜCRETSİZ KÜTÜPHANEYE EKLE
                </>
              ) : (
                <>
                  {storeLabel}&apos;DE GÖRÜNTÜLE VE SATIN AL
                  <ArrowUpRight className="w-4 h-4" />
                </>
              )}
            </a>
          </div>
        </div>
      </article>

      {/* Editorial Content Sections */}
      <section className="space-y-8 pt-4">
        {/* Why Buy / Editorial Highlights */}
        <div className="rounded-[var(--radius)] border border-line bg-white/50 p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-2 border-b border-line pb-4">
            <Sparkles className="w-4 h-4 text-orange" />
            <h2 className="font-sans font-extrabold text-lg text-ink tracking-tight uppercase">
              EDİTORYAL DEĞERLENDİRME & TAVSİYELER
            </h2>
          </div>

          {/* Highlights Bullets */}
          {deal.summaryHighlights && deal.summaryHighlights.length > 0 && (
            <div className="space-y-2">
              {deal.summaryHighlights.map((hl, idx) => (
                <div key={idx} className="flex items-start gap-3 text-sm text-ink font-sans">
                  <span className="font-mono text-orange font-bold">▪</span>
                  <span>{hl}</span>
                </div>
              ))}
            </div>
          )}

          {/* Pros & Cons in 1px Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-line">
            {/* Pros */}
            <div className="p-4 rounded-[var(--radius)] bg-paper border border-line space-y-2">
              <h3 className="font-mono text-[11px] uppercase tracking-mono font-bold text-ink flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-ink" />
                ÖNE ÇIKAN ARTILARI
              </h3>
              <ul className="space-y-1.5 text-xs text-muted font-sans">
                {deal.pros && deal.pros.length > 0 ? (
                  deal.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-ink font-bold">✔</span>
                      <span>{pro}</span>
                    </li>
                  ))
                ) : (
                  <li>Avantajlı fiyatlandırma ve yüksek oyun deneyimi</li>
                )}
              </ul>
            </div>

            {/* Cons */}
            <div className="p-4 rounded-[var(--radius)] bg-paper border border-line space-y-2">
              <h3 className="font-mono text-[11px] uppercase tracking-mono font-bold text-muted flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-muted" />
                DİKKAT EDİLMESİ GEREKENLER
              </h3>
              <ul className="space-y-1.5 text-xs text-muted font-sans">
                {deal.cons && deal.cons.length > 0 ? (
                  deal.cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span>⚠</span>
                      <span>{con}</span>
                    </li>
                  ))
                ) : (
                  <li>Donanım gereksinimlerini kontrol etmeyi unutmayın</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Editorial Story / Description (Georgia Serif) */}
        {deal.shortDescription && (
          <div className="rounded-[var(--radius)] border border-line bg-white/50 p-6 md:p-8 space-y-4">
            <h2 className="font-mono text-xs uppercase tracking-mono font-bold text-muted border-b border-line pb-2">
              YAPIM HAKKINDA RAPOR
            </h2>
            <div className="editorial-copy">
              {deal.shortDescription}
            </div>
          </div>
        )}

        {/* System Requirements (Technical DM Mono Grid) */}
        {(deal.minimumRequirements || deal.recommendedRequirements) && (
          <div className="rounded-[var(--radius)] border border-line bg-paper-deep p-6 md:p-8 space-y-4">
            <h2 className="font-mono text-xs uppercase tracking-mono font-bold text-ink flex items-center gap-2 border-b border-line pb-2">
              <Cpu className="w-4 h-4 text-ink" />
              SİSTEM GEREKSİNİMLERİ (TEKNİK PARAMETRELER)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              {deal.minimumRequirements && (
                <div className="p-4 rounded-[var(--radius)] bg-paper border border-line space-y-2">
                  <h3 className="font-bold text-ink uppercase tracking-mono">
                    MİNİMUM GEREKSİNİMLER
                  </h3>
                  <div className="whitespace-pre-line leading-relaxed text-muted text-[11px]">
                    {deal.minimumRequirements}
                  </div>
                </div>
              )}

              {deal.recommendedRequirements && (
                <div className="p-4 rounded-[var(--radius)] bg-paper border border-line space-y-2">
                  <h3 className="font-bold text-ink uppercase tracking-mono">
                    ÖNERİLEN GEREKSİNİMLER
                  </h3>
                  <div className="whitespace-pre-line leading-relaxed text-muted text-[11px]">
                    {deal.recommendedRequirements}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Recommendations / Related Deals */}
      {filteredRelated.length > 0 && (
        <section className="space-y-6 pt-10 border-t border-ink/20">
          <h2 className="text-xl md:text-2xl font-extrabold text-ink tracking-tight">
            İLGİNİZİ ÇEKEBİLECEK DİĞER EDİTORYAL FIRSATLAR
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {filteredRelated.map((relDeal) => (
              <DealCard key={relDeal.id} deal={relDeal} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
