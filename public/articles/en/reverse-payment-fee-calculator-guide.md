# Reverse Payment Fee Calculation: How Much Should You Invoice to Receive a Net Amount?

Freelancers, agencies, consultants, and sellers often ask a practical question: "If I need to receive $500 after payment fees, how much should I invoice?" This is a reverse fee calculation. It is different from simply adding the estimated fee on top of the net amount.

Use the [PayPal Fee Calculator](/tools/ecommerce/paypal-fee-calculator) or [Stripe Fee Calculator](/tools/ecommerce/stripe-fee-calculator) to run the calculation instantly. This guide explains the math behind the result.

## Why Adding the Fee Is Not Enough

Suppose a processor charges 2.9% + $0.30 and you want to receive $100 net.

A common but incomplete approach is:

```text
$100 + ($100 × 2.9%) + $0.30 = $103.20
```

But if the customer pays $103.20, the processor charges the percentage on $103.20, not on $100. The fee becomes:

```text
$103.20 × 2.9% + $0.30 = $3.29
```

Your net is $99.91, not $100. It is close on a small invoice, but the error grows across many transactions.

## The Correct Reverse Formula

The correct formula is:

```text
Invoice amount = (target net + fixed fee) / (1 - percentage rate)
```

For Stripe's common US domestic online card rate:

```text
Target net: $100.00
Percentage rate: 2.9%
Fixed fee: $0.30

Invoice amount = ($100.00 + $0.30) / (1 - 0.029)
Invoice amount = $103.30
```

When the customer pays $103.30:

```text
Fee = $103.30 × 2.9% + $0.30 = $3.30
Net = $100.00
```

## PayPal Reverse Fee Example

For PayPal Checkout in USD, a common US merchant preset is 3.49% + $0.49. To receive $100 net:

```text
Invoice amount = ($100.00 + $0.49) / (1 - 0.0349)
Invoice amount = $104.12
```

The higher percentage and higher fixed fee make the reverse invoice amount higher than a comparable Stripe card payment. Use the [Stripe vs PayPal Fee Calculator](/tools/ecommerce/stripe-vs-paypal-fee-calculator) when deciding which payment link to send.

## When Reverse Calculation Is Useful

Reverse fee math is useful when:

- a freelancer quotes a fixed take-home amount
- an agency invoices clients through payment links
- a consultant wants to preserve a target project fee
- a seller accepts custom orders
- a SaaS founder models payment processor impact on plan pricing
- a creator sells digital products with low transaction values

It is less useful when consumer protection rules, platform terms, or card network rules limit whether you can pass processing fees to the buyer. Always check your local rules and processor agreement before adding a surcharge line item.

## Build Fees Into the Price, Not the Relationship

Many businesses avoid showing a separate "processing fee" line because it can create friction. Instead, they build payment costs into the base price, just like hosting, software, tax preparation, support time, and refunds.

For example:

```text
Target project revenue: $1,000
Expected payment fee: about 3%
Quoted project price: $1,035 or $1,050
```

This approach is usually cleaner than telling a client that every invoice has a separate card fee.

## Remember the Hidden Variables

Reverse calculators model the basic payment processing fee. They may not include:

- international card surcharges
- currency conversion
- PayPal international commercial transaction fees
- platform fees from marketplaces
- refund policies
- chargeback or dispute fees
- subscription billing add-ons
- tax handling

For high-value or recurring contracts, reconcile estimates with actual processor reports after a few invoices.

## A Practical Workflow

1. Choose the processor and payment type.
2. Enter the target net amount in the calculator.
3. Copy the reverse invoice amount.
4. Round to a clean price if needed.
5. Add the payment method and fee assumption to your pricing notes.
6. Reconcile actual payouts monthly.

## Key Takeaways

1. Reverse payment fee math is not the same as adding a fee to the net amount.
2. The correct formula divides by `1 - percentage rate`.
3. Fixed fees affect low-value invoices more heavily.
4. PayPal and Stripe can produce different invoice amounts for the same target net.
5. Use reverse math for pricing decisions, then verify actual payouts in your processor dashboard.

---

Try the reverse calculation in the [PayPal Fee Calculator](/tools/ecommerce/paypal-fee-calculator) or compare processors with the [Stripe vs PayPal Fee Calculator](/tools/ecommerce/stripe-vs-paypal-fee-calculator).
