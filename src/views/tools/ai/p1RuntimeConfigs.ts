import type { AiRuntimeToolConfig } from './AiRuntimeTool';

export const promptGeneratorConfig: AiRuntimeToolConfig = {
  toolId: 'ai-prompt-generator',
  endpoint: '/api/ai-prompt-generator',
  icon: 'sparkles',
  title: { en: 'AI Image Prompt Generator', zh: 'AI 绘画提示词生成器' },
  subtitle: {
    en: 'Turn a short image idea into copy-ready English prompts for image models.',
    zh: '把简短画面想法整理成可复制的英文绘图提示词。',
  },
  formTitle: { en: 'Image brief', zh: '画面简报' },
  generateLabel: { en: 'Generate prompts', zh: '生成提示词' },
  waitingLabel: { en: 'Your prompt drafts will appear here.', zh: '生成后的提示词会显示在这里。' },
  loadingLabel: { en: 'Generating prompts...', zh: '正在生成提示词...' },
  fields: [
    {
      key: 'topic',
      type: 'textarea',
      label: { en: 'Image idea', zh: '画面想法' },
      placeholder: { en: 'A cat in a trench coat on a rainy cyberpunk street', zh: '雨夜赛博朋克街头，一只穿风衣的猫' },
      required: true,
    },
    {
      key: 'style',
      type: 'select',
      label: { en: 'Style', zh: '风格' },
      defaultValue: 'Photorealistic',
      options: [
        { value: 'Photorealistic', label: { en: 'Photorealistic', zh: '摄影写实' } },
        { value: 'Anime', label: { en: 'Anime', zh: '动漫' } },
        { value: 'Cyberpunk', label: { en: 'Cyberpunk', zh: '赛博朋克' } },
        { value: '3D Render', label: { en: '3D Render', zh: '3D 渲染' } },
        { value: 'Oil Painting', label: { en: 'Oil Painting', zh: '油画' } },
        { value: 'Minimalist Logo', label: { en: 'Minimalist Logo', zh: '极简 Logo' } },
        { value: 'Watercolor', label: { en: 'Watercolor', zh: '水彩' } },
        { value: 'Pencil Sketch', label: { en: 'Pencil Sketch', zh: '铅笔素描' } },
      ],
    },
    {
      key: 'language',
      type: 'language',
      label: { en: 'Notes language', zh: '说明语言' },
      options: [
        { value: 'English', label: { en: 'English', zh: '英文' } },
        { value: 'Chinese', label: { en: 'Chinese', zh: '中文' } },
      ],
    },
  ],
  result: {
    type: 'sections',
    sections: [
      { key: 'prompts', marker: 'PROMPTS', label: { en: 'Prompts', zh: '提示词' }, markdown: true },
      { key: 'notes', marker: 'USAGE_NOTES', label: { en: 'Usage notes', zh: '使用提醒' }, markdown: true },
    ],
  },
  buildPayload: (values) => ({
    topic: values.topic,
    style: values.style,
    language: values.language,
  }),
};

