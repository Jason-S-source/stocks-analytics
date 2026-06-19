// 股票分析平台 — 数据库操作
// 本地开发使用 SQLite，Vercel 等无服务器环境使用内存存储

import type { Comment, CreateCommentRequest } from '@/types';

// ========== 内存存储（Vercel 等环境的兜底方案）==========

const memoryStore = new Map<string, Comment[]>();

let nextId = 1;

function getMemoryComments(symbol: string): Comment[] {
  return memoryStore.get(symbol.toUpperCase()) || [];
}

function addMemoryComment(req: CreateCommentRequest): Comment {
  const comment: Comment = {
    id: nextId++,
    symbol: req.symbol.toUpperCase(),
    authorName: req.authorName || '匿名用户',
    content: req.content,
    createdAt: new Date().toISOString(),
  };
  const key = req.symbol.toUpperCase();
  const existing = memoryStore.get(key) || [];
  existing.unshift(comment);
  memoryStore.set(key, existing);
  return comment;
}

function deleteMemoryComment(id: number): boolean {
  for (const [key, comments] of memoryStore) {
    const index = comments.findIndex(c => c.id === id);
    if (index !== -1) {
      comments.splice(index, 1);
      memoryStore.set(key, comments);
      return true;
    }
  }
  return false;
}

function commentExistsMemory(id: number): boolean {
  for (const [, comments] of memoryStore) {
    if (comments.some(c => c.id === id)) return true;
  }
  return false;
}

// ========== SQLite 存储（本地开发）==========

let useSQLite = false;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let db: any = null;

try {
  // 尝试加载 better-sqlite3
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Database = require('better-sqlite3');
  const path = require('path');
  const fs = require('fs');

  const DATA_DIR = path.join(process.cwd(), 'data');
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const DB_PATH = path.join(DATA_DIR, 'comments.db');

  // Next.js 热重载安全
  const globalForDb = globalThis as unknown as { _db: unknown };
  db = globalForDb._db ?? new Database(DB_PATH);

  if (process.env.NODE_ENV !== 'production') {
    globalForDb._db = db;
  }

  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  db.exec(`
    CREATE TABLE IF NOT EXISTS comments (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      symbol      TEXT    NOT NULL,
      author_name TEXT    NOT NULL DEFAULT '匿名用户',
      content     TEXT    NOT NULL,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
      parent_id   INTEGER REFERENCES comments(id) ON DELETE CASCADE
    );
  `);

  useSQLite = true;
} catch {
  // better-sqlite3 不可用（如 Vercel），使用内存存储
  useSQLite = false;
}

// ========== 公开 API ==========

export function getComments(symbol: string, page: number = 1, limit: number = 20): { comments: Comment[]; total: number } {
  const upper = symbol.toUpperCase();

  if (useSQLite && db) {
    const offset = (page - 1) * limit;
    const totalRow = db.prepare('SELECT COUNT(*) as count FROM comments WHERE symbol = ?').get(upper) as { count: number };
    const rows = db.prepare(
      `SELECT id, symbol, author_name as authorName, content, created_at as createdAt, parent_id as parentId
       FROM comments WHERE symbol = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`
    ).all(upper, limit, offset) as Comment[];
    return { comments: rows, total: totalRow.count };
  }

  // 内存模式
  const all = getMemoryComments(symbol);
  const start = (page - 1) * limit;
  return {
    comments: all.slice(start, start + limit),
    total: all.length,
  };
}

export function addComment(req: CreateCommentRequest): Comment {
  if (useSQLite && db) {
    const result = db.prepare(
      `INSERT INTO comments (symbol, author_name, content, parent_id) VALUES (?, ?, ?, ?)`
    ).run(req.symbol.toUpperCase(), req.authorName || '匿名用户', req.content, req.parentId || null);
    return db.prepare(
      `SELECT id, symbol, author_name as authorName, content, created_at as createdAt, parent_id as parentId FROM comments WHERE id = ?`
    ).get(result.lastInsertRowid) as Comment;
  }
  return addMemoryComment(req);
}

export function deleteComment(id: number): boolean {
  if (useSQLite && db) {
    const result = db.prepare('DELETE FROM comments WHERE id = ?').run(id);
    return result.changes > 0;
  }
  return deleteMemoryComment(id);
}

export function commentExists(id: number): boolean {
  if (useSQLite && db) {
    const row = db.prepare('SELECT 1 FROM comments WHERE id = ?').get(id);
    return !!row;
  }
  return commentExistsMemory(id);
}
