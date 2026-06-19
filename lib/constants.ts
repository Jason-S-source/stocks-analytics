// 股票分析平台 — 常量定义

/** 市场类型 */
export type Market = 'us' | 'hk';

/** 市场配置 */
export const MARKETS: { key: Market; label: string; flag: string; currency: string; exchange: string }[] = [
  { key: 'us', label: '美股', flag: '🇺🇸', currency: 'USD', exchange: 'NYSE/NASDAQ' },
  { key: 'hk', label: '港股', flag: '🇭🇰', currency: 'HKD', exchange: 'HKEX' },
];

/** 热门美股列表 */
export const US_STOCKS = [
  { symbol: 'AAPL', name: '苹果' },
  { symbol: 'MSFT', name: '微软' },
  { symbol: 'GOOGL', name: '谷歌' },
  { symbol: 'AMZN', name: '亚马逊' },
  { symbol: 'NVDA', name: '英伟达' },
  { symbol: 'META', name: 'Meta' },
  { symbol: 'TSLA', name: '特斯拉' },
  { symbol: 'BRK-B', name: '伯克希尔' },
  { symbol: 'JPM', name: '摩根大通' },
  { symbol: 'V', name: 'Visa' },
  { symbol: 'JNJ', name: '强生' },
  { symbol: 'WMT', name: '沃尔玛' },
  { symbol: 'MA', name: '万事达' },
  { symbol: 'PG', name: '宝洁' },
  { symbol: 'UNH', name: '联合健康' },
  { symbol: 'HD', name: '家得宝' },
  { symbol: 'DIS', name: '迪士尼' },
  { symbol: 'BAC', name: '美国银行' },
  { symbol: 'NFLX', name: '奈飞' },
  { symbol: 'AMD', name: 'AMD' },
  { symbol: 'INTC', name: '英特尔' },
  { symbol: 'PYPL', name: 'PayPal' },
  { symbol: 'BA', name: '波音' },
  { symbol: 'NKE', name: '耐克' },
  { symbol: 'CRM', name: 'Salesforce' },
];

/** 热门港股列表 */
export const HK_STOCKS = [
  { symbol: '0700.HK', name: '腾讯控股' },
  { symbol: '9988.HK', name: '阿里巴巴' },
  { symbol: '0941.HK', name: '中国移动' },
  { symbol: '0005.HK', name: '汇丰控股' },
  { symbol: '0388.HK', name: '香港交易所' },
  { symbol: '2318.HK', name: '中国平安' },
  { symbol: '0883.HK', name: '中国海油' },
  { symbol: '0939.HK', name: '建设银行' },
  { symbol: '1398.HK', name: '工商银行' },
  { symbol: '3988.HK', name: '中国银行' },
  { symbol: '1211.HK', name: '比亚迪' },
  { symbol: '1810.HK', name: '小米集团' },
  { symbol: '9618.HK', name: '京东集团' },
  { symbol: '3690.HK', name: '美团' },
  { symbol: '2269.HK', name: '药明生物' },
  { symbol: '2020.HK', name: '安踏体育' },
  { symbol: '0011.HK', name: '恒生银行' },
  { symbol: '0002.HK', name: '中电控股' },
  { symbol: '0003.HK', name: '香港中华煤气' },
  { symbol: '0012.HK', name: '恒基地产' },
  { symbol: '2382.HK', name: '舜宇光学' },
  { symbol: '0992.HK', name: '联想集团' },
  { symbol: '1919.HK', name: '中远海控' },
  { symbol: '0175.HK', name: '吉利汽车' },
  { symbol: '2628.HK', name: '中国人寿' },
];

/** 根据市场获取股票列表 */
export function getStocksByMarket(market: Market) {
  return market === 'us' ? US_STOCKS : HK_STOCKS;
}

/** K线图时间周期选项 */
export const PERIOD_OPTIONS = [
  { label: '5日', period: '5d' as const, interval: '1d' as const },
  { label: '1个月', period: '1mo' as const, interval: '1d' as const },
  { label: '3个月', period: '3mo' as const, interval: '1d' as const },
  { label: '6个月', period: '6mo' as const, interval: '1d' as const },
  { label: '1年', period: '1y' as const, interval: '1d' as const },
  { label: '5年', period: '5y' as const, interval: '1d' as const },
];

/** K线周期选项 */
export const KLINE_INTERVALS = [
  { label: '日K', value: '1d' as const, period: '3mo' as const },
  { label: '周K', value: '1wk' as const, period: '6mo' as const },
  { label: '月K', value: '1mo' as const, period: '5y' as const },
];

/** 缓存 TTL（毫秒） */
export const CACHE_TTL = {
  QUOTE_MARKET_OPEN: 30 * 1000,
  QUOTE_MARKET_CLOSED: 5 * 60 * 1000,
  HISTORY: 60 * 60 * 1000,
  NEWS: 15 * 60 * 1000,
  ANALYSIS: 60 * 60 * 1000,
  TRENDING: 5 * 60 * 1000,
  SEARCH: 30 * 1000,
};

/** 情绪标签映射 */
export const SENTIMENT_LABELS: Record<string, string> = {
  bullish: '看涨 📈',
  bearish: '看跌 📉',
  neutral: '中性 ➡️',
};

/** 情绪颜色映射 */
export const SENTIMENT_COLORS: Record<string, string> = {
  bullish: 'text-green-600 bg-green-50',
  bearish: 'text-red-600 bg-red-50',
  neutral: 'text-gray-600 bg-gray-50',
};
