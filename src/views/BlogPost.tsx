'use client';

import { useState, useEffect } from 'react';
import { Link } from '../lib/navigation';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, Tag, FileText, Wrench, ShieldCheck, UserCheck } from 'lucide-react';
import { BLOG_POSTS } from '../constants/blogData';
import { BLOG_RELATED_TOOLS } from '../data/blogRelatedTools';
import { TOOLS } from '../data/tools';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface BlogPostProps {
  slug: string;
  initialMarkdown?: string;
}

const BlogPost: React.FC<BlogPostProps> = ({ slug, initialMarkdown = '' }) => {
  const { t, i18n } = useTranslation();
  const [markdown, setMarkdown] = useState<string>(initialMarkdown);
  
  const post = BLOG_POSTS.find(p => p.slug === slug);

  useEffect(() => {
    if (!slug) return;
    const lang = i18n.language && i18n.language.startsWith('zh') ? 'zh' : 'en';
    
    // Attempt to fetch from public/articles/ first
    fetch(`/articles/${lang}/${slug}.md`)
      .then(res => {
        if (!res.ok) {
          // Fallback to json if MD not found
          return t(`blog.posts.${slug}.content`);
        }
        return res.text();
      })
      .then(text => {
        // If the translation returns the key itself, it means it's missing in JSON
        if (text === `blog.posts.${slug}.content`) {
          setMarkdown('');
        } else {
          setMarkdown(text);
        }
      })
      .catch(() => setMarkdown(t(`blog.posts.${slug}.content`)));
  }, [slug, i18n.language, t]);

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
  const relatedTools = (BLOG_RELATED_TOOLS[slug] || [])
    .map((path) => TOOLS.find((tool) => tool.path === path))
    .filter(Boolean) as typeof TOOLS;

  const title = t(`blog.posts.${post.slug}.title`);
  // Estimate reading time based on markdown length
  const readingTime = Math.max(3, Math.ceil(markdown.length / 800));

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
        <div className="flex items-center gap-4 text-sm text-slate-500 mb-6 flex-wrap">
          <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-slate-700 font-medium">
            <Tag size={14} />
            {post.category}
          </span>
          <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-full">
            <Calendar size={14} />
            {post.date}
          </span>
          <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-full">
            <Clock size={14} />
            {readingTime} min read
          </span>
          <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-full">
            <FileText size={14} />
            {markdown.length > 2000 ? 'In-Depth Article' : 'Article'}
          </span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-8">
          {title}
        </h1>

        <div className="mb-8 rounded-2xl border border-slate-200 bg-slate-50/80 p-5 text-sm text-slate-600">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                <UserCheck size={18} />
              </div>
              <div>
                <p className="font-bold text-slate-900">
                  {t('blog.editorial_byline', { defaultValue: 'Written and maintained by the ToolOrbit Editorial Team' })}
                </p>
                <p className="mt-1 leading-6">
                  {t('blog.editorial_note', {
                    defaultValue:
                      'Each guide is reviewed for practical workflow accuracy and connected to the browser tools that help you apply it.',
                  })}
                </p>
              </div>
            </div>
            <Link
              to="/about"
              className="inline-flex flex-shrink-0 items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-white px-3 py-2 font-bold text-emerald-700 transition-colors hover:bg-emerald-50"
            >
              <ShieldCheck size={16} />
              {t('blog.editorial_policy', { defaultValue: 'Editorial standards' })}
            </Link>
          </div>
        </div>

        <img 
          src={post.image} 
          alt={title}
          referrerPolicy="no-referrer"
          className="w-full h-[400px] md:h-[500px] object-cover rounded-3xl shadow-lg mb-12"
        />

        {markdown ? (
          <div className="prose prose-slate prose-lg md:prose-xl max-w-none 
            dark:prose-invert
            prose-headings:text-slate-900 dark:prose-headings:text-slate-100 prose-headings:font-bold
            prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:pb-4 prose-h2:border-slate-200
            prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
            prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-6
            prose-li:text-slate-700 dark:prose-li:text-slate-300
            prose-img:rounded-2xl prose-img:shadow-md
            prose-strong:text-slate-900 dark:prose-strong:text-slate-100
            prose-a:text-emerald-600 prose-a:font-bold hover:prose-a:text-emerald-700
            prose-blockquote:border-l-4 prose-blockquote:border-emerald-500 prose-blockquote:bg-slate-50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:italic
            prose-code:text-emerald-600 prose-code:bg-emerald-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-slate-900 prose-pre:text-slate-50">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {markdown}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="flex justify-center py-20">
            <div className="animate-pulse flex space-x-2 items-center text-slate-400">
              <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
              <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
              <span className="ml-2 font-medium">Loading article content...</span>
            </div>
          </div>
        )}
      </div>

      {relatedTools.length > 0 && (
        <div className="mt-16 rounded-3xl border border-emerald-100 bg-emerald-50/60 p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm">
              <Wrench size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {t('blog.related_tools', { defaultValue: 'Related tools' })}
              </h2>
              <p className="text-sm text-slate-600">
                {t('blog.related_tools_desc', {
                  defaultValue: 'Use these ToolOrbit utilities to apply the workflow from this article.',
                })}
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {relatedTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.id}
                  to={tool.path}
                  className="group rounded-2xl border border-white bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <Icon size={18} />
                    </div>
                    <span className="text-sm font-bold text-slate-900 group-hover:text-emerald-700">
                      {t(`tools.${tool.id}.name`, { defaultValue: tool.name })}
                    </span>
                  </div>
                  <p className="line-clamp-2 text-xs leading-5 text-slate-500">
                    {t(`tools.${tool.id}.description`, { defaultValue: tool.description })}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <div className="border-t border-slate-100 pt-12 mt-12 text-center">
        <h3 className="text-xl font-bold text-slate-900 mb-4">{t('blog.shareTitle') || 'Share this article'}</h3>
        <div className="flex justify-center gap-4">
          <button 
            onClick={() => {
              const shareUrl = window.location.href;
              const shareText = title;
              window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank', 'noopener,noreferrer');
            }}
            className="px-6 py-3 bg-[#1DA1F2] text-white font-bold rounded-xl hover:bg-[#1a8cd8] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
            {t('blog.shareTwitter') || 'Share on Twitter'}
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
