import { NextRequest, NextResponse } from 'next/server';
import { getQuotes } from '@/lib/yahoo';

export async function GET(request: NextRequest) {
  const symbolsParam = request.nextUrl.searchParams.get('symbols');

  if (!symbolsParam) {
    return NextResponse.json({ quotes: [] });
  }

  const symbols = symbolsParam.split(',').map(s => s.trim()).filter(Boolean);

  if (symbols.length === 0) {
    return NextResponse.json({ quotes: [] });
  }

  try {
    const quotes = await getQuotes(symbols);
    return NextResponse.json({ quotes });
  } catch (error) {
    console.error('Quotes API error:', error);
    return NextResponse.json({ quotes: [], error: '获取报价失败' });
  }
}
