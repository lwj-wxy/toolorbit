import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign } from 'lucide-react';

export default function StripeFeeCalculator() {
  const { t } = useTranslation();
  const [amount, setAmount] = useState<number | ''>('');

  const val = Number(amount) || 0;
  
  // Standard US Stripe Fee: 2.9% + 30¢
  const feePercent = 0.029;
  const fixedFee = 0.30;

  const totalFee = val > 0 ? (val * feePercent) + fixedFee : 0;
  const payout = val > 0 ? val - totalFee : 0;

  // Calculate reverse: "How much to invoice to receive exactly X?"
  const amountToInvoice = val > 0 ? (val + fixedFee) / (1 - feePercent) : 0;
  const reverseFee = amountToInvoice - val;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
            {t('tools.stripe-fee-calculator.title')}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            {t('tools.stripe-fee-calculator.subtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#282c34] sm:p-6">
          <label className="mb-2 block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">{t('tools.stripe-fee-calculator.amountLabel')}</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <DollarSign className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')}
              className="block w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-3 text-lg font-semibold text-slate-900 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{t('tools.stripe-fee-calculator.ifPayTitle', { amount: val.toFixed(2) })}</h3>
            <div className="mb-2 flex items-end justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-300">{t('tools.stripe-fee-calculator.feeLabel')}</span>
              <span className="text-red-500 font-medium">-${totalFee.toFixed(2)}</span>
            </div>
            <div className="flex items-end justify-between border-t border-slate-200 pt-3 dark:border-slate-700">
              <span className="text-sm font-semibold text-slate-950 dark:text-white">{t('tools.stripe-fee-calculator.payoutLabel')}</span>
              <span className="text-[24px] font-bold text-green-600">${payout.toFixed(2)}</span>
            </div>
          </div>

          <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-5 shadow-sm dark:border-cyan-900/70 dark:bg-cyan-950/20">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">{t('tools.stripe-fee-calculator.ifReceiveTitle', { amount: val.toFixed(2) })}</h3>
            <div className="mb-2 flex items-end justify-between">
              <span className="text-sm text-cyan-900 dark:text-cyan-100">{t('tools.stripe-fee-calculator.chargeFeeLabel')}</span>
              <span className="font-medium text-cyan-900 dark:text-cyan-100">+${reverseFee.toFixed(2)}</span>
            </div>
            <div className="flex items-end justify-between border-t border-cyan-200 pt-3 dark:border-cyan-900/70">
              <span className="text-sm font-semibold text-cyan-900 dark:text-cyan-100">{t('tools.stripe-fee-calculator.invoiceLabel')}</span>
              <span className="text-[20px] font-bold text-cyan-700 dark:text-cyan-300">${amountToInvoice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
