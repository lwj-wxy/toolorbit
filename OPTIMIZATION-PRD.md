# ToolOrbit 优化 PRD

> 审计日期：2026-05-17
> 审计范围：全站 — 内容、性能、样式/UX、SEO

---

## 一、性能优化 (Performance)

### P0 — 关键

| # | 问题 | 现状 | 优化方案 | 预期收益 |
|---|------|------|----------|----------|
| 1 | **Layout 是全客户端组件** | `src/components/Layout.tsx:1` — `'use client'`，整个 header/nav/footer/search 均为客户端渲染 | 将 Layout 拆分为 Server Component（header 静态部分）+ Client Component（搜索、主题切换等交互部分），利用 React 19 Server Components 减少客户端 JS 体积 | 首屏 JS 减少 ~40KB，LCP 改善 |
| 2 | **搜索触发整页刷新** | `src/components/Layout.tsx:151` — `window.location.href = '/?search=${query}'` | 改用 `useRouter().push()` 实现客户端导航，避免整页重载 | 搜索体验大幅提升，避免不必要的 HTML 重解析 |
| 3 | **博客图片全部为外部 URL** | `src/constants/blogData.ts` — 全部使用 `images.unsplash.com` 和 `picsum.photos` 外链 | 将图片下载到本地 `/public/images/blog/`，使用 Next.js `<Image>` 组件进行优化 | LCP 改善，减少外部依赖，图片不挂 |

### P1 — 重要

| # | 问题 | 现状 | 优化方案 | 预期收益 |
|---|------|------|----------|----------|
| 4 | **无路由级 loading.tsx** | `src/app/` 下所有路由目录均无 `loading.tsx` | 为 `/blog/[slug]`、`/tools/[section]/[slug]`、`/category/[slug]` 等关键路由添加 loading skeleton | 感知性能提升，减少 CLS |
| 5 | **无 error.tsx 边界** | 整个 app 目录均无 `error.tsx` | 添加 `src/app/error.tsx` 全局错误边界 + 关键路由独立 error.tsx | 防止单个工具页崩溃影响整站 |
| 6 | **Sitemap 用正则解析 TS 源码** | `gen_sitemap.cjs:72-104` — 用正则从 TS 文件提取对象属性 | 改为从 `tools-meta.ts` 直接 import（用 ts-node 或 tsx），或 build 时生成 JSON 中间文件 | 避免正则解析遗漏字段，更健壮 |
| 7 | **工具列表数据打入客户端 bundle** | `Layout.tsx:10` import `TOOLS_META`，该文件 ~570 行包含所有工具信息 | 将工具元数据通过 Server Component props 传递，嵌套菜单数据通过 API route 按需加载 | 客户端 JS 减少 ~15KB |

### P2 — 可后续迭代

| # | 问题 | 优化方案 |
|---|------|----------|
| 8 | 无 ISR/SSG 混合策略 | 对工具页启用 `export const revalidate = 3600` ISR，首页和博客列表页用 `force-static` |
| 9 | 字体未优化 | 考虑预加载关键字体子集，使用 `next/font` 本地化字体 |
| 10 | `next.config.ts` 未启用 `optimizePackageImports` 中缺失的包 | 添加 `dayjs`、`pdfjs-dist`、`jszip`、`sm-crypto` 等大型包到优化列表 |

---

## 二、SEO 优化

### P0 — 关键

| # | 问题 | 现状 | 优化方案 |
|---|------|------|----------|
| 1 | **OG 图片全站通用** | `src/app/og-image/route.tsx` — 所有页面共用同一个 OG 图，标题固定 "Modern Toolbox for Modern Creators" | 改为动态 OG Image route：`/og-image?title=XXX&description=XXX`，为每个工具页/博客页生成独立 OG 图 |
| 2 | **hreflang 标签不一致** | Sitemap 使用 `zh-Hans`，HTML `<html lang>` 使用 `zh-CN` | 统一为 BCP47 标准的 `zh-Hans`，或统一为 `zh-CN`（中国大陆用户） |
| 3 | **博客图片外链对 Google 图片搜索无效** | 所有博客图片均为 Unsplash/Picsum URL，Google 不会将这些图片归属于 toolorbit.site | 将图片本地化到 `/public/images/blog/`，添加有意义的文件名和 alt 文本 |

### P1 — 重要

| # | 问题 | 现状 | 优化方案 |
|---|------|------|----------|
| 4 | **Meta keywords 全站相同** | `src/lib/metadata.ts:165-173` — 所有页面 keywords 均为固定数组 `['online tools', 'developer tools', ...]` | 移除全局 keywords（Google 已不将其作为排名因子），或为每个页面定制 |
| 5 | **部分工具页可能被判为薄内容** | 部分工具仅有一个简单表单，SEO 内容完全依赖 ToolSEOCard 中的 i18n 翻译 | 为工具页添加更丰富的使用场景、示例、教程链接等内容区块 |
| 6 | **Sitemap 仅在 build 时生成** | `package.json` — `"build": "node gen_sitemap.cjs && next build..."` | 添加 post-build hook 或通过 API route 动态生成，确保新增内容自动入 sitemap |
| 7 | **缺少 Article 结构化数据关键字段** | `structured-data.ts:495-516` — BlogPosting schema 缺少 `wordCount`、`articleSection`、`thumbnailUrl` | 补充 Article schema 字段以提升 Google 富结果展示概率 |

