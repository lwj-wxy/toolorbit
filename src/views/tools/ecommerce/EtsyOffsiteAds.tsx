import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign } from 'lucide-react';

const EtsyOffsiteAdsCalculator = () => {
  const { t } = useTranslation();
  const [orderTotal, setOrderTotal] = useState<number | ''>('');
  const [itemCost, setItemCost] = useState<number | ''>('');
  const [adRate, setAdRate] = useState('15');
  const [includeCoreFees, setIncludeCoreFees] = useState(true);

  const orderTotalValue = Number(orderTotal) || 0;
  const itemCostValue = Number(itemCost) || 0;
  const offsiteAdsRate = Number(adRate) / 100;
  const rawOffsiteAdsFee = orderTotalValue * offsiteAdsRate;
  const offsiteAdsFee = orderTotalValue > 0 ? Math.min(rawOffsiteAdsFee, 100) : 0;
  const listingFee = includeCoreFees && orderTotalValue > 0 ? 0.2 : 0;
  const transactionFee = includeCoreFees ? orderTotalValue * 0.065 : 0;
  const paymentFee = includeCoreFees && orderTotalValue > 0 ? orderTotalValue * 0.03 + 0.25 : 0;
  const coreFees = listingFee + transactionFee + paymentFee;
  const totalFees = offsiteAdsFee + coreFees;
  const estimatedProfit = orderTotalValue - totalFees - itemCostValue;
  const effectiveAdRate = orderTotalValue > 0 ? (offsiteAdsFee / orderTotalValue) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
            {t('tools.etsy-offsite-ads-calculator.title')}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            {t('tools.etsy-offsite-ads-calculator.subtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.85fr)]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#282c34] sm:p-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
                {t('tools.etsy-offsite-ads-calculator.orderTotalLabel')}
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <DollarSign className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="number"
                  value={orderTotal}
                  onChange={(event) => setOrderTotal(event.target.value ? Number(event.target.value) : '')}
                  className="block w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
                {t('tools.etsy-offsite-ads-calculator.itemCostLabel')}
              </label>
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

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
                {t('tools.etsy-offsite-ads-calculator.adRateLabel')}
              </label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {[
                  { value: '15', label: t('tools.etsy-offsite-ads-calculator.rate15') },
                  { value: '12', label: t('tools.etsy-offsite-ads-calculator.rate12') },
                ].map((rateOption) => {
                  const isSelectedRate = adRate === rateOption.value;

                  return (
                    <button
                      key={rateOption.value}
                      type="button"
                      onClick={() => setAdRate(rateOption.value)}
                      className={`flex min-h-11 items-center justify-between rounded-lg border px-3 py-2 text-left text-sm font-semibold shadow-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${
                        isSelectedRate
                          ? 'border-cyan-500 bg-cyan-50 text-cyan-800 dark:border-cyan-400 dark:bg-cyan-950/40 dark:text-cyan-200'
                          : 'border-slate-200 bg-white text-slate-900 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-600'
                      }`}
                    >
                      <span>{rateOption.label}</span>
                      <span
                        className={`ml-3 h-2.5 w-2.5 shrink-0 rounded-full ${
                          isSelectedRate ? 'bg-cyan-600 dark:bg-cyan-300' : 'bg-slate-300 dark:bg-slate-600'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="flex min-h-12 cursor-pointer items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition-colors hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-600 sm:col-span-2">
              <span>{t('tools.etsy-offsite-ads-calculator.includeCoreFees')}</span>
              <input
                type="checkbox"
                checked={includeCoreFees}
                onChange={(event) => setIncludeCoreFees(event.target.checked)}
                className="peer sr-only"
              />
              <span
                className={`flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-cyan-500 peer-focus-visible:ring-offset-2 dark:peer-focus-visible:ring-offset-slate-900 ${
                  includeCoreFees ? 'bg-cyan-600' : 'bg-slate-200 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                    includeCoreFees ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </span>
            </label>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-6">
          <h3 className="mb-4 border-b border-slate-200 pb-3 text-base font-semibold text-slate-950 dark:border-slate-700 dark:text-white">
            {t('tools.etsy-offsite-ads-calculator.resultTitle')}
          </h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">{t('tools.etsy-offsite-ads-calculator.offsiteAdsFee')}</dt>
              <dd className="font-semibold text-red-500">-${offsiteAdsFee.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">{t('tools.etsy-offsite-ads-calculator.effectiveRate')}</dt>
              <dd className="font-semibold text-slate-950 dark:text-slate-100">{effectiveAdRate.toFixed(2)}%</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">{t('tools.etsy-offsite-ads-calculator.coreFees')}</dt>
              <dd className="font-semibold text-red-500">-${coreFees.toFixed(2)}</dd>
            </div>
            <div className="border-t border-dashed border-slate-300 pt-2 dark:border-slate-700" />
            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-[#282c34]">
              <dt className="font-semibold text-slate-950 dark:text-white">{t('tools.etsy-offsite-ads-calculator.totalFees')}</dt>
              <dd className="text-[18px] font-bold text-red-600">-${totalFees.toFixed(2)}</dd>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-[#282c34]">
              <dt className="font-semibold text-slate-950 dark:text-white">{t('tools.etsy-offsite-ads-calculator.estimatedProfit')}</dt>
              <dd className={`text-[20px] font-bold ${estimatedProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${estimatedProfit.toFixed(2)}
              </dd>
            </div>
          </dl>
        </div>
      </div>

    </div>
  );
};

export default EtsyOffsiteAdsCalculator;
