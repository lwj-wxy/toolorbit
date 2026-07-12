import NextLink from 'next/link';
import type { CSSProperties } from 'react';
import { ArrowRight, Boxes } from 'lucide-react';
import { TOOLS, type Category } from '../data/tools';
import en from '../locales/en.json';
import { readPath, SITE_NAME } from '../lib/metadata';

type AllToolsPageProps = {
  category?: Category;
};

const twoLineDescriptionStyle: CSSProperties = {
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
  overflow: 'hidden',
  minHeight: '2.5rem',
  maxHeight: '2.5rem',
};
const CATEGORY_SLUGS: Partial<Record<Category, string>> = {
  'AI 工具': 'ai',
  '电商工具': 'ecommerce',
};
const CATEGORY_ORDER = Object.keys(CATEGORY_SLUGS) as Category[];

function cleanToolTitle(value: string) {
  return value.replace(` | ${SITE_NAME}`, '').trim();
}

function toolName(tool: (typeof TOOLS)[number]) {
  const source = en;
  return cleanToolTitle(readPath(source, `tools.${tool.id}.name`) || readPath(source, `tools.${tool.id}.seoTitle`) || tool.name);
}

function toolDescription(tool: (typeof TOOLS)[number]) {
  const source = en;
  return readPath(source, `tools.${tool.id}.description`) || readPath(source, `tools.${tool.id}.seoDesc`) || tool.description;
}

function categoryName(category: Category) {
  return readPath(en, `common.categories.${category}`) || category;
}

export default function AllToolsPage({ category }: AllToolsPageProps) {
  const visibleTools = TOOLS.filter((tool) => !tool.isNoIndex && (!category || tool.category === category));
  const totalTools = visibleTools.length;
  const visibleCategories = CATEGORY_ORDER.filter((category) =>
    visibleTools.some((tool) => tool.category === category),
  );

  return (
    <main className="mx-auto w-full max-w-[1240px] py-4">
      <section className="mb-10 border-b-2 border-[var(--app-text)] pb-9">
        <div className="mb-5 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--app-accent-ink)]">
          <Boxes className="h-4 w-4" aria-hidden="true" />
          Seller tool directory
        </div>
        <h1 className="max-w-3xl text-4xl font-black tracking-[-0.04em] text-[var(--app-text)] sm:text-6xl">
          Check the work before you publish
        </h1>
        <p className="mt-5 max-w-2xl text-[15px] leading-7 text-[var(--app-muted)] dark:text-[var(--app-muted)]">
          {totalTools} focused tools for Etsy listing copy, fee breakdowns, pricing, ads, keywords, product assets, and cross-border details. Each tool has one clear job.
        </p>
      </section>

      <nav aria-label="Tool category anchors" className="mb-10">
        <ul className="flex flex-wrap gap-2">
          {visibleCategories.map((category) => (
            <li key={category}>
              <a
                href={`#${CATEGORY_SLUGS[category]}`}
                className="inline-flex min-h-10 items-center border-b border-[var(--app-border)] px-1 text-[13px] font-semibold text-[var(--app-muted)] transition-colors hover:border-[var(--app-accent)] hover:text-[var(--app-accent-ink)]"
              >
                {categoryName(category)}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="space-y-12">
        {visibleCategories.map((category) => {
          const tools = visibleTools.filter((tool) => tool.category === category);
          const categoryPath = `/tools/${CATEGORY_SLUGS[category]}`;

          return (
            <section key={category} id={CATEGORY_SLUGS[category]} className="scroll-mt-24">
              <div className="mb-4 flex flex-col gap-3 border-b border-[var(--app-border)] pb-4 dark:border-[var(--app-border)] sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-2xl font-black tracking-[-0.03em] text-[var(--app-text)] dark:text-[var(--app-text)]">
                    {categoryName(category)}
                  </h2>
                  <p className="mt-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--app-muted)]">
                    {tools.length} tools
                  </p>
                </div>
                <NextLink
                  href={categoryPath}
                  className="inline-flex min-h-10 items-center gap-2 text-[13px] font-semibold text-[var(--app-accent-ink)] transition hover:text-[var(--app-accent-strong)] dark:text-[var(--app-accent-ink)] dark:hover:text-[var(--app-accent-strong)]"
                >
                  View category
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </NextLink>
              </div>

              <ul className="grid gap-x-6 gap-y-0 sm:grid-cols-2 lg:grid-cols-3">
                {tools.map((tool) => {
                  const Icon = tool.icon;

                  return (
                    <li key={tool.id}>
                      <NextLink
                        href={tool.path}
                        className="group flex min-h-[122px] overflow-hidden border-b border-[var(--app-border)] bg-transparent py-5 transition-colors hover:bg-[color-mix(in_srgb,var(--app-accent-soft)_34%,transparent)] dark:border-[var(--app-border)]"
                      >
                        <span className="flex min-w-0 items-start gap-3">
                          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center bg-[var(--app-accent-soft)] text-[var(--app-accent-ink)] transition-colors group-hover:bg-[color-mix(in_srgb,var(--app-accent)_18%,var(--app-surface))] dark:bg-[var(--app-accent-soft)] dark:text-[var(--app-accent-ink)]">
                            <Icon className="h-5 w-5" aria-hidden="true" />
                          </span>
                          <span className="min-w-0">
                            <span className="line-clamp-1 text-[15px] font-semibold text-[var(--app-text)] transition-colors group-hover:text-[var(--app-accent-ink)] dark:text-[var(--app-text)]">
                              {toolName(tool)}
                            </span>
                            <span
                              className="mt-2 block text-[13px] leading-5 text-[var(--app-muted)] dark:text-[var(--app-muted)]"
                              style={twoLineDescriptionStyle}
                            >
                              {toolDescription(tool)}
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
