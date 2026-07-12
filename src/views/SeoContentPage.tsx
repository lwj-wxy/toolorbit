import React from 'react';
import NextLink from 'next/link';
import { ArrowRight, CalendarCheck, CheckCircle2, ExternalLink, Layers, Wrench } from 'lucide-react';
import { PUBLISHED_BLOG_POSTS } from '../constants/blogData';
import en from '../locales/en.json';
import { blogBySlug, toolByPath, type SeoContentPage } from '../data/seoContent';

const PAGE_SOURCES: Record<string, Array<{ label: string; url: string }>> = {
  '/ecommerce-tools': [
    { label: 'Etsy Fees and Payments Policy', url: 'https://www.etsy.com/legal/fees/' },
    { label: 'Etsy Offsite Ads Policy', url: 'https://www.etsy.com/legal/advertising/' },
  ],
  '/best-etsy-fee-calculators': [
    { label: 'Etsy Fees and Payments Policy', url: 'https://www.etsy.com/legal/fees/' },
    { label: 'Etsy Help Center', url: 'https://help.etsy.com/hc/en-us' },
  ],
};

const LINK_PATTERN = /\[([^\]]+)\]\((\/[^)]+)\)/g;

const UI_TEXT = {
  en: {
    lastReviewed: 'Last reviewed',
    target: 'Target',
    audienceTitle: 'Who This Page Is For',
    comparisonMatrix: 'Comparison Matrix',
    categoryComparison: 'Category Comparison',
    area: 'Area',
    bestFor: 'Best For',
    relevantTools: 'Relevant Tools',
    practicalNote: 'Practical Note',
    relatedTools: 'Related ToolOrbit Tools',
    relatedToolsDescription: 'Open the specific utility when you are ready to apply the workflow.',
    relatedGuides: 'Related Guides',
    guideFallback: 'Guide',
    readGuide: 'Read guide',
    faq: 'FAQ',
    maintained:
      'Maintained by the ToolOrbit Editorial Team. This page links to practical tools and supporting guides so readers can verify the workflow rather than relying on broad claims.',
    editorialProfile: 'Editorial team profile',
  },
  zh: {
    lastReviewed: '最近复核',
    target: '目标关键词',
    audienceTitle: '本页面适合谁',
    comparisonMatrix: '对比矩阵',
    categoryComparison: '分类对比',
    area: '范围',
    bestFor: '适用场景',
    relevantTools: '相关工具',
    practicalNote: '实用说明',
    relatedTools: '相关 ToolOrbit 工具',
    relatedToolsDescription: '当你准备执行该工作流时，可直接打开对应工具。',
    relatedGuides: '相关指南',
    guideFallback: '指南',
    readGuide: '阅读指南',
    faq: '常见问题',
    maintained:
      '由 ToolOrbit 编辑团队维护。本页面链接到实用工具和配套指南，帮助读者验证具体工作流，而不是依赖笼统说法。',
    editorialProfile: '编辑团队资料',
  },
};

const BLOG_CATEGORY_ZH: Record<string, string> = {
  AI: 'AI',
  Business: '商业运营',
  Design: '视觉设计',
  Development: '程序开发',
  Productivity: '效率知识',
  Security: '安全防护',
};

function BodyParagraph({ text }: { text: string }) {
  const parts: Array<{ type: 'text' | 'link'; content: string; href?: string }> = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = LINK_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    }
    parts.push({ type: 'link', content: match[1], href: match[2] });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex) });
  }

  if (parts.length === 0) {
    return <p>{text}</p>;
  }

  return (
    <p>
      {parts.map((part, i) =>
        part.type === 'link' && part.href ? (
          <NextLink key={i} href={part.href} className="font-semibold text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200">
            {part.content}
          </NextLink>
        ) : (
          <React.Fragment key={i}>{part.content}</React.Fragment>
        ),
      )}
    </p>
  );
}

function isChineseLocale(locale?: string) {
  return locale?.toLowerCase().startsWith('zh');
}

function localeData(locale?: string): Record<string, unknown> {
  return en as Record<string, unknown>;
}

function readLocaleValue(source: Record<string, unknown>, pathStr: string) {
  return pathStr
    .split('.')
    .reduce<unknown>((current, key) => (current && typeof current === 'object' ? (current as Record<string, unknown>)[key] : undefined), source);
}

function t(pathStr: string, locale?: string) {
  const value = readLocaleValue(localeData(locale), pathStr);
  if (typeof value === 'string') return value;
  return undefined;
}

function ui(locale?: string) {
  if (isChineseLocale(locale)) return UI_TEXT.zh;
  return UI_TEXT.en;
}

