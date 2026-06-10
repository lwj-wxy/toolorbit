import NextLink from 'next/link';
import type { CSSProperties } from 'react';
import { ArrowRight, Boxes } from 'lucide-react';
import { TOOLS, type Category } from '../data/tools';
import en from '../locales/en.json';
import zh from '../locales/zh.json';
import { CATEGORY_SLUGS, getCategoryPath } from '../lib/category-paths';
import { localizedPath, type Locale } from '../lib/i18n-routing';
import { readPath, SITE_NAME } from '../lib/metadata';

type AllToolsPageProps = {
  locale?: Locale;
};

const OTHER_TOOLS_EXCLUDED_CATEGORY: Category = 'AI 工具';
const twoLineDescriptionStyle: CSSProperties = {
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
  overflow: 'hidden',
  minHeight: '2.5rem',
  maxHeight: '2.5rem',
};
const CATEGORY_ORDER = (Object.keys(CATEGORY_SLUGS) as Category[]).filter(
  (category) => category !== OTHER_TOOLS_EXCLUDED_CATEGORY,
);

function localeSource(locale: Locale) {
  return locale === 'zh-CN' ? zh : en;
}

function cleanToolTitle(value: string) {
  return value.replace(` | ${SITE_NAME}`, '').trim();
}

function toolName(tool: (typeof TOOLS)[number], locale: Locale) {
  const source = localeSource(locale);
  return cleanToolTitle(readPath(source, `tools.${tool.id}.name`) || readPath(source, `tools.${tool.id}.seoTitle`) || tool.name);
}

function toolDescription(tool: (typeof TOOLS)[number], locale: Locale) {
  const source = localeSource(locale);
  return readPath(source, `tools.${tool.id}.description`) || readPath(source, `tools.${tool.id}.seoDesc`) || tool.description;
}

function categoryName(category: Category, locale: Locale) {
  return readPath(localeSource(locale), `common.categories.${category}`) || category;
}

export default function AllToolsPage({ locale = 'en' }: AllToolsPageProps) {
  const isZh = locale === 'zh-CN';
  const visibleTools = TOOLS.filter(
    (tool) => !tool.isNoIndex && tool.category !== OTHER_TOOLS_EXCLUDED_CATEGORY,
  );
  const totalTools = visibleTools.length;

  return (
    <main className="mx-auto w-full max-w-7xl py-4">
      <section className="mb-9 border-b border-slate-200 pb-8 dark:border-slate-800">
        <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-[12px] font-semibold text-cyan-700 dark:border-cyan-900/60 dark:bg-cyan-950/40 dark:text-cyan-200">
          <Boxes className="h-4 w-4" aria-hidden="true" />
          {isZh ? `${totalTools} 个浏览器工具` : `${totalTools} browser tools`}
        </div>
        <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
          {isZh ? '其它免费在线工具' : 'Other Free Online Tools'}
        </h1>
        <p className="mt-4 max-w-3xl text-[15px] leading-7 text-slate-600 dark:text-slate-300">
          {isZh
            ? '这里收纳开发者、PDF、图片、电商、文本、生成器、计算转换和日常实用工具。AI 工具从首页进入。'
            : 'Browse ToolOrbit developer, PDF, image, ecommerce, text, generator, conversion, and everyday utility tools. AI tools live on the home entry.'}
        </p>
      </section>

      <nav aria-label={isZh ? '工具分类锚点' : 'Tool category anchors'} className="mb-10">
        <ul className="flex flex-wrap gap-2">
          {CATEGORY_ORDER.map((category) => (
            <li key={category}>
              <a
                href={`#${CATEGORY_SLUGS[category]}`}
                className="inline-flex min-h-10 items-center rounded-full border border-slate-200 bg-white px-4 text-[13px] font-medium text-slate-700 shadow-sm transition-colors hover:border-cyan-300 hover:text-cyan-700 dark:border-slate-700 dark:bg-[#282c34] dark:text-slate-200 dark:hover:border-cyan-700 dark:hover:text-cyan-200"
              >
                {categoryName(category, locale)}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="space-y-12">
        {CATEGORY_ORDER.map((category) => {
          const tools = visibleTools.filter((tool) => tool.category === category);
          const categoryPath = localizedPath(getCategoryPath(category), locale);

          return (
            <section key={category} id={CATEGORY_SLUGS[category]} className="scroll-mt-24">
              <div className="mb-4 flex flex-col gap-3 border-b border-slate-200 pb-4 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                    {categoryName(category, locale)}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {isZh ? `${tools.length} 个工具` : `${tools.length} tools`}
                  </p>
                </div>
                <NextLink
                  href={categoryPath}
                  className="inline-flex min-h-10 items-center gap-2 text-[13px] font-semibold text-cyan-700 transition hover:text-cyan-800 dark:text-cyan-300 dark:hover:text-cyan-200"
                >
                  {isZh ? '查看分类页' : 'View category'}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </NextLink>
              </div>

              <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {tools.map((tool) => {
                  const Icon = tool.icon;

                  return (
                    <li key={tool.id}>
                      <NextLink
                        href={localizedPath(tool.path, locale)}
                        className="flex overflow-hidden rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-[#282c34]"
                      >
                        <span className="flex min-w-0 items-start gap-3">
                          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-200">
                            <Icon className="h-5 w-5" aria-hidden="true" />
                          </span>
                          <span className="min-w-0">
                            <span className="line-clamp-1 text-[15px] font-semibold text-slate-950 dark:text-white">
                              {toolName(tool, locale)}
                            </span>
                            <span
                              className="mt-2 block text-[13px] leading-5 text-slate-600 dark:text-slate-300"
                              style={twoLineDescriptionStyle}
                            >
                              {toolDescription(tool, locale)}
                            </span>
                          </span>
                        </span>
                      </NextLink>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </main>
  );
}
