'use client';

import { useEffect, useState, useCallback } from 'react';
import CommentForm from './CommentForm';
import type { Comment } from '@/types';

interface CommentSectionProps {
  symbol: string;
}

const STORAGE_KEY_PREFIX = 'stock_comments_';

/** 从 localStorage 读取留言 */
function loadComments(symbol: string): Comment[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + symbol.toUpperCase());
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** 保存留言到 localStorage */
function saveComments(symbol: string, comments: Comment[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + symbol.toUpperCase(), JSON.stringify(comments));
  } catch {
    // localStorage 满或不可用
  }
}

export default function CommentSection({ symbol }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = useCallback(() => {
    setLoading(true);
    const data = loadComments(symbol);
    setComments(data);
    setLoading(false);
  }, [symbol]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  async function handleSubmit(authorName: string, content: string) {
    const newComment: Comment = {
      id: Date.now(),
      symbol: symbol.toUpperCase(),
      authorName: authorName || '匿名用户',
      content,
      createdAt: new Date().toISOString(),
    };

    const updated = [newComment, ...comments];
    setComments(updated);
    saveComments(symbol, updated);
  }

  async function handleDelete(id: number) {
    if (!confirm('确定要删除这条留言吗？')) return;
    const updated = comments.filter(c => c.id !== id);
    setComments(updated);
    saveComments(symbol, updated);
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-base font-semibold text-gray-700">
        💬 留言讨论 ({comments.length})
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
                    {formatTime(comment.createdAt)}
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

function formatTime(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}
