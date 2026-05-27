import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CreditCard, DollarSign, Globe2 } from 'lucide-react';
import ToolSEOCard from '../../../components/ToolSEOCard';
import { cn } from '../../../lib/utils';

type PayPalFeeProfile = {
  key: string;
  percent: number;
  usesFixedFee: boolean;
};

type CurrencyPreset = {
  code: string;
  symbol: string;
  fixedFee: number;
};

const PAYPAL_FEE_PROFILES: PayPalFeeProfile[] = [
  { key: 'checkout', percent: 0.0349, usesFixedFee: true },
  { key: 'standardCard', percent: 0.0299, usesFixedFee: true },
  { key: 'goodsServices', percent: 0.0299, usesFixedFee: false },
  { key: 'payLater', percent: 0.0499, usesFixedFee: true },
];

const CURRENCY_PRESETS: CurrencyPreset[] = [
  { code: 'USD', symbol: '$', fixedFee: 0.49 },
  { code: 'EUR', symbol: '€', fixedFee: 0.39 },
  { code: 'GBP', symbol: '£', fixedFee: 0.39 },
  { code: 'CAD', symbol: 'CA$', fixedFee: 0.59 },
  { code: 'AUD', symbol: 'A$', fixedFee: 0.59 },
];

const INTERNATIONAL_SURCHARGE_RATE = 0.015;

