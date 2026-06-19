'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import StockHeader from '@/components/stock/StockHeader';
import PeriodSelector from '@/components/stock/PeriodSelector';
import NewsSection from '@/components/stock/NewsSection';
import AnalysisSection from '@/components/stock/AnalysisSection';
import CommentSection from '@/components/stock/CommentSection';
import SettingsPanel from '@/components/ui/SettingsPanel';
import WatchlistButton from '@/components/stock/WatchlistButton';
import type { StockQuote, ChartDataPoint, NewsArticle, AnalysisResult } from '@/types';

// lightweight-charts 需要 Canvas API，禁用 SSR
const PriceLineChart = dynamic(
  () => import('@/components/stock/PriceLineChart'),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

const KlineChart = dynamic(
  () => import('@/components/stock/KlineChart'),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

function ChartSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm animate-pulse">
      <div className="h-6 w-24 rounded bg-gray-200 mb-4" />
      <div className="h-[400px] w-full rounded bg-gray-100" />
    </div>
  );
}

export default function StockDetailPage() {
  const params = useParams();
  const symbol = (params?.symbol as string || '').toUpperCase();

  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(true);

  const [lineData, setLineData] = useState<ChartDataPoint[]>([]);
  const [klineData, setKlineData] = useState<ChartDataPoint[]>([]);
  const [klineInterval, setKlineInterval] = useState<'1d' | '1wk' | '1mo'>('1d');
  const [chartLoading, setChartLoading] = useState(true);

  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);

  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // 获取股票报价
  const fetchQuote = useCallback(async () => {
    setQuoteLoading(true);
    try {
      const res = await fetch(`/api/stocks/quotes?symbols=${symbol}`);
      const data = await res.json();
      if (data.quotes && data.quotes.length > 0) {
        setQuote(data.quotes[0]);
      }
    } catch {
      // 静默处理
    } finally {
      setQuoteLoading(false);
    }
  }, [symbol]);

  // 获取历史数据
  const fetchHistory = useCallback(async (interval: string) => {
    setChartLoading(true);
    const periodMap: Record<string, string> = {
      '1d': '3mo',
      '1wk': '6mo',
      '1mo': '5y',
    };
    const period = periodMap[interval] || '3mo';

    try {
      const res = await fetch(
        `/api/stock/${symbol}/history?period=${period}&interval=${interval}`
      );
      const data = await res.json();
      setKlineData(data.data || []);
      // 折线图始终用 1mo 日线数据
      if (interval === '1d') {
        setLineData(data.data || []);
      }
    } catch {
      // 静默处理
    } finally {
      setChartLoading(false);
    }
  }, [symbol]);

  // 获取新闻
  const fetchNews = useCallback(async () => {
    try {
      const res = await fetch(`/api/stock/${symbol}/news`);
      const data = await res.json();
      setNewsArticles(data.articles || []);
    } catch {
      // 静默处理
    }
  }, [symbol]);

  // AI 分析
  const fetchAnalysis = useCallback(async (forceRefresh = false) => {
    setAnalysisLoading(true);
    setAnalysisError(null);
    try {
      // 获取存储的 API Key
      const apiKey = typeof window !== 'undefined'
        ? localStorage.getItem('gemini-api-key') || ''
        : '';

      let url = `/api/stock/${symbol}/analysis`;
      if (apiKey) {
        url += `?apiKey=${encodeURIComponent(apiKey)}`;
      }
      if (forceRefresh) {
        url += (url.includes('?') ? '&' : '?') + '_t=' + Date.now();
      }

      const res = await fetch(url);
      const data = await res.json();
      setAnalysisResult(data);
    } catch {
      setAnalysisError('AI 分析获取失败');
    } finally {
      setAnalysisLoading(false);
    }
  }, [symbol]);

  // 初始加载
  useEffect(() => {
    fetchQuote();
    fetchHistory('1d');
    fetchNews();
    fetchAnalysis();
  }, [symbol, fetchQuote, fetchHistory, fetchNews, fetchAnalysis]);

  // K线周期切换
  function handleIntervalChange(interval: '1d' | '1wk' | '1mo') {
    setKlineInterval(interval);
    fetchHistory(interval);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* 返回 + 自选 + AI 设置 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <a href="/" className="text-sm text-blue-600 hover:text-blue-700 transition">
            ← 返回首页
          </a>
          <WatchlistButton symbol={symbol} />
        </div>
        <SettingsPanel />
      </div>

      {/* 股票头 */}
      {quoteLoading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6 animate-pulse">
          <div className="h-8 w-20 rounded bg-gray-200 mb-2" />
          <div className="h-4 w-40 rounded bg-gray-200" />
        </div>
      ) : quote ? (
        <StockHeader quote={quote} />
      ) : (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
          <span className="text-4xl">🔍</span>
          <p className="mt-2 text-gray-500">未找到股票 {symbol} 的数据</p>
          <p className="text-sm text-gray-400">请检查股票代码是否正确</p>
        </div>
      )}

      {/* 图表区域 */}
      <div className="mt-6 space-y-6">
        {/* 折线图 */}
        <PriceLineChart data={lineData} />

        {/* K线图 */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h3 className="text-base font-semibold text-gray-700">📈 K线分析</h3>
            <PeriodSelector value={klineInterval} onChange={handleIntervalChange} />
          </div>
          <KlineChart data={klineData} interval={klineInterval} />
        </div>
      </div>

      {/* 新闻 + AI 分析 */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <NewsSection articles={newsArticles} />
        <AnalysisSection
          result={analysisResult}
          loading={analysisLoading}
          error={analysisError}
          onRefresh={() => fetchAnalysis(true)}
        />
      </div>

      {/* 留言区 */}
      <div className="mt-6">
        <CommentSection symbol={symbol} />
      </div>
    </div>
  );
}
