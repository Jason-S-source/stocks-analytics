import { NextRequest, NextResponse } from 'next/server';
import { getChart } from '@/lib/yahoo';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;
  const searchParams = request.nextUrl.searchParams;
  const period = (searchParams.get('period') || '1mo') as '1d' | '5d' | '1mo' | '3mo' | '6mo' | '1y' | '5y';
  const interval = (searchParams.get('interval') || '1d') as '1d' | '1wk' | '1mo';

  try {
    const data = await getChart(symbol, period, interval);
    return NextResponse.json({ symbol: symbol.toUpperCase(), period, interval, data });
  } catch (error) {
    console.error('History API error:', error);
    return NextResponse.json({ symbol: symbol.toUpperCase(), data: [], error: '获取历史数据失败' });
  }
}
