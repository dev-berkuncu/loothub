'use client';

import Link from 'next/link';
import { Deal } from '@/lib/types';

interface DealCardProps {
  deal: Deal;
}

export default function DealCard({ deal }: DealCardProps) {
  const isFree = deal.isFree || deal.salePrice === 0;
  const storeLabel = (deal.storeName || deal.store || 'STEAM').toUpperCase();
  const genreLabel = deal.genres?.[0] ? deal.genres[0].toUpperCase() : 'GAME';

  return (
    <article className="grid-paper border border-ash rounded-cards p-6 flex flex-col justify-between transition-colors duration-200 hover:border-ink group">
      {/* Top Header Label */}
      <div className="flex items-center justify-between pb-3 border-b border-ash mb-4">
        <span className="section-label">
          {storeLabel} // {isFree ? 'FREE RELEASE' : genreLabel}
        </span>
        <span className="section-label font-medium">
          {isFree ? '100% DISCOUNT' : `−${Math.round(deal.savingsPercentage)}%`}
        </span>
      </div>

      {/* Visual Tile (0px Sharp) */}
      <Link href={`/deal/${deal.slug}`} className="block relative aspect-[16/9] w-full overflow-hidden bg-parchment border border-ash mb-4">
        <img
          src={deal.headerImage || deal.capsuleImage || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f'}
          alt={deal.title}
          className="w-full h-full object-cover grayscale contrast-[1.08] group-hover:grayscale-0 transition-all duration-500 block"
          loading="lazy"
        />
      </Link>

      {/* Card Body */}
      <div className="space-y-3 flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/deal/${deal.slug}`} className="block">
            <h3 className="font-normal text-body text-ink line-clamp-1 leading-snug group-hover:underline">
              {deal.title}
            </h3>
          </Link>

          <p className="text-body-sm text-ink/70 line-clamp-2 mt-2 leading-relaxed">
            {deal.detailedDescription?.slice(0, 110) ||
              deal.shortDescription?.slice(0, 110) ||
              `${deal.title} is currently archived under verified promotion standards.`}
          </p>
        </div>

        {/* Price & Ghost Link Row */}
        <div className="pt-4 border-t border-ash flex items-center justify-between mt-4">
          <div className="flex items-baseline gap-2">
            {deal.normalPrice > 0 && (
              <span className="text-caption text-ash line-through font-normal">
                ${deal.normalPrice.toFixed(2)}
              </span>
            )}
            <span className="font-normal text-body text-ink">
              {isFree ? 'FREE' : `$${deal.salePrice.toFixed(2)}`}
            </span>
          </div>

          <Link
            href={`/deal/${deal.slug}`}
            className="ghost-link text-caption uppercase"
            aria-label={`${deal.title} details`}
          >
            VIEW RECORD &rarr;
          </Link>
        </div>
      </div>
    </article>
  );
}
