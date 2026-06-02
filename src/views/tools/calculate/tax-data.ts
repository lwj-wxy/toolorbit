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
  taxName?: string;
  taxNameZh?: string;
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
  { code: 'INR', label: 'INR - Indian rupee' },
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

export const AUSTRALIA_GST_RATE_PRESETS: TaxRatePreset[] = [
  {
    label: '10%',
    rate: 10,
    description: 'Standard GST rate - most goods and services',
    descriptionZh: '标准 GST 税率 - 适用于多数商品和服务',
  },
  {
    label: '0%',
    rate: 0,
    description: 'GST-free example - qualifying supplies only',
    descriptionZh: 'GST-free 示例 - 仅限符合条件的供应',
  },
];

export const CANADA_GST_RATE_PRESETS: TaxRatePreset[] = [
  {
    label: '5%',
    rate: 5,
    description: 'Federal GST rate used in non-HST provinces and territories',
    descriptionZh: '联邦 GST 税率，适用于非 HST 省份和地区',
  },
  {
    label: '13%',
    rate: 13,
    description: 'HST rate used in Ontario',
    descriptionZh: 'Ontario 常见 HST 税率',
  },
  {
    label: '14%',
    rate: 14,
    description: 'HST rate used in Nova Scotia from 2025-04-01',
    descriptionZh: 'Nova Scotia 自 2025-04-01 起适用的 HST 税率',
  },
  {
    label: '15%',
    rate: 15,
    description: 'HST rate used in NB, NL, and PEI',
    descriptionZh: 'New Brunswick、Newfoundland and Labrador、Prince Edward Island 常见 HST 税率',
  },
];

export const NEW_ZEALAND_GST_RATE_PRESETS: TaxRatePreset[] = [
  {
    label: '15%',
    rate: 15,
    description: 'Standard GST rate - broad-based supply',
    descriptionZh: '标准 GST 税率 - 广泛适用于多数供应',
  },
  {
    label: '0%',
    rate: 0,
    description: 'Zero-rated example - qualifying supplies only',
    descriptionZh: 'Zero-rated 示例 - 仅限符合条件的供应',
  },
];

export const SINGAPORE_GST_RATE_PRESETS: TaxRatePreset[] = [
  {
    label: '9%',
    rate: 9,
    description: 'Prevailing GST rate from 2024-01-01',
    descriptionZh: '自 2024-01-01 起适用的现行 GST 税率',
  },
  {
    label: '0%',
    rate: 0,
    description: 'Zero-rated example - exports and qualifying services',
    descriptionZh: 'Zero-rated 示例 - 出口和符合条件的服务',
  },
];

export const INDIA_GST_RATE_PRESETS: TaxRatePreset[] = [
  {
    label: '18%',
    rate: 18,
    description: 'Common standard slab for many goods and services',
    descriptionZh: '许多商品和服务使用的常见标准税档',
  },
  {
    label: '12%',
    rate: 12,
    description: 'Middle GST slab for selected categories',
    descriptionZh: '部分品类适用的中间 GST 税档',
  },
  {
    label: '5%',
    rate: 5,
    description: 'Lower GST slab for selected essentials',
    descriptionZh: '部分基础商品适用的较低 GST 税档',
  },
  {
    label: '28%',
    rate: 28,
    description: 'Higher GST slab for selected goods',
    descriptionZh: '部分指定商品适用的较高 GST 税档',
  },
];

export const AUSTRALIA_GST_JURISDICTION: TaxJurisdiction = {
  slug: 'australia',
  name: 'Australia',
  nameZh: '澳大利亚',
  countryCode: 'AU',
  currency: 'AUD',
  taxName: 'GST',
  taxNameZh: 'GST',
  rates: AUSTRALIA_GST_RATE_PRESETS,
  sourceName: 'Australian Taxation Office GST overview',
  sourceUrl: 'https://www.ato.gov.au/about-ato/research-and-statistics/in-detail/tax-gap/goods-and-services-tax-gap/overview',
  lastChecked: '2026-06-02',
  effectiveDate: '10% GST rate in effect since 2000-07-01',
  effectiveDateZh: '10% GST 税率自 2000-07-01 起实施',
  note:
    'Australia generally applies 10% GST to most goods and services. GST-free and input-taxed supplies such as some food, health, education, and exports are not modeled by this calculator.',
  noteZh:
    '澳大利亚通常对多数商品和服务征收 10% GST。部分食品、医疗、教育和出口等 GST-free 或 input-taxed 场景不在本计算器覆盖范围内。',
};

