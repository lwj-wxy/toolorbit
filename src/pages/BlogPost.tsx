import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, ArrowLeft, Clock, Tag } from 'lucide-react';
import { BLOG_POSTS } from '../constants/blogData';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  
  const post = BLOG_POSTS.find(p => p.slug === slug);

  useEffect(() => {
    if (post) {
      document.title = `${t(`blog.posts.${post.slug}.title`)} | ToolOrbit Blog`;
      
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', t(`blog.posts.${post.slug}.summary`));
      }
    }
    
    return () => {
      document.title = 'ToolOrbit - All-in-one Online Productivity Toolkit';
    };
  }, [post, t]);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">404</h1>
          <p className="text-slate-600 mb-8">Post not found</p>
          <Link to="/blog" className="text-emerald-600 font-bold hover:underline">Back to Blog</Link>
        </div>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link 
        to="/blog" 
        className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-medium mb-8 transition-colors"
      >
        <ArrowLeft size={16} />
        {t('blog.nav')}
      </Link>

      <div className="mb-12">
        <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
          <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-slate-700 font-medium">
            <Tag size={14} />
            {post.category}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar size={14} />
            {post.date}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={14} />
            5 min read
          </span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-8">
          {t(`blog.posts.${post.slug}.title`)}
        </h1>

        <img 
          src={post.image} 
          alt={t(`blog.posts.${post.slug}.title`)}
          className="w-full h-[400px] object-cover rounded-3xl shadow-lg mb-12"
        />

        <div 
          className="prose prose-slate prose-lg max-w-none 
            prose-headings:text-slate-900 prose-headings:font-bold
            prose-p:text-slate-600 prose-p:leading-relaxed
            prose-li:text-slate-600 
            prose-img:rounded-2xl
            prose-strong:text-slate-900
            prose-a:text-emerald-600 prose-a:font-bold hover:prose-a:text-emerald-700"
          dangerouslySetInnerHTML={{ __html: t(`blog.posts.${post.slug}.content`) }}
        />
      </div>

      <div className="border-t border-slate-100 pt-12 mt-12 text-center">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Share this post</h3>
        <div className="flex justify-center gap-4">
          {/* Share buttons could go here */}
          <button className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg">
            Share on Twitter
          </button>
        </div>
      </div>
    </article>
  );
};

export default BlogPost;
