import { NextRequest, NextResponse } from 'next/server';
import { getStockNews } from '@/lib/news';
import { getCached, setCache } from '@/lib/cache';
import { CACHE_TTL } from '@/lib/constants';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;
  const cacheKey = `news:${symbol.toUpperCase()}`;

  const cached = getCached(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  try {
    const articles = await getStockNews(symbol);
    const result = { symbol: symbol.toUpperCase(), articles };
    setCache(cacheKey, result, CACHE_TTL.NEWS);
    return NextResponse.json(result);
  } catch (error) {
    console.error('News API error:', error);
    return NextResponse.json({ symbol: symbol.toUpperCase(), articles: [], error: '获取新闻失败' });
  }
}
