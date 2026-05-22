'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { Link } from '../lib/navigation';
import { Calendar, ChevronRight, ChevronLeft, UserCheck, ArrowRight } from 'lucide-react';
import { BLOG_POSTS, BlogPost } from '../constants/blogData';
import { getBlogPagePosts, getTotalBlogPages, POSTS_PER_PAGE } from '../lib/blog-pagination';
import { getAuthorById } from '../data/authors';

type BlogListProps = {
  initialPage?: number;
};

const CATEGORY_ORDER = [
  'AI',
  'Development',
  'Security',
  'Design',
  'Business',
  'Productivity',
] as const;

const BlogList: React.FC<BlogListProps> = ({ initialPage = 1 }) => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    setCurrentPage(initialPage);
  }, [initialPage]);

  const sortedPosts = useMemo(() => {
    return [...BLOG_POSTS].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, []);

  const visibleCategories = useMemo(() => {
    const categoriesWithPosts = new Set(BLOG_POSTS.map((post) => post.category));
    return [
      'All',
      ...CATEGORY_ORDER.filter((category) => categoriesWithPosts.has(category)),
    ];
  }, []);

  const filteredPosts = useMemo(() => {
    if (activeCategory === 'All') return sortedPosts;
    return sortedPosts.filter((p) => p.category === activeCategory);
  }, [sortedPosts, activeCategory]);

  const hasFeaturedFirstPage = activeCategory === 'All';
  const totalPages = hasFeaturedFirstPage
    ? getTotalBlogPages(filteredPosts.length)
    : Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, Math.max(totalPages, 1));

  const currentPosts = useMemo(() => {
    if (hasFeaturedFirstPage) {
      return getBlogPagePosts(filteredPosts, safeCurrentPage);
    }

    const startIndex = (safeCurrentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
  }, [filteredPosts, hasFeaturedFirstPage, safeCurrentPage]);

  const showHero = hasFeaturedFirstPage && safeCurrentPage === 1 && currentPosts.length > 0;
  const heroPost = showHero ? currentPosts[0] : null;
  const gridPosts = showHero ? currentPosts.slice(1) : currentPosts;

  const blogPagePath = (page: number) => (page <= 1 ? '/blog' : `/blog/page/${page}`);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const renderHeroCard = (post: BlogPost) => {
    const author = getAuthorById(post.authorId);
    return (
      <Link
        to={`/blog/${post.slug}`}
        className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="grid md:grid-cols-[1fr_380px]">
          <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
            <span className="mb-4 inline-flex self-start rounded-md bg-cyan-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300">
              {t(`blog.categories.${post.category.toLowerCase()}`, { defaultValue: post.category })}
            </span>
            <h2 className="text-2xl font-bold leading-tight text-slate-900 transition-colors group-hover:text-cyan-600 dark:text-slate-100 dark:group-hover:text-cyan-400 sm:text-3xl">
              {t(`blog.posts.${post.slug}.title`, { defaultValue: post.slug.replace(/-/g, ' ') })}
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              {t(`blog.posts.${post.slug}.summary`, { defaultValue: '' })}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5 font-medium">
                <Calendar size={13} className="text-cyan-500" />
                {post.date}
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium">
                <UserCheck size={13} className="text-cyan-500" />
                {author.name}
              </span>
            </div>
            <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-600 transition-all group-hover:gap-2.5 dark:text-cyan-400">
              {t('blog.readMore', { defaultValue: 'Read More' })}
              <ArrowRight size={16} />
            </div>
          </div>
          <div className="relative hidden min-h-60 overflow-hidden bg-slate-100 md:block dark:bg-slate-800">
            <Image
              src={post.image}
              alt={t(`blog.posts.${post.slug}.title`)}
              fill
              sizes="380px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>
      </Link>
    );
  };

  const renderPostCard = (post: BlogPost, index: number) => {
    const author = getAuthorById(post.authorId);

    return (
      <Link
        key={post.slug}
        to={`/blog/${post.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="relative aspect-[16/9] overflow-hidden bg-slate-100 dark:bg-slate-800">
          <Image
            src={post.image}
            alt={t(`blog.posts.${post.slug}.title`)}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            loading={index > 5 ? 'lazy' : undefined}
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
          <div className="absolute bottom-3 left-3 z-10">
            <span className="inline-block rounded-md bg-white/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-700 shadow-sm dark:bg-slate-900/90 dark:text-slate-200">
              {t(`blog.categories.${post.category.toLowerCase()}`, { defaultValue: post.category })}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-medium text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={11} className="text-cyan-500" />
              {post.date}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <UserCheck size={11} className="text-cyan-500" />
              {author.name}
            </span>
          </div>

          <h3 className="text-base font-bold leading-snug text-slate-900 transition-colors group-hover:text-cyan-600 dark:text-slate-100 dark:group-hover:text-cyan-400 line-clamp-2">
            {t(`blog.posts.${post.slug}.title`, { defaultValue: post.slug.replace(/-/g, ' ') })}
          </h3>

          <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">
            {t(`blog.posts.${post.slug}.summary`, { defaultValue: '' })}
          </p>

          <div className="mt-auto flex items-center pt-3 text-[13px] font-semibold text-cyan-600 transition-all group-hover:gap-2 dark:text-cyan-400">
            {t('blog.readMore', { defaultValue: 'Read More' })}
            <ChevronRight size={14} className="ml-0.5 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      {/* Page Header */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
          {t('blog.title')}
        </h1>
        <p className="mt-3 text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          {t('blog.subtitle')}
        </p>

        {/* Category Filter Pills */}
        <div className="mt-7 flex flex-wrap justify-center gap-2">
          {visibleCategories.map((cat) => {
            const isActive = activeCategory === cat;
            const label =
              cat === 'All'
                ? t('blog.categories.all', { defaultValue: 'All' })
                : t(`blog.categories.${cat.toLowerCase()}`, { defaultValue: cat });
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-cyan-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-cyan-400'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      {filteredPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
            <Calendar size={28} className="text-slate-300 dark:text-slate-600" />
          </div>
          <p className="text-base text-slate-400 dark:text-slate-500">
            {t('blog.noPosts', { defaultValue: 'No articles in this category yet.' })}
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Hero featured post */}
          {heroPost && (
            <section>{renderHeroCard(heroPost)}</section>
          )}

          {/* Post grid */}
          <section>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {gridPosts.map((post, idx) => renderPostCard(post, idx))}
            </div>
          </section>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="mt-14 flex items-center justify-center gap-3" aria-label="Pagination">
          <Link
            to={blogPagePath(safeCurrentPage - 1)}
            onClick={() => setCurrentPage(Math.max(1, safeCurrentPage - 1))}
            aria-disabled={safeCurrentPage === 1}
            className={`inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-medium text-slate-600 transition-all hover:border-cyan-200 hover:text-cyan-700 dark:border-slate-800 dark:text-slate-400 dark:hover:border-cyan-800 dark:hover:text-cyan-400 ${
              safeCurrentPage === 1 ? 'pointer-events-none opacity-40' : ''
            }`}
          >
            <ChevronLeft size={15} />
            {t('common.prevPage', { defaultValue: 'Previous' })}
          </Link>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Link
                key={page}
                to={blogPagePath(page)}
                onClick={() => setCurrentPage(page)}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-all ${
                  safeCurrentPage === page
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-cyan-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-cyan-400'
                }`}
              >
                {page}
              </Link>
            ))}
          </div>

          <Link
            to={blogPagePath(safeCurrentPage + 1)}
            onClick={() => setCurrentPage(Math.min(totalPages, safeCurrentPage + 1))}
            aria-disabled={safeCurrentPage === totalPages}
            className={`inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3.5 py-2 text-sm font-medium text-slate-600 transition-all hover:border-cyan-200 hover:text-cyan-700 dark:border-slate-800 dark:text-slate-400 dark:hover:border-cyan-800 dark:hover:text-cyan-400 ${
              safeCurrentPage === totalPages ? 'pointer-events-none opacity-40' : ''
            }`}
          >
            {t('common.nextPage', { defaultValue: 'Next' })}
            <ChevronRight size={15} />
          </Link>
        </nav>
      )}
    </div>
  );
};

export default BlogList;
