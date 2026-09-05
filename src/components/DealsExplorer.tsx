'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
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

  // Spotlight Deal (Weekly highlight or Free Game)
  const spotlightDeal =
    deals.find((d) => d.isFree || d.salePrice === 0) ||
    deals.find((d) => d.savingsPercentage >= 75) ||
    deals[0];

  return (
    <div className="space-y-20">
      {/* Hero Section: Monumental Architectural Typography + Signature Iridescent Gradient Sphere */}
      <section className="relative min-h-[78vh] flex flex-col justify-between pt-12 pb-10 border-b border-ash overflow-hidden">
        {/* Iridescent Gradient Sphere (The Only Chromatic Element on the Page) */}
        <div
          className="hero-iridescent-sphere top-[-5%] right-[2%] md:right-[10%]"
          aria-hidden="true"
        />

        {/* Concentric Circle Ornaments (Hairline Architecture) */}
        <div
          className="concentric-circle w-[680px] h-[680px] top-[-12%] right-[2%]"
          aria-hidden="true"
        />
        <div
          className="concentric-circle w-[960px] h-[960px] top-[-25%] right-[-6%]"
          aria-hidden="true"
        />

        {/* Top Section Label */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="section-label flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block animate-pulse" />
            SOCIAERA DISPATCH // CANLI OYUN & İNDİRİM ARŞİVİ
          </span>
          <span className="section-label hidden sm:inline-block">
            VOL. 2026 // EDİTORYAL
          </span>
        </div>

        {/* Monumental Display Headline + Spotlight Grid */}
        <div className="relative z-10 my-auto py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-6">
            <h1 className="display-headline select-none">
              DİJİTAL OYUN<br />
              DÜNYASININ MİMARİ<br />
              İNDİRİM ARŞİVİ.
            </h1>
            <p className="text-body max-w-xl text-ink/80 leading-relaxed font-normal">
              Steam, Epic Games, GOG ve Humble Store üzerindeki fiyat dalgalanmalarını, tarihi dip seviyeleri ve haftalık ücretsiz dağıtımları belgeleyen bağımsız dijital keşif yayını.
            </p>
          </div>

          {/* Hero Spotlight Card (Visual proof of live gaming data) */}
          {spotlightDeal && (
            <div className="lg:col-span-4 grid-paper border border-ink p-6 rounded-cards space-y-4 relative z-10 bg-paper">
              <div className="flex items-center justify-between pb-2 border-b border-ash">
                <span className="section-label">
                  GÜNÜN EDİTORYAL SEÇKİSİ
                </span>
                <span className="section-label font-bold text-ink">
                  {spotlightDeal.salePrice === 0
                    ? '100% ÜCRETSİZ'
                    : `−%${Math.round(spotlightDeal.savingsPercentage)}`}
                </span>
              </div>

              <Link
                href={`/deal/${spotlightDeal.slug}`}
                className="block relative aspect-[16/9] w-full overflow-hidden bg-parchment border border-ash group"
              >
                <img
                  src={spotlightDeal.headerImage}
                  alt={spotlightDeal.title}
                  className="w-full h-full object-cover saturate-[0.95] contrast-[1.05] group-hover:scale-105 transition-transform duration-500 block"
                />
              </Link>

              <div>
                <h3 className="font-normal text-body text-ink line-clamp-1 leading-snug">
                  {spotlightDeal.title}
                </h3>
                <span className="section-label text-ink/60 block mt-1">
                  PLATFORM: {(spotlightDeal.storeName || 'STEAM').toUpperCase()}
                </span>
              </div>

              <div className="pt-3 border-t border-ash flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  {spotlightDeal.normalPrice > 0 && (
                    <span className="text-caption text-ash line-through">
                      ${spotlightDeal.normalPrice.toFixed(2)}
                    </span>
                  )}
                  <span className="text-body font-bold text-ink">
                    {spotlightDeal.salePrice === 0 ? 'ÜCRETSİZ' : `$${spotlightDeal.salePrice.toFixed(2)}`}
                  </span>
                </div>
                <Link
                  href={`/deal/${spotlightDeal.slug}`}
                  className="ghost-link text-caption uppercase font-medium"
                >
                  KAYDI AÇ &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Hero Footer Prompt */}
        <div className="relative z-10 flex items-center justify-between pt-4 border-t border-ash">
          <span className="section-label">
            DOĞRULANMIŞ STEAM, EPIC GAMES, GOG & HUMBLE VERİLERİ
          </span>
          <a href="#filters" className="section-label hover:underline">
            AŞAĞI KAYDIRIN &darr;
          </a>
        </div>
      </section>

      {/* Institutional Statement / Founder Block */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-10 py-8 border-b border-ash">
        <div className="md:col-span-4 space-y-3">
          <span className="section-label block">
            SOCIAERA MANİFESTOSU // İLKELER
          </span>
          <span className="text-caption text-ink/60 block">
            TİCARİ REKLAM VE GÜRÜLTÜDEN ARINDIRILMIŞ DİJİTAL SEÇKİ
          </span>
        </div>
        <div className="md:col-span-8 space-y-5">
          <p className="text-body leading-[1.40] font-normal text-ink max-w-2xl">
            Sociaera; reklam baskısı, sponsorlu yönlendirmeler ve göz yoran afişler olmadan, yalnızca matematiksel fiyat avantajlarını ve kaliteli yapımları belgelemek için kurulmuş editoryal bir veri mimarisidir.
          </p>
          <div className="flex flex-wrap items-center gap-6 pt-1">
            <span className="section-label">
              TOPLAM ARŞİV: {total} OYUN
            </span>
            <span className="section-label text-ash">//</span>
            <button
              onClick={handleSyncNow}
              disabled={syncing}
              className="ghost-link text-caption uppercase font-medium"
            >
              {syncing ? 'VERİLER EŞİTLENİYOR...' : 'ARŞİVİ CANLI GÜNCELLE &rarr;'}
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Storefront Grid (1x4 Luxury Cells) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="section-label">
            ARŞİVLENEN DİJİTAL MAĞAZALAR
          </span>
          <span className="section-label text-ink/60">
            FİLTRELEMEK İÇİN TIKLAYIN
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 border border-ash bg-paper">
          <button
            onClick={() => handleFilterChange(() => setSelectedStore(selectedStore === 'steam' ? 'all' : 'steam'))}
            className={`p-8 border-r border-b md:border-b-0 border-ash flex flex-col items-center justify-center transition-all ${
              selectedStore === 'steam' ? 'bg-ink text-parchment' : 'hover:bg-parchment text-ink'
            }`}
          >
            <span className="font-mono text-body-sm tracking-wider uppercase font-bold">STEAM</span>
            <span className="text-[10px] uppercase font-mono tracking-widest opacity-60 mt-1">BÖLGESEL TR-USD</span>
          </button>

          <button
            onClick={() => handleFilterChange(() => setSelectedStore(selectedStore === 'epic' ? 'all' : 'epic'))}
            className={`p-8 border-b md:border-b-0 md:border-r border-ash flex flex-col items-center justify-center transition-all ${
              selectedStore === 'epic' ? 'bg-ink text-parchment' : 'hover:bg-parchment text-ink'
            }`}
          >
            <span className="font-mono text-body-sm tracking-wider uppercase font-bold">EPIC GAMES</span>
            <span className="text-[10px] uppercase font-mono tracking-widest opacity-60 mt-1">HAFTALIK HEDİYELER</span>
          </button>

          <button
            onClick={() => handleFilterChange(() => setSelectedStore(selectedStore === 'gog' ? 'all' : 'gog'))}
            className={`p-8 border-r border-ash flex flex-col items-center justify-center transition-all ${
              selectedStore === 'gog' ? 'bg-ink text-parchment' : 'hover:bg-parchment text-ink'
            }`}
          >
            <span className="font-mono text-body-sm tracking-wider uppercase font-bold">GOG.COM</span>
            <span className="text-[10px] uppercase font-mono tracking-widest opacity-60 mt-1">DRM-FREE LİSANSLAR</span>
          </button>

          <button
            onClick={() => handleFilterChange(() => setSelectedStore(selectedStore === 'humble' ? 'all' : 'humble'))}
            className={`p-8 flex flex-col items-center justify-center transition-all ${
              selectedStore === 'humble' ? 'bg-ink text-parchment' : 'hover:bg-parchment text-ink'
            }`}
          >
            <span className="font-mono text-body-sm tracking-wider uppercase font-bold">HUMBLE STORE</span>
            <span className="text-[10px] uppercase font-mono tracking-widest opacity-60 mt-1">ÖZEL PAKETLER</span>
          </button>
        </div>
      </section>

      {/* Filter Section: 10px Pill Ghost Buttons */}
      <section id="filters" className="space-y-6 pt-4">
        <div className="flex items-center justify-between pb-3 border-b border-ash">
          <span className="section-label font-medium">
            EDİTORYAL FİLTRELEME SİSTEMİ
          </span>
          <span className="section-label">
            LİSTELENEN: {deals.length} / {total}
          </span>
        </div>

        {/* Pill Ghost Filters (10px Radius) */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => handleFilterChange(() => setSelectedStore('all'))}
            className={`filter-button ${selectedStore === 'all' ? 'is-active' : ''}`}
          >
            TÜM ARŞİV ({total}) &rarr;
          </button>

          <button
            onClick={() => handleFilterChange(() => setSelectedStore('free'))}
            className={`filter-button ${selectedStore === 'free' ? 'is-active' : ''}`}
          >
            🎁 100% ÜCRETSİZ OYUNLAR &rarr;
          </button>

          <button
            onClick={() => handleFilterChange(() => setSelectedStore('steam'))}
            className={`filter-button ${selectedStore === 'steam' ? 'is-active' : ''}`}
          >
            STEAM &rarr;
          </button>

          <button
            onClick={() => handleFilterChange(() => setSelectedStore('epic'))}
            className={`filter-button ${selectedStore === 'epic' ? 'is-active' : ''}`}
          >
            EPIC GAMES &rarr;
          </button>

          <button
            onClick={() => handleFilterChange(() => setSelectedStore('gog'))}
            className={`filter-button ${selectedStore === 'gog' ? 'is-active' : ''}`}
          >
            GOG &rarr;
          </button>

          <button
            onClick={() => handleFilterChange(() => setSelectedStore('humble'))}
            className={`filter-button ${selectedStore === 'humble' ? 'is-active' : ''}`}
          >
            HUMBLE STORE &rarr;
          </button>
        </div>

        {/* Minimal Search & Sort Controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-1">
          <div className="md:col-span-6">
            <input
              type="text"
              placeholder="OYUN ADI, YAYINCI VEYA ANAHTAR KELİME ARA..."
              value={search}
              onChange={(e) => handleFilterChange(() => setSearch(e.target.value))}
              className="w-full px-4 py-2.5 rounded-inputs bg-paper border border-ash text-ink placeholder-ash text-caption uppercase tracking-wider focus:outline-none focus:border-ink transition-colors"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={category}
              onChange={(e) => handleFilterChange(() => setCategory(e.target.value))}
              aria-label="Kategori"
              className="w-full px-4 py-2.5 rounded-inputs bg-paper border border-ash text-ink text-caption uppercase tracking-wider focus:outline-none focus:border-ink transition-colors"
            >
              <option value="all">TÜM KATEGORİLER</option>
              <option value="action">AKSİYON</option>
              <option value="rpg">RPG / ROL YAPMA</option>
              <option value="strategy">STRATEJİ</option>
              <option value="adventure">MACERA</option>
              <option value="indie">BAĞIMSIZ (INDIE)</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => handleFilterChange(() => setSortBy(e.target.value as any))}
              aria-label="Sıralama"
              className="w-full px-4 py-2.5 rounded-inputs bg-paper border border-ash text-ink text-caption uppercase tracking-wider focus:outline-none focus:border-ink transition-colors"
            >
              <option value="savings">EN YÜKSEK İNDİRİM ORANI</option>
              <option value="rating">TOPLULUK PUANI</option>
              <option value="price_asc">FİYAT: DÜŞÜKTEN YÜKSEĞE</option>
              <option value="price_desc">FİYAT: YÜKSEKTEN DÜŞÜĞE</option>
              <option value="newest">EN YENİ ARŞİVLENENLER</option>
            </select>
          </div>
        </div>
      </section>

      {/* Grid Showcase of Project / Deal Tiles */}
      <section className="space-y-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="grid-paper border border-ash rounded-cards aspect-[4/5] animate-pulse"
              />
            ))}
          </div>
        ) : deals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        ) : (
          <div className="p-16 border border-ash bg-paper text-center space-y-4">
            <span className="section-label block">EŞLEŞEN KAYIT BULUNAMADI</span>
            <p className="text-body-sm text-ink/60 max-w-md mx-auto">
              Seçilen kriterlere uygun indirim bulunamadı. Filtreleri sıfırlayarak tüm arşivi görüntüleyebilirsiniz.
            </p>
            <button
              onClick={() => {
                setSelectedStore('all');
                setSearch('');
                setCategory('all');
                setHasFiltered(true);
              }}
              className="filter-button"
            >
              PARAMETRELERİ SIFIRLA &rarr;
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
