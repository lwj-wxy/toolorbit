import { BLOG_POSTS } from '../constants/blogData';
import fs from 'fs';
import path from 'path';
import {
  BRAND_CONTACT_EMAIL,
  BRAND_DESCRIPTION,
  BRAND_KNOWS_ABOUT,
  BRAND_PRIVACY_SUMMARY,
  BRAND_PUBLISHING_PRINCIPLES_PATH,
} from '../data/brand';
import { TOOL_ORBIT_EDITORIAL_TEAM, getAuthorById } from '../data/authors';
import type { Author } from '../data/authors';
import { getSeoContentPage, toolByPath } from '../data/seoContent';
import { TOOLS } from '../data/tools';
import type { Category } from '../data/tools';
import { BLOG_RELATED_TOOLS } from '../data/blogRelatedTools';
import en from '../locales/en.json';
import zh from '../locales/zh.json';
import { getCategoryPath } from './category-paths';
import { getBlogPagePosts, sortedBlogPosts } from './blog-pagination';
import { localizedPath, type Locale } from './i18n-routing';
import { readPath, SITE_NAME, SITE_URL } from './metadata';

const LOGO_URL = `${SITE_URL}/icon.svg`;

export function organizationEntity() {
  return {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: ['ToolOrbit.site', 'Tool Orbit'],
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: LOGO_URL,
    },
    email: BRAND_CONTACT_EMAIL,
    description: BRAND_DESCRIPTION,
    knowsAbout: BRAND_KNOWS_ABOUT,
    contactPoint: {
      '@type': 'ContactPoint',
      email: BRAND_CONTACT_EMAIL,
      contactType: 'customer support',
      availableLanguage: ['English', 'Chinese'],
    },
    publishingPrinciples: `${SITE_URL}${BRAND_PUBLISHING_PRINCIPLES_PATH}`,
  };
}

function absoluteUrl(path: string, locale: Locale = 'en') {
  return `${SITE_URL}${localizedPath(path, locale)}`;
}

