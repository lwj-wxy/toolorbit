import type { TaxCalculationMode } from '../../../lib/tax-calculation';

export type TaxRatePreset = {
  label: string;
  rate: number;
  description?: string;
  descriptionZh?: string;
};

export type TaxJurisdiction = {
  slug: string;
  name: string;
  nameZh: string;
  countryCode: string;
  currency: string;
  rates: TaxRatePreset[];
  sourceName: string;
  sourceUrl: string;
  lastChecked: string;
  effectiveDate?: string;
  effectiveDateZh?: string;
  note?: string;
  noteZh?: string;
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
  jurisdiction?: TaxJurisdiction;
  jurisdictions?: TaxJurisdiction[];
  defaultJurisdictionSlug?: string;
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
  {
    label: '20%',
    rate: 20,
    description: 'Standard rate - most goods and services',
    descriptionZh: '标准税率 - 多数商品和服务',
  },
  {
    label: '5%',
    rate: 5,
    description: 'Reduced rate - qualifying goods and services',
    descriptionZh: '优惠税率 - 符合条件的商品和服务',
  },
  {
    label: '0%',
    rate: 0,
    description: 'Zero rate - qualifying zero-rated supplies',
    descriptionZh: '零税率 - 符合条件的 zero-rated 供应',
  },
];

export const UK_VAT_JURISDICTION: TaxJurisdiction = {
  slug: 'uk',
  name: 'United Kingdom',
  nameZh: '英国',
  countryCode: 'GB',
  currency: 'GBP',
  rates: UK_VAT_RATE_PRESETS,
  sourceName: 'GOV.UK VAT rates',
  sourceUrl: 'https://www.gov.uk/vat-rates',
  lastChecked: '2026-06-01',
  effectiveDate: '20% standard rate effective since 2011-01-04',
  effectiveDateZh: '20% 标准税率自 2011-01-04 起生效',
  note:
    'The 20% standard rate applies to most goods and services. The 5% reduced rate and 0% zero rate apply only to qualifying categories. Exempt and out-of-scope supplies are not modeled by this calculator.',
  noteZh:
    '20% 标准税率适用于多数商品和服务。5% reduced rate 和 0% zero rate 仅适用于符合条件的品类。本计算器不覆盖 exempt 或 out-of-scope 场景。',
};

const EU_VAT_SOURCE_NAME = 'Your Europe VAT rates / TEDB';
const EU_VAT_SOURCE_URL = 'https://europa.eu/youreurope/business/taxation/vat/vat-rules-rates/index_en.htm';
const EU_VAT_LAST_CHECKED = '2026-06-01';

const EU_VAT_SCOPE_NOTE =
  'Standard VAT usually applies to most goods and services. Reduced, super-reduced, zero, exempt, and special territorial rules depend on product category and local law, so this calculator is for quick estimates only.';

const EU_VAT_SCOPE_NOTE_ZH =
  '标准 VAT 通常适用于多数商品和服务。Reduced、super-reduced、zero、exempt 以及特殊地区规则取决于商品类别和当地法规，本计算器仅用于快速估算。';

export const GERMANY_VAT_RATE_PRESETS: TaxRatePreset[] = [
  {
    label: '19%',
    rate: 19,
    description: 'Standard rate - most goods and services',
    descriptionZh: '标准税率 - 多数商品和服务',
  },
  {
    label: '7%',
    rate: 7,
    description: 'Reduced rate - qualifying goods and services',
    descriptionZh: '优惠税率 - 符合条件的商品和服务',
  },
];

export const FRANCE_VAT_RATE_PRESETS: TaxRatePreset[] = [
  {
    label: '20%',
    rate: 20,
    description: 'Standard rate - most goods and services',
    descriptionZh: '标准税率 - 多数商品和服务',
  },
  {
    label: '10%',
    rate: 10,
    description: 'Reduced rate - qualifying categories',
    descriptionZh: '优惠税率 - 符合条件的品类',
  },
  {
    label: '5.5%',
    rate: 5.5,
    description: 'Reduced rate - selected essentials',
    descriptionZh: '优惠税率 - 部分基础必需品',
  },
  {
    label: '2.1%',
    rate: 2.1,
    description: 'Super-reduced rate - limited categories',
    descriptionZh: '超低税率 - 有限品类',
  },
];

