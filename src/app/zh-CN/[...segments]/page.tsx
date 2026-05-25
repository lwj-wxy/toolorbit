import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import fs from 'fs/promises';
import { notFound, redirect } from 'next/navigation';
import path from 'path';
import JsonLd from '../../../components/JsonLd';
import ScopedI18nProvider from '../../../components/ScopedI18nProvider';
import ToolPageClient from '../../../components/ToolPageClient';
import ToolSEOCard from '../../../components/ToolSEOCard';
import ToolSearchContent from '../../../components/ToolSearchContent';
import { BLOG_POSTS } from '../../../constants/blogData';
import { AUTHORS, getAuthorByPath } from '../../../data/authors';
import { SEO_CONTENT_PATHS, getSeoContentPage } from '../../../data/seoContent';
import { TOOLS } from '../../../data/tools';
import { getTotalBlogPages, normalizeBlogPage } from '../../../lib/blog-pagination';
import { CATEGORY_BY_SLUG, CATEGORY_SLUGS } from '../../../lib/category-paths';
import { getToolSectionCategoryPath, toolSectionStaticParams } from '../../../lib/tool-section-paths';
import {
  allToolsMetadata,
  authorMetadata,
  blogListMetadata,
  blogPostMetadata,
  categoryMetadata,
  homeMetadata,
  staticPageMetadata,
  seoContentMetadata,
  toolMetadata,
} from '../../../lib/metadata';
import {
  allToolsPageJsonLd,
  authorPageJsonLd,
  blogListJsonLd,
  blogPostJsonLd,
  categoryPageJsonLd,
  homePageJsonLd,
  seoContentPageJsonLd,
  staticPageJsonLd,
  toolJsonLd,
} from '../../../lib/structured-data';
import { FALLBACK_TOOL_GUIDE_PATHS, INFO_CARD_TOOL_KEYS } from '../../../lib/tool-page-content';
import { ComponentType } from 'react';
import dynamic from 'next/dynamic';

const Home = dynamic(() => import('../../../views/Home')) as ComponentType<{ initialCategory?: string }>;
const BlogList = dynamic(() => import('../../../views/BlogList')) as ComponentType<{ initialPage?: number }>;
const BlogPost = dynamic(() => import('../../../views/BlogPost')) as ComponentType<{ slug: string; initialMarkdown: string }>;
const About = dynamic(() => import('../../../views/About')) as ComponentType;
const Privacy = dynamic(() => import('../../../views/Privacy')) as ComponentType;
const Terms = dynamic(() => import('../../../views/Terms')) as ComponentType;
const AllToolsPage = dynamic(() => import('../../../views/AllToolsPage')) as ComponentType<{ locale: string }>;
const AuthorPage = dynamic(() => import('../../../views/AuthorPage')) as ComponentType<{ authorId?: string; locale?: typeof LOCALE }>;
const SeoContentPageView = dynamic(() => import('../../../views/SeoContentPage')) as ComponentType<{ page: unknown; locale: string }>;

type PageProps = {
  params: Promise<{ segments?: string[] }>;
};

const LOCALE = 'zh-CN' as const;

function basePathFromSegments(segments: string[] = []) {
  return segments.length ? `/${segments.join('/')}` : '/';
}

function zhPage(children: ReactNode) {
  return <ScopedI18nProvider language="zh">{children}</ScopedI18nProvider>;
}

function allChineseSegments() {
  return [
    [],
    ['blog'],
    ['tools'],
    ['about'],
    ['privacy'],
    ['terms'],
    ...AUTHORS.map((author) => author.url.split('/').filter(Boolean)),
    ...SEO_CONTENT_PATHS.map((seoPath) => seoPath.split('/').filter(Boolean)),
    ...Array.from({ length: getTotalBlogPages() - 1 }, (_, index) => ['blog', 'page', String(index + 2)]),
    ...Object.values(CATEGORY_SLUGS).map((slug) => ['category', slug]),
    ...toolSectionStaticParams().map(({ section }) => ['tools', section]),
    ...TOOLS.map((tool) => tool.path.split('/').filter(Boolean)),
    ...BLOG_POSTS.map((post) => ['blog', post.slug]),
  ];
}

export function generateStaticParams() {
  return allChineseSegments()
    .filter((segments) => segments.length > 0)
    .map((segments) => ({ segments }));
}

export const dynamicParams = false;
export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { segments = [] } = await params;
  const basePath = basePathFromSegments(segments);

  if (basePath === '/') return homeMetadata(LOCALE);
  if (basePath === '/blog') return blogListMetadata(LOCALE);
  if (basePath === '/tools') return allToolsMetadata(LOCALE);
  if (basePath === '/about') return staticPageMetadata('about', LOCALE);
  if (basePath === '/privacy') return staticPageMetadata('privacy', LOCALE);
  if (basePath === '/terms') return staticPageMetadata('terms', LOCALE);
  const author = getAuthorByPath(basePath);
  if (author) return authorMetadata(author.id, LOCALE);
  if (SEO_CONTENT_PATHS.includes(basePath)) return seoContentMetadata(basePath, LOCALE);

  if (segments[0] === 'blog' && segments[1] === 'page' && segments[2]) {
    const page = normalizeBlogPage(segments[2]);
    return page && page <= getTotalBlogPages() ? blogListMetadata(LOCALE, page) : {};
  }

  if (segments[0] === 'blog' && segments[1]) {
    return BLOG_POSTS.some((post) => post.slug === segments[1])
      ? blogPostMetadata(segments[1], LOCALE)
      : {};
  }

  if (segments[0] === 'category' && segments[1]) {
    if (segments[1] === 'fun-tools') {
      return {};
    }

    const category = CATEGORY_BY_SLUG[segments[1]];
    return category ? categoryMetadata(category, LOCALE) : {};
  }

  if (segments[0] === 'tools' && segments[1] && !segments[2]) {
    if (segments[1] === 'fun') {
      return {};
    }

    const categoryPath = getToolSectionCategoryPath(segments[1]);

    if (!categoryPath) {
      notFound();
    }

    redirect(`/zh-CN${categoryPath}`);
  }

  if (segments[0] === 'tools' && segments[1] && !segments[2]) {
    if (segments[1] === 'fun') {
      redirect('/zh-CN/tools');
    }
  }

  if (segments[0] === 'tools' && segments[1] && segments[2]) {
    if (segments[1] === 'fun') {
      return {};
    }

    return TOOLS.some((tool) => tool.path === basePath) ? toolMetadata(basePath, LOCALE) : {};
  }

  return {};
}

