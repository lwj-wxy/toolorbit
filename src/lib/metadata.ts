import type { Metadata } from 'next';
import { BLOG_POSTS } from '../constants/blogData';
import { TOOLS, type Category } from '../data/tools';
import en from '../locales/en.json';
import { getCategoryPath } from './category-paths';

export const SITE_URL = 'https://toolorbit.site';
export const SITE_NAME = 'ToolOrbit';
const DEFAULT_DESCRIPTION =
  'Free browser-based tools for developers, creators, ecommerce operators, PDF workflows, image processing, and AI-assisted productivity.';

const STATIC_PAGE_DESCRIPTIONS: Record<'about' | 'privacy' | 'terms', string> = {
  about:
    'Learn how ToolOrbit builds fast, privacy-conscious online tools for developers, creators, and everyday digital workflows.',
  privacy:
    'Read ToolOrbit privacy practices, including local-first browser processing, analytics, advertising, and contact information handling.',
  terms:
    'Review the ToolOrbit terms of service for using free online tools, generated outputs, external links, and platform limitations.',
};

export function readPath(source: any, path: string): string | undefined {
  const value = path.split('.').reduce((current, key) => current?.[key], source);
  return typeof value === 'string' ? value : undefined;
}

function cleanTitle(value?: string, fallback = SITE_NAME) {
  const title = (value || fallback)
    .replace(new RegExp(`\\s*\\|\\s*${SITE_NAME}\\s*`, 'gi'), '')
    .replace(/\s+/g, ' ')
    .trim();
  return title || fallback;
}

function cleanDescription(value?: string, fallback = DEFAULT_DESCRIPTION) {
  const description = (value || fallback).replace(/\s+/g, ' ').trim();
  return description || fallback;
}

function expandShortToolDescription(description: string, toolName: string) {
  if (description.length >= 90) return description;
  return `${description} Use ${toolName} online in ToolOrbit with no installation, quick browser access, and a focused workflow for everyday productivity.`;
}

export function pageMetadata(title?: string, description?: string, path = '/'): Metadata {
  const url = `${SITE_URL}${path}`;
  const metadataTitle = cleanTitle(title);
  const metadataDescription = cleanDescription(description);
  const socialTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;

  return {
    title: metadataTitle,
    description: metadataDescription,
    applicationName: SITE_NAME,
    creator: SITE_NAME,
    publisher: SITE_NAME,
    keywords: [
      'online tools',
      'developer tools',
      'AI tools',
      'PDF tools',
      'image tools',
      'JSON formatter',
      'ToolOrbit',
    ],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: cleanTitle(socialTitle) === SITE_NAME ? SITE_NAME : `${metadataTitle} | ${SITE_NAME}`,
      description: metadataDescription,
      url,
      siteName: SITE_NAME,
      type: 'website',
      images: ['/og-image'],
    },
    twitter: {
      card: 'summary_large_image',
      title: cleanTitle(socialTitle) === SITE_NAME ? SITE_NAME : `${metadataTitle} | ${SITE_NAME}`,
      description: metadataDescription,
      images: ['/og-image'],
    },
  };
}

export function homeMetadata(): Metadata {
  return pageMetadata(
    'Free Online Tools for Developers and Creators',
    DEFAULT_DESCRIPTION,
    '/',
  );
}

export function staticPageMetadata(page: 'about' | 'privacy' | 'terms'): Metadata {
  const title = readPath(en, `${page}.title`);

  return pageMetadata(title, STATIC_PAGE_DESCRIPTIONS[page], `/${page}`);
}

export function blogListMetadata(): Metadata {
  return pageMetadata(
    readPath(en, 'blog.title') || 'Blog',
    'Practical guides for developer tools, secure workflows, image optimization, PDF productivity, ecommerce operations, and AI-assisted work.',
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
  const rawTitle = toolKey
    ? readPath(en, `tools.${toolKey}.seoTitle`) || readPath(en, `tools.${toolKey}.name`) || tool?.name
    : undefined;
  const rawDescription = toolKey
    ? readPath(en, `tools.${toolKey}.seoDesc`) || readPath(en, `tools.${toolKey}.description`) || tool?.description
    : undefined;
  const cleanedTitle = cleanTitle(rawTitle, tool?.name || SITE_NAME);
  const title = tool && cleanedTitle.length < 30 ? `${cleanedTitle} Online Tool` : rawTitle;

  const fallbackDescription = tool
    ? `Use ${cleanTitle(tool.name)} online for ${tool.description.toLowerCase()} No installation required.`
    : DEFAULT_DESCRIPTION;
  const description = tool
    ? expandShortToolDescription(cleanDescription(rawDescription, fallbackDescription), cleanedTitle)
    : rawDescription;

  return pageMetadata(title, description || fallbackDescription, path);
}

export function categoryMetadata(category: Category): Metadata {
  const name = readPath(en, `common.categories.${category}`) || category;
  const toolCount = TOOLS.filter((tool) => tool.category === category).length;

  return pageMetadata(
    `${name} Online Tools`,
    `Browse ${toolCount} ${name} in ToolOrbit. Find focused online tools for fast browser-based workflows with no installation required.`,
    getCategoryPath(category),
  );
}
