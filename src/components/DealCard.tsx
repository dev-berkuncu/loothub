'use client';

import Link from 'next/link';
import { ThumbsUp, Sparkles, TrendingDown, ArrowRight, Gift } from 'lucide-react';
import { Deal } from '@/lib/types';

interface DealCardProps {
  deal: Deal;
}

const STORE_BADGES: Record<string, { label: string; bg: string; text: string; border: string }> = {
  steam: {
    label: 'Steam',
    bg: 'bg-sky-950/80',
    text: 'text-sky-300',
    border: 'border-sky-500/40',
  },
  epic: {
    label: 'Epic Games',
    bg: 'bg-zinc-900/90',
    text: 'text-zinc-100',
    border: 'border-zinc-500/50',
  },
  gog: {
    label: 'GOG',
    bg: 'bg-purple-950/80',
    text: 'text-purple-300',
    border: 'border-purple-500/40',
  },
  humble: {
    label: 'Humble',
    bg: 'bg-rose-950/80',
    text: 'text-rose-300',
    border: 'border-rose-500/40',
  },
};

export default function DealCard({ deal }: DealCardProps) {
  const isFree = deal.isFree || deal.salePrice === 0;
  const isHighDiscount = deal.savingsPercentage >= 70;
  const isTopRated = (deal.steamRatingPercent || 0) >= 85;
  const storeBadge = STORE_BADGES[deal.store] || STORE_BADGES.steam;

  return (
    <div className="group relative rounded-xl bg-steam-card border border-steam-accent/50 hover:border-steam-blue transition-all duration-300 hover:shadow-xl hover:shadow-steam-blue/10 flex flex-col overflow-hidden">
      {/* Top Image & Badges */}
      <Link href={`/deal/${deal.slug}`} className="relative block w-full overflow-hidden bg-steam-darker">
        <div className="w-full aspect-[16/9] overflow-hidden bg-steam-darker">
          <img
            src={deal.headerImage || deal.capsuleImage || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f'}
            alt={deal.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 block"
            loading="lazy"
          />
        </div>

        {/* Store Badge (Top Left) */}
        <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5">
          <span
            className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider shadow backdrop-blur-sm border ${storeBadge.bg} ${storeBadge.text} ${storeBadge.border}`}
          >
            {storeBadge.label}
          </span>

          {isFree ? (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500 text-steam-darker font-black text-[11px] uppercase tracking-wider shadow glow-green animate-pulse">
              <Gift className="w-3 h-3" />
              Ücretsiz
            </span>
          ) : isHighDiscount ? (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-600/90 text-white font-bold text-[11px] uppercase tracking-wider shadow">
              <Sparkles className="w-3 h-3" />
              Dev İndirim
            </span>
          ) : null}
        </div>

        {/* Discount Badge (Top Right) */}
        <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-steam-discount text-steam-green font-black text-sm shadow-lg backdrop-blur-sm border border-steam-green/30">
          <TrendingDown className="w-4 h-4" />
          <span>-%{Math.round(deal.savingsPercentage)}</span>
        </div>
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

          {/* Community Rating */}
          <div className="mt-2 flex items-center gap-2 text-xs">
            {(deal.steamRatingPercent || 0) > 0 ? (
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
              <span className="text-gray-400">{deal.storeName} Fırsatı</span>
            )}
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-4 pt-3 border-t border-steam-accent/40 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 line-through">
              ${deal.normalPrice.toFixed(2)}
            </span>
            <span className={`font-black text-lg ${isFree ? 'text-emerald-400' : 'text-white'}`}>
              {isFree ? 'ÜCRETSİZ' : `$${deal.salePrice.toFixed(2)}`}
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
