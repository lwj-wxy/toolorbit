import AiRuntimeTool, { type AiRuntimeToolConfig } from './AiRuntimeTool';

const config: AiRuntimeToolConfig = {
  toolId: 'listing-generator',
  endpoint: '/api/listing-craft',
  icon: 'sparkles',
  title: {
    en: 'AI Listing Generator for Amazon, Shopify, and Etsy',
    zh: 'AI Listing 生成器',
  },
  subtitle: {
    en: 'Draft Etsy, Amazon, Shopify, and eBay listing titles, descriptions, tags, and social copy from product details.',
    zh: '根据商品信息生成 Etsy、Amazon、Shopify 和 eBay 商品标题、描述、标签和社媒文案。',
  },
  formTitle: {
    en: 'Product brief',
    zh: '商品简报',
  },
  generateLabel: {
    en: 'Generate listing copy',
    zh: '生成商品文案',
  },
  waitingLabel: {
    en: 'Your listing draft will appear here.',
    zh: '生成后的商品文案会显示在这里。',
  },
  loadingLabel: {
    en: 'Generating listing copy...',
    zh: '正在生成商品文案...',
  },
  fields: [
    {
      key: 'platform',
      type: 'select',
      label: { en: 'Sales platform', zh: '销售平台' },
      defaultValue: 'Etsy',
      options: [
        { value: 'Etsy', label: { en: 'Etsy', zh: 'Etsy' } },
        { value: 'Amazon', label: { en: 'Amazon', zh: 'Amazon' } },
        { value: 'Shopify', label: { en: 'Shopify', zh: 'Shopify' } },
        { value: 'eBay', label: { en: 'eBay', zh: 'eBay' } },
      ],
    },
    {
      key: 'productName',
      type: 'input',
      label: { en: 'Product name', zh: '产品名称' },
      placeholder: { en: 'Personalized leather tote bag for Etsy', zh: '适合 Etsy 上架的个性化皮革托特包' },
      required: true,
      helpText: { en: 'Chinese input is supported. Output can be professional English.', zh: '支持中文输入，可输出专业英文。' },
    },
    {
      key: 'features',
      type: 'textarea',
      label: { en: 'Features and selling points', zh: '特色与卖点' },
      placeholder: {
        en: 'Handmade leather, custom initials, gift packaging, laptop compartment, free shipping angle...',
        zh: '手工皮革，可定制首字母，礼品包装，电脑隔层，可突出包邮卖点...',
      },
    },
    {
      key: 'language',
      type: 'language',
      label: { en: 'Output language', zh: '输出语言' },
      options: [
        { value: 'English', label: { en: 'English', zh: '英文' } },
        { value: 'Chinese', label: { en: 'Chinese', zh: '中文' } },
        { value: 'Japanese', label: { en: 'Japanese', zh: '日文' } },
        { value: 'German', label: { en: 'German', zh: '德文' } },
      ],
    },
    {
      key: 'tone',
      type: 'select',
      label: { en: 'Tone', zh: '语气' },
      defaultValue: 'persuasive',
      options: [
        { value: 'persuasive', label: { en: 'Persuasive', zh: '转化导向' } },
        { value: 'professional', label: { en: 'Professional', zh: '专业' } },
        { value: 'urgent', label: { en: 'Urgent', zh: '促销感' } },
      ],
    },
  ],
  result: {
    type: 'sections',
    sections: [
      { key: 'title', marker: 'TITLE', label: { en: 'Title', zh: '标题' } },
      { key: 'description', marker: 'DESCRIPTION', label: { en: 'Description', zh: '描述' }, markdown: true },
      { key: 'tags', marker: 'TAGS', label: { en: 'Tags', zh: '标签' }, monospace: true },
      { key: 'social', marker: 'SOCIAL', label: { en: 'Social copy', zh: '社媒文案' }, markdown: true },
    ],
  },
  buildPayload: (values) => ({
    platform: values.platform,
    productInfo: values.productName,
    details: values.features,
    keywords: '',
    tone: values.tone,
    targetAudience: '',
    language: values.language,
  }),
};

const ListingGenerator = () => <AiRuntimeTool config={config} />;

export default ListingGenerator;
