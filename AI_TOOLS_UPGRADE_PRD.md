# ToolOrbit AI Tools Upgrade PRD

版本：v0.1  
日期：2026-06-17  
适用项目：ToolOrbit  
技术栈：Next.js 16 + React 19 + TypeScript + Tailwind CSS + Node.js Route Handler  
阶段：P0 方案稿

## 1. 背景

ToolOrbit 已经运行约两个月，站内已有 `/ai-tools`、`/tools/ai/*`、AI 工具组件、工具注册表、SEO 内容页、导航菜单、结构化数据、博客和工具内链。当前缺口在 AI 工具运行时：字段、Prompt、输出、校验、复制、限流和日志还没有收敛到同一套机制。

原《AI Growth Tools MVP PRD》和《AI Growth Tools 交互规格》里的有效部分包括：配置驱动、字段渲染、ContentBrief、Prompt 组装、输出校验、限流、复制事件、相关工具预填、SEO Hub 和工具页状态设计。这些能力应该融合进 ToolOrbit，而不是另开 `ai-growth-tools.com` 或 `tools.` 子域。

本 PRD 将原两份文档改造成 ToolOrbit 内部升级方案。后续开发以本文件为准，原文档作为历史输入材料。

## 2. 核心判断

ToolOrbit 不需要再起一个 AI 工具站。

ToolOrbit 需要在现有站点内建设一套 AI Tool Runtime：

- 用统一配置描述 AI 工具的字段、输出、Prompt、校验、SEO 内容和相关工具。
- 用统一交互组件承载输入、生成、结果、复制、错误、限流和相关工具跳转。
- 用统一后端入口处理 normalization、ContentBrief、Prompt assembly、模型调用、缓存、限流和日志。
- 保留现有 URL、导航、SEO 权重和工具发现链路。

这样做可以吃到已有站点的搜索积累、工具目录、隐私政策、部署流程和用户认知。另开项目会重复做站点基础设施，还会拆散主题权重。

## 3. 当前项目事实

### 3.1 技术栈

当前 ToolOrbit 使用：

- `next` 16
- React 19
- TypeScript
- Tailwind CSS
- App Router
- Node.js route handler
- `src/app/api/[...path]/route.ts` 统一承载部分 API

原文档中的 Nuxt 3、Vite、Element Plus、`pages/*.vue`、`composables/*` 不适用于当前项目。

### 3.2 现有路由

当前 AI 相关路由已经存在：

- AI Hub：`/ai-tools`
- 工具页：`/tools/ai/:slug`
- 站点工具索引：`/tools`
- 分类页：`/category/:slug`
- 中文路径通过 `src/app/zh-CN/[...segments]` 等本地化路由承接

本次升级不重构全站 URL。P0 保留 `/tools/ai/:slug`，不改成 `/tools/:slug`。

### 3.3 现有代码结构

后续开发必须优先贴合这些文件：

| 目标 | 当前文件 |
|---|---|
| 工具注册 | `src/data/tools-meta.ts` |
| 工具图标映射 | `src/data/tools.ts` |
| 工具组件映射 | `src/lib/tool-components.tsx` |
| 动态工具页 | `src/app/tools/[section]/[slug]/page.tsx` |
| 工具客户端承载 | `src/components/ToolPageClient.tsx` |
| 工具 SEO 内容 | `src/components/ToolContent.tsx` |
| AI 工具详情内容 | `src/views/tools/ai/data.ts` |
| AI 工具 UI 组件 | `src/views/tools/ai/*.tsx` |
| AI API 入口 | `src/app/api/[...path]/route.ts` |
| AI Hub 内容 | `src/data/seoContent.ts` 中 `/ai-tools` |
| 导航菜单 | `src/lib/navigation-menu.ts` |
| 面包屑 | `src/components/Breadcrumbs.tsx` |
| 工具封面 | `src/lib/tool-covers.ts` |
| 结构化数据 | `src/lib/structured-data.ts` |
| SEO metadata | `src/lib/metadata.ts` |
| 本地化文案 | `src/locales/en.json`、`src/locales/zh.json` |

新增 AI 工具或调整 AI 工具可见性时，不能只改 `tools-meta.ts`。需要同步检查组件映射、API dispatch、导航、SEO 内容、结构化数据、工具封面、相关工具和本地化文案。

## 4. 产品定位

ToolOrbit AI 工具模块服务这些用户：

- 跨境电商卖家
- 独立站运营
- SEO 内容运营
- 视频和社媒内容创作者
- 开发者和办公用户
- 英文能力一般但需要产出英文营销内容的中文用户

