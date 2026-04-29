import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, Percent, Copy, Check } from 'lucide-react';

export default function EtsyFeeCalculator() {
  const { t } = useTranslation();
  const [salePrice, setSalePrice] = useState<number | ''>('');
  const [shippingCharge, setShippingCharge] = useState<number | ''>('');
  const [itemCost, setItemCost] = useState<number | ''>('');

  const p = Number(salePrice) || 0;
  const s = Number(shippingCharge) || 0;
  const c = Number(itemCost) || 0;
  const totalRevenue = p + s;

  // Etsy Fees (US base)
  const listingFee = 0.20;
  const transactionFee = totalRevenue * 0.065; // 6.5% transaction fee
  const paymentProcFee = totalRevenue * 0.03 + 0.25; // 3% + $0.25
  const totalFees = listingFee + transactionFee + paymentProcFee;
  
  const profit = totalRevenue - totalFees - c;
  const margin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[24px] font-bold text-[#1e293b]">
            {t('tools.etsy-fee-calculator.title')}
          </h2>
          <p className="mt-1 text-sm text-[#94a3b8]">
            {t('tools.etsy-fee-calculator.subtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#334155] mb-2">{t('tools.etsy-fee-calculator.salePriceLabel')}</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <DollarSign className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="number"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value ? Number(e.target.value) : '')}
                className="block w-full rounded-md border-0 py-2.5 pl-9 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#334155] mb-2">{t('tools.etsy-fee-calculator.shippingChargeLabel')}</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <DollarSign className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="number"
                value={shippingCharge}
                onChange={(e) => setShippingCharge(e.target.value ? Number(e.target.value) : '')}
                className="block w-full rounded-md border-0 py-2.5 pl-9 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#334155] mb-2">{t('tools.etsy-fee-calculator.itemCostLabel')}</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <DollarSign className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="number"
                value={itemCost}
                onChange={(e) => setItemCost(e.target.value ? Number(e.target.value) : '')}
                className="block w-full rounded-md border-0 py-2.5 pl-9 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        <div className="bg-[#f8fafc] rounded-xl shadow-sm border border-slate-200/80 p-6">
          <h3 className="text-[16px] font-bold text-[#1e293b] mb-4 border-b border-[#e2e8f0] pb-2">{t('tools.etsy-fee-calculator.detailsTitle')}</h3>
          
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-[#64748b]">{t('tools.etsy-fee-calculator.totalRevenue')}</dt>
              <dd className="font-semibold text-[#1e293b]">${totalRevenue.toFixed(2)}</dd>
            </div>
            
            <div className="pt-2 border-t border-dashed border-[#cbd5e1]" />
            
            <div className="flex justify-between">
              <dt className="text-[#64748b]">{t('tools.etsy-fee-calculator.listingFee')}</dt>
              <dd className="text-red-500">-${listingFee.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#64748b]">{t('tools.etsy-fee-calculator.transactionFee')}</dt>
              <dd className="text-red-500">-${transactionFee.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#64748b]">{t('tools.etsy-fee-calculator.paymentFee')}</dt>
              <dd className="text-red-500">-${paymentProcFee.toFixed(2)}</dd>
            </div>
            
            <div className="pt-2 border-t border-dashed border-[#cbd5e1]" />
            
            <div className="flex justify-between items-center bg-white p-3 rounded border border-[#e2e8f0]">
              <dt className="font-bold text-[#1e293b]">{t('tools.etsy-fee-calculator.netProfit')}</dt>
              <dd className={`text-[20px] font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${profit.toFixed(2)}
              </dd>
            </div>
            
            <div className="flex justify-between items-center bg-white p-3 rounded border border-[#e2e8f0]">
              <dt className="font-bold text-[#1e293b]">{t('tools.etsy-fee-calculator.profitMargin')}</dt>
              <dd className={`text-[16px] font-bold ${margin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {margin.toFixed(2)}%
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Bottom SEO Instructions Panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8 lg:p-12 mt-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">{t('tools.etsy-fee-calculator.seoTitle')}</h2>
        
        <p className="text-slate-600 mb-6 leading-relaxed">
          {t('tools.etsy-fee-calculator.seoDesc')}
        </p>

        <h3 className="font-bold text-slate-800 text-lg mb-4">{t('tools.etsy-fee-calculator.highlightsTitle')}</h3>
        <ul className="space-y-4 text-slate-600">
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">{t('tools.etsy-fee-calculator.highlight1Title')}</strong>
            <span>{t('tools.etsy-fee-calculator.highlight1Desc')}</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">{t('tools.etsy-fee-calculator.highlight2Title')}</strong>
            <span>{t('tools.etsy-fee-calculator.highlight2Desc')}</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">{t('tools.etsy-fee-calculator.highlight3Title')}</strong>
            <span>{t('tools.etsy-fee-calculator.highlight3Desc')}</span>
          </li>
        </ul>
        
        <p className="text-slate-500 text-sm mt-8 pt-6 border-t border-slate-100">
          {t('tools.etsy-fee-calculator.disclaimer')}
        </p>
      </div>

    </div>
  );
}
