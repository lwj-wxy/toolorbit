import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import fs from 'fs/promises';
import { notFound } from 'next/navigation';
import path from 'path';
import JsonLd from '../../../components/JsonLd';
import ScopedI18nProvider from '../../../components/ScopedI18nProvider';
import ToolPageClient from '../../../components/ToolPageClient';
import ToolSEOCard from '../../../components/ToolSEOCard';
import ToolSearchContent from '../../../components/ToolSearchContent';
import { BLOG_POSTS } from '../../../constants/blogData';
import { TOOLS } from '../../../data/tools';
import { CATEGORY_BY_SLUG, CATEGORY_SLUGS } from '../../../lib/category-paths';
import {
  blogListMetadata,
  blogPostMetadata,
  categoryMetadata,
  homeMetadata,
  staticPageMetadata,
  toolMetadata,
} from '../../../lib/metadata';
import { blogPostJsonLd, toolJsonLd } from '../../../lib/structured-data';
import { FALLBACK_TOOL_GUIDE_PATHS, INFO_CARD_TOOL_KEYS } from '../../../lib/tool-page-content';
import About from '../../../views/About';
import BlogList from '../../../views/BlogList';
import BlogPost from '../../../views/BlogPost';
import Home from '../../../views/Home';
import Privacy from '../../../views/Privacy';
import Terms from '../../../views/Terms';

type PageProps = {
  params: Promise<{ segments?: string[] }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const LOCALE = 'zh-CN' as const;

function searchParamsToString(paramsValue?: Record<string, string | string[] | undefined>) {
  const initialSearchParams = new URLSearchParams();

  Object.entries(paramsValue || {}).forEach(([key, value]) => {
    if (typeof value === 'string') {
      initialSearchParams.set(key, value);
      return;
    }

    value?.forEach((item) => {
      initialSearchParams.append(key, item);
    });
  });

  return initialSearchParams.toString();
}

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
    ['about'],
    ['privacy'],
    ['terms'],
    ...Object.values(CATEGORY_SLUGS).map((slug) => ['category', slug]),
    ...TOOLS.map((tool) => tool.path.split('/').filter(Boolean)),
    ...BLOG_POSTS.map((post) => ['blog', post.slug]),
  ];
}

export function generateStaticParams() {
  return allChineseSegments().map((segments) => ({ segments }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { segments = [] } = await params;
  const basePath = basePathFromSegments(segments);

  if (basePath === '/') return homeMetadata(LOCALE);
  if (basePath === '/blog') return blogListMetadata(LOCALE);
  if (basePath === '/about') return staticPageMetadata('about', LOCALE);
  if (basePath === '/privacy') return staticPageMetadata('privacy', LOCALE);
  if (basePath === '/terms') return staticPageMetadata('terms', LOCALE);

  if (segments[0] === 'blog' && segments[1]) {
    return BLOG_POSTS.some((post) => post.slug === segments[1])
      ? blogPostMetadata(segments[1], LOCALE)
      : {};
  }

  if (segments[0] === 'category' && segments[1]) {
    const category = CATEGORY_BY_SLUG[segments[1]];
    return category ? categoryMetadata(category, LOCALE) : {};
  }

  if (segments[0] === 'tools' && segments[1] && segments[2]) {
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

export default async function Page({ params, searchParams }: PageProps) {
  const { segments = [] } = await params;
  const basePath = basePathFromSegments(segments);
  const initialSearch = searchParamsToString(await searchParams);

  if (basePath === '/') {
    return zhPage(<Home initialSearch={initialSearch} />);
  }

  if (basePath === '/blog') {
    return zhPage(<BlogList />);
  }

  if (basePath === '/about') {
    return zhPage(<About />);
  }

  if (basePath === '/privacy') {
    return zhPage(<Privacy />);
  }

  if (basePath === '/terms') {
    return zhPage(<Terms />);
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
    const category = CATEGORY_BY_SLUG[segments[1]];

    if (!category) {
      notFound();
    }

    return zhPage(<Home initialSearch={initialSearch} initialCategory={category} />);
  }

  if (segments[0] === 'tools' && segments[1] && segments[2]) {
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
