import AiRuntimeTool, { type AiRuntimeToolConfig } from './AiRuntimeTool';

const keywordAnalyzerConfig: AiRuntimeToolConfig = {
  toolId: 'keyword-analyzer',
  endpoint: '/api/keywords',
  icon: 'zap',
  title: {
    en: 'Ecommerce Keyword Analyzer for Product Listings',
    zh: '电商关键词分析器',
  },
  subtitle: {
    en: 'Group product keyword ideas by search intent, listing angle, and copy use. Use the result for planning, not live search volume.',
    zh: '按搜索意图、Listing 角度和文案用途整理商品关键词想法；结果用于规划，不代表实时搜索量。',
  },
  formTitle: {
    en: 'Keyword brief',
    zh: '关键词简报',
  },
  generateLabel: {
    en: 'Analyze keywords',
    zh: '分析关键词',
  },
  waitingLabel: {
    en: 'Keyword groups will appear here.',
    zh: '关键词分组会显示在这里。',
  },
  loadingLabel: {
    en: 'Analyzing keyword ideas...',
    zh: '正在分析关键词想法...',
  },
  fields: [
    {
      key: 'seedKeyword',
      type: 'input',
      label: {
        en: 'Seed product keyword',
        zh: '种子产品词',
      },
      placeholder: {
        en: 'silver necklace',
        zh: '纯银项链',
      },
      required: true,
      helpText: {
        en: 'Use a product, category, material, audience, or use-case phrase.',
        zh: '可以输入产品、类目、材质、人群或使用场景词。',
      },
    },
    {
      key: 'language',
      type: 'language',
      label: {
        en: 'Output language',
        zh: '输出语言',
      },
      options: [
        {
          value: 'English',
          label: {
            en: 'English',
            zh: '英文',
          },
        },
        {
          value: 'Chinese',
          label: {
            en: 'Chinese',
            zh: '中文',
          },
        },
      ],
    },
  ],
  result: {
    type: 'keyword-json',
  },
  buildPayload: (values) => ({
    productName: values.seedKeyword,
    language: values.language,
  }),
};

const KeywordAnalyzer = () => <AiRuntimeTool config={keywordAnalyzerConfig} />;

export default KeywordAnalyzer;
