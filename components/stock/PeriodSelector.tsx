'use client';

interface PeriodSelectorProps {
  value: string;
  onChange: (interval: '1d' | '1wk' | '1mo') => void;
}

const INTERVALS: { label: string; value: '1d' | '1wk' | '1mo' }[] = [
  { label: '日K', value: '1d' },
  { label: '周K', value: '1wk' },
  { label: '月K', value: '1mo' },
];

export default function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <div className="flex gap-2">
      {INTERVALS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            value === opt.value
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