P0 聚焦一件事：用户输入一段产品、关键词、视频或业务信息后，能稳定得到可复制、可复核、适合目标平台的结果。

ToolOrbit AI 工具不和 ChatGPT 比通用能力。它用这几件事建立使用理由：

- 入口更短：用户从 Google 搜具体任务词进入工具页。
- 字段更清楚：用户填表单，不需要自己写 Prompt。
- 平台约束更稳定：Amazon、Shopify、YouTube、TikTok、广告平台等规则进入配置和校验。
- 中文输入更友好：用户可以用中文描述，工具输出专业英文。
- 工具链更顺：结果可以复制，也可以带字段跳到下一个工具。

## 5. P0 范围

### 5.1 包含

- 在现有 `/ai-tools` 上升级 AI Hub，而不是新建独立首页。
- 在现有 `/tools/ai/:slug` 路由内引入 AI Tool Runtime。
- P0 先改 3 个文本型工具，不碰图片生成和视觉工具的底层流程。
- 工具字段配置化。
- Prompt 从 ContentBrief 生成，不直接拼 raw input。
- 支持中文输入到英文 brief。
- 支持统一输出结构：`text`、`list`、`sections`、`table`、`json`。
- 支持逐条复制和复制事件记录。
- 支持相关工具跳转和共享字段预填。
- 支持错误码和限流状态。
- 支持基础运行日志。
- 支持 Golden Set 离线评测。

### 5.2 不包含

- 不新建独立站点。
- 不重构 ToolOrbit 根首页 `/`。
- 不把 `/tools/ai/:slug` 改成 `/tools/:slug`。
- 不改全站设计系统。
- 不做登录、订阅、支付、历史记录。
- 不做后台管理系统。
- 不在 P0 改造图片生成、商品图生成、Logo、SVG、素材质检等多模态工具。
- 不删除现有 AI 工具。

## 6. P0 工具选择

P0 选择 3 个工具进入 Runtime 试点：

| 优先级 | 当前工具 | 当前路径 | 改造目标 |
|---|---|---|---|
| P0-1 | Listing Generator | `/tools/ai/listing-generator` | 跨境电商核心工具，适合承接 Amazon/Shopify/Etsy 场景 |
| P0-2 | YouTube Title & Description Generator | `/tools/ai/youtube-generator` | 已有工具，输出可拆成标题、描述、标签、缩略图建议 |
| P0-3 | Keyword Analyzer | `/tools/ai/keyword-analyzer` | 电商关键词和 listing 工具链的一环，适合验证 `json` / `sections` 输出 |

P0 不追求一次改完全部 AI 工具。先用 3 个工具验证 Runtime、输出结构和复制数据，再迁移其他 AI 工具。

### 6.1 AI 工具 SEO 与配置文案基线

本节定义当前全部 AI 工具的命名、SEO title、meta description 和工具卡片描述。后续开发这些位置必须使用同一口径：

- `src/data/tools-meta.ts`：工具名、卡片描述、路径、可见性。
- `src/locales/en.json`、`src/locales/zh.json`：页面标题、基础描述、SEO title、SEO description、运行所需 UI 文案。
- `src/views/tools/ai/data.ts` 或后续 Runtime overview 配置：summary、input、output、processing、modes、example、FAQ。
- `/ai-tools` Hub：精选工具卡片、workflow block、内部链接。

规则：

- SEO title 不手写 `| ToolOrbit`，由项目 metadata template 追加站点名。
- Meta description 控制在搜索结果可读范围内，优先写清输入、输出和平台。
- 卡片描述用于工具列表，保持一句话，避免和 meta description 完全重复。
- 中文 locale 以英文基线为准翻译，不新增另一个定位。
- 未接真实数据源的工具不得承诺实时搜索量、真实销量、真实趋势或平台官方审核结论。
- 前台 H1 和副标题只写用户任务、输入和可获得的结果。不要出现 `服务端`、`Runtime`、`规则约束`、`Prompt`、`不伪造` 等实现或纠偏词；这些内容放技术概述、PRD 或结果提示里。
- 工具详情区的“概述 / 输入内容 / 输出结果 / 处理方式”也必须面向最终用户。不要写 `setState`、`fetch`、`SSE`、`JSON.parse`、`正则解析`、组件状态、CSS 类名、错误卡片实现等工程细节。

P0 双语基线：

