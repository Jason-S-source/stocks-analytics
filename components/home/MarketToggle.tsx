'use client';

import { MARKETS } from '@/lib/constants';
import type { Market } from '@/lib/constants';

interface MarketToggleProps {
  active: Market;
  onChange: (market: Market) => void;
}

export default function MarketToggle({ active, onChange }: MarketToggleProps) {
  return (
    <div className="inline-flex rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
      {MARKETS.map((market) => (
        <button
          key={market.key}
          onClick={() => onChange(market.key)}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
            active === market.key
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <span className="text-base">{market.flag}</span>
          <span>{market.label}</span>
        </button>
      ))}
    </div>
  );
}
