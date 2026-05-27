# Stripe vs PayPal Fees: Which Payment Processor Is Cheaper?

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

## Why Fixed Fees Change the Winner

Fixed fees hit small transactions hard. A $0.49 fixed fee on PayPal Checkout may be minor on a $500 invoice, but it is large on a $5 digital file.

For low-ticket products, compare the effective rate:

```text
Fee ÷ customer payment × 100 = effective fee rate
```

If a $5 transaction has a $0.66 fee, the effective rate is 13.2%. That is the number sellers should care about when pricing templates, downloads, small add-ons, and low-cost subscriptions.

## International Cards and Currency Conversion

International payments can change the result quickly. Stripe lists additional costs for international cards and currency conversion on top of domestic card pricing. PayPal also adds an international commercial transaction percentage on top of the domestic rate, and currency conversion can introduce another spread.

If your buyers are mostly domestic, a domestic calculator estimate may be close enough for planning. If your buyers are international, model a realistic blended rate. A product with 40% international cards should not be priced as if every buyer is domestic.

## When Stripe Often Wins

Stripe often fits businesses that need:

- embedded checkout with more control over the user experience
- card-first payments
- SaaS subscriptions and usage-based billing
- developer-friendly APIs
- detailed event data and custom payment flows
- lower domestic card processing costs in common US scenarios

For subscription businesses and software products, the operational value of Stripe may matter as much as the raw fee percentage.

## When PayPal Often Wins

PayPal can still be the better commercial choice when:

- customers strongly prefer paying with PayPal balance or wallet
- trust is more important than the lowest fee
- the business needs fast invoice or payment link workflows
- buyers are international and recognize PayPal more readily than a card form
- the store wants PayPal as an additional checkout option rather than the only processor

A slightly higher fee can be acceptable if PayPal increases conversion enough to offset the cost.

## Do Not Compare Only One Transaction

The best comparison uses your real order mix:

| Metric | Why it matters |
|--------|----------------|
| Average order value | Fixed fees matter more at low AOV |
| Domestic vs international buyers | Additional percentage fees can stack |
| Refund rate | Refund handling changes true cost |
| Dispute rate | Chargeback and dispute policies matter |
| Payment method mix | Wallet, card, Pay Later, and bank payments differ |
| Conversion rate | Lower fees do not help if fewer buyers complete checkout |

Start with the [Stripe vs PayPal Fee Calculator](/tools/ecommerce/stripe-vs-paypal-fee-calculator), then compare your actual monthly payment reports after launch.

## Should You Offer Both?

Many ecommerce teams offer both processors because they solve different problems. Stripe can be the primary card processor while PayPal remains available for buyers who prefer wallet checkout. This is especially common when the store sells internationally or when buyer trust is still being built.

The trade-off is operational complexity. More processors means more reconciliation, more failure modes, and more settings to maintain. If you add both, document which payment methods are enabled and how you reconcile fees each month.

## Key Takeaways

1. Stripe is often cheaper for standard domestic US online card payments.
2. PayPal Checkout may cost more but can improve trust and buyer completion in some markets.
3. Fixed fees make low-ticket products more expensive than percentage rates suggest.
4. International cards and currency conversion can change the comparison.
5. The best processor is the one with the better net outcome after fees, conversion, refunds, and operating cost.

---

Use the [Stripe vs PayPal Fee Calculator](/tools/ecommerce/stripe-vs-paypal-fee-calculator) for side-by-side fee math, then check individual estimates with the [Stripe Fee Calculator](/tools/ecommerce/stripe-fee-calculator) and [PayPal Fee Calculator](/tools/ecommerce/paypal-fee-calculator).
