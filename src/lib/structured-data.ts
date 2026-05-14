import { BLOG_POSTS } from '../constants/blogData';
import { TOOLS } from '../data/tools';
import en from '../locales/en.json';
import zh from '../locales/zh.json';
import { getCategoryPath } from './category-paths';
import { localizedPath, type Locale } from './i18n-routing';
import { readPath, SITE_NAME, SITE_URL } from './metadata';

const LOGO_URL = `${SITE_URL}/icon.svg`;

function absoluteUrl(path: string, locale: Locale = 'en') {
  return `${SITE_URL}${localizedPath(path, locale)}`;
}

function text(value: unknown, fallback = '') {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function localeSource(locale: Locale) {
  return locale === 'zh-CN' ? zh : en;
}

function toolCopy(toolId: string, locale: Locale = 'en') {
  return (localeSource(locale) as any).tools?.[toolId] || {};
}

function toolName(toolId: string, fallback: string, locale: Locale = 'en') {
  const source = localeSource(locale);
  return text(readPath(source, `tools.${toolId}.seoTitle`) || readPath(source, `tools.${toolId}.name`), fallback)
    .replace(` | ${SITE_NAME}`, '');
}

function toolDescription(toolId: string, fallback: string, locale: Locale = 'en') {
  const source = localeSource(locale);
  return text(readPath(source, `tools.${toolId}.seoDesc`) || readPath(source, `tools.${toolId}.description`), fallback);
}

function toolApplicationCategory(category: string) {
  if (category.includes('开发者')) return 'DeveloperApplication';
  if (category.includes('图片')) return 'DesignApplication';
  if (category.includes('PDF')) return 'BusinessApplication';
  if (category.includes('电商')) return 'BusinessApplication';
  if (category.includes('AI')) return 'UtilitiesApplication';
  if (category.includes('娱乐')) return 'GameApplication';
  return 'UtilitiesApplication';
}

function breadcrumb(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: LOGO_URL,
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function toolJsonLd(path: string, locale: Locale = 'en') {
  const tool = TOOLS.find((item) => item.path === path);
  if (!tool) return [];

  const copy = toolCopy(tool.id, locale);
  const name = toolName(tool.id, tool.name, locale);
  const description = toolDescription(tool.id, tool.description, locale);
  const url = absoluteUrl(tool.path, locale);

  const highlights = [1, 2, 3]
    .map((index) => text(copy[`highlight${index}Title`]))
    .filter(Boolean);

  const faqs = [1, 2, 3]
    .map((index) => ({
      question: text(copy[`faq${index}Q`]),
      answer: text(copy[`faq${index}A`]),
    }))
    .filter((item) => item.question && item.answer);

  const data: unknown[] = [
    breadcrumb([
      { name: SITE_NAME, url: SITE_URL },
      { name: tool.category, url: absoluteUrl(getCategoryPath(tool.category), locale) },
      { name, url },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': ['WebApplication', 'SoftwareApplication'],
      name,
      description,
      url,
      applicationCategory: toolApplicationCategory(tool.category),
      operatingSystem: 'Any',
      browserRequirements: 'Requires a modern web browser.',
      isAccessibleForFree: true,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      featureList: highlights.length ? highlights : undefined,
      publisher: {
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
      },
    },
  ];

  if (faqs.length) {
    data.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    });
  }

  return data;
}

export function blogPostJsonLd(slug: string, locale: Locale = 'en') {
  const post = BLOG_POSTS.find((item) => item.slug === slug);
  if (!post) return [];

  const source = localeSource(locale);
  const title = readPath(source, `blog.posts.${slug}.title`) || slug.replace(/-/g, ' ');
  const description = readPath(source, `blog.posts.${slug}.summary`) || `${SITE_NAME} article.`;
  const url = absoluteUrl(`/blog/${slug}`, locale);

  return [
    breadcrumb([
      { name: SITE_NAME, url: SITE_URL },
      { name: locale === 'zh-CN' ? '博客' : 'Blog', url: absoluteUrl('/blog', locale) },
      { name: title, url },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: title,
      description,
      image: post.image,
      url,
      mainEntityOfPage: url,
      datePublished: post.date,
      dateModified: post.date,
      author: {
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
      },
      publisher: {
        '@type': 'Organization',
        name: SITE_NAME,
        logo: {
          '@type': 'ImageObject',
          url: LOGO_URL,
        },
      },
    },
  ];
}
