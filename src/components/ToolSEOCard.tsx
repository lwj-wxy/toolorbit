'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BookText, ChevronDown } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { TOOLS } from '../data/tools';
import { CATEGORY_SLUGS } from '../lib/category-paths';
import { cn } from '../lib/utils';
import type { TechnicalOverview } from '../types/tool-overview';
import { DEV_TOOL_OVERVIEWS } from '../views/tools/dev/data';
import { IMAGE_TOOL_OVERVIEWS } from '../views/tools/image/data';
import { TEXT_TOOL_OVERVIEWS } from '../views/tools/text/data';
import { ECOMMERCE_TOOL_OVERVIEWS } from '../views/tools/ecommerce/data';
import { PDF_TOOL_OVERVIEWS } from '../views/tools/pdf/data';
import { CALCULATE_TOOL_OVERVIEWS } from '../views/tools/calculate/data';
import { NET_TOOL_OVERVIEWS } from '../views/tools/net/data';
import { AI_TOOL_OVERVIEWS } from '../views/tools/ai/data';
import { UTILITY_TOOL_OVERVIEWS } from '../views/tools/utility/data';

const ALL_OVERVIEWS: Record<string, { zh: TechnicalOverview; en: TechnicalOverview }> = {
  ...DEV_TOOL_OVERVIEWS,
  ...IMAGE_TOOL_OVERVIEWS,
  ...TEXT_TOOL_OVERVIEWS,
  ...ECOMMERCE_TOOL_OVERVIEWS,
  ...PDF_TOOL_OVERVIEWS,
  ...CALCULATE_TOOL_OVERVIEWS,
  ...NET_TOOL_OVERVIEWS,
  ...AI_TOOL_OVERVIEWS,
  ...UTILITY_TOOL_OVERVIEWS,
};

const STANDALONE_FAQ_CATEGORY_SLUGS = new Set([
  'developer-tools',
  'generators',
  'text-tools',
  'ecommerce-tools',
  'pdf-tools',
  'image-tools',
]);
const CUSTOM_FAQ_TOOL_KEYS = new Set([
  'reverse-vat-calculator',
  'vat-inclusive-exclusive-calculator',
  'uk-vat-calculator',
]);

interface ToolSEOCardProps {
  toolKey: string;
  overview?: TechnicalOverview;
}

type ToolFaq = {
  question: string;
  answer: string;
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

const StandaloneFaqCard = ({ title, faqList }: { title: string; faqList: ToolFaq[] }) => (
  <section className="mt-8 rounded-2xl border border-slate-200/90 bg-white px-5 py-7 shadow-sm dark:border-slate-800 dark:bg-[#282c34] sm:px-7">
    <h2 className="mb-6 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">{title}</h2>
    <div className="space-y-5">
      {faqList.map((faq, index) => (
        <div key={`${faq.question}-${index}`} className="border-b border-slate-200 pb-5 last:border-0 dark:border-slate-800">
          <h3 className="mb-2 text-base font-semibold text-slate-950 dark:text-white">{faq.question}</h3>
          <p className="leading-7 text-slate-600 dark:text-slate-400">{faq.answer}</p>
        </div>
      ))}
    </div>
  </section>
);

const TECHNICAL_OVERVIEW_TOOL_KEYS = new Set([
  'uuid-generator',
  'qr-generator',
  'qr-scanner',
  'barcode-generator',
  'password-generator',
  'text-analyzer',
  'text-cleaner',
  'symbol-library',
  'etsy-fee-calculator',
  'stripe-fee-calculator',
  'image-compressor',
  'image-converter',
  'svg-to-png',
  'image-to-base64',
  'image-cropper',
  'image-to-ico',
  'pdf-merge',
  'pdf-split',
  'pdf-to-image',
  'image-to-pdf',
]);

function developerOverviewFor(toolKey: string, title: string, description: string, isZh: boolean): TechnicalOverview {
  const overviewKey = toolKey === 'xml-to-json' ? 'xml-json' : toolKey;

  const found = ALL_OVERVIEWS[overviewKey];
  if (found) {
    return isZh ? found.zh : found.en;
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

const ToolSEOCard: React.FC<ToolSEOCardProps> = ({ toolKey, overview }) => {
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
  const categorySlug = tool ? CATEGORY_SLUGS[tool.category] : undefined;
  const isAiTool = categorySlug === 'ai-tools';
  const isDeveloperTool = categorySlug === 'developer-tools';
  const shouldShowStandaloneFaq = Boolean(
    categorySlug && STANDALONE_FAQ_CATEGORY_SLUGS.has(categorySlug) && !CUSTOM_FAQ_TOOL_KEYS.has(toolKey),
  );
  const overviewKey = toolKey === 'xml-to-json' ? 'xml-json' : toolKey;
  const hasStoredOverview = Boolean(ALL_OVERVIEWS[overviewKey]);
  const usesTechnicalOverview = Boolean(overview) || hasStoredOverview || isDeveloperTool || TECHNICAL_OVERVIEW_TOOL_KEYS.has(toolKey);
  const isZh = i18n.language?.startsWith('zh');

  // Check if at least the title exists to avoid rendering empty cards
  if (!title || title === `tools.${toolKey}.name`) return null;

  // Dynamically build FAQ content if FAQs exist
  const faqList: ToolFaq[] = [1, 2, 3].map(i => {
    const question = t(`tools.${toolKey}.faq${i}Q`);
    const answer = t(`tools.${toolKey}.faq${i}A`);
    if (question && question !== `tools.${toolKey}.faq${i}Q`) {
      return { question, answer };
    }
    return null;
  }).filter((faq): faq is ToolFaq => Boolean(faq));

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

        {!shouldShowStandaloneFaq && faqList.length > 0 && (
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

  const technicalOverview = overview || developerOverviewFor(toolKey, title, description, Boolean(isZh));

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

  if (isAiTool && !usesTechnicalOverview) {
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
    <>
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

      {shouldShowStandaloneFaq && faqList.length > 0 ? (
        <StandaloneFaqCard title={t('common.faqTitle', { defaultValue: 'Frequently Asked Questions' })} faqList={faqList} />
      ) : null}
    </>
  );
};

export default ToolSEOCard;
