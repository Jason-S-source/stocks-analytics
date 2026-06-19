'use client';

import { useEffect } from 'react';

export default function StockDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center">
      <span className="text-5xl">😵</span>
      <h2 className="mt-4 text-xl font-semibold text-gray-900">页面加载失败</h2>
      <p className="mt-2 text-gray-500">
        可能是股票代码不存在或网络问题，请稍后重试。
      </p>
      <div className="mt-6 flex gap-3">
        <a
          href="/"
          className="rounded-lg border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
        >
          返回首页
        </a>
        <button
          onClick={reset}
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition"
        >
          重新加载
        </button>
      </div>
    </div>
  );
}
