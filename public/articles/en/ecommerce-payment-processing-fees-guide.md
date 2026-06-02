# Ecommerce Payment Processing Fees: Etsy, Stripe, PayPal, and Your Real Margin

Ecommerce sellers often compare fees in the wrong direction. Etsy fees, Stripe fees, and PayPal fees do not represent the same kind of cost. Etsy charges for marketplace access and order processing. Stripe and PayPal mainly process payments, though PayPal may also add wallet, checkout, invoice, international, and currency-related layers.

The useful question is not "Which fee is lowest?" The useful question is: "After fees, traffic cost, conversion, support, and refunds, which channel leaves the best real margin?"

## Marketplace Fees vs Payment Processor Fees

Etsy is a marketplace. Its fees help fund search visibility, buyer trust, marketplace infrastructure, and payment handling. A standalone website using Stripe or PayPal does not automatically bring buyers. You may pay less per transaction but spend more on traffic, content, ads, email, and support.

The broad distinction:

| Channel | What the fee pays for |
|---------|-----------------------|
| Etsy | Marketplace traffic, listing infrastructure, transaction layer, payments, seller tools |
| Stripe | Card and payment processing infrastructure |
| PayPal | Wallet checkout, card processing, buyer trust, invoices, payment links |

That is why comparing Etsy's all-in fee to Stripe's payment fee can be misleading unless you also account for the cost of acquiring the customer.

### Etsy's fee structure in detail

To understand what you pay on Etsy, include the full list:

| Fee | Typical amount | Applied to |
|-----|---------------|------------|
| Listing fee | $0.20 per listing | Each listing, renews every 4 months or when quantity sells |
| Transaction fee | 6.5% of order total | Item price + shipping + gift wrap |
| Etsy Payments processing fee | 3% + $0.25 (US) | Order total including tax |
| Offsite Ads fee | 12% or 15% of order total | Orders attributed to Etsy ads (applicable after $10K threshold or if opted in) |
| Regulatory operating fee | Varies by country (e.g., 0.40% in France) | Order total for buyers in regulated markets |
| Currency conversion | 2.5% of order total | Orders where listing currency differs from payment currency |

On a $50 item with $5 shipping, the Etsy transaction fee alone is `$55 × 6.5% = $3.58`. Add the payment processing fee: `$55 × 3% + $0.25 = $1.90`. Total Etsy-specific fees: roughly $5.48 (plus the $0.20 listing fee). That is about 11% of the order total — before any product cost, shipping cost, or ad fees.

### Other marketplaces at a glance

| Marketplace | Transaction fee (approx.) | Payment processing | Notes |
|-------------|--------------------------|-------------------|-------|
| Amazon Handmade | 15% | Included (Amazon Pay) | No listing fee for Handmade; $39.99/mo Professional plan otherwise |
| eBay | 13.25% (most categories) + $0.40 | Managed Payments (included) | Varies by category; additional promoted listing fees available |
| Shopify | 0% (platform only) | 2.9% + $0.30 (Shopify Payments) | $39–$399/mo subscription; 2% additional if using third-party processor |
| WooCommerce | 0% (platform only) | Depends on processor | Hosting, domain, plugins are separate costs |

The pattern is consistent: marketplaces charge higher per-transaction fees but include demand. Independent platforms charge lower per-transaction fees but require you to bring (or earn) your own traffic.

## Start With Per-Order Math

For each channel, calculate:

```text
customer payment
- platform fees
- payment processing fees
- ads or acquisition cost
- item cost
- shipping and packaging cost
- refunds and support allowance
= real contribution margin
```

The [Etsy Fee Calculator](/tools/ecommerce/etsy-fee-calculator) helps estimate the marketplace side. The [Stripe Fee Calculator](/tools/ecommerce/stripe-fee-calculator), [PayPal Fee Calculator](/tools/ecommerce/paypal-fee-calculator), and [Stripe vs PayPal Fee Calculator](/tools/ecommerce/stripe-vs-paypal-fee-calculator) help estimate the independent payment side.

### Worked example: Etsy vs independent store

Imagine a $50 handmade product with $5 shipping charged to the buyer and $18 in direct cost (materials, packaging).

**Etsy scenario:**

```text
Customer payment: $55.00
- Listing fee: $0.20
- Transaction fee (6.5%): $3.58
- Payment processing (3% + $0.25): $1.90
- Direct cost: $18.00
- Shipping cost: $6.00
- Contribution margin: $25.32
```

**Independent store scenario (Stripe, own traffic):**

