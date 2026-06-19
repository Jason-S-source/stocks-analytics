# 美股分析网站 — 执行计划

## 总体策略

分 7 个阶段逐步推进，每阶段完成后验证功能正常再进入下一阶段。

---

## 第 1 阶段：项目基础搭建 ✅

**目标**：建立完整的项目骨架

- [x] 初始化 Next.js 项目 + TypeScript + Tailwind
- [x] 创建目录结构 (docs/, dev-logs/, data/, components/, lib/, types/)
- [x] 创建标准文档 (requirements.md, tech-spec.md, architecture.md)
- [x] 创建 CLAUDE.md 项目指引
- [x] 创建 types/index.ts 类型定义
- [x] 搭建 lib/cache.ts 内存缓存
- [x] 搭建 lib/constants.ts 常量
- [x] 搭建 lib/db.ts SQLite 数据库
- [x] 搭建 lib/yahoo.ts Yahoo Finance 封装
- [x] 搭建根布局 layout.tsx（Header + Footer）
- [x] 安装所有依赖包
- [x] 首页静态占位页面
- [x] 验证项目编译成功

---

## 第 2 阶段：首页功能

**目标**：首页展示热门美股列表

- [ ] `/api/stocks/trending` — 热门股票
- [ ] `/api/stocks/search` — 股票搜索
- [ ] `/api/stocks/quotes` — 批量报价
- [ ] 首页 page.tsx + loading.tsx
- [ ] StockCard 组件
- [ ] StockList 组件
- [ ] SearchBar 组件
- [ ] CategoryTabs 组件

---

## 第 3 阶段：股票详情页

**目标**：股票详情页基础信息展示

- [ ] `/api/stock/[symbol]/history` — 历史数据
- [ ] `/api/stock/[symbol]/news` — 新闻聚合
- [ ] lib/news.ts — RSS 新闻解析
- [ ] StockHeader 组件
- [ ] 详情页 page.tsx + loading.tsx

---

## 第 4 阶段：图表展示

**目标**：价格走势折线图和K线蜡烛图

- [ ] PriceLineChart 组件
- [ ] KlineChart 组件
- [ ] PeriodSelector 组件
- [ ] 图表响应式适配

---

## 第 5 阶段：AI 分析

**目标**：AI 新闻情绪分析

- [ ] lib/analysis.ts — Gemini + 关键词兜底
- [ ] `/api/stock/[symbol]/analysis` — AI 分析 API
- [ ] AnalysisSection 组件
- [ ] SettingsPanel 组件

---

## 第 6 阶段：留言功能

**目标**：用户留言讨论区

- [ ] `/api/comments` — GET + POST
- [ ] `/api/comments/[id]` — DELETE
- [ ] CommentSection 组件
- [ ] CommentForm 组件

---

## 第 7 阶段：新闻展示与收尾

**目标**：完整功能与 UI 打磨

- [ ] NewsSection + NewsCard 组件
- [ ] 所有页面的 loading/error 状态
- [ ] 移动端适配
- [ ] 整体 UI 打磨

---

## 版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.0 | 2026-06-19 | 初始版本，第 1 阶段开始 |
