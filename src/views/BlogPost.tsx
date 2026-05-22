'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Link } from '../lib/navigation';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, Tag, Wrench, ArrowLeft, ChevronRight } from 'lucide-react';
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

  const post = BLOG_POSTS.find((p) => p.slug === slug);
  const author = getAuthorById(post?.authorId);

  useEffect(() => {
    if (!slug) return;
    const lang = i18n.language && i18n.language.startsWith('zh') ? 'zh' : 'en';
    const cacheKey = `${lang}/${slug}`;

    if (initialMarkdown) {
      markdownCache.set(cacheKey, initialMarkdown);
    }

    if (markdownCache.has(cacheKey)) {
      setMarkdown(markdownCache.get(cacheKey)!);
      return;
    }

    fetch(`/articles/${cacheKey}.md`)
      .then((res) => {
        if (!res.ok) {
          return t(`blog.posts.${slug}.content`);
        }
        return res.text();
      })
      .then((text) => {
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
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-7xl font-bold text-slate-200 dark:text-slate-800">404</p>
          <p className="mt-4 text-slate-500">Post not found</p>
          <Link
            to="/blog"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-600 hover:text-cyan-700 dark:text-cyan-400"
          >
            <ArrowLeft size={16} />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const relatedPosts = BLOG_POSTS.filter((p) => p.slug !== post.slug)
    .sort((a, b) => {
      if (a.category === post.category && b.category !== post.category) return -1;
      if (a.category !== post.category && b.category === post.category) return 1;
      return 0;
    })
    .slice(0, 3);

  const relatedTools = (BLOG_RELATED_TOOLS[slug] || [])
    .map((path) => TOOLS.find((tool) => tool.path === path))
    .filter((tool) => tool && !tool.isNoIndex) as typeof TOOLS;

  const title = t(`blog.posts.${post.slug}.title`);
  const readingTime = Math.max(3, Math.ceil(markdown.length / 800));

  return (
    <article className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-2 text-sm font-medium text-slate-400 dark:text-slate-500">
        <Link to="/" className="flex-shrink-0 transition-colors hover:text-cyan-600 dark:hover:text-cyan-400">
          {t('common.nav_home') || 'Home'}
        </Link>
        <span className="flex-shrink-0 text-slate-300 dark:text-slate-700">/</span>
        <Link to="/blog" className="flex-shrink-0 transition-colors hover:text-cyan-600 dark:hover:text-cyan-400">
          {t('blog.nav') || 'Blog'}
        </Link>
        <span className="flex-shrink-0 text-slate-300 dark:text-slate-700">/</span>
        <span className="inline-block max-w-[200px] flex-shrink-0 truncate text-slate-700 dark:text-slate-300 sm:max-w-none">
          {title}
        </span>
      </nav>

      {/* Article Header */}
      <header className="mb-10">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-cyan-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300">
            <Tag size={13} />
            {t(`blog.categories.${post.category.toLowerCase()}`, { defaultValue: post.category })}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
            <Calendar size={13} />
            {post.date}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
            <Clock size={13} />
            {readingTime} min read
          </span>
        </div>

        <h1 className="max-w-3xl text-2xl font-bold leading-tight text-slate-900 dark:text-slate-100 sm:text-3xl lg:text-4xl">
          {title}
        </h1>

        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-500 dark:text-slate-400">
          {t(`blog.posts.${post.slug}.summary`, { defaultValue: '' })}
        </p>

        {/* Author row */}
        <div className="mt-6 flex flex-col gap-4 border-y border-slate-100 py-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-sm font-bold text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300">
              {author.avatarInitials}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{author.name}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">{author.bio}</p>
            </div>
          </div>
          <Link
            to={author.url}
            className="inline-flex flex-shrink-0 items-center gap-1.5 self-start rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-cyan-200 hover:text-cyan-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-cyan-800 dark:hover:text-cyan-400"
          >
            Author profile
          </Link>
        </div>
      </header>

      {/* Main content + sidebar */}
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        {/* Article content */}
        <div className="min-w-0">
          {/* Featured image */}
          <div className="relative mb-8 aspect-[2/1] overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
            <Image
              src={post.image}
              alt={title}
              fill
              priority
              sizes="(min-width: 1024px) 780px, 100vw"
              className="object-cover"
            />
          </div>

          {/* Markdown body */}
          {markdown ? (
            <div
              className="prose prose-slate max-w-none
                dark:prose-invert
                prose-headings:scroll-mt-24 prose-headings:font-bold prose-headings:tracking-tight
                prose-h2:mt-10 prose-h2:border-t prose-h2:border-slate-100 prose-h2:pt-8 prose-h2:text-xl prose-h2:leading-tight dark:prose-h2:border-slate-800 sm:prose-h2:text-2xl
                prose-h3:mt-8 prose-h3:text-lg prose-h3:leading-snug sm:prose-h3:text-xl
                prose-p:text-[15px] prose-p:leading-7 prose-p:text-slate-600 dark:prose-p:text-slate-300
                prose-li:text-[15px] prose-li:leading-7 prose-li:text-slate-600 dark:prose-li:text-slate-300
                prose-img:rounded-lg prose-img:border prose-img:border-slate-200 dark:prose-img:border-slate-800
                prose-strong:text-slate-900 dark:prose-strong:text-slate-100
                prose-a:font-semibold prose-a:text-cyan-600 prose-a:no-underline hover:prose-a:text-cyan-700 hover:prose-a:underline dark:prose-a:text-cyan-400 dark:hover:prose-a:text-cyan-300
                prose-blockquote:rounded-r-lg prose-blockquote:border-l-[3px] prose-blockquote:border-cyan-400 prose-blockquote:bg-cyan-50/60 prose-blockquote:px-5 prose-blockquote:py-2 prose-blockquote:text-[15px] prose-blockquote:not-italic prose-blockquote:text-slate-600 dark:prose-blockquote:bg-cyan-950/20 dark:prose-blockquote:text-slate-300
                prose-code:rounded-md prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:font-medium prose-code:text-cyan-700 prose-code:before:content-none prose-code:after:content-none dark:prose-code:bg-slate-800 dark:prose-code:text-cyan-300
                prose-pre:rounded-lg prose-pre:border prose-pre:border-slate-200 prose-pre:bg-slate-50 prose-pre:text-sm dark:prose-pre:border-slate-800 dark:prose-pre:bg-slate-950
                prose-hr:border-slate-100 dark:prose-hr:border-slate-800"
            >
              <MarkdownContent markdown={markdown} />
            </div>
          ) : (
            <div className="flex justify-center py-20">
              <div className="flex animate-pulse items-center gap-2 text-sm text-slate-400">
                <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600" />
                <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600" />
                <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600" />
                <span className="ml-1 font-medium">Loading article...</span>
              </div>
            </div>
          )}

          {/* Share */}
          <div className="mt-12 border-t border-slate-100 pt-8 dark:border-slate-800">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {t('blog.shareTitle') || 'Share this article'}
            </p>
            <button
              onClick={() => {
                const shareUrl = window.location.href;
                window.open(
                  `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`,
                  '_blank',
                  'noopener,noreferrer',
                );
              }}
              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
              Share on X
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-5 lg:sticky lg:top-24">
          {/* Post meta card */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">About this article</p>
            <div className="mt-4 space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400">
                  <Tag size={15} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {t(`blog.categories.${post.category.toLowerCase()}`, { defaultValue: post.category })}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Topic</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  <Clock size={15} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{readingTime} min read</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {markdown.length > 2000 ? 'In-depth guide' : 'Focused article'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Related tools */}
          {relatedTools.length > 0 && (
            <div className="rounded-xl border border-cyan-100 bg-cyan-50/50 p-5 shadow-sm dark:border-cyan-950/50 dark:bg-cyan-950/15">
              <div className="mb-4 flex items-center gap-2">
                <Wrench size={16} className="text-cyan-600 dark:text-cyan-400" />
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {t('blog.related_tools', { defaultValue: 'Related tools' })}
                </p>
              </div>
              <div className="space-y-2.5">
                {relatedTools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Link
                      key={tool.id}
                      to={tool.path}
                      className="group flex items-start gap-3 rounded-lg border border-white/80 bg-white/80 p-3 transition-colors hover:border-cyan-200 hover:bg-white dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-cyan-900 dark:hover:bg-slate-900"
                    >
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400">
                        <Icon size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 transition-colors group-hover:text-cyan-700 dark:text-slate-100 dark:group-hover:text-cyan-400">
                          {t(`tools.${tool.id}.name`, { defaultValue: tool.name })}
                        </p>
                        <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                          {t(`tools.${tool.id}.description`, { defaultValue: tool.description })}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Back to blog link */}
          <Link
            to="/blog"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400"
          >
            <ArrowLeft size={15} />
            Back to all articles
          </Link>
        </aside>
      </div>

      {/* Related posts */}
      <section className="mt-14 border-t border-slate-100 pt-10 dark:border-slate-800">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
              Keep reading
            </p>
            <h2 className="mt-1.5 text-xl font-bold text-slate-900 dark:text-slate-100">
              {t('blog.related_posts') || 'Related Articles'}
            </h2>
          </div>
          <Link
            to="/blog"
            className="hidden items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:border-cyan-200 hover:text-cyan-700 dark:border-slate-800 dark:text-slate-400 dark:hover:border-cyan-800 dark:hover:text-cyan-400 sm:inline-flex"
          >
            View all
            <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {relatedPosts.map((related) => (
            <Link
              key={related.slug}
              to={`/blog/${related.slug}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-slate-100 dark:bg-slate-800">
                <Image
                  src={related.image}
                  alt={t(`blog.posts.${related.slug}.title`)}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-4">
                <span className="text-xs font-semibold uppercase tracking-wide text-cyan-600 dark:text-cyan-400">
                  {t(`blog.categories.${related.category.toLowerCase()}`, { defaultValue: related.category })}
                </span>
                <h3 className="mt-1 line-clamp-2 text-sm font-bold leading-snug text-slate-900 transition-colors group-hover:text-cyan-700 dark:text-slate-100 dark:group-hover:text-cyan-400">
                  {t(`blog.posts.${related.slug}.title`)}
                </h3>
                <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">
                  {t(`blog.posts.${related.slug}.summary`)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
};

export default BlogPost;