async function readInitialMarkdown(slug: string) {
  const articlePath = path.join(process.cwd(), 'public', 'articles', 'zh', `${slug}.md`);

  try {
    return await fs.readFile(articlePath, 'utf-8');
  } catch {
    return '';
  }
}

export default async function Page({ params }: PageProps) {
  const { segments = [] } = await params;
  const basePath = basePathFromSegments(segments);

  if (basePath === '/') {
    return zhPage(
      <>
        <JsonLd id="structured-data-home-zh" data={homePageJsonLd(LOCALE)} />
        <Home />
      </>,
    );
  }

  if (basePath === '/blog') {
    return zhPage(
      <>
        <JsonLd id="structured-data-blog-list-zh" data={blogListJsonLd(LOCALE)} />
        <BlogList />
      </>,
    );
  }

  if (basePath === '/tools') {
    return zhPage(
      <>
        <JsonLd id="structured-data-all-tools-zh" data={allToolsPageJsonLd(LOCALE)} />
        <AllToolsPage locale={LOCALE} />
      </>,
    );
  }

  if (basePath === '/about') {
    return zhPage(
      <>
        <JsonLd id="structured-data-about-zh" data={staticPageJsonLd('about', LOCALE)} />
        <About />
      </>,
    );
  }

  if (basePath === '/privacy') {
    return zhPage(
      <>
        <JsonLd id="structured-data-privacy-zh" data={staticPageJsonLd('privacy', LOCALE)} />
        <Privacy />
      </>,
    );
  }

  if (basePath === '/terms') {
    return zhPage(
      <>
        <JsonLd id="structured-data-terms-zh" data={staticPageJsonLd('terms', LOCALE)} />
        <Terms />
      </>,
    );
  }

  const author = getAuthorByPath(basePath);
  if (author) {
    return zhPage(
      <>
        <JsonLd id={`structured-data-author-${author.id}-zh`} data={authorPageJsonLd(author.id, LOCALE)} />
        <AuthorPage authorId={author.id} locale={LOCALE} />
      </>,
    );
  }

  if (SEO_CONTENT_PATHS.includes(basePath)) {
    const page = getSeoContentPage(basePath);

    if (!page) {
      notFound();
    }

    return zhPage(
      <>
        <JsonLd id={`structured-data-seo-content-${segments.join('-')}-zh`} data={seoContentPageJsonLd(basePath, LOCALE)} />
        <SeoContentPageView page={page} locale="zh" />
      </>,
    );
  }

  if (segments[0] === 'blog' && segments[1] === 'page' && segments[2]) {
    const page = normalizeBlogPage(segments[2]);

    if (page === 1) {
      redirect('/zh-CN/blog');
    }

    if (!page || page > getTotalBlogPages()) {
      notFound();
    }

    return zhPage(
      <>
        <JsonLd id={`structured-data-blog-list-page-${page}-zh`} data={blogListJsonLd(LOCALE, page)} />
        <BlogList initialPage={page} />
      </>,
    );
  }

  if (segments[0] === 'blog' && segments[1]) {
    const slug = segments[1];

    if (!BLOG_POSTS.some((post) => post.slug === slug)) {
      notFound();
    }

    const initialMarkdown = await readInitialMarkdown(slug);

    return zhPage(
      <>
        <JsonLd id={`structured-data-blog-${slug}`} data={blogPostJsonLd(slug, LOCALE)} />
        <BlogPost slug={slug} initialMarkdown={initialMarkdown} />
      </>,
    );
  }

  if (segments[0] === 'category' && segments[1]) {
    if (segments[1] === 'fun-tools') {
      redirect('/zh-CN/tools');
    }

    const category = CATEGORY_BY_SLUG[segments[1]];

    if (!category) {
      notFound();
    }

    return zhPage(
      <>
        <JsonLd id={`structured-data-category-${segments[1]}-zh`} data={categoryPageJsonLd(category, LOCALE)} />
        <Home initialCategory={category} />
      </>,
    );
  }

  if (segments[0] === 'tools' && segments[1] && segments[2]) {
    if (segments[1] === 'fun') {
      redirect('/zh-CN/tools');
    }

    if (!TOOLS.some((tool) => tool.path === basePath)) {
      notFound();
    }

    return zhPage(
      <>
        <JsonLd id={`structured-data-tool-${segments[2]}`} data={toolJsonLd(basePath, LOCALE)} />
        <ToolPageClient path={basePath} />
        {INFO_CARD_TOOL_KEYS[basePath] ? <ToolSEOCard toolKey={INFO_CARD_TOOL_KEYS[basePath]} /> : null}
        {FALLBACK_TOOL_GUIDE_PATHS.has(basePath) ? <ToolSearchContent path={basePath} /> : null}
      </>,
    );
  }

  notFound();
}
