import NextLink from 'next/link';
import { BookOpen, CheckCircle2, ShieldCheck, UserCheck } from 'lucide-react';
import { BLOG_POSTS } from '../constants/blogData';
import { getAuthorById } from '../data/authors';
import en from '../locales/en.json';
import { readPath } from '../lib/metadata';

function blogTitle(slug: string) {
  return readPath(en, `blog.posts.${slug}.title`) || slug.replace(/-/g, ' ');
}

function blogSummary(slug: string) {
  return readPath(en, `blog.posts.${slug}.summary`) || 'ToolOrbit practical guide.';
}

type AuthorPageProps = {
  authorId?: string;
};

export default function AuthorPage({ authorId }: AuthorPageProps) {
  const author = getAuthorById(authorId);
  const authoredPosts = BLOG_POSTS.filter((post) => getAuthorById(post.authorId).id === author.id);
  const candidatePosts = authoredPosts.length ? authoredPosts : BLOG_POSTS;
  const preferredSlugs = [
      'why-use-json-formatter',
      'base64-encoding-deep-dive',
      'image-compression-techniques',
      'modern-pdf-workflow-efficiency',
      'ai-code-reviewer-guide',
      'secure-developer-tools-privacy',
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
              Editorial profile
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
        {[
          'Local-first browser workflow guidance',
          'Practical examples linked to usable tools',
          'Reviewed for clarity, limits, and user safety',
        ].map((item) => (
          <div key={item} className="rounded-lg border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
            <CheckCircle2 className="mb-3 h-5 w-5 text-emerald-600" aria-hidden="true" />
            <p className="font-semibold leading-6 text-slate-800 dark:text-slate-100">{item}</p>
          </div>
        ))}
      </section>

      <section className="mb-10 rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-5 flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-emerald-600" aria-hidden="true" />
          <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Editorial Standards</h2>
        </div>
        <div className="space-y-4 leading-8 text-slate-700 dark:text-slate-300">
          <p>
            ToolOrbit guides prioritize concrete browser workflows over broad claims. Articles explain when a tool is useful, where it has limits, and how readers can verify the output.
          </p>
          <p>
            Content is maintained around practical utility categories: developer tools, AI productivity, PDF and image workflows, ecommerce operations, privacy-conscious processing, and everyday web publishing tasks.
          </p>
        </div>
        <NextLink href="/about" className="mt-5 inline-flex items-center gap-2 font-semibold text-emerald-700 dark:text-emerald-300">
          Read about ToolOrbit standards
        </NextLink>
      </section>

      <section>
        <div className="mb-5 flex items-center gap-3">
          <BookOpen className="h-6 w-6 text-emerald-600" aria-hidden="true" />
          <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Featured Guides</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {featuredPosts.map((post) => (
            <NextLink
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <span className="text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">{post.category}</span>
              <h3 className="mt-2 text-lg font-bold text-slate-950 dark:text-white">{blogTitle(post.slug)}</h3>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{blogSummary(post.slug)}</p>
            </NextLink>
          ))}
        </div>
      </section>
    </main>
  );
}