| 工具 ID | EN H1 | ZH H1 | EN SEO title | ZH SEO title | EN meta description | ZH meta description | EN card description | ZH card description |
|---|---|---|---|---|---|---|---|---|
| `listing-generator` | AI Listing Generator | AI Listing 生成器 | AI Listing Generator for Amazon, Shopify, and Etsy | AI Listing 生成器：Amazon、Shopify 和 Etsy 商品文案 | Enter a product name, selling points, and marketplace to draft editable titles, descriptions, tags, and social copy. | 输入产品名称、卖点和销售平台，生成可编辑的商品标题、描述、标签和社媒文案草稿。 | Draft product titles, descriptions, tags, and social copy from product details and marketplace. | 输入商品名称和核心卖点，为电商渠道生成标题、描述、标签和社媒文案草稿。 |
| `ai-youtube-generator` | YouTube Title and Description Generator | YouTube 标题与简介生成器 | YouTube Title Generator with Descriptions and Tags | YouTube 标题生成器：简介、标签和缩略图方向 | Enter a video brief to draft title options, a description, tags, and thumbnail directions. | 输入视频主题、目标观众和语气，生成可编辑的标题、简介、标签和缩略图方向。 | Draft YouTube titles, descriptions, tags, and thumbnail ideas from one video brief. | 输入一个视频简报，生成 YouTube 标题、简介、标签和缩略图方向。 |
| `keyword-analyzer` | Ecommerce Keyword Analyzer | 电商关键词分析器 | Ecommerce Keyword Analyzer for Product Listings | 电商关键词分析器：Listing 选词与长尾词分组 | Enter a product keyword to organize long-tail terms, search intent, and copy angles for listings. | 输入一个产品词，整理长尾词分组、搜索意图和可用于 Listing 的文案角度。 | Turn a product seed keyword into long-tail groups, search intent notes, and listing copy angles. | 把产品种子词整理成长尾词分组、搜索意图说明和 Listing 文案角度。 |

