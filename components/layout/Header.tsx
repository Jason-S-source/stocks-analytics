import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
        >
          <span className="text-2xl">📈</span>
          <span>股票分析平台</span>
        </Link>

        <nav className="hidden sm:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
          >
            首页
          </Link>
          <span className="text-sm text-gray-400">
            免费港股数据 · AI 智能分析
          </span>
        </nav>
      </div>
    </header>
  );
}
