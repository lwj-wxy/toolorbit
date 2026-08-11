export type Category = 'AI 工具' | '电商工具';

export interface ToolMeta {
  id: string;
  name: string;
  description: string;
  category: Category;
  path: string;
  color?: string;
  isPopular?: boolean;
  isNoIndex?: boolean;
}

export const PUBLIC_TOOL_IDS = new Set([
  'etsy-fee-calculator',
  'etsy-offsite-ads-calculator',
  'etsy-pricing-calculator',
  'etsy-regulatory-fee-calculator',
  'etsy-tag-generator',
  'etsy-free-shipping-calculator',
  'stripe-fee-calculator',
  'paypal-fee-calculator',
  'stripe-vs-paypal-fee-calculator',
  'listing-generator',
  'keyword-analyzer',
  'ai-hs-code-assistant',
  'ai-product-asset-checker',
  'ai-product-image-generator',
]);

function normalizeToolMeta(tool: ToolMeta): ToolMeta {
  return {
    ...tool,
    isNoIndex: tool.isNoIndex ?? !PUBLIC_TOOL_IDS.has(tool.id),
  };
}

const RAW_TOOLS_META: ToolMeta[] = [
  {
    id: 'etsy-fee-calculator',
    name: 'Etsy 利润计算器',
    description: '计算 Etsy 上架费、交易费和支付处理费，查看订单利润。',
    category: '电商工具',
    path: '/tools/ecommerce/etsy-fee-calculator',
    color: 'emerald',
    isPopular: true,
  },
  {
    id: 'etsy-offsite-ads-calculator',
    name: 'Etsy 站外广告费计算器',
    description: '估算 Etsy Offsite Ads 12% 或 15% 广告归因订单费用，并同步查看利润影响。',
    category: '电商工具',
    path: '/tools/ecommerce/etsy-offsite-ads-calculator',
    color: 'emerald',
    isPopular: true,
  },
  {
    id: 'etsy-pricing-calculator',
    name: 'Etsy 目标售价计算器',
    description: '按成本、运费、目标利润和 Etsy 费用反推出建议商品售价，辅助新品定价。',
    category: '电商工具',
    path: '/tools/ecommerce/etsy-pricing-calculator',
    color: 'emerald',
    isPopular: true,
  },
  {
    id: 'etsy-regulatory-fee-calculator',
    name: 'Etsy 监管与汇率费计算器',
    description: '按卖家所在地估算 Etsy Regulatory Operating Fee 和 2.5% 货币转换费。',
    category: '电商工具',
    path: '/tools/ecommerce/etsy-regulatory-fee-calculator',
    color: 'emerald',
    isPopular: true,
  },
  {
    id: 'etsy-tag-generator',
    name: 'Etsy 13 标签字符校验优化器',
    description: '自动生成并校验 13 个不超过 20 字符的 Etsy 上架 Tag，去重并格式化输出。',
    category: '电商工具',
    path: '/tools/ecommerce/etsy-tag-generator',
    color: 'amber',
    isPopular: true,
  },
  {
    id: 'etsy-free-shipping-calculator',
    name: 'Etsy 满 $35 包邮售价换算器',
    description: '计算力保目标利润率下包裹包邮的建议 Listing 售价，轻松达标 $35 包邮。',
    category: '电商工具',
    path: '/tools/ecommerce/etsy-free-shipping-calculator',
    color: 'amber',
    isPopular: true,
  },
  {
    id: 'stripe-fee-calculator',
    name: 'Stripe 手续费计算器',
    description: '计算 Stripe 收款手续费、净到账金额和反推开票金额。',
    category: '电商工具',
    path: '/tools/ecommerce/stripe-fee-calculator',
    color: 'emerald',
  },
  {
    id: 'paypal-fee-calculator',
    name: 'PayPal 手续费计算器',
    description: '按 PayPal Checkout、信用卡收款和 Goods & Services 档位估算手续费、净到账和反推开票金额。',
    category: '电商工具',
    path: '/tools/ecommerce/paypal-fee-calculator',
    color: 'emerald',
  },
  {
    id: 'stripe-vs-paypal-fee-calculator',
    name: 'Stripe vs PayPal 手续费对比',
    description: '同屏比较 Stripe 和 PayPal 在同一交易金额下的手续费、净到账和差额，辅助选择收款方式。',
    category: '电商工具',
    path: '/tools/ecommerce/stripe-vs-paypal-fee-calculator',
    color: 'emerald',
  },
  {
    id: 'listing-generator',
    name: 'AI Listing Generator',
    description: 'Draft Etsy, Amazon, and Shopify product listing titles, descriptions, tags, and social copy.',
    category: 'AI 工具',
    path: '/tools/ai/listing-generator',
    color: 'emerald',
    isPopular: true,
  },
  {
    id: 'keyword-analyzer',
    name: 'Ecommerce Keyword Analyzer',
    description: 'Turn a product seed keyword into long-tail groups, search intent notes, and listing copy angles.',
    category: 'AI 工具',
    path: '/tools/ai/keyword-analyzer',
    color: 'emerald',
    isPopular: true,
  },
  {
    id: 'ai-hs-code-assistant',
    name: 'AI HS 编码与报关品名助手',
    description: '根据商品名称、材质、用途和目标市场生成英文报关品名、HS 候选方向和复核问题。',
    category: 'AI 工具',
    path: '/tools/ai/hs-code-assistant',
    color: 'amber',
    isPopular: true,
  },
  {
    id: 'ai-product-asset-checker',
    name: 'AI 商品素材合规质检器',
    description: '上传商品主图、包装图或标签图，检查尺寸、文字覆盖、商品一致性和跨境平台素材风险。',
    category: 'AI 工具',
    path: '/tools/ai/product-asset-checker',
    color: 'emerald',
    isPopular: true,
  },
  {
    id: 'ai-product-image-generator',
    name: 'AI 出海商品图生成器',
    description: 'Turn a product keyword or brief into images for marketplace listings, ads, and product pages.',
    category: 'AI 工具',
    path: '/tools/ai/product-image-generator',
    color: 'violet',
    isPopular: true,
  },
];

export const TOOLS_META: ToolMeta[] = RAW_TOOLS_META.map(normalizeToolMeta);
