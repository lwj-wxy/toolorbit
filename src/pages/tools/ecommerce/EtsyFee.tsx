import { useState } from 'react';
import { DollarSign, Percent, Copy, Check } from 'lucide-react';

export default function EtsyFeeCalculator() {
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
            Etsy 利润与手续费计算器
          </h2>
          <p className="mt-1 text-sm text-[#94a3b8]">
            输入您的商品售价、运费和制造成本，实时计算实际到账金额。
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#334155] mb-2">商品售价 (USD)</label>
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
            <label className="block text-sm font-medium text-[#334155] mb-2">向买家收取的运费 (USD)</label>
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
            <label className="block text-sm font-medium text-[#334155] mb-2">商品成本 + 实际运费 (USD)</label>
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
          <h3 className="text-[16px] font-bold text-[#1e293b] mb-4 border-b border-[#e2e8f0] pb-2">费用详情计算</h3>
          
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-[#64748b]">总收入 (售价 + 运费)</dt>
              <dd className="font-semibold text-[#1e293b]">${totalRevenue.toFixed(2)}</dd>
            </div>
            
            <div className="pt-2 border-t border-dashed border-[#cbd5e1]" />
            
            <div className="flex justify-between">
              <dt className="text-[#64748b]">Etsy 上架费</dt>
              <dd className="text-red-500">-${listingFee.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#64748b]">交易手续费 (6.5%)</dt>
              <dd className="text-red-500">-${transactionFee.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#64748b]">支付处理费 (3% + $0.25)</dt>
              <dd className="text-red-500">-${paymentProcFee.toFixed(2)}</dd>
            </div>
            
            <div className="pt-2 border-t border-dashed border-[#cbd5e1]" />
            
            <div className="flex justify-between items-center bg-white p-3 rounded border border-[#e2e8f0]">
              <dt className="font-bold text-[#1e293b]">净利润</dt>
              <dd className={`text-[20px] font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${profit.toFixed(2)}
              </dd>
            </div>
            
            <div className="flex justify-between items-center bg-white p-3 rounded border border-[#e2e8f0]">
              <dt className="font-bold text-[#1e293b]">利润率</dt>
              <dd className={`text-[16px] font-bold ${margin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {margin.toFixed(2)}%
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Bottom SEO Instructions Panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8 lg:p-12 mt-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">在线 Etsy 利润计算器，精准预估跨境电商真实收益</h2>
        
        <p className="text-slate-600 mb-6 leading-relaxed">
          作为一名在 Etsy 平台耕耘的跨境卖家，你是否常常对后台复杂的扣费账单感到头疼不已？Etsy 每次成单后都会扣除上架费、类目佣金甚至高昂的支付手续费。这款专为 Etsy 卖家打造的利润测算工具能够帮您理清复杂的账目明细，不再做“赔本赚吆喝”的亏本买卖。
        </p>

        <h3 className="font-bold text-slate-800 text-lg mb-4">掌握每一笔订单的隐形成本：</h3>
        <ul className="space-y-4 text-slate-600">
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">1. 即时核算综合抽佣：</strong>
            <span>只需输入您的商品标价、运费收入与产品出厂底价，系统便会自动依据平台标准（通常包含 $0.2 取消上架费、高额交易分成以及 3%+$0.25 的提现手续费规则）剥离出您的净利报表。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">2. 辅助产品定价策略修正：</strong>
            <span>常常不知道包邮策略究竟亏了多少钱？用此计算器可以进行虚拟沙盘推演，借此判断究竟是降低产品裸价拉高运费单收划算，还是标高单价执行全球免邮更能带来净收益的提升。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">3. 无痕测算不留底单：</strong>
            <span>我们深刻理解商业数据的机密性。您的任何进货底价与售价设定均在当前页面的浏览器沙箱内运算完毕即抛弃，服务器没有任何截桩或录入动作，防止商业底牌流失。</span>
          </li>
        </ul>
        
        <p className="text-slate-500 text-sm mt-8 pt-6 border-t border-slate-100">
          请注意：该面板计算结果基于北美地区标准卖家架构搭建。如果您开通了站外广告（Offsite Ads）功能，则可能需要在此基准上额外预留部分浮动预算进行规避。
        </p>
      </div>

    </div>
  );
}
