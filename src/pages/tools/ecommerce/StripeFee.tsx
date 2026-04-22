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
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6">
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
          <div className="bg-[#f8fafc] rounded-xl shadow-sm border border-slate-200/80 p-5">
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

      {/* Bottom SEO Instructions Panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8 lg:p-12 mt-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Stripe 手续费在线计算器，一键换算全球信用卡收单成本</h2>
        
        <p className="text-slate-600 mb-6 leading-relaxed">
          无论您是在运营独立站的电商达人，或是通过邮件向海外客户发送数字账单的自由职业者，Stripe 作为国际顶尖的支付网关，都是极佳的收单途径。但其每笔“百分比 + 固定美分”的基础费率模型往往使得实际到账数额难以依靠心算立刻预估得出。
        </p>

        <h3 className="font-bold text-slate-800 text-lg mb-4">帮助独立站站长优化收款策略的核心亮点：</h3>
        <ul className="space-y-4 text-slate-600">
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">1. 双向逆推反向结账金额：</strong>
            <span>传统的计算只能告诉你“收100块只到账96块”，而本工具特有的反向算法能够直接精准告知您——如果我想实打实“拿到手100块正”，到底该在开票账单上填多少钱，让客户来承担这笔网关摩擦费。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">2. 基于通用标准的快速对账：</strong>
            <span>内置了标准美国区的常用扣费比例（即 2.9% 加上 30 美分固定处理费），无论是日常对账还是月度销售利润审计，直接输入仪表盘的总流水数字便能快速拆解出资金损耗占比。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">3. 高安全度的纯前端组件体验：</strong>
            <span>和所有金融属性的表单一样，避免留痕是对用户最大的保护。界面内的全部收支测算代码直接嵌入在网页之中，没有任何将您的营收额度外发到第三方服务器进行打点收集的恶意行为。</span>
          </li>
        </ul>
        
        <p className="text-slate-500 text-sm mt-8 pt-6 border-t border-slate-100">
          声明补充：此工具面板目前不考虑非本地卡国际多币种附加费（Cross-border fee）的部分。如果您的消费者使用非美卡的境外发卡行或者涉及到货币转换，Stripe 官方账单有一定几率收取部分额外税费，请以最终控制台报表为准。
        </p>
      </div>

    </div>
  );
}
