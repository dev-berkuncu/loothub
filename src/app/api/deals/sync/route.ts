import { NextRequest, NextResponse } from 'next/server';
import { syncSteamDeals } from '@/lib/steam';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const limit = body.limit || 50;

    const result = await syncSteamDeals(limit);
    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