function toolName(path: string, locale?: string) {
  const tool = toolByPath(path);
  if (!tool) return path;
  return t(`tools.${tool.id}.name`, locale) || tool.name;
}

function toolDescription(path: string, locale?: string) {
  const tool = toolByPath(path);
  if (!tool) return '';
  return t(`tools.${tool.id}.description`, locale) || tool.description;
}

function blogTitle(slug: string, locale?: string) {
  return t(`blog.posts.${slug}.title`, locale) || slug.replace(/-/g, ' ');
}

function blogSummary(slug: string, locale?: string) {
  return t(`blog.posts.${slug}.summary`, locale) || 'ToolOrbit practical guide.';
}

function blogCategory(category: string | undefined, locale?: string) {
  if (!category) return ui(locale).guideFallback;
  if (isChineseLocale(locale)) return BLOG_CATEGORY_ZH[category] || category;
  return category;
}

function pageString(field: string, page: SeoContentPage, locale?: string) {
  const translated = t(`seoContent.${page.path}.${field}`, locale);
  if (typeof translated === 'string') return translated;
  return (page as Record<string, unknown>)[field] as string;
}

function pageArray(field: string, page: SeoContentPage, locale?: string) {
  const translated = readLocaleValue(localeData(locale), `seoContent.${page.path}.${field}`);
  if (Array.isArray(translated)) return translated as string[];
  return (page as Record<string, unknown>)[field] as string[];
}

function pageTable(page: SeoContentPage, locale?: string) {
  const translated = readLocaleValue(localeData(locale), `seoContent.${page.path}.table`);
  if (Array.isArray(translated)) return translated as Array<{ label: string; bestFor: string; tools: string; note: string }>;
  return page.table;
}

function pageSections(page: SeoContentPage, locale?: string) {
  const translated = readLocaleValue(localeData(locale), `seoContent.${page.path}.sections`);
  if (Array.isArray(translated)) return translated as Array<{ heading: string; body: string[] }>;
  return page.sections;
}

function pageFaqs(page: SeoContentPage, locale?: string) {
  const translated = readLocaleValue(localeData(locale), `seoContent.${page.path}.faqs`);
  if (Array.isArray(translated)) return translated as Array<{ question: string; answer: string }>;
  return page.faqs;
}

