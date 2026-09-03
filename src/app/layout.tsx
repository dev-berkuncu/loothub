import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'LootHub | Akıllı Steam Fırsat & Oyun Keşif Platformu',
    template: '%s | LootHub',
  },
  description:
    'LootHub; Steam üzerindeki en avantajlı oyun indirimlerini, tarihi dip fiyatları, sistem gereksinimlerini ve detaylı oyun analizlerini sunan dijital keşif platformudur.',
  keywords: [
    'LootHub',
    'Steam İndirimleri',
    'Steam Fırsatları',
    'En Ucuz Oyunlar',
    'Steam Deals',
    'Steam Sale',
    'Oyun İncelemeleri',
    'Oyun Fiyat Takibi',
    'Oyun Rehberi',
  ],
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    siteName: 'LootHub',
    title: 'LootHub - Günün En İyi Oyun Fırsatları & İnceleme Rehberi',
    description: 'Steam üzerindeki en iyi indirimler, kullanıcı puanları ve oyun incelemeleri.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LootHub - Akıllı Oyun Fırsat Platformu',
    description: 'Günün en popüler Steam indirimleri ve detaylı oyun analizleri.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adsenseId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID;

  return (
    <html lang="tr" className="dark">
      <head>
        {adsenseId && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="flex flex-col min-h-screen antialiased bg-steam-darker text-steam-text">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
