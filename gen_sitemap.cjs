const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const SITE_URL = 'https://toolorbit.site';
const POSTS_PER_PAGE = 12;
const CATEGORY_PATHS = [
  '/category/ai-tools',
  '/category/developer-tools',
  '/category/webmaster-tools',
  '/category/text-tools',
  '/category/generators',
  '/category/ecommerce-tools',
  '/category/pdf-tools',
  '/category/image-tools',
  '/category/conversion-tools',
];
const SEO_CONTENT_PATHS = [
  '/developer-tools',
  '/ai-tools',
  '/image-tools',
  '/pdf-tools',
  '/text-tools',
  '/pdf-image-tools',
  '/webmaster-toolkit',
  '/best-json-formatters',
  '/best-free-pdf-tools',
  '/best-ai-tools-for-content-creators',
  '/authors/toolorbit-editorial-team',
];

// Map blog categories to category paths for lastmod inheritance
const BLOG_CATEGORY_TO_CATEGORY_PATH = {
  AI: '/category/ai-tools',
  Development: '/category/developer-tools',
  Security: '/category/developer-tools',
  Design: '/category/image-tools',
  Business: '/category/ecommerce-tools',
  Productivity: '/category/text-tools',
};

// Map blog categories to SEO content paths
const BLOG_CATEGORY_TO_SEO_PATH = {
  AI: '/ai-tools',
  Development: '/developer-tools',
  Security: '/webmaster-toolkit',
  Design: '/image-tools',
  Business: '/ecommerce-tools',
  Productivity: '/text-tools',
};

require.extensions['.ts'] = function loadTypeScript(module, filename) {
  const source = fs.readFileSync(filename, 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: filename,
  }).outputText;
  module._compile(output, filename);
};

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function today() {
  return new Date().toISOString().split('T')[0];
}

function localizedPath(localPath, locale) {
  const normalized = localPath === '/' ? '/' : `/${String(localPath).replace(/^\/+/, '')}`;

  if (locale === 'zh-CN') {
    return normalized === '/' ? '/zh-CN' : `/zh-CN${normalized}`;
  }

  return normalized;
}

function absoluteLocalizedUrl(localPath, locale) {
  const pathWithLocale = localizedPath(localPath, locale);
  return pathWithLocale === '/' ? SITE_URL : `${SITE_URL}${pathWithLocale}`;
}

function hreflangXml(localPath) {
  const alternates = [
    ['en', absoluteLocalizedUrl(localPath, 'en')],
    ['zh-CN', absoluteLocalizedUrl(localPath, 'zh-CN')],
    ['x-default', absoluteLocalizedUrl(localPath, 'en')],
  ];

  return alternates
    .map(
      ([hreflang, href]) =>
        `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${escapeXml(href)}" />`,
    )
    .join('\n');
}

function readTools() {
  const { TOOLS_META } = require(path.join(process.cwd(), 'src/data/tools-meta.ts'));
  return TOOLS_META.map((tool) => ({
    path: tool.path,
    isPopular: Boolean(tool.isPopular),
    isNoIndex: Boolean(tool.isNoIndex),
  })).filter((tool) => !tool.isNoIndex);
}

function readBlogPosts() {
  const { BLOG_POSTS } = require(path.join(process.cwd(), 'src/constants/blogData.ts'));
  return BLOG_POSTS.map((post) => ({
    path: `/blog/${post.slug}`,
    date: post.date || today(),
    category: post.category || '',
    image: post.image || '',
  }));
}

function urlEntry({ localPath, lastmod, changefreq, priority, image, locale = 'en' }) {
  const loc = absoluteLocalizedUrl(localPath, locale);
  const imageXml = image
    ? `
    <image:image>
      <image:loc>${escapeXml(image.startsWith('http') ? image : `${SITE_URL}${image}`)}</image:loc>
    </image:image>`
    : '';

  return `  <url>
    <loc>${escapeXml(loc)}</loc>
${hreflangXml(localPath)}
    <lastmod>${escapeXml(lastmod)}</lastmod>
    <changefreq>${escapeXml(changefreq)}</changefreq>
    <priority>${priority}</priority>${imageXml}
  </url>`;
}

const generatedAt = today();
const tools = readTools();
const blogPosts = readBlogPosts();

// Sort blog posts by date (newest first) for pagination date calculation
const sortedBlogPosts = [...blogPosts].sort((a, b) => (b.date || '').localeCompare(a.date || ''));

