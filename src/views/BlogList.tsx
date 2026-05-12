'use client';

import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '../lib/navigation';
import { Calendar, ChevronRight, ChevronLeft } from 'lucide-react';
import { BLOG_POSTS, BlogPost } from '../constants/blogData';

const POSTS_PER_PAGE = 12;

const BlogList: React.FC = () => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);

  // Sorting posts by date descending ensures the newest posts are first
  const sortedPosts = useMemo(() => {
    return [...BLOG_POSTS].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, []);

  const totalPages = Math.ceil(sortedPosts.length / POSTS_PER_PAGE);

  const currentPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    return sortedPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
  }, [sortedPosts, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderPostCard = (post: BlogPost) => (
    <Link 
      key={post.id} 
      to={`/blog/${post.slug}`}
      className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
        <img 
          src={post.image} 
          alt={t(`blog.posts.${post.slug}.title`)}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=800';
          }}
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
        
        <h2 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-snug">
          {t(`blog.posts.${post.slug}.title`, { defaultValue: post.slug.replace(/-/g, ' ') })}
        </h2>
        
        <p className="text-slate-500 text-[13px] mb-6 line-clamp-2 leading-relaxed">
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
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
          {t('blog.title')}
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10">
          {t('blog.subtitle')}
        </p>
      </div>

      <div className="space-y-12">
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentPosts.map(renderPostCard)}
          </div>
        </section>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-16 pb-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-sm"
            >
              <ChevronLeft size={16} />
              {t('common.prevPage', { defaultValue: 'Previous' })}
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                    currentPage === page
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-emerald-600'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-sm"
            >
              {t('common.nextPage', { defaultValue: 'Next' })}
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;
