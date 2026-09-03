'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ThumbsUp, Sparkles, TrendingDown, ArrowRight } from 'lucide-react';
import { Deal } from '@/lib/types';

interface DealCardProps {
  deal: Deal;
}

export default function DealCard({ deal }: DealCardProps) {
  const isHighDiscount = deal.savingsPercentage >= 70;
  const isTopRated = deal.steamRatingPercent >= 85;

  return (
    <div className="group relative rounded-xl bg-steam-card border border-steam-accent/50 hover:border-steam-blue transition-all duration-300 hover:shadow-xl hover:shadow-steam-blue/10 flex flex-col overflow-hidden">
      {/* Top Image & Badges */}
      <Link href={`/deal/${deal.slug}`} className="relative block aspect-[16/9] w-full overflow-hidden bg-steam-darker">
        <Image
          src={deal.headerImage || deal.capsuleImage || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f'}
          alt={deal.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Discount Badge */}
        <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-steam-discount text-steam-green font-black text-sm shadow-lg backdrop-blur-sm border border-steam-green/30">
          <TrendingDown className="w-4 h-4" />
          <span>-%{Math.round(deal.savingsPercentage)}</span>
        </div>

        {/* Historical low or hot badge */}
        {isHighDiscount && (
          <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-600/90 text-white font-bold text-[11px] uppercase tracking-wider shadow">
            <Sparkles className="w-3 h-3" />
            Dev İndirim
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Genres */}
          {deal.genres && deal.genres.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {deal.genres.slice(0, 2).map((genre) => (
                <span
                  key={genre}
                  className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-steam-accent/40 text-steam-blue border border-steam-accent/60"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <Link href={`/deal/${deal.slug}`} className="block">
            <h3 className="font-bold text-white group-hover:text-steam-blue transition-colors line-clamp-1 text-base">
              {deal.title}
            </h3>
          </Link>

          {/* Steam Rating */}
          <div className="mt-2 flex items-center gap-2 text-xs">
            {deal.steamRatingPercent > 0 ? (
              <span
                className={`flex items-center gap-1 font-semibold ${
                  isTopRated ? 'text-steam-blue' : 'text-gray-300'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                %{deal.steamRatingPercent}{' '}
                <span className="text-gray-400 font-normal">
                  ({deal.steamRatingText || 'Olumlu'})
                </span>
              </span>
            ) : (
              <span className="text-gray-400">Steam İncelemesi</span>
            )}
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-4 pt-3 border-t border-steam-accent/40 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 line-through">
              ${deal.normalPrice.toFixed(2)}
            </span>
            <span className="text-lg font-black text-white">
              ${deal.salePrice.toFixed(2)}
            </span>
          </div>

          <Link
            href={`/deal/${deal.slug}`}
            className="px-3.5 py-1.5 rounded-lg bg-steam-accent/60 hover:bg-steam-blue hover:text-steam-darker text-steam-blue font-bold text-xs transition-all flex items-center gap-1 shadow-sm"
          >
            İncele
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
