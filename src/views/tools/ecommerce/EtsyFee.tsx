import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign } from 'lucide-react';
import ToolSEOCard from '../../../components/ToolSEOCard';

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
    <div className="space-y-6">
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#282c34] sm:p-6">
          <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">{t('tools.etsy-fee-calculator.salePriceLabel')}</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <DollarSign className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="number"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value ? Number(e.target.value) : '')}
                className="block w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                placeholder="0.00"
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
                onChange={(e) => setShippingCharge(e.target.value ? Number(e.target.value) : '')}
                className="block w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">{t('tools.etsy-fee-calculator.itemCostLabel')}</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <DollarSign className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="number"
                value={itemCost}
                onChange={(e) => setItemCost(e.target.value ? Number(e.target.value) : '')}
                className="block w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                placeholder="0.00"
              />
            </div>
          </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-6">
          <h3 className="mb-4 border-b border-slate-200 pb-3 text-base font-semibold text-slate-950 dark:border-slate-700 dark:text-white">{t('tools.etsy-fee-calculator.detailsTitle')}</h3>
          
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">{t('tools.etsy-fee-calculator.totalRevenue')}</dt>
              <dd className="font-semibold text-slate-950 dark:text-slate-100">${totalRevenue.toFixed(2)}</dd>
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
      </div>

      <ToolSEOCard toolKey="etsy-fee-calculator" />
    </div>
  );
}
