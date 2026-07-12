import NextLink from 'next/link';
import { BookOpen, CheckCircle2, ShieldCheck, UserCheck } from 'lucide-react';
import { PUBLISHED_BLOG_POSTS } from '../constants/blogData';
import { getAuthorById } from '../data/authors';
import en from '../locales/en.json';
import { localizedPath, type Locale } from '../lib/i18n-routing';
import { readPath } from '../lib/metadata';

const localeSource = (_locale: Locale) => en;

const blogTitle = (slug: string, locale: Locale) => {
  return readPath(localeSource(locale), `blog.posts.${slug}.title`) || slug.replace(/-/g, ' ');
};

const blogSummary = (slug: string, locale: Locale) => {
  return readPath(localeSource(locale), `blog.posts.${slug}.summary`) || 'ToolOrbit practical guide.';
};

const blogCategory = (category: string, locale: Locale) => {
  return readPath(localeSource(locale), `blog.categories.${category.toLowerCase()}`) || category;
};

type AuthorPageProps = {
  authorId?: string;
  locale?: Locale;
};

const AuthorPage = ({ authorId, locale = 'en' }: AuthorPageProps) => {
  const isZh = false;
  const author = getAuthorById(authorId);
  const authoredPosts = PUBLISHED_BLOG_POSTS.filter((post) => getAuthorById(post.authorId).id === author.id);
  const candidatePosts = authoredPosts.length ? authoredPosts : PUBLISHED_BLOG_POSTS;
  const preferredSlugs = [
      'etsy-fee-complete-guide',
      'etsy-pricing-strategy-guide',
      'etsy-offsite-ads-explained',
      'etsy-international-selling-fees',
      'etsy-seo-title-tags-guide',
      'etsy-product-photography-conversion-guide',
  ];
  const featuredPosts = candidatePosts
    .sort((a, b) => {
      const aIndex = preferredSlugs.indexOf(a.slug);
      const bIndex = preferredSlugs.indexOf(b.slug);

      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .slice(0, 8);
  const highlights = [
    'Local-first browser workflow guidance',
    'Practical examples linked to usable tools',
    'Reviewed for clarity, limits, and user safety',
  ];

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10 rounded-lg border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-2xl font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
            {author.avatarInitials}
          </div>
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200">
              <UserCheck className="h-4 w-4" aria-hidden="true" />
              {isZh ? '维护者资料' : 'Editorial profile'}
            </div>
            <h1 className="text-4xl font-extrabold tracking-normal text-slate-950 dark:text-white">
              {author.name}
            </h1>
            <p className="mt-3 text-base font-semibold text-slate-700 dark:text-slate-200">{author.role}</p>
            <p className="mt-4 max-w-3xl leading-8 text-slate-600 dark:text-slate-300">{author.bio}</p>
          </div>
        </div>
      </header>

      <section className="mb-10 grid gap-4 md:grid-cols-3">
        {highlights.map((item) => (
          <div key={item} className="rounded-lg border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
            <CheckCircle2 className="mb-3 h-5 w-5 text-emerald-600" aria-hidden="true" />
            <p className="font-semibold leading-6 text-slate-800 dark:text-slate-100">{item}</p>
          </div>
        ))}
      </section>

      <section className="mb-10 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-5 flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-emerald-600" aria-hidden="true" />
          <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
            {isZh ? '内容复核标准' : 'Editorial Standards'}
          </h2>
        </div>
        <div className="space-y-4 leading-8 text-slate-700 dark:text-slate-300">
          {isZh ? (
            <>
              <p>
                ToolOrbit 指南优先解释具体的浏览器工作流，而不是泛泛而谈。文章会说明工具适合什么场景、有哪些限制，以及读者如何验证输出。
              </p>
              <p>
                内容围绕实用工具类别维护，包括 AI 工具、开发者工具、PDF 与图片工作流、电商费用复核、注重隐私的处理方式，以及日常网页发布任务。
              </p>
            </>
          ) : (
            <>
              <p>
                ToolOrbit guides prioritize concrete browser workflows over broad claims. Articles explain when a tool is useful, where it has limits, and how readers can verify the output.
              </p>
              <p>
                Content is maintained around practical utility categories: AI tools, developer tools, PDF and image workflows, ecommerce fee review, privacy-conscious processing, and everyday web publishing tasks.
              </p>
            </>
          )}
        </div>
        <NextLink href={localizedPath('/about', locale)} className="mt-5 inline-flex items-center gap-2 font-semibold text-emerald-700 dark:text-emerald-300">
          {isZh ? '了解 ToolOrbit 标准' : 'Read about ToolOrbit standards'}
        </NextLink>
      </section>

      <section>
        <div className="mb-5 flex items-center gap-3">
          <BookOpen className="h-6 w-6 text-emerald-600" aria-hidden="true" />
          <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
            {isZh ? '精选指南' : 'Featured Guides'}
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {featuredPosts.map((post) => (
            <NextLink
              key={post.slug}
              href={localizedPath(`/blog/${post.slug}`, locale)}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <span className="text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">{blogCategory(post.category, locale)}</span>
              <h3 className="mt-2 text-lg font-bold text-slate-950 dark:text-white">{blogTitle(post.slug, locale)}</h3>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{blogSummary(post.slug, locale)}</p>
            </NextLink>
          ))}
        </div>
      </section>
    </main>
  );
};

export default AuthorPage;
