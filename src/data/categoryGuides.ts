import type { Category } from './tools';

export type CategoryGuideCopy = {
  intro: string;
  workflows: string[];
  relatedPages?: Array<{ label: string; href: string }>;
};

export const CATEGORY_GUIDES: Record<Category, { en: CategoryGuideCopy; zh: CategoryGuideCopy }> = {
  'AI 工具': {
    en: {
      intro:
        'ToolOrbit AI tools help creators, marketers, developers, and ecommerce teams turn rough notes into drafts, summaries, prompts, translations, code review notes, and content variants. Pick this category when you want a focused browser tool instead of a large writing or coding app. Start with a short prompt, check the result, then refine it for publishing or team review.',
      workflows: [
        'Create video titles, product listings, weekly reports, meeting notes, prompts, and social copy.',
        'Analyze keywords, competitors, and market signals before choosing content or product angles.',
        'Polish, translate, review, or reshape text in the browser.',
      ],
      relatedPages: [
        { label: 'AI Tools Hub', href: '/ai-tools' },
        { label: 'Best AI Tools for Content Creators', href: '/best-ai-tools-for-content-creators' },
      ],
    },
    zh: {
      intro:
        'ToolOrbit 的 AI 工具帮助创作者、营销人员、开发者和电商运营把零散想法整理成草稿、摘要、提示词、译文、代码审查备注和内容变体。需要一个聚焦的浏览器工具，而不是打开大型写作或编码应用时，可以从这个分类开始。输入一段简短提示，检查结果，再继续改到可发布或可协作的状态。',
      workflows: [
        '生成视频标题、商品文案、周报、会议纪要、提示词和社媒内容。',
        '分析关键词、竞品和市场信号，辅助判断内容或产品切入点。',
        '在浏览器中润色、翻译、审查或改写文本。',
      ],
      relatedPages: [
        { label: 'AI 工具中心', href: '/ai-tools' },
        { label: '内容创作者最佳 AI 工具对比', href: '/best-ai-tools-for-content-creators' },
      ],
    },
  },
  '开发者工具': {
    en: {
      intro:
        'Developer tools cover the formatting, encoding, debugging, conversion, and reference checks that interrupt coding. Use them to inspect JSON, convert XML, compare text, generate hashes, decode JWTs, test regular expressions, create UUIDs, or handle URL and Unicode encoding. You get readable results for routine checks without opening an IDE plugin or sending sensitive snippets to extra services.',
      workflows: [
        'Format, validate, compare, encode, decode, and convert common developer data formats.',
        'Generate identifiers, hashes, permissions, regular expressions, and other coding helpers.',
        'Inspect copied API payloads, configuration values, tokens, and text fragments before shipping code.',
      ],
      relatedPages: [
        { label: 'Developer Tools Hub', href: '/developer-tools' },
        { label: 'Best JSON Formatters', href: '/best-json-formatters' },
      ],
    },
    zh: {
      intro:
        '开发者工具覆盖格式化、编码、调试、转换和速查等日常开发任务。需要检查 JSON、转换 XML、对比文本、生成哈希、解析 JWT、测试正则、创建 UUID，或处理 URL 与 Unicode 编码时，可以用这些工具得到清晰结果。你不用打开复杂插件，也不用把敏感片段交给额外服务。',
      workflows: [
        '格式化、校验、对比、编码、解码和转换常见开发数据格式。',
        '生成标识符、哈希、权限、正则表达式和其他编码辅助内容。',
        '发布代码前检查复制来的 API 数据、配置值、令牌和文本片段。',
      ],
      relatedPages: [
        { label: '开发者工具中心', href: '/developer-tools' },
        { label: '最佳 JSON 格式化工具对比', href: '/best-json-formatters' },
      ],
    },
  },
  '站长工具': {
    en: {
      intro:
        'Webmaster tools handle the small website maintenance jobs that come up often: preparing URLs, shortening links, checking QR destinations, and cleaning browser-facing formats. Use them for landing pages, campaigns, documentation, analytics links, and content operations where the link must survive sharing, scanning, or embedding. Check the format before you publish it across websites or marketing channels.',
      workflows: [
        'Encode or decode URLs before adding them to pages, forms, emails, or tracking links.',
        'Prepare shorter links and QR-related assets for campaigns, documents, and social channels.',
        'Check web-facing strings and link formats before users or crawlers see them.',
      ],
      relatedPages: [
        { label: 'Webmaster Toolkit', href: '/webmaster-toolkit' },
      ],
    },
    zh: {
      intro:
        '站长工具处理网站维护中常见的小任务，例如整理 URL、短链接、二维码目标和浏览器可识别的格式。落地页、活动页、文档、统计链接和内容运营都可能需要这些检查，尤其是在发布、分享或嵌入链接前。先确认字符串和链接格式，再发布、分享或嵌入页面。',
      workflows: [
        '将 URL 编码或解码后再放入页面、表单、邮件或跟踪链接。',
        '为活动、文档和社媒渠道准备短链接与二维码相关素材。',
        '在用户或爬虫看到链接前，检查字符串和 Web 格式是否正常。',
      ],
      relatedPages: [
        { label: '站长工具中心', href: '/webmaster-toolkit' },
      ],
    },
  },
  '文本排版': {
    en: {
      intro:
        'Text and typography tools clean, analyze, count, and reuse written material. Use this category to prepare pasted text, remove formatting noise, count words or characters, inspect text structure, or find symbols and emoji for interface copy, social posts, documentation, and data cleanup. Writers, editors, developers, and operators can tidy text without opening a full writing suite.',
      workflows: [
        'Clean pasted text, remove extra spaces, normalize line breaks, and prepare copy for publishing.',
        'Analyze word count, character count, frequency, and readability signals for drafts.',
        'Find symbols, emoji, marks, and special characters for UI labels, posts, or documentation.',
      ],
      relatedPages: [
        { label: 'Text Tools Hub', href: '/text-tools' },
      ],
    },
    zh: {
      intro:
        '文本排版工具用于清理、分析、统计和复用文字内容。复制来的文本需要去除多余格式、统计字数或字符数、检查文本结构，或为界面文案、社媒帖子、文档和数据清洗寻找符号与表情时，可以使用这一类工具。写作者、编辑、开发者和运营人员不用打开大型写作套件，也能整理文本。',
      workflows: [
        '清理粘贴文本、移除多余空格、规范换行，并准备发布文案。',
        '分析字数、字符数、词频和可读性等文本信号。',
        '查找符号、表情、标记和特殊字符，用于 UI、帖子或文档。',
      ],
      relatedPages: [
        { label: '文本工具中心', href: '/text-tools' },
      ],
    },
  },
  '生成器': {
    en: {
      intro:
        'Generator tools turn simple input into scannable, printable, or reusable assets. Use this category for QR codes, barcode labels, and generated files that connect digital information to packaging, inventory, events, mobile sharing, or business workflows. Create the asset, verify it in the preview, then use it in a document, label, page, or campaign.',
      workflows: [
        'Generate QR codes for URLs, contact details, Wi-Fi access, events, and business materials.',
        'Create barcodes for labels, inventory, ecommerce workflows, and lightweight product operations.',
        'Scan or verify generated codes before customers, teammates, or devices use them.',
      ],
    },
    zh: {
      intro:
        '生成器工具把简单输入转换为可扫描、可打印或可复用的素材。二维码、条形码标签和其他生成结果常用于包装、库存、活动、移动端分享和业务流程。你可以先生成素材，在预览中验证效果，再用于文档、标签、网页或营销活动。',
      workflows: [
        '为网址、联系方式、Wi-Fi、活动和商务资料生成二维码。',
        '为标签、库存、电商流程和轻量产品运营创建条形码。',
        '在客户、团队或设备使用前，扫描或验证生成的编码结果。',
      ],
    },
  },
  '电商工具': {
    en: {
      intro:
        'E-commerce tools help sellers estimate costs, prepare listings, and handle marketplace work without building another spreadsheet. Use this category to calculate Etsy or Stripe fees, shape product copy, compare competitors, explore keywords, or turn product details into publishable listing material. Check pricing, promotion, and marketplace signals before you launch or update a product.',
      workflows: [
        'Estimate platform fees, processing costs, profit margins, and pricing scenarios.',
        'Prepare product titles, descriptions, tags, and marketing angles for marketplace listings.',
        'Research competitors, keyword opportunities, and market signals before updating products.',
      ],
      relatedPages: [
        { label: 'Ecommerce Tools Hub: full workflow guide', href: '/ecommerce-tools' },
        { label: 'Best Etsy Fee Calculators: comparison guide', href: '/best-etsy-fee-calculators' },
      ],
    },
    zh: {
      intro:
        '电商工具帮助卖家估算成本、准备商品信息，并减少市场运营对复杂表格的依赖。需要计算 Etsy 或 Stripe 费用、整理商品文案、比较竞品、探索关键词，或把产品细节变成可发布的 listing 内容时，可以从这个分类开始。上架或更新产品前，先核对定价、推广和市场信号。',
      workflows: [
        '估算平台费用、支付手续费、利润空间和不同定价方案。',
        '准备商品标题、描述、标签和适合平台的营销角度。',
        '更新产品前研究竞品、关键词机会和市场信号。',
      ],
      relatedPages: [
        { label: '电商工具中心：完整工作流指南', href: '/ecommerce-tools' },
        { label: 'Etsy 费用计算器对比：哪个最适合你？', href: '/best-etsy-fee-calculators' },
      ],
    },
  },
  'PDF工具': {
    en: {
      intro:
        'PDF tools handle common document jobs: merging, splitting, converting, and preparing files for sharing. Use this category to combine documents, extract pages, turn PDF pages into images, or bundle images into a PDF without installing desktop software. Reports, invoices, forms, scanned documents, classroom material, and internal handoffs often need these checks.',
      workflows: [
        'Merge multiple PDFs into one document or split a large file into focused page ranges.',
        'Convert PDF pages to images for previews, attachments, slides, or web publishing.',
        'Create a PDF from screenshots, photos, scans, or image collections for easier sharing.',
      ],
    },
    zh: {
      intro:
        'PDF 工具处理合并、拆分、转换和分享前整理等常见文档任务。需要合并多个文档、提取指定页面、把 PDF 页面转换成图片，或把图片打包成 PDF 时，可以不安装桌面软件直接处理。报告、发票、表单、扫描件、课堂材料和企业内部交接常会用到这些检查。',
      workflows: [
        '合并多个 PDF，或把大文件拆分为指定页码范围。',
        '将 PDF 页面转换为图片，用于预览、附件、幻灯片或网页发布。',
        '把截图、照片、扫描件或图片集合整理成便于分享的 PDF。',
      ],
    },
  },
  '图片处理': {
    en: {
      intro:
        'Image tools prepare visual files for websites, documents, products, and social channels. Use this category to compress images, convert formats, crop assets, generate favicons, convert SVG to PNG, or turn images into Base64 strings. Tune the output for smaller files, compatible formats, cleaner crops, and assets you can upload, embed, or hand off.',
      workflows: [
        'Compress and convert images for faster web pages, smaller uploads, and better compatibility.',
        'Crop, resize, and prepare screenshots, product photos, icons, and social visuals.',
        'Convert SVG, favicon, and Base64 assets for frontend, documentation, or design workflows.',
      ],
    },
    zh: {
      intro:
        '图片处理工具用于准备网站、文档、商品和社媒所需的视觉文件。需要压缩图片、转换格式、裁剪素材、生成 favicon、把 SVG 转成 PNG，或把图片转换为 Base64 字符串时，可以使用这一分类。你可以调整输出结果，拿到更小的文件、更兼容的格式、更干净的裁剪，以及便于上传、嵌入或交付的资源。',
      workflows: [
        '压缩和转换图片，提升网页加载、上传体积和格式兼容性。',
        '裁剪、调整并准备截图、商品图、图标和社媒视觉素材。',
        '转换 SVG、favicon 和 Base64 资源，用于前端、文档或设计流程。',
      ],
    },
  },
  '计算转换': {
    en: {
      intro:
        'Conversion and calculator tools handle the numbers, dates, formats, and units that show up in technical and business work. Use this category to convert time zones, Unix timestamps, units, file sizes, number bases, archive formats, RMB uppercase amounts, or screen density values. Enter the raw value, check the result, and use it in the next document, spec, or workflow.',
      workflows: [
        'Convert units, timestamps, time zones, number bases, and archive-related values.',
        'Calculate PPI, RMB uppercase formatting, and other practical measurement outputs.',
        'Check values before using them in documents, code, product specs, or operational workflows.',
      ],
    },
    zh: {
      intro:
        '计算转换工具处理技术和业务工作中常见的数字、日期、格式与单位。需要转换时区、Unix 时间戳、单位、文件大小、进制、压缩格式、人民币大写金额或屏幕像素密度时，可以在这里完成验证。输入原始数值，检查结果，再写入文档、规格或工作流。',
      workflows: [
        '转换单位、时间戳、时区、进制和压缩归档相关数值。',
        '计算 PPI、人民币大写格式和其他常见测量结果。',
        '在写入文档、代码、产品规格或运营流程前检查关键数值。',
      ],
    },
  },
  '实用工具': {
    en: {
      intro:
        'Utility tools cover everyday checks and personal productivity calculations outside a narrow technical workflow. Use this category when you need a browser-based answer for health, daily planning, simple references, or lightweight decision support. The tools keep inputs clear, prefer local processing where possible, and support repeat use.',
      workflows: [
        'Run everyday calculators and quick checks without opening a spreadsheet.',
        'Keep personal reference inputs local in the browser whenever possible.',
        'Use the result as a practical reference before making a final decision.',
      ],
    },
    zh: {
      intro:
        '实用工具收纳日常生活、个人效率和轻量判断场景中的小工具。需要计算健康指标、整理日常参考值、做简单决策辅助或临时校验信息时，可以直接在浏览器中完成。这类工具保持输入清晰，在可行时优先本地处理，也适合反复打开使用。',
      workflows: [
        '快速完成日常计算和个人参考值校验，避免临时搭表。',
        '尽量让个人输入保留在浏览器本地，减少不必要的数据传输。',
        '把结果作为初步参考，再结合实际情况或专业意见判断。',
      ],
    },
  },
};
