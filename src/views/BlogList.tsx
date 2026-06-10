'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '../lib/navigation';
import { Calendar, ChevronLeft, ChevronRight, FolderOpen, UserCheck } from 'lucide-react';
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
  const { t, i18n } = useTranslation();
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const authorLocale = i18n.language && i18n.language.startsWith('zh') ? 'zh-CN' : 'en';
  const sidebarCategoryTitle = authorLocale === 'zh-CN' ? '按分类看' : 'Categories';

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

  const categoryCounts = useMemo(() => {
    return BLOG_POSTS.reduce<Record<string, number>>((counts, post) => {
      counts[post.category] = (counts[post.category] || 0) + 1;
      return counts;
    }, {});
  }, []);

  const filteredPosts = useMemo(() => {
    if (activeCategory === 'All') return sortedPosts;
    return sortedPosts.filter((post) => post.category === activeCategory);
  }, [sortedPosts, activeCategory]);

  const isAllCategory = activeCategory === 'All';
  const totalPages = isAllCategory
    ? getTotalBlogPages(filteredPosts.length)
    : Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, Math.max(totalPages, 1));

  const currentPosts = useMemo(() => {
    if (isAllCategory) {
      return getBlogPagePosts(filteredPosts, safeCurrentPage);
    }

    const startIndex = (safeCurrentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
  }, [filteredPosts, isAllCategory, safeCurrentPage]);

  const blogPagePath = (page: number) => (page <= 1 ? '/blog' : `/blog/page/${page}`);

  const renderPaginationButton = (
    page: number,
    content: React.ReactNode,
    ariaLabel: string,
    isDisabled = false,
    isPageNumber = true,
  ) => {
    const isCurrentPage = isPageNumber && safeCurrentPage === page;
    const className = `inline-flex h-11 w-11 items-center justify-center rounded-lg border text-sm font-semibold transition-colors ${
      isCurrentPage
        ? 'border-cyan-600 bg-cyan-600 text-white shadow-sm'
        : 'border-slate-200 bg-white text-slate-600 hover:border-cyan-200 hover:text-cyan-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-cyan-800 dark:hover:text-cyan-400'
    } ${isDisabled ? 'pointer-events-none opacity-40' : ''}`;

    if (isAllCategory) {
      return (
        <Link
          key={ariaLabel}
          to={blogPagePath(page)}
          onClick={() => setCurrentPage(page)}
          aria-label={ariaLabel}
          aria-current={isCurrentPage ? 'page' : undefined}
          aria-disabled={isDisabled}
          className={className}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        key={ariaLabel}
        type="button"
        onClick={() => setCurrentPage(page)}
        aria-label={ariaLabel}
        aria-current={isCurrentPage ? 'page' : undefined}
        disabled={isDisabled}
        className={className}
      >
        {content}
      </button>
    );
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const categoryLabel = (category: string) => {
    return category === 'All'
      ? t('blog.categories.all', { defaultValue: 'All' })
      : t(`blog.categories.${category.toLowerCase()}`, { defaultValue: category });
  };

  const renderPostCard = (post: BlogPost) => {
    const author = getAuthorById(post.authorId, authorLocale);

    return (
      <Link
        key={post.slug}
        to={`/blog/${post.slug}`}
        className="group block rounded-lg border border-slate-200 bg-white px-5 py-6 shadow-sm transition-colors duration-200 hover:border-cyan-200 hover:bg-cyan-50/30 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-cyan-900/70 dark:hover:bg-cyan-950/10 sm:px-7 sm:py-8"
      >
        <h2 className="mb-3 text-[22px] font-bold leading-[1.45] text-slate-950 transition-colors group-hover:text-cyan-700 dark:text-white dark:group-hover:text-cyan-300">
          {t(`blog.posts.${post.slug}.title`, { defaultValue: post.slug.replace(/-/g, ' ') })}
        </h2>

        <p className="mb-[18px] line-clamp-2 text-[15px] leading-[1.85] text-slate-700 dark:text-slate-300">
          {t(`blog.posts.${post.slug}.summary`, { defaultValue: '' })}
        </p>

        <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={14} className="text-slate-500 dark:text-slate-400" />
              {post.date}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <UserCheck size={14} className="text-slate-500 dark:text-slate-400" />
              {author.name}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <FolderOpen size={14} className="text-slate-500 dark:text-slate-400" />
              {categoryLabel(post.category)}
            </span>
          </div>
        </div>
      </Link>
    );
  };

  const renderCategoryButton = (category: string) => {
    const isActive = activeCategory === category;
    const count = category === 'All' ? BLOG_POSTS.length : categoryCounts[category] || 0;

    return (
      <button
        key={category}
        type="button"
        onClick={() => handleCategoryChange(category)}
        className={`flex w-full items-center justify-between border-b border-slate-200 px-1 py-3 text-left text-sm font-medium transition-colors last:border-b-0 dark:border-slate-800 ${
          isActive
            ? 'text-cyan-700 dark:text-cyan-300'
            : 'text-slate-700 hover:text-cyan-700 dark:text-slate-300 dark:hover:text-cyan-300'
        }`}
      >
        <span>{categoryLabel(category)}</span>
        <span
          className={`rounded-full px-2 py-0.5 text-xs ${
            isActive
              ? 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300'
              : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
          }`}
        >
          {count}
        </span>
      </button>
    );
  };

  return (
    <div className="mx-auto max-w-[1180px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <header className="mb-6 max-w-3xl">
        <h1 className="text-3xl font-bold leading-tight text-slate-950 dark:text-white">
          {t('blog.title')}
        </h1>
        <p className="mt-3 text-[15px] leading-7 text-slate-600 dark:text-slate-300">
          {t('blog.subtitle')}
        </p>
      </header>

      <div className="mb-5 flex gap-2 overflow-x-auto pb-1 lg:hidden">
        {visibleCategories.map((category) => {
          const isActive = activeCategory === category;

          return (
            <button
              key={category}
              type="button"
              onClick={() => handleCategoryChange(category)}
              className={`shrink-0 rounded-full border px-3 py-2 text-sm font-semibold transition-colors ${
                isActive
                  ? 'border-cyan-600 bg-cyan-600 text-white'
                  : 'border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
              }`}
            >
              {categoryLabel(category)}
            </button>
          );
        })}
      </div>

      <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_240px] lg:items-start">
        <main className="min-w-0">
          {filteredPosts.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-white px-6 py-16 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <p className="text-base text-slate-500 dark:text-slate-400">
                {t('blog.noPosts', { defaultValue: 'No articles in this category yet.' })}
              </p>
            </div>
          ) : (
            <div className="grid gap-5">
              {currentPosts.map((post) => renderPostCard(post))}
            </div>
          )}

          {totalPages > 1 && (
            <nav className="mt-8 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
              {renderPaginationButton(
                Math.max(1, safeCurrentPage - 1),
                <ChevronLeft size={16} />,
                t('common.prevPage', { defaultValue: 'Previous page' }),
                safeCurrentPage === 1,
                false,
              )}

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) =>
                renderPaginationButton(page, page, `${t('blog.page', { defaultValue: 'Page' })} ${page}`),
              )}

              {renderPaginationButton(
                Math.min(totalPages, safeCurrentPage + 1),
                <ChevronRight size={16} />,
                t('common.nextPage', { defaultValue: 'Next page' }),
                safeCurrentPage === totalPages,
                false,
              )}
            </nav>
          )}
        </main>

        <aside className="hidden lg:sticky lg:top-24 lg:block" aria-label="Blog sidebar">
          <section className="px-1 py-2">
            <h2 className="mb-4 text-base font-bold text-slate-950 dark:text-white">
              {sidebarCategoryTitle}
            </h2>
            <div className="space-y-1">
              {visibleCategories.map((category) => renderCategoryButton(category))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default BlogList;
