'use client';

import { SENTIMENT_LABELS, SENTIMENT_COLORS } from '@/lib/constants';
import type { AnalysisResult } from '@/types';

interface AnalysisSectionProps {
  result: AnalysisResult | null;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export default function AnalysisSection({ result, loading, error, onRefresh }: AnalysisSectionProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-700">🤖 AI 分析</h3>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="text-xs text-blue-600 hover:text-blue-700 disabled:text-gray-400 transition"
        >
          {loading ? '分析中...' : '🔄 刷新分析'}
        </button>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-8 w-24 rounded bg-gray-200" />
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-3/4 rounded bg-gray-200" />
        </div>
      ) : error ? (
        <div className="text-center py-6">
          <span className="text-3xl">⚠️</span>
          <p className="mt-2 text-sm text-gray-500">{error}</p>
          <button
            onClick={onRefresh}
            className="mt-3 text-sm text-blue-600 hover:text-blue-700"
          >
            点击重试
          </button>
        </div>
      ) : result ? (
        <div>
          {/* 情绪判断 */}
          <div className="flex items-center gap-3 mb-3">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold ${
                SENTIMENT_COLORS[result.sentiment] || 'text-gray-600 bg-gray-50'
              }`}
            >
              {SENTIMENT_LABELS[result.sentiment] || result.sentiment}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded ${
              result.confidence === 'high' ? 'bg-green-100 text-green-700' :
              result.confidence === 'medium' ? 'bg-blue-100 text-blue-700' :
              'bg-gray-100 text-gray-500'
            }`}>
              可信度: {result.confidence === 'high' ? '高' : result.confidence === 'medium' ? '中' : '低'}
            </span>
            <span className="text-xs text-gray-400">
              {result.method === 'gemini' ? 'Google Gemini' : '关键词分析'}
            </span>
          </div>

          {/* 分析总结 */}
          <p className="text-sm text-gray-600 leading-relaxed">{result.summary}</p>

          {/* 分析时间 */}
          <p className="mt-2 text-xs text-gray-400">
            分析时间: {new Date(result.analyzedAt).toLocaleString('zh-CN')}
          </p>
        </div>
      ) : (
        <div className="text-center py-6">
          <span className="text-3xl">🤖</span>
          <p className="mt-2 text-sm text-gray-500">点击刷新获取 AI 分析</p>
        </div>
      )}
    </div>
  );
}
