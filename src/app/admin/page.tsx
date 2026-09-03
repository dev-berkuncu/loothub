'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  Bot,
  RefreshCw,
  Send,
  Settings,
  ListFilter,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ThumbsUp,
  Sliders,
  TrendingDown,
  Clock,
  KeyRound,
  DollarSign,
  X,
} from 'lucide-react';
import { Deal, TweetLog, SystemSettings } from '@/lib/types';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'deals' | 'settings' | 'logs'>('deals');
  const [deals, setDeals] = useState<Deal[]>([]);
  const [logs, setLogs] = useState<TweetLog[]>([]);
  const [settings, setSettings] = useState<SystemSettings>({
    autoTweetEnabled: false,
    minDiscountPercentage: 30,
    minSteamRatingPercentage: 60,
    postIntervalMinutes: 60,
    siteName: 'Steam İndirimleri & Fırsatlar',
    siteUrl: 'http://localhost:3000',
    twitterApiKey: '',
    twitterApiSecret: '',
    twitterAccessToken: '',
    twitterAccessTokenSecret: '',
    googleAdsenseId: '',
  });

  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [runningBot, setRunningBot] = useState(false);

  // Filter for deals tab
  const [unpostedOnly, setUnpostedOnly] = useState(false);

  // Tweet Modal State
  const [selectedDealForTweet, setSelectedDealForTweet] = useState<Deal | null>(null);
  const [tweetPreviewText, setTweetPreviewText] = useState('');
  const [isTweeting, setIsTweeting] = useState(false);
  const [tweetStatusMsg, setTweetStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load Data
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [dealsRes, settingsRes, logsRes] = await Promise.all([
        fetch(`/api/deals?limit=50&unpostedOnly=${unpostedOnly}`),
        fetch('/api/settings'),
        fetch('/api/logs'),
      ]);

      const dealsData = await dealsRes.json();
      const settingsData = await settingsRes.json();
      const logsData = await logsRes.json();

      setDeals(dealsData.deals || []);
      setSettings(settingsData);
      setLogs(logsData.logs || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  }, [unpostedOnly]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Sync Deals Now
  const handleSyncDeals = async () => {
    setSyncing(true);
    try {
      const res = await fetch('/api/deals/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit: 50 }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`Başarılı! ${data.added} yeni oyun eklendi, ${data.updated} oyun güncellendi.`);
        loadData();
      } else {
        alert(`Hata: ${data.error}`);
      }
    } catch (err: any) {
      alert(`Senkronizasyon hatası: ${err.message}`);
    } finally {
      setSyncing(false);
    }
  };

  // Run Automation Cycle (Sync + Tweet)
  const handleRunBotCycle = async () => {
    setRunningBot(true);
    try {
      const res = await fetch('/api/cron/sync-and-tweet?key=steam_deals_secret_token_123');
      const data = await res.json();
      if (data.success) {
        alert(`Bot Döngüsü Tamamlandı!\nOyunlar güncellendi. Tweet durumu: ${data.tweetResult?.status || 'Bilinmiyor'}`);
        loadData();
      } else {
        alert(`Hata: ${data.error}`);
      }
    } catch (err: any) {
      alert(`Bot hatası: ${err.message}`);
    } finally {
      setRunningBot(false);
    }
  };

  // Open Tweet Modal
  const handleOpenTweetModal = async (deal: Deal) => {
    setSelectedDealForTweet(deal);
    setTweetStatusMsg(null);
    try {
      const res = await fetch('/api/twitter/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dealId: deal.id }),
      });
      const data = await res.json();
      setTweetPreviewText(data.tweetText || '');
    } catch {
      setTweetPreviewText(`🔥 Steam'de İndirim: ${deal.title}\n%${deal.savingsPercentage} indirimle $${deal.salePrice}!`);
    }
  };

  // Send Tweet
  const handleSendTweet = async () => {
    if (!selectedDealForTweet) return;
    setIsTweeting(true);
    setTweetStatusMsg(null);

    try {
      const res = await fetch('/api/twitter/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dealId: selectedDealForTweet.id,
          customText: tweetPreviewText,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setTweetStatusMsg({
          type: 'success',
          text: data.status === 'DRY_RUN'
            ? 'Tweet simülasyonu başarıyla çalıştırıldı (Dry-Run Loglandı).'
            : 'Tweet başarıyla X/Twitter hesabınızda paylaşıldı!',
        });
        loadData();
      } else {
        setTweetStatusMsg({
          type: 'error',
          text: `Paylaşım Başarısız: ${data.errorMessage || data.error}`,
        });
      }
    } catch (err: any) {
      setTweetStatusMsg({ type: 'error', text: err.message });
    } finally {
      setIsTweeting(false);
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        alert('Ayarlar başarıyla kaydedildi!');
        loadData();
      }
    } catch (err: any) {
      alert(`Ayarlar kaydedilemedi: ${err.message}`);
    } finally {
      setSavingSettings(false);
    }
  };

  // Counts
  const postedCount = deals.filter((d) => d.postedToTwitter).length;
  const unpostedCount = deals.filter((d) => !d.postedToTwitter).length;

  return (
    <div className="space-y-8">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-steam-accent/40">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2.5">
            <Bot className="w-8 h-8 text-steam-blue" />
            Steam & Twitter Bot Kontrol Merkezi
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            İndirimleri tarayın, otomatik tweet kuyruğunu yönetin ve bot ayarlarını yapılandırın.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleSyncDeals}
            disabled={syncing}
            className="px-4 py-2.5 rounded-xl bg-steam-accent/60 hover:bg-steam-accent text-steam-blue font-bold text-xs transition-all flex items-center gap-2 border border-steam-accent disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'İndirimler Çekiliyor...' : 'Steam İndirimlerini Çek'}
          </button>

          <button
            onClick={handleRunBotCycle}
            disabled={runningBot}
            className="px-4 py-2.5 rounded-xl bg-steam-blue hover:bg-blue-400 text-steam-darker font-black text-xs transition-all flex items-center gap-2 shadow-lg glow-blue disabled:opacity-50"
          >
            <Send className={`w-4 h-4 ${runningBot ? 'animate-pulse' : ''}`} />
            {runningBot ? 'Bot Çalışıyor...' : 'Bot Döngüsünü Çalıştır'}
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-steam-card border border-steam-accent/50 space-y-1">
          <span className="text-xs text-gray-400 uppercase font-semibold">Kayıtlı İndirim</span>
          <div className="text-2xl font-black text-white flex items-center justify-between">
            {deals.length}
            <TrendingDown className="w-5 h-5 text-steam-blue" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-steam-card border border-steam-accent/50 space-y-1">
          <span className="text-xs text-gray-400 uppercase font-semibold">Twitter&apos;da Paylaşılan</span>
          <div className="text-2xl font-black text-green-400 flex items-center justify-between">
            {postedCount}
            <CheckCircle2 className="w-5 h-5 text-green-400" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-steam-card border border-steam-accent/50 space-y-1">
          <span className="text-xs text-gray-400 uppercase font-semibold">Bekleyen İndirimler</span>
          <div className="text-2xl font-black text-yellow-400 flex items-center justify-between">
            {unpostedCount}
            <Clock className="w-5 h-5 text-yellow-400" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-steam-card border border-steam-accent/50 space-y-1">
          <span className="text-xs text-gray-400 uppercase font-semibold">Otomatik Paylaşım</span>
          <div className="text-2xl font-black text-white flex items-center justify-between">
            {settings.autoTweetEnabled ? (
              <span className="text-green-400 text-lg font-bold">AKTİF</span>
            ) : (
              <span className="text-gray-400 text-lg font-bold">PASİF</span>
            )}
            <Bot className="w-5 h-5 text-steam-blue" />
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-steam-accent/40 pb-2">
        <button
          onClick={() => setActiveTab('deals')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'deals'
              ? 'bg-steam-blue text-steam-darker font-black'
              : 'bg-steam-card border border-steam-accent/40 text-gray-300 hover:text-white'
          }`}
        >
          <ListFilter className="w-4 h-4" />
          İndirimler & Tweet Kuyruğu
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'settings'
              ? 'bg-steam-blue text-steam-darker font-black'
              : 'bg-steam-card border border-steam-accent/40 text-gray-300 hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4" />
          Bot & API Ayarları
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'logs'
              ? 'bg-steam-blue text-steam-darker font-black'
              : 'bg-steam-card border border-steam-accent/40 text-gray-300 hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4" />
          Tweet Logları ({logs.length})
        </button>
      </div>

      {/* TAB 1: Deals List */}
      {activeTab === 'deals' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-steam-card border border-steam-accent/40">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={unpostedOnly}
                onChange={(e) => setUnpostedOnly(e.target.checked)}
                className="rounded border-steam-accent text-steam-blue focus:ring-0"
              />
              Sadece henüz tweet atılmamış oyunları göster
            </label>
            <span className="text-xs text-gray-400">{deals.length} oyun listeleniyor</span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-gray-400">Yükleniyor...</div>
          ) : deals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {deals.map((deal) => (
                <div
                  key={deal.id}
                  className="p-4 rounded-xl bg-steam-card border border-steam-accent/50 flex flex-col justify-between space-y-3"
                >
                  <div className="flex gap-3">
                    <div className="relative w-24 aspect-[16/9] rounded-lg overflow-hidden flex-shrink-0 bg-steam-darker">
                      <Image
                        src={deal.headerImage || deal.capsuleImage || ''}
                        alt={deal.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white text-sm truncate">{deal.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-black text-steam-green px-1.5 py-0.5 rounded bg-steam-discount">
                          -%{Math.round(deal.savingsPercentage)}
                        </span>
                        <span className="text-xs text-gray-300 font-semibold">
                          ${deal.salePrice.toFixed(2)}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3 text-steam-blue" />
                        %{deal.steamRatingPercent} ({deal.steamRatingText})
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-steam-accent/30 flex items-center justify-between">
                    <div>
                      {deal.postedToTwitter ? (
                        <span className="text-[11px] font-bold text-green-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Paylaşıldı
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-yellow-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Beklemede
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleOpenTweetModal(deal)}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all flex items-center gap-1 shadow"
                    >
                      <Send className="w-3 h-3" />
                      Tweet At
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">Görüntülenecek indirim bulunamadı.</div>
          )}
        </div>
      )}

      {/* TAB 2: Bot Settings */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          {/* General Automation Section */}
          <div className="p-6 rounded-2xl bg-steam-card border border-steam-accent/60 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-steam-blue" />
              Otomasyon & Filtre Kuralları
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-steam-darker/60 border border-steam-accent/40">
                <div>
                  <h3 className="text-sm font-bold text-white">Otomatik Tweet Paylaşımı</h3>
                  <p className="text-xs text-gray-400">
                    Bot periyodik olarak en iyi indirimi otomatik tweet atsın mı?
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoTweetEnabled}
                  onChange={(e) => setSettings({ ...settings, autoTweetEnabled: e.target.checked })}
                  className="w-5 h-5 rounded border-steam-accent text-steam-blue focus:ring-0"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                  Minimum İndirim Oranı (% Yüzde)
                </label>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={settings.minDiscountPercentage}
                  onChange={(e) => setSettings({ ...settings, minDiscountPercentage: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-steam-darker border border-steam-accent text-white text-sm"
                />
                <p className="text-[11px] text-gray-500 mt-1">Örn: %30 veya %50 altındaki indirimler tweet atılmaz.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                  Minimum Steam İnceleme Puanı (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={settings.minSteamRatingPercentage}
                  onChange={(e) => setSettings({ ...settings, minSteamRatingPercentage: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-steam-darker border border-steam-accent text-white text-sm"
                />
                <p className="text-[11px] text-gray-500 mt-1">Örn: %60 üzeri olumlu yorum alan oyunlar seçilir.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                  Paylaşım Aralığı (Dakika)
                </label>
                <input
                  type="number"
                  min="5"
                  value={settings.postIntervalMinutes}
                  onChange={(e) => setSettings({ ...settings, postIntervalMinutes: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-steam-darker border border-steam-accent text-white text-sm"
                />
                <p className="text-[11px] text-gray-500 mt-1">Örn: 60 dakika (Saatte 1 tweet).</p>
              </div>
            </div>
          </div>

          {/* Twitter API Credentials Section */}
          <div className="p-6 rounded-2xl bg-steam-card border border-steam-accent/60 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-steam-blue" />
                Twitter (X) API Kimlik Bilgileri
              </h2>
              <span className="text-[11px] px-2.5 py-1 rounded bg-blue-900/40 text-blue-300 border border-blue-800/40">
                Boş bırakılırsa Test (Dry-Run) modunda çalışır
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                  Twitter API Key (Consumer Key)
                </label>
                <input
                  type="text"
                  value={settings.twitterApiKey || ''}
                  onChange={(e) => setSettings({ ...settings, twitterApiKey: e.target.value })}
                  placeholder="API Key"
                  className="w-full px-3 py-2 rounded-lg bg-steam-darker border border-steam-accent text-white text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                  Twitter API Secret (Consumer Secret)
                </label>
                <input
                  type="password"
                  value={settings.twitterApiSecret || ''}
                  onChange={(e) => setSettings({ ...settings, twitterApiSecret: e.target.value })}
                  placeholder="API Secret Key"
                  className="w-full px-3 py-2 rounded-lg bg-steam-darker border border-steam-accent text-white text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                  Twitter Access Token
                </label>
                <input
                  type="text"
                  value={settings.twitterAccessToken || ''}
                  onChange={(e) => setSettings({ ...settings, twitterAccessToken: e.target.value })}
                  placeholder="Access Token"
                  className="w-full px-3 py-2 rounded-lg bg-steam-darker border border-steam-accent text-white text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                  Twitter Access Token Secret
                </label>
                <input
                  type="password"
                  value={settings.twitterAccessTokenSecret || ''}
                  onChange={(e) => setSettings({ ...settings, twitterAccessTokenSecret: e.target.value })}
                  placeholder="Access Token Secret"
                  className="w-full px-3 py-2 rounded-lg bg-steam-darker border border-steam-accent text-white text-sm font-mono"
                />
              </div>
            </div>
          </div>

          {/* Web Site & Monetization Section */}
          <div className="p-6 rounded-2xl bg-steam-card border border-steam-accent/60 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-steam-green" />
              Web Sitesi & Gelir Ayarları
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                  Web Sitesi URL&apos;i (Tweetlerde kullanılacak link)
                </label>
                <input
                  type="text"
                  value={settings.siteUrl}
                  onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                  placeholder="https://siteniz.com"
                  className="w-full px-3 py-2 rounded-lg bg-steam-darker border border-steam-accent text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                  Google AdSense Client ID (Opsiyonel)
                </label>
                <input
                  type="text"
                  value={settings.googleAdsenseId || ''}
                  onChange={(e) => setSettings({ ...settings, googleAdsenseId: e.target.value })}
                  placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                  className="w-full px-3 py-2 rounded-lg bg-steam-darker border border-steam-accent text-white text-sm"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={savingSettings}
            className="px-6 py-3 rounded-xl bg-steam-blue hover:bg-blue-400 text-steam-darker font-black text-sm transition-all shadow-lg glow-blue disabled:opacity-50"
          >
            {savingSettings ? 'Kaydediliyor...' : 'Tüm Ayarları Kaydet'}
          </button>
        </form>
      )}

      {/* TAB 3: Logs */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">Tweet Paylaşım Geçmişi</h2>
          {logs.length > 0 ? (
            <div className="space-y-3">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 rounded-xl bg-steam-card border border-steam-accent/50 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{log.dealTitle}</span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                          log.status === 'SUCCESS'
                            ? 'bg-green-900/50 text-green-300 border border-green-700/50'
                            : log.status === 'DRY_RUN'
                            ? 'bg-blue-900/50 text-blue-300 border border-blue-700/50'
                            : 'bg-red-900/50 text-red-300 border border-red-700/50'
                        }`}
                      >
                        {log.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(log.createdAt).toLocaleString('tr-TR')}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-steam-darker/80 border border-steam-accent/40 font-mono text-xs text-gray-300 whitespace-pre-line">
                    {log.tweetText}
                  </div>

                  {log.errorMessage && (
                    <p className="text-xs text-red-400 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {log.errorMessage}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">Henüz kaydedilmiş tweet logu yok.</div>
          )}
        </div>
      )}

      {/* Tweet Modal */}
      {selectedDealForTweet && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-2xl bg-steam-darker border border-steam-accent/70 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-steam-accent/40">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Send className="w-4 h-4 text-steam-blue" />
                Tweet Önizle & Gönder
              </h3>
              <button
                onClick={() => setSelectedDealForTweet(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-steam-card border border-steam-accent/50">
                <div className="relative w-16 aspect-[16/9] rounded overflow-hidden flex-shrink-0">
                  <Image
                    src={selectedDealForTweet.headerImage}
                    alt={selectedDealForTweet.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{selectedDealForTweet.title}</h4>
                  <p className="text-xs text-steam-green font-semibold">
                    -%{Math.round(selectedDealForTweet.savingsPercentage)} İndirim ($
                    {selectedDealForTweet.salePrice.toFixed(2)})
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase mb-1">
                  Tweet Metni (Düzenlenebilir)
                </label>
                <textarea
                  rows={9}
                  value={tweetPreviewText}
                  onChange={(e) => setTweetPreviewText(e.target.value)}
                  className="w-full p-3 rounded-xl bg-steam-card border border-steam-accent/60 text-white text-xs font-mono focus:outline-none focus:border-steam-blue"
                />
                <div className="flex items-center justify-between text-[11px] text-gray-400 mt-1">
                  <span>Karakter Sayısı: {tweetPreviewText.length}</span>
                  <span>Görsel: Banner otomatik eklenecek</span>
                </div>
              </div>

              {tweetStatusMsg && (
                <div
                  className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    tweetStatusMsg.type === 'success'
                      ? 'bg-green-900/40 text-green-300 border border-green-700/50'
                      : 'bg-red-900/40 text-red-300 border border-red-700/50'
                  }`}
                >
                  {tweetStatusMsg.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  )}
                  {tweetStatusMsg.text}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-steam-accent/40">
              <button
                onClick={() => setSelectedDealForTweet(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white"
              >
                Kapat
              </button>

              <button
                onClick={handleSendTweet}
                disabled={isTweeting}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-lg disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                {isTweeting ? 'Tweet Atılıyor...' : 'Tweeti Yayınla'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
