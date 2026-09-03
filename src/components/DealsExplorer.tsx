'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Search,
  ArrowRight,
  ArrowUpRight,
  Radio,
  RefreshCw,
  Gift,
  Flame,
  Zap,
} from 'lucide-react';
import DealCard from '@/components/DealCard';
import { Deal } from '@/lib/types';

interface DealsExplorerProps {
  initialDeals: Deal[];
  initialTotal: number;
}

export default function DealsExplorer({ initialDeals, initialTotal }: DealsExplorerProps) {
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [hasFiltered, setHasFiltered] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedStore, setSelectedStore] = useState<'all' | 'free' | 'steam' | 'epic' | 'gog' | 'humble'>('all');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'savings' | 'price_asc' | 'price_desc' | 'rating' | 'newest'>('savings');

  const fetchDeals = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (category !== 'all') params.set('category', category);
      if (sortBy) params.set('sortBy', sortBy);

      if (selectedStore !== 'all') {
        params.set('store', selectedStore);
      }

      params.set('limit', '36');

      const res = await fetch(`/api/deals?${params.toString()}`);
      const data = await res.json();
      setDeals(data.deals || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setLoading(false);
    }
  }, [search, selectedStore, category, sortBy]);

  useEffect(() => {
    if (hasFiltered) {
      fetchDeals();
    }
  }, [fetchDeals, hasFiltered]);

  const handleFilterChange = (setter: () => void) => {
    setHasFiltered(true);
    setter();
  };

  const handleSyncNow = async () => {
    setSyncing(true);
    try {
      const res = await fetch('/api/deals/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit: 45 }),
      });
      const data = await res.json();
      if (data.success) {
        setHasFiltered(true);
        await fetchDeals();
      }
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setSyncing(false);
    }
  };

  // Spotlight Deal
  const spotlightDeal =
    deals.find((d) => d.isFree || d.salePrice === 0) ||
    deals.find((d) => d.savingsPercentage >= 70) ||
    deals[0];

  // Top 3 for the Dispatch Board
  const boardDeals = deals.filter((d) => d.id !== spotlightDeal?.id).slice(0, 3);

  return (
    <div className="space-y-12">
      {/* Editorial Hero Spotlight + Dispatch Board (Canlı Hat Pano) */}
      {spotlightDeal && !search && selectedStore === 'all' && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Main Editorial Spotlight (Col 8) */}
          <div className="lg:col-span-8 rounded-[var(--radius)] border border-ink bg-white/60 p-6 md:p-8 flex flex-col justify-between relative overflow-hidden shadow-sm">
            <div className="space-y-4">
              {/* Eyebrow & Badges */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-[10px] uppercase tracking-mono text-ink font-bold bg-lime px-2 py-1 rounded-[2px] border border-ink flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-ink" />
                  GÜNÜN MANŞETİ
                </span>
                <span className="font-mono text-[10px] uppercase tracking-mono text-muted">
                  {spotlightDeal.storeName || 'STEAM'} · EDİTORYAL RAPOR
                </span>
                <span className="font-mono text-[10px] uppercase tracking-mono text-ink font-bold ml-auto border border-ink px-2 py-0.5 rounded-[2px]">
                  {spotlightDeal.salePrice === 0
                    ? 'ÜCRETSİZ'
                    : `−%${Math.round(spotlightDeal.savingsPercentage)}`}
                </span>
              </div>

              {/* Huge Display Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-ink tracking-tighter leading-[0.95]">
                {spotlightDeal.title}
              </h1>

              {/* Editorial Description */}
              <p className="text-sm md:text-base text-muted font-sans line-clamp-3 leading-relaxed max-w-2xl">
                {spotlightDeal.shortDescription ||
                  `${spotlightDeal.title}, dijital platformlarda haftanın en dikkat çeken fırsatları arasında öne çıkıyor.`}
              </p>

              {/* Spotlight Image */}
              <div className="relative aspect-[21/9] w-full overflow-hidden rounded-[2px] border border-line bg-paper-deep my-4">
                <img
                  src={spotlightDeal.headerImage}
                  alt={spotlightDeal.title}
                  className="w-full h-full object-cover saturate-[0.9] contrast-[1.04]"
                />
              </div>
            </div>

            {/* Bottom Pricing & CTA */}
            <div className="pt-4 border-t border-line flex flex-wrap items-center justify-between gap-4 mt-2">
              <div className="flex items-baseline gap-3">
                {spotlightDeal.normalPrice > 0 && (
                  <del className="text-sm text-muted font-mono line-through font-medium">
                    ${spotlightDeal.normalPrice.toFixed(2)}
                  </del>
                )}
                <b className="text-3xl font-black text-ink tracking-tight font-sans">
                  {spotlightDeal.salePrice === 0 ? 'ÜCRETSİZ' : `$${spotlightDeal.salePrice.toFixed(2)}`}
                </b>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href={`/deal/${spotlightDeal.slug}`}
                  className="px-5 py-2.5 rounded-[var(--radius)] bg-ink hover:bg-lime text-paper hover:text-ink font-sans font-extrabold text-xs uppercase tracking-wider transition-all duration-200 border border-ink flex items-center gap-2 shadow-sm"
                >
                  Raporu Oku & Al
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Dispatch Board (Canlı Hat Panosu - Col 4) */}
          <aside className="lg:col-span-4 rounded-[var(--radius)] border border-ink bg-paper-deep p-6 flex flex-col justify-between">
            <div>
              <header className="flex items-center justify-between pb-4 border-b border-line mb-4">
                <span className="font-mono text-[11px] uppercase tracking-mono text-ink font-bold flex items-center gap-2">
                  <Radio className="w-3.5 h-3.5 text-orange animate-pulse" />
                  CANLI HAT (DISPATCH)
                </span>
                <span className="font-mono text-[10px] text-muted uppercase">SON 24 SAAT</span>
              </header>

              <div className="space-y-4">
                {boardDeals.map((item, index) => (
                  <Link
                    key={item.id}
                    href={`/deal/${item.slug}`}
                    className="group block p-3 rounded-[var(--radius)] bg-paper border border-line hover:border-ink hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <span className="font-mono font-bold text-xs text-muted group-hover:text-ink">
                        0{index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <small className="font-mono text-[9px] uppercase tracking-mono text-muted block mb-0.5">
                          {item.storeName || 'STEAM'} · {item.genres?.[0] || 'FIRSAT'}
                        </small>
                        <h4 className="font-sans font-extrabold text-xs text-ink group-hover:underline line-clamp-1 leading-snug">
                          {item.title}
                        </h4>
                      </div>
                      <b className="font-mono text-xs font-bold text-ink shrink-0">
                        {item.salePrice === 0
                          ? 'ÜCRETSİZ'
                          : `−%${Math.round(item.savingsPercentage)}`}
                      </b>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-line mt-6 flex items-center justify-between">
              <span className="font-mono text-[10px] text-muted uppercase">
                {total} AKTİF İNDİRİM
              </span>
              <button
                onClick={handleSyncNow}
                disabled={syncing}
                className="font-mono text-[10px] uppercase tracking-mono text-ink font-bold hover:underline flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3 h-3 ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? 'TARANIYOR' : 'YENİLE'}
              </button>
            </div>
          </aside>
        </section>
      )}

      {/* Filter Row & Controls (Filtre Çipleri) */}
      <section id="filtreler" className="space-y-6 pt-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-4 border-b border-ink/20">
          {/* Store Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleFilterChange(() => setSelectedStore('all'))}
              className={`filter-chip ${selectedStore === 'all' ? 'is-active' : ''}`}
            >
              TÜMÜ <span>{total}</span>
            </button>

            <button
              onClick={() => handleFilterChange(() => setSelectedStore('free'))}
              className={`filter-chip ${selectedStore === 'free' ? 'is-active' : ''}`}
            >
              <Gift className="w-3.5 h-3.5 text-orange" />
              ÜCRETSİZ OYUNLAR
            </button>

            <button
              onClick={() => handleFilterChange(() => setSelectedStore('steam'))}
              className={`filter-chip ${selectedStore === 'steam' ? 'is-active' : ''}`}
            >
              STEAM
            </button>

            <button
              onClick={() => handleFilterChange(() => setSelectedStore('epic'))}
              className={`filter-chip ${selectedStore === 'epic' ? 'is-active' : ''}`}
            >
              EPIC GAMES
            </button>

            <button
              onClick={() => handleFilterChange(() => setSelectedStore('gog'))}
              className={`filter-chip ${selectedStore === 'gog' ? 'is-active' : ''}`}
            >
              GOG
            </button>

            <button
              onClick={() => handleFilterChange(() => setSelectedStore('humble'))}
              className={`filter-chip ${selectedStore === 'humble' ? 'is-active' : ''}`}
            >
              HUMBLE STORE
            </button>
          </div>

          {/* Sync Trigger */}
          <button
            onClick={handleSyncNow}
            disabled={syncing}
            className="px-3.5 py-2 rounded-[var(--radius)] border border-line hover:border-ink bg-paper text-ink font-mono text-[10px] uppercase tracking-mono font-medium flex items-center justify-center gap-2 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'TARANIYOR...' : 'CANLI VERİ ÇEK'}
          </button>
        </div>

        {/* Search & Sort Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 rounded-[var(--radius)] border border-line bg-white/40">
          {/* Search Box */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Oyun veya yapımcı ara..."
              value={search}
              onChange={(e) => handleFilterChange(() => setSearch(e.target.value))}
              className="w-full pl-10 pr-4 py-2 rounded-[var(--radius)] bg-paper border border-line text-ink placeholder-muted text-xs font-mono focus:outline-none focus:border-ink transition-colors"
            />
          </div>

          {/* Category Select */}
          <div className="md:col-span-3">
            <select
              value={category}
              onChange={(e) => handleFilterChange(() => setCategory(e.target.value))}
              aria-label="Kategori Seç"
              className="w-full px-3 py-2 rounded-[var(--radius)] bg-paper border border-line text-ink text-xs font-mono uppercase focus:outline-none focus:border-ink transition-colors"
            >
              <option value="all">Tüm Kategoriler</option>
              <option value="action">Aksiyon</option>
              <option value="rpg">RPG / Rol Yapma</option>
              <option value="strategy">Strateji</option>
              <option value="adventure">Macera</option>
              <option value="indie">Bağımsız (Indie)</option>
              <option value="multiplayer">Çok Oyunculu</option>
            </select>
          </div>

          {/* Sort Select */}
          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => handleFilterChange(() => setSortBy(e.target.value as any))}
              aria-label="Sıralama Seç"
              className="w-full px-3 py-2 rounded-[var(--radius)] bg-paper border border-line text-ink text-xs font-mono uppercase focus:outline-none focus:border-ink transition-colors"
            >
              <option value="savings">En Yüksek İndirim</option>
              <option value="rating">Topluluk Puanı</option>
              <option value="price_asc">Fiyat: Artan</option>
              <option value="price_desc">Fiyat: Azalan</option>
              <option value="newest">En Yeni İndirimler</option>
            </select>
          </div>
        </div>
      </section>

      {/* Editorial Grid (Dispatch Cards) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-line">
          <h2 className="text-xl md:text-2xl font-extrabold text-ink tracking-tight flex items-center gap-2">
            <span>EDİTORYAL SEÇKİ & FIRSATLAR</span>
            <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-[2px] bg-paper-deep border border-line text-muted">
              {total} KAYIT
            </span>
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-[var(--radius)] border border-line bg-paper-deep aspect-[4/5] animate-pulse"
              />
            ))}
          </div>
        ) : deals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {deals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 px-4 rounded-[var(--radius)] border border-ink/30 bg-paper-deep space-y-4">
            <h3 className="text-lg font-bold text-ink font-mono uppercase">
              SEÇİLEN KRİTERLERE UYGUN FIRSAT BULUNAMADI
            </h3>
            <p className="text-xs text-muted max-w-md mx-auto font-sans">
              Filtreleri sıfırlayabilir veya canlı tarama motorunu tetikleyerek yeni fırsatları çekebilirsiniz.
            </p>
            <button
              onClick={handleSyncNow}
              disabled={syncing}
              className="px-5 py-2.5 rounded-[var(--radius)] bg-ink hover:bg-lime text-paper hover:text-ink font-mono text-xs uppercase tracking-mono font-bold transition-all border border-ink inline-flex items-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'TARANIYOR...' : 'VERİLERİ YENİLE'}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
