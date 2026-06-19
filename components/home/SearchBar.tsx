'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchSearch } from '@/lib/yahoo-client';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ symbol: string; name: string }[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length < 1) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const data = await fetchSearch(query.trim());
        setResults(data);
        setIsOpen(data.length > 0);
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  function handleSelect(symbol: string) {
    setIsOpen(false);
    setQuery('');
    router.push(`/stock/${symbol}`);
  }

  return (
    <div ref={containerRef} className="relative mx-auto max-w-2xl">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="搜索股票代码或公司名称..."
          className="w-full rounded-xl border border-gray-300 bg-white px-5 py-4 pr-12 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl">
          {isLoading ? '⏳' : '🔍'}
        </span>
      </div>
      {isOpen && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
          {results.map((r) => (
            <button
              key={r.symbol}
              onClick={() => handleSelect(r.symbol)}
              className="flex w-full items-center gap-3 px-5 py-3 text-left hover:bg-blue-50 transition"
            >
              <span className="text-sm font-bold text-gray-900 min-w-[80px]">{r.symbol}</span>
              <span className="text-sm text-gray-500 truncate">{r.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
