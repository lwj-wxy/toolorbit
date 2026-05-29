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
  title: string;
  titleZh: string;
  description: string;
  descriptionZh: string;
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
    description:
      'Microsoft\'s free, open-source code editor with a vast extension ecosystem, integrated terminal, and first-class Git support.',
    descriptionZh:
      '微软出品的免费开源代码编辑器，拥有庞大的插件生态、内置终端和一流的 Git 支持，是前端和后端开发者的首选编辑器。',
    url: 'https://code.visualstudio.com/',
    category: 'developer-tools',
    tags: ['editor', 'IDE', 'Microsoft'],
  },
  {
    title: 'GitHub',
    titleZh: 'GitHub',
    description:
      'The world\'s largest code hosting platform with version control, CI/CD via Actions, project management, and collaborative code review.',
    descriptionZh:
      '全球最大的代码托管平台，提供 Git 版本控制、Actions CI/CD 流水线、项目管理与协作代码审查，是开源社区的核心枢纽。',
    url: 'https://github.com/',
    category: 'developer-tools',
    tags: ['git', 'CI/CD', 'collaboration'],
  },
  {
    title: 'Postman',
    titleZh: 'Postman',
    description:
      'API development platform for designing, testing, documenting, and mocking REST, GraphQL, and gRPC APIs.',
    descriptionZh:
      'API 开发与测试平台，支持 REST、GraphQL 和 gRPC 接口的设计、调试、文档生成与 mock 服务，是后端联调利器。',
    url: 'https://www.postman.com/',
    category: 'developer-tools',
    tags: ['API', 'testing', 'REST'],
  },
  {
    title: 'Vercel',
    titleZh: 'Vercel',
    description:
      'Frontend deployment platform with instant preview URLs, serverless functions, edge computing, and analytics — purpose-built for Next.js.',
    descriptionZh:
      '前端部署平台，提供即时预览 URL、Serverless 函数、边缘计算和分析面板，与 Next.js 深度集成，适合快速上线和迭代。',
    url: 'https://vercel.com/',
    category: 'developer-tools',
    tags: ['deployment', 'Next.js', 'serverless'],
  },
  {
    title: 'Docker',
    titleZh: 'Docker',
    description:
      'Container platform for packaging applications with their dependencies into reproducible environments that run consistently across machines.',
    descriptionZh:
      '容器化平台，将应用及其依赖打包为可复现的镜像，确保开发、测试和生产环境一致，是现代 DevOps 的基础设施。',
    url: 'https://www.docker.com/',
    category: 'developer-tools',
    tags: ['container', 'DevOps', 'orchestration'],
  },
  {
    title: 'CodePen',
    titleZh: 'CodePen',
    description:
      'Online code playground for HTML, CSS, and JavaScript with live preview and community sharing — ideal for prototyping and debugging frontend ideas.',
    descriptionZh:
      '在线前端代码沙盒，支持 HTML、CSS、JavaScript 实时预览和社区分享，适合快速原型验证和片段调试。',
    url: 'https://codepen.io/',
    category: 'developer-tools',
    tags: ['playground', 'frontend', 'CSS'],
  },
  {
    title: 'Stack Overflow',
    titleZh: 'Stack Overflow',
    description:
      'The largest programming Q&A community where developers ask, answer, and vote on technical questions across every technology stack.',
    descriptionZh:
      '全球最大的编程问答社区，覆盖所有技术栈。遇到棘手 bug 时的第一站，大部分开发者的隐形导师。',
    url: 'https://stackoverflow.com/',
    category: 'developer-tools',
    tags: ['Q&A', 'community', 'debugging'],
  },
  {
    title: 'Railway',
    titleZh: 'Railway',
    description:
      'Modern deployment platform with one-click database provisioning (Postgres, Redis, MySQL), instant deploys from GitHub, and usage-based pricing.',
    descriptionZh:
      '现代部署平台，一键创建 Postgres、Redis、MySQL 等数据库，从 GitHub 即时部署，按用量计费，适合独立开发者和初创团队。',
    url: 'https://railway.app/',
    category: 'developer-tools',
    tags: ['deployment', 'database', 'cloud'],
  },

  // ─── Design Resources ──────────────────────────────
  {
    title: 'Figma',
    titleZh: 'Figma',
    description:
      'Collaborative browser-based UI/UX design tool with vector editing, prototyping, component libraries, and Dev Mode for handoff.',
    descriptionZh:
      '基于浏览器的协作式 UI/UX 设计工具，支持矢量编辑、交互原型、组件库和 Dev Mode 开发交付，已成为行业标准设计平台。',
    url: 'https://www.figma.com/',
    category: 'design-resources',
    tags: ['UI', 'UX', 'prototyping'],
  },
  {
    title: 'Dribbble',
    titleZh: 'Dribbble',
    description:
      'Design portfolio and inspiration platform where UI/UX designers, illustrators, and brand designers showcase work and discover trends.',
    descriptionZh:
      '设计作品展示与灵感平台，UI/UX 设计师、插画师和品牌设计师在此发布作品、发现趋势和寻找创意参考。',
    url: 'https://dribbble.com/',
    category: 'design-resources',
    tags: ['inspiration', 'portfolio', 'UI'],
  },
  {
    title: 'Coolors',
    titleZh: 'Coolors',
    description:
      'Fast color palette generator with lock, shade, and export features. Generate harmonious palettes with a spacebar tap.',
    descriptionZh:
      '快速配色方案生成器，按空格键即可生成协调的调色板，支持锁定颜色、调整色阶和导出，是设计配色效率神器。',
    url: 'https://coolors.co/',
    category: 'design-resources',
    tags: ['color', 'palette', 'generator'],
  },
  {
    title: 'Unsplash',
    titleZh: 'Unsplash',
    description:
      'Free high-resolution stock photography library with millions of curated images under a permissive license — no attribution required.',
    descriptionZh:
      '免费高清图库，数百万张精选摄影作品可自由使用（无需署名），适合网站配图、社交媒体素材和产品原型填充。',
    url: 'https://unsplash.com/',
    category: 'design-resources',
    tags: ['photos', 'stock', 'free'],
  },
  {
    title: 'Google Fonts',
    titleZh: 'Google Fonts',
    description:
      'Free, open-source web font library with 1,500+ typeface families, variable font support, and CSS/HTML embed snippets.',
    descriptionZh:
      '免费开源的 Web 字体库，提供 1500+ 字体家族，支持可变字体和 CSS 嵌入代码，是 Web 排版的首选资源。',
    url: 'https://fonts.google.com/',
    category: 'design-resources',
    tags: ['fonts', 'typography', 'web'],
  },
  {
    title: 'Excalidraw',
    titleZh: 'Excalidraw',
    description:
      'Open-source virtual whiteboard with hand-drawn style for sketching diagrams, wireframes, and flowcharts collaboratively.',
    descriptionZh:
      '开源虚拟白板，手绘风格独特，适合画流程图、线框图和架构图，支持多人协作，是技术文档配图的优雅方案。',
    url: 'https://excalidraw.com/',
    category: 'design-resources',
    tags: ['whiteboard', 'diagram', 'open-source'],
  },

  // ─── Productivity ──────────────────────────────────
  {
    title: 'Notion',
    titleZh: 'Notion',
    description:
      'All-in-one workspace for notes, docs, databases, wikis, and project management with powerful block-based editing and team collaboration.',
    descriptionZh:
      '一体化工作空间，融合笔记、文档、数据库、Wiki 和项目管理，以块编辑器著称，适合个人知识管理和团队协作。',
    url: 'https://www.notion.so/',
    category: 'productivity',
    tags: ['notes', 'wiki', 'collaboration'],
  },
  {
    title: 'Obsidian',
    titleZh: 'Obsidian',
    description:
      'Local-first knowledge base built on plain Markdown files with bidirectional linking, graph view, and a rich plugin ecosystem.',
    descriptionZh:
      '基于本地 Markdown 文件的知识库工具，支持双向链接、图谱视图和丰富的插件生态，适合打造个人第二大脑。',
    url: 'https://obsidian.md/',
    category: 'productivity',
    tags: ['notes', 'markdown', 'knowledge-base'],
  },
  {
    title: 'Linear',
    titleZh: 'Linear',
    description:
      'Fast issue tracking and project management tool purpose-built for software teams, with keyboard-first workflows and sleek design.',
    descriptionZh:
      '为软件团队打造的极速项目管理与 issue 追踪工具，键盘优先的操作逻辑和极简设计，让 Sprint 管理不再笨重。',
    url: 'https://linear.app/',
    category: 'productivity',
    tags: ['project-management', 'issue-tracking', 'agile'],
  },
  {
    title: 'Raycast',
    titleZh: 'Raycast',
    description:
      'Blazing-fast macOS launcher and productivity toolkit with extensions for clipboard history, window management, snippets, and API integrations.',
    descriptionZh:
      '极致流畅的 macOS 启动器与效率工具箱，集成剪贴板历史、窗口管理、代码片段和 API 扩展，大幅减少日常操作耗时。',
    url: 'https://www.raycast.com/',
    category: 'productivity',
    tags: ['launcher', 'macOS', 'extensions'],
  },
  {
    title: 'draw.io',
    titleZh: 'draw.io',
    description:
      'Free online diagramming tool for flowcharts, UML, network diagrams, and org charts. Works fully offline and integrates with cloud storage.',
    descriptionZh:
      '免费在线绘图工具，支持流程图、UML、网络拓扑和组织架构图，可完全离线使用并集成云存储，是技术绘图瑞士军刀。',
    url: 'https://app.diagrams.net/',
    category: 'productivity',
    tags: ['diagrams', 'flowchart', 'UML'],
  },

  // ─── SEO & Marketing ───────────────────────────────
  {
    title: 'Google Search Console',
    titleZh: 'Google Search Console',
    description:
      'Free Google tool for monitoring site indexation, search performance, Core Web Vitals, and manual actions — essential for every website owner.',
    descriptionZh:
      'Google 官方免费工具，监控网站索引状态、搜索表现、Core Web Vitals 和人工处理措施，是每个网站运营者的必备工具。',
    url: 'https://search.google.com/search-console',
    category: 'seo-marketing',
    tags: ['Google', 'indexation', 'performance'],
  },
  {
    title: 'Ahrefs',
    titleZh: 'Ahrefs',
    description:
      'Comprehensive SEO platform with backlink analysis, keyword research, rank tracking, and content gap tools — widely used by SEO professionals.',
    descriptionZh:
      '综合性 SEO 平台，提供反向链接分析、关键词研究、排名追踪和内容缺口分析等全套工具，是 SEO 从业者的行业标配。',
    url: 'https://ahrefs.com/',
    category: 'seo-marketing',
    tags: ['backlinks', 'keywords', 'rank-tracking'],
  },
  {
    title: 'PageSpeed Insights',
    titleZh: 'PageSpeed Insights',
    description:
      'Google tool for measuring page load performance and Core Web Vitals (LCP, INP, CLS) with both lab data and real-user field data from CrUX.',
    descriptionZh:
      'Google 页面性能分析工具，基于 CrUX 真实用户数据评估 LCP、INP、CLS 等 Core Web Vitals 指标，并给出优化建议。',
    url: 'https://pagespeed.web.dev/',
    category: 'seo-marketing',
    tags: ['performance', 'CWV', 'Google'],
  },
  {
    title: 'Screaming Frog',
    titleZh: 'Screaming Frog',
    description:
      'Desktop SEO crawler that audits on-page elements, redirects, broken links, duplicate content, and hreflang — ideal for technical SEO audits.',
    descriptionZh:
      '桌面端 SEO 爬虫工具，审计页面元素、重定向、死链、重复内容和 hreflang 标签，是技术 SEO 审计的行业利器。',
    url: 'https://www.screamingfrog.co.uk/seo-spider/',
    category: 'seo-marketing',
    tags: ['crawler', 'technical-SEO', 'audit'],
  },
  {
    title: 'AnswerThePublic',
    titleZh: 'AnswerThePublic',
    description:
      'Search-listening tool that visualizes real questions people ask around a keyword — perfect for content ideation and FAQ research.',
    descriptionZh:
      '搜索倾听工具，将用户围绕关键词提出的真实问题可视化为思维导图，是内容选题和 FAQ 调研的灵感引擎。',
    url: 'https://answerthepublic.com/',
    category: 'seo-marketing',
    tags: ['content', 'keyword-research', 'questions'],
  },

  // ─── AI Tools ──────────────────────────────────────
  {
    title: 'Claude',
    titleZh: 'Claude',
    description:
      'Anthropic\'s AI assistant with long-context reasoning, code generation, and document analysis — available via claude.ai and API.',
    descriptionZh:
      'Anthropic 出品的 AI 助手，擅长长文本推理、代码生成和文档分析，可通过 claude.ai 网页版和 API 使用。',
    url: 'https://claude.ai/',
    category: 'ai-tools',
    tags: ['LLM', 'chat', 'coding'],
  },
  {
    title: 'ChatGPT',
    titleZh: 'ChatGPT',
    description:
      'OpenAI\'s conversational AI platform with GPT-4, DALL·E image generation, code interpreter, custom GPTs, and an expanding plugin ecosystem.',
    descriptionZh:
      'OpenAI 的对话式 AI 平台，集成了 GPT-4 推理、DALL·E 图像生成、代码解释器和自定义 GPTs，是最广泛使用的 AI 助手。',
    url: 'https://chatgpt.com/',
    category: 'ai-tools',
    tags: ['LLM', 'chat', 'generation'],
  },
  {
    title: 'Hugging Face',
    titleZh: 'Hugging Face',
    description:
      'Open-source AI community and model hub hosting 500K+ models, datasets, and interactive demos (Spaces) for NLP, vision, and audio tasks.',
    descriptionZh:
      '开源 AI 社区和模型中心，托管 50 万+模型、数据集和在线演示（Spaces），覆盖 NLP、CV 和音频等全领域。',
    url: 'https://huggingface.co/',
    category: 'ai-tools',
    tags: ['models', 'open-source', 'ML'],
  },
  {
    title: 'Perplexity',
    titleZh: 'Perplexity',
    description:
      'AI-powered search engine that synthesizes answers from real-time web sources with inline citations — a research-first alternative to chat-based AI.',
    descriptionZh:
      'AI 搜索引擎，从实时网络来源综合答案并附上行内引用，是研究型搜索场景下传统聊天 AI 的有力替代方案。',
    url: 'https://www.perplexity.ai/',
    category: 'ai-tools',
    tags: ['search', 'research', 'citations'],
  },
  {
    title: 'Midjourney',
    titleZh: 'Midjourney',
    description:
      'AI image generation platform accessible via Discord, known for high aesthetic quality, artistic control, and style-reference features.',
    descriptionZh:
      '通过 Discord 使用的 AI 图像生成平台，以高美学品质、艺术风格控制和风格参考功能著称，是设计师和创意者的利器。',
    url: 'https://www.midjourney.com/',
    category: 'ai-tools',
    tags: ['image-generation', 'art', 'creative'],
  },
  {
    title: 'v0 by Vercel',
    titleZh: 'Vercel v0',
    description:
      'Generative UI tool that turns natural-language prompts into production-ready React/Tailwind components — ideal for rapid UI prototyping.',
    descriptionZh:
      '生成式 UI 工具，用自然语言描述即可生成生产级 React/Tailwind 组件代码，适合快速界面原型和前端开发加速。',
    url: 'https://v0.dev/',
    category: 'ai-tools',
    tags: ['UI', 'React', 'code-gen'],
  },

  // ─── Ecommerce Tools ──────────────────────────────
  {
    title: 'Shopify',
    titleZh: 'Shopify',
    description:
      'Leading ecommerce platform for building online stores with integrated payments, inventory management, shipping, and a rich app marketplace.',
    descriptionZh:
      '领先的电商建站平台，集成支付、库存管理、物流和应用市场，适合从独立站新手到规模化品牌的全阶段商家。',
    url: 'https://www.shopify.com/',
    category: 'ecommerce-tools',
    tags: ['platform', 'payments', 'store'],
  },
  {
    title: 'Stripe',
    titleZh: 'Stripe',
    description:
      'Developer-first payment processing platform with APIs for online payments, subscriptions, invoicing, and fraud detection — supporting 135+ currencies.',
    descriptionZh:
      '面向开发者的支付处理平台，提供在线支付、订阅、发票和风控 API，支持 135+ 货币，是 SaaS 和电商集成的首选。',
    url: 'https://stripe.com/',
    category: 'ecommerce-tools',
    tags: ['payments', 'API', 'subscriptions'],
  },
  {
    title: 'Etsy Fee Calculator',
    titleZh: 'Etsy Fee Calculator',
    description:
      'Estimate Etsy selling fees including listing, transaction, and payment processing costs to accurately price products and forecast profit margins.',
    descriptionZh:
      '估算 Etsy 销售费用，包括上架费、交易费和支付处理费，帮助卖家精确定价并预测利润空间。',
    url: 'https://toolorbit.site/tools/ecommerce/etsy-fee-calculator',
    category: 'ecommerce-tools',
    tags: ['Etsy', 'fees', 'pricing'],
  },
  {
    title: 'Printful',
    titleZh: 'Printful',
    description:
      'Print-on-demand and dropshipping fulfillment service that prints and ships custom apparel, accessories, and home goods directly to customers.',
    descriptionZh:
      '按需打印与代发货履约平台，支持定制服装、配饰和家居用品，直发终端客户，无需囤货即可启动品牌电商。',
    url: 'https://www.printful.com/',
    category: 'ecommerce-tools',
    tags: ['POD', 'dropshipping', 'fulfillment'],
  },

  // ─── Learning Resources ────────────────────────────
  {
    title: 'MDN Web Docs',
    titleZh: 'MDN Web Docs',
    description:
      'Mozilla\'s definitive reference for HTML, CSS, and JavaScript with browser-compatibility tables, interactive examples, and standards-track documentation.',
    descriptionZh:
      'Mozilla 维护的 HTML、CSS、JavaScript 权威参考文档，提供浏览器兼容性表格和交互示例，是 Web 开发者的百科全书。',
    url: 'https://developer.mozilla.org/',
    category: 'learning-resources',
    tags: ['documentation', 'web', 'frontend'],
  },
  {
    title: 'freeCodeCamp',
    titleZh: 'freeCodeCamp',
    description:
      'Free coding curriculum with 10+ certifications covering web development, data science, and machine learning — supported by a global community.',
    descriptionZh:
      '免费编程课程平台，提供 10+ 认证方向，涵盖 Web 开发、数据科学和机器学习，配套活跃的全球学习社区。',
    url: 'https://www.freecodecamp.org/',
    category: 'learning-resources',
    tags: ['courses', 'certification', 'beginner'],
  },
  {
    title: 'CSS-Tricks',
    titleZh: 'CSS-Tricks',
    description:
      'Long-running CSS blog with in-depth guides, almanac entries, and practical tips on modern CSS layout, animation, and responsive design.',
    descriptionZh:
      '资深 CSS 技术博客，提供深入的 CSS 布局、动画和响应式设计教程与速查手册，是前端开发者进阶的宝藏资源。',
    url: 'https://css-tricks.com/',
    category: 'learning-resources',
    tags: ['CSS', 'frontend', 'blog'],
  },
  {
    title: 'The Odin Project',
    titleZh: 'The Odin Project',
    description:
      'Free full-stack curriculum that teaches web development through hands-on projects — Ruby on Rails and JavaScript/Node.js paths available.',
    descriptionZh:
      '免费全栈 Web 开发课程，通过构建真实项目来学习，提供 Ruby on Rails 和 JavaScript/Node.js 两条路径。',
    url: 'https://www.theodinproject.com/',
    category: 'learning-resources',
    tags: ['full-stack', 'curriculum', 'project-based'],
  },
  {
    title: 'Smashing Magazine',
    titleZh: 'Smashing Magazine',
    description:
      'Professional web design and development publication with articles on UX, frontend, performance, accessibility, and design systems.',
    descriptionZh:
      '专业 Web 设计与开发杂志，覆盖 UX、前端、性能优化、无障碍和设计系统等主题，文章质量在行业内备受推崇。',
    url: 'https://www.smashingmagazine.com/',
    category: 'learning-resources',
    tags: ['design', 'frontend', 'UX'],
  },

  // ─── Open Source ──────────────────────────────────
  {
    title: 'React',
    titleZh: 'React',
    description:
      'Meta\'s JavaScript library for building component-based user interfaces with a declarative programming model and a vast ecosystem.',
    descriptionZh:
      'Meta（Facebook）推出的 JavaScript UI 库，基于组件化和声明式编程模型，拥有最庞大的前端生态和社区。',
    url: 'https://react.dev/',
    category: 'open-source',
    tags: ['UI', 'JavaScript', 'frontend'],
  },
  {
    title: 'Next.js',
    titleZh: 'Next.js',
    description:
      'Vercel\'s React framework with server-side rendering, static generation, file-based routing, and API routes — the default choice for modern React apps.',
    descriptionZh:
      'Vercel 推出的 React 框架，内置 SSR、静态生成、文件路由和 API 路由，是现代 React 应用开发的默认起点。',
    url: 'https://nextjs.org/',
    category: 'open-source',
    tags: ['React', 'SSR', 'framework'],
  },
  {
    title: 'Tailwind CSS',
    titleZh: 'Tailwind CSS',
    description:
      'Utility-first CSS framework for rapidly building custom designs directly in HTML markup with responsive, state-variant, and dark-mode utilities.',
    descriptionZh:
      'Utility-first CSS 框架，直接在 HTML 中通过类名构建自定义设计，内置响应式、状态变体和深色模式支持。',
    url: 'https://tailwindcss.com/',
    category: 'open-source',
    tags: ['CSS', 'framework', 'design-system'],
  },
  {
    title: 'shadcn/ui',
    titleZh: 'shadcn/ui',
    description:
      'Component collection and code distribution platform — copy-paste beautifully designed, accessible React components built on Radix UI and Tailwind.',
    descriptionZh:
      '组件集合与代码分发平台，通过复制粘贴即可使用基于 Radix UI 和 Tailwind 构建的精美、无障碍 React 组件。',
    url: 'https://ui.shadcn.com/',
    category: 'open-source',
    tags: ['React', 'components', 'Tailwind'],
  },
  {
    title: 'Supabase',
    titleZh: 'Supabase',
    description:
      'Open-source Firebase alternative offering Postgres database, authentication, real-time subscriptions, storage, and edge functions with generous free tier.',
    descriptionZh:
      '开源的 Firebase 替代方案，提供 Postgres 数据库、认证、实时订阅、存储和边缘函数，免费额度慷慨，适合快速搭建应用后端。',
    url: 'https://supabase.com/',
    category: 'open-source',
    tags: ['database', 'BaaS', 'Postgres'],
  },
  {
    title: 'Vue.js',
    titleZh: 'Vue.js',
    description:
      'Progressive JavaScript framework with an approachable learning curve, reactive data binding, and a flexible composition API for building UIs.',
    descriptionZh:
      '渐进式 JavaScript 框架，学习曲线平缓，具备响应式数据绑定和灵活的 Composition API，深受中文社区和中小团队的喜爱。',
    url: 'https://vuejs.org/',
    category: 'open-source',
    tags: ['JavaScript', 'framework', 'UI'],
  },
  {
    title: 'tRPC',
    titleZh: 'tRPC',
    description:
      'End-to-end typesafe API framework that shares TypeScript types between server and client without code generation — zero-rest, full IntelliSense.',
    descriptionZh:
      '端到端类型安全的 API 框架，无需代码生成即可在服务端和客户端之间共享 TypeScript 类型，享受完整的 IDE 智能提示。',
    url: 'https://trpc.io/',
    category: 'open-source',
    tags: ['TypeScript', 'API', 'typesafe'],
  },
  {
    title: 'Astro',
    titleZh: 'Astro',
    description:
      'Content-focused web framework that ships zero JavaScript by default, with island-architecture hydration for interactive components when needed.',
    descriptionZh:
      '以内容为中心的 Web 框架，默认输出零 JavaScript，按需通过岛屿架构水合交互组件，是内容站和博客的极佳选择。',
    url: 'https://astro.build/',
    category: 'open-source',
    tags: ['SSG', 'framework', 'content'],
  },
];
