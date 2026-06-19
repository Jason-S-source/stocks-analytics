// 美股分析网站 — AI 分析与情绪判断

import type { NewsArticle, AnalysisResult, Sentiment } from '@/types';

// ========== 关键词情绪分析（兜底方案）==========

const BULLISH_KEYWORDS = [
  '涨', '上涨', '大涨', '飙升', '利好', '突破', '创新高',
  'bullish', 'upgrade', 'beat', 'growth', 'surge', 'rally',
  'buy', 'outperform', 'positive', 'strong', 'profit',
  'record', 'boost', 'raise', 'raised', 'upside',
];

const BEARISH_KEYWORDS = [
  '跌', '下跌', '大跌', '暴跌', '利空', '跌破', '创新低',
  'bearish', 'downgrade', 'miss', 'decline', 'drop', 'risk',
  'sell', 'underperform', 'negative', 'weak', 'loss',
  'crash', 'cut', 'warn', 'warning', 'downside',
];

/**
 * 关键词情绪分析（始终可用，无需 API Key）
 */
export function heuristicAnalysis(
  symbol: string,
  articles: NewsArticle[]
): AnalysisResult {
  if (articles.length === 0) {
    return {
      symbol: symbol.toUpperCase(),
      sentiment: 'neutral',
      summary: `暂未获取到 ${symbol.toUpperCase()} 的相关新闻，无法进行情绪分析。建议稍后刷新获取最新资讯。`,
      confidence: 'low',
      method: 'heuristic',
      analyzedAt: new Date().toISOString(),
    };
  }

  let totalScore = 0;
  let bullishCount = 0;
  let bearishCount = 0;

  for (const article of articles) {
    const text = `${article.title || ''} ${article.summary || ''}`.toLowerCase();
    let articleScore = 0;

    for (const word of BULLISH_KEYWORDS) {
      const matches = (text.match(new RegExp(word, 'gi')) || []).length;
      articleScore += matches * 1.5;
    }
    for (const word of BEARISH_KEYWORDS) {
      const matches = (text.match(new RegExp(word, 'gi')) || []).length;
      articleScore -= matches * 1.5;
    }

    totalScore += articleScore;
    if (articleScore > 1) bullishCount++;
    else if (articleScore < -1) bearishCount++;
  }

  const sentiment: Sentiment =
    totalScore > 3 ? 'bullish' : totalScore < -3 ? 'bearish' : 'neutral';

  const totalArticles = articles.length;
  const bullishRatio = ((bullishCount / totalArticles) * 100).toFixed(0);
  const bearishRatio = ((bearishCount / totalArticles) * 100).toFixed(0);

  const summaries: Record<Sentiment, string> = {
    bullish: `基于 ${totalArticles} 篇相关新闻的分析，约 ${bullishRatio}% 的新闻呈现积极信号。整体情绪偏向乐观，市场对该股票关注度较高。`,
    bearish: `基于 ${totalArticles} 篇相关新闻的分析，约 ${bearishRatio}% 的新闻呈现消极信号。整体情绪偏向谨慎，建议关注后续消息面变化。`,
    neutral: `基于 ${totalArticles} 篇相关新闻的分析，正面和负面信号大致均衡。当前市场情绪中性，建议结合技术面综合判断。`,
  };

  return {
    symbol: symbol.toUpperCase(),
    sentiment,
    summary: summaries[sentiment],
    confidence: 'low',
    method: 'heuristic',
    analyzedAt: new Date().toISOString(),
  };
}

// ========== Gemini AI 分析（需要 API Key）==========

/**
 * 使用 Google Gemini 进行新闻情绪分析
 * 如果没有 API Key，自动降级到关键词分析
 */
export async function geminiAnalysis(
  symbol: string,
  articles: NewsArticle[],
  apiKey: string
): Promise<AnalysisResult> {
  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const newsText = articles
      .slice(0, 10)
      .map((a, i) => `${i + 1}. [${a.publisher || '未知来源'}] ${a.title}\n   ${a.summary || ''}`)
      .join('\n\n');

    const prompt = `你是一个专业的股票分析师。请根据以下关于 ${symbol} 的新闻，给出你的分析判断。

新闻列表：
${newsText}

请用中文回答，格式如下：
情绪判断：（看涨/看跌/中性，三选一）
分析总结：（2-3句话的简要分析，100字以内）

直接回答，不需要额外解释。`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // 解析 Gemini 的回复
    let sentiment: Sentiment = 'neutral';
    if (text.includes('看涨')) sentiment = 'bullish';
    else if (text.includes('看跌')) sentiment = 'bearish';

    // 提取分析总结
    const summaryMatch = text.match(/分析总结[：:]\s*(.+)/);
    const summary = summaryMatch
      ? summaryMatch[1].trim()
      : text.replace(/情绪判断[：:][\s\S]*/, '').trim().slice(0, 200);

    return {
      symbol: symbol.toUpperCase(),
      sentiment,
      summary: summary || `基于 ${articles.length} 篇新闻的 AI 分析完成。`,
      confidence: 'medium',
      method: 'gemini',
      analyzedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Gemini analysis error:', error);
    // 降级到关键词分析
    return heuristicAnalysis(symbol, articles);
  }
}
