// 美股分析网站 — 内存 TTL 缓存

const store = new Map<string, { data: unknown; expiry: number }>();

/**
 * 从缓存获取数据
 * 如果数据不存在或已过期，返回 null
 */
export function getCached<T>(key: string): T | null {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiry) {
    store.delete(key);
    return null;
  }
  return entry.data as T;
}

/**
 * 将数据存入缓存
 * @param key 缓存键
 * @param data 要缓存的数据
 * @param ttlMs 过期时间（毫秒），默认 60000 (1分钟)
 */
export function setCache(key: string, data: unknown, ttlMs: number = 60000): void {
  store.set(key, {
    data,
    expiry: Date.now() + ttlMs,
  });
}

/**
 * 删除缓存
 */
export function deleteCache(key: string): void {
  store.delete(key);
}

/**
 * 清空所有缓存
 */
export function clearCache(): void {
  store.clear();
}

/**
 * 获取缓存统计
 */
export function getCacheStats(): { size: number } {
  // 清理过期条目
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.expiry) {
      store.delete(key);
    }
  }
  return { size: store.size };
}

/**
 * 判断当前是否为美股交易时间
 * 美东时间周一至周五 9:30 AM - 4:00 PM
 */
export function isMarketOpen(): boolean {
  const now = new Date();
  const day = now.getUTCDay(); // 0 = Sunday
  const hours = now.getUTCHours();
  const minutes = now.getUTCMinutes();

  // 美股交易时间为美东 9:30-16:00
  // 美东比 UTC 晚 4/5 小时（取决于夏令时）
  // 简化处理：UTC 13:30-20:00（标准时间）/ 12:30-19:00（夏令时 3-11月）
  // 这里使用一个大致范围，不做精确夏令时计算
  if (day === 0 || day === 6) return false; // 周末

  // 美东时间 9:30 AM = UTC 14:30 (EDT) / 13:30 (EST)
  // 美东时间 4:00 PM = UTC 21:00 (EDT) / 20:00 (EST)
  // 使用较宽的 EDT 范围（美国通常在3-11月使用夏令时）
  const month = now.getUTCMonth(); // 0-indexed
  const isDST = month >= 2 && month <= 10; // 大致夏令时范围 3月-11月

  const openHour = isDST ? 13 : 14;
  const closeHour = isDST ? 20 : 21;

  // 9:30 AM ET → UTC openHour:30
  if (hours < openHour || hours > closeHour) return false;
  if (hours === openHour && minutes < 30) return false;
  if (hours === closeHour && minutes > 0) return false;

  return true;
}
