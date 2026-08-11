'use client';

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

export type ToolComponentProps = {
  hideHeader?: boolean;
};

type ToolComponent = ComponentType<ToolComponentProps>;
type ToolLoader = () => Promise<{ default: ToolComponent }>;

const ToolLoading = () => (
  <div
    role="status"
    aria-label="Loading tool"
    className="flex min-h-[360px] items-center justify-center rounded-2xl border border-slate-200 bg-white/70 p-8 dark:border-slate-800 dark:bg-slate-900/60"
  >
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600 dark:border-slate-700 dark:border-t-blue-400" />
  </div>
);

const lazyTool = (loader: ToolLoader) =>
  dynamic(loader, {
    loading: ToolLoading,
    ssr: false,
  }) as ToolComponent;

export const toolComponentMap: Record<string, ToolComponent> = {
  '/tools/ecommerce/etsy-fee-calculator': lazyTool(() => import('../views/tools/ecommerce/EtsyFee')),
  '/tools/ecommerce/etsy-offsite-ads-calculator': lazyTool(() => import('../views/tools/ecommerce/EtsyOffsiteAds')),
  '/tools/ecommerce/etsy-pricing-calculator': lazyTool(() => import('../views/tools/ecommerce/EtsyPricing')),
  '/tools/ecommerce/etsy-regulatory-fee-calculator': lazyTool(() => import('../views/tools/ecommerce/EtsyRegulatoryFee')),
  '/tools/ecommerce/stripe-fee-calculator': lazyTool(() => import('../views/tools/ecommerce/StripeFee')),
  '/tools/ecommerce/paypal-fee-calculator': lazyTool(() => import('../views/tools/ecommerce/PayPalFee')),
  '/tools/ecommerce/stripe-vs-paypal-fee-calculator': lazyTool(() => import('../views/tools/ecommerce/StripeVsPayPalFee')),
  '/tools/ai/listing-generator': lazyTool(() => import('../views/tools/ai/ListingGenerator')),
  '/tools/ai/keyword-analyzer': lazyTool(() => import('../views/tools/ai/KeywordAnalyzer')),
  '/tools/ai/hs-code-assistant': lazyTool(() => import('../views/tools/ai/HsCodeAssistant')),
  '/tools/ai/product-asset-checker': lazyTool(() => import('../views/tools/ai/ProductAssetChecker')),
  '/tools/ai/product-image-generator': lazyTool(() => import('../views/tools/ai/ProductImageGenerator')),
};
