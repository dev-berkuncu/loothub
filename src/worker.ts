import cron from 'node-cron';
import dotenv from 'dotenv';
import { runAutomationCycle } from './lib/scheduler';
import { getAllSettings } from './lib/db';

dotenv.config();

console.log('====================================================');
console.log('🚀 Steam Deals & Twitter Bot Background Worker Başlatıldı');
console.log('====================================================');

const settings = getAllSettings();
const intervalMinutes = settings.postIntervalMinutes || 60;

// İlk açılışta hemen bir kez çalıştır
(async () => {
  try {
    console.log('🔄 İlk başlatma döngüsü çalıştırılıyor...');
    const result = await runAutomationCycle();
    console.log('✅ İlk döngü tamamlandı:', result);
  } catch (error) {
    console.error('❌ İlk döngü hatası:', error);
  }
})();

// Belirlenen dakikada bir çalışacak Cron zamanlayıcısı (örn: her saat başı veya her 30 dk)
const cronSchedule = `*/${Math.max(5, intervalMinutes)} * * * *`;
console.log(`⏰ Zamanlayıcı kuruldu: "${cronSchedule}" (${intervalMinutes} dakikada bir kontrol edilecek)`);

cron.schedule(cronSchedule, async () => {
  console.log(`\n[${new Date().toLocaleTimeString('tr-TR')}] ⏰ Planlanan otomasyon görevi çalışıyor...`);
  try {
    const result = await runAutomationCycle();
    console.log('✅ Görev başarıyla tamamlandı:', result);
  } catch (error) {
    console.error('❌ Görev hatası:', error);
  }
});
