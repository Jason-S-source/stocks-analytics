import type { StockQuote } from '@/types';

interface StockHeaderProps {
  quote: StockQuote;
}

export default function StockHeader({ quote }: StockHeaderProps) {
  const price = quote.regularMarketPrice;
  const change = quote.regularMarketChange;
  const changePercent = quote.regularMarketChangePercent;
  const isPositive = change !== undefined && change >= 0;

  const stats = [
    { label: '成交量', value: formatVolume(quote.regularMarketVolume) },
    { label: '市值', value: formatMarketCap(quote.marketCap) },
    { label: '52周最高', value: quote.fiftyTwoWeekHigh ? `$${quote.fiftyTwoWeekHigh.toFixed(2)}` : '--' },
    { label: '52周最低', value: quote.fiftyTwoWeekLow ? `$${quote.fiftyTwoWeekLow.toFixed(2)}` : '--' },
    { label: '今日最高', value: quote.regularMarketDayHigh ? `$${quote.regularMarketDayHigh.toFixed(2)}` : '--' },
    { label: '今日最低', value: quote.regularMarketDayLow ? `$${quote.regularMarketDayLow.toFixed(2)}` : '--' },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* 基本信息 */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {quote.symbol}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {quote.shortName || quote.longName || quote.symbol}
          </p>
          {quote.exchange && (
            <p className="text-xs text-gray-400">{quote.exchange} · {quote.currency || 'USD'}</p>
          )}
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-900">
            {price !== undefined ? `$${price.toFixed(2)}` : '--'}
          </div>
          {change !== undefined && changePercent !== undefined && (
            <div
              className={`mt-1 inline-flex items-center gap-0.5 text-sm font-semibold rounded-full px-3 py-1 ${
                isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}
            >
              <span>{isPositive ? '▲' : '▼'}</span>
              <span>{isPositive ? '+' : ''}{change.toFixed(2)}</span>
              <span>({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)</span>
            </div>
          )}
          {quote.marketState && (
            <p className="mt-1 text-xs text-gray-400">{quote.marketState}</p>
          )}
        </div>
      </div>

      {/* 关键指标 */}
      <div className="mt-6 grid grid-cols-3 gap-4 sm:grid-cols-6">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-xs text-gray-400">{stat.label}</div>
            <div className="mt-1 text-sm font-medium text-gray-700">{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatVolume(vol?: number): string {
  if (vol === undefined) return '--';
  if (vol >= 1e9) return `${(vol / 1e9).toFixed(2)}B`;
  if (vol >= 1e6) return `${(vol / 1e6).toFixed(2)}M`;
  if (vol >= 1e3) return `${(vol / 1e3).toFixed(1)}K`;
  return vol.toString();
}

function formatMarketCap(cap?: number): string {
  if (cap === undefined) return '--';
  if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`;
  if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)}B`;
  if (cap >= 1e6) return `$${(cap / 1e6).toFixed(2)}M`;
  return `$${cap}`;
}
