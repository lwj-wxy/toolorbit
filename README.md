[中文版本](README_zh.md)

# ToolOrbit

[ToolOrbit](https://toolorbit.site) is a workspace for Etsy sellers preparing listings, checking product assets, and making pricing decisions before publishing.

It combines fee and pricing calculators with AI-assisted listing, keyword, image, and customs-preparation tools. Calculators run in the browser. AI features send the submitted input to the configured model service and return an editable draft or review result.

## Public Tools

### Pricing And Fees

| Tool | Purpose | Link |
| --- | --- | --- |
| Etsy Fee Calculator | Estimate listing, transaction, payment, ad, and order-profit outcomes. | [Open](https://toolorbit.site/tools/ecommerce/etsy-fee-calculator) |
| Etsy Offsite Ads Calculator | Compare Offsite Ads fee scenarios and profit impact. | [Open](https://toolorbit.site/tools/ecommerce/etsy-offsite-ads-calculator) |
| Etsy Pricing Calculator | Work backward from costs, shipping, fees, and a target profit. | [Open](https://toolorbit.site/tools/ecommerce/etsy-pricing-calculator) |
| Etsy Regulatory Fee Calculator | Estimate regulatory and currency-conversion fee scenarios by seller location. | [Open](https://toolorbit.site/tools/ecommerce/etsy-regulatory-fee-calculator) |
| Etsy Tag Optimizer | Generate and check 13 Etsy tags within the character limit. | [Open](https://toolorbit.site/tools/ecommerce/etsy-tag-generator) |
| Etsy Free Shipping Calculator | Compare a free-shipping price against a target margin. | [Open](https://toolorbit.site/tools/ecommerce/etsy-free-shipping-calculator) |
| Stripe Fee Calculator | Estimate processing fees, net payout, and a reverse charge amount. | [Open](https://toolorbit.site/tools/ecommerce/stripe-fee-calculator) |
| PayPal Fee Calculator | Estimate processing fees and net payout across supported payment profiles. | [Open](https://toolorbit.site/tools/ecommerce/paypal-fee-calculator) |
| Stripe vs PayPal Fee Calculator | Compare fees and payout for the same payment amount. | [Open](https://toolorbit.site/tools/ecommerce/stripe-vs-paypal-fee-calculator) |

### AI-Assisted Seller Workflows

| Tool | Purpose | Link |
| --- | --- | --- |
| AI Listing Generator | Draft listing titles, descriptions, tags, and social copy. | [Open](https://toolorbit.site/tools/ai/listing-generator) |
| Ecommerce Keyword Analyzer | Group product keywords by intent and identify listing angles. | [Open](https://toolorbit.site/tools/ai/keyword-analyzer) |
| AI HS Code Assistant | Prepare customs names, invoice descriptions, candidate directions, and review questions. | [Open](https://toolorbit.site/tools/ai/hs-code-assistant) |
| Product Asset Checker | Review product, packaging, and label images for common marketplace risks. | [Open](https://toolorbit.site/tools/ai/product-asset-checker) |
| Product Image Generator | Create image drafts for listings, ads, and product pages. | [Open](https://toolorbit.site/tools/ai/product-image-generator) |

## Guides

The [blog](https://toolorbit.site/blog) contains current guides that support the seller tools. Published posts are defined in `src/constants/blogData.ts` and listed here so external readers can reach a specific article directly.

| Guide | Link |
| --- | --- |
| The Complete Guide to Etsy Fees in 2026: What Every Seller Actually Pays | [Read](https://toolorbit.site/blog/etsy-fee-complete-guide) |
| Etsy Digital Download Pricing: How to Price Printables, Templates, and Files | [Read](https://toolorbit.site/blog/etsy-digital-download-pricing-guide) |
| Etsy SEO in 2026: Titles, Tags, Attributes, and Descriptions That Match Real Buyers | [Read](https://toolorbit.site/blog/etsy-seo-title-tags-guide) |
| 2026 Etsy Shop Setup Checklist: How to Open a Shop Without Getting Suspended | [Read](https://toolorbit.site/blog/etsy-shop-setup-checklist-2026) |
| Top 10 High-Margin Etsy Digital Products to Sell in 2026 | [Read](https://toolorbit.site/blog/etsy-digital-planner-ideas-2026) |
| 15 High-Converting Customer Service Email Templates for Etsy Sellers | [Read](https://toolorbit.site/blog/etsy-customer-service-templates) |
| Etsy Print on Demand (POD) Margin & Profit Guide 2026 | [Read](https://toolorbit.site/blog/etsy-print-on-demand-margin-guide) |
| How to Conduct Etsy Competitor Analysis to Find Underserved Niches | [Read](https://toolorbit.site/blog/etsy-competitor-analysis-guide) |
| Etsy Offsite Ads Explained: The Program You Can't Always Opt Out Of | [Read](https://toolorbit.site/blog/etsy-offsite-ads-explained) |
| Etsy Shipping Strategy: Free Shipping, Buyer-Paid Shipping, and Profit Math | [Read](https://toolorbit.site/blog/etsy-shipping-free-shipping-strategy) |
| Etsy Product Photos That Convert: A Practical Shot List for Sellers | [Read](https://toolorbit.site/blog/etsy-product-photography-conversion-guide) |
| Etsy International Selling Fees: Regulatory Charges and Currency Conversion | [Read](https://toolorbit.site/blog/etsy-international-selling-fees) |
| Stripe vs PayPal Fees: Which Payment Processor Is Cheaper? | [Read](https://toolorbit.site/blog/stripe-vs-paypal-fees-guide) |
| How Much Does Etsy Take Per Sale? | [Read](https://toolorbit.site/blog/how-much-does-etsy-take-per-sale) |
| Etsy Pricing Strategy: How to Price for Profit (Not Just Revenue) | [Read](https://toolorbit.site/blog/etsy-pricing-strategy-guide) |

## Local Development

Requirements: Node.js 20 or later and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

The development server listens on `http://localhost:8001`.

### Environment Variables

| Variable | Use |
| --- | --- |
| `MINIMAX_API_KEY` | Required for AI generation, vision review, and image generation. |
| `MINIMAX_TEXT_MODEL` | Optional text-model override. |
| `MINIMAX_VISION_MODEL` | Optional vision-model override. |
| `MINIMAX_IMAGE_MODEL` | Optional image-model override. |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Optional GA4 measurement ID. |
| `NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT` | Optional AdSense publisher ID. |

`DEEPSEEK_API_KEY` and `ZHIPU_API_KEY` remain in the example environment file for deployment compatibility, but current public AI routes use the MiniMax configuration.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js development server on port 8001. |
| `npm run lint` | Generate Next types and run TypeScript checks. |
| `npm run build` | Generate the sitemap, build the application, and precompress static assets. |
| `npm run deploy:local` | Create the local deployment package and archive. |

## Project Structure

```text
src/app/                  Next.js routes and API handler
src/views/tools/          Tool interfaces and calculations
src/data/tools-meta.ts    Public tool registry
src/constants/blogData.ts Published blog registry
src/lib/                  Metadata, sitemap, navigation, and shared helpers
public/articles/en/       Markdown source for published guides
```

## Data Handling

- Fee and pricing calculators process values in the browser.
- AI listing, image, asset-review, and HS-code features submit the required input to the configured model service.
- Calculator outputs are estimates. AI results are drafts or review aids. Check product facts, platform rules, fees, and compliance requirements before publishing or submitting anything.

## License

MIT © ToolOrbit
