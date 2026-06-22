'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BookText, ChevronDown } from 'lucide-react';
import { TOOLS } from '../data/tools';
import en from '../locales/en.json';
import { readPath } from '../lib/locale-utils';
import { cn } from '../lib/utils';

type ToolSearchContentProps = {
  path: string;
};

function pickToolText(
  t: ReturnType<typeof useTranslation>['t'],
  toolId: string,
  key: string,
  fallback = '',
) {
  const path = `tools.${toolId}.${key}`;
  const englishFallback = readPath(en, path) || fallback;
  const value = t(path, { defaultValue: englishFallback });
  return typeof value === 'string' && value.trim() ? value : englishFallback;
}

function compactTitle(title: string) {
  return title.replace(' | ToolOrbit', '').replace(':', '').trim();
}

function categoryIntent(category: string, isZh: boolean) {
  if (category.includes('AI')) {
    return isZh
      ? 'AI 辅助的起草、改写、分析和生成场景，适合用清晰提示词快速完成内容工作。'
      : 'AI-assisted drafting, rewriting, analysis, and generation workflows where a clear prompt can save time.';
  }
  if (category.includes('PDF')) {
    return isZh
      ? 'PDF 合并、拆分、转换和文档整理等流程，无需安装桌面软件即可完成。'
      : 'document workflows such as merging, splitting, converting, or preparing files without installing desktop software.';
  }
  if (category.includes('图片')) {
    return isZh
      ? '网站图片优化、格式转换、社交媒体配图、电商素材和设计交付等图像处理任务。'
      : 'image optimization and format conversion tasks for websites, social posts, ecommerce assets, and design handoff.';
  }
  if (category.includes('开发者')) {
    return isZh
      ? '开发调试、数据转换、编码解码、格式校验和安全的本地检查任务。'
      : 'developer debugging, data conversion, encoding, validation, and secure local inspection tasks.';
  }
  if (category.includes('电商')) {
    return isZh
      ? '平台运营、费用估算、商品 Listing 优化和跨境电商日常工作。'
      : 'marketplace planning, fee estimation, listing optimization, and ecommerce operations.';
  }
  return isZh
    ? '浏览器内快速完成转换、计算、生成和日常效率处理。'
    : 'fast browser-based conversion, calculation, generation, and everyday productivity tasks.';
}

