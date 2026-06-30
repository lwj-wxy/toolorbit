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

ToolOrbit is a browser-first collection of AI-assisted tools, browser utilities, and ecommerce calculators for content, file, developer, image, and marketplace tasks.

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

- Developer tools: JSON formatter, XML to JSON converter, text diff, URL encoder, hash generator, JWT debugger, regex tester, JSON to TypeScript converter, symmetric crypto tools, ASCII table, Unicode converter, timestamp converter, and color converters.
- AI tools: content drafting, image prompt and image generation, translation, text polishing, spreadsheet formulas, regex generation, ecommerce listing research, HS code assistance, product asset checks, and cross-border product image generation. These tools may call model APIs and require human review.
- PDF tools: PDF merge, PDF split, PDF to image, image to PDF.
- Image tools: image compressor, image converter, SVG to PNG, image cropper, and image to ICO.
- Ecommerce tools: Etsy fee calculator, Etsy pricing calculator, Etsy Offsite Ads calculator, Etsy regulatory fee calculator, Stripe fee calculator, PayPal fee calculator, Stripe vs PayPal fee comparison, VAT calculators, and GST calculator.
- Utility tools: unit converter, time converter, RMB uppercase converter, password generator, text analyzer, and timezone comparison.

## Main Entry Points

- https://toolorbit.site/tools/dev/json-formatter
- https://toolorbit.site/tools/dev/xml-to-json
- https://toolorbit.site/tools/dev/text-diff
- https://toolorbit.site/tools/dev/regex-tester
- https://toolorbit.site/tools/dev/jwt-debugger
- https://toolorbit.site/tools/dev/hash-generator
- https://toolorbit.site/tools/ai/youtube-generator
- https://toolorbit.site/tools/ai/weekly-report-generator
- https://toolorbit.site/tools/ai/prompt-generator
- https://toolorbit.site/tools/ai/video-script
- https://toolorbit.site/tools/ai/resume-optimizer
- https://toolorbit.site/tools/ai/excel-formula
- https://toolorbit.site/tools/ai/regex
- https://toolorbit.site/tools/ai/logo-generator
- https://toolorbit.site/tools/ai/image-generator
- https://toolorbit.site/tools/ai/svg-generator
- https://toolorbit.site/tools/ai/xiaohongshu
- https://toolorbit.site/tools/ai/text-polisher
- https://toolorbit.site/tools/ai/translator
- https://toolorbit.site/tools/ai/listing-generator
- https://toolorbit.site/tools/ai/keyword-analyzer
- https://toolorbit.site/tools/ai/competitor-tracker
- https://toolorbit.site/tools/ai/market-insights
- https://toolorbit.site/tools/pdf/pdf-merge
- https://toolorbit.site/tools/pdf/pdf-split
- https://toolorbit.site/tools/pdf/pdf-to-image
- https://toolorbit.site/tools/image/image-compressor
- https://toolorbit.site/tools/image/image-converter
- https://toolorbit.site/tools/image/svg-to-png
- https://toolorbit.site/tools/ecommerce/etsy-fee-calculator
- https://toolorbit.site/tools/ecommerce/etsy-pricing-calculator
- https://toolorbit.site/tools/ecommerce/etsy-offsite-ads-calculator
- https://toolorbit.site/tools/ecommerce/stripe-fee-calculator
- https://toolorbit.site/tools/ecommerce/paypal-fee-calculator
- https://toolorbit.site/tools/ecommerce/stripe-vs-paypal-fee-calculator
- https://toolorbit.site/tools/ai/hs-code-assistant
- https://toolorbit.site/tools/ai/product-asset-checker
- https://toolorbit.site/tools/ai/product-image-generator

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
