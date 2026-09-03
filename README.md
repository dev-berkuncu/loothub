# 🎮 Steam İndirim Takipçisi, SEO Web Sitesi & Twitter (X) Botu

Bu proje; Steam üzerindeki indirimleri, tarihi dip fiyatları ve kullanıcı değerlendirmelerini otomatik olarak takip eden, bunları SEO uyumlu ve AdSense/Affiliate monetizasyonuna hazır modern bir web sitesinde listeleyen ve ardından Twitter'da (X) otomatik olarak görsel, fiyat ve link ile paylaşan entegre bir otomasyon sistemidir.

---

## 🌟 Öne Çıkan Özellikler

1. **🔥 Otomatik Steam & Fiyat Takip Motoru:**
   - Steam Store API ve CheapShark API üzerinden indirimdeki oyunları anlık olarak tarar.
   - İndirim yüzdesi, eski/yeni fiyat, Steam kullanıcı yorumları (% pozitif), Metacritic puanı, ekran görüntüleri ve sistem gereksinimlerini otomatik çeker.
   - Türkçe içerik özetleri, "Neden Alınmalı?", Artılar & Eksiler bölümlerini otomatik üretir.

2. **🌐 SEO & Monetizasyon Odaklı Web Sitesi (Next.js 14 + Tailwind CSS):**
   - **Ultra Hızlı ve Modern Koyu Oyun Teması:** Steam arayüzüyle uyumlu tasarım.
   - **Gelişmiş Filtreleme:** %70+ Dev İndirimler, $5 Altı Oyunlar, %85+ Çok Olumlu, Oyun Türleri ve Fiyat Sıralaması.
   - **Tam SEO & Twitter Card Desteği:** Her oyun için özel `og:image`, `twitter:card`, dinamik başlık ve açıklamalar.
   - **Hazır Reklam & Gelir Alanları:** Google AdSense banner alanları ve Steam / Affiliate mağaza yönlendirme butonları.

3. **🤖 Twitter (X) Otomasyon Botu:**
   - İndirime giren oyunları yüksek çözünürlüklü banner görseli, indirim oranı, fiyat kıyaslaması, Steam puanı ve site bağlantısı ile tweet atar.
   - **Test / Simülasyon (Dry-Run) Modu:** Twitter API anahtarlarınız henüz olmasa bile sistemi güvenle test edebilir, logları kontrol edebilirsiniz.
   - **Akıllı Filtreleme:** Belirlediğiniz minimum indirim (%30+) ve minimum inceleme puanı (%60+) altındaki oyunları filtreler.

4. **🎛️ Admin & Bot Kontrol Merkezi (`/admin`):**
   - Tek tıkla canlı Steam indirimlerini tarama.
   - İstediğiniz oyunu canlı modal üzerinden önizleyerek anında tweet atma.
   - Bot paylaşım sıklığı ve API anahtarlarını arayüzden yönetme.
   - Canlı tweet paylaşım loglarını inceleme.

---

## 🚀 Hızlı Başlangıç

### 1. Projeyi Çalıştırma

```bash
# Web sitesini ve API sunucusunu başlatın:
npm run dev
```

Web sitesine tarayıcınızdan erişin:
- **Ana Sayfa:** [http://localhost:3000](http://localhost:3000)
- **Bot & Yönetim Paneli:** [http://localhost:3000/admin](http://localhost:3000/admin)

### 2. Arka Plan Otomasyon Botunu (Worker) Başlatma

Botun belirlenen dakikada bir arka planda otomatik indirim tarayıp tweet atması için:

```bash
npm run worker
```

---

## ⚙️ Yapılandırma (`.env` Dosyası)

`.env` dosyasındaki ayarları kendi bilgilerinize göre düzenleyebilirsiniz:

```env
# Web Sitesi
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SITE_NAME="Steam İndirimleri & Fırsatlar"

# Twitter (X) API (Girilmezse Test/Simülasyon Modunda Çalışır)
TWITTER_API_KEY=your_api_key
TWITTER_API_SECRET=your_api_secret
TWITTER_ACCESS_TOKEN=your_access_token
TWITTER_ACCESS_TOKEN_SECRET=your_access_token_secret

# Bot Davranış Ayarları
MIN_DISCOUNT_PERCENTAGE=30
MIN_STEAM_RATING_PERCENTAGE=60
AUTO_TWEET_ENABLED=false
POST_INTERVAL_MINUTES=60

# Reklam & Ortaklık (Monetizasyon)
NEXT_PUBLIC_GOOGLE_ADSENSE_ID=ca-pub-XXXXXXXXXXXXXXXX
AFFILIATE_TAG_HUMBLE=
AFFILIATE_TAG_ENEBA=
```

---

## 💰 Para Kazanma & Büyüme Rehberi

1. **Google AdSense:**
   - Google AdSense hesabınız onaylandığında `.env` veya Admin panelindeki `Google AdSense Client ID` alanına ID'nizi girin. Reklamlar sitedeki banner ve içerik aralarında otomatik olarak yayına girecektir.

2. **Oyun Affiliate (Ortaklık) Gelirleri:**
   - Humble Bundle, Fanatical, Green Man Gaming, Eneba veya Kinguin affiliate programlarına üye olarak linklerinizi ekleyin. Siteden yapılan her oyun alımından %3 - %10 komisyon kazanırsınız.

3. **Twitter Kitlesi Büyütme İpuçları:**
   - Büyük sezon indirimlerinde (Steam Yaz/Kış İndirimleri) bot paylaşım sıklığını artırın (örneğin 30 dakikada bire çekin).
   - Popüler etiketleri (`#Steam #Steamİndirim #OyunÖnerisi #Gamer`) kullanın.
