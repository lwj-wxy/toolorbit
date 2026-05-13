const fs = require('fs');

const SITE_URL = 'https://toolorbit.site';
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
  '/category/fun-tools',
];

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

function readTools() {
  const source = fs.readFileSync('src/data/tools.ts', 'utf8');
  const blocks = source.match(/\{\s*id:\s*['"][\s\S]*?\n\s*\}/g) || [];

  return blocks
    .map((block) => {
      const path = block.match(/path:\s*['"]([^'"]+)['"]/)?.[1];
      if (!path) return null;

      return {
        path,
        isPopular: /isPopular:\s*true/.test(block),
      };
    })
    .filter(Boolean);
}

function readBlogPosts() {
  const source = fs.readFileSync('src/constants/blogData.ts', 'utf8');
  const blocks = source.match(/\{\s*id:\s*['"][\s\S]*?\n\s*\}/g) || [];

  return blocks
    .map((block) => {
      const slug = block.match(/slug:\s*['"]([^'"]+)['"]/)?.[1];
      if (!slug) return null;

      return {
        path: `/blog/${slug}`,
        date: block.match(/date:\s*['"]([^'"]+)['"]/)?.[1] || today(),
        image: block.match(/image:\s*['"]([^'"]+)['"]/)?.[1] || '',
      };
    })
    .filter(Boolean);
}

function urlEntry({ path, lastmod, changefreq, priority, image }) {
  const loc = `${SITE_URL}${path}`;
  const imageXml = image
    ? `
    <image:image>
      <image:loc>${escapeXml(image)}</image:loc>
    </image:image>`
    : '';

  return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${escapeXml(lastmod)}</lastmod>
    <changefreq>${escapeXml(changefreq)}</changefreq>
    <priority>${priority}</priority>${imageXml}
  </url>`;
}

const generatedAt = today();
const tools = readTools();
const blogPosts = readBlogPosts();

const urls = [
  { path: '/', lastmod: generatedAt, changefreq: 'daily', priority: '1.0' },
  { path: '/blog', lastmod: generatedAt, changefreq: 'daily', priority: '0.9' },
  { path: '/about', lastmod: generatedAt, changefreq: 'monthly', priority: '0.7' },
  { path: '/privacy', lastmod: generatedAt, changefreq: 'yearly', priority: '0.4' },
  { path: '/terms', lastmod: generatedAt, changefreq: 'yearly', priority: '0.4' },
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

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.map(urlEntry).join('\n')}
</urlset>
`;

fs.writeFileSync('public/sitemap.xml', xml);
console.log(`Sitemap generated successfully with ${tools.length} tools and ${blogPosts.length} blog posts.`);
