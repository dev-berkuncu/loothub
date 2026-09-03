import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import SignalStrip from '@/components/SignalStrip';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Loot Dispatch — Editoryal Oyun & İndirim Raporu',
    template: '%s | Loot Dispatch',
  },
  description:
    'Loot Dispatch; Steam, Epic Games, GOG ve Humble Store üzerindeki en iyi fırsatları, ücretsiz oyunları ve oyun dünyasındaki gelişmeleri neo-brutalist editoryal bir disiplinle sunan dijital keşif yayınıdır.',
  keywords: [
    'Loot Dispatch',
    'Oyun İndirimleri',
    'Steam Fırsatları',
    'Epic Games Ücretsiz',
    'GOG İndirimleri',
    'Humble Store',
    'Oyun İncelemeleri',
    'Editoryal Oyun Yayını',
  ],
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Loot Dispatch',
    title: 'Loot Dispatch — Editoryal Oyun & İndirim Raporu',
    description: 'Steam, Epic Games, GOG ve Humble Store üzerindeki en iyi oyun fırsatları ve tarafsız editoryal incelemeler.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Loot Dispatch — Editoryal Oyun & İndirim Raporu',
    description: 'Dijital oyun dünyasının en iyi fırsatları ve editoryal analizleri.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex flex-col min-h-screen antialiased bg-paper text-ink selection:bg-lime selection:text-ink">
        <Navbar />
        <SignalStrip />
        <main className="flex-1 max-w-[1380px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