const PayPalFeeCalculator = () => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState<number | ''>(100);
  const [profileKey, setProfileKey] = useState('checkout');
  const [currencyCode, setCurrencyCode] = useState('USD');
  const [includeInternational, setIncludeInternational] = useState(false);

  const transactionAmount = Number(amount) || 0;
  const selectedProfile = PAYPAL_FEE_PROFILES.find((profile) => profile.key === profileKey) || PAYPAL_FEE_PROFILES[0];
  const selectedCurrency = CURRENCY_PRESETS.find((currency) => currency.code === currencyCode) || CURRENCY_PRESETS[0];
  const percentRate = selectedProfile.percent + (includeInternational ? INTERNATIONAL_SURCHARGE_RATE : 0);
  const fixedFee = selectedProfile.usesFixedFee ? selectedCurrency.fixedFee : 0;
  const totalFee = transactionAmount > 0 ? transactionAmount * percentRate + fixedFee : 0;
  const netPayout = transactionAmount > 0 ? Math.max(transactionAmount - totalFee, 0) : 0;
  const amountToInvoice = transactionAmount > 0 ? (transactionAmount + fixedFee) / (1 - percentRate) : 0;
  const reverseFee = amountToInvoice > 0 ? amountToInvoice - transactionAmount : 0;
  const effectiveRate = transactionAmount > 0 ? (totalFee / transactionAmount) * 100 : 0;

  const formatMoney = (value: number) => `${selectedCurrency.symbol}${value.toFixed(2)} ${selectedCurrency.code}`;

  const rateLabel = `${(selectedProfile.percent * 100).toFixed(2)}%${fixedFee > 0 ? ` + ${formatMoney(fixedFee)}` : ''}`;
  const totalRateLabel = includeInternational
    ? `${(percentRate * 100).toFixed(2)}%${fixedFee > 0 ? ` + ${formatMoney(fixedFee)}` : ''}`
    : rateLabel;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
            {t('tools.paypal-fee-calculator.title')}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            {t('tools.paypal-fee-calculator.subtitle')}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <section className="space-y-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#282c34] sm:p-6">
          <div className="max-w-xl space-y-3">
            <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
              {t('tools.paypal-fee-calculator.amountLabel')}
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <DollarSign className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="number"
                min="0"
                value={amount}
                onChange={(event) => setAmount(event.target.value ? Number(event.target.value) : '')}
                className="block h-14 w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-3 text-lg font-semibold text-slate-900 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-5 border-t border-slate-200 pt-5 dark:border-slate-700">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
                <CreditCard className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
                {t('tools.paypal-fee-calculator.profileLabel')}
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
                {PAYPAL_FEE_PROFILES.map((profile) => (
                  <button
                    key={profile.key}
                    type="button"
                    onClick={() => setProfileKey(profile.key)}
                    className={cn(
                      'min-h-[76px] rounded-lg border px-4 py-3 text-left transition-colors duration-200',
                      profile.key === profileKey
                        ? 'border-cyan-400 bg-cyan-50 text-cyan-900 dark:border-cyan-700 dark:bg-cyan-950/30 dark:text-cyan-100'
                        : 'border-slate-200 bg-slate-50/70 text-slate-700 hover:border-cyan-200 hover:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-cyan-900 dark:hover:bg-slate-900/70',
                    )}
                  >
                    <span className="block text-sm font-semibold leading-5">
                      {t(`tools.paypal-fee-calculator.profiles.${profile.key}.label`)}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400">
                      {t(`tools.paypal-fee-calculator.profiles.${profile.key}.rate`)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
                <Globe2 className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
                {t('tools.paypal-fee-calculator.currencyLabel')}
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 lg:grid-cols-[repeat(5,minmax(86px,1fr))_minmax(260px,2fr)]">
                {CURRENCY_PRESETS.map((currency) => (
                  <button
                    key={currency.code}
                    type="button"
                    onClick={() => setCurrencyCode(currency.code)}
                    className={cn(
                      'h-11 rounded-lg border px-2 text-sm font-semibold transition-colors duration-200',
                      currency.code === currencyCode
                        ? 'border-cyan-400 bg-cyan-50 text-cyan-800 dark:border-cyan-700 dark:bg-cyan-950/30 dark:text-cyan-100'
                        : 'border-slate-200 bg-slate-50/70 text-slate-600 hover:border-cyan-200 hover:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-cyan-900',
                    )}
                  >
                    {currency.code}
                  </button>
                ))}
                <label className="flex min-h-[44px] items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-3 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 sm:col-span-5 lg:col-span-1">
                  <input
                    type="checkbox"
                    checked={includeInternational}
                    onChange={(event) => setIncludeInternational(event.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                  />
                  <span>{t('tools.paypal-fee-calculator.internationalLabel')}</span>
                </label>
              </div>
            </div>
          </div>
        </section>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <section className="rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {t('tools.paypal-fee-calculator.resultTitle', { amount: formatMoney(transactionAmount) })}
            </h3>
            <div className="space-y-2">
              <div className="flex items-end justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-300">{t('tools.paypal-fee-calculator.rateLabel')}</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">{totalRateLabel}</span>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-300">{t('tools.paypal-fee-calculator.feeLabel')}</span>
                <span className="font-medium text-red-500">-{formatMoney(totalFee)}</span>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-300">{t('tools.paypal-fee-calculator.effectiveRateLabel')}</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">{effectiveRate.toFixed(2)}%</span>
              </div>
            </div>
            <div className="mt-4 flex items-end justify-between border-t border-slate-200 pt-4 dark:border-slate-700">
              <span className="text-sm font-semibold text-slate-950 dark:text-white">{t('tools.paypal-fee-calculator.payoutLabel')}</span>
              <span className="text-[24px] font-bold text-green-600">{formatMoney(netPayout)}</span>
            </div>
          </section>

          <section className="rounded-lg border border-cyan-200 bg-cyan-50 p-5 shadow-sm dark:border-cyan-900/70 dark:bg-cyan-950/20">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">
              {t('tools.paypal-fee-calculator.reverseTitle', { amount: formatMoney(transactionAmount) })}
            </h3>
            <div className="mb-2 flex items-end justify-between">
              <span className="text-sm text-cyan-900 dark:text-cyan-100">{t('tools.paypal-fee-calculator.reverseFeeLabel')}</span>
              <span className="font-medium text-cyan-900 dark:text-cyan-100">+{formatMoney(reverseFee)}</span>
            </div>
            <div className="flex items-end justify-between border-t border-cyan-200 pt-3 dark:border-cyan-900/70">
              <span className="text-sm font-semibold text-cyan-900 dark:text-cyan-100">{t('tools.paypal-fee-calculator.invoiceLabel')}</span>
              <span className="text-[20px] font-bold text-cyan-700 dark:text-cyan-300">{formatMoney(amountToInvoice)}</span>
            </div>
          </section>
          </div>

          <section className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/20 dark:text-amber-100">
            {t('tools.paypal-fee-calculator.rateNote')}
          </section>
        </div>
      </div>

      <ToolSEOCard toolKey="paypal-fee-calculator" />
    </div>
  );
};

export default PayPalFeeCalculator;
