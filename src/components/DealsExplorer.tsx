'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  Flame,
  Sparkles,
  TrendingDown,
  Tag,
  ThumbsUp,
  RefreshCw,
  ArrowRight,
  Gamepad2,
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
  const [activeTab, setActiveTab] = useState<'all' | 'high_discount' | 'under_5' | 'top_rated'>('all');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'savings' | 'price_asc' | 'price_desc' | 'rating' | 'newest'>('savings');

  const fetchDeals = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (category !== 'all') params.set('category', category);
      if (sortBy) params.set('sortBy', sortBy);

      if (activeTab === 'high_discount') {
        params.set('minSavings', '70');
      } else if (activeTab === 'under_5') {
        params.set('maxPrice', '5');
      } else if (activeTab === 'top_rated') {
        params.set('minRating', '85');
      }

      params.set('limit', '30');

      const res = await fetch(`/api/deals?${params.toString()}`);
      const data = await res.json();
      setDeals(data.deals || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setLoading(false);
    }
  }, [search, activeTab, category, sortBy]);

  // Only re-fetch if user interacts with filters
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
        body: JSON.stringify({ limit: 40 }),
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

  const featuredDeal = deals.find((d) => d.savingsPercentage >= 65 && d.steamRatingPercent >= 80) || deals[0];

  return (
    <div className="space-y-10">
      {/* Hero Featured Deal (if available) */}
      {featuredDeal && !search && activeTab === 'all' && (
        <section className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-steam-card via-steam-card to-steam-accent/40 border border-steam-blue/30 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center p-6 md:p-8">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-red-600/90 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" />
                  Günün Öne Çıkan Fırsatı
                </span>
                <span className="px-2.5 py-1 rounded-md bg-steam-discount text-steam-green font-black text-sm border border-steam-green/30">
                  -%{Math.round(featuredDeal.savingsPercentage)} İndirim
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                {featuredDeal.title}
              </h1>

              <p className="text-gray-300 text-sm md:text-base line-clamp-2 max-w-2xl leading-relaxed">
                {featuredDeal.shortDescription ||
                  'Kaçırılmayacak indirim oranıyla Steam mağazasında satışta. Detaylı inceleme ve sistem gereksinimleri için tıklayın.'}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm text-gray-400 line-through font-medium">
                    ${featuredDeal.normalPrice.toFixed(2)}
                  </span>
                  <span className="text-3xl font-black text-white">
                    ${featuredDeal.salePrice.toFixed(2)}
                  </span>
                </div>

                {featuredDeal.steamRatingPercent > 0 && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-steam-accent/40 border border-steam-accent text-steam-blue text-xs font-bold">
                    <ThumbsUp className="w-4 h-4" />
                    %{featuredDeal.steamRatingPercent} {featuredDeal.steamRatingText}
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center gap-3">
                <Link
                  href={`/deal/${featuredDeal.slug}`}
                  className="px-6 py-3 rounded-xl bg-steam-blue hover:bg-blue-400 text-steam-darker font-black text-sm transition-all flex items-center gap-2 shadow-lg glow-blue"
                >
                  Detaylı İncele ve Satın Al
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <Link href={`/deal/${featuredDeal.slug}`} className="block relative aspect-[16/9] rounded-xl overflow-hidden shadow-xl group border border-steam-accent">
                <Image
                  src={featuredDeal.headerImage}
                  alt={featuredDeal.title}
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Filter & Search Bar */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Quick Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleFilterChange(() => setActiveTab('all'))}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'all'
                  ? 'bg-steam-blue text-steam-darker font-black shadow-md'
                  : 'bg-steam-card border border-steam-accent/50 text-gray-300 hover:text-white hover:bg-steam-accent/40'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              Tüm Fırsatlar
            </button>

            <button
              onClick={() => handleFilterChange(() => setActiveTab('high_discount'))}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'high_discount'
                  ? 'bg-steam-blue text-steam-darker font-black shadow-md'
                  : 'bg-steam-card border border-steam-accent/50 text-gray-300 hover:text-white hover:bg-steam-accent/40'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              %70+ Dev İndirimler
            </button>

            <button
              onClick={() => handleFilterChange(() => setActiveTab('under_5'))}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'under_5'
                  ? 'bg-steam-blue text-steam-darker font-black shadow-md'
                  : 'bg-steam-card border border-steam-accent/50 text-gray-300 hover:text-white hover:bg-steam-accent/40'
              }`}
            >
              <Tag className="w-3.5 h-3.5 text-green-400" />
              $5 Altı Oyunlar
            </button>

            <button
              onClick={() => handleFilterChange(() => setActiveTab('top_rated'))}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'top_rated'
                  ? 'bg-steam-blue text-steam-darker font-black shadow-md'
                  : 'bg-steam-card border border-steam-accent/50 text-gray-300 hover:text-white hover:bg-steam-accent/40'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5 text-steam-blue" />
              %85+ Çok Olumlu
            </button>
          </div>

          {/* Sync / Refresh Button */}
          <button
            onClick={handleSyncNow}
            disabled={syncing}
            className="px-4 py-2 rounded-xl bg-steam-card hover:bg-steam-accent/60 border border-steam-accent/70 text-steam-blue text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'İndirimler Taranıyor...' : 'İndirimleri Yenile'}
          </button>
        </div>

        {/* Search & Sort Controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 rounded-xl bg-steam-card/70 border border-steam-accent/40">
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Oyun adı veya açıklama ara..."
              value={search}
              onChange={(e) => handleFilterChange(() => setSearch(e.target.value))}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-steam-darker/80 border border-steam-accent/60 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-steam-blue transition-colors"
            />
          </div>

          {/* Category Select */}
          <div className="md:col-span-3">
            <select
              value={category}
              onChange={(e) => handleFilterChange(() => setCategory(e.target.value))}
              aria-label="Oyun Türü Seçin"
              className="w-full px-3 py-2 rounded-lg bg-steam-darker/80 border border-steam-accent/60 text-white text-sm focus:outline-none focus:border-steam-blue transition-colors"
            >
              <option value="all">Tüm Oyun Türleri</option>
              <option value="action">Aksiyon</option>
              <option value="rpg">RPG / Rol Yapma</option>
              <option value="strategy">Strateji</option>
              <option value="adventure">Macera</option>
              <option value="simulation">Simülasyon</option>
              <option value="indie">Bağımsız (Indie)</option>
              <option value="multiplayer">Çok Oyunculu</option>
            </select>
          </div>

          {/* Sort Select */}
          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => handleFilterChange(() => setSortBy(e.target.value as any))}
              aria-label="Sıralama Seçin"
              className="w-full px-3 py-2 rounded-lg bg-steam-darker/80 border border-steam-accent/60 text-white text-sm focus:outline-none focus:border-steam-blue transition-colors"
            >
              <option value="savings">En Yüksek İndirim Oranı</option>
              <option value="rating">En Yüksek Steam Puanı</option>
              <option value="price_asc">Fiyat: En Düşük</option>
              <option value="price_desc">Fiyat: En Yüksek</option>
              <option value="newest">En Yeni Eklenenler</option>
            </select>
          </div>
        </div>
      </section>

      {/* Deals Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-steam-green" />
            Aktif Steam Fırsatları
            <span className="text-xs px-2 py-0.5 rounded-full bg-steam-card border border-steam-accent text-gray-400 font-normal">
              {total} Oyun
            </span>
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl bg-steam-card/40 border border-steam-accent/30 aspect-[4/5] animate-pulse"
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
          <div className="text-center py-16 px-4 rounded-2xl bg-steam-card/30 border border-steam-accent/40 space-y-4">
            <Gamepad2 className="w-12 h-12 text-steam-blue mx-auto opacity-50" />
            <h3 className="text-lg font-bold text-white">Henüz Listelenecek İndirim Bulunamadı</h3>
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              Veritabanında henüz oyun listelenmedi. Steam&apos;deki canlı indirimleri hemen çekmek için aşağıdaki butona basın.
            </p>
            <button
              onClick={handleSyncNow}
              disabled={syncing}
              className="px-6 py-2.5 rounded-xl bg-steam-blue text-steam-darker font-bold text-sm hover:bg-blue-400 transition-all inline-flex items-center gap-2 shadow-lg glow-blue"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Steam İndirimleri Çekiliyor...' : 'Canlı Steam İndirimlerini Çek'}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
