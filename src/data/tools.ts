import type { ComponentType } from 'react';
import {
  ShoppingCart,
  CreditCard,
  Sparkles,
  Target,
  BarChart3,
  Image as ImageIcon,
  Calculator,
  Banknote,
  ShieldCheck,
  PackageSearch,
  Tag as TagIcon,
  Truck,
} from 'lucide-react';
import { TOOLS_META, type Category, type ToolMeta } from './tools-meta';

export type { Category, ToolMeta };

const iconMap: Record<string, ComponentType<any>> = {
  'etsy-fee-calculator': ShoppingCart,
  'etsy-offsite-ads-calculator': Target,
  'etsy-pricing-calculator': Calculator,
  'etsy-regulatory-fee-calculator': Banknote,
  'etsy-tag-generator': TagIcon,
  'etsy-free-shipping-calculator': Truck,
  'stripe-fee-calculator': CreditCard,
  'paypal-fee-calculator': CreditCard,
  'stripe-vs-paypal-fee-calculator': BarChart3,
  'listing-generator': Sparkles,
  'keyword-analyzer': BarChart3,
  'ai-hs-code-assistant': PackageSearch,
  'ai-product-asset-checker': ShieldCheck,
  'ai-product-image-generator': ImageIcon,
};

export interface ToolItem extends ToolMeta {
  icon: ComponentType<any>;
}

export const TOOLS: ToolItem[] = TOOLS_META.map((tool) => ({
  ...tool,
  icon: iconMap[tool.id] || ShoppingCart,
}));

export const CATEGORIES: Category[] = Array.from(
  new Set(TOOLS.map((t) => t.category))
);
