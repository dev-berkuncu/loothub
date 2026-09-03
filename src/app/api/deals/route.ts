import { NextRequest, NextResponse } from 'next/server';
import { getDeals } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const category = searchParams.get('category') || undefined;
    const minSavings = searchParams.get('minSavings') ? Number(searchParams.get('minSavings')) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
    const minRating = searchParams.get('minRating') ? Number(searchParams.get('minRating')) : undefined;
    const unpostedOnly = searchParams.get('unpostedOnly') === 'true';
    const featuredOnly = searchParams.get('featuredOnly') === 'true';
    const sortBy = (searchParams.get('sortBy') as any) || 'savings';
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 24;
    const offset = searchParams.get('offset') ? Number(searchParams.get('offset')) : 0;

    const result = getDeals({
      search,
      category,
      minSavings,
      maxPrice,
      minRating,
      unpostedOnly,
      featuredOnly,
      sortBy,
      limit,
      offset,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