export const videoScriptConfig: AiRuntimeToolConfig = {
  toolId: 'ai-video-script',
  endpoint: '/api/ai-video-script',
  icon: 'clapperboard',
  title: { en: 'AI Video Script Generator', zh: 'AI 视频脚本生成器' },
  subtitle: {
    en: 'Turn a video idea or short movie concept into hooks, scenes, captions, voiceover notes, and CTAs.',
    zh: '把视频想法或短片创意整理成钩子、分镜、字幕、口播和行动号召。',
  },
  formTitle: { en: 'Video brief', zh: '视频简报' },
  generateLabel: { en: 'Generate script', zh: '生成脚本' },
  waitingLabel: { en: 'Your video script will appear here.', zh: '生成后的视频脚本会显示在这里。' },
  loadingLabel: { en: 'Generating script...', zh: '正在生成脚本...' },
  fields: [
    {
      key: 'topic',
      type: 'textarea',
      label: { en: 'Video topic', zh: '视频主题' },
      placeholder: { en: 'A 60-second short movie idea about 5 productivity habits for office workers', zh: '一个关于打工人 5 个效率习惯的 60 秒短片创意' },
      required: true,
    },
    {
      key: 'duration',
      type: 'select',
      label: { en: 'Duration', zh: '时长' },
      defaultValue: '60s',
      options: [
        { value: '60s', label: { en: 'Under 60 seconds', zh: '60 秒以内' } },
        { value: '3-5min', label: { en: '3-5 minutes', zh: '3-5 分钟' } },
        { value: '5-10min', label: { en: '5-10 minutes', zh: '5-10 分钟' } },
      ],
    },
    {
      key: 'platform',
      type: 'select',
      label: { en: 'Platform', zh: '平台' },
      defaultValue: 'Douyin / TikTok',
      options: [
        { value: 'Douyin / TikTok', label: { en: 'Douyin / TikTok', zh: '抖音 / TikTok' } },
        { value: 'YouTube Shorts', label: { en: 'YouTube Shorts', zh: 'YouTube Shorts' } },
        { value: 'Instagram Reels', label: { en: 'Instagram Reels', zh: 'Instagram Reels' } },
        { value: 'Bilibili', label: { en: 'Bilibili', zh: 'B 站' } },
        { value: 'Xiaohongshu', label: { en: 'Xiaohongshu', zh: '小红书' } },
        { value: 'YouTube', label: { en: 'YouTube', zh: 'YouTube' } },
      ],
    },
    {
      key: 'tone',
      type: 'select',
      label: { en: 'Tone', zh: '语气' },
      defaultValue: 'Educational',
      options: [
        { value: 'Educational', label: { en: 'Educational', zh: '教学' } },
        { value: 'Entertaining', label: { en: 'Entertaining', zh: '娱乐' } },
        { value: 'Storytelling', label: { en: 'Storytelling', zh: '故事' } },
        { value: 'Sales-oriented', label: { en: 'Sales-oriented', zh: '转化' } },
        { value: 'Inspirational', label: { en: 'Inspirational', zh: '激励' } },
        { value: 'Humorous', label: { en: 'Humorous', zh: '幽默' } },
      ],
    },
    {
      key: 'language',
      type: 'language',
      label: { en: 'Output language', zh: '输出语言' },
      options: [
        { value: 'English', label: { en: 'English', zh: '英文' } },
        { value: 'Chinese', label: { en: 'Chinese', zh: '中文' } },
      ],
    },
  ],
  result: {
    type: 'sections',
    sections: [
      { key: 'hook', marker: 'HOOK', label: { en: 'Hook', zh: '开场钩子' }, markdown: true },
      { key: 'script', marker: 'SCRIPT', label: { en: 'Script', zh: '脚本' }, markdown: true },
      { key: 'captions', marker: 'CAPTIONS', label: { en: 'Caption cues', zh: '字幕提示' }, markdown: true },
      { key: 'cta', marker: 'CTA', label: { en: 'CTA', zh: '行动号召' }, markdown: true },
    ],
  },
  buildPayload: (values) => ({
    topic: values.topic,
    duration: values.duration,
    platform: values.platform,
    tone: values.tone,
    language: values.language,
  }),
};

export const textPolisherConfig: AiRuntimeToolConfig = {
  toolId: 'ai-text-polisher',
  endpoint: '/api/ai-polisher',
  icon: 'sparkles',
  title: { en: 'AI Text Polisher', zh: 'AI 文本润色工具' },
  subtitle: { en: 'Rewrite rough text into clearer copy while preserving the core message.', zh: '把粗糙文本改写成更清楚、更顺的版本。' },
  formTitle: { en: 'Text brief', zh: '文本简报' },
  generateLabel: { en: 'Polish text', zh: '润色文本' },
  waitingLabel: { en: 'Your polished text will appear here.', zh: '润色结果会显示在这里。' },
  loadingLabel: { en: 'Polishing text...', zh: '正在润色文本...' },
  fields: [
    {
      key: 'text',
      type: 'textarea',
      label: { en: 'Original text', zh: '原文' },
      placeholder: { en: 'Paste the text you want to improve...', zh: '粘贴需要修改的文本...' },
      required: true,
    },
    {
      key: 'tone',
      type: 'select',
      label: { en: 'Tone', zh: '语气' },
      defaultValue: 'Professional',
      options: [
        { value: 'Professional', label: { en: 'Professional', zh: '专业' } },
        { value: 'Casual & Friendly', label: { en: 'Casual & Friendly', zh: '轻松友好' } },
        { value: 'Academic', label: { en: 'Academic', zh: '学术' } },
        { value: 'Persuasive', label: { en: 'Persuasive', zh: '转化' } },
        { value: 'Concise', label: { en: 'Concise', zh: '简洁' } },
        { value: 'Humorous', label: { en: 'Humorous', zh: '幽默' } },
      ],
    },
    {
      key: 'language',
      type: 'language',
      label: { en: 'Output language', zh: '输出语言' },
      options: [
        { value: 'English', label: { en: 'English', zh: '英文' } },
        { value: 'Chinese', label: { en: 'Chinese', zh: '中文' } },
      ],
    },
  ],
  result: {
    type: 'sections',
    sections: [
      { key: 'polished', marker: 'POLISHED_TEXT', label: { en: 'Polished text', zh: '润色结果' }, markdown: true },
      { key: 'notes', marker: 'CHECK_NOTES', label: { en: 'Check notes', zh: '检查提醒' }, markdown: true },
    ],
  },
  buildPayload: (values) => ({
    text: values.text,
    tone: values.tone,
    language: values.language,
  }),
};

