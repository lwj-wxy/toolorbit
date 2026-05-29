// Script to expand featured-tools descriptions with 2 additional paragraphs per tool
// Usage: node scripts/expand-descriptions.mjs
import { readFileSync, writeFileSync } from 'fs';

const file = 'src/data/featured-tools.ts';
let c = readFileSync(file, 'utf-8');

// Extra paragraphs per tool (keyed by slug)
// Each entry: [en_para2, en_para3, zh_para2, zh_para3]
const EXTRA = {
  // ─── Developer Tools ───
  'code.visualstudio.com': [
    'VS Code supports IntelliSense, built-in debugging, Git commands, and thousands of community extensions for every language and framework. Its Remote Development pack allows seamless work inside containers, WSL, and over SSH.',
    'Ideal for developers at every level — from students writing their first HTML file to senior engineers managing large monorepos. The integrated terminal, task runner, and split editor make it a complete development environment.',
    'VS Code 内置智能感知、调试器、Git 命令和数千个社区扩展，覆盖所有主流语言和框架。Remote Development 套件支持在容器、WSL 和远程 SSH 环境中无缝开发。',
    '适合所有水平的开发者——从编写第一个 HTML 文件的学生到管理大型 monorepo 的资深工程师。集成终端、任务运行器和分屏编辑器使其成为完整的开发环境。',
  ],
  'github.com': [
    'GitHub Actions enables automated CI/CD pipelines triggered by push, PR, or schedule — with thousands of reusable workflow templates. GitHub Copilot, Codespaces, and advanced code search round out a comprehensive development platform.',
    'Essential for solo developers and teams alike. Use it for version control, open-source collaboration, portfolio hosting via GitHub Pages, issue tracking, and automated deployment. The free tier is generous enough for most projects.',
    'GitHub Actions 支持通过 push、PR 或定时触发自动化的 CI/CD 流水线，提供数千个可复用的工作流模板。Copilot、Codespaces 和高级代码搜索让 GitHub 成为全方位的开发平台。',
    '独立开发者和团队都不可或缺。可用于版本控制、开源协作、GitHub Pages 作品集托管、Issue 追踪和自动化部署。免费额度对大多数项目足够慷慨。',
  ],
  'postman.com': [
    'Postman offers environment variables, pre-request scripts, test automation with Chai assertions, and collection runners for CI integration. The mock server feature lets frontend teams develop against stable API contracts before the backend is ready.',
    'A must-have for backend developers, API designers, and QA engineers. Use it to explore third-party APIs, document internal services, run regression tests, and generate client SDKs from OpenAPI specs.',
    'Postman 提供环境变量、前置脚本、基于 Chai 断言的测试自动化和 CI 集成的集合运行器。Mock 服务器功能让前端团队在后端就绪前即可基于稳定的 API 契约并行开发。',
    '后端开发者、API 设计者和 QA 工程师的必备工具。可用于探索第三方 API、文档化内部服务、运行回归测试、以及从 OpenAPI 规范生成客户端 SDK。',
  ],
  'vercel.com': [
    'Vercel provides automatic HTTPS, global CDN, instant cache invalidation, and serverless/edge functions with zero-config deployments. Every git branch gets a unique preview URL for team review before merging.',
    'Perfect for frontend developers deploying React, Next.js, Vue, Svelte, or static sites. The generous free tier and seamless GitHub integration make it the go-to choice for shipping side projects, marketing pages, and SaaS frontends.',
    'Vercel 提供自动 HTTPS、全球 CDN、即时缓存失效和零配置部署的 Serverless/Edge 函数。每个 Git 分支自动生成独立预览 URL，方便团队在合并前评审。',
    '前端开发者的理想部署平台，支持 React、Next.js、Vue、Svelte 和静态站点。慷慨的免费额度和无缝 GitHub 集成使其成为交付副项目、营销页和 SaaS 前端的首选。',
  ],
  'docker.com': [
    'Docker Compose orchestrates multi-container applications with a single YAML file, while Docker Hub provides a registry of millions of pre-built images. Layer caching dramatically speeds up iterative builds.',
    'Essential for DevOps engineers, backend developers, and anyone who needs reproducible environments. Use it to run databases locally, create CI/CD runners, ship microservices, and ensure production parity.',
    'Docker Compose 通过单个 YAML 文件编排多容器应用，Docker Hub 提供数百万预构建镜像的注册中心。层缓存机制大幅加速迭代构建。',
    'DevOps 工程师、后端开发者和任何需要可复现环境的角色都必不可少。可用于本地运行数据库、创建 CI/CD 运行器、部署微服务及确保生产环境一致性。',
  ],
  'codepen.io': [
    'CodePen offers live preview, preprocessor support (SCSS, TypeScript, Babel), and embeddable pens for documentation. The community challenges and "Picked Pens" curation surface creative frontend work daily.',
    'Great for frontend developers prototyping animations, CSS layouts, and UI components. Also widely used for sharing reproducible bug reports, teaching web concepts, and embedding interactive examples in blog posts.',
    'CodePen 支持实时预览、预处理器（SCSS、TypeScript、Babel）和可嵌入的代码片段。社区挑战和精选 Pens 每日展示创意前端作品。',
    '前端开发者原型验证动画、CSS 布局和 UI 组件的利器。广泛用于分享可复现的 Bug 报告、教学 Web 概念和在博客中嵌入交互式示例。',
  ],
  'stackoverflow.com': [
    'Stack Overflow\'s reputation system, tag-based organization, and rigorous moderation ensure high-quality answers. The "Collectives" feature connects organizations with their developer communities, and Stack Overflow for Teams provides private Q&A.',
    'Every developer\'s lifeline when debugging. Beyond troubleshooting, it is valuable for discovering best practices, comparing technology trade-offs, and learning how experienced engineers approach real-world problems.',
    'Stack Overflow 的声望系统、标签组织和严格审核确保高质量的答案。Collectives 功能连接组织与其开发者社区，Teams 版提供私有问答空间。',
    '每个开发者调试时的生命线。除排查问题外，还可用于发现最佳实践、对比技术方案的利弊，以及学习资深工程师处理真实问题的方式。',
  ],
  'railway.app': [
    'Railway offers instant GitHub deploys, one-click database provisioning, environment variable management, and usage-based billing with a generous free starter credit. The CLI and API enable full infrastructure-as-code workflows.',
    'Tailored for solo developers and small startups who want Heroku-like simplicity with more flexibility. Great for hosting side projects, running cron jobs, spinning up staging environments, and prototyping MVPs quickly.',
    'Railway 提供即时 GitHub 部署、一键创建数据库、环境变量管理和基于用量的计费，附带慷慨的免费启动额度。CLI 和 API 支持完整的基础设施即代码工作流。',
    '适合追求 Heroku 式简洁但需要更多灵活性的独立开发者和初创团队。适用于托管副项目、运行定时任务、搭建预发布环境和快速验证 MVP。',
  ],
  'bun.sh': [
    'Bun is a drop-in replacement for Node.js that runs JavaScript and TypeScript with dramatically faster startup and execution. It bundles, transpiles, and installs packages — all within a single binary, eliminating the need for separate tooling.',
    'An excellent choice for developers building CLI tools, serverless functions, and high-throughput APIs. Its native TypeScript support and npm-compatible package manager make migration seamless for existing projects seeking performance gains.',
    'Bun 是 Node.js 的直接替代品，以极快的速度和启动时间运行 JavaScript 和 TypeScript。集打包、转译和包管理于单一二进制文件，无需额外工具链。',
    '适合构建 CLI 工具、Serverless 函数和高吞吐量 API 的开发者。原生 TypeScript 支持和 npm 兼容的包管理器使现有项目可无缝迁移以获得性能提升。',
  ],
  'biomejs.dev': [
    'Biome replaces ESLint and Prettier with a single, significantly faster tool — formatting and linting large codebases in milliseconds. It supports JavaScript, TypeScript, JSX, and JSON with a growing rule set and zero configuration for most projects.',
    'A perfect fit for teams frustrated by slow CI pipelines due to linting. Use it to enforce consistent code style in monorepos, reduce toolchain complexity, and speed up pre-commit hooks without sacrificing rule coverage.',
    'Biome 以单个显著更快的工具替代 ESLint + Prettier——在毫秒级别完成大型代码库的格式化与 Lint。支持 JavaScript、TypeScript、JSX 和 JSON，规则集不断增长，大多数项目零配置即可使用。',
    '对于因 Lint 拖慢 CI 流水线而苦恼的团队是理想选择。可用于在 monorepo 中强制执行一致的代码风格、降低工具链复杂度并加速 pre-commit 钩子，同时不牺牲规则覆盖。',
  ],
  'playwright.dev': [
    'Playwright auto-waits for elements to be actionable, captures trace videos and screenshots on failure, and runs tests across Chromium, Firefox, and WebKit with a single API. Its codegen tool records user interactions and generates test scripts automatically.',
    'Indispensable for QA engineers and full-stack developers who need reliable end-to-end tests. Use it to validate critical user flows, catch cross-browser regressions, and generate visual snapshots for design review.',
    'Playwright 自动等待元素可交互、失败时捕获 Trace 视频和截图，并通过单一 API 在 Chromium、Firefox 和 WebKit 上运行测试。Codegen 工具可录制用户操作并自动生成测试脚本。',
    'QA 工程师和需要可靠端到端测试的全栈开发者不可或缺。可用于验证关键用户流程、捕获跨浏览器回归问题以及为设计评审生成视觉快照。',
  ],
  'prisma.io': [
    'Prisma provides an auto-generated type-safe query builder, a declarative schema for database modeling, and a visual database browser (Prisma Studio). Migrations are managed through a straightforward CLI without writing raw SQL.',
    'A top choice for TypeScript developers building data-driven applications. It eliminates the gap between database schema and application types, accelerates CRUD development, and integrates smoothly into Next.js, NestJS, and tRPC stacks.',
    'Prisma 提供自动生成的类型安全查询构建器、声明式 Schema 建模和可视化数据库浏览器（Prisma Studio）。迁移通过简洁的 CLI 管理，无需编写原始 SQL。',
    'TypeScript 开发者构建数据驱动应用的首选 ORM。它消除了数据库 Schema 与应用类型之间的鸿沟，加速 CRUD 开发，并与 Next.js、NestJS、tRPC 技术栈平滑集成。',
  ],
  'turbo.build': [
    'Turborepo caches task outputs and intelligently skips unchanged work, dramatically accelerating builds in monorepos. Its dependency graph visualization and parallel execution engine ensure tasks run in optimal order with maximum concurrency.',
    'A must-have for platform teams managing multi-package repositories. It reduces CI costs, shortens developer feedback loops, and integrates transparently with existing npm, pnpm, and Yarn workspaces.',
    'Turborepo 缓存任务输出并智能跳过未变更的工作，显著加速 monorepo 中的构建。依赖图可视化和并行执行引擎确保任务以最优顺序和最大并发运行。',
    '管理多包仓库的平台团队的必备工具。降低 CI 成本、缩短开发者反馈循环，并与现有 npm、pnpm 和 Yarn workspaces 透明集成。',
  ],
  'storybook.js.org': [
    'Storybook isolates each UI component so you can develop, test, and document it independently. Add-ons provide accessibility checks, responsive viewport previews, design tool integration, and interaction testing — all within a single workshop.',
    'Essential for teams building design systems and component libraries. Use it to showcase components to stakeholders, run visual regression tests with Chromatic, and onboard new developers by letting them browse every UI state without running the full app.',
    'Storybook 隔离每个 UI 组件，让你可以独立开发、测试和文档化。插件提供无障碍检查、响应式视口预览、设计工具集成和交互测试——全部在一个工作坊内完成。',
    '构建设计系统和组件库的团队必备。可用于向利益相关者展示组件、通过 Chromatic 运行视觉回归测试，以及让新开发者在不启动完整应用的情况下浏览每个 UI 状态。',
  ],
  'ngrok.com': [
    'ngrok creates a secure tunnel from a public URL to your localhost, with automatic HTTPS, request inspection, and replay. Reserved domains and TCP tunnels support more permanent setups for staging environments and IoT devices.',
    'Invaluable for developers testing webhooks, OAuth flows, and payment callbacks. Use it to demo work-in-progress to clients, share a local dev server during pair programming, and expose APIs from behind firewalls.',
    'ngrok 通过公共 URL 创建到本地主机的安全隧道，自动配置 HTTPS、请求检查与重放。预留域名和 TCP 隧道为预发布环境和 IoT 设备提供更持久的方案。',
    '测试 Webhook、OAuth 回调和支付通知的开发者利器。可用于向客户演示进行中的工作、结对编程时共享本地开发服务器，以及从防火墙后暴露 API。',
  ],
  'cloudflare.com': [
    'Cloudflare Workers deploy JavaScript at the edge — within milliseconds of users worldwide — with zero cold starts and a generous free tier. The broader platform includes DDoS protection, DNS management, R2 object storage, D1 SQLite database, and AI inference APIs.',
    'A complete infrastructure platform for modern web applications. Use Workers for API middleware and A/B testing, Pages for Jamstack hosting, R2 for cost-effective asset storage, and the AI Gateway to proxy and monitor LLM API calls.',
    'Cloudflare Workers 在全球边缘部署 JavaScript——距用户仅毫秒延迟——零冷启动且免费额度慷慨。更广泛的平台包含 DDoS 防护、DNS 管理、R2 对象存储、D1 SQLite 数据库和 AI 推理 API。',
    '现代 Web 应用的完整基础设施平台。Workers 可用于 API 中间件与 A/B 测试，Pages 用于 Jamstack 托管，R2 用于经济高效的资源存储，AI Gateway 用于代理和监控 LLM API 调用。',
  ],
  'transform.tools': [
    'Transform Tools converts between dozens of formats — JSON to TypeScript, JSX to JavaScript, GraphQL to TypeScript, CSS to Tailwind, and more — with instant results rendered in a split-pane editor. All processing runs locally in the browser.',
    'A time-saver for developers who frequently shuffle between data formats. Use it to generate TypeScript types from API responses, migrate CSS to Tailwind utilities, convert JSON Schema to TypeScript interfaces, and explore unfamiliar formats.',
    'Transform Tools 支持数十种格式互转——JSON 转 TypeScript、JSX 转 JavaScript、GraphQL 转 TypeScript、CSS 转 Tailwind 等——结果即时呈现在分屏编辑器中。所有处理在浏览器本地完成。',
    '频繁在不同数据格式间切换的开发者的省时利器。可用于从 API 响应生成 TypeScript 类型、将 CSS 迁移为 Tailwind 工具类、将 JSON Schema 转为 TypeScript 接口以及探索不熟悉的格式。',
  ],
  'bundlephobia.com': [
    'BundlePhobia shows the minified, minified+gzipped, and tree-shaken size of any npm package, plus its dependency graph and composition breakdown. Shareable URLs make it easy to include size analysis in PR reviews.',
    'Essential for performance-conscious frontend developers. Use it before adding any new dependency to compare alternatives by bundle impact, identify bloated packages, and keep your JavaScript payload slim.',
    'BundlePhobia 展示任意 npm 包的压缩、gzip 和 Tree-shaking 后体积，以及依赖图和构成分析。可分享的 URL 便于在 PR 评审中包含体积分析。',
    '注重性能的前端开发者的必备工具。添加任何新依赖前先对比不同方案对打包体积的影响，识别臃肿的包，保持 JavaScript 负载精简。',
  ],
  'caniuse.com': [
    'Can I Use provides detailed browser support tables for every HTML, CSS, JavaScript, SVG, and Web API feature — including global usage statistics, known issues, and links to relevant specifications. Data is updated as browsers ship new versions.',
    'Every frontend developer\'s go-to reference before using a modern web feature. Check compat data before adopting new CSS properties, verify that a JavaScript API works across target browsers, and include support notes in documentation.',
    'Can I Use 提供每个 HTML、CSS、JavaScript、SVG 和 Web API 特性的详细浏览器支持表——包括全球使用率统计、已知问题和相关规范链接。数据随浏览器新版本发布而更新。',
    '每个前端开发者在使用现代 Web 特性前的必备参考。采用新 CSS 属性前先检查兼容性数据、验证 JavaScript API 在目标浏览器中的支持情况，在文档中包含支持说明。',
  ],
  'curlconverter.com': [
    'cURL Converter translates curl commands into idiomatic code for Python (requests, httpx), JavaScript (fetch, axios), Go, PHP, Java, Rust, and more. Paste a curl command from API docs or browser DevTools and get production-ready code instantly.',
    'A daily productivity booster for developers integrating third-party APIs. Use it to convert Chrome DevTools "Copy as cURL" output into your preferred language, translate API documentation examples, and debug HTTP requests.',
    'cURL Converter 将 curl 命令转换为 Python（requests/httpx）、JavaScript（fetch/axios）、Go、PHP、Java、Rust 等语言的惯用代码。粘贴来自 API 文档或浏览器 DevTools 的 curl 命令，即可获得生产就绪的代码。',
    '集成第三方 API 的开发者的日常效率提升工具。可将 Chrome DevTools 的"复制为 cURL"输出转换为你的首选语言、翻译 API 文档示例以及调试 HTTP 请求。',
  ],
  'jsonplaceholder.typicode.com': [
    'JSONPlaceholder provides a complete REST API with realistic data for posts, comments, users, albums, photos, and todos — all served as JSON. No authentication, no rate limiting, and predictable resource relationships make it ideal for testing.',
    'Perfect for frontend developers prototyping UI with realistic data, bootcamp students building portfolio projects, and engineers writing API client tests. The predictable schema and relationships mirror real application data structures.',
    'JSONPlaceholder 提供完整的 REST API，包含 posts、comments、users、albums、photos、todos 等真实结构的 JSON 数据。无需认证、无限流、资源关系可预测，非常适合测试。',
    '前端开发者使用真实数据原型 UI、编程训练营学员构建作品集项目以及工程师编写 API 客户端测试的理想选择。可预测的 Schema 和关系模拟了真实应用的数据结构。',
  ],
  'orm.drizzle.team': [
    'Drizzle ORM offers an SQL-like query syntax with full TypeScript type inference, zero dependencies, and first-class support for serverless platforms. Its schema definition mirrors SQL table declarations, making it intuitive for developers who know SQL.',
    'A strong contender for TypeScript developers who prefer writing SQL-style queries over abstract ORM patterns. Excellent for serverless projects on Vercel/Cloudflare, edge databases like Turso and PlanetScale, and teams that want maximum control over query generation.',
    'Drizzle ORM 提供类 SQL 的查询语法、完整的 TypeScript 类型推导、零依赖以及对 Serverless 平台的一流支持。Schema 定义直接映射 SQL 表声明，SQL 开发者上手极为直观。',
    '偏好 SQL 风格查询而非抽象 ORM 模式的 TypeScript 开发者的强力选择。适合 Vercel/Cloudflare 上的 Serverless 项目、Turso 和 PlanetScale 等边缘数据库，以及想要完全控制查询生成逻辑的团队。',
  ],

  // ─── Design Resources ───
  'figma.com': [
    'Figma\'s cloud-first architecture enables real-time multiplayer editing, seamless handoff with Dev Mode, and an extensive plugin ecosystem for accessibility checking, content generation, and asset export. Component variants and auto-layout dramatically speed up design iteration.',
    'The industry standard for UI/UX designers, product managers, and frontend developers collaborating on digital products. Use it to create wireframes, design systems, interactive prototypes, and developer-ready specs — all within a single tool.',
    'Figma 的云端优先架构支持实时多人编辑、Dev Mode 无缝交付，以及丰富的插件生态（无障碍检查、内容生成、资源导出）。组件变体和自动布局大幅加速设计迭代。',
    'UI/UX 设计师、产品经理和前端开发者协作数字产品的行业标准。可用于创建线框图、设计系统、交互原型和开发者就绪的规格说明——全部在一个工具内完成。',
  ],
  'dribbble.com': [
    'Dribbble curates high-quality design work from top creatives worldwide. Designers can build portfolios, get feedback, find freelance opportunities, and follow trending visual styles. The job board connects companies with design talent.',
    'A vital source of visual inspiration for designers, creative directors, and product teams. Browse to discover UI patterns, illustration styles, branding concepts, and motion design trends before starting a new project.',
    'Dribbble 精选全球顶尖创意人的高质量设计作品。设计师可建立作品集、获得反馈、寻找自由职业机会并追踪视觉风格趋势。职位板块连接公司与设计人才。',
    '设计师、创意总监和产品团队的视觉灵感宝库。在新项目启动前浏览 UI 模式、插画风格、品牌概念和动效设计趋势。',
  ],
  'coolors.co': [
    'Coolors generates harmonious color palettes with a tap of the spacebar. Lock colors you like, adjust shades, check contrast ratios for accessibility, and export as CSS, SCSS, SVG, PDF, or image — all instantly.',
    'A go-to tool for UI designers, frontend developers, and brand designers who need quick, cohesive color schemes. Use the contrast checker to ensure WCAG compliance, export palettes directly into design tools, and build a library of project color sets.',
    'Coolors 通过按空格键即可生成和谐的配色方案。可锁定喜欢的颜色、调整色阶、检查无障碍对比度，并导出为 CSS、SCSS、SVG、PDF 或图片——全部即时完成。',
    'UI 设计师、前端开发者和品牌设计师获取快速协调配色的首选工具。使用对比度检查器确保 WCAG 合规、直接导出到设计工具、建立项目配色库。',
  ],
  'unsplash.com': [
    'Unsplash hosts millions of professional, high-resolution photographs contributed by a global community of photographers — all free to use under a permissive license with no attribution required. Collections and AI-powered search help surface the right image quickly.',
    'Ideal for developers building website mockups, designers creating social media graphics, content creators illustrating blog posts, and product teams needing placeholder imagery. The API enables programmatic image access for applications.',
    'Unsplash 托管数百万张由全球摄影师社区贡献的专业高清照片——均可在宽松许可下自由使用，无需署名。收藏集和 AI 搜索帮助快速找到合适的图片。',
    '适合开发者构建网站原型、设计师创建社交媒体图形、内容创作者为博客配图以及产品团队需要占位图。API 支持在应用中编程式获取图片。',
  ],
  'fonts.google.com': [
    'Google Fonts offers 1,500+ open-source typeface families with variable font support, subset optimization for performance, and easy CSS/HTML embed snippets. Fonts are served from Google\'s global CDN with automatic format negotiation for modern browsers.',
    'The go-to web font resource for frontend developers and designers. Use it to select readable body text, distinctive headings, and monospace code fonts. Variable fonts reduce the number of HTTP requests while enabling fine-grained typographic control.',
    'Google Fonts 提供 1500+ 开源字体家族，支持可变字体、性能优化的子集以及简洁的 CSS/HTML 嵌入代码。字体从 Google 全球 CDN 分发，自动为现代浏览器协商最佳格式。',
    '前端开发者和设计师的 Web 字体首选资源。可用于选择可读性强的正文、有特色的标题和等宽代码字体。可变字体在减少 HTTP 请求的同时实现精细的排版控制。',
  ],
  'excalidraw.com': [
    'Excalidraw produces hand-drawn style diagrams, wireframes, and flowcharts with real-time collaboration. Its infinite canvas, shape library, and export-as-PNG/SVG features make it a lightweight alternative to heavy diagramming tools.',
    'Great for engineers sketching architecture diagrams, product managers mapping user flows, and educators creating visual explanations. The hand-drawn aesthetic reduces the pressure of perfection and encourages iterative thinking.',
    'Excalidraw 以手绘风格生成图表、线框图和流程图，支持实时协作。无限画布、图形库和导出 PNG/SVG 功能使其成为重型绘图工具的轻量替代。',
    '适合工程师绘制架构图、产品经理梳理用户流程以及教育者制作可视化讲解。手绘美学降低了追求完美的压力，鼓励迭代式思考。',
  ],
  'lucide.dev': [
    'Lucide provides 1,500+ meticulously designed, pixel-consistent icons — available as React, Vue, Svelte, and raw SVG components. Each icon is tree-shakeable, reducing bundle impact, and the search interface makes finding the right icon fast.',
    'The default icon library for modern web projects built with React, Next.js, and Tailwind CSS. Use it to create navigation bars, button icons, status indicators, and feature lists with a cohesive, professional look across the entire application.',
    'Lucide 提供 1500+ 精心设计、像素一致的图标——支持 React、Vue、Svelte 和原始 SVG 组件。每个图标都支持 Tree-shaking 以减少打包体积，搜索界面让快速找到合适的图标变得轻松。',
    '使用 React、Next.js 和 Tailwind CSS 构建的现代 Web 项目的默认图标库。可用于创建导航栏、按钮图标、状态指示器和功能列表，为整个应用带来统一专业的外观。',
  ],
  'remove.bg': [
    'remove.bg uses AI to detect foreground subjects and remove image backgrounds in seconds — no manual selection or masking required. It handles hair, fur, and complex edges with surprising accuracy and offers API access for bulk processing.',
    'A huge timesaver for designers, ecommerce sellers, and marketers. Use it to create product photos with clean backgrounds, generate transparent PNGs for compositing, and prepare headshots for team pages and social profiles.',
    'remove.bg 使用 AI 检测前景主体并在数秒内去除图片背景——无需手动选区或蒙版。处理头发、毛发和复杂边缘的精度令人惊讶，并提供 API 进行批量处理。',
    '设计师、电商卖家和营销人员的时间节省利器。可用于创建干净背景的产品照片、生成用于合成的透明 PNG 以及为团队页面和社交媒体准备头像。',
  ],
  'tinypng.com': [
    'TinyPNG uses smart lossy compression to reduce PNG, JPEG, and WebP file sizes by 50-80% while preserving visual quality. The WebP converter creates next-gen images for modern browsers, and the Photoshop plugin streamlines design workflows.',
    'A must-use step before deploying any website. Compress hero images, product photos, and icon sprites to improve page load speed and Core Web Vitals scores — without requiring build tool integration or CLI knowledge.',
    'TinyPNG 使用智能有损压缩将 PNG、JPEG 和 WebP 文件体积减少 50-80% 同时保持视觉质量。WebP 转换器为现代浏览器生成下一代图片，Photoshop 插件简化设计工作流。',
    '部署任何网站前的必经步骤。压缩首屏大图、产品照片和图标雪碧图以提升页面加载速度和 Core Web Vitals 评分——无需构建工具集成或 CLI 知识。',
  ],
  'squoosh.app': [
    'Squoosh provides side-by-side before/after comparison across multiple codecs (MozJPEG, AVIF, WebP, PNG) with granular quality and effort sliders. All compression runs locally in the browser — no uploads to a server.',
    'Essential for performance-focused developers choosing the optimal format and compression level for each image. Use it to benchmark AVIF vs WebP quality at different sizes, generate compressed assets for a CMS, and understand the trade-offs between codec options.',
    'Squoosh 提供多种编码器（MozJPEG、AVIF、WebP、PNG）的左右对比预览，可精细调节质量和压缩力度。所有压缩均在浏览器本地完成——无需上传至服务器。',
    '注重性能的开发者选择最优图片格式和压缩级别的必备工具。可用于对比不同尺寸下 AVIF 与 WebP 的画质、为 CMS 生成压缩资源以及理解各编码器的权衡取舍。',
  ],
  'colorhunt.co': [
    'ColorHunt curates a hand-picked collection of beautiful, modern color palettes updated daily. Each palette has four colors optimized for UI design, with one-click hex code copying.',
    'A quick dose of color inspiration for designers and developers who need a fresh palette for a landing page, dashboard, or brand refresh. Save favorites to a personal collection and revisit them when starting new projects.',
    'ColorHunt 每日更新精选的优美现代配色方案。每个调色板包含四个为 UI 设计优化的颜色，一键复制十六进制色码。',
    '为需要快速获取落地页、仪表盘或品牌焕新配色的设计师和开发者提供色彩灵感。收藏喜爱的方案到个人合集中，在启动新项目时随时回顾。',
  ],
  'heroicons.com': [
    'Heroicons offers over 300 free SVG icons in three styles — outline, solid, and mini — all designed on a consistent 24×24 grid. As the official icon set of Tailwind CSS, they integrate perfectly with utility-first workflows.',
    'Ideal for Tailwind CSS projects where visual consistency matters. Use outline icons for nav bars and form controls, solid icons for primary actions, and mini icons for dense UIs like data tables and breadcrumbs.',
    'Heroicons 提供 300+ 免费 SVG 图标，三种风格——outline、solid 和 mini——全部基于统一的 24×24 网格设计。作为 Tailwind CSS 官方图标集，与 utility-first 工作流完美集成。',
    '适合注重视觉一致性的 Tailwind CSS 项目。Outline 风格适合导航栏和表单控件，Solid 风格适合主要操作按钮，Mini 风格适合数据表格和面包屑等高密度 UI。',
  ],
  'haikei.app': [
    'Haikei generates customizable SVG backgrounds — waves, blobs, gradients, grids, and abstract shapes — with live preview and export to SVG or PNG. Every parameter is adjustable, giving each design a unique feel.',
    'A go-to resource for designers and developers who need hero backgrounds, section dividers, and decorative elements without creating them from scratch. The SVG output is resolution-independent and lightweight, keeping page load fast.',
    'Haikei 生成可定制的 SVG 背景——波浪、流体形状、渐变、网格和抽象图形——实时预览并导出 SVG 或 PNG。每个参数都可调整，赋予每个设计独特的质感。',
    '设计师和开发者获取首屏背景、章节分割线和装饰元素的首选资源，无需从零创作。SVG 输出分辨率无关且轻量，保持页面加载快速。',
  ],
  'phosphoricons.com': [
    'Phosphor Icons offers 1,400+ icons in six weights — thin, light, regular, bold, fill, and duotone — giving designers flexibility to match any visual hierarchy. Icons are consistently designed, framework-agnostic, and available as React/Vue components or raw SVG.',
    'Excellent for projects that need more visual weight options than a typical icon set. Use thin icons for subtle UI hints, regular for standard navigation, bold for emphasized states, and duotone for feature highlights.',
    'Phosphor Icons 提供 1400+ 图标 × 六种粗细——thin、light、regular、bold、fill、duotone——让设计师灵活匹配任何视觉层级。图标设计一致、跨框架友好，支持 React/Vue 组件或原始 SVG。',
    '适合需要比普通图标集更多视觉层次选项的项目。Thin 适合微妙的 UI 提示，Regular 适合标准导航，Bold 适合强调状态，Duotone 适合功能亮点展示。',
  ],

  // ─── Productivity ───
  'notion.so': [
    'Notion combines notes, docs, databases, wikis, and project management into a single, flexible workspace. Its block-based editor lets you mix text, tables, kanban boards, calendars, and embeds freely — all within a drag-and-drop interface.',
    'Perfect for individuals managing personal knowledge bases, startups documenting internal processes, and teams running lightweight project management. The template gallery provides quick-start setups for meeting notes, product roadmaps, habit trackers, and more.',
    'Notion 融合笔记、文档、数据库、Wiki 和项目管理于一个灵活的工作空间。块编辑器让你自由混合文本、表格、看板、日历和嵌入内容——所有操作都可拖拽完成。',
    '适合管理个人知识库的个人、文档化内部流程的初创公司以及运行轻量项目管理的团队。模板库提供会议记录、产品路线图、习惯追踪等的快速入门设置。',
  ],
  'obsidian.md': [
    'Obsidian stores notes as local plain Markdown files, giving you full ownership of your data. Bidirectional links, the graph view, and a powerful plugin ecosystem turn your notes into an interconnected knowledge network — a true "second brain."',
    'Ideal for researchers, writers, and developers who want a durable, portable knowledge base. Use it to build interconnected study notes, document technical concepts with code snippets, and create Zettelkasten-style idea networks.',
    'Obsidian 将笔记存储为本地纯 Markdown 文件，让你完全掌控自己的数据。双向链接、图谱视图和强大的插件生态将你的笔记转化为互联的知识网络——真正的"第二大脑"。',
    '适合需要持久、可移植知识库的研究者、写作者和开发者。可用于构建互联的学习笔记、用代码片段记录技术概念以及创建 Zettelkasten 式的想法网络。',
  ],
  'linear.app': [
    'Linear is built for speed — every interaction is keyboard-navigable, views update in real time, and the UI stays clean even with thousands of issues. Cycles, roadmaps, and project updates keep teams aligned without the bloat of traditional project management tools.',
    'Purpose-built for software teams that value focus and speed. Use it to run sprint planning, track bugs, manage feature backlogs, and communicate project status. The GitHub/GitLab integration auto-closes issues from PRs.',
    'Linear 为速度而生——每个交互均可键盘操作、视图实时更新、即使在数千个 Issue 下 UI 仍保持干净。Cycles、路线图和项目更新让团队保持一致，没有传统项目管理工具的臃肿感。',
    '专为注重专注和速度的软件团队打造。可用于运行 Sprint 规划、追踪 Bug、管理功能需求池和沟通项目状态。GitHub/GitLab 集成可在 PR 中自动关闭对应 Issue。',
  ],
  'raycast.com': [
    'Raycast replaces Spotlight with a programmable launcher. Beyond launching apps, it offers clipboard history, window management, quick links, snippets, floating notes, and a store of community extensions that integrate with GitHub, Jira, Slack, and more.',
    'Transformative for macOS-using developers and power users. Use it to compose Jira tickets with a shortcut, search GitHub repos without opening a browser, manage window layouts, convert units, format JSON — all without leaving the keyboard.',
    'Raycast 以可编程启动器替代 Spotlight。除启动应用外，还提供剪贴板历史、窗口管理、快速链接、代码片段、浮动笔记以及集成 GitHub、Jira、Slack 等工具的社区扩展商店。',
    'macOS 开发者和高级用户的效率革命。可通过快捷键创建 Jira 工单、无需浏览器搜索 GitHub 仓库、管理窗口布局、换算单位、格式化 JSON——全部无需离开键盘。',
  ],
  'diagrams.net': [
    'draw.io provides professional diagramming without sign-up or cloud lock-in. It supports flowcharts, UML diagrams, network topologies, org charts, and BPMN — with full offline capability and integration with Google Drive, OneDrive, and GitHub.',
    'The go-to diagramming tool for engineers, architects, and technical writers. Use it to document system architectures, map database schemas, sketch API flows, and create presentation-ready diagrams for design reviews and RFCs.',
    'draw.io 提供无需注册、无云锁定的专业绘图体验。支持流程图、UML 图、网络拓扑图、组织架构图和 BPMN——完全支持离线使用并集成 Google Drive、OneDrive 和 GitHub。',
    '工程师、架构师和技术写作者的首选绘图工具。可用于记录系统架构、绘制数据库 Schema、草拟 API 流程以及为设计评审和 RFC 创建可用于演示的图表。',
  ],
  'warp.dev': [
    'Warp modernizes the terminal with IDE-like text editing, AI-powered command suggestions, and a block-based output model that groups each command and its output. Warp Drive stores frequently used commands and workflows as shareable notebooks.',
    'A breath of fresh air for developers who spend hours in the terminal. Use it to edit multi-line commands like a document, search and copy from past output with a mouse, share debugging sessions with teammates, and leverage AI to recall tricky CLI flags.',
    'Warp 以 IDE 级文本编辑、AI 命令建议和基于块的输出模型（将命令和输出分组）实现终端的现代化。Warp Drive 将常用命令和工作流存储为可分享的笔记本。',
    '对每天数小时泡在终端里的开发者来说是一股清流。可像编辑文档一样编辑多行命令、用鼠标搜索复制历史输出、与队友分享调试过程，以及通过 AI 回忆繁琐的 CLI 参数。',
  ],
  'loom.com': [
    'Loom records your screen, camera, and audio in one click, generating an instant shareable link. Viewers can react with emoji, leave timestamped comments, and watch at variable speed — transforming async communication.',
    'Invaluable for remote teams reporting bugs, walking through designs, recording sprint demos, and creating onboarding guides. Replace long Slack threads and meeting hours with watchable, rewindable video messages.',
    'Loom 一键录制屏幕、摄像头和音频，即时生成可分享的链接。观看者可表情互动、在时间轴上留言评论并变速观看——彻底改变异步沟通方式。',
    '远程团队报告 Bug、演示设计、录制 Sprint Demo 和创建入职指南的利器。用可观看、可回放的视频消息替代冗长的 Slack 讨论和会议。',
  ],
  'cleanshot.com': [
    'CleanShot X is the definitive screenshot tool for macOS — capture scrolling content, record screen with audio, annotate with arrows and text, blur sensitive data, and upload to cloud for instant sharing. Every feature is accessible from a clean overlay menu.',
    'A must-have for macOS users who create documentation, tutorials, or bug reports. Use it to capture full-page web content, annotate screenshots for design feedback, record step-by-step product demos, and quickly share visuals with a link.',
    'CleanShot X 是 macOS 上的终极截图工具——捕获滚动内容、录制带音频的屏幕、用箭头和文本标注、模糊敏感数据，并上传至云端即时分享。所有功能通过简洁的悬浮菜单访问。',
    '创建文档、教程或 Bug 报告的 macOS 用户必备。可用于截取整页网页内容、为设计反馈标注截图、录制分步产品演示以及快速用链接分享视觉内容。',
  ],
  'slack.com': [
    'Slack organizes team communication into channels, with threaded replies, app integrations, and powerful search. Workflow Builder automates routine processes like onboarding checklists and standup reminders without writing code.',
    'The backbone of remote and hybrid team communication. Use channels to organize cross-functional projects, share code snippets and logs in engineering channels, integrate CI/CD alerts, and maintain a searchable archive of decisions and discussions.',
    'Slack 通过频道、消息线程、应用集成和强大搜索组织团队沟通。Workflow Builder 无需代码即可自动化入职清单、站会提醒等例行流程。',
    '远程和混合团队沟通的支柱。用频道组织跨职能项目、在工程频道分享代码片段和日志、集成 CI/CD 告警、维护可搜索的决策和讨论归档。',
  ],
  'todoist.com': [
    'Todoist supports natural language task entry ("meeting tomorrow at 3pm #work p1"), project organization, priority levels, labels, filters, and a Karma productivity tracking system. Cross-platform sync ensures tasks are accessible on every device.',
    'Ideal for individuals and small teams practicing GTD (Getting Things Done). Use projects for areas of responsibility, labels for context (@home, @office), priorities for daily triage, and Karma for motivation and habit building.',
    'Todoist 支持自然语言任务输入（"明天下午3点开会 #工作 p1"）、项目组织、优先级、标签、过滤器和 Karma 效率追踪系统。跨平台同步确保任务在所有设备上可用。',
    '适合践行 GTD（搞定）方法论的个人和小团队。用项目划分职责领域、用标签标注情境（@家、@办公室）、用优先级做每日分类、用 Karma 激励和养成习惯。',
  ],
  'mermaid.js.org': [
    'Mermaid renders diagrams from text — write Markdown-like syntax to generate flowcharts, sequence diagrams, class diagrams, Gantt charts, and more. It integrates with GitHub, Notion, Obsidian, and most static site generators.',
    'Essential for developers who version-control documentation alongside code. Embed Mermaid diagrams in README files, architecture decision records (ADRs), and API docs so diagrams stay up-to-date with code changes in every commit.',
    'Mermaid 通过文本渲染图表——用类似 Markdown 的语法即可生成流程图、时序图、类图、甘特图等。集成 GitHub、Notion、Obsidian 及大多数静态站点生成器。',
    '将文档与代码一同纳入版本控制的开发者的必备工具。在 README、架构决策记录（ADR）和 API 文档中嵌入 Mermaid 图，使图表随代码变更在每次提交中保持最新。',
  ],

  // ─── SEO & Marketing ───
  'search.google.com': [
    'Google Search Console monitors a site\'s presence in Google Search — showing which queries drive traffic, which pages are indexed, and whether there are mobile usability or Core Web Vitals issues. URL Inspection reveals exactly how Googlebot sees and renders any page.',
    "Non-negotiable for every website owner, SEO specialist, and content marketer. Use it to submit sitemaps, monitor indexing of new content, identify pages with poor click-through rates, and get alerts when Google detects issues on your site.",
    'Google Search Console 监控网站在 Google 搜索中的表现——显示哪些查询带来流量、哪些页面已被索引、是否存在移动端可用性或 Core Web Vitals 问题。URL 检查工具揭示 Googlebot 如何抓取和渲染任意页面。',
    '每个网站所有者、SEO 专家和内容营销人员的必备工具。可用于提交 Sitemap、监控新内容索引情况、识别点击率低下的页面以及接收 Google 检测到的网站问题告警。',
  ],
  'ahrefs.com': [
    'Ahrefs crawls the web with one of the largest link indexes, providing backlink analysis, keyword research, rank tracking, and content gap analysis. The Site Explorer reveals competitors\' top pages, organic keywords, and paid search strategies.',
    'A core tool for SEO professionals, content strategists, and growth marketers. Use it to find link-building opportunities, analyze why competitors outrank you for target keywords, audit your backlink profile for toxic links, and discover untapped content topics.',
    'Ahrefs 拥有业界最大的链接索引之一，提供反向链接分析、关键词研究、排名追踪和内容缺口分析。Site Explorer 揭示竞品的首页、有机关键词和付费搜索策略。',
    'SEO 专家、内容策略师和增长营销人员的核心工具。可用于发现外链建设机会、分析竞品为何在目标关键词上排名更优、审计反向链接中的有害链接以及发现未被覆盖的内容话题。',
  ],
  'pagespeed.web.dev': [
    'PageSpeed Insights analyzes page load performance using Lighthouse lab data and Chrome User Experience Report (CrUX) field data — reporting LCP, INP, CLS, FCP, and TTFB metrics. Recommendations are prioritized by potential impact on real-user experience.',
    'A frontline tool for frontend developers and SEOs optimizing page speed. Run it before and after performance improvements, debug layout shifts causing poor CLS, identify render-blocking resources, and monitor real-user Core Web Vitals over time.',
    'PageSpeed Insights 基于 Lighthouse 实验室数据和 Chrome 用户体验报告（CrUX）现场数据分析页面加载性能——报告 LCP、INP、CLS、FCP 和 TTFB 指标。优化建议按对真实用户体验的潜在影响排序。',
    '前端开发者和 SEO 优化页面速度的第一线工具。在性能改进前后分别测试、排查导致 CLS 不佳的布局偏移、识别渲染阻塞资源，以及长期监控真实用户的 Core Web Vitals。',
  ],
  'screamingfrog.co.uk': [
    'Screaming Frog SEO Spider crawls websites to audit on-page SEO — detecting broken links, duplicate content, missing meta tags, redirect chains, and hreflang errors. It renders JavaScript pages and integrates with Google Analytics and Search Console APIs.',
    'The technical SEO audit tool of choice for agencies and in-house SEO teams. Use it before site migrations, during redesign QA, and for quarterly health checks. The custom extraction feature scrapes any HTML element for bulk analysis.',
    'Screaming Frog SEO Spider 爬取网站审计页面 SEO——检测死链、重复内容、缺失 meta 标签、重定向链和 hreflang 错误。支持 JavaScript 渲染并集成 Google Analytics 和 Search Console API。',
    '代理商和内部 SEO 团队的技术 SEO 审计首选工具。适用于网站迁移前、重设计 QA 期间和季度健康检查。自定义提取功能可抓取任意 HTML 元素进行批量分析。',
  ],
  'answerthepublic.com': [
    'AnswerThePublic listens to autocomplete data from Google and Bing to map every question, comparison, and preposition-based query people ask around a keyword. Results are visualized as a mind map and organized by question type (what, why, how, where, etc.).',
    'A brilliant ideation tool for content marketers, SEO writers, and product teams. Use it to build FAQ sections that answer real questions, discover content angles competitors missed, identify product feature opportunities from user intent, and fuel blog editorial calendars.',
    'AnswerThePublic 监听 Google 和 Bing 的自动补全数据，绘制围绕关键词人们提出的所有问题、对比和介词类查询。结果以思维导图可视化并按问题类型（什么、为什么、如何、哪里等）组织。',
    '内容营销人员、SEO 写手和产品团队的灵感利器。可用于构建回答真实问题的 FAQ 板块、发现竞品遗漏的内容角度、从用户意图中识别产品功能机会以及充实博客选题日历。',
  ],
  'semrush.com': [
    'Semrush provides a unified platform for SEO, paid search, content marketing, social media, and competitive research. Its domain analytics reveal competitors\' traffic sources, ad budgets, and content strategies — all in one dashboard.',
    'The Swiss Army knife for digital marketing teams. Use it to research keyword difficulty, track daily SERP positions, audit on-page SEO, analyze competitor ad copy, and measure brand visibility across channels.',
    'Semrush 提供 SEO、付费搜索、内容营销、社交媒体和竞品研究的统一平台。域名分析一站式展示竞品的流量来源、广告预算和内容策略。',
    '数字营销团队的瑞士军刀。可用于研究关键词难度、追踪每日 SERP 排名、审计页面 SEO、分析竞品广告文案以及衡量跨渠道品牌曝光。',
  ],
  'trends.google.com': [
    'Google Trends visualizes search interest over time and across regions — compare multiple terms, see related queries and rising topics, and filter by category, country, and time range. Data is normalized on a 0-100 scale for comparison.',
    'Valuable for marketers timing seasonal campaigns, journalists identifying trending stories, and product teams validating demand. Use it to compare brand awareness against competitors, spot seasonal patterns for inventory planning, and find regional demand hotspots.',
    'Google Trends 可视化搜索热度随时间与地域的变化——可对比多个关键词、查看相关查询和上升话题，并按类别、国家和时间范围过滤。数据归一化为 0-100 量表便于对比。',
    '对营销人员策划季节性活动、记者识别热门话题以及产品团队验证需求非常有价值。可用于对比品牌知名度与竞品、发现库存规划的季节性模式以及找到区域需求热点。',
  ],
  'moz.com': [
    'Moz pioneered Domain Authority (DA) — a score from 1-100 predicting how well a site will rank in search results. The platform includes Link Explorer, Keyword Explorer, and On-Page Grader, with a vibrant community and well-regarded Whiteboard Friday educational content.',
    'A staple for SEO practitioners who value educational content alongside tools. Use DA to qualify link prospects, Keyword Explorer to prioritize content topics by difficulty and volume, and the MozBar browser extension for on-the-fly page analysis.',
    'Moz 首创了 Domain Authority（DA）指标——1-100 的评分预测网站在搜索结果中的排名潜力。平台包括 Link Explorer、Keyword Explorer 和 On-Page Grader，以及充满活力的社区和备受好评的 Whiteboard Friday 教育内容。',
    '注重工具之外教育内容的 SEO 从业者的常用工具。可用 DA 筛选外链机会、Keyword Explorer 按难度和搜索量优排内容话题、MozBar 浏览器扩展实现即时的页面分析。',
  ],
  'surferseo.com': [
    'Keyword Surfer is a free Chrome extension that overlays search volume, CPC, and keyword suggestions directly onto Google search results — no separate tool required. It also shows word count and keyword density data for ranking pages.',
    'The fastest way to assess keyword potential while browsing Google. Use it during content ideation to validate search demand, during competitor analysis to compare content length, and when writing to ensure keyword coverage without switching tabs.',
    'Keyword Surfer 是一款免费的 Chrome 扩展，直接在 Google 搜索结果上叠加显示搜索量、CPC 和关键词建议——无需打开独立工具。同时展示排名页面的字数和关键词密度数据。',
    '浏览 Google 时最快速评估关键词潜力的方式。可用于内容构思时验证搜索需求、竞品分析时对比内容长度、以及写作时确保关键词覆盖而不必切换标签页。',
  ],
  'schema.org': [
    'Schema.org is the collaborative vocabulary for structured data markup, maintained by Google, Microsoft, Yahoo, and Yandex. It defines types and properties for JSON-LD, Microdata, and RDFa — powering rich results like recipe cards, review stars, event listings, and FAQ accordions.',
    'Essential reference for SEOs and web developers implementing structured data. Use it to look up correct property names for Article, Product, FAQ, Event, and Organization markup, validate JSON-LD snippets before deployment, and stay current with new rich-result types.',
    'Schema.org 是由 Google、Microsoft、Yahoo 和 Yandex 共同维护的结构化数据标记协作词汇标准。定义了 JSON-LD、Microdata 和 RDFa 的类型与属性——驱动食谱卡片、评价星级、活动列表和 FAQ 折叠等富媒体搜索结果。',
    '实现结构化数据的 SEO 和 Web 开发者的必备参考。可用于查询 Article、Product、FAQ、Event、Organization 标记的正确属性名、在部署前验证 JSON-LD 代码片段以及跟进新的富媒体搜索结果类型。',
  ],

  // ─── AI Tools ───
  'claude.ai': [
    'Claude excels at long-form reasoning, code generation, document analysis, and nuanced instruction following. It supports 200K-token context windows, project-based organization, and the ability to process uploaded files including PDFs, spreadsheets, and images.',
    'A versatile assistant for developers debugging complex code, writers drafting and editing long documents, researchers synthesizing information from multiple papers, and teams brainstorming product strategy. The project feature lets you maintain persistent context across sessions.',
    'Claude 擅长长篇推理、代码生成、文档分析和精细指令遵循。支持 200K token 上下文窗口、基于项目的组织方式以及处理上传文件（包括 PDF、电子表格和图片）。',
    '适用于调试复杂代码的开发者、撰写和编辑长文档的作家、综合多篇论文信息的研究者以及头脑风暴产品策略的团队。Project 功能可在多次对话中保持持续的上下文。',
  ],
  'chatgpt.com': [
    'ChatGPT offers access to OpenAI\'s most capable models, with features including code interpreter (Python sandbox), DALL·E image generation, web browsing, custom GPTs, and a mobile app with voice conversations. The plugin and GPT Store ecosystems extend functionality dramatically.',
    'The most widely adopted AI assistant, useful for content drafting, learning new concepts, coding assistance, data analysis, and creative brainstorming. Custom GPTs allow domain-specific workflows without coding — create a tax assistant, lesson planner, or code reviewer.',
    'ChatGPT 提供对 OpenAI 最强模型的访问，功能包括代码解释器（Python 沙箱）、DALL·E 图像生成、网页浏览、自定义 GPT 以及支持语音对话的移动应用。插件和 GPT Store 生态大幅扩展了功能边界。',
    '最广泛采用的 AI 助手，可用于内容起草、学习新概念、编程辅助、数据分析和创意头脑风暴。自定义 GPT 无需编程即可创建领域专属工作流——税务助手、课程规划器或代码审查员。',
  ],
  'huggingface.co': [
    'Hugging Face hosts over 500,000 open-source AI models, datasets, and interactive demos (Spaces) — the GitHub of machine learning. Models cover NLP, computer vision, audio, multimodal, and reinforcement learning tasks with standardized APIs for inference.',
    'The central hub for ML engineers, researchers, and AI practitioners. Use it to discover state-of-the-art models, fine-tune pre-trained checkpoints on custom data, share model demos with stakeholders, and access production inference endpoints.',
    'Hugging Face 托管超过 50 万个开源 AI 模型、数据集和交互式演示（Spaces）——机器学习界的 GitHub。模型覆盖 NLP、计算机视觉、音频、多模态和强化学习任务，提供标准化的推理 API。',
    'ML 工程师、研究者和 AI 从业者的核心枢纽。可用于发现最先进的模型、在自定义数据上微调预训练权重、与利益相关者分享模型演示以及接入生产级推理端点。',
  ],
  'perplexity.ai': [
    'Perplexity combines AI reasoning with real-time web search, providing cited, sourced answers rather than model-generated speculation. Pro users can choose between Claude, GPT-4, and other models as the underlying reasoning engine.',
    'A go-to research tool for knowledge workers who need verifiable answers. Use it to research market trends with current data, verify technical claims with citations, summarize recent news on any topic, and conduct literature reviews with actual paper references.',
    'Perplexity 将 AI 推理与实时网络搜索结合，提供带引用来源的答案而非模型生成的推测。Pro 用户可在 Claude、GPT-4 和其他模型之间选择底层推理引擎。',
    '需要可验证答案的知识工作者的首选研究工具。可用于研究带当前数据的市场趋势、用引用验证技术声明、总结任意话题的最新动态以及进行有真实文献参考的综述。',
  ],
  'midjourney.com': [
    'Midjourney generates images from text prompts with exceptional aesthetic quality — known for its artistic, painterly style and precise control through parameters like aspect ratio, stylization, and chaos. The platform operates through Discord, fostering a vibrant creative community.',
    'A go-to creative tool for designers exploring visual concepts, marketers creating social media assets, game developers prototyping character and environment art, and artists experimenting with AI-assisted workflows. The style reference feature enables consistent brand-aligned visual output.',
    'Midjourney 通过文本提示生成图像，以卓越的美学品质著称——艺术性的绘画风格以及通过宽高比、风格化和混沌度等参数实现的精确控制。平台通过 Discord 运作，培育了活跃的创意社区。',
    '设计师探索视觉概念、营销人员创建社交媒体素材、游戏开发者原型角色和场景美术以及艺术家尝试 AI 辅助工作流的核心创意工具。风格参考功能可实现一致的品牌化视觉输出。',
  ],
  'v0.dev': [
    'v0 generates production-ready React components with Tailwind CSS from natural language descriptions. Each output includes clean, copy-pasteable code that follows modern best practices — accessible markup, responsive design, and dark mode support.',
    'A game-changer for frontend developers and designers prototyping UI rapidly. Describe a dashboard card, pricing table, or signup form in plain English and get working React code in seconds — then iterate with follow-up prompts to refine the design.',
    'v0 通过自然语言描述生成生产就绪的 React 组件和 Tailwind CSS 代码。每个输出都包含干净、可复制粘贴的代码，遵循现代最佳实践——无障碍标记、响应式设计和深色模式支持。',
    '前端开发者和设计师快速原型 UI 的革命性工具。用简单英语描述仪表盘卡片、定价表或注册表单，即可在秒级获得可运行的 React 代码——然后通过后续提示迭代优化设计。',
  ],
  'cursor.com': [
    'Cursor is built on VS Code but adds deep AI integration — chat with your entire codebase, generate features with context-aware prompts, apply inline diffs, and use the "Composer" to create multi-file changes. It indexes your project for truly relevant suggestions.',
    'The AI-powered editor of choice for developers who want more than autocomplete. Use it to onboard to unfamiliar codebases faster, implement features by describing desired behavior, refactor legacy code with AI guidance, and review changes before committing.',
    'Cursor 基于 VS Code 构建但增加了深度的 AI 集成——可与整个代码库对话、用上下文感知的提示生成功能、内联应用差异以及用"Composer"创建多文件更改。索引项目以提供真正相关的建议。',
    '不满足于简单自动补全的开发者的 AI 驱动编辑器首选。可用于更快上手不熟悉的代码库、通过描述期望行为实现功能、在 AI 引导下重构遗留代码以及提交前审查变更。',
  ],
  'github.copilot': [
    'GitHub Copilot offers inline code completions, a chat panel for code questions, and an agent mode that can create files and run terminal commands. It works across VS Code, JetBrains IDEs, and GitHub.com with context from your repository structure.',
    'An essential pair-programming partner for developers writing boilerplate, implementing algorithms, writing tests, and exploring unfamiliar APIs. The chat mode helps explain complex code, suggest refactoring approaches, and generate documentation from existing functions.',
    'GitHub Copilot 提供行内代码补全、代码问答聊天面板以及可创建文件和运行终端命令的 Agent 模式。跨 VS Code、JetBrains IDE 和 GitHub.com 运行，并结合仓库结构提供上下文。',
    '开发者编写样板代码、实现算法、编写测试和探索不熟悉 API 的结对编程伙伴。聊天模式可帮助解释复杂代码、建议重构方案以及从现有函数生成文档。',
  ],
  'bolt.new': [
    'Bolt.new generates complete full-stack web applications from a single prompt — with instant live preview, file explorer, and one-click deployment. It handles project setup, dependency installation, and hosting so you can go from idea to running app in minutes.',
    'Perfect for developers prototyping ideas, founders building MVPs, and designers creating interactive mockups. Use it to validate app concepts without writing boilerplate, generate quick internal tools, and create functional demos for stakeholder feedback.',
    'Bolt.new 通过一个提示即可生成完整的全栈 Web 应用——即时实时预览、文件浏览器和一键部署。处理项目设置、依赖安装和托管，让你在数分钟内从想法到可运行的应用。',
    '适合原型验证想法的开发者、构建 MVP 的创始人和创建交互式原型的设者。可用于无需样板代码即可验证应用概念、快速生成内部工具以及创建用于利益相关者反馈的功能性演示。',
  ],
  'replit.com': [
    'Replit provides a full cloud IDE accessible from any browser — write, run, and deploy code without local setup. It includes AI-powered code completion (Ghostwriter), real-time collaboration, and one-click deployment with built-in hosting.',
    'Ideal for students learning to code, educators teaching programming, and developers who need a quick, disposable environment for experiments. Use it to prototype APIs, collaborate on coding interviews, run Python notebooks, and deploy simple web apps instantly.',
    'Replit 提供可从任何浏览器访问的完整云端 IDE——无需本地设置即可编码、运行和部署。包含 AI 代码补全（Ghostwriter）、实时协作和带内置托管的一键部署。',
    '适合学习编程的学生、教授编程的教育者以及需要快速一次性环境的开发者。可用于原型 API、协作编程面试、运行 Python 笔记本以及即时部署简单的 Web 应用。',
  ],
  'elevenlabs.io': [
    'ElevenLabs produces the most natural-sounding AI text-to-speech voices available, with support for 29+ languages, voice cloning from short samples, and fine-grained control over emotion, pacing, and intonation. The API enables programmatic voice generation at scale.',
    'A breakthrough tool for content creators producing voiceovers, podcasters generating intros, indie game developers adding character dialogue, and accessibility advocates creating audio versions of written content. The voice library features thousands of community-shared custom voices.',
    'ElevenLabs 生成目前最自然的 AI 文字转语音，支持 29+ 语言、短样本声音克隆以及对情感、语调和节奏的精细控制。API 支持规模化编程式语音生成。',
    '内容创作者制作旁白、播客制作者生成片头、独立游戏开发者添加角色对话以及无障碍倡导者创建文字内容音频版的突破性工具。声音库包含数千个社区共享的自定义语音。',
  ],
  'suno.com': [
    'Suno generates complete songs — with vocals, instrumentation, and production — from simple text descriptions. Specify genre, mood, tempo, and lyrical themes to create original music in seconds, no musical training required.',
    'Empowering for content creators needing royalty-free background music, indie developers adding soundtracks to games, and anyone curious about AI-assisted music creation. Use it to generate podcast intro music, video background tracks, and creative inspiration for songwriting.',
    'Suno 通过简单的文字描述即可生成完整歌曲——带人声、配器和制作。指定流派、情绪、节奏和歌词主题，即可在秒级创建原创音乐，无需任何音乐训练。',
    '需要免版税背景音乐的内容创作者、为游戏添加配乐的独立开发者以及对 AI 辅助音乐创作感兴趣的人的赋能力工具。可用于生成播客开场音乐、视频背景曲和歌曲创作灵感。',
  ],
  'gemini.google.com': [
    'Gemini is Google\'s multimodal AI assistant, deeply integrated with Google Workspace — Gmail, Docs, Sheets, and Drive. It can reason across text, images, code, audio, and video, with a 1M-token context window for processing entire codebases or video transcripts.',
    'A natural choice for teams already using Google Workspace. Use it to summarize email threads, generate spreadsheet formulas, extract insights from meeting transcripts, draft documents from bullet points, and analyze data without leaving the tools you already use.',
    'Gemini 是 Google 的多模态 AI 助手，深度集成 Google Workspace——Gmail、Docs、Sheets 和 Drive。可跨文本、图像、代码、音频和视频进行推理，100 万 token 上下文窗口可处理整个代码库或视频字幕。',
    '已在使用 Google Workspace 的团队的自然选择。可用于总结邮件线程、生成电子表格公式、从会议记录中提取洞察、通过要点起草文档以及无需离开已在使用的工具即可分析数据。',
  ],
  'lovable.dev': [
    'Lovable generates complete web applications from natural language prompts — with visual preview, code export, and one-click GitHub sync. It focuses on producing maintainable, production-quality code rather than throwaway prototypes.',
    'Ideal for founders validating startup ideas, designers creating functional prototypes without engineering support, and developers accelerating the early stages of new projects. The GitHub sync enables a smooth transition from AI generation to manual development.',
    'Lovable 通过自然语言提示生成完整的 Web 应用——支持可视化预览、代码导出和一键同步 GitHub。专注于产出可维护的生产级代码而非一次性原型。',
    '适合验证创业点子的创始人、无需工程支持即可创建功能性原型的设计师以及加速新项目早期阶段的开发者。GitHub 同步功能实现从 AI 生成到手动开发的平稳过渡。',
  ],

  // ─── Ecommerce Tools ───
  'shopify.com': [
    'Shopify provides everything needed to launch and scale an online store — customizable themes, integrated payment processing, inventory management, shipping, analytics, and a vast app marketplace for extending functionality. It powers millions of businesses from solo entrepreneurs to global brands.',
    'The default platform for retail entrepreneurs launching direct-to-consumer brands. Use it to set up a store in hours, manage multi-channel sales (online, social, in-person POS), run email marketing campaigns, and access working capital through Shopify Capital.',
    'Shopify 提供启动和扩展在线商店所需的一切——可定制主题、集成支付处理、库存管理、物流、数据分析以及扩展功能的庞大应用市场。驱动数百万企业，从个人创业者到全球品牌。',
    '推出直销品牌的零售创业者的默认平台。可用于数小时内搭建商店、管理多渠道销售（线上、社交、线下 POS）、运营邮件营销活动以及通过 Shopify Capital 获得运营资金。',
  ],
  'stripe.com': [
    'Stripe provides a developer-first payment infrastructure with elegant APIs for accepting payments, managing subscriptions, sending invoices, and preventing fraud. It supports 135+ currencies, localized payment methods, and a test environment that mirrors production.',
    'The payment backbone of the modern internet — used by startups, SaaS companies, and marketplaces. Use Stripe Checkout for drop-in payment pages, Billing for recurring subscriptions, Connect for marketplace payouts, and Radar for machine-learning fraud detection.',
    'Stripe 提供面向开发者的支付基础设施，具有优雅的 API 用于收款、订阅管理、发送发票和防欺诈。支持 135+ 货币、本地化支付方式和镜像生产的测试环境。',
    '现代互联网的支付骨干——被初创公司、SaaS 企业和市场平台广泛采用。Checkout 用于即用型支付页面、Billing 用于周期性订阅、Connect 用于市场分账、Radar 用于机器学习风控。',
  ],
  'toolorbit-etsy-fee': [
    'ToolOrbit\'s Etsy Fee Calculator estimates all selling fees — listing fees, transaction fees, payment processing fees, and offsite ad fees — for any sale price and shipping cost. It provides a clear profit breakdown so sellers know exactly what they\'ll earn before listing.',
    'An essential pricing tool for Etsy sellers planning inventory, running sales, and analyzing profitability. Use it to compare profit margins across different price points, factor shipping costs into pricing strategy, and avoid underpricing that erodes take-home revenue.',
    'ToolOrbit 的 Etsy 费用计算器估算任意售价和运费下的所有销售费用——上架费、交易费、支付处理费和站外广告费。提供清晰的利润拆解，让卖家在上架前就知道实际到手收入。',
    'Etsy 卖家规划库存、开展促销和分析盈利能力的必备定价工具。可用于对比不同价位的利润率、将运费纳入定价策略以及避免定价过低侵蚀实际收入。',
  ],
  'printful.com': [
    'Printful handles print-on-demand fulfillment — when a customer orders from your store, Printful prints and ships the product directly to them. No inventory, no minimum orders, and a catalog of 300+ customizable products from t-shirts to wall art.',
    'An accessible entry point for creators launching merchandise brands and ecommerce entrepreneurs testing product ideas. Use it to create branded apparel, home goods, and accessories without upfront investment, integrate with Shopify/Etsy/WooCommerce, and scale fulfillment as orders grow.',
    'Printful 处理按需打印履约——当客户在你的商店下单时，Printful 直接打印并发货给客户。无需库存、无最小起订量，提供 300+ 可定制产品目录，从 T 恤到挂画。',
    '创作者启动周边品牌和电商创业者测试产品创意的低门槛入口。可用于无需前期投资即可创建品牌服装、家居用品和配饰，集成 Shopify/Etsy/WooCommerce，伴随订单增长扩展履约能力。',
  ],
  'woocommerce.com': [
    'WooCommerce transforms a WordPress site into a full-featured online store — with extensions for subscriptions, bookings, memberships, tax automation, and shipping. Being open-source, it offers complete control over store data and customization.',
    'The go-to ecommerce solution for businesses already on WordPress. Use it to add a store to an existing content site, sell physical and digital products, create membership areas, and customize every aspect of the shopping experience without platform lock-in.',
    'WooCommerce 将 WordPress 网站转化为功能齐全的在线商店——提供订阅、预订、会员、税务自动化和物流扩展。作为开源方案，提供对商店数据和定制化的完全控制。',
    '已在 WordPress 上的企业的电商首选方案。可用于为现有内容网站添加商店、销售实体和数字产品、创建会员专区以及定制购物体验的每个方面而无需受平台锁定。',
  ],
  'junglescout.com': [
    'Jungle Scout provides Amazon sellers with product research, keyword tracking, sales estimates, competitor analysis, and review monitoring. Its product database lets you filter millions of Amazon listings by demand, competition, and profitability to find winning product opportunities.',
    'Indispensable for Amazon FBA and FBM sellers at every stage — from product discovery to launch to scaling. Use it to validate product ideas with real sales data, track keyword rankings, monitor competitor inventory levels, and estimate revenue before investing in inventory.',
    'Jungle Scout 为 Amazon 卖家提供产品调研、关键词追踪、销量预估、竞品分析和评价监控。产品数据库可筛选数百万 Amazon 商品列表，按需求、竞争和盈利能力找到可盈利的产品机会。',
    'Amazon FBA 和 FBM 卖家从选品到启动到规模化各阶段都不可或缺。可用于通过真实销售数据验证产品创意、追踪关键词排名、监控竞品库存以及在大规模备货前预估收入。',
  ],
  'lemonsqueezy.com': [
    'Lemon Squeezy acts as a merchant of record — handling global tax compliance (VAT, GST, sales tax), invoicing, payment processing, and subscription management so creators and SaaS founders can focus on product, not compliance. It supports digital products, subscriptions, and license keys.',
    'A perfect fit for indie hackers, SaaS founders, and digital creators who sell globally. Use it to launch a paid product in hours, let the platform handle EU VAT and US sales tax, automate expiring license keys, and manage customer billing without building a billing system.',
    'Lemon Squeezy 承担商家记录角色——处理全球税务合规（VAT、GST、Sales Tax）、发票、支付处理和订阅管理，让创作者和 SaaS 创始人专注产品而非合规。支持数字产品、订阅和许可证密钥。',
    '适合独立开发者、SaaS 创始人和面向全球销售的数字创作者。可用于数小时内启动付费产品、让平台处理 EU VAT 和 US Sales Tax、自动化过期许可证密钥以及无需自建账单系统即可管理客户结算。',
  ],

  // ─── Learning Resources ───
  'developer.mozilla.org': [
    'MDN Web Docs is the most comprehensive and authoritative reference for web technologies — covering HTML, CSS, JavaScript, SVG, Web APIs, and HTTP. Every page includes browser compatibility data, interactive code examples, and links to relevant standards.',
    "The first resource to consult for any web development question. Use it to look up JavaScript method signatures, understand CSS property interactions, explore new Web APIs, and check whether a feature is supported across target browsers before using it in production.",
    'MDN Web Docs 是 Web 技术最全面、最权威的参考文档——覆盖 HTML、CSS、JavaScript、SVG、Web API 和 HTTP。每页均包含浏览器兼容性数据、交互式代码示例和相关标准链接。',
    '任何 Web 开发问题的第一查询资源。可用于查阅 JavaScript 方法签名、理解 CSS 属性交互、探索新 Web API 以及在生产中采用前检查特性在目标浏览器中的支持情况。',
  ],
  'freecodecamp.org': [
    'freeCodeCamp offers a completely free, self-paced coding curriculum with 10+ certifications covering responsive web design, JavaScript algorithms, frontend libraries, data visualization, APIs, and machine learning — all through hands-on project-based learning.',
    'The best starting point for aspiring developers without a formal CS background. Use it to build a portfolio of real projects while earning certifications, transition from another career into tech, and join a supportive global community of learners and mentors.',
    'freeCodeCamp 提供完全免费、自定进度的编程课程，包含 10+ 认证方向，涵盖响应式 Web 设计、JavaScript 算法、前端库、数据可视化、API 和机器学习——全部通过实战项目式学习完成。',
    '没有正式 CS 背景的准开发者的最佳起点。可在获得认证的同时积累真实项目作品集、从其他职业转向科技行业，以及加入互助的全球学习者和导师社区。',
  ],
  'css-tricks.com': [
    'CSS-Tricks has been the definitive CSS blog for over a decade — publishing in-depth guides, an exhaustive almanac of CSS properties and selectors, and practical articles on modern layout, animation, and responsive design patterns.',
    'A trusted resource for frontend developers at every level. Use it to master CSS Grid and Flexbox, understand complex topics like stacking contexts and containing blocks, learn modern techniques like container queries and cascade layers, and find creative solutions to common layout challenges.',
    'CSS-Tricks 是十多年来最具权威的 CSS 博客——发布深入指南、详尽的 CSS 属性与选择器速查手册以及关于现代布局、动画和响应式设计模式的实用文章。',
    '各级前端开发者信赖的资源。可用于掌握 CSS Grid 和 Flexbox、理解层叠上下文和包含块等复杂概念、学习容器查询和级联层等现代技术以及寻找常见布局挑战的创意解决方案。',
  ],
  'theodinproject.com': [
    'The Odin Project provides a free, open-source full-stack curriculum that emphasizes project-based learning — building real applications from scratch. Students choose between a Ruby on Rails path and a JavaScript/Node.js path, both covering HTML, CSS, Git, and databases.',
    'Ideal for self-directed learners who want a structured path to becoming full-stack developers. Use it to build a portfolio of deployed applications, learn Git and command-line fundamentals hands-on, and join an active Discord community for peer support and code reviews.',
    'The Odin Project 提供免费、开源的全栈课程，强调通过构建真实应用进行项目式学习。学生可在 Ruby on Rails 和 JavaScript/Node.js 两条路径间选择，均覆盖 HTML、CSS、Git 和数据库。',
    '适合想要结构化路径成为全栈开发者的自学者。可用于构建可部署的应用作品集、通过实操学习 Git 和命令行基础以及加入活跃的 Discord 社区寻求同伴支持和代码审查。',
  ],
  'smashingmagazine.com': [
    'Smashing Magazine publishes high-quality articles, books, and conferences on web design and development — covering UX strategy, frontend performance, accessibility, design systems, and CSS architecture. Their articles are editor-reviewed for technical accuracy and depth.',
    'A professional development resource for experienced designers and developers. Use it to stay current with evolving web standards, learn accessibility patterns for inclusive design, understand performance optimization techniques, and explore design system governance models.',
    'Smashing Magazine 发布关于 Web 设计与开发的高质量文章、书籍和会议——覆盖 UX 策略、前端性能、无障碍、设计系统和 CSS 架构。文章经过编辑审核以保证技术准确性和深度。',
    '资深设计师和开发者的专业发展资源。可用于跟踪不断演进的 Web 标准、学习包容性设计的无障碍模式、理解性能优化技术以及探索设计系统的治理模型。',
  ],
  'roadmap.sh': [
    'Roadmap.sh provides community-curated, visual learning paths for every developer role — frontend, backend, DevOps, AI engineer, full-stack, and more. Each roadmap breaks down skills into a step-by-step progression with links to relevant learning resources.',
    'An orientation tool for developers planning their learning journey or career pivot. Use it to identify skill gaps, plan what to learn next, prepare for role transitions, and share a common learning plan with mentees or team members.',
    'Roadmap.sh 提供社区策划的可视化学习路线——前端、后端、DevOps、AI 工程师、全栈等。每条路线将技能分解为循序渐进的步骤并附上相关学习资源链接。',
    '规划学习旅程或职业转型的开发者的导航工具。可用于识别技能短板、规划下一步学习内容、准备角色过渡以及与学员或团队成员分享共同的学习计划。',
  ],
  'frontendmentor.io': [
    'Frontend Mentor provides real-world coding challenges with professional Figma design files — build landing pages, multi-page sites, and interactive components from pixel-perfect mockups. Solutions can be submitted for community feedback.',
    'Ideal for frontend learners bridging the gap between tutorials and professional work. Use it to practice translating designs to code, build a portfolio of polished projects, receive code reviews from other developers, and gain confidence with responsive layout, forms, and accessibility.',
    'Frontend Mentor 提供真实世界的编码挑战，配套专业 Figma 设计稿——从像素级原型构建落地页、多页面站点和交互式组件。方案可提交获取社区反馈。',
    '适合弥合教程与专业工作之间差距的前端学习者。可用于练习设计稿转代码、构建精美的项目作品集、获得其他开发者的代码审查以及增强响应式布局、表单和无障碍方面的信心。',
  ],
  'leetcode.com': [
    'LeetCode hosts 3,000+ algorithmic problems with an online judge that evaluates solution correctness and efficiency. Problems are tagged by data structure, algorithm, and company — with contests, discussion forums, and company-specific question lists for interview preparation.',
    'The standard preparation platform for software engineering interviews, especially at large tech companies. Use it to practice data structures and algorithms, prepare for specific company interview loops, participate in weekly contests, and strengthen problem-solving skills.',
    'LeetCode 包含 3000+ 算法题目，在线判题系统评估解答的正确性和效率。题目按数据结构、算法和公司标签分类——配有竞赛、讨论论坛和针对不同公司的面试题库。',
    '软件工程师面试的标准准备平台，尤其针对大型科技公司。可用于练习数据结构和算法、针对特定公司面试流程准备、参加每周竞赛以及强化问题解决能力。',
  ],
  'javascript.info': [
    'JavaScript.info is widely regarded as the most thorough, well-structured JavaScript tutorial — progressing from language fundamentals through browser APIs, DOM manipulation, events, networking, and advanced concepts like closures, prototypes, and async programming.',
    'The ideal resource for developers who want to deeply understand JavaScript rather than just use it. Work through chapters sequentially for a complete education, or use it as a reference for specific topics like Promises, modules, or the event loop.',
    'JavaScript.info 被广泛认为是最全面、结构最清晰的 JavaScript 教程——从语言基础到浏览器 API、DOM 操作、事件、网络请求以及闭包、原型和异步编程等高级概念。',
    '想要深入理解而非仅仅使用 JavaScript 的开发者的理想资源。可顺序学习各章节以获取完整教育，或作为 Promises、模块、事件循环等特定主题的参考资料。',
  ],
  'dev.to': [
    'Dev.to is an inclusive developer community and blogging platform — thousands of new articles daily on web development, DevOps, AI, open source, and career growth. The platform is known for its supportive culture, clean reading experience, and Markdown-based editor.',
    'A valuable platform for developers who want to learn from peers, share knowledge, and build a professional brand. Use it to stay current with industry trends, write tutorials that help others, participate in community discussions, and discover new tools and techniques.',
    'Dev.to 是一个包容的开发者社区与博客平台——每日数千篇关于 Web 开发、DevOps、AI、开源和职业成长的新文章。以支持性的社区文化、干净的阅读体验和基于 Markdown 的编辑器著称。',
    '想要向同行学习、分享知识和建立专业品牌的开发者的宝贵平台。可用于跟踪行业动态、撰写帮助他人的教程、参与社区讨论以及发现新工具和新技术。',
  ],
  'exercism.org': [
    'Exercism offers free coding exercises across 70+ language tracks with opt-in human mentor feedback on submitted solutions. Each exercise comes with automated tests and a community discussion where you can compare approaches after solving.',
    'Excellent for deliberate practice — choose a track, solve exercises at your own pace, submit for mentor review, and study other solutions to learn idiomatic patterns. The mentoring feedback loop accelerates skill development beyond what self-study alone can achieve.',
    'Exercism 提供 70+ 语言赛道的免费编程练习，可选择接受人工导师对提交方案的反馈。每个练习都配有自动化测试和社区讨论，解答后可对比不同解法。',
    '刻意练习的绝佳平台——选择语言赛道、按自己节奏解题、提交导师评审、学习他人方案以掌握惯用法模式。导师反馈闭环可加速技能发展，超越单纯自学的效果。',
  ],

  // ─── Open Source ───
  'react.dev': [
    'React is a component-based UI library developed by Meta. Its declarative model, virtual DOM diffing, and one-way data flow have defined modern frontend architecture. The ecosystem includes React Router, Redux, React Query, and thousands of component libraries.',
    'The dominant UI library for web development — essential for frontend developers building interactive user interfaces. Use it to create reusable component hierarchies, manage UI state predictably, and leverage a massive ecosystem of tools, libraries, and community knowledge.',
    'React 是 Meta 开发的基于组件的 UI 库。其声明式模型、虚拟 DOM Diff 和单向数据流定义了现代前端架构。生态包括 React Router、Redux、React Query 和数千个组件库。',
    'Web 开发的主流 UI 库——构建交互式用户界面的前端开发者必备。可用于创建可复用的组件层次结构、可预测地管理 UI 状态以及利用庞大的工具、库和社区知识生态。',
  ],
  'nextjs.org': [
    'Next.js extends React with server-side rendering, static site generation, file-based routing, API routes, and image optimization — all with zero configuration. App Router brings React Server Components, streaming, and nested layouts to the framework.',
    'The go-to React framework for building production web applications. Use it to optimize SEO with SSR, generate static marketing pages, create API endpoints alongside your frontend, and deploy with one-click on Vercel or any Node.js server.',
    'Next.js 以服务端渲染、静态站点生成、文件路由、API 路由和图片优化扩展 React——全部零配置。App Router 为框架带来 React Server Components、流式渲染和嵌套布局。',
    '构建生产级 Web 应用的 React 框架首选。可用于通过 SSR 优化 SEO、生成静态营销页面、在前端旁创建 API 端点以及在 Vercel 或任何 Node.js 服务器上一键部署。',
  ],
  'tailwindcss.com': [
    'Tailwind CSS is a utility-first CSS framework — compose designs directly in HTML with classes like "flex items-center gap-4". It generates only the CSS you use, ships responsive variants out of the box, and integrates seamlessly with component frameworks.',
    'Transformative for frontend developers who want to build custom designs fast without context-switching between HTML and CSS files. Use it to prototype layouts quickly, enforce design consistency with a configurable theme, and produce minimal production CSS bundles.',
    'Tailwind CSS 是 Utility-first CSS 框架——直接通过 "flex items-center gap-4" 等类名在 HTML 中构建设计。仅生成实际使用的 CSS、内置响应式变体且与组件框架无缝集成。',
    '对想要快速构建自定义设计而无需在 HTML 和 CSS 文件之间切换的前端开发者来说具有革命性。可用于快速原型布局、通过可配置主题强制执行设计一致性以及产出极小的生产 CSS 包。',
  ],
  'ui.shadcn.com': [
    'shadcn/ui distributes beautifully designed, accessible React components as copy-pasteable source code rather than a dependency. Built on Radix UI primitives and Tailwind CSS, each component is fully customizable and owned by your project.',
    'The modern standard for React component libraries. Use it to kickstart projects with production-ready components, maintain full control over implementation details, customize every aspect to match your design system, and benefit from a vibrant community contributing new components.',
    'shadcn/ui 将精美设计、无障碍的 React 组件以可复制粘贴的源代码形式分发，而非依赖包。基于 Radix UI 原语和 Tailwind CSS 构建，每个组件完全可定制且归项目所有。',
    'React 组件库的现代标准。可用于用生产就绪组件快速启动项目、完全掌控实现细节、定制每个方面以匹配设计系统以及受益于活跃社区不断贡献新组件。',
  ],
  'supabase.com': [
    'Supabase provides an open-source Firebase alternative — Postgres database with real-time subscriptions, authentication, row-level security, file storage, and edge functions. The hosted platform includes a generous free tier with no usage limits that surprise you at scale.',
    'A perfect backend for indie hackers and startups who want SQL power with real-time capabilities. Use it to build apps with instant data sync, implement social login in minutes, store and serve user-generated content, and query data from the browser without building an API.',
    'Supabase 提供开源的 Firebase 替代方案——Postgres 数据库、实时订阅、认证、行级安全、文件存储和边缘函数。托管平台提供慷慨的免费额度，无规模扩展时的意外用量限制。',
    '想要 SQL 能力加实时特性的独立开发者和初创团队的完美后端。可用于构建即时数据同步的应用、数分钟实现社交登录、存储和提供用户生成内容以及无需构建 API 即可从浏览器查询数据。',
  ],
  'vuejs.org': [
    'Vue.js combines reactive data binding, a template-based syntax, and a flexible Composition API — offering an approachable learning curve without sacrificing power. Its ecosystem includes Pinia for state management, Vue Router for navigation, and Vite for build tooling.',
    'A popular choice for teams that prefer HTML-like templates, Chinese-speaking developer communities, and projects where gradual adoption is important. Use it to build SPAs, progressively enhance multi-page sites, and create component libraries with a gentle learning curve.',
    'Vue.js 结合响应式数据绑定、模板化语法和灵活的 Composition API——提供平缓的学习曲线同时不失强大能力。生态包括 Pinia 状态管理、Vue Router 导航和 Vite 构建工具。',
    '偏好类 HTML 模板的团队、中文开发者社区以及渐进式采用重要的项目的热门选择。可用于构建 SPA、渐进增强多页面站点以及创建学习门槛友好的组件库。',
  ],
  'trpc.io': [
    'tRPC enables end-to-end typesafe APIs without code generation — define a router on the server, import its type on the client, and get full autocompletion and compile-time error checking for every API call. It bridges the type gap between frontend and backend in TypeScript projects.',
    'A game-changer for full-stack TypeScript developers tired of manually syncing API types. Use it to eliminate the need for REST/GraphQL schemas in internal apps, get instant feedback when an API changes, and build faster with full confidence in type safety.',
    'tRPC 实现端到端类型安全的 API 而无需代码生成——在服务端定义路由、在客户端导入其类型，每个 API 调用都获得完整的自动补全和编译时错误检查。弥合 TypeScript 项目前后端之间的类型鸿沟。',
    '厌倦手动同步 API 类型的全栈 TypeScript 开发者的革命性工具。可用于消除内部应用对 REST/GraphQL Schema 的需求、在 API 变更时获得即时反馈以及以完全的类型安全信心更快地构建。',
  ],
  'astro.build': [
    'Astro ships zero JavaScript to the browser by default — rendering pages to static HTML at build time and hydrating only the interactive islands that need it. It supports components from React, Vue, Svelte, and Solid within the same project.',
    'The ideal framework for content-rich websites where performance and SEO matter — blogs, documentation, marketing sites, and ecommerce. Use it to build lightning-fast static sites while still using your preferred component framework for interactive features.',
    'Astro 默认向浏览器输出零 JavaScript——构建时渲染为静态 HTML，仅为需要的交互孤岛进行水合。支持在同一项目中使用 React、Vue、Svelte 和 Solid 组件。',
    '重视性能和 SEO 的内容型网站的理想框架——博客、文档站、营销网站和电商。可用于构建极速静态站点同时仍使用你喜欢的组件框架实现交互功能。',
  ],
  'svelte.dev': [
    'Svelte shifts work from the browser to the compiler — producing highly optimized vanilla JavaScript that updates the DOM directly without a virtual DOM. The SvelteKit framework adds routing, SSR, and deployment adapters for a complete web development experience.',
    'A compelling choice for performance-sensitive applications and developers who value minimal boilerplate. Use it to build fast interactive UIs, create embeddable widgets with tiny bundle sizes, and ship applications with excellent runtime performance by default.',
    'Svelte 将工作从浏览器转移到编译器——生成高度优化的原生 JavaScript，无需虚拟 DOM 直接更新真实 DOM。SvelteKit 框架添加路由、SSR 和部署适配器，形成完整的 Web 开发体验。',
    '对性能敏感的应用和重视最小化样板代码的开发者的理想选择。可用于构建快速的交互 UI、创建体积极小的可嵌入组件以及默认获得优秀的运行时性能。',
  ],
  'zod.dev': [
    'Zod lets you define TypeScript types and runtime validation schemas in one declaration — parsing data at API boundaries and automatically inferring static types from the schema. It supports complex validation, transformation, and error messages with full TypeScript integration.',
    'Essential for TypeScript projects that handle external data — API responses, form inputs, environment variables, and file parsing. Use it to validate at runtime what TypeScript guarantees at compile time, eliminating the gap between types and reality.',
    'Zod 让你在一次声明中同时定义 TypeScript 类型和运行时校验 Schema——在 API 边界解析数据并自动从 Schema 推断静态类型。支持复杂校验、转换和错误消息，与 TypeScript 完全集成。',
    '处理外部数据的 TypeScript 项目必备——API 响应、表单输入、环境变量和文件解析。可用于在运行时验证 TypeScript 在编译时的保证，消除类型与现实之间的鸿沟。',
  ],
  'zustand.pmnd.rs': [
    'Zustand is a tiny, fast, scalable state management library for React — no providers, no boilerplate, no action types. Create a store with a single function call and access state from any component with a hook, all with excellent TypeScript support.',
    'The modern alternative to Redux for developers who want simple state management without ceremony. Use it for global app state, component-level stores, transient UI state, and any scenario where prop drilling becomes painful. The tiny bundle size (under 1KB) makes it guilt-free.',
    'Zustand 是一个小巧、快速、可扩展的 React 状态管理库——无 Provider、无模板代码、无 Action 类型。通过单个函数调用创建 Store，通过 Hook 在任何组件中访问状态，TypeScript 支持出色。',
    '想要简单状态管理而无仪式感的开发者的 Redux 现代化替代方案。可用于全局应用状态、组件级 Store、瞬时 UI 状态以及任何 prop 传递变得痛苦的场景。不到 1KB 的体积使其毫无负担。',
  ],
  'remix.run': [
    'Remix is a full-stack React framework built on web fundamentals — server-side data loading with loaders, form mutations with actions, nested routing, and progressive enhancement. Now part of Shopify, it focuses on performance and resilience.',
    'A strong framework for developers who value web standards and want fine-grained control over the request/response cycle. Use it to build fast, resilient web apps with excellent SEO, optimistic UI with automatic error recovery, and form-based workflows that work without JavaScript.',
    'Remix 是基于 Web 基础的全栈 React 框架——通过 Loader 实现服务端数据加载、通过 Action 处理表单变更、嵌套路由和渐进增强。现已并入 Shopify，聚焦于性能和可靠性。',
    '重视 Web 标准并想要精细控制请求/响应周期的开发者的强力框架。可用于构建快速、有弹性的 Web 应用——卓越的 SEO、自动错误恢复的乐观 UI 以及在无 JavaScript 时仍可工作的基于表单的工作流。',
  ],
  'nuxt.com': [
    'Nuxt is the Vue.js meta-framework — providing hybrid rendering, auto-imports, file-based routing, and a rich module ecosystem. Nuxt 4 brings unified server/universal rendering, improved TypeScript support, and a new devtools experience.',
    'The natural choice for Vue developers building production applications. Use it to create SSR-powered marketing sites, SPAs with code-splitting out of the box, Jamstack sites with static generation, and full-stack apps with the Nitro server engine.',
    'Nuxt 是 Vue.js 的元框架——提供混合渲染、自动导入、文件路由和丰富的模块生态。Nuxt 4 带来了统一的服务端/通用渲染、改进的 TypeScript 支持和全新的 DevTools 体验。',
    'Vue 开发者构建生产应用的天然选择。可用于创建 SSR 驱动的营销网站、内置代码分割的 SPA、静态生成的 Jamstack 站点以及基于 Nitro 服务端引擎的全栈应用。',
  ],
  'nestjs.com': [
    'NestJS brings Angular-inspired architecture — modules, decorators, dependency injection, guards, interceptors, and pipes — to server-side Node.js development. It wraps Express or Fastify with a structured, opinionated framework built for enterprise applications.',
    'The go-to Node.js framework for teams building large-scale, maintainable backend services. Use it to create well-structured REST and GraphQL APIs, implement microservice architectures with built-in transport layers, and enforce consistent patterns across a team of developers.',
    'NestJS 将 Angular 风格的架构——模块、装饰器、依赖注入、守卫、拦截器和管道——引入服务端 Node.js 开发。以结构化、有主张的框架封装 Express 或 Fastify，专为企业级应用打造。',
    '构建大规模、可维护后端服务的团队的 Node.js 框架首选。可用于创建结构良好的 REST 和 GraphQL API、通过内置传输层实现微服务架构以及在开发团队中强制执行一致的模式。',
  ],
  'hono.dev': [
    'Hono is an ultrafast, lightweight web framework designed for edge runtimes — Cloudflare Workers, Deno, Bun, and Node.js. Its simple, familiar API and built-in middleware (JWT, CORS, validation) make it productive for small to medium-sized services.',
    'Ideal for developers building edge-native APIs, middleware, and serverless functions. Use it to create fast API gateways, webhook handlers, file upload endpoints, and authentication middlewares that run close to users with minimal cold-start latency.',
    'Hono 是一款为边缘运行时设计的极速轻量 Web 框架——支持 Cloudflare Workers、Deno、Bun 和 Node.js。简洁熟悉的 API 和内置中间件（JWT、CORS、校验）使其对中小型服务生产力极高。',
    '适合构建边缘原生 API、中间件和 Serverless 函数的开发者。可用于创建快速的 API 网关、Webhook 处理器、文件上传端点和认证中间件，以最小冷启动延迟在靠近用户处运行。',
  ],
  'solidjs.com': [
    'Solid.js offers React-like developer experience (JSX, hooks, components) with fine-grained reactivity and no virtual DOM — components compile to direct DOM update functions. This results in exceptional runtime performance without sacrificing developer ergonomics.',
    'A compelling choice for performance-critical applications where every millisecond matters. Use it to build data dashboards, interactive visualizations, and real-time applications that need to handle frequent updates without jank or excessive memory usage.',
    'Solid.js 提供类 React 的开发体验（JSX、Hook、组件），同时具备细粒度响应式且无虚拟 DOM——组件编译为直接的 DOM 更新函数。在卓越运行时性能的同时不牺牲开发体验。',
    '对性能关键应用的理想选择。可用于构建数据仪表盘、交互式可视化和需要处理频繁更新而无卡顿或过度内存消耗的实时应用。',
  ],
  'vitest.dev': [
    'Vitest is powered by Vite — providing instant hot module replacement for tests, Jest-compatible API, native ESM and TypeScript support, and built-in code coverage. Tests run in parallel by default with smart file-change detection for fast re-runs.',
    'The modern test framework for Vite-based projects and beyond. Use it to write unit, integration, and component tests with instant feedback, run tests as part of CI pipelines with deterministic output, and migrate from Jest with minimal configuration changes.',
    'Vitest 基于 Vite 驱动——提供测试的即时热模块替换、兼容 Jest 的 API、原生 ESM 和 TypeScript 支持以及内置代码覆盖率。测试默认并行运行，智能检测文件变更以实现快速重跑。',
    '基于 Vite 的项目及其他场景的现代测试框架。可用于编写有即时反馈的单元、集成和组件测试，在 CI 流水线中以确定性输出运行测试，以及以最小配置变更从 Jest 迁移。',
  ],
  'payloadcms.com': [
    'Payload CMS is an open-source headless CMS and application framework built on Next.js — offering a code-first configuration approach, TypeScript-native APIs, and a powerful React admin panel. It handles authentication, file uploads, database management, and content versioning out of the box.',
    'A modern alternative to WordPress for developers who want CMS capabilities without PHP. Use it to build content-driven websites, SaaS applications that need admin panels, ecommerce product catalogs, and any project where a database-backed admin interface is required.',
    'Payload CMS 是基于 Next.js 的开源无头 CMS 和应用框架——提供代码优先的配置方式、TypeScript 原生 API 和强大的 React 管理后台。开箱即用地处理认证、文件上传、数据库管理和内容版本控制。',
    '对想要 CMS 能力但不需要 PHP 的开发者的 WordPress 现代化替代方案。可用于构建内容驱动的网站、需要管理后台的 SaaS 应用、电商产品目录以及任何需要数据库支撑的管理界面的项目。',
  ],
  'tabler.io': [
    'Tabler Icons provides over 5,000 clean, consistent, customizable SVG icons — available as React, Vue, Svelte, and Figma components plus raw SVG. Each icon is designed on a 24×24 grid with a 2px stroke, ensuring visual harmony across every icon in a set.',
    'A comprehensive icon solution for projects that need more variety than smaller icon sets. Use it to build feature-rich dashboards, create icon-heavy admin panels, design mobile app navigation, and maintain visual consistency across a large product.',
    'Tabler Icons 提供超过 5000 个干净、一致、可定制的 SVG 图标——支持 React、Vue、Svelte、Figma 组件和原始 SVG。每个图标基于 24×24 网格和 2px 描边设计，确保整套图标的视觉和谐。',
    '需要比小型图标集更多种类的项目的全面图标解决方案。可用于构建功能丰富的仪表盘、创建图标密集的管理面板、设计移动应用导航以及在大规模产品中保持视觉一致性。',
  ],
  'tanstack.com': [
    'TanStack Query provides powerful async state management — caching, background refetching, pagination, optimistic updates, and offline support — with a consistent API across React, Vue, Solid, and Svelte. It eliminates the need for manual server state management and reduces API calls.',
    'Indispensable for frontend developers building data-driven applications. Use it to fetch, cache, and synchronize server state with minimal code, implement infinite scrolling with built-in pagination, and handle loading and error states declaratively.',
    'TanStack Query 提供强大的异步状态管理——缓存、后台刷新、分页、乐观更新和离线支持——跨 React、Vue、Solid 和 Svelte 提供一致的 API。消除了手动管理服务端状态的需求并减少 API 调用。',
    '构建数据驱动应用的前端开发者不可或缺。可用于用最少代码获取、缓存和同步服务端状态、通过内置分页实现无限滚动以及以声明方式处理加载和错误状态。',
  ],
};

