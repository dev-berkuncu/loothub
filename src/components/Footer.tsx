import Link from 'next/link';
import { Gamepad2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-steam-accent/40 bg-steam-darker/90 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-steam-blue flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-steam-darker" />
              </div>
              <span className="text-lg font-black tracking-tight text-white">
                LOOT<span className="text-steam-blue">HUB</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 max-w-md leading-relaxed">
              LootHub; dijital oyun ekosistemindeki en avantajlı fiyat tekliflerini, tarihi dip indirimleri ve topluluk değerlendirmelerini anlık olarak analiz eden bağımsız bir oyun keşif ve fiyat takip platformudur.
            </p>
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} LootHub. Tüm hakları saklıdır. Steam ve Steam logosu Valve Corporation&apos;a aittir.
            </p>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Keşfet</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/?minSavings=75" className="hover:text-steam-blue transition-colors">
                  %75+ Fırsatlar
                </Link>
              </li>
              <li>
                <Link href="/?maxPrice=5" className="hover:text-steam-blue transition-colors">
                  Bütçe Dostu ($5 Altı)
                </Link>
              </li>
              <li>
                <Link href="/?minRating=85" className="hover:text-steam-blue transition-colors">
                  En Yüksek Puanlılar
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

          {/* Platform Info */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <span className="text-xs text-gray-400 block">
                  Veri Kaynağı: Steam Storefront & Valve Resmi Mağaza Ağı
                </span>
              </li>
              <li>
                <span className="text-xs text-gray-500 block mt-2">
                  Bölgesel Fiyatlandırma: Türkiye (MENA-USD) ve Global Fiyat Analizi
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-steam-accent/30 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>Tüm fiyat ve indirim verileri Steam mağazasından anlık olarak doğrulanmaktadır.</p>
          <p>LootHub — Akıllı Oyun & İndirim İstihbarat Platformu</p>
        </div>
      </div>
    </footer>
  );
}
