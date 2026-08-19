import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, Hash, Copy, Check } from 'lucide-react';

type EtsyFeeCalculatorProps = {
  hideHeader?: boolean;
};

const EtsyFeeCalculator = ({ hideHeader = false }: EtsyFeeCalculatorProps) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [salePrice, setSalePrice] = useState<number | ''>('');
  const [quantity, setQuantity] = useState<number | ''>(1);
  const [shippingCharge, setShippingCharge] = useState<number | ''>('');
  const [discountAmount, setDiscountAmount] = useState<number | ''>('');
  const [itemCost, setItemCost] = useState<number | ''>('');
  const [shippingCost, setShippingCost] = useState<number | ''>('');
  const [extraCost, setExtraCost] = useState<number | ''>('');
  const [offsiteAdsRate, setOffsiteAdsRate] = useState('0');

  const salePriceValue = Number(salePrice) || 0;
  const quantityValue = Math.max(1, Number(quantity) || 1);
  const shippingChargeValue = Number(shippingCharge) || 0;
  const discountAmountValue = Number(discountAmount) || 0;
  const itemCostValue = Number(itemCost) || 0;
  const shippingCostValue = Number(shippingCost) || 0;
  const extraCostValue = Number(extraCost) || 0;
  const offsiteAdsRateValue = Number(offsiteAdsRate) / 100;
  const grossRevenue = salePriceValue * quantityValue + shippingChargeValue;
  const totalRevenue = Math.max(0, grossRevenue - discountAmountValue);
  const directCosts = itemCostValue * quantityValue + shippingCostValue + extraCostValue;

  // Etsy Fees (US base)
  const listingFee = totalRevenue > 0 ? 0.2 * quantityValue : 0;
  const transactionFee = totalRevenue * 0.065; // 6.5% transaction fee
  const paymentProcFee = totalRevenue > 0 ? totalRevenue * 0.03 + 0.25 : 0; // 3% + $0.25
  const offsiteAdsFee = totalRevenue > 0 ? Math.min(totalRevenue * offsiteAdsRateValue, 100) : 0;
  const totalFees = listingFee + transactionFee + paymentProcFee + offsiteAdsFee;
  
  const profit = totalRevenue - totalFees - directCosts;
  const margin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;
  const feeRate = totalRevenue > 0 ? (totalFees / totalRevenue) * 100 : 0;
  const roi = directCosts > 0 ? (profit / directCosts) * 100 : 0;
  const variableFeeRate = 0.065 + 0.03 + offsiteAdsRateValue;
  const fixedFees = 0.2 * quantityValue + 0.25;
  const breakEvenRevenue = variableFeeRate < 0.95 ? (directCosts + fixedFees) / (1 - variableFeeRate) : 0;
  const breakEvenItemPrice = Math.max(0, (breakEvenRevenue - shippingChargeValue + discountAmountValue) / quantityValue);

  return (
    <div className="space-y-6">
      {!hideHeader ? (
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
              {t('tools.etsy-fee-calculator.title')}
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
              {t('tools.etsy-fee-calculator.subtitle')}
            </p>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.85fr)]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#282c34] sm:p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {t('tools.etsy-fee-calculator.revenueSection')}
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">{t('tools.etsy-fee-calculator.salePriceLabel')}</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <DollarSign className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="number"
                      value={salePrice}
                      onChange={(event) => setSalePrice(event.target.value ? Number(event.target.value) : '')}
                      className="block w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">{t('tools.etsy-fee-calculator.quantityLabel')}</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Hash className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(event) => setQuantity(event.target.value ? Number(event.target.value) : '')}
                      className="block w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      placeholder="1"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">{t('tools.etsy-fee-calculator.shippingChargeLabel')}</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <DollarSign className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="number"
                      value={shippingCharge}
                      onChange={(event) => setShippingCharge(event.target.value ? Number(event.target.value) : '')}
                      className="block w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">{t('tools.etsy-fee-calculator.discountLabel')}</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <DollarSign className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="number"
                      value={discountAmount}
                      onChange={(event) => setDiscountAmount(event.target.value ? Number(event.target.value) : '')}
                      className="block w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {t('tools.etsy-fee-calculator.costSection')}
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">{t('tools.etsy-fee-calculator.itemCostLabel')}</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <DollarSign className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="number"
                      value={itemCost}
                      onChange={(event) => setItemCost(event.target.value ? Number(event.target.value) : '')}
                      className="block w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">{t('tools.etsy-fee-calculator.shippingCostLabel')}</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <DollarSign className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="number"
                      value={shippingCost}
                      onChange={(event) => setShippingCost(event.target.value ? Number(event.target.value) : '')}
                      className="block w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">{t('tools.etsy-fee-calculator.extraCostLabel')}</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <DollarSign className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="number"
                      value={extraCost}
                      onChange={(event) => setExtraCost(event.target.value ? Number(event.target.value) : '')}
                      className="block w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">{t('tools.etsy-fee-calculator.offsiteAdsRateLabel')}</label>
                  <select
                    value={offsiteAdsRate}
                    onChange={(event) => setOffsiteAdsRate(event.target.value)}
                    className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition-colors focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  >
                    <option value="0">{t('tools.etsy-fee-calculator.offsiteAdsNone')}</option>
                    <option value="12">{t('tools.etsy-fee-calculator.offsiteAds12')}</option>
                    <option value="15">{t('tools.etsy-fee-calculator.offsiteAds15')}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-6">
            <h3 className="mb-4 border-b border-slate-200 pb-3 text-base font-semibold text-slate-950 dark:border-slate-700 dark:text-white">{t('tools.etsy-fee-calculator.detailsTitle')}</h3>
            
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">{t('tools.etsy-fee-calculator.grossRevenue')}</dt>
                <dd className="font-semibold text-slate-950 dark:text-slate-100">${grossRevenue.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">{t('tools.etsy-fee-calculator.discountAmount')}</dt>
                <dd className="text-red-500">-${discountAmountValue.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">{t('tools.etsy-fee-calculator.totalRevenue')}</dt>
                <dd className="font-semibold text-slate-950 dark:text-slate-100">${totalRevenue.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">{t('tools.etsy-fee-calculator.directCosts')}</dt>
                <dd className="font-semibold text-red-500">-${directCosts.toFixed(2)}</dd>
              </div>
              
              <div className="border-t border-dashed border-slate-300 pt-2 dark:border-slate-700" />
              
              <div className="flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">{t('tools.etsy-fee-calculator.listingFee')}</dt>
                <dd className="text-red-500">-${listingFee.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">{t('tools.etsy-fee-calculator.transactionFee')}</dt>
                <dd className="text-red-500">-${transactionFee.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">{t('tools.etsy-fee-calculator.paymentFee')}</dt>
                <dd className="text-red-500">-${paymentProcFee.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500 dark:text-slate-400">{t('tools.etsy-fee-calculator.offsiteAdsFee')}</dt>
                <dd className="text-red-500">-${offsiteAdsFee.toFixed(2)}</dd>
              </div>
              
              <div className="border-t border-dashed border-slate-300 pt-2 dark:border-slate-700" />
              
              <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-[#282c34]">
                <dt className="font-semibold text-slate-950 dark:text-white">{t('tools.etsy-fee-calculator.netProfit')}</dt>
                <dd className={`text-[20px] font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${profit.toFixed(2)}
                </dd>
              </div>
              
              <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-[#282c34]">
                <dt className="font-semibold text-slate-950 dark:text-white">{t('tools.etsy-fee-calculator.profitMargin')}</dt>
                <dd className={`text-[16px] font-bold ${margin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {margin.toFixed(2)}%
                </dd>
              </div>
            </dl>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-[#282c34]">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{t('tools.etsy-fee-calculator.feeRate')}</p>
              <p className="mt-2 text-xl font-bold text-slate-950 dark:text-white">{feeRate.toFixed(2)}%</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-[#282c34]">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{t('tools.etsy-fee-calculator.roi')}</p>
              <p className={`mt-2 text-xl font-bold ${roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>{roi.toFixed(2)}%</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-[#282c34]">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{t('tools.etsy-fee-calculator.breakEvenPrice')}</p>
              <p className="mt-2 text-xl font-bold text-amber-600 dark:text-amber-400">${breakEvenItemPrice.toFixed(2)}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              const summaryText = `Etsy Fee & Profit Breakdown:
Total Revenue: $${totalRevenue.toFixed(2)}
Listing Fee: $${listingFee.toFixed(2)}
Transaction Fee (6.5%): $${transactionFee.toFixed(2)}
Payment Processing Fee: $${paymentProcFee.toFixed(2)}
Offsite Ads Fee: $${offsiteAdsFee.toFixed(2)}
Direct Costs: $${directCosts.toFixed(2)}
Net Profit: $${profit.toFixed(2)} (${margin.toFixed(1)}% margin)
Break-Even Item Price: $${breakEvenItemPrice.toFixed(2)}`;
              navigator.clipboard.writeText(summaryText);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            data-analytics-action="result_copied"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--app-text)] py-3 text-sm font-bold text-[var(--app-bg)] shadow-sm transition hover:opacity-90"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied Order Report!' : 'Copy Order Profit Report'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EtsyFeeCalculator;
