import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeftRight, DollarSign } from 'lucide-react';
import ToolSEOCard from '../../../components/ToolSEOCard';
import { cn } from '../../../lib/utils';

type PayPalComparisonProfile = {
  key: string;
  percent: number;
  fixedFee: number;
};

const STRIPE_PERCENT_RATE = 0.029;
const STRIPE_FIXED_FEE = 0.3;
const PAYPAL_INTERNATIONAL_SURCHARGE_RATE = 0.015;

const PAYPAL_COMPARISON_PROFILES: PayPalComparisonProfile[] = [
  { key: 'checkout', percent: 0.0349, fixedFee: 0.49 },
  { key: 'standardCard', percent: 0.0299, fixedFee: 0.49 },
  { key: 'goodsServices', percent: 0.0299, fixedFee: 0 },
  { key: 'payLater', percent: 0.0499, fixedFee: 0.49 },
];

const StripeVsPayPalFeeCalculator = () => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState<number | ''>(100);
  const [profileKey, setProfileKey] = useState('checkout');
  const [includePayPalInternational, setIncludePayPalInternational] = useState(false);

  const transactionAmount = Number(amount) || 0;
  const selectedPayPalProfile =
    PAYPAL_COMPARISON_PROFILES.find((profile) => profile.key === profileKey) || PAYPAL_COMPARISON_PROFILES[0];
  const paypalPercentRate =
    selectedPayPalProfile.percent + (includePayPalInternational ? PAYPAL_INTERNATIONAL_SURCHARGE_RATE : 0);

  const stripeFee = transactionAmount > 0 ? transactionAmount * STRIPE_PERCENT_RATE + STRIPE_FIXED_FEE : 0;
  const stripePayout = transactionAmount > 0 ? Math.max(transactionAmount - stripeFee, 0) : 0;
  const paypalFee = transactionAmount > 0 ? transactionAmount * paypalPercentRate + selectedPayPalProfile.fixedFee : 0;
  const paypalPayout = transactionAmount > 0 ? Math.max(transactionAmount - paypalFee, 0) : 0;
  const feeDifference = Math.abs(stripeFee - paypalFee);
  const payoutDifference = Math.abs(stripePayout - paypalPayout);
  const cheaperProcessor = stripeFee <= paypalFee ? 'stripe' : 'paypal';
  const stripeEffectiveRate = transactionAmount > 0 ? (stripeFee / transactionAmount) * 100 : 0;
  const paypalEffectiveRate = transactionAmount > 0 ? (paypalFee / transactionAmount) * 100 : 0;

  const formatMoney = (value: number) => `$${value.toFixed(2)} USD`;

  const processorRows = [
    {
      key: 'stripe',
      fee: stripeFee,
      payout: stripePayout,
      rate: `${(STRIPE_PERCENT_RATE * 100).toFixed(2)}% + $${STRIPE_FIXED_FEE.toFixed(2)}`,
      effectiveRate: stripeEffectiveRate,
    },
    {
      key: 'paypal',
      fee: paypalFee,
      payout: paypalPayout,
      rate: `${(paypalPercentRate * 100).toFixed(2)}%${
        selectedPayPalProfile.fixedFee > 0 ? ` + $${selectedPayPalProfile.fixedFee.toFixed(2)}` : ''
      }`,
      effectiveRate: paypalEffectiveRate,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
            {t('tools.stripe-vs-paypal-fee-calculator.title')}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            {t('tools.stripe-vs-paypal-fee-calculator.subtitle')}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <section className="space-y-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#282c34] sm:p-6">
          <div className="max-w-xl space-y-3">
            <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
              {t('tools.stripe-vs-paypal-fee-calculator.amountLabel')}
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
                <ArrowLeftRight className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
                {t('tools.stripe-vs-paypal-fee-calculator.paypalProfileLabel')}
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
                {PAYPAL_COMPARISON_PROFILES.map((profile) => (
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
                      {t(`tools.stripe-vs-paypal-fee-calculator.profiles.${profile.key}.label`)}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400">
                      {t(`tools.stripe-vs-paypal-fee-calculator.profiles.${profile.key}.rate`)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <label className="flex min-h-[44px] items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-3 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              <input
                type="checkbox"
                checked={includePayPalInternational}
                onChange={(event) => setIncludePayPalInternational(event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
              />
              <span>{t('tools.stripe-vs-paypal-fee-calculator.internationalLabel')}</span>
            </label>
          </div>
        </section>

        <div className="space-y-4">
          <section className="rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {t('tools.stripe-vs-paypal-fee-calculator.resultTitle', { amount: formatMoney(transactionAmount) })}
            </h3>
            <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
              {processorRows.map((processor) => (
                <div
                  key={processor.key}
                  className={cn(
                    'rounded-lg border bg-white p-4 dark:bg-[#282c34]',
                    processor.key === cheaperProcessor
                      ? 'border-green-200 dark:border-green-900/70'
                      : 'border-slate-200 dark:border-slate-700',
                  )}
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h4 className="text-base font-semibold text-slate-950 dark:text-white">
                      {t(`tools.stripe-vs-paypal-fee-calculator.processors.${processor.key}`)}
                    </h4>
                    {processor.key === cheaperProcessor ? (
                      <span className="rounded-md bg-green-50 px-2 py-1 text-xs font-semibold text-green-700 dark:bg-green-950/40 dark:text-green-300">
                        {t('tools.stripe-vs-paypal-fee-calculator.lowerFeeBadge')}
                      </span>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-end justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-300">{t('tools.stripe-vs-paypal-fee-calculator.rateLabel')}</span>
                      <span className="font-medium text-slate-900 dark:text-slate-100">{processor.rate}</span>
                    </div>
                    <div className="flex items-end justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-300">{t('tools.stripe-vs-paypal-fee-calculator.feeLabel')}</span>
                      <span className="font-medium text-red-500">-{formatMoney(processor.fee)}</span>
                    </div>
                    <div className="flex items-end justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-300">{t('tools.stripe-vs-paypal-fee-calculator.effectiveRateLabel')}</span>
                      <span className="font-medium text-slate-900 dark:text-slate-100">{processor.effectiveRate.toFixed(2)}%</span>
                    </div>
                    <div className="flex items-end justify-between border-t border-slate-200 pt-2 dark:border-slate-700">
                      <span className="text-sm font-semibold text-slate-950 dark:text-white">{t('tools.stripe-vs-paypal-fee-calculator.payoutLabel')}</span>
                      <span className="text-lg font-bold text-green-600">{formatMoney(processor.payout)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <section className="rounded-lg border border-cyan-200 bg-cyan-50 p-5 shadow-sm dark:border-cyan-900/70 dark:bg-cyan-950/20">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">
              {t('tools.stripe-vs-paypal-fee-calculator.summaryTitle')}
            </h3>
            <div className="space-y-2">
              <div className="flex items-end justify-between">
                <span className="text-sm text-cyan-900 dark:text-cyan-100">{t('tools.stripe-vs-paypal-fee-calculator.cheaperLabel')}</span>
                <span className="font-semibold text-cyan-900 dark:text-cyan-100">
                  {t(`tools.stripe-vs-paypal-fee-calculator.processors.${cheaperProcessor}`)}
                </span>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-sm text-cyan-900 dark:text-cyan-100">{t('tools.stripe-vs-paypal-fee-calculator.feeDifferenceLabel')}</span>
                <span className="font-semibold text-cyan-900 dark:text-cyan-100">{formatMoney(feeDifference)}</span>
              </div>
              <div className="flex items-end justify-between border-t border-cyan-200 pt-3 dark:border-cyan-900/70">
                <span className="text-sm font-semibold text-cyan-900 dark:text-cyan-100">{t('tools.stripe-vs-paypal-fee-calculator.payoutDifferenceLabel')}</span>
                <span className="text-[20px] font-bold text-cyan-700 dark:text-cyan-300">{formatMoney(payoutDifference)}</span>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/20 dark:text-amber-100">
            {t('tools.stripe-vs-paypal-fee-calculator.rateNote')}
          </section>
          </div>
        </div>
      </div>

      <ToolSEOCard toolKey="stripe-vs-paypal-fee-calculator" />
    </div>
  );
};

export default StripeVsPayPalFeeCalculator;
