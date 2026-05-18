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
  '/pdf-image-tools',
  '/webmaster-toolkit',
  '/best-json-formatters',
  '/best-free-pdf-tools',
  '/best-ai-tools-for-content-creators',
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

function localizedPath(path, locale) {
  const normalized = path === '/' ? '/' : `/${String(path).replace(/^\/+/, '')}`;

  if (locale === 'zh-CN') {
    return normalized === '/' ? '/zh-CN' : `/zh-CN${normalized}`;
  }

  return normalized;
}

function absoluteLocalizedUrl(path, locale) {
  const pathWithLocale = localizedPath(path, locale);
  return pathWithLocale === '/' ? SITE_URL : `${SITE_URL}${pathWithLocale}`;
}

function hreflangXml(path) {
  const alternates = [
    ['en', absoluteLocalizedUrl(path, 'en')],
    ['zh-CN', absoluteLocalizedUrl(path, 'zh-CN')],
    ['x-default', absoluteLocalizedUrl(path, 'en')],
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
    image: post.image || '',
  }));
}

function urlEntry({ path, lastmod, changefreq, priority, image, locale = 'en' }) {
  const loc = absoluteLocalizedUrl(path, locale);
  const imageXml = image
    ? `
    <image:image>
      <image:loc>${escapeXml(image.startsWith('http') ? image : `${SITE_URL}${image}`)}</image:loc>
    </image:image>`
    : '';

  return `  <url>
    <loc>${escapeXml(loc)}</loc>
${hreflangXml(path)}
    <lastmod>${escapeXml(lastmod)}</lastmod>
    <changefreq>${escapeXml(changefreq)}</changefreq>
    <priority>${priority}</priority>${imageXml}
  </url>`;
}

const generatedAt = today();
const tools = readTools();
const blogPosts = readBlogPosts();
const blogPageCount = Math.max(1, Math.ceil(blogPosts.length / POSTS_PER_PAGE));

const baseUrls = [
  { path: '/', lastmod: generatedAt, changefreq: 'daily', priority: '1.0' },
  { path: '/tools', lastmod: generatedAt, changefreq: 'weekly', priority: '0.95' },
  { path: '/blog', lastmod: generatedAt, changefreq: 'daily', priority: '0.9' },
  { path: '/about', lastmod: generatedAt, changefreq: 'monthly', priority: '0.7' },
  ...SEO_CONTENT_PATHS.map((path) => ({
    path,
    lastmod: generatedAt,
    changefreq: path.startsWith('/best-') ? 'monthly' : 'weekly',
    priority: path.startsWith('/authors/') ? '0.7' : path.startsWith('/best-') ? '0.82' : '0.88',
  })),
  ...Array.from({ length: blogPageCount - 1 }, (_, index) => ({
    path: `/blog/page/${index + 2}`,
    lastmod: generatedAt,
    changefreq: 'weekly',
    priority: '0.6',
  })),
  ...CATEGORY_PATHS.map((path) => ({
    path,
    lastmod: generatedAt,
    changefreq: 'weekly',
    priority: '0.85',
  })),
  ...tools.map((tool) => ({
    path: tool.path,
    lastmod: generatedAt,
    changefreq: 'monthly',
    priority: tool.isPopular ? '0.9' : '0.8',
  })),
  ...blogPosts.map((post) => ({
    path: post.path,
    lastmod: post.date,
    changefreq: 'monthly',
    priority: '0.7',
    image: post.image,
  })),
];

const uniqueBaseUrls = Array.from(
  new Map(baseUrls.map((entry) => [entry.path, entry])).values(),
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
