# Stripe vs. PayPal Fees 2026: Payout Formula & Comparison for Online Sellers

For ecommerce store owners, DTC brands, and digital sellers operating on Shopify, WooCommerce, or custom sites, choosing between **Stripe** and **PayPal** is one of the most critical financial decisions.

While both processors handle online credit card payments seamlessly, their pricing models, cross-border fee surcharges, chargeback policies, and net payout structures differ significantly.

This guide provides a head-to-head 2026 fee comparison between Stripe and PayPal, complete with net payout formulas and invoice reverse calculations. To compare exact fees side-by-side on your transactions, use the [Stripe vs. PayPal Fee Calculator](/tools/ecommerce/stripe-vs-paypal-fee-calculator).

---

## 1. 2026 Merchant Fee Pricing Comparison

Below is the standard pricing breakdown for US-based merchants processing USD transactions:

```text
+------------------------------------+-----------------------+------------------------------------------+
| FEE CATEGORY                       | STRIPE PAYMENTS       | PAYPAL CHECKOUT                          |
+------------------------------------+-----------------------+------------------------------------------+
| Standard Domestic Card Processing  | 2.9% + $0.30 USD      | 3.49% + $0.49 USD                        |
| Custom Invoicing / Billing         | 2.9% + $0.30 USD      | 3.49% + $0.49 USD                        |
| International Card Surcharge       | + 1.5%                | + 1.50%                                  |
| Currency Conversion Surcharge      | + 1.0%                | + 3.0% to 4.0%                           |
| Chargeback Dispute Fee             | $15.00 USD (Refunded) | $20.00 USD (Non-refundable)              |
| Monthly Account Fee                | $0.00 (Pay-as-you-go) | $0.00 (Pay-as-you-go)                    |
+------------------------------------+-----------------------+------------------------------------------+
```

### Key Differences:
1. **Domestic Pricing Advantage**: Stripe charges **2.9% + $0.30**, while PayPal Checkout charges **3.49% + $0.49**. On a $100 order, PayPal charges **$3.98** versus Stripe's **$3.20** — making Stripe **~24% cheaper** on standard domestic card sales.
2. **Currency Conversion**: PayPal's internal currency conversion rate spreads (3.0% to 4.0%) are significantly higher than Stripe's standard 1.0% currency fee.

---

## 2. Head-to-Head Net Payout Case Studies

Let's evaluate net payouts across three typical ecommerce transaction sizes:

### Case Study 1: Small Ticket Transaction ($15.00 Order)

* **Stripe Fee**: $(15.00 \times 2.9\%) + \$0.30 = \$0.44 + \$0.30 = \mathbf{\$0.74}$
  * Net Payout: $\$15.00 - \$0.74 = \mathbf{\$14.26 \quad (4.93\% \text{ effective fee rate})}$
* **PayPal Fee**: $(15.00 \times 3.49\%) + \$0.49 = \$0.52 + \$0.49 = \mathbf{\$1.01}$
  * Net Payout: $\$15.00 - \$1.01 = \mathbf{\$13.99 \quad (6.73\% \text{ effective fee rate})}$

> **Result**: Stripe delivers **$0.27 more net profit** per transaction.

---

### Case Study 2: Medium Ticket Transaction ($100.00 Order)

* **Stripe Fee**: $(100.00 \times 2.9\%) + \$0.30 = \mathbf{\$3.20}$
  * Net Payout: $\$100.00 - \$3.20 = \mathbf{\$96.80 \quad (3.20\% \text{ effective fee rate})}$
* **PayPal Fee**: $(100.00 \times 3.49\%) + \$0.49 = \mathbf{\$3.98}$
  * Net Payout: $\$100.00 - \$3.98 = \mathbf{\$96.02 \quad (3.98\% \text{ effective fee rate})}$

> **Result**: Stripe saves **$0.78 per $100 sale**. Over 1,000 monthly transactions, Stripe saves **$780.00 in annual processing fees**.

---

## 3. Reverse Invoice Calculation Formula

When sending invoices to clients or buyers where you need to receive an exact net amount after merchant fee deductions, use the **Reverse Fee Formula**:

$$\text{Gross Invoice Amount} = \frac{\text{Desired Net Payout} + \text{Fixed Fee (e.g. \$0.30)}}{1 - \text{Percentage Fee (e.g. 0.029)}}$$

### Example: Invoice for $500.00 Net Payout via Stripe

$$\text{Gross Invoice Amount} = \frac{\$500.00 + \$0.30}{1 - 0.029} = \frac{\$500.30}{0.971} = \mathbf{\$515.24}$$

Invoicing the client for **$515.24** guarantees you receive exactly **$500.00** in net payout after Stripe's $15.24 fee deduction.

---

## 4. Which Payment Gateway Should You Choose?

```text
+------------------------------------------+------------------------------------------+
| CHOOSE STRIPE IF:                        | CHOOSE PAYPAL IF:                        |
+------------------------------------------+------------------------------------------+
| You want lower transaction fee rates     | Your buyers expect "One-Touch PayPal"    |
| You offer recurring SaaS subscriptions   | You sell heavily via mobile social ads   |
| You want seamless embedded checkout      | You need instant payouts to a debit card |
| You operate cross-border DTC stores      | You sell in markets with low card usage  |
+------------------------------------------+------------------------------------------+
```

### Recommended Best Practice: The Hybrid Checkout Stack
Most top-performing DTC brands do not choose one over the other. Implementing **Stripe as the primary credit card gateway** alongside a **"Pay with PayPal" express button** maximizes conversion rates while routing ~70% of transactions through Stripe's lower fee structure.

Compare your exact payout amounts across both gateways using the [Stripe vs. PayPal Fee Calculator](/tools/ecommerce/stripe-vs-paypal-fee-calculator).
