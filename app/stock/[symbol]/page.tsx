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
import { fetchQuote, fetchChart, fetchNews } from '@/lib/yahoo-client';
import { heuristicAnalysis } from '@/lib/analysis';
import type { StockQuote, ChartDataPoint, NewsArticle, AnalysisResult } from '@/types';

const PriceLineChart = dynamic(
  () => import('@/components/stock/PriceLineChart'),
  { ssr: false, loading: () => <div className="rounded-xl border border-gray-200 bg-white p-4 animate-pulse"><div className="h-6 w-24 rounded bg-gray-200 mb-4" /><div className="h-[400px] w-full rounded bg-gray-100" /></div> }
);

const KlineChart = dynamic(
  () => import('@/components/stock/KlineChart'),
  { ssr: false, loading: () => <div className="rounded-xl border border-gray-200 bg-white p-4 animate-pulse"><div className="h-6 w-24 rounded bg-gray-200 mb-4" /><div className="h-[500px] w-full rounded bg-gray-100" /></div> }
);

export default function StockDetailPage() {
  const params = useParams();
  const symbol = (params?.symbol as string || '').toUpperCase();

  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(true);
  const [lineData, setLineData] = useState<ChartDataPoint[]>([]);
  const [klineData, setKlineData] = useState<ChartDataPoint[]>([]);
  const [klineInterval, setKlineInterval] = useState<'1d' | '1wk' | '1mo'>('1d');
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  const fetchData = useCallback(async (interval: string) => {
    setQuoteLoading(true);
    setAnalysisLoading(true);

    const rangeMap: Record<string, string> = { '1d': '3mo', '1wk': '6mo', '1mo': '5y' };
    const range = rangeMap[interval] || '3mo';

    const [q, chart, news] = await Promise.all([
      fetchQuote(symbol),
      fetchChart(symbol, range, interval),
      fetchNews(symbol),
    ]);

    setQuote(q);
    setKlineData(chart);
    if (interval === '1d') setLineData(chart);
    setNewsArticles(news);

    // 客户端 AI 分析（关键词分析，始终可用）
    const result = heuristicAnalysis(symbol, news);
    setAnalysisResult(result);
    setAnalysisLoading(false);
    setQuoteLoading(false);
  }, [symbol]);

  useEffect(() => {
    fetchData('1d');
  }, [symbol, fetchData]);

  function handleIntervalChange(interval: '1d' | '1wk' | '1mo') {
    setKlineInterval(interval);
    fetchData(interval);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <a href="/" className="text-sm text-blue-600 hover:text-blue-700 transition">← 返回首页</a>
          <WatchlistButton symbol={symbol} />
        </div>
        <SettingsPanel />
      </div>

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
        </div>
      )}

      <div className="mt-6 space-y-6">
        <PriceLineChart data={lineData} />
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h3 className="text-base font-semibold text-gray-700">📈 K线分析</h3>
            <PeriodSelector value={klineInterval} onChange={handleIntervalChange} />
          </div>
          <KlineChart data={klineData} interval={klineInterval} />
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <NewsSection articles={newsArticles} />
        <AnalysisSection
          result={analysisResult}
          loading={analysisLoading}
          error={null}
          onRefresh={() => fetchData(klineInterval)}
        />
      </div>

      <div className="mt-6">
        <CommentSection symbol={symbol} />
      </div>
    </div>
  );
}
