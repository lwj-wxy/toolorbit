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

  // ══════════════════════════════════════════════════════
  // ─── Developer Tools (continued) ────────────────────
  // ══════════════════════════════════════════════════════
  {
    title: 'Bun',
    titleZh: 'Bun',
    description:
      'Fast all-in-one JavaScript runtime, bundler, test runner, and package manager — drop-in Node.js replacement with native TypeScript support.',
    descriptionZh:
      '极速一体化 JavaScript 运行时，集打包器、测试运行器和包管理器于一身，原生支持 TypeScript，可替代 Node.js。',
    url: 'https://bun.sh/',
    category: 'developer-tools',
    tags: ['runtime', 'JavaScript', 'bundler'],
  },
  {
    title: 'Biome',
    titleZh: 'Biome',
    description:
      'Fast formatter and linter for JavaScript, TypeScript, JSX, and JSON — unified toolchain replacing ESLint + Prettier with near-instant performance.',
    descriptionZh:
      '极速的 JS/TS/JSX/JSON 格式化和 Lint 工具，统一替代 ESLint + Prettier 组合，性能接近即时完成。',
    url: 'https://biomejs.dev/',
    category: 'developer-tools',
    tags: ['formatter', 'linter', 'toolchain'],
  },
  {
    title: 'Playwright',
    titleZh: 'Playwright',
    description:
      'Microsoft\'s end-to-end testing framework with auto-wait, trace viewer, and cross-browser support (Chromium, Firefox, WebKit) — reliable UI testing at scale.',
    descriptionZh:
      '微软出品的端到端测试框架，支持自动等待、Trace 回放和跨浏览器（Chromium/Firefox/WebKit），是可靠的规模化 UI 测试方案。',
    url: 'https://playwright.dev/',
    category: 'developer-tools',
    tags: ['testing', 'e2e', 'Microsoft'],
  },
  {
    title: 'Prisma',
    titleZh: 'Prisma',
    description:
      'Next-generation Node.js and TypeScript ORM with auto-generated type-safe query builder, schema migrations, and a visual database browser.',
    descriptionZh:
      '新一代 Node.js/TypeScript ORM，自动生成类型安全的查询构建器，支持 Schema 迁移和可视化数据库浏览器。',
    url: 'https://www.prisma.io/',
    category: 'developer-tools',
    tags: ['ORM', 'database', 'TypeScript'],
  },
  {
    title: 'Turborepo',
    titleZh: 'Turborepo',
    description:
      'High-performance monorepo build system with intelligent caching, parallel task execution, and incremental builds — built by the Vercel team.',
    descriptionZh:
      '高性能 Monorepo 构建系统，具备智能缓存、并行任务执行和增量构建能力，由 Vercel 团队打造。',
    url: 'https://turbo.build/',
    category: 'developer-tools',
    tags: ['monorepo', 'build', 'Vercel'],
  },
  {
    title: 'Storybook',
    titleZh: 'Storybook',
    description:
      'Frontend workshop for building UI components and pages in isolation — develop, document, and test components for React, Vue, Angular, and Svelte.',
    descriptionZh:
      '前端组件开发工作坊，在隔离环境中开发、文档化和测试 React/Vue/Angular/Svelte 组件，是 UI 组件库开发和设计系统的基础设施。',
    url: 'https://storybook.js.org/',
    category: 'developer-tools',
    tags: ['UI', 'components', 'testing'],
  },
  {
    title: 'ngrok',
    titleZh: 'ngrok',
    description:
      'Secure localhost tunneling service that exposes local servers to the internet with HTTPS — essential for webhook testing and demo previews.',
    descriptionZh:
      '安全的内网穿透服务，一键将本地服务暴露到公网并自带 HTTPS，是 Webhook 调试和 Demo 演示的必备工具。',
    url: 'https://ngrok.com/',
    category: 'developer-tools',
    tags: ['tunneling', 'webhook', 'debugging'],
  },
  {
    title: 'Cloudflare',
    titleZh: 'Cloudflare',
    description:
      'Global network platform offering CDN, DDoS protection, Workers (serverless edge computing), Pages (Jamstack hosting), R2 (object storage), and D1 (edge database).',
    descriptionZh:
      '全球网络平台，提供 CDN、DDoS 防护、Workers 边缘计算、Pages 静态托管、R2 对象存储和 D1 边缘数据库，是独立开发者的全能基础设施。',
    url: 'https://www.cloudflare.com/',
    category: 'developer-tools',
    tags: ['CDN', 'edge', 'serverless'],
  },
  {
    title: 'Transform Tools',
    titleZh: 'Transform Tools',
    description:
      'Polyglot code transformation playground — convert between JSX, TypeScript, JSON, GraphQL, CSS, and more with instant, copy-pasteable output.',
    descriptionZh:
      '多语言代码转换沙盒，支持 JSX ↔ TypeScript ↔ JSON ↔ GraphQL ↔ CSS 等格式即时互转，复制粘贴即得结果。',
    url: 'https://transform.tools/',
    category: 'developer-tools',
    tags: ['conversion', 'code', 'playground'],
  },
  {
    title: 'BundlePhobia',
    titleZh: 'BundlePhobia',
    description:
      'Check the install size, minified size, and gzipped cost of any npm package before adding it to your project — plus tree-shaking analysis.',
    descriptionZh:
      '在安装前查 npm 包的体积大小（安装大小、压缩大小、gzip 大小）和 Tree-shaking 分析，帮助控制前端打包体积。',
    url: 'https://bundlephobia.com/',
    category: 'developer-tools',
    tags: ['npm', 'bundle-size', 'performance'],
  },
  {
    title: 'Can I Use',
    titleZh: 'Can I Use',
    description:
      'Up-to-date browser support tables for HTML, CSS, JS, SVG, and Web APIs — the go-to reference for checking cross-browser compatibility.',
    descriptionZh:
      '最新的 HTML/CSS/JS/SVG/Web API 浏览器兼容性速查表，前端开发者判断特性可用性的首选参考站。',
    url: 'https://caniuse.com/',
    category: 'developer-tools',
    tags: ['compatibility', 'browser', 'reference'],
  },
  {
    title: 'cURL Converter',
    titleZh: 'cURL Converter',
    description:
      'Convert cURL commands to Python, JavaScript, Go, PHP, Java, and more — paste a curl command and get idiomatic code for your preferred language.',
    descriptionZh:
      '将 cURL 命令转换为 Python、JavaScript、Go、PHP、Java 等语言的代码，粘贴 curl 即得惯用语法代码。',
    url: 'https://curlconverter.com/',
    category: 'developer-tools',
    tags: ['curl', 'conversion', 'API'],
  },
  {
    title: 'JSONPlaceholder',
    titleZh: 'JSONPlaceholder',
    description:
      'Free fake REST API for testing and prototyping — returns realistic JSON data for posts, comments, users, todos, and photos without authentication.',
    descriptionZh:
      '免费的假数据 REST API，返回 posts、comments、users、todos、photos 等真实结构的 JSON 数据，无需鉴权即可用于测试和原型开发。',
    url: 'https://jsonplaceholder.typicode.com/',
    category: 'developer-tools',
    tags: ['API', 'mock', 'testing'],
  },
  {
    title: 'Drizzle ORM',
    titleZh: 'Drizzle ORM',
    description:
      'Lightweight TypeScript ORM with SQL-like syntax, zero dependencies, and maximum type safety — designed for serverless and edge environments.',
    descriptionZh:
      '轻量级 TypeScript ORM，采用类 SQL 语法、零依赖和极致类型安全，专为 Serverless 和边缘环境设计。',
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
    description:
      'Beautifully crafted open-source icon library with 1,500+ consistent icons for React, Vue, Svelte, and more — the default for modern web projects.',
    descriptionZh:
      '精美的开源图标库，1500+ 风格统一的图标，支持 React、Vue、Svelte 等框架，是现代 Web 项目的默认图标方案。',
    url: 'https://lucide.dev/',
    category: 'design-resources',
    tags: ['icons', 'open-source', 'React'],
  },
  {
    title: 'remove.bg',
    titleZh: 'remove.bg',
    description:
      'AI-powered background removal tool — upload any photo and get a transparent PNG in seconds, no design skills required.',
    descriptionZh:
      'AI 驱动的背景去除工具，上传任意照片秒级生成透明 PNG，无需任何设计技巧即可获得专业抠图效果。',
    url: 'https://www.remove.bg/',
    category: 'design-resources',
    tags: ['background-removal', 'AI', 'photo'],
  },
  {
    title: 'TinyPNG',
    titleZh: 'TinyPNG',
    description:
      'Smart lossy compression for WebP, PNG, and JPEG images — reduces file size dramatically while preserving visual quality.',
    descriptionZh:
      '智能有损压缩 WebP/PNG/JPEG 图片，在保持视觉质量的前提下大幅减小文件体积，是网页性能优化的常用工具。',
    url: 'https://tinypng.com/',
    category: 'design-resources',
    tags: ['compression', 'images', 'performance'],
  },
  {
    title: 'Squoosh',
    titleZh: 'Squoosh',
    description:
      'Google\'s open-source image compression web app with side-by-side comparison, format conversion, and advanced codec options (MozJPEG, AVIF, WebP).',
    descriptionZh:
      'Google 出品的开源图片压缩 Web 应用，支持左右对比、格式转换和高级编码器选项（MozJPEG、AVIF、WebP），所有处理在浏览器本地完成。',
    url: 'https://squoosh.app/',
    category: 'design-resources',
    tags: ['compression', 'images', 'Google'],
  },
  {
    title: 'ColorHunt',
    titleZh: 'ColorHunt',
    description:
      'Curated collection of beautiful color palettes updated daily — browse, save, and copy hex codes for your next design project.',
    descriptionZh:
      '每日更新的精选配色方案集合，浏览、收藏和复制十六进制色码，为设计项目快速找到协调的色彩组合。',
    url: 'https://colorhunt.co/',
    category: 'design-resources',
    tags: ['color', 'palette', 'inspiration'],
  },
  {
    title: 'Heroicons',
    titleZh: 'Heroicons',
    description:
      'Beautiful hand-crafted SVG icons by the makers of Tailwind CSS — available in outline, solid, and mini styles for React and Vue.',
    descriptionZh:
      'Tailwind CSS 团队出品的精美手绘 SVG 图标，提供 outline、solid 和 mini 三种风格，原生支持 React 和 Vue。',
    url: 'https://heroicons.com/',
    category: 'design-resources',
    tags: ['icons', 'SVG', 'Tailwind'],
  },
  {
    title: 'Haikei',
    titleZh: 'Haikei',
    description:
      'Online SVG generators for creating blob shapes, waves, gradients, and abstract backgrounds — export as SVG or PNG, no sign-up needed.',
    descriptionZh:
      '在线 SVG 生成器，一键生成流体形状、波浪、渐变和抽象背景，可导出 SVG 或 PNG，无需注册即可使用。',
    url: 'https://app.haikei.app/',
    category: 'design-resources',
    tags: ['SVG', 'generator', 'background'],
  },
  {
    title: 'Phosphor Icons',
    titleZh: 'Phosphor Icons',
    description:
      'Flexible icon family with 1,400+ icons in 6 weights (thin, light, regular, bold, fill, duotone) — consistent, pixel-perfect, and framework-agnostic.',
    descriptionZh:
      '灵活的图标家族，1400+ 图标 × 6 种粗细（thin/light/regular/bold/fill/duotone），风格统一、像素精确且跨框架友好。',
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
    description:
      'Modern terminal with IDE-like editing, AI command suggestions, and collaborative workflows — reimagining the command line for the 2020s.',
    descriptionZh:
      '现代化终端，支持 IDE 级文本编辑、AI 命令建议和协作工作流，重新定义了命令行工具的使用体验。',
    url: 'https://www.warp.dev/',
    category: 'productivity',
    tags: ['terminal', 'AI', 'macOS'],
  },
  {
    title: 'Loom',
    titleZh: 'Loom',
    description:
      'Instant screen and camera recording with shareable links — record product demos, bug reports, and async updates in one click.',
    descriptionZh:
      '即时屏幕和摄像头录制工具，一键录制产品演示、Bug 复现和异步更新，通过链接即时分享，告别冗长的文字说明。',
    url: 'https://www.loom.com/',
    category: 'productivity',
    tags: ['video', 'async', 'communication'],
  },
  {
    title: 'CleanShot X',
    titleZh: 'CleanShot X',
    description:
      'Premium macOS screenshot and screen-recording app with annotation, scrolling capture, and instant cloud upload — the ultimate screen capture toolkit.',
    descriptionZh:
      'macOS 高端截图与录屏工具，支持标注、滚动截屏和即时云端上传，是屏幕捕捉的终极工具箱。',
    url: 'https://cleanshot.com/',
    category: 'productivity',
    tags: ['screenshot', 'macOS', 'recording'],
  },
  {
    title: 'Slack',
    titleZh: 'Slack',
    description:
      'Team communication platform with channels, threads, app integrations, and workflow automation — the standard for async team collaboration.',
    descriptionZh:
      '团队沟通平台，支持频道、消息线程、应用集成和工作流自动化，是异步团队协作的行业标准工具。',
    url: 'https://slack.com/',
    category: 'productivity',
    tags: ['communication', 'team', 'chat'],
  },
  {
    title: 'Todoist',
    titleZh: 'Todoist',
    description:
      'Cross-platform task manager with natural language input, project organization, priority levels, and karma productivity tracking.',
    descriptionZh:
      '跨平台任务管理工具，支持自然语言输入、项目组织、优先级划分和 Karma 效率统计，简洁而强大。',
    url: 'https://todoist.com/',
    category: 'productivity',
    tags: ['tasks', 'GTD', 'cross-platform'],
  },
  {
    title: 'Mermaid',
    titleZh: 'Mermaid',
    description:
      'JavaScript-based diagramming and charting tool that renders Markdown-inspired text definitions into flowcharts, sequence diagrams, and Gantt charts.',
    descriptionZh:
      '基于 JavaScript 的图表工具，使用类似 Markdown 的文本语法即可生成流程图、时序图和甘特图，通过代码管理图表版本。',
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
    description:
      'All-in-one digital marketing platform covering SEO, PPC, content marketing, social media, and competitive research — enterprise-grade insights.',
    descriptionZh:
      '一站式数字营销平台，覆盖 SEO、PPC、内容营销、社交媒体和竞品研究，提供企业级数据洞察。',
    url: 'https://www.semrush.com/',
    category: 'seo-marketing',
    tags: ['SEO', 'PPC', 'competitive-research'],
  },
  {
    title: 'Google Trends',
    titleZh: 'Google Trends',
    description:
      'Explore what the world is searching for — compare keyword popularity over time, by region, and discover rising topics for content inspiration.',
    descriptionZh:
      '探索全球搜索趋势，对比关键词随时间、地域的热度变化，发现上升话题为内容创作提供数据支撑。',
    url: 'https://trends.google.com/',
    category: 'seo-marketing',
    tags: ['trends', 'Google', 'research'],
  },
  {
    title: 'Moz',
    titleZh: 'Moz',
    description:
      'Pioneer SEO software suite with Domain Authority (DA) metric, link explorer, keyword explorer, and on-page grader — trusted by marketers for over a decade.',
    descriptionZh:
      '老牌 SEO 工具套件，提供 Domain Authority（DA）权威度评分、链接分析、关键词研究和页面优化评分，深受营销人信赖。',
    url: 'https://moz.com/',
    category: 'seo-marketing',
    tags: ['SEO', 'DA', 'link-research'],
  },
  {
    title: 'Keyword Surfer',
    titleZh: 'Keyword Surfer',
    description:
      'Free Chrome extension that shows search volume and keyword suggestions directly in Google search results — the fastest way to size up a query.',
    descriptionZh:
      '免费 Chrome 扩展，直接在 Google 搜索结果中显示搜索量和关键词建议，是最快的搜索需求评估方式。',
    url: 'https://surferseo.com/keyword-surfer/',
    category: 'seo-marketing',
    tags: ['extension', 'keywords', 'free'],
  },
  {
    title: 'Schema.org',
    titleZh: 'Schema.org',
    description:
      'The collaborative standard for structured data markup — reference vocabulary, examples, and validation for JSON-LD, Microdata, and RDFa rich results.',
    descriptionZh:
      '结构化数据标记的协作标准，提供 JSON-LD、Microdata 和 RDFa 富媒体搜索结果的词汇表、示例和验证参考。',
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
    description:
      'AI-first code editor built on VS Code — chat with your codebase, generate entire features with context-aware prompts, and apply edits inline.',
    descriptionZh:
      '基于 VS Code 的 AI 优先代码编辑器，可与整个代码库对话、根据上下文生成完整功能并内联应用修改，是 AI 编程的标杆工具。',
    url: 'https://cursor.com/',
    category: 'ai-tools',
    tags: ['code-editor', 'AI', 'VS Code'],
  },
  {
    title: 'GitHub Copilot',
    titleZh: 'GitHub Copilot',
    description:
      'AI pair programmer by GitHub — provides inline code suggestions, chat assistance, and agent mode directly in VS Code, JetBrains, and GitHub.com.',
    descriptionZh:
      'GitHub 推出的 AI 结对编程助手，在 VS Code、JetBrains 和 GitHub.com 中提供行内代码建议、对话辅助和 Agent 模式。',
    url: 'https://github.com/features/copilot',
    category: 'ai-tools',
    tags: ['code-gen', 'GitHub', 'pair-programming'],
  },
  {
    title: 'Bolt.new',
    titleZh: 'Bolt.new',
    description:
      'AI-powered full-stack app builder from StackBlitz — prompt, preview, and deploy web applications entirely in the browser with instant live previews.',
    descriptionZh:
      'StackBlitz 出品的 AI 全栈应用构建工具，在浏览器中用自然语言描述即可生成、预览和部署 Web 应用，所见即所得。',
    url: 'https://bolt.new/',
    category: 'ai-tools',
    tags: ['app-builder', 'full-stack', 'browser'],
  },
  {
    title: 'Replit',
    titleZh: 'Replit',
    description:
      'Collaborative browser-based IDE with built-in hosting, AI code generation (Ghostwriter), and instant deployment — code from any device.',
    descriptionZh:
      '基于浏览器的协作式 IDE，内置托管、AI 代码生成和即时部署，无需本地环境即可在任何设备上编写和运行代码。',
    url: 'https://replit.com/',
    category: 'ai-tools',
    tags: ['IDE', 'collaboration', 'browser'],
  },
  {
    title: 'ElevenLabs',
    titleZh: 'ElevenLabs',
    description:
      'State-of-the-art AI text-to-speech and voice cloning platform — generate lifelike narration, dubbing, and custom voices in 29+ languages.',
    descriptionZh:
      '最先进的 AI 文字转语音与声音克隆平台，生成逼真的旁白、配音和自定义语音，支持 29+ 语言，语音自然度行业领先。',
    url: 'https://elevenlabs.io/',
    category: 'ai-tools',
    tags: ['TTS', 'voice', 'audio'],
  },
  {
    title: 'Suno',
    titleZh: 'Suno',
    description:
      'AI music generation platform — describe a style, mood, or lyrics and get full songs with vocals, instrumentation, and production in seconds.',
    descriptionZh:
      'AI 音乐生成平台，通过文字描述风格、情绪或歌词，秒级生成带人声、配器和制作的完整歌曲，让音乐创作变得人人可为。',
    url: 'https://suno.com/',
    category: 'ai-tools',
    tags: ['music', 'generation', 'creative'],
  },
  {
    title: 'Gemini',
    titleZh: 'Gemini',
    description:
      'Google\'s multimodal AI model with deep integration into Google Workspace, Gmail, and Search — powerful reasoning across text, images, code, and audio.',
    descriptionZh:
      'Google 推出的多模态 AI 模型，深度集成 Google Workspace、Gmail 和搜索，在文本、图片、代码和音频推理方面表现强大。',
    url: 'https://gemini.google.com/',
    category: 'ai-tools',
    tags: ['LLM', 'Google', 'multimodal'],
  },
  {
    title: 'Lovable',
    titleZh: 'Lovable',
    description:
      'AI-powered app builder that generates production-ready web apps from a single prompt with instant preview and one-click GitHub sync.',
    descriptionZh:
      'AI 驱动的应用构建工具，通过一行描述即可生成生产级 Web 应用，支持即时预览和一键同步 GitHub。',
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
    description:
      'Open-source ecommerce plugin for WordPress — powers millions of online stores with extensions for subscriptions, bookings, and memberships.',
    descriptionZh:
      'WordPress 上的开源电商插件，支持订阅、预订和会员等扩展，驱动数百万个在线商店，适合已有 WordPress 站点的商家。',
    url: 'https://woocommerce.com/',
    category: 'ecommerce-tools',
    tags: ['WordPress', 'plugin', 'open-source'],
  },
  {
    title: 'Stripe Fee Calculator',
    titleZh: 'Stripe Fee Calculator',
    description:
      'Estimate Stripe processing fees for any transaction amount and region — see exactly how much you will net after Stripe\'s per-transaction charges.',
    descriptionZh:
      '估算任意金额和地区的 Stripe 处理费用，清晰展示扣除手续费后的实际到账金额，帮助定价和利润核算。',
    url: 'https://toolorbit.site/tools/ecommerce/stripe-fee-calculator',
    category: 'ecommerce-tools',
    tags: ['Stripe', 'fees', 'pricing'],
  },
  {
    title: 'Jungle Scout',
    titleZh: 'Jungle Scout',
    description:
      'All-in-one Amazon seller platform for product research, keyword tracking, competitor intelligence, and sales analytics — data-driven FBA decisions.',
    descriptionZh:
      '一站式 Amazon 卖家平台，覆盖产品调研、关键词追踪、竞品情报和销售分析，帮助 FBA 卖家做数据驱动的决策。',
    url: 'https://www.junglescout.com/',
    category: 'ecommerce-tools',
    tags: ['Amazon', 'FBA', 'product-research'],
  },
  {
    title: 'Lemon Squeezy',
    titleZh: 'Lemon Squeezy',
    description:
      'All-in-one payments and merchant-of-record platform for SaaS and digital products — handles global tax compliance, invoicing, and subscriptions.',
    descriptionZh:
      '面向 SaaS 和数字产品的一站式支付与商家记录平台，处理全球税务合规、发票和订阅管理，让独立开发者无需操心合规事务。',
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
    description:
      'Community-created developer roadmaps with step-by-step learning paths for frontend, backend, DevOps, AI, and more — see what to learn next.',
    descriptionZh:
      '社区创建的开发者学习路线图，覆盖前端、后端、DevOps、AI 等方向的循序渐进学习路径，帮助你明确下一步该学什么。',
    url: 'https://roadmap.sh/',
    category: 'learning-resources',
    tags: ['roadmap', 'career', 'guide'],
  },
  {
    title: 'Frontend Mentor',
    titleZh: 'Frontend Mentor',
    description:
      'Real-world frontend coding challenges with professional design files — practice HTML, CSS, and JavaScript by building projects from Figma-style mockups.',
    descriptionZh:
      '真实前端编码挑战平台，提供专业设计稿，通过从 Figma 级原型构建项目来练习 HTML/CSS/JavaScript，即学即用。',
    url: 'https://www.frontendmentor.io/',
    category: 'learning-resources',
    tags: ['frontend', 'challenges', 'practice'],
  },
  {
    title: 'LeetCode',
    titleZh: 'LeetCode',
    description:
      'Coding interview preparation platform with 3,000+ algorithmic problems — used by FAANG and top tech candidates for data structures and algorithms practice.',
    descriptionZh:
      '程序员面试刷题平台，3000+ 算法题目，FAANG 等顶级科技公司求职者的数据结构和算法练习首选。',
    url: 'https://leetcode.com/',
    category: 'learning-resources',
    tags: ['algorithms', 'interviews', 'DSA'],
  },
  {
    title: 'JavaScript.info',
    titleZh: 'JavaScript.info',
    description:
      'Comprehensive modern JavaScript tutorial from basics to advanced — widely regarded as the most thorough and well-structured JS learning resource.',
    descriptionZh:
      '从基础到高级的现代 JavaScript 完整教程，被广泛认为是最全面、结构最清晰的 JS 学习资源。',
    url: 'https://javascript.info/',
    category: 'learning-resources',
    tags: ['JavaScript', 'tutorial', 'beginner'],
  },
  {
    title: 'Dev.to',
    titleZh: 'Dev.to',
    description:
      'Inclusive developer community and blogging platform — thousands of articles daily on web dev, DevOps, AI, open source, and career topics.',
    descriptionZh:
      '包容的开发者社区与博客平台，每日数千篇关于 Web 开发、DevOps、AI、开源和职业发展的文章，技术氛围友好。',
    url: 'https://dev.to/',
    category: 'learning-resources',
    tags: ['community', 'blog', 'discussion'],
  },
  {
    title: 'TypeScript Handbook',
    titleZh: 'TypeScript Handbook',
    description:
      'The official TypeScript documentation — thorough walkthrough of the type system, utility types, module resolution, and compiler configuration.',
    descriptionZh:
      'TypeScript 官方手册，深入讲解类型系统、工具类型、模块解析和编译器配置，是 TS 学习者从入门到精通的必读文档。',
    url: 'https://www.typescriptlang.org/docs/',
    category: 'learning-resources',
    tags: ['TypeScript', 'documentation', 'reference'],
  },
  {
    title: 'Exercism',
    titleZh: 'Exercism',
    description:
      'Free coding practice platform with 70+ language tracks and human mentor feedback — solve exercises locally and get code reviews from volunteers.',
    descriptionZh:
      '免费编程练习平台，70+ 语言赛道，提供人工导师反馈——在本地解题，由志愿者 mentor 提供代码审查，适合刻意练习。',
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
    description:
      'Compiler-first UI framework that shifts work from the browser to the build step — ships minimal JavaScript and delivers exceptional runtime performance.',
    descriptionZh:
      '编译器优先的 UI 框架，将工作从浏览器转移到构建阶段，输出极少的 JavaScript，运行时性能卓越。',
    url: 'https://svelte.dev/',
    category: 'open-source',
    tags: ['UI', 'compiler', 'framework'],
  },
  {
    title: 'TanStack Query',
    titleZh: 'TanStack Query',
    description:
      'Powerful async state management for React, Vue, Solid, and Svelte — handles caching, background refetching, pagination, and mutations out of the box.',
    descriptionZh:
      '强大的异步状态管理库，支持 React/Vue/Solid/Svelte，开箱即用地处理缓存、后台刷新、分页和变更操作，是服务端状态管理的事实标准。',
    url: 'https://tanstack.com/query',
    category: 'open-source',
    tags: ['state-management', 'caching', 'React'],
  },
  {
    title: 'Zod',
    titleZh: 'Zod',
    description:
      'TypeScript-first schema declaration and validation library — define types once and get static type inference and runtime validation together.',
    descriptionZh:
      'TypeScript 优先的 Schema 声明与验证库，一次定义即可同时获得静态类型推导和运行时校验，是 API 边界验证的首选方案。',
    url: 'https://zod.dev/',
    category: 'open-source',
    tags: ['validation', 'TypeScript', 'schema'],
  },
  {
    title: 'Zustand',
    titleZh: 'Zustand',
    description:
      'Tiny, fast, and scalable state management for React — minimal boilerplate, no providers, and excellent TypeScript support.',
    descriptionZh:
      '小巧、快速且可扩展的 React 状态管理库，几乎无需模板代码、无需 Provider 包裹，TypeScript 支持出色。',
    url: 'https://zustand-demo.pmnd.rs/',
    category: 'open-source',
    tags: ['state-management', 'React', 'lightweight'],
  },
  {
    title: 'Remix',
    titleZh: 'Remix',
    description:
      'Full-stack React framework focused on web fundamentals with nested routing, server-side data loading, and progressive enhancement — now part of Shopify.',
    descriptionZh:
      '全栈 React 框架，聚焦 Web 基础，以嵌套路由、服务端数据加载和渐进增强为核心，现已并入 Shopify。',
    url: 'https://remix.run/',
    category: 'open-source',
    tags: ['React', 'full-stack', 'Shopify'],
  },
  {
    title: 'Nuxt',
    titleZh: 'Nuxt',
    description:
      'The intuitive Vue.js framework with hybrid rendering, auto-imports, file-based routing, and a rich module ecosystem — the Vue counterpart to Next.js.',
    descriptionZh:
      '直观的 Vue.js 框架，支持混合渲染、自动导入、文件路由和丰富的模块生态，是 Vue 生态中的 Next.js 等价物。',
    url: 'https://nuxt.com/',
    category: 'open-source',
    tags: ['Vue', 'SSR', 'framework'],
  },
  {
    title: 'NestJS',
    titleZh: 'NestJS',
    description:
      'Progressive Node.js framework for building scalable server-side applications — uses TypeScript, decorators, and dependency injection with an Angular-inspired architecture.',
    descriptionZh:
      '渐进式 Node.js 服务端框架，使用 TypeScript、装饰器和依赖注入，架构借鉴 Angular，适合构建企业级后端应用。',
    url: 'https://nestjs.com/',
    category: 'open-source',
    tags: ['Node.js', 'backend', 'TypeScript'],
  },
  {
    title: 'Hono',
    titleZh: 'Hono',
    description:
      'Ultrafast, lightweight web framework for edge runtimes — runs on Cloudflare Workers, Deno, Bun, and Node.js with a simple, familiar API.',
    descriptionZh:
      '极速轻量的边缘运行时 Web 框架，可在 Cloudflare Workers、Deno、Bun 和 Node.js 上运行，API 简单易用。',
    url: 'https://hono.dev/',
    category: 'open-source',
    tags: ['edge', 'framework', 'serverless'],
  },
  {
    title: 'Solid.js',
    titleZh: 'Solid.js',
    description:
      'Reactive UI library that compiles to direct DOM updates — React-like developer experience with no virtual DOM and fine-grained reactivity.',
    descriptionZh:
      '响应式 UI 库，编译为直接 DOM 更新——React 式的开发体验加上无虚拟 DOM 的细粒度响应式，性能极致。',
    url: 'https://www.solidjs.com/',
    category: 'open-source',
    tags: ['UI', 'reactive', 'framework'],
  },
  {
    title: 'Vitest',
    titleZh: 'Vitest',
    description:
      'Blazing-fast unit test framework powered by Vite — Jest-compatible API with native ESM, TypeScript, and HMR for instant test feedback.',
    descriptionZh:
      '基于 Vite 的极速单元测试框架，API 兼容 Jest，原生支持 ESM、TypeScript 和 HMR 即时反馈，让 TDD 体验更流畅。',
    url: 'https://vitest.dev/',
    category: 'open-source',
    tags: ['testing', 'Vite', 'JavaScript'],
  },
  {
    title: 'Payload CMS',
    titleZh: 'Payload CMS',
    description:
      'Open-source headless CMS and application framework built on Next.js — code-first configuration, TypeScript-native, with a powerful admin UI.',
    descriptionZh:
      '基于 Next.js 的开源无头 CMS 和应用框架，代码优先配置、TypeScript 原生，配备强大的管理后台，是内容型应用的现代化选择。',
    url: 'https://payloadcms.com/',
    category: 'open-source',
    tags: ['CMS', 'Next.js', 'headless'],
  },
  {
    title: 'Tabler Icons',
    titleZh: 'Tabler Icons',
    description:
      '5,000+ customizable open-source SVG icons with a clean, consistent style — available as React, Vue, Svelte components and raw SVG.',
    descriptionZh:
      '5000+ 可定制的开源 SVG 图标，风格简洁统一，提供 React、Vue、Svelte 组件和原始 SVG 格式。',
    url: 'https://tabler.io/icons',
    category: 'open-source',
    tags: ['icons', 'SVG', 'design-system'],
  },
];
