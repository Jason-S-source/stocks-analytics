'use client';

import { useEffect, useState, useCallback } from 'react';
import { getWatchlist, removeFromWatchlist } from '@/lib/watchlist';
import type { StockQuote } from '@/types';

interface WatchlistSectionProps {
  onSelectStock: (symbol: string) => void;
}

export default function WatchlistSection({ onSelectStock }: WatchlistSectionProps) {
  const [symbols, setSymbols] = useState<string[]>([]);
  const [quotes, setQuotes] = useState<StockQuote[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshWatchlist = useCallback(async () => {
    const list = getWatchlist();
    setSymbols(list);
    if (list.length === 0) {
      setQuotes([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/stocks/quotes?symbols=${list.join(',')}`);
      const data = await res.json();
      setQuotes(data.quotes || []);
    } catch {
      setQuotes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshWatchlist();
    const handleStorage = () => refreshWatchlist();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [refreshWatchlist]);

  function handleRemove(symbol: string) {
    removeFromWatchlist(symbol);
    setSymbols(prev => prev.filter(s => s !== symbol));
    setQuotes(prev => prev.filter(q => q.symbol !== symbol));
  }

  // 空自选
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
        <h3 className="text-base font-semibold text-gray-700">
          ⭐ 我的自选 ({symbols.length})
        </h3>
        <button
          onClick={refreshWatchlist}
          className="text-xs text-blue-600 hover:text-blue-700 transition"
        >
          {loading ? '刷新中...' : '🔄 刷新'}
        </button>
      </div>

      <div className="space-y-2">
        {loading && quotes.length === 0
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-12 rounded-lg bg-gray-100 animate-pulse" />
            ))
          : quotes.map((q) => (
              <WatchlistItem
                key={q.symbol}
                quote={q}
                onSelect={() => onSelectStock(q.symbol)}
                onRemove={() => handleRemove(q.symbol)}
              />
            ))}

        {/* 无报价数据的股票只显示代码 */}
        {symbols
          .filter(s => !quotes.some(q => q.symbol === s))
          .map(s => (
            <div
              key={s}
              className="flex items-center justify-between rounded-lg border border-gray-100 p-3 hover:bg-gray-50 transition cursor-pointer"
              onClick={() => onSelectStock(s)}
            >
              <div>
                <div className="text-sm font-bold text-gray-900">{s}</div>
                <div className="text-xs text-gray-400">暂无数据</div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(s);
                }}
                className="text-gray-400 hover:text-red-500 transition"
                title="取消自选"
              >
                ⭐
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}

/** 自选股票单项 */
function WatchlistItem({
  quote,
  onSelect,
  onRemove,
}: {
  quote: StockQuote;
  onSelect: () => void;
  onRemove: () => void;
}) {
  const change = quote.regularMarketChange;
  const changePercent = quote.regularMarketChangePercent;
  const isPositive = change !== undefined && change >= 0;
  const price = quote.regularMarketPrice;

  return (
    <div
      className="flex items-center justify-between rounded-lg border border-gray-100 p-3 hover:bg-gray-50 transition cursor-pointer"
      onClick={onSelect}
    >
      <div className="min-w-0">
        <div className="text-sm font-bold text-gray-900">{quote.symbol}</div>
        <div className="text-xs text-gray-400 truncate">
          {quote.shortName || quote.longName || ''}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="text-sm font-semibold text-gray-900">
            {price !== undefined ? `$${price.toFixed(2)}` : '--'}
          </div>
          {change !== undefined && (
            <div
              className={`text-xs font-medium ${
                isPositive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {isPositive ? '+' : ''}
              {change.toFixed(2)}
              {changePercent !== undefined &&
                ` (${isPositive ? '+' : ''}${changePercent.toFixed(2)}%)`}
            </div>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="text-yellow-500 hover:text-red-500 transition text-lg"
          title="取消自选"
        >
          ⭐
        </button>
      </div>
    </div>
  );
}
