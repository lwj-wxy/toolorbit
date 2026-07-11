# Etsy International Selling Fees: Regulatory Charges and Currency Conversion Explained

If you sell on Etsy from outside the United States, you're likely paying fees that US-based sellers never see. Two of the most impactful — and least understood — are the Regulatory Operating Fee and the Currency Conversion Fee. Together, they can silently erode your margins by 1–4% per order.

Rates can change with Etsy policy updates. This article uses the maintained rate table in the project; check the [official Etsy fees policy](https://www.etsy.com/legal/fees/) and your payment account statement before relying on a number.

Payment processing fees by country are a separate check. Etsy Payments charges a percentage plus a fixed amount based on the seller's payment account country, while currency conversion depends on whether your listing currency matches your payout currency. Use the [Etsy Fee Calculator](/tools/ecommerce/etsy-fee-calculator) for the US baseline, then use the [Etsy Regulatory & Currency Fee Calculator](/tools/ecommerce/etsy-regulatory-fee-calculator) to model the country and currency layer.

## Payment Processing Fees by Country

Etsy payment processing is not the same as the transaction fee. The transaction fee is Etsy's marketplace fee. Payment processing is the card and payment handling charge, and the rate can vary by seller country.

For a US seller, the common Etsy Payments formula is 3% of the order total plus $0.25. Sellers in other countries should check the Etsy Payments rate shown for their payment account country, then add the regulatory and currency fees described below. The important point is the base: payment processing is calculated on the order total, not just the item price.

If your old spreadsheet only used a single "Etsy fee percentage," update it. A realistic international estimate needs four checks: transaction fee, payment processing, regulatory operating fee, and currency conversion. That is the stack that decides whether an international order is still profitable after payout.

## What Is the Regulatory Operating Fee?

Starting in 2024, Etsy introduced the Regulatory Operating Fee to offset costs associated with local regulations in certain countries — things like digital services taxes, marketplace facilitator rules, and consumer protection compliance. Rather than absorbing these costs, Etsy passes them through to sellers in the affected regions.

The fee is calculated as a percentage of the **total order amount**, applied to the same base as transaction and payment processing fees (item price + shipping + gift wrap + personalization).

### Current Regulatory Operating Fee Rates (2026)

| Seller Location | Rate |
|-----------------|------|
| United Kingdom | 0.32% |
| France | 0.47% |
| Italy | 0.32% |
| Spain | 0.72% |
| Turkey | 2.27% |
| India | 0.29% |
| Vietnam | 1.24% |
| Canada | 0.5% |

Note: Etsy may add, remove, or adjust country rates over time. Always check your Etsy fee page for the most current rates. Use the [Etsy Regulatory & Currency Fee Calculator](/tools/ecommerce/etsy-regulatory-fee-calculator) to estimate based on your specific country.

### What This Means for Your Orders

At 0.32% (the UK rate), the regulatory fee on a $100 order is $0.32. At 2.27% (Turkey), the same $100 order costs $2.27. At 0.29% (India), a $500 order costs $1.45 in regulatory fees before any other Etsy charges.

For high-volume sellers in higher-rate countries, these fees add up. A Turkish seller doing $30,000 in annual revenue pays roughly $330 per year in regulatory fees alone.

## The Currency Conversion Fee

Etsy's Currency Conversion Fee applies when your **listing currency** differs from your **payout bank account currency**. For example:

- You list in USD but your bank account is in GBP → conversion fee applies
- You list in USD and your bank account is in USD → no fee
- You list in EUR but your bank account is in CAD → conversion fee applies

The fee is **2.5% of the order total** and is automatically applied when Etsy converts funds during payout. It's one of the highest percentage fees on the platform, and it's entirely avoidable in many cases.

### Where the conversion happens matters

Etsy converts currency at two possible points:

1. **At the time of sale:** If the buyer pays in a currency different from your listing currency, Etsy converts the buyer's payment to your listing currency. This conversion is typically handled without an additional seller fee (the buyer may see a conversion fee from their payment method).
2. **At the time of payout:** If your listing currency differs from your bank account currency, Etsy converts during the payout process and charges the 2.5% fee. This is the conversion sellers can control.

The distinction matters because some sellers list in the buyer's currency (e.g., USD to match US buyers) but then pay the 2.5% fee at payout. Others list in their bank currency and let Etsy handle the buyer-side conversion at no direct seller cost.

### Real Example

A UK-based seller lists products in USD (to appeal to the larger American market). Their bank account is in GBP.

On a $200 order:

| Fee | Calculation | Amount |
|-----|-------------|--------|
| Core Etsy fees | Various | ~$19.30 |
| Regulatory (UK 0.32%) | $200 × 0.32% | $0.64 |
| Currency conversion (2.5%) | $200 × 2.5% | $5.00 |
| **Total fees** | | **$25.00** |

The currency conversion fee is the second-largest single charge on this order after the transaction fee — and it's entirely a function of the currency mismatch.

### The annual cost of currency conversion

For a seller doing $50,000/year listing in USD with a GBP bank account:

```text
Annual currency conversion fees: $50,000 × 2.5% = $1,250
```

That is $1,250 per year that could be reduced to roughly $250 by using a multi-currency account (Wise, Revolut) that converts at interbank rates (~0.5%). The $1,000 annual saving goes directly to profit.

## VAT, GST, and Sales Tax on International Orders

Etsy collects and remits sales tax, VAT, and GST on behalf of sellers for most jurisdictions:

- **US sales tax:** Etsy collects and remits for most states under marketplace facilitator laws.
- **EU VAT:** Etsy collects VAT on orders shipped to EU buyers (via the Import One-Stop Shop / IOSS for orders under €150).
- **UK VAT:** Etsy collects VAT on orders shipped to UK buyers.
- **Australia GST:** Etsy collects GST on orders shipped to Australian buyers.
- **Canada GST/HST:** Etsy collects and remits for most provinces.

Sellers do not need to handle tax collection or remittance for transactions where Etsy acts as the marketplace facilitator. However, sellers are still responsible for income tax on their Etsy earnings and may need to register for VAT/GST in their home country if their total Etsy revenue exceeds local thresholds.

The key operational note: tax amounts collected by Etsy are included in the order total for fee calculation purposes. Transaction fees, payment processing fees, and Offsite Ads fees are all calculated on the tax-inclusive total in jurisdictions where Etsy collects tax.

## Marketplace Facilitator Laws by Region

Marketplace facilitator laws require platforms like Etsy to collect and remit sales tax on behalf of sellers. The major regions:

| Region | Law | Etsy's role |
|--------|-----|-------------|
| United States (most states) | Marketplace facilitator laws | Etsy collects and remits sales tax |
| European Union | VAT e-commerce package | Etsy collects VAT via IOSS for orders ≤€150 |
| United Kingdom | Marketplace facilitator rules | Etsy collects and remits VAT |
| Australia | GST on low-value imported goods | Etsy collects and remits GST |
| Canada (most provinces) | Marketplace facilitator rules | Etsy collects and remits GST/HST |
| New Zealand | GST on remote services | Etsy collects and remits GST |

These laws simplify compliance for sellers — you do not need to register, collect, or remit in these jurisdictions for Etsy sales. However, if you also sell on your own website, you may need to handle tax compliance independently for those sales.

## Strategies to Minimize These Fees

### 1. Match Your Listing Currency to Your Bank Currency

The simplest fix: list in the same currency your bank account uses. If your bank is in GBP, list in GBP. You might lose some price transparency for international buyers, but you save 2.5% on every order. For many sellers, that savings beats the possible conversion-rate lift from listing in USD.

To evaluate the trade-off: track your conversion rate by buyer country. If US buyers convert at 3.5% when you list in GBP vs. 4.0% when you list in USD, the 0.5 percentage point improvement needs to generate enough additional revenue to offset the 2.5% fee on all USD-listed sales. Usually, it does not.

### 2. Use a Multi-Currency Bank Account

Some financial institutions (Wise, Revolut, certain business bank accounts) let you hold balances in multiple currencies. If you can receive USD payouts into a USD account, then convert to your local currency at interbank rates (often ~0.5%), you've effectively cut your currency conversion cost by 80%.

Setup steps:
1. Open a multi-currency account that provides US bank details (account number, routing number).
2. Add the USD account details to your Etsy payment settings.
3. Etsy pays out in USD to your USD account (no 2.5% conversion fee).
4. Convert USD to your local currency within the multi-currency account at ~0.5%.

### 3. Factor the Fees into Your Pricing

If you choose to keep a currency mismatch because listing in USD increases your conversion rate, build the 2.5% into your pricing model. The [Etsy Pricing Calculator](/tools/ecommerce/etsy-pricing-calculator) includes both a regulatory fee input and a currency conversion toggle so you can model these costs before setting a price.

### 4. Cross-Check Your Etsy Bill

Etsy's fee statements aren't always easy to parse. Use the [Etsy Regulatory & Currency Fee Calculator](/tools/ecommerce/etsy-regulatory-fee-calculator) to independently verify the regulatory and conversion line items on your statement. Select your country, enter the order total, toggle on currency conversion if applicable, and compare the output to your actual bill. This is especially useful during tax preparation or when auditing high-value orders.

## Country Spotlight: Where These Fees Hit Hardest

### United Kingdom

UK sellers face a 0.32% regulatory fee plus a 2.5% currency conversion fee if listing in non-GBP currencies. Since many UK sellers target the US market, the combined add-on fee can reach 2.82%.

UK-specific note: Etsy collects and remits UK VAT on orders shipped to UK buyers. Sellers do not need to handle VAT for these transactions, but income tax on Etsy profits is the seller's responsibility.

### Turkey

Turkish sellers pay the highest regulatory rate at 2.27%, and most list in USD or EUR rather than TRY (because Etsy's buyer base is international). The combination of 2.27% regulatory + 2.5% currency conversion = 4.77% in add-on fees before any core Etsy charges.

Turkish sellers should strongly consider listing in EUR if their bank account supports EUR, as EUR is more common among Turkish business bank accounts than USD. A multi-currency account is even better.

### Canada

Canadian sellers pay 0.5% regulatory, and those listing in USD (to align with the dominant Etsy buyer base) pay an additional 2.5% currency conversion — totaling 3.0% in add-on fees.

Canadian sellers have a good alternative: many Canadian banks offer USD-denominated business accounts. Receiving Etsy payouts in USD to a Canadian USD account avoids the 2.5% conversion fee. Convert USD to CAD when exchange rates are favorable or use a service like Wise for lower conversion costs.

### India

Indian sellers face a 0.29% regulatory fee. Combined with 2.5% currency conversion, total add-on fees reach 2.79%. On a ₹10,000 order (roughly $120), the two add-on fees total about ₹279 (roughly $3.35) before core Etsy fees.

Indian sellers should investigate whether their bank supports foreign currency accounts. The Reserve Bank of India allows residents to hold foreign currency accounts under certain conditions. If available, a USD-denominated account eliminates the 2.5% conversion fee.

### France

French sellers pay 0.47% regulatory. Combined with 2.5% currency conversion when listing in non-EUR currencies, add-on fees reach 2.97%. Since most French sellers can list in EUR (their bank currency), the currency conversion fee can often be avoided by matching the currencies.

## International Shipping Fee Interactions

International orders carry higher shipping costs, which increases the fee base for all percentage-based Etsy fees. A $20 item with $25 international shipping creates a $45 fee base — more than doubling the transaction, payment processing, and currency conversion fees compared to a domestic $20 + $5 shipping order.

For sellers with significant international order volume, consider:

- **Offer free shipping with the cost built into item price** only for domestic orders. Use shipping profiles to charge calculated international shipping separately.
- **Review international shipping costs annually.** Carrier rates change. A destination that was affordable last year may now eat too much of the order value after fees.
- **Decide whether certain countries are worth serving.** If Italy orders generate 5% of revenue but 25% of customer service inquiries and 15% of returns, the post-fee profit may not justify the operational load.

## Comparing Etsy to Direct Stripe Sales

One advantage of driving traffic to your own site is fee simplicity. When you sell on your own website using Stripe:

- No regulatory operating fee
- Currency conversion at Stripe's rate (typically 1% for non-US cards + dynamic conversion fees)
- No listing fees
- No transaction fees beyond the standard 2.9% + $0.30

Compare both sides using our [Stripe Fee Calculator](/tools/ecommerce/stripe-fee-calculator) alongside the [Etsy Regulatory & Currency Fee Calculator](/tools/ecommerce/etsy-regulatory-fee-calculator). The difference can be substantial, especially if you're in a high regulatory-rate country.

### The crossover point: when independent saves more

For a Canadian seller doing $3,000/month in Etsy sales:

```text
Etsy scenario (USD listing, CAD bank, 0.5% regulatory):
Monthly core fees at ~10%: $300
Monthly regulatory (0.5%): $15
Monthly currency conversion (2.5%): $75
Total monthly fees: $390

Independent scenario (Stripe + Shopify Basic):
Monthly payment processing (~3.5%): $105
Shopify Basic subscription: $39
Total monthly fees: $144

Monthly difference: $246 saved
Annual difference: $2,952 saved
```

At $3,000/month, the savings from going independent substantially exceed the cost of driving your own traffic. The crossover point for most international sellers is around $1,000-$1,500/month in sales, depending on their regulatory fee rate and currency setup.

## Key Takeaways

1. **Check your country's rate** — the current calculator table covers rates from 0.29% to 2.27% depending on seller location
2. **Currency conversion is the silent margin killer** — 2.5% per order adds up fast, and it's often avoidable
3. **Match listing currency to bank currency** — the single easiest way to eliminate the conversion fee
4. **Use a multi-currency account** — cut currency conversion costs by 80% (from 2.5% to ~0.5%)
5. **Etsy handles tax collection** for most jurisdictions — you do not need to collect or remit sales tax/VAT/GST for Etsy orders
6. **Build add-on fees into your pricing model** — don't treat them as "miscellaneous"; they're real costs
7. **Audit your Etsy bill regularly** — use a calculator to cross-check the regulatory and conversion line items
8. **International shipping amplifies all fees** — the fee base includes shipping, so high international shipping costs increase every percentage-based fee

---

*Use [ToolOrbit's Etsy Regulatory & Currency Fee Calculator](/tools/ecommerce/etsy-regulatory-fee-calculator) to estimate your add-on fees, and the [Etsy Fee Calculator](/tools/ecommerce/etsy-fee-calculator) for the complete order-level breakdown.*
