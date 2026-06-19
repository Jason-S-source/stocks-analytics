export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-sm text-gray-500">
            📈 股票分析平台 — 免费美股港股数据与 AI 智能分析
          </p>
          <p className="text-xs text-gray-400">
            数据来源：Yahoo Finance · AI 分析仅供参考，不构成投资建议
          </p>
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} 股票分析平台. 数据延迟约15分钟.
          </p>
        </div>
      </div>
    </footer>
  );
}
