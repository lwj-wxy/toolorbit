import type { Metadata } from 'next';
import { BLOG_POSTS } from '../constants/blogData';
import { BRAND_DESCRIPTION } from '../data/brand';
import { TOOL_ORBIT_EDITORIAL_TEAM } from '../data/authors';
import { getSeoContentPage } from '../data/seoContent';
import { TOOLS, type Category } from '../data/tools';
import en from '../locales/en.json';
import zh from '../locales/zh.json';
import { getCategoryPath } from './category-paths';
import { HREFLANG_CODES, localizedPath, type Locale } from './i18n-routing';
import { readPath } from './locale-utils';

export const SITE_URL = 'https://toolorbit.site';
export const SITE_NAME = 'ToolOrbit';
const DEFAULT_DESCRIPTION = BRAND_DESCRIPTION;
const TITLE_TEXT_LIMIT = 48;
const DESCRIPTION_MIN_LENGTH = 120;
const DESCRIPTION_MAX_LENGTH = 160;

const STATIC_PAGE_DESCRIPTIONS: Record<'about' | 'privacy' | 'terms', string> = {
  about:
    'Learn how ToolOrbit builds fast, privacy-conscious online tools with local-first processing, practical review, and clear content standards.',
  privacy:
    'Read ToolOrbit privacy practices, including local-first browser processing, analytics, advertising, and contact information handling.',
  terms:
    'Review the ToolOrbit terms of service for using free online tools, generated outputs, external links, and platform limitations.',
};

const STATIC_PAGE_DESCRIPTIONS_ZH: Record<'about' | 'privacy' | 'terms', string> = {
  about:
    '了解 ToolOrbit 如何通过本地优先处理、实用复核和清晰内容标准，构建快速且注重隐私的在线工具。',
  privacy:
    '阅读 ToolOrbit 隐私实践，了解本地优先的浏览器处理、分析、广告以及联系信息处理方式。',
  terms:
    '查看 ToolOrbit 服务条款，了解免费在线工具、生成结果、外部链接以及平台限制的使用规则。',
};

const BLOG_SEO_TITLE_OVERRIDES: Record<string, string> = {
  'xml-json-conversion-guide': 'XML and JSON Converters Guide',
  'why-text-diff-matters': 'Why Text Diff Matters at Work',
  'modern-pdf-workflow-efficiency': 'Modern PDF Workflow Guide',
  'secure-developer-tools-privacy': 'Local Processing for Developer Tools',
  'why-use-json-formatter': 'Why Developers Need JSON Formatters',
  'morse-code-guide': 'Modern Morse Code Guide',
  'base64-encoding-deep-dive': 'Complete Base64 Encoding Guide',
  'color-theory-for-developers': 'Color Theory for Developers',
  'regex-mastery-guide': 'Regular Expressions Mastery Guide',
  'http-status-codes-explained': 'HTTP Status Codes Explained',
  'url-encoding-demystified': 'URL Encoding Guide',
  'unicode-character-encoding-guide': 'Unicode Character Encoding Guide',
  'api-security-best-practices': 'API Security Best Practices',
  'ai-text-polisher-guide': 'AI Text Polisher Guide',
  'ai-translator-future': 'Contextual AI Translation Guide',
  'image-compression-techniques': 'Image Compression Techniques',
  'svg-to-png-conversion-tips': 'SVG to PNG Conversion Guide',
  'image-converter-web-formats': 'JPG, PNG, and WebP Formats Guide',
};

export { readPath };