| 阶段 | 工具 ID | 路径 | H1 | SEO title | Meta description | 卡片描述 |
|---|---|---|---|---|---|---|
| P0 | `listing-generator` | `/tools/ai/listing-generator` | AI Listing Generator | AI Listing Generator for Amazon, Shopify, and Etsy | Enter a product name, selling points, and marketplace to draft editable titles, descriptions, tags, and social copy. | Draft product titles, descriptions, tags, and social copy from product details and marketplace. |
| P0 | `ai-youtube-generator` | `/tools/ai/youtube-generator` | YouTube Title and Description Generator | YouTube Title Generator with Descriptions and Tags | Create YouTube title ideas, SEO descriptions, tags, and thumbnail directions from a video topic, audience, and tone. | Generate YouTube titles, descriptions, tags, and thumbnail ideas from one video brief. |
| P0 | `keyword-analyzer` | `/tools/ai/keyword-analyzer` | Ecommerce Keyword Analyzer | Ecommerce Keyword Analyzer for Product Listings | Enter a product keyword to organize long-tail terms, search intent, and copy angles for listings. | Turn a product seed keyword into long-tail groups, search intent notes, and listing copy angles. |
| P1 | `ai-prompt-generator` | `/tools/ai/prompt-generator` | AI Image Prompt Generator | AI Image Prompt Generator for Midjourney and Stable Diffusion | Turn short image ideas into structured English prompts for Midjourney, Stable Diffusion, DALL-E, and other image models. | Expand a visual idea into copy-ready English prompts with style, scene, lighting, and composition details. |
| P1 | `ai-video-script` | `/tools/ai/video-script` | AI Video Script Generator | AI Video Script Generator for Short Videos | Generate short-form video scripts with hooks, scenes, captions, voiceover notes, and CTA ideas for TikTok, Reels, Shorts, and YouTube. | Create short-video scripts with hook, scene structure, captions, voiceover, and CTA notes. |
| P1 | `ai-text-polisher` | `/tools/ai/text-polisher` | AI Text Polisher | AI Text Polisher for Clearer Emails, Posts, and Copy | Rewrite rough text into clearer, cleaner copy while preserving the original meaning, facts, and intended tone. | Polish emails, posts, product copy, and notes without changing the core message. |
| P1 | `ai-translator` | `/tools/ai/translator` | AI Translator | AI Translator with Tone and Context Control | Translate text with tone control for emails, product copy, social posts, documents, and everyday writing. | Translate text and adapt tone while keeping structure and context. |
| P1 | `ai-excel-formula` | `/tools/ai/excel-formula` | AI Excel Formula Generator | AI Excel Formula Generator for Sheets and Excel | Describe a spreadsheet task and generate Excel or Google Sheets formulas with usage notes and examples. | Generate spreadsheet formulas from plain-language requirements. |
| P1 | `ai-regex` | `/tools/ai/regex` | AI Regex Generator | AI Regex Generator with Examples and Explanations | Describe a matching rule and generate a regex pattern with test examples, flags, and key syntax notes. | Create regex patterns from matching requirements, with examples and explanations. |
| P1 | `ai-xiaohongshu` | `/tools/ai/xiaohongshu` | Xiaohongshu Caption Generator | Xiaohongshu Caption Generator for Product and Lifestyle Posts | Generate Xiaohongshu post titles, body copy, emoji suggestions, and hashtags from a topic, audience, and selling points. | Draft Xiaohongshu post copy with title, body, emoji, and hashtag ideas. |
| P1 | `ai-resume-optimizer` | `/tools/ai/resume-optimizer` | AI Resume Optimizer | AI Resume Optimizer for Job Applications | Rewrite resume text against a job description, improve structure, preserve facts, and produce a copy-ready resume draft. | Improve resume wording and structure from source resume text and a target job description. |
| P1 | `competitor-tracker` | `/tools/ai/competitor-tracker` | Ecommerce Competitor Tracker | Ecommerce Competitor Tracker for Listing Gaps | Compare your product with competitor listings and identify gaps in positioning, benefits, copy, and offer strategy. | Compare competitor listings and find positioning, copy, and offer gaps. |
| P1 | `market-insights` | `/tools/ai/market-insights` | Ecommerce Market Insights Generator | Ecommerce Market Insights Generator for Product Ideas | Generate market notes for a platform, category, trend, or product idea. Use the output as research notes, not live market data. | Draft category and product opportunity notes from a platform or product idea. |
| P2 | `ai-hs-code-assistant` | `/tools/ai/hs-code-assistant` | AI HS Code and Customs Description Assistant | AI HS Code and Customs Description Assistant | Create customs description drafts, HS candidate directions, missing-information checks, and broker review questions from product details. | Prepare customs description drafts and HS review questions for cross-border products. |
| P2 | `ai-product-asset-checker` | `/tools/ai/product-asset-checker` | AI Product Asset Compliance Checker | AI Product Asset Compliance Checker for Ecommerce Images | Review product images, packaging photos, and label shots for listing risks, text overlays, mismatch issues, and missing information. | Check ecommerce product images for listing risks before publishing or ad review. |
| P2 | `ai-product-image-generator` | `/tools/ai/product-image-generator` | AI Product Image Generator | AI Product Image Generator for Ecommerce Listings | Generate ecommerce product image drafts from product details, platform, image use, aspect ratio, scene, and style. | Create product image drafts for marketplace listings, ads, and store pages. |
| P2 | `logo-generator` | `/tools/ai/logo-generator` | AI Logo and Avatar Generator | AI Logo and Avatar Generator for Brand Concepts | Generate logo and avatar concept images from brand name, industry, symbol ideas, color direction, and visual style. | Create logo and avatar concept drafts for brands, apps, shops, and creator profiles. |
| P2 | `ai-image-generator` | `/tools/ai/image-generator` | AI Image Generator | AI Image Generator from Text Prompts | Generate image drafts from a text prompt, aspect ratio, and visual style. Review results before commercial use. | Create image drafts from text prompts with selectable ratio and style. |
| P2 | `ai-svg-generator` | `/tools/ai/svg-generator` | AI SVG Generator | AI SVG Generator for Vector Illustrations and Icons | Generate SVG illustration or icon code from a text prompt, then copy or refine the vector output. | Create editable SVG drafts for icons, illustrations, and simple web graphics. |

## 7. URL 和信息架构

### 7.1 保留当前路径

P0 使用当前路径：

```txt
toolorbit.site/ai-tools
toolorbit.site/tools/ai/listing-generator
toolorbit.site/tools/ai/youtube-generator
toolorbit.site/tools/ai/keyword-analyzer
toolorbit.site/tools/ai/text-polisher
```

不新增子域，不新增独立 AI 站点，不迁移原工具目录。

### 7.2 `/ai-tools` 的角色

`/ai-tools` 是 ToolOrbit 内的 AI Hub，不是全站首页。

它要完成四件事：

- 承接 `free AI tools`、`AI tools for ecommerce`、`AI copywriting tools` 等宽意图。
- 露出核心 AI 工具入口。
- 解释 ToolOrbit AI 工具和通用 ChatGPT 对话的差异。
- 把内链分发到 `/tools/ai/*` 和相关内容页。