```text
Customer payment: $55.00
- Stripe fee (2.9% + $0.30): $1.90
- Direct cost: $18.00
- Shipping cost: $6.00
- Customer acquisition cost (ads, content, SEO): $5.00
- Contribution margin: $24.10
```

The independent store has lower processing fees ($1.90 vs. $5.48), but the $5 acquisition cost narrows the margin gap. If the store can acquire customers for $3 or less through organic search or email, the independent scenario becomes clearly more profitable. If acquisition cost averages $8, Etsy wins.

This is the real comparison: not Etsy fees vs. Stripe fees, but the full channel margin after all costs.

## Payment Method Mix Optimization

Different payment methods within the same checkout carry different costs:

| Payment method | Typical added cost | Impact |
|---------------|-------------------|--------|
| Domestic credit/debit card | Baseline rate | Lowest cost |
| International card | +1.5% | Meaningful for global sellers |
| Digital wallet (Apple Pay, Google Pay) | Same as underlying card | Neutral — card rate applies |
| PayPal wallet | PayPal Checkout rate (higher) | Can be 0.5-1% above card rate |
| BNPL (Afterpay, Klarna, Affirm) | 4-6% of transaction | Highest — but can increase AOV |
| ACH / bank debit | 0.8% capped at $5 (Stripe) | Cheapest for high-value transactions |

For a store with $100 average order value, offering ACH as an option on invoices over $500 can save $10+ per transaction compared to card processing. The trade-off is that ACH takes 4-5 business days to settle, while cards settle in 2 days.

### BNPL: expensive but potentially worth it

Buy-now-pay-later options charge merchants 4-6% of the transaction — roughly double the standard card rate. However, BNPL providers report that AOV increases 30-60% when BNPL is offered. A $50 order at 6% BNPL fee costs $3.00. If BNPL enables a $75 order instead, the additional $25 in revenue at standard margins easily covers the fee.

The decision is not "is BNPL too expensive?" but "does the AOV increase offset the higher processing cost?" Track BNPL-attributed orders separately in your analytics before deciding whether to keep it.

## Shopify Payments vs. Third-Party Processors

Shopify merchants face an important processor decision:

- **Shopify Payments:** 2.9% + $0.30 for basic plans, decreasing at higher tiers. No additional transaction fee.
- **Third-party processor (Stripe, PayPal, etc.):** Processor's rate + Shopify's additional fee (2%, 1%, or 0.5% depending on plan).

If you use Stripe directly on the Basic Shopify plan ($39/mo), you pay Stripe's 2.9% + $0.30 plus Shopify's 2% additional fee, totaling 4.9% + $0.30 — significantly worse than just using Shopify Payments. On the Advanced plan ($399/mo), the additional fee drops to 0.5%, making third-party processors more competitive.

For most Shopify merchants on Basic or Standard plans, Shopify Payments is the clear fee winner. Only consider a third-party processor on Shopify if you need features Shopify Payments does not offer (specific fraud tools, custom checkout flows, multi-currency requirements).

## International Selling: Understanding the Full Cost Stack

Selling internationally adds cost layers that can surprise sellers:

| Cost layer | Etsy | Standalone (Stripe) | Standalone (PayPal) |
|------------|------|---------------------|---------------------|
| International transaction fee | N/A (transaction fee is flat 6.5%) | +1.5% for international cards | +1.50% international commercial |
| Currency conversion | 2.5% (if listing currency ≠ payment currency) | +1% (if presentment ≠ settlement currency) | +3-4% spread above base rate |
| Regulatory operating fee | Yes (varies by buyer country) | No | No |
| Shipping complexity | Etsy labels available for some international routes | Self-managed | Self-managed |

Etsy's flat 6.5% transaction fee can help on international orders because it does not increase for cross-border transactions. The main international cost on Etsy is the 2.5% currency conversion fee and any applicable regulatory operating fees.

On a standalone store, international orders carry the additional 1.5% card surcharge and currency conversion. If your store is 30%+ international, factor these costs into your pricing or consider geolocation-based pricing that adjusts displayed prices by buyer country.

## Chargebacks, Fraud, and Risk Costs

Fraud and chargebacks add a cost layer that is easy to ignore until it happens:

- **Chargeback fee:** $15 (Stripe, refunded if won) or $20 (PayPal, not always refunded).
- **Fraud monitoring tools:** Stripe Radar ($0.02–$0.05 per screened transaction). PayPal Seller Protection is included.
- **3D Secure:** Required for SCA compliance in Europe. Can reduce fraud but may add checkout friction.

A store processing $100,000/year with a 0.3% chargeback rate faces 30 chargebacks annually. At $15–$20 each, that is $450–$600 in chargeback fees alone, plus the lost merchandise or service value for each chargeback lost.

