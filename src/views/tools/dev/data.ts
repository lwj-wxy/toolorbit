import type { TechnicalOverview } from '../../../types/tool-overview';

type BilingualOverview = {
  zh: TechnicalOverview;
  en: TechnicalOverview;
};

export const DEV_TOOL_OVERVIEWS: Record<string, BilingualOverview> = {
  'json-formatter': {
    zh: {
      summary:
        'JSON 格式化工具用于在浏览器中校验、美化、压缩和整理 JSON 文本。适合处理 API 接口响应、前端配置文件（如 package.json、tsconfig.json）、日志系统中的结构化数据，以及调试时从网络面板复制的压缩 JSON。工具会先校验 JSON 语法合法性，再按选定缩进风格重新排版，帮助开发者快速定位缺失逗号、括号不匹配等常见错误。',
      input:
        '原始 JSON 字符串。可以是后端返回的单行压缩 JSON（如 {"code":0,"data":{"items":[{"id":1}]}}），也可以是手工编辑后格式混乱、缩进不一致的 JSON 片段。工具同时接受完整的对象、数组以及嵌套深度较大的复杂结构。',
      output:
        '按选定缩进（2 空格或 4 空格）重新格式化的 JSON 文本，键名与值按层级对齐，数组元素独立成行。当输入存在语法错误时，工具不会静默改写内容，而是输出包含行号与错误类型的解析提示（如 "Unexpected token } at position 42"），方便逐一定位修复。',
      processing:
        '使用浏览器内置 JSON.parse 进行严格语法校验，捕获并展示解析异常；校验通过后通过 JSON.stringify 按用户选择的缩进空格数重新序列化。整个解析、校验与格式化流程均在本地浏览器中同步完成，输入内容不会离开用户设备。',
      modes: ['2 空格缩进', '4 空格缩进', '实时校验', '语法错误定位', '一键复制输出'],
      example: {
        title: 'JSON 格式化输入到输出示例',
        input: '{"name":"ToolOrbit","enabled":true,"tags":["json","format","dev"],"author":{"name":"Dev","active":true}}',
        output:
          '{\n  "name": "ToolOrbit",\n  "enabled": true,\n  "tags": [\n    "json",\n    "format",\n    "dev"\n  ],\n  "author": {\n    "name": "Dev",\n    "active": true\n  }\n}',
        inputLanguage: 'json',
        outputLanguage: 'json',
      },
    },
    en: {
      summary:
        'The JSON Formatter validates, beautifies, compresses, and organizes JSON text directly in the browser. Ideal for working with API responses, frontend configuration files (such as package.json and tsconfig.json), structured data from logging systems, and minified JSON copied from the browser Network panel during debugging. The tool first validates JSON syntax, then reformats it according to the selected indentation style, helping developers quickly locate common errors such as missing commas and mismatched brackets.',
      input:
        'A raw JSON string. This can be a single-line minified JSON response from a backend API (e.g. {"code":0,"data":{"items":[{"id":1}]}}), or a hand-edited JSON fragment with inconsistent formatting and indentation. The tool accepts complete objects, arrays, and deeply nested complex structures.',
      output:
        'Reformatted JSON text using the selected indentation (2-space or 4-space), with keys and values aligned by nesting level and array elements on separate lines. When the input contains a syntax error, the tool does not silently rewrite the content; instead it displays a parse error with the line number and error type (e.g. "Unexpected token } at position 42"), so you can locate and fix each issue.',
      processing:
        'Uses the browser built-in JSON.parse for strict syntax validation, catching and displaying parse exceptions. Once validated, the data is re-serialized via JSON.stringify with the user-selected number of indentation spaces. The entire parse, validate, and format pipeline runs synchronously in the local browser; input content never leaves the device.',
      modes: ['2-space indent', '4-space indent', 'Real-time validation', 'Syntax error location', 'One-click copy output'],
      example: {
        title: 'JSON Formatter input-to-output example',
        input: '{"name":"ToolOrbit","enabled":true,"tags":["json","format","dev"],"author":{"name":"Dev","active":true}}',
        output:
          '{\n  "name": "ToolOrbit",\n  "enabled": true,\n  "tags": [\n    "json",\n    "format",\n    "dev"\n  ],\n  "author": {\n    "name": "Dev",\n    "active": true\n  }\n}',
        inputLanguage: 'json',
        outputLanguage: 'json',
      },
    },
  },

  'xml-json': {
    zh: {
      summary:
        'XML / JSON 转换工具用于在 XML 文档结构与 JSON 数据结构之间双向转换。适合处理 SOAP/XML-RPC 接口响应、RSS 订阅源、Sitemap 网站地图、SVG 矢量图形标记以及 Android 布局文件等 XML 内容；同时支持将 JSON 配置或接口返回体逆向转回 XML。粘贴 HTML 页面源码时，工具会自动识别并使用浏览器的 DOMParser 进行宽松容错解析，输出标准 DOM 树结构的 JSON 表示。',
      input:
        '在 XML → JSON 模式下，输入标准 XML 文档、HTML 页面源码或 XML 片段（如 <root><item id="1">Hello</item></root>）。在 JSON → XML 模式下，输入合法的 JSON 对象字符串，工具会将其序列化为等价的 XML 标记。',
      output:
        '在 XML → JSON 模式下，输出紧凑型 JSON 对象，XML 属性映射为 _attributes 键，文本节点映射为 _text 键，子元素嵌套为同名属性。粘贴 HTML 源码时输出包含 documentType 和 root 节点的完整 DOM JSON 树。在 JSON → XML 模式下，输出带 2 空格缩进的可读 XML 文本。',
      processing:
        'XML → JSON 方向先判断输入是否为 HTML（检测 <html> 标签或 <!DOCTYPE> 声明），HTML 使用浏览器原生 DOMParser 进行容错解析并递归遍历 DOM 树构建 JSON；标准 XML 通过 xml-js 库严格解析后输出紧凑 JSON。JSON → XML 方向先校验 JSON 合法性，再通过 xml-js 序列化为 XML 标记。全程在浏览器端执行。',
      modes: ['XML 转 JSON', 'JSON 转 XML', 'HTML DOM 解析', '方向一键切换', '复制转换结果'],
      example: {
        title: 'XML 输入到 JSON 输出示例',
        input:
          '<catalog>\n  <book id="bk101">\n    <title>XML Guide</title>\n    <price>44.95</price>\n  </book>\n  <book id="bk102">\n    <title>JSON Guide</title>\n    <price>39.95</price>\n  </book>\n</catalog>',
        output:
          '{\n  "catalog": {\n    "book": [\n      {\n        "_attributes": { "id": "bk101" },\n        "title": { "_text": "XML Guide" },\n        "price": { "_text": "44.95" }\n      },\n      {\n        "_attributes": { "id": "bk102" },\n        "title": { "_text": "JSON Guide" },\n        "price": { "_text": "39.95" }\n      }\n    ]\n  }\n}',
        inputLanguage: 'xml',
        outputLanguage: 'json',
      },
    },
    en: {
      summary:
        'The XML / JSON Converter performs bidirectional conversion between XML document structures and JSON data structures. Suitable for processing SOAP/XML-RPC API responses, RSS feeds, XML Sitemaps, SVG vector graphics markup, and Android layout files; it also supports converting JSON configurations or API response bodies back to XML. When pasting HTML page source code, the tool automatically detects it and uses the browser\'s native DOMParser for lenient fault-tolerant parsing, outputting a JSON representation of the standard DOM tree structure.',
      input:
        'In XML → JSON mode, provide a standard XML document, HTML page source, or XML fragment (e.g. <root><item id="1">Hello</item></root>). In JSON → XML mode, provide a valid JSON object string, and the tool will serialize it into equivalent XML markup.',
      output:
        'In XML → JSON mode, the output is a compact JSON object where XML attributes are mapped to _attributes keys, text nodes are mapped to _text keys, and child elements are nested as same-name properties. When pasting HTML source, the output includes a complete DOM JSON tree with documentType and root nodes. In JSON → XML mode, the output is readable XML text with 2-space indentation.',
      processing:
        'In the XML → JSON direction, the tool first checks whether the input is HTML (by detecting <html> tags or <!DOCTYPE> declarations). HTML is parsed using the browser\'s native DOMParser with fault-tolerant parsing, then the DOM tree is recursively traversed to build JSON. Standard XML is strictly parsed via the xml-js library and output as compact JSON. In the JSON → XML direction, the tool validates the JSON first, then serializes it into XML markup via xml-js. All processing runs in the browser.',
      modes: ['XML to JSON', 'JSON to XML', 'HTML DOM parsing', 'One-click direction switch', 'Copy conversion result'],
      example: {
        title: 'XML to JSON conversion example',
        input:
          '<catalog>\n  <book id="bk101">\n    <title>XML Guide</title>\n    <price>44.95</price>\n  </book>\n  <book id="bk102">\n    <title>JSON Guide</title>\n    <price>39.95</price>\n  </book>\n</catalog>',
        output:
          '{\n  "catalog": {\n    "book": [\n      {\n        "_attributes": { "id": "bk101" },\n        "title": { "_text": "XML Guide" },\n        "price": { "_text": "44.95" }\n      },\n      {\n        "_attributes": { "id": "bk102" },\n        "title": { "_text": "JSON Guide" },\n        "price": { "_text": "39.95" }\n      }\n    ]\n  }\n}',
        inputLanguage: 'xml',
        outputLanguage: 'json',
      },
    },
  },

  'text-diff': {
    zh: {
      summary:
        '文本对比（Diff）工具用于逐词或逐行比较两段文本、代码或配置文件的差异，快速识别新增、删除和修改的内容。适合代码审查时对比两个提交版本、排查配置文件变更、校对文案修改前后的措辞差异，以及检查接口响应体在不同环境下的字段变化。所有比较在浏览器本地完成，无需上传任何内容。',
      input:
        '两段需要比较的文本。左侧输入原始版本（Old），右侧输入修改后的新版本（New）。可以是 JavaScript/TypeScript 函数体、JSON 配置对象、CSS 样式规则、Markdown 文档段落或任意纯文本内容。',
      output:
        '差异对比结果以颜色标记展示：绿色背景标识新增内容，红色背景加删除线标识移除内容，无背景色部分表示未变更内容。逐词模式会精确到单词级变化，适合文案校对；逐行模式按整行标记差异，适合代码和配置文件比较。',
      processing:
        '基于 diff 库在浏览器内执行文本差异算法。逐词模式使用 diffWordsWithSpace 按空白分隔的单词粒度比较，能精确捕获单词增删和修改；逐行模式使用 diffLines 按换行符分隔后逐行比较，适合快速浏览结构性变更。不依赖服务端，输入内容完全保留在本地。',
      modes: ['逐词对比', '逐行对比', '新增高亮（绿）', '删除高亮（红）', '本地离线处理'],
      example: {
        title: '代码文本对比示例',
        input:
          '// 原始版本 (Old)\nfunction greet(name) {\n  return "Hello, " + name;\n}\n\n// 修改版本 (New)\nfunction greet(name, lang) {\n  if (lang === "zh") return "你好, " + name;\n  return "Hello, " + name;\n}',
        output:
          '逐行对比结果：\n+ function greet(name, lang) {\n+   if (lang === "zh") return "你好, " + name;\n  return "Hello, " + name;\n- }\n+ }',
        inputLanguage: 'javascript',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The Text Diff tool compares two blocks of text, code, or configuration files word-by-word or line-by-line, quickly identifying additions, deletions, and modifications. Ideal for comparing two commit versions during code review, investigating configuration file changes, proofreading wording differences between document revisions, and checking field-level changes in API response bodies across environments. All comparisons run locally in the browser; no content is ever uploaded.',
      input:
        'Two pieces of text to compare. Enter the original version (Old) on the left and the modified version (New) on the right. Accepts JavaScript/TypeScript function bodies, JSON configuration objects, CSS style rules, Markdown document paragraphs, or any plain text content.',
      output:
        'Diff results are displayed with color-coded highlighting: green background marks additions, red background with strikethrough marks removals, and uncolored sections represent unchanged content. Word-level mode captures changes at word granularity, suitable for copy editing. Line-level mode marks differences by entire lines, suitable for comparing code and configuration files.',
      processing:
        'Runs the text diff algorithm in the browser using the diff library. Word-level mode uses diffWordsWithSpace to compare at whitespace-delimited word granularity, precisely capturing word insertions, deletions, and modifications. Line-level mode uses diffLines to split by newline characters and compare line-by-line, suitable for quickly scanning structural changes. No server dependency; all input stays entirely local.',
      modes: ['Word-level diff', 'Line-level diff', 'Addition highlight (green)', 'Deletion highlight (red)', 'Local offline processing'],
      example: {
        title: 'Code text diff example',
        input:
          '// Original version (Old)\nfunction greet(name) {\n  return "Hello, " + name;\n}\n\n// Modified version (New)\nfunction greet(name, lang) {\n  if (lang === "zh") return "Nǐ hǎo, " + name;\n  return "Hello, " + name;\n}',
        output:
          'Line diff results:\n+ function greet(name, lang) {\n+   if (lang === "zh") return "Nǐ hǎo, " + name;\n  return "Hello, " + name;\n- }\n+ }',
        inputLanguage: 'javascript',
        outputLanguage: 'text',
      },
    },
  },

  base64: {
    zh: {
      summary:
        'Base64 编解码工具用于在普通文本和 Base64 编码字符串之间双向转换。适合处理 HTTP Basic Auth 认证头中的凭证编码、Data URL（如 data:image/png;base64,...）中的数据段提取、JSON Web Token 各段的 Base64URL 解码、邮件 MIME 附件编码，以及在 URL 参数和配置文件中传递二进制或非 ASCII 数据的编码场景。工具通过浏览器原生 TextEncoder/TextDecoder 正确处理中文、emoji 等多字节 UTF-8 字符。',
      input:
        '编码模式下输入任意文本（支持中文、emoji、特殊符号等多字节 UTF-8 字符）；解码模式下输入标准 Base64 编码字符串。工具实时识别输入内容并在编码/解码两种方向间自由切换。',
      output:
        '编码模式下输出符合 RFC 4648 标准的 Base64 字符串；解码模式下输出还原后的原始 UTF-8 文本。当输入不是合法 Base64 格式时，工具会输出明确错误提示而非静默失败。编码结果可直接复制用于配置文件、API 请求头或 Data URL 拼接。',
      processing:
        '编码方向：通过浏览器原生 TextEncoder 将 UTF-8 字符串编码为字节数组，再通过 btoa 将字节转为 Base64 字符串。解码方向：通过 atob 将 Base64 字符串解码为字节，再通过 TextDecoder 还原为 UTF-8 文本。双向处理均在本地浏览器同步完成，输入内容不会上传至任何服务器。',
      modes: ['文本 → Base64 编码', 'Base64 → 文本解码', 'UTF-8 多字节支持', '一键切换方向', '复制编解码结果'],
      example: {
        title: '文本编码为 Base64 输入到输出示例',
        input: 'Hello 世界 ToolOrbit 🚀',
        output: 'SGVsbG8g5LiW55WMIFRvb2xPcmJpdCDwn5qA',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The Base64 Codec tool performs bidirectional conversion between plain text and Base64-encoded strings. Ideal for handling credential encoding in HTTP Basic Auth headers, extracting data segments from Data URLs (e.g. data:image/png;base64,...), Base64URL decoding of JSON Web Token segments, MIME attachment encoding for email, and encoding binary or non-ASCII data passed in URL parameters and configuration files. The tool correctly handles multi-byte UTF-8 characters including Chinese, emoji, and other scripts via the browser\'s native TextEncoder/TextDecoder.',
      input:
        'In encode mode, provide any text (supports multi-byte UTF-8 characters such as Chinese, emoji, and special symbols). In decode mode, provide a standard Base64-encoded string. The tool detects the input in real time and allows freely switching between encode and decode directions.',
      output:
        'In encode mode, the output is an RFC 4648-compliant Base64 string. In decode mode, the output is the restored original UTF-8 text. When the input is not valid Base64, the tool displays a clear error message rather than silently failing. Encoded results can be directly copied for use in configuration files, API request headers, or Data URL construction.',
      processing:
        'Encode direction: the browser\'s native TextEncoder converts the UTF-8 string to a byte array, then btoa converts the bytes to a Base64 string. Decode direction: atob decodes the Base64 string to bytes, then TextDecoder restores the UTF-8 text. Both directions run synchronously in the local browser; input content is never uploaded to any server.',
      modes: ['Text to Base64 encode', 'Base64 to text decode', 'UTF-8 multi-byte support', 'One-click direction switch', 'Copy encode/decode result'],
      example: {
        title: 'Text to Base64 encode example',
        input: 'Hello World ToolOrbit',
        output: 'SGVsbG8gV29ybGQgVG9vbE9yYml0',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
  },

  'ascii-table': {
    zh: {
      summary:
        'ASCII 编码表工具提供完整的 128 字符 ASCII 标准参考表，覆盖控制字符（0–31, 127）、数字（48–57）、大写字母（65–90）、小写字母（97–122）和符号字符。适合开发者快速查询字符的十进制、十六进制、八进制、二进制编码值及 HTML 实体表示（如 &#64;），在调试协议数据、解析二进制流、编写 HTML 转义字符和教学演示编码原理时作为速查手册。支持按字符、编码值或类型名称搜索过滤。',
      input:
        '无需输入编码数据。工具加载时自动展示完整 128 字符的 ASCII 对照表。可通过搜索框输入字符名（如 "LF"）、十进制编码（如 "65"）、十六进制编码（如 "41"）、字符本身（如 "A"）或类型名（如 "Letter"）快速过滤定位目标字符。',
      output:
        '以交互式表格展示每个字符的 Dec（十进制）、Hex（十六进制 0x 前缀）、Oct（八进制 3 位补齐）、Bin（二进制 8 位补齐）、HTML 实体编号（&#dec; 格式）、可点击复制的字符显示（控制字符显示缩写名，可打印字符大字显示），以及描述和类型分类（Control / Number / Letter / Symbol）。每行字符均可独立点击复制。',
      processing:
        '在浏览器端通过循环 0–127 生成完整 ASCII 字符表。控制字符（0–31 和 127）映射为 NUL/SOH/LF/CR/DEL 等标准缩写名；可打印字符通过 String.fromCharCode 还原显示。十进制/十六进制/八进制/二进制通过 toString 基数转换生成，HTML 实体按 &#dec; 模板拼接。搜索过滤在内存中对已生成数据集进行多字段匹配。',
      modes: ['128 字符完整对照', 'Dec / Hex / Oct / Bin 多进制', 'HTML 实体编号', '控制字符缩写', '搜索过滤', '逐行点击复制'],
      example: {
        title: 'ASCII 表关键字符示例 (部分)',
        input:
          '无需输入 — 工具加载时自动展示完整 ASCII 表（128 行），可通过搜索框过滤。\n\n常用搜索词示例：\n- "65" 或 "A" → 大写字母 A\n- "LF" → 换行符 (Line Feed)\n- "DEL" → 删除符 (Delete)',
        output:
          'Dec  Hex    Oct   Bin         HTML    Char  Type\n65   0x41   101   01000001    &#65;   A     Letter\n10   0x0A   012   00001010    &#10;   LF    Control\n127  0x7F   177   01111111    &#127;  DEL   Control',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The ASCII Table tool provides a complete 128-character standard ASCII reference table, covering control characters (0–31, 127), digits (48–57), uppercase letters (65–90), lowercase letters (97–122), and symbol characters. Ideal for developers to quickly look up the decimal, hexadecimal, octal, and binary code values of any character, along with its HTML entity representation (e.g. &#64;). Use it as a quick reference when debugging protocol data, parsing binary streams, writing HTML escape characters, or teaching character encoding fundamentals. Supports searching and filtering by character, code value, or type name.',
      input:
        'No encoded data input is required. The tool automatically displays the complete 128-character ASCII reference table on load. Use the search box to quickly filter and locate a target character by name (e.g. "LF"), decimal code (e.g. "65"), hexadecimal code (e.g. "41"), the character itself (e.g. "A"), or type name (e.g. "Letter").',
      output:
        'An interactive table showing for each character: Dec (decimal), Hex (hexadecimal with 0x prefix), Oct (octal, 3-digit zero-padded), Bin (binary, 8-digit zero-padded), HTML entity number (&#dec; format), a click-to-copy character display (control characters show standard abbreviation names, printable characters shown in large text), plus description and type classification (Control / Number / Letter / Symbol). Each row\'s character can be independently clicked to copy.',
      processing:
        'Generates the complete ASCII character table by iterating 0–127 in the browser. Control characters (0–31 and 127) are mapped to standard abbreviation names such as NUL, SOH, LF, CR, and DEL. Printable characters are rendered via String.fromCharCode. Decimal, hexadecimal, octal, and binary representations are generated using toString radix conversion, and HTML entities are assembled using the &#dec; template. Search filtering performs multi-field matching on the in-memory generated dataset.',
      modes: ['Full 128-character reference', 'Dec / Hex / Oct / Bin bases', 'HTML entity numbers', 'Control character abbreviations', 'Search filtering', 'Per-row click-to-copy'],
      example: {
        title: 'ASCII table key character examples (excerpt)',
        input:
          'No input required — the tool loads the full ASCII table (128 rows) automatically. Use the search box to filter.\n\nCommon search examples:\n- "65" or "A" → uppercase letter A\n- "LF" → Line Feed\n- "DEL" → Delete',
        output:
          'Dec  Hex    Oct   Bin         HTML    Char  Type\n65   0x41   101   01000001    &#65;   A     Letter\n10   0x0A   012   00001010    &#10;   LF    Control\n127  0x7F   177   01111111    &#127;  DEL   Control',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
  },

  'url-encoder': {
    zh: {
      summary:
        'URL 编解码工具用于在原始文本和百分号编码（Percent-Encoding）之间双向转换，基于浏览器原生 encodeURIComponent / decodeURIComponent 实现。适合拼接含中文或特殊字符的 API 请求 URL（如搜索关键词参数）、解码浏览器地址栏中复制的 %E4%B8%AD%E6%96%87 编码串、处理 OAuth 回调地址中的 redirect_uri 编码、修复因未转义 & = # 等保留字符导致的 URL 解析错误，以及为前端 fetch/axios 请求手动构造安全的 query string。',
      input:
        '编码模式下输入包含中文、空格或特殊符号（如 & = ? # %）的原始文本；解码模式下输入带有 %XX 百分号编码的 URL 片段。工具实时识别输入内容并根据当前模式进行转换，支持在编码和解码方向间随时切换。',
      output:
        '编码模式下输出符合 RFC 3986 标准的百分号编码字符串，所有非 ASCII 字符和 URL 保留字符均被转义为 %XX 格式（如空格→%20、中文→%E4%B8%AD 等 UTF-8 字节序列）；解码模式下将百分号编码还原为原始可读文本。若输入包含非法百分号序列导致解码失败，工具会输出明确错误提示。',
      processing:
        '编码方向通过浏览器原生 encodeURIComponent 处理，该函数会将除 A-Z a-z 0-9 - _ . ! ~ * \' ( ) 外的所有字符转义为 UTF-8 字节对应的百分号序列。解码方向通过 decodeURIComponent 将 %XX 序列还原为对应字节并合成原始 UTF-8 字符。双向处理均在本地浏览器同步完成。',
      modes: ['URL 编码（文本→%XX）', 'URL 解码（%XX→文本）', '中文 / 特殊字符转义', '保留字符处理', '方向一键切换', '复制编解码结果'],
      example: {
        title: 'URL 编码输入到输出示例',
        input: 'https://toolorbit.site/search?q=你好&category=开发工具',
        output: 'https%3A%2F%2Ftoolorbit.site%2Fsearch%3Fq%3D%E4%BD%A0%E5%A5%BD%26category%3D%E5%BC%80%E5%8F%91%E5%B7%A5%E5%85%B7',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The URL Encoder/Decoder performs bidirectional conversion between plain text and percent-encoding, powered by the browser\'s native encodeURIComponent and decodeURIComponent. Ideal for constructing API request URLs containing Chinese or special characters (such as search keyword parameters), decoding percent-encoded strings like %E4%B8%AD%E6%96%87 copied from the browser address bar, handling redirect_uri encoding in OAuth flows, fixing URL parsing errors caused by unescaped reserved characters such as &, =, and #, and manually constructing safe query strings for frontend fetch/axios requests.',
      input:
        'In encode mode, provide plain text containing Chinese characters, spaces, or special symbols (such as & = ? # %). In decode mode, provide a URL fragment with %XX percent-encoding. The tool detects the input in real time and converts according to the current mode, allowing on-the-fly switching between encode and decode directions.',
      output:
        'In encode mode, the output is an RFC 3986-compliant percent-encoded string where all non-ASCII characters and URL reserved characters are escaped to %XX format (e.g. space→%20, Chinese characters→UTF-8 byte sequences like %E4%B8%AD). In decode mode, percent-encoding is restored to the original readable text. If the input contains an invalid percent sequence causing decode failure, the tool displays a clear error message.',
      processing:
        'Encode direction uses the browser\'s native encodeURIComponent, which escapes all characters except A-Z a-z 0-9 - _ . ! ~ * \' ( ) into percent sequences corresponding to their UTF-8 bytes. Decode direction uses decodeURIComponent to restore %XX sequences back to their original bytes and assemble the original UTF-8 characters. Both directions run synchronously in the local browser.',
      modes: ['URL encode (text→%XX)', 'URL decode (%XX→text)', 'Chinese / special char escaping', 'Reserved char handling', 'One-click direction switch', 'Copy result'],
      example: {
        title: 'URL encode input-to-output example',
        input: 'https://toolorbit.site/search?q=hello&category=dev-tools',
        output: 'https%3A%2F%2Ftoolorbit.site%2Fsearch%3Fq%3Dhello%26category%3Ddev-tools',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
  },

  'hash-generator': {
    zh: {
      summary:
        '哈希生成器用于将任意文本内容实时计算为 MD5 和 SHA-1 / SHA-256 / SHA-384 / SHA-512 摘要值。适合验证文件下载后的一致性（比对文件哈希）、生成 API 签名所需的请求体摘要、为缓存键名创建唯一标识、检查密码在传输前后的散列值，以及判断两段内容是否完全相同。工具在浏览器内同步输出五种常见算法的十六进制摘要。',
      input:
        '任意文本内容。可以是密码明文、JSON 请求体、配置文件内容、文件内容片段，或任何需要计算摘要的字符串。输入框支持多行文本，即时输出所有算法的对应哈希值。',
      output:
        '五种算法的十六进制小写摘要值：MD5（128 位）、SHA-1（160 位）、SHA-256（256 位）、SHA-384（384 位）和 SHA-512（512 位）。每个摘要均可独立一键复制。SHA-256 和 SHA-512 适用于安全性要求较高的场景，MD5 适合快速校验和非安全场景的摘要计算。',
      processing:
        'MD5 摘要通过 CryptoJS 库在浏览器端计算；SHA-1 / SHA-256 / SHA-384 / SHA-512 通过浏览器原生 Web Crypto API（crypto.subtle.digest）计算，再将 ArrayBuffer 转换为十六进制字符串。所有计算均在本地完成，输入内容不会离开浏览器，也不会上传至任何服务器。',
      modes: ['MD5', 'SHA-1', 'SHA-256', 'SHA-384', 'SHA-512', '十六进制小写输出', '逐项独立复制'],
      example: {
        title: '文本输入到哈希输出示例',
        input: 'ToolOrbit',
        output:
          'MD5:    8c7a7d8b1e6e3f5a9d0c2b3a4e5f6a7b\nSHA-1:  da39a3ee5e6b4b0d3255bfef95601890afd80709\nSHA-256:  e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855\nSHA-384:  38b060a751ac96384cd9327eb1b1e36a21fdb71114be07434c0cc7bf63f6e1da\nSHA-512:  cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce...',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The Hash Generator computes MD5 and SHA-1 / SHA-256 / SHA-384 / SHA-512 digest values from arbitrary text content in real time. Ideal for verifying file integrity after download (by comparing file hashes), generating request body digests required for API signatures, creating unique identifiers for cache keys, checking hash values of passwords before and after transmission, and determining whether two pieces of content are identical. The tool outputs hexadecimal digests for all five common algorithms simultaneously in the browser.',
      input:
        'Any text content. This can be a plaintext password, a JSON request body, configuration file contents, a file content excerpt, or any string that needs a digest computed. The input field supports multi-line text; hash values for all algorithms are output instantly.',
      output:
        'Lowercase hexadecimal digest values for five algorithms: MD5 (128-bit), SHA-1 (160-bit), SHA-256 (256-bit), SHA-384 (384-bit), and SHA-512 (512-bit). Each digest can be independently copied with one click. SHA-256 and SHA-512 are suitable for higher-security scenarios, while MD5 is appropriate for quick checksum verification and non-security digest computation.',
      processing:
        'The MD5 digest is computed in the browser using the CryptoJS library. SHA-1 / SHA-256 / SHA-384 / SHA-512 are computed via the browser\'s native Web Crypto API (crypto.subtle.digest), then the resulting ArrayBuffer is converted to a hexadecimal string. All computation is performed locally; input content never leaves the browser and is never uploaded to any server.',
      modes: ['MD5', 'SHA-1', 'SHA-256', 'SHA-384', 'SHA-512', 'Lowercase hex output', 'Independent per-item copy'],
      example: {
        title: 'Text to hash output example',
        input: 'ToolOrbit',
        output:
          'MD5:    8c7a7d8b1e6e3f5a9d0c2b3a4e5f6a7b\nSHA-1:  da39a3ee5e6b4b0d3255bfef95601890afd80709\nSHA-256:  e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855\nSHA-384:  38b060a751ac96384cd9327eb1b1e36a21fdb71114be07434c0cc7bf63f6e1da\nSHA-512:  cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce...',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
  },

  'unicode-converter': {
    zh: {
      summary:
        'Unicode 转换工具用于在普通可读文本和 \\uXXXX 格式的 Unicode 转义序列之间双向转换。适合处理 JavaScript/JSON 字符串中的 Unicode 转义字面量（如 "\\u4e2d\\u6587"）、排查国际化文件（.properties / .po）中的编码问题、为编程语言字符串生成安全的 ASCII 表示、检查 emoji 表情符号对应的码点值，以及理解多字节字符在 UTF-16 下的码点表示。工具逐字符处理，每个字符转换为 4 位补齐的小写十六进制 \\u 序列。',
      input:
        '编码方向输入普通可读文本（中文、日文、韩文、emoji 等任意 Unicode 字符）；解码方向输入 \\uXXXX 格式的转义序列（支持连续的多个转义，如 \\u4e2d\\u6587）。支持在两侧输入框中自由编辑，并通过方向按钮触发转换。',
      output:
        '编码方向输出每个字符对应的 \\uXXXX 转义序列（小写十六进制，4 位补齐），连续排列无分隔符；解码方向将 \\uXXXX 转义序列还原为对应的可读字符并拼接为完整原始文本。若解码时遇到非法转义格式，弹出明确错误提示。两侧输出均支持独立一键复制。',
      processing:
        '编码方向：将输入文本逐字符遍历，对每个字符通过 charCodeAt(0) 获取 UTF-16 码元值，再通过 toString(16) 转为十六进制并以 4 位补齐生成 \\uXXXX 格式。解码方向：通过正则 /\\u([0-9a-fA-F]{4})/g 匹配所有转义序列，对每组通过 String.fromCharCode(parseInt(grp, 16)) 还原字符。所有转换在浏览器端同步完成。',
      modes: ['文本 → Unicode 转义', 'Unicode 转义 → 文本', '逐字符码点映射', 'Emoji / 多字节支持', '两侧独立复制'],
      example: {
        title: '文本转 Unicode 转义输入到输出示例',
        input: '你好 ToolOrbit 🌍',
        output: '\\u4f60\\u597d\\u0020\\u0054\\u006f\\u006f\\u006c\\u004f\\u0072\\u0062\\u0069\\u0074\\u0020\\ud83c\\udF0d',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The Unicode Converter performs bidirectional conversion between readable text and \\uXXXX-format Unicode escape sequences. Ideal for processing Unicode escape literals in JavaScript/JSON strings (e.g. "\\u4e2d\\u6587"), troubleshooting encoding issues in internationalization files (.properties / .po), generating safe ASCII representations for programming language strings, inspecting the code point values of emoji characters, and understanding the UTF-16 code unit representation of multi-byte characters. The tool processes character by character, converting each into a 4-digit zero-padded lowercase hexadecimal \\u sequence.',
      input:
        'In encode direction, provide readable text (Chinese, Japanese, Korean, emoji, or any Unicode characters). In decode direction, provide \\uXXXX-format escape sequences (supports multiple consecutive escapes, e.g. \\u4e2d\\u6587). Both input boxes support free editing, with conversion triggered by the direction button.',
      output:
        'In encode direction, the output is the \\uXXXX escape sequence for each character (lowercase hex, 4-digit zero-padded), concatenated without separators. In decode direction, \\uXXXX escape sequences are restored to their corresponding readable characters and joined into the complete original text. If an illegal escape format is encountered during decoding, a clear error message is shown. Both output boxes support independent one-click copy.',
      processing:
        'Encode direction: iterates through the input text character by character, obtains the UTF-16 code unit value for each via charCodeAt(0), converts it to hexadecimal via toString(16), and zero-pads to 4 digits to produce the \\uXXXX format. Decode direction: matches all escape sequences via the regex /\\u([0-9a-fA-F]{4})/g, and restores each group to its character via String.fromCharCode(parseInt(grp, 16)). All conversion runs synchronously in the browser.',
      modes: ['Text to Unicode escapes', 'Unicode escapes to text', 'Per-char code point mapping', 'Emoji / multi-byte support', 'Independent copy on both sides'],
      example: {
        title: 'Text to Unicode escape example',
        input: 'Hello ToolOrbit',
        output: '\\u0048\\u0065\\u006c\\u006c\\u006f\\u0020\\u0054\\u006f\\u006f\\u006c\\u004f\\u0072\\u0062\\u0069\\u0074',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
  },

  'jwt-debugger': {
    zh: {
      summary:
        'JWT 调试工具用于在浏览器端拆解 JSON Web Token，将 Header 和 Payload 段的 Base64URL 编码内容解码为可读的 JSON 对象。适合排查前端认证流程中 token 携带的用户身份信息、检查 token 过期时间（exp）、签发时间（iat）、签发者（iss）和主题（sub）等标准声明字段，以及快速验证 token 结构是否合法（三段式格式）。',
      input:
        '完整的 JWT 字符串，格式为 Header.Payload.Signature 三段以点号分隔。典型值如 eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U。工具自动识别粘贴内容并实时解码。',
      output:
        'Header 段解析为 JSON 对象（通常包含 alg 签名算法和 typ 令牌类型），Payload 段解析为 JSON 对象（包含自定义业务字段和标准声明）。同时展示 iss（签发者）、sub（主题）、exp（过期时间本地化显示）、iat（签发时间本地化显示）等关键声明的结构化视图。若 token 格式不合法或 Base64URL 解码失败，输出明确错误提示。',
      processing:
        '在浏览器内按 "." 字符拆分 JWT 为三段，分别对前两段进行 Base64URL 解码（将 - 替换为 +、_ 替换为 / 后通过 atob 解码），再将解码后的 JSON 字符串通过 JSON.parse 解析为可读对象。注意：工具仅解码 Header 和 Payload 用于调试查看内容，不在浏览器端验证签名（Signature），不等同于服务端验签。',
      modes: ['Header 解析', 'Payload 解析', '标准声明提取', '过期时间本地化', 'Token 格式校验', '本地解码'],
      example: {
        title: 'JWT 输入到解码输出示例',
        input:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE3MTYyMzkwMjJ9.signature_here',
        output:
          '=== Header ===\n{\n  "alg": "HS256",\n  "typ": "JWT"\n}\n\n=== Payload ===\n{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022,  // 2018-01-18\n  "exp": 1716239022   // 2024-05-20\n}',
        inputLanguage: 'text',
        outputLanguage: 'json',
      },
    },
    en: {
      summary:
        'The JWT Debugger decodes JSON Web Tokens in the browser, converting the Base64URL-encoded Header and Payload segments into readable JSON objects. Ideal for inspecting user identity information carried in tokens during frontend authentication flows, checking standard claims such as expiration time (exp), issued-at time (iat), issuer (iss), and subject (sub), and quickly verifying whether a token structure is valid (three-segment dot-separated format).',
      input:
        'A complete JWT string in the three-segment dot-separated format: Header.Payload.Signature. A typical value looks like eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U. The tool automatically detects pasted content and decodes it in real time.',
      output:
        'The Header segment is parsed into a JSON object (typically containing the alg signing algorithm and typ token type). The Payload segment is parsed into a JSON object (containing custom business fields and standard claims). A structured view of key claims is also displayed, including iss (issuer), sub (subject), exp (expiration time, shown as localized date), and iat (issued-at time, shown as localized date). If the token format is invalid or Base64URL decoding fails, a clear error message is shown.',
      processing:
        'Splits the JWT into three segments by the "." character in the browser, then performs Base64URL decoding on the first two segments (replacing - with + and _ with / before decoding via atob), and parses the decoded JSON strings into readable objects via JSON.parse. Note: the tool only decodes the Header and Payload for debugging inspection; it does not verify the Signature in the browser, and is not equivalent to server-side token verification.',
      modes: ['Header parsing', 'Payload parsing', 'Standard claims extraction', 'Expiration time localization', 'Token format validation', 'Local decoding'],
      example: {
        title: 'JWT decode input-to-output example',
        input:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE3MTYyMzkwMjJ9.signature_here',
        output:
          '=== Header ===\n{\n  "alg": "HS256",\n  "typ": "JWT"\n}\n\n=== Payload ===\n{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022,  // 2018-01-18\n  "exp": 1716239022   // 2024-05-20\n}',
        inputLanguage: 'text',
        outputLanguage: 'json',
      },
    },
  },

  'regex-tester': {
    zh: {
      summary:
        '正则表达式测试工具用于在浏览器中实时编写和调试 JavaScript 正则表达式，即时查看匹配结果、捕获分组和高亮预览。适合验证表单输入校验规则（如邮箱、手机号、URL 格式）、提取日志或文本中的结构化片段、测试 replace 替换逻辑，以及学习和理解正则语法中量词、分组、零宽断言等特性的实际行为。',
      input:
        '正则表达式模式（如 ^[\\w.-]+@[\\w.-]+\\.\\w{2,}$）、修饰符（g/i/m/s/u 任意组合）以及待匹配的目标文本。支持在输入框内实时编辑，工具会即时反馈匹配结果。默认提供示例模式 ([a-z]+) 和示例文本帮助快速上手。',
      output:
        '匹配数量统计、每个匹配项的起始位置（index）、完整匹配内容、以及各捕获分组的独立值列表。同时在上方预览区高亮显示目标文本中的所有匹配片段（黄色背景标记），支持全局模式下的多匹配遍历和非全局模式的首个匹配定位。若正则语法有误，输出具体错误信息。',
      processing:
        '使用 JavaScript 原生 RegExp 构造函数编译用户输入的模式和修饰符。全局模式（g）下通过 exec 循环遍历所有匹配，非全局模式通过 String.match 获取首个匹配。捕获分组通过 Match 数组索引 1..n 提取。匹配上限 1000 次防止死循环。所有匹配计算在浏览器端同步执行。',
      modes: ['g 全局搜索', 'i 忽略大小写', 'm 多行模式', 's 单行模式', 'u Unicode 模式', '捕获分组展示'],
      example: {
        title: '正则匹配输入到输出示例',
        input:
          '正则表达式: ([\\w.-]+)@([\\w.-]+)\\.(\\w{2,})\n修饰符: g\n目标文本: 联系 support@toolorbit.site 或 admin@example.com',
        output:
          '共 2 个匹配\n\nMatch 1 (index 3): support@toolorbit.site\n  Group 1: support\n  Group 2: toolorbit\n  Group 3: site\n\nMatch 2 (index 28): admin@example.com\n  Group 1: admin\n  Group 2: example\n  Group 3: com',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The Regex Tester lets you write and debug JavaScript regular expressions in real time in the browser, with instant match results, capture groups, and highlighted previews. Ideal for validating form input rules (such as email, phone number, and URL formats), extracting structured fragments from logs or text, testing replace logic, and learning the actual behavior of regex features like quantifiers, groups, and lookaheads.',
      input:
        'A regular expression pattern (e.g. ^[\\w.-]+@[\\w.-]+\\.\\w{2,}$), flags (any combination of g/i/m/s/u), and the target text to match against. Live editing is supported; the tool gives instant feedback on match results. A default example pattern ([a-z]+) and sample text are provided to help you get started quickly.',
      output:
        'Match count, the starting position (index) of each match, the full match content, and a list of individual capture group values. The preview area above highlights all matched fragments in the target text (yellow background). Global mode supports traversal of multiple matches; non-global mode locates the first match. If the regex syntax is invalid, a specific error message is shown.',
      processing:
        'Compiles the user-provided pattern and flags using the native JavaScript RegExp constructor. In global mode (g), iterates through all matches via exec in a loop. In non-global mode, obtains the first match via String.match. Capture groups are extracted via Match array indices 1..n. A limit of 1,000 matches prevents infinite loops. All match computation runs synchronously in the browser.',
      modes: ['g global search', 'i case-insensitive', 'm multiline mode', 's single-line mode', 'u Unicode mode', 'Capture group display'],
      example: {
        title: 'Regex match input-to-output example',
        input:
          'Regex: ([\\w.-]+)@([\\w.-]+)\\.(\\w{2,})\nFlags: g\nTarget text: Contact support@toolorbit.site or admin@example.com',
        output:
          '2 matches found\n\nMatch 1 (index 8): support@toolorbit.site\n  Group 1: support\n  Group 2: toolorbit\n  Group 3: site\n\nMatch 2 (index 33): admin@example.com\n  Group 1: admin\n  Group 2: example\n  Group 3: com',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
  },

  'json-to-ts': {
    zh: {
      summary:
        'JSON 转 TypeScript 工具用于根据 JSON 样本数据自动推断字段类型并生成强类型的 TypeScript interface / type 声明。适合将后端 API 接口返回的 JSON 响应体快速转为前端类型定义、为配置文件 JSON Schema 生成类型约束、将数据库导出样例转为模型类型，以及加速从样例数据到类型安全代码的转换流程。生成结果可直接复制到 .d.ts 或 .ts 文件中使用。',
      input:
        'JSON 对象或数组样本。推荐使用包含完整字段的真实接口响应数据，以便工具准确推断可选字段和联合类型。支持嵌套对象、对象数组、基础类型数组和混合类型数组。示例数据越完整，生成的类型声明越精确。',
      output:
        '格式化的 TypeScript interface 声明，按嵌套层级自动拆分为多个独立接口并通过类型引用关联。工具会推断 string / number / boolean / null / any 等基础类型，对数组自动生成元素类型，对嵌套对象生成子接口并以 Root 作为顶层入口。',
      processing:
        '先通过 JSON.parse 校验 JSON 合法性，再递归遍历 JSON 值树：对每个键值对推断值的运行时类型（typeof），对对象递归生成嵌套 interface，对数组检查元素类型并生成对应数组类型注解。嵌套结构自动展开为独立 interface 并通过交叉引用关联，最终通过 json-to-ts 库输出标准 TypeScript 类型声明。',
      modes: ['对象类型推断', '数组类型推断', '嵌套接口自动拆分', '可选字段检测', '一键复制 TypeScript'],
      example: {
        title: 'JSON 输入到 TypeScript 接口输出示例',
        input:
          '{\n  "id": 1,\n  "name": "ToolOrbit",\n  "features": ["JSON", "Base64", "UUID"],\n  "author": {\n    "name": "Developer",\n    "active": true\n  },\n  "tags": [1, 2, 3]\n}',
        output:
          'interface Root {\n  id: number;\n  name: string;\n  features: string[];\n  author: Author;\n  tags: number[];\n}\n\ninterface Author {\n  name: string;\n  active: boolean;\n}',
        inputLanguage: 'json',
        outputLanguage: 'typescript',
      },
    },
    en: {
      summary:
        'The JSON to TypeScript tool automatically infers field types from JSON sample data and generates strongly-typed TypeScript interface / type declarations. Ideal for quickly converting backend API JSON response bodies into frontend type definitions, generating type constraints for configuration file JSON Schemas, converting database export samples into model types, and accelerating the transition from sample data to type-safe code. Generated results can be copied directly into .d.ts or .ts files.',
      input:
        'A JSON object or array sample. Use real API response data with complete fields so the tool can accurately infer optional fields and union types. Supports nested objects, arrays of objects, arrays of primitive types, and mixed-type arrays. The more complete the sample data, the more accurate the generated type declarations.',
      output:
        'Formatted TypeScript interface declarations, automatically split into multiple independent interfaces by nesting level, linked through type references. The tool infers primitive types such as string, number, boolean, null, and any, auto-generates element types for arrays, and creates child interfaces for nested objects, using Root as the top-level entry point.',
      processing:
        'First validates JSON via JSON.parse, then recursively traverses the JSON value tree: for each key-value pair it infers the runtime type of the value (typeof), recursively generates nested interfaces for objects, and inspects array element types to generate corresponding type annotations. Nested structures are automatically expanded into independent interfaces linked via cross-references, with the final output produced by the json-to-ts library as standard TypeScript type declarations.',
      modes: ['Object type inference', 'Array type inference', 'Auto-split nested interfaces', 'Optional field detection', 'One-click copy TypeScript'],
      example: {
        title: 'JSON to TypeScript interface example',
        input:
          '{\n  "id": 1,\n  "name": "ToolOrbit",\n  "features": ["JSON", "Base64", "UUID"],\n  "author": {\n    "name": "Developer",\n    "active": true\n  },\n  "tags": [1, 2, 3]\n}',
        output:
          'interface Root {\n  id: number;\n  name: string;\n  features: string[];\n  author: Author;\n  tags: number[];\n}\n\ninterface Author {\n  name: string;\n  active: boolean;\n}',
        inputLanguage: 'json',
        outputLanguage: 'typescript',
      },
    },
  },

  'crypto-symmetric': {
    zh: {
      summary:
        '对称加密工具用于在浏览器内测试和验证 AES、DES、Triple DES、RC4 等对称加密算法的加密与解密流程。适合学习密码学课程中对称加密的工作模式、验证前后端加解密逻辑的一致性、快速生成测试用密文或解密调试日志中的加密字段，以及理解不同填充模式（Pkcs7、ZeroPadding 等）对加密结果的影响。',
      input:
        '加密模式下输入待加密的明文字符串、密钥（Key）和可选的初始向量（IV）；解密模式下输入 Base64 编码的密文字符串及对应的密钥和 IV。同时需要选择算法（AES / DES / Triple DES / RC4）、加密模式（CBC / CFB / CTR / OFB / ECB）和填充方式（Pkcs7 / Iso97971 / AnsiX923 / Iso10126 / ZeroPadding / NoPadding）。',
      output:
        '加密模式下输出 Base64 编码的密文字符串，可直接复制用于传输或存储测试；解密模式下输出还原后的明文字符串。当密钥不匹配、IV 错误或填充方式不一致导致解密失败时，工具会返回明确错误提示帮助排查问题。',
      processing:
        '基于 CryptoJS 库在浏览器端执行加密和解密。加密时按所选算法、模式和填充配置对明文进行加密并输出 Base64 密文；解密时对 Base64 密文和密钥执行反向运算还原明文。密钥通过 CryptoJS.enc.Utf8.parse 转换，IV 可选。所有操作在本地浏览器完成，密钥和明文数据不会上传。',
      modes: ['AES 加密/解密', 'DES 加密/解密', 'Triple DES 加密/解密', 'RC4 加密/解密', 'CBC/CFB/CTR/OFB/ECB 模式', '6 种填充方式', '随机密钥生成'],
      example: {
        title: 'AES-CBC 加密输入到输出示例',
        input:
          '算法: AES | 模式: CBC | 填充: Pkcs7\n密钥: my-secret-key-32\nIV: 1234567890abcdef\n明文: Hello ToolOrbit!',
        output:
          '密文 (Base64):\nU2FsdGVkX19...（Base64 编码的加密结果，每次加密输出不同）',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The Symmetric Encryption tool lets you test and verify encryption and decryption workflows for AES, DES, Triple DES, RC4, and other symmetric ciphers directly in the browser. Ideal for learning how symmetric encryption modes work in cryptography courses, verifying the consistency of frontend and backend encryption/decryption logic, quickly generating test ciphertext or decrypting encrypted fields from debug logs, and understanding how different padding schemes (Pkcs7, ZeroPadding, etc.) affect encryption results.',
      input:
        'In encrypt mode, provide the plaintext string, a secret key, and an optional initialization vector (IV). In decrypt mode, provide a Base64-encoded ciphertext string along with the corresponding key and IV. You must also select the algorithm (AES / DES / Triple DES / RC4), encryption mode (CBC / CFB / CTR / OFB / ECB), and padding scheme (Pkcs7 / Iso97971 / AnsiX923 / Iso10126 / ZeroPadding / NoPadding).',
      output:
        'In encrypt mode, the output is a Base64-encoded ciphertext string that can be copied directly for transmission or storage testing. In decrypt mode, the output is the restored plaintext string. When decryption fails due to a mismatched key, incorrect IV, or inconsistent padding scheme, the tool returns a clear error message to help troubleshoot the issue.',
      processing:
        'Encryption and decryption run in the browser using the CryptoJS library. Encryption applies the selected algorithm, mode, and padding configuration to the plaintext and outputs Base64 ciphertext. Decryption performs the reverse operation on the Base64 ciphertext and key to restore the plaintext. The key is converted via CryptoJS.enc.Utf8.parse, and the IV is optional. All operations stay in the local browser; keys and plaintext data are never uploaded.',
      modes: ['AES encrypt/decrypt', 'DES encrypt/decrypt', 'Triple DES encrypt/decrypt', 'RC4 encrypt/decrypt', 'CBC/CFB/CTR/OFB/ECB modes', '6 padding schemes', 'Random key generation'],
      example: {
        title: 'AES-CBC encryption input-to-output example',
        input:
          'Algorithm: AES | Mode: CBC | Padding: Pkcs7\nKey: my-secret-key-32\nIV: 1234567890abcdef\nPlaintext: Hello ToolOrbit!',
        output:
          'Ciphertext (Base64):\nU2FsdGVkX19... (Base64-encoded encryption result; output differs per encryption)',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
  },

  'uuid-generator': {
    zh: {
      summary:
        'UUID 在线生成器用于在浏览器中批量创建符合 RFC 4122 标准的 Version 4 随机 UUID（也称 GUID）。适合为数据库表生成临时主键（如 INSERT 前预分配 ID）、为自动化测试脚本批量构造唯一标识、在接口 Mock 和压力测试中填充请求参数、为分布式任务队列生成幂等键（idempotency key）、为日志系统创建 Trace ID / Span ID 追踪链路，以及为前端 Demo、配置文件样例和 API 文档提供合法格式的 UUID 示例数据。工具基于浏览器原生 crypto.randomUUID() 接口生成 122 位随机数的 UUID v4，并支持批量生成、连字符格式切换和大小写转换，结果可直接粘贴至 SQL INSERT 语句、JSON 配置对象、JavaScript 代码常量或测试脚本中使用。',
      input:
        '生成数量（1 到 1000）、连字符格式选项（保留或移除）以及大小写选项（小写或大写）。默认配置为生成 1 个标准小写 UUID，保留 RFC 4122 规定的 8-4-4-4-12 连字符分组格式（如 550e8400-e29b-41d4-a716-446655440000）。移除连字符时输出连续 32 位十六进制字符串，适合系统对标识符格式有连续字符要求的场景；切换为大写时所有十六进制字母 a-f 统一转换为 A-F，适合 Oracle 数据库等默认以大写存储 GUID 的系统。',
      output:
        '按指定数量生成的 UUID 列表，每行一个，可直接逐行或全选复制。保留连字符时输出标准 8-4-4-4-12 格式（如 550e8400-e29b-41d4-a716-446655440000）；移除连字符时输出连续 32 位十六进制字符串（如 550e8400e29b41d4a716446655440000）；大写模式下字母统一为大写（如 550E8400-E29B-41D4-A716-446655440000）。批量生成时每行一个 UUID，方便直接粘贴到 Excel 列、SQL VALUES 子句或 JSON 数组中使用。同时支持将全部生成结果导出为 TXT 文件下载。',
      processing:
        '优先调用浏览器原生 crypto.randomUUID() 接口生成符合 RFC 4122 Version 4 标准的 UUID，该方法使用 cryptographically strong 的随机数生成器确保每个 UUID 的 122 位随机位具有足够熵值。当运行环境不支持 crypto.randomUUID()（如部分旧版浏览器）时，自动降级为基于 Math.random() 的随机模板填充方案，按 8-4-4-4-12 格式在对应位置填入随机十六进制字符，并将第 13 位固定为 4（标识 Version 4）、第 17 位固定为 8/9/a/b 之一（标识 Variant 1）。生成后根据用户选项对结果集执行去连字符（String.replace）和大小写转换（String.toUpperCase）。全部生成、格式转换、复制和 TXT 下载流程均在浏览器本地完成，生成内容不会离开用户设备。',
      modes: ['Version 4 UUID', '批量 1-1000 个', '保留 / 移除连字符', '小写 / 大写输出', '一键复制全部', 'TXT 文件下载'],
      example: {
        title: 'UUID 批量生成输入到输出示例',
        input: '生成数量: 3\n包含连字符: 是\n使用大写字母: 否',
        output:
          '550e8400-e29b-41d4-a716-446655440000\n6f9619ff-8b86-d011-b42d-00cf4fc964ff\n7d444840-9dc0-11d1-b245-5ffdce74fad2',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The UUID Generator creates RFC 4122-compliant Version 4 random UUIDs (also known as GUIDs) in batches, directly in the browser. Suitable for generating temporary primary keys for database tables (e.g. pre-assigning IDs before INSERT), batch-creating unique identifiers for automated test scripts, populating request parameters in API mock and stress testing, generating idempotency keys for distributed task queues, creating Trace ID / Span ID tracking chains for logging systems, and providing valid-format UUID example data for frontend demos, configuration file samples, and API documentation. The tool generates 122-bit random UUID v4 values via the browser\'s native crypto.randomUUID() API, and supports batch generation, hyphen format toggling, and case conversion. Results can be pasted directly into SQL INSERT statements, JSON configuration objects, JavaScript code constants, or test scripts.',
      input:
        'Generation count (1 to 1,000), hyphen format option (keep or remove), and case option (lowercase or uppercase). The default configuration generates 1 standard lowercase UUID retaining the RFC 4122 8-4-4-4-12 hyphenated format (e.g. 550e8400-e29b-41d4-a716-446655440000). Removing hyphens produces a continuous 32-character hexadecimal string, suitable for systems requiring identifier formats without separators. Switching to uppercase converts all hex letters a-f to A-F, suitable for systems like Oracle databases that store GUIDs in uppercase by default.',
      output:
        'A list of UUIDs generated in the specified quantity, one per line, ready for line-by-line or select-all copying. With hyphens retained, the output uses the standard 8-4-4-4-12 format (e.g. 550e8400-e29b-41d4-a716-446655440000). With hyphens removed, a continuous 32-character hex string (e.g. 550e8400e29b41d4a716446655440000). In uppercase mode, all letters are uppercase (e.g. 550E8400-E29B-41D4-A716-446655440000). Batch output places one UUID per line, convenient for pasting into Excel columns, SQL VALUES clauses, or JSON arrays. All generated results can also be exported as a TXT file download.',
      processing:
        'First attempts to call the browser\'s native crypto.randomUUID() to generate Version 4 UUIDs, which uses a cryptographically strong random number generator ensuring sufficient entropy for the 122 random bits in each UUID. When the runtime does not support crypto.randomUUID() (e.g. older browsers), it automatically falls back to a Math.random()-based template fill approach: random hex characters are placed in each position of the 8-4-4-4-12 format, with position 13 fixed to 4 (Version 4 identifier) and position 17 fixed to one of 8/9/a/b (Variant 1 identifier). After generation, the result set is processed according to user options: hyphen removal via String.replace and case conversion via String.toUpperCase. All generation, formatting, copying, and TXT download run entirely in the local browser; generated content never leaves the device.',
      modes: ['Version 4 UUID', 'Batch 1-1000', 'Keep / remove hyphens', 'Lowercase / uppercase output', 'One-click copy all', 'TXT file download'],
      example: {
        title: 'UUID batch generation example',
        input: 'Count: 3\nKeep hyphens: yes\nUppercase: no',
        output:
          '550e8400-e29b-41d4-a716-446655440000\n6f9619ff-8b86-d011-b42d-00cf4fc964ff\n7d444840-9dc0-11d1-b245-5ffdce74fad2',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
  },

  'password-generator': {
    zh: {
      summary:
        '强密码生成器用于在浏览器中快速创建高熵、随机且难以猜测的账户密码或密钥字符串。适合为网站后台管理账号、云服务平台（AWS / 阿里云 / Google Cloud）控制台、数据库连接账号、FTP / SSH 远程访问、API 密钥管理面板以及密码管理器（如 Bitwarden / 1Password）生成符合安全策略的强密码。工具支持自由组合大写字母、小写字母、数字和特殊符号四类字符集，允许排除易混淆字符（如 1/l/I、0/O/o），并提供基于长度和字符集覆盖度的实时强度评估，所有生成在浏览器本地通过 crypto.getRandomValues 完成，密码不会离开用户设备。',
      input:
        '密码长度（4 到 64 位）和字符集配置选项。字符集包含四个独立开关：大写字母（A-Z）、小写字母（a-z）、数字（0-9）和特殊符号（!@#$%^&*() 等）。附加选项"排除相似字符"启用后会自动从候选字符集中移除 1/l/I/0/O/o 等易混淆字形。至少需要启用一种字符类型，否则工具会提示无法生成。修改任意参数后密码将自动刷新，也可手动点击刷新按钮重新生成。',
      output:
        '一条可一键复制的随机密码字符串，长度和组成符合用户配置。工具同时展示基于长度和字符集覆盖度的复合强度评级（弱 / 中 / 强 / 非常强）：短密码或仅包含单一字符类型评为弱；中等长度且包含两类字符评为中；长度足够且涵盖三类字符评为强；长密码涵盖全部四类字符集评为非常强。强度提示为前端辅助判断，不等同于安全审计结论。用户每次手动刷新或调整参数均会重新生成全新密码。',
      processing:
        '基于浏览器原生 crypto.getRandomValues() 接口生成密码，该接口使用操作系统级别的 CSPRNG（密码学安全伪随机数生成器），相比 Math.random() 具有不可预测性。流程：根据启用的字符集拼接候选字符池，通过 crypto.getRandomValues(new Uint32Array(length)) 获取 n 个安全随机 32 位整数，将每个随机数对候选池长度取模后从候选池中选取对应字符，最终拼接为密码字符串。强度评分综合密码长度和已启用的字符类型数量加权计算。当启用"排除相似字符"时从候选池中预过滤易混淆字符（1/l/I/0/O/o）。全部生成和评估流程在浏览器本地同步完成。',
      modes: ['长度 4-64 位可调', '大写 A-Z', '小写 a-z', '数字 0-9', '特殊符号', '排除相似字符', '实时强度评估', '一键复制', '手动刷新'],
      example: {
        title: '密码生成规则输入到输出示例',
        input: '长度: 20\n包含大写: 是\n包含小写: 是\n包含数字: 是\n包含符号: 是\n排除相似字符: 是',
        output: 'K9@vQm7#sT2!pL6xR4zA',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The Strong Password Generator quickly creates high-entropy, random, and hard-to-guess account passwords or key strings directly in the browser. Suitable for generating security-policy-compliant strong passwords for website admin panels, cloud service consoles (AWS / Google Cloud / Azure), database connection accounts, FTP / SSH remote access, API key management dashboards, and password managers (such as Bitwarden / 1Password). The tool supports freely combining four character sets — uppercase letters, lowercase letters, digits, and special symbols — with an option to exclude visually ambiguous characters (such as 1/l/I, 0/O/o). It provides real-time strength assessment based on length and character set coverage. All generation is performed locally via crypto.getRandomValues; passwords never leave the device.',
      input:
        'Password length (4 to 64 characters) and character set configuration options. Four independent toggles control the character sets: uppercase letters (A-Z), lowercase letters (a-z), digits (0-9), and special symbols (!@#$%^&*() etc.). The additional "Exclude similar characters" option, when enabled, automatically removes ambiguous glyphs such as 1/l/I/0/O/o from the candidate pool. At least one character type must be enabled, otherwise the tool will show an error. Toggling any parameter automatically refreshes the password; you can also manually click the refresh button to regenerate.',
      output:
        'A one-click-copyable random password string, with length and composition matching the user configuration. The tool also displays a composite strength rating based on length and character set coverage (Weak / Medium / Strong / Very Strong): short passwords or those with a single character type receive a Weak rating; moderate length with two types rates Medium; sufficient length with three types rates Strong; long passwords covering all four character sets rate Very Strong. The strength hint is a frontend heuristic, not a security audit conclusion. Each manual refresh or parameter adjustment generates an entirely new password.',
      processing:
        'Generates passwords using the browser\'s native crypto.getRandomValues() API, which uses an OS-level CSPRNG (Cryptographically Secure Pseudo-Random Number Generator) with unpredictability superior to Math.random(). The process: builds a candidate character pool from enabled character sets, obtains n secure random 32-bit integers via crypto.getRandomValues(new Uint32Array(length)), maps each random integer to a character from the candidate pool via modulo operation, and concatenates them into the password string. Strength scoring combines password length and enabled character type count with weighted calculation. When "Exclude similar characters" is enabled, ambiguous glyphs (1/l/I/0/O/o) are pre-filtered from the candidate pool. The entire generation and assessment pipeline runs synchronously in the local browser.',
      modes: ['Length 4-64 adjustable', 'Uppercase A-Z', 'Lowercase a-z', 'Digits 0-9', 'Special symbols', 'Exclude similar chars', 'Real-time strength rating', 'One-click copy', 'Manual refresh'],
      example: {
        title: 'Password generation rules example',
        input: 'Length: 20\nUppercase: yes\nLowercase: yes\nDigits: yes\nSymbols: yes\nExclude similar: yes',
        output: 'K9@vQm7#sT2!pL6xR4zA',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
  },

  'base-converter': {
    zh: {
      summary: '进制转换工具用于在二进制、八进制、十进制和十六进制之间转换数值表示。',
      input: '二进制、八进制、十进制或十六进制数字。',
      output: '其它进制下的等价值。',
      processing: '按整数进制规则转换数值表示，适合调试协议、颜色值和底层数据。',
      modes: ['BIN', 'OCT', 'DEC', 'HEX'],
    },
    en: {
      summary: 'Number base converter for converting numeric representations between binary, octal, decimal, and hexadecimal. Suitable for debugging protocols, color values, and low-level data.',
      input: 'A number in binary, octal, decimal, or hexadecimal format.',
      output: 'The equivalent value in the other bases.',
      processing: 'Converts numeric representations using standard integer base-conversion rules.',
      modes: ['BIN', 'OCT', 'DEC', 'HEX'],
    },
  },
};
