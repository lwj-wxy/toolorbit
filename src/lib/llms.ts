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
    const tools = TOOLS.filter((tool) => tool.category === category && !tool.isNoIndex);
    if (tools.length === 0) return '';
    const lines = tools
      .map((tool) => `- [${toolName(tool)}](${SITE_URL}${tool.path}): ${toolDescription(tool)}`)
      .join('\n');

    return `## ${categoryName(category)}\n\n${lines}`;
  }).filter(Boolean).join('\n\n');
}

export const LLMS_TXT = `# ToolOrbit

ToolOrbit provides Etsy seller workflow tools for pricing, fees, listing drafts, product assets, and customs preparation.

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

${toolsByCategory()}

## Main Entry Points

- Etsy pricing and fee tools: https://toolorbit.site/tools/ecommerce/etsy-fee-calculator
- AI listing workflow: https://toolorbit.site/tools/ai/listing-generator
- Product asset review: https://toolorbit.site/tools/ai/product-asset-checker
- HS code preparation: https://toolorbit.site/tools/ai/hs-code-assistant

## Content Notes

${BRAND_PRIVACY_SUMMARY}

ToolOrbit guides are maintained by the ToolOrbit Editorial Team and are written around practical browser workflows. Content should be interpreted as implementation guidance, not legal, financial, medical, or security certification. AI-powered tools may call configured model APIs for generation tasks, and users should review generated outputs before professional use.
`;

export const LLMS_FULL_TXT = `# ToolOrbit Full Tool Inventory

ToolOrbit is a browser-first collection of free online tools. This expanded file lists major public tool pages, grouped by category, for tool discovery and site understanding.

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
