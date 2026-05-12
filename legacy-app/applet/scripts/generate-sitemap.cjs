const fs = require('fs');
const path = require('path');

const zhLocalePath = path.join(__dirname, 'src', 'locales', 'zh.json');
const sitemapPath = path.join(__dirname, 'public', 'sitemap.xml');

try {
  const zhLocale = JSON.parse(fs.readFileSync(zhLocalePath, 'utf8'));
  const tools = Object.keys(zhLocale.tools || {});
  const blogPosts = Object.keys(zhLocale.blog?.posts || {});
  
  const today = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Home -->
  <url>
    <loc>https://toolorbit.site/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Legal & About -->
  <url><loc>https://toolorbit.site/privacy</loc><priority>0.5</priority></url>
  <url><loc>https://toolorbit.site/terms</loc><priority>0.5</priority></url>
  <url><loc>https://toolorbit.site/about</loc><priority>0.8</priority></url>

  <!-- Categories -->
`;

  const categories = ['开发者工具', '站长工具', '文本排版', '生成器', '电商工具', 'PDF工具', '图片处理', '计算转换', '娱乐工具'];
  categories.forEach(cat => {
    xml += `  <url><loc>https://toolorbit.site/?category=${encodeURIComponent(cat)}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>\n`;
  });

  xml += `\n  <!-- Tools -->\n`;
  tools.forEach(toolKey => {
    // Determine category based on prefix or just list all under tools
    // Assuming tools are routed like /tools/*/toolKey - we have to map toolKey to full path if possible.
    // Let's do a trick: we parse App.tsx to find the full route of each tool!
  });

} catch (err) {
  console.error("Failed to generate sitemap", err);
}
