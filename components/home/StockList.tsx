import StockCard from './StockCard';
import type { StockQuote } from '@/types';

interface StockListProps {
  quotes: StockQuote[];
}

export default function StockList({ quotes }: StockListProps) {
  if (!quotes || quotes.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
        <span className="text-4xl">📊</span>
        <p className="mt-3 text-gray-500">暂无股票数据</p>
        <p className="text-sm text-gray-400">请稍后刷新重试</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {quotes.map((quote) => (
        <StockCard key={quote.symbol} quote={quote} />
      ))}
    </div>
  );
}
