'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '../lib/navigation';
import { Calendar, ChevronLeft, ChevronRight, UserCheck } from 'lucide-react';
import { PUBLISHED_BLOG_POSTS, BlogPost } from '../constants/blogData';
import { getBlogPagePosts, getTotalBlogPages } from '../lib/blog-pagination';
import { getAuthorById } from '../data/authors';

type BlogListProps = {
  initialPage?: number;
};

const BlogList: React.FC<BlogListProps> = ({ initialPage = 1 }) => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(initialPage);

  useEffect(() => {
    setCurrentPage(initialPage);
  }, [initialPage]);

  const sortedPosts = useMemo(() => {
    return [...PUBLISHED_BLOG_POSTS].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, []);

  const totalPages = getTotalBlogPages(sortedPosts.length);
  const safeCurrentPage = Math.min(currentPage, Math.max(totalPages, 1));

  const currentPosts = useMemo(() => {
    return getBlogPagePosts(sortedPosts, safeCurrentPage);
  }, [sortedPosts, safeCurrentPage]);

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
  };

  const renderPostCard = (post: BlogPost) => {
    const author = getAuthorById(post.authorId, 'en');

    return (
      <Link
        key={post.slug}
        to={`/blog/${post.slug}`}
        className="group block border-b border-[var(--app-border)] px-1 py-7 transition-colors duration-200 hover:bg-[var(--app-accent-soft)] sm:px-5 sm:py-8"
      >
        <h2 className="mb-3 text-[22px] font-black leading-[1.3] tracking-[-0.025em] text-[var(--app-text)] transition-colors group-hover:text-[var(--app-accent-ink)]">
          {t(`blog.posts.${post.slug}.title`, { defaultValue: post.slug.replace(/-/g, ' ') })}
        </h2>

        <p className="mb-[18px] line-clamp-2 text-[15px] leading-[1.8] text-[var(--app-muted)]">
          {t(`blog.posts.${post.slug}.summary`, { defaultValue: '' })}
        </p>

        <div className="border-t border-[var(--app-border)] pt-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--app-muted)]">
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={14} />
              {post.date}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <UserCheck size={14} />
              {author.name}
            </span>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="mx-auto max-w-[1040px] px-4 py-10 sm:px-6 lg:py-14">
      <header className="mb-10 max-w-3xl border-b-2 border-[var(--app-text)] pb-8">
        <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--app-accent-ink)]">Seller guides</p>
        <h1 className="text-4xl font-black leading-[1.05] tracking-[-0.04em] text-[var(--app-text)] sm:text-5xl">
          Etsy seller guides
        </h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[var(--app-muted)]">
          Practical notes on listing copy, pricing, fees, product images, and the checks that help you publish with fewer surprises.
        </p>
      </header>
      <main className="min-w-0">
        {currentPosts.length === 0 ? (
          <div className="border-b border-[var(--app-border)] px-1 py-16 text-center">
            <p className="text-base text-[var(--app-muted)]">No published guides yet.</p>
          </div>
        ) : (
          <div>{currentPosts.map((post) => renderPostCard(post))}</div>
        )}

        {totalPages > 1 && (
          <nav className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
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
    </div>
  );
};

export default BlogList;
