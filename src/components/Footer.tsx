'use client';

import Link from 'next/link';

export default function Footer() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Subscribed to the Sociaera Archival Dispatch.');
  };

  return (
    <footer id="about" className="mt-32 border-t border-ash pt-16 pb-24 relative overflow-hidden">
      {/* Decorative Concentric Circle in Footer */}
      <div
        className="concentric-circle w-[520px] h-[520px] bottom-[-15%] right-[-5%]"
        aria-hidden="true"
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 relative z-10">
        {/* Brand & Manifesto */}
        <div className="md:col-span-5 space-y-4">
          <span className="font-bold text-xl tracking-tight text-ink uppercase block">
            SOCIAERA.
          </span>
          <p className="text-body-sm text-ink/70 max-w-sm leading-relaxed">
            A typographic and architectural archive of curated digital video game promotions across Steam, Epic Games, GOG, and Humble Store.
          </p>
          <span className="section-label block text-ink/50 pt-4">
            &copy; {new Date().getFullYear()} SOCIAERA. ALL RIGHTS RESERVED.
          </span>
        </div>

        {/* Index Links */}
        <div className="md:col-span-3 space-y-3">
          <span className="section-label block text-ink">
            PLATFORM ARCHIVE
          </span>
          <ul className="space-y-2 text-caption uppercase text-ink/70">
            <li>
              <Link href="/#filters" className="hover:text-ink transition-colors">
                STEAM ARCHIVE &rarr;
              </Link>
            </li>
            <li>
              <Link href="/#filters" className="hover:text-ink transition-colors">
                EPIC GAMES FREE &rarr;
              </Link>
            </li>
            <li>
              <Link href="/#filters" className="hover:text-ink transition-colors">
                GOG DRM-FREE &rarr;
              </Link>
            </li>
            <li>
              <Link href="/#filters" className="hover:text-ink transition-colors">
                HUMBLE STORE &rarr;
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter Subscription (10px Ghost Hit-area) */}
        <div className="md:col-span-4 space-y-4">
          <span className="section-label block text-ink">
            SUBSCRIBE TO DISPATCH
          </span>
          <p className="text-caption text-ink/70 leading-relaxed">
            Weekly curated archival report delivered directly. Zero noise, only verified promotions.
          </p>
          <form onSubmit={handleSubmit} className="space-y-2">
            <input
              type="email"
              placeholder="ENTER EMAIL ADDRESS..."
              required
              className="w-full px-4 py-2.5 rounded-inputs bg-paper border border-ash text-caption text-ink placeholder-ash uppercase tracking-wider focus:outline-none focus:border-ink transition-colors"
            />
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-buttons border border-ink text-ink hover:bg-ink hover:text-parchment text-caption font-normal uppercase tracking-wider transition-all duration-200"
            >
              SUBSCRIBE &rarr;
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
}
