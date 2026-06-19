// 美股分析网站 — Yahoo Finance API 封装 (v3 API)

import YahooFinance from 'yahoo-finance2';
import { getCached, setCache, isMarketOpen } from './cache';
import { CACHE_TTL } from './constants';
import type { StockQuote, ChartDataPoint, HistoryParams } from '@/types';

// 创建 Yahoo Finance 客户端实例
const yahooFinance = new YahooFinance({
  queue: {
    concurrency: 3,      // 最大 3 个并发请求
  },
});

// ========== 报价相关 ==========

/** 获取单只股票报价 */
export async function getQuote(symbol: string): Promise<StockQuote | null> {
  const cacheKey = `quote:${symbol.toUpperCase()}`;
  const cached = getCached<StockQuote>(cacheKey);
  if (cached) return cached;

  try {
    const quote = await yahooFinance.quote(symbol);
    const result = mapQuote(quote);
    const ttl = isMarketOpen() ? CACHE_TTL.QUOTE_MARKET_OPEN : CACHE_TTL.QUOTE_MARKET_CLOSED;
    setCache(cacheKey, result, ttl);
    return result;
  } catch {
    return null;
  }
}

/** 批量获取股票报价 */
export async function getQuotes(symbols: string[]): Promise<StockQuote[]> {
  const upperSymbols = symbols.map(s => s.toUpperCase());
  const cacheKey = `quotes:${upperSymbols.join(',')}`;
  const cached = getCached<StockQuote[]>(cacheKey);
  if (cached) return cached;

  try {
    const quotes = await yahooFinance.quote(upperSymbols);
    const results = (Array.isArray(quotes) ? quotes : [quotes]).map(mapQuote);
    const ttl = isMarketOpen() ? CACHE_TTL.QUOTE_MARKET_OPEN : CACHE_TTL.QUOTE_MARKET_CLOSED;
    setCache(cacheKey, results, ttl);
    return results;
  } catch {
    return [];
  }
}

// ========== 历史数据 ==========

/** 获取历史 K线数据 */
export async function getChart(
  symbol: string,
  period: HistoryParams['period'] = '1mo',
  interval: HistoryParams['interval'] = '1d'
): Promise<ChartDataPoint[]> {
  const cacheKey = `chart:${symbol.toUpperCase()}:${period}:${interval}`;
  const cached = getCached<ChartDataPoint[]>(cacheKey);
  if (cached) return cached;

  try {
    const result = await yahooFinance.chart(symbol, {
      period1: getPeriodStartDate(period),
      interval: mapInterval(interval),
    });

    const data: ChartDataPoint[] = (result.quotes || [])
      .filter(q => q.open !== null && q.close !== null)
      .map(q => ({
        date: q.date?.toISOString().split('T')[0] || '',
        open: q.open!,
        high: q.high!,
        low: q.low!,
        close: q.close!,
        volume: q.volume || 0,
      }));

    setCache(cacheKey, data, CACHE_TTL.HISTORY);
    return data;
  } catch {
    return [];
  }
}

// ========== 搜索和热门 ==========

/** 搜索股票 */
export async function searchStocks(query: string): Promise<{ symbol: string; name: string }[]> {
  const cacheKey = `search:${query}`;
  const cached = getCached<{ symbol: string; name: string }[]>(cacheKey);
  if (cached) return cached;

  try {
    const result = await yahooFinance.search(query);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items = (result.quotes || [])
      .filter((q: any) => q.symbol && (q.shortname || q.longname))
      .slice(0, 10)
      .map((q: any) => ({
        symbol: q.symbol as string,
        name: (q.shortname || q.longname || q.symbol) as string,
      }));

    setCache(cacheKey, items, CACHE_TTL.SEARCH);
    return items;
  } catch {
    return [];
  }
}

/** 获取热门股票 */
export async function getTrending(): Promise<string[]> {
  const cacheKey = 'trending';
  const cached = getCached<string[]>(cacheKey);
  if (cached) return cached;

  try {
    const result = await yahooFinance.trendingSymbols('US');
    const symbols = (result.quotes || [])
      .slice(0, 20)
      .map((q: { symbol?: string }) => q.symbol)
      .filter(Boolean) as string[];

    setCache(cacheKey, symbols, CACHE_TTL.TRENDING);
    return symbols;
  } catch {
    return [];
  }
}

// ========== 辅助函数 ==========

/** 映射 Yahoo Finance Quote 到我们的 StockQuote 类型 */
function mapQuote(quote: Record<string, unknown>): StockQuote {
  return {
    symbol: (quote.symbol as string) || '',
    shortName: quote.shortName as string,
    longName: quote.longName as string,
    regularMarketPrice: quote.regularMarketPrice as number,
    regularMarketChange: quote.regularMarketChange as number,
    regularMarketChangePercent: quote.regularMarketChangePercent as number,
    regularMarketVolume: quote.regularMarketVolume as number,
    marketCap: quote.marketCap as number,
    fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh as number,
    fiftyTwoWeekLow: quote.fiftyTwoWeekLow as number,
    regularMarketDayHigh: quote.regularMarketDayHigh as number,
    regularMarketDayLow: quote.regularMarketDayLow as number,
    currency: quote.currency as string,
    exchange: quote.exchange as string,
    marketState: quote.marketState as string,
  };
}

/** 根据 period 计算起始日期 */
function getPeriodStartDate(period: string): string {
  const now = new Date();
  const map: Record<string, number> = {
    '1d': 1,
    '5d': 5,
    '1mo': 30,
    '3mo': 90,
    '6mo': 180,
    '1y': 365,
    '5y': 365 * 5,
  };
  const days = map[period] || 30;
  const start = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  return start.toISOString().split('T')[0];
}

/** 映射 interval 到 yahoo-finance2 的格式 */
function mapInterval(interval: string): '1d' | '1wk' | '1mo' {
  const map: Record<string, '1d' | '1wk' | '1mo'> = {
    '1d': '1d',
    '1wk': '1wk',
    '1mo': '1mo',
  };
  return map[interval] || '1d';
}
