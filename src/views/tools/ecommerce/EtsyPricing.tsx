import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, Percent } from 'lucide-react';

const EtsyPricingCalculator = () => {
  const { t } = useTranslation();
  const [itemCost, setItemCost] = useState<number | ''>('');
  const [shippingCost, setShippingCost] = useState<number | ''>('');
  const [shippingCharge, setShippingCharge] = useState<number | ''>('');
  const [targetProfit, setTargetProfit] = useState<number | ''>('');
  const [offsiteRate, setOffsiteRate] = useState('0');
  const [regulatoryRate, setRegulatoryRate] = useState<number | ''>('');
  const [includeCurrencyConversion, setIncludeCurrencyConversion] = useState(false);

  const itemCostValue = Number(itemCost) || 0;
  const shippingCostValue = Number(shippingCost) || 0;
  const shippingChargeValue = Number(shippingCharge) || 0;
  const targetProfitValue = Number(targetProfit) || 0;
  const offsiteRateValue = Number(offsiteRate) / 100;
  const regulatoryRateValue = (Number(regulatoryRate) || 0) / 100;
  const currencyConversionRate = includeCurrencyConversion ? 0.025 : 0;
  const variableFeeRate = 0.065 + 0.03 + offsiteRateValue + regulatoryRateValue + currencyConversionRate;
  const fixedFees = 0.2 + 0.25;
  const totalCost = itemCostValue + shippingCostValue;
  const requiredRevenue =
    variableFeeRate < 0.95 ? (totalCost + targetProfitValue + fixedFees) / (1 - variableFeeRate) : 0;
  const requiredItemPrice = Math.max(0, requiredRevenue - shippingChargeValue);
  const estimatedVariableFees = requiredRevenue * variableFeeRate;
  const estimatedTotalFees = requiredRevenue > 0 ? estimatedVariableFees + fixedFees : 0;
  const finalProfit = requiredRevenue - estimatedTotalFees - totalCost;
  const feeRatio = requiredRevenue > 0 ? (estimatedTotalFees / requiredRevenue) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
            {t('tools.etsy-pricing-calculator.title')}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            {t('tools.etsy-pricing-calculator.subtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.85fr)]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#282c34] sm:p-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {[
              { value: itemCost, setValue: setItemCost, label: t('tools.etsy-pricing-calculator.itemCostLabel'), icon: 'dollar' },
              { value: shippingCost, setValue: setShippingCost, label: t('tools.etsy-pricing-calculator.shippingCostLabel'), icon: 'dollar' },
              { value: shippingCharge, setValue: setShippingCharge, label: t('tools.etsy-pricing-calculator.shippingChargeLabel'), icon: 'dollar' },
              { value: targetProfit, setValue: setTargetProfit, label: t('tools.etsy-pricing-calculator.targetProfitLabel'), icon: 'dollar' },
            ].map((field) => (
              <div key={field.label}>
                <label className="mb-2 block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
                  {field.label}
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <DollarSign className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="number"
                    value={field.value}
                    onChange={(event) => field.setValue(event.target.value ? Number(event.target.value) : '')}
                    className="block w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    placeholder="0.00"
                  />
                </div>
              </div>
            ))}

            <div>
              <label className="mb-2 block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
                {t('tools.etsy-pricing-calculator.offsiteRateLabel')}
              </label>
              <select
                value={offsiteRate}
                onChange={(event) => setOffsiteRate(event.target.value)}
                className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition-colors focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                <option value="0">{t('tools.etsy-pricing-calculator.offsiteNone')}</option>
                <option value="12">{t('tools.etsy-pricing-calculator.offsite12')}</option>
                <option value="15">{t('tools.etsy-pricing-calculator.offsite15')}</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
                {t('tools.etsy-pricing-calculator.regulatoryRateLabel')}
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Percent className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="number"
                  value={regulatoryRate}
                  onChange={(event) => setRegulatoryRate(event.target.value ? Number(event.target.value) : '')}
                  className="block w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  placeholder="0.00"
                />
              </div>
            </div>

            <label className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-900 dark:border-slate-700 dark:text-slate-100 sm:col-span-2">
              <input
                type="checkbox"
                checked={includeCurrencyConversion}
                onChange={(event) => setIncludeCurrencyConversion(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
              />
              {t('tools.etsy-pricing-calculator.includeCurrencyConversion')}
            </label>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-6">
          <h3 className="mb-4 border-b border-slate-200 pb-3 text-base font-semibold text-slate-950 dark:border-slate-700 dark:text-white">
            {t('tools.etsy-pricing-calculator.resultTitle')}
          </h3>
          <dl className="space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-[#282c34]">
              <dt className="font-semibold text-slate-950 dark:text-white">{t('tools.etsy-pricing-calculator.requiredItemPrice')}</dt>
              <dd className="text-[22px] font-bold text-cyan-700 dark:text-cyan-300">${requiredItemPrice.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">{t('tools.etsy-pricing-calculator.requiredRevenue')}</dt>
              <dd className="font-semibold text-slate-950 dark:text-slate-100">${requiredRevenue.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">{t('tools.etsy-pricing-calculator.estimatedFees')}</dt>
              <dd className="font-semibold text-red-500">-${estimatedTotalFees.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">{t('tools.etsy-pricing-calculator.feeRatio')}</dt>
              <dd className="font-semibold text-slate-950 dark:text-slate-100">{feeRatio.toFixed(2)}%</dd>
            </div>
            <div className="border-t border-dashed border-slate-300 pt-2 dark:border-slate-700" />
            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-[#282c34]">
              <dt className="font-semibold text-slate-950 dark:text-white">{t('tools.etsy-pricing-calculator.finalProfit')}</dt>
              <dd className={`text-[20px] font-bold ${finalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${finalProfit.toFixed(2)}
              </dd>
            </div>
          </dl>
        </div>
      </div>

    </div>
  );
};

export default EtsyPricingCalculator;
