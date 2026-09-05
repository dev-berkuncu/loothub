import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getDealBySlug, getDeals } from '@/lib/db';
import DealCard from '@/components/DealCard';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const deal = getDealBySlug(params.slug);
  if (!deal) {
    return {
      title: 'Record Not Found | Sociaera',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sociaera.online';
  const isFree = deal.isFree || deal.salePrice === 0;
  const storeTitle = deal.storeName || 'Steam';
  const priceText = isFree ? 'FREE' : `$${deal.salePrice.toFixed(2)}`;
  const title = `${deal.title} — ${storeTitle} Archived Record (${priceText})`;
  const description = `${deal.title} is currently documented under verified ${storeTitle} promotion status at ${priceText}. Architectural specs and pricing history.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteUrl}/deal/${deal.slug}`,
      siteName: 'Sociaera',
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
    limit: 3,
    category: deal.genres?.[0] || undefined,
  });

  const filteredRelated = relatedDeals.filter((d) => d.id !== deal.id).slice(0, 3);

  return (
    <div className="space-y-16 max-w-[1240px] mx-auto pt-4">
      {/* Top Navigation Affordance */}
      <div>
        <Link
          href="/"
          className="ghost-link text-caption uppercase"
        >
          &larr; BACK TO SOCIAERA INDEX
        </Link>
      </div>

      {/* Main Structural Record Grid */}
      <article className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Media Column (Col 7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-paper border border-ash rounded-cards">
            <img
              src={deal.headerImage}
              alt={deal.title}
              className="w-full h-full object-cover contrast-[1.06]"
            />
          </div>

          {/* Screenshots Hairline Grid */}
          {deal.screenshots && deal.screenshots.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {deal.screenshots.slice(0, 4).map((img, i) => (
                <div
                  key={i}
                  className="aspect-[16/9] overflow-hidden border border-ash bg-paper rounded-cards"
                >
                  <img
                    src={img}
                    alt={`${deal.title} visual capture ${i + 1}`}
                    className="w-full h-full object-cover hover:contrast-[1.12] transition-all block"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details & Action Tile (Col 5) */}
        <div className="lg:col-span-5 grid-paper border border-ash rounded-cards p-8 space-y-6">
          <div className="space-y-3 pb-6 border-b border-ash">
            <span className="section-label block">
              RECORD // {storeLabel} // {deal.genres?.[0]?.toUpperCase() || 'TITLE'}
            </span>
            <h1 className="text-subheading md:text-heading-sm font-normal text-ink leading-tight">
              {deal.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 pt-2">
              {deal.publisher && (
                <span className="section-label text-ink/70">
                  PUB: {deal.publisher}
                </span>
              )}
              {deal.releaseDate && (
                <span className="section-label text-ink/70">
                  REL: {deal.releaseDate}
                </span>
              )}
            </div>
          </div>

          {/* Pricing Tile */}
          <div className="p-6 border border-ash bg-parchment rounded-cards flex items-center justify-between">
            <div>
              <span className="section-label block mb-1">
                {isFree ? 'STATUS' : 'VERIFIED PRICE'}
              </span>
              <div className="flex items-baseline gap-3">
                <span className="text-subheading font-normal text-ink">
                  {isFree ? 'FREE' : `$${deal.salePrice.toFixed(2)}`}
                </span>
                {deal.normalPrice > 0 && (
                  <span className="text-body-sm text-ash line-through">
                    ${deal.normalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            <div className="text-right">
              <span className="section-label font-medium block">
                {isFree ? '100% DISCOUNT' : `−${Math.round(deal.savingsPercentage)}% OFF`}
              </span>
              {deal.isHistoricalLow && (
                <span className="section-label text-ink block mt-1">
                  HISTORIC LOW
                </span>
              )}
            </div>
          </div>

          {/* Verification Rating */}
          <div className="p-4 border border-ash bg-paper rounded-cards">
            <span className="section-label block text-ink mb-1">
              STOREFRONT VERIFICATION
            </span>
            <p className="text-body-sm text-ink/70">
              {(deal.steamRatingPercent || 0) > 0
                ? `${deal.steamRatingPercent}% Positive Rating (${deal.steamRatingCount?.toLocaleString() || '1,000+'} reviews)`
                : `Active digital deal on ${storeLabel}.`}
            </p>
          </div>

          {/* Ghost Primary Action Button */}
          <div className="pt-2">
            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-6 rounded-buttons border border-ink text-ink hover:bg-ink hover:text-parchment text-caption font-normal uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 text-center"
            >
              {isFree
                ? `CLAIM FREE ON ${storeLabel} &rarr;`
                : `PROCEED TO ${storeLabel} &rarr;`}
            </a>
          </div>
        </div>
      </article>

      {/* Structural Data Sections */}
      <section className="space-y-8 pt-8 border-t border-ash">
        {/* Curated Summary */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-8 border border-ash bg-paper rounded-cards">
          <div className="md:col-span-4">
            <span className="section-label block">
              EDITORIAL EVALUATION
            </span>
          </div>
          <div className="md:col-span-8 space-y-4">
            {deal.summaryHighlights && deal.summaryHighlights.length > 0 ? (
              <div className="space-y-2">
                {deal.summaryHighlights.map((hl, idx) => (
                  <p key={idx} className="text-body-sm text-ink leading-relaxed">
                    &bull; {hl}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-body-sm text-ink leading-relaxed">
                {deal.shortDescription || `${deal.title} documented on ${storeLabel}.`}
              </p>
            )}
          </div>
        </div>

        {/* Narrative Overview */}
        {deal.shortDescription && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-8 border border-ash bg-paper rounded-cards">
            <div className="md:col-span-4">
              <span className="section-label block">
                ARCHIVAL OVERVIEW
              </span>
            </div>
            <div className="md:col-span-8">
              <p className="text-body leading-[1.40] text-ink whitespace-pre-line">
                {deal.shortDescription}
              </p>
            </div>
          </div>
        )}

        {/* System Requirements */}
        {(deal.minimumRequirements || deal.recommendedRequirements) && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-8 border border-ash bg-paper rounded-cards">
            <div className="md:col-span-4">
              <span className="section-label block">
                TECHNICAL SPECS
              </span>
            </div>
            <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {deal.minimumRequirements && (
                <div className="space-y-2">
                  <span className="section-label block text-ink">MINIMUM</span>
                  <div className="text-caption text-ink/70 whitespace-pre-line leading-relaxed font-mono">
                    {deal.minimumRequirements}
                  </div>
                </div>
              )}
              {deal.recommendedRequirements && (
                <div className="space-y-2">
                  <span className="section-label block text-ink">RECOMMENDED</span>
                  <div className="text-caption text-ink/70 whitespace-pre-line leading-relaxed font-mono">
                    {deal.recommendedRequirements}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Related Works Grid */}
      {filteredRelated.length > 0 && (
        <section className="space-y-6 pt-12 border-t border-ash">
          <span className="section-label block">
            ASSOCIATED ARCHIVAL RECORDS
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredRelated.map((relDeal) => (
              <DealCard key={relDeal.id} deal={relDeal} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
