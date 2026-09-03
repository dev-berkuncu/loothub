'use client';

interface AdBannerProps {
  slot?: string;
  format?: 'auto' | 'rectangle' | 'horizontal';
  className?: string;
  label?: string;
}

export default function AdBanner({
  slot = 'default-slot',
  format = 'horizontal',
  className = '',
  label = 'Sponsorlu Reklam / Google AdSense',
}: AdBannerProps) {
  const adsenseId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID;

  return (
    <div
      className={`relative rounded-xl border border-dashed border-steam-accent/60 bg-steam-card/40 p-4 text-center overflow-hidden flex flex-col items-center justify-center min-h-[100px] ${className}`}
    >
      <div className="absolute top-1.5 right-2 text-[10px] uppercase font-bold tracking-wider text-gray-500">
        {label}
      </div>

      {adsenseId ? (
        <div className="w-full h-full flex items-center justify-center">
          {/* Real Google AdSense Script Tag Container */}
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client={adsenseId}
            data-ad-slot={slot}
            data-ad-format={format}
            data-full-width-responsive="true"
          />
        </div>
      ) : (
        <div className="py-3 px-4">
          <p className="text-xs font-semibold text-gray-400">
            📢 Reklam Alanı (Google AdSense / Sponsorlu Banner)
          </p>
          <p className="text-[11px] text-gray-500 mt-0.5">
            AdSense ID eklendiğinde burada otomatik gelir getiren reklamlar gösterilir.
          </p>
        </div>
      )}
    </div>
  );
}