function withNoIndex(metadata: Metadata): Metadata {
  return {
    ...metadata,
    robots: {
      index: false,
      follow: true,
      googleBot: {
        index: false,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
  };
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

function expandShortToolDescription(description: string, toolName: string, locale: Locale = 'en') {
  if (description.length >= DESCRIPTION_MIN_LENGTH) return description;
  if (locale === 'zh-CN') {
    return `${description} 在 ToolOrbit 浏览器中直接使用 ${toolName}，无需安装，适合日常工作流快速处理。`;
  }
  return `${description} Use ${toolName} online in ToolOrbit with no installation, quick browser access, and a focused workflow for everyday productivity.`;
}

function expandShortDescription(description: string, locale: Locale = 'en') {
  if (description.length >= DESCRIPTION_MIN_LENGTH) return description;
  if (locale === 'zh-CN') {
    return `${description} 查看实用示例和相关 ToolOrbit 浏览器工具，帮助更快完成日常任务。`;
  }
  return `${description} Explore focused examples and related ToolOrbit browser tools for faster everyday workflows.`;
}

function conciseToolDescription(toolName: string, locale: Locale = 'en') {
  return locale === 'zh-CN'
    ? `在浏览器中使用 ${toolName}，获得实用控件、清晰结果和注重隐私的无需安装工作流。`
    : `Use ${toolName} online in your browser. Get practical controls, clear results, privacy-friendly processing, and no installation.`;
}

function conciseBlogDescription(title: string, locale: Locale = 'en') {
  return locale === 'zh-CN'
    ? `阅读 ${title}，获取实用工作流建议、案例和可直接使用的 ToolOrbit 浏览器工具。`
    : `Read ${title} for practical workflow guidance, examples, and related ToolOrbit tools you can apply in browser-based tasks.`;
}

function localeSource(locale: Locale) {
  return locale === 'zh-CN' ? zh : en;
}

function absoluteLocalizedUrl(path: string, locale: Locale) {
  const pathWithLocale = localizedPath(path, locale);
  return pathWithLocale === '/' ? SITE_URL : `${SITE_URL}${pathWithLocale}`;
}

function alternateLanguages(path: string) {
  return {
    [HREFLANG_CODES.en]: absoluteLocalizedUrl(path, 'en'),
    [HREFLANG_CODES['zh-CN']]: absoluteLocalizedUrl(path, 'zh-CN'),
    'x-default': absoluteLocalizedUrl(path, 'en'),
  };
}

function ogImage(title: string, description: string) {
  const params = new URLSearchParams({ title, description });
  return [
    {
      url: `/og-image?${params.toString()}`,
      width: 1200,
      height: 630,
      alt: title,
    },
  ];
}

export function pageMetadata(title?: string, description?: string, path = '/', locale: Locale = 'en'): Metadata {
  const url = absoluteLocalizedUrl(path, locale);
  const metadataTitle = cleanTitle(title);
  const metadataDescription = cleanDescription(description);
  const socialTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const socialImage = ogImage(metadataTitle, metadataDescription);

  return {
    title: metadataTitle,
    description: metadataDescription,
    applicationName: SITE_NAME,
    creator: SITE_NAME,
    publisher: SITE_NAME,
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
      languages: alternateLanguages(path),
    },
    openGraph: {
      title: cleanTitle(socialTitle) === SITE_NAME ? SITE_NAME : `${metadataTitle} | ${SITE_NAME}`,
      description: metadataDescription,
      url,
      siteName: SITE_NAME,
      type: 'website',
      locale: locale === 'zh-CN' ? 'zh_CN' : 'en_US',
      alternateLocale: locale === 'zh-CN' ? ['en_US'] : ['zh_CN'],
      images: socialImage,
    },
    twitter: {
      card: 'summary_large_image',
      title: cleanTitle(socialTitle) === SITE_NAME ? SITE_NAME : `${metadataTitle} | ${SITE_NAME}`,
      description: metadataDescription,
      images: socialImage,
    },
  };
}

export function homeMetadata(locale: Locale = 'en'): Metadata {
  return pageMetadata(
    locale === 'zh-CN' ? '面向开发者与创作者的免费在线工具' : 'Free Online Tools for Developers and Creators',
    locale === 'zh-CN'
      ? 'ToolOrbit 提供面向开发者、创作者、电商运营、PDF 工作流、图片处理和 AI 生产力的免费浏览器在线工具。'
      : 'Free browser-based tools for developer, PDF, image, ecommerce, and AI workflows, with local-first processing for privacy-sensitive tasks.',
    '/',
    locale,
  );
}

export function staticPageMetadata(page: 'about' | 'privacy' | 'terms', locale: Locale = 'en'): Metadata {
  const source = localeSource(locale);
  const title = readPath(source, `${page}.title`);
  const description = locale === 'zh-CN' ? STATIC_PAGE_DESCRIPTIONS_ZH[page] : STATIC_PAGE_DESCRIPTIONS[page];
  const metadata = pageMetadata(title, description, `/${page}`, locale);

  if (page === 'privacy' || page === 'terms') {
    return withNoIndex(metadata);
  }

  return metadata;
}

export function blogListMetadata(locale: Locale = 'en', page = 1): Metadata {
  const source = localeSource(locale);
  const pageSuffix = page > 1 ? ` - Page ${page}` : '';
  const path = page > 1 ? `/blog/page/${page}` : '/blog';

  return pageMetadata(
    `${readPath(source, 'blog.title') || 'Blog'}${pageSuffix}`,
    locale === 'zh-CN'
      ? '阅读 ToolOrbit 实用指南，覆盖开发工具、安全工作流、图片优化、PDF 效率、电商运营和 AI 辅助工作。'
      : 'Practical guides for developer tools, secure workflows, image optimization, PDF productivity, ecommerce operations, and AI-assisted work.',
    path,
    locale,
  );
}

export function allToolsMetadata(locale: Locale = 'en'): Metadata {
  const visibleToolCount = TOOLS.filter((tool) => !tool.isNoIndex).length;

  return pageMetadata(
    locale === 'zh-CN' ? '所有免费在线工具' : 'All Free Online Tools',
    locale === 'zh-CN'
      ? `浏览 ToolOrbit 的 ${visibleToolCount} 个免费在线工具，覆盖开发者、AI、PDF、图片、电商、文本、生成器和计算转换工作流。`
      : `Browse all ${visibleToolCount} free ToolOrbit online tools for developer, AI, PDF, image, ecommerce, text, generator, and conversion workflows.`,
    '/tools',
    locale,
  );
}

export function blogPostMetadata(slug: string, locale: Locale = 'en'): Metadata {
  const post = BLOG_POSTS.find((item) => item.slug === slug);
  const source = localeSource(locale);
  const localizedTitle = readPath(source, `blog.posts.${slug}.title`) || slug.replace(/-/g, ' ');
  const title = locale === 'zh-CN' ? localizedTitle : BLOG_SEO_TITLE_OVERRIDES[slug] || localizedTitle;
  const rawDescription = cleanDescription(readPath(source, `blog.posts.${slug}.summary`), 'ToolOrbit Blog article.');
  const description =
    rawDescription.length > DESCRIPTION_MAX_LENGTH
      ? conciseBlogDescription(title, locale)
      : expandShortDescription(rawDescription, locale);
  const metadataDescription =
    description.length > DESCRIPTION_MAX_LENGTH ? conciseBlogDescription(title, locale) : description;
  const metadata = pageMetadata(title, metadataDescription, `/blog/${slug}`, locale);

  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      type: 'article',
      publishedTime: post?.date,
    },
  };
}

