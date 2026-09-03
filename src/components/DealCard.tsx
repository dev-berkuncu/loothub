'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Deal } from '@/lib/types';

interface DealCardProps {
  deal: Deal;
}

export default function DealCard({ deal }: DealCardProps) {
  const isFree = deal.isFree || deal.salePrice === 0;
  const storeLabel = (deal.storeName || deal.store || 'STEAM').toUpperCase();
  const genreLabel = deal.genres?.[0] ? deal.genres[0].toUpperCase() : 'FIRSAT';

  return (
    <article className="dispatch-card rounded-[var(--radius)] border border-line hover:border-ink bg-white/40 hover:bg-white/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/5 flex flex-col justify-between overflow-hidden group">
      {/* Media Box */}
      <Link href={`/deal/${deal.slug}`} className="relative aspect-[16/9] w-full overflow-hidden bg-paper-deep block">
        <img
          src={deal.headerImage || deal.capsuleImage || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f'}
          alt={deal.title}
          className="w-full h-full object-cover saturate-[0.88] contrast-[1.04] group-hover:scale-105 group-hover:saturate-100 transition-all duration-500 block"
          loading="lazy"
        />

        {/* Kind Pill (Top-Left) */}
        <span
          className={`kind-pill ${
            isFree ? '!bg-lime !border-ink !font-extrabold' : ''
          }`}
        >
          {isFree ? '🎁 ÜCRETSİZ OYUN' : genreLabel}
        </span>

        {/* Discount Stamp (Bottom-Right) */}
        <strong className="discount-stamp">
          {isFree ? '0.00$' : `−${Math.round(deal.savingsPercentage)}%`}
        </strong>
      </Link>

      {/* Body Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Monospace Metadata */}
          <div className="flex items-center gap-2 text-[10px] font-mono text-muted uppercase tracking-mono mb-1.5">
            <span className="font-semibold text-ink">{storeLabel}</span>
            <span>·</span>
            <span>
              {(deal.steamRatingPercent || 0) > 0
                ? `%${deal.steamRatingPercent} ONAY`
                : 'EDİTORYAL SEÇKİ'}
            </span>
          </div>

          {/* Title */}
          <Link href={`/deal/${deal.slug}`} className="block">
            <h3 className="font-extrabold text-base text-ink group-hover:text-ink leading-tight line-clamp-1 tracking-tight">
              {deal.title}
            </h3>
          </Link>

          {/* Short Description */}
          <p className="text-xs text-muted font-sans line-clamp-2 leading-relaxed mt-1.5">
            {deal.detailedDescription?.slice(0, 120) ||
              deal.shortDescription?.slice(0, 120) ||
              `${deal.title}, ${deal.storeName || 'dijital'} mağazasında resmi indirim ve avantajlı teklifle sunulmaktadır.`}
          </p>
        </div>

        {/* Footer: Price Line & Circle Link */}
        <footer className="pt-3 border-t border-line flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            {deal.normalPrice > 0 && (
              <del className="text-xs text-muted font-mono line-through font-medium">
                ${deal.normalPrice.toFixed(2)}
              </del>
            )}
            <b
              className={`font-black text-lg tracking-tight ${
                isFree ? 'text-ink bg-lime px-1.5 py-0.5 rounded-[2px]' : 'text-ink'
              }`}
            >
              {isFree ? 'ÜCRETSİZ' : `$${deal.salePrice.toFixed(2)}`}
            </b>
          </div>

          <Link
            href={`/deal/${deal.slug}`}
            className="circle-link"
            aria-label={`${deal.title} detaylarını incele`}
          >
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </footer>
      </div>
    </article>
  );
}
