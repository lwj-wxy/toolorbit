# PayPal Fees in 2026: Checkout, Goods & Services, Invoices, and Fixed Fees

PayPal fees look simple until you compare two transactions that have the same order value but different payment types. One customer pays through PayPal Checkout, another uses a card, another pays an invoice, and the fixed fee changes again when the receiving currency changes. The headline percentage is only part of the story.

This guide explains the PayPal fee layers that matter most for sellers, freelancers, creators, and small ecommerce teams. If you need quick math while quoting a client, use the [PayPal Fee Calculator](/tools/ecommerce/paypal-fee-calculator) and then confirm final account-specific fees in your PayPal statement.

## The PayPal Fee Stack

For US merchant accounts, PayPal publishes separate commercial transaction rates by payment type. As of the latest public PayPal merchant fee page reviewed for this article, common domestic rates include:

| Payment type | Published US merchant rate |
|--------------|----------------------------|
| PayPal Checkout | 3.49% + fixed fee |
| PayPal Guest Checkout | 3.49% + fixed fee |
| Standard credit and debit card payments | 2.99% + fixed fee |
| Send/Receive Money for Goods and Services | 2.99% |
| PayPal Pay Later options | 4.99% + fixed fee |

The important lesson is that "PayPal fee" is not one universal number. The payment surface matters. A PayPal-branded checkout can price differently from a direct card payment, and an invoice may route through a specific PayPal product with its own rate.

## Fixed Fees Matter More Than They Look

The fixed fee is charged on top of the percentage fee, and it is based on the currency received. For common currencies, PayPal's US merchant fee table lists:

| Receiving currency | Fixed fee |
|--------------------|-----------|
| USD | 0.49 USD |
| EUR | 0.39 EUR |
| GBP | 0.39 GBP |
| CAD | 0.59 CAD |
| AUD | 0.59 AUD |

On a $100 payment, a $0.49 fixed fee is easy to overlook. On a $7 digital product, it is huge. That is why low-priced products often have a higher effective fee rate than the headline percentage suggests.

Example with PayPal Checkout in USD:

```text
Customer pays: $10.00
Percentage fee: $10.00 × 3.49% = $0.35
Fixed fee: $0.49
Total fee: $0.84
Effective rate: 8.4%
Net payout: $9.16
```

For small-ticket items, consider bundles, minimum invoice amounts, or pricing tiers that reduce how often the fixed fee hits tiny transactions.

## International Transactions Add Another Layer

PayPal defines international commercial transactions as cases where sender and receiver are registered in different markets. For US merchant fees, the domestic rate applies plus an additional percentage-based fee for international commercial transactions. The published additional rate is 1.50%.

That means an international PayPal Checkout payment can quickly move from:

```text
3.49% + fixed fee
```

to:

```text
4.99% + fixed fee
```

before any currency conversion spread or account-specific pricing is considered. If you sell to international buyers, do not use a domestic-only estimate when setting product prices.

## Why Your PayPal Statement May Not Match a Simple Formula

A calculator is useful, but your final statement can still differ because PayPal fees depend on several details:

- account country and PayPal market grouping
- payment type used by the buyer
- receiving currency and fixed fee
- international transaction status
- currency conversion spread
- refunds, disputes, chargebacks, and account-specific pricing

This is why the [PayPal Fee Calculator](/tools/ecommerce/paypal-fee-calculator) is best used for quoting, planning, and sanity checks rather than as a replacement for accounting reconciliation.

## How to Use the PayPal Fee Calculator

Use the calculator in three steps:

1. Enter the customer payment amount or the net amount you want to receive.
2. Choose the payment type closest to your PayPal flow, such as PayPal Checkout, card payments, Goods & Services, or Pay Later.
3. Select the receiving currency and enable the international surcharge if buyer and seller are in different markets.

The result shows the fee, effective rate, estimated net payout, and a reverse invoice amount. That reverse amount is useful when the business policy is to quote a customer-facing price that preserves your target net revenue.

## PayPal vs Stripe: When Should You Compare?

PayPal is often valuable because many buyers already trust it, but it may not be the lowest-fee option for every payment. Stripe's standard US online card pricing is commonly listed as 2.9% + $0.30 for domestic cards. That can be lower than PayPal Checkout for many card-style payments.

Use the [Stripe vs PayPal Fee Calculator](/tools/ecommerce/stripe-vs-paypal-fee-calculator) when you want to compare the same order amount side by side. Focus on net payout, not just the posted percentage.

## Practical Seller Checklist

Before you publish a price or send an invoice, check:

- Which PayPal product will process the payment?
- Is the buyer domestic or international?
- What currency will you receive?
- Is the order value low enough for the fixed fee to dominate?
- Are you trying to receive a target net amount?
- Would Stripe or another processor produce a materially different payout?

## Key Takeaways

1. PayPal has multiple merchant fee profiles, not one universal rate.
2. Fixed fees can make low-ticket products much more expensive than the headline percentage suggests.
3. International commercial transactions add another percentage layer.
4. Reverse invoice math helps freelancers and sellers preserve a target net amount.
5. Always reconcile estimates against your PayPal statement because account-specific details can change the final fee.

---

Use the [PayPal Fee Calculator](/tools/ecommerce/paypal-fee-calculator) for fast fee estimates, then compare the same amount in the [Stripe vs PayPal Fee Calculator](/tools/ecommerce/stripe-vs-paypal-fee-calculator) when choosing a payment method.
