import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Calendar, ChevronRight, Hash } from 'lucide-react';
import { BLOG_POSTS, BlogPost } from '../constants/blogData';

const BlogList: React.FC = () => {
  const { t } = useTranslation();

  const sections = useMemo(() => {
    const techCategories = ['Development', 'Security', 'Network', 'Design'];
    const scienceCategories = ['Science', 'Education', 'Lifestyle'];

    const techPosts = BLOG_POSTS.filter(post => techCategories.includes(post.category));
    const sciencePosts = BLOG_POSTS.filter(post => scienceCategories.includes(post.category));

    return [
      {
        id: 'dev-resources',
        title: t('blog.categories.tech'),
        posts: techPosts
      },
      {
        id: 'science-knowledge',
        title: t('blog.categories.science'),
        posts: sciencePosts
      }
    ];
  }, [t]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
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
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=800';
          }}
        />
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[10px] uppercase tracking-wider font-extrabold text-slate-700 rounded-lg shadow-sm border border-white/20">
            {t(`blog.categories.${post.category.toLowerCase()}`)}
          </span>
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col min-h-0">
        <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold mb-3 uppercase tracking-tight">
          <Calendar size={12} className="text-emerald-500" />
          <span>{post.date}</span>
        </div>
        
        <h2 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-snug">
          {t(`blog.posts.${post.slug}.title`)}
        </h2>
        
        <p className="text-slate-500 text-[13px] mb-6 line-clamp-2 leading-relaxed">
          {t(`blog.posts.${post.slug}.summary`)}
        </p>
        
        <div className="mt-auto flex items-center text-emerald-600 text-sm font-bold gap-1 group-hover:gap-2 transition-all">
          {t('blog.readMore')} <ChevronRight size={16} />
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

        {/* Category Anchors */}
        <div className="flex flex-wrap justify-center gap-3">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 rounded-2xl border border-slate-200 hover:border-emerald-200 font-bold text-sm transition-all shadow-sm"
            >
              <Hash size={14} className="opacity-50" />
              {section.title}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-20">
        {sections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-24">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {section.title}
              </h2>
              <div className="h-0.5 flex-1 bg-slate-100 rounded-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {section.posts.map(renderPostCard)}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default BlogList;
