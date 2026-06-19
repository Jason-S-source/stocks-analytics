'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import SearchBar from '@/components/home/SearchBar';
import CategoryTabs from '@/components/home/CategoryTabs';
import StockList from '@/components/home/StockList';
import MarketToggle from '@/components/home/MarketToggle';
import WatchlistSection from '@/components/home/WatchlistSection';
import type { StockQuote } from '@/types';
import type { StockCategory } from '@/components/home/CategoryTabs';
import type { Market } from '@/lib/constants';
import { getStocksByMarket } from '@/lib/constants';

export default function HomePage() {
  const router = useRouter();
  const [market, setMarket] = useState<Market>('us');
  const [category, setCategory] = useState<StockCategory>('trending');
  const [quotes, setQuotes] = useState<StockQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWatchlist, setShowWatchlist] = useState(true);

  const fetchStocks = useCallback(async (cat: StockCategory, mkt: Market) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/stocks/trending?category=${cat}&market=${mkt}`);
      const data = await res.json();
      if (data.quotes && data.quotes.length > 0) {
        setQuotes(data.quotes);
      } else if (data.fallback) {
        setQuotes([]);
        setError('实时数据暂不可用，请稍后刷新');
      } else {
        setQuotes([]);
        setError('暂无股票数据');
      }
    } catch {
      setError('获取数据失败，请检查网络后刷新');
      setQuotes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 市场或分类变化时重新获取数据
  useEffect(() => {
    fetchStocks(category, market);
  }, [category, market, fetchStocks]);

  // 市场配置
  const marketStocks = getStocksByMarket(market);

  function handleSelectStock(symbol: string) {
    router.push(`/stock/${symbol}`);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* 标题区域 */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          股票分析平台
        </h1>
        <p className="mt-2 text-lg text-gray-500">
          查看实时行情 · K线技术分析 · AI 智能解读
        </p>
      </div>

      {/* 搜索栏 */}
      <div className="mb-6">
        <SearchBar />
      </div>

      {/* 市场切换 + 自选折叠 */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <MarketToggle active={market} onChange={setMarket} />
        <button
          onClick={() => setShowWatchlist(!showWatchlist)}
          className="text-sm text-blue-600 hover:text-blue-700 transition"
        >
          {showWatchlist ? '收起自选 ↑' : '展开自选 ↓'}
        </button>
      </div>

      {/* 自选股票 */}
      {showWatchlist && (
        <div className="mb-6">
          <WatchlistSection onSelectStock={handleSelectStock} />
        </div>
      )}

      {/* 分类标签 */}
      <div className="mb-6">
        <CategoryTabs active={category} onChange={setCategory} />
      </div>

      {/* 股票列表 */}
      {loading ? (
        <LoadingGrid />
      ) : error ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
          <span className="text-4xl">⚠️</span>
          <p className="mt-3 text-gray-500">{error}</p>
          <button
            onClick={() => fetchStocks(category, market)}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition"
          >
            🔄 刷新数据
          </button>
        </div>
      ) : (
        <>
          <StockList quotes={quotes} />

          {/* 默认股票列表 */}
          <div className="mt-8">
            <h3 className="mb-4 text-lg font-semibold text-gray-700">
              📋 更多{mktLabel(market)}
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {marketStocks
                .filter(s => !quotes.some(q => q.symbol === s.symbol))
                .map(stock => (
                  <a
                    key={stock.symbol}
                    href={`/stock/${stock.symbol}`}
                    className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:border-blue-300 hover:text-blue-600 transition"
                  >
                    <span className="font-bold">{stock.symbol.replace('.HK', '')}</span>
                    <span className="text-gray-400 text-xs truncate">{stock.name}</span>
                  </a>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function mktLabel(market: string): string {
  return market === 'us' ? '美股' : '港股';
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 animate-pulse">
      {Array.from({ length: 15 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="h-5 w-16 rounded bg-gray-200" />
          <div className="mt-2 h-3 w-24 rounded bg-gray-200" />
          <div className="mt-3 h-4 w-20 rounded bg-gray-200" />
        </div>
      ))}
    </div>
  );
}