export const SPAIN_VAT_RATE_PRESETS: TaxRatePreset[] = [
  {
    label: '21%',
    rate: 21,
    description: 'Standard rate - most goods and services',
    descriptionZh: '标准税率 - 多数商品和服务',
  },
  {
    label: '10%',
    rate: 10,
    description: 'Reduced rate - qualifying goods and services',
    descriptionZh: '优惠税率 - 符合条件的商品和服务',
  },
  {
    label: '4%',
    rate: 4,
    description: 'Super-reduced rate - limited essentials',
    descriptionZh: '超低税率 - 有限基础必需品',
  },
];

export const ITALY_VAT_RATE_PRESETS: TaxRatePreset[] = [
  {
    label: '22%',
    rate: 22,
    description: 'Standard rate - most goods and services',
    descriptionZh: '标准税率 - 多数商品和服务',
  },
  {
    label: '10%',
    rate: 10,
    description: 'Reduced rate - qualifying categories',
    descriptionZh: '优惠税率 - 符合条件的品类',
  },
  {
    label: '5%',
    rate: 5,
    description: 'Reduced rate - selected categories',
    descriptionZh: '优惠税率 - 部分指定品类',
  },
  {
    label: '4%',
    rate: 4,
    description: 'Super-reduced rate - limited categories',
    descriptionZh: '超低税率 - 有限品类',
  },
];

export const NETHERLANDS_VAT_RATE_PRESETS: TaxRatePreset[] = [
  {
    label: '21%',
    rate: 21,
    description: 'Standard rate - most goods and services',
    descriptionZh: '标准税率 - 多数商品和服务',
  },
  {
    label: '9%',
    rate: 9,
    description: 'Reduced rate - qualifying goods and services',
    descriptionZh: '优惠税率 - 符合条件的商品和服务',
  },
];

export const IRELAND_VAT_RATE_PRESETS: TaxRatePreset[] = [
  {
    label: '23%',
    rate: 23,
    description: 'Standard rate - most goods and services',
    descriptionZh: '标准税率 - 多数商品和服务',
  },
  {
    label: '13.5%',
    rate: 13.5,
    description: 'Reduced rate - qualifying goods and services',
    descriptionZh: '优惠税率 - 符合条件的商品和服务',
  },
  {
    label: '9%',
    rate: 9,
    description: 'Reduced rate - selected categories',
    descriptionZh: '优惠税率 - 部分指定品类',
  },
];

export const GERMANY_VAT_JURISDICTION: TaxJurisdiction = {
  slug: 'germany',
  name: 'Germany',
  nameZh: '德国',
  countryCode: 'DE',
  currency: 'EUR',
  rates: GERMANY_VAT_RATE_PRESETS,
  sourceName: EU_VAT_SOURCE_NAME,
  sourceUrl: EU_VAT_SOURCE_URL,
  lastChecked: EU_VAT_LAST_CHECKED,
  note: EU_VAT_SCOPE_NOTE,
  noteZh: EU_VAT_SCOPE_NOTE_ZH,
};

export const FRANCE_VAT_JURISDICTION: TaxJurisdiction = {
  slug: 'france',
  name: 'France',
  nameZh: '法国',
  countryCode: 'FR',
  currency: 'EUR',
  rates: FRANCE_VAT_RATE_PRESETS,
  sourceName: EU_VAT_SOURCE_NAME,
  sourceUrl: EU_VAT_SOURCE_URL,
  lastChecked: EU_VAT_LAST_CHECKED,
  note: EU_VAT_SCOPE_NOTE,
  noteZh: EU_VAT_SCOPE_NOTE_ZH,
};

