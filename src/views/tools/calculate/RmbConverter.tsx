import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import ToolSEOCard from '../../../components/ToolSEOCard';
import { useTranslation } from 'react-i18next';
import { analytics } from '../../../services/analytics';

const upperNumbers = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
const upperUnits = ['', '拾', '佰', '仟'];
const bigUnits = ['', '万', '亿', '兆'];
const decimals = ['角', '分'];

function convertToRMB(amount: string, errorMessages: { invalid: string, tooLarge: string }): string {
  if (!amount) return '';
  const num = parseFloat(amount.replace(/,/g, ''));
  if (isNaN(num)) return errorMessages.invalid;
  if (num >= 9999999999999.99) return errorMessages.tooLarge;
  if (num === 0) return '零元整';

  const parts = Number(num).toFixed(2).split('.');
  const intPart = parts[0];
  const decPart = parts[1];

  let result = '';

  // Process integer part
  if (parseInt(intPart, 10) > 0) {
    let zeroCount = 0;
    for (let i = 0; i < intPart.length; i++) {
       const p = intPart.length - i - 1;
       const digit = parseInt(intPart[i], 10);
       const quotient = Math.floor(p / 4);
       const remainder = p % 4;

       if (digit === 0) {
          zeroCount++;
       } else {
          if (zeroCount > 0) {
             result += upperNumbers[0];
          }
          zeroCount = 0;
          result += upperNumbers[digit] + upperUnits[remainder];
       }

       if (remainder === 0 && zeroCount < 4) {
          result += bigUnits[quotient];
       }

       if (remainder === 0) {
          zeroCount = 0;
       }
    }
    result += '元';
  }

  // Process decimal part
  if (decPart === '00') {
    result += '整';
  } else {
    for (let i = 0; i < decPart.length; i++) {
        const digit = parseInt(decPart[i], 10);
        if (digit !== 0) {
           result += upperNumbers[digit] + decimals[i];
        } else if (i === 0 && decPart[1] !== '0' && intPart !== '0') {
           result += '零';
        }
    }
  }

  return result || '零元整';
}

export default function RmbConverter() {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  const formatInput = (val: string) => {
    // Only allow numbers and one decimal dot
    const clean = val.replace(/[^\d.]/g, '');
    const dotIndex = clean.indexOf('.');
    if (dotIndex !== -1) {
       return clean.slice(0, dotIndex + 1) + clean.slice(dotIndex + 1).replace(/\./g, '').substring(0, 2);
    }
    // limit max length roughly 13 digits
    return clean.substring(0, 13);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const formatted = formatInput(e.target.value);
     setInput(formatted);
     if (formatted.length > 5) {
       analytics.trackEvent({
         category: 'Finance Tools',
         action: 'Input RMB',
         value: parseFloat(formatted) || 0
       });
     }
  };

  const output = convertToRMB(input, {
    invalid: t('tools.rmb-converter.errors.invalid'),
    tooLarge: t('tools.rmb-converter.errors.tooLarge')
  });

  const copyToClipboard = () => {
    if (!output || output.includes(t('tools.rmb-converter.errors.tooLarge')) || output.includes(t('tools.rmb-converter.errors.invalid'))) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    analytics.trackEvent({
      category: 'Finance Tools',
      action: 'Copy RMB Result',
      label: input
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{t('tools.rmb-converter.title')}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            {t('tools.rmb-converter.subtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col space-y-3">
          <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
            {t('tools.rmb-converter.inputLabel')}
          </label>
          <div className="flex h-[500px] flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#282c34]">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-slate-400 transition-colors">¥</span>
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="例如: 12345.67"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-4 pl-10 pr-4 font-mono text-2xl font-semibold text-slate-900 outline-none transition-colors placeholder:text-slate-300 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {[100, 1000, 10000, 100000, 1000000].map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setInput(val.toString())}
                  className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-cyan-950/20"
                >
                  {t('tools.rmb-converter.quickFill', { val: val.toLocaleString() })}
                </button>
              ))}
            </div>

            <div className="mt-auto rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
              <div className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{t('tools.rmb-converter.resultLabel')}</div>
              <div className="mt-3 min-h-[80px] text-lg font-semibold leading-8 tracking-widest text-slate-500 dark:text-slate-300">
                {input ? output : t('tools.rmb-converter.waitingMsg')}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
              {t('tools.rmb-converter.resultLabel')}
            </label>
            <button
              type="button"
              onClick={copyToClipboard}
              disabled={!input}
              className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-[#282c34] dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? t('tools.rmb-converter.copiedBtn') : t('tools.rmb-converter.copyBtn')}
            </button>
          </div>
          <div className="flex h-[500px] items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <span className={`text-center text-2xl font-semibold leading-relaxed tracking-widest md:text-3xl ${input ? 'text-cyan-700 dark:text-cyan-300' : 'text-slate-300 dark:text-slate-600'}`}>
              {input ? output : t('tools.rmb-converter.waitingMsg')}
            </span>
          </div>
        </div>
      </div>

      <ToolSEOCard toolKey="rmb-converter" />
    </div>
  );
}
