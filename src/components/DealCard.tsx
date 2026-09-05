'use client';

import Link from 'next/link';
import { Deal } from '@/lib/types';

interface DealCardProps {
  deal: Deal;
}

export default function DealCard({ deal }: DealCardProps) {
  const isFree = deal.isFree || deal.salePrice === 0;
  const storeLabel = (deal.storeName || deal.store || 'STEAM').toUpperCase();
  const genreLabel = deal.genres?.[0] ? deal.genres[0].toUpperCase() : 'OYUN';

  return (
    <article className="grid-paper border border-ash rounded-cards p-6 flex flex-col justify-between transition-all duration-300 hover:border-ink group">
      {/* Top Header Label */}
      <div className="flex items-center justify-between pb-3 border-b border-ash mb-4">
        <span className="section-label flex items-center gap-1.5 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-ink inline-block" />
          {storeLabel} // {genreLabel}
        </span>
        <span className="section-label font-bold text-ink tracking-wider">
          {isFree ? '100% ÜCRETSİZ' : `−${Math.round(deal.savingsPercentage)}%`}
        </span>
      </div>

      {/* Visual Tile (0px Sharp Hairline Frame) */}
      <Link
        href={`/deal/${deal.slug}`}
        className="block relative aspect-[16/9] w-full overflow-hidden bg-parchment border border-ash mb-4"
      >
        <img
          src={deal.headerImage || deal.capsuleImage || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f'}
          alt={deal.title}
          className="w-full h-full object-cover saturate-[0.95] contrast-[1.05] group-hover:scale-105 group-hover:saturate-100 transition-all duration-500 block"
          loading="lazy"
        />
        {isFree && (
          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-paper border border-ink text-ink font-mono text-[9px] uppercase tracking-wider font-bold">
            0.00 TL / HEDİYE
          </div>
        )}
      </Link>

      {/* Card Body */}
      <div className="space-y-3 flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/deal/${deal.slug}`} className="block">
            <h3 className="font-medium text-body text-ink line-clamp-1 leading-snug group-hover:underline tracking-tight">
              {deal.title}
            </h3>
          </Link>

          {/* Micro community verification */}
          <div className="flex items-center gap-3 mt-1 text-[11px] font-mono text-ink/60 uppercase">
            {(deal.steamRatingPercent || 0) > 0 ? (
              <span>%{deal.steamRatingPercent} Topluluk Onayı</span>
            ) : (
              <span>Doğrulanmış Fırsat</span>
            )}
            <span>·</span>
            <span>{deal.publisher || storeLabel}</span>
          </div>

          <p className="text-body-sm text-ink/70 line-clamp-2 mt-2 leading-relaxed">
            {deal.detailedDescription?.slice(0, 115) ||
              deal.shortDescription?.slice(0, 115) ||
              `${deal.title}, ${deal.storeName || 'resmi'} mağazasında doğrulanmış indirimle arşivlenmiştir.`}
          </p>
        </div>

        {/* Price & Ghost Link Row */}
        <div className="pt-4 border-t border-ash flex items-center justify-between mt-4">
          <div className="flex items-baseline gap-2.5">
            {deal.normalPrice > 0 && (
              <span className="text-caption text-ash line-through font-normal">
                ${deal.normalPrice.toFixed(2)}
              </span>
            )}
            <span className="font-bold text-body text-ink">
              {isFree ? 'ÜCRETSİZ' : `$${deal.salePrice.toFixed(2)}`}
            </span>
          </div>

          <Link
            href={`/deal/${deal.slug}`}
            className="ghost-link text-caption uppercase tracking-wider font-medium"
            aria-label={`${deal.title} incele`}
          >
            KAYDI İNCELE &rarr;
          </Link>
        </div>
      </div>
    </article>
  );
}
