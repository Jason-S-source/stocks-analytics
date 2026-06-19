import { NextRequest, NextResponse } from 'next/server';
import { searchStocks } from '@/lib/yahoo';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q');

  if (!q || q.trim().length === 0) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await searchStocks(q.trim());
    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ results: [], error: '搜索失败，请稍后重试' });
  }
}
