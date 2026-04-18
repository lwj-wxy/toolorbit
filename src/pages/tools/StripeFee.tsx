import { useState } from 'react';
import { DollarSign } from 'lucide-react';

export default function StripeFeeCalculator() {
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
            Stripe 手续费计算器
          </h2>
          <p className="mt-1 text-sm text-[#94a3b8]">
            采用 Stripe 默认费率标准（2.9% + 30¢），一键计算收付款项及到账情况。
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-6">
          <label className="block text-sm font-medium text-[#334155] mb-2">交易金额 (USD)</label>
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
          <div className="bg-[#f8fafc] rounded-xl shadow-sm border border-[#e2e8f0] p-5">
            <h3 className="text-[14px] font-bold text-[#64748b] uppercase tracking-wider mb-3">如果客户支付 ${val.toFixed(2)}</h3>
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm text-[#334155]">Stripe 扣除手续费</span>
              <span className="text-red-500 font-medium">-${totalFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-end pt-3 border-t border-[#e2e8f0]">
              <span className="text-sm font-bold text-[#1e293b]">您实际到账金额</span>
              <span className="text-[24px] font-bold text-green-600">${payout.toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-[#f0f9ff] rounded-xl shadow-sm border border-[#bae6fd] p-5">
            <h3 className="text-[14px] font-bold text-[#0369a1] uppercase tracking-wider mb-3">如果想要实收 ${val.toFixed(2)}</h3>
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm text-[#0c4a6e]">需让客户承担的手续费</span>
              <span className="text-[#0c4a6e] font-medium">+${ReverseFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-end pt-3 border-t border-[#bae6fd]">
              <span className="text-sm font-bold text-[#0c4a6e]">您需要给客户的账单金额</span>
              <span className="text-[20px] font-bold text-[#0284c7]">${amountToInvoice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
