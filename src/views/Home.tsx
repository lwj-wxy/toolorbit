'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  Clock,
  Search,
} from 'lucide-react';
import { CATEGORY_GUIDES } from '../data/categoryGuides';
import { Category, ToolItem, TOOLS } from '../data/tools';
import { useRecentTools } from '../hooks/useRecentTools';
import { getCategoryPath } from '../lib/category-paths';
import { Link, useClientSearchParamsWithInitialSearch } from '../lib/navigation';
import { getToolCoverPath, hasGeneratedToolCover } from '../lib/tool-covers';
import { cn } from '../lib/utils';

const HOME_CATEGORY_PREVIEW_LIMIT = 6;

const categoryStyles: Record<string, { badge: string; icon: string; line: string; cover: string }> = {
  'AI 工具': { badge: 'bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-950/30 dark:text-sky-300 dark:ring-sky-900', icon: 'text-sky-700 bg-sky-50 dark:bg-sky-950/40 dark:text-sky-300', line: 'bg-sky-500', cover: 'from-sky-50 via-cyan-50 to-white text-sky-700 dark:from-sky-950/50 dark:via-cyan-950/30 dark:to-slate-900 dark:text-sky-200' },
  '开发者工具': { badge: 'bg-cyan-50 text-cyan-700 ring-cyan-200 dark:bg-cyan-950/30 dark:text-cyan-300 dark:ring-cyan-900', icon: 'text-cyan-700 bg-cyan-50 dark:bg-cyan-950/40 dark:text-cyan-300', line: 'bg-cyan-500', cover: 'from-cyan-50 via-white to-emerald-50 text-cyan-700 dark:from-cyan-950/50 dark:via-slate-900 dark:to-emerald-950/30 dark:text-cyan-200' },
  '站长工具': { badge: 'bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:ring-blue-900', icon: 'text-blue-700 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-300', line: 'bg-blue-500', cover: 'from-blue-50 via-white to-cyan-50 text-blue-700 dark:from-blue-950/50 dark:via-slate-900 dark:to-cyan-950/30 dark:text-blue-200' },
  '文本排版': { badge: 'bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-950/30 dark:text-violet-300 dark:ring-violet-900', icon: 'text-violet-700 bg-violet-50 dark:bg-violet-950/40 dark:text-violet-300', line: 'bg-violet-500', cover: 'from-violet-50 via-white to-cyan-50 text-violet-700 dark:from-violet-950/50 dark:via-slate-900 dark:to-cyan-950/30 dark:text-violet-200' },
  '生成器': { badge: 'bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-200 dark:bg-fuchsia-950/30 dark:text-fuchsia-300 dark:ring-fuchsia-900', icon: 'text-fuchsia-700 bg-fuchsia-50 dark:bg-fuchsia-950/40 dark:text-fuchsia-300', line: 'bg-fuchsia-500', cover: 'from-fuchsia-50 via-white to-sky-50 text-fuchsia-700 dark:from-fuchsia-950/50 dark:via-slate-900 dark:to-sky-950/30 dark:text-fuchsia-200' },
  '电商工具': { badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:ring-emerald-900', icon: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300', line: 'bg-emerald-500', cover: 'from-emerald-50 via-white to-cyan-50 text-emerald-700 dark:from-emerald-950/50 dark:via-slate-900 dark:to-cyan-950/30 dark:text-emerald-200' },
  'PDF工具': { badge: 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-950/30 dark:text-rose-300 dark:ring-rose-900', icon: 'text-rose-700 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-300', line: 'bg-rose-500', cover: 'from-rose-50 via-white to-cyan-50 text-rose-700 dark:from-rose-950/50 dark:via-slate-900 dark:to-cyan-950/30 dark:text-rose-200' },
  '图片处理': { badge: 'bg-pink-50 text-pink-700 ring-pink-200 dark:bg-pink-950/30 dark:text-pink-300 dark:ring-pink-900', icon: 'text-pink-700 bg-pink-50 dark:bg-pink-950/40 dark:text-pink-300', line: 'bg-pink-500', cover: 'from-pink-50 via-white to-cyan-50 text-pink-700 dark:from-pink-950/50 dark:via-slate-900 dark:to-cyan-950/30 dark:text-pink-200' },
  '计算转换': { badge: 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:ring-amber-900', icon: 'text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300', line: 'bg-amber-500', cover: 'from-amber-50 via-white to-cyan-50 text-amber-700 dark:from-amber-950/50 dark:via-slate-900 dark:to-cyan-950/30 dark:text-amber-200' },
  '实用工具': { badge: 'bg-teal-50 text-teal-700 ring-teal-200 dark:bg-teal-950/30 dark:text-teal-300 dark:ring-teal-900', icon: 'text-teal-700 bg-teal-50 dark:bg-teal-950/40 dark:text-teal-300', line: 'bg-teal-500', cover: 'from-teal-50 via-white to-cyan-50 text-teal-700 dark:from-teal-950/50 dark:via-slate-900 dark:to-cyan-950/30 dark:text-teal-200' },
  default: { badge: 'bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800', icon: 'text-slate-600 bg-slate-100 dark:bg-slate-900 dark:text-slate-300', line: 'bg-slate-500', cover: 'from-slate-100 via-white to-cyan-50 text-slate-700 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 dark:text-slate-200' },
};

function getCategoryStyles(category: Category) {
  return categoryStyles[category] || categoryStyles.default;
}

function ToolCover({ tool }: { tool: ToolItem }) {
  const { t } = useTranslation();
  const Icon = tool.icon;
  const styles = getCategoryStyles(tool.category);

  if (!hasGeneratedToolCover(tool.id)) {
    return (
      <div className={cn('relative flex aspect-[16/10] overflow-hidden rounded-t-lg border-b border-white/70 bg-gradient-to-br p-3 shadow-inner dark:border-white/10', styles.cover)}>
        <div className="absolute inset-x-0 top-0 h-px bg-white/80 dark:bg-white/10" />
        <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/60 blur-2xl dark:bg-white/10" />
        <div className="relative flex h-full w-full flex-col justify-between">
          <span className="inline-flex w-fit items-center rounded-full bg-white/80 px-2 py-1 text-[11px] font-semibold text-slate-600 shadow-sm dark:bg-slate-950/50 dark:text-slate-300">
            {t(`common.categories.${tool.category}`)}
          </span>
          <div className="flex items-end justify-between gap-3">
            <span className="min-w-0 text-[13px] font-semibold leading-5 text-slate-900 dark:text-white">
              {t(`tools.${tool.id}.name`, { defaultValue: tool.name })}
            </span>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/90 shadow-sm dark:bg-slate-950/70">
              <Icon size={20} strokeWidth={2.2} />
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-t-lg border-b border-slate-100 bg-slate-50 dark:border-white/10 dark:bg-slate-900">
      <img
        src={getToolCoverPath(tool.id)}
        alt={t(`tools.${tool.id}.name`, { defaultValue: tool.name })}
        className="block h-full w-full origin-bottom scale-[1.14] object-cover"
        loading="lazy"
      />
    </div>
  );
}

function ToolCard({
  tool,
}: {
  tool: ToolItem;
}) {
  const { t } = useTranslation();
  const Icon = tool.icon;
  const styles = getCategoryStyles(tool.category);

  return (
    <article className="group relative h-full overflow-hidden rounded-lg border border-slate-200/90 bg-white shadow-sm transition-colors duration-200 hover:border-cyan-300 hover:bg-cyan-50/20 dark:border-slate-800 dark:bg-[#282c34] dark:hover:border-cyan-700 dark:hover:bg-cyan-950/10">
      <Link to={tool.path} className="flex h-full min-h-[232px] flex-col">
        <ToolCover tool={tool} />
        <div className="flex flex-1 flex-col p-3 pt-4">
          <div className="flex items-start gap-2">
            <span className={cn('mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md', styles.icon)}>
              <Icon size={17} strokeWidth={2.2} />
            </span>
            <div className="min-w-0">
              <h3 className="line-clamp-1 text-[15px] font-semibold tracking-normal text-slate-950 transition-colors group-hover:text-cyan-700 dark:text-white dark:group-hover:text-cyan-300">
                {t(`tools.${tool.id}.name`, { defaultValue: tool.name })}
              </h3>
              <p className="mt-1.5 line-clamp-2 text-[13px] leading-5 text-slate-600 dark:text-slate-400">
                {t(`tools.${tool.id}.description`, { defaultValue: tool.description })}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

type HomeProps = {
  initialSearch?: string;
  initialCategory?: Category;
};

export default function Home({ initialSearch = '', initialCategory }: HomeProps) {
  const { t, i18n } = useTranslation();
  const [searchParams] = useClientSearchParamsWithInitialSearch(initialSearch);
  const { recentTools } = useRecentTools();
  const [homeSearch, setHomeSearch] = useState('');
  const categoryFilter = initialCategory || (searchParams.get('category') as Category | null);
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';
  const isZh = i18n.language?.startsWith('zh');
  const visibleTools = useMemo(() => TOOLS.filter((tool) => !tool.isNoIndex), []);
  const categoryGuide = categoryFilter ? CATEGORY_GUIDES[categoryFilter]?.[isZh ? 'zh' : 'en'] : null;

  const filteredTools = useMemo(() => {
    let result = visibleTools;

    if (categoryFilter) {
      result = result.filter((tool) => tool.category === categoryFilter);
    }

    if (searchQuery) {
      result = result.filter((tool) => {
        const name = t(`tools.${tool.id}.name`, { defaultValue: tool.name }).toLowerCase();
        const description = t(`tools.${tool.id}.description`, { defaultValue: tool.description }).toLowerCase();
        return name.includes(searchQuery) || description.includes(searchQuery);
      });
    }

    return result;
  }, [categoryFilter, searchQuery, t, visibleTools]);

  const categoriesOrder = Array.from(new Set(visibleTools.map((tool) => tool.category)));
  const normalizedHomeSearch = homeSearch.trim().toLowerCase();
  const homeFilteredTools = useMemo(() => {
    return visibleTools.filter((tool) => {
      if (!normalizedHomeSearch) return true;

      const haystack = [
        tool.id,
        tool.path,
        tool.name,
        tool.description,
        tool.category,
        t(`tools.${tool.id}.name`, { defaultValue: tool.name }),
        t(`tools.${tool.id}.description`, { defaultValue: tool.description }),
        t(`common.categories.${tool.category}`),
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalizedHomeSearch);
    });
  }, [normalizedHomeSearch, t, visibleTools]);
  const homeGroupedTools = useMemo(
    () =>
      homeFilteredTools.reduce((acc, tool) => {
        if (!acc[tool.category]) acc[tool.category] = [];
        acc[tool.category].push(tool);
        return acc;
      }, {} as Record<Category, ToolItem[]>),
    [homeFilteredTools],
  );
  const homeCategories = categoriesOrder.filter((category) => homeGroupedTools[category]?.length);

  const handleHomeSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  if (categoryFilter || searchQuery) {
    return (
      <div className="flex flex-col gap-8">
        <header className="border-b border-slate-200 pb-7 dark:border-slate-800">
          {!categoryFilter ? (
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">
              {t('search.results', { query: searchQuery })}
            </p>
          ) : null}
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            {categoryFilter ? t(`common.categories.${categoryFilter}`) : t('search.results', { query: searchQuery })}
          </h1>

          {categoryGuide ? (
            <div className="mt-5 max-w-5xl text-sm leading-6 text-slate-600 dark:text-slate-400">
              <p>{categoryGuide.intro}</p>
              {categoryGuide.relatedPages && categoryGuide.relatedPages.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {categoryGuide.relatedPages.map((page) => (
                    <Link
                      key={page.href}
                      to={page.href}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-[13px] font-medium text-blue-700 transition-colors hover:border-blue-300 hover:bg-blue-100 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-300 dark:hover:border-blue-800 dark:hover:bg-blue-950/50"
                    >
                      {page.label}
                      <ArrowRight size={14} />
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </header>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-300 py-20 text-center dark:border-slate-700">
            <Clock className="mx-auto h-8 w-8 text-slate-400" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">{t('search.noResults')}</h3>
            <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-500 dark:text-slate-400">
              {t('search.noResultsSub')}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-9 pb-12">
      <section className="bg-[radial-gradient(circle_at_50%_0%,rgba(230,247,255,0.34)_0%,rgba(244,248,251,0.66)_46%,rgba(244,248,251,0)_82%)] px-4 py-10 text-center dark:bg-[radial-gradient(circle_at_50%_0%,rgba(65,131,196,0.08)_0%,rgba(54,54,54,0.48)_48%,rgba(54,54,54,0)_82%)] sm:px-6 sm:py-12">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">
            {isZh ? '浏览器本地优先工具箱' : 'Local-first browser tools'}
          </p>
          <h1 className="mx-auto max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            {isZh ? '您所需的所有工具，节省一整天时间' : 'All the tools you need, without leaving the browser'}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-slate-600 dark:text-slate-400">
            {isZh
              ? '搜索开发、PDF、图片、文本、AI 与电商工具。大多数处理直接在本机浏览器完成。'
              : 'Search developer, PDF, image, text, AI, and ecommerce utilities. Most processing happens on your device.'}
          </p>

          <form
            onSubmit={handleHomeSearch}
            className="hero-search-form mx-auto mt-7 flex max-w-2xl overflow-hidden rounded-lg border border-slate-200/80 bg-white transition-colors duration-200 focus-within:border-cyan-600 focus-within:ring-2 focus-within:ring-cyan-600/12 dark:border-slate-700 dark:bg-[#282c34] dark:focus-within:border-cyan-500"
          >
            <div className="flex min-w-0 flex-1 items-center gap-3 px-4">
              <Search className="h-4 w-4 shrink-0 text-cyan-600 dark:text-cyan-300" aria-hidden="true" />
              <input
                name="search"
                type="search"
                className="h-13 min-w-0 flex-1 border-0 bg-transparent text-sm text-slate-950 outline-none placeholder:text-slate-400 dark:text-white"
                placeholder={isZh ? '你想要搜索什么？' : 'What do you want to search for?'}
                value={homeSearch}
                onChange={(event) => setHomeSearch(event.target.value)}
              />
            </div>
            <button className="border-l border-slate-200 bg-cyan-700 px-5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-cyan-800 dark:border-slate-700 dark:bg-[#4183c4] dark:hover:bg-[#4f93d5]">
              {isZh ? '搜索' : 'Search'}
            </button>
          </form>
        </div>
      </section>

      {recentTools.length > 0 && !normalizedHomeSearch && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-slate-950 dark:text-white">
            {isZh ? '常用工具' : t('common.recent_tools') || 'Recent tools'}
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {recentTools.slice(0, 4).map((tool) => (
              <ToolCard key={`recent-${tool.id}`} tool={tool} />
            ))}
          </div>
        </section>
      )}

      <div className="space-y-10">
        {homeCategories.map((category) => {
          const toolsInCategory = homeGroupedTools[category];
          if (!toolsInCategory?.length) return null;

          const styles = getCategoryStyles(category);
          const previewTools = normalizedHomeSearch
            ? toolsInCategory
            : toolsInCategory.slice(0, HOME_CATEGORY_PREVIEW_LIMIT);
          const remainingCount = toolsInCategory.length - previewTools.length;

          return (
            <section key={category} className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <Link
                  to={getCategoryPath(category)}
                  className={cn('inline-flex rounded-full px-2.5 py-1 text-[12px] font-semibold ring-1 transition-colors', styles.badge)}
                >
                  {t(`common.categories.${category}`)}
                </Link>
                {remainingCount > 0 && (
                  <Link
                    to={getCategoryPath(category)}
                    className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-cyan-700 transition-colors hover:text-cyan-800 dark:text-cyan-300 dark:hover:text-cyan-200"
                  >
                    {t('common.viewMore')}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {previewTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </section>
          );
        })}

        {homeFilteredTools.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white/60 py-20 text-center dark:border-slate-700 dark:bg-[#282c34]/60">
            <Clock className="mx-auto h-8 w-8 text-slate-400" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">{t('search.noResults')}</h3>
            <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-500 dark:text-slate-400">
              {t('search.noResultsSub')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
