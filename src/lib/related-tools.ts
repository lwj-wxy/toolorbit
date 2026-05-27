import type { ToolItem } from '../data/tools';

const PREFERRED_RELATED_TOOL_PATHS: Record<string, string[]> = {
  '/tools/ecommerce/stripe-fee-calculator': [
    '/tools/ecommerce/paypal-fee-calculator',
    '/tools/ecommerce/stripe-vs-paypal-fee-calculator',
    '/tools/ecommerce/etsy-fee-calculator',
    '/tools/ecommerce/etsy-pricing-calculator',
  ],
  '/tools/ecommerce/paypal-fee-calculator': [
    '/tools/ecommerce/stripe-vs-paypal-fee-calculator',
    '/tools/ecommerce/stripe-fee-calculator',
    '/tools/ecommerce/etsy-fee-calculator',
    '/tools/ecommerce/etsy-pricing-calculator',
  ],
  '/tools/ecommerce/stripe-vs-paypal-fee-calculator': [
    '/tools/ecommerce/stripe-fee-calculator',
    '/tools/ecommerce/paypal-fee-calculator',
    '/tools/ecommerce/etsy-fee-calculator',
    '/tools/ecommerce/etsy-pricing-calculator',
  ],
  '/tools/ecommerce/etsy-fee-calculator': [
    '/tools/ecommerce/etsy-pricing-calculator',
    '/tools/ecommerce/etsy-offsite-ads-calculator',
    '/tools/ecommerce/stripe-fee-calculator',
    '/tools/ecommerce/paypal-fee-calculator',
  ],
  '/tools/ecommerce/etsy-pricing-calculator': [
    '/tools/ecommerce/etsy-fee-calculator',
    '/tools/ecommerce/etsy-offsite-ads-calculator',
    '/tools/ecommerce/stripe-vs-paypal-fee-calculator',
    '/tools/ecommerce/paypal-fee-calculator',
  ],
};

const shuffleTools = (tools: ToolItem[]) => {
  const shuffledTools = [...tools];

  for (let currentIndex = shuffledTools.length - 1; currentIndex > 0; currentIndex -= 1) {
    const randomIndex = Math.floor(Math.random() * (currentIndex + 1));
    [shuffledTools[currentIndex], shuffledTools[randomIndex]] = [shuffledTools[randomIndex], shuffledTools[currentIndex]];
  }

  return shuffledTools;
};

export const getRandomRelatedTools = (tools: ToolItem[], currentTool: ToolItem, count = 4) => {
  const candidateTools = tools.filter((tool) => tool.id !== currentTool.id && !tool.isNoIndex);
  const preferredRelatedTools = (PREFERRED_RELATED_TOOL_PATHS[currentTool.path] || [])
    .map((path) => candidateTools.find((tool) => tool.path === path))
    .filter((tool): tool is ToolItem => Boolean(tool));

  if (preferredRelatedTools.length >= count) {
    return preferredRelatedTools.slice(0, count);
  }

  const preferredToolIds = new Set(preferredRelatedTools.map((tool) => tool.id));
  const remainingTools = candidateTools.filter((tool) => !preferredToolIds.has(tool.id));

  return [...preferredRelatedTools, ...shuffleTools(remainingTools)].slice(0, count);
};
