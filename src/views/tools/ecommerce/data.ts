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

  'etsy-offsite-ads-calculator': {
    zh: {
      summary:
        'Etsy 站外广告费计算器用于在浏览器中精确估算 Etsy Offsite Ads 归因订单的广告费用及其对利润的实际影响。适合年销售额超过 $10,000 后被强制纳入站外广告计划的卖家，在定价时预判 12% 或 15% 广告费率是否会吞噬利润；也适合参加促销活动时测算折扣价是否仍能覆盖广告费用、高客单价订单是否触发单笔 $100 广告费上限、以及将”广告归因订单”与自然流量订单分开独立核算。工具支持单独计算站外广告费，也可一键叠加 Etsy 基础费用（上架费、交易费、支付处理费），帮助卖家在定价和推广策略上做出有数据支撑的决策。',
      input:
        '四个输入项：订单总额（商品售价、运费、礼品包装等可计费金额的总和）、商品成本（包含采购、材料、包装和人工等直接成本）、站外广告费率（年销售额低于 $10,000 的店铺按 15% 扣除，达到门槛后按 12% 扣除），以及是否同时纳入 Etsy 基础费用的开关。基础费用包含三项：固定 $0.20 上架费、总收入的 6.5% 交易费、以及美国 Etsy Payments 的 3% + $0.25 支付处理费。所有金额以美元为单位，支持小数输入。',
      output:
        '分组展示完整的费用构成：站外广告费（按所选费率计算并自动应用 $100 单笔上限）、广告费在订单总额中的实际占比、基础 Etsy 费用明细、总费用汇总，以及扣除所有费用和成本后的预估利润与利润率。当订单金额较高触发 $100 上限时，实际广告费率将低于所选费率，工具会同时展示名义费率和有效费率，帮助卖家判断大额订单的真实广告成本。利润为正值时以绿色高亮、负值时以红色警示。',
      processing:
        '所有计算在浏览器本地同步完成，无需服务器请求，输入数据不会离开用户设备。计算公式：站外广告费 = min(订单总额 × 所选费率, $100)；基础费用 = $0.20 + 订单总额 × 6.5% + 订单总额 × 3% + $0.25；总费用 = 站外广告费 + 基础费用；预估利润 = 订单总额 − 总费用 − 成本；有效广告费率 = (站外广告费 / 订单总额) × 100%。费率基于 Etsy 官方 Offsite Ads 政策，$100 上限为单笔归因订单的广告费封顶值。计算结果用于运营预估和定价参考，不替代 Etsy 后台账单和财务报表。',
      modes: ['12% / 15% 站外广告费率', '$100 单笔广告费上限', '可选叠加 Etsy 基础费用', '有效费率 vs 名义费率', '利润正负颜色标识', '实时本地计算'],
      example: {
        title: 'Etsy 站外广告费示例',
        input: '订单总额: 80.00\n成本: 30.00\n广告费率: 15%\n纳入基础费用: 是',
        output: '站外广告费: $12.00\n基础费用: $8.05\n总费用: $20.05\n预估利润: $29.95',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The Etsy Offsite Ads Calculator precisely estimates the ad fee charged on an Etsy Offsite Ads attributed order and its actual profit impact, all computed in the browser. It is built for sellers who are opted into Offsite Ads — whether voluntarily or because their shop surpassed the $10,000 annual threshold — and need to evaluate whether the 12% or 15% ad fee erodes their margin, whether a discounted sale price still covers the ad cost, whether a high-value order hits the $100 per-order ad fee cap, and how to separately track ad-attributed orders versus organic sales. The tool can calculate the Offsite Ads fee in isolation or stack it on top of standard Etsy core fees (listing fee, transaction fee, payment processing fee) with a single toggle, giving sellers data-backed clarity for pricing and promotion decisions.',
      input:
        'Four inputs: total order amount (the chargeable total including item price, shipping, gift wrap, and personalization), item cost (direct costs such as procurement, materials, packaging, and labor), the Offsite Ads rate (15% for shops below the $10,000 annual threshold, 12% for shops at or above it), and a toggle to optionally include standard Etsy core fees. Core fees consist of the fixed $0.20 listing fee, the 6.5% transaction fee on total revenue, and the US Etsy Payments processing fee of 3% + $0.25. All amounts are in USD and support decimal values.',
      output:
        'A grouped breakdown of the full fee structure: the Offsite Ads fee (computed from the selected rate and automatically capped at $100 per order), the effective ad rate as a percentage of the order total, an itemized list of core Etsy fees, a total fees summary, and the estimated profit and profit margin after deducting all fees and costs. When a high-value order triggers the $100 cap, the effective ad rate drops below the nominal rate, and the tool surfaces both so sellers understand the true ad cost. Positive profit is highlighted in green, negative in red.',
      processing:
        'All calculations run synchronously in the browser with no server requests; input data never leaves the device. Formula: Offsite Ads fee = min(order total × selected rate, $100); core fees = $0.20 + order total × 6.5% + order total × 3% + $0.25; total fees = Offsite Ads fee + core fees; estimated profit = order total − total fees − cost; effective ad rate = (Offsite Ads fee / order total) × 100%. Rates follow Etsy official Offsite Ads policy; the $100 cap is the per-attributed-order maximum. Results are for estimation and pricing guidance and do not replace Etsy account statements.',
      modes: ['12% / 15% Offsite Ads rates', '$100 per-order ad fee cap', 'Optional core Etsy fee stacking', 'Effective vs nominal rate', 'Color-coded profit sign', 'Real-time local calculation'],
      example: {
        title: 'Etsy Offsite Ads example',
        input: 'Order total: 80.00\nCost: 30.00\nAd rate: 15%\nInclude core fees: yes',
        output: 'Offsite Ads fee: $12.00\nCore fees: $8.05\nTotal fees: $20.05\nEstimated profit: $29.95',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
  },

  'etsy-pricing-calculator': {
    zh: {
      summary:
        'Etsy 目标售价计算器用于在浏览器中从目标利润反推商品售价，解决”已知成本和期望利润，应该卖多少钱才不亏”的核心定价问题。适合新品上架时科学确定初始售价、制定包邮策略时评估”免运费”对售价的影响、参与平台促销时测算不亏损的最低折扣价、为可能触发的站外广告费预留缓冲空间，以及在有监管运营费或跨币种收款的市场中综合定价。工具将 Etsy 平台的全部费用体系——基础费用（上架费、交易费、支付处理费）、可选 Offsite Ads 广告费、监管运营费及货币转换费——统一纳入反推公式，一站式输出建议商品售价、所需订单总收入、各项费用明细、费用占比和最终净利润，帮助卖家告别凭感觉定价，实现数据驱动的精细化运营。',
      input:
        '六个输入项灵活组合：商品成本（包含采购价、原材料、包装和人工等直接成本）、实际运费成本（物流标签、包装材料等履约支出）、向买家收取的运费（支持包邮时设为 0，也可单独收取以补贴成本）、目标利润（期望在扣除所有费用和成本后实际到手的最低金额）、可选的站外广告费率（12% 或 15%，用于预留广告归因订单的费用缓冲），以及可选手动输入的监管运营费率和 2.5% 货币转换费开关。所有金额以美元估算，支持小数精度。',
      output:
        '综合输出达到目标利润所需的完整定价方案：建议商品售价（已扣除买家另付运费，可直接用于 Etsy 刊登价格字段）、所需订单总收入（商品售价 + 买家运费）、预计平台总费用（逐项列出基础 Etsy 费用与可选附加费用）、费用占订单收入的比例，以及反推验证后的最终到手利润。工具同时展示包邮和买家付运费两种策略下的售价差异，方便卖家对比选择最优定价路径。',
      processing:
        '所有计算在浏览器本地同步完成。反推公式将固定费用与百分比费用同时纳入：所需订单收入 = (商品成本 + 实际运费成本 + 目标利润 + 固定费用) / (1 − 百分比费用率之和)。其中固定费用 = $0.20 上架费 + $0.25 美国支付处理固定费；百分比费用之和 = 6.5% 交易费 + 3% 支付处理百分比费 + 可选站外广告费率 + 可选监管运营费率 + 可选 2.5% 货币转换费率。建议商品售价 = 所需订单收入 − 买家支付运费。该工具用于定价预估和利润规划，实际 Etsy 账单以平台后台为准，各国费率可能有所不同。',
      modes: ['目标利润反推售价', '包邮 / 运费另收双策略', '可选站外广告费预留', '监管运营费率手动输入', '货币转换费开关', '费用占比分析', '本地实时计算'],
      example: {
        title: 'Etsy 目标售价示例',
        input: '商品成本: 12.00\n实际运费成本: 5.00\n买家支付运费: 4.00\n目标利润: 15.00\n站外广告: 15%',
        output: '建议商品售价: $38.98\n订单总收入: $42.98\n预计费用: $10.98\n最终利润: $15.00',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The Etsy Pricing Calculator reverse-engineers the item price required to hit a target profit goal, all computed in the browser. It solves the fundamental pricing problem: “given my costs and desired profit, what price should I charge to avoid losing money?” Use cases include scientifically setting the initial price for a new listing, evaluating how a free-shipping strategy impacts the required item price, calculating the lowest acceptable sale price during a promotion, building in a buffer for potential Offsite Ads fees, and pricing comprehensively in markets where regulatory operating fees or cross-currency conversion apply. The tool combines Etsy\'s entire fee landscape — core fees (listing fee, transaction fee, payment processing fee), optional Offsite Ads, regulatory operating fees, and currency conversion — into a single reverse formula, outputting the recommended item price, required order revenue, line-item fee breakdown, fee ratio, and final net profit. It replaces gut-feel pricing with data-driven decisions.',
      input:
        'Six flexible inputs: item cost (direct costs including procurement, materials, packaging, and labor), actual shipping cost (logistics outlay such as labels and packing materials), shipping charged to the buyer (set to zero for a free-shipping model, or a separate line item to offset costs), target profit (the minimum net amount you want to take home after all fees and costs), an optional Offsite Ads rate (12% or 15%, to reserve a buffer for ad-attributed orders), plus an optional manually entered regulatory operating fee rate and a 2.5% currency conversion fee toggle. All amounts are estimated in USD with decimal precision.',
      output:
        'A comprehensive pricing plan that hits the target profit: recommended item price (net of buyer-paid shipping, ready to paste into the Etsy listing price field), required total order revenue (item price + buyer shipping), estimated total platform fees (itemized core Etsy fees and optional add-on fees), the fee-to-revenue ratio, and the reverse-checked final take-home profit. The tool simultaneously surfaces prices under both free-shipping and buyer-paid-shipping strategies so sellers can compare and choose the optimal pricing path.',
      processing:
        'All calculations run synchronously in the browser. The reverse formula incorporates both fixed and percentage fees: required order revenue = (item cost + actual shipping cost + target profit + fixed fees) / (1 − sum of percentage fee rates). Fixed fees = $0.20 listing fee + $0.25 US payment processing fixed fee. Sum of percentage fees = 6.5% transaction fee + 3% payment processing percentage fee + optional Offsite Ads rate + optional regulatory operating fee rate + optional 2.5% currency conversion rate. Recommended item price = required order revenue − shipping charged to buyer. This is a pricing estimator for planning purposes; Etsy account statements are the source of truth, and regional fee rates may vary.',
      modes: ['Target profit reverse pricing', 'Free-shipping & paid-shipping strategies', 'Optional Offsite Ads buffer', 'Manual regulatory fee input', 'Currency conversion toggle', 'Fee ratio analysis', 'Real-time local calculation'],
      example: {
        title: 'Etsy target price example',
        input: 'Item cost: 12.00\nActual shipping cost: 5.00\nShipping charged: 4.00\nTarget profit: 15.00\nOffsite Ads: 15%',
        output: 'Required item price: $38.98\nRequired order revenue: $42.98\nEstimated fees: $10.98\nFinal profit: $15.00',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
  },

  'etsy-regulatory-fee-calculator': {
    zh: {
      summary:
        'Etsy 监管与汇率费计算器用于在浏览器中估算两类容易被忽视但实际影响不小的 Etsy 附加费用：Regulatory Operating Fee（监管运营费）和 Currency Conversion Fee（货币转换费）。监管运营费是 Etsy 根据卖家所在地向部分国家/地区卖家征收的附加费用，目前适用于英国、法国、意大利、西班牙、土耳其、印度、越南、加拿大等市场，费率因国家而异（如英国 0.35%、法国 0.45%、土耳其 1.1%）。货币转换费则在店铺商品刊登币种与收款银行账户币种不一致时，按订单总额的 2.5% 自动扣除。工具适合在这些地区经营的卖家在上架新品时预估附加费用、对比不同币种结算方案的费用差异、在核账时独立验算 Etsy 账单中的监管费和转换费项目，以及综合评估各项隐性费用对整体利润率的影响。该工具聚焦于基础 Etsy 费用之外的"额外扣费层"，帮助卖家对每一笔费用的来源和去向心中有数。',
      input:
        '两个核心输入项：订单总额（按 Etsy 计费口径计算，包含商品售价、运费、礼品包装费和个性化定制费等可计费项目的总和）以及卖家所在地（从内置的国家/地区费率列表中选择，费率数据来自 Etsy 官方监管运营费公告）。另有一个货币转换费开关，当店铺刊登币种（如 USD）与收款账户币种（如 CAD、EUR、GBP）不一致时勾选启用 2.5% 费率。所有金额以美元为统一计算单位，支持小数输入。',
      output:
        '分组展示两类附加费用的完整明细：监管运营费部分显示所选国家/地区的适用费率百分比、对应监管费金额；货币转换费部分显示 2.5% 的转换费率及具体金额；汇总区域列出附加费用合计、附加费用占订单总额的百分比，以及扣除这两类费用后的预计剩余金额（即 Etsy 基础费用扣除前的中间金额）。整体采用清晰的层级结构，便于直接与 Etsy 后台账单交叉核对。',
      processing:
        '所有计算在浏览器本地同步完成。监管运营费 = 订单总额 × 所选国家/地区的官方费率；货币转换费 = 订单总额 × 2.5%（仅在勾选开关时计算）；附加费用合计 = 监管运营费 + 货币转换费；附加费用占比 = (附加费用合计 / 订单总额) × 100%；剩余金额 = 订单总额 − 附加费用合计。注意：Etsy 可能不定期调整各国监管运营费率或新增适用国家，本工具依据已知公开费率计算，结果用于运营预估和账单核对参考，不构成财务或税务建议。',
      modes: ['按国家/地区监管费率', '2.5% 货币转换费开关', '附加费用占比分析', '剩余金额估算', '多国费率内置', '本地实时计算'],
      example: {
        title: 'Etsy 监管与汇率费示例',
        input: '订单总额: 100.00\n卖家所在地: Canada\n包含货币转换费: 是',
        output: '监管运营费: $0.50\n货币转换费: $2.50\n附加费用合计: $3.00\n剩余金额: $97.00',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The Etsy Regulatory and Currency Fee Calculator estimates two easily overlooked but impactful Etsy add-on fees directly in the browser: the Regulatory Operating Fee and the Currency Conversion Fee. The Regulatory Operating Fee is an additional charge that Etsy applies to sellers in certain countries, currently including the UK, France, Italy, Spain, Türkiye, India, Vietnam, and Canada, with rates varying by country (e.g. 0.35% for the UK, 0.45% for France, 1.1% for Türkiye). The Currency Conversion Fee is automatically deducted at 2.5% of the order total when the listing currency differs from the seller\'s payout bank account currency. Use cases include projecting add-on fees before listing a new product, comparing the fee impact of different currency settlement options, independently verifying the regulatory and conversion line items on an Etsy statement during reconciliation, and holistically evaluating how these hidden fees affect overall profit margins. The tool focuses on the "extra fee layer" beyond standard Etsy transaction and payment processing charges, giving sellers a clear accounting of where every deduction originates.',
      input:
        'Two core inputs: total order amount (following Etsy\'s chargeable total calculation, including the sum of item price, shipping, gift wrap, and personalization fees where applicable) and seller location (selected from a built-in country/region rate list, with rates sourced from official Etsy Regulatory Operating Fee announcements). A currency conversion fee toggle enables the 2.5% rate for scenarios where the listing currency (e.g. USD) differs from the payout account currency (e.g. CAD, EUR, GBP). All amounts use USD as the unified calculation unit and support decimal input.',
      output:
        'A grouped breakdown of both add-on fee types: the Regulatory Operating Fee section shows the applicable country rate as a percentage and the corresponding fee amount; the Currency Conversion section displays the 2.5% rate and its calculated charge; the summary area aggregates total add-on fees, the add-on fee percentage relative to the order total, and the estimated remaining amount after these two fees are deducted (the intermediate amount before standard Etsy fees apply). The clean tiered layout is designed for easy cross-referencing with Etsy account statements.',
      processing:
        'All calculations run synchronously in the browser. Regulatory fee = order total × official rate for the selected country/region; currency conversion fee = order total × 2.5% (computed only when the toggle is enabled); combined add-on fees = regulatory fee + currency conversion fee; add-on fee ratio = (combined add-on fees / order total) × 100%; remaining amount = order total − combined add-on fees. Note: Etsy may periodically update country rates or add new applicable regions; this calculator uses publicly known rates and is intended for operational estimates and statement cross-checks, not financial or tax advice.',
      modes: ['Country/region-based regulatory rates', '2.5% currency conversion toggle', 'Add-on fee ratio analysis', 'Amount-after-fees estimate', 'Multi-country rate presets', 'Real-time local calculation'],
      example: {
        title: 'Etsy regulatory and currency fee example',
        input: 'Order total: 100.00\nSeller location: Canada\nInclude currency conversion: yes',
        output: 'Regulatory fee: $0.50\nCurrency conversion fee: $2.50\nCombined extra fees: $3.00\nAmount after extras: $97.00',
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