### 7.3 `/tools` 的角色

当前 `/tools` 是全站工具索引。P0 不把它改成 AI 工具首页。后续如果需要“首屏嵌入可用工具”，优先放在 `/ai-tools`，避免破坏全站工具索引的定位。

### 7.4 分类页

当前项目使用 `/category/:slug`。P0 不新增 `/categories/:slug`。AI 模块需要分类时，优先复用现有分类机制和导航菜单。

## 8. AI Tool Runtime 设计

### 8.1 配置模型

建议新增：

```txt
src/views/tools/ai/runtime/
  tool-config.ts
  prompt-config.ts
  platform-policy.ts
  output-validation.ts
  golden-cases.ts
```

P0 也可以先放在更小范围：

```txt
src/views/tools/ai/runtime-config.ts
src/lib/ai-tool-runtime/*
```

具体落点由开发时决定，但不能把新逻辑继续堆进 `src/app/api/[...path]/route.ts` 的 switch 里。

建议类型：

```ts
type AiToolOutputType = 'text' | 'list' | 'sections' | 'table' | 'json';

interface AiToolConfig {
  id: string;
  apiPath: string;
  routePath: string;
  name: string;
  category: 'ecommerce' | 'seo' | 'copywriting' | 'video' | 'productivity' | 'developer';
  status: 'draft' | 'published' | 'hidden';
  fields: AiToolField[];
  outputType: AiToolOutputType;
  outputCount?: number;
  promptVersion: string;
  keywordProcessing?: KeywordProcessingConfig;
  platformPolicyId?: string;
  relatedTools: string[];
  seo: {
    title: string;
    description: string;
    h1: string;
    canonicalPath: string;
  };
  overviewKey: string;
}
```

```ts
interface AiToolField {
  key: string;
  label: string;
  type: 'input' | 'textarea' | 'select' | 'multiSelect' | 'number';
  required: boolean;
  maxLength?: number;
  placeholder?: string;
  helpText?: string;
  options?: Array<{ label: string; value: string }>;
  defaultValue?: string | number | string[];
  acceptsChineseInput?: boolean;
  carryKey?: 'keyword' | 'audience' | 'product' | 'tone' | 'platform' | 'topic';
}
```

### 8.2 ContentBrief

模型调用前必须先把用户输入编译成 ContentBrief。

```ts
interface ContentBrief {
  toolId: string;
  task: string;
  rawInputs: Record<string, unknown>;
  normalizedKeyword?: string;
  detectedLanguage?: 'en' | 'zh' | 'mixed' | 'unknown';
  inferredIntent?: 'informational' | 'commercial' | 'transactional' | 'comparison' | 'navigational' | 'mixed';
  audience?: string;
  product?: string;
  platform?: string;
  tone?: string;
  constraints: string[];
  negativeConstraints: string[];
  outputFormat: string;
}
```

Prompt 只能从 ContentBrief、工具配置和平台规则组装。接口层不得直接把 `body.productInfo`、`body.topic` 之类字段拼进最终 Prompt。

### 8.3 关键词处理

P0 先用规则，不增加一次 LLM 调用做关键词理解。

规则示例：

| 输入特征 | inferredIntent |
|---|---|
| `how to`、`guide`、`tutorial` | `informational` |
| `best`、`top`、`review` | `commercial` |
| `buy`、`discount`、`price` | `transactional` |
| `vs`、`alternative`、`compare` | `comparison` |
| 只包含品牌词 | `navigational` |

中文或中英混合输入不报错。P0 可以先保留 raw input，并在 Prompt 中要求输出英文；后续再接入更稳定的中英归一化。

### 8.4 PlatformPolicy

平台规则必须从 Prompt 里抽出来，成为可版本化配置。

```ts
interface PlatformPolicyConfig {
  id: string;
  platform: 'amazon' | 'shopify' | 'etsy' | 'youtube' | 'tiktok' | 'facebook' | 'google';
  version: string;
  lastReviewedAt: string;
  sourceNote: string;
  maxLengths?: Record<string, number>;
  requiredSections?: string[];
  forbiddenTerms?: string[];
  restrictedClaims?: string[];
  validationRules: string[];
}
```

P0 最少需要：

- `amazon-listing-baseline-v1`
- `youtube-packaging-baseline-v1`
- `shopify-product-copy-baseline-v1`

如果规则来源只是人工基线，`sourceNote` 写 `manual baseline`，不要写成官方完整规则。

