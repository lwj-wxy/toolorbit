import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, Truck, Check, Copy } from 'lucide-react';

type EtsyFreeShippingCalculatorProps = {
  hideHeader?: boolean;
};

const EtsyFreeShippingCalculator = ({ hideHeader = false }: EtsyFreeShippingCalculatorProps) => {
  const { t } = useTranslation();
  const [originalPrice, setOriginalPrice] = useState<number | ''>(25);
  const [shippingLabelCost, setShippingLabelCost] = useState<number | ''>(5);
  const [packagingCost, setPackagingCost] = useState<number | ''>(0.75);
  const [itemCOGS, setItemCOGS] = useState<number | ''>(8);
  const [region, setRegion] = useState('US'); // US, UK, CA, EU
  const [copied, setCopied] = useState(false);

  const originalPriceVal = Number(originalPrice) || 0;
  const shippingLabelCostVal = Number(shippingLabelCost) || 0;
  const packagingCostVal = Number(packagingCost) || 0;
  const itemCOGSVal = Number(itemCOGS) || 0;

  // Processing fee rates by region
  const regionProcRates: Record<string, { pct: number; fixed: number; currency: string }> = {
    US: { pct: 0.03, fixed: 0.25, currency: '$' },
    UK: { pct: 0.04, fixed: 0.25, currency: '£' },
    CA: { pct: 0.03, fixed: 0.25, currency: '$' },
    EU: { pct: 0.04, fixed: 0.32, currency: '€' },
  };

  const proc = regionProcRates[region] || regionProcRates.US;

  // Model A: Buyer-Paid Shipping ($25 item + $5 shipping)
  const totalRevenueModelA = originalPriceVal + shippingLabelCostVal;
  const feesModelA = totalRevenueModelA > 0 ? 0.2 + totalRevenueModelA * 0.065 + (totalRevenueModelA * proc.pct + proc.fixed) : 0;
  const cogsModelA = itemCOGSVal + shippingLabelCostVal + packagingCostVal;
  const netProfitModelA = totalRevenueModelA - feesModelA - cogsModelA;

  // Model B: Free Shipping Bundled Price Calculation
  // We want net profit in Model B to be at least equal to Model A!
  // RevenueB * (1 - 0.065 - proc.pct) - (0.2 + proc.fixed) - cogsModelA = netProfitModelA
  const variableRateB = 1 - (0.065 + proc.pct);
  const fixedFeesB = 0.2 + proc.fixed;
  const requiredRevenueB = variableRateB > 0 ? (netProfitModelA + cogsModelA + fixedFeesB) / variableRateB : 0;

  // Calculate fees and margins for Model B
  const feesModelB = requiredRevenueB > 0 ? 0.2 + requiredRevenueB * 0.065 + (requiredRevenueB * proc.pct + proc.fixed) : 0;
  const netProfitModelB = requiredRevenueB - feesModelB - cogsModelA;
  const marginModelB = requiredRevenueB > 0 ? (netProfitModelB / requiredRevenueB) * 100 : 0;

  const handleCopySummary = () => {
    const summaryText = `Etsy Free Shipping Price Bundle Summary:
Original Item Price: ${proc.currency}${originalPriceVal.toFixed(2)}
Estimated Shipping Label: ${proc.currency}${shippingLabelCostVal.toFixed(2)}
Recommended Bundled Price (Free Shipping): ${proc.currency}${requiredRevenueB.toFixed(2)}
Estimated Net Profit: ${proc.currency}${netProfitModelB.toFixed(2)} (${marginModelB.toFixed(1)}% margin)`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {!hideHeader ? (
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
              Etsy $35 Free Shipping Guarantee Pricing Calculator
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
              Calculate the optimal bundled free-shipping listing price to qualify for Etsy's US Free Shipping Guarantee without losing profit margin.
            </p>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.9fr)]">
        {/* Left Input Form */}
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#282c34] sm:p-6">
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900 dark:text-slate-100">
                Seller Payment Account Region
              </label>
              <select
                value={region}
                onChange={(event) => setRegion(event.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white p-2.5 text-sm text-slate-900 outline-none transition focus:border-amber-600 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              >
                <option value="US">🇺🇸 United States (3.0% + $0.25)</option>
                <option value="UK">🇬🇧 United Kingdom (4.0% + £0.20)</option>
                <option value="CA">🇨🇦 Canada (3.0% + $0.25)</option>
                <option value="EU">🇪🇺 Eurozone (4.0% + €0.30)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Original Item Price ({proc.currency})
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <DollarSign className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(event) => setOriginalPrice(event.target.value ? Number(event.target.value) : '')}
                    className="w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 outline-none transition focus:border-amber-600 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Est. Shipping Label Cost ({proc.currency})
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Truck className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="number"
                    value={shippingLabelCost}
                    onChange={(event) => setShippingLabelCost(event.target.value ? Number(event.target.value) : '')}
                    className="w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 outline-none transition focus:border-amber-600 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Item Production COGS ({proc.currency})
                </label>
                <input
                  type="number"
                  value={itemCOGS}
                  onChange={(event) => setItemCOGS(event.target.value ? Number(event.target.value) : '')}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-amber-600 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Box / Packaging Cost ({proc.currency})
                </label>
                <input
                  type="number"
                  value={packagingCost}
                  onChange={(event) => setPackagingCost(event.target.value ? Number(event.target.value) : '')}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-amber-600 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Output Comparison */}
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#282c34] sm:p-6">
          <div className="border-b border-slate-200 pb-4 dark:border-slate-700">
            <p className="text-xs font-bold uppercase tracking-wide text-amber-600">Bundled Listing Recommendation</p>
            <h2 className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
              {proc.currency}{requiredRevenueB.toFixed(2)} <span className="text-sm font-semibold text-emerald-600">Free Shipping</span>
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Listing price required to absorb shipping & platform fees while keeping target profit.
            </p>
          </div>

          <div className="mt-5 space-y-4">
            <div className="rounded-md border border-emerald-200 bg-emerald-50/60 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20">
              <div className="flex justify-between text-sm font-semibold text-emerald-900 dark:text-emerald-300">
                <span>Model B (Free Shipping Bundle)</span>
                <span>{proc.currency}{requiredRevenueB.toFixed(2)}</span>
              </div>
              <div className="mt-2 text-xs text-emerald-700 dark:text-emerald-400 space-y-1">
                <div className="flex justify-between">
                  <span>Etsy Platform Fees:</span>
                  <span>{proc.currency}{feesModelB.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Net Profit:</span>
                  <span>{proc.currency}{netProfitModelB.toFixed(2)} ({marginModelB.toFixed(1)}%)</span>
                </div>
              </div>
            </div>

            <div className="rounded-md border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/40">
              <div className="flex justify-between text-sm font-semibold text-slate-800 dark:text-slate-200">
                <span>Model A (Separated Shipping)</span>
                <span>{proc.currency}{originalPriceVal.toFixed(2)} + {proc.currency}{shippingLabelCostVal.toFixed(2)} ship</span>
              </div>
              <div className="mt-2 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>Etsy Platform Fees:</span>
                  <span>{proc.currency}{feesModelA.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Net Profit:</span>
                  <span>{proc.currency}{netProfitModelA.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-slate-200 pt-4 dark:border-slate-700">
            <button
              type="button"
              onClick={handleCopySummary}
              data-analytics-action="result_copied"
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[var(--app-text)] py-3 text-sm font-bold text-[var(--app-bg)] transition hover:opacity-90"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied Pricing Summary!' : 'Copy Bundled Pricing Report'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EtsyFreeShippingCalculator;
