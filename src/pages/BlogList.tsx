import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Calendar, ChevronRight } from 'lucide-react';
import { BLOG_POSTS } from '../constants/blogData';

const BlogList: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
          {t('blog.title')}
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          {t('blog.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {BLOG_POSTS.map((post) => (
          <Link 
            key={post.id} 
            to={`/blog/${post.slug}`}
            className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
              <img 
                src={post.image} 
                alt={t(`blog.posts.${post.slug}.title`)}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=800';
                }}
              />
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[10px] uppercase tracking-wider font-extrabold text-slate-700 rounded-lg shadow-sm border border-white/20">
                  {post.category}
                </span>
              </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col min-h-0">
              <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold mb-3 uppercase tracking-tight">
                <Calendar size={12} className="text-emerald-500" />
                <span>{post.date}</span>
              </div>
              
              <h2 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-snug">
                {t(`blog.posts.${post.slug}.title`)}
              </h2>
              
              <p className="text-slate-500 text-[13px] mb-6 line-clamp-3 leading-relaxed">
                {t(`blog.posts.${post.slug}.summary`)}
              </p>
              
              <div className="mt-auto flex items-center text-emerald-600 text-sm font-bold gap-1 group-hover:gap-2 transition-all">
                {t('blog.readMore')} <ChevronRight size={16} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BlogList;
