import { US_STOCKS, HK_STOCKS, CN_STOCKS } from '@/lib/constants';

export function generateStaticParams() {
  return [...US_STOCKS, ...HK_STOCKS, ...CN_STOCKS].map(s => ({
    symbol: s.symbol,
  }));
}

export default function StockLayout({ children }: { children: React.ReactNode }) {
  return children;
}
