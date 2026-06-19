import Link from 'next/link';
import type { NewsArticle } from '@/types';

interface NewsSectionProps {
  articles: NewsArticle[];
}

export default function NewsSection({ articles }: NewsSectionProps) {
  if (!articles || articles.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
        <span className="text-4xl">📰</span>
        <p className="mt-2 text-sm text-gray-500">暂无相关新闻</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-base font-semibold text-gray-700">📰 相关新闻</h3>
      <div className="space-y-3">
        {articles.map((article, index) => (
          <NewsCard key={index} article={article} />
        ))}
      </div>
    </div>
  );
}

function NewsCard({ article }: { article: NewsArticle }) {
  const date = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('zh-CN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-lg border border-gray-100 p-4 hover:bg-blue-50/50 transition"
    >
      <div className="flex items-start gap-3">
        {article.thumbnail && (
          <img
            src={article.thumbnail}
            alt=""
            className="mt-0.5 h-16 w-16 shrink-0 rounded-lg object-cover"
          />
        )}
        <div className="min-w-0">
          <h4 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
            {article.title}
          </h4>
          {article.summary && (
            <p className="mt-1 text-xs text-gray-500 line-clamp-2">
              {article.summary}
            </p>
          )}
          <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
            {article.publisher && <span>{article.publisher}</span>}
            {date && <span>{date}</span>}
          </div>
        </div>
      </div>
    </a>
  );
}
