import NextLink from 'next/link';
import { ArrowRight, Boxes, CheckCircle2 } from 'lucide-react';
import { TOOLS, type Category } from '../data/tools';
import en from '../locales/en.json';
import zh from '../locales/zh.json';
import { CATEGORY_SLUGS, getCategoryPath } from '../lib/category-paths';
import { localizedPath, type Locale } from '../lib/i18n-routing';
import { readPath, SITE_NAME } from '../lib/metadata';

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
  const totalTools = TOOLS.length;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="mb-10">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-200">
          <Boxes className="h-4 w-4" aria-hidden="true" />
          {isZh ? `${totalTools} 个浏览器工具` : `${totalTools} browser tools`}
        </div>
        <h1 className="max-w-3xl text-4xl font-bold tracking-normal text-slate-950 dark:text-white sm:text-5xl">
          {isZh ? '所有免费在线工具' : 'All Free Online Tools'}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
          {isZh
            ? '浏览 ToolOrbit 的开发者、AI、PDF、图片、电商、文本、生成器和计算转换工具。每个工具都可从浏览器直接打开，适合快速完成日常工作流。'
            : 'Browse every ToolOrbit developer, AI, PDF, image, ecommerce, text, generator, and conversion tool from one crawlable hub. Open each utility directly in the browser for fast everyday workflows.'}
        </p>
      </section>

      <nav aria-label={isZh ? '工具分类锚点' : 'Tool category anchors'} className="mb-10">
        <ul className="flex flex-wrap gap-2">
          {CATEGORY_ORDER.map((category) => (
            <li key={category}>
              <a
                href={`#${CATEGORY_SLUGS[category]}`}
                className="inline-flex min-h-11 items-center rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-700 dark:hover:text-blue-200"
              >
                {categoryName(category, locale)}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="space-y-12">
        {CATEGORY_ORDER.map((category) => {
          const tools = TOOLS.filter((tool) => tool.category === category);
          const categoryPath = localizedPath(getCategoryPath(category), locale);

          return (
            <section key={category} id={CATEGORY_SLUGS[category]} className="scroll-mt-24">
              <div className="mb-4 flex flex-col gap-3 border-b border-slate-200 pb-4 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold tracking-normal text-slate-950 dark:text-white">
                    {categoryName(category, locale)}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {isZh ? `${tools.length} 个工具` : `${tools.length} tools`}
                  </p>
                </div>
                <NextLink
                  href={categoryPath}
                  className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-blue-700 transition hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200"
                >
                  {isZh ? '查看分类页' : 'View category'}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </NextLink>
              </div>

              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {tools.map((tool) => {
                  const Icon = tool.icon;

                  return (
                    <li key={tool.id}>
                      <NextLink
                        href={localizedPath(tool.path, locale)}
                        className="group flex h-full min-h-32 gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700"
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-700 transition group-hover:bg-blue-50 group-hover:text-blue-700 dark:bg-slate-800 dark:text-slate-200 dark:group-hover:bg-blue-950 dark:group-hover:text-blue-200">
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <span className="min-w-0">
                          <span className="flex items-center gap-2 text-base font-semibold text-slate-950 dark:text-white">
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