export const translatorConfig: AiRuntimeToolConfig = {
  toolId: 'ai-translator',
  endpoint: '/api/ai-translator',
  icon: 'sparkles',
  title: { en: 'AI Translator', zh: 'AI 翻译工具' },
  subtitle: { en: 'Translate text with context and tone control.', zh: '按目标语言和语气翻译文本。' },
  formTitle: { en: 'Translation brief', zh: '翻译简报' },
  generateLabel: { en: 'Translate text', zh: '翻译文本' },
  waitingLabel: { en: 'Your translation will appear here.', zh: '译文会显示在这里。' },
  loadingLabel: { en: 'Translating...', zh: '正在翻译...' },
  fields: [
    {
      key: 'text',
      type: 'textarea',
      label: { en: 'Source text', zh: '源文本' },
      placeholder: { en: 'Paste text to translate...', zh: '粘贴需要翻译的文本...' },
      required: true,
    },
    {
      key: 'targetLang',
      type: 'select',
      label: { en: 'Target language', zh: '目标语言' },
      defaultValue: 'English',
      options: [
        { value: 'English', label: { en: 'English', zh: '英文' } },
        { value: 'Simplified Chinese', label: { en: 'Simplified Chinese', zh: '简体中文' } },
        { value: 'Traditional Chinese', label: { en: 'Traditional Chinese', zh: '繁体中文' } },
        { value: 'Japanese', label: { en: 'Japanese', zh: '日文' } },
        { value: 'Korean', label: { en: 'Korean', zh: '韩文' } },
        { value: 'French', label: { en: 'French', zh: '法文' } },
        { value: 'German', label: { en: 'German', zh: '德文' } },
        { value: 'Spanish', label: { en: 'Spanish', zh: '西班牙文' } },
        { value: 'Portuguese', label: { en: 'Portuguese', zh: '葡萄牙文' } },
        { value: 'Russian', label: { en: 'Russian', zh: '俄文' } },
      ],
    },
    {
      key: 'tone',
      type: 'select',
      label: { en: 'Tone', zh: '语气' },
      defaultValue: 'Native',
      options: [
        { value: 'Native', label: { en: 'Native', zh: '地道母语' } },
        { value: 'Professional', label: { en: 'Professional', zh: '专业严谨' } },
        { value: 'Literary', label: { en: 'Literary', zh: '文学' } },
        { value: 'Casual', label: { en: 'Casual', zh: '轻松' } },
      ],
    },
  ],
  result: {
    type: 'sections',
    sections: [
      { key: 'translation', marker: 'TRANSLATION', label: { en: 'Translation', zh: '译文' }, markdown: true },
      { key: 'notes', marker: 'REVIEW_NOTES', label: { en: 'Review notes', zh: '复核提醒' }, markdown: true },
    ],
  },
  buildPayload: (values) => ({
    text: values.text,
    targetLang: values.targetLang,
    tone: values.tone,
  }),
};

