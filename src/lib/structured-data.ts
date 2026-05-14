import { BLOG_POSTS } from '../constants/blogData';
import { TOOLS } from '../data/tools';
import type { Category } from '../data/tools';
import { BLOG_RELATED_TOOLS } from '../data/blogRelatedTools';
import en from '../locales/en.json';
import zh from '../locales/zh.json';
import { getCategoryPath } from './category-paths';
import { POSTS_PER_PAGE, sortedBlogPosts } from './blog-pagination';
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

function categoryName(category: Category, locale: Locale = 'en') {
  const source = localeSource(locale);
  return text(readPath(source, `common.categories.${category}`), category);
}

function blogTitle(slug: string, locale: Locale = 'en') {
  const source = localeSource(locale);
  return text(readPath(source, `blog.posts.${slug}.title`), slug.replace(/-/g, ' '));
}

function blogDescription(slug: string, locale: Locale = 'en') {
  const source = localeSource(locale);
  return text(readPath(source, `blog.posts.${slug}.summary`), `${SITE_NAME} article.`);
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

function itemList(items: Array<{ name: string; url: string; description?: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: item.url,
      name: item.name,
      description: item.description,
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

export function homePageJsonLd(locale: Locale = 'en') {
  const popularTools = TOOLS.filter((tool) => tool.isPopular).slice(0, 12);
  const url = absoluteUrl('/', locale);

  return [
    breadcrumb([{ name: SITE_NAME, url }]),
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: locale === 'zh-CN' ? '面向开发者与创作者的免费在线工具' : 'Free Online Tools for Developers and Creators',
      description:
        locale === 'zh-CN'
          ? 'ToolOrbit 提供面向开发者、创作者、电商运营、PDF 工作流、图片处理和 AI 生产力的免费浏览器在线工具。'
          : 'Free browser-based tools for developers, creators, ecommerce operators, PDF workflows, image processing, and AI-assisted productivity.',
      url,
      isPartOf: {
        '@type': 'WebSite',
        name: SITE_NAME,
        url: SITE_URL,
      },
    },
    itemList(
      popularTools.map((tool) => ({
        name: toolName(tool.id, tool.name, locale),
        description: toolDescription(tool.id, tool.description, locale),
        url: absoluteUrl(tool.path, locale),
      })),
    ),
  ];
}

export function blogListJsonLd(locale: Locale = 'en', page = 1) {
  const normalizedPage = Math.max(1, page);
  const path = normalizedPage > 1 ? `/blog/page/${normalizedPage}` : '/blog';
  const posts = sortedBlogPosts().slice((normalizedPage - 1) * POSTS_PER_PAGE, normalizedPage * POSTS_PER_PAGE);
  const url = absoluteUrl(path, locale);
  const blogName = locale === 'zh-CN' ? '博客' : 'Blog';

  return [
    breadcrumb([
      { name: SITE_NAME, url: absoluteUrl('/', locale) },
      { name: blogName, url },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: normalizedPage > 1 ? `${blogName} - Page ${normalizedPage}` : blogName,
      url,
      isPartOf: {
        '@type': 'WebSite',
        name: SITE_NAME,
        url: SITE_URL,
      },
    },
    itemList(
      posts.map((post) => ({
        name: blogTitle(post.slug, locale),
        description: blogDescription(post.slug, locale),
        url: absoluteUrl(`/blog/${post.slug}`, locale),
      })),
    ),
  ];
}

export function categoryPageJsonLd(category: Category, locale: Locale = 'en') {
  const tools = TOOLS.filter((tool) => tool.category === category);
  const name = categoryName(category, locale);
  const url = absoluteUrl(getCategoryPath(category), locale);

  return [
    breadcrumb([
      { name: SITE_NAME, url: absoluteUrl('/', locale) },
      { name, url },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: locale === 'zh-CN' ? `${name}在线工具` : `${name} Online Tools`,
      description:
        locale === 'zh-CN'
          ? `浏览 ToolOrbit 的 ${tools.length} 个${name}，用于快速浏览器工作流、实用示例和无需安装的效率任务。`
          : `Browse ${tools.length} ${name} tools in ToolOrbit for fast browser-based workflows, examples, and no-install productivity helpers.`,
      url,
      isPartOf: {
        '@type': 'WebSite',
        name: SITE_NAME,
        url: SITE_URL,
      },
    },
    itemList(
      tools.map((tool) => ({
        name: toolName(tool.id, tool.name, locale),
        description: toolDescription(tool.id, tool.description, locale),
        url: absoluteUrl(tool.path, locale),
      })),
    ),
  ];
}

export function staticPageJsonLd(page: 'about' | 'privacy' | 'terms', locale: Locale = 'en') {
  const source = localeSource(locale);
  const title = readPath(source, `${page}.title`) || page;
  const url = absoluteUrl(`/${page}`, locale);
  const pageType = page === 'about' ? 'AboutPage' : 'WebPage';

  return [
    breadcrumb([
      { name: SITE_NAME, url: absoluteUrl('/', locale) },
      { name: title, url },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': pageType,
      name: title,
      url,
      isPartOf: {
        '@type': 'WebSite',
        name: SITE_NAME,
        url: SITE_URL,
      },
    },
  ];
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
      { name: SITE_NAME, url: absoluteUrl('/', locale) },
      { name: categoryName(tool.category, locale), url: absoluteUrl(getCategoryPath(tool.category), locale) },
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

  const title = blogTitle(slug, locale);
  const description = blogDescription(slug, locale);
  const url = absoluteUrl(`/blog/${slug}`, locale);
  const relatedTools = (BLOG_RELATED_TOOLS[slug] || [])
    .map((path) => TOOLS.find((tool) => tool.path === path))
    .filter(Boolean) as typeof TOOLS;

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
      about: relatedTools.map((tool) => ({
        '@type': 'WebApplication',
        name: toolName(tool.id, tool.name, locale),
        url: absoluteUrl(tool.path, locale),
      })),
    },
  ];
}
