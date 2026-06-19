export default function StockDetailLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-pulse">
      {/* 返回按钮骨架 */}
      <div className="h-5 w-20 rounded bg-gray-200 mb-6" />

      {/* 股票头骨架 */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="h-8 w-20 rounded bg-gray-200 mb-2" />
            <div className="h-4 w-40 rounded bg-gray-200" />
          </div>
          <div className="text-right">
            <div className="h-9 w-28 rounded bg-gray-200 mb-2" />
            <div className="h-6 w-24 rounded bg-gray-200" />
          </div>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-4 sm:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="text-center">
              <div className="h-3 w-12 rounded bg-gray-200 mx-auto mb-2" />
              <div className="h-4 w-16 rounded bg-gray-200 mx-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* 图表骨架 */}
      <div className="mt-6 space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="h-6 w-24 rounded bg-gray-200 mb-4" />
          <div className="h-[400px] w-full rounded bg-gray-100" />
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="h-6 w-20 rounded bg-gray-200 mb-4" />
          <div className="h-[500px] w-full rounded bg-gray-100" />
        </div>
      </div>
    </div>
  );
}
