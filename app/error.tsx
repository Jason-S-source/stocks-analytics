"use client";

import { useEffect } from "react";

export default function Error({
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
      <h2 className="mt-4 text-xl font-semibold text-gray-900">出错了</h2>
      <p className="mt-2 text-gray-500">
        页面加载失败，请稍后重试。
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition"
      >
        重新加载
      </button>
    </div>
  );
}
