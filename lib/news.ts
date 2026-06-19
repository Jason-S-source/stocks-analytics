// 美股分析网站 — 新闻聚合

import YahooFinance from 'yahoo-finance2';

const yfClient = new YahooFinance({});

interface RawNewsItem {
  title: string;
  link: string;
  publisher?: string;
  publishedAt?: string;
  summary?: string;
  thumbnail?: string;
}

/**
 * 获取某只股票的相关新闻
 * 使用 yahoo-finance2 search 方法的 newsCount 选项
 */
export async function getStockNews(symbol: string): Promise<RawNewsItem[]> {
  try {
    const result = await yfClient.search(symbol, {
      newsCount: 15,
    });

    if (!result.news || result.news.length === 0) {
      return [];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return result.news.map((n: any) => ({
      title: n.title || '无标题',
      link: n.link || '#',
      publisher: n.publisher || 'Yahoo Finance',
      publishedAt: n.providerPublishTime
        ? new Date(n.providerPublishTime instanceof Date ? n.providerPublishTime : n.providerPublishTime * 1000).toISOString()
        : undefined,
      summary: n.summary || '',
      thumbnail: n.thumbnail?.resolutions?.[0]?.url || '',
    }));
  } catch {
    return [];
  }
}
