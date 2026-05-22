'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Link } from '../lib/navigation';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, Tag, FileText, Wrench, ShieldCheck } from 'lucide-react';
import { BLOG_POSTS } from '../constants/blogData';
import { BLOG_RELATED_TOOLS } from '../data/blogRelatedTools';
import { TOOLS } from '../data/tools';
import { getAuthorById } from '../data/authors';

interface BlogPostProps {
  slug: string;
  initialMarkdown?: string;
}

const MarkdownContent = dynamic(() => import('../components/MarkdownContent'), {
  loading: () => (
    <div className="flex justify-center py-10 text-sm font-medium text-slate-400">
      Rendering article...
    </div>
  ),
});

const markdownCache = new Map<string, string>();

const BlogPost: React.FC<BlogPostProps> = ({ slug, initialMarkdown = '' }) => {
  const { t, i18n } = useTranslation();
  const [markdown, setMarkdown] = useState<string>(initialMarkdown);

  const post = BLOG_POSTS.find(p => p.slug === slug);
  const author = getAuthorById(post?.authorId);

  useEffect(() => {
    if (!slug) return;
    const lang = i18n.language && i18n.language.startsWith('zh') ? 'zh' : 'en';
    const cacheKey = `${lang}/${slug}`;

    // Cache the server-provided initial markdown
    if (initialMarkdown) {
      markdownCache.set(cacheKey, initialMarkdown);
    }

    if (markdownCache.has(cacheKey)) {
      setMarkdown(markdownCache.get(cacheKey)!);
      return;
    }

    fetch(`/articles/${cacheKey}.md`)
      .then(res => {
        if (!res.ok) {
          return t(`blog.posts.${slug}.content`);
        }
        return res.text();
      })
      .then(text => {
        if (text === `blog.posts.${slug}.content`) {
          setMarkdown('');
        } else {
          markdownCache.set(cacheKey, text);
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
    .filter((tool) => tool && !tool.isNoIndex) as typeof TOOLS;

  const title = t(`blog.posts.${post.slug}.title`);
  // Estimate reading time based on markdown length
  const readingTime = Math.max(3, Math.ceil(markdown.length / 800));

  return (
    <article className="px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-7xl">
      <nav className="mb-8 flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-2 text-sm font-medium text-slate-500 dark:text-slate-400">
        <Link to="/" className="flex flex-shrink-0 items-center gap-1.5 transition-colors hover:text-emerald-600">
          {t('common.nav_home') || 'Home'}
        </Link>
        <span className="flex-shrink-0 text-slate-300 dark:text-slate-600">{"/"}</span>
        <Link to="/blog" className="flex-shrink-0 transition-colors hover:text-emerald-600">
          {t('blog.nav') || 'Blog'}
        </Link>
        <span className="flex-shrink-0 text-slate-300 dark:text-slate-600">{"/"}</span>
        <span className="inline-block max-w-[220px] flex-shrink-0 overflow-hidden text-ellipsis break-all text-slate-800 dark:text-slate-200 sm:max-w-none">
          {t(`blog.posts.${post.slug}.title`)}
        </span>
      </nav>

      <header className="mb-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <div className="min-w-0">
          <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 font-bold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300">
              <Tag size={14} />
              {t(`blog.categories.${post.category.toLowerCase()}`, { defaultValue: post.category })}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              <Calendar size={14} />
              {post.date}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              <Clock size={14} />
              {readingTime} min read
            </span>
          </div>

          <h1 className="max-w-4xl text-4xl font-black leading-tight text-slate-950 dark:text-white md:text-5xl lg:text-6xl">
            {title}
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            {t(`blog.posts.${post.slug}.summary`, { defaultValue: '' })}
          </p>

          <div className="mt-8 flex flex-col gap-4 border-y border-slate-200 py-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-black text-emerald-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-emerald-300">
                {author.avatarInitials}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-slate-950 dark:text-white">
                  {t('blog.editorial_byline', {
                    authorName: author.name,
                    defaultValue: `Written and maintained by ${author.name}`,
                  })}
                </p>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {t('blog.editorial_note', {
                    defaultValue: author.bio,
                  })}
                </p>
              </div>
            </div>
            <Link
              to={author.url}
              className="inline-flex flex-shrink-0 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-300"
            >
              <ShieldCheck size={16} />
              {t('blog.editorial_policy', { defaultValue: 'Author profile' })}
            </Link>
          </div>
        </div>

        <aside className="lg:pt-2">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
          <Image
                src={post.image}
                alt={title}
                fill
                priority
                sizes="(min-width: 1024px) 360px, 100vw"
                className="object-cover"
              />
            </div>
            <div className="grid grid-cols-3 divide-x divide-slate-200 border-t border-slate-200 text-center dark:divide-slate-800 dark:border-slate-800">
              <div className="p-4">
                <p className="text-[11px] font-bold uppercase text-slate-400">Type</p>
                <p className="mt-1 text-sm font-black text-slate-900 dark:text-slate-100">
                  {markdown.length > 2000 ? 'Guide' : 'Article'}
                </p>
              </div>
              <div className="p-4">
                <p className="text-[11px] font-bold uppercase text-slate-400">Read</p>
                <p className="mt-1 text-sm font-black text-slate-900 dark:text-slate-100">{readingTime} min</p>
              </div>
              <div className="p-4">
                <p className="text-[11px] font-bold uppercase text-slate-400">Topic</p>
                <p className="mt-1 truncate text-sm font-black text-slate-900 dark:text-slate-100">
                  {t(`blog.categories.${post.category.toLowerCase()}`, { defaultValue: post.category })}
                </p>
              </div>
            </div>
          </div>
        </aside>
      </header>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,780px)_320px] lg:items-start">
        <div className="min-w-0">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 bg-slate-50 px-5 py-3 dark:border-slate-800 dark:bg-slate-950/40">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
              <FileText size={14} className="text-emerald-600" />
              Article
            </div>
          </div>
          <div className="px-5 py-8 sm:px-8 lg:px-10">
            {markdown ? (
              <div className="prose prose-slate prose-lg max-w-none
                dark:prose-invert
                prose-headings:scroll-mt-24 prose-headings:text-slate-950 dark:prose-headings:text-slate-100 prose-headings:font-black
                prose-h2:mt-12 prose-h2:border-t prose-h2:border-slate-200 prose-h2:pt-8 prose-h2:text-2xl prose-h2:leading-tight dark:prose-h2:border-slate-800 sm:prose-h2:text-3xl
                prose-h3:mt-8 prose-h3:text-xl prose-h3:leading-snug sm:prose-h3:text-2xl
                prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-p:leading-8
                prose-li:text-slate-700 dark:prose-li:text-slate-300 prose-li:leading-7
                prose-img:rounded-lg prose-img:border prose-img:border-slate-200 dark:prose-img:border-slate-800
                prose-strong:text-slate-950 dark:prose-strong:text-slate-100
                prose-a:text-emerald-700 prose-a:font-bold prose-a:no-underline hover:prose-a:text-emerald-800 hover:prose-a:underline dark:prose-a:text-emerald-300
                prose-blockquote:rounded-r-lg prose-blockquote:border-l-4 prose-blockquote:border-emerald-500 prose-blockquote:bg-emerald-50/60 prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:text-slate-700 prose-blockquote:not-italic dark:prose-blockquote:bg-emerald-950/20 dark:prose-blockquote:text-slate-300
                prose-code:rounded prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-emerald-700 prose-code:before:content-none prose-code:after:content-none dark:prose-code:bg-slate-800 dark:prose-code:text-emerald-300
                prose-pre:rounded-lg prose-pre:border prose-pre:border-slate-800 prose-pre:bg-slate-950 prose-pre:text-slate-50">
                <MarkdownContent markdown={markdown} />
              </div>
            ) : (
              <div className="flex justify-center py-20">
                <div className="flex animate-pulse items-center space-x-2 text-slate-400">
                  <div className="h-2 w-2 rounded-full bg-slate-400"></div>
                  <div className="h-2 w-2 rounded-full bg-slate-400"></div>
                  <div className="h-2 w-2 rounded-full bg-slate-400"></div>
                  <span className="ml-2 font-medium">Loading article content...</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 border-t border-slate-200 pt-10 text-center dark:border-slate-800">
          <h3 className="mb-4 text-lg font-black text-slate-950 dark:text-white">{t('blog.shareTitle') || 'Share this article'}</h3>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                const shareUrl = window.location.href;
                const shareText = title;
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank', 'noopener,noreferrer');
              }}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[#1DA1F2] px-5 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#1a8cd8]"
            >
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
              {t('blog.shareTwitter') || 'Share on Twitter'}
            </button>
          </div>
        </div>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-bold uppercase text-slate-400">Reading context</p>
            <div className="mt-4 space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
                  <Tag size={16} />
                </div>
                <div>
                  <p className="font-bold text-slate-950 dark:text-white">
                    {t(`blog.categories.${post.category.toLowerCase()}`, { defaultValue: post.category })}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400">Topic area</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  <Clock size={16} />
                </div>
                <div>
                  <p className="font-bold text-slate-950 dark:text-white">{readingTime} min read</p>
                  <p className="text-slate-500 dark:text-slate-400">
                    {markdown.length > 2000 ? 'In-depth guide' : 'Focused article'}
                  </p>
                </div>
              </div>
            </div>
          </div>

      {relatedTools.length > 0 && (
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-5 shadow-sm dark:border-emerald-950/60 dark:bg-emerald-950/20">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white text-emerald-600 shadow-sm dark:bg-slate-900 dark:text-emerald-300">
              <Wrench size={20} />
            </div>
            <div>
                  <h2 className="text-lg font-black text-slate-950 dark:text-white">
                {t('blog.related_tools', { defaultValue: 'Related tools' })}
              </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
                {t('blog.related_tools_desc', {
                  defaultValue: 'Use these ToolOrbit utilities to apply the workflow from this article.',
                })}
              </p>
            </div>
          </div>
              <div className="space-y-3">
            {relatedTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.id}
                  to={tool.path}
                      className="group block rounded-lg border border-white bg-white p-4 shadow-sm transition-colors hover:border-emerald-200 hover:bg-emerald-50/60 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-900 dark:hover:bg-emerald-950/20"
                >
                  <div className="mb-3 flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-300">
                      <Icon size={18} />
                    </div>
                        <span className="text-sm font-bold text-slate-950 group-hover:text-emerald-700 dark:text-slate-100 dark:group-hover:text-emerald-300">
                      {t(`tools.${tool.id}.name`, { defaultValue: tool.name })}
                    </span>
                  </div>
                      <p className="line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    {t(`tools.${tool.id}.description`, { defaultValue: tool.description })}
                  </p>
                </Link>
              );
            })}
          </div>
            </div>
      )}
        </aside>

      </div>

      {/* Related Posts */}
      <div className="mt-14 border-t border-slate-200/80 pt-10 dark:border-slate-800">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase text-emerald-700 dark:text-emerald-300">Keep reading</p>
            <h3 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">{t('blog.related_posts') || 'Related Articles'}</h3>
          </div>
          <Link to="/blog" className="hidden rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/30 sm:inline-flex">
            {t('blog.nav') || 'Blog'}
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {relatedPosts.map(related => (
            <Link 
              key={related.slug}
              to={`/blog/${related.slug}`}
              className="group grid overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-colors hover:border-emerald-200 hover:bg-emerald-50/30 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-900 dark:hover:bg-emerald-950/10 sm:grid-cols-[180px_minmax(0,1fr)]"
            >
              <div className="relative min-h-48 overflow-hidden bg-slate-100 dark:bg-slate-800 sm:min-h-full">
                <Image
                  src={related.image} 
                  alt={t(`blog.posts.${related.slug}.title`)}
                  fill
                  sizes="(min-width: 768px) 180px, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="flex min-w-0 flex-col p-5">
                <span className="mb-2 text-xs font-bold uppercase text-emerald-700 dark:text-emerald-300">
                  {t(`blog.categories.${related.category.toLowerCase()}`, { defaultValue: related.category })}
                </span>
                <h4 className="mb-2 line-clamp-2 text-lg font-black leading-snug text-slate-950 transition-colors group-hover:text-emerald-700 dark:text-slate-100 dark:group-hover:text-emerald-300">
                  {t(`blog.posts.${related.slug}.title`)}
                </h4>
                <p className="line-clamp-3 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {t(`blog.posts.${related.slug}.summary`)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      </div>
    </article>
  );
};

export default BlogPost;
