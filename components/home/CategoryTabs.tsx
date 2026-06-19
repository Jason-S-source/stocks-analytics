'use client';

export type StockCategory = 'trending' | 'gainers' | 'actives';

interface CategoryTabsProps {
  active: StockCategory;
  onChange: (category: StockCategory) => void;
}

const TABS: { key: StockCategory; label: string; icon: string }[] = [
  { key: 'trending', label: '热门股票', icon: '🔥' },
  { key: 'gainers', label: '涨幅最大', icon: '📈' },
  { key: 'actives', label: '交易最活跃', icon: '📊' },
];

export default function CategoryTabs({ active, onChange }: CategoryTabsProps) {
  return (
    <div className="flex gap-2 border-b border-gray-200 pb-4">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition ${
            active === tab.key
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <span>{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  );
}
