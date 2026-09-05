import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://sociaera.online'),
  title: {
    default: 'Sociaera — Digital Gaming Architecture & Curated Deals',
    template: '%s | Sociaera',
  },
  description:
    'Sociaera operates as an architectural archive of curated digital video game deals and weekly releases across Steam, Epic Games, GOG, and Humble Store.',
  keywords: [
    'Sociaera',
    'Gaming Architecture',
    'Curated Deals',
    'Steam Deals',
    'Epic Free Games',
    'GOG Releases',
    'Humble Store',
  ],
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    siteName: 'Sociaera',
    title: 'Sociaera — Digital Gaming Architecture & Curated Deals',
    description: 'A near-monochrome digital archive of curated gaming deals and verified prices.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sociaera — Digital Gaming Architecture & Curated Deals',
    description: 'A near-monochrome digital archive of curated gaming deals and verified prices.',
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex flex-col min-h-screen antialiased bg-parchment text-ink selection:bg-ink selection:text-parchment font-sans">
        <Navbar />
        <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
