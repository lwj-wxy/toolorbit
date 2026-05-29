import { useMemo, useState } from 'react';
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
  TAX_DISCLAIMER,
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

const TaxCalculator = ({ config }: { config: TaxCalculatorConfig }) => {
  const [amountInput, setAmountInput] = useState(config.defaultAmount);
  const [rateInput, setRateInput] = useState(String(config.defaultRate));
  const [currency, setCurrency] = useState(config.defaultCurrency);
  const [mode, setMode] = useState<TaxCalculationMode>(config.defaultMode);
  const [copied, setCopied] = useState(false);

  const amountValue = parseNumberField(amountInput);
  const rateValue = parseNumberField(rateInput);

  const errors: FieldErrors = {};
  if (!amountInput.trim()) {
    errors.amount = 'Amount is required.';
  } else if (!Number.isFinite(amountValue)) {
    errors.amount = 'Amount must be a number.';
  } else if (amountValue < 0) {
    errors.amount = 'Amount cannot be negative.';
  }

  if (!rateInput.trim()) {
    errors.rate = 'Tax rate is required.';
  } else if (!Number.isFinite(rateValue)) {
    errors.rate = 'Tax rate must be a number.';
  } else if (rateValue < 0 || rateValue > 100) {
    errors.rate = 'Tax rate must be between 0% and 100%.';
  }

  const hasErrors = Boolean(errors.amount || errors.rate);
  const result = useMemo(() => {
    if (hasErrors) return null;
    return calculateTaxResult(amountValue, rateValue, mode);
  }, [amountValue, rateValue, mode, hasErrors]);

  const formulaText =
    mode === 'add'
      ? 'gross = net x (1 + rate), tax = gross - net'
      : 'net = gross / (1 + rate), tax = gross - net';

  const copyText = result
    ? [
        `${config.title}`,
        `Mode: ${mode === 'add' ? 'Add tax' : 'Remove tax'}`,
        `Tax rate: ${rateValue}%`,
        `Net amount: ${formatCurrencyAmount(result.netAmount, currency)}`,
        `Tax amount: ${formatCurrencyAmount(result.taxAmount, currency)}`,
        `Gross amount: ${formatCurrencyAmount(result.grossAmount, currency)}`,
        `Formula: ${formulaText}`,
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
          {config.title}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
          {config.description}
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
                {modeOption === 'add' ? 'Add tax' : 'Remove tax'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
                Amount
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
                Tax rate
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
              Currency
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
              Tax rate presets
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
                  {preset.description ? (
                    <span className="mt-1 block text-xs leading-4 text-slate-500 dark:text-slate-400">
                      {preset.description}
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
                Result
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {mode === 'add' ? 'Input is treated as net amount.' : 'Input is treated as gross amount.'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:text-cyan-700 dark:border-slate-700 dark:bg-[#282c34] dark:text-slate-300 dark:hover:text-cyan-300"
              aria-label="Reset calculator"
              title="Reset"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          {result ? (
            <>
              <div className="rounded-lg border border-slate-200 bg-white px-4 dark:border-slate-700 dark:bg-[#282c34]">
                <ResultRow label="Net amount" value={formatCurrencyAmount(result.netAmount, currency)} />
                <ResultRow label="Tax amount" value={formatCurrencyAmount(result.taxAmount, currency)} />
                <ResultRow label="Gross amount" value={formatCurrencyAmount(result.grossAmount, currency)} tone="accent" />
              </div>

              <div className="mt-4 rounded-lg border border-cyan-100 bg-cyan-50 p-4 text-sm leading-6 text-cyan-950 dark:border-cyan-900/60 dark:bg-cyan-950/20 dark:text-cyan-100">
                <span className="block font-semibold">Formula</span>
                <span className="mt-1 block font-mono text-xs sm:text-sm">{formulaText}</span>
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-cyan-700 dark:bg-cyan-600 dark:hover:bg-cyan-500"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied' : 'Copy result'}
              </button>
            </>
          ) : (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700 dark:border-red-900/60 dark:bg-red-950/20 dark:text-red-200">
              Fix the highlighted input before viewing the calculation result.
            </div>
          )}
        </aside>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.55fr)]">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
            {config.formulaHeading}
          </h2>
          <p className="text-sm leading-7 text-slate-600 dark:text-slate-400">
            {config.explainer}
          </p>
          <div className="rounded-lg border border-slate-200 bg-white p-4 font-mono text-sm leading-7 text-slate-800 dark:border-slate-700 dark:bg-[#282c34] dark:text-slate-200">
            <div>Add tax: gross = net x (1 + rate)</div>
            <div>Remove tax: net = gross / (1 + rate)</div>
            <div>Tax amount: gross - net</div>
          </div>
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/20 dark:text-amber-100">
          <strong className="block">Disclaimer</strong>
          <span className="mt-2 block">{TAX_DISCLAIMER}</span>
        </div>
      </section>

      {config.source ? (
        <section className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-[#282c34]">
          <h2 className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
            UK VAT rate source
          </h2>
          <dl className="mt-4 grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
            <div>
              <dt className="font-semibold text-slate-900 dark:text-slate-100">Source</dt>
              <dd className="mt-1">
                <a
                  href={config.source.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-700 underline-offset-4 hover:underline dark:text-cyan-300"
                >
                  {config.source.sourceName}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900 dark:text-slate-100">Last checked</dt>
              <dd className="mt-1 text-slate-600 dark:text-slate-400">{config.source.lastChecked}</dd>
            </div>
            {config.source.effectiveDate ? (
              <div>
                <dt className="font-semibold text-slate-900 dark:text-slate-100">Effective date</dt>
                <dd className="mt-1 text-slate-600 dark:text-slate-400">{config.source.effectiveDate}</dd>
              </div>
            ) : null}
            {config.source.note ? (
              <div>
                <dt className="font-semibold text-slate-900 dark:text-slate-100">Note</dt>
                <dd className="mt-1 text-slate-600 dark:text-slate-400">{config.source.note}</dd>
              </div>
            ) : null}
          </dl>
        </section>
      ) : null}

      <section className="border-t border-slate-200 pt-7 dark:border-slate-800">
        <h2 className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
          Frequently asked questions
        </h2>
        <div className="mt-5 space-y-5">
          {config.faqs.map((faq) => (
            <div key={faq.question} className="border-b border-slate-200 pb-5 last:border-b-0 dark:border-slate-800">
              <h3 className="text-base font-semibold text-slate-950 dark:text-white">{faq.question}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <ToolSEOCard toolKey={config.toolKey} />
    </div>
  );
};

export default TaxCalculator;
