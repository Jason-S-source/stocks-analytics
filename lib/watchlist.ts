// 股票分析平台 — 自选股票管理（localStorage）

const WATCHLIST_KEY = 'stock-watchlist';

/** 读取自选股票列表 */
export function getWatchlist(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(WATCHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** 保存自选股票列表 */
export function saveWatchlist(symbols: string[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(symbols));
}

/** 添加股票到自选 */
export function addToWatchlist(symbol: string): void {
  const list = getWatchlist();
  const upper = symbol.toUpperCase();
  if (!list.includes(upper)) {
    list.push(upper);
    saveWatchlist(list);
  }
}

/** 从自选移除股票 */
export function removeFromWatchlist(symbol: string): void {
  const list = getWatchlist();
  const upper = symbol.toUpperCase();
  const index = list.indexOf(upper);
  if (index !== -1) {
    list.splice(index, 1);
    saveWatchlist(list);
  }
}

/** 检查股票是否在自选中 */
export function isInWatchlist(symbol: string): boolean {
  return getWatchlist().includes(symbol.toUpperCase());
}

/** 切换自选状态（添加/移除） */
export function toggleWatchlist(symbol: string): boolean {
  const upper = symbol.toUpperCase();
  if (isInWatchlist(upper)) {
    removeFromWatchlist(upper);
    return false; // 已移除
  } else {
    addToWatchlist(upper);
    return true; // 已添加
  }
}
