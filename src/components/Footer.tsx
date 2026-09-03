import Link from 'next/link';
import { Gamepad2, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-steam-accent/40 bg-steam-darker/80 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-steam-blue flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-steam-darker" />
              </div>
              <span className="text-lg font-black tracking-tight text-white">
                STEAM<span className="text-steam-blue">FIRSAT</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 max-w-md leading-relaxed">
              Steam üzerindeki en iyi indirimleri, tarihi dip fiyatları ve kaçırılmayacak oyun fırsatlarını anlık olarak takip edin. Twitter botumuz sayesinde indirimlerden anında haberdar olun!
            </p>
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} SteamFırsat. Steam ve Steam logosu Valve Corporation&apos;a aittir. Bu site bağımsız bir indirim takip ve inceleme rehberidir.
            </p>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Kategoriler</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/?minSavings=75" className="hover:text-steam-blue transition-colors">
                  %75+ Dev İndirimler
                </Link>
              </li>
              <li>
                <Link href="/?maxPrice=5" className="hover:text-steam-blue transition-colors">
                  $5 Altı Oyunlar
                </Link>
              </li>
              <li>
                <Link href="/?minRating=85" className="hover:text-steam-blue transition-colors">
                  En Çok Beğenilenler
                </Link>
              </li>
              <li>
                <Link href="/?category=action" className="hover:text-steam-blue transition-colors">
                  Aksiyon Oyunları
                </Link>
              </li>
              <li>
                <Link href="/?category=rpg" className="hover:text-steam-blue transition-colors">
                  RPG / Rol Yapma
                </Link>
              </li>
            </ul>
          </div>

          {/* Bot & Monetization Notice */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Otomasyon & İletişim</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/admin" className="hover:text-steam-blue transition-colors">
                  Bot Kontrol Paneli
                </Link>
              </li>
              <li>
                <span className="text-xs text-gray-500">
                  Affiliate Açıklaması: Sitemizdeki bazı satın alma bağlantıları ortaklık komisyonu üretebilir.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-steam-accent/30 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>Tüm fiyatlar ve indirimler Steam mağazasından çekilmektedir.</p>
          <p className="flex items-center gap-1">
            Geliştirildi <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> Steam & Twitter Automation
          </p>
        </div>
      </div>
    </footer>
  );
}
