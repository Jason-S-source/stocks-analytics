'use client';

import { useEffect, useState, useCallback } from 'react';
import { getWatchlist, removeFromWatchlist } from '@/lib/watchlist';
import { fetchQuotes } from '@/lib/yahoo-client';
import type { StockQuote } from '@/types';

interface WatchlistSectionProps { onSelectStock: (symbol: string) => void; }

export default function WatchlistSection({ onSelectStock }: WatchlistSectionProps) {
  const [symbols, setSymbols] = useState<string[]>([]);
  const [quotes, setQuotes] = useState<StockQuote[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshWatchlist = useCallback(async () => {
    const list = getWatchlist();
    setSymbols(list);
    if (list.length === 0) { setQuotes([]); return; }
    setLoading(true);
    try {
      const data = await fetchQuotes(list);
      setQuotes(data || []);
    } catch { setQuotes([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    refreshWatchlist();
    window.addEventListener('storage', refreshWatchlist);
    return () => window.removeEventListener('storage', refreshWatchlist);
  }, [refreshWatchlist]);

  function handleRemove(symbol: string) {
    removeFromWatchlist(symbol);
    setSymbols(prev => prev.filter(s => s !== symbol));
    setQuotes(prev => prev.filter(q => q.symbol !== symbol));
  }

  if (symbols.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
        <span className="text-3xl">⭐</span>
        <p className="mt-2 text-sm text-gray-500">还没有自选股票</p>
        <p className="text-xs text-gray-400">点击股票旁的星号添加到自选</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-700">⭐ 我的自选 ({symbols.length})</h3>
        <button onClick={refreshWatchlist} className="text-xs text-blue-600 hover:text-blue-700 transition">
          {loading ? '刷新中...' : '🔄 刷新'}
        </button>
      </div>
      <div className="space-y-2">
        {loading && quotes.length === 0
          ? [1,2,3].map(i => <div key={i} className="h-12 rounded-lg bg-gray-100 animate-pulse" />)
          : quotes.map(q => (
              <div key={q.symbol} className="flex items-center justify-between rounded-lg border border-gray-100 p-3 hover:bg-gray-50 transition cursor-pointer" onClick={() => onSelectStock(q.symbol)}>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-gray-900">{q.symbol}</div>
                  <div className="text-xs text-gray-400 truncate">{q.shortName || q.longName || ''}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      {q.regularMarketPrice ? `${q.regularMarketPrice.toFixed(2)}` : '--'}
                    </div>
                    {q.regularMarketChange !== undefined && (
                      <div className={`text-xs font-medium ${q.regularMarketChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {q.regularMarketChange >= 0 ? '+' : ''}{q.regularMarketChange.toFixed(2)}
                        {q.regularMarketChangePercent !== undefined && ` (${q.regularMarketChangePercent >= 0 ? '+' : ''}${q.regularMarketChangePercent.toFixed(2)}%)`}
                      </div>
                    )}
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); handleRemove(q.symbol); }} className="text-yellow-500 hover:text-red-500 transition text-lg" title="取消自选">⭐</button>
                </div>
              </div>
            ))}
        {symbols.filter(s => !quotes.some(q => q.symbol === s)).map(s => (
          <div key={s} className="flex items-center justify-between rounded-lg border border-gray-100 p-3 hover:bg-gray-50 transition cursor-pointer" onClick={() => onSelectStock(s)}>
            <div><div className="text-sm font-bold text-gray-900">{s}</div><div className="text-xs text-gray-400">暂无数据</div></div>
            <button onClick={(e) => { e.stopPropagation(); handleRemove(s); }} className="text-gray-400 hover:text-red-500 transition">⭐</button>
          </div>
        ))}
      </div>
    </div>
  );
}