export const excelFormulaConfig: AiRuntimeToolConfig = {
  toolId: 'ai-excel-formula',
  endpoint: '/api/ai-excel-formula',
  icon: 'zap',
  title: { en: 'AI Excel Formula Generator', zh: 'AI Excel 公式生成器' },
  subtitle: { en: 'Generate spreadsheet formulas from plain-language requirements.', zh: '用自然语言生成 Excel 或 Google Sheets 公式。' },
  formTitle: { en: 'Formula brief', zh: '公式简报' },
  generateLabel: { en: 'Generate formula', zh: '生成公式' },
  waitingLabel: { en: 'Your formula will appear here.', zh: '生成后的公式会显示在这里。' },
  loadingLabel: { en: 'Generating formula...', zh: '正在生成公式...' },
  fields: [
    {
      key: 'requirement',
      type: 'textarea',
      label: { en: 'Spreadsheet task', zh: '表格任务' },
      placeholder: { en: 'Sum column B when column A is East and column C is in May 2026.', zh: 'A 列为华东且 C 列为 2026 年 5 月时，汇总 B 列金额。' },
      required: true,
    },
    {
      key: 'formulaType',
      type: 'select',
      label: { en: 'Spreadsheet app', zh: '表格类型' },
      defaultValue: 'excel',
      options: [
        { value: 'excel', label: { en: 'Microsoft Excel', zh: 'Microsoft Excel' } },
        { value: 'google-sheets', label: { en: 'Google Sheets', zh: 'Google Sheets' } },
      ],
    },
    {
      key: 'language',
      type: 'language',
      label: { en: 'Output language', zh: '输出语言' },
      options: [
        { value: 'English', label: { en: 'English', zh: '英文' } },
        { value: 'Chinese', label: { en: 'Chinese', zh: '中文' } },
      ],
    },
  ],
  result: {
    type: 'sections',
    sections: [
      { key: 'formula', marker: 'FORMULA', label: { en: 'Formula', zh: '公式' }, monospace: true },
      { key: 'explanation', marker: 'EXPLANATION', label: { en: 'Explanation', zh: '解释' }, markdown: true },
      { key: 'notes', marker: 'NOTES', label: { en: 'Notes', zh: '注意事项' }, markdown: true },
    ],
  },
  buildPayload: (values) => ({
    requirement: values.requirement,
    formulaType: values.formulaType,
    language: values.language,
  }),
};

export const regexGeneratorConfig: AiRuntimeToolConfig = {
  toolId: 'ai-regex',
  endpoint: '/api/ai-regex',
  icon: 'zap',
  title: { en: 'AI Regex Generator', zh: 'AI 正则生成器' },
  subtitle: { en: 'Create regex patterns from matching requirements, with examples.', zh: '根据匹配需求生成正则表达式和测试样例。' },
  formTitle: { en: 'Regex brief', zh: '正则简报' },
  generateLabel: { en: 'Generate regex', zh: '生成正则' },
  waitingLabel: { en: 'Your regex draft will appear here.', zh: '生成后的正则会显示在这里。' },
  loadingLabel: { en: 'Generating regex...', zh: '正在生成正则...' },
  fields: [
    {
      key: 'requirement',
      type: 'textarea',
      label: { en: 'Matching requirement', zh: '匹配需求' },
      placeholder: { en: 'Match valid email addresses and reject missing domains.', zh: '匹配合法邮箱，排除缺少域名的格式。' },
      required: true,
    },
    {
      key: 'flavor',
      type: 'select',
      label: { en: 'Regex flavor', zh: '正则风格' },
      defaultValue: 'javascript',
      options: [
        { value: 'javascript', label: { en: 'JavaScript', zh: 'JavaScript' } },
        { value: 'python', label: { en: 'Python', zh: 'Python' } },
        { value: 'java', label: { en: 'Java', zh: 'Java' } },
        { value: 'go', label: { en: 'Go', zh: 'Go' } },
        { value: 'pcre', label: { en: 'PCRE', zh: 'PCRE' } },
        { value: 'ruby', label: { en: 'Ruby', zh: 'Ruby' } },
      ],
    },
    {
      key: 'language',
      type: 'language',
      label: { en: 'Output language', zh: '输出语言' },
      options: [
        { value: 'English', label: { en: 'English', zh: '英文' } },
        { value: 'Chinese', label: { en: 'Chinese', zh: '中文' } },
      ],
    },
  ],
  result: {
    type: 'sections',
    sections: [
      { key: 'regex', marker: 'REGEX', label: { en: 'Regex', zh: '正则表达式' }, monospace: true },
      { key: 'explanation', marker: 'EXPLANATION', label: { en: 'Explanation', zh: '解释' }, markdown: true },
      { key: 'tests', marker: 'TEST_CASES', label: { en: 'Test cases', zh: '测试样例' }, markdown: true },
    ],
  },
  buildPayload: (values) => ({
    requirement: values.requirement,
    flavor: values.flavor,
    language: values.language,
  }),
};

