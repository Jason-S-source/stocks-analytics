'use client';

import { useState, useEffect } from 'react';
import { isInWatchlist, toggleWatchlist } from '@/lib/watchlist';

interface WatchlistButtonProps {
  symbol: string;
}

export default function WatchlistButton({ symbol }: WatchlistButtonProps) {
  const [watching, setWatching] = useState(false);

  useEffect(() => {
    setWatching(isInWatchlist(symbol));
  }, [symbol]);

  function handleToggle() {
    const added = toggleWatchlist(symbol);
    setWatching(added);
    // 派发事件通知其他组件
    window.dispatchEvent(new Event('storage'));
  }

  return (
    <button
      onClick={handleToggle}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
        watching
          ? 'bg-yellow-50 text-yellow-700 border border-yellow-300 hover:bg-yellow-100'
          : 'bg-white text-gray-500 border border-gray-200 hover:border-yellow-300 hover:text-yellow-600'
      }`}
      title={watching ? '取消自选' : '添加自选'}
    >
      <span className="text-base">{watching ? '⭐' : '☆'}</span>
      <span>{watching ? '已自选' : '加自选'}</span>
    </button>
  );
}
