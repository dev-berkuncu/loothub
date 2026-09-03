'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Gamepad2, Flame, Sparkles, Tag } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-steam-darker/90 border-b border-steam-accent/40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-steam-blue via-blue-600 to-steam-accent flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                LOOT<span className="text-steam-blue">HUB</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-steam-discount text-steam-green font-bold uppercase tracking-wider">
                  BETA
                </span>
              </span>
              <p className="text-[10px] text-gray-400 font-medium tracking-wide uppercase">
                Akıllı Oyun & Fırsat Keşif Platformu
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                pathname === '/' ? 'bg-steam-accent/60 text-steam-blue' : 'text-gray-300 hover:text-white hover:bg-steam-card/50'
              }`}
            >
              <Flame className="w-4 h-4 text-orange-400" />
              Günün Fırsatları
            </Link>

            <Link
              href="/?minSavings=70"
              className="px-3.5 py-2 rounded-lg text-sm font-semibold text-gray-300 hover:text-white hover:bg-steam-card/50 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-yellow-400" />
              %70+ Dev İndirimler
            </Link>

            <Link
              href="/?maxPrice=5"
              className="px-3.5 py-2 rounded-lg text-sm font-semibold text-gray-300 hover:text-white hover:bg-steam-card/50 transition-colors flex items-center gap-1.5"
            >
              <Tag className="w-4 h-4 text-green-400" />
              $5 Altı Oyunlar
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
