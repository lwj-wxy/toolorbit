export type FeaturedCategoryId =
  | 'developer-tools'
  | 'design-resources'
  | 'productivity'
  | 'seo-marketing'
  | 'ai-tools'
  | 'ecommerce-tools'
  | 'learning-resources'
  | 'open-source';

export type FeaturedTool = {
  slug: string;
  title: string;
  titleZh: string;
  description: string[];
  descriptionZh: string[];
  url: string;
  category: FeaturedCategoryId;
  tags?: string[];
};

export type FeaturedCategory = {
  id: FeaturedCategoryId;
  name: string;
  nameZh: string;
  icon: string;
};

export const FEATURED_CATEGORIES: FeaturedCategory[] = [
  { id: 'developer-tools', name: 'Developer Tools', nameZh: '开发工具', icon: '🛠️' },
  { id: 'design-resources', name: 'Design Resources', nameZh: '设计资源', icon: '🎨' },
  { id: 'productivity', name: 'Productivity', nameZh: '效率工具', icon: '⚡' },
  { id: 'seo-marketing', name: 'SEO & Marketing', nameZh: 'SEO / 营销', icon: '📊' },
  { id: 'ai-tools', name: 'AI Tools', nameZh: 'AI 工具', icon: '🤖' },
  { id: 'ecommerce-tools', name: 'Ecommerce Tools', nameZh: '电商工具', icon: '🛒' },
  { id: 'learning-resources', name: 'Learning Resources', nameZh: '学习资源', icon: '📚' },
  { id: 'open-source', name: 'Open Source', nameZh: '开源项目', icon: '🌟' },
];

