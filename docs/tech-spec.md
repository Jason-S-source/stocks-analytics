# 美股分析网站 — 技术规格说明

## 技术栈

| 层级 | 技术 | 版本 | 说明 |
|------|------|------|------|
| 前端框架 | Next.js (App Router) | 16.x | React 全栈框架 |
| UI 库 | React | 19.x | 组件化 UI |
| 样式方案 | Tailwind CSS | 4.x | 原子化 CSS |
| 编程语言 | TypeScript | 5.x | 类型安全 |
| 数据库 | SQLite (better-sqlite3) | 11.x | 嵌入式数据库，存留言 |
| 股票数据 | yahoo-finance2 | 3.x | 非官方 Yahoo Finance API |
| 图表库 | lightweight-charts | 5.x | TradingView 开源图表 |
| AI 分析 | Google Gemini Flash | - | 免费额度 1500次/天 |
| RSS 解析 | rss-parser | 3.x | Yahoo Finance RSS 新闻 |

## 项目结构

```
stock-analysis/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # 根布局
│   ├── page.tsx            # 首页
│   ├── globals.css         # 全局样式
│   ├── stock/[symbol]/     # 股票详情页
│   └── api/                # API 路由
├── components/             # React 组件
│   ├── layout/             # 布局组件
│   ├── home/               # 首页组件
│   ├── stock/              # 股票详情组件
│   └── ui/                 # 通用 UI 组件
├── lib/                    # 工具库
│   ├── yahoo.ts            # Yahoo Finance 封装
│   ├── db.ts               # SQLite 数据库
│   ├── analysis.ts         # AI 分析
│   ├── news.ts             # 新闻聚合
│   ├── cache.ts            # 内存缓存
│   └── constants.ts        # 常量
├── types/                  # TypeScript 类型
├── docs/                   # 项目文档
├── dev-logs/               # 开发日志
├── data/                   # 数据库文件
└── public/                 # 静态资源
```

## API 设计

### 股票数据 API

| 路由 | 方法 | 说明 | 缓存 |
|------|------|------|------|
| `/api/stocks/trending` | GET | 热门股票 | 5分钟 |
| `/api/stocks/search?q=` | GET | 搜索股票 | 30秒 |
| `/api/stocks/quotes?symbols=` | GET | 批量报价 | 30秒/5分钟 |
| `/api/stock/[symbol]/history?period=&interval=` | GET | 历史数据 | 1小时 |
| `/api/stock/[symbol]/news` | GET | 相关新闻 | 15分钟 |
| `/api/stock/[symbol]/analysis` | GET | AI 分析 | 1小时 |

### 留言 API

| 路由 | 方法 | 说明 |
|------|------|------|
| `/api/comments?symbol=` | GET | 获取留言列表 |
| `/api/comments` | POST | 发表留言 |
| `/api/comments/[id]` | DELETE | 删除留言 |

## 数据库 Schema

```sql
CREATE TABLE IF NOT EXISTS comments (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  symbol      TEXT    NOT NULL,
  author_name TEXT    NOT NULL DEFAULT '匿名用户',
  content     TEXT    NOT NULL,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  parent_id   INTEGER REFERENCES comments(id) ON DELETE CASCADE
);
```

## 缓存策略

- 使用内存 Map 存储，带 TTL 过期
- 区分交易时间和非交易时间的缓存时长
- 美股交易时间：美东 9:30 AM - 4:00 PM，周一至周五

## AI 分析策略

1. 主方案：Google Gemini Flash API（免费额度）
2. 兜底方案：关键词情绪分析（无 API 依赖）
3. 用户可在设置面板填入自己的 API Key 提升额度

## 版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.0 | 2026-06-19 | 初始版本 |
