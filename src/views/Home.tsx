'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import {
  ArrowRight,
  Clock,
  Search,
  Star,
} from 'lucide-react';
import { CATEGORY_GUIDES } from '../data/categoryGuides';
import { Category, ToolItem, TOOLS } from '../data/tools';
import { useRecentTools } from '../hooks/useRecentTools';
import { getCategoryPath } from '../lib/category-paths';
import { localizedPath } from '../lib/i18n-routing';
import { Link, useClientSearchParamsWithInitialSearch } from '../lib/navigation';
import { cn } from '../lib/utils';

const HOME_CATEGORY_PREVIEW_LIMIT = 6;

const categoryStyles: Record<string, { badge: string; icon: string; line: string }> = {
  '开发者工具': { badge: 'bg-cyan-50 text-cyan-700 ring-cyan-200 dark:bg-cyan-950/30 dark:text-cyan-300 dark:ring-cyan-900', icon: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-950/40 dark:text-cyan-300', line: 'bg-cyan-500' },
  '站长工具': { badge: 'bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:ring-blue-900', icon: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-300', line: 'bg-blue-500' },
  '文本排版': { badge: 'bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-950/30 dark:text-violet-300 dark:ring-violet-900', icon: 'text-violet-600 bg-violet-50 dark:bg-violet-950/40 dark:text-violet-300', line: 'bg-violet-500' },
  '生成器': { badge: 'bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-200 dark:bg-fuchsia-950/30 dark:text-fuchsia-300 dark:ring-fuchsia-900', icon: 'text-fuchsia-600 bg-fuchsia-50 dark:bg-fuchsia-950/40 dark:text-fuchsia-300', line: 'bg-fuchsia-500' },
  '电商工具': { badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:ring-emerald-900', icon: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300', line: 'bg-emerald-500' },
  'PDF工具': { badge: 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-950/30 dark:text-rose-300 dark:ring-rose-900', icon: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-300', line: 'bg-rose-500' },
  '图片处理': { badge: 'bg-pink-50 text-pink-700 ring-pink-200 dark:bg-pink-950/30 dark:text-pink-300 dark:ring-pink-900', icon: 'text-pink-600 bg-pink-50 dark:bg-pink-950/40 dark:text-pink-300', line: 'bg-pink-500' },
  '计算转换': { badge: 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:ring-amber-900', icon: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300', line: 'bg-amber-500' },
  default: { badge: 'bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800', icon: 'text-slate-600 bg-slate-100 dark:bg-slate-900 dark:text-slate-300', line: 'bg-slate-500' },
};

function getCategoryStyles(category: Category) {
  return categoryStyles[category] || categoryStyles.default;
}

function ToolCard({
  tool,
  isPinned,
  togglePin,
}: {
  tool: ToolItem;
  isPinned: boolean;
  togglePin: (event: React.MouseEvent, id: string) => void;
}) {
  const { t } = useTranslation();
  const Icon = tool.icon;
  const styles = getCategoryStyles(tool.category);

  return (
    <Link
      to={tool.path}
      className="group flex h-full min-h-[104px] flex-col rounded-xl border border-slate-200/80 bg-white/90 p-4 shadow-sm transition-colors duration-200 hover:border-violet-200 hover:bg-violet-50/30 dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-violet-800 dark:hover:bg-violet-950/20"
    >
      <div className="flex gap-3">
        <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-md', styles.icon)}>
          <Icon size={18} strokeWidth={2.2} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="line-clamp-1 text-[15px] font-semibold tracking-normal text-slate-950 transition-colors group-hover:text-violet-700 dark:text-white dark:group-hover:text-violet-300">
              {t(`tools.${tool.id}.name`, { defaultValue: tool.name })}
            </h3>
            <button
              type="button"
              aria-label={isPinned ? t('common.unpinned') || 'Unpin tool' : t('common.pinned') || 'Pin tool'}
              onClick={(event) => togglePin(event, tool.id)}
              className={cn(
                'rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-amber-500 dark:text-slate-600 dark:hover:bg-slate-800',
                isPinned && 'bg-amber-50 text-amber-500 dark:bg-amber-950/30 dark:text-amber-300',
              )}
            >
              <Star size={15} fill={isPinned ? 'currentColor' : 'none'} />
            </button>
          </div>
          <p className="mt-1.5 line-clamp-1 text-[13px] leading-5 text-slate-600 dark:text-slate-400">
            {t(`tools.${tool.id}.description`, { defaultValue: tool.description })}
          </p>
          <span className="mt-3 inline-flex items-center gap-1 text-[12px] font-medium text-slate-500 transition-colors group-hover:text-violet-700 dark:text-slate-500 dark:group-hover:text-violet-300">
            {t(`common.categories.${tool.category}`)}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}

type HomeProps = {
  initialSearch?: string;
  initialCategory?: Category;
};

export default function Home({ initialSearch = '', initialCategory }: HomeProps) {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [searchParams] = useClientSearchParamsWithInitialSearch(initialSearch);
  const { recentTools } = useRecentTools();
  const [pinnedTools, setPinnedTools] = useState<string[]>([]);
  const categoryFilter = initialCategory || (searchParams.get('category') as Category | null);
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';
  const isZh = i18n.language?.startsWith('zh');
  const visibleTools = useMemo(() => TOOLS.filter((tool) => !tool.isNoIndex), []);
  const categoryGuide = categoryFilter ? CATEGORY_GUIDES[categoryFilter]?.[isZh ? 'zh' : 'en'] : null;

  useEffect(() => {
    try {
      setPinnedTools(JSON.parse(localStorage.getItem('toolorbit_pinned_tools') || '[]'));
    } catch {
      setPinnedTools([]);
    }
  }, []);

  const togglePin = (event: React.MouseEvent, toolId: string) => {
    event.preventDefault();
    event.stopPropagation();

    const isAlreadyPinned = pinnedTools.includes(toolId);
    const nextPinnedTools = isAlreadyPinned
      ? pinnedTools.filter((id) => id !== toolId)
      : [...pinnedTools, toolId];

    setPinnedTools(nextPinnedTools);
    localStorage.setItem('toolorbit_pinned_tools', JSON.stringify(nextPinnedTools));
    toast.success(isAlreadyPinned ? t('common.unpinned') || 'Tool unpinned' : t('common.pinned') || 'Tool pinned', {
      id: `pin-${toolId}`,
    });
  };

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

  const groupedTools = useMemo(
    () =>
      visibleTools.reduce((acc, tool) => {
        if (!acc[tool.category]) acc[tool.category] = [];
        acc[tool.category].push(tool);
        return acc;
      }, {} as Record<Category, ToolItem[]>),
    [visibleTools],
  );
  const categoriesOrder = Array.from(new Set(visibleTools.map((tool) => tool.category)));
  const pinnedToolObjects = pinnedTools
    .map((id) => visibleTools.find((tool) => tool.id === id))
    .filter(Boolean) as ToolItem[];
  const heroTools = ['json-formatter', 'pdf-to-image', 'image-compressor', 'ai-text-polisher']
    .map((id) => visibleTools.find((tool) => tool.id === id))
    .filter(Boolean) as ToolItem[];
  const featuredCategories = categoriesOrder.slice(0, 8);

  const handleHomeSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = String(formData.get('search') || '').trim();
    const params = new URLSearchParams();
    if (query) params.set('search', query);
    const nextPath = localizedPath('/', isZh ? 'zh-CN' : 'en');
    const nextSearch = params.size ? `?${params.toString()}` : '';

    router.push(`${nextPath}${nextSearch}`);
    window.dispatchEvent(new CustomEvent('toolorbit:searchchange', { detail: nextSearch }));
  };

  if (categoryFilter || searchQuery) {
    return (
      <div className="flex flex-col gap-8">
        <header className="border-b border-slate-200 pb-7 dark:border-slate-800">
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">
            {categoryFilter ? t('common.navTools') : t('search.results', { query: searchQuery })}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            {categoryFilter ? t(`common.categories.${categoryFilter}`) : t('search.results', { query: searchQuery })}
          </h1>

          {categoryGuide ? (
            <div className="mt-5 max-w-5xl text-sm leading-6 text-slate-600 dark:text-slate-400">
              <p>{categoryGuide.intro}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {categoryGuide.workflows.map((workflow) => (
                  <p key={workflow} className="border-l-2 border-blue-200 pl-3 text-[13px] leading-5 dark:border-blue-900">
                    {workflow}
                  </p>
                ))}
              </div>
            </div>
          ) : null}
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} isPinned={pinnedTools.includes(tool.id)} togglePin={togglePin} />
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
      <section className="rounded-2xl border border-violet-100/70 bg-[radial-gradient(circle_at_50%_0%,#f5f0ff_0%,#f8fbff_44%,rgba(255,255,255,0)_78%)] px-4 py-10 text-center dark:border-violet-950/50 dark:bg-[radial-gradient(circle_at_50%_0%,rgba(91,33,182,0.22)_0%,rgba(15,23,42,0.28)_48%,rgba(15,23,42,0)_78%)] sm:px-6 sm:py-12">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-300">
            {t('common.hero_badge', { defaultValue: 'Browser utility workspace' })}
          </p>
          <h1 className="mx-auto max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            {t('common.hero_title', { defaultValue: 'Fast, focused tools for everyday work' })}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-slate-600 dark:text-slate-400">
            {t('common.hero_subtitle', {
              defaultValue: 'Open lightweight developer, PDF, image, AI, text, and ecommerce tools without leaving the browser.',
            })}
          </p>

          <form onSubmit={handleHomeSearch} className="mx-auto mt-7 flex max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex min-w-0 flex-1 items-center gap-3 px-4">
              <Search className="h-4 w-4 shrink-0 text-violet-500" aria-hidden="true" />
              <input
                name="search"
                type="search"
                className="h-13 min-w-0 flex-1 border-0 bg-transparent text-sm text-slate-950 outline-none placeholder:text-slate-400 dark:text-white"
                placeholder={t('common.searchPlaceholder', { defaultValue: isZh ? '搜索工具...' : 'Search tools...' })}
                defaultValue={searchQuery}
              />
            </div>
            <button className="border-l border-slate-200 bg-violet-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-violet-700 dark:border-slate-800 dark:bg-violet-500 dark:hover:bg-violet-400">
              {isZh ? '搜索' : 'Search'}
            </button>
          </form>

          <div className="mx-auto mt-5 flex max-w-4xl flex-wrap justify-center gap-2">
            {featuredCategories.map((category) => (
              <Link
                key={category}
                to={getCategoryPath(category)}
                className="rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-[13px] font-medium text-slate-700 transition-colors hover:border-violet-300 hover:text-violet-700 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:border-violet-700 dark:hover:text-violet-300"
              >
                {t(`common.categories.${category}`)}
              </Link>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-7 grid max-w-5xl gap-3 text-left sm:grid-cols-2 lg:grid-cols-4">
            {heroTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.id}
                  to={tool.path}
                className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white/90 p-3 shadow-sm transition-colors hover:border-violet-200 hover:bg-violet-50/30 dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-violet-800"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-semibold text-slate-900 group-hover:text-violet-700 dark:text-slate-100 dark:group-hover:text-violet-300">
                      {t(`tools.${tool.id}.name`, { defaultValue: tool.name })}
                    </span>
                    <span className="block truncate text-[12px] text-slate-500 dark:text-slate-500">
                      {t(`common.categories.${tool.category}`)}
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-slate-300 transition-colors group-hover:text-violet-500" aria-hidden="true" />
                </Link>
              );
            })}
        </div>
      </section>

      {(pinnedToolObjects.length > 0 || recentTools.length > 0) && (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {pinnedToolObjects.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-semibold tracking-tight text-slate-950 dark:text-white">
                {t('common.pinned_tools') || 'Pinned tools'}
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {pinnedToolObjects.slice(0, 4).map((tool) => (
                  <ToolCard key={`pinned-${tool.id}`} tool={tool} isPinned togglePin={togglePin} />
                ))}
              </div>
            </section>
          )}

          {recentTools.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-semibold tracking-tight text-slate-950 dark:text-white">
                {t('common.recent_tools') || 'Recent tools'}
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {recentTools.slice(0, 4).map((tool) => (
                  <ToolCard key={`recent-${tool.id}`} tool={tool} isPinned={pinnedTools.includes(tool.id)} togglePin={togglePin} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      <div className="space-y-10">
        <div className="flex items-end justify-between gap-4 border-b border-slate-200 pb-3 dark:border-slate-800">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-300">
              {isZh ? '工具探索' : 'Explore tools'}
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
              {isZh ? '按场景查找工具' : 'Browse by workflow'}
            </h2>
          </div>
        </div>

        {categoriesOrder.map((category) => {
          const toolsInCategory = groupedTools[category];
          if (!toolsInCategory?.length) return null;

          const styles = getCategoryStyles(category);
          const previewTools = toolsInCategory.slice(0, HOME_CATEGORY_PREVIEW_LIMIT);
          const remainingCount = toolsInCategory.length - previewTools.length;

          return (
            <section key={category} className="space-y-4">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <Link
                    to={getCategoryPath(category)}
                    className={cn('inline-flex rounded-full px-2.5 py-1 text-[12px] font-semibold ring-1 transition-colors', styles.badge)}
                  >
                    {t(`common.categories.${category}`)}
                  </Link>
                  <p className="mt-2 text-[13px] text-slate-500 dark:text-slate-400">
                    {isZh ? `${toolsInCategory.length} 个工具` : `${toolsInCategory.length} tools`}
                  </p>
                </div>
                {remainingCount > 0 && (
                  <Link
                    to={getCategoryPath(category)}
                    className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-violet-700 transition-colors hover:text-violet-800 dark:text-violet-300 dark:hover:text-violet-200"
                  >
                    {t('common.viewMore')}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {previewTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} isPinned={pinnedTools.includes(tool.id)} togglePin={togglePin} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
