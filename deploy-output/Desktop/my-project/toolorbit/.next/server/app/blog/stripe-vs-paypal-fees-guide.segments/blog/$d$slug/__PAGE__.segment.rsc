1:"$Sreact.fragment"
6:I[859260,["/_next/static/chunks/0y82cjhol40~m.js","/_next/static/chunks/0otf~6sr~7_u2.js","/_next/static/chunks/0vnxt0p1ck.lx.js","/_next/static/chunks/02gkxz_30fhbr.js","/_next/static/chunks/0dy~me0ykin7y.js","/_next/static/chunks/06pc0~yf2n62x.js"],"default"]
8:I[314386,["/_next/static/chunks/0y82cjhol40~m.js","/_next/static/chunks/0otf~6sr~7_u2.js","/_next/static/chunks/0vnxt0p1ck.lx.js","/_next/static/chunks/02gkxz_30fhbr.js","/_next/static/chunks/0dy~me0ykin7y.js"],"OutletBoundary"]
9:"$Sreact.suspense"
2:T12fc,[{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"ToolOrbit","item":"https://toolorbit.site"},{"@type":"ListItem","position":2,"name":"Blog","item":"https://toolorbit.site/blog"},{"@type":"ListItem","position":3,"name":"Stripe vs PayPal Fees: Which Payment Processor Is Cheaper?","item":"https://toolorbit.site/blog/stripe-vs-paypal-fees-guide"}]},{"@context":"https://schema.org","@type":"BlogPosting","headline":"Stripe vs PayPal Fees: Which Payment Processor Is Cheaper?","description":"Compare Stripe and PayPal fees by transaction size, checkout method, international cards, fixed fees, and net payout instead of relying on headline percentages.","articleSection":"Business","wordCount":1925,"image":"https://toolorbit.site/images/blog/stripe-vs-paypal-fees-guide.jpg","thumbnailUrl":"https://toolorbit.site/images/blog/stripe-vs-paypal-fees-guide.jpg","url":"https://toolorbit.site/blog/stripe-vs-paypal-fees-guide","mainEntityOfPage":"https://toolorbit.site/blog/stripe-vs-paypal-fees-guide","datePublished":"2026-05-27","dateModified":"2026-05-27","author":{"@type":"Person","@id":"https://toolorbit.site/authors/luo-wj#author","name":"Luo WJ","url":"https://toolorbit.site/authors/luo-wj","description":"Luo WJ maintains ToolOrbit as a practical, browser-first utility project, reviewing developer, image, PDF, AI, and ecommerce workflows for clarity, privacy boundaries, and hands-on usefulness.","jobTitle":"ToolOrbit maintainer and browser workflow reviewer","worksFor":{"@type":"Organization","@id":"https://toolorbit.site/#organization","name":"ToolOrbit","url":"https://toolorbit.site","logo":{"@type":"ImageObject","url":"https://toolorbit.site/icon.svg"},"email":"luowj1998@outlook.com","description":"Free browser-based tools for developers, creators, PDF, image, ecommerce, and AI workflows. Fast online utilities with privacy-friendly local processing.","knowsAbout":["browser-based developer tools","client-side data processing","PDF workflow utilities","image optimization","AI-assisted productivity","ecommerce operations tools","technical writing for practical workflows"],"contactPoint":{"@type":"ContactPoint","email":"luowj1998@outlook.com","contactType":"customer support","availableLanguage":["English","Chinese"]},"publishingPrinciples":"https://toolorbit.site/about"},"knowsAbout":["browser-based developer tools","client-side data processing","PDF workflow utilities","image optimization","AI-assisted productivity","ecommerce operations tools","technical writing for practical workflows"]},"publisher":{"@type":"Organization","@id":"https://toolorbit.site/#organization","name":"ToolOrbit","url":"https://toolorbit.site","logo":{"@type":"ImageObject","url":"https://toolorbit.site/icon.svg"},"email":"luowj1998@outlook.com","description":"Free browser-based tools for developers, creators, PDF, image, ecommerce, and AI workflows. Fast online utilities with privacy-friendly local processing.","knowsAbout":["browser-based developer tools","client-side data processing","PDF workflow utilities","image optimization","AI-assisted productivity","ecommerce operations tools","technical writing for practical workflows"],"contactPoint":{"@type":"ContactPoint","email":"luowj1998@outlook.com","contactType":"customer support","availableLanguage":["English","Chinese"]},"publishingPrinciples":"https://toolorbit.site/about"},"reviewedBy":{"@type":"Organization","@id":"https://toolorbit.site/#organization","name":"ToolOrbit","url":"https://toolorbit.site","logo":{"@type":"ImageObject","url":"https://toolorbit.site/icon.svg"},"email":"luowj1998@outlook.com","description":"Free browser-based tools for developers, creators, PDF, image, ecommerce, and AI workflows. Fast online utilities with privacy-friendly local processing.","knowsAbout":["browser-based developer tools","client-side data processing","PDF workflow utilities","image optimization","AI-assisted productivity","ecommerce operations tools","technical writing for practical workflows"],"contactPoint":{"@type":"ContactPoint","email":"luowj1998@outlook.com","contactType":"customer support","availableLanguage":["English","Chinese"]},"publishingPrinciples":"https://toolorbit.site/about"},"inLanguage":"en","publishingPrinciples":"https://toolorbit.site/about","about":[{"@type":"WebApplication","name":"Stripe vs PayPal Fee Calculator - Compare Payment Processing Costs","url":"https://toolorbit.site/tools/ecommerce/stripe-vs-paypal-fee-calculator"},{"@type":"WebApplication","name":"Stripe Fee Online Calculator - Global Credit Card Processing Costs","url":"https://toolorbit.site/tools/ecommerce/stripe-fee-calculator"},{"@type":"WebApplication","name":"PayPal Fee Calculator for Checkout, Goods & Services, and Invoices","url":"https://toolorbit.site/tools/ecommerce/paypal-fee-calculator"}]}]0:{"rsc":["$","$1","c",{"children":[[["$","template",null,{"id":"structured-data-blog-stripe-vs-paypal-fees-guide","dangerouslySetInnerHTML":{"__html":"$2"}}],"$L3"],["$L4"],"$L5"]}],"isPartial":false,"staleTime":300,"varyParams":null,"buildId":"bYYi-ZPGnf7tmCL1WLFhj"}
7:T2fa4,# Stripe vs PayPal Fees: Which Payment Processor Is Cheaper?