function developerFallbackOverview(toolId: string, title: string, isZh: boolean) {
  const zh: Record<string, { summary: string; input: string; output: string; processing: string; modes: string[] }> = {
    'text-diff': {
      summary:
        '文本对比（Diff）工具用于逐词或逐行比较两段文本、代码或配置文件的差异，快速识别新增、删除和修改的内容。适合代码审查时对比两个提交版本、排查配置文件变更、校对文案修改前后的措辞差异，以及检查接口响应体在不同环境下的字段变化。所有比较在本地完成。',
      input:
        '两段需要比较的文本。左侧输入原始版本（Old），右侧输入修改后的新版本（New）。可以是 JavaScript/TypeScript 函数体、JSON 配置对象、CSS 样式规则、Markdown 文档段落或任意纯文本内容。',
      output:
        '差异对比结果以颜色标记展示：绿色背景标识新增内容，红色背景加删除线标识移除内容，无背景色部分表示未变更内容。逐词模式精确到单词级变化，适合文案校对；逐行模式按整行标记差异，适合代码和配置文件比较。',
      processing:
        '工具会按所选模式比较两段文本。逐词模式适合校对措辞变化；逐行模式适合检查代码、配置和结构化文本的整体差异。输入内容保留在本地，不会上传。',
      modes: ['逐词对比', '逐行对比', '新增高亮（绿）', '删除高亮（红）', '本地离线处理'],
    },
    'xml-json': {
      summary:
        'XML / JSON 转换工具用于在 XML 文档结构与 JSON 数据结构之间双向转换。适合处理 SOAP/XML-RPC 接口响应、RSS 订阅源、Sitemap 网站地图、SVG 矢量图形标记以及 Android 布局文件等 XML 内容。粘贴 HTML 源码时，工具会按文档结构输出可读的 JSON 表示。',
      input:
        '在 XML → JSON 模式下，输入标准 XML 文档、HTML 页面源码或 XML 片段。在 JSON → XML 模式下，输入合法的 JSON 对象字符串，工具会把它转换成等价的 XML。',
      output:
        'XML → JSON 方向输出紧凑型 JSON 对象，属性映射为 _attributes 键，文本节点映射为 _text 键；JSON → XML 方向输出带缩进的可读 XML 文本。HTML 源码会输出包含 documentType 和 root 节点的完整 DOM JSON 树。',
      processing:
        'XML 转 JSON 时，工具会保留元素、属性和文本节点的层级关系；JSON 转 XML 时，会先检查 JSON 是否有效，再生成对应 XML 标记。转换在本地完成，输入内容不会上传。',
      modes: ['XML 转 JSON', 'JSON 转 XML', 'HTML DOM 解析', '方向一键切换', '复制转换结果'],
    },
    'color-converter': {
      summary: '颜色转换工具用于在 HEX、RGB、HSL 等 CSS 色彩格式之间转换同一个颜色。',
      input: 'HEX、RGB、HSL 等颜色值。',
      output: '同一颜色在其它格式下的等价值。',
      processing: '解析颜色通道并在不同 CSS 色彩表示之间转换。',
      modes: ['HEX', 'RGB', 'HSL', '复制颜色值'],
    },
    'color-palette': {
      summary: '调色板工具用于根据基础颜色生成一组可复用的界面配色。',
      input: '基础颜色或调色需求。',
      output: '可用于界面、图表和设计稿的颜色组合。',
      processing: '基于颜色关系生成可复用的配色结果。',
      modes: ['调色板生成', '颜色预览', '复制色值', '界面配色'],
    },
    'crypto-symmetric': {
      summary:
        '对称加密工具用于在浏览器内测试和验证 AES、DES、Triple DES、RC4 等对称加密算法的加密与解密流程。适合学习密码学课程中对称加密的工作模式、验证前后端加解密逻辑的一致性、快速生成测试用密文或解密调试日志中的加密字段。',
      input:
        '加密模式下输入待加密的明文字符串、密钥（Key）和可选的初始向量（IV）；解密模式下输入 Base64 编码的密文字符串及对应的密钥和 IV。同时需选择算法、加密模式和填充方式。',
      output:
        '加密模式下输出 Base64 编码的密文字符串；解密模式下输出还原后的明文字符串。当密钥不匹配或参数不一致导致解密失败时，返回明确错误提示帮助排查。',
      processing:
        '工具按所选算法、模式和填充方式执行加密或解密。加密时输出密文；解密时使用相同密钥和参数还原明文。所有操作在本地完成，密钥和明文数据不会上传。',
      modes: ['AES 加密/解密', 'DES 加密/解密', 'Triple DES 加密/解密', 'RC4 加密/解密', 'CBC/CFB/CTR/OFB/ECB 模式', '6 种填充方式'],
    },
  };

  if (isZh && zh[toolId]) return zh[toolId];

  return {
    summary: isZh ? `${title} 用于在浏览器内完成开发调试、格式转换或数据检查任务。` : `${title} is used for browser-based developer debugging, conversion, or data inspection tasks.`,
    input: isZh ? '输入当前工具需要处理的文本、代码或数据。' : 'Text, code, or data for the current developer utility.',
    output: isZh ? '输出可复制、可检查、可继续用于开发流程的结果。' : 'A copyable result for inspection or reuse in development workflows.',
    processing: isZh ? `${title} 在浏览器内完成处理，适合快速验证和调试。` : `${title} processes data in the browser for quick validation and debugging.`,
    modes: isZh ? ['本地处理', '实时预览', '复制输出', '开发调试'] : ['Local processing', 'Live preview', 'Copy output', 'Debugging'],
  };
}

