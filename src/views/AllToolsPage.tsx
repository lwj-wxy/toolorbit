import NextLink from 'next/link';
import { ArrowRight, Boxes, CheckCircle2 } from 'lucide-react';
import { TOOLS, type Category } from '../data/tools';
import en from '../locales/en.json';
import zh from '../locales/zh.json';
import { CATEGORY_SLUGS, getCategoryPath } from '../lib/category-paths';
import { localizedPath, type Locale } from '../lib/i18n-routing';
import { readPath, SITE_NAME } from '../lib/metadata';
import { getToolCoverPath, hasGeneratedToolCover } from '../lib/tool-covers';

type AllToolsPageProps = {
  locale?: Locale;
};

const CATEGORY_ORDER = Object.keys(CATEGORY_SLUGS) as Category[];

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
  const visibleTools = TOOLS.filter((tool) => !tool.isNoIndex);
  const totalTools = visibleTools.length;

  return (
    <main className="mx-auto w-full max-w-7xl py-4">
      <section className="mb-9 border-b border-slate-200 pb-8 dark:border-slate-800">
        <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-[12px] font-semibold text-cyan-700 dark:border-cyan-900/60 dark:bg-cyan-950/40 dark:text-cyan-200">
          <Boxes className="h-4 w-4" aria-hidden="true" />
          {isZh ? `${totalTools} 个浏览器工具` : `${totalTools} browser tools`}
        </div>
        <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
          {isZh ? '所有免费在线工具' : 'All Free Online Tools'}
        </h1>
        <p className="mt-4 max-w-3xl text-[15px] leading-7 text-slate-600 dark:text-slate-300">
          {isZh
            ? '浏览 ToolOrbit 的开发者、AI、PDF、图片、电商、文本、生成器、计算转换和日常实用工具。每个工具都可从浏览器直接打开，适合快速完成日常工作流。'
            : 'Browse every ToolOrbit developer, AI, PDF, image, ecommerce, text, generator, conversion, and everyday utility tool from one crawlable hub. Open each utility directly in the browser for fast everyday workflows.'}
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
                        className="group flex h-full min-h-[232px] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-colors hover:border-cyan-300 hover:bg-cyan-50/20 dark:border-slate-800 dark:bg-[#282c34] dark:hover:border-cyan-700 dark:hover:bg-cyan-950/10"
                      >
                        {hasGeneratedToolCover(tool.id) ? (
                          <span className="relative aspect-[16/10] overflow-hidden rounded-t-lg border-b border-slate-100 bg-slate-50 dark:border-white/10 dark:bg-slate-900">
                            <img
                              src={getToolCoverPath(tool.id)}
                              alt={toolName(tool, locale)}
                              className="block h-full w-full origin-bottom scale-[1.14] object-cover"
                              loading="lazy"
                            />
                          </span>
                        ) : (
                          <span className="relative flex aspect-[16/10] overflow-hidden rounded-t-lg border-b border-cyan-100 bg-gradient-to-br from-cyan-50 via-white to-sky-50 p-3 text-cyan-700 shadow-inner dark:border-white/10 dark:from-cyan-950/40 dark:via-slate-900 dark:to-sky-950/20 dark:text-cyan-200">
                            <span className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/70 blur-2xl dark:bg-white/10" />
                            <span className="relative flex h-full w-full flex-col justify-between">
                              <span className="w-fit rounded-full bg-white/80 px-2 py-1 text-[11px] font-semibold text-slate-600 shadow-sm dark:bg-slate-950/50 dark:text-slate-300">
                                {categoryName(tool.category, locale)}
                              </span>
                              <span className="flex items-end justify-between gap-3">
                                <span className="line-clamp-2 text-[13px] font-semibold leading-5 text-slate-900 dark:text-white">
                                  {toolName(tool, locale)}
                                </span>
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/90 shadow-sm dark:bg-slate-950/70">
                                  <Icon className="h-5 w-5" aria-hidden="true" />
                                </span>
                              </span>
                            </span>
                          </span>
                        )}
                        <span className="min-w-0 p-3 pt-4">
                          <span className="flex items-center gap-2 text-[15px] font-semibold text-slate-950 transition-colors group-hover:text-cyan-700 dark:text-white dark:group-hover:text-cyan-300">
                            <span>{toolName(tool, locale)}</span>
                            {tool.isPopular ? (
                              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" aria-hidden="true" />
                            ) : null}
                          </span>
                          <span className="mt-2 line-clamp-3 block text-sm leading-6 text-slate-600 dark:text-slate-300">
                            {toolDescription(tool, locale)}
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
