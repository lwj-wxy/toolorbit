const fs = require('fs');
const path = require('path');

const appTsx = fs.readFileSync('src/App.tsx', 'utf8');
const routes = [...appTsx.matchAll(/<Route path="(\/tools\/.*?)"/g)].map(m => m[1]);
const blogJson = JSON.parse(fs.readFileSync('src/locales/zh.json', 'utf8'));
const blogPaths = Object.keys(blogJson.blog.posts).map(slug => '/blog/' + slug);

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

  <!-- Pages -->
  <url><loc>https://toolorbit.site/privacy</loc><priority>0.5</priority></url>
  <url><loc>https://toolorbit.site/terms</loc><priority>0.5</priority></url>
  <url><loc>https://toolorbit.site/about</loc><priority>0.8</priority></url>
  <url><loc>https://toolorbit.site/blog</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>
`;

routes.forEach(r => {
  xml += `  <url><loc>https://toolorbit.site${r}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>\n`;
});

blogPaths.forEach(r => {
  xml += `  <url><loc>https://toolorbit.site${r}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>\n`;
});

xml += `</urlset>`;

fs.writeFileSync('public/sitemap.xml', xml);
console.log('Sitemap generated successfully with ' + routes.length + ' tools and ' + blogPaths.length + ' blogs.');
