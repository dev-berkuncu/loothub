'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Sparkles, Gift } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-paper/90 border-b border-ink/20 transition-all">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Mark & Title */}
          <Link href="/" className="brand flex items-center gap-3 group">
            <span className="brand-mark" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </span>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tighter text-ink leading-none">
                LOOT<span className="font-normal opacity-60">DISPATCH</span>
              </span>
              <span className="text-[9px] font-mono text-muted tracking-mono uppercase leading-tight mt-0.5">
                Editoryal Oyun Raporu
              </span>
            </div>
          </Link>

          {/* Desktop Editorial Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`text-xs font-bold uppercase tracking-wider transition-colors pb-1 ${
                pathname === '/'
                  ? 'text-ink border-b-2 border-ink'
                  : 'text-muted hover:text-ink'
              }`}
            >
              Manşet & Fırsatlar
            </Link>

            <Link
              href="/#filtreler"
              className="text-xs font-bold uppercase tracking-wider text-muted hover:text-ink transition-colors flex items-center gap-1"
            >
              <Gift className="w-3.5 h-3.5 text-orange" />
              Ücretsiz Oyunlar
            </Link>

            <Link
              href="/#filtreler"
              className="text-xs font-bold uppercase tracking-wider text-muted hover:text-ink transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-ink" />
              Dev İndirimler
            </Link>

            <a
              href="#bulten"
              className="text-xs font-bold uppercase tracking-wider text-muted hover:text-ink transition-colors"
            >
              Manifesto
            </a>
          </nav>

          {/* Header Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/#filtreler"
              aria-label="Ara"
              className="circle-link !w-9 !h-9 text-xs"
            >
              <Search className="w-4 h-4" />
            </Link>

            <a
              href="#bulten"
              className="px-4 py-2 rounded-[var(--radius)] bg-ink hover:bg-lime text-paper hover:text-ink font-sans font-extrabold text-xs uppercase tracking-wider transition-all duration-200 border border-ink shadow-sm"
            >
              Abone Ol
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
