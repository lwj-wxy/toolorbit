import type { TechnicalOverview } from '../../../types/tool-overview';

type BilingualOverview = {
  zh: TechnicalOverview;
  en: TechnicalOverview;
};

export const ECOMMERCE_TOOL_OVERVIEWS: Record<string, BilingualOverview> = {
  'etsy-fee-calculator': {
    zh: {
      summary:
        'Etsy 手续费与利润计算器用于在浏览器中估算 Etsy 订单从买家付款到卖家净利润的完整路径。它不仅计算基础 Etsy 费用（$0.20 刊登费、6.5% 交易费、3% + $0.25 支付处理费），还把数量、买家支付运费、订单折扣、商品成本、实际运费成本、额外成本以及可选 Offsite Ads 费率纳入同一张利润表。适合 Etsy 卖家在上架新品前测算售价、验证包邮或折扣是否仍有利润、评估 12% / 15% 站外广告订单的最坏情况、比较不同成本结构下的盈亏平衡点，以及在采购材料或接受定制订单前快速判断是否值得成交。所有计算本地完成，不需要登录或上传财务数据。',
      input:
        '输入包括商品单价、数量、买家支付运费、订单折扣、商品单位成本、实际运费成本、额外成本以及 Offsite Ads 费率。商品单价与数量用于计算商品销售额，买家支付运费会并入 Etsy 计费口径的订单收入，折扣会从销售额中扣除。商品成本、实际运费成本和额外成本代表卖家真实支出，用于利润计算。Offsite Ads 支持 0%、12% 和 15% 场景，用于模拟自然订单、达到 $10,000 门槛后的广告归因订单，以及未达到门槛时的 15% 广告费。',
      output:
        '输出按收入、成本、平台费用和利润分组展示。收入部分显示商品销售额、折扣、买家支付运费和最终计费收入；成本部分汇总商品成本、运费成本与额外成本；费用部分逐项列出 Etsy 刊登费、交易费、支付处理费和可选 Offsite Ads 费用；底部展示净利润、利润率、费用率、ROI 和盈亏平衡价。正利润和负利润使用不同颜色提示，便于卖家快速识别是否需要调价。',
      processing:
        '所有计算在浏览器端同步执行。核心逻辑：商品销售额 = 商品单价 × 数量；折后商品收入 = max(商品销售额 - 折扣, 0)；订单总收入 = 折后商品收入 + 买家支付运费；直接成本 = 商品单位成本 × 数量 + 实际运费成本 + 额外成本；Etsy 基础费用 = $0.20 × 数量刊登费 + 订单总收入 × 6.5% 交易费 + 订单总收入 × 3% + $0.25 支付处理费；Offsite Ads 费用 = 订单总收入 × 所选广告费率；净利润 = 订单总收入 - 直接成本 - 基础费用 - Offsite Ads 费用；利润率 = 净利润 / 订单总收入 × 100%。费率按 Etsy 公开卖家费用说明复核，最近复核时间为 2026-06；实际账单仍以 Etsy 后台为准。',
      modes: ['商品单价与数量', '买家支付运费', '订单折扣', '商品 / 运费 / 额外成本', 'Etsy 基础费用拆分', 'Offsite Ads 0% / 12% / 15%', '净利润 / 利润率 / ROI', '盈亏平衡价', '本地实时计算'],
      example: {
        title: 'Etsy 利润计算示例',
        input: '商品单价: 35.00\n数量: 2\n买家支付运费: 5.00\n折扣: 10.00\n商品单位成本: 12.00\n实际运费成本: 6.00\n额外成本: 2.00\nOffsite Ads: 12%',
        output: '订单总收入: $65.00\n直接成本: $32.00\nEtsy 基础费用: $6.83\nOffsite Ads: $7.80\n净利润: $18.38\n利润率: 28.27%',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
      lastUpdated: '2026-06',
      sources: [
        { label: 'Etsy Fees and Payments Policy', url: 'https://www.etsy.com/legal/fees/' },
        { label: 'Etsy Offsite Ads Policy', url: 'https://www.etsy.com/legal/advertising/' },
      ],
    },
    en: {
      summary:
        'The Etsy Fee and Profit Calculator estimates the full path from buyer payment to seller net profit directly in the browser. It covers core Etsy fees ($0.20 listing fee, 6.5% transaction fee, 3% + $0.25 payment processing), then layers in quantity, buyer-paid shipping, order discounts, item cost, actual shipping cost, extra costs, and optional Offsite Ads rates in one profit model. It is built for Etsy sellers who need to price new listings, test whether free shipping or discounts still leave margin, model the worst case for 12% or 15% Offsite Ads attributed orders, compare cost scenarios, and decide whether a custom order is worth accepting. All calculations run locally without account login or financial data uploads.',
      input:
        'Inputs include item price, quantity, buyer-paid shipping, order discount, per-item cost, actual shipping cost, extra cost, and Offsite Ads rate. Item price and quantity produce gross item revenue; buyer-paid shipping is included in the Etsy chargeable order total; discount reduces the sale amount. Item cost, actual shipping cost, and extra cost represent the seller’s real expenses. Offsite Ads supports 0%, 12%, and 15% scenarios for organic orders, shops above the $10,000 threshold, and shops below the threshold.',
      output:
        'The output is grouped into revenue, costs, platform fees, and profit. Revenue shows item sales, discount, buyer-paid shipping, and final chargeable revenue. Costs summarize item cost, shipping cost, and extra cost. Fees itemize the Etsy listing fee, transaction fee, payment processing fee, and optional Offsite Ads fee. The summary highlights net profit, profit margin, fee rate, ROI, and break-even price, with color cues for profitable versus loss-making scenarios.',
      processing:
        'All calculations run synchronously in the browser. Core logic: gross item revenue = item price × quantity; discounted item revenue = max(gross item revenue - discount, 0); total order revenue = discounted item revenue + buyer-paid shipping; direct costs = per-item cost × quantity + actual shipping cost + extra cost; core Etsy fees = $0.20 × quantity listing fee + total order revenue × 6.5% transaction fee + total order revenue × 3% + $0.25 payment processing fee; Offsite Ads fee = total order revenue × selected ad rate; net profit = total order revenue - direct costs - core Etsy fees - Offsite Ads fee; profit margin = net profit / total order revenue × 100%. Rate assumptions were checked against Etsy public seller fee information in 2026-06; Etsy account statements remain the source of truth.',
      modes: ['Item price and quantity', 'Buyer-paid shipping', 'Order discount', 'Item / shipping / extra costs', 'Core Etsy fee breakdown', 'Offsite Ads 0% / 12% / 15%', 'Net profit / margin / ROI', 'Break-even price', 'Real-time local calculation'],
      example: {
        title: 'Etsy fee calculation example',
        input: 'Item price: 35.00\nQuantity: 2\nBuyer-paid shipping: 5.00\nDiscount: 10.00\nPer-item cost: 12.00\nActual shipping cost: 6.00\nExtra cost: 2.00\nOffsite Ads: 12%',
        output: 'Total order revenue: $65.00\nDirect costs: $32.00\nCore Etsy fees: $6.83\nOffsite Ads: $7.80\nNet profit: $18.38\nProfit margin: 28.27%',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
      lastUpdated: '2026-06',
      sources: [
        { label: 'Etsy Fees and Payments Policy', url: 'https://www.etsy.com/legal/fees/' },
        { label: 'Etsy Offsite Ads Policy', url: 'https://www.etsy.com/legal/advertising/' },
      ],
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
        '所有计算在浏览器本地同步完成，无需服务器请求，输入数据不会离开用户设备。计算公式：站外广告费 = min(订单总额 × 所选费率, $100)；基础费用 = $0.20 + 订单总额 × 6.5% + 订单总额 × 3% + $0.25；总费用 = 站外广告费 + 基础费用；预估利润 = 订单总额 − 总费用 − 成本；有效广告费率 = (站外广告费 / 订单总额) × 100%。费率基于 Etsy 官方 Offsite Ads 政策，$100 上限为单笔归因订单的广告费封顶值；最近复核时间为 2026-06。计算结果用于运营预估和定价参考，不替代 Etsy 后台账单和财务报表。',
      modes: ['12% / 15% 站外广告费率', '$100 单笔广告费上限', '可选叠加 Etsy 基础费用', '有效费率 vs 名义费率', '利润正负颜色标识', '实时本地计算'],
      example: {
        title: 'Etsy 站外广告费示例',
        input: '订单总额: 80.00\n成本: 30.00\n广告费率: 15%\n纳入基础费用: 是',
        output: '站外广告费: $12.00\n基础费用: $8.05\n总费用: $20.05\n预估利润: $29.95',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
      lastUpdated: '2026-06',
      sources: [
        { label: 'Etsy Fees and Payments Policy', url: 'https://www.etsy.com/legal/fees/' },
        { label: 'Etsy Offsite Ads Policy', url: 'https://www.etsy.com/legal/advertising/' },
      ],
    },
    en: {
      summary:
        'The Etsy Offsite Ads Calculator precisely estimates the ad fee charged on an Etsy Offsite Ads attributed order and its actual profit impact, all computed in the browser. It is built for sellers who are opted into Offsite Ads — whether voluntarily or because their shop surpassed the $10,000 annual threshold — and need to evaluate whether the 12% or 15% ad fee erodes their margin, whether a discounted sale price still covers the ad cost, whether a high-value order hits the $100 per-order ad fee cap, and how to separately track ad-attributed orders versus organic sales. The tool can calculate the Offsite Ads fee in isolation or stack it on top of standard Etsy core fees (listing fee, transaction fee, payment processing fee) with a single toggle, giving sellers data-backed clarity for pricing and promotion decisions.',
      input:
        'Four inputs: total order amount (the chargeable total including item price, shipping, gift wrap, and personalization), item cost (direct costs such as procurement, materials, packaging, and labor), the Offsite Ads rate (15% for shops below the $10,000 annual threshold, 12% for shops at or above it), and a toggle to optionally include standard Etsy core fees. Core fees consist of the fixed $0.20 listing fee, the 6.5% transaction fee on total revenue, and the US Etsy Payments processing fee of 3% + $0.25. All amounts are in USD and support decimal values.',
      output:
        'A grouped breakdown of the full fee structure: the Offsite Ads fee (computed from the selected rate and automatically capped at $100 per order), the effective ad rate as a percentage of the order total, an itemized list of core Etsy fees, a total fees summary, and the estimated profit and profit margin after deducting all fees and costs. When a high-value order triggers the $100 cap, the effective ad rate drops below the nominal rate, and the tool surfaces both so sellers understand the true ad cost. Positive profit is highlighted in green, negative in red.',
      processing:
        'All calculations run synchronously in the browser with no server requests; input data never leaves the device. Formula: Offsite Ads fee = min(order total × selected rate, $100); core fees = $0.20 + order total × 6.5% + order total × 3% + $0.25; total fees = Offsite Ads fee + core fees; estimated profit = order total − total fees − cost; effective ad rate = (Offsite Ads fee / order total) × 100%. Rates follow Etsy official Offsite Ads policy, and the $100 cap is the per-attributed-order maximum; assumptions were reviewed in 2026-06. Results are for estimation and pricing guidance and do not replace Etsy account statements.',
      modes: ['12% / 15% Offsite Ads rates', '$100 per-order ad fee cap', 'Optional core Etsy fee stacking', 'Effective vs nominal rate', 'Color-coded profit sign', 'Real-time local calculation'],
      example: {
        title: 'Etsy Offsite Ads example',
        input: 'Order total: 80.00\nCost: 30.00\nAd rate: 15%\nInclude core fees: yes',
        output: 'Offsite Ads fee: $12.00\nCore fees: $8.05\nTotal fees: $20.05\nEstimated profit: $29.95',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
      lastUpdated: '2026-06',
      sources: [
        { label: 'Etsy Fees and Payments Policy', url: 'https://www.etsy.com/legal/fees/' },
        { label: 'Etsy Offsite Ads Policy', url: 'https://www.etsy.com/legal/advertising/' },
      ],
    },
  },

  'etsy-pricing-calculator': {
    zh: {
      summary:
        'Etsy 目标售价计算器用于在浏览器中从目标利润反推商品售价，解决“已知成本和期望利润，应该卖多少钱才不亏”的定价问题。适合新品上架前确定初始售价、评估包邮对售价的影响、测算促销价是否还能保留利润、为可能触发的站外广告费预留缓冲，以及在有监管运营费或跨币种收款的市场中复核价格。工具将 Etsy 基础费用、可选 Offsite Ads、监管运营费和货币转换费纳入同一个反推公式，输出建议商品售价、所需订单总收入、费用明细、费用占比和最终净利润。',
      input:
        '六个输入项灵活组合：商品成本（包含采购价、原材料、包装和人工等直接成本）、实际运费成本（物流标签、包装材料等履约支出）、向买家收取的运费（支持包邮时设为 0，也可单独收取以补贴成本）、目标利润（期望在扣除所有费用和成本后实际到手的最低金额）、可选的站外广告费率（12% 或 15%，用于预留广告归因订单的费用缓冲），以及可选手动输入的监管运营费率和 2.5% 货币转换费开关。所有金额以美元估算，支持小数精度。',
      output:
        '综合输出达到目标利润所需的完整定价方案：建议商品售价（已扣除买家另付运费，可直接用于 Etsy 刊登价格字段）、所需订单总收入（商品售价 + 买家运费）、预计平台总费用（逐项列出基础 Etsy 费用与可选附加费用）、费用占订单收入的比例，以及反推验证后的最终到手利润。卖家可以通过调整“向买家收取的运费”输入值来分别模拟包邮、部分收取运费或买家全额承担运费等定价方案。',
      processing:
        '所有计算在浏览器本地同步完成。反推公式将固定费用与百分比费用同时纳入：所需订单收入 = (商品成本 + 实际运费成本 + 目标利润 + 固定费用) / (1 − 百分比费用率之和)。其中固定费用 = $0.20 上架费 + $0.25 美国支付处理固定费；百分比费用之和 = 6.5% 交易费 + 3% 支付处理百分比费 + 可选站外广告费率 + 可选监管运营费率 + 可选 2.5% 货币转换费率。建议商品售价 = 所需订单收入 − 买家支付运费。费率假设最近复核时间为 2026-06；实际 Etsy 账单和各国本地费率仍以平台后台为准。',
      modes: ['目标利润反推售价', '买家运费输入建模', '可选站外广告费预留', '监管运营费率手动输入', '货币转换费开关', '费用占比分析', '本地实时计算'],
      example: {
        title: 'Etsy 目标售价示例',
        input: '商品成本: 12.00\n实际运费成本: 5.00\n买家支付运费: 4.00\n目标利润: 15.00\n站外广告: 15%',
        output: '建议商品售价: $38.98\n订单总收入: $42.98\n预计费用: $10.98\n最终利润: $15.00',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
      lastUpdated: '2026-06',
      sources: [
        { label: 'Etsy Fees and Payments Policy', url: 'https://www.etsy.com/legal/fees/' },
        { label: 'Etsy Offsite Ads Policy', url: 'https://www.etsy.com/legal/advertising/' },
      ],
    },
    en: {
      summary:
        'The Etsy Pricing Calculator reverse-engineers the item price required to hit a target profit goal, all computed in the browser. It answers a common seller question: given my costs and desired profit, what price should I charge to avoid losing money? Use it before publishing a new listing, testing free shipping, checking the lowest acceptable sale price, reserving margin for possible Offsite Ads, or pricing in markets with regulatory fees or currency conversion. The tool combines Etsy core fees, optional Offsite Ads, regulatory operating fees, and currency conversion into one reverse formula, then returns the recommended item price, required order revenue, fee breakdown, fee ratio, and final net profit.',
      input:
        'Six flexible inputs: item cost (direct costs including procurement, materials, packaging, and labor), actual shipping cost (logistics outlay such as labels and packing materials), shipping charged to the buyer (set to zero for a free-shipping model, or a separate line item to offset costs), target profit (the minimum net amount you want to take home after all fees and costs), an optional Offsite Ads rate (12% or 15%, to reserve a buffer for ad-attributed orders), plus an optional manually entered regulatory operating fee rate and a 2.5% currency conversion fee toggle. All amounts are estimated in USD with decimal precision.',
      output:
        'A comprehensive pricing plan that hits the target profit: recommended item price (net of buyer-paid shipping, ready to paste into the Etsy listing price field), required total order revenue (item price + buyer shipping), estimated total platform fees (itemized core Etsy fees and optional add-on fees), the fee-to-revenue ratio, and the reverse-checked final take-home profit. Sellers can model free shipping, partial shipping recovery, or buyer-paid shipping by changing the shipping charged input.',
      processing:
        'All calculations run synchronously in the browser. The reverse formula incorporates both fixed and percentage fees: required order revenue = (item cost + actual shipping cost + target profit + fixed fees) / (1 − sum of percentage fee rates). Fixed fees = $0.20 listing fee + $0.25 US payment processing fixed fee. Sum of percentage fees = 6.5% transaction fee + 3% payment processing percentage fee + optional Offsite Ads rate + optional regulatory operating fee rate + optional 2.5% currency conversion rate. Recommended item price = required order revenue − shipping charged to buyer. Rate assumptions were reviewed in 2026-06; Etsy account statements and local regional rates remain the source of truth.',
      modes: ['Target profit reverse pricing', 'Buyer shipping input modeling', 'Optional Offsite Ads buffer', 'Manual regulatory fee input', 'Currency conversion toggle', 'Fee ratio analysis', 'Real-time local calculation'],
      example: {
        title: 'Etsy target price example',
        input: 'Item cost: 12.00\nActual shipping cost: 5.00\nShipping charged: 4.00\nTarget profit: 15.00\nOffsite Ads: 15%',
        output: 'Required item price: $38.98\nRequired order revenue: $42.98\nEstimated fees: $10.98\nFinal profit: $15.00',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
      lastUpdated: '2026-06',
      sources: [
        { label: 'Etsy Fees and Payments Policy', url: 'https://www.etsy.com/legal/fees/' },
        { label: 'Etsy Offsite Ads Policy', url: 'https://www.etsy.com/legal/advertising/' },
      ],
    },
  },

  'etsy-regulatory-fee-calculator': {
    zh: {
      summary:
        'Etsy 监管与汇率费计算器用于在浏览器中估算两类容易被忽视但实际影响不小的 Etsy 附加费用：Regulatory Operating Fee（监管运营费）和 Currency Conversion Fee（货币转换费）。监管运营费是 Etsy 根据卖家所在地向部分国家/地区卖家征收的附加费用，页面内置英国、法国、意大利、西班牙、土耳其、印度、越南、加拿大等市场费率，例如英国 0.32%、法国 0.47%、土耳其 2.27%、加拿大 0.50%。货币转换费则在店铺商品刊登币种与收款银行账户币种不一致时，按订单总额的 2.5% 自动扣除。工具适合在这些地区经营的卖家在上架新品时预估附加费用、对比不同币种结算方案的费用差异、在核账时独立验算 Etsy 账单中的监管费和转换费项目，以及综合评估各项隐性费用对整体利润率的影响。该工具聚焦于基础 Etsy 费用之外的"额外扣费层"，帮助卖家对每一笔费用的来源和去向心中有数。',
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
        'The Etsy Regulatory and Currency Fee Calculator estimates two Etsy add-on fees directly in the browser: the Regulatory Operating Fee and the Currency Conversion Fee. It includes a maintained country-rate table for the UK, France, Italy, Spain, Türkiye, India, Vietnam, and Canada, then shows the selected rate and amount instead of hiding the assumption inside one total. The Currency Conversion Fee is estimated at 2.5% of the order total when the listing currency differs from the payout account currency. Review the linked Etsy policy and compare the result with the Etsy payment account before using the number for pricing or reconciliation.',
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
        '所有计算在浏览器端同步完成。正向计算：平台手续费 = 金额 × 2.9% + $0.30；实际到账 = 金额 − 手续费。反推开票计算：开票金额 = (目标净额 + $0.30) / (1 − 2.9%)，其中 $0.30 为固定手续费、2.9% 为百分比费率；反推手续费 = 开票金额 − 目标净额。费率按美国 Stripe 在线卡支付公开标准复核，最近复核时间为 2026-06；国际卡、不同国家账户、订阅产品、税费和合同价可能改变实际扣费。',
      modes: ['正向到账计算', '反推开票金额', '正向 / 反推双结果', '手续费拆分', '实时计算', '本地处理'],
      example: {
        title: 'Stripe 手续费计算示例',
        input: '交易金额: 100.00',
        output:
          '【正向】客户支付 $100.00 时：\n  手续费: $3.20（2.9% × $100 + $0.30）\n  预计到账: $96.80\n\n【反推】若希望净收 $100.00：\n  额外手续费: $3.30\n  建议开票金额: $103.30',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
      lastUpdated: '2026-06',
      sources: [
        { label: 'Etsy Fees and Payments Policy', url: 'https://www.etsy.com/legal/fees/' },
      ],
    },
    en: {
      summary:
        'The Stripe Fee Calculator estimates Stripe online payment processing fees and actual payout amounts in real time in the browser, and also supports reverse calculation — enter a target net amount you want to receive, and it automatically computes the total invoice amount to charge the customer. Suitable for SaaS providers to project actual take-home revenue when quoting prices, indie developers to estimate platform deductions for subscriptions or one-time payments, cross-border sellers to account for payment processing fees when setting prices, freelancers to confirm final deposit amounts after Stripe deductions when issuing invoices, and finance staff to quickly verify Stripe fees across different amount scenarios. The tool provides both forward calculation (payment amount → payout) and reverse calculation (target net → invoice amount) modes, based on the standard US Stripe rate of 2.9% + $0.30. All computation runs locally in the browser in real time.',
      input:
        'A single transaction amount input field. This amount can be interpreted in two directions: as the amount the customer actually pays (forward mode), used to calculate the actual payout after Stripe deductions; or as the target net amount you want to receive (reverse mode), used to calculate the additional fees to cover and the total invoice amount to charge. The amount is in USD and supports decimal values. Results for both modes are displayed simultaneously upon input.',
      output:
        'Two result cards displayed side by side: the first (forward) shows the Stripe fee (2.9% + $0.30) and estimated payout when the customer pays the entered amount, with the fee in red and payout in green; the second (reverse, cyan-themed) shows the additional fee needed on top of the base amount and the recommended total invoice amount if you want to receive that amount net. Both cards use the same fee rate, enabling side-by-side comparison of fee impact in both directions.',
      processing:
        'All calculations run synchronously in the browser. Forward calculation: platform fee = amount × 2.9% + $0.30; payout = amount − fee. Reverse invoice calculation: invoice amount = (target net + $0.30) / (1 − 2.9%), where $0.30 is the fixed fee and 2.9% is the percentage fee; reverse fee = invoice amount − target net. Rate assumptions were checked against standard US Stripe online card pricing in 2026-06; international cards, non-US accounts, subscriptions, taxes, and negotiated pricing can change the actual fee.',
      modes: ['Forward payout calculation', 'Reverse invoice amount', 'Dual forward/reverse results', 'Fee breakdown', 'Real-time calculation', 'Local processing'],
      example: {
        title: 'Stripe fee calculation example',
        input: 'Transaction amount: 100.00',
        output:
          '[Forward] Customer pays $100.00:\n  Fee: $3.20 (2.9% × $100 + $0.30)\n  Estimated payout: $96.80\n\n[Reverse] To receive $100.00 net:\n  Additional fee: $3.30\n  Recommended invoice: $103.30',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
      lastUpdated: '2026-06',
      sources: [
        { label: 'Etsy Fees and Payments Policy', url: 'https://www.etsy.com/legal/fees/' },
      ],
    },
  },

  'paypal-fee-calculator': {
    zh: {
      summary:
        'PayPal 手续费计算器用于在浏览器中估算美国 PayPal 商家收款的手续费、净到账金额和反推开票金额。它覆盖 PayPal Checkout、标准信用卡/借记卡收款、Goods & Services 以及 PayPal Pay Later 等常见档位，并支持 USD、EUR、GBP、CAD、AUD 的固定费用预设和国际交易附加费开关。适合自由职业者、电商卖家、SaaS 小团队和跨境服务商在报价、开票和利润核算前快速判断 PayPal 扣费影响。',
      input:
        '输入交易金额，选择 PayPal 收款类型、收款币种，并按需勾选国际商业交易附加费。金额支持小数；币种选择会影响固定手续费，例如 USD 使用 $0.49，EUR/GBP 使用 0.39，CAD/AUD 使用 0.59。收款类型决定百分比费率和是否包含固定费。',
      output:
        '输出包含当前适用费率、预计 PayPal 手续费、有效费率、净到账金额，以及为了净收目标金额需要向客户开票的总金额。正向结果用于判断客户支付某个金额后实际能收到多少；反推结果用于报价时把手续费计入客户付款金额。',
      processing:
        '所有计算在浏览器本地同步完成。正向公式：手续费 = 交易金额 × 百分比费率 + 固定费；净到账 = 交易金额 − 手续费。国际交易开关会在基础百分比费率上叠加 1.5%。反推公式：开票金额 = (目标净收 + 固定费) / (1 − 百分比费率)。美国商家费率预设最近复核时间为 2026-06；PayPal 账户地区、产品、风控、货币转换和合同价可能改变实际费率。',
      modes: ['PayPal Checkout', '信用卡收款', 'Goods & Services', 'Pay Later', '多币种固定费', '国际交易附加费', '反推开票金额'],
      example: {
        title: 'PayPal 手续费计算示例',
        input: '交易金额: 100.00 USD\n收款类型: PayPal Checkout\n国际交易: 否',
        output: 'PayPal 手续费: $3.98 USD\n预计净到账: $96.02 USD\n净收 $100.00 USD 需开票: $104.12 USD',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
      lastUpdated: '2026-06',
    },
    en: {
      summary:
        'The PayPal Fee Calculator estimates US PayPal merchant fees, net payout, and reverse invoice amounts directly in the browser. It covers common PayPal payment types including PayPal Checkout, standard credit/debit card payments, Goods & Services, and PayPal Pay Later, with fixed-fee presets for USD, EUR, GBP, CAD, and AUD plus an international commercial transaction toggle. It is useful for freelancers, ecommerce sellers, SaaS teams, and cross-border service providers who need to price invoices and understand PayPal deductions before accepting a payment.',
      input:
        'Enter a transaction amount, choose the PayPal payment type, select the receiving currency, and optionally add the international commercial transaction surcharge. Decimal values are supported. Currency selection controls the fixed fee, such as $0.49 for USD, 0.39 for EUR/GBP, and 0.59 for CAD/AUD. The payment type controls the percentage rate and whether a fixed fee applies.',
      output:
        'The tool returns the applied rate, estimated PayPal fee, effective fee rate, net payout, and the invoice amount needed to receive a target net amount. The forward result shows what you keep when the customer pays a given amount; the reverse result helps you quote a gross amount that covers the processing fee.',
      processing:
        'All calculations run synchronously in the browser. Forward formula: fee = transaction amount × percentage rate + fixed fee; net payout = transaction amount − fee. The international toggle adds 1.5 percentage points to the base percentage rate. Reverse formula: invoice amount = (target net + fixed fee) / (1 − percentage rate). US merchant presets were reviewed in 2026-06; account country, product setup, risk rules, currency conversion, and custom pricing can change the actual PayPal fee.',
      modes: ['PayPal Checkout', 'Credit and debit cards', 'Goods & Services', 'Pay Later', 'Multi-currency fixed fees', 'International surcharge', 'Reverse invoice amount'],
      example: {
        title: 'PayPal fee calculation example',
        input: 'Transaction amount: 100.00 USD\nPayment type: PayPal Checkout\nInternational transaction: no',
        output: 'PayPal fee: $3.98 USD\nEstimated payout: $96.02 USD\nInvoice to receive $100.00 USD: $104.12 USD',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
      lastUpdated: '2026-06',
    },
  },

  'stripe-vs-paypal-fee-calculator': {
    zh: {
      summary:
        'Stripe vs PayPal 手续费对比工具用于在同一交易金额下并排比较 Stripe 和 PayPal 的手续费、有效费率、净到账金额和差额。它面向正在选择收款方式的独立开发者、SaaS 团队、跨境卖家、自由职业者和小型电商团队，帮助他们快速判断某个订单金额下哪种支付渠道费用更低。工具默认使用 Stripe 美国标准在线卡费率 2.9% + $0.30，并允许切换 PayPal 常见商家费率档位。',
      input:
        '输入美元交易金额，选择 PayPal 对比档位，并按需勾选 PayPal 国际商业交易附加费。Stripe 侧固定使用美国标准在线卡费率；PayPal 侧可在 PayPal Checkout、标准信用卡/借记卡、Goods & Services 和 PayPal Pay Later 之间切换。',
      output:
        '输出两张并排结果卡：Stripe 和 PayPal 各自显示适用费率、预计手续费、有效费率和净到账金额。摘要区会标记手续费更低的平台，并展示手续费差额和净到账差额，方便直接判断迁移支付方式、选择发票支付方式或调整报价时的影响。',
      processing:
        '所有计算在浏览器本地完成。Stripe 手续费 = 金额 × 2.9% + $0.30；PayPal 手续费 = 金额 × 所选 PayPal 百分比费率 + 对应固定费；国际 PayPal 开关会额外叠加 1.5%。净到账 = 金额 − 手续费。该工具不建模退款、争议、货币转换、订阅产品附加费、税费或定制合同价。',
      modes: ['Stripe vs PayPal 对比', 'PayPal 费率档位切换', '国际交易开关', '净到账差额', '有效费率', '本地实时计算'],
      example: {
        title: '支付渠道对比示例',
        input: '交易金额: 100.00 USD\nPayPal 档位: PayPal Checkout',
        output: 'Stripe 手续费: $3.20 USD，净到账 $96.80 USD\nPayPal 手续费: $3.98 USD，净到账 $96.02 USD\n较低费用: Stripe，差额 $0.78 USD',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The Stripe vs PayPal Fee Calculator compares Stripe and PayPal fees side by side for the same transaction amount, showing processing fees, effective rates, net payouts, and the difference between the two processors. It is designed for indie developers, SaaS teams, cross-border sellers, freelancers, and small ecommerce operators who need to choose a payment method before sending an invoice or configuring checkout. Stripe uses the standard US online card rate of 2.9% + $0.30, while PayPal can be switched between common US merchant fee profiles.',
      input:
        'Enter a USD transaction amount, choose the PayPal comparison profile, and optionally enable the PayPal international commercial transaction surcharge. The Stripe side uses the standard US online card preset. The PayPal side can compare PayPal Checkout, standard credit/debit card payments, Goods & Services, or PayPal Pay Later.',
      output:
        'Two comparison cards show each processor’s applied rate, estimated fee, effective rate, and net payout. A summary panel highlights which processor has the lower fee and shows the fee difference and payout difference, making it easier to decide whether to use Stripe, PayPal, or adjust the customer-facing price.',
      processing:
        'All calculations run locally in the browser. Stripe fee = amount × 2.9% + $0.30. PayPal fee = amount × selected PayPal percentage rate + selected fixed fee. The PayPal international toggle adds 1.5 percentage points. Net payout = amount − fee. The calculator does not model refunds, disputes, currency conversion, subscription add-ons, taxes, or custom negotiated pricing.',
      modes: ['Stripe vs PayPal comparison', 'PayPal fee profile switching', 'International transaction toggle', 'Net payout difference', 'Effective fee rate', 'Real-time local calculation'],
      example: {
        title: 'Processor comparison example',
        input: 'Transaction amount: 100.00 USD\nPayPal profile: PayPal Checkout',
        output: 'Stripe fee: $3.20 USD, payout $96.80 USD\nPayPal fee: $3.98 USD, payout $96.02 USD\nLower fee: Stripe, difference $0.78 USD',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
  },
  'etsy-tag-generator': {
    zh: {
      summary:
        'Etsy 13 标签字符校验优化器用于将商品标题、核心词或描述自动切分为符合 Etsy 限制的 13 个关键词 Tag。它不仅实时校验每个 Tag 不超过 20 个字符，还会自动去除跨 Tag 的重复词汇，方便卖家一键复制格式化标签并粘贴到 Etsy 上架后台。',
      input: '输入包含商品标题、核心关键词短语或卖点描述，支持添加手写自定义 Tag。',
      output: '输出 13 个符合 20 字符限制的规范 Etsy 标签卡片、实时字符计数器，以及一键复制文本。',
      processing: '浏览器端本地解析，提取相邻词组组合，过滤 >20 字符无效词，自动去重并填补常用标签。',
      modes: ['标题自动切词', '20字符实时校验', '去重过滤', '自定义Tag追加', '一键复制格式化文本'],
      example: {
        title: 'Etsy 标签生成示例',
        input: 'Personalized leather tote bag with laptop sleeve and custom initials',
        output: 'leather tote bag, personalized tote, custom work bag, laptop compartment...',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The Etsy Tag & Keyword Optimizer parses your product title or seed keywords into 13 validated listing tags. It enforces Etsy’s strict 20-character tag limit, removes redundant cross-tag duplicate words, and formats tags for instant copy-pasting into Etsy’s seller portal.',
      input: 'Enter a product title, seed keyword phrase, or selling points.',
      output: '13 validated Etsy tag pills with real-time character counters and a comma-separated copy button.',
      processing: 'Local browser parsing: extracts adjacent phrase pairs, filters terms over 20 characters, removes duplicates, and outputs formatted tag strings.',
      modes: ['Title parsing', '20-character limit validation', 'Duplicate removal', 'Manual tag add/remove', 'One-click copy'],
      example: {
        title: 'Etsy tag generator example',
        input: 'Personalized leather tote bag with laptop sleeve and custom initials',
        output: 'leather tote bag, personalized tote, custom work bag, laptop compartment...',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
  },
  'etsy-free-shipping-calculator': {
    zh: {
      summary:
        'Etsy 满 $35 包邮售价换算器用于帮助卖家计算在提供美国满 $35 包邮 (Free Shipping Guarantee) 的同时，如何将预计运费和包装成本按比例打包进 Listing 售价中，力保目标利润率不受侵蚀。',
      input: '输入原商品售价、预估国内运费标签成本、包装费成本、商品生产成本和卖家所在的支付结算区域。',
      output: '输出建议的包邮 Listing 挂牌售价、对比单独收取运费模式下的净利润和费用率。',
      processing: '基于卖家地区（US/UK/CA/EU）算齐 Etsy 6.5% 交易费与 Payments 支付处理费，反向求解保持净到账不变的最佳包邮打包售价。',
      modes: ['卖家结算区域选择', '原售价与运费输入', '建议包邮售价计算', '两种模式对比', '一键复制简报'],
      example: {
        title: '包邮换算示例',
        input: '原售价: $25.00, 预估运费: $5.00, 生产成本: $8.00',
        output: '建议包邮售价: $32.99, 预估净利润: $16.20',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
    en: {
      summary:
        'The Etsy Free Shipping Guarantee Pricing Calculator helps sellers determine the optimal bundled item listing price when offering free shipping on US orders over $35. It ensures shipping label and packaging expenses are properly absorbed into the retail price without reducing net shop profit.',
      input: 'Enter original item price, estimated domestic shipping label cost, packaging cost, COGS, and payment account region.',
      output: 'Recommended bundled listing price with free shipping badge, net profit breakdown, and profit comparison against separated shipping.',
      processing: 'Computes Etsy 6.5% transaction fees and regional payment processing rates, reverse-solving the bundled listing price that maintains target net profit.',
      modes: ['Seller region selection', 'Shipping cost input', 'Recommended bundled price', 'Model comparison', 'Copy summary report'],
      example: {
        title: 'Free shipping bundle example',
        input: 'Original price: $25.00, Est. shipping: $5.00, COGS: $8.00',
        output: 'Recommended bundled price: $32.99, Net profit: $16.20',
        inputLanguage: 'text',
        outputLanguage: 'text',
      },
    },
  },
};