export const CANADA_GST_JURISDICTION: TaxJurisdiction = {
  slug: 'canada',
  name: 'Canada',
  nameZh: '加拿大',
  countryCode: 'CA',
  currency: 'CAD',
  taxName: 'GST/HST',
  taxNameZh: 'GST / HST',
  rates: CANADA_GST_RATE_PRESETS,
  sourceName: 'Canada Revenue Agency GST/HST calculator and rates',
  sourceUrl: 'https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/charge-collect-which-rate/calculator.html',
  lastChecked: '2026-06-02',
  effectiveDate: 'Nova Scotia HST changed to 14% on 2025-04-01',
  effectiveDateZh: 'Nova Scotia HST 已于 2025-04-01 调整为 14%',
  note:
    'Use 5% for federal GST in non-HST provinces and territories. Use 13% to 15% where HST applies. Provincial sales taxes such as PST and QST are not included in this GST/HST-only calculator.',
  noteZh:
    '非 HST 省份和地区通常使用 5% 联邦 GST；HST 省份通常使用 13% 到 15%。本工具仅覆盖 GST/HST，不包含 PST、QST 等省级销售税。',
};

export const NEW_ZEALAND_GST_JURISDICTION: TaxJurisdiction = {
  slug: 'new-zealand',
  name: 'New Zealand',
  nameZh: '新西兰',
  countryCode: 'NZ',
  currency: 'NZD',
  taxName: 'GST',
  taxNameZh: 'GST',
  rates: NEW_ZEALAND_GST_RATE_PRESETS,
  sourceName: 'Inland Revenue New Zealand - What GST is',
  sourceUrl: 'https://www.ird.govt.nz/gst/what-gst-is',
  lastChecked: '2026-06-02',
  note:
    'New Zealand GST is generally charged at 15% on most goods and services. Zero-rated and exempt supplies still depend on transaction type and tax status, so use this page for quick estimates only.',
  noteZh:
    '新西兰通常对多数商品和服务征收 15% GST。Zero-rated 和 exempt 供应仍取决于交易类型和税务状态，因此本页仅适合快速估算。',
};

export const SINGAPORE_GST_JURISDICTION: TaxJurisdiction = {
  slug: 'singapore',
  name: 'Singapore',
  nameZh: '新加坡',
  countryCode: 'SG',
  currency: 'SGD',
  taxName: 'GST',
  taxNameZh: 'GST',
  rates: SINGAPORE_GST_RATE_PRESETS,
  sourceName: 'IRAS Current GST rates',
  sourceUrl: 'https://www.iras.gov.sg/taxes/goods-services-tax-%28gst%29/basics-of-gst/current-gst-rates',
  lastChecked: '2026-06-02',
  effectiveDate: '9% GST rate effective from 2024-01-01',
  effectiveDateZh: '9% GST 税率自 2024-01-01 起生效',
  note:
    'Singapore currently applies 9% GST on standard-rated supplies. Zero-rated and exempt supplies such as qualifying exports and financial services are not fully modeled here.',
  noteZh:
    '新加坡目前对 standard-rated 供应征收 9% GST。符合条件的出口、金融服务等 zero-rated 或 exempt 场景未在此完整建模。',
};

export const INDIA_GST_JURISDICTION: TaxJurisdiction = {
  slug: 'india',
  name: 'India',
  nameZh: '印度',
  countryCode: 'IN',
  currency: 'INR',
  taxName: 'GST',
  taxNameZh: 'GST',
  rates: INDIA_GST_RATE_PRESETS,
  sourceName: 'CBIC GST rate schedules and GST rates FAQ',
  sourceUrl: 'https://www.cbic.gov.in/htdocs-cbec/gst/gst-rate-schedules',
  lastChecked: '2026-06-02',
  note:
    'India GST uses multiple slabs by HSN or SAC classification. This calculator exposes common headline slabs such as 5%, 12%, 18%, and 28%, but actual liability depends on the exact product or service category.',
  noteZh:
    '印度 GST 按 HSN 或 SAC 分类采用多档税率。本工具提供 5%、12%、18%、28% 等常见主税档，但实际税率仍取决于具体商品或服务分类。',
};

export const COUNTRY_GST_JURISDICTIONS: TaxJurisdiction[] = [
  AUSTRALIA_GST_JURISDICTION,
  CANADA_GST_JURISDICTION,
  NEW_ZEALAND_GST_JURISDICTION,
  SINGAPORE_GST_JURISDICTION,
  INDIA_GST_JURISDICTION,
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
  'gst-calculator': {
    toolKey: 'gst-calculator',
    title: 'GST Calculator',
    titleZh: 'GST 计算器',
    description:
      'Switch between Australia, Canada, New Zealand, Singapore, and India, then calculate GST or HST using country-specific presets, source notes, and add-tax or remove-tax modes.',
    descriptionZh:
      '在澳大利亚、加拿大、新西兰、新加坡和印度之间切换，按国家 GST / HST preset 计算税前金额、税额和含税金额。',
    defaultAmount: '100',
    defaultRate: 10,
    defaultCurrency: 'AUD',
    defaultMode: 'add',
    presets: AUSTRALIA_GST_RATE_PRESETS,
    jurisdiction: AUSTRALIA_GST_JURISDICTION,
    jurisdictions: COUNTRY_GST_JURISDICTIONS,
    defaultJurisdictionSlug: 'australia',
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
