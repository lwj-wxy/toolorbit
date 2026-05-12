import type { Metadata } from 'next';
import { BLOG_POSTS } from '../constants/blogData';
import { TOOLS } from '../data/tools';
import en from '../locales/en.json';

const SITE_URL = 'https://toolorbit.site';
const SITE_NAME = 'ToolOrbit';

function readPath(source: any, path: string): string | undefined {
  const value = path.split('.').reduce((current, key) => current?.[key], source);
  return typeof value === 'string' ? value : undefined;
}

export function pageMetadata(title?: string, description?: string, path = '/'): Metadata {
  const url = `${SITE_URL}${path}`;
  const metadataTitle = title || SITE_NAME;
  const socialTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;

  return {
    title: metadataTitle,
    description,
    alternates: {
      canonical: url,
      languages: {
        en: url,
        zh: url,
        'x-default': url,
      },
    },
    openGraph: {
      title: socialTitle,
      description,
      url,
      siteName: SITE_NAME,
      type: 'website',
      images: ['/og-image.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
      images: ['/og-image.png'],
    },
  };
}

export function homeMetadata(): Metadata {
  return pageMetadata(
    readPath(en, 'common.title') || SITE_NAME,
    readPath(en, 'common.description') || 'A collection of powerful online tools for developers and creators.',
    '/',
  );
}

export function staticPageMetadata(page: 'about' | 'privacy' | 'terms'): Metadata {
  const title = readPath(en, `${page}.title`);
  const description = page === 'about'
    ? readPath(en, 'common.description')
    : readPath(en, `${page}.lastUpdated`);

  return pageMetadata(title, description, `/${page}`);
}

export function blogListMetadata(): Metadata {
  return pageMetadata(
    readPath(en, 'blog.title') || 'Blog',
    readPath(en, 'blog.subtitle') || 'ToolOrbit Blog',
    '/blog',
  );
}

export function blogPostMetadata(slug: string): Metadata {
  const post = BLOG_POSTS.find((item) => item.slug === slug);
  const title = readPath(en, `blog.posts.${slug}.title`) || slug.replace(/-/g, ' ');
  const description = readPath(en, `blog.posts.${slug}.summary`) || 'ToolOrbit Blog article.';
  const metadata = pageMetadata(title, description, `/blog/${slug}`);

  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      type: 'article',
      images: post?.image ? [post.image] : metadata.openGraph?.images,
      publishedTime: post?.date,
    },
  };
}

export function toolMetadata(path: string): Metadata {
  const tool = TOOLS.find((item) => item.path === path);
  const toolKey = tool?.id;
  const title = toolKey
    ? readPath(en, `tools.${toolKey}.seoTitle`) || readPath(en, `tools.${toolKey}.name`) || tool?.name
    : undefined;
  const description = toolKey
    ? readPath(en, `tools.${toolKey}.seoDesc`) || readPath(en, `tools.${toolKey}.description`) || tool?.description
    : undefined;

  return pageMetadata(title, description, path);
}