Stripe and PayPal are often compared as if the answer is simply "2.9% vs 3.49%." That shortcut is not enough. The cheaper processor depends on the payment method, transaction size, fixed fee, international status, currency conversion, buyer trust, and the checkout experience you need.

This guide focuses on fee math and net payout. To run your own numbers, open the [Stripe vs PayPal Fee Calculator](/tools/ecommerce/stripe-vs-paypal-fee-calculator) and enter the same order amount you plan to charge.

## Baseline US Fee Comparison

For a simple domestic US card-style comparison:

| Processor / payment type | Common published baseline |
|--------------------------|---------------------------|
| Stripe domestic online card | 2.9% + $0.30 |
| PayPal Checkout | 3.49% + fixed fee |
| PayPal standard credit/debit card payment | 2.99% + fixed fee |
| PayPal Goods & Services | 2.99% |

On a $100 domestic payment:

```text
Stripe: $100 × 2.9% + $0.30 = $3.20 fee
PayPal Checkout: $100 × 3.49% + $0.49 = $3.98 fee
Difference: $0.78
```

That does not mean Stripe is always the right choice. It means the fee comparison starts with net payout and then moves to product fit.

### Fee comparison across price points

A single $100 comparison hides how the gap changes with order size. Here is the full picture for domestic US transactions:

| Order amount | Stripe (2.9% + $0.30) | PayPal Checkout (3.49% + $0.49) | PayPal Card (2.99% + $0.49) | Difference (Stripe vs PP Checkout) |
|---:|---:|---:|---:|---:|
| $5.00 | $0.45 | $0.66 | $0.64 | $0.21 |
| $10.00 | $0.59 | $0.84 | $0.79 | $0.25 |
| $25.00 | $1.03 | $1.36 | $1.24 | $0.33 |
| $50.00 | $1.75 | $2.24 | $1.99 | $0.49 |
| $100.00 | $3.20 | $3.98 | $3.48 | $0.78 |
| $250.00 | $7.55 | $9.22 | $7.97 | $1.67 |
| $500.00 | $14.80 | $17.94 | $15.44 | $3.14 |
| $1,000.00 | $29.30 | $35.39 | $30.39 | $6.09 |

The key insight: Stripe is cheaper for domestic card payments at every price point, but the absolute difference is under $1 for transactions below $100. For low-ticket sellers, the fee difference may matter less than conversion rate and buyer preference.

## Why Fixed Fees Change the Winner

Fixed fees hit small transactions hard. Stripe's $0.30 fixed fee and PayPal Checkout's $0.49 fixed fee are both minor on a $500 invoice but large on a $5 digital file.

For low-ticket products, compare the effective rate:

```text
Fee ÷ customer payment × 100 = effective fee rate
```

