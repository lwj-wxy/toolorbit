import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, Tag } from 'lucide-react';
import { BLOG_POSTS } from '../constants/blogData';
import SEO from '../components/SEO';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  
  const post = BLOG_POSTS.find(p => p.slug === slug);

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

  // Related Posts Logic: same category first, otherwise any other posts
  const relatedPosts = BLOG_POSTS
    .filter(p => p.slug !== post.slug)
    .sort((a, b) => {
      if (a.category === post.category && b.category !== post.category) return -1;
      if (a.category !== post.category && b.category === post.category) return 1;
      return 0;
    })
    .slice(0, 2);

  const title = t(`blog.posts.${post.slug}.title`);
  const summary = t(`blog.posts.${post.slug}.summary`);
  const content = t(`blog.posts.${post.slug}.content`);

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": summary,
    "image": post.image,
    "datePublished": post.date,
    "author": {
      "@type": "Organization",
      "name": "ToolOrbit"
    },
    "publisher": {
      "@type": "Organization",
      "name": "ToolOrbit",
      "logo": {
        "@type": "ImageObject",
        "url": "https://toolorbit.site/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://toolorbit.site/blog/${post.slug}`
    }
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SEO 
        title={title}
        description={summary}
        type="article"
        schema={blogSchema}
      />
      <nav className="flex items-center space-x-2 text-sm text-slate-500 mb-8 font-medium whitespace-nowrap overflow-x-auto pb-2">
        <Link to="/" className="hover:text-emerald-600 transition-colors flex items-center gap-1.5 flex-shrink-0">
          {t('common.nav_home') || 'Home'}
        </Link>
        <span className="text-slate-300 flex-shrink-0">{"/"}</span>
        <Link to="/blog" className="hover:text-emerald-600 transition-colors flex-shrink-0">
          {t('blog.nav') || 'Blog'}
        </Link>
        <span className="text-slate-300 flex-shrink-0">{"/"}</span>
        <span className="text-slate-800 text-ellipsis overflow-hidden break-all flex-shrink-0 max-w-[200px] sm:max-w-none inline-block">
          {t(`blog.posts.${post.slug}.title`)}
        </span>
      </nav>

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
          {title}
        </h1>

        <img 
          src={post.image} 
          alt={title}
          referrerPolicy="no-referrer"
          className="w-full h-[400px] object-cover rounded-3xl shadow-lg mb-12"
        />

        <div 
          className="prose prose-slate prose-lg max-w-none 
            dark:prose-invert
            prose-headings:text-slate-900 dark:prose-headings:text-slate-100 prose-headings:font-bold
            prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-p:leading-relaxed
            prose-li:text-slate-600 dark:prose-li:text-slate-300
            prose-img:rounded-2xl
            prose-strong:text-slate-900 dark:prose-strong:text-slate-100
            prose-a:text-emerald-600 prose-a:font-bold hover:prose-a:text-emerald-700"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>

      <div className="border-t border-slate-100 pt-12 mt-12 text-center">
        <h3 className="text-xl font-bold text-slate-900 mb-4">{t('blog.shareTitle')}</h3>
        <div className="flex justify-center gap-4">
          <button 
            onClick={() => {
              const shareUrl = window.location.href;
              const shareText = t(`blog.posts.${post.slug}.title`);
              window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank', 'noopener,noreferrer');
            }}
            className="px-6 py-2 bg-[#1DA1F2] text-white font-bold rounded-xl hover:bg-[#1a8cd8] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
            {t('blog.shareTwitter')}
          </button>
        </div>
      </div>

      {/* Related Posts */}
      <div className="mt-16 pt-12 border-t border-slate-200/60 max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold text-slate-900 mb-8">{t('blog.related_posts') || 'Related Articles'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {relatedPosts.map(related => (
            <Link 
              key={related.id} 
              to={`/blog/${related.slug}`}
              className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img 
                  src={related.image} 
                  alt={t(`blog.posts.${related.slug}.title`)}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <span className="text-xs font-bold text-emerald-600 tracking-wider uppercase mb-2">
                  {t(`blog.categories.${related.category}`)}
                </span>
                <h4 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                  {t(`blog.posts.${related.slug}.title`)}
                </h4>
                <p className="text-slate-600 mb-4 line-clamp-2 text-sm flex-1">
                  {t(`blog.posts.${related.slug}.summary`)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
};

export default BlogPost;