export const xiaohongshuConfig: AiRuntimeToolConfig = {
  toolId: 'ai-xiaohongshu',
  endpoint: '/api/xiaohongshu',
  icon: 'sparkles',
  title: { en: 'Xiaohongshu Caption Generator', zh: '小红书文案生成器' },
  subtitle: { en: 'Draft Xiaohongshu titles, body copy, hashtags, and engagement prompts.', zh: '生成小红书标题、正文、话题标签和互动引导。' },
  formTitle: { en: 'Post brief', zh: '笔记简报' },
  generateLabel: { en: 'Generate post copy', zh: '生成笔记文案' },
  waitingLabel: { en: 'Your Xiaohongshu draft will appear here.', zh: '生成后的小红书文案会显示在这里。' },
  loadingLabel: { en: 'Generating post copy...', zh: '正在生成小红书文案...' },
  fields: [
    {
      key: 'topic',
      type: 'input',
      label: { en: 'Core topic', zh: '核心主题' },
      placeholder: { en: 'Minimal winter skincare routine for oily skin', zh: '油皮冬季极简护肤流程' },
      required: true,
    },
    {
      key: 'keywords',
      type: 'input',
      label: { en: 'Required keywords', zh: '关键词' },
      placeholder: { en: 'affordable, oil-control, no pilling', zh: '平价, 控油, 不搓泥' },
    },
    {
      key: 'style',
      type: 'select',
      label: { en: 'Note style', zh: '笔记风格' },
      defaultValue: '种草测评',
      options: [
        { value: '种草测评', label: { en: 'Review / recommendation', zh: '种草测评' } },
        { value: '干货教程', label: { en: 'Tutorial', zh: '干货教程' } },
        { value: '情感共鸣', label: { en: 'Personal story', zh: '情感共鸣' } },
        { value: '好物合集', label: { en: 'Product roundup', zh: '好物合集' } },
        { value: '探店打卡', label: { en: 'Store check-in', zh: '探店打卡' } },
      ],
    },
    {
      key: 'language',
      type: 'language',
      label: { en: 'Output language', zh: '输出语言' },
      options: [
        { value: 'Chinese', label: { en: 'Chinese', zh: '中文' } },
        { value: 'English', label: { en: 'English', zh: '英文' } },
      ],
    },
  ],
  result: {
    type: 'sections',
    sections: [
      { key: 'titles', marker: 'TITLES', label: { en: 'Titles', zh: '标题方向' }, markdown: true },
      { key: 'body', marker: 'BODY', label: { en: 'Body', zh: '正文' }, markdown: true },
      { key: 'hashtags', marker: 'HASHTAGS', label: { en: 'Hashtags', zh: '话题标签' }, monospace: true },
      { key: 'notes', marker: 'REVIEW_NOTES', label: { en: 'Review notes', zh: '复核提醒' }, markdown: true },
    ],
  },
  buildPayload: (values) => ({
    topic: values.topic,
    keywords: values.keywords,
    style: values.style,
    language: values.language,
  }),
};