export default function ToolSearchContent({ path }: ToolSearchContentProps) {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const tool = TOOLS.find((item) => item.path === path);
  if (!tool) return null;

  const isZh = i18n.language?.startsWith('zh');
  const isAiTool = tool.category === 'AI 工具';
  const isDeveloperTool = tool.category === '开发者工具';
  const toolName = pickToolText(t, tool.id, 'name', tool.name) || tool.name;
  const title = compactTitle(
    pickToolText(t, tool.id, 'seoTitle') ||
      toolName ||
      tool.name,
  );
  const description =
    pickToolText(t, tool.id, 'seoDesc') ||
    pickToolText(t, tool.id, 'description', tool.description) ||
    tool.description;
  const guideTitle = pickToolText(
    t,
    tool.id,
    'guideTitle',
    t('toolGuide.usageTitle', {
      defaultValue: isZh ? '这个工具通常怎么使用？' : 'How people usually use this tool',
    }),
  );
  const highlightsTitle = pickToolText(
    t,
    tool.id,
    'highlightsTitle',
    t('toolGuide.reasonsTitle', {
      defaultValue: isZh ? '为什么使用这个工具？' : 'Key reasons to use it',
    }),
  );
  const guide = [1, 2, 3, 4]
    .map((index) => pickToolText(t, tool.id, `guide${index}`))
    .filter(Boolean);
  const highlights = [1, 2, 3]
    .map((index) => ({
      title: pickToolText(t, tool.id, `highlight${index}Title`),
      description: pickToolText(t, tool.id, `highlight${index}Desc`),
    }))
    .filter((item) => item.title || item.description);
  const content = (
    <div className="max-w-5xl space-y-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
              {title}
            </h2>
            <p className="mt-4 text-[15px] leading-7 text-slate-600 dark:text-slate-400">
              {description}
              {isZh ? ' 本页面适用于' : ' This page is designed for '}
              {categoryIntent(tool.category, isZh)}
            </p>
          </div>

          {guide.length > 0 && (
            <div>
              <h3 className="mb-3 text-lg font-semibold text-slate-950 dark:text-white">
                {guideTitle}
              </h3>
              <ol className="grid gap-4 text-sm leading-7 text-slate-600 dark:text-slate-400 sm:grid-cols-2">
                {guide.map((item, index) => (
                  <li key={item} className="grid grid-cols-[26px_minmax(0,1fr)] gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600 text-xs font-semibold text-white">
                      {index + 1}
                    </span>
                    <span>
                    {item}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {highlights.length > 0 && (
            <div>
              <h3 className="mb-3 text-lg font-semibold text-slate-950 dark:text-white">
                {highlightsTitle}
              </h3>
              <div className="grid gap-3 sm:grid-cols-3">
                {highlights.map((item) => (
                  <div key={`${item.title}-${item.description}`} className="border-l-2 border-slate-200 pl-4 dark:border-slate-800">
                    {item.title ? <h4 className="font-semibold text-slate-950 dark:text-white">{item.title}</h4> : null}
                    {item.description ? <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{item.description}</p> : null}
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>
  );
  const developerOverview = developerFallbackOverview(tool.id, title, Boolean(isZh));
  const developerContent = (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
          {isZh ? `${toolName}概述` : `${toolName} overview`}
        </h2>
        <p className="mt-4 text-[15px] leading-7 text-slate-700 dark:text-slate-300">
          {developerOverview.summary}
        </p>
      </section>

      <section className="space-y-6">
        {[
          { label: isZh ? '输入内容' : 'Input', value: developerOverview.input },
          { label: isZh ? '输出结果' : 'Output', value: developerOverview.output },
          { label: isZh ? '处理方式' : 'Processing', value: developerOverview.processing },
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
          {developerOverview.modes.map((mode) => (
            <span
              key={mode}
              className="rounded-md border border-blue-100 bg-blue-50 px-2.5 py-1 text-sm font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-200"
            >
              {mode}
            </span>
          ))}
        </div>
      </section>
    </div>
  );

  if (isAiTool) {
    return (
      <section className="mt-10 border-t border-slate-200/70 pt-10 dark:border-slate-800/70">
        <p className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">
          {t('toolGuide.label', { defaultValue: isZh ? '工具指南' : 'Tool guide' })}
        </p>
        {content}
      </section>
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
        <div className="px-5 pb-6 pt-6 sm:px-7">{isDeveloperTool ? developerContent : content}</div>
      ) : (
        <div className="px-5 pb-6 pt-5 sm:px-7">
          <p className="max-w-5xl text-[15px] leading-7 text-slate-600 dark:text-slate-400">
            {description}
            {isZh ? ' 本页面适用于' : ' This page is designed for '}
            {categoryIntent(tool.category, isZh)}
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
}
