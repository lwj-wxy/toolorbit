import type { TechnicalOverview } from '../../../types/tool-overview';

type BilingualOverview = {
  zh: TechnicalOverview;
  en: TechnicalOverview;
};

export const ECOMMERCE_TOOL_OVERVIEWS: Record<string, BilingualOverview> = {
  'etsy-fee-calculator': {
    zh: {
      summary:
        'Etsy 利润计算器用于在浏览器中实时估算 Etsy 订单的真实利润，自动扣除平台费用和商品成本。适合 Etsy 卖家在定价前验证利润空间、为促销折扣测算可接受的最低售价、对比不同运费设定对利润的影响、在新品上架时评估多个成本方案的盈利能力，以及为批量订单快速生成费用明细。工具基于美国 Etsy 费用标准（固定上架费 $0.20、交易费 6.5%、支付处理费 3% + $0.25）计算三项平台扣费，并从总收入中扣除商品成本后得出净利润和利润率，所有计算在本地实时完成。',
      input:
        '三个金额输入：商品售价（买家支付的单品价格）、向买家收取的运费（可与商品价格合并计算总收入）、商品成本（包含采购价、材料、包装和人工等直接成本）。所有输入以美元为单位，支持小数输入。售价和运费自动合并为订单总收入（Total Revenue），商品成本在扣除所有平台费用后再从剩余金额中减去，以确保利润反映真实到手收入。',
      output:
        '以分组明细展示完整的费用结构：收入部分列出商品售价、运费和合并后的总收入；平台费用部分逐项显示上架费（固定 $0.20）、交易费（总收入的 6.5%）和支付处理费（总收入的 3% + $0.25），每项标为红色扣款；净利润和利润率在底部高亮展示，正值显示绿色、负值显示红色，便于一眼判断是否盈利。',
      processing:
        '所有计算在浏览器端同步执行，无需服务器请求。计算逻辑：总收入 = 商品售价 + 运费；上架费 = $0.20（固定值）；交易费 = 总收入 × 6.5%；支付处理费 = 总收入 × 3% + $0.25；总费用 = 上架费 + 交易费 + 支付处理费；净利润 = 总收入 - 总费用 - 商品成本；利润率 = (净利润 / 总收入) × 100%。注意：以上费率为美国 Etsy 常见标准，不同地区的 Etsy 平台可能有不同费率，计算结果仅供参考。',
      modes: ['商品售价输入', '运费收入输入', '商品成本输入', '三项费用拆分展示', '净利润 / 利润率计算', '正负利润颜色标识', '实时计算'],
      example: {
        title: 'Etsy 利润计算示例',
        input: '商品售价: 35.00\n向买家收取运费: 5.00\n商品成本: 12.00',
        output: '总收入: $40.00\n上架费: -$0.20\n交易费 (6.5%): -$2.60\n支付处理费 (3% + $0.25): -$1.45\n总费用: $4.25\n净利润: $23.75\n利润率: 59.38%',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The Etsy Fee Calculator estimates real net profit for Etsy orders in real time in the browser, automatically deducting platform fees and item costs. Ideal for Etsy sellers to verify profit margins before setting prices, test the lowest acceptable sale price during promotions, compare how different shipping charges affect profitability, evaluate multiple cost scenarios before listing new products, and quickly generate fee breakdowns for batch orders. The calculator computes three platform deductions using standard US Etsy fees (fixed $0.20 listing fee, 6.5% transaction fee, 3% + $0.25 payment processing fee), then subtracts item cost from the remaining revenue to yield net profit and profit margin. All calculations run locally in real time.',
      input:
        'Three monetary inputs: Sale Price (the per-item price paid by the buyer), Shipping Charge (charged to the buyer, combined with sale price for total revenue), and Item Cost (direct costs including procurement, materials, packaging, and labor). All inputs are in USD and support decimal values. Sale price and shipping are automatically combined into Total Revenue, while item cost is deducted after all platform fees are subtracted, ensuring profit reflects real take-home earnings.',
      output:
        'A complete fee structure displayed in grouped detail: the Revenue section lists sale price, shipping charge, and combined total revenue; the Platform Fees section itemizes the listing fee (fixed $0.20), transaction fee (6.5% of total revenue), and payment processing fee (3% + $0.25 of total revenue), each shown as a red deduction. Net profit and profit margin are highlighted at the bottom — positive values in green, negative in red — for an instant at-a-glance profitability assessment.',
      processing:
        'All calculations run synchronously in the browser with no server requests. Calculation logic: Total Revenue = Sale Price + Shipping Charge; Listing Fee = $0.20 (fixed); Transaction Fee = Total Revenue × 6.5%; Payment Processing Fee = Total Revenue × 3% + $0.25; Total Fees = Listing Fee + Transaction Fee + Payment Processing Fee; Net Profit = Total Revenue − Total Fees − Item Cost; Profit Margin = (Net Profit / Total Revenue) × 100%. Note: the fee rates above reflect standard US Etsy fees; Etsy platforms in different regions may use different rates. Results are for estimation purposes only.',
      modes: ['Sale price input', 'Shipping charge input', 'Item cost input', 'Three-fee breakdown display', 'Net profit / margin calculation', 'Color-coded profit sign', 'Real-time calculation'],
      example: {
        title: 'Etsy fee calculation example',
        input: 'Sale price: 35.00\nShipping charged to buyer: 5.00\nItem cost: 12.00',
        output: 'Total revenue: $40.00\nListing fee: -$0.20\nTransaction fee (6.5%): -$2.60\nPayment processing (3% + $0.25): -$1.45\nTotal fees: $4.25\nNet profit: $23.75\nProfit margin: 59.38%',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
  },

  'stripe-fee-calculator': {
    zh: {
      summary:
        'Stripe 手续费计算器用于在浏览器中实时估算 Stripe 在线支付的手续费和实际到账金额，同时支持反推计算——输入希望净收的目标金额，自动算出应向客户开票的总金额。适合 SaaS 服务商在报价时核算实际到手收入、独立开发者为订阅或一次性收款预估平台扣费、跨境卖家在定价时考虑支付手续费对利润的影响、自由职业者在开具发票时确认 Stripe 扣费后的最终到账，以及财务人员快速验证不同金额场景下的 Stripe 费用。工具内置正向计算（支付金额 → 到账金额）和反推计算（目标净收 → 开票金额）两种模式，基于美国 Stripe 标准费率 2.9% + $0.30，所有计算在浏览器本地实时完成。',
      input:
        '一个交易金额输入框。该金额有两个解读方向：作为客户实际支付金额（正向模式），用于计算 Stripe 扣费后的实际到账；或作为希望净收的目标金额（反推模式），用于计算需要额外覆盖的手续费和应向客户收取的发票总金额。金额以美元为单位，支持小数。输入后两种模式的结果同时展示。',
      output:
        '两组结果卡片同时展示：第一组（正向）显示当客户支付输入金额时，Stripe 手续费（2.9% + $0.30）的具体数值和预计到账金额，手续费标为红色、到账标为绿色；第二组（反推，青色主题）显示若希望净收该金额，需在基础金额上额外增加的手续费和建议开票总额。两组结果的费率和金额均基于同一费率标准，便于对比正反两个方向的费用影响。',
      processing:
        '所有计算在浏览器端同步完成。正向计算：平台手续费 = 金额 × 2.9% + $0.30；实际到账 = 金额 − 手续费。反推开票计算：开票金额 = (目标净额 + $0.30) / (1 − 2.9%)，其中 $0.30 为固定手续费、2.9% 为百分比费率；反推手续费 = 开票金额 − 目标净额。反推公式的原理是将手续费本身也纳入手续费计算基数，确保扣费后恰好等于目标净额。注意：以上为美国 Stripe 在线支付标准费率，国际卡支付和不同地区的 Stripe 账户可能使用不同费率。',
      modes: ['正向到账计算', '反推开票金额', '正向 / 反推双结果', '手续费拆分', '实时计算', '本地处理'],
      example: {
        title: 'Stripe 手续费计算示例',
        input: '交易金额: 100.00',
        output:
          '【正向】客户支付 $100.00 时：\n  手续费: $3.20（2.9% × $100 + $0.30）\n  预计到账: $96.80\n\n【反推】若希望净收 $100.00：\n  额外手续费: $3.30\n  建议开票金额: $103.30',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The Stripe Fee Calculator estimates Stripe online payment processing fees and actual payout amounts in real time in the browser, and also supports reverse calculation — enter a target net amount you want to receive, and it automatically computes the total invoice amount to charge the customer. Suitable for SaaS providers to project actual take-home revenue when quoting prices, indie developers to estimate platform deductions for subscriptions or one-time payments, cross-border sellers to account for payment processing fees when setting prices, freelancers to confirm final deposit amounts after Stripe deductions when issuing invoices, and finance staff to quickly verify Stripe fees across different amount scenarios. The tool provides both forward calculation (payment amount → payout) and reverse calculation (target net → invoice amount) modes, based on the standard US Stripe rate of 2.9% + $0.30. All computation runs locally in the browser in real time.',
      input:
        'A single transaction amount input field. This amount can be interpreted in two directions: as the amount the customer actually pays (forward mode), used to calculate the actual payout after Stripe deductions; or as the target net amount you want to receive (reverse mode), used to calculate the additional fees to cover and the total invoice amount to charge. The amount is in USD and supports decimal values. Results for both modes are displayed simultaneously upon input.',
      output:
        'Two result cards displayed side by side: the first (forward) shows the Stripe fee (2.9% + $0.30) and estimated payout when the customer pays the entered amount, with the fee in red and payout in green; the second (reverse, cyan-themed) shows the additional fee needed on top of the base amount and the recommended total invoice amount if you want to receive that amount net. Both cards use the same fee rate, enabling side-by-side comparison of fee impact in both directions.',
      processing:
        'All calculations run synchronously in the browser. Forward calculation: Platform Fee = Amount × 2.9% + $0.30; Payout = Amount − Fee. Reverse invoice calculation: Invoice Amount = (Target Net + $0.30) / (1 − 2.9%), where $0.30 is the fixed fee and 2.9% is the percentage fee; Reverse Fee = Invoice Amount − Target Net. The reverse formula accounts for the fee itself within the fee calculation base, ensuring the exact target net amount is received after deduction. Note: the above reflects standard US Stripe online payment rates; international card payments and Stripe accounts in different regions may use different rates.',
      modes: ['Forward payout calculation', 'Reverse invoice amount', 'Dual forward/reverse results', 'Fee breakdown', 'Real-time calculation', 'Local processing'],
      example: {
        title: 'Stripe fee calculation example',
        input: 'Transaction amount: 100.00',
        output:
          '[Forward] Customer pays $100.00:\n  Fee: $3.20 (2.9% × $100 + $0.30)\n  Estimated payout: $96.80\n\n[Reverse] To receive $100.00 net:\n  Additional fee: $3.30\n  Recommended invoice: $103.30',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
  },
};