### 8.5 缓存 key

缓存 key 基于：

```txt
toolId + promptVersion + contentBriefHash
```

`contentBriefHash` 由影响输出的字段生成，不包含 IP、anonymousId、时间戳。

```ts
contentBriefHash = hash({
  toolId,
  task,
  normalizedKeyword,
  inferredIntent,
  audience,
  product,
  platform,
  tone,
  outputFormat,
  constraints,
  negativeConstraints
})
```

P0 如果暂不接 Redis，可以先实现 hash 生成和日志字段，缓存能力后置。

## 9. 后端改造

### 9.1 当前问题

`src/app/api/[...path]/route.ts` 当前承担多种职责：

- 路由识别
- AI 工具分类
- rate limit
- prompt 拼接
- 模型调用
- SSE 输出
- 图片、视觉、短链等非文本 API

继续往这个文件堆逻辑会让新增工具成本升高，也会让 Prompt 版本和输出校验难以回溯。

### 9.2 P0 目标结构

建议新增：

```txt
src/lib/ai-runtime/
  build-content-brief.ts
  build-prompt.ts
  run-text-tool.ts
  validate-output.ts
  parse-output.ts
  rate-limit.ts
  event-log.ts
  types.ts
```

API route 保留当前入口，但把文本型 AI 工具分发给 `runTextTool`：

```ts
const toolRunResult = await runTextTool({
  toolId,
  requestBody,
  requestMeta,
});
```

P0 可以继续返回 SSE，但最终结果结构要稳定。后续可从 SSE 过渡到 JSON + streaming events。

### 9.3 ToolRunResult

统一结果结构：

```ts
interface ToolRunResult {
  requestId: string;
  toolId: string;
  success: boolean;
  outputType: AiToolOutputType;
  outputs: ToolOutput[];
  validationStatus: 'pass' | 'warning' | 'failed';
  validationWarnings: string[];
  usage: {
    model: string;
    promptVersion: string;
    platformPolicyVersion?: string;
    cached: boolean;
    latencyMs: number;
  };
  error?: ToolRunError;
}
```

```ts
interface ToolOutput {
  id: string;
  index: number;
  label?: string;
  value: string | Record<string, unknown> | Array<Record<string, unknown>>;
  copyText: string;
  warnings?: string[];
}
```

### 9.4 错误码

前端不能只显示通用错误。P0 使用这些错误码：

| errorCode | 含义 | UI 位置 |
|---|---|---|
| `invalid_input` | 必填缺失、超长、枚举非法 | 字段下方 |
| `rate_limited` | 命中访问频率限制 | 结果区或生成区 |
| `concurrency_locked` | 同一匿名用户已有请求运行 | Generate 按钮附近 |
| `normalization_failed` | 输入无法形成 brief | 输入区 |
| `llm_timeout` | 模型超时 | 结果区 |
| `llm_failed` | 模型调用失败 | 结果区 |
| `validation_failed` | 输出结构不可用 | 结果区 |
| `internal_error` | 服务端异常 | 结果区，显示 requestId |
| `invalid_slug` | 工具不存在或未发布 | 404 |

### 9.5 限流

当前项目已有内存 `usageMap`。P0 可以保留，但要把限流语义写清楚：

- 普通生成：按 IP + anonymousId 限制。
- 同一 brief 的 regenerate：单独档位。
- 多模态工具继续沿用现有策略，不纳入 P0。
- 生产环境优先迁移到 Redis，避免多实例限流失效。

## 10. 前端交互

### 10.1 工具页生成循环

P0 统一文本型 AI 工具页的状态：

```txt
idle -> filling -> generating -> success
                         -> error
                         -> rate-limited
```

页面顺序：

```txt
H1
Short description
Tool form
Generate button
Generated results
Example input/output
Use cases or supported modes
Prompt rules / processing notes
FAQ
Related tools
```

当前项目已经用 `ToolPageClient` 渲染工具交互，用 `ToolContent` 渲染服务端 SEO 内容。P0 不推翻这套结构。新的 Runtime 表单和结果组件应该替换 P0 工具原有的分散实现。

### 10.2 表单

表单由配置渲染：

- `input`
- `textarea`
- `select`
- `multiSelect`
- `number`

规则：

- 必填未填时 Generate disabled。
- 用户正在输入时不急着报必填错误。
- 超长时显示字符计数。
- 接受中文输入的字段显示固定提示：`支持中文输入，输出为专业英文`。
- 生成中表单可读，不建议编辑。

### 10.3 结果

按 `outputType` 渲染：

