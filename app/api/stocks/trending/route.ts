import { NextRequest, NextResponse } from 'next/server';
import { getTrending, getQuotes } from '@/lib/yahoo';
import { getStocksByMarket } from '@/lib/constants';
import type { Market } from '@/lib/constants';

export async function GET(request: NextRequest) {
  const market = (request.nextUrl.searchParams.get('market') || 'us') as Market;

  try {
    // 对于港股，Yahoo trending 可能返回不准确，直接使用预设列表
    if (market === 'hk') {
      const stocks = getStocksByMarket('hk');
      const quotes = await getQuotes(stocks.map(s => s.symbol));
      const validQuotes = quotes.filter(q => q && q.regularMarketPrice);
      return NextResponse.json({ quotes: validQuotes });
    }

    // 美股：尝试获取热门股票
    let symbols = await getTrending();
    if (!symbols || symbols.length === 0) {
      symbols = getStocksByMarket('us').map(s => s.symbol);
    }
    const quotes = await getQuotes(symbols);
    const validQuotes = quotes.filter(q => q && q.regularMarketPrice);
    return NextResponse.json({ quotes: validQuotes });
  } catch {
    const stocks = getStocksByMarket(market);
    return NextResponse.json({
      quotes: [],
      fallback: stocks.map(s => ({ symbol: s.symbol, name: s.name })),
    });
  }
}
