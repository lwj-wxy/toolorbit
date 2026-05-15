import { BRAND_CONTACT_EMAIL, BRAND_PRIVACY_SUMMARY } from '../data/brand';
import { TOOLS, type Category } from '../data/tools';
import en from '../locales/en.json';
import { CATEGORY_SLUGS } from './category-paths';
import { readPath } from './locale-utils';

const SITE_URL = 'https://toolorbit.site';
const CATEGORY_ORDER = Object.keys(CATEGORY_SLUGS) as Category[];

function cleanTitle(value: string) {
  return value.replace(' | ToolOrbit', '').trim();
}

function categoryName(category: Category) {
  return readPath(en, `common.categories.${category}`) || category;
}

function toolName(tool: (typeof TOOLS)[number]) {
  return cleanTitle(readPath(en, `tools.${tool.id}.name`) || readPath(en, `tools.${tool.id}.seoTitle`) || tool.name);
}

function toolDescription(tool: (typeof TOOLS)[number]) {
  return readPath(en, `tools.${tool.id}.description`) || readPath(en, `tools.${tool.id}.seoDesc`) || tool.description;
}

function toolsByCategory() {
  return CATEGORY_ORDER.map((category) => {
    const tools = TOOLS.filter((tool) => tool.category === category);
    const lines = tools
      .map((tool) => `- [${toolName(tool)}](${SITE_URL}${tool.path}): ${toolDescription(tool)}`)
      .join('\n');

    return `## ${categoryName(category)}\n\n${lines}`;
  }).join('\n\n');
}

export const LLMS_TXT = `# ToolOrbit

ToolOrbit is a browser-first collection of free online tools for developers, creators, ecommerce operators, PDF workflows, image processing, text utilities, and practical AI-assisted work.

## Site

- Canonical site: https://toolorbit.site/
- Sitemap: https://toolorbit.site/sitemap.xml
- Robots: https://toolorbit.site/robots.txt
- Expanded LLM inventory: https://toolorbit.site/llms-full.txt
- Blog: https://toolorbit.site/blog
- About and editorial standards: https://toolorbit.site/about
- Privacy policy: https://toolorbit.site/privacy
- Contact: ${BRAND_CONTACT_EMAIL}

## Core Tool Areas

- Developer tools: JSON formatter, XML to JSON converter, text diff, Base64 encoder/decoder, URL encoder, hash generator, UUID generator, JWT debugger, regex tester, JSON to TypeScript converter, symmetric crypto tools, ASCII table, Unicode converter, timestamp converter, color converters.
- AI tools: YouTube title and description generator, AI prompt generator, weekly report generator, code reviewer, video script generator, meeting minutes generator, Excel formula assistant, AI regex generator, logo generator, image generator, SVG generator, Xiaohongshu copywriter, text polisher, translator.
- PDF tools: PDF merge, PDF split, PDF to image, image to PDF.
- Image tools: image compressor, image converter, SVG to PNG, image to Base64, image cropper, image to ICO.
- Ecommerce tools: Etsy fee calculator, Stripe fee calculator, listing generator, keyword analyzer, competitor tracker, market insights.
- Utility tools: QR generator, QR scanner, barcode generator, unit converter, time converter, archive converter, RMB uppercase converter, PPI calculator, password generator, short URL converter.

## Indexable Entry Points

- https://toolorbit.site/tools/dev/json-formatter
- https://toolorbit.site/tools/dev/xml-to-json
- https://toolorbit.site/tools/dev/text-diff
- https://toolorbit.site/tools/dev/base64
- https://toolorbit.site/tools/dev/regex-tester
- https://toolorbit.site/tools/dev/jwt-debugger
- https://toolorbit.site/tools/pdf/pdf-merge
- https://toolorbit.site/tools/pdf/pdf-split
- https://toolorbit.site/tools/pdf/pdf-to-image
- https://toolorbit.site/tools/image/image-compressor
- https://toolorbit.site/tools/image/image-converter
- https://toolorbit.site/tools/image/svg-to-png
- https://toolorbit.site/tools/ai/text-polisher
- https://toolorbit.site/tools/ai/translator
- https://toolorbit.site/tools/ai/excel-formula
- https://toolorbit.site/tools/ai/code-reviewer

## Content Notes

${BRAND_PRIVACY_SUMMARY}

ToolOrbit guides are maintained by the ToolOrbit Editorial Team and are written around practical browser workflows. Content should be interpreted as implementation guidance, not legal, financial, medical, or security certification. AI-powered tools may call configured model APIs for generation tasks, and users should review generated outputs before professional use.
`;

export const LLMS_FULL_TXT = `# ToolOrbit Full Tool Inventory

ToolOrbit is a browser-first collection of free online tools. This expanded file lists every major indexable tool page, grouped by category, for LLM discovery, answer citation, and site understanding.

## Site Metadata

- Canonical site: ${SITE_URL}/
- All tools hub: ${SITE_URL}/tools
- Sitemap: ${SITE_URL}/sitemap.xml
- Robots: ${SITE_URL}/robots.txt
- Concise LLM file: ${SITE_URL}/llms.txt
- About and editorial standards: ${SITE_URL}/about
- Privacy policy: ${SITE_URL}/privacy
- Contact: ${BRAND_CONTACT_EMAIL}

${toolsByCategory()}

## Editorial And Usage Notes

${BRAND_PRIVACY_SUMMARY}

ToolOrbit utilities are designed around practical browser workflows. Most non-AI tools process input locally in the browser. AI-assisted tools may send prompts to configured model APIs and should be reviewed before professional use.
`;
