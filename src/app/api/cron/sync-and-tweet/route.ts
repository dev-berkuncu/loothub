import { NextRequest, NextResponse } from 'next/server';
import { runAutomationCycle } from '@/lib/scheduler';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    const secret = process.env.CRON_SECRET || 'steam_deals_secret_token_123';

    // Verify bearer token or query key
    if (key !== secret && authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Yetkisiz erişim (Invalid cron key)' }, { status: 401 });
    }

    const result = await runAutomationCycle();
    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}
