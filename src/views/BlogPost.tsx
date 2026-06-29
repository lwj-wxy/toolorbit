'use client';

import { useState, useEffect } from 'react';
import type { MouseEvent } from 'react';
import dynamic from 'next/dynamic';
import { Link } from '../lib/navigation';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { BLOG_POSTS } from '../constants/blogData';
import { createHeadingId, extractMarkdownH2Headings } from '../lib/markdown-headings';
import type { MarkdownHeading } from '../lib/markdown-headings';

interface BlogPostProps {
  slug: string;
  initialMarkdown?: string;
}

const MarkdownLoading = () => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-center py-10 text-sm font-medium text-slate-400">
      {t('blog.loading_article', { defaultValue: 'Loading article...' })}
    </div>
  );
};

const MarkdownContent = dynamic(() => import('../components/MarkdownContent'), {
  loading: () => <MarkdownLoading />,
});

const markdownCache = new Map<string, string>();
const ARTICLE_ANCHOR_OFFSET = 88;

const getCurrentHashHeadingId = () => {
  const rawHash = window.location.hash.slice(1);
  if (!rawHash) return '';

  try {
    return decodeURIComponent(rawHash);
  } catch {
    return rawHash;
  }
};

const findHeadingElement = (heading: MarkdownHeading) => {
  const targetById = document.getElementById(heading.id);
  if (targetById) return targetById;

  const baseHeadingId = createHeadingId(heading.text);
  const renderedHeadings = Array.from(document.querySelectorAll<HTMLElement>('.prose h2'));

  return renderedHeadings.find((element) => createHeadingId(element.textContent || '') === baseHeadingId) || null;
};

const scrollHeadingIntoPosition = (targetHeading: HTMLElement) => {
  const targetTop = Math.max(targetHeading.getBoundingClientRect().top + window.scrollY - ARTICLE_ANCHOR_OFFSET, 0);

  window.scrollTo({ top: targetTop, behavior: 'auto' });
  document.documentElement.scrollTop = targetTop;
  document.body.scrollTop = targetTop;
};

