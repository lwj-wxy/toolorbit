import type { TaxCalculationMode } from '../../../lib/tax-calculation';

export type TaxRatePreset = {
  label: string;
  rate: number;
  description?: string;
};

export type TaxJurisdiction = {
  slug: string;
  name: string;
  countryCode: string;
  currency: string;
  rates: TaxRatePreset[];
  sourceName: string;
  sourceUrl: string;
  lastChecked: string;
  effectiveDate?: string;
  note?: string;
};

export type CurrencyOption = {
  code: string;
  label: string;
};

export type TaxCalculatorConfig = {
  toolKey: string;
  title: string;
  description: string;
  defaultAmount: string;
  defaultRate: number;
  defaultCurrency: string;
  defaultMode: TaxCalculationMode;
  presets: TaxRatePreset[];
  formulaHeading: string;
  explainer: string;
  source?: TaxJurisdiction;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
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
  { label: '20%', rate: 20, description: 'Common VAT standard rate' },
  { label: '19%', rate: 19, description: 'Common EU VAT rate' },
  { label: '10%', rate: 10, description: 'Reduced or local sales tax example' },
  { label: '8.875%', rate: 8.875, description: 'Decimal sales tax example' },
];

export const UK_VAT_JURISDICTION: TaxJurisdiction = {
  slug: 'uk',
  name: 'United Kingdom VAT',
  countryCode: 'GB',
  currency: 'GBP',
  rates: [
    { label: '20%', rate: 20, description: 'Standard rate' },
    { label: '5%', rate: 5, description: 'Reduced rate' },
    { label: '0%', rate: 0, description: 'Zero rate' },
  ],
  sourceName: 'GOV.UK VAT rates',
  sourceUrl: 'https://www.gov.uk/vat-rates',
  lastChecked: '2026-05-29',
  effectiveDate: '20% standard rate effective from 4 January 2011',
  note: 'The 20% standard rate applies to most goods and services unless they are reduced-rated, zero-rated, exempt, or outside the scope of VAT.',
};

export const TAX_CALCULATOR_CONFIGS: Record<string, TaxCalculatorConfig> = {
  'reverse-vat-calculator': {
    toolKey: 'reverse-vat-calculator',
    title: 'Reverse VAT / Sales Tax Calculator',
    description:
      'Enter a tax-inclusive price and tax rate to remove VAT or sales tax, then see the net amount, tax amount, and gross amount.',
    defaultAmount: '120',
    defaultRate: 20,
    defaultCurrency: 'GBP',
    defaultMode: 'remove',
    presets: COMMON_TAX_RATE_PRESETS,
    formulaHeading: 'Reverse VAT formula',
    explainer:
      'Reverse tax calculation treats the amount you enter as the gross price. The calculator divides the gross amount by 1 plus the tax rate to recover the net price.',
    faqs: [
      {
        question: 'How do I remove VAT from a price?',
        answer: 'Divide the VAT-inclusive price by 1 plus the VAT rate. For 20% VAT, divide the gross price by 1.20.',
      },
      {
        question: 'What is the formula for reverse VAT?',
        answer: 'Net amount = gross amount / (1 + VAT rate). Tax amount = gross amount - net amount.',
      },
      {
        question: 'Can I use this for sales tax?',
        answer: 'Yes. The same arithmetic works for sales tax when the price already includes tax and you know the tax rate.',
      },
    ],
  },
  'vat-inclusive-exclusive-calculator': {
    toolKey: 'vat-inclusive-exclusive-calculator',
    title: 'VAT Inclusive / Exclusive Price Calculator',
    description:
      'Convert between VAT-exclusive and VAT-inclusive prices by adding tax to a net amount or removing tax from a gross amount.',
    defaultAmount: '100',
    defaultRate: 20,
    defaultCurrency: 'GBP',
    defaultMode: 'add',
    presets: COMMON_TAX_RATE_PRESETS,
    formulaHeading: 'VAT inclusive and exclusive formulas',
    explainer:
      'Use Add tax when your input is the net price before tax. Use Remove tax when your input is already tax-inclusive and you need the net amount.',
    faqs: [
      {
        question: 'What is VAT inclusive?',
        answer: 'VAT inclusive means the displayed price already includes VAT, so you remove VAT to find the net price.',
      },
      {
        question: 'What is VAT exclusive?',
        answer: 'VAT exclusive means the displayed price is before VAT, so you add VAT to find the gross price.',
      },
      {
        question: 'Does the formula support decimal tax rates?',
        answer: 'Yes. Rates such as 8.875% are calculated directly without rounding intermediate steps.',
      },
    ],
  },
  'uk-vat-calculator': {
    toolKey: 'uk-vat-calculator',
    title: 'UK VAT Calculator',
    description:
      'Calculate UK VAT using the standard 20% rate, reduced 5% rate, or zero rate, with source notes and a quick estimate disclaimer.',
    defaultAmount: '100',
    defaultRate: 20,
    defaultCurrency: 'GBP',
    defaultMode: 'add',
    presets: UK_VAT_JURISDICTION.rates,
    formulaHeading: 'UK VAT calculation',
    explainer:
      'The UK standard VAT rate is 20% for most goods and services. Some supplies may use the reduced 5% rate or the 0% zero rate depending on the product or service.',
    source: UK_VAT_JURISDICTION,
    faqs: [
      {
        question: 'What is the current UK VAT standard rate?',
        answer: 'The UK standard VAT rate is 20% for most goods and services, subject to product and transaction rules.',
      },
      {
        question: 'What is the UK reduced VAT rate?',
        answer: 'The UK reduced rate is 5% for some goods and services, such as examples listed by GOV.UK including children\'s car seats and home energy.',
      },
      {
        question: 'Is this UK VAT calculator tax advice?',
        answer: 'No. It is a quick estimate calculator. Actual VAT treatment can depend on product category, location, exemptions, and transaction details.',
      },
    ],
  },
};

export const TAX_DISCLAIMER =
  'This calculator is for general information and quick estimates only. Tax rates and rules can change, and actual tax treatment may depend on your location, product category, and transaction details. This is not tax advice.';
