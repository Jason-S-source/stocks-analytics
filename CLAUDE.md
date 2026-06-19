# CLAUDE.md — 美股分析网站开发指引

## 项目简介

这是一个美股分析网站，基于 **Next.js 16 (App Router)** 构建。提供美股行情、K线图、新闻聚合、AI 分析和留言讨论功能。

## 标准文档路径

| 文档 | 路径 | 说明 |
|------|------|------|
| 需求文档 | [docs/requirements.md](docs/requirements.md) | 完整的功能和非功能需求 |
| 技术规格 | [docs/tech-spec.md](docs/tech-spec.md) | 技术栈、API 设计、数据库 Schema |
| 架构设计 | [docs/architecture.md](docs/architecture.md) | 系统架构、数据流、组件树 |
| 执行计划 | [docs/implementation-plan.md](docs/implementation-plan.md) | 分阶段实施步骤和进度 |

## 开发日志

每日开发日志存放在 [dev-logs/](dev-logs/) 目录，文件名格式 `YYYY-MM-DD.md`。

每次开发会话结束后，应在当日日志中记录：
- 已完成事项
- 待办事项
- 遇到的问题和解决方案

## 核心目录结构

```
stock-analysis/
├── app/                    # Next.js App Router 页面和 API 路由
│   ├── page.tsx            # 首页
│   ├── layout.tsx          # 根布局
│   ├── stock/[symbol]/     # 股票详情页
│   └── api/                # API 路由处理器
├── components/             # React 组件
│   ├── layout/             # Header, Footer
│   ├── home/               # StockCard, StockList, SearchBar, CategoryTabs
│   ├── stock/              # StockHeader, Charts, NewsSection, CommentSection, AnalysisSection
│   └── ui/                 # LoadingSkeleton, ErrorDisplay, SettingsPanel
├── lib/                    # 工具库
│   ├── yahoo.ts            # Yahoo Finance API 封装
│   ├── db.ts               # SQLite 数据库操作
│   ├── analysis.ts         # AI 分析（Gemini + 关键词兜底）
│   ├── news.ts             # 新闻聚合
│   ├── cache.ts            # 内存 TTL 缓存
│   └── constants.ts        # 常量（热门股票、市场时间等）
├── types/                  # TypeScript 类型定义
├── docs/                   # 项目文档
├── dev-logs/               # 开发日志
├── data/                   # SQLite 数据库文件
└── public/                 # 静态资源
```

## 工作约定

### 开发流程
1. 严格按 [执行计划](docs/implementation-plan.md) 分阶段推进
2. 每完成一个阶段，更新执行计划中的勾选状态
3. 每个阶段结束后验证功能正常
4. 每日更新 [dev-logs/](dev-logs/) 中的开发日志

### 代码规范
- 所有新代码使用 TypeScript
- 组件文件使用 `.tsx` 扩展名
- 工具库文件使用 `.ts` 扩展名
- API 路由使用 `route.ts` 文件名
- 使用 Tailwind CSS 进行样式开发
- 服务端组件默认，仅在需要交互时使用 `'use client'`

### Next.js 16 注意事项
- `params` 和 `searchParams` 是 Promise，必须 await
- API Route Handler 使用标准 Web Request/Response API
- 动态导入使用 `dynamic(() => import(...), { ssr: false })` 处理客户端库

### 质量要求
- 每个 API 路由添加 try/catch 错误处理
- 服务端数据请求使用缓存减少 API 调用
- 所有页面添加 loading.tsx 和 error.tsx
- 优先使用服务端组件，客户端组件仅用于交互场景