function assetUrl(path: string) {
  return path.startsWith('http') ? path : `${SITE_URL}${path}`;
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

function blogWordCount(slug: string, locale: Locale = 'en') {
  const languageDir = locale === 'zh-CN' ? 'zh' : 'en';
  const articlePath = path.join(process.cwd(), 'public', 'articles', languageDir, `${slug}.md`);

  try {
    const markdown = fs.readFileSync(articlePath, 'utf8');
    const words = markdown
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/[#>*_`[\]()~-]/g, ' ')
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    return Math.max(words.length, 1);
  } catch {
    return undefined;
  }
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

function editorialTeamEntity(locale: Locale = 'en') {
  const team = getAuthorById(TOOL_ORBIT_EDITORIAL_TEAM.id, locale);

  return {
    '@type': 'Organization',
    '@id': `${SITE_URL}${localizedPath(TOOL_ORBIT_EDITORIAL_TEAM.url, locale)}#author`,
    name: team.name,
    url: absoluteUrl(TOOL_ORBIT_EDITORIAL_TEAM.url, locale),
    description: team.bio,
    knowsAbout: team.role,
    parentOrganization: organizationEntity(),
  };
}

function authorEntity(author: Author, locale: Locale = 'en') {
  if (author.id === TOOL_ORBIT_EDITORIAL_TEAM.id) {
    return editorialTeamEntity(locale);
  }

  return {
    '@type': 'Person',
    '@id': `${SITE_URL}${localizedPath(author.url, locale)}#author`,
    name: author.name,
    url: absoluteUrl(author.url, locale),
    description: author.bio,
    jobTitle: author.role,
    worksFor: organizationEntity(),
    knowsAbout: BRAND_KNOWS_ABOUT,
  };
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    ...organizationEntity(),
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    alternateName: ['ToolOrbit.site', 'Tool Orbit'],
    url: SITE_URL,
    description: BRAND_DESCRIPTION,
    publisher: organizationEntity(),
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
        '@id': `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
      },
      reviewedBy: organizationEntity(),
      publisher: organizationEntity(),
      about: BRAND_PRIVACY_SUMMARY,
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
  const posts = getBlogPagePosts(sortedBlogPosts(), normalizedPage);
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
        '@id': `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
      },
      publisher: organizationEntity(),
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
        '@id': `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
      },
      publisher: organizationEntity(),
      reviewedBy: organizationEntity(),
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

export function allToolsPageJsonLd(locale: Locale = 'en') {
  const url = absoluteUrl('/tools', locale);
  const visibleTools = TOOLS.filter((tool) => !tool.isNoIndex && tool.category !== 'AI 工具');
  const visibleToolCount = visibleTools.length;
  const pageName = locale === 'zh-CN' ? '其它免费在线工具' : 'Other Free Online Tools';

  return [
    breadcrumb([
      { name: SITE_NAME, url: absoluteUrl('/', locale) },
      { name: pageName, url },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: pageName,
      description:
        locale === 'zh-CN'
          ? `浏览 ToolOrbit 的 ${visibleToolCount} 个其它免费浏览器工具，覆盖开发者、PDF、图片、电商、文本、生成器和计算转换工作流。`
          : `Browse ${visibleToolCount} other free ToolOrbit browser tools across developer, PDF, image, ecommerce, text, generator, and conversion workflows.`,
      url,
      isPartOf: {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
      },
      publisher: organizationEntity(),
      reviewedBy: organizationEntity(),
    },
    itemList(
      visibleTools.map((tool) => ({
        name: toolName(tool.id, tool.name, locale),
        description: toolDescription(tool.id, tool.description, locale),
        url: absoluteUrl(tool.path, locale),
      })),
    ),
  ];
}

export function seoContentPageJsonLd(path: string, locale: Locale = 'en') {
  const page = getSeoContentPage(path);
  if (!page) return [];

  const url = absoluteUrl(page.path, locale);
  const tools = page.toolPaths
    .map((toolPath) => toolByPath(toolPath))
    .filter(Boolean) as typeof TOOLS;

  return [
    breadcrumb([
      { name: SITE_NAME, url: absoluteUrl('/', locale) },
      { name: page.title, url },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': page.type === 'comparison' ? 'WebPage' : 'CollectionPage',
      name: page.title,
      description: page.description,
      url,
      dateModified: page.updated,
      author: editorialTeamEntity(locale),
      publisher: organizationEntity(),
      reviewedBy: organizationEntity(),
      isPartOf: {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
      },
      about: page.targetKeyword,
      mainEntity: page.faqs.length
        ? {
            '@type': 'FAQPage',
            mainEntity: page.faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
              },
            })),
          }
        : undefined,
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

export function authorPageJsonLd(authorId?: string, locale: Locale = 'en') {
  const author = getAuthorById(authorId, locale);
  const url = absoluteUrl(author.url, locale);

  return [
    breadcrumb([
      { name: SITE_NAME, url: absoluteUrl('/', locale) },
      { name: author.name, url },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      name: author.name,
      url,
      dateModified: '2026-05-18T00:00:00+00:00',
      mainEntity: authorEntity(author, locale),
      publisher: organizationEntity(),
    },
  ];
}

export function staticPageJsonLd(page: 'about' | 'privacy' | 'terms' | 'featured-tools', locale: Locale = 'en') {
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
        '@id': `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
      },
      publisher: organizationEntity(),
      reviewedBy: page === 'about' ? organizationEntity() : undefined,
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
      '@type': 'SoftwareApplication',
      '@id': `${url}#software-application`,
      name,
      description,
      url,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': url,
      },
      applicationCategory:
        tool.id === 'worldcup-match-predictor'
          ? 'SportsApplication'
          : toolApplicationCategory(tool.category),
      operatingSystem: 'Web browser',
      browserRequirements: 'Requires a modern browser with JavaScript enabled.',
      isAccessibleForFree: true,
      offers: {
        '@type': 'Offer',
        url,
        price: 0,
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
      featureList: highlights.length ? highlights : undefined,
      audience: {
        '@type': 'Audience',
        audienceType: categoryName(tool.category, locale),
      },
      creator: organizationEntity(),
      provider: organizationEntity(),
      publisher: organizationEntity(),
      reviewedBy: organizationEntity(),
      inLanguage: locale === 'zh-CN' ? 'zh-CN' : 'en',
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
  const wordCount = blogWordCount(slug, locale);
  const author = getAuthorById(post.authorId);
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
      articleSection: post.category,
      wordCount,
      url,
      mainEntityOfPage: url,
      datePublished: post.date,
      dateModified: post.date,
      author: authorEntity(author, locale),
      publisher: organizationEntity(),
      reviewedBy: organizationEntity(),
      inLanguage: locale === 'zh-CN' ? 'zh-CN' : 'en',
      publishingPrinciples: absoluteUrl('/about', locale),
      about: relatedTools.map((tool) => ({
        '@type': 'WebApplication',
        name: toolName(tool.id, tool.name, locale),
        url: absoluteUrl(tool.path, locale),
      })),
    },
  ];
}
