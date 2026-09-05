'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-parchment/90 border-b border-ash transition-all">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          {/* Brand Mark */}
          <Link href="/" className="flex flex-col group">
            <span className="font-bold text-2xl tracking-tighter text-ink uppercase leading-none">
              SOCIAERA.
            </span>
            <span className="section-label text-[9px] text-ink/50 tracking-[0.15em] mt-1">
              DİJİTAL OYUN ARŞİVİ // ARCHITECTURAL INDEX
            </span>
          </Link>

          {/* Ghost Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={`ghost-link text-body-sm uppercase tracking-wide ${
                pathname === '/' ? 'underline font-medium' : ''
              }`}
            >
              FIRSAT ARŞİVİ
            </Link>

            <Link href="/#filters" className="ghost-link text-body-sm uppercase tracking-wide">
              ÜCRETSİZ OYUNLAR
            </Link>

            <Link href="/#filters" className="ghost-link text-body-sm uppercase tracking-wide">
              MAĞAZALAR
            </Link>

            <a href="#about" className="ghost-link text-body-sm uppercase tracking-wide">
              MANİFESTO &rarr;
            </a>
          </nav>

          {/* Right Live Status & Subscribe */}
          <div className="flex items-center gap-5">
            <span className="section-label hidden sm:flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block animate-pulse" />
              CANLI SENKRON
            </span>
            <a
              href="#about"
              className="ghost-link text-caption uppercase tracking-wider border border-ink px-4 py-2 rounded-links hover:bg-ink hover:text-parchment"
            >
              BÜLTENE KATIL &rarr;
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
