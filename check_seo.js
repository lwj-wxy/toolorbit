import fs from 'fs';
import path from 'path';

const zh = JSON.parse(fs.readFileSync('src/locales/zh.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('src/locales/en.json', 'utf8'));

// Manually extract IDs from tools.ts since it's TS and we are in a simple node script
const toolsContent = fs.readFileSync('src/data/tools.ts', 'utf8');
const idMatches = toolsContent.match(/id:\s*['"]([^'"]+)['"]/g) || [];
const toolIds = idMatches.map(m => m.match(/['"]([^'"]+)['"]/)[1]);

console.log(`Found ${toolIds.length} tools in tools.ts`);

const missingZh = [];
const missingEn = [];

toolIds.forEach(id => {
  if (!zh.tools[id]) {
    missingZh.push(`${id} (MISSING ENTIRELY)`);
  } else if (!zh.tools[id].seoTitle) {
    missingZh.push(id);
  }

  if (!en.tools[id]) {
    missingEn.push(`${id} (MISSING ENTIRELY)`);
  } else if (!en.tools[id].seoTitle) {
    missingEn.push(id);
  }
});

console.log('--- ZH Missing SEO ---');
console.log(missingZh.join('\n') || 'None');

console.log('\n--- EN Missing SEO ---');
console.log(missingEn.join('\n') || 'None');
