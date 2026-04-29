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
  const ReverseFee = amountToInvoice - val;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[24px] font-bold text-[#1e293b]">
            {t('tools.stripe-fee-calculator.title')}
          </h2>
          <p className="mt-1 text-sm text-[#94a3b8]">
            {t('tools.stripe-fee-calculator.subtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6">
          <label className="block text-sm font-medium text-[#334155] mb-2">{t('tools.stripe-fee-calculator.amountLabel')}</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')}
              className="block w-full rounded-md border-0 py-3 pl-10 pr-3 text-[18px] text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 font-bold"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[#f8fafc] rounded-xl shadow-sm border border-slate-200/80 p-5">
            <h3 className="text-[14px] font-bold text-[#64748b] uppercase tracking-wider mb-3">{t('tools.stripe-fee-calculator.ifPayTitle', { amount: val.toFixed(2) })}</h3>
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm text-[#334155]">{t('tools.stripe-fee-calculator.feeLabel')}</span>
              <span className="text-red-500 font-medium">-${totalFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-end pt-3 border-t border-[#e2e8f0]">
              <span className="text-sm font-bold text-[#1e293b]">{t('tools.stripe-fee-calculator.payoutLabel')}</span>
              <span className="text-[24px] font-bold text-green-600">${payout.toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-[#f0f9ff] rounded-xl shadow-sm border border-[#bae6fd] p-5">
            <h3 className="text-[14px] font-bold text-[#0369a1] uppercase tracking-wider mb-3">{t('tools.stripe-fee-calculator.ifReceiveTitle', { amount: val.toFixed(2) })}</h3>
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm text-[#0c4a6e]">{t('tools.stripe-fee-calculator.chargeFeeLabel')}</span>
              <span className="text-[#0c4a6e] font-medium">+${ReverseFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-end pt-3 border-t border-[#bae6fd]">
              <span className="text-sm font-bold text-[#0c4a6e]">{t('tools.stripe-fee-calculator.invoiceLabel')}</span>
              <span className="text-[20px] font-bold text-[#0284c7]">${amountToInvoice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom SEO Instructions Panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8 lg:p-12 mt-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">{t('tools.stripe-fee-calculator.seoTitle')}</h2>
        
        <p className="text-slate-600 mb-6 leading-relaxed">
          {t('tools.stripe-fee-calculator.seoDesc')}
        </p>

        <h3 className="font-bold text-slate-800 text-lg mb-4">{t('tools.stripe-fee-calculator.highlightsTitle')}</h3>
        <ul className="space-y-4 text-slate-600">
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">{t('tools.stripe-fee-calculator.highlight1Title')}</strong>
            <span>{t('tools.stripe-fee-calculator.highlight1Desc')}</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">{t('tools.stripe-fee-calculator.highlight2Title')}</strong>
            <span>{t('tools.stripe-fee-calculator.highlight2Desc')}</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">{t('tools.stripe-fee-calculator.highlight3Title')}</strong>
            <span>{t('tools.stripe-fee-calculator.highlight3Desc')}</span>
          </li>
        </ul>
        
        <p className="text-slate-500 text-sm mt-8 pt-6 border-t border-slate-100">
          {t('tools.stripe-fee-calculator.disclaimer')}
        </p>
      </div>

    </div>
  );
}
