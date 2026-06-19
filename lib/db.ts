// 美股分析网站 — SQLite 数据库操作

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import type { Comment, CreateCommentRequest } from '@/types';

// 确保 data 目录存在
const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'comments.db');

// Next.js 热重载安全：复用同一实例
const globalForDb = globalThis as unknown as {
  _db: Database.Database | undefined;
};

function createDatabase(): Database.Database {
  const db = new Database(DB_PATH);

  // 启用 WAL 模式以提升并发读取性能
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  // 创建留言表（幂等）
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

  // 创建索引（幂等）
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_comments_symbol
      ON comments(symbol);
  `);

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_comments_created_at
      ON comments(symbol, created_at DESC);
  `);

  return db;
}

export const db = globalForDb._db ?? createDatabase();

if (process.env.NODE_ENV !== 'production') {
  globalForDb._db = db;
}

// ========== 查询函数 ==========

/** 获取某只股票的留言（分页） */
export function getComments(
  symbol: string,
  page: number = 1,
  limit: number = 20
): { comments: Comment[]; total: number } {
  const offset = (page - 1) * limit;

  const totalRow = db
    .prepare('SELECT COUNT(*) as count FROM comments WHERE symbol = ?')
    .get(symbol.toUpperCase()) as { count: number };

  const rows = db
    .prepare(
      `SELECT id, symbol, author_name as authorName, content, created_at as createdAt, parent_id as parentId
       FROM comments
       WHERE symbol = ?
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`
    )
    .all(symbol.toUpperCase(), limit, offset) as Comment[];

  return {
    comments: rows,
    total: totalRow.count,
  };
}

/** 发表留言 */
export function addComment(req: CreateCommentRequest): Comment {
  const result = db
    .prepare(
      `INSERT INTO comments (symbol, author_name, content, parent_id)
       VALUES (?, ?, ?, ?)`
    )
    .run(
      req.symbol.toUpperCase(),
      req.authorName || '匿名用户',
      req.content,
      req.parentId || null
    );

  return db
    .prepare(
      `SELECT id, symbol, author_name as authorName, content, created_at as createdAt, parent_id as parentId
       FROM comments WHERE id = ?`
    )
    .get(result.lastInsertRowid) as Comment;
}

/** 删除留言 */
export function deleteComment(id: number): boolean {
  const result = db.prepare('DELETE FROM comments WHERE id = ?').run(id);
  return result.changes > 0;
}

/** 检查留言是否存在 */
export function commentExists(id: number): boolean {
  const row = db.prepare('SELECT 1 FROM comments WHERE id = ?').get(id);
  return !!row;
}
