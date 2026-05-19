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
    summary: 'JSON 格式化工具用于在浏览器中校验、缩进和整理 JSON 文本，适合处理接口响应、配置片段和调试日志中的 JSON 数据。',
    input: '原始 JSON 字符串，可以是压缩后的单行 JSON，也可以是带缩进但格式不规范的 JSON。',
    output: '格式化后的 JSON 文本；语法错误时会输出明确的解析错误，而不是改写原始内容。',
    processing: '使用浏览器内置 JSON.parse 校验结构，再用 JSON.stringify 按选择的缩进重新序列化；处理过程在本地浏览器完成。',
    modes: ['2 空格缩进', '4 空格缩进', '实时校验', '一键复制输出'],
    example: {
      title: 'JSON 输入到格式化输出示例',
      input: '{\n  "name": "ToolOrbit",\n  "enabled": true,\n  "tags": ["json", "format"]\n}',
      output: '{\n  "name": "ToolOrbit",\n  "enabled": true,\n  "tags": [\n    "json",\n    "format"\n  ]\n}',
      inputLanguage: 'json',
      outputLanguage: 'json',
    },
  },
  'json-to-ts': {
    summary: 'JSON 转 TypeScript 工具会根据 JSON 样本推断字段类型，并生成可复制到项目中的 TypeScript 类型声明。',
    input: 'JSON 对象或数组样本。',
    output: 'TypeScript interface/type 声明，用于把接口响应、配置文件或样例数据转成类型定义。',
    processing: '解析 JSON 值并推断字段类型、数组元素类型和嵌套对象结构，再生成 TypeScript 类型代码。',
    modes: ['对象类型推断', '数组类型推断', '嵌套结构展开', '复制 TypeScript 输出'],
    example: {
      title: 'JSON 输入到 TypeScript 输出示例',
      input: '{\n  "user": {\n    "id": 123,\n    "name": "Alice",\n    "roles": ["admin", "viewer"]\n  }\n}',
      output: 'interface Root {\n  user: User;\n}\n\ninterface User {\n  id: number;\n  name: string;\n  roles: string[];\n}',
      inputLanguage: 'json',
      outputLanguage: 'typescript',
    },
  },
  'regex-tester': {
    summary: '正则表达式调试工具用于实时测试 JavaScript 正则表达式，查看匹配位置、匹配内容和捕获分组。',
    input: '正则表达式、修饰符以及待测试文本。',
    output: '匹配数量、匹配位置、完整匹配内容和捕获分组列表，并在目标文本中高亮匹配片段。',
    processing: '使用 JavaScript RegExp 引擎实时执行匹配；全局模式会遍历所有匹配，非全局模式返回首个匹配。',
    modes: ['g 全局搜索', 'i 忽略大小写', 'm 多行模式', 's 单行模式', 'u Unicode 模式'],
    example: {
      title: '正则匹配输出示例',
      input: '/([a-z]+)/g\nHello World 2026 ToolOrbit',
      output: 'Match 1: ello, index 1\nMatch 2: orld, index 7\nMatch 3: ool, index 18\nMatch 4: rbit, index 22',
      inputLanguage: 'text',
      outputLanguage: 'text',
    },
  },
  base64: {
    summary: 'Base64 工具用于在普通文本和 Base64 字符串之间转换，适合检查接口字段、数据片段和轻量编码内容。',
    input: '普通文本或 Base64 编码字符串。',
    output: '编码后的 Base64 文本，或解码后的原始文本。',
    processing: '使用浏览器端编码/解码能力处理字符串，不上传输入内容。',
    modes: ['文本转 Base64', 'Base64 转文本', '复制输出', '本地处理'],
  },
  'url-encoder': {
    summary: 'URL 编解码工具用于处理 URL 参数中的中文、空格、符号和保留字符，方便调试链接和查询字符串。',
    input: 'URL、查询参数或需要放入 URL 的文本片段。',
    output: '编码后的 URL 安全文本，或解码后的可读文本。',
    processing: '基于 encodeURIComponent/decodeURIComponent 处理保留字符、空格、中文和特殊符号。',
    modes: ['URL 编码', 'URL 解码', '复制输出', '本地处理'],
  },
  'jwt-debugger': {
    summary: 'JWT 调试工具用于拆解 JWT 的 Header 和 Payload，帮助查看 token 中携带的字段和时间信息。',
    input: 'JWT 字符串。',
    output: 'Header、Payload 的 JSON 解析结果，以及 token 结构检查结果。',
    processing: '在浏览器内拆分 JWT 三段并 Base64URL 解码；用于调试内容，不等同于服务端签名验真。',
    modes: ['Header 解析', 'Payload 解析', '过期时间查看', '本地解码'],
  },
  'hash-generator': {
    summary: '哈希生成器用于把输入文本计算为 MD5、SHA 系列等摘要值，适合校验内容一致性或生成调试用摘要。',
    input: '任意文本内容。',
    output: 'MD5、SHA 系列等哈希摘要。',
    processing: '使用前端加密摘要算法对输入文本计算不可逆摘要。',
    modes: ['MD5', 'SHA-1', 'SHA-256', 'SHA-512'],
  },
  'uuid-generator': {
    summary: 'UUID 工具用于生成可复制的唯一标识符，适合测试数据、临时主键、示例配置和接口调试。',
    input: '生成数量或版本选项。',
    output: '可复制的 UUID 列表。',
    processing: '在浏览器内生成随机标识符，适合测试数据、临时主键和示例配置。',
    modes: ['单个生成', '批量生成', '复制列表', '格式校验'],
  },
  'xml-json': {
    summary: 'XML / JSON 转换工具用于在 XML、HTML 文档结构和 JSON 数据结构之间转换，方便接口调试、配置迁移和页面结构检查。',
    input: 'XML 文本、HTML 页面源码或 JSON 文本。',
    output: '转换后的 JSON 或 XML；HTML 会输出 DOM 结构化 JSON。',
    processing: '标准 XML 使用严格 XML 解析，HTML 页面源码使用浏览器 DOMParser 宽松解析；JSON 转 XML 会先校验 JSON 语法再序列化。',
    modes: ['XML 转 JSON', 'HTML 转 JSON', 'JSON 转 XML', '复制结果'],
  },
  'text-diff': {
    summary: '文本对比工具用于比较两段文本、配置或代码，快速找出新增、删除和变化的位置。',
    input: '两段需要比较的文本或代码。',
    output: '新增、删除、未变化的差异片段。',
    processing: '在浏览器内执行文本 diff，按行或片段展示差异结果。',
    modes: ['文本对比', '代码对比', '差异高亮', '本地处理'],
  },
  'unicode-converter': {
    summary: 'Unicode 转换工具用于在普通文本和 Unicode 转义表示之间转换，帮助排查字符编码和转义问题。',
    input: '普通文本、Unicode 转义或字符编码片段。',
    output: '转换后的可读文本或 Unicode 表示。',
    processing: '对字符码点和转义序列进行本地转换，方便排查编码问题。',
    modes: ['文本转 Unicode', 'Unicode 转文本', '字符检查', '复制输出'],
  },
  'base-converter': {
    summary: '进制转换工具用于在二进制、八进制、十进制和十六进制之间转换数值表示。',
    input: '二进制、八进制、十进制或十六进制数字。',
    output: '其它进制下的等价值。',
    processing: '按整数进制规则转换数值表示，适合调试协议、颜色值和底层数据。',
    modes: ['BIN', 'OCT', 'DEC', 'HEX'],
  },
};

function developerOverviewFor(toolKey: string, title: string, description: string, isZh: boolean): TechnicalOverview {
  if (isZh && DEV_TOOL_OVERVIEWS_ZH[toolKey]) {
    return DEV_TOOL_OVERVIEWS_ZH[toolKey];
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

  const title = t(`tools.${toolKey}.seoTitle`);
  const description = t(`tools.${toolKey}.seoDesc`);
  const tool = TOOLS.find((item) => item.id === toolKey);
  const toolName = tool ? t(`tools.${tool.id}.name`, { defaultValue: tool.name }) : title;
  const isAiTool = tool?.category === 'AI 工具';
  const isDeveloperTool = tool?.category === '开发者工具';
  const isZh = i18n.language?.startsWith('zh');

  // Check if at least the title exists to avoid rendering empty cards
  if (!title || title === `tools.${toolKey}.seoTitle`) return null;

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
          {isDeveloperTool ? developerContent : content}
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
