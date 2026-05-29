import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Copy, Percent, RotateCcw } from 'lucide-react';
import ToolSEOCard from '../../../components/ToolSEOCard';
import { cn } from '../../../lib/utils';
import {
  calculateTaxResult,
  formatCurrencyAmount,
  type TaxCalculationMode,
} from '../../../lib/tax-calculation';
import {
  TAX_CURRENCIES,
  type TaxCalculatorConfig,
} from './tax-data';

type FieldErrors = {
  amount?: string;
  rate?: string;
};

type ResultRowProps = {
  label: string;
  value: string;
  tone?: 'default' | 'accent';
};

const ResultRow = ({ label, value, tone = 'default' }: ResultRowProps) => (
  <div className="flex items-end justify-between gap-4 border-b border-slate-200 py-4 last:border-b-0 dark:border-slate-800">
    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{label}</span>
    <span
      className={cn(
        'break-all text-right font-mono text-xl font-semibold',
        tone === 'accent' ? 'text-cyan-700 dark:text-cyan-300' : 'text-slate-950 dark:text-white',
      )}
    >
      {value}
    </span>
  </div>
);

const parseNumberField = (value: string) => Number(value.trim());

const TaxFaqSection = ({ toolKey }: { toolKey: string }) => {
  const { t } = useTranslation();
  const faqList = [1, 2, 3, 4, 5, 6]
    .map((index) => {
      const question = t(`tools.${toolKey}.faq${index}Q`);
      const answer = t(`tools.${toolKey}.faq${index}A`);

      if (!question || question === `tools.${toolKey}.faq${index}Q`) {
        return null;
      }

      return { question, answer };
    })
    .filter(Boolean);

  if (!faqList.length) return null;

  return (
    <section className="mt-8 rounded-2xl border border-slate-200/90 bg-white px-5 py-7 shadow-sm dark:border-slate-800 dark:bg-[#282c34] sm:px-7">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
        {t('common.faqTitle', { defaultValue: 'Frequently Asked Questions' })}
      </h2>
      <div className="mt-6 space-y-6">
        {faqList.map((faq, index) => (
          <div key={index} className="border-b border-slate-200 pb-6 last:border-b-0 last:pb-0 dark:border-slate-800">
            <h3 className="text-base font-semibold text-slate-950 dark:text-white">{faq?.question}</h3>
            <p className="mt-3 text-[15px] leading-7 text-slate-700 dark:text-slate-300">{faq?.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const TaxCalculator = ({ config }: { config: TaxCalculatorConfig }) => {
  const { i18n } = useTranslation();
  const isZh = i18n.language?.startsWith('zh');
  const [amountInput, setAmountInput] = useState(config.defaultAmount);
  const [rateInput, setRateInput] = useState(String(config.defaultRate));
  const [currency, setCurrency] = useState(config.defaultCurrency);
  const [mode, setMode] = useState<TaxCalculationMode>(config.defaultMode);
  const [copied, setCopied] = useState(false);

  const amountValue = parseNumberField(amountInput);
  const rateValue = parseNumberField(rateInput);
  const title = isZh ? config.titleZh : config.title;
  const description = isZh ? config.descriptionZh : config.description;
  const labels = {
    addTax: isZh ? '加税' : 'Add tax',
    removeTax: isZh ? '去税' : 'Remove tax',
    amount: isZh ? '金额' : 'Amount',
    taxRate: isZh ? '税率' : 'Tax rate',
    currency: isZh ? '货币' : 'Currency',
    presets: isZh ? '常用税率' : 'Tax rate presets',
    result: isZh ? '计算结果' : 'Result',
    inputAsNet: isZh ? '输入金额会被视为税前金额。' : 'Input is treated as net amount.',
    inputAsGross: isZh ? '输入金额会被视为含税金额。' : 'Input is treated as gross amount.',
    reset: isZh ? '重置' : 'Reset',
    netAmount: isZh ? '税前金额' : 'Net amount',
    taxAmount: isZh ? '税额' : 'Tax amount',
    grossAmount: isZh ? '含税金额' : 'Gross amount',
    formula: isZh ? '公式' : 'Formula',
    copyResult: isZh ? '复制结果' : 'Copy result',
    copied: isZh ? '已复制' : 'Copied',
    fixInputs: isZh ? '请先修正高亮输入项，再查看计算结果。' : 'Fix the highlighted input before viewing the calculation result.',
    mode: isZh ? '模式' : 'Mode',
  };

  const errors: FieldErrors = {};
  if (!amountInput.trim()) {
    errors.amount = isZh ? '金额不能为空。' : 'Amount is required.';
  } else if (!Number.isFinite(amountValue)) {
    errors.amount = isZh ? '金额必须是数字。' : 'Amount must be a number.';
  } else if (amountValue < 0) {
    errors.amount = isZh ? '金额不能为负数。' : 'Amount cannot be negative.';
  }

  if (!rateInput.trim()) {
    errors.rate = isZh ? '税率不能为空。' : 'Tax rate is required.';
  } else if (!Number.isFinite(rateValue)) {
    errors.rate = isZh ? '税率必须是数字。' : 'Tax rate must be a number.';
  } else if (rateValue < 0 || rateValue > 100) {
    errors.rate = isZh ? '税率必须在 0% 到 100% 之间。' : 'Tax rate must be between 0% and 100%.';
  }

  const hasErrors = Boolean(errors.amount || errors.rate);
  const result = useMemo(() => {
    if (hasErrors) return null;
    return calculateTaxResult(amountValue, rateValue, mode);
  }, [amountValue, rateValue, mode, hasErrors]);

  const formulaText =
    mode === 'add'
      ? isZh
        ? '含税金额 = 税前金额 x (1 + 税率)，税额 = 含税金额 - 税前金额'
        : 'gross = net x (1 + rate), tax = gross - net'
      : isZh
        ? '税前金额 = 含税金额 / (1 + 税率)，税额 = 含税金额 - 税前金额'
        : 'net = gross / (1 + rate), tax = gross - net';

  const copyText = result
    ? [
        `${title}`,
        `${labels.mode}: ${mode === 'add' ? labels.addTax : labels.removeTax}`,
        `${labels.taxRate}: ${rateValue}%`,
        `${labels.netAmount}: ${formatCurrencyAmount(result.netAmount, currency)}`,
        `${labels.taxAmount}: ${formatCurrencyAmount(result.taxAmount, currency)}`,
        `${labels.grossAmount}: ${formatCurrencyAmount(result.grossAmount, currency)}`,
        `${labels.formula}: ${formulaText}`,
      ].join('\n')
    : '';

  const handleCopy = async () => {
    if (!copyText) return;
    await navigator.clipboard.writeText(copyText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const handleReset = () => {
    setAmountInput(config.defaultAmount);
    setRateInput(String(config.defaultRate));
    setCurrency(config.defaultCurrency);
    setMode(config.defaultMode);
    setCopied(false);
  };

  return (
    <div className="space-y-7">
      <section className="border-b border-slate-200 pb-6 dark:border-slate-800">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
          {title}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
          {description}
        </p>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.8fr)]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#282c34] sm:p-6">
          <div className="mb-5 grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-900">
            {(['add', 'remove'] as TaxCalculationMode[]).map((modeOption) => (
              <button
                key={modeOption}
                type="button"
                onClick={() => setMode(modeOption)}
                className={cn(
                  'min-h-11 rounded-md px-3 text-sm font-semibold transition-colors',
                  mode === modeOption
                    ? 'bg-white text-cyan-700 shadow-sm dark:bg-[#282c34] dark:text-cyan-300'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white',
                )}
              >
                {modeOption === 'add' ? labels.addTax : labels.removeTax}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
                {labels.amount}
              </span>
              <input
                type="text"
                inputMode="decimal"
                value={amountInput}
                onChange={(event) => setAmountInput(event.target.value)}
                className={cn(
                  'h-14 w-full rounded-lg border bg-slate-50 px-4 font-mono text-lg font-semibold text-slate-900 outline-none transition-colors focus:border-cyan-500 dark:bg-slate-900 dark:text-slate-100',
                  errors.amount ? 'border-red-300 dark:border-red-800' : 'border-slate-200 dark:border-slate-700',
                )}
                placeholder="0.00"
                aria-invalid={Boolean(errors.amount)}
              />
              {errors.amount ? <span className="block text-sm text-red-600 dark:text-red-300">{errors.amount}</span> : null}
            </label>

            <label className="space-y-2">
              <span className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
                {labels.taxRate}
              </span>
              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  value={rateInput}
                  onChange={(event) => setRateInput(event.target.value)}
                  className={cn(
                    'h-14 w-full rounded-lg border bg-slate-50 px-4 pr-11 font-mono text-lg font-semibold text-slate-900 outline-none transition-colors focus:border-cyan-500 dark:bg-slate-900 dark:text-slate-100',
                    errors.rate ? 'border-red-300 dark:border-red-800' : 'border-slate-200 dark:border-slate-700',
                  )}
                  placeholder="20"
                  aria-invalid={Boolean(errors.rate)}
                />
                <Percent className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
              {errors.rate ? <span className="block text-sm text-red-600 dark:text-red-300">{errors.rate}</span> : null}
            </label>
          </div>

          <label className="mt-5 block space-y-2">
            <span className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
              {labels.currency}
            </span>
            <select
              value={currency}
              onChange={(event) => setCurrency(event.target.value)}
              className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-900 outline-none transition-colors focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              {TAX_CURRENCIES.map((currencyOption) => (
                <option key={currencyOption.code} value={currencyOption.code}>
                  {currencyOption.label}
                </option>
              ))}
            </select>
          </label>

          <div className="mt-5">
            <div className="mb-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
              {labels.presets}
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {config.presets.map((preset) => (
                <button
                  key={`${preset.label}-${preset.rate}`}
                  type="button"
                  onClick={() => setRateInput(String(preset.rate))}
                  className="min-h-[58px] rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left transition-colors hover:border-cyan-300 hover:bg-white dark:border-slate-700 dark:bg-slate-900 dark:hover:border-cyan-800"
                >
                  <span className="block text-sm font-semibold text-slate-950 dark:text-white">{preset.label}</span>
                  {(isZh ? preset.descriptionZh || preset.description : preset.description) ? (
                    <span className="mt-1 block text-xs leading-4 text-slate-500 dark:text-slate-400">
                      {isZh ? preset.descriptionZh || preset.description : preset.description}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          </div>
        </div>

        <aside className="rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-slate-950 dark:text-white">
                {labels.result}
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {mode === 'add' ? labels.inputAsNet : labels.inputAsGross}
              </p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:text-cyan-700 dark:border-slate-700 dark:bg-[#282c34] dark:text-slate-300 dark:hover:text-cyan-300"
              aria-label={labels.reset}
              title={labels.reset}
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          {result ? (
            <>
              <div className="rounded-lg border border-slate-200 bg-white px-4 dark:border-slate-700 dark:bg-[#282c34]">
                <ResultRow label={labels.netAmount} value={formatCurrencyAmount(result.netAmount, currency)} />
                <ResultRow label={labels.taxAmount} value={formatCurrencyAmount(result.taxAmount, currency)} />
                <ResultRow label={labels.grossAmount} value={formatCurrencyAmount(result.grossAmount, currency)} tone="accent" />
              </div>

              <div className="mt-4 rounded-lg border border-cyan-100 bg-cyan-50 p-4 text-sm leading-6 text-cyan-950 dark:border-cyan-900/60 dark:bg-cyan-950/20 dark:text-cyan-100">
                <span className="block font-semibold">{labels.formula}</span>
                <span className="mt-1 block font-mono text-xs sm:text-sm">{formulaText}</span>
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-cyan-700 dark:bg-cyan-600 dark:hover:bg-cyan-500"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? labels.copied : labels.copyResult}
              </button>
            </>
          ) : (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700 dark:border-red-900/60 dark:bg-red-950/20 dark:text-red-200">
              {labels.fixInputs}
            </div>
          )}
        </aside>
      </section>

      <ToolSEOCard toolKey={config.toolKey} />
      <TaxFaqSection toolKey={config.toolKey} />
    </div>
  );
};

export default TaxCalculator;