export const FEATURED_TOOLS: FeaturedTool[] = [
  // ─── Developer Tools ──────────────────────────────
  {
    title: 'VS Code',
    titleZh: 'VS Code',
    description: [
      'Microsoft\'s free, open-source code editor with a vast extension ecosystem, integrated terminal, and first-class Git support.',
      'VS Code supports IntelliSense, built-in debugging, Git commands, and thousands of community extensions for every language and framework. Its Remote Development pack allows seamless work inside containers, WSL, and over SSH.',
      'Ideal for developers at every level — from students writing their first HTML file to senior engineers managing large monorepos. The integrated terminal, task runner, and split editor make it a complete development environment.',
    ],
    descriptionZh: [
      '微软出品的免费开源代码编辑器，拥有庞大的插件生态、内置终端和一流的 Git 支持，是前端和后端开发者的首选编辑器。',
      'VS Code 内置智能感知、调试器、Git 命令和数千个社区扩展，覆盖所有主流语言和框架。Remote Development 套件支持在容器、WSL 和远程 SSH 环境中无缝开发。',
      '适合所有水平的开发者——从编写第一个 HTML 文件的学生到管理大型 monorepo 的资深工程师。集成终端、任务运行器和分屏编辑器使其成为完整的开发环境。',
    ],
    slug: 'code.visualstudio.com',

    url: 'https://code.visualstudio.com/',
    category: 'developer-tools',
    tags: ['editor', 'IDE', 'Microsoft'],
  },
  {
    title: 'GitHub',
    titleZh: 'GitHub',
    description: [
      'The world\'s largest code hosting platform with version control, CI/CD via Actions, project management, and collaborative code review.',
      'GitHub Actions enables automated CI/CD pipelines triggered by push, PR, or schedule — with thousands of reusable workflow templates. GitHub Copilot, Codespaces, and advanced code search round out a comprehensive development platform.',
      'Essential for solo developers and teams alike. Use it for version control, open-source collaboration, portfolio hosting via GitHub Pages, issue tracking, and automated deployment. The free tier is generous enough for most projects.',
    ],
    descriptionZh: [
      '全球最大的代码托管平台，提供 Git 版本控制、Actions CI/CD 流水线、项目管理与协作代码审查，是开源社区的核心枢纽。',
      'GitHub Actions 支持通过 push、PR 或定时触发自动化的 CI/CD 流水线，提供数千个可复用的工作流模板。Copilot、Codespaces 和高级代码搜索让 GitHub 成为全方位的开发平台。',
      '独立开发者和团队都不可或缺。可用于版本控制、开源协作、GitHub Pages 作品集托管、Issue 追踪和自动化部署。免费额度对大多数项目足够慷慨。',
    ],
    slug: 'github.com',

    url: 'https://github.com/',
    category: 'developer-tools',
    tags: ['git', 'CI/CD', 'collaboration'],
  },
  {
    title: 'Postman',
    titleZh: 'Postman',
    description: [
      'API development platform for designing, testing, documenting, and mocking REST, GraphQL, and gRPC APIs.',
      'GitHub Actions enables automated CI/CD pipelines triggered by push, PR, or schedule — with thousands of reusable workflow templates. GitHub Copilot, Codespaces, and advanced code search round out a comprehensive development platform.',
      'Essential for solo developers and teams alike. Use it for version control, open-source collaboration, portfolio hosting via GitHub Pages, issue tracking, and automated deployment. The free tier is generous enough for most projects.',
    ],
    descriptionZh: [
      'API 开发与测试平台，支持 REST、GraphQL 和 gRPC 接口的设计、调试、文档生成与 mock 服务，是后端联调利器。',
      'GitHub Actions 支持通过 push、PR 或定时触发自动化的 CI/CD 流水线，提供数千个可复用的工作流模板。Copilot、Codespaces 和高级代码搜索让 GitHub 成为全方位的开发平台。',
      '独立开发者和团队都不可或缺。可用于版本控制、开源协作、GitHub Pages 作品集托管、Issue 追踪和自动化部署。免费额度对大多数项目足够慷慨。',
    ],
    slug: 'postman.com',

    url: 'https://www.postman.com/',
    category: 'developer-tools',
    tags: ['API', 'testing', 'REST'],
  },
  {
    title: 'Vercel',
    titleZh: 'Vercel',
    description: [
      'Frontend deployment platform with instant preview URLs, serverless functions, edge computing, and analytics — purpose-built for Next.js.',
      'Postman offers environment variables, pre-request scripts, test automation with Chai assertions, and collection runners for CI integration. The mock server feature lets frontend teams develop against stable API contracts before the backend is ready.',
      'A must-have for backend developers, API designers, and QA engineers. Use it to explore third-party APIs, document internal services, run regression tests, and generate client SDKs from OpenAPI specs.',
    ],
    descriptionZh: [
      '前端部署平台，提供即时预览 URL、Serverless 函数、边缘计算和分析面板，与 Next.js 深度集成，适合快速上线和迭代。',
      'Postman 提供环境变量、前置脚本、基于 Chai 断言的测试自动化和 CI 集成的集合运行器。Mock 服务器功能让前端团队在后端就绪前即可基于稳定的 API 契约并行开发。',
      '后端开发者、API 设计者和 QA 工程师的必备工具。可用于探索第三方 API、文档化内部服务、运行回归测试、以及从 OpenAPI 规范生成客户端 SDK。',
    ],
    slug: 'vercel.com',

    url: 'https://vercel.com/',
    category: 'developer-tools',
    tags: ['deployment', 'Next.js', 'serverless'],
  },
  {
    title: 'Docker',
    titleZh: 'Docker',
    description: [
      'Container platform for packaging applications with their dependencies into reproducible environments that run consistently across machines.',
      'Vercel provides automatic HTTPS, global CDN, instant cache invalidation, and serverless/edge functions with zero-config deployments. Every git branch gets a unique preview URL for team review before merging.',
      'Perfect for frontend developers deploying React, Next.js, Vue, Svelte, or static sites. The generous free tier and seamless GitHub integration make it the go-to choice for shipping side projects, marketing pages, and SaaS frontends.',
    ],
    descriptionZh: [
      '容器化平台，将应用及其依赖打包为可复现的镜像，确保开发、测试和生产环境一致，是现代 DevOps 的基础设施。',
      'Vercel 提供自动 HTTPS、全球 CDN、即时缓存失效和零配置部署的 Serverless/Edge 函数。每个 Git 分支自动生成独立预览 URL，方便团队在合并前评审。',
      '前端开发者的理想部署平台，支持 React、Next.js、Vue、Svelte 和静态站点。慷慨的免费额度和无缝 GitHub 集成使其成为交付副项目、营销页和 SaaS 前端的首选。',
    ],
    slug: 'docker.com',

    url: 'https://www.docker.com/',
    category: 'developer-tools',
    tags: ['container', 'DevOps', 'orchestration'],
  },
  {
    title: 'CodePen',
    titleZh: 'CodePen',
    description: [
      'Online code playground for HTML, CSS, and JavaScript with live preview and community sharing — ideal for prototyping and debugging frontend ideas.',
      'Docker Compose orchestrates multi-container applications with a single YAML file, while Docker Hub provides a registry of millions of pre-built images. Layer caching dramatically speeds up iterative builds.',
      'Essential for DevOps engineers, backend developers, and anyone who needs reproducible environments. Use it to run databases locally, create CI/CD runners, ship microservices, and ensure production parity.',
    ],
    descriptionZh: [
      '在线前端代码沙盒，支持 HTML、CSS、JavaScript 实时预览和社区分享，适合快速原型验证和片段调试。',
      'Docker Compose 通过单个 YAML 文件编排多容器应用，Docker Hub 提供数百万预构建镜像的注册中心。层缓存机制大幅加速迭代构建。',
      'DevOps 工程师、后端开发者和任何需要可复现环境的角色都必不可少。可用于本地运行数据库、创建 CI/CD 运行器、部署微服务及确保生产环境一致性。',
    ],
    slug: 'codepen.io',

    url: 'https://codepen.io/',
    category: 'developer-tools',
    tags: ['playground', 'frontend', 'CSS'],
  },
  {
    title: 'Stack Overflow',
    titleZh: 'Stack Overflow',
    description: [
      'The largest programming Q&A community where developers ask, answer, and vote on technical questions across every technology stack.',
      'CodePen offers live preview, preprocessor support (SCSS, TypeScript, Babel), and embeddable pens for documentation. The community challenges and "Picked Pens" curation surface creative frontend work daily.',
      'Great for frontend developers prototyping animations, CSS layouts, and UI components. Also widely used for sharing reproducible bug reports, teaching web concepts, and embedding interactive examples in blog posts.',
    ],
    descriptionZh: [
      '全球最大的编程问答社区，覆盖所有技术栈。遇到棘手 bug 时的第一站，大部分开发者的隐形导师。',
      'CodePen 支持实时预览、预处理器（SCSS、TypeScript、Babel）和可嵌入的代码片段。社区挑战和精选 Pens 每日展示创意前端作品。',
      '前端开发者原型验证动画、CSS 布局和 UI 组件的利器。广泛用于分享可复现的 Bug 报告、教学 Web 概念和在博客中嵌入交互式示例。',
    ],
    slug: 'stackoverflow.com',

    url: 'https://stackoverflow.com/',
    category: 'developer-tools',
    tags: ['Q&A', 'community', 'debugging'],
  },
  {
    title: 'Railway',
    titleZh: 'Railway',
    description: [
      'Modern deployment platform with one-click database provisioning (Postgres, Redis, MySQL), instant deploys from GitHub, and usage-based pricing.',
      'Stack Overflow\'s reputation system, tag-based organization, and rigorous moderation ensure high-quality answers. The "Collectives" feature connects organizations with their developer communities, and Stack Overflow for Teams provides private Q&A.',
      'Every developer\'s lifeline when debugging. Beyond troubleshooting, it is valuable for discovering best practices, comparing technology trade-offs, and learning how experienced engineers approach real-world problems.',
    ],
    descriptionZh: [
      '现代部署平台，一键创建 Postgres、Redis、MySQL 等数据库，从 GitHub 即时部署，按用量计费，适合独立开发者和初创团队。',
      'Stack Overflow 的声望系统、标签组织和严格审核确保高质量的答案。Collectives 功能连接组织与其开发者社区，Teams 版提供私有问答空间。',
      '每个开发者调试时的生命线。除排查问题外，还可用于发现最佳实践、对比技术方案的利弊，以及学习资深工程师处理真实问题的方式。',
    ],
    slug: 'railway.app',

    url: 'https://railway.app/',
    category: 'developer-tools',
    tags: ['deployment', 'database', 'cloud'],
  },

  // ─── Design Resources ──────────────────────────────
  {
    title: 'Figma',
    titleZh: 'Figma',
    description: [
      'Collaborative browser-based UI/UX design tool with vector editing, prototyping, component libraries, and Dev Mode for handoff.',
      'Railway offers instant GitHub deploys, one-click database provisioning, environment variable management, and usage-based billing with a generous free starter credit. The CLI and API enable full infrastructure-as-code workflows.',
      'Tailored for solo developers and small startups who want Heroku-like simplicity with more flexibility. Great for hosting side projects, running cron jobs, spinning up staging environments, and prototyping MVPs quickly.',
    ],
    descriptionZh: [
      '基于浏览器的协作式 UI/UX 设计工具，支持矢量编辑、交互原型、组件库和 Dev Mode 开发交付，已成为行业标准设计平台。',
      'Railway 提供即时 GitHub 部署、一键创建数据库、环境变量管理和基于用量的计费，附带慷慨的免费启动额度。CLI 和 API 支持完整的基础设施即代码工作流。',
      '适合追求 Heroku 式简洁但需要更多灵活性的独立开发者和初创团队。适用于托管副项目、运行定时任务、搭建预发布环境和快速验证 MVP。',
    ],
    slug: 'figma.com',

    url: 'https://www.figma.com/',
    category: 'design-resources',
    tags: ['UI', 'UX', 'prototyping'],
  },
  {
    title: 'Dribbble',
    titleZh: 'Dribbble',
    description: [
      'Design portfolio and inspiration platform where UI/UX designers, illustrators, and brand designers showcase work and discover trends.',
      'Figma\'s cloud-first architecture enables real-time multiplayer editing, seamless handoff with Dev Mode, and an extensive plugin ecosystem for accessibility checking, content generation, and asset export. Component variants and auto-layout dramatically speed up design iteration.',
      'The industry standard for UI/UX designers, product managers, and frontend developers collaborating on digital products. Use it to create wireframes, design systems, interactive prototypes, and developer-ready specs — all within a single tool.',
    ],
    descriptionZh: [
      '设计作品展示与灵感平台，UI/UX 设计师、插画师和品牌设计师在此发布作品、发现趋势和寻找创意参考。',
      'Figma 的云端优先架构支持实时多人编辑、Dev Mode 无缝交付，以及丰富的插件生态（无障碍检查、内容生成、资源导出）。组件变体和自动布局大幅加速设计迭代。',
      'UI/UX 设计师、产品经理和前端开发者协作数字产品的行业标准。可用于创建线框图、设计系统、交互原型和开发者就绪的规格说明——全部在一个工具内完成。',
    ],
    slug: 'dribbble.com',

    url: 'https://dribbble.com/',
    category: 'design-resources',
    tags: ['inspiration', 'portfolio', 'UI'],
  },
  {
    title: 'Coolors',
    titleZh: 'Coolors',
    description: [
      'Fast color palette generator with lock, shade, and export features. Generate harmonious palettes with a spacebar tap.',
      'Dribbble curates high-quality design work from top creatives worldwide. Designers can build portfolios, get feedback, find freelance opportunities, and follow trending visual styles. The job board connects companies with design talent.',
      'A vital source of visual inspiration for designers, creative directors, and product teams. Browse to discover UI patterns, illustration styles, branding concepts, and motion design trends before starting a new project.',
    ],
    descriptionZh: [
      '快速配色方案生成器，按空格键即可生成协调的调色板，支持锁定颜色、调整色阶和导出，是设计配色效率神器。',
      'Dribbble 精选全球顶尖创意人的高质量设计作品。设计师可建立作品集、获得反馈、寻找自由职业机会并追踪视觉风格趋势。职位板块连接公司与设计人才。',
      '设计师、创意总监和产品团队的视觉灵感宝库。在新项目启动前浏览 UI 模式、插画风格、品牌概念和动效设计趋势。',
    ],
    slug: 'coolors.co',

    url: 'https://coolors.co/',
    category: 'design-resources',
    tags: ['color', 'palette', 'generator'],
  },
  {
    title: 'Unsplash',
    titleZh: 'Unsplash',
    description: [
      'Free high-resolution stock photography library with millions of curated images under a permissive license — no attribution required.',
      'Coolors generates harmonious color palettes with a tap of the spacebar. Lock colors you like, adjust shades, check contrast ratios for accessibility, and export as CSS, SCSS, SVG, PDF, or image — all instantly.',
      'A go-to tool for UI designers, frontend developers, and brand designers who need quick, cohesive color schemes. Use the contrast checker to ensure WCAG compliance, export palettes directly into design tools, and build a library of project color sets.',
    ],
    descriptionZh: [
      '免费高清图库，数百万张精选摄影作品可自由使用（无需署名），适合网站配图、社交媒体素材和产品原型填充。',
      'Coolors 通过按空格键即可生成和谐的配色方案。可锁定喜欢的颜色、调整色阶、检查无障碍对比度，并导出为 CSS、SCSS、SVG、PDF 或图片——全部即时完成。',
      'UI 设计师、前端开发者和品牌设计师获取快速协调配色的首选工具。使用对比度检查器确保 WCAG 合规、直接导出到设计工具、建立项目配色库。',
    ],
    slug: 'unsplash.com',

    url: 'https://unsplash.com/',
    category: 'design-resources',
    tags: ['photos', 'stock', 'free'],
  },
  {
    title: 'Google Fonts',
    titleZh: 'Google Fonts',
    description: [
      'Free, open-source web font library with 1,500+ typeface families, variable font support, and CSS/HTML embed snippets.',
      'Unsplash hosts millions of professional, high-resolution photographs contributed by a global community of photographers — all free to use under a permissive license with no attribution required. Collections and AI-powered search help surface the right image quickly.',
      'Ideal for developers building website mockups, designers creating social media graphics, content creators illustrating blog posts, and product teams needing placeholder imagery. The API enables programmatic image access for applications.',
    ],
    descriptionZh: [
      '免费开源的 Web 字体库，提供 1500+ 字体家族，支持可变字体和 CSS 嵌入代码，是 Web 排版的首选资源。',
      'Unsplash 托管数百万张由全球摄影师社区贡献的专业高清照片——均可在宽松许可下自由使用，无需署名。收藏集和 AI 搜索帮助快速找到合适的图片。',
      '适合开发者构建网站原型、设计师创建社交媒体图形、内容创作者为博客配图以及产品团队需要占位图。API 支持在应用中编程式获取图片。',
    ],
    slug: 'fonts.google.com',

    url: 'https://fonts.google.com/',
    category: 'design-resources',
    tags: ['fonts', 'typography', 'web'],
  },
  {
    title: 'Excalidraw',
    titleZh: 'Excalidraw',
    description: [
      'Open-source virtual whiteboard with hand-drawn style for sketching diagrams, wireframes, and flowcharts collaboratively.',
      'Google Fonts offers 1,500+ open-source typeface families with variable font support, subset optimization for performance, and easy CSS/HTML embed snippets. Fonts are served from Google\'s global CDN with automatic format negotiation for modern browsers.',
      'The go-to web font resource for frontend developers and designers. Use it to select readable body text, distinctive headings, and monospace code fonts. Variable fonts reduce the number of HTTP requests while enabling fine-grained typographic control.',
    ],
    descriptionZh: [
      '开源虚拟白板，手绘风格独特，适合画流程图、线框图和架构图，支持多人协作，是技术文档配图的优雅方案。',
      'Google Fonts 提供 1500+ 开源字体家族，支持可变字体、性能优化的子集以及简洁的 CSS/HTML 嵌入代码。字体从 Google 全球 CDN 分发，自动为现代浏览器协商最佳格式。',
      '前端开发者和设计师的 Web 字体首选资源。可用于选择可读性强的正文、有特色的标题和等宽代码字体。可变字体在减少 HTTP 请求的同时实现精细的排版控制。',
    ],
    slug: 'excalidraw.com',

    url: 'https://excalidraw.com/',
    category: 'design-resources',
    tags: ['whiteboard', 'diagram', 'open-source'],
  },

  // ─── Productivity ──────────────────────────────────
  {
    title: 'Notion',
    titleZh: 'Notion',
    description: [
      'All-in-one workspace for notes, docs, databases, wikis, and project management with powerful block-based editing and team collaboration.',
      'Excalidraw produces hand-drawn style diagrams, wireframes, and flowcharts with real-time collaboration. Its infinite canvas, shape library, and export-as-PNG/SVG features make it a lightweight alternative to heavy diagramming tools.',
      'Great for engineers sketching architecture diagrams, product managers mapping user flows, and educators creating visual explanations. The hand-drawn aesthetic reduces the pressure of perfection and encourages iterative thinking.',
    ],
    descriptionZh: [
      '一体化工作空间，融合笔记、文档、数据库、Wiki 和项目管理，以块编辑器著称，适合个人知识管理和团队协作。',
      'Excalidraw 以手绘风格生成图表、线框图和流程图，支持实时协作。无限画布、图形库和导出 PNG/SVG 功能使其成为重型绘图工具的轻量替代。',
      '适合工程师绘制架构图、产品经理梳理用户流程以及教育者制作可视化讲解。手绘美学降低了追求完美的压力，鼓励迭代式思考。',
    ],
    slug: 'notion.so',

    url: 'https://www.notion.so/',
    category: 'productivity',
    tags: ['notes', 'wiki', 'collaboration'],
  },
  {
    title: 'Obsidian',
    titleZh: 'Obsidian',
    description: [
      'Local-first knowledge base built on plain Markdown files with bidirectional linking, graph view, and a rich plugin ecosystem.',
      'Notion combines notes, docs, databases, wikis, and project management into a single, flexible workspace. Its block-based editor lets you mix text, tables, kanban boards, calendars, and embeds freely — all within a drag-and-drop interface.',
      'Perfect for individuals managing personal knowledge bases, startups documenting internal processes, and teams running lightweight project management. The template gallery provides quick-start setups for meeting notes, product roadmaps, habit trackers, and more.',
    ],
    descriptionZh: [
      '基于本地 Markdown 文件的知识库工具，支持双向链接、图谱视图和丰富的插件生态，适合打造个人第二大脑。',
      'Notion 融合笔记、文档、数据库、Wiki 和项目管理于一个灵活的工作空间。块编辑器让你自由混合文本、表格、看板、日历和嵌入内容——所有操作都可拖拽完成。',
      '适合管理个人知识库的个人、文档化内部流程的初创公司以及运行轻量项目管理的团队。模板库提供会议记录、产品路线图、习惯追踪等的快速入门设置。',
    ],
    slug: 'obsidian.md',

    url: 'https://obsidian.md/',
    category: 'productivity',
    tags: ['notes', 'markdown', 'knowledge-base'],
  },
  {
    title: 'Linear',
    titleZh: 'Linear',
    description: [
      'Fast issue tracking and project management tool purpose-built for software teams, with keyboard-first workflows and sleek design.',
      'Obsidian stores notes as local plain Markdown files, giving you full ownership of your data. Bidirectional links, the graph view, and a powerful plugin ecosystem turn your notes into an interconnected knowledge network — a true "second brain."',
      'Ideal for researchers, writers, and developers who want a durable, portable knowledge base. Use it to build interconnected study notes, document technical concepts with code snippets, and create Zettelkasten-style idea networks.',
    ],
    descriptionZh: [
      '为软件团队打造的极速项目管理与 issue 追踪工具，键盘优先的操作逻辑和极简设计，让 Sprint 管理不再笨重。',
      'Obsidian 将笔记存储为本地纯 Markdown 文件，让你完全掌控自己的数据。双向链接、图谱视图和强大的插件生态将你的笔记转化为互联的知识网络——真正的"第二大脑"。',
      '适合需要持久、可移植知识库的研究者、写作者和开发者。可用于构建互联的学习笔记、用代码片段记录技术概念以及创建 Zettelkasten 式的想法网络。',
    ],
    slug: 'linear.app',

    url: 'https://linear.app/',
    category: 'productivity',
    tags: ['project-management', 'issue-tracking', 'agile'],
  },
  {
    title: 'Raycast',
    titleZh: 'Raycast',
    description: [
      'Blazing-fast macOS launcher and productivity toolkit with extensions for clipboard history, window management, snippets, and API integrations.',
      'Linear is built for speed — every interaction is keyboard-navigable, views update in real time, and the UI stays clean even with thousands of issues. Cycles, roadmaps, and project updates keep teams aligned without the bloat of traditional project management tools.',
      'Purpose-built for software teams that value focus and speed. Use it to run sprint planning, track bugs, manage feature backlogs, and communicate project status. The GitHub/GitLab integration auto-closes issues from PRs.',
    ],
    descriptionZh: [
      '极致流畅的 macOS 启动器与效率工具箱，集成剪贴板历史、窗口管理、代码片段和 API 扩展，大幅减少日常操作耗时。',
      'Linear 为速度而生——每个交互均可键盘操作、视图实时更新、即使在数千个 Issue 下 UI 仍保持干净。Cycles、路线图和项目更新让团队保持一致，没有传统项目管理工具的臃肿感。',
      '专为注重专注和速度的软件团队打造。可用于运行 Sprint 规划、追踪 Bug、管理功能需求池和沟通项目状态。GitHub/GitLab 集成可在 PR 中自动关闭对应 Issue。',
    ],
    slug: 'raycast.com',

    url: 'https://www.raycast.com/',
    category: 'productivity',
    tags: ['launcher', 'macOS', 'extensions'],
  },
  {
    title: 'draw.io',
    titleZh: 'draw.io',
    description: [
      'Free online diagramming tool for flowcharts, UML, network diagrams, and org charts. Works fully offline and integrates with cloud storage.',
      'Raycast replaces Spotlight with a programmable launcher. Beyond launching apps, it offers clipboard history, window management, quick links, snippets, floating notes, and a store of community extensions that integrate with GitHub, Jira, Slack, and more.',
      'Transformative for macOS-using developers and power users. Use it to compose Jira tickets with a shortcut, search GitHub repos without opening a browser, manage window layouts, convert units, format JSON — all without leaving the keyboard.',
    ],
    descriptionZh: [
      '免费在线绘图工具，支持流程图、UML、网络拓扑和组织架构图，可完全离线使用并集成云存储，是技术绘图瑞士军刀。',
      'Raycast 以可编程启动器替代 Spotlight。除启动应用外，还提供剪贴板历史、窗口管理、快速链接、代码片段、浮动笔记以及集成 GitHub、Jira、Slack 等工具的社区扩展商店。',
      'macOS 开发者和高级用户的效率革命。可通过快捷键创建 Jira 工单、无需浏览器搜索 GitHub 仓库、管理窗口布局、换算单位、格式化 JSON——全部无需离开键盘。',
    ],
    slug: 'diagrams.net',

    url: 'https://app.diagrams.net/',
    category: 'productivity',
    tags: ['diagrams', 'flowchart', 'UML'],
  },

  // ─── SEO & Marketing ───────────────────────────────
  {
    title: 'Google Search Console',
    titleZh: 'Google Search Console',
    description: [
      'Free Google tool for monitoring site indexation, search performance, Core Web Vitals, and manual actions — essential for every website owner.',
      'draw.io provides professional diagramming without sign-up or cloud lock-in. It supports flowcharts, UML diagrams, network topologies, org charts, and BPMN — with full offline capability and integration with Google Drive, OneDrive, and GitHub.',
      'The go-to diagramming tool for engineers, architects, and technical writers. Use it to document system architectures, map database schemas, sketch API flows, and create presentation-ready diagrams for design reviews and RFCs.',
    ],
    descriptionZh: [
      'Google 官方免费工具，监控网站索引状态、搜索表现、Core Web Vitals 和人工处理措施，是每个网站运营者的必备工具。',
      'draw.io 提供无需注册、无云锁定的专业绘图体验。支持流程图、UML 图、网络拓扑图、组织架构图和 BPMN——完全支持离线使用并集成 Google Drive、OneDrive 和 GitHub。',
      '工程师、架构师和技术写作者的首选绘图工具。可用于记录系统架构、绘制数据库 Schema、草拟 API 流程以及为设计评审和 RFC 创建可用于演示的图表。',
    ],
    slug: 'search.google.com',

    url: 'https://search.google.com/search-console',
    category: 'seo-marketing',
    tags: ['Google', 'indexation', 'performance'],
  },
  {
    title: 'Ahrefs',
    titleZh: 'Ahrefs',
    description: [
      'Comprehensive SEO platform with backlink analysis, keyword research, rank tracking, and content gap tools — widely used by SEO professionals.',
      'Google Search Console monitors a site\'s presence in Google Search — showing which queries drive traffic, which pages are indexed, and whether there are mobile usability or Core Web Vitals issues. URL Inspection reveals exactly how Googlebot sees and renders any page.',
      'Non-negotiable for every website owner, SEO specialist, and content marketer. Use it to submit sitemaps, monitor indexing of new content, identify pages with poor click-through rates, and get alerts when Google detects issues on your site.',
    ],
    descriptionZh: [
      '综合性 SEO 平台，提供反向链接分析、关键词研究、排名追踪和内容缺口分析等全套工具，是 SEO 从业者的行业标配。',
      'Google Search Console 监控网站在 Google 搜索中的表现——显示哪些查询带来流量、哪些页面已被索引、是否存在移动端可用性或 Core Web Vitals 问题。URL 检查工具揭示 Googlebot 如何抓取和渲染任意页面。',
      '每个网站所有者、SEO 专家和内容营销人员的必备工具。可用于提交 Sitemap、监控新内容索引情况、识别点击率低下的页面以及接收 Google 检测到的网站问题告警。',
    ],
    slug: 'ahrefs.com',

    url: 'https://ahrefs.com/',
    category: 'seo-marketing',
    tags: ['backlinks', 'keywords', 'rank-tracking'],
  },
  {
    title: 'PageSpeed Insights',
    titleZh: 'PageSpeed Insights',
    description: [
      'Google tool for measuring page load performance and Core Web Vitals (LCP, INP, CLS) with both lab data and real-user field data from CrUX.',
      'Ahrefs crawls the web with one of the largest link indexes, providing backlink analysis, keyword research, rank tracking, and content gap analysis. The Site Explorer reveals competitors\' top pages, organic keywords, and paid search strategies.',
      'A core tool for SEO professionals, content strategists, and growth marketers. Use it to find link-building opportunities, analyze why competitors outrank you for target keywords, audit your backlink profile for toxic links, and discover untapped content topics.',
    ],
    descriptionZh: [
      'Google 页面性能分析工具，基于 CrUX 真实用户数据评估 LCP、INP、CLS 等 Core Web Vitals 指标，并给出优化建议。',
      'Ahrefs 拥有业界最大的链接索引之一，提供反向链接分析、关键词研究、排名追踪和内容缺口分析。Site Explorer 揭示竞品的首页、有机关键词和付费搜索策略。',
      'SEO 专家、内容策略师和增长营销人员的核心工具。可用于发现外链建设机会、分析竞品为何在目标关键词上排名更优、审计反向链接中的有害链接以及发现未被覆盖的内容话题。',
    ],
    slug: 'pagespeed.web.dev',

    url: 'https://pagespeed.web.dev/',
    category: 'seo-marketing',
    tags: ['performance', 'CWV', 'Google'],
  },
  {
    title: 'Screaming Frog',
    titleZh: 'Screaming Frog',
    description: [
      'Desktop SEO crawler that audits on-page elements, redirects, broken links, duplicate content, and hreflang — ideal for technical SEO audits.',
      'PageSpeed Insights analyzes page load performance using Lighthouse lab data and Chrome User Experience Report (CrUX) field data — reporting LCP, INP, CLS, FCP, and TTFB metrics. Recommendations are prioritized by potential impact on real-user experience.',
      'A frontline tool for frontend developers and SEOs optimizing page speed. Run it before and after performance improvements, debug layout shifts causing poor CLS, identify render-blocking resources, and monitor real-user Core Web Vitals over time.',
    ],
    descriptionZh: [
      '桌面端 SEO 爬虫工具，审计页面元素、重定向、死链、重复内容和 hreflang 标签，是技术 SEO 审计的行业利器。',
      'PageSpeed Insights 基于 Lighthouse 实验室数据和 Chrome 用户体验报告（CrUX）现场数据分析页面加载性能——报告 LCP、INP、CLS、FCP 和 TTFB 指标。优化建议按对真实用户体验的潜在影响排序。',
      '前端开发者和 SEO 优化页面速度的第一线工具。在性能改进前后分别测试、排查导致 CLS 不佳的布局偏移、识别渲染阻塞资源，以及长期监控真实用户的 Core Web Vitals。',
    ],
    slug: 'screamingfrog.co.uk',

    url: 'https://www.screamingfrog.co.uk/seo-spider/',
    category: 'seo-marketing',
    tags: ['crawler', 'technical-SEO', 'audit'],
  },
  {
    title: 'AnswerThePublic',
    titleZh: 'AnswerThePublic',
    description: [
      'Search-listening tool that visualizes real questions people ask around a keyword — perfect for content ideation and FAQ research.',
      'Screaming Frog SEO Spider crawls websites to audit on-page SEO — detecting broken links, duplicate content, missing meta tags, redirect chains, and hreflang errors. It renders JavaScript pages and integrates with Google Analytics and Search Console APIs.',
      'The technical SEO audit tool of choice for agencies and in-house SEO teams. Use it before site migrations, during redesign QA, and for quarterly health checks. The custom extraction feature scrapes any HTML element for bulk analysis.',
    ],
    descriptionZh: [
      '搜索倾听工具，将用户围绕关键词提出的真实问题可视化为思维导图，是内容选题和 FAQ 调研的灵感引擎。',
      'Screaming Frog SEO Spider 爬取网站审计页面 SEO——检测死链、重复内容、缺失 meta 标签、重定向链和 hreflang 错误。支持 JavaScript 渲染并集成 Google Analytics 和 Search Console API。',
      '代理商和内部 SEO 团队的技术 SEO 审计首选工具。适用于网站迁移前、重设计 QA 期间和季度健康检查。自定义提取功能可抓取任意 HTML 元素进行批量分析。',
    ],
    slug: 'answerthepublic.com',

    url: 'https://answerthepublic.com/',
    category: 'seo-marketing',
    tags: ['content', 'keyword-research', 'questions'],
  },

  // ─── AI Tools ──────────────────────────────────────
  {
    title: 'Claude',
    titleZh: 'Claude',
    description: [
      'Anthropic\'s AI assistant with long-context reasoning, code generation, and document analysis — available via claude.ai and API.',
      'AnswerThePublic listens to autocomplete data from Google and Bing to map every question, comparison, and preposition-based query people ask around a keyword. Results are visualized as a mind map and organized by question type (what, why, how, where, etc.).',
      'A brilliant ideation tool for content marketers, SEO writers, and product teams. Use it to build FAQ sections that answer real questions, discover content angles competitors missed, identify product feature opportunities from user intent, and fuel blog editorial calendars.',
    ],
    descriptionZh: [
      'Anthropic 出品的 AI 助手，擅长长文本推理、代码生成和文档分析，可通过 claude.ai 网页版和 API 使用。',
      'AnswerThePublic 监听 Google 和 Bing 的自动补全数据，绘制围绕关键词人们提出的所有问题、对比和介词类查询。结果以思维导图可视化并按问题类型（什么、为什么、如何、哪里等）组织。',
      '内容营销人员、SEO 写手和产品团队的灵感利器。可用于构建回答真实问题的 FAQ 板块、发现竞品遗漏的内容角度、从用户意图中识别产品功能机会以及充实博客选题日历。',
    ],
    slug: 'claude.ai',

    url: 'https://claude.ai/',
    category: 'ai-tools',
    tags: ['LLM', 'chat', 'coding'],
  },
  {
    title: 'ChatGPT',
    titleZh: 'ChatGPT',
    description: [
      'OpenAI\'s conversational AI platform with GPT-4, DALL·E image generation, code interpreter, custom GPTs, and an expanding plugin ecosystem.',
      'Claude excels at long-form reasoning, code generation, document analysis, and nuanced instruction following. It supports 200K-token context windows, project-based organization, and the ability to process uploaded files including PDFs, spreadsheets, and images.',
      'A versatile assistant for developers debugging complex code, writers drafting and editing long documents, researchers synthesizing information from multiple papers, and teams brainstorming product strategy. The project feature lets you maintain persistent context across sessions.',
    ],
    descriptionZh: [
      'OpenAI 的对话式 AI 平台，集成了 GPT-4 推理、DALL·E 图像生成、代码解释器和自定义 GPTs，是最广泛使用的 AI 助手。',
      'Claude 擅长长篇推理、代码生成、文档分析和精细指令遵循。支持 200K token 上下文窗口、基于项目的组织方式以及处理上传文件（包括 PDF、电子表格和图片）。',
      '适用于调试复杂代码的开发者、撰写和编辑长文档的作家、综合多篇论文信息的研究者以及头脑风暴产品策略的团队。Project 功能可在多次对话中保持持续的上下文。',
    ],
    slug: 'chatgpt.com',

    url: 'https://chatgpt.com/',
    category: 'ai-tools',
    tags: ['LLM', 'chat', 'generation'],
  },
  {
    title: 'Hugging Face',
    titleZh: 'Hugging Face',
    description: [
      'Open-source AI community and model hub hosting 500K+ models, datasets, and interactive demos (Spaces) for NLP, vision, and audio tasks.',
      'ChatGPT offers access to OpenAI\'s most capable models, with features including code interpreter (Python sandbox), DALL·E image generation, web browsing, custom GPTs, and a mobile app with voice conversations. The plugin and GPT Store ecosystems extend functionality dramatically.',
      'The most widely adopted AI assistant, useful for content drafting, learning new concepts, coding assistance, data analysis, and creative brainstorming. Custom GPTs allow domain-specific workflows without coding — create a tax assistant, lesson planner, or code reviewer.',
    ],
    descriptionZh: [
      '开源 AI 社区和模型中心，托管 50 万+模型、数据集和在线演示（Spaces），覆盖 NLP、CV 和音频等全领域。',
      'ChatGPT 提供对 OpenAI 最强模型的访问，功能包括代码解释器（Python 沙箱）、DALL·E 图像生成、网页浏览、自定义 GPT 以及支持语音对话的移动应用。插件和 GPT Store 生态大幅扩展了功能边界。',
      '最广泛采用的 AI 助手，可用于内容起草、学习新概念、编程辅助、数据分析和创意头脑风暴。自定义 GPT 无需编程即可创建领域专属工作流——税务助手、课程规划器或代码审查员。',
    ],
    slug: 'huggingface.co',

    url: 'https://huggingface.co/',
    category: 'ai-tools',
    tags: ['models', 'open-source', 'ML'],
  },
  {
    title: 'Perplexity',
    titleZh: 'Perplexity',
    description: [
      'AI-powered search engine that synthesizes answers from real-time web sources with inline citations — a research-first alternative to chat-based AI.',
      'Hugging Face hosts over 500,000 open-source AI models, datasets, and interactive demos (Spaces) — the GitHub of machine learning. Models cover NLP, computer vision, audio, multimodal, and reinforcement learning tasks with standardized APIs for inference.',
      'The central hub for ML engineers, researchers, and AI practitioners. Use it to discover state-of-the-art models, fine-tune pre-trained checkpoints on custom data, share model demos with stakeholders, and access production inference endpoints.',
    ],
    descriptionZh: [
      'AI 搜索引擎，从实时网络来源综合答案并附上行内引用，是研究型搜索场景下传统聊天 AI 的有力替代方案。',
      'Hugging Face 托管超过 50 万个开源 AI 模型、数据集和交互式演示（Spaces）——机器学习界的 GitHub。模型覆盖 NLP、计算机视觉、音频、多模态和强化学习任务，提供标准化的推理 API。',
      'ML 工程师、研究者和 AI 从业者的核心枢纽。可用于发现最先进的模型、在自定义数据上微调预训练权重、与利益相关者分享模型演示以及接入生产级推理端点。',
    ],
    slug: 'perplexity.ai',

    url: 'https://www.perplexity.ai/',
    category: 'ai-tools',
    tags: ['search', 'research', 'citations'],
  },
  {
    title: 'Midjourney',
    titleZh: 'Midjourney',
    description: [
      'AI image generation platform accessible via Discord, known for high aesthetic quality, artistic control, and style-reference features.',
      'Perplexity combines AI reasoning with real-time web search, providing cited, sourced answers rather than model-generated speculation. Pro users can choose between Claude, GPT-4, and other models as the underlying reasoning engine.',
      'A go-to research tool for knowledge workers who need verifiable answers. Use it to research market trends with current data, verify technical claims with citations, summarize recent news on any topic, and conduct literature reviews with actual paper references.',
    ],
    descriptionZh: [
      '通过 Discord 使用的 AI 图像生成平台，以高美学品质、艺术风格控制和风格参考功能著称，是设计师和创意者的利器。',
      'Perplexity 将 AI 推理与实时网络搜索结合，提供带引用来源的答案而非模型生成的推测。Pro 用户可在 Claude、GPT-4 和其他模型之间选择底层推理引擎。',
      '需要可验证答案的知识工作者的首选研究工具。可用于研究带当前数据的市场趋势、用引用验证技术声明、总结任意话题的最新动态以及进行有真实文献参考的综述。',
    ],
    slug: 'midjourney.com',

    url: 'https://www.midjourney.com/',
    category: 'ai-tools',
    tags: ['image-generation', 'art', 'creative'],
  },
  {
    title: 'v0 by Vercel',
    titleZh: 'Vercel v0',
    description: [
      'Generative UI tool that turns natural-language prompts into production-ready React/Tailwind components — ideal for rapid UI prototyping.',
      'Midjourney generates images from text prompts with exceptional aesthetic quality — known for its artistic, painterly style and precise control through parameters like aspect ratio, stylization, and chaos. The platform operates through Discord, fostering a vibrant creative community.',
      'A go-to creative tool for designers exploring visual concepts, marketers creating social media assets, game developers prototyping character and environment art, and artists experimenting with AI-assisted workflows. The style reference feature enables consistent brand-aligned visual output.',
    ],
    descriptionZh: [
      '生成式 UI 工具，用自然语言描述即可生成生产级 React/Tailwind 组件代码，适合快速界面原型和前端开发加速。',
      'Midjourney 通过文本提示生成图像，以卓越的美学品质著称——艺术性的绘画风格以及通过宽高比、风格化和混沌度等参数实现的精确控制。平台通过 Discord 运作，培育了活跃的创意社区。',
      '设计师探索视觉概念、营销人员创建社交媒体素材、游戏开发者原型角色和场景美术以及艺术家尝试 AI 辅助工作流的核心创意工具。风格参考功能可实现一致的品牌化视觉输出。',
    ],
    slug: 'v0.dev',

    url: 'https://v0.dev/',
    category: 'ai-tools',
    tags: ['UI', 'React', 'code-gen'],
  },

  // ─── Ecommerce Tools ──────────────────────────────
  {
    title: 'Shopify',
    titleZh: 'Shopify',
    description: [
      'Leading ecommerce platform for building online stores with integrated payments, inventory management, shipping, and a rich app marketplace.',
      'v0 generates production-ready React components with Tailwind CSS from natural language descriptions. Each output includes clean, copy-pasteable code that follows modern best practices — accessible markup, responsive design, and dark mode support.',
      'A game-changer for frontend developers and designers prototyping UI rapidly. Describe a dashboard card, pricing table, or signup form in plain English and get working React code in seconds — then iterate with follow-up prompts to refine the design.',
    ],
    descriptionZh: [
      '领先的电商建站平台，集成支付、库存管理、物流和应用市场，适合从独立站新手到规模化品牌的全阶段商家。',
      'v0 通过自然语言描述生成生产就绪的 React 组件和 Tailwind CSS 代码。每个输出都包含干净、可复制粘贴的代码，遵循现代最佳实践——无障碍标记、响应式设计和深色模式支持。',
      '前端开发者和设计师快速原型 UI 的革命性工具。用简单英语描述仪表盘卡片、定价表或注册表单，即可在秒级获得可运行的 React 代码——然后通过后续提示迭代优化设计。',
    ],
    slug: 'shopify.com',

    url: 'https://www.shopify.com/',
    category: 'ecommerce-tools',
    tags: ['platform', 'payments', 'store'],
  },
  {
    title: 'Stripe',
    titleZh: 'Stripe',
    description: [
      'Developer-first payment processing platform with APIs for online payments, subscriptions, invoicing, and fraud detection — supporting 135+ currencies.',
      'Shopify provides everything needed to launch and scale an online store — customizable themes, integrated payment processing, inventory management, shipping, analytics, and a vast app marketplace for extending functionality. It powers millions of businesses from solo entrepreneurs to global brands.',
      'The default platform for retail entrepreneurs launching direct-to-consumer brands. Use it to set up a store in hours, manage multi-channel sales (online, social, in-person POS), run email marketing campaigns, and access working capital through Shopify Capital.',
    ],
    descriptionZh: [
      '面向开发者的支付处理平台，提供在线支付、订阅、发票和风控 API，支持 135+ 货币，是 SaaS 和电商集成的首选。',
      'Shopify 提供启动和扩展在线商店所需的一切——可定制主题、集成支付处理、库存管理、物流、数据分析以及扩展功能的庞大应用市场。驱动数百万企业，从个人创业者到全球品牌。',
      '推出直销品牌的零售创业者的默认平台。可用于数小时内搭建商店、管理多渠道销售（线上、社交、线下 POS）、运营邮件营销活动以及通过 Shopify Capital 获得运营资金。',
    ],
    slug: 'stripe.com',

    url: 'https://stripe.com/',
    category: 'ecommerce-tools',
    tags: ['payments', 'API', 'subscriptions'],
  },
  {
    title: 'Etsy Fee Calculator',
    titleZh: 'Etsy Fee Calculator',
    description: [
      'ToolOrbit\'s Etsy Fee Calculator estimates all selling fees — listing fees, transaction fees, payment processing fees, and offsite ad fees — for any sale price and shipping cost. It provides a clear profit breakdown so sellers know exactly what they\'ll earn before listing.',
      'The calculator breaks down each fee category separately, showing how Etsy\'s fee structure affects your bottom line. Adjust the sale price, shipping cost, and item quantity to instantly see updated net profit, total fees, and effective fee percentage.',
      'An essential pricing tool for Etsy sellers planning inventory, running sales, and analyzing profitability. Use it to compare profit margins across different price points, factor shipping costs into pricing strategy, and avoid underpricing that erodes take-home revenue.',
    ],
    descriptionZh: [
      'ToolOrbit 的 Etsy 费用计算器估算任意售价和运费下的所有销售费用——上架费、交易费、支付处理费和站外广告费。提供清晰的利润拆解，让卖家在上架前就知道实际到手收入。',
      '计算器逐项拆解每种费用类别，清晰展示 Etsy 的费用结构如何影响你的实际利润。调整售价、运费和数量即可即时查看更新的净利润、总费用和实际费率。',
      'Etsy 卖家规划库存、开展促销和分析盈利能力的必备定价工具。可用于对比不同价位的利润率、将运费纳入定价策略以及避免定价过低侵蚀实际收入。',
    ],
    slug: 'toolorbit-etsy-fee',

    url: 'https://toolorbit.site/tools/ecommerce/etsy-fee-calculator',
    category: 'ecommerce-tools',
    tags: ['Etsy', 'fees', 'pricing'],
  },
  {
    title: 'Printful',
    titleZh: 'Printful',
    description: [
      'Print-on-demand and dropshipping fulfillment service that prints and ships custom apparel, accessories, and home goods directly to customers.',
      'ToolOrbit\'s Etsy Fee Calculator estimates all selling fees — listing fees, transaction fees, payment processing fees, and offsite ad fees — for any sale price and shipping cost. It provides a clear profit breakdown so sellers know exactly what they\'ll earn before listing.',
      'An essential pricing tool for Etsy sellers planning inventory, running sales, and analyzing profitability. Use it to compare profit margins across different price points, factor shipping costs into pricing strategy, and avoid underpricing that erodes take-home revenue.',
    ],
    descriptionZh: [
      '按需打印与代发货履约平台，支持定制服装、配饰和家居用品，直发终端客户，无需囤货即可启动品牌电商。',
      'ToolOrbit 的 Etsy 费用计算器估算任意售价和运费下的所有销售费用——上架费、交易费、支付处理费和站外广告费。提供清晰的利润拆解，让卖家在上架前就知道实际到手收入。',
      'Etsy 卖家规划库存、开展促销和分析盈利能力的必备定价工具。可用于对比不同价位的利润率、将运费纳入定价策略以及避免定价过低侵蚀实际收入。',
    ],
    slug: 'printful.com',

    url: 'https://www.printful.com/',
    category: 'ecommerce-tools',
    tags: ['POD', 'dropshipping', 'fulfillment'],
  },

  // ─── Learning Resources ────────────────────────────
  {
    title: 'MDN Web Docs',
    titleZh: 'MDN Web Docs',
    description: [
      'Mozilla\'s definitive reference for HTML, CSS, and JavaScript with browser-compatibility tables, interactive examples, and standards-track documentation.',
      'Printful handles print-on-demand fulfillment — when a customer orders from your store, Printful prints and ships the product directly to them. No inventory, no minimum orders, and a catalog of 300+ customizable products from t-shirts to wall art.',
      'An accessible entry point for creators launching merchandise brands and ecommerce entrepreneurs testing product ideas. Use it to create branded apparel, home goods, and accessories without upfront investment, integrate with Shopify/Etsy/WooCommerce, and scale fulfillment as orders grow.',
    ],
    descriptionZh: [
      'Mozilla 维护的 HTML、CSS、JavaScript 权威参考文档，提供浏览器兼容性表格和交互示例，是 Web 开发者的百科全书。',
      'Printful 处理按需打印履约——当客户在你的商店下单时，Printful 直接打印并发货给客户。无需库存、无最小起订量，提供 300+ 可定制产品目录，从 T 恤到挂画。',
      '创作者启动周边品牌和电商创业者测试产品创意的低门槛入口。可用于无需前期投资即可创建品牌服装、家居用品和配饰，集成 Shopify/Etsy/WooCommerce，伴随订单增长扩展履约能力。',
    ],
    slug: 'developer.mozilla.org',

    url: 'https://developer.mozilla.org/',
    category: 'learning-resources',
    tags: ['documentation', 'web', 'frontend'],
  },
  {
    title: 'freeCodeCamp',
    titleZh: 'freeCodeCamp',
    description: [
      'Free coding curriculum with 10+ certifications covering web development, data science, and machine learning — supported by a global community.',
      'MDN Web Docs is the most comprehensive and authoritative reference for web technologies — covering HTML, CSS, JavaScript, SVG, Web APIs, and HTTP. Every page includes browser compatibility data, interactive code examples, and links to relevant standards.',
      'The first resource to consult for any web development question. Use it to look up JavaScript method signatures, understand CSS property interactions, explore new Web APIs, and check whether a feature is supported across target browsers before using it in production.',
    ],
    descriptionZh: [
      '免费编程课程平台，提供 10+ 认证方向，涵盖 Web 开发、数据科学和机器学习，配套活跃的全球学习社区。',
      'MDN Web Docs 是 Web 技术最全面、最权威的参考文档——覆盖 HTML、CSS、JavaScript、SVG、Web API 和 HTTP。每页均包含浏览器兼容性数据、交互式代码示例和相关标准链接。',
      '任何 Web 开发问题的第一查询资源。可用于查阅 JavaScript 方法签名、理解 CSS 属性交互、探索新 Web API 以及在生产中采用前检查特性在目标浏览器中的支持情况。',
    ],
    slug: 'freecodecamp.org',

    url: 'https://www.freecodecamp.org/',
    category: 'learning-resources',
    tags: ['courses', 'certification', 'beginner'],
  },
  {
    title: 'CSS-Tricks',
    titleZh: 'CSS-Tricks',
    description: [
      'Long-running CSS blog with in-depth guides, almanac entries, and practical tips on modern CSS layout, animation, and responsive design.',
      'freeCodeCamp offers a completely free, self-paced coding curriculum with 10+ certifications covering responsive web design, JavaScript algorithms, frontend libraries, data visualization, APIs, and machine learning — all through hands-on project-based learning.',
      'The best starting point for aspiring developers without a formal CS background. Use it to build a portfolio of real projects while earning certifications, transition from another career into tech, and join a supportive global community of learners and mentors.',
    ],
    descriptionZh: [
      '资深 CSS 技术博客，提供深入的 CSS 布局、动画和响应式设计教程与速查手册，是前端开发者进阶的宝藏资源。',
      'freeCodeCamp 提供完全免费、自定进度的编程课程，包含 10+ 认证方向，涵盖响应式 Web 设计、JavaScript 算法、前端库、数据可视化、API 和机器学习——全部通过实战项目式学习完成。',
      '没有正式 CS 背景的准开发者的最佳起点。可在获得认证的同时积累真实项目作品集、从其他职业转向科技行业，以及加入互助的全球学习者和导师社区。',
    ],
    slug: 'css-tricks.com',

    url: 'https://css-tricks.com/',
    category: 'learning-resources',
    tags: ['CSS', 'frontend', 'blog'],
  },
  {
    title: 'The Odin Project',
    titleZh: 'The Odin Project',
    description: [
      'Free full-stack curriculum that teaches web development through hands-on projects — Ruby on Rails and JavaScript/Node.js paths available.',
      'CSS-Tricks has been the definitive CSS blog for over a decade — publishing in-depth guides, an exhaustive almanac of CSS properties and selectors, and practical articles on modern layout, animation, and responsive design patterns.',
      'A trusted resource for frontend developers at every level. Use it to master CSS Grid and Flexbox, understand complex topics like stacking contexts and containing blocks, learn modern techniques like container queries and cascade layers, and find creative solutions to common layout challenges.',
    ],
    descriptionZh: [
      '免费全栈 Web 开发课程，通过构建真实项目来学习，提供 Ruby on Rails 和 JavaScript/Node.js 两条路径。',
      'CSS-Tricks 是十多年来最具权威的 CSS 博客——发布深入指南、详尽的 CSS 属性与选择器速查手册以及关于现代布局、动画和响应式设计模式的实用文章。',
      '各级前端开发者信赖的资源。可用于掌握 CSS Grid 和 Flexbox、理解层叠上下文和包含块等复杂概念、学习容器查询和级联层等现代技术以及寻找常见布局挑战的创意解决方案。',
    ],
    slug: 'theodinproject.com',

    url: 'https://www.theodinproject.com/',
    category: 'learning-resources',
    tags: ['full-stack', 'curriculum', 'project-based'],
  },
  {
    title: 'Smashing Magazine',
    titleZh: 'Smashing Magazine',
    description: [
      'Professional web design and development publication with articles on UX, frontend, performance, accessibility, and design systems.',
      'The Odin Project provides a free, open-source full-stack curriculum that emphasizes project-based learning — building real applications from scratch. Students choose between a Ruby on Rails path and a JavaScript/Node.js path, both covering HTML, CSS, Git, and databases.',
      'Ideal for self-directed learners who want a structured path to becoming full-stack developers. Use it to build a portfolio of deployed applications, learn Git and command-line fundamentals hands-on, and join an active Discord community for peer support and code reviews.',
    ],
    descriptionZh: [
      '专业 Web 设计与开发杂志，覆盖 UX、前端、性能优化、无障碍和设计系统等主题，文章质量在行业内备受推崇。',
      'The Odin Project 提供免费、开源的全栈课程，强调通过构建真实应用进行项目式学习。学生可在 Ruby on Rails 和 JavaScript/Node.js 两条路径间选择，均覆盖 HTML、CSS、Git 和数据库。',
      '适合想要结构化路径成为全栈开发者的自学者。可用于构建可部署的应用作品集、通过实操学习 Git 和命令行基础以及加入活跃的 Discord 社区寻求同伴支持和代码审查。',
    ],
    slug: 'smashingmagazine.com',

    url: 'https://www.smashingmagazine.com/',
    category: 'learning-resources',
    tags: ['design', 'frontend', 'UX'],
  },

  // ─── Open Source ──────────────────────────────────
  {
    title: 'React',
    titleZh: 'React',
    description: [
      'Meta\'s JavaScript library for building component-based user interfaces with a declarative programming model and a vast ecosystem.',
      'Smashing Magazine publishes high-quality articles, books, and conferences on web design and development — covering UX strategy, frontend performance, accessibility, design systems, and CSS architecture. Their articles are editor-reviewed for technical accuracy and depth.',
      'A professional development resource for experienced designers and developers. Use it to stay current with evolving web standards, learn accessibility patterns for inclusive design, understand performance optimization techniques, and explore design system governance models.',
    ],
    descriptionZh: [
      'Meta（Facebook）推出的 JavaScript UI 库，基于组件化和声明式编程模型，拥有最庞大的前端生态和社区。',
      'Smashing Magazine 发布关于 Web 设计与开发的高质量文章、书籍和会议——覆盖 UX 策略、前端性能、无障碍、设计系统和 CSS 架构。文章经过编辑审核以保证技术准确性和深度。',
      '资深设计师和开发者的专业发展资源。可用于跟踪不断演进的 Web 标准、学习包容性设计的无障碍模式、理解性能优化技术以及探索设计系统的治理模型。',
    ],
    slug: 'react.dev',

    url: 'https://react.dev/',
    category: 'open-source',
    tags: ['UI', 'JavaScript', 'frontend'],
  },
  {
    title: 'Next.js',
    titleZh: 'Next.js',
    description: [
      'Vercel\'s React framework with server-side rendering, static generation, file-based routing, and API routes — the default choice for modern React apps.',
      'React is a component-based UI library developed by Meta. Its declarative model, virtual DOM diffing, and one-way data flow have defined modern frontend architecture. The ecosystem includes React Router, Redux, React Query, and thousands of component libraries.',
      'The dominant UI library for web development — essential for frontend developers building interactive user interfaces. Use it to create reusable component hierarchies, manage UI state predictably, and leverage a massive ecosystem of tools, libraries, and community knowledge.',
    ],
    descriptionZh: [
      'Vercel 推出的 React 框架，内置 SSR、静态生成、文件路由和 API 路由，是现代 React 应用开发的默认起点。',
      'React 是 Meta 开发的基于组件的 UI 库。其声明式模型、虚拟 DOM Diff 和单向数据流定义了现代前端架构。生态包括 React Router、Redux、React Query 和数千个组件库。',
      'Web 开发的主流 UI 库——构建交互式用户界面的前端开发者必备。可用于创建可复用的组件层次结构、可预测地管理 UI 状态以及利用庞大的工具、库和社区知识生态。',
    ],
    slug: 'nextjs.org',

    url: 'https://nextjs.org/',
    category: 'open-source',
    tags: ['React', 'SSR', 'framework'],
  },
  {
    title: 'Tailwind CSS',
    titleZh: 'Tailwind CSS',
    description: [
      'Utility-first CSS framework for rapidly building custom designs directly in HTML markup with responsive, state-variant, and dark-mode utilities.',
      'Next.js extends React with server-side rendering, static site generation, file-based routing, API routes, and image optimization — all with zero configuration. App Router brings React Server Components, streaming, and nested layouts to the framework.',
      'The go-to React framework for building production web applications. Use it to optimize SEO with SSR, generate static marketing pages, create API endpoints alongside your frontend, and deploy with one-click on Vercel or any Node.js server.',
    ],
    descriptionZh: [
      'Utility-first CSS 框架，直接在 HTML 中通过类名构建自定义设计，内置响应式、状态变体和深色模式支持。',
      'Next.js 以服务端渲染、静态站点生成、文件路由、API 路由和图片优化扩展 React——全部零配置。App Router 为框架带来 React Server Components、流式渲染和嵌套布局。',
      '构建生产级 Web 应用的 React 框架首选。可用于通过 SSR 优化 SEO、生成静态营销页面、在前端旁创建 API 端点以及在 Vercel 或任何 Node.js 服务器上一键部署。',
    ],
    slug: 'tailwindcss.com',

    url: 'https://tailwindcss.com/',
    category: 'open-source',
    tags: ['CSS', 'framework', 'design-system'],
  },
  {
    title: 'shadcn/ui',
    titleZh: 'shadcn/ui',
    description: [
      'Component collection and code distribution platform — copy-paste beautifully designed, accessible React components built on Radix UI and Tailwind.',
      'Tailwind CSS is a utility-first CSS framework — compose designs directly in HTML with classes like "flex items-center gap-4". It generates only the CSS you use, ships responsive variants out of the box, and integrates seamlessly with component frameworks.',
      'Transformative for frontend developers who want to build custom designs fast without context-switching between HTML and CSS files. Use it to prototype layouts quickly, enforce design consistency with a configurable theme, and produce minimal production CSS bundles.',
    ],
    descriptionZh: [
      '组件集合与代码分发平台，通过复制粘贴即可使用基于 Radix UI 和 Tailwind 构建的精美、无障碍 React 组件。',
      'Tailwind CSS 是 Utility-first CSS 框架——直接通过 "flex items-center gap-4" 等类名在 HTML 中构建设计。仅生成实际使用的 CSS、内置响应式变体且与组件框架无缝集成。',
      '对想要快速构建自定义设计而无需在 HTML 和 CSS 文件之间切换的前端开发者来说具有革命性。可用于快速原型布局、通过可配置主题强制执行设计一致性以及产出极小的生产 CSS 包。',
    ],
    slug: 'ui.shadcn.com',

    url: 'https://ui.shadcn.com/',
    category: 'open-source',
    tags: ['React', 'components', 'Tailwind'],
  },
  {
    title: 'Supabase',
    titleZh: 'Supabase',
    description: [
      'Open-source Firebase alternative offering Postgres database, authentication, real-time subscriptions, storage, and edge functions with generous free tier.',
      'shadcn/ui distributes beautifully designed, accessible React components as copy-pasteable source code rather than a dependency. Built on Radix UI primitives and Tailwind CSS, each component is fully customizable and owned by your project.',
      'The modern standard for React component libraries. Use it to kickstart projects with production-ready components, maintain full control over implementation details, customize every aspect to match your design system, and benefit from a vibrant community contributing new components.',
    ],
    descriptionZh: [
      '开源的 Firebase 替代方案，提供 Postgres 数据库、认证、实时订阅、存储和边缘函数，免费额度慷慨，适合快速搭建应用后端。',
      'shadcn/ui 将精美设计、无障碍的 React 组件以可复制粘贴的源代码形式分发，而非依赖包。基于 Radix UI 原语和 Tailwind CSS 构建，每个组件完全可定制且归项目所有。',
      'React 组件库的现代标准。可用于用生产就绪组件快速启动项目、完全掌控实现细节、定制每个方面以匹配设计系统以及受益于活跃社区不断贡献新组件。',
    ],
    slug: 'supabase.com',

    url: 'https://supabase.com/',
    category: 'open-source',
    tags: ['database', 'BaaS', 'Postgres'],
  },
  {
    title: 'Vue.js',
    titleZh: 'Vue.js',
    description: [
      'Progressive JavaScript framework with an approachable learning curve, reactive data binding, and a flexible composition API for building UIs.',
      'Supabase provides an open-source Firebase alternative — Postgres database with real-time subscriptions, authentication, row-level security, file storage, and edge functions. The hosted platform includes a generous free tier with no usage limits that surprise you at scale.',
      'A perfect backend for indie hackers and startups who want SQL power with real-time capabilities. Use it to build apps with instant data sync, implement social login in minutes, store and serve user-generated content, and query data from the browser without building an API.',
    ],
    descriptionZh: [
      '渐进式 JavaScript 框架，学习曲线平缓，具备响应式数据绑定和灵活的 Composition API，深受中文社区和中小团队的喜爱。',
      'Supabase 提供开源的 Firebase 替代方案——Postgres 数据库、实时订阅、认证、行级安全、文件存储和边缘函数。托管平台提供慷慨的免费额度，无规模扩展时的意外用量限制。',
      '想要 SQL 能力加实时特性的独立开发者和初创团队的完美后端。可用于构建即时数据同步的应用、数分钟实现社交登录、存储和提供用户生成内容以及无需构建 API 即可从浏览器查询数据。',
    ],
    slug: 'vuejs.org',

    url: 'https://vuejs.org/',
    category: 'open-source',
    tags: ['JavaScript', 'framework', 'UI'],
  },
  {
    title: 'tRPC',
    titleZh: 'tRPC',
    description: [
      'End-to-end typesafe API framework that shares TypeScript types between server and client without code generation — zero-rest, full IntelliSense.',
      'Vue.js combines reactive data binding, a template-based syntax, and a flexible Composition API — offering an approachable learning curve without sacrificing power. Its ecosystem includes Pinia for state management, Vue Router for navigation, and Vite for build tooling.',
      'A popular choice for teams that prefer HTML-like templates, Chinese-speaking developer communities, and projects where gradual adoption is important. Use it to build SPAs, progressively enhance multi-page sites, and create component libraries with a gentle learning curve.',
    ],
    descriptionZh: [
      '端到端类型安全的 API 框架，无需代码生成即可在服务端和客户端之间共享 TypeScript 类型，享受完整的 IDE 智能提示。',
      'Vue.js 结合响应式数据绑定、模板化语法和灵活的 Composition API——提供平缓的学习曲线同时不失强大能力。生态包括 Pinia 状态管理、Vue Router 导航和 Vite 构建工具。',
      '偏好类 HTML 模板的团队、中文开发者社区以及渐进式采用重要的项目的热门选择。可用于构建 SPA、渐进增强多页面站点以及创建学习门槛友好的组件库。',
    ],
    slug: 'trpc.io',

    url: 'https://trpc.io/',
    category: 'open-source',
    tags: ['TypeScript', 'API', 'typesafe'],
  },
  {
    title: 'Astro',
    titleZh: 'Astro',
    description: [
      'Content-focused web framework that ships zero JavaScript by default, with island-architecture hydration for interactive components when needed.',
      'tRPC enables end-to-end typesafe APIs without code generation — define a router on the server, import its type on the client, and get full autocompletion and compile-time error checking for every API call. It bridges the type gap between frontend and backend in TypeScript projects.',
      'A game-changer for full-stack TypeScript developers tired of manually syncing API types. Use it to eliminate the need for REST/GraphQL schemas in internal apps, get instant feedback when an API changes, and build faster with full confidence in type safety.',
    ],
    descriptionZh: [
      '以内容为中心的 Web 框架，默认输出零 JavaScript，按需通过岛屿架构水合交互组件，是内容站和博客的极佳选择。',
      'tRPC 实现端到端类型安全的 API 而无需代码生成——在服务端定义路由、在客户端导入其类型，每个 API 调用都获得完整的自动补全和编译时错误检查。弥合 TypeScript 项目前后端之间的类型鸿沟。',
      '厌倦手动同步 API 类型的全栈 TypeScript 开发者的革命性工具。可用于消除内部应用对 REST/GraphQL Schema 的需求、在 API 变更时获得即时反馈以及以完全的类型安全信心更快地构建。',
    ],
    slug: 'astro.build',

    url: 'https://astro.build/',
    category: 'open-source',
    tags: ['SSG', 'framework', 'content'],
  },

  // ══════════════════════════════════════════════════════
  // ─── Developer Tools (continued) ────────────────────
  // ══════════════════════════════════════════════════════
  {
    title: 'Bun',
    titleZh: 'Bun',
    description: [
      'Fast all-in-one JavaScript runtime, bundler, test runner, and package manager — drop-in Node.js replacement with native TypeScript support.',
      'Astro ships zero JavaScript to the browser by default — rendering pages to static HTML at build time and hydrating only the interactive islands that need it. It supports components from React, Vue, Svelte, and Solid within the same project.',
      'The ideal framework for content-rich websites where performance and SEO matter — blogs, documentation, marketing sites, and ecommerce. Use it to build lightning-fast static sites while still using your preferred component framework for interactive features.',
    ],
    descriptionZh: [
      '极速一体化 JavaScript 运行时，集打包器、测试运行器和包管理器于一身，原生支持 TypeScript，可替代 Node.js。',
      'Astro 默认向浏览器输出零 JavaScript——构建时渲染为静态 HTML，仅为需要的交互孤岛进行水合。支持在同一项目中使用 React、Vue、Svelte 和 Solid 组件。',
      '重视性能和 SEO 的内容型网站的理想框架——博客、文档站、营销网站和电商。可用于构建极速静态站点同时仍使用你喜欢的组件框架实现交互功能。',
    ],
    slug: 'bun.sh',

    url: 'https://bun.sh/',
    category: 'developer-tools',
    tags: ['runtime', 'JavaScript', 'bundler'],
  },
  {
    title: 'Biome',
    titleZh: 'Biome',
    description: [
      'Fast formatter and linter for JavaScript, TypeScript, JSX, and JSON — unified toolchain replacing ESLint + Prettier with near-instant performance.',
      'Bun is a drop-in replacement for Node.js that runs JavaScript and TypeScript with dramatically faster startup and execution. It bundles, transpiles, and installs packages — all within a single binary, eliminating the need for separate tooling.',
      'An excellent choice for developers building CLI tools, serverless functions, and high-throughput APIs. Its native TypeScript support and npm-compatible package manager make migration seamless for existing projects seeking performance gains.',
    ],
    descriptionZh: [
      '极速的 JS/TS/JSX/JSON 格式化和 Lint 工具，统一替代 ESLint + Prettier 组合，性能接近即时完成。',
      'Bun 是 Node.js 的直接替代品，以极快的速度和启动时间运行 JavaScript 和 TypeScript。集打包、转译和包管理于单一二进制文件，无需额外工具链。',
      '适合构建 CLI 工具、Serverless 函数和高吞吐量 API 的开发者。原生 TypeScript 支持和 npm 兼容的包管理器使现有项目可无缝迁移以获得性能提升。',
    ],
    slug: 'biomejs.dev',

    url: 'https://biomejs.dev/',
    category: 'developer-tools',
    tags: ['formatter', 'linter', 'toolchain'],
  },
  {
    title: 'Playwright',
    titleZh: 'Playwright',
    description: [
      'Microsoft\'s end-to-end testing framework with auto-wait, trace viewer, and cross-browser support (Chromium, Firefox, WebKit) — reliable UI testing at scale.',
      'Biome replaces ESLint and Prettier with a single, significantly faster tool — formatting and linting large codebases in milliseconds. It supports JavaScript, TypeScript, JSX, and JSON with a growing rule set and zero configuration for most projects.',
      'A perfect fit for teams frustrated by slow CI pipelines due to linting. Use it to enforce consistent code style in monorepos, reduce toolchain complexity, and speed up pre-commit hooks without sacrificing rule coverage.',
    ],
    descriptionZh: [
      '微软出品的端到端测试框架，支持自动等待、Trace 回放和跨浏览器（Chromium/Firefox/WebKit），是可靠的规模化 UI 测试方案。',
      'Biome 以单个显著更快的工具替代 ESLint + Prettier——在毫秒级别完成大型代码库的格式化与 Lint。支持 JavaScript、TypeScript、JSX 和 JSON，规则集不断增长，大多数项目零配置即可使用。',
      '对于因 Lint 拖慢 CI 流水线而苦恼的团队是理想选择。可用于在 monorepo 中强制执行一致的代码风格、降低工具链复杂度并加速 pre-commit 钩子，同时不牺牲规则覆盖。',
    ],
    slug: 'playwright.dev',

    url: 'https://playwright.dev/',
    category: 'developer-tools',
    tags: ['testing', 'e2e', 'Microsoft'],
  },
  {
    title: 'Prisma',
    titleZh: 'Prisma',
    description: [
      'Next-generation Node.js and TypeScript ORM with auto-generated type-safe query builder, schema migrations, and a visual database browser.',
      'Playwright auto-waits for elements to be actionable, captures trace videos and screenshots on failure, and runs tests across Chromium, Firefox, and WebKit with a single API. Its codegen tool records user interactions and generates test scripts automatically.',
      'Indispensable for QA engineers and full-stack developers who need reliable end-to-end tests. Use it to validate critical user flows, catch cross-browser regressions, and generate visual snapshots for design review.',
    ],
    descriptionZh: [
      '新一代 Node.js/TypeScript ORM，自动生成类型安全的查询构建器，支持 Schema 迁移和可视化数据库浏览器。',
      'Playwright 自动等待元素可交互、失败时捕获 Trace 视频和截图，并通过单一 API 在 Chromium、Firefox 和 WebKit 上运行测试。Codegen 工具可录制用户操作并自动生成测试脚本。',
      'QA 工程师和需要可靠端到端测试的全栈开发者不可或缺。可用于验证关键用户流程、捕获跨浏览器回归问题以及为设计评审生成视觉快照。',
    ],
    slug: 'prisma.io',

    url: 'https://www.prisma.io/',
    category: 'developer-tools',
    tags: ['ORM', 'database', 'TypeScript'],
  },
  {
    title: 'Turborepo',
    titleZh: 'Turborepo',
    description: [
      'High-performance monorepo build system with intelligent caching, parallel task execution, and incremental builds — built by the Vercel team.',
      'Prisma provides an auto-generated type-safe query builder, a declarative schema for database modeling, and a visual database browser (Prisma Studio). Migrations are managed through a straightforward CLI without writing raw SQL.',
      'A top choice for TypeScript developers building data-driven applications. It eliminates the gap between database schema and application types, accelerates CRUD development, and integrates smoothly into Next.js, NestJS, and tRPC stacks.',
    ],
    descriptionZh: [
      '高性能 Monorepo 构建系统，具备智能缓存、并行任务执行和增量构建能力，由 Vercel 团队打造。',
      'Prisma 提供自动生成的类型安全查询构建器、声明式 Schema 建模和可视化数据库浏览器（Prisma Studio）。迁移通过简洁的 CLI 管理，无需编写原始 SQL。',
      'TypeScript 开发者构建数据驱动应用的首选 ORM。它消除了数据库 Schema 与应用类型之间的鸿沟，加速 CRUD 开发，并与 Next.js、NestJS、tRPC 技术栈平滑集成。',
    ],
    slug: 'turbo.build',

    url: 'https://turbo.build/',
    category: 'developer-tools',
    tags: ['monorepo', 'build', 'Vercel'],
  },
  {
    title: 'Storybook',
    titleZh: 'Storybook',
    description: [
      'Frontend workshop for building UI components and pages in isolation — develop, document, and test components for React, Vue, Angular, and Svelte.',
      'Turborepo caches task outputs and intelligently skips unchanged work, dramatically accelerating builds in monorepos. Its dependency graph visualization and parallel execution engine ensure tasks run in optimal order with maximum concurrency.',
      'A must-have for platform teams managing multi-package repositories. It reduces CI costs, shortens developer feedback loops, and integrates transparently with existing npm, pnpm, and Yarn workspaces.',
    ],
    descriptionZh: [
      '前端组件开发工作坊，在隔离环境中开发、文档化和测试 React/Vue/Angular/Svelte 组件，是 UI 组件库开发和设计系统的基础设施。',
      'Turborepo 缓存任务输出并智能跳过未变更的工作，显著加速 monorepo 中的构建。依赖图可视化和并行执行引擎确保任务以最优顺序和最大并发运行。',
      '管理多包仓库的平台团队的必备工具。降低 CI 成本、缩短开发者反馈循环，并与现有 npm、pnpm 和 Yarn workspaces 透明集成。',
    ],
    slug: 'storybook.js.org',

    url: 'https://storybook.js.org/',
    category: 'developer-tools',
    tags: ['UI', 'components', 'testing'],
  },
  {
    title: 'ngrok',
    titleZh: 'ngrok',
    description: [
      'Secure localhost tunneling service that exposes local servers to the internet with HTTPS — essential for webhook testing and demo previews.',
      'Storybook isolates each UI component so you can develop, test, and document it independently. Add-ons provide accessibility checks, responsive viewport previews, design tool integration, and interaction testing — all within a single workshop.',
      'Essential for teams building design systems and component libraries. Use it to showcase components to stakeholders, run visual regression tests with Chromatic, and onboard new developers by letting them browse every UI state without running the full app.',
    ],
    descriptionZh: [
      '安全的内网穿透服务，一键将本地服务暴露到公网并自带 HTTPS，是 Webhook 调试和 Demo 演示的必备工具。',
      'Storybook 隔离每个 UI 组件，让你可以独立开发、测试和文档化。插件提供无障碍检查、响应式视口预览、设计工具集成和交互测试——全部在一个工作坊内完成。',
      '构建设计系统和组件库的团队必备。可用于向利益相关者展示组件、通过 Chromatic 运行视觉回归测试，以及让新开发者在不启动完整应用的情况下浏览每个 UI 状态。',
    ],
    slug: 'ngrok.com',

    url: 'https://ngrok.com/',
    category: 'developer-tools',
    tags: ['tunneling', 'webhook', 'debugging'],
  },
  {
    title: 'Cloudflare',
    titleZh: 'Cloudflare',
    description: [
      'Global network platform offering CDN, DDoS protection, Workers (serverless edge computing), Pages (Jamstack hosting), R2 (object storage), and D1 (edge database).',
      'ngrok creates a secure tunnel from a public URL to your localhost, with automatic HTTPS, request inspection, and replay. Reserved domains and TCP tunnels support more permanent setups for staging environments and IoT devices.',
      'Invaluable for developers testing webhooks, OAuth flows, and payment callbacks. Use it to demo work-in-progress to clients, share a local dev server during pair programming, and expose APIs from behind firewalls.',
    ],
    descriptionZh: [
      '全球网络平台，提供 CDN、DDoS 防护、Workers 边缘计算、Pages 静态托管、R2 对象存储和 D1 边缘数据库，是独立开发者的全能基础设施。',
      'ngrok 通过公共 URL 创建到本地主机的安全隧道，自动配置 HTTPS、请求检查与重放。预留域名和 TCP 隧道为预发布环境和 IoT 设备提供更持久的方案。',
      '测试 Webhook、OAuth 回调和支付通知的开发者利器。可用于向客户演示进行中的工作、结对编程时共享本地开发服务器，以及从防火墙后暴露 API。',
    ],
    slug: 'cloudflare.com',

    url: 'https://www.cloudflare.com/',
    category: 'developer-tools',
    tags: ['CDN', 'edge', 'serverless'],
  },
  {
    title: 'Transform Tools',
    titleZh: 'Transform Tools',
    description: [
      'Polyglot code transformation playground — convert between JSX, TypeScript, JSON, GraphQL, CSS, and more with instant, copy-pasteable output.',
      'Cloudflare Workers deploy JavaScript at the edge — within milliseconds of users worldwide — with zero cold starts and a generous free tier. The broader platform includes DDoS protection, DNS management, R2 object storage, D1 SQLite database, and AI inference APIs.',
      'A complete infrastructure platform for modern web applications. Use Workers for API middleware and A/B testing, Pages for Jamstack hosting, R2 for cost-effective asset storage, and the AI Gateway to proxy and monitor LLM API calls.',
    ],
    descriptionZh: [
      '多语言代码转换沙盒，支持 JSX ↔ TypeScript ↔ JSON ↔ GraphQL ↔ CSS 等格式即时互转，复制粘贴即得结果。',
      'Cloudflare Workers 在全球边缘部署 JavaScript——距用户仅毫秒延迟——零冷启动且免费额度慷慨。更广泛的平台包含 DDoS 防护、DNS 管理、R2 对象存储、D1 SQLite 数据库和 AI 推理 API。',
      '现代 Web 应用的完整基础设施平台。Workers 可用于 API 中间件与 A/B 测试，Pages 用于 Jamstack 托管，R2 用于经济高效的资源存储，AI Gateway 用于代理和监控 LLM API 调用。',
    ],
    slug: 'transform.tools',

    url: 'https://transform.tools/',
    category: 'developer-tools',
    tags: ['conversion', 'code', 'playground'],
  },
  {
    title: 'BundlePhobia',
    titleZh: 'BundlePhobia',
    description: [
      'Check the install size, minified size, and gzipped cost of any npm package before adding it to your project — plus tree-shaking analysis.',
      'Transform Tools converts between dozens of formats — JSON to TypeScript, JSX to JavaScript, GraphQL to TypeScript, CSS to Tailwind, and more — with instant results rendered in a split-pane editor. All processing runs locally in the browser.',
      'A time-saver for developers who frequently shuffle between data formats. Use it to generate TypeScript types from API responses, migrate CSS to Tailwind utilities, convert JSON Schema to TypeScript interfaces, and explore unfamiliar formats.',
    ],
    descriptionZh: [
      '在安装前查 npm 包的体积大小（安装大小、压缩大小、gzip 大小）和 Tree-shaking 分析，帮助控制前端打包体积。',
      'Transform Tools 支持数十种格式互转——JSON 转 TypeScript、JSX 转 JavaScript、GraphQL 转 TypeScript、CSS 转 Tailwind 等——结果即时呈现在分屏编辑器中。所有处理在浏览器本地完成。',
      '频繁在不同数据格式间切换的开发者的省时利器。可用于从 API 响应生成 TypeScript 类型、将 CSS 迁移为 Tailwind 工具类、将 JSON Schema 转为 TypeScript 接口以及探索不熟悉的格式。',
    ],
    slug: 'bundlephobia.com',

    url: 'https://bundlephobia.com/',
    category: 'developer-tools',
    tags: ['npm', 'bundle-size', 'performance'],
  },
  {
    title: 'Can I Use',
    titleZh: 'Can I Use',
    description: [
      'Up-to-date browser support tables for HTML, CSS, JS, SVG, and Web APIs — the go-to reference for checking cross-browser compatibility.',
      'BundlePhobia shows the minified, minified+gzipped, and tree-shaken size of any npm package, plus its dependency graph and composition breakdown. Shareable URLs make it easy to include size analysis in PR reviews.',
      'Essential for performance-conscious frontend developers. Use it before adding any new dependency to compare alternatives by bundle impact, identify bloated packages, and keep your JavaScript payload slim.',
    ],
    descriptionZh: [
      '最新的 HTML/CSS/JS/SVG/Web API 浏览器兼容性速查表，前端开发者判断特性可用性的首选参考站。',
      'BundlePhobia 展示任意 npm 包的压缩、gzip 和 Tree-shaking 后体积，以及依赖图和构成分析。可分享的 URL 便于在 PR 评审中包含体积分析。',
      '注重性能的前端开发者的必备工具。添加任何新依赖前先对比不同方案对打包体积的影响，识别臃肿的包，保持 JavaScript 负载精简。',
    ],
    slug: 'caniuse.com',

    url: 'https://caniuse.com/',
    category: 'developer-tools',
    tags: ['compatibility', 'browser', 'reference'],
  },
  {
    title: 'cURL Converter',
    titleZh: 'cURL Converter',
    description: [
      'Convert cURL commands to Python, JavaScript, Go, PHP, Java, and more — paste a curl command and get idiomatic code for your preferred language.',
      'Can I Use provides detailed browser support tables for every HTML, CSS, JavaScript, SVG, and Web API feature — including global usage statistics, known issues, and links to relevant specifications. Data is updated as browsers ship new versions.',
      'Every frontend developer\'s go-to reference before using a modern web feature. Check compat data before adopting new CSS properties, verify that a JavaScript API works across target browsers, and include support notes in documentation.',
    ],
    descriptionZh: [
      '将 cURL 命令转换为 Python、JavaScript、Go、PHP、Java 等语言的代码，粘贴 curl 即得惯用语法代码。',
      'Can I Use 提供每个 HTML、CSS、JavaScript、SVG 和 Web API 特性的详细浏览器支持表——包括全球使用率统计、已知问题和相关规范链接。数据随浏览器新版本发布而更新。',
      '每个前端开发者在使用现代 Web 特性前的必备参考。采用新 CSS 属性前先检查兼容性数据、验证 JavaScript API 在目标浏览器中的支持情况，在文档中包含支持说明。',
    ],
    slug: 'curlconverter.com',

    url: 'https://curlconverter.com/',
    category: 'developer-tools',
    tags: ['curl', 'conversion', 'API'],
  },
  {
    title: 'JSONPlaceholder',
    titleZh: 'JSONPlaceholder',
    description: [
      'Free fake REST API for testing and prototyping — returns realistic JSON data for posts, comments, users, todos, and photos without authentication.',
      'cURL Converter translates curl commands into idiomatic code for Python (requests, httpx), JavaScript (fetch, axios), Go, PHP, Java, Rust, and more. Paste a curl command from API docs or browser DevTools and get production-ready code instantly.',
      'A daily productivity booster for developers integrating third-party APIs. Use it to convert Chrome DevTools "Copy as cURL" output into your preferred language, translate API documentation examples, and debug HTTP requests.',
    ],
    descriptionZh: [
      '免费的假数据 REST API，返回 posts、comments、users、todos、photos 等真实结构的 JSON 数据，无需鉴权即可用于测试和原型开发。',
      'cURL Converter 将 curl 命令转换为 Python（requests/httpx）、JavaScript（fetch/axios）、Go、PHP、Java、Rust 等语言的惯用代码。粘贴来自 API 文档或浏览器 DevTools 的 curl 命令，即可获得生产就绪的代码。',
      '集成第三方 API 的开发者的日常效率提升工具。可将 Chrome DevTools 的"复制为 cURL"输出转换为你的首选语言、翻译 API 文档示例以及调试 HTTP 请求。',
    ],
    slug: 'jsonplaceholder.typicode.com',

    url: 'https://jsonplaceholder.typicode.com/',
    category: 'developer-tools',
    tags: ['API', 'mock', 'testing'],
  },
  {
    title: 'Drizzle ORM',
    titleZh: 'Drizzle ORM',
    description: [
      'Lightweight TypeScript ORM with SQL-like syntax, zero dependencies, and maximum type safety — designed for serverless and edge environments.',
      'JSONPlaceholder provides a complete REST API with realistic data for posts, comments, users, albums, photos, and todos — all served as JSON. No authentication, no rate limiting, and predictable resource relationships make it ideal for testing.',
      'Perfect for frontend developers prototyping UI with realistic data, bootcamp students building portfolio projects, and engineers writing API client tests. The predictable schema and relationships mirror real application data structures.',
    ],
    descriptionZh: [
      '轻量级 TypeScript ORM，采用类 SQL 语法、零依赖和极致类型安全，专为 Serverless 和边缘环境设计。',
      'JSONPlaceholder 提供完整的 REST API，包含 posts、comments、users、albums、photos、todos 等真实结构的 JSON 数据。无需认证、无限流、资源关系可预测，非常适合测试。',
      '前端开发者使用真实数据原型 UI、编程训练营学员构建作品集项目以及工程师编写 API 客户端测试的理想选择。可预测的 Schema 和关系模拟了真实应用的数据结构。',
    ],
    slug: 'orm.drizzle.team',

    url: 'https://orm.drizzle.team/',
    category: 'developer-tools',
    tags: ['ORM', 'TypeScript', 'database'],
  },

  // ══════════════════════════════════════════════════════
  // ─── Design Resources (continued) ───────────────────
  // ══════════════════════════════════════════════════════
  {
    title: 'Lucide',
    titleZh: 'Lucide',
    description: [
      'Beautifully crafted open-source icon library with 1,500+ consistent icons for React, Vue, Svelte, and more — the default for modern web projects.',
      'Drizzle ORM offers an SQL-like query syntax with full TypeScript type inference, zero dependencies, and first-class support for serverless platforms. Its schema definition mirrors SQL table declarations, making it intuitive for developers who know SQL.',
      'A strong contender for TypeScript developers who prefer writing SQL-style queries over abstract ORM patterns. Excellent for serverless projects on Vercel/Cloudflare, edge databases like Turso and PlanetScale, and teams that want maximum control over query generation.',
    ],
    descriptionZh: [
      '精美的开源图标库，1500+ 风格统一的图标，支持 React、Vue、Svelte 等框架，是现代 Web 项目的默认图标方案。',
      'Drizzle ORM 提供类 SQL 的查询语法、完整的 TypeScript 类型推导、零依赖以及对 Serverless 平台的一流支持。Schema 定义直接映射 SQL 表声明，SQL 开发者上手极为直观。',
      '偏好 SQL 风格查询而非抽象 ORM 模式的 TypeScript 开发者的强力选择。适合 Vercel/Cloudflare 上的 Serverless 项目、Turso 和 PlanetScale 等边缘数据库，以及想要完全控制查询生成逻辑的团队。',
    ],
    slug: 'lucide.dev',

    url: 'https://lucide.dev/',
    category: 'design-resources',
    tags: ['icons', 'open-source', 'React'],
  },
  {
    title: 'remove.bg',
    titleZh: 'remove.bg',
    description: [
      'AI-powered background removal tool — upload any photo and get a transparent PNG in seconds, no design skills required.',
      'Lucide provides 1,500+ meticulously designed, pixel-consistent icons — available as React, Vue, Svelte, and raw SVG components. Each icon is tree-shakeable, reducing bundle impact, and the search interface makes finding the right icon fast.',
      'The default icon library for modern web projects built with React, Next.js, and Tailwind CSS. Use it to create navigation bars, button icons, status indicators, and feature lists with a cohesive, professional look across the entire application.',
    ],
    descriptionZh: [
      'AI 驱动的背景去除工具，上传任意照片秒级生成透明 PNG，无需任何设计技巧即可获得专业抠图效果。',
      'Lucide 提供 1500+ 精心设计、像素一致的图标——支持 React、Vue、Svelte 和原始 SVG 组件。每个图标都支持 Tree-shaking 以减少打包体积，搜索界面让快速找到合适的图标变得轻松。',
      '使用 React、Next.js 和 Tailwind CSS 构建的现代 Web 项目的默认图标库。可用于创建导航栏、按钮图标、状态指示器和功能列表，为整个应用带来统一专业的外观。',
    ],
    slug: 'remove.bg',

    url: 'https://www.remove.bg/',
    category: 'design-resources',
    tags: ['background-removal', 'AI', 'photo'],
  },
  {
    title: 'TinyPNG',
    titleZh: 'TinyPNG',
    description: [
      'Smart lossy compression for WebP, PNG, and JPEG images — reduces file size dramatically while preserving visual quality.',
      'remove.bg uses AI to detect foreground subjects and remove image backgrounds in seconds — no manual selection or masking required. It handles hair, fur, and complex edges with surprising accuracy and offers API access for bulk processing.',
      'A huge timesaver for designers, ecommerce sellers, and marketers. Use it to create product photos with clean backgrounds, generate transparent PNGs for compositing, and prepare headshots for team pages and social profiles.',
    ],
    descriptionZh: [
      '智能有损压缩 WebP/PNG/JPEG 图片，在保持视觉质量的前提下大幅减小文件体积，是网页性能优化的常用工具。',
      'remove.bg 使用 AI 检测前景主体并在数秒内去除图片背景——无需手动选区或蒙版。处理头发、毛发和复杂边缘的精度令人惊讶，并提供 API 进行批量处理。',
      '设计师、电商卖家和营销人员的时间节省利器。可用于创建干净背景的产品照片、生成用于合成的透明 PNG 以及为团队页面和社交媒体准备头像。',
    ],
    slug: 'tinypng.com',

    url: 'https://tinypng.com/',
    category: 'design-resources',
    tags: ['compression', 'images', 'performance'],
  },
  {
    title: 'Squoosh',
    titleZh: 'Squoosh',
    description: [
      'Google\'s open-source image compression web app with side-by-side comparison, format conversion, and advanced codec options (MozJPEG, AVIF, WebP).',
      'TinyPNG uses smart lossy compression to reduce PNG, JPEG, and WebP file sizes by 50-80% while preserving visual quality. The WebP converter creates next-gen images for modern browsers, and the Photoshop plugin streamlines design workflows.',
      'A must-use step before deploying any website. Compress hero images, product photos, and icon sprites to improve page load speed and Core Web Vitals scores — without requiring build tool integration or CLI knowledge.',
    ],
    descriptionZh: [
      'Google 出品的开源图片压缩 Web 应用，支持左右对比、格式转换和高级编码器选项（MozJPEG、AVIF、WebP），所有处理在浏览器本地完成。',
      'TinyPNG 使用智能有损压缩将 PNG、JPEG 和 WebP 文件体积减少 50-80% 同时保持视觉质量。WebP 转换器为现代浏览器生成下一代图片，Photoshop 插件简化设计工作流。',
      '部署任何网站前的必经步骤。压缩首屏大图、产品照片和图标雪碧图以提升页面加载速度和 Core Web Vitals 评分——无需构建工具集成或 CLI 知识。',
    ],
    slug: 'squoosh.app',

    url: 'https://squoosh.app/',
    category: 'design-resources',
    tags: ['compression', 'images', 'Google'],
  },
  {
    title: 'ColorHunt',
    titleZh: 'ColorHunt',
    description: [
      'Curated collection of beautiful color palettes updated daily — browse, save, and copy hex codes for your next design project.',
      'Squoosh provides side-by-side before/after comparison across multiple codecs (MozJPEG, AVIF, WebP, PNG) with granular quality and effort sliders. All compression runs locally in the browser — no uploads to a server.',
      'Essential for performance-focused developers choosing the optimal format and compression level for each image. Use it to benchmark AVIF vs WebP quality at different sizes, generate compressed assets for a CMS, and understand the trade-offs between codec options.',
    ],
    descriptionZh: [
      '每日更新的精选配色方案集合，浏览、收藏和复制十六进制色码，为设计项目快速找到协调的色彩组合。',
      'Squoosh 提供多种编码器（MozJPEG、AVIF、WebP、PNG）的左右对比预览，可精细调节质量和压缩力度。所有压缩均在浏览器本地完成——无需上传至服务器。',
      '注重性能的开发者选择最优图片格式和压缩级别的必备工具。可用于对比不同尺寸下 AVIF 与 WebP 的画质、为 CMS 生成压缩资源以及理解各编码器的权衡取舍。',
    ],
    slug: 'colorhunt.co',

    url: 'https://colorhunt.co/',
    category: 'design-resources',
    tags: ['color', 'palette', 'inspiration'],
  },
  {
    title: 'Heroicons',
    titleZh: 'Heroicons',
    description: [
      'Beautiful hand-crafted SVG icons by the makers of Tailwind CSS — available in outline, solid, and mini styles for React and Vue.',
      'ColorHunt curates a hand-picked collection of beautiful, modern color palettes updated daily. Each palette has four colors optimized for UI design, with one-click hex code copying.',
      'A quick dose of color inspiration for designers and developers who need a fresh palette for a landing page, dashboard, or brand refresh. Save favorites to a personal collection and revisit them when starting new projects.',
    ],
    descriptionZh: [
      'Tailwind CSS 团队出品的精美手绘 SVG 图标，提供 outline、solid 和 mini 三种风格，原生支持 React 和 Vue。',
      'ColorHunt 每日更新精选的优美现代配色方案。每个调色板包含四个为 UI 设计优化的颜色，一键复制十六进制色码。',
      '为需要快速获取落地页、仪表盘或品牌焕新配色的设计师和开发者提供色彩灵感。收藏喜爱的方案到个人合集中，在启动新项目时随时回顾。',
    ],
    slug: 'heroicons.com',

    url: 'https://heroicons.com/',
    category: 'design-resources',
    tags: ['icons', 'SVG', 'Tailwind'],
  },
  {
    title: 'Haikei',
    titleZh: 'Haikei',
    description: [
      'Online SVG generators for creating blob shapes, waves, gradients, and abstract backgrounds — export as SVG or PNG, no sign-up needed.',
      'Heroicons offers over 300 free SVG icons in three styles — outline, solid, and mini — all designed on a consistent 24×24 grid. As the official icon set of Tailwind CSS, they integrate perfectly with utility-first workflows.',
      'Ideal for Tailwind CSS projects where visual consistency matters. Use outline icons for nav bars and form controls, solid icons for primary actions, and mini icons for dense UIs like data tables and breadcrumbs.',
    ],
    descriptionZh: [
      '在线 SVG 生成器，一键生成流体形状、波浪、渐变和抽象背景，可导出 SVG 或 PNG，无需注册即可使用。',
      'Heroicons 提供 300+ 免费 SVG 图标，三种风格——outline、solid 和 mini——全部基于统一的 24×24 网格设计。作为 Tailwind CSS 官方图标集，与 utility-first 工作流完美集成。',
      '适合注重视觉一致性的 Tailwind CSS 项目。Outline 风格适合导航栏和表单控件，Solid 风格适合主要操作按钮，Mini 风格适合数据表格和面包屑等高密度 UI。',
    ],
    slug: 'haikei.app',

    url: 'https://app.haikei.app/',
    category: 'design-resources',
    tags: ['SVG', 'generator', 'background'],
  },
  {
    title: 'Phosphor Icons',
    titleZh: 'Phosphor Icons',
    description: [
      'Flexible icon family with 1,400+ icons in 6 weights (thin, light, regular, bold, fill, duotone) — consistent, pixel-perfect, and framework-agnostic.',
      'Haikei generates customizable SVG backgrounds — waves, blobs, gradients, grids, and abstract shapes — with live preview and export to SVG or PNG. Every parameter is adjustable, giving each design a unique feel.',
      'A go-to resource for designers and developers who need hero backgrounds, section dividers, and decorative elements without creating them from scratch. The SVG output is resolution-independent and lightweight, keeping page load fast.',
    ],
    descriptionZh: [
      '灵活的图标家族，1400+ 图标 × 6 种粗细（thin/light/regular/bold/fill/duotone），风格统一、像素精确且跨框架友好。',
      'Haikei 生成可定制的 SVG 背景——波浪、流体形状、渐变、网格和抽象图形——实时预览并导出 SVG 或 PNG。每个参数都可调整，赋予每个设计独特的质感。',
      '设计师和开发者获取首屏背景、章节分割线和装饰元素的首选资源，无需从零创作。SVG 输出分辨率无关且轻量，保持页面加载快速。',
    ],
    slug: 'phosphoricons.com',

    url: 'https://phosphoricons.com/',
    category: 'design-resources',
    tags: ['icons', 'SVG', 'design-system'],
  },

  // ══════════════════════════════════════════════════════
  // ─── Productivity (continued) ───────────────────────
  // ══════════════════════════════════════════════════════
  {
    title: 'Warp',
    titleZh: 'Warp',
    description: [
      'Modern terminal with IDE-like editing, AI command suggestions, and collaborative workflows — reimagining the command line for the 2020s.',
      'Phosphor Icons offers 1,400+ icons in six weights — thin, light, regular, bold, fill, and duotone — giving designers flexibility to match any visual hierarchy. Icons are consistently designed, framework-agnostic, and available as React/Vue components or raw SVG.',
      'Excellent for projects that need more visual weight options than a typical icon set. Use thin icons for subtle UI hints, regular for standard navigation, bold for emphasized states, and duotone for feature highlights.',
    ],
    descriptionZh: [
      '现代化终端，支持 IDE 级文本编辑、AI 命令建议和协作工作流，重新定义了命令行工具的使用体验。',
      'Phosphor Icons 提供 1400+ 图标 × 六种粗细——thin、light、regular、bold、fill、duotone——让设计师灵活匹配任何视觉层级。图标设计一致、跨框架友好，支持 React/Vue 组件或原始 SVG。',
      '适合需要比普通图标集更多视觉层次选项的项目。Thin 适合微妙的 UI 提示，Regular 适合标准导航，Bold 适合强调状态，Duotone 适合功能亮点展示。',
    ],
    slug: 'warp.dev',

    url: 'https://www.warp.dev/',
    category: 'productivity',
    tags: ['terminal', 'AI', 'macOS'],
  },
  {
    title: 'Loom',
    titleZh: 'Loom',
    description: [
      'Instant screen and camera recording with shareable links — record product demos, bug reports, and async updates in one click.',
      'Warp modernizes the terminal with IDE-like text editing, AI-powered command suggestions, and a block-based output model that groups each command and its output. Warp Drive stores frequently used commands and workflows as shareable notebooks.',
      'A breath of fresh air for developers who spend hours in the terminal. Use it to edit multi-line commands like a document, search and copy from past output with a mouse, share debugging sessions with teammates, and leverage AI to recall tricky CLI flags.',
    ],
    descriptionZh: [
      '即时屏幕和摄像头录制工具，一键录制产品演示、Bug 复现和异步更新，通过链接即时分享，告别冗长的文字说明。',
      'Warp 以 IDE 级文本编辑、AI 命令建议和基于块的输出模型（将命令和输出分组）实现终端的现代化。Warp Drive 将常用命令和工作流存储为可分享的笔记本。',
      '对每天数小时泡在终端里的开发者来说是一股清流。可像编辑文档一样编辑多行命令、用鼠标搜索复制历史输出、与队友分享调试过程，以及通过 AI 回忆繁琐的 CLI 参数。',
    ],
    slug: 'loom.com',

    url: 'https://www.loom.com/',
    category: 'productivity',
    tags: ['video', 'async', 'communication'],
  },
  {
    title: 'CleanShot X',
    titleZh: 'CleanShot X',
    description: [
      'Premium macOS screenshot and screen-recording app with annotation, scrolling capture, and instant cloud upload — the ultimate screen capture toolkit.',
      'Loom records your screen, camera, and audio in one click, generating an instant shareable link. Viewers can react with emoji, leave timestamped comments, and watch at variable speed — transforming async communication.',
      'Invaluable for remote teams reporting bugs, walking through designs, recording sprint demos, and creating onboarding guides. Replace long Slack threads and meeting hours with watchable, rewindable video messages.',
    ],
    descriptionZh: [
      'macOS 高端截图与录屏工具，支持标注、滚动截屏和即时云端上传，是屏幕捕捉的终极工具箱。',
      'Loom 一键录制屏幕、摄像头和音频，即时生成可分享的链接。观看者可表情互动、在时间轴上留言评论并变速观看——彻底改变异步沟通方式。',
      '远程团队报告 Bug、演示设计、录制 Sprint Demo 和创建入职指南的利器。用可观看、可回放的视频消息替代冗长的 Slack 讨论和会议。',
    ],
    slug: 'cleanshot.com',

    url: 'https://cleanshot.com/',
    category: 'productivity',
    tags: ['screenshot', 'macOS', 'recording'],
  },
  {
    title: 'Slack',
    titleZh: 'Slack',
    description: [
      'Team communication platform with channels, threads, app integrations, and workflow automation — the standard for async team collaboration.',
      'CleanShot X is the definitive screenshot tool for macOS — capture scrolling content, record screen with audio, annotate with arrows and text, blur sensitive data, and upload to cloud for instant sharing. Every feature is accessible from a clean overlay menu.',
      'A must-have for macOS users who create documentation, tutorials, or bug reports. Use it to capture full-page web content, annotate screenshots for design feedback, record step-by-step product demos, and quickly share visuals with a link.',
    ],
    descriptionZh: [
      '团队沟通平台，支持频道、消息线程、应用集成和工作流自动化，是异步团队协作的行业标准工具。',
      'CleanShot X 是 macOS 上的终极截图工具——捕获滚动内容、录制带音频的屏幕、用箭头和文本标注、模糊敏感数据，并上传至云端即时分享。所有功能通过简洁的悬浮菜单访问。',
      '创建文档、教程或 Bug 报告的 macOS 用户必备。可用于截取整页网页内容、为设计反馈标注截图、录制分步产品演示以及快速用链接分享视觉内容。',
    ],
    slug: 'slack.com',

    url: 'https://slack.com/',
    category: 'productivity',
    tags: ['communication', 'team', 'chat'],
  },
  {
    title: 'Todoist',
    titleZh: 'Todoist',
    description: [
      'Cross-platform task manager with natural language input, project organization, priority levels, and karma productivity tracking.',
      'Slack organizes team communication into channels, with threaded replies, app integrations, and powerful search. Workflow Builder automates routine processes like onboarding checklists and standup reminders without writing code.',
      'The backbone of remote and hybrid team communication. Use channels to organize cross-functional projects, share code snippets and logs in engineering channels, integrate CI/CD alerts, and maintain a searchable archive of decisions and discussions.',
    ],
    descriptionZh: [
      '跨平台任务管理工具，支持自然语言输入、项目组织、优先级划分和 Karma 效率统计，简洁而强大。',
      'Slack 通过频道、消息线程、应用集成和强大搜索组织团队沟通。Workflow Builder 无需代码即可自动化入职清单、站会提醒等例行流程。',
      '远程和混合团队沟通的支柱。用频道组织跨职能项目、在工程频道分享代码片段和日志、集成 CI/CD 告警、维护可搜索的决策和讨论归档。',
    ],
    slug: 'todoist.com',

    url: 'https://todoist.com/',
    category: 'productivity',
    tags: ['tasks', 'GTD', 'cross-platform'],
  },
  {
    title: 'Mermaid',
    titleZh: 'Mermaid',
    description: [
      'JavaScript-based diagramming and charting tool that renders Markdown-inspired text definitions into flowcharts, sequence diagrams, and Gantt charts.',
      'Todoist supports natural language task entry ("meeting tomorrow at 3pm #work p1"), project organization, priority levels, labels, filters, and a Karma productivity tracking system. Cross-platform sync ensures tasks are accessible on every device.',
      'Ideal for individuals and small teams practicing GTD (Getting Things Done). Use projects for areas of responsibility, labels for context (@home, @office), priorities for daily triage, and Karma for motivation and habit building.',
    ],
    descriptionZh: [
      '基于 JavaScript 的图表工具，使用类似 Markdown 的文本语法即可生成流程图、时序图和甘特图，通过代码管理图表版本。',
      'Todoist 支持自然语言任务输入（"明天下午3点开会 #工作 p1"）、项目组织、优先级、标签、过滤器和 Karma 效率追踪系统。跨平台同步确保任务在所有设备上可用。',
      '适合践行 GTD（搞定）方法论的个人和小团队。用项目划分职责领域、用标签标注情境（@家、@办公室）、用优先级做每日分类、用 Karma 激励和养成习惯。',
    ],
    slug: 'mermaid.js.org',

    url: 'https://mermaid.js.org/',
    category: 'productivity',
    tags: ['diagrams', 'markdown', 'documentation'],
  },

  // ══════════════════════════════════════════════════════
  // ─── SEO & Marketing (continued) ────────────────────
  // ══════════════════════════════════════════════════════
  {
    title: 'Semrush',
    titleZh: 'Semrush',
    description: [
      'All-in-one digital marketing platform covering SEO, PPC, content marketing, social media, and competitive research — enterprise-grade insights.',
      'Mermaid renders diagrams from text — write Markdown-like syntax to generate flowcharts, sequence diagrams, class diagrams, Gantt charts, and more. It integrates with GitHub, Notion, Obsidian, and most static site generators.',
      'Essential for developers who version-control documentation alongside code. Embed Mermaid diagrams in README files, architecture decision records (ADRs), and API docs so diagrams stay up-to-date with code changes in every commit.',
    ],
    descriptionZh: [
      '一站式数字营销平台，覆盖 SEO、PPC、内容营销、社交媒体和竞品研究，提供企业级数据洞察。',
      'Mermaid 通过文本渲染图表——用类似 Markdown 的语法即可生成流程图、时序图、类图、甘特图等。集成 GitHub、Notion、Obsidian 及大多数静态站点生成器。',
      '将文档与代码一同纳入版本控制的开发者的必备工具。在 README、架构决策记录（ADR）和 API 文档中嵌入 Mermaid 图，使图表随代码变更在每次提交中保持最新。',
    ],
    slug: 'semrush.com',

    url: 'https://www.semrush.com/',
    category: 'seo-marketing',
    tags: ['SEO', 'PPC', 'competitive-research'],
  },
  {
    title: 'Google Trends',
    titleZh: 'Google Trends',
    description: [
      'Explore what the world is searching for — compare keyword popularity over time, by region, and discover rising topics for content inspiration.',
      'Semrush provides a unified platform for SEO, paid search, content marketing, social media, and competitive research. Its domain analytics reveal competitors\' traffic sources, ad budgets, and content strategies — all in one dashboard.',
      'The Swiss Army knife for digital marketing teams. Use it to research keyword difficulty, track daily SERP positions, audit on-page SEO, analyze competitor ad copy, and measure brand visibility across channels.',
    ],
    descriptionZh: [
      '探索全球搜索趋势，对比关键词随时间、地域的热度变化，发现上升话题为内容创作提供数据支撑。',
      'Semrush 提供 SEO、付费搜索、内容营销、社交媒体和竞品研究的统一平台。域名分析一站式展示竞品的流量来源、广告预算和内容策略。',
      '数字营销团队的瑞士军刀。可用于研究关键词难度、追踪每日 SERP 排名、审计页面 SEO、分析竞品广告文案以及衡量跨渠道品牌曝光。',
    ],
    slug: 'trends.google.com',

    url: 'https://trends.google.com/',
    category: 'seo-marketing',
    tags: ['trends', 'Google', 'research'],
  },
  {
    title: 'Moz',
    titleZh: 'Moz',
    description: [
      'Pioneer SEO software suite with Domain Authority (DA) metric, link explorer, keyword explorer, and on-page grader — trusted by marketers for over a decade.',
      'Google Trends visualizes search interest over time and across regions — compare multiple terms, see related queries and rising topics, and filter by category, country, and time range. Data is normalized on a 0-100 scale for comparison.',
      'Valuable for marketers timing seasonal campaigns, journalists identifying trending stories, and product teams validating demand. Use it to compare brand awareness against competitors, spot seasonal patterns for inventory planning, and find regional demand hotspots.',
    ],
    descriptionZh: [
      '老牌 SEO 工具套件，提供 Domain Authority（DA）权威度评分、链接分析、关键词研究和页面优化评分，深受营销人信赖。',
      'Google Trends 可视化搜索热度随时间与地域的变化——可对比多个关键词、查看相关查询和上升话题，并按类别、国家和时间范围过滤。数据归一化为 0-100 量表便于对比。',
      '对营销人员策划季节性活动、记者识别热门话题以及产品团队验证需求非常有价值。可用于对比品牌知名度与竞品、发现库存规划的季节性模式以及找到区域需求热点。',
    ],
    slug: 'moz.com',

    url: 'https://moz.com/',
    category: 'seo-marketing',
    tags: ['SEO', 'DA', 'link-research'],
  },
  {
    title: 'Keyword Surfer',
    titleZh: 'Keyword Surfer',
    description: [
      'Free Chrome extension that shows search volume and keyword suggestions directly in Google search results — the fastest way to size up a query.',
      'Moz pioneered Domain Authority (DA) — a score from 1-100 predicting how well a site will rank in search results. The platform includes Link Explorer, Keyword Explorer, and On-Page Grader, with a vibrant community and well-regarded Whiteboard Friday educational content.',
      'A staple for SEO practitioners who value educational content alongside tools. Use DA to qualify link prospects, Keyword Explorer to prioritize content topics by difficulty and volume, and the MozBar browser extension for on-the-fly page analysis.',
    ],
    descriptionZh: [
      '免费 Chrome 扩展，直接在 Google 搜索结果中显示搜索量和关键词建议，是最快的搜索需求评估方式。',
      'Moz 首创了 Domain Authority（DA）指标——1-100 的评分预测网站在搜索结果中的排名潜力。平台包括 Link Explorer、Keyword Explorer 和 On-Page Grader，以及充满活力的社区和备受好评的 Whiteboard Friday 教育内容。',
      '注重工具之外教育内容的 SEO 从业者的常用工具。可用 DA 筛选外链机会、Keyword Explorer 按难度和搜索量优排内容话题、MozBar 浏览器扩展实现即时的页面分析。',
    ],
    slug: 'surferseo.com',

    url: 'https://surferseo.com/keyword-surfer/',
    category: 'seo-marketing',
    tags: ['extension', 'keywords', 'free'],
  },
  {
    title: 'Schema.org',
    titleZh: 'Schema.org',
    description: [
      'The collaborative standard for structured data markup — reference vocabulary, examples, and validation for JSON-LD, Microdata, and RDFa rich results.',
      'Keyword Surfer is a free Chrome extension that overlays search volume, CPC, and keyword suggestions directly onto Google search results — no separate tool required. It also shows word count and keyword density data for ranking pages.',
      'The fastest way to assess keyword potential while browsing Google. Use it during content ideation to validate search demand, during competitor analysis to compare content length, and when writing to ensure keyword coverage without switching tabs.',
    ],
    descriptionZh: [
      '结构化数据标记的协作标准，提供 JSON-LD、Microdata 和 RDFa 富媒体搜索结果的词汇表、示例和验证参考。',
      'Keyword Surfer 是一款免费的 Chrome 扩展，直接在 Google 搜索结果上叠加显示搜索量、CPC 和关键词建议——无需打开独立工具。同时展示排名页面的字数和关键词密度数据。',
      '浏览 Google 时最快速评估关键词潜力的方式。可用于内容构思时验证搜索需求、竞品分析时对比内容长度、以及写作时确保关键词覆盖而不必切换标签页。',
    ],
    slug: 'schema.org',

    url: 'https://schema.org/',
    category: 'seo-marketing',
    tags: ['structured-data', 'SEO', 'JSON-LD'],
  },

  // ══════════════════════════════════════════════════════
  // ─── AI Tools (continued) ───────────────────────────
  // ══════════════════════════════════════════════════════
  {
    title: 'Cursor',
    titleZh: 'Cursor',
    description: [
      'AI-first code editor built on VS Code — chat with your codebase, generate entire features with context-aware prompts, and apply edits inline.',
      'Schema.org is the collaborative vocabulary for structured data markup, maintained by Google, Microsoft, Yahoo, and Yandex. It defines types and properties for JSON-LD, Microdata, and RDFa — powering rich results like recipe cards, review stars, event listings, and FAQ accordions.',
      'Essential reference for SEOs and web developers implementing structured data. Use it to look up correct property names for Article, Product, FAQ, Event, and Organization markup, validate JSON-LD snippets before deployment, and stay current with new rich-result types.',
    ],
    descriptionZh: [
      '基于 VS Code 的 AI 优先代码编辑器，可与整个代码库对话、根据上下文生成完整功能并内联应用修改，是 AI 编程的标杆工具。',
      'Schema.org 是由 Google、Microsoft、Yahoo 和 Yandex 共同维护的结构化数据标记协作词汇标准。定义了 JSON-LD、Microdata 和 RDFa 的类型与属性——驱动食谱卡片、评价星级、活动列表和 FAQ 折叠等富媒体搜索结果。',
      '实现结构化数据的 SEO 和 Web 开发者的必备参考。可用于查询 Article、Product、FAQ、Event、Organization 标记的正确属性名、在部署前验证 JSON-LD 代码片段以及跟进新的富媒体搜索结果类型。',
    ],
    slug: 'cursor.com',

    url: 'https://cursor.com/',
    category: 'ai-tools',
    tags: ['code-editor', 'AI', 'VS Code'],
  },
  {
    title: 'GitHub Copilot',
    titleZh: 'GitHub Copilot',
    description: [
      'AI pair programmer by GitHub — provides inline code suggestions, chat assistance, and agent mode directly in VS Code, JetBrains, and GitHub.com.',
      'Cursor is built on VS Code but adds deep AI integration — chat with your entire codebase, generate features with context-aware prompts, apply inline diffs, and use the "Composer" to create multi-file changes. It indexes your project for truly relevant suggestions.',
      'The AI-powered editor of choice for developers who want more than autocomplete. Use it to onboard to unfamiliar codebases faster, implement features by describing desired behavior, refactor legacy code with AI guidance, and review changes before committing.',
    ],
    descriptionZh: [
      'GitHub 推出的 AI 结对编程助手，在 VS Code、JetBrains 和 GitHub.com 中提供行内代码建议、对话辅助和 Agent 模式。',
      'Cursor 基于 VS Code 构建但增加了深度的 AI 集成——可与整个代码库对话、用上下文感知的提示生成功能、内联应用差异以及用"Composer"创建多文件更改。索引项目以提供真正相关的建议。',
      '不满足于简单自动补全的开发者的 AI 驱动编辑器首选。可用于更快上手不熟悉的代码库、通过描述期望行为实现功能、在 AI 引导下重构遗留代码以及提交前审查变更。',
    ],
    slug: 'github.copilot',

    url: 'https://github.com/features/copilot',
    category: 'ai-tools',
    tags: ['code-gen', 'GitHub', 'pair-programming'],
  },
  {
    title: 'Bolt.new',
    titleZh: 'Bolt.new',
    description: [
      'AI-powered full-stack app builder from StackBlitz — prompt, preview, and deploy web applications entirely in the browser with instant live previews.',
      'GitHub Copilot offers inline code completions, a chat panel for code questions, and an agent mode that can create files and run terminal commands. It works across VS Code, JetBrains IDEs, and GitHub.com with context from your repository structure.',
      'An essential pair-programming partner for developers writing boilerplate, implementing algorithms, writing tests, and exploring unfamiliar APIs. The chat mode helps explain complex code, suggest refactoring approaches, and generate documentation from existing functions.',
    ],
    descriptionZh: [
      'StackBlitz 出品的 AI 全栈应用构建工具，在浏览器中用自然语言描述即可生成、预览和部署 Web 应用，所见即所得。',
      'GitHub Copilot 提供行内代码补全、代码问答聊天面板以及可创建文件和运行终端命令的 Agent 模式。跨 VS Code、JetBrains IDE 和 GitHub.com 运行，并结合仓库结构提供上下文。',
      '开发者编写样板代码、实现算法、编写测试和探索不熟悉 API 的结对编程伙伴。聊天模式可帮助解释复杂代码、建议重构方案以及从现有函数生成文档。',
    ],
    slug: 'bolt.new',

    url: 'https://bolt.new/',
    category: 'ai-tools',
    tags: ['app-builder', 'full-stack', 'browser'],
  },
  {
    title: 'Replit',
    titleZh: 'Replit',
    description: [
      'Collaborative browser-based IDE with built-in hosting, AI code generation (Ghostwriter), and instant deployment — code from any device.',
      'Bolt.new generates complete full-stack web applications from a single prompt — with instant live preview, file explorer, and one-click deployment. It handles project setup, dependency installation, and hosting so you can go from idea to running app in minutes.',
      'Perfect for developers prototyping ideas, founders building MVPs, and designers creating interactive mockups. Use it to validate app concepts without writing boilerplate, generate quick internal tools, and create functional demos for stakeholder feedback.',
    ],
    descriptionZh: [
      '基于浏览器的协作式 IDE，内置托管、AI 代码生成和即时部署，无需本地环境即可在任何设备上编写和运行代码。',
      'Bolt.new 通过一个提示即可生成完整的全栈 Web 应用——即时实时预览、文件浏览器和一键部署。处理项目设置、依赖安装和托管，让你在数分钟内从想法到可运行的应用。',
      '适合原型验证想法的开发者、构建 MVP 的创始人和创建交互式原型的设者。可用于无需样板代码即可验证应用概念、快速生成内部工具以及创建用于利益相关者反馈的功能性演示。',
    ],
    slug: 'replit.com',

    url: 'https://replit.com/',
    category: 'ai-tools',
    tags: ['IDE', 'collaboration', 'browser'],
  },
  {
    title: 'ElevenLabs',
    titleZh: 'ElevenLabs',
    description: [
      'State-of-the-art AI text-to-speech and voice cloning platform — generate lifelike narration, dubbing, and custom voices in 29+ languages.',
      'Replit provides a full cloud IDE accessible from any browser — write, run, and deploy code without local setup. It includes AI-powered code completion (Ghostwriter), real-time collaboration, and one-click deployment with built-in hosting.',
      'Ideal for students learning to code, educators teaching programming, and developers who need a quick, disposable environment for experiments. Use it to prototype APIs, collaborate on coding interviews, run Python notebooks, and deploy simple web apps instantly.',
    ],
    descriptionZh: [
      '最先进的 AI 文字转语音与声音克隆平台，生成逼真的旁白、配音和自定义语音，支持 29+ 语言，语音自然度行业领先。',
      'Replit 提供可从任何浏览器访问的完整云端 IDE——无需本地设置即可编码、运行和部署。包含 AI 代码补全（Ghostwriter）、实时协作和带内置托管的一键部署。',
      '适合学习编程的学生、教授编程的教育者以及需要快速一次性环境的开发者。可用于原型 API、协作编程面试、运行 Python 笔记本以及即时部署简单的 Web 应用。',
    ],
    slug: 'elevenlabs.io',

    url: 'https://elevenlabs.io/',
    category: 'ai-tools',
    tags: ['TTS', 'voice', 'audio'],
  },
  {
    title: 'Suno',
    titleZh: 'Suno',
    description: [
      'AI music generation platform — describe a style, mood, or lyrics and get full songs with vocals, instrumentation, and production in seconds.',
      'ElevenLabs produces the most natural-sounding AI text-to-speech voices available, with support for 29+ languages, voice cloning from short samples, and fine-grained control over emotion, pacing, and intonation. The API enables programmatic voice generation at scale.',
      'A breakthrough tool for content creators producing voiceovers, podcasters generating intros, indie game developers adding character dialogue, and accessibility advocates creating audio versions of written content. The voice library features thousands of community-shared custom voices.',
    ],
    descriptionZh: [
      'AI 音乐生成平台，通过文字描述风格、情绪或歌词，秒级生成带人声、配器和制作的完整歌曲，让音乐创作变得人人可为。',
      'ElevenLabs 生成目前最自然的 AI 文字转语音，支持 29+ 语言、短样本声音克隆以及对情感、语调和节奏的精细控制。API 支持规模化编程式语音生成。',
      '内容创作者制作旁白、播客制作者生成片头、独立游戏开发者添加角色对话以及无障碍倡导者创建文字内容音频版的突破性工具。声音库包含数千个社区共享的自定义语音。',
    ],
    slug: 'suno.com',

    url: 'https://suno.com/',
    category: 'ai-tools',
    tags: ['music', 'generation', 'creative'],
  },
  {
    title: 'Gemini',
    titleZh: 'Gemini',
    description: [
      'Google\'s multimodal AI model with deep integration into Google Workspace, Gmail, and Search — powerful reasoning across text, images, code, and audio.',
      'Suno generates complete songs — with vocals, instrumentation, and production — from simple text descriptions. Specify genre, mood, tempo, and lyrical themes to create original music in seconds, no musical training required.',
      'Empowering for content creators needing royalty-free background music, indie developers adding soundtracks to games, and anyone curious about AI-assisted music creation. Use it to generate podcast intro music, video background tracks, and creative inspiration for songwriting.',
    ],
    descriptionZh: [
      'Google 推出的多模态 AI 模型，深度集成 Google Workspace、Gmail 和搜索，在文本、图片、代码和音频推理方面表现强大。',
      'Suno 通过简单的文字描述即可生成完整歌曲——带人声、配器和制作。指定流派、情绪、节奏和歌词主题，即可在秒级创建原创音乐，无需任何音乐训练。',
      '需要免版税背景音乐的内容创作者、为游戏添加配乐的独立开发者以及对 AI 辅助音乐创作感兴趣的人的赋能力工具。可用于生成播客开场音乐、视频背景曲和歌曲创作灵感。',
    ],
    slug: 'gemini.google.com',

    url: 'https://gemini.google.com/',
    category: 'ai-tools',
    tags: ['LLM', 'Google', 'multimodal'],
  },
  {
    title: 'Lovable',
    titleZh: 'Lovable',
    description: [
      'AI-powered app builder that generates production-ready web apps from a single prompt with instant preview and one-click GitHub sync.',
      'Gemini is Google\'s multimodal AI assistant, deeply integrated with Google Workspace — Gmail, Docs, Sheets, and Drive. It can reason across text, images, code, audio, and video, with a 1M-token context window for processing entire codebases or video transcripts.',
      'A natural choice for teams already using Google Workspace. Use it to summarize email threads, generate spreadsheet formulas, extract insights from meeting transcripts, draft documents from bullet points, and analyze data without leaving the tools you already use.',
    ],
    descriptionZh: [
      'AI 驱动的应用构建工具，通过一行描述即可生成生产级 Web 应用，支持即时预览和一键同步 GitHub。',
      'Gemini 是 Google 的多模态 AI 助手，深度集成 Google Workspace——Gmail、Docs、Sheets 和 Drive。可跨文本、图像、代码、音频和视频进行推理，100 万 token 上下文窗口可处理整个代码库或视频字幕。',
      '已在使用 Google Workspace 的团队的自然选择。可用于总结邮件线程、生成电子表格公式、从会议记录中提取洞察、通过要点起草文档以及无需离开已在使用的工具即可分析数据。',
    ],
    slug: 'lovable.dev',

    url: 'https://lovable.dev/',
    category: 'ai-tools',
    tags: ['app-builder', 'full-stack', 'code-gen'],
  },

  // ══════════════════════════════════════════════════════
  // ─── Ecommerce Tools (continued) ────────────────────
  // ══════════════════════════════════════════════════════
  {
    title: 'WooCommerce',
    titleZh: 'WooCommerce',
    description: [
      'Open-source ecommerce plugin for WordPress — powers millions of online stores with extensions for subscriptions, bookings, and memberships.',
      'Lovable generates complete web applications from natural language prompts — with visual preview, code export, and one-click GitHub sync. It focuses on producing maintainable, production-quality code rather than throwaway prototypes.',
      'Ideal for founders validating startup ideas, designers creating functional prototypes without engineering support, and developers accelerating the early stages of new projects. The GitHub sync enables a smooth transition from AI generation to manual development.',
    ],
    descriptionZh: [
      'WordPress 上的开源电商插件，支持订阅、预订和会员等扩展，驱动数百万个在线商店，适合已有 WordPress 站点的商家。',
      'Lovable 通过自然语言提示生成完整的 Web 应用——支持可视化预览、代码导出和一键同步 GitHub。专注于产出可维护的生产级代码而非一次性原型。',
      '适合验证创业点子的创始人、无需工程支持即可创建功能性原型的设计师以及加速新项目早期阶段的开发者。GitHub 同步功能实现从 AI 生成到手动开发的平稳过渡。',
    ],
    slug: 'woocommerce.com',

    url: 'https://woocommerce.com/',
    category: 'ecommerce-tools',
    tags: ['WordPress', 'plugin', 'open-source'],
  },
  {
    title: 'Stripe Fee Calculator',
    titleZh: 'Stripe Fee Calculator',
    description: [
      'ToolOrbit\'s Stripe Fee Calculator estimates processing fees for any transaction amount and region — displaying the exact net payout after Stripe\'s per-transaction and percentage-based charges.',
      'The calculator supports multiple regions with region-specific fee structures, including US, EU, UK, Australia, and more. Enter the transaction amount, select your region and account type, and instantly see the Stripe fee, net payout, and effective fee percentage.',
      'A practical tool for SaaS founders, ecommerce operators, and freelancers who process payments through Stripe. Use it to accurately forecast revenue after processing costs, set prices that account for payment fees, and compare Stripe costs across different regions.',
    ],
    descriptionZh: [
      'ToolOrbit 的 Stripe 费用计算器估算任意金额和地区的 Stripe 处理费用——直观展示扣除每笔交易固定费和百分比费率后的实际到账金额。',
      '计算器支持多个地区的费率结构，包括美国、欧盟、英国、澳大利亚等。输入交易金额、选择地区和账户类型，即可即时查看 Stripe 手续费、净收入和实际费率百分比。',
      'SaaS 创始人、电商运营者和通过 Stripe 收款的自由职业者的实用工具。可用于准确预测扣除支付成本后的实际收入、制定包含支付费用的定价以及对比不同地区的 Stripe 成本。',
    ],
    slug: 'toolorbit-stripe-fee',

    url: 'https://toolorbit.site/tools/ecommerce/stripe-fee-calculator',
    category: 'ecommerce-tools',
    tags: ['Stripe', 'fees', 'pricing'],
  },
  {
    title: 'Jungle Scout',
    titleZh: 'Jungle Scout',
    description: [
      'All-in-one Amazon seller platform for product research, keyword tracking, competitor intelligence, and sales analytics — data-driven FBA decisions.',
    ],
    descriptionZh: [
      '一站式 Amazon 卖家平台，覆盖产品调研、关键词追踪、竞品情报和销售分析，帮助 FBA 卖家做数据驱动的决策。',
    ],
    slug: 'junglescout.com',

    url: 'https://www.junglescout.com/',
    category: 'ecommerce-tools',
    tags: ['Amazon', 'FBA', 'product-research'],
  },
  {
    title: 'Lemon Squeezy',
    titleZh: 'Lemon Squeezy',
    description: [
      'All-in-one payments and merchant-of-record platform for SaaS and digital products — handles global tax compliance, invoicing, and subscriptions.',
      'Jungle Scout provides Amazon sellers with product research, keyword tracking, sales estimates, competitor analysis, and review monitoring. Its product database lets you filter millions of Amazon listings by demand, competition, and profitability to find winning product opportunities.',
      'Indispensable for Amazon FBA and FBM sellers at every stage — from product discovery to launch to scaling. Use it to validate product ideas with real sales data, track keyword rankings, monitor competitor inventory levels, and estimate revenue before investing in inventory.',
    ],
    descriptionZh: [
      '面向 SaaS 和数字产品的一站式支付与商家记录平台，处理全球税务合规、发票和订阅管理，让独立开发者无需操心合规事务。',
      'Jungle Scout 为 Amazon 卖家提供产品调研、关键词追踪、销量预估、竞品分析和评价监控。产品数据库可筛选数百万 Amazon 商品列表，按需求、竞争和盈利能力找到可盈利的产品机会。',
      'Amazon FBA 和 FBM 卖家从选品到启动到规模化各阶段都不可或缺。可用于通过真实销售数据验证产品创意、追踪关键词排名、监控竞品库存以及在大规模备货前预估收入。',
    ],
    slug: 'lemonsqueezy.com',

    url: 'https://www.lemonsqueezy.com/',
    category: 'ecommerce-tools',
    tags: ['payments', 'SaaS', 'tax-compliance'],
  },

  // ══════════════════════════════════════════════════════
  // ─── Learning Resources (continued) ─────────────────
  // ══════════════════════════════════════════════════════
  {
    title: 'Roadmap.sh',
    titleZh: 'Roadmap.sh',
    description: [
      'Community-created developer roadmaps with step-by-step learning paths for frontend, backend, DevOps, AI, and more — see what to learn next.',
      'Lemon Squeezy acts as a merchant of record — handling global tax compliance (VAT, GST, sales tax), invoicing, payment processing, and subscription management so creators and SaaS founders can focus on product, not compliance. It supports digital products, subscriptions, and license keys.',
      'A perfect fit for indie hackers, SaaS founders, and digital creators who sell globally. Use it to launch a paid product in hours, let the platform handle EU VAT and US sales tax, automate expiring license keys, and manage customer billing without building a billing system.',
    ],
    descriptionZh: [
      '社区创建的开发者学习路线图，覆盖前端、后端、DevOps、AI 等方向的循序渐进学习路径，帮助你明确下一步该学什么。',
      'Lemon Squeezy 承担商家记录角色——处理全球税务合规（VAT、GST、Sales Tax）、发票、支付处理和订阅管理，让创作者和 SaaS 创始人专注产品而非合规。支持数字产品、订阅和许可证密钥。',
      '适合独立开发者、SaaS 创始人和面向全球销售的数字创作者。可用于数小时内启动付费产品、让平台处理 EU VAT 和 US Sales Tax、自动化过期许可证密钥以及无需自建账单系统即可管理客户结算。',
    ],
    slug: 'roadmap.sh',

    url: 'https://roadmap.sh/',
    category: 'learning-resources',
    tags: ['roadmap', 'career', 'guide'],
  },
  {
    title: 'Frontend Mentor',
    titleZh: 'Frontend Mentor',
    description: [
      'Real-world frontend coding challenges with professional design files — practice HTML, CSS, and JavaScript by building projects from Figma-style mockups.',
      'Roadmap.sh provides community-curated, visual learning paths for every developer role — frontend, backend, DevOps, AI engineer, full-stack, and more. Each roadmap breaks down skills into a step-by-step progression with links to relevant learning resources.',
      'An orientation tool for developers planning their learning journey or career pivot. Use it to identify skill gaps, plan what to learn next, prepare for role transitions, and share a common learning plan with mentees or team members.',
    ],
    descriptionZh: [
      '真实前端编码挑战平台，提供专业设计稿，通过从 Figma 级原型构建项目来练习 HTML/CSS/JavaScript，即学即用。',
      'Roadmap.sh 提供社区策划的可视化学习路线——前端、后端、DevOps、AI 工程师、全栈等。每条路线将技能分解为循序渐进的步骤并附上相关学习资源链接。',
      '规划学习旅程或职业转型的开发者的导航工具。可用于识别技能短板、规划下一步学习内容、准备角色过渡以及与学员或团队成员分享共同的学习计划。',
    ],
    slug: 'frontendmentor.io',

    url: 'https://www.frontendmentor.io/',
    category: 'learning-resources',
    tags: ['frontend', 'challenges', 'practice'],
  },
  {
    title: 'LeetCode',
    titleZh: 'LeetCode',
    description: [
      'Coding interview preparation platform with 3,000+ algorithmic problems — used by FAANG and top tech candidates for data structures and algorithms practice.',
      'Frontend Mentor provides real-world coding challenges with professional Figma design files — build landing pages, multi-page sites, and interactive components from pixel-perfect mockups. Solutions can be submitted for community feedback.',
      'Ideal for frontend learners bridging the gap between tutorials and professional work. Use it to practice translating designs to code, build a portfolio of polished projects, receive code reviews from other developers, and gain confidence with responsive layout, forms, and accessibility.',
    ],
    descriptionZh: [
      '程序员面试刷题平台，3000+ 算法题目，FAANG 等顶级科技公司求职者的数据结构和算法练习首选。',
      'Frontend Mentor 提供真实世界的编码挑战，配套专业 Figma 设计稿——从像素级原型构建落地页、多页面站点和交互式组件。方案可提交获取社区反馈。',
      '适合弥合教程与专业工作之间差距的前端学习者。可用于练习设计稿转代码、构建精美的项目作品集、获得其他开发者的代码审查以及增强响应式布局、表单和无障碍方面的信心。',
    ],
    slug: 'leetcode.com',

    url: 'https://leetcode.com/',
    category: 'learning-resources',
    tags: ['algorithms', 'interviews', 'DSA'],
  },
  {
    title: 'JavaScript.info',
    titleZh: 'JavaScript.info',
    description: [
      'Comprehensive modern JavaScript tutorial from basics to advanced — widely regarded as the most thorough and well-structured JS learning resource.',
      'LeetCode hosts 3,000+ algorithmic problems with an online judge that evaluates solution correctness and efficiency. Problems are tagged by data structure, algorithm, and company — with contests, discussion forums, and company-specific question lists for interview preparation.',
      'The standard preparation platform for software engineering interviews, especially at large tech companies. Use it to practice data structures and algorithms, prepare for specific company interview loops, participate in weekly contests, and strengthen problem-solving skills.',
    ],
    descriptionZh: [
      '从基础到高级的现代 JavaScript 完整教程，被广泛认为是最全面、结构最清晰的 JS 学习资源。',
      'LeetCode 包含 3000+ 算法题目，在线判题系统评估解答的正确性和效率。题目按数据结构、算法和公司标签分类——配有竞赛、讨论论坛和针对不同公司的面试题库。',
      '软件工程师面试的标准准备平台，尤其针对大型科技公司。可用于练习数据结构和算法、针对特定公司面试流程准备、参加每周竞赛以及强化问题解决能力。',
    ],
    slug: 'javascript.info',

    url: 'https://javascript.info/',
    category: 'learning-resources',
    tags: ['JavaScript', 'tutorial', 'beginner'],
  },
  {
    title: 'Dev.to',
    titleZh: 'Dev.to',
    description: [
      'Inclusive developer community and blogging platform — thousands of articles daily on web dev, DevOps, AI, open source, and career topics.',
      'JavaScript.info is widely regarded as the most thorough, well-structured JavaScript tutorial — progressing from language fundamentals through browser APIs, DOM manipulation, events, networking, and advanced concepts like closures, prototypes, and async programming.',
      'The ideal resource for developers who want to deeply understand JavaScript rather than just use it. Work through chapters sequentially for a complete education, or use it as a reference for specific topics like Promises, modules, or the event loop.',
    ],
    descriptionZh: [
      '包容的开发者社区与博客平台，每日数千篇关于 Web 开发、DevOps、AI、开源和职业发展的文章，技术氛围友好。',
      'JavaScript.info 被广泛认为是最全面、结构最清晰的 JavaScript 教程——从语言基础到浏览器 API、DOM 操作、事件、网络请求以及闭包、原型和异步编程等高级概念。',
      '想要深入理解而非仅仅使用 JavaScript 的开发者的理想资源。可顺序学习各章节以获取完整教育，或作为 Promises、模块、事件循环等特定主题的参考资料。',
    ],
    slug: 'dev.to',

    url: 'https://dev.to/',
    category: 'learning-resources',
    tags: ['community', 'blog', 'discussion'],
  },
  {
    title: 'TypeScript Handbook',
    titleZh: 'TypeScript Handbook',
    description: [
      'The official TypeScript documentation — thorough walkthrough of the type system, utility types, module resolution, and compiler configuration.',
      'The handbook progresses from basic types through advanced patterns like conditional types, template literal types, and mapped types. Each section includes practical code examples and clear explanations of how TypeScript\'s type inference works in real-world scenarios.',
      'The essential reference for any TypeScript developer — from beginners learning the type system to experienced engineers looking up advanced patterns. Use it alongside your editor for instant type checking guidance and as the authoritative source for tsconfig options.',
    ],
    descriptionZh: [
      'TypeScript 官方手册，深入讲解类型系统、工具类型、模块解析和编译器配置，是 TS 学习者从入门到精通的必读文档。',
      '手册从基础类型逐步深入到条件类型、模板字面量类型和映射类型等高级模式。每个章节都包含实用的代码示例和清晰的原理解释，帮助理解 TypeScript 类型推断在实际场景中的工作方式。',
      '每个 TypeScript 开发者的必备参考——从学习类型系统的初学者到查阅高级模式的资深工程师。可在编辑器中随时查阅以获得即时类型检查指导，也是 tsconfig 配置选项的权威来源。',
    ],
    slug: 'typescriptlang.org',

    url: 'https://www.typescriptlang.org/docs/',
    category: 'learning-resources',
    tags: ['TypeScript', 'documentation', 'reference'],
  },
  {
    title: 'Exercism',
    titleZh: 'Exercism',
    description: [
      'Free coding practice platform with 70+ language tracks and human mentor feedback — solve exercises locally and get code reviews from volunteers.',
    ],
    descriptionZh: [
      '免费编程练习平台，70+ 语言赛道，提供人工导师反馈——在本地解题，由志愿者 mentor 提供代码审查，适合刻意练习。',
    ],
    slug: 'exercism.org',

    url: 'https://exercism.org/',
    category: 'learning-resources',
    tags: ['practice', 'mentoring', 'polyglot'],
  },

  // ══════════════════════════════════════════════════════
  // ─── Open Source (continued) ────────────────────────
  // ══════════════════════════════════════════════════════
  {
    title: 'Svelte',
    titleZh: 'Svelte',
    description: [
      'Compiler-first UI framework that shifts work from the browser to the build step — ships minimal JavaScript and delivers exceptional runtime performance.',
      'Exercism offers free coding exercises across 70+ language tracks with opt-in human mentor feedback on submitted solutions. Each exercise comes with automated tests and a community discussion where you can compare approaches after solving.',
      'Excellent for deliberate practice — choose a track, solve exercises at your own pace, submit for mentor review, and study other solutions to learn idiomatic patterns. The mentoring feedback loop accelerates skill development beyond what self-study alone can achieve.',
    ],
    descriptionZh: [
      '编译器优先的 UI 框架，将工作从浏览器转移到构建阶段，输出极少的 JavaScript，运行时性能卓越。',
      'Exercism 提供 70+ 语言赛道的免费编程练习，可选择接受人工导师对提交方案的反馈。每个练习都配有自动化测试和社区讨论，解答后可对比不同解法。',
      '刻意练习的绝佳平台——选择语言赛道、按自己节奏解题、提交导师评审、学习他人方案以掌握惯用法模式。导师反馈闭环可加速技能发展，超越单纯自学的效果。',
    ],
    slug: 'svelte.dev',

    url: 'https://svelte.dev/',
    category: 'open-source',
    tags: ['UI', 'compiler', 'framework'],
  },
  {
    title: 'TanStack Query',
    titleZh: 'TanStack Query',
    description: [
      'Powerful async state management for React, Vue, Solid, and Svelte — handles caching, background refetching, pagination, and mutations out of the box.',
      'Svelte shifts work from the browser to the compiler — producing highly optimized vanilla JavaScript that updates the DOM directly without a virtual DOM. The SvelteKit framework adds routing, SSR, and deployment adapters for a complete web development experience.',
      'A compelling choice for performance-sensitive applications and developers who value minimal boilerplate. Use it to build fast interactive UIs, create embeddable widgets with tiny bundle sizes, and ship applications with excellent runtime performance by default.',
    ],
    descriptionZh: [
      '强大的异步状态管理库，支持 React/Vue/Solid/Svelte，开箱即用地处理缓存、后台刷新、分页和变更操作，是服务端状态管理的事实标准。',
      'Svelte 将工作从浏览器转移到编译器——生成高度优化的原生 JavaScript，无需虚拟 DOM 直接更新真实 DOM。SvelteKit 框架添加路由、SSR 和部署适配器，形成完整的 Web 开发体验。',
      '对性能敏感的应用和重视最小化样板代码的开发者的理想选择。可用于构建快速的交互 UI、创建体积极小的可嵌入组件以及默认获得优秀的运行时性能。',
    ],
    slug: 'tanstack.com',

    url: 'https://tanstack.com/query',
    category: 'open-source',
    tags: ['state-management', 'caching', 'React'],
  },
  {
    title: 'Zod',
    titleZh: 'Zod',
    description: [
      'TypeScript-first schema declaration and validation library — define types once and get static type inference and runtime validation together.',
      'TanStack Query provides powerful async state management — caching, background refetching, pagination, optimistic updates, and offline support — with a consistent API across React, Vue, Solid, and Svelte. It eliminates the need for manual server state management and reduces API calls.',
      'Indispensable for frontend developers building data-driven applications. Use it to fetch, cache, and synchronize server state with minimal code, implement infinite scrolling with built-in pagination, and handle loading and error states declaratively.',
    ],
    descriptionZh: [
      'TypeScript 优先的 Schema 声明与验证库，一次定义即可同时获得静态类型推导和运行时校验，是 API 边界验证的首选方案。',
      'TanStack Query 提供强大的异步状态管理——缓存、后台刷新、分页、乐观更新和离线支持——跨 React、Vue、Solid 和 Svelte 提供一致的 API。消除了手动管理服务端状态的需求并减少 API 调用。',
      '构建数据驱动应用的前端开发者不可或缺。可用于用最少代码获取、缓存和同步服务端状态、通过内置分页实现无限滚动以及以声明方式处理加载和错误状态。',
    ],
    slug: 'zod.dev',

    url: 'https://zod.dev/',
    category: 'open-source',
    tags: ['validation', 'TypeScript', 'schema'],
  },
  {
    title: 'Zustand',
    titleZh: 'Zustand',
    description: [
      'Tiny, fast, and scalable state management for React — minimal boilerplate, no providers, and excellent TypeScript support.',
      'Zod lets you define TypeScript types and runtime validation schemas in one declaration — parsing data at API boundaries and automatically inferring static types from the schema. It supports complex validation, transformation, and error messages with full TypeScript integration.',
      'Essential for TypeScript projects that handle external data — API responses, form inputs, environment variables, and file parsing. Use it to validate at runtime what TypeScript guarantees at compile time, eliminating the gap between types and reality.',
    ],
    descriptionZh: [
      '小巧、快速且可扩展的 React 状态管理库，几乎无需模板代码、无需 Provider 包裹，TypeScript 支持出色。',
      'Zod 让你在一次声明中同时定义 TypeScript 类型和运行时校验 Schema——在 API 边界解析数据并自动从 Schema 推断静态类型。支持复杂校验、转换和错误消息，与 TypeScript 完全集成。',
      '处理外部数据的 TypeScript 项目必备——API 响应、表单输入、环境变量和文件解析。可用于在运行时验证 TypeScript 在编译时的保证，消除类型与现实之间的鸿沟。',
    ],
    slug: 'zustand.pmnd.rs',

    url: 'https://zustand-demo.pmnd.rs/',
    category: 'open-source',
    tags: ['state-management', 'React', 'lightweight'],
  },
  {
    title: 'Remix',
    titleZh: 'Remix',
    description: [
      'Full-stack React framework focused on web fundamentals with nested routing, server-side data loading, and progressive enhancement — now part of Shopify.',
      'Zustand is a tiny, fast, scalable state management library for React — no providers, no boilerplate, no action types. Create a store with a single function call and access state from any component with a hook, all with excellent TypeScript support.',
      'The modern alternative to Redux for developers who want simple state management without ceremony. Use it for global app state, component-level stores, transient UI state, and any scenario where prop drilling becomes painful. The tiny bundle size (under 1KB) makes it guilt-free.',
    ],
    descriptionZh: [
      '全栈 React 框架，聚焦 Web 基础，以嵌套路由、服务端数据加载和渐进增强为核心，现已并入 Shopify。',
      'Zustand 是一个小巧、快速、可扩展的 React 状态管理库——无 Provider、无模板代码、无 Action 类型。通过单个函数调用创建 Store，通过 Hook 在任何组件中访问状态，TypeScript 支持出色。',
      '想要简单状态管理而无仪式感的开发者的 Redux 现代化替代方案。可用于全局应用状态、组件级 Store、瞬时 UI 状态以及任何 prop 传递变得痛苦的场景。不到 1KB 的体积使其毫无负担。',
    ],
    slug: 'remix.run',

    url: 'https://remix.run/',
    category: 'open-source',
    tags: ['React', 'full-stack', 'Shopify'],
  },
  {
    title: 'Nuxt',
    titleZh: 'Nuxt',
    description: [
      'The intuitive Vue.js framework with hybrid rendering, auto-imports, file-based routing, and a rich module ecosystem — the Vue counterpart to Next.js.',
      'Remix is a full-stack React framework built on web fundamentals — server-side data loading with loaders, form mutations with actions, nested routing, and progressive enhancement. Now part of Shopify, it focuses on performance and resilience.',
      'A strong framework for developers who value web standards and want fine-grained control over the request/response cycle. Use it to build fast, resilient web apps with excellent SEO, optimistic UI with automatic error recovery, and form-based workflows that work without JavaScript.',
    ],
    descriptionZh: [
      '直观的 Vue.js 框架，支持混合渲染、自动导入、文件路由和丰富的模块生态，是 Vue 生态中的 Next.js 等价物。',
      'Remix 是基于 Web 基础的全栈 React 框架——通过 Loader 实现服务端数据加载、通过 Action 处理表单变更、嵌套路由和渐进增强。现已并入 Shopify，聚焦于性能和可靠性。',
      '重视 Web 标准并想要精细控制请求/响应周期的开发者的强力框架。可用于构建快速、有弹性的 Web 应用——卓越的 SEO、自动错误恢复的乐观 UI 以及在无 JavaScript 时仍可工作的基于表单的工作流。',
    ],
    slug: 'nuxt.com',

    url: 'https://nuxt.com/',
    category: 'open-source',
    tags: ['Vue', 'SSR', 'framework'],
  },
  {
    title: 'NestJS',
    titleZh: 'NestJS',
    description: [
      'Progressive Node.js framework for building scalable server-side applications — uses TypeScript, decorators, and dependency injection with an Angular-inspired architecture.',
      'Nuxt is the Vue.js meta-framework — providing hybrid rendering, auto-imports, file-based routing, and a rich module ecosystem. Nuxt 4 brings unified server/universal rendering, improved TypeScript support, and a new devtools experience.',
      'The natural choice for Vue developers building production applications. Use it to create SSR-powered marketing sites, SPAs with code-splitting out of the box, Jamstack sites with static generation, and full-stack apps with the Nitro server engine.',
    ],
    descriptionZh: [
      '渐进式 Node.js 服务端框架，使用 TypeScript、装饰器和依赖注入，架构借鉴 Angular，适合构建企业级后端应用。',
      'Nuxt 是 Vue.js 的元框架——提供混合渲染、自动导入、文件路由和丰富的模块生态。Nuxt 4 带来了统一的服务端/通用渲染、改进的 TypeScript 支持和全新的 DevTools 体验。',
      'Vue 开发者构建生产应用的天然选择。可用于创建 SSR 驱动的营销网站、内置代码分割的 SPA、静态生成的 Jamstack 站点以及基于 Nitro 服务端引擎的全栈应用。',
    ],
    slug: 'nestjs.com',

    url: 'https://nestjs.com/',
    category: 'open-source',
    tags: ['Node.js', 'backend', 'TypeScript'],
  },
  {
    title: 'Hono',
    titleZh: 'Hono',
    description: [
      'Ultrafast, lightweight web framework for edge runtimes — runs on Cloudflare Workers, Deno, Bun, and Node.js with a simple, familiar API.',
      'NestJS brings Angular-inspired architecture — modules, decorators, dependency injection, guards, interceptors, and pipes — to server-side Node.js development. It wraps Express or Fastify with a structured, opinionated framework built for enterprise applications.',
      'The go-to Node.js framework for teams building large-scale, maintainable backend services. Use it to create well-structured REST and GraphQL APIs, implement microservice architectures with built-in transport layers, and enforce consistent patterns across a team of developers.',
    ],
    descriptionZh: [
      '极速轻量的边缘运行时 Web 框架，可在 Cloudflare Workers、Deno、Bun 和 Node.js 上运行，API 简单易用。',
      'NestJS 将 Angular 风格的架构——模块、装饰器、依赖注入、守卫、拦截器和管道——引入服务端 Node.js 开发。以结构化、有主张的框架封装 Express 或 Fastify，专为企业级应用打造。',
      '构建大规模、可维护后端服务的团队的 Node.js 框架首选。可用于创建结构良好的 REST 和 GraphQL API、通过内置传输层实现微服务架构以及在开发团队中强制执行一致的模式。',
    ],
    slug: 'hono.dev',

    url: 'https://hono.dev/',
    category: 'open-source',
    tags: ['edge', 'framework', 'serverless'],
  },
  {
    title: 'Solid.js',
    titleZh: 'Solid.js',
    description: [
      'Reactive UI library that compiles to direct DOM updates — React-like developer experience with no virtual DOM and fine-grained reactivity.',
      'Hono is an ultrafast, lightweight web framework designed for edge runtimes — Cloudflare Workers, Deno, Bun, and Node.js. Its simple, familiar API and built-in middleware (JWT, CORS, validation) make it productive for small to medium-sized services.',
      'Ideal for developers building edge-native APIs, middleware, and serverless functions. Use it to create fast API gateways, webhook handlers, file upload endpoints, and authentication middlewares that run close to users with minimal cold-start latency.',
    ],
    descriptionZh: [
      '响应式 UI 库，编译为直接 DOM 更新——React 式的开发体验加上无虚拟 DOM 的细粒度响应式，性能极致。',
      'Hono 是一款为边缘运行时设计的极速轻量 Web 框架——支持 Cloudflare Workers、Deno、Bun 和 Node.js。简洁熟悉的 API 和内置中间件（JWT、CORS、校验）使其对中小型服务生产力极高。',
      '适合构建边缘原生 API、中间件和 Serverless 函数的开发者。可用于创建快速的 API 网关、Webhook 处理器、文件上传端点和认证中间件，以最小冷启动延迟在靠近用户处运行。',
    ],
    slug: 'solidjs.com',

    url: 'https://www.solidjs.com/',
    category: 'open-source',
    tags: ['UI', 'reactive', 'framework'],
  },
  {
    title: 'Vitest',
    titleZh: 'Vitest',
    description: [
      'Blazing-fast unit test framework powered by Vite — Jest-compatible API with native ESM, TypeScript, and HMR for instant test feedback.',
      'Solid.js offers React-like developer experience (JSX, hooks, components) with fine-grained reactivity and no virtual DOM — components compile to direct DOM update functions. This results in exceptional runtime performance without sacrificing developer ergonomics.',
      'A compelling choice for performance-critical applications where every millisecond matters. Use it to build data dashboards, interactive visualizations, and real-time applications that need to handle frequent updates without jank or excessive memory usage.',
    ],
    descriptionZh: [
      '基于 Vite 的极速单元测试框架，API 兼容 Jest，原生支持 ESM、TypeScript 和 HMR 即时反馈，让 TDD 体验更流畅。',
      'Solid.js 提供类 React 的开发体验（JSX、Hook、组件），同时具备细粒度响应式且无虚拟 DOM——组件编译为直接的 DOM 更新函数。在卓越运行时性能的同时不牺牲开发体验。',
      '对性能关键应用的理想选择。可用于构建数据仪表盘、交互式可视化和需要处理频繁更新而无卡顿或过度内存消耗的实时应用。',
    ],
    slug: 'vitest.dev',

    url: 'https://vitest.dev/',
    category: 'open-source',
    tags: ['testing', 'Vite', 'JavaScript'],
  },
  {
    title: 'Payload CMS',
    titleZh: 'Payload CMS',
    description: [
      'Open-source headless CMS and application framework built on Next.js — code-first configuration, TypeScript-native, with a powerful admin UI.',
      'Vitest is powered by Vite — providing instant hot module replacement for tests, Jest-compatible API, native ESM and TypeScript support, and built-in code coverage. Tests run in parallel by default with smart file-change detection for fast re-runs.',
      'The modern test framework for Vite-based projects and beyond. Use it to write unit, integration, and component tests with instant feedback, run tests as part of CI pipelines with deterministic output, and migrate from Jest with minimal configuration changes.',
    ],
    descriptionZh: [
      '基于 Next.js 的开源无头 CMS 和应用框架，代码优先配置、TypeScript 原生，配备强大的管理后台，是内容型应用的现代化选择。',
      'Vitest 基于 Vite 驱动——提供测试的即时热模块替换、兼容 Jest 的 API、原生 ESM 和 TypeScript 支持以及内置代码覆盖率。测试默认并行运行，智能检测文件变更以实现快速重跑。',
      '基于 Vite 的项目及其他场景的现代测试框架。可用于编写有即时反馈的单元、集成和组件测试，在 CI 流水线中以确定性输出运行测试，以及以最小配置变更从 Jest 迁移。',
    ],
    slug: 'payloadcms.com',

    url: 'https://payloadcms.com/',
    category: 'open-source',
    tags: ['CMS', 'Next.js', 'headless'],
  },
  {
    title: 'Tabler Icons',
    titleZh: 'Tabler Icons',
    description: [
      'Tabler Icons provides over 5,000 clean, consistent, customizable SVG icons — available as React, Vue, Svelte, and Figma components plus raw SVG. Each icon is designed on a 24×24 grid with a 2px stroke, ensuring visual harmony across every icon in a set.',
      'A comprehensive icon solution for projects that need more variety than smaller icon sets. Use it to build feature-rich dashboards, create icon-heavy admin panels, design mobile app navigation, and maintain visual consistency across a large product.',
      'The open-source nature means no licensing fees and full customization freedom. The consistent stroke width and grid alignment ensure icons from any category — arrows, devices, files, users, weather — look like they belong to the same family.',
    ],
    descriptionZh: [
      'Tabler Icons 提供超过 5000 个干净、一致、可定制的 SVG 图标——支持 React、Vue、Svelte、Figma 组件和原始 SVG。每个图标基于 24×24 网格和 2px 描边设计，确保整套图标的视觉和谐。',
      '需要比小型图标集更多种类的项目的全面图标解决方案。可用于构建功能丰富的仪表盘、创建图标密集的管理面板、设计移动应用导航以及在大规模产品中保持视觉一致性。',
      '开源意味着无授权费用和完全的自定义自由。统一的描边宽度和网格对齐确保任何类别的图标——箭头、设备、文件、用户、天气——看起来都属于同一个家族。',
    ],
    slug: 'tabler.io',

    url: 'https://tabler.io/icons',
    category: 'open-source',
    tags: ['icons', 'SVG', 'design-system'],
  },
];