export function toolMetadata(path: string, locale: Locale = 'en'): Metadata {
  const tool = TOOLS.find((item) => item.path === path);
  const toolKey = tool?.id;
  const source = localeSource(locale);
  const rawTitle = toolKey
    ? readPath(source, `tools.${toolKey}.seoTitle`) || readPath(source, `tools.${toolKey}.name`) || tool?.name
    : undefined;
  const rawDescription = toolKey
    ? readPath(source, `tools.${toolKey}.seoDesc`) || readPath(source, `tools.${toolKey}.description`) || tool?.description
    : undefined;
  const cleanedTitle = cleanTitle(rawTitle, tool?.name || SITE_NAME);
  const toolNameTitle = cleanTitle(
    toolKey ? readPath(source, `tools.${toolKey}.name`) || tool?.name : tool?.name,
    tool?.name || SITE_NAME,
  );
  const title =
    tool && cleanedTitle.length < 30
      ? locale === 'zh-CN'
        ? `${cleanedTitle}在线工具`
        : `${cleanedTitle} Online Tool`
      : fitTitle(cleanedTitle.length > TITLE_TEXT_LIMIT ? toolNameTitle : cleanedTitle);

  const fallbackDescription = tool
    ? `Use ${cleanTitle(tool.name)} online for ${tool.description.toLowerCase()} No installation required.`
    : DEFAULT_DESCRIPTION;
  const cleanedDescription = cleanDescription(rawDescription, fallbackDescription);
  const expandedDescription = tool
    ? expandShortToolDescription(cleanedDescription, toolNameTitle, locale)
    : rawDescription || fallbackDescription;
  const description = tool
    ? expandedDescription.length > DESCRIPTION_MAX_LENGTH
      ? conciseToolDescription(toolNameTitle, locale)
      : expandedDescription
    : rawDescription;

  const metadata = pageMetadata(title, description || fallbackDescription, path, locale);

  return tool?.isNoIndex ? withNoIndex(metadata) : metadata;
}

export function categoryMetadata(category: Category, locale: Locale = 'en'): Metadata {
  const source = localeSource(locale);
  const name = readPath(source, `common.categories.${category}`) || category;
  const toolCount = TOOLS.filter((tool) => tool.category === category && !tool.isNoIndex).length;

  const metadata = pageMetadata(
    locale === 'zh-CN' ? `${name}在线工具` : `${name} Online Tools`,
    locale === 'zh-CN'
      ? `浏览 ToolOrbit 的 ${toolCount} 个${name}，用于快速浏览器工作流、实用示例和无需安装的效率任务。`
      : `Browse ${toolCount} ${name} tools in ToolOrbit for fast browser-based workflows. Find focused utilities, examples, and no-install productivity helpers.`,
    getCategoryPath(category),
    locale,
  );

  return metadata;
}

export function seoContentMetadata(path: string, locale: Locale = 'en'): Metadata {
  const page = getSeoContentPage(path);

  if (!page) {
    return pageMetadata(undefined, undefined, path, locale);
  }

  return pageMetadata(page.title, page.description, path, locale);
}

export function authorMetadata(locale: Locale = 'en'): Metadata {
  return pageMetadata(
    TOOL_ORBIT_EDITORIAL_TEAM.name,
    TOOL_ORBIT_EDITORIAL_TEAM.bio,
    TOOL_ORBIT_EDITORIAL_TEAM.url,
    locale,
  );
}
