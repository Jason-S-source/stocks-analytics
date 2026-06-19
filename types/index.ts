// 美股分析网站 — TypeScript 类型定义

// ========== 股票相关 ==========

/** 股票实时报价 */
export interface StockQuote {
  symbol: string;
  shortName?: string;
  longName?: string;
  regularMarketPrice?: number;
  regularMarketChange?: number;
  regularMarketChangePercent?: number;
  regularMarketVolume?: number;
  marketCap?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  regularMarketDayHigh?: number;
  regularMarketDayLow?: number;
  currency?: string;
  exchange?: string;
  marketState?: string;
}

/** 历史 K线数据点 */
export interface ChartDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

/** 历史数据查询参数 */
export interface HistoryParams {
  symbol: string;
  period: '1d' | '5d' | '1mo' | '3mo' | '6mo' | '1y' | '5y';
  interval: '1d' | '1wk' | '1mo';
}

/** 热门股票分类 */
export type StockCategory = 'trending' | 'gainers' | 'actives';

// ========== 新闻相关 ==========

/** 新闻文章 */
export interface NewsArticle {
  title: string;
  link: string;
  publisher?: string;
  publishedAt?: string;
  summary?: string;
  thumbnail?: string;
}

// ========== AI 分析相关 ==========

/** 情绪判断 */
export type Sentiment = 'bullish' | 'bearish' | 'neutral';

/** AI 分析方法 */
export type AnalysisMethod = 'gemini' | 'heuristic';

/** AI 分析结果 */
export interface AnalysisResult {
  symbol: string;
  sentiment: Sentiment;
  summary: string;
  confidence: 'high' | 'medium' | 'low';
  method: AnalysisMethod;
  analyzedAt: string;
}

// ========== 留言相关 ==========

/** 留言 */
export interface Comment {
  id: number;
  symbol: string;
  authorName: string;
  content: string;
  createdAt: string;
  parentId?: number | null;
}

/** 发表留言请求 */
export interface CreateCommentRequest {
  symbol: string;
  authorName?: string;
  content: string;
  parentId?: number;
}

// ========== API 响应 ==========

/** 分页响应 */
export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  totalPages: number;
  total: number;
}

/** API 错误响应 */
export interface ApiError {
  error: string;
  message: string;
}