export const SPAIN_VAT_JURISDICTION: TaxJurisdiction = {
  slug: 'spain',
  name: 'Spain',
  nameZh: '西班牙',
  countryCode: 'ES',
  currency: 'EUR',
  rates: SPAIN_VAT_RATE_PRESETS,
  sourceName: EU_VAT_SOURCE_NAME,
  sourceUrl: EU_VAT_SOURCE_URL,
  lastChecked: EU_VAT_LAST_CHECKED,
  note: EU_VAT_SCOPE_NOTE,
  noteZh: EU_VAT_SCOPE_NOTE_ZH,
};

export const ITALY_VAT_JURISDICTION: TaxJurisdiction = {
  slug: 'italy',
  name: 'Italy',
  nameZh: '意大利',
  countryCode: 'IT',
  currency: 'EUR',
  rates: ITALY_VAT_RATE_PRESETS,
  sourceName: EU_VAT_SOURCE_NAME,
  sourceUrl: EU_VAT_SOURCE_URL,
  lastChecked: EU_VAT_LAST_CHECKED,
  note: EU_VAT_SCOPE_NOTE,
  noteZh: EU_VAT_SCOPE_NOTE_ZH,
};

export const NETHERLANDS_VAT_JURISDICTION: TaxJurisdiction = {
  slug: 'netherlands',
  name: 'Netherlands',
  nameZh: '荷兰',
  countryCode: 'NL',
  currency: 'EUR',
  rates: NETHERLANDS_VAT_RATE_PRESETS,
  sourceName: EU_VAT_SOURCE_NAME,
  sourceUrl: EU_VAT_SOURCE_URL,
  lastChecked: EU_VAT_LAST_CHECKED,
  note: EU_VAT_SCOPE_NOTE,
  noteZh: EU_VAT_SCOPE_NOTE_ZH,
};

export const IRELAND_VAT_JURISDICTION: TaxJurisdiction = {
  slug: 'ireland',
  name: 'Ireland',
  nameZh: '爱尔兰',
  countryCode: 'IE',
  currency: 'EUR',
  rates: IRELAND_VAT_RATE_PRESETS,
  sourceName: EU_VAT_SOURCE_NAME,
  sourceUrl: EU_VAT_SOURCE_URL,
  lastChecked: EU_VAT_LAST_CHECKED,
  note: EU_VAT_SCOPE_NOTE,
  noteZh: EU_VAT_SCOPE_NOTE_ZH,
};