### P2 — 可后续迭代

| # | 问题 | 优化方案 |
|---|------|----------|
| 8 | 面包屑结构化数据 | 为每个工具/博客页面独立生成 BreadcrumbList JSON-LD，确保 Google 在 SERP 中显示面包屑 |
| 9 | robots.txt 对 AI 爬虫的策略可细化 | 当前策略合理（GPTBot/OAI-SearchBot/PerplexityBot allow，CCBot/Google-Extended/anthropic-ai disallow），但需持续关注新 AI crawler |
| 10 | 无 Video Sitemap | 如有视频相关工具页面，考虑添加 video sitemap |

---

## 三、内容优化 (Content)

### P0 — 关键

| # | 问题 | 现状 | 优化方案 |
|---|------|------|----------|
| 1 | **博客数据 ID 混乱** | `blogData.ts` — 数组顺序 15,16,17,12,13,14,1,2...28,29,30,31，不是按 ID 或日期排序 | 按 `date` DESC 排序，移除无意义的数字 ID（slug 已是唯一标识） |
| 2 | **7 篇文章同一天发布 (2026-05-14)** | 包括 ai-code-reviewer-guide、ai-regex-generator-guide 等 7 篇间隔数秒 | 分散发布日期（每篇间隔 1-2 天），更符合自然发布模式，对 SEO 也更好 |

### P1 — 重要

| # | 问题 | 现状 | 优化方案 |
|---|------|------|----------|
| 3 | **部分工具描述过短** | 如 "一键生成可下载二维码"（8 字）、"上传二维码图片并解析内容"（10 字） | 扩展至 50-160 字，包含使用场景、受益点的完整描述 |
| 4 | **博客缺少新增文章的中文版** | BLOG_POSTS 中有 23-31 号文章，但 `public/articles/en/` 和 `zh/` 中缺少部分对应文件 | 补齐所有缺失的 markdown 文件，确保双语内容完整 |
| 5 | **博客分类标签不统一** | 使用了 `Development`、`Design`、`AI`、`Tech`、`Science`、`Network` 等多种混合分类 | 统一为 5-6 个清晰分类，避免 `Tech` vs `AI` vs `Development` 的重叠 |
| 6 | **工具描述中英文混用** | TOOLS_META 中工具名和描述部分英文部分中文（如 `ai-youtube-generator` 英文，`ai-weekly-report` 中文） | 从 i18n 数据中读取对应语言版本，而非在数据源中混用 |

### P2 — 可后续迭代

| # | 问题 | 优化方案 |
|---|------|----------|
| 7 | 博客文章缺少作者信息展示 | 在博客文章页面中展示作者块（ToolOrbit Editorial Team），包含头像、简介、发布日期 |
| 8 | 无内容目录 (TOC) | 为长文博客文章添加 Table of Contents 导航 |
| 9 | 工具页面无用户评价/评分区块 | 考虑添加真实用户反馈展示（非必需，取决于是否有用户数据） |

---

## 四、样式与 UX 优化 (Style & UX)

### P0 — 关键

| # | 问题 | 现状 | 优化方案 |
|---|------|------|----------|
| 1 | **暗色模式 CSS 极其脆弱** | `src/index.css:35-88` — 大量 `!important` 覆盖 `.dark .bg-white`、`.dark .text-slate-900` 等具体类名 | 使用 Tailwind 4 的 `dark:` variant + `@variant` 正确配置，移除所有 `!important` 重写 |
| 2 | **暗色模式可能有闪烁 (FOUC)** | `ThemeContext.tsx:16` — 从 localStorage 读取主题，React 渲染前无 script 阻止闪烁 | 在 `<head>` 中添加 blocking inline script，在 HTML 解析前设置 `dark` class |

### P1 — 重要

| # | 问题 | 现状 | 优化方案 |
|---|------|------|----------|
| 3 | **面包屑代码重复** | `Layout.tsx:218-236` 内联面包屑 + `Breadcrumbs.tsx` 独立组件，两者逻辑重复 | 统一使用 `Breadcrumbs.tsx` 组件，移除 Layout 中的内联实现 |
| 4 | **JSX 中直接使用 Emoji** | `Layout.tsx:135` `🚀`、`Layout.tsx:87` `Ω` | 替换为 SVG 图标或 `<span role="img" aria-label="...">`，确保跨平台一致性和可访问性 |
| 5 | **Footer 暗色模式文字不可见** | `LayoutFooter.tsx:21` — `text-slate-500 dark:text-slate-500`，暗色模式下与背景色 `#0f172a` 对比度过低 | 暗色模式应使用 `dark:text-slate-400` |
| 6 | **语言偏好仅存 localStorage** | `LanguageSwitcher.tsx:39` — 只写 `localStorage`，服务端无法读取 | 同时设置 Cookie（`toolorbit_language`），使服务端可读取语言偏好进行 SSR |