| Order amount | Stripe effective rate | PayPal Checkout effective rate | PayPal Card effective rate |
|---:|---:|---:|---:|
| $5.00 | 9.0% | 13.2% | 12.8% |
| $10.00 | 5.9% | 8.4% | 7.9% |
| $25.00 | 4.1% | 5.4% | 5.0% |
| $50.00 | 3.5% | 4.5% | 4.0% |
| $100.00 | 3.2% | 4.0% | 3.5% |

At $10, both processors have effective rates far above their headline percentages. If your average order is under $25, the fixed fee is the dominant cost driver — not the percentage rate.

### Micropayments comparison

PayPal's micropayments rate (5% + $0.05) changes the low-ticket comparison significantly:

| Order amount | Stripe (2.9% + $0.30) | PayPal Micropayments (5% + $0.05) | Winner |
|---:|---:|---:|---:|
| $5.00 | $0.45 | $0.30 | PayPal |
| $10.00 | $0.59 | $0.55 | PayPal |
| $12.00 | $0.65 | $0.65 | Tie |
| $15.00 | $0.74 | $0.80 | Stripe |

For transactions under $12, PayPal micropayments can actually be cheaper than Stripe. If your business model involves many sub-$10 transactions, PayPal with micropayments pricing may be your lowest-fee option among mainstream processors.

## International Cards and Currency Conversion

International payments can change the result quickly.

**Stripe** adds roughly 1.5% for international cards on top of domestic card pricing, plus 1% for currency conversion when the presentment currency differs from the settlement currency.

**PayPal** adds 1.50% for international commercial transactions on top of the domestic rate, plus a currency conversion spread of typically 3-4% above the base exchange rate.

For a $100 international payment:

```text
Stripe (international card, USD settlement):
$100 × (2.9% + 1.5%) + $0.30 = $4.70

PayPal Checkout (international, USD receipt):
$100 × (3.49% + 1.50%) + $0.49 = $5.48

Difference: $0.78 (same absolute gap as domestic, but both are higher)
```

The gap between Stripe and PayPal narrows in percentage terms once international surcharges are applied to both. However, if currency conversion is involved, PayPal's 3-4% spread can make it meaningfully more expensive than Stripe's 1% conversion fee.

If your buyers are mostly domestic, a domestic calculator estimate may be close enough for planning. If your buyers are international, model a realistic blended rate. A product with 40% international cards should not be priced as if every buyer is domestic.

## Beyond Transaction Fees: The Full Cost Picture

### Dispute and chargeback fees

| Fee type | Stripe | PayPal |
|----------|--------|--------|
| Chargeback fee | $15 | $20 (typically) |
| Dispute fee | N/A (handled via chargeback process) | $8–$16 (pre-chargeback dispute) |
| Chargeback fee refunded if won | Yes ($15 returned) | Not always |

Stripe's chargeback fee is lower and is refunded if you win the dispute. PayPal's two-tier system (dispute → chargeback) means you may pay both fees if an issue escalates.

### Refund handling

| Aspect | Stripe | PayPal |
|--------|--------|--------|
| Percentage fee refunded | Yes | Yes |
| Fixed fee refunded | No (Stripe no longer retains the fixed fee on refunds as of recent policy) | No ($0.49 retained) |

Stripe's policy of not retaining the fixed fee on refunds can save money for businesses with higher return rates. PayPal retains the $0.49 fixed fee on every refund.

### Payout timing

| Processor | Standard payout | Instant payout option |
|-----------|----------------|----------------------|
| Stripe | 2 business days (US) | Available (1% fee, min $0.50) |
| PayPal | 1-3 business days | Available (1.5% fee, min $0.25) |

Payout timing can affect cash flow for small businesses. If same-day access to funds matters, compare instant payout fees. For most businesses, the 1-2 day difference in standard payout timing is negligible.

## When Stripe Often Wins

Stripe often fits businesses that need:

- embedded checkout with more control over the user experience
- card-first payments
- SaaS subscriptions and usage-based billing
- developer-friendly APIs and webhook infrastructure
- detailed event data and custom payment flows
- lower domestic card processing costs in common US scenarios
- lower international card and currency conversion costs
- machine-learning fraud prevention (Stripe Radar)

For subscription businesses and software products, Stripe's billing engine (Stripe Billing) handles proration, tiered pricing, metered usage, and dunning management — features that go well beyond simple recurring payment collection.

## When PayPal Often Wins

PayPal can still be the better commercial choice when:

- customers strongly prefer paying with PayPal balance or wallet
- trust is more important than the lowest fee — PayPal's brand recognition can increase checkout completion for unfamiliar stores
- the business needs fast invoice or payment link workflows without developer resources
- buyers are international and recognize PayPal more readily than a card form
- the store wants PayPal as an additional checkout option rather than the only processor
- micropayments pricing makes PayPal cheaper than Stripe for sub-$12 transactions
- the business wants built-in seller protection without configuring additional fraud tools

