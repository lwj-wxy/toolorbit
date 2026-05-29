import type { TaxCalculationMode } from '../../../lib/tax-calculation';

export type TaxRatePreset = {
  label: string;
  rate: number;
  description?: string;
  descriptionZh?: string;
};

export type CurrencyOption = {
  code: string;
  label: string;
};

export type TaxCalculatorConfig = {
  toolKey: string;
  title: string;
  titleZh: string;
  description: string;
  descriptionZh: string;
  defaultAmount: string;
  defaultRate: number;
  defaultCurrency: string;
  defaultMode: TaxCalculationMode;
  presets: TaxRatePreset[];
};

export const TAX_CURRENCIES: CurrencyOption[] = [
  { code: 'GBP', label: 'GBP - Pound sterling' },
  { code: 'EUR', label: 'EUR - Euro' },
  { code: 'USD', label: 'USD - US dollar' },
  { code: 'AUD', label: 'AUD - Australian dollar' },
  { code: 'CAD', label: 'CAD - Canadian dollar' },
  { code: 'NZD', label: 'NZD - New Zealand dollar' },
  { code: 'SGD', label: 'SGD - Singapore dollar' },
];

export const COMMON_TAX_RATE_PRESETS: TaxRatePreset[] = [
  { label: '20%', rate: 20, description: 'Common VAT standard rate', descriptionZh: '常见 VAT 标准税率' },
  { label: '19%', rate: 19, description: 'Common EU VAT rate', descriptionZh: '常见欧盟 VAT 税率' },
  { label: '10%', rate: 10, description: 'Reduced or local sales tax example', descriptionZh: '减免税率或本地销售税示例' },
  { label: '8.875%', rate: 8.875, description: 'Decimal sales tax example', descriptionZh: '小数销售税示例' },
];

export const UK_VAT_RATE_PRESETS: TaxRatePreset[] = [
  { label: '20%', rate: 20, description: 'Standard rate', descriptionZh: '标准税率' },
  { label: '5%', rate: 5, description: 'Reduced rate', descriptionZh: '优惠税率' },
  { label: '0%', rate: 0, description: 'Zero rate', descriptionZh: '零税率' },
];

export const TAX_CALCULATOR_CONFIGS: Record<string, TaxCalculatorConfig> = {
  'reverse-vat-calculator': {
    toolKey: 'reverse-vat-calculator',
    title: 'Reverse VAT / Sales Tax Calculator',
    titleZh: 'Reverse VAT / Sales Tax 反向税费计算器',
    description:
      'Enter a tax-inclusive price and tax rate to remove VAT or sales tax, then see the net amount, tax amount, and gross amount.',
    descriptionZh:
      '输入含税价格和税率，从价格中去除 VAT 或销售税，并查看税前金额、税额和含税金额。',
    defaultAmount: '120',
    defaultRate: 20,
    defaultCurrency: 'GBP',
    defaultMode: 'remove',
    presets: COMMON_TAX_RATE_PRESETS,
  },
  'vat-inclusive-exclusive-calculator': {
    toolKey: 'vat-inclusive-exclusive-calculator',
    title: 'VAT Inclusive / Exclusive Price Calculator',
    titleZh: 'VAT 含税价 / 税前价转换器',
    description:
      'Convert between VAT-exclusive and VAT-inclusive prices by adding tax to a net amount or removing tax from a gross amount.',
    descriptionZh:
      '在 VAT 税前价和含税价之间转换：可从税前价加税得到含税价，也可从含税价去税得到税前价。',
    defaultAmount: '100',
    defaultRate: 20,
    defaultCurrency: 'GBP',
    defaultMode: 'add',
    presets: COMMON_TAX_RATE_PRESETS,
  },
  'uk-vat-calculator': {
    toolKey: 'uk-vat-calculator',
    title: 'UK VAT Calculator',
    titleZh: '英国 VAT 计算器',
    description:
      'Calculate UK VAT using the standard 20% rate, reduced 5% rate, or zero rate, with source notes and a quick estimate disclaimer.',
    descriptionZh:
      '使用英国 VAT 20% 标准税率、5% reduced rate 或 0% zero rate，计算税前金额、VAT 金额和含税金额。',
    defaultAmount: '100',
    defaultRate: 20,
    defaultCurrency: 'GBP',
    defaultMode: 'add',
    presets: UK_VAT_RATE_PRESETS,
  },
};
