'use client';

import { useEffect, useState, useCallback } from 'react';
import CommentForm from './CommentForm';
import type { Comment } from '@/types';

interface CommentSectionProps {
  symbol: string;
}

export default function CommentSection({ symbol }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/comments?symbol=${symbol}&page=1&limit=50`);
      const data = await res.json();
      setComments(data.comments || []);
      setTotal(data.total || 0);
    } catch {
      setError('获取留言失败');
    } finally {
      setLoading(false);
    }
  }, [symbol]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  async function handleSubmit(authorName: string, content: string) {
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol,
          authorName: authorName || undefined,
          content,
        }),
      });
      const data = await res.json();
      if (data.comment) {
        setComments(prev => [data.comment, ...prev]);
        setTotal(prev => prev + 1);
      }
    } catch {
      alert('发表留言失败，请稍后重试');
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('确定要删除这条留言吗？')) return;
    try {
      await fetch(`/api/comments/${id}`, { method: 'DELETE' });
      setComments(prev => prev.filter(c => c.id !== id));
      setTotal(prev => prev - 1);
    } catch {
      alert('删除失败，请稍后重试');
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-base font-semibold text-gray-700">
        💬 留言讨论 ({total})
      </h3>

      {/* 发表留言 */}
      <div className="mb-6 pb-6 border-b border-gray-100">
        <CommentForm onSubmit={handleSubmit} />
      </div>

      {/* 留言列表 */}
      {loading ? (
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 rounded-lg bg-gray-100" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-6">
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8">
          <span className="text-3xl">💬</span>
          <p className="mt-2 text-sm text-gray-500">还没有留言，快来抢沙发吧！</p>
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map(comment => (
            <div
              key={comment.id}
              className="rounded-lg border border-gray-100 p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-800">
                    {comment.authorName || '匿名用户'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(comment.createdAt).toLocaleString('zh-CN', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="text-xs text-gray-400 hover:text-red-500 transition"
                  title="删除留言"
                >
                  🗑️
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-600 whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
