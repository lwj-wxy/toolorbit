'use client';

import { useTranslation } from 'react-i18next';
import { TOOLS } from '../data/tools';
import en from '../locales/en.json';
import { readPath } from '../lib/locale-utils';

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

export default function ToolSearchContent({ path }: ToolSearchContentProps) {
  const { t, i18n } = useTranslation();
  const tool = TOOLS.find((item) => item.path === path);
  if (!tool) return null;

  const isZh = i18n.language?.startsWith('zh');
  const title = compactTitle(
    pickToolText(t, tool.id, 'seoTitle') ||
      pickToolText(t, tool.id, 'name', tool.name) ||
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
  return (
    <section className="mt-10 border-t border-slate-200/70 pt-10 dark:border-slate-800/70">
      <div className="max-w-5xl space-y-6">
          <div>
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">
              {t('toolGuide.label', { defaultValue: isZh ? '工具指南' : 'Tool guide' })}
            </p>
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
    </section>
  );
}
