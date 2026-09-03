import { NextRequest, NextResponse } from 'next/server';
import { getDealById, getAllSettings } from '@/lib/db';
import { formatTweetText } from '@/lib/twitter';

export async function POST(request: NextRequest) {
  try {
    const { dealId } = await request.json();
    if (!dealId) {
      return NextResponse.json({ error: 'dealId gereklidir' }, { status: 400 });
    }

    const deal = getDealById(dealId);
    if (!deal) {
      return NextResponse.json({ error: 'İndirim bulunamadı' }, { status: 404 });
    }

    const settings = getAllSettings();
    const tweetText = formatTweetText(deal, settings.siteUrl);

    return NextResponse.json({
      deal,
      tweetText,
      imageUrl: deal.headerImage,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