const BlogPost: React.FC<BlogPostProps> = ({ slug, initialMarkdown = '' }) => {
  const { t, i18n } = useTranslation();
  const [markdown, setMarkdown] = useState<string>(initialMarkdown);
  const [activeHeadingId, setActiveHeadingId] = useState('');

  const post = BLOG_POSTS.find((p) => p.slug === slug);

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

  useEffect(() => {
    if (!markdown) return;

    const currentHeadingId = getCurrentHashHeadingId();
    if (!currentHeadingId) return;

    const hashHeading = extractMarkdownH2Headings(markdown).find((heading) => heading.id === currentHeadingId);
    if (!hashHeading) return;

    let retryCount = 0;
    let retryTimer: number | undefined;

    const scrollToHashHeading = () => {
      const targetHeading = findHeadingElement(hashHeading);

      if (targetHeading) {
        setActiveHeadingId(hashHeading.id);
        scrollHeadingIntoPosition(targetHeading);
        return;
      }

      retryCount += 1;
      if (retryCount <= 8) {
        retryTimer = window.setTimeout(scrollToHashHeading, 50);
      }
    };

    retryTimer = window.setTimeout(scrollToHashHeading, 0);

    return () => {
      if (retryTimer) {
        window.clearTimeout(retryTimer);
      }
    };
  }, [markdown]);

  if (!post) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-7xl font-bold text-slate-200 dark:text-slate-800">404</p>
          <p className="mt-4 text-slate-500">{t('blog.post_not_found', { defaultValue: 'Post not found' })}</p>
          <Link
            to="/blog"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-600 hover:text-cyan-700 dark:text-cyan-400"
          >
            <ArrowLeft size={16} />
            {t('blog.back_to_blog', { defaultValue: 'Back to Blog' })}
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

  const title = t(`blog.posts.${post.slug}.title`);
  const articleHeadings = markdown ? extractMarkdownH2Headings(markdown) : [];
  const handleHeadingClick = (event: MouseEvent<HTMLAnchorElement>, heading: MarkdownHeading) => {
    event.preventDefault();

    const targetHeading = findHeadingElement(heading);
    if (!targetHeading) return;

    setActiveHeadingId(heading.id);
    window.history.pushState(null, '', `#${heading.id}`);
    scrollHeadingIntoPosition(targetHeading);
  };

  return (
    <article className="mx-auto max-w-[1180px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
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

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_288px] lg:items-start">
        {/* Article content */}
        <div className="min-w-0">
          {/* Markdown body */}
          {markdown ? (
            <div
              className="prose prose-slate max-w-none
                dark:prose-invert
                prose-headings:scroll-mt-24 prose-headings:font-bold prose-headings:tracking-tight
                prose-h2:mt-10 prose-h2:flex prose-h2:items-center prose-h2:gap-3 prose-h2:border-t prose-h2:border-slate-100 prose-h2:pt-8 prose-h2:text-xl prose-h2:leading-tight prose-h2:before:block prose-h2:before:h-8 prose-h2:before:w-1 prose-h2:before:shrink-0 prose-h2:before:rounded-full prose-h2:before:bg-cyan-500 prose-h2:before:content-[''] dark:prose-h2:border-slate-800 sm:prose-h2:text-2xl
                prose-h3:mt-8 prose-h3:text-lg prose-h3:leading-snug sm:prose-h3:text-xl
                prose-p:text-[15px] prose-p:leading-7 prose-p:text-slate-600 dark:prose-p:text-slate-300
                prose-li:text-[15px] prose-li:leading-7 prose-li:text-slate-600 dark:prose-li:text-slate-300
                prose-img:rounded-lg prose-img:border prose-img:border-slate-200 dark:prose-img:border-slate-800
                prose-strong:text-slate-900 dark:prose-strong:text-slate-100
                prose-a:font-semibold prose-a:text-cyan-600 prose-a:no-underline hover:prose-a:text-cyan-700 hover:prose-a:underline dark:prose-a:text-cyan-400 dark:hover:prose-a:text-cyan-300
                prose-blockquote:rounded-r-lg prose-blockquote:border-l-[3px] prose-blockquote:border-cyan-400 prose-blockquote:bg-cyan-50/60 prose-blockquote:px-5 prose-blockquote:py-2 prose-blockquote:text-[15px] prose-blockquote:not-italic prose-blockquote:text-slate-600 dark:prose-blockquote:bg-cyan-950/20 dark:prose-blockquote:text-slate-300
                prose-code:before:content-none prose-code:after:content-none
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
                <span className="ml-1 font-medium">
                  {t('blog.loading_article', { defaultValue: 'Loading article...' })}
                </span>
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
              className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
              {t('blog.shareTwitter', { defaultValue: 'Share on X' })}
            </button>
          </div>
        </div>

        {articleHeadings.length > 0 && (
          <aside className="hidden self-start lg:sticky lg:top-[88px] lg:block" aria-label="Article table of contents">
            <nav className="scrollbar-hidden max-h-[calc(100vh-7rem)] overflow-y-auto border-l border-slate-200 pl-3 pr-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden dark:border-slate-800">
              <p className="mb-4 pl-3 text-base font-bold text-slate-950 dark:text-white">
                {i18n.language && i18n.language.startsWith('zh') ? '目录' : 'Contents'}
              </p>
              <div className="space-y-0.5">
                {articleHeadings.map((heading) => (
                  <a
                    key={heading.id}
                    href={`#${heading.id}`}
                    onClick={(event) => handleHeadingClick(event, heading)}
                    className={`block rounded-md border-l-2 px-3 py-2.5 text-sm font-medium leading-5 transition-colors ${
                      activeHeadingId === heading.id
                        ? 'border-cyan-500 bg-cyan-50/90 text-cyan-700 dark:border-cyan-400 dark:bg-cyan-950/25 dark:text-cyan-300'
                        : 'border-transparent text-slate-500 hover:border-cyan-200 hover:bg-slate-50 hover:text-cyan-700 dark:text-slate-400 dark:hover:border-cyan-800 dark:hover:bg-slate-900/70 dark:hover:text-cyan-300'
                    }`}
                  >
                    {heading.text}
                  </a>
                ))}
              </div>
            </nav>
          </aside>
        )}
      </div>

      <Link
        to="/blog"
        className="mt-6 inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition-colors hover:border-cyan-200 hover:text-cyan-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-cyan-800 dark:hover:text-cyan-400"
      >
        <ArrowLeft size={15} />
        {t('blog.back_to_all_articles', { defaultValue: 'Back to all articles' })}
      </Link>

      {/* Related posts */}
      <section className="mt-10 border-t border-slate-100 pt-8 dark:border-slate-800">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
              {t('blog.keep_reading', { defaultValue: 'Keep reading' })}
            </p>
            <h2 className="mt-1.5 text-xl font-bold text-slate-900 dark:text-slate-100">
              {t('blog.related_posts') || 'Related Articles'}
            </h2>
          </div>
          <Link
            to="/blog"
            className="hidden items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:border-cyan-200 hover:text-cyan-700 dark:border-slate-800 dark:text-slate-400 dark:hover:border-cyan-800 dark:hover:text-cyan-400 sm:inline-flex"
          >
            {t('blog.view_all', { defaultValue: 'View all' })}
            <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {relatedPosts.map((related) => (
            <Link
              key={related.slug}
              to={`/blog/${related.slug}`}
              className="group rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-cyan-200 hover:bg-cyan-50/30 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-cyan-900/70 dark:hover:bg-cyan-950/10"
            >
              <span className="text-xs font-semibold uppercase tracking-wide text-orange-700 dark:text-orange-300">
                {t(`blog.categories.${related.category.toLowerCase()}`, { defaultValue: related.category })}
              </span>
              <h3 className="mt-2 line-clamp-2 text-sm font-bold leading-snug text-slate-950 transition-colors group-hover:text-cyan-700 dark:text-white dark:group-hover:text-cyan-300">
                {t(`blog.posts.${related.slug}.title`)}
              </h3>
              <p className="mt-2 line-clamp-2 text-[13px] leading-6 text-slate-600 dark:text-slate-300">
                {t(`blog.posts.${related.slug}.summary`)}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-cyan-700 dark:text-cyan-300">
                {t('blog.readMore', { defaultValue: 'Read More' })}
                <ChevronRight size={13} />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
};

export default BlogPost;