// Process the file — for each tool, find its slug and insert extra paragraphs
for (const [slug, paras] of Object.entries(EXTRA)) {
  const [en2, en3, zh2, zh3] = paras;

  // Add en paragraphs to description array (between first element and closing bracket)
  // Pattern: description: [\n      '...',\n    ],
  // We need to insert the extra paras before the closing ],
  const descRegex = new RegExp(
    `(slug: '${slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'[\\s\\S]*?description: \\[\\n      '[\\s\\S]*?',)(\\n    \\],)`,
    'g',
  );
  c = c.replace(descRegex, `$1\n      '${en2.replace(/'/g, "\\'")}',\n      '${en3.replace(/'/g, "\\'")}',\n    ],`);

  // Add zh paragraphs
  const descZhRegex = new RegExp(
    `(slug: '${slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'[\\s\\S]*?descriptionZh: \\[\\n      '[\\s\\S]*?',)(\\n    \\],)`,
    'g',
  );
  c = c.replace(descZhRegex, `$1\n      '${zh2.replace(/'/g, "\\'")}',\n      '${zh3.replace(/'/g, "\\'")}',\n    ],`);
}

writeFileSync(file, c);
console.log(`Expanded ${Object.keys(EXTRA).length} tool descriptions`);
console.log('Done — all descriptions now have 3 paragraphs each');
