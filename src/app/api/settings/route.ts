import { NextRequest, NextResponse } from 'next/server';
import { getAllSettings, setSetting } from '@/lib/db';

export async function GET() {
  try {
    const settings = getAllSettings();
    // Mask sensitive keys for security in UI
    const maskedSettings = {
      ...settings,
      twitterApiKey: settings.twitterApiKey ? `${settings.twitterApiKey.slice(0, 4)}••••••••` : '',
      twitterApiSecret: settings.twitterApiSecret ? '••••••••••••••••' : '',
      twitterAccessToken: settings.twitterAccessToken ? `${settings.twitterAccessToken.slice(0, 4)}••••••••` : '',
      twitterAccessTokenSecret: settings.twitterAccessTokenSecret ? '••••••••••••••••' : '',
    };
    return NextResponse.json(maskedSettings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.autoTweetEnabled !== undefined) setSetting('autoTweetEnabled', Boolean(body.autoTweetEnabled));
    if (body.minDiscountPercentage !== undefined) setSetting('minDiscountPercentage', Number(body.minDiscountPercentage));
    if (body.minSteamRatingPercentage !== undefined) setSetting('minSteamRatingPercentage', Number(body.minSteamRatingPercentage));
    if (body.postIntervalMinutes !== undefined) setSetting('postIntervalMinutes', Number(body.postIntervalMinutes));
    if (body.siteName !== undefined) setSetting('siteName', String(body.siteName));
    if (body.siteUrl !== undefined) setSetting('siteUrl', String(body.siteUrl));
    if (body.googleAdsenseId !== undefined) setSetting('googleAdsenseId', String(body.googleAdsenseId));

    // Only update twitter keys if non-empty and not masked
    if (body.twitterApiKey && !body.twitterApiKey.includes('••••')) setSetting('twitterApiKey', body.twitterApiKey);
    if (body.twitterApiSecret && !body.twitterApiSecret.includes('••••')) setSetting('twitterApiSecret', body.twitterApiSecret);
    if (body.twitterAccessToken && !body.twitterAccessToken.includes('••••')) setSetting('twitterAccessToken', body.twitterAccessToken);
    if (body.twitterAccessTokenSecret && !body.twitterAccessTokenSecret.includes('••••')) setSetting('twitterAccessTokenSecret', body.twitterAccessTokenSecret);

    return NextResponse.json({ success: true, settings: getAllSettings() });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
