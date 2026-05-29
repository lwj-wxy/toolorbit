'use client';

import { ArrowLeft, ChevronRight, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FEATURED_CATEGORIES, FEATURED_TOOLS } from '../data/featured-tools';
import { Link } from '../lib/navigation';

export default function FeaturedToolDetail({ slug }: { slug: string }) {
  const { i18n } = useTranslation();
  const isZh = i18n.language?.startsWith('zh');
  const [imgError, setImgError] = useState(false);

  const tool = FEATURED_TOOLS.find((t) => t.slug === slug);
  if (!tool) notFound();

  const cat = FEATURED_CATEGORIES.find((c) => c.id === tool.category);
  const coverSrc = `/featured-tools/${tool.slug}.png`;
  const descParagraphs = isZh ? tool.descriptionZh : tool.description;

  // Keep recommendations deterministic so SSR and hydration render the same cards.
  const recommended = useMemo(() => {
    const sameCategory = FEATURED_TOOLS.filter(
      (t) => t.category === tool.category,
    );
    const currentIndex = sameCategory.findIndex((t) => t.slug === tool.slug);
    const ordered = [
      ...sameCategory.slice(currentIndex + 1),
      ...sameCategory.slice(0, Math.max(currentIndex, 0)),
    ];

    return ordered.slice(0, 3);
  }, [tool.category, tool.slug]);

  const backLabel = isZh ? '返回精选工具' : 'Back to Featured Tools';
  const visitLabel = isZh ? '访问网站' : 'Visit website';
  const recommendedTitle = isZh ? '推荐工具' : 'Recommended tools';

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      {/* Back link */}
      <Link
        to="/featured-tools"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
      >
        <ArrowLeft className="h-4 w-4" />
        {backLabel}
      </Link>

      {/* Cover image - large */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-slate-200/80 bg-slate-100 shadow-sm dark:border-slate-800 dark:bg-slate-800">
        {!imgError ? (
          <Image
            src={coverSrc}
            alt={isZh ? tool.titleZh : tool.title}
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-6xl">
            {cat?.icon || '🔗'}
          </div>
        )}
      </div>

      {/* Title + visit button */}
      <section>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
              {isZh ? tool.titleZh : tool.title}
            </h1>
            {tool.title !== tool.titleZh && (
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {isZh ? tool.title : tool.titleZh}
              </p>
            )}
          </div>
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            <ExternalLink className="h-4 w-4" />
            {visitLabel}
          </a>
        </div>
      </section>

      {/* Metadata badges */}
      <div className="flex flex-wrap items-center gap-3">
        {cat && (
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800">
            <span>{cat.icon}</span>
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {isZh ? cat.nameZh : cat.name}
            </span>
          </div>
        )}
        {tool.tags && tool.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            {tool.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Description - multi paragraph */}
      <section className="space-y-4">
        {descParagraphs.map((para, i) => (
          <p
            key={i}
            className="text-[15px] leading-7 text-slate-700 dark:text-slate-300"
          >
            {para}
          </p>
        ))}
      </section>

      {/* URL */}
      <section className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          URL
        </p>
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 block break-all text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {tool.url}
        </a>
      </section>

      {/* Recommended tools */}
      {recommended.length > 0 && (
        <section className="border-t border-slate-200 pt-8 dark:border-slate-800">
          <h2 className="mb-5 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
            {recommendedTitle}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {recommended.map((rec) => (
              <Link
                key={rec.slug}
                to={`/featured-tools/${rec.slug}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm transition-all hover:border-blue-200 hover:shadow-md dark:border-slate-800 dark:bg-[#282c34] dark:hover:border-blue-800"
              >
                <div className="relative h-24 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <Image
                    src={`/featured-tools/${rec.slug}.png`}
                    alt={isZh ? rec.titleZh : rec.title}
                    fill
                    className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    sizes="33vw"
                  />
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-slate-950 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                    {isZh ? rec.titleZh : rec.title}
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500 line-clamp-2 dark:text-slate-400">
                    {(isZh ? rec.descriptionZh : rec.description)[0]}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
