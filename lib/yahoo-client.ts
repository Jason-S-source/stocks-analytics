// 股票分析平台 — 客户端 Yahoo Finance 数据获取
// 直接调用 Yahoo Finance 公开 REST API（支持浏览器跨域）

import type { StockQuote, ChartDataPoint } from '@/types';

const YF_BASE = 'https://query1.finance.yahoo.com';

/** 从浏览器直接获取股票报价 */
export async function fetchQuotes(symbols: string[]): Promise<StockQuote[]> {
  const symbolStr = symbols.join(',');
  try {
    const res = await fetch(
      `${YF_BASE}/v7/finance/quote?symbols=${encodeURIComponent(symbolStr)}`,
      { headers: { 'Accept': 'application/json' } }
    );
    const data = await res.json();
    const result = data?.quoteResponse?.result || [];
    return result.map(mapQuote);
  } catch {
    return [];
  }
}

/** 获取单只股票报价 */
export async function fetchQuote(symbol: string): Promise<StockQuote | null> {
  const quotes = await fetchQuotes([symbol]);
  return quotes[0] || null;
}

/** 获取历史K线数据 */
export async function fetchChart(
  symbol: string,
  range: string = '1mo',
  interval: string = '1d'
): Promise<ChartDataPoint[]> {
  try {
    const res = await fetch(
      `${YF_BASE}/v8/finance/chart/${encodeURIComponent(symbol)}?range=${range}&interval=${interval}`,
      { headers: { 'Accept': 'application/json' } }
    );
    const data = await res.json();
    const result = data?.chart?.result?.[0];
    if (!result) return [];

    const timestamps = result.timestamp || [];
    const quotes = result.indicators?.quote?.[0] || {};

    return timestamps.map((ts: number, i: number) => ({
      date: new Date(ts * 1000).toISOString().split('T')[0],
      open: quotes.open?.[i] ?? 0,
      high: quotes.high?.[i] ?? 0,
      low: quotes.low?.[i] ?? 0,
      close: quotes.close?.[i] ?? 0,
      volume: quotes.volume?.[i] ?? 0,
    })).filter((d: ChartDataPoint) => d.close > 0);
  } catch {
    return [];
  }
}

/** 搜索股票 */
export async function fetchSearch(query: string): Promise<{ symbol: string; name: string }[]> {
  try {
    const res = await fetch(
      `${YF_BASE}/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=10`,
      { headers: { 'Accept': 'application/json' } }
    );
    const data = await res.json();
    return (data?.quotes || [])
      .filter((q: Record<string, unknown>) => q.symbol && q.shortname)
      .slice(0, 10)
      .map((q: Record<string, unknown>) => ({
        symbol: q.symbol as string,
        name: (q.shortname || q.longname || q.symbol) as string,
      }));
  } catch {
    return [];
  }
}

/** 获取热门股票 */
export async function fetchTrending(): Promise<string[]> {
  try {
    const res = await fetch(
      `${YF_BASE}/v1/finance/trending/US`,
      { headers: { 'Accept': 'application/json' } }
    );
    const data = await res.json();
    return (data?.finance?.result?.[0]?.quotes || [])
      .slice(0, 20)
      .map((q: Record<string, unknown>) => q.symbol as string)
      .filter(Boolean);
  } catch {
    return [];
  }
}

/** 获取股票新闻 */
export async function fetchNews(symbol: string): Promise<{ title: string; link: string; publisher: string; publishedAt: string; summary: string; thumbnail: string }[]> {
  try {
    const res = await fetch(
      `${YF_BASE}/v1/finance/search?q=${encodeURIComponent(symbol)}&newsCount=15`,
      { headers: { 'Accept': 'application/json' } }
    );
    const data = await res.json();
    return (data?.news || []).map((n: Record<string, unknown>) => ({
      title: (n.title as string) || '无标题',
      link: (n.link as string) || '#',
      publisher: (n.publisher as string) || 'Yahoo Finance',
      publishedAt: n.providerPublishTime
        ? new Date((n.providerPublishTime as number) * 1000).toISOString()
        : '',
      summary: (n.summary as string) || '',
      thumbnail: '',
    }));
  } catch {
    return [];
  }
}

/** 映射 Yahoo Finance Quote 到 StockQuote */
function mapQuote(q: Record<string, unknown>): StockQuote {
  return {
    symbol: (q.symbol as string) || '',
    shortName: q.shortName as string,
    longName: q.longName as string,
    regularMarketPrice: q.regularMarketPrice as number,
    regularMarketChange: q.regularMarketChange as number,
    regularMarketChangePercent: q.regularMarketChangePercent as number,
    regularMarketVolume: q.regularMarketVolume as number,
    marketCap: q.marketCap as number,
    fiftyTwoWeekHigh: q.fiftyTwoWeekHigh as number,
    fiftyTwoWeekLow: q.fiftyTwoWeekLow as number,
    regularMarketDayHigh: q.regularMarketDayHigh as number,
    regularMarketDayLow: q.regularMarketDayLow as number,
    currency: q.currency as string,
    exchange: q.exchange as string,
    marketState: q.marketState as string,
  };
}
