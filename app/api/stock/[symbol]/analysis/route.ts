import { NextRequest, NextResponse } from 'next/server';
import { getStockNews } from '@/lib/news';
import { geminiAnalysis, heuristicAnalysis } from '@/lib/analysis';
import { getCached, setCache, deleteCache } from '@/lib/cache';
import { CACHE_TTL } from '@/lib/constants';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;
  const cacheKey = `analysis:${symbol.toUpperCase()}`;

  // 检查缓存
  const cached = getCached(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  try {
    // 获取新闻
    const articles = await getStockNews(symbol);

    // 检查用户是否提供了 API Key（通过 query 参数或 header）
    const apiKey = request.nextUrl.searchParams.get('apiKey') ||
      request.headers.get('x-gemini-api-key');

    let result;
    if (apiKey && apiKey.length > 10) {
      // 优先尝试 Gemini
      result = await geminiAnalysis(symbol, articles, apiKey);
    } else {
      // 无 API Key，使用关键词分析
      result = heuristicAnalysis(symbol, articles);
    }

    // 缓存结果
    setCache(cacheKey, result, CACHE_TTL.ANALYSIS);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Analysis API error:', error);
    return NextResponse.json({
      symbol: symbol.toUpperCase(),
      sentiment: 'neutral',
      summary: 'AI 分析暂时不可用，请稍后刷新重试。',
      confidence: 'low',
      method: 'heuristic',
      analyzedAt: new Date().toISOString(),
    });
  }
}
