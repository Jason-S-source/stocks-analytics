# 美股分析网站 — 架构设计

## 整体架构

```
┌─────────────────────────────────────────────────┐
│                   浏览器 (Client)                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │
│  │ 首页页面  │ │ 详情页面  │ │ 客户端组件 (图表等)│ │
│  └──────────┘ └──────────┘ └──────────────────┘ │
└──────────────────────┬──────────────────────────┘
                       │ HTTP Request
┌──────────────────────▼──────────────────────────┐
│              Next.js Server (服务端)              │
│  ┌──────────────────────────────────────────┐   │
│  │        React Server Components            │   │
│  │  (直接调用 lib/ 获取数据，无需 API 中转)    │   │
│  └──────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────┐   │
│  │           API Route Handlers              │   │
│  │  (客户端交互：搜索、图表数据、AI分析、留言)  │   │
│  └──────────────────────────────────────────┘   │
│  ┌──────────┐ ┌──────────┐ ┌───────────────┐   │
│  │ yahoo.ts │ │  db.ts   │ │ analysis.ts   │   │
│  └────┬─────┘ └────┬─────┘ └───────┬───────┘   │
└───────┼─────────────┼───────────────┼───────────┘
        │             │               │
   ┌────▼────┐  ┌─────▼─────┐  ┌─────▼──────┐
   │ Yahoo   │  │  SQLite   │  │  Gemini    │
   │ Finance │  │ (comments │  │  Flash AI  │
   │  API    │  │   .db)    │  │  API       │
   └─────────┘  └───────────┘  └────────────┘
```

## 数据流

### 服务端渲染（Server Components）

```
用户访问 /stock/AAPL
  → app/stock/[symbol]/page.tsx (Server Component)
    → lib/yahoo.ts → getQuote('AAPL') + getChart('AAPL', ...)
    → lib/news.ts → getNews('AAPL')
    → 在服务端渲染 HTML
  → 返回完整 HTML 给浏览器
```

### 客户端交互（Client Components）

```
用户点击 "周K" 按钮
  → KlineChart (Client Component)
    → fetch('/api/stock/AAPL/history?period=6mo&interval=1wk')
    → 更新 lightweight-charts 图表
```

## 组件树

```
RootLayout (layout.tsx)
├── Header
│   └── SearchBar (Client Component)
├── [Page Content]
│   ├── 首页 (/)
│   │   ├── CategoryTabs (Client)
│   │   ├── StockList (Server)
│   │   │   └── StockCard[]
│   │
│   └── 股票详情 (/stock/[symbol])
│       ├── StockHeader (Server)
│       ├── PriceLineChart (Client)
│       ├── KlineChart (Client)
│       │   └── PeriodSelector (Client)
│       ├── NewsSection (Server)
│       │   └── NewsCard[]
│       ├── AnalysisSection (Client)
│       └── CommentSection (Client)
│           ├── CommentForm (Client)
│           └── Comment[]
└── Footer (Server)
```

## 关键技术决策

### 为什么用 lightweight-charts 而不是 Recharts？
- lightweight-charts 专为金融图表设计
- 原生支持 K线蜡烛图和成交量柱状图
- Canvas 渲染，处理大量数据点更高效
- 开源免费（Apache 2.0）

### 为什么用 SQLite 而不是 PostgreSQL？
- 零配置，不需要安装数据库服务
- 单文件存储，数据文件放在项目目录
- 对于留言功能（低并发、小数据量）完全足够

### 为什么 AI 分析有兜底方案？
- Gemini 免费额度可能用完（1500次/天）
- 关键词分析确保功能永不中断
- 用户可自行填入 API Key 解除限制

## 缓存设计

```
cache/
├── quotes:{symbols}       → TTL: 30s (交易时间) / 5min (非交易时间)
├── history:{symbol}:{p}   → TTL: 1h
├── news:{symbol}          → TTL: 15min
├── analysis:{symbol}      → TTL: 1h
└── trending               → TTL: 5min
```

## 版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.0 | 2026-06-19 | 初始版本 |