Investing in fraud prevention — clear product descriptions, delivery tracking, responsive customer support, and 3D Secure where appropriate — usually costs less than the chargebacks it prevents.

## Cash Flow and Payout Timing

Different channels release funds on different schedules:

| Channel | Standard payout | Notes |
|---------|----------------|-------|
| Etsy | Weekly (can be daily for eligible sellers) | Funds held for new shops |
| Stripe | 2 business days (US) | Instant payout available (1% fee) |
| PayPal | 1-3 business days | Instant payout available (1.5% fee) |
| eBay | 1-2 business days (Managed Payments) | Some categories have longer holds |
| Amazon Handmade | Bi-weekly (net 14 days) | Slowest standard payout |

For a small business with tight cash flow, the difference between daily Etsy payouts and bi-weekly Amazon payouts can affect inventory purchasing and shipping cost coverage. Factor payout timing into your working capital requirements when choosing which channel to prioritize.

## Tax Compliance Across Channels

Sales tax, VAT, and GST handling differ by channel:

- **Etsy:** Collects and remits sales tax on your behalf for most US states and many international jurisdictions. This is a significant operational advantage.
- **Stripe:** Offers Stripe Tax (paid add-on) for automatic tax calculation and collection. Without it, you manage tax rates manually.
- **PayPal:** Does not automatically calculate or collect taxes. You set tax rates manually in your PayPal account or invoicing tools.
- **Shopify:** Built-in tax calculation for most jurisdictions. Collects but you remit.

Marketplace facilitator laws in the US, EU, and UK mean that marketplaces like Etsy, eBay, and Amazon handle tax on your behalf. Independent stores must manage tax compliance themselves. The cost of a tax automation tool (typically $20–$100/month) should be included in your standalone store's cost model.

## Multi-Channel Strategy: When to Use Which

Many small ecommerce businesses use more than one channel. A common pattern:

1. **Etsy** for discovery and new customer acquisition. Accept the higher fees as a customer acquisition cost.
2. **Standalone store (Shopify/WooCommerce + Stripe)** for repeat customers and higher-margin direct sales. Include a card in shipments inviting buyers to the standalone store for future purchases.
3. **PayPal** as a secondary payment option on the standalone store for buyers who prefer wallet checkout.
4. **Amazon Handmade or eBay** as secondary marketplaces if they reach a different buyer segment.

The key is tracking customer acquisition source. If an Etsy buyer becomes a repeat customer on your standalone store, the higher Etsy fee on that first order was effectively a customer acquisition cost — and a relatively low one compared to paid ads.

## A Practical Comparison Workflow

1. Estimate Etsy profit with the [Etsy Fee Calculator](/tools/ecommerce/etsy-fee-calculator).
2. Estimate Stripe payout for the same order amount with the [Stripe Fee Calculator](/tools/ecommerce/stripe-fee-calculator).
3. Estimate PayPal payout for the same order amount with the [PayPal Fee Calculator](/tools/ecommerce/paypal-fee-calculator).
4. Compare Stripe and PayPal side by side with the [Stripe vs PayPal Fee Calculator](/tools/ecommerce/stripe-vs-paypal-fee-calculator).
5. Add customer acquisition cost to the standalone website scenario.
6. Add platform subscription, tax tools, and fraud prevention to the independent store cost model.
7. Factor in payout timing and cash flow for each channel.
8. Decide which channel deserves more promotion.

## Key Takeaways

1. Etsy fees and payment processor fees are different categories of cost — Etsy includes demand generation; processors do not.
2. Stripe and PayPal reduce the payment-processing layer, not the traffic-acquisition layer.
3. Net margin depends on order value, direct cost, conversion, refunds, ads, fraud, taxes, and repeat purchase behavior.
4. BNPL costs more per transaction but can increase AOV enough to justify the fee.
5. International orders carry additional cost layers on every channel. Etsy's flat transaction fee can help here.
6. Payout timing and tax compliance are hidden costs that affect working capital and operational complexity.
7. Sellers should compare channels with real scenarios, not headline percentages.
8. A healthy ecommerce strategy may use Etsy for discovery, a standalone store for repeat margin, and PayPal as a checkout complement.

---

Start with the [Etsy Fee Calculator](/tools/ecommerce/etsy-fee-calculator), then compare payment processors with the [Stripe vs PayPal Fee Calculator](/tools/ecommerce/stripe-vs-paypal-fee-calculator). For subscription modeling, check the [Stripe Fee Calculator](/tools/ecommerce/stripe-fee-calculator).