export const competitorTrackerConfig: AiRuntimeToolConfig = {
  toolId: 'competitor-tracker',
  endpoint: '/api/competitor',
  icon: 'zap',
  title: { en: 'Ecommerce Competitor Tracker', zh: '电商竞品分析器' },
  subtitle: { en: 'Compare your product with competitor notes and find listing gaps.', zh: '对比你的产品和竞品，找出卖点差异和文案机会。' },
  formTitle: { en: 'Comparison brief', zh: '对比简报' },
  generateLabel: { en: 'Analyze competitor', zh: '分析竞品' },
  waitingLabel: { en: 'Your competitor analysis will appear here.', zh: '竞品分析结果会显示在这里。' },
  loadingLabel: { en: 'Analyzing competitor...', zh: '正在分析竞品...' },
  fields: [
    {
      key: 'productName',
      type: 'textarea',
      label: { en: 'My product', zh: '我的产品' },
      placeholder: { en: 'Handwoven tote bag, waterproof lining, wide padded straps...', zh: '手工编织托特包，防水内衬，加宽肩带...' },
      required: true,
    },
    {
      key: 'competitorInfo',
      type: 'textarea',
      label: { en: 'Competitor details', zh: '竞品详情' },
      placeholder: { en: 'Competitor title, review complaints, price, specs, offer notes...', zh: '竞品标题、评价槽点、价格、规格、优惠信息...' },
      required: true,
    },
    {
      key: 'language',
      type: 'language',
      label: { en: 'Output language', zh: '输出语言' },
      options: [
        { value: 'English', label: { en: 'English', zh: '英文' } },
        { value: 'Chinese', label: { en: 'Chinese', zh: '中文' } },
      ],
    },
  ],
  result: {
    type: 'sections',
    sections: [
      { key: 'comparison', marker: 'COMPARISON', label: { en: 'Comparison', zh: '对比结果' }, markdown: true },
      { key: 'opportunities', marker: 'OPPORTUNITIES', label: { en: 'Opportunities', zh: '机会点' }, markdown: true },
      { key: 'nextSteps', marker: 'NEXT_STEPS', label: { en: 'Next steps', zh: '下一步' }, markdown: true },
    ],
  },
  buildPayload: (values) => ({
    productName: values.productName,
    competitorInfo: values.competitorInfo,
    language: values.language,
  }),
};

export const marketInsightsConfig: AiRuntimeToolConfig = {
  toolId: 'market-insights',
  endpoint: '/api/market-research',
  icon: 'zap',
  title: { en: 'Ecommerce Market Insights Generator', zh: '电商市场洞察工具' },
  subtitle: { en: 'Draft market research notes from a platform, category, or product idea.', zh: '把平台、品类或产品想法整理成市场研究笔记。' },
  formTitle: { en: 'Research brief', zh: '研究简报' },
  generateLabel: { en: 'Generate insights', zh: '生成洞察' },
  waitingLabel: { en: 'Your market notes will appear here.', zh: '市场研究笔记会显示在这里。' },
  loadingLabel: { en: 'Generating insights...', zh: '正在生成洞察...' },
  fields: [
    {
      key: 'platform',
      type: 'select',
      label: { en: 'Platform', zh: '平台' },
      defaultValue: 'Etsy',
      options: [
        { value: 'Etsy', label: { en: 'Etsy', zh: 'Etsy' } },
        { value: 'Amazon', label: { en: 'Amazon', zh: 'Amazon' } },
        { value: 'TikTok Shop', label: { en: 'TikTok Shop', zh: 'TikTok Shop' } },
        { value: 'eBay', label: { en: 'eBay', zh: 'eBay' } },
      ],
    },
    {
      key: 'timeframe',
      type: 'select',
      label: { en: 'Timeframe', zh: '时间范围' },
      defaultValue: '7',
      options: [
        { value: '1', label: { en: '1 day', zh: '1 天' } },
        { value: '3', label: { en: '3 days', zh: '3 天' } },
        { value: '7', label: { en: '7 days', zh: '7 天' } },
      ],
    },
    {
      key: 'productDirection',
      type: 'textarea',
      label: { en: 'Category or product idea', zh: '品类或产品方向' },
      placeholder: { en: 'Personalized gifts for graduation season', zh: '毕业季个性化礼品' },
    },
    {
      key: 'language',
      type: 'language',
      label: { en: 'Output language', zh: '输出语言' },
      options: [
        { value: 'English', label: { en: 'English', zh: '英文' } },
        { value: 'Chinese', label: { en: 'Chinese', zh: '中文' } },
      ],
    },
  ],
  result: {
    type: 'sections',
    sections: [
      { key: 'notes', marker: 'MARKET_NOTES', label: { en: 'Market notes', zh: '市场笔记' }, markdown: true },
      { key: 'opportunities', marker: 'OPPORTUNITIES', label: { en: 'Opportunities', zh: '机会点' }, markdown: true },
      { key: 'validation', marker: 'VALIDATION', label: { en: 'Validation', zh: '验证建议' }, markdown: true },
    ],
  },
  buildPayload: (values) => ({
    platform: values.platform,
    timeframe: values.timeframe,
    productDirection: values.productDirection,
    language: values.language,
  }),
};
