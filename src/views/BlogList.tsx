'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { Link } from '../lib/navigation';
import { Calendar, ChevronRight, ChevronLeft } from 'lucide-react';
import { BLOG_POSTS, BlogPost } from '../constants/blogData';
import { POSTS_PER_PAGE } from '../lib/blog-pagination';

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

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const safeCurrentPage = Math.min(currentPage, Math.max(totalPages, 1));

  const currentPosts = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
  }, [filteredPosts, safeCurrentPage]);

  const blogPagePath = (page: number) => (page <= 1 ? '/blog' : `/blog/page/${page}`);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const renderPostCard = (post: BlogPost) => (
    <Link 
      key={post.slug} 
      to={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
        <Image
          src={post.image} 
          alt={t(`blog.posts.${post.slug}.title`)}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[10px] uppercase tracking-wider font-extrabold text-slate-700 rounded-lg shadow-sm border border-white/20">
            {t(`blog.categories.${post.category.toLowerCase()}`, { defaultValue: post.category })}
          </span>
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col min-h-0">
        <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold mb-3 uppercase tracking-tight">
          <Calendar size={12} className="text-emerald-500" />
          <span>{post.date}</span>
        </div>
        
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-snug">
          {t(`blog.posts.${post.slug}.title`, { defaultValue: post.slug.replace(/-/g, ' ') })}
        </h2>
        
        <p className="text-slate-500 dark:text-slate-400 text-[13px] mb-6 line-clamp-2 leading-relaxed">
          {t(`blog.posts.${post.slug}.summary`, { defaultValue: '' })}
        </p>
        
        <div className="mt-auto flex items-center text-emerald-600 text-sm font-bold gap-1 group-hover:gap-2 transition-all">
          {t('blog.readMore', { defaultValue: 'Read More' })} <ChevronRight size={16} />
        </div>
      </div>
    </Link>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
          {t('blog.title')}
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
          {t('blog.subtitle')}
        </p>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 px-4">
          {visibleCategories.map((cat) => {
            const isActive = activeCategory === cat;
            const label = cat === 'All'
              ? (t('blog.categories.all', { defaultValue: 'All' }))
              : t(`blog.categories.${cat.toLowerCase()}`, { defaultValue: cat });
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-emerald-600'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-12">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg">{t('blog.noPosts', { defaultValue: 'No articles in this category yet.' })}</p>
          </div>
        ) : (
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentPosts.map(renderPostCard)}
            </div>
          </section>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-16 pb-8">
            <Link
              to={blogPagePath(safeCurrentPage - 1)}
              onClick={() => setCurrentPage(Math.max(1, safeCurrentPage - 1))}
              aria-disabled={safeCurrentPage === 1}
              className={`flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all font-medium text-sm ${
                safeCurrentPage === 1 ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              <ChevronLeft size={16} />
              {t('common.prevPage', { defaultValue: 'Previous' })}
            </Link>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Link
                  key={page}
                  to={blogPagePath(page)}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                    safeCurrentPage === page
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-emerald-600'
                  } flex items-center justify-center`}
                >
                  {page}
                </Link>
              ))}
            </div>
            <Link
              to={blogPagePath(safeCurrentPage + 1)}
              onClick={() => setCurrentPage(Math.min(totalPages, safeCurrentPage + 1))}
              aria-disabled={safeCurrentPage === totalPages}
              className={`flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all font-medium text-sm ${
                safeCurrentPage === totalPages ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              {t('common.nextPage', { defaultValue: 'Next' })}
              <ChevronRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;