| outputType | 渲染方式 | 复制方式 |
|---|---|---|
| `list` | 编号列表 | 每条复制 + 复制全部 |
| `sections` | 分区块卡片 | 每区块复制 + 复制全部 |
| `table` | 表格或成对卡片 | 单行复制 + 整表复制 |
| `text` | Markdown 或纯文本 | 全文复制 |
| `json` | 结构化卡片，不直接暴露原始 JSON | 每块复制 |

复制必须使用 `copyText`，不要从 DOM 里抓渲染文本。

### 10.4 重新生成

成功结果区提供 Regenerate：

- 使用相同输入再跑一次。
- 触发 `regenerate_click`。
- 如果命中相同 `contentBriefHash`，缓存返回对用户透明。

### 10.5 相关工具和预填

工具配置里维护 `relatedTools`。点击相关工具时，携带共享字段：

- `keyword`
- `audience`
- `product`
- `tone`
- `platform`
- `topic`

目标页读取 query 或 sessionStorage 后预填表单，并显示轻提示：`已带入上一步输入`。

未发布工具不渲染相关入口。

## 11. `/ai-tools` 升级要求

P0 不改根首页。`/ai-tools` 需要升级成 AI Hub。

区块顺序建议：

```txt
H1: Free AI Tools for Ecommerce, SEO, and Content Workflows
Short positioning
Featured AI tools
Try one tool inline or prominent CTA to Listing Generator
Workflow blocks
Why use ToolOrbit AI tools
AI tool categories
FAQ
Internal link cluster
```

首屏必须出现 4-6 个核心 AI 工具入口。不要让大段说明把工具入口挤到折叠线以下。

优先展示：

- Listing Generator
- Product Asset Checker
- Product Image Generator
- YouTube Generator
- Prompt Generator
- Keyword Analyzer

如果 P0 做内嵌工具，优先内嵌 Listing Generator 或 YouTube Generator。不要内嵌图片生成工具，避免首屏成本和失败率过高。

## 12. SEO 和内容维护

### 12.1 内容来源

新工具描述优先维护在现有 overview 数据结构：

- AI 工具：`src/views/tools/ai/data.ts`
- 工具基础标题、描述、SEO title：`src/locales/en.json`、`src/locales/zh.json`
- Hub 页面：`src/data/seoContent.ts`
- 工具注册：`src/data/tools-meta.ts`

不要把长 FAQ、highlight、overview 全部堆进 locale JSON。locale 文件只保留页面标题、基础描述、SEO 标题/描述和 UI 文案。

### 12.2 每个 P0 工具必须具备

- 独立 H1
- 独立 title
- 独立 meta description
- 独立 overview
- 示例输入和输出
- FAQ
- prompt rules 或 processing notes
- related tools
- SoftwareApplication schema

### 12.3 AdSense 和薄页面

AI 工具页不能只有一个输入框和一个按钮。P0 工具页必须包含可 SSR 的说明内容，`ToolContent` 继续负责输出搜索引擎和广告审核能读取的正文。

## 13. 数据和埋点

P0 事件：

| 用户动作 | 事件 |
|---|---|
| AI Hub 展示 | `ai_hub_view` |
| 工具页展示 | `tool_page_view` |
| 首次聚焦表单 | `form_start` |
| 关键字段变化 | `field_change` |
| 点击生成 | `run_click` |
| 生成成功 | `run_success` |
| 生成失败 | `run_failed` |
| 复制单条结果 | `copy_click` |
| 点击重新生成 | `regenerate_click` |
| 点击相关工具 | `related_tool_click` |
| 预填被保留 | `prefill_used` |

P0 每次 tool run 至少记录：

- `requestId`
- `toolId`
- `anonymousId`
- `ipHash`
- `inputHash`
- `contentBriefHash`
- `promptVersion`
- `platformPolicyVersion`
- `model`
- `cached`
- `validationStatus`
- `validationWarnings`
- `success`
- `errorCode`
- `latencyMs`
- `createdAt`

如果 P0 暂无数据库，先把字段结构落在代码和日志接口里。不要让后续补数据时重新设计事件。

## 14. Golden Set

P0 需要离线评测，不等线上用户反馈坏结果。

建议目录：

```txt
src/views/tools/ai/golden/
  listing-generator.cases.ts
  youtube-generator.cases.ts
  keyword-analyzer.cases.ts
```

每个 P0 工具至少 15 条样本。Listing Generator 至少 25 条，因为它涉及平台规则。

样本覆盖：

