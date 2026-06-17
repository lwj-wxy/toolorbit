import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign } from 'lucide-react';

const regulatoryCountries = [
  { key: 'none', rate: 0 },
  { key: 'uk', rate: 0.0032 },
  { key: 'france', rate: 0.0047 },
  { key: 'italy', rate: 0.0032 },
  { key: 'india', rate: 0.0029 },
  { key: 'spain', rate: 0.0072 },
  { key: 'turkiye', rate: 0.0227 },
  { key: 'vietnam', rate: 0.0124 },
  { key: 'canada', rate: 0.005 },
];

const EtsyRegulatoryFeeCalculator = () => {
  const { t } = useTranslation();
  const [orderTotal, setOrderTotal] = useState<number | ''>('');
  const [countryKey, setCountryKey] = useState('none');
  const [includeCurrencyConversion, setIncludeCurrencyConversion] = useState(false);

  const orderTotalValue = Number(orderTotal) || 0;
  const selectedCountry = regulatoryCountries.find((country) => country.key === countryKey) || regulatoryCountries[0];
  const regulatoryFee = orderTotalValue * selectedCountry.rate;
  const currencyConversionFee = includeCurrencyConversion ? orderTotalValue * 0.025 : 0;
  const extraFees = regulatoryFee + currencyConversionFee;
  const extraRate = orderTotalValue > 0 ? (extraFees / orderTotalValue) * 100 : 0;
  const amountAfterExtras = orderTotalValue - extraFees;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
            {t('tools.etsy-regulatory-fee-calculator.title')}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            {t('tools.etsy-regulatory-fee-calculator.subtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.85fr)]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#282c34] sm:p-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
                {t('tools.etsy-regulatory-fee-calculator.orderTotalLabel')}
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
                {t('tools.etsy-regulatory-fee-calculator.countryLabel')}
              </label>
              <select
                value={countryKey}
                onChange={(event) => setCountryKey(event.target.value)}
                className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition-colors focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                {regulatoryCountries.map((country) => (
                  <option key={country.key} value={country.key}>
                    {t(`tools.etsy-regulatory-fee-calculator.country.${country.key}`)}
                  </option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-900 dark:border-slate-700 dark:text-slate-100 sm:col-span-2">
              <input
                type="checkbox"
                checked={includeCurrencyConversion}
                onChange={(event) => setIncludeCurrencyConversion(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
              />
              {t('tools.etsy-regulatory-fee-calculator.includeCurrencyConversion')}
            </label>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-6">
          <h3 className="mb-4 border-b border-slate-200 pb-3 text-base font-semibold text-slate-950 dark:border-slate-700 dark:text-white">
            {t('tools.etsy-regulatory-fee-calculator.resultTitle')}
          </h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">{t('tools.etsy-regulatory-fee-calculator.regulatoryRate')}</dt>
              <dd className="font-semibold text-slate-950 dark:text-slate-100">{(selectedCountry.rate * 100).toFixed(2)}%</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">{t('tools.etsy-regulatory-fee-calculator.regulatoryFee')}</dt>
              <dd className="font-semibold text-red-500">-${regulatoryFee.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">{t('tools.etsy-regulatory-fee-calculator.currencyFee')}</dt>
              <dd className="font-semibold text-red-500">-${currencyConversionFee.toFixed(2)}</dd>
            </div>
            <div className="border-t border-dashed border-slate-300 pt-2 dark:border-slate-700" />
            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-[#282c34]">
              <dt className="font-semibold text-slate-950 dark:text-white">{t('tools.etsy-regulatory-fee-calculator.extraFees')}</dt>
              <dd className="text-[18px] font-bold text-red-600">-${extraFees.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">{t('tools.etsy-regulatory-fee-calculator.extraRate')}</dt>
              <dd className="font-semibold text-slate-950 dark:text-slate-100">{extraRate.toFixed(2)}%</dd>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-[#282c34]">
              <dt className="font-semibold text-slate-950 dark:text-white">{t('tools.etsy-regulatory-fee-calculator.amountAfterExtras')}</dt>
              <dd className="text-[20px] font-bold text-green-600">${amountAfterExtras.toFixed(2)}</dd>
            </div>
          </dl>
        </div>
      </div>

    </div>
  );
};

export default EtsyRegulatoryFeeCalculator;