export const COUNTRY_VAT_JURISDICTIONS: TaxJurisdiction[] = [
  UK_VAT_JURISDICTION,
  GERMANY_VAT_JURISDICTION,
  FRANCE_VAT_JURISDICTION,
  SPAIN_VAT_JURISDICTION,
  ITALY_VAT_JURISDICTION,
  NETHERLANDS_VAT_JURISDICTION,
  IRELAND_VAT_JURISDICTION,
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
    jurisdiction: UK_VAT_JURISDICTION,
  },
  'country-vat-calculator': {
    toolKey: 'country-vat-calculator',
    title: 'Country VAT Calculator',
    titleZh: '国家 VAT 计算器',
    description:
      'Choose the United Kingdom, Germany, France, Spain, Italy, the Netherlands, or Ireland, then calculate VAT with the correct country rate presets, source notes, and add-tax or remove-tax modes.',
    descriptionZh:
      '选择英国、德国、法国、西班牙、意大利、荷兰或爱尔兰，并按对应国家 VAT preset 计算税前金额、VAT 金额和含税金额。',
    defaultAmount: '100',
    defaultRate: 20,
    defaultCurrency: 'GBP',
    defaultMode: 'add',
    presets: UK_VAT_RATE_PRESETS,
    jurisdiction: UK_VAT_JURISDICTION,
    jurisdictions: COUNTRY_VAT_JURISDICTIONS,
    defaultJurisdictionSlug: 'uk',
  },
  'germany-vat-calculator': {
    toolKey: 'germany-vat-calculator',
    title: 'Germany VAT Calculator',
    titleZh: '德国 VAT 计算器',
    description:
      'Calculate German VAT using the 19% standard rate or 7% reduced rate, with source notes and quick estimate disclaimer.',
    descriptionZh:
      '使用德国 VAT 19% 标准税率或 7% reduced rate，计算税前金额、VAT 金额和含税金额。',
    defaultAmount: '100',
    defaultRate: 19,
    defaultCurrency: 'EUR',
    defaultMode: 'add',
    presets: GERMANY_VAT_RATE_PRESETS,
    jurisdiction: GERMANY_VAT_JURISDICTION,
  },
  'france-vat-calculator': {
    toolKey: 'france-vat-calculator',
    title: 'France VAT Calculator',
    titleZh: '法国 VAT 计算器',
    description:
      'Calculate French VAT using 20%, 10%, 5.5%, or 2.1% rate presets, with source notes and quick estimate disclaimer.',
    descriptionZh:
      '使用法国 VAT 20%、10%、5.5% 或 2.1% 常见税率，计算税前金额、VAT 金额和含税金额。',
    defaultAmount: '100',
    defaultRate: 20,
    defaultCurrency: 'EUR',
    defaultMode: 'add',
    presets: FRANCE_VAT_RATE_PRESETS,
    jurisdiction: FRANCE_VAT_JURISDICTION,
  },
  'spain-vat-calculator': {
    toolKey: 'spain-vat-calculator',
    title: 'Spain VAT Calculator',
    titleZh: '西班牙 VAT 计算器',
    description:
      'Calculate Spanish VAT using 21%, 10%, or 4% rate presets, with source notes and quick estimate disclaimer.',
    descriptionZh:
      '使用西班牙 VAT 21%、10% 或 4% 常见税率，计算税前金额、VAT 金额和含税金额。',
    defaultAmount: '100',
    defaultRate: 21,
    defaultCurrency: 'EUR',
    defaultMode: 'add',
    presets: SPAIN_VAT_RATE_PRESETS,
    jurisdiction: SPAIN_VAT_JURISDICTION,
  },
  'italy-vat-calculator': {
    toolKey: 'italy-vat-calculator',
    title: 'Italy VAT Calculator',
    titleZh: '意大利 VAT 计算器',
    description:
      'Calculate Italian VAT using 22%, 10%, 5%, or 4% rate presets, with source notes and quick estimate disclaimer.',
    descriptionZh:
      '使用意大利 VAT 22%、10%、5% 或 4% 常见税率，计算税前金额、VAT 金额和含税金额。',
    defaultAmount: '100',
    defaultRate: 22,
    defaultCurrency: 'EUR',
    defaultMode: 'add',
    presets: ITALY_VAT_RATE_PRESETS,
    jurisdiction: ITALY_VAT_JURISDICTION,
  },
  'netherlands-vat-calculator': {
    toolKey: 'netherlands-vat-calculator',
    title: 'Netherlands VAT Calculator',
    titleZh: '荷兰 VAT 计算器',
    description:
      'Calculate Dutch VAT using the 21% standard rate or 9% reduced rate, with source notes and quick estimate disclaimer.',
    descriptionZh:
      '使用荷兰 VAT 21% 标准税率或 9% reduced rate，计算税前金额、VAT 金额和含税金额。',
    defaultAmount: '100',
    defaultRate: 21,
    defaultCurrency: 'EUR',
    defaultMode: 'add',
    presets: NETHERLANDS_VAT_RATE_PRESETS,
    jurisdiction: NETHERLANDS_VAT_JURISDICTION,
  },
  'ireland-vat-calculator': {
    toolKey: 'ireland-vat-calculator',
    title: 'Ireland VAT Calculator',
    titleZh: '爱尔兰 VAT 计算器',
    description:
      'Calculate Irish VAT using 23%, 13.5%, or 9% rate presets, with source notes and quick estimate disclaimer.',
    descriptionZh:
      '使用爱尔兰 VAT 23%、13.5% 或 9% 常见税率，计算税前金额、VAT 金额和含税金额。',
    defaultAmount: '100',
    defaultRate: 23,
    defaultCurrency: 'EUR',
    defaultMode: 'add',
    presets: IRELAND_VAT_RATE_PRESETS,
    jurisdiction: IRELAND_VAT_JURISDICTION,
  },
};
