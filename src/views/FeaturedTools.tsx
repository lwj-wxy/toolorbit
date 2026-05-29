'use client';

import { ChevronRight, ExternalLink, Search } from 'lucide-react';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FEATURED_CATEGORIES,
  FEATURED_TOOLS,
  type FeaturedCategoryId,
} from '../data/featured-tools';
import { Link } from '../lib/navigation';
import { cn } from '../lib/utils';

const ALL_CATEGORY_ID = '__all__';

export default function FeaturedTools() {
  const { i18n } = useTranslation();
  const isZh = i18n.language?.startsWith('zh');
  const [activeCategory, setActiveCategory] = useState<FeaturedCategoryId | typeof ALL_CATEGORY_ID>(ALL_CATEGORY_ID);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = FEATURED_TOOLS;
    if (activeCategory !== ALL_CATEGORY_ID) {
      list = list.filter((t) => t.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((t) => {
        const titleText = isZh ? t.titleZh : t.title;
        const descText = (isZh ? t.descriptionZh : t.description).join(' ');
        return (
          titleText.toLowerCase().includes(q) ||
          descText.toLowerCase().includes(q) ||
          t.tags?.some((tag) => tag.toLowerCase().includes(q))
        );
      });
    }
    return list;
  }, [activeCategory, search, isZh]);

  const categoriesToShow = useMemo(() => {
    if (activeCategory !== ALL_CATEGORY_ID || search.trim()) return [];
    return FEATURED_CATEGORIES;
  }, [activeCategory, search]);

  const groupedByCategory = useMemo(() => {
    if (activeCategory !== ALL_CATEGORY_ID || search.trim()) return null;
    const map = new Map<FeaturedCategoryId, typeof FEATURED_TOOLS>();
    for (const cat of FEATURED_CATEGORIES) {
      map.set(cat.id, []);
    }
    for (const tool of filtered) {
      const group = map.get(tool.category);
      if (group) group.push(tool);
    }
    return map;
  }, [filtered, activeCategory, search]);

  const title = isZh ? '精选工具' : 'Featured Tools';
  const subtitle = isZh
    ? '收罗优质网站、在线工具和 GitHub 开源项目，按用途分类，助你发现好用利器。'
    : 'A curated collection of quality websites, online tools, and open-source GitHub projects — organized by use case to help you discover great resources.';
  const allLabel = isZh ? '全部' : 'All';
  const searchPlaceholder = isZh ? '搜索工具名称或关键词...' : 'Search by name or keyword...';
  const noResults = isZh ? '没有匹配的工具。' : 'No matching tools found.';

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      {/* Page header */}
      <section className="border-b border-slate-200 pb-6 dark:border-slate-800">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
          {title}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
          {subtitle}
        </p>
      </section>

      {/* Search + category filter */}
      <div className="space-y-4">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-4 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </div>

        {!search.trim() && (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveCategory(ALL_CATEGORY_ID)}
              className={cn(
                'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                activeCategory === ALL_CATEGORY_ID
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700',
              )}
            >
              {allLabel}
            </button>
            {FEATURED_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                  activeCategory === cat.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700',
                )}
              >
                {cat.icon} {isZh ? cat.nameZh : cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Flat list for filtered/search view */}
      {(activeCategory !== ALL_CATEGORY_ID || search.trim()) && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} isZh={isZh} />
          ))}
        </div>
      )}

      {/* Grouped view for "All" */}
      {groupedByCategory &&
        categoriesToShow.map((cat) => {
          const tools = groupedByCategory.get(cat.id);
          if (!tools || !tools.length) return null;
          return (
            <section key={cat.id}>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-slate-950 dark:text-white">
                <span>{cat.icon}</span>
                <span>{isZh ? cat.nameZh : cat.name}</span>
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {tools.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} isZh={isZh} />
                ))}
              </div>
            </section>
          );
        })}

      {/* Empty state */}
      {!filtered.length && (
        <div className="py-16 text-center text-slate-500 dark:text-slate-400">
          <p className="text-lg font-medium">{noResults}</p>
        </div>
      )}
    </div>
  );
}

function ToolCard({ tool, isZh }: { tool: (typeof FEATURED_TOOLS)[number]; isZh: boolean }) {
  const cat = FEATURED_CATEGORIES.find((c) => c.id === tool.category);
  const coverSrc = `/featured-tools/${tool.slug}.png`;
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      to={`/featured-tools/${tool.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm transition-all hover:border-blue-200 hover:shadow-md dark:border-slate-800 dark:bg-[#282c34] dark:hover:border-blue-800"
    >
      {/* Cover image */}
      <div className="relative h-36 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        {!imgError ? (
          <Image
            src={coverSrc}
            alt={isZh ? tool.titleZh : tool.title}
            fill
            className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl">
            {cat?.icon || '🔗'}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-start gap-2">
          <h3 className="flex-1 text-base font-semibold text-slate-950 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
            {isZh ? tool.titleZh : tool.title}
          </h3>
          <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
        </div>
        <p className="mb-3 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-400 line-clamp-2">
          {(isZh ? tool.descriptionZh : tool.description)[0]}
        </p>
        <div className="flex items-center gap-2">
          {cat && (
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500 dark:bg-slate-700 dark:text-slate-400">
              {cat.icon} {isZh ? cat.nameZh : cat.name}
            </span>
          )}
          {tool.tags?.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-950/40 dark:text-blue-300"
            >
              {tag}
            </span>
          ))}
          <span className="ml-auto flex items-center gap-0.5 text-xs font-medium text-blue-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-blue-400">
            {isZh ? '详情' : 'Details'}
            <ChevronRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}