A slightly higher fee can be acceptable if PayPal increases conversion enough to offset the cost. A 1% fee difference on a $50 order is $0.50. If PayPal boosts conversion by even 2%, it pays for itself.

## Feature Comparison Matrix

| Feature | Stripe | PayPal |
|---------|--------|--------|
| Hosted checkout page | Stripe Checkout | PayPal Checkout |
| Embedded/headless checkout | Stripe Elements | PayPal JavaScript SDK |
| Recurring subscriptions | Stripe Billing | PayPal Subscriptions |
| Invoicing | Stripe Invoicing | PayPal Invoices |
| Virtual terminal | Limited | PayPal Virtual Terminal |
| POS / in-person | Stripe Terminal | PayPal Zettle |
| ACH / bank transfers | Yes (ACH, SEPA, Bacs, etc.) | Limited |
| BNPL / pay later | Stripe (via Affirm, Klarna, etc.) | PayPal Pay Later |
| Multi-currency settlement | Yes | Yes |
| Fraud protection | Stripe Radar (ML-based) | PayPal Seller Protection (rules-based) |
| Marketplace / connect | Stripe Connect | PayPal Marketplace |

The feature comparison matters as much as the fee comparison. If you need Stripe Connect for a marketplace or Stripe Billing for complex subscriptions, the fee difference becomes secondary to capability.

## Do Not Compare Only One Transaction

The best comparison uses your real order mix:

| Metric | Why it matters |
|--------|----------------|
| Average order value | Fixed fees matter more at low AOV |
| Domestic vs international buyers | Additional percentage fees can stack |
| Refund rate | PayPal retains the fixed fee; Stripe does not |
| Dispute rate | Both have chargeback fees, PayPal adds dispute fees |
| Payment method mix | Wallet, card, Pay Later, and bank payments differ |
| Conversion rate | Lower fees do not help if fewer buyers complete checkout |
| Development resources | Stripe's API requires more initial setup |
| Payout timing needs | Instant payout fees differ between processors |

Start with the [Stripe vs PayPal Fee Calculator](/tools/ecommerce/stripe-vs-paypal-fee-calculator), then compare your actual monthly payment reports after launch.

## Should You Offer Both?

Many ecommerce teams offer both processors because they solve different problems. Stripe can be the primary card processor while PayPal remains available for buyers who prefer wallet checkout. This is especially common when the store sells internationally or when buyer trust is still being built.

The trade-off is operational complexity. More processors means more reconciliation, more failure modes, and more settings to maintain. If you add both, document which payment methods are enabled and how you reconcile fees each month.

A practical configuration for a small-to-medium store:

- **Primary:** Stripe for card processing (lower fees, better developer experience).
- **Secondary:** PayPal for wallet trust and international buyer preference.
- **Monitor:** After 3 months, check conversion by payment method. If one processor drives significantly more completed checkouts, adjust the prominence of each option.

### Country availability

Stripe is available in 46+ countries. PayPal is available in 200+ markets. If you sell to buyers in countries where Stripe is not supported for merchants, PayPal may be your only option for accepting international payments. Check both processors' country support pages before committing to a single-provider strategy.

## Key Takeaways

1. Stripe is often cheaper for standard domestic US online card payments at every price point.
2. PayPal micropayments can beat Stripe for transactions under $12.
3. PayPal Checkout may cost more but can improve trust and buyer completion in some markets.
4. Fixed fees make low-ticket products more expensive than percentage rates suggest — with either processor.
5. International cards and currency conversion change the comparison, with PayPal's conversion spread typically being the larger cost.
6. Stripe refunds the fixed fee; PayPal retains it. This matters for high-return businesses.
7. Feature needs (subscriptions, marketplace, fraud tools) may drive the decision more than fee differences.
8. The best processor is the one with the better net outcome after fees, conversion, refunds, disputes, and operating cost.

---

Use the [Stripe vs PayPal Fee Calculator](/tools/ecommerce/stripe-vs-paypal-fee-calculator) for side-by-side fee math, then check individual estimates with the [Stripe Fee Calculator](/tools/ecommerce/stripe-fee-calculator) and [PayPal Fee Calculator](/tools/ecommerce/paypal-fee-calculator).
3:["$","$L6",null,{"slug":"stripe-vs-paypal-fees-guide","initialMarkdown":"$7"}]
4:["$","script","script-0",{"src":"/_next/static/chunks/06pc0~yf2n62x.js","async":true}]
5:["$","$L8",null,{"children":["$","$9",null,{"name":"Next.MetadataOutlet","children":"$@a"}]}]
a:null
