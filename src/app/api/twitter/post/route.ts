import { NextRequest, NextResponse } from 'next/server';
import { getDealById } from '@/lib/db';
import { postDealToTwitter } from '@/lib/twitter';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { dealId, customText } = body;

    if (!dealId) {
      return NextResponse.json({ error: 'dealId gereklidir' }, { status: 400 });
    }

    const deal = getDealById(dealId);
    if (!deal) {
      return NextResponse.json({ error: 'İndirim bulunamadı' }, { status: 404 });
    }

    const result = await postDealToTwitter(deal, customText);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
