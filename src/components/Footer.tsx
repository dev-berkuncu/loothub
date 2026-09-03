'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Footer() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Loot Dispatch haftalık editoryal bültenine başarıyla kaydoldunuz!');
  };

  return (
    <footer className="mt-24">
      {/* Newsletter (Orbital CTA) */}
      <section
        id="bulten"
        className="rounded-[var(--radius)] bg-ink text-paper p-8 md:p-12 border border-ink relative overflow-hidden mb-12"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7 space-y-3">
            <span className="font-mono text-[10px] uppercase tracking-mono text-lime font-bold">
              HAFTALIK EDİTORYAL SEÇKİ
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter leading-tight text-white">
              Gürültü yok.<br />
              Sadece en iyi oyunlar.
            </h2>
            <p className="text-xs md:text-sm text-paper/70 font-sans max-w-xl leading-relaxed">
              Haftada bir gün, algoritmaların değil editörlerimizin onayladığı kaçırılmayacak indirimleri ve ücretsiz oyunları doğrudan gelen kutunuza iletiyoruz.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="lg:col-span-5 space-y-2">
            <label htmlFor="newsletter-email" className="font-mono text-[9px] uppercase tracking-mono text-paper/60 block font-medium">
              E-POSTA ADRESİNİZ
            </label>
            <div className="flex items-stretch gap-2">
              <input
                id="newsletter-email"
                type="email"
                placeholder="ornek@alanadi.com"
                required
                className="flex-1 px-4 py-2.5 rounded-[var(--radius)] bg-paper/10 border border-paper/20 text-white placeholder-paper/40 text-xs font-mono focus:outline-none focus:border-lime transition-colors"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-[var(--radius)] bg-lime text-ink font-sans font-extrabold text-xs uppercase tracking-wider hover:bg-white transition-all flex items-center gap-1.5 shrink-0"
              >
                KATIL <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <small className="font-mono text-[9px] text-paper/40 block mt-1">
              İstediğiniz an tek tıkla abonelikten ayrılabilirsiniz.
            </small>
          </form>
        </div>
      </section>

      {/* Editorial Colophon & Links */}
      <div className="pt-8 pb-12 border-t border-ink/20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand & Manifesto */}
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center gap-3">
              <span className="brand-mark">
                <i />
                <i />
                <i />
                <i />
              </span>
              <span className="font-black text-lg tracking-tighter text-ink leading-none">
                LOOT<span className="font-normal opacity-60">DISPATCH</span>
              </span>
            </div>
            <p className="text-xs text-muted font-sans leading-relaxed max-w-md">
              Loot Dispatch; Steam, Epic Games, GOG ve Humble Store üzerindeki fiyat dalgalanmalarını ve indirim fırsatlarını editoryal disiplinle raporlayan bağımsız bir dijital yayındır.
            </p>
            <p className="font-mono text-[10px] text-muted uppercase tracking-mono">
              © {new Date().getFullYear()} LOOT DISPATCH · HER HAKKI SAKLIDIR.
            </p>
          </div>

          {/* Platforms */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="font-mono text-[10px] uppercase tracking-mono font-bold text-ink">
              MAĞAZALAR
            </h4>
            <ul className="space-y-1.5 text-xs text-muted font-mono uppercase tracking-wide">
              <li>
                <Link href="/#filtreler" className="hover:text-ink transition-colors">
                  Steam Fırsatları
                </Link>
              </li>
              <li>
                <Link href="/#filtreler" className="hover:text-ink transition-colors">
                  Epic Games & Ücretsiz
                </Link>
              </li>
              <li>
                <Link href="/#filtreler" className="hover:text-ink transition-colors">
                  GOG DRM-Free
                </Link>
              </li>
              <li>
                <Link href="/#filtreler" className="hover:text-ink transition-colors">
                  Humble Store Paketleri
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Notice */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="font-mono text-[10px] uppercase tracking-mono font-bold text-ink">
              YASAL BİLGİ
            </h4>
            <p className="text-[11px] text-muted font-sans leading-relaxed">
              Loot Dispatch bağımsız bir editoryal yayındır. Steam logosu Valve Corporation&apos;a, Epic Games logosu Epic Games Inc.&apos;e aittir.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