// Build category → latest post date map
const categoryLastmod = {};
const seoPathLastmod = {};
for (const post of sortedBlogPosts) {
  const catPath = BLOG_CATEGORY_TO_CATEGORY_PATH[post.category];
  const seoPath = BLOG_CATEGORY_TO_SEO_PATH[post.category];
  if (catPath && !categoryLastmod[catPath]) {
    categoryLastmod[catPath] = post.date;
  }
  if (seoPath && !seoPathLastmod[seoPath]) {
    seoPathLastmod[seoPath] = post.date;
  }
}

// Build tool → date map: use the date of the most recent blog post that relates to each tool's category
function getToolLastmod(toolPath) {
  // Determine a reasonable lastmod for tools based on the general category
  if (toolPath.includes('/ai/')) return categoryLastmod['/category/ai-tools'] || generatedAt;
  if (toolPath.includes('/dev/')) return categoryLastmod['/category/developer-tools'] || generatedAt;
  if (toolPath.includes('/ecommerce/')) return categoryLastmod['/category/ecommerce-tools'] || generatedAt;
  if (toolPath.includes('/image/')) return categoryLastmod['/category/image-tools'] || generatedAt;
  if (toolPath.includes('/pdf/')) return categoryLastmod['/category/pdf-tools'] || generatedAt;
  if (toolPath.includes('/text/')) return categoryLastmod['/category/text-tools'] || generatedAt;
  if (toolPath.includes('/generator/')) return categoryLastmod['/category/generators'] || generatedAt;
  if (toolPath.includes('/calculate/')) return categoryLastmod['/category/conversion-tools'] || generatedAt;
  return generatedAt;
}

const blogPageCount = Math.max(1, Math.ceil(blogPosts.length / POSTS_PER_PAGE));

// Compute blog pagination dates (newest post on each page)
function getBlogPageLastmod(pageNum) {
  if (pageNum <= 1) return sortedBlogPosts[0]?.date || generatedAt;
  const startIdx = (pageNum - 1) * POSTS_PER_PAGE;
  const pagePosts = sortedBlogPosts.slice(startIdx, startIdx + POSTS_PER_PAGE);
  return pagePosts[0]?.date || generatedAt;
}

const baseUrls = [
  { localPath: '/', lastmod: generatedAt, changefreq: 'daily', priority: '1.0' },
  { localPath: '/tools', lastmod: generatedAt, changefreq: 'weekly', priority: '0.95' },
  { localPath: '/blog', lastmod: generatedAt, changefreq: 'daily', priority: '0.9' },
  { localPath: '/about', lastmod: '2026-04-01', changefreq: 'monthly', priority: '0.7' },
  ...SEO_CONTENT_PATHS.map((sp) => ({
    localPath: sp,
    lastmod: seoPathLastmod[sp] || generatedAt,
    changefreq: sp.startsWith('/best-') ? 'monthly' : 'weekly',
    priority: sp.startsWith('/authors/') ? '0.7' : sp.startsWith('/best-') ? '0.82' : '0.88',
  })),
  ...Array.from({ length: blogPageCount - 1 }, (_, index) => ({
    localPath: `/blog/page/${index + 2}`,
    lastmod: getBlogPageLastmod(index + 2),
    changefreq: 'weekly',
    priority: '0.6',
  })),
  ...CATEGORY_PATHS.map((cp) => ({
    localPath: cp,
    lastmod: categoryLastmod[cp] || generatedAt,
    changefreq: 'weekly',
    priority: '0.85',
  })),
  ...tools.map((tool) => ({
    localPath: tool.path,
    lastmod: getToolLastmod(tool.path),
    changefreq: 'monthly',
    priority: tool.isPopular ? '0.9' : '0.8',
  })),
  ...blogPosts.map((post) => ({
    localPath: post.path,
    lastmod: post.date,
    changefreq: 'monthly',
    priority: '0.7',
    image: post.image,
  })),
];

const uniqueBaseUrls = Array.from(
  new Map(baseUrls.map((entry) => [entry.localPath, entry])).values(),
);

const urls = uniqueBaseUrls.flatMap((entry) => [
  { ...entry, locale: 'en' },
  { ...entry, locale: 'zh-CN' },
]);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.map(urlEntry).join('\n')}
</urlset>
`;

fs.writeFileSync('public/sitemap.xml', xml);
console.log(`Sitemap generated successfully with ${urls.length} localized URLs.`);
