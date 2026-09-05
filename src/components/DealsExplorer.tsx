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

  return (
    <div className="space-y-24">
      {/* Hero Section: Monumental Typography + Signature Iridescent Gradient Sphere */}
      <section className="relative min-h-[75vh] flex flex-col justify-between pt-12 pb-8 overflow-hidden border-b border-ash">
        {/* Iridescent Gradient Sphere (The Only Chromatic Element) */}
        <div
          className="hero-iridescent-sphere top-[-10%] right-[5%] md:right-[12%]"
          aria-hidden="true"
        />

        {/* Concentric Circle Ornaments */}
        <div
          className="concentric-circle w-[720px] h-[720px] top-[-18%] right-[0%]"
          aria-hidden="true"
        />
        <div
          className="concentric-circle w-[940px] h-[940px] top-[-30%] right-[-8%]"
          aria-hidden="true"
        />

        {/* Top Section Label */}
        <div className="relative z-10">
          <span className="section-label block">
            ARCHITECTURAL INDEX // SOCIAERA.ONLINE
          </span>
        </div>

        {/* Monumental Display Headline (Stacked Mass) */}
        <div className="relative z-10 my-auto py-12">
          <h1 className="display-headline select-none">
            CURATED<br />
            ARCHITECTURE OF<br />
            DIGITAL GAMES.
          </h1>
        </div>

        {/* Hero Footer Prompt */}
        <div className="relative z-10 flex items-center justify-between pt-6">
          <span className="section-label">
            VERIFIED STEAM, EPIC, GOG & HUMBLE DATA
          </span>
          <span className="section-label">
            SCROLL &darr;
          </span>
        </div>
      </section>

      {/* Founder / Editorial Statement Block */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-12 py-12 border-b border-ash">
        <div className="md:col-span-4 space-y-4">
          <span className="section-label block">
            SOCIAERA DISPATCH // PURPOSE
          </span>
          <a href="#filters" className="ghost-link text-body-sm">
            EXPLORE ARCHIVE &rarr;
          </a>
        </div>
        <div className="md:col-span-8 space-y-6">
          <p className="text-body leading-[1.40] font-normal text-ink max-w-2xl">
            Sociaera operates as an architectural archive of verified video game pricing across global digital storefronts. Zero noise, zero advertising distractions — only structural data, verified promotions, and weekly free releases.
          </p>
          <div className="flex items-center gap-6 pt-2">
            <span className="section-label">
              INDEX TOTAL: {total} TITLES
            </span>
            <span className="section-label text-ash">
              //
            </span>
            <button
              onClick={handleSyncNow}
              disabled={syncing}
              className="ghost-link text-caption uppercase"
            >
              {syncing ? 'SYNCING LIVE RELEASES...' : 'REFRESH ARCHIVE &rarr;'}
            </button>
          </div>
        </div>
      </section>

      {/* Store Grid (Austere 1x4 Logo / Store Cell Grid) */}
      <section className="space-y-4">
        <span className="section-label block">
          INDEXED STOREFRONTS
        </span>
        <div className="grid grid-cols-2 md:grid-cols-4 border border-ash bg-paper">
          <div className="p-8 border-r border-b md:border-b-0 border-ash flex items-center justify-center">
            <span className="font-mono text-body-sm tracking-wider uppercase font-medium">STEAM</span>
          </div>
          <div className="p-8 border-b md:border-b-0 md:border-r border-ash flex items-center justify-center">
            <span className="font-mono text-body-sm tracking-wider uppercase font-medium">EPIC GAMES</span>
          </div>
          <div className="p-8 border-r border-ash flex items-center justify-center">
            <span className="font-mono text-body-sm tracking-wider uppercase font-medium">GOG.COM</span>
          </div>
          <div className="p-8 flex items-center justify-center">
            <span className="font-mono text-body-sm tracking-wider uppercase font-medium">HUMBLE STORE</span>
          </div>
        </div>
      </section>

      {/* Filter Section: Pill-Shaped Ghost Buttons (10px Radius) */}
      <section id="filters" className="space-y-6 pt-8">
        <div className="flex items-center justify-between pb-4 border-b border-ash">
          <span className="section-label">
            FILTER SELECTION
          </span>
          <span className="section-label">
            SHOWING {deals.length} OF {total}
          </span>
        </div>

        {/* Pill Ghost Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => handleFilterChange(() => setSelectedStore('all'))}
            className={`filter-button ${selectedStore === 'all' ? 'is-active' : ''}`}
          >
            ALL ARCHIVES &rarr;
          </button>

          <button
            onClick={() => handleFilterChange(() => setSelectedStore('free'))}
            className={`filter-button ${selectedStore === 'free' ? 'is-active' : ''}`}
          >
            100% FREE NOW &rarr;
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
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-2">
          <div className="md:col-span-6">
            <input
              type="text"
              placeholder="SEARCH BY TITLE OR DEVELOPER..."
              value={search}
              onChange={(e) => handleFilterChange(() => setSearch(e.target.value))}
              className="w-full px-4 py-2.5 rounded-inputs bg-paper border border-ash text-ink placeholder-ash text-caption uppercase tracking-wider focus:outline-none focus:border-ink transition-colors"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={category}
              onChange={(e) => handleFilterChange(() => setCategory(e.target.value))}
              aria-label="Category"
              className="w-full px-4 py-2.5 rounded-inputs bg-paper border border-ash text-ink text-caption uppercase tracking-wider focus:outline-none focus:border-ink transition-colors"
            >
              <option value="all">ALL CATEGORIES</option>
              <option value="action">ACTION</option>
              <option value="rpg">RPG / ROLE PLAYING</option>
              <option value="strategy">STRATEGY</option>
              <option value="adventure">ADVENTURE</option>
              <option value="indie">INDIE</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => handleFilterChange(() => setSortBy(e.target.value as any))}
              aria-label="Sort"
              className="w-full px-4 py-2.5 rounded-inputs bg-paper border border-ash text-ink text-caption uppercase tracking-wider focus:outline-none focus:border-ink transition-colors"
            >
              <option value="savings">MAXIMUM DISCOUNT</option>
              <option value="rating">COMMUNITY SCORE</option>
              <option value="price_asc">PRICE: ASCENDING</option>
              <option value="price_desc">PRICE: DESCENDING</option>
              <option value="newest">LATEST ADDITIONS</option>
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
            <span className="section-label block">NO RECORDS LOCATED</span>
            <p className="text-body-sm text-ink/60 max-w-md mx-auto">
              No promotions match the current filter criteria. Reset parameters to view the complete archive.
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
              RESET ALL PARAMETERS &rarr;
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