### P2 — 可后续迭代

| # | 问题 | 优化方案 |
|---|------|----------|
| 7 | 桌面端超大菜单(MegaMenu)对移动端不友好 | 为移动端提供简化的抽屉菜单，确认 MegaMenu 在平板/手机上的表现 |
| 8 | 缺少键盘快捷键提示 | 除 `Ctrl+K` 搜索外，可添加 `/` 聚焦搜索、`?` 显示快捷键面板等 |
| 9 | 工具页面缺少使用说明 Tooltip/引导 | 为新用户添加首次使用的引导提示 |

---

## 五、CSP 安全优化

| # | 问题 | 现状 | 优化方案 |
|---|------|------|----------|
| 1 | **CSP 使用 `'unsafe-inline'`** | `next.config.ts:12` — `script-src 'self' 'unsafe-inline'` 和 `style-src 'self' 'unsafe-inline'` | 对 script-src 使用 nonce 或 hash 替代 unsafe-inline；style-src 的 unsafe-inline 若 Tailwind 需要可保留，但应评估影响 |
| 2 | **缺少 `report-uri` 或 `report-to`** | CSP 未配置违规上报端点 | 添加 `report-uri` 端点用于收集 CSP 违规报告，帮助发现策略问题 |

---

## 六、实施路线图

### 第一阶段（1-2 周，ROI 最高）

1. 修复暗色模式 CSS — 移除 `!important`，使用 Tailwind dark: variant（样式 #1）
2. Layout 拆分 Server/Client Component（性能 #1）
3. 搜索改用 `useRouter` 替代 `window.location.href`（性能 #2）
4. 修复 Footer 暗色模式对比度 — `dark:text-slate-400`（样式 #5）
5. OG 图改为动态生成，支持标题参数（SEO #1）

### 第二阶段（2-4 周）

6. 博客图片本地化到 `/public/images/blog/`，用 `<Image>` 组件（性能 #3 + SEO #3）
7. hreflang 标签统一 `zh-Hans` 或 `zh-CN`（SEO #2）
8. 暗色模式防闪烁 — `<head>` 添加 blocking inline script（样式 #2）
9. 面包屑统一使用 `Breadcrumbs.tsx` 组件，移除 Layout 内联（样式 #3）
10. 移除或定制 meta keywords（SEO #4）
11. 博客数据清理 — date DESC 排序 + 分散发布日期（内容 #1, #2）

### 第三阶段（后续迭代）

12. 添加 loading.tsx + error.tsx 路由级文件（性能 #4, #5）
13. 语言 Cookie 化，支持 SSR 检测（样式 #6）
14. 工具描述扩展至 50-160 字（内容 #3）
15. Sitemap 动态化（SEO #6）
16. Emoji → SVG 图标替换（样式 #4）
17. CSP unsafe-inline 替换为 nonce/hash（安全 #1, #2）
18. Sitemap 解析改用 import 替代正则（性能 #6）

---

## 附录：当前已完成良好的部分

以下方面当前已做得不错，无需优化：

- **结构化数据 (JSON-LD)**: 覆盖全面 — Organization、WebSite、WebApplication、BlogPosting、FAQPage、BreadcrumbList、ItemList、SearchAction 均完整
- **robots.txt**: 配置合理，区分搜索引擎爬虫和 AI 训练爬虫，支持 AI 搜索引用
- **llms.txt / llms-full.txt**: 已实现，对 AI 搜索发现友好
- **静态资源预压缩**: `precompress-static.cjs` 对 .css/.js/.html/.xml 等生成 gzip + brotli 双格式
- **HTTP 安全头**: HSTS、X-Content-Type-Options、X-Frame-Options、Referrer-Policy、Permissions-Policy 均配置
- **Cache-Control**: 静态资源 `max-age=31536000, immutable`，内容页 `s-maxage=3600, stale-while-revalidate=86400` — 策略合理
- **国际化路由**: en/zh-CN 双语言支持，hreflang alternates 已配置
- **SEO 内容页**: `/developer-tools`、`/ai-tools` 等 7 个 Hub/Comparison 页面内容详尽，内部链接完善
- **暗色/亮色主题切换**: 功能完整，支持跟随系统偏好
- **Ctrl+K 搜索快捷键**: 已实现
- **延迟加载 AdSense**: 使用 `requestIdleCallback` + 4.5s timeout 延迟加载广告脚本，避免阻塞首屏
