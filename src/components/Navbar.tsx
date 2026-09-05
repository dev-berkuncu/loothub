'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-sm bg-parchment/90 border-b border-ash transition-all">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Mark */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-bold text-xl tracking-tight text-ink uppercase">
              SOCIAERA.
            </span>
          </Link>

          {/* Ghost Navigation Links (15px, 10px hit-area, trailing arrow) */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={`ghost-link text-body-sm ${
                pathname === '/' ? 'underline font-medium' : ''
              }`}
            >
              ARCHIVE
            </Link>

            <Link href="/#filters" className="ghost-link text-body-sm">
              FREE RELEASES
            </Link>

            <Link href="/#filters" className="ghost-link text-body-sm">
              CURATED SELECTION
            </Link>

            <a href="#about" className="ghost-link text-body-sm">
              MANIFESTO &rarr;
            </a>
          </nav>

          {/* Right Status */}
          <div className="flex items-center gap-4">
            <span className="section-label hidden sm:inline-block">
              INDEX // 2026
            </span>
            <a
              href="#about"
              className="ghost-link text-body-sm border border-ink px-4 py-1.5 rounded-links hover:bg-ink hover:text-parchment"
            >
              SUBSCRIBE &rarr;
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
