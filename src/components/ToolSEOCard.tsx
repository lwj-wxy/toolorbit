'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BookText, ChevronDown } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { TOOLS } from '../data/tools';
import { cn } from '../lib/utils';

interface ToolSEOCardProps {
  toolKey: string;
}

type TechnicalOverview = {
  summary: string;
  input: string;
  output: string;
  processing: string;
  modes: string[];
  example?: {
    title: string;
    input: string;
    output: string;
    inputLanguage?: string;
    outputLanguage?: string;
  };
};

function CodeExampleBlock({ code, language }: { code: string; language: string }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          padding: '16px',
          background: 'transparent',
          maxHeight: '260px',
          fontSize: '13px',
          lineHeight: '1.7',
        }}
        codeTagProps={{
          style: {
            fontFamily:
              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          },
        }}
        wrapLongLines
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

const DEV_TOOL_OVERVIEWS_ZH: Record<string, TechnicalOverview> = {
  'json-formatter': {
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
  'xml-json': {
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
  'text-diff': {
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
  'hash-generator': {
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
  'jwt-debugger': {
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
  'regex-tester': {
    summary:
      '正则表达式测试工具用于在浏览器中实时编写和调试 JavaScript 正则表达式，即时查看匹配结果、捕获分组和高亮预览。适合验证表单输入校验规则（如邮箱、手机号、URL 格式）、提取日志或文本中的结构化片段、测试 replace 替换逻辑，以及学习和理解正则语法中量词、分组、零宽断言等特性的实际行为。',
    input:
      '正则表达式模式（如 ^[\w.-]+@[\w.-]+\.\w{2,}$）、修饰符（g/i/m/s/u 任意组合）以及待匹配的目标文本。支持在输入框内实时编辑，工具会即时反馈匹配结果。默认提供示例模式 ([a-z]+) 和示例文本帮助快速上手。',
    output:
      '匹配数量统计、每个匹配项的起始位置（index）、完整匹配内容、以及各捕获分组的独立值列表。同时在上方预览区高亮显示目标文本中的所有匹配片段（黄色背景标记），支持全局模式下的多匹配遍历和非全局模式的首个匹配定位。若正则语法有误，输出具体错误信息。',
    processing:
      '使用 JavaScript 原生 RegExp 构造函数编译用户输入的模式和修饰符。全局模式（g）下通过 exec 循环遍历所有匹配，非全局模式通过 String.match 获取首个匹配。捕获分组通过 Match 数组索引 1..n 提取。匹配上限 1000 次防止死循环。所有匹配计算在浏览器端同步执行。',
    modes: ['g 全局搜索', 'i 忽略大小写', 'm 多行模式', 's 单行模式', 'u Unicode 模式', '捕获分组展示'],
    example: {
      title: '正则匹配输入到输出示例',
      input:
        '正则表达式: ([\w.-]+)@([\w.-]+)\.(\w{2,})\n修饰符: g\n目标文本: 联系 support@toolorbit.site 或 admin@example.com',
      output:
        '共 2 个匹配\n\nMatch 1 (index 3): support@toolorbit.site\n  Group 1: support\n  Group 2: toolorbit\n  Group 3: site\n\nMatch 2 (index 28): admin@example.com\n  Group 1: admin\n  Group 2: example\n  Group 3: com',
      inputLanguage: 'text',
      outputLanguage: 'text',
    },
  },
  'json-to-ts': {
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
  'crypto-symmetric': {
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
  'ascii-table': {
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
  base64: {
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
  'url-encoder': {
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
  'uuid-generator': {
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
  'qr-generator': {
    summary:
      '二维码生成器用于在浏览器中将链接、文本、联系方式、Wi-Fi 凭证或业务编号实时转换为可扫码识别的 QR Code 图像。适合为官网和落地页生成入口二维码、为商品包装和标签添加扫码跳转、为线下海报和展板嵌入活动注册链接、为资料下载页和 App 安装页提供移动端快捷入口、为内部流程单和工单系统关联业务编号，以及为 Wi-Fi 网络生成自动连接二维码（扫码后直接加入网络）。工具支持自定义前景色、背景色和四种纠错等级（L / M / Q / H），生成结果可实时预览并下载为 PNG 图片，适合直接用于印刷品和数字媒体。',
    input:
      '需要编码进二维码的文本内容或 URL（支持普通文本、HTTPS 链接、邮件地址 mailto:、电话号码 tel:、Wi-Fi 凭证 WIFI:T:WPA;S:... 格式和短链接）。同时可配置二维码外观参数：前景色（默认 #000000 黑色）、背景色（默认 #ffffff 白色）和纠错等级（L 约 7% 容错、M 约 15%、Q 约 25%、H 约 30% 容错率）。较高纠错等级生成的二维码图案更密集，但即使部分遮挡或污损也更易被识别，适合需要在二维码中央叠加 Logo 或在高磨损环境中使用的场景。',
    output:
      '在浏览器中即时渲染的二维码 Canvas 预览图，随输入内容、颜色和纠错等级变化实时更新。二维码图案以选定的前景色和背景色呈现，纠错等级越高码点越密集但容错能力越强。预览确认后可将当前二维码下载为 PNG 格式图片文件，适合直接用于网页嵌入、印刷海报、商品标签或社交媒体分享。下载文件为浏览器本地生成的 data URL 转 PNG，无需服务端参与。',
    processing:
      '通过 qrcode.react 库在浏览器端根据输入内容生成 QR Code。该库基于 qrcode 算法，将输入字符串按所选纠错等级（L/M/Q/H）编码为二维码矩阵数据，再通过 HTML5 Canvas API 逐像素绘制二维码图案。下载时读取 Canvas 元素的 toDataURL() 获取 Base64 编码的 PNG 数据，通过动态创建 <a> 标签的 download 属性触发本地文件保存。整个编码、渲染和导出流程均在当前浏览器页面内同步完成，输入内容不会上传至任何服务器。',
    modes: ['文本 / URL 编码', '前景色自定义', '背景色自定义', 'L / M / Q / H 纠错等级', '实时预览', 'PNG 图片下载'],
    example: {
      title: '链接输入到二维码输出示例',
      input: '内容: https://toolorbit.site\n前景色: #000000\n背景色: #ffffff\n纠错等级: H',
      output: '生成一个指向 https://toolorbit.site 的二维码 PNG 图片文件，可用于网页嵌入、印刷海报、商品标签或文档。',
      inputLanguage: 'text',
      outputLanguage: 'text',
    },
  },
  'qr-scanner': {
    summary:
      '二维码识别器用于在浏览器中从本地图片文件读取并解析 QR Code 中编码的原始内容。适合在发布前验证自生成二维码是否指向正确 URL、解析他人分享的海报或截图中的活动链接、检查商品包装上印刷二维码的可读性、识别线下活动扫码后的跳转目标、从会议资料或文档截图中提取二维码信息，以及作为二维码生成工具的配套验证手段，确保生成结果可被标准扫码设备正确识别。工具支持点击上传和拖拽上传两种方式，识别在浏览器本地完成，图片不会离开用户设备。',
    input:
      '包含清晰可见二维码区域的本地图片文件。支持浏览器可读取的常见图片格式，包括 PNG、JPG、JPEG、WebP 以及屏幕截图。图片中的二维码应尽量方正、清晰且未被大面积遮挡或反光，二维码在图片中的占比越大识别成功率越高。工具会先将图片绘制到 Canvas 以提取像素数据，因此无需额外安装或上传到服务端。',
    output:
      '识别出的二维码原始文本内容。可能是 HTTPS 链接、普通文本、邮件地址、电话号码、Wi-Fi 连接凭证、业务编号或其他编码字符串。识别成功后结果以可复制的文本形式展示，用户可一键复制到剪贴板用于后续操作。若图片中未检测到二维码（如二维码模糊、遮挡严重或图片不包含二维码），工具会输出明确错误提示，而非静默返回空结果。',
    processing:
      '读取用户选择或拖拽的图片文件（通过 FileReader 读取为 data URL），将其绘制到浏览器内存中的临时 Canvas 元素。随后通过 jsQR 库对 Canvas 的像素数据进行逐行扫描分析：先定位二维码的定位图案（Finder Pattern）确定二维码区域，再解析格式信息获取纠错等级和掩码模式，最后按 QR Code 标准解码数据码字还原原始文本。识别全程在浏览器端执行，图片像素数据不会上传至任何服务器，识别结果仅在当前页面展示。',
    modes: ['点击上传图片', '拖拽上传识别', 'QR Code 内容解析', '识别失败错误提示', '一键复制结果', '重新上传'],
    example: {
      title: '二维码图片输入到文本输出示例',
      input: '上传一张包含 ToolOrbit 首页二维码的 PNG 图片文件',
      output: 'https://toolorbit.site',
      inputLanguage: 'text',
      outputLanguage: 'text',
    },
  },
  'barcode-generator': {
    summary:
      '条形码生成器用于在浏览器中将商品编号、库存 SKU、订单号、资产编号或测试数据实时转换为可打印、可下载的标准条形码图像。适合为电商商品制作带条码的标签贴纸、为仓储入库和库存盘点打印编码标签、为内部固定资产管理系统生成资产条码、为实验室样品和试剂编号、为门店价签和促销标签添加扫码识别，以及在 ERP / WMS 系统联调测试中快速生成符合标准的条码样本。工具基于 JsBarcode 库支持 CODE128、CODE39、EAN-13、EAN-8、UPC-A、ITF-14、MSI、Pharmacode 等多种国际条码制式，并可自定义线宽、高度、文字显示和颜色，生成结果可下载为 PNG 图片直接用于打印。',
    input:
      '需要编码的文本或数字（如商品 SKU、EAN-13 商品编号、订单号）、条码制式选择（CODE128 / CODE39 / EAN-13 / EAN-8 / UPC-A / ITF-14 / MSI / Pharmacode 等），以及外观参数：线宽（单条宽度）、条码高度（像素）、是否在条码下方显示原始文本值、条码前景色和背景色。不同条码制式对输入字符集和长度有不同约束：CODE128 支持全 ASCII 字符集最为通用，CODE39 支持大写字母和数字，EAN-13 必须为 13 位数字（含校验位），EAN-8 为 8 位数字，UPC-A 为 12 位数字。输入不符合制式要求时工具会给出格式错误提示。',
    output:
      '在浏览器中以 SVG 矢量格式实时渲染的条形码预览图，随输入内容、制式和外观参数变化即时更新。条码以选定线宽和高度渲染，可选在条码下方显示原始文本值便于人工核对。预览确认后可下载为 PNG 格式图片，适合直接用于标签打印、嵌入文档或导入设计软件。若输入内容不符合所选条码制式的编码规则（如 EAN-13 位数不匹配或含非法字符），工具会展示格式错误提示，避免导出不可被扫码设备识别的条码。',
    processing:
      '通过 JsBarcode 库在浏览器端根据输入内容和所选制式生成 SVG 格式条码。JsBarcode 会按指定制式的编码规则将输入字符转换为条空序列（如 CODE128 使用三种字符集和校验码计算），再通过 SVG DOM 元素逐条渲染。下载时将 SVG 序列化为字符串，绘制到内存 Canvas 上，再通过 toDataURL() 导出为 PNG 文件并触发浏览器下载。整个编码、渲染和导出流程在当前页面同步完成，输入数据不会上传至任何服务器。',
    modes: ['CODE128 全 ASCII', 'CODE39 字母数字', 'EAN-13 / EAN-8', 'UPC-A', 'ITF-14 / MSI / Pharmacode', '线宽 / 高度调节', '文本显示开关', '前景色 / 背景色', 'PNG 下载'],
    example: {
      title: '商品编号输入到条形码输出示例',
      input: '内容: 123456789012\n格式: CODE128\n线宽: 2\n高度: 100\n显示文本: 是\n条码颜色: #000000\n背景色: #ffffff',
      output: '生成一个可下载的 CODE128 条形码 PNG 图片，条码下方显示原始文本 123456789012。',
      inputLanguage: 'text',
      outputLanguage: 'text',
    },
  },
  'password-generator': {
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
  'unicode-converter': {
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
  'base-converter': {
    summary: '进制转换工具用于在二进制、八进制、十进制和十六进制之间转换数值表示。',
    input: '二进制、八进制、十进制或十六进制数字。',
    output: '其它进制下的等价值。',
    processing: '按整数进制规则转换数值表示，适合调试协议、颜色值和底层数据。',
    modes: ['BIN', 'OCT', 'DEC', 'HEX'],
  },
};

const TECHNICAL_OVERVIEW_TOOL_KEYS = new Set([
  'uuid-generator',
  'qr-generator',
  'qr-scanner',
  'barcode-generator',
  'password-generator',
]);

function developerOverviewFor(toolKey: string, title: string, description: string, isZh: boolean): TechnicalOverview {
  const overviewKey = toolKey === 'xml-to-json' ? 'xml-json' : toolKey;

  if (isZh && DEV_TOOL_OVERVIEWS_ZH[overviewKey]) {
    return DEV_TOOL_OVERVIEWS_ZH[overviewKey];
  }

  return {
    summary: isZh ? `${title} 用于在浏览器内完成开发调试、格式转换或数据检查任务。` : `${title} is used for browser-based developer debugging, conversion, or data inspection tasks.`,
    input: isZh ? '根据工具类型输入文本、代码、数据片段或配置值。' : 'Text, code, data snippets, or configuration values depending on the tool.',
    output: isZh ? '输出可复制、可检查、可继续用于开发流程的处理结果。' : 'Copyable results that can be inspected and reused in development workflows.',
    processing: isZh
      ? `${title} 在浏览器端完成核心处理，适合快速验证、转换和调试。`
      : `${title} runs the core processing in the browser for quick validation, conversion, and debugging.`,
    modes: isZh ? ['本地处理', '实时预览', '复制输出', '开发调试'] : ['Local processing', 'Live preview', 'Copy output', 'Developer debugging'],
    example: {
      title: isZh ? '处理说明' : 'Processing summary',
      input: description,
      output: isZh ? '根据当前工具配置生成对应结果。' : 'The tool returns the result for the current configuration.',
    },
  };
}

const ToolSEOCard: React.FC<ToolSEOCardProps> = ({ toolKey }) => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const tool = TOOLS.find((item) => item.id === toolKey);
  const toolName = tool ? t(`tools.${tool.id}.name`, { defaultValue: tool.name }) : t(`tools.${toolKey}.name`);
  const title = t(`tools.${toolKey}.seoTitle`, {
    defaultValue: t(`tools.${toolKey}.title`, { defaultValue: toolName }),
  });
  const description = t(`tools.${toolKey}.seoDesc`, {
    defaultValue: t(`tools.${toolKey}.subtitle`, {
      defaultValue: t(`tools.${toolKey}.description`, { defaultValue: tool?.description || '' }),
    }),
  });
  const isAiTool = tool?.category === 'AI 工具';
  const isDeveloperTool = tool?.category === '开发者工具';
  const usesTechnicalOverview = isDeveloperTool || TECHNICAL_OVERVIEW_TOOL_KEYS.has(toolKey);
  const isZh = i18n.language?.startsWith('zh');

  // Check if at least the title exists to avoid rendering empty cards
  if (!title || title === `tools.${toolKey}.name`) return null;

  // Dynamically build FAQ content if FAQs exist
  const faqList = [1, 2, 3].map(i => {
    const question = t(`tools.${toolKey}.faq${i}Q`);
    const answer = t(`tools.${toolKey}.faq${i}A`);
    if (question && question !== `tools.${toolKey}.faq${i}Q`) {
      return { question, answer };
    }
    return null;
  }).filter(Boolean);

  const guideList = [1, 2, 3, 4].map(i => {
    const step = t(`tools.${toolKey}.guide${i}`);
    if (step && step !== `tools.${toolKey}.guide${i}`) {
      return step;
    }
    return null;
  }).filter(Boolean);

  const content = (
    <>
        <section className="mb-9 max-w-4xl">
          <h2 className="mb-4 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">{title}</h2>
          <p className="text-[15px] leading-7 text-slate-600 dark:text-slate-400">
            {description}
          </p>
        </section>

        {guideList.length > 0 && (
          <section className="mb-9 border-y border-blue-100 bg-blue-50/40 py-6 dark:border-blue-950 dark:bg-blue-950/20">
            <h3 className="mb-4 text-lg font-semibold text-slate-950 dark:text-white">{t(`tools.${toolKey}.guideTitle`, { defaultValue: 'Quick Usage Guide' })}</h3>
            <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
              {guideList.map((step, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                   <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-blue-600 text-xs font-semibold text-white">
                     {idx + 1}
                   </div>
                   <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">{step}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mb-9">
          <h3 className="mb-5 text-lg font-semibold text-slate-950 dark:text-white">{t(`tools.${toolKey}.highlightsTitle`)}</h3>
          <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <li key={i} className="border-l-2 border-slate-200 pl-4 dark:border-slate-800">
                <strong className="block font-semibold text-slate-950 dark:text-white">
                  {t(`tools.${toolKey}.highlight${i}Title`)}
                </strong>
                <span className="mt-2 block text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {t(`tools.${toolKey}.highlight${i}Desc`)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {faqList.length > 0 && (
          <section className="mt-10 border-t border-slate-200 pt-9 dark:border-slate-800">
            <h3 className="mb-6 text-lg font-semibold text-slate-950 dark:text-white">{t('common.faqTitle', { defaultValue: 'Frequently Asked Questions' })}</h3>
            <div className="space-y-5">
              {faqList.map((faq, idx) => (
                <div key={idx} className="group border-b border-slate-200 pb-5 last:border-0 dark:border-slate-800">
                  <h4 className="mb-2 text-base font-semibold text-slate-950 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                    {faq?.question}
                  </h4>
                  <p className="leading-7 text-slate-600 dark:text-slate-400">
                    {faq?.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
        
        <p className="mt-8 border-t border-slate-200 pt-6 text-sm leading-6 text-slate-500 dark:border-slate-800 dark:text-slate-400">
          {t(`tools.${toolKey}.disclaimer`)}
        </p>
    </>
  );

  const technicalOverview = developerOverviewFor(toolKey, title, description, Boolean(isZh));

  const developerContent = (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
          {isZh ? `${toolName}概述` : `${toolName} overview`}
        </h2>
        <p className="mt-4 text-[15px] leading-7 text-slate-700 dark:text-slate-300">
          {technicalOverview.summary}
        </p>
      </section>

      <section className="space-y-6">
        {[
          { label: isZh ? '输入内容' : 'Input', value: technicalOverview.input },
          { label: isZh ? '输出结果' : 'Output', value: technicalOverview.output },
          { label: isZh ? '处理方式' : 'Processing', value: technicalOverview.processing },
        ].map((item) => (
          <section key={item.label} className="border-t border-slate-200 pt-6 first:border-t-0 first:pt-0 dark:border-slate-800">
            <h3 className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white">{item.label}</h3>
            <p className="mt-3 text-[15px] leading-7 text-slate-700 dark:text-slate-300">{item.value}</p>
          </section>
        ))}
      </section>

      <section className="border-t border-slate-200 pt-6 dark:border-slate-800">
        <h3 className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white">{isZh ? '支持能力' : 'Supported modes'}</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {technicalOverview.modes.map((mode) => (
            <span
              key={mode}
              className="rounded-md border border-blue-100 bg-blue-50 px-2.5 py-1 text-sm font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-200"
            >
              {mode}
            </span>
          ))}
        </div>
      </section>

      {technicalOverview.example ? (
        <section className="border-t border-slate-200 pt-6 dark:border-slate-800">
          <h3 className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white">{technicalOverview.example.title}</h3>
          <div className="mt-5 space-y-5">
            <div>
              <p className="mb-2 text-sm font-semibold text-slate-600 dark:text-slate-400">{isZh ? '输入示例' : 'Input example'}</p>
              <CodeExampleBlock code={technicalOverview.example.input} language={technicalOverview.example.inputLanguage ?? 'text'} />
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold text-slate-600 dark:text-slate-400">{isZh ? '输出示例' : 'Output example'}</p>
              <CodeExampleBlock code={technicalOverview.example.output} language={technicalOverview.example.outputLanguage ?? 'text'} />
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );

  if (isAiTool) {
    return (
      <div className="mt-10 border-t border-slate-200 pt-10 transition-colors duration-300 dark:border-slate-800">
        <p className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">
          {t('toolGuide.label', { defaultValue: 'Tool guide' })}
        </p>
        {content}
      </div>
    );
  }

  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm dark:border-slate-800 dark:bg-[#282c34]">
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-4 bg-slate-50/80 px-5 py-4 text-left transition-colors hover:bg-slate-100/80 dark:bg-slate-900/50 dark:hover:bg-slate-900"
        aria-expanded={isOpen}
      >
        <span className="inline-flex items-center gap-3 text-lg font-semibold text-slate-950 dark:text-white">
          <span className="flex h-7 w-7 items-center justify-center rounded-md border border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300">
            <BookText className="h-4 w-4" aria-hidden="true" />
          </span>
          {isZh ? '概述' : 'Overview'}
        </span>
        <ChevronDown
          className={cn('h-5 w-5 text-slate-500 transition-transform duration-200', isOpen && 'rotate-180')}
          aria-hidden="true"
        />
      </button>

      {isOpen ? (
        <div className="px-5 pb-6 pt-6 sm:px-7">
          {usesTechnicalOverview ? developerContent : content}
        </div>
      ) : (
        <div className="px-5 pb-6 pt-5 sm:px-7">
          <p className="max-w-5xl text-[15px] leading-7 text-slate-600 dark:text-slate-400">
            {description}
          </p>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="mx-auto mt-7 flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition-colors hover:text-blue-700 dark:text-slate-400 dark:hover:text-blue-300"
          >
            {isZh ? '展开更多' : 'Show more'}
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </section>
  );
};

export default ToolSEOCard;