export default function SeoContentPageView({ page, locale }: { page: SeoContentPage; locale?: string }) {
  const visibleBlogs = page.blogSlugs.filter((slug) => PUBLISHED_BLOG_POSTS.some((post) => post.slug === slug));
  const visibleToolPaths = page.toolPaths.filter((path) => {
    const tool = toolByPath(path);
    return tool && !tool.isNoIndex;
  });

  const title = pageString('title', page, locale);
  const description = pageString('description', page, locale);
  const eyebrow = pageString('eyebrow', page, locale);
  const audience = pageString('audience', page, locale);
  const targetKeyword = pageString('targetKeyword', page, locale);
  const summary = pageArray('summary', page, locale);
  const table = pageTable(page, locale);
  const sections = pageSections(page, locale);
  const faqs = pageFaqs(page, locale);
  const labels = ui(locale);
  const pageSources = PAGE_SOURCES[page.path] || [];

  return (
    <main className="mx-auto w-full max-w-6xl py-4">
      <article>
        <header className="mb-9 border-b border-slate-200 pb-8 dark:border-slate-800">
          <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-[12px] font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-200">
            <Layers className="h-4 w-4" aria-hidden="true" />
            {eyebrow}
          </div>
          <h1 className="max-w-4xl text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            {title}
          </h1>
          <p className="mt-5 max-w-4xl text-[15px] leading-7 text-slate-600 dark:text-slate-300">{description}</p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-300">
            <span className="inline-flex min-h-9 items-center gap-2 rounded-md border border-slate-200 px-3 dark:border-slate-800">
              <CalendarCheck className="h-4 w-4" aria-hidden="true" />
              {labels.lastReviewed} {page.updated}
            </span>
            <span className="inline-flex min-h-9 items-center rounded-md border border-slate-200 px-3 dark:border-slate-800">
              {labels.target}: {targetKeyword}
            </span>
          </div>
        </header>

        <section className="mb-10 border-b border-slate-200 pb-9 dark:border-slate-800">
          <h2 className="text-xl font-semibold text-slate-950 dark:text-white">{labels.audienceTitle}</h2>
          <p className="mt-3 leading-7 text-slate-700 dark:text-slate-300">{audience}</p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {summary.map((item) => (
              <p key={item} className="border-l-2 border-blue-200 pl-4 leading-7 text-slate-700 dark:border-blue-900 dark:text-slate-300">
                {item}
              </p>
            ))}
          </div>
        </section>

        <section className="mb-12 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 p-5 dark:border-slate-800">
            <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
              {page.type === 'comparison' ? labels.comparisonMatrix : labels.categoryComparison}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-700 dark:bg-slate-950 dark:text-slate-200">
                <tr>
                  <th className="px-5 py-3 font-semibold">{labels.area}</th>
                  <th className="px-5 py-3 font-semibold">{labels.bestFor}</th>
                  <th className="px-5 py-3 font-semibold">{labels.relevantTools}</th>
                  <th className="px-5 py-3 font-semibold">{labels.practicalNote}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {table.map((row) => (
                  <tr key={row.label}>
                    <td className="px-5 py-4 font-semibold text-slate-950 dark:text-white">{row.label}</td>
                    <td className="px-5 py-4 text-slate-700 dark:text-slate-300">{row.bestFor}</td>
                    <td className="px-5 py-4 text-slate-700 dark:text-slate-300">{row.tools}</td>
                    <td className="px-5 py-4 text-slate-700 dark:text-slate-300">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="prose prose-slate max-w-none dark:prose-invert prose-h2:text-2xl prose-h2:tracking-tight prose-p:leading-8 prose-a:text-blue-700">
          {sections.map((section) => (
            <section key={section.heading} className="mb-10">
              <h2>{section.heading}</h2>
              {section.body.map((paragraph) => (
                <BodyParagraph key={paragraph} text={paragraph} />
              ))}
            </section>
          ))}
        </div>

        <section className="mb-12 border-y border-blue-100 bg-blue-50/40 py-6 dark:border-blue-950 dark:bg-blue-950/20">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-600 text-white">
              <Wrench className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-xl font-semibold text-slate-950 dark:text-white">{labels.relatedTools}</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">{labels.relatedToolsDescription}</p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {visibleToolPaths.map((path) => (
              <NextLink
                key={path}
                href={path}
                className="group flex min-h-24 flex-col justify-between rounded-md border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-blue-300 hover:bg-blue-50/20 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700 dark:hover:bg-blue-950/20"
              >
                <span className="font-semibold text-slate-950 group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-300">
                  {toolName(path, locale)}
                </span>
                <span className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{toolDescription(path, locale)}</span>
              </NextLink>
            ))}
          </div>
        </section>

        {visibleBlogs.length > 0 ? (
          <section className="mb-12">
            <h2 className="mb-5 text-xl font-semibold text-slate-950 dark:text-white">{labels.relatedGuides}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {visibleBlogs.map((slug) => {
                const blog = blogBySlug(slug);
                return (
                  <NextLink
                    key={slug}
                    href={`/blog/${slug}`}
                    className="group rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-blue-300 hover:bg-blue-50/20 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700 dark:hover:bg-blue-950/20"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">
                      {blogCategory(blog?.category, locale)}
                    </span>
                    <h3 className="mt-2 text-lg font-semibold text-slate-950 group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-300">
                      {blogTitle(slug, locale)}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{blogSummary(slug, locale)}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 dark:text-blue-300">
                      {labels.readGuide} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </NextLink>
                );
              })}
            </div>
          </section>
        ) : null}

        <section className="mb-12">
          <h2 className="mb-5 text-xl font-semibold text-slate-950 dark:text-white">{labels.faq}</h2>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <details key={faq.question} className="border-b border-slate-200 py-4 dark:border-slate-800">
                <summary className="cursor-pointer text-base font-semibold text-slate-950 dark:text-white">{faq.question}</summary>
                <p className="mt-3 leading-7 text-slate-700 dark:text-slate-300">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <footer className="border-t border-slate-200 pt-5 text-sm leading-6 text-slate-600 dark:border-slate-800 dark:text-slate-300">
          <p className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" aria-hidden="true" />
            {labels.maintained}
          </p>
          <NextLink href="/authors/toolorbit-editorial-team" className="mt-3 inline-flex items-center gap-2 font-semibold text-blue-700 dark:text-blue-300">
            {labels.editorialProfile} <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </NextLink>
          {pageSources.length ? (
            <div className="mt-5 border-t border-slate-200 pt-4 dark:border-slate-800">
              <p className="font-semibold text-slate-950 dark:text-white">
                {isChineseLocale(locale) ? '来源与核验' : 'Sources and verification'}
              </p>
              <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
                {pageSources.map((source) => (
                  <li key={source.url}>
                    <a href={source.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200">
                      {source.label} <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </footer>
      </article>
    </main>
  );
}