- 英文输入
- 中文输入
- 中英混合输入
- 短输入
- 长输入
- 缺少可选字段
- 平台规则边界
- 不应编造的认证、价格、排名、疗效承诺

验收标准：

- P0 工具结构校验通过率 100%。
- 总体样本通过率不低于 90%。
- `copyText` 不含解释性废话。
- `validation_failed` 不展示坏结果。
- 平台硬规则失败时必须产生 warning 或 failed。

## 15. 分阶段路线

### P0：Runtime 试点

- 新增 AI Tool Runtime 类型和配置。
- 改造 Listing Generator。
- 改造 YouTube Generator。
- 改造 Keyword Analyzer。
- `/ai-tools` 首屏露出核心工具入口。
- 支持统一错误、复制、相关工具预填和基础日志字段。
- 建立 Golden Set。

### P1：迁移更多文本工具

- 迁移 Prompt Generator、Video Script、Translator、Text Polisher、Weekly Report、Meeting Minutes。
- 把散落在 API switch 里的文本型 Prompt 收敛到配置。
- 补齐 promptVersion 和 validation。
- 增加更多 AI Hub workflow block。

### P2：多模态工具适配

- 评估 Product Asset Checker、Product Image Generator、Logo Generator、Image Generator、SVG Generator。
- 多模态工具保留专门 UI，但复用事件、错误、限流、日志和 SEO 内容规范。
- 将平台规则和安全提示统一进 PlatformPolicy。

### P3：用户上下文

- 登录或匿名 profile。
- 保存产品、店铺、受众、品牌语气。
- 每次生成自动注入用户上下文。
- 收藏结果和历史记录。

## 16. 验收标准

### 16.1 产品验收

- `/ai-tools` 仍可访问，首屏出现 4-6 个 AI 工具入口。
- P0 3 个工具可完成生成。
- P0 3 个工具能逐条复制结果。
- 错误状态有明确提示。
- 限流状态有明确提示。
- related tools 可跳转。
- 共享字段能预填。
- 工具页包含 SSR 内容，不是空壳。

### 16.2 技术验收

- P0 工具表单由配置渲染。
- Prompt 由 ContentBrief 组装。
- `promptVersion` 可追踪。
- `contentBriefHash` 可生成。
- 输出结构经过 validation。
- API route 不再继续堆 P0 文本工具 prompt switch。
- 复制事件具备 `toolId`、`requestId`、`outputId`、`outputIndex`。
- 未发布工具不会出现在 related tools。

### 16.3 内容验收

- 新增或改写文案经过 stop-slop 检查。
- 中文显示正常，无乱码。
- `src/locales/*.json` 不承载大段工具说明。
- AI 工具 overview 优先维护在 `src/views/tools/ai/data.ts` 或后续 Runtime overview 配置。

## 17. 开发顺序

1. 建 `src/lib/ai-runtime` 类型和最小运行函数。
2. 为 Listing Generator 写配置、ContentBrief、Prompt、validation、Golden Set。
3. 用配置驱动表单和结果区替换 Listing Generator 原组件。
4. 把 Listing Generator 接入统一 API runner。
5. 加复制事件、related tools 和预填。
6. 改造 YouTube Generator。
7. 改造 Keyword Analyzer。
8. 升级 `/ai-tools` 首屏和内链结构。
9. 补 SEO 内容和 schema。
10. 跑本地类型检查或按用户要求执行构建。

## 18. 风险

| 风险 | 处理 |
|---|---|
| 一次性重构过大 | P0 只改 3 个文本型工具 |
| URL 变更影响 SEO | P0 不改现有工具 URL |
| Prompt 继续散落 | 新文本工具必须走 runtime 配置 |
| 多模态工具复杂度高 | P0 不碰多模态底层 |
| 文案空泛 | 使用 stop-slop，保留具体事实和路径 |
| 数据暂未入库 | 先定义事件和日志字段，数据库后置 |

## 19. 明确不做

- 不把 ToolOrbit 改成纯 AI 工具站。
- 不删除现有非 AI 工具。
- 不把 AI Hub 放到根首页替代当前首页。
- 不开新仓库。
- 不新增子域。
- 不为了 PRD 一次性重写所有 AI 工具。

## 20. 结论

两份原文档的方向适合 ToolOrbit，但落地方式必须贴合当前项目结构。ToolOrbit 已有站点、工具目录和 AI 工具基础，后续开发应把这些能力收敛成统一 AI Tool Runtime。P0 用 3 个工具验证，验证通过后再迁移其它 AI 工具。
