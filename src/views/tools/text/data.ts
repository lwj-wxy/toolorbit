import type { TechnicalOverview } from '../../../types/tool-overview';

type BilingualOverview = {
  zh: TechnicalOverview;
  en: TechnicalOverview;
};

export const TEXT_TOOL_OVERVIEWS: Record<string, BilingualOverview> = {
  'text-analyzer': {
    zh: {
      summary:
        '文本分析器用于在浏览器中实时统计文本的字数、字符数、段落数、句子数、阅读时长和字符频率分布。适合检查文章是否满足发布平台的字数要求（如微信公众号 300 字原创标、知乎回答最低字数）、评估翻译稿与原文的长度比例、为 SEO 内容优化提供阅读时长参考（结合跳出率分析用户停留预期）、检查学术论文摘要的字符限制合规性，以及分析文本中高频字符或词汇的分布特征。工具对中英文混合文本做了专门优化：中文按单字分词，英文按空格分词并过滤常见停用词，所有分析在浏览器本地完成无需上传。',
      input:
        '任意需要统计分析的文本内容。可以是中文文章、英文段落、中英混合技术文档、代码注释、Markdown 原文或从 Word / 网页复制的富文本。输入框支持多行文本粘贴，工具实时更新所有统计指标。对中英混合内容，工具自动识别 CJK 字符和拉丁字母并分别采用不同的分词策略：中文按 Unicode 字符逐个计数，英文按空格分割的单词计数。',
      output:
        '六项实时更新的文本统计指标：字数（中文字符数 + 英文单词数）、字符数（含空格的总字符数）、不含空格字符数、句子数（按中英文句号、问号、感叹号等标点分隔）、段落数（按换行符分隔的非空段落），以及估算阅读时间（英文按 200 词/分钟、中文按 400 字/分钟分别计算后加总）。同时展示字符频率分布条形图：纯中文或中英混合文本展示 Top 8 高频字符的占比，纯英文文本展示 Top 10 高频单词的占比，每项含百分比数字和颜色编码的进度条。',
      processing:
        '在浏览器本地通过正则表达式和 Unicode 属性转义（\\p{Script=Han}）识别中文字符。分词时对 CJK 字符按单字切分（逐字符遍历），对拉丁/西里尔等非 CJK 文本按空格和标点边界切分为单词，再通过内置的中英双语停用词表过滤高频虚词（如"的、了、是、the、a、is"等）。句子统计基于中英文标点（。！？.!?）分隔。阅读时间估算：英文部分按 200 词/分钟、中文部分按 400 字/分钟。频率图通过 Map 计数后排序取 Top 展示。全部统计流程在浏览器端同步完成。',
      modes: ['中文字数统计', '英文单词统计', '字符 / 不含空格字符数', '句子 / 段落数', '中英混合阅读时长', '字符/单词频率图表'],
      example: {
        title: '文本分析输入到输出示例',
        input:
          'ToolOrbit 是一款免费的在线工具平台，提供 JSON 格式化、二维码生成等开发者工具。\n\n它为全球用户提供了快速、隐私友好的浏览器端处理体验。ToolOrbit is a free online tool platform for developers and creators.',
        output:
          '字数: 28（中文 22 字 + 英文 6 词）\n字符数: 114\n不含空格字符数: 108\n句子数: 4\n段落数: 2\n阅读时间: ~8 秒\n\n字符频率 Top 8: T → 8.3% | o → 7.1% | r → 5.9% | 提 → 5.2% | ...',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The Text Analyzer provides real-time statistics for any text content in the browser, including word count, character count, paragraph count, sentence count, estimated reading time, and character/word frequency distribution. Ideal for checking whether articles meet publishing platform word-count requirements (e.g. 300-character thresholds for originality badges), evaluating the length ratio between translations and source text, providing reading-time estimates for SEO content optimization (to assess user dwell-time expectations alongside bounce rate analysis), verifying compliance with character limits for academic paper abstracts, and analyzing the distribution of high-frequency characters or words in text. The tool is specially optimized for mixed Chinese-English content: Chinese characters are tokenized individually, while English words are split by whitespace with common stop-word filtering. All analysis runs locally in the browser with no upload required.',
      input:
        'Any text content requiring statistical analysis. Accepts Chinese articles, English paragraphs, mixed Chinese-English technical documents, code comments, Markdown source, or rich text copied from Word or web pages. The input field supports multi-line text pasting, with all statistics updating in real time. For mixed content, the tool automatically detects CJK characters and Latin letters, applying different tokenization strategies: Chinese characters are counted individually by Unicode character, while English words are counted by whitespace-delimited tokens.',
      output:
        'Six real-time text statistics: word count (Chinese characters + English words), character count (total characters including spaces), character count excluding spaces, sentence count (delimited by Chinese and English punctuation such as periods, question marks, and exclamation marks), paragraph count (non-empty paragraphs delimited by newline characters), and estimated reading time (computed separately at 200 words/min for English and 400 chars/min for Chinese, then summed). Also displays a character/word frequency bar chart: for Chinese or mixed content, the Top 8 most frequent characters with percentage shares; for pure English content, the Top 10 most frequent words, each with a percentage and color-coded progress bar.',
      processing:
        'Detects Chinese characters in the browser using regular expressions and Unicode property escapes (\\p{Script=Han}). For tokenization, CJK characters are split individually (character-by-character traversal), while Latin, Cyrillic, and other non-CJK text is split by whitespace and punctuation boundaries into words. A built-in bilingual (Chinese-English) stop-word list filters out high-frequency function words (such as 的, 了, 是, the, a, is). Sentence counting is based on Chinese and English punctuation marks (。！？.!?). Reading time estimation: English text at 200 words/min, Chinese text at 400 chars/min. The frequency chart uses Map counting, sorted by frequency to display the top items. The entire statistics pipeline runs synchronously in the browser.',
      modes: ['Chinese character count', 'English word count', 'Chars / chars no spaces', 'Sentence / paragraph count', 'Mixed EN-CN reading time', 'Char/word frequency chart'],
      example: {
        title: 'Text analysis input-to-output example',
        input:
          'ToolOrbit is a free online tool platform offering developer tools like JSON formatting and QR code generation.\n\nIt provides a fast, privacy-friendly in-browser processing experience for users worldwide.',
        output:
          'Words: 24\nChars: 168\nChars no spaces: 145\nSentences: 3\nParagraphs: 2\nReading time: ~7 sec\n\nWord frequency Top 10: tool → 6.0% | a → 4.8% | and → 3.6% | ...',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
  },

  'text-cleaner': {
    zh: {
      summary:
        '字符串清洗工具用于按选定规则快速去除文本中的空格、换行符、制表符、空白行和标点符号。适合处理从 PDF 复制出的断行文本、网页采集内容、代码或配置片段、NLP 预处理文本、数据库导入内容、CSV 导出内容、聊天记录和日志摘录。结果可一键复制或下载为 TXT 文件，所有处理在本地完成。',
      input:
        '需要清洗的原始文本以及规则开关配置。支持五种可独立启用的清洗规则：去除空格（删除所有半角空格 U+0020）、去除换行符（将 \\r\\n、\\r、\\n 统一移除使文本变为单行）、去除空白行（将连续两个以上换行符合并为单个换行符，清除段落间多余空行）、去除制表符（删除 \\t 字符）和去除标点符号（删除所有 Unicode 标点、符号及特殊字符，仅保留字母、数字和空白）。规则按固定顺序链式执行，可任意组合。',
      output:
        '按启用规则清洗后的文本结果，实时随输入内容和规则开关变化更新。去除空格后所有单词将紧密相连；去除换行符后多行文本合并为单行；去除空白行后段落间仅保留一个换行符作为分隔；去除制表符后缩进信息丢失但文本更紧凑；去除标点符号后仅保留字母、数字和空白字符。清洗结果支持一键复制到剪贴板（复制成功有勾选动画反馈）和下载为 TXT 文件。',
      processing:
        '工具会按固定顺序应用已启用的清洗规则：先处理空格，再处理换行、空白行、制表符和标点符号。每次输入或规则变化后，结果都会立即更新。复制和 TXT 下载只作用于当前清洗结果，原始输入不会上传。',
      modes: ['去除空格', '去除换行符', '去除空白行', '去除制表符', '去除标点符号', '一键复制', 'TXT 下载'],
      example: {
        title: '文本清洗输入到输出示例',
        input:
          '原始文本：\n\n\n  Hello  世界  —— ToolOrbit！  \n\n\t欢迎使用  在线工具。  \n\n\n（清洗前包含多余空行、空格、制表符和标点。）',
        output:
          'Hello世界ToolOrbit\n欢迎使用在线工具\n清洗前包含多余空行空格制表符和标点',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The Text Cleaner removes spaces, newlines, tabs, blank lines, and punctuation according to the rules you select. It is useful for PDF copy text, web-scraped content, code or configuration snippets, NLP preprocessing, database imports, CSV exports, chat logs, and application logs. Results can be copied with one click or downloaded as a TXT file, and all processing stays local.',
      input:
        'The raw text to clean, along with rule toggle configuration. Five independently-enabled cleaning rules are supported: Remove Spaces (deletes all ASCII space characters U+0020), Remove Newlines (strips \\r\\n, \\r, and \\n to collapse text to a single line), Remove Blank Lines (merges two or more consecutive newlines into a single newline, eliminating excessive blank space between paragraphs), Remove Tabs (deletes \\t characters), and Remove Punctuation (deletes all Unicode punctuation, symbols, and special characters, keeping only letters, digits, and whitespace). Rules execute in a fixed chained order and can be combined arbitrarily.',
      output:
        'The cleaned text result reflecting all enabled rules, updating in real time as both input content and rule toggles change. Removing spaces joins all words tightly together. Removing newlines collapses multi-line text into a single line. Removing blank lines keeps only one newline as a separator between paragraphs. Removing tabs loses indentation information but produces more compact text. Removing punctuation keeps only letters, digits, and whitespace. Cleaned results support one-click copy to clipboard (with a checkmark animation on success) and TXT file download.',
      processing:
        'The tool applies enabled cleaning rules in a fixed order: spaces, newlines, blank lines, tabs, then punctuation. The result updates immediately whenever the input or rule set changes. Copy and TXT download use the current cleaned result only, and the original input is not uploaded.',
      modes: ['Remove spaces', 'Remove newlines', 'Remove blank lines', 'Remove tabs', 'Remove punctuation', 'One-click copy', 'TXT download'],
      example: {
        title: 'Text cleaning input-to-output example',
        input:
          'Original text:\n\n\n  Hello  World  --- ToolOrbit!  \n\n\tWelcome to  online tools.  \n\n\n(Before cleaning: contains extra blank lines, spaces, tabs, and punctuation.)',
        output:
          'HelloWorldToolOrbit\nWelcome to online tools\nBefore cleaning contains extra blank lines spaces tabs and punctuation',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
  },

  'symbol-library': {
    zh: {
      summary:
        '特殊符号大全用于浏览、搜索和快速复制 230+ 个常用 Unicode 特殊符号与排版字符。适合为社交媒体文案添加表情和装饰符号、为技术文档和论文插入数学符号与希腊字母、为网页设计和 UI 原型选取箭头符号、为电商标题添加货币或单位标记，以及为代码注释和 Markdown 文档插入版权/商标标记。符号按类别整理，点击即可复制。',
      input:
        '无需手动输入文本。工具启动时自动加载全部 230+ 符号，按七个内置类别分组展示：表情符号（Emoji 面部和手势）、数学符号（∑∆∞√∫± 等常用数学运算符号）、箭头符号（→←↑↓↔ 等方向标识）、版权与特殊标记（©®™ 等法律和商业标记）、货币与单位（¥€$£₽℃℉ 等国际货币符号和度量单位）、星形符号（★☆✩✮ 等评星和装饰星号），以及括号符号（【】「」『』 等中英文排版括号）。可通过左侧分类栏切换浏览，或通过顶部搜索框按符号字符本身或分类名称模糊匹配过滤。',
      output:
        '当前选中分类或搜索过滤后的符号网格视图。每个符号以大号字体独立展示，并标注所属分类。点击任意符号后会复制到剪贴板，并短暂显示复制成功反馈。用户无需手动选中和 Ctrl+C，可直接切换到目标应用粘贴使用。',
      processing:
        '工具会按符号字符、分类名称和关键词筛选当前符号列表。点击符号后写入剪贴板；如果当前环境不支持直接复制，页面会使用兼容方式完成复制。符号数据随页面提供，不需要网络请求。',
      modes: ['230+ 符号合集', '表情 / 数学 / 箭头', '版权 / 货币 / 单位', '星形 / 括号符号', '分类浏览 + 实时搜索', '点击即复制', '复制动画反馈'],
      example: {
        title: '符号库分类与搜索示例',
        input:
          '搜索: "版权" → 过滤展示 © ® ℗ ℠ ™\n搜索: "数学" → 过滤展示 ∑ ∆ ∞ √ ∫ ± × ÷\n搜索: "箭" → 过滤展示 → ← ↑ ↓ ↔ ↕',
        output:
          '点击 © → 剪贴板内容: ©\n点击 ∑ → 剪贴板内容: ∑\n点击 → → 剪贴板内容: →',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The Symbol Library lets you browse, search, and quickly copy 230+ commonly used Unicode symbols and typographic characters. It is useful for social media copy, technical documents, academic papers, web design, UI prototypes, ecommerce titles, code comments, and Markdown files. Symbols are organized by category with real-time search filtering. Click any symbol to copy it.',
      input:
        'No manual text input required. The tool loads all 230+ symbols automatically on launch, grouped into seven built-in categories: Emoji (facial expressions and hand gestures), Math Symbols (∑ ∆ ∞ √ ∫ ± and other common mathematical operators), Arrow Symbols (→ ← ↑ ↓ ↔ and other directional indicators), Copyright & Special Marks (© ® ™ and other legal/commercial marks), Currency & Units (¥ € $ £ ₽ ℃ ℉ and other international currency symbols and measurement units), Star Symbols (★ ☆ ✩ ✮ for ratings and decorative stars), and Bracket Symbols (【 】 「 」 『 』 and other Chinese/English typographic brackets). Navigate via the category sidebar, or use the search box at the top to filter by symbol character or category name via fuzzy matching.',
      output:
        'A grid view of symbols filtered by the selected category or search query. Each symbol is displayed prominently with its category name. Clicking any symbol copies it to the clipboard and shows a brief success state. No manual selection or Ctrl+C is needed; click, switch to the target app, and paste.',
      processing:
        'The tool filters symbols by character, category, and keyword. Clicking a symbol writes it to the clipboard; if direct clipboard access is unavailable, a compatible copy method is used. Symbol data is provided with the page and does not require a network request.',
      modes: ['230+ symbol collection', 'Emoji / Math / Arrows', 'Copyright / Currency / Units', 'Stars / Brackets', 'Category browse + search', 'Click to copy', 'Copy animation feedback'],
      example: {
        title: 'Symbol library category and search example',
        input:
          'Search: "copyright" → filters to © ® ℗ ℠ ™\nSearch: "math" → filters to ∑ ∆ ∞ √ ∫ ± × ÷\nSearch: "arrow" → filters to → ← ↑ ↓ ↔ ↕',
        output:
          'Click © → clipboard: ©\nClick ∑ → clipboard: ∑\nClick → → clipboard: →',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
  },
};
