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
      summary: '文本对比工具用于比较两段文本、配置或代码，快速找出新增、删除和变化的位置。',
      input: '两段需要比较的文本、配置或代码片段。',
      output: '按差异标记新增、删除和未变化内容，方便快速定位改动。',
      processing: '在浏览器内执行文本差异比较，不需要上传内容到服务器。',
      modes: ['左右文本对比', '差异高亮', '本地处理', '复制结果'],
    },
    'xml-json': {
      summary: 'XML / JSON 转换工具用于在 XML、HTML 文档结构和 JSON 数据结构之间转换，方便接口调试、配置迁移和页面结构检查。',
      input: 'XML 文本、HTML 页面源码或 JSON 文本。',
      output: '转换后的 JSON 或 XML；HTML 会输出 DOM 结构化 JSON。',
      processing: '标准 XML 使用严格 XML 解析，HTML 页面源码使用浏览器 DOMParser 宽松解析；JSON 转 XML 会先校验 JSON 语法再序列化。',
      modes: ['XML 转 JSON', 'HTML 转 JSON', 'JSON 转 XML', '本地转换'],
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
      summary: '对称加密工具用于在浏览器内测试文本加密和解密流程。',
      input: '待加密/解密文本、密钥和算法参数。',
      output: '加密后的密文或解密后的明文。',
      processing: '在浏览器端执行对称加密/解密，适合测试和学习算法行为。',
      modes: ['加密', '解密', '密钥输入', '本地处理'],
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
