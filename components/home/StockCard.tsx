'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { isInWatchlist, toggleWatchlist } from '@/lib/watchlist';
import type { StockQuote } from '@/types';

interface StockCardProps {
  quote: StockQuote;
}

export default function StockCard({ quote }: StockCardProps) {
  const [watching, setWatching] = useState(false);
  const price = quote.regularMarketPrice;
  const change = quote.regularMarketChange;
  const changePercent = quote.regularMarketChangePercent;
  const isPositive = change !== undefined && change >= 0;

  useEffect(() => {
    setWatching(isInWatchlist(quote.symbol));
  }, [quote.symbol]);

  function handleToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWatchlist(quote.symbol);
    setWatching(added);
    window.dispatchEvent(new Event('storage'));
  }

  return (
    <Link
      href={`/stock/${quote.symbol}`}
      className="group block relative rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5"
    >
      {/* 自选星标 */}
      <button
        onClick={handleToggle}
        className={`absolute top-3 right-3 text-xl transition ${
          watching ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'
        }`}
        title={watching ? '取消自选' : '添加自选'}
      >
        {watching ? '⭐' : '☆'}
      </button>

      {/* 股票代码 + 公司名 */}
      <div className="flex items-start justify-between pr-8">
        <div className="min-w-0">
          <div className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
            {quote.symbol.replace('.HK', '')}
          </div>
          <div className="mt-0.5 text-xs text-gray-500 truncate">
            {quote.shortName || quote.longName || quote.symbol}
          </div>
        </div>
        <div className="text-right ml-2 shrink-0">
          <div className="text-base font-semibold text-gray-900">
            {price !== undefined ? `$${price.toFixed(2)}` : '--'}
          </div>
          {change !== undefined && changePercent !== undefined && (
            <div
              className={`mt-0.5 text-xs font-medium ${
                isPositive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {isPositive ? '+' : ''}
              {change.toFixed(2)} ({isPositive ? '+' : ''}
              {changePercent.toFixed(2)}%)
            </div>
          )}
        </div>
      </div>

      {/* 成交量 */}
      {quote.regularMarketVolume !== undefined && (
        <div className="mt-3 text-xs text-gray-400">
          成交量: {formatVolume(quote.regularMarketVolume)}
        </div>
      )}
    </Link>
  );
}

function formatVolume(vol: number): string {
  if (vol >= 1e9) return `${(vol / 1e9).toFixed(2)}B`;
  if (vol >= 1e6) return `${(vol / 1e6).toFixed(2)}M`;
  if (vol >= 1e3) return `${(vol / 1e3).toFixed(1)}K`;
  return vol.toString();
}
