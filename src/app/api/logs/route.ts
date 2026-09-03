import { NextResponse } from 'next/server';
import { getTweetLogs } from '@/lib/db';

export async function GET() {
  try {
    const logs = getTweetLogs(100);
    return NextResponse.json({ logs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
