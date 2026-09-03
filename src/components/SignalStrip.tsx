'use client';

import React from 'react';
import { Radio } from 'lucide-react';

export default function SignalStrip() {
  return (
    <div className="signal-strip select-none" aria-label="Loot Dispatch Canlı Durum">
      <div className="signal-track">
        <span>
          <Radio className="w-3 h-3 animate-pulse text-ink" /> CANLI İNDİRİM TARAMASI AKTİF
        </span>
        <i />
        <span>STEAM · EPIC GAMES · GOG · HUMBLE STORE</span>
        <i />
        <span>HAFTALIK %100 ÜCRETSİZ OYUNLAR</span>
        <i />
        <span>TARİHİ DİP FİYAT ALARMI</span>
        <i />
        <span>HER GÜN EN İYİ EDİTORYAL SEÇKİLER</span>
        <i />
        <span>
          <Radio className="w-3 h-3 animate-pulse text-ink" /> CANLI İNDİRİM TARAMASI AKTİF
        </span>
        <i />
        <span>STEAM · EPIC GAMES · GOG · HUMBLE STORE</span>
        <i />
        <span>HAFTALIK %100 ÜCRETSİZ OYUNLAR</span>
        <i />
        <span>TARİHİ DİP FİYAT ALARMI</span>
        <i />
        <span>HER GÜN EN İYİ EDİTORYAL SEÇKİLER</span>
        <i />
      </div>
    </div>
  );
}
