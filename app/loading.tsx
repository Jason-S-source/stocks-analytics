export default function HomeLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 animate-pulse">
      {/* 标题骨架 */}
      <div className="mb-10 text-center">
        <div className="mx-auto h-10 w-64 rounded bg-gray-200" />
        <div className="mx-auto mt-3 h-5 w-80 rounded bg-gray-200" />
      </div>

      {/* 搜索框骨架 */}
      <div className="mx-auto mb-10 max-w-2xl">
        <div className="h-14 rounded-xl bg-gray-200" />
      </div>

      {/* 股票卡片骨架 */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="h-5 w-20 rounded bg-gray-200" />
            <div className="mt-2 h-4 w-14 rounded bg-gray-200" />
            <div className="mt-3 h-3 w-24 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
