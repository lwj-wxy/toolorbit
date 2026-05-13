import type { Metadata } from 'next';
import { BLOG_POSTS } from '../constants/blogData';
import { TOOLS, type Category } from '../data/tools';
import en from '../locales/en.json';
import { getCategoryPath } from './category-paths';

export const SITE_URL = 'https://toolorbit.site';
export const SITE_NAME = 'ToolOrbit';
const DEFAULT_DESCRIPTION =
  'Free browser-based tools for developers, creators, ecommerce operators, PDF workflows, image processing, and AI-assisted productivity.';
const TITLE_TEXT_LIMIT = 48;
const DESCRIPTION_MIN_LENGTH = 120;

const STATIC_PAGE_DESCRIPTIONS: Record<'about' | 'privacy' | 'terms', string> = {
  about:
    'Learn how ToolOrbit builds fast, privacy-conscious online tools for developers, creators, and everyday digital workflows.',
  privacy:
    'Read ToolOrbit privacy practices, including local-first browser processing, analytics, advertising, and contact information handling.',
  terms:
    'Review the ToolOrbit terms of service for using free online tools, generated outputs, external links, and platform limitations.',
};

const BLOG_SEO_TITLE_OVERRIDES: Record<string, string> = {
  'xml-json-conversion-guide': 'XML and JSON Converters Guide',
  'xiaohongshu-copywriting-ai': 'Xiaohongshu AI Copywriting Guide',
  'why-text-diff-matters': 'Why Text Diff Matters at Work',
  'modern-pdf-workflow-efficiency': 'Modern PDF Workflow Guide',
  'ai-ecommerce-marketing-tips': 'AI E-commerce Marketing Tips',
  'secure-developer-tools-privacy': 'Local Processing for Developer Tools',
  'why-use-json-formatter': 'Why Developers Need JSON Formatters',
  'benefits-of-chinese-crypto-sm': 'SM2, SM3, and SM4 Crypto Guide',
  'morse-code-guide': 'Modern Morse Code Guide',
  'base64-encoding-deep-dive': 'Complete Base64 Encoding Guide',
  'color-theory-for-developers': 'Color Theory for Developers',
  'regex-mastery-guide': 'Regular Expressions Mastery Guide',
  'http-status-codes-explained': 'HTTP Status Codes Explained',
  'api-security-best-practices': 'API Security Best Practices',
  'ai-text-polisher-guide': 'AI Text Polisher Guide',
  'ai-translator-future': 'Contextual AI Translation Guide',
  'image-compression-techniques': 'Image Compression Techniques',
  'svg-to-png-conversion-tips': 'SVG to PNG Conversion Guide',
  'image-converter-web-formats': 'JPG, PNG, and WebP Formats Guide',
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

function fitTitle(value: string) {
  if (value.length <= TITLE_TEXT_LIMIT) return value;

  const compact = value
    .replace(/^Professional\s+/i, '')
    .replace(/^Complete\s+/i, '')
    .replace(/^Universal\s+/i, '')
    .replace(/^Online\s+/i, '')
    .replace(/^Free\s+/i, '')
    .replace(/^Safe\s+/i, '')
    .replace(/^Secure\s+/i, '')
    .replace(/^RFC 4122 Standard\s+/i, '')
    .replace(/^Next-Gen\s+/i, '')
    .replace(/\s*[-:]\s*(Secure|Safe|Fast|Accurate|Local|Private|Privately|Professional|Lightweight|Global|Custom|Online|Essential).*/i, '')
    .trim();

  if (compact && compact.length <= TITLE_TEXT_LIMIT) return compact;

  const beforeSeparator = value.split(/\s*[:|-]\s*/)[0]?.trim();
  if (beforeSeparator && beforeSeparator.length >= 18 && beforeSeparator.length <= TITLE_TEXT_LIMIT) {
    return beforeSeparator;
  }

  const words: string[] = [];
  for (const word of value.split(/\s+/)) {
    const next = [...words, word].join(' ');
    if (next.length > TITLE_TEXT_LIMIT) break;
    words.push(word);
  }

  return words.join(' ') || value.slice(0, TITLE_TEXT_LIMIT).trim();
}

function expandShortToolDescription(description: string, toolName: string) {
  if (description.length >= DESCRIPTION_MIN_LENGTH) return description;
  return `${description} Use ${toolName} online in ToolOrbit with no installation, quick browser access, and a focused workflow for everyday productivity.`;
}

function expandShortDescription(description: string) {
  if (description.length >= DESCRIPTION_MIN_LENGTH) return description;
  return `${description} Explore focused examples and related ToolOrbit browser tools for faster everyday workflows.`;
}

function conciseToolDescription(toolName: string, category?: Category) {
  const categoryName = category ? cleanTitle(readPath(en, `common.categories.${category}`), category) : 'online';
  return `Use ${toolName} for focused ${categoryName.toLowerCase()} workflows in your browser. Get practical controls, clear results, and no installation.`;
}

function conciseBlogDescription(title: string) {
  return `Read ${title} for practical workflow guidance, examples, and related ToolOrbit tools you can apply in browser-based tasks.`;
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
  const title = BLOG_SEO_TITLE_OVERRIDES[slug] || readPath(en, `blog.posts.${slug}.title`) || slug.replace(/-/g, ' ');
  const rawDescription = cleanDescription(readPath(en, `blog.posts.${slug}.summary`), 'ToolOrbit Blog article.');
  const description =
    rawDescription.length > 160
      ? conciseBlogDescription(title)
      : expandShortDescription(rawDescription);
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
  const toolNameTitle = cleanTitle(
    toolKey ? readPath(en, `tools.${toolKey}.name`) || tool?.name : tool?.name,
    tool?.name || SITE_NAME,
  );
  const title =
    tool && cleanedTitle.length < 30
      ? `${cleanedTitle} Online Tool`
      : fitTitle(cleanedTitle.length > TITLE_TEXT_LIMIT ? toolNameTitle : cleanedTitle);

  const fallbackDescription = tool
    ? `Use ${cleanTitle(tool.name)} online for ${tool.description.toLowerCase()} No installation required.`
    : DEFAULT_DESCRIPTION;
  const cleanedDescription = cleanDescription(rawDescription, fallbackDescription);
  const description = tool
    ? cleanedDescription.length > 160
      ? conciseToolDescription(toolNameTitle, tool.category)
      : expandShortToolDescription(cleanedDescription, toolNameTitle)
    : rawDescription;

  return pageMetadata(title, description || fallbackDescription, path);
}

export function categoryMetadata(category: Category): Metadata {
  const name = readPath(en, `common.categories.${category}`) || category;
  const toolCount = TOOLS.filter((tool) => tool.category === category).length;

  return pageMetadata(
    `${name} Online Tools`,
    `Browse ${toolCount} ${name} tools in ToolOrbit for fast browser-based workflows. Find focused utilities, examples, and no-install productivity helpers.`,
    getCategoryPath(category),
  );
}
