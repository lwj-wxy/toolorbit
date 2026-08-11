const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const SITE_URL = 'https://toolorbit.site';
const POSTS_PER_PAGE = 10;
const SEO_CONTENT_PATHS = [
  '/best-etsy-fee-calculators',
  '/authors/toolorbit-editorial-team',
];

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
  return normalized;
}

function absoluteLocalizedUrl(localPath, locale) {
  const pathWithLocale = localizedPath(localPath, locale);
  return pathWithLocale === '/' ? SITE_URL : `${SITE_URL}${pathWithLocale}`;
}

function hreflangXml(localPath) {
  const englishUrl = absoluteLocalizedUrl(localPath, 'en');
  const alternates = [
    ['en', englishUrl],
    ['en-US', englishUrl],
    ['x-default', englishUrl],
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
    category: tool.category,
    isPopular: Boolean(tool.isPopular),
    isNoIndex: Boolean(tool.isNoIndex),
  })).filter((tool) => !tool.isNoIndex);
}

function readBlogPosts() {
  const { PUBLISHED_BLOG_POSTS } = require(path.join(process.cwd(), 'src/constants/blogData.ts'));
  return PUBLISHED_BLOG_POSTS.map((post) => ({
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
function getToolLastmod(toolPath) {
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
    lastmod: sortedBlogPosts[0]?.date || generatedAt,
    changefreq: sp.startsWith('/best-') ? 'monthly' : 'weekly',
    priority: sp.startsWith('/authors/') ? '0.7' : sp.startsWith('/best-') ? '0.82' : '0.88',
  })),
  ...Array.from({ length: blogPageCount - 1 }, (_, index) => ({
    localPath: `/blog/page/${index + 2}`,
    lastmod: getBlogPageLastmod(index + 2),
    changefreq: 'weekly',
    priority: '0.6',
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

const urls = uniqueBaseUrls.map((entry) => ({ ...entry, locale: 'en' }));

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.map(urlEntry).join('\n')}
</urlset>
`;

fs.writeFileSync('public/sitemap.xml', xml);
console.log(`Sitemap generated successfully with ${urls.length} English URLs.`);
