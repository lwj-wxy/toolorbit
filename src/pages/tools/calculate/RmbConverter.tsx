import { useState } from 'react';
import { Banknote, Copy, Check } from 'lucide-react';
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
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center shrink-0">
            <Banknote className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('tools.rmb-converter.title')}</h1>
            <p className="text-[#64748b] mt-1 text-sm md:text-base">
              {t('tools.rmb-converter.subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
           <div>
              <label className="block text-sm font-bold text-slate-700 mb-4">{t('tools.rmb-converter.inputLabel')}</label>
              <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg group-focus-within:text-red-500 transition-colors">¥</span>
                  <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="例如: 12345.67"
                    className="w-full pl-10 pr-4 py-4 text-2xl font-mono border-2 border-slate-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none transition-all placeholder:text-slate-200"
                  />
              </div>
           </div>
           
           <div className="flex flex-wrap gap-2">
              {[100, 1000, 10000, 100000, 1000000].map(val => (
                 <button
                   key={val}
                   onClick={() => setInput(val.toString())}
                   className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-500 hover:text-red-600 hover:border-red-200 rounded-lg text-xs font-bold transition-all"
                 >
                    {t('tools.rmb-converter.quickFill', { val: val.toLocaleString() })}
                 </button>
              ))}
           </div>
        </div>

        <div className="bg-slate-50 rounded-2xl shadow-inner border border-[#cbd5e1] p-6 lg:p-8 relative">
           <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-bold text-slate-700 uppercase tracking-widest">{t('tools.rmb-converter.resultLabel')}</label>
              <button 
                onClick={copyToClipboard}
                disabled={!input}
                className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 shadow-sm text-red-600 hover:bg-red-50 rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                {copied ? t('tools.rmb-converter.copiedBtn') : t('tools.rmb-converter.copyBtn')}
              </button>
           </div>
           <div className="min-h-[140px] flex items-center justify-center p-6 bg-white border-2 border-red-100 rounded-xl shadow-sm">
              <span className={`text-xl md:text-2xl lg:text-3xl font-bold tracking-widest text-center leading-relaxed ${input ? 'text-red-700' : 'text-slate-200'}`}>
                 {input ? output : t('tools.rmb-converter.waitingMsg')}
              </span>
           </div>
        </div>
      </div>

      {/* SEO Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8 lg:p-12 mt-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">{t('tools.rmb-converter.seoTitle')}</h2>
        
        <p className="text-slate-600 mb-8 leading-relaxed">
          {t('tools.rmb-converter.seoDesc')}
        </p>

        <h3 className="font-bold text-slate-800 text-lg mb-6">{t('tools.rmb-converter.whyTitle')}</h3>
        <ul className="space-y-6 text-slate-600 text-sm">
          <li className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0 font-bold">1</div>
            <div>
              <strong className="text-slate-800 block mb-1">{t('tools.rmb-converter.highlight1Title')}</strong>
              <span>{t('tools.rmb-converter.highlight1Desc')}</span>
            </div>
          </li>
          <li className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0 font-bold">2</div>
            <div>
              <strong className="text-slate-800 block mb-1">{t('tools.rmb-converter.highlight2Title')}</strong>
              <span>{t('tools.rmb-converter.highlight2Desc')}</span>
            </div>
          </li>
          <li className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0 font-bold">3</div>
            <div>
              <strong className="text-slate-800 block mb-1">{t('tools.rmb-converter.highlight3Title')}</strong>
              <span>{t('tools.rmb-converter.highlight3Desc')}</span>
            </div>
          </li>
        </ul>
        
        <p className="text-slate-400 text-xs mt-12 pt-8 border-t border-slate-100 text-center italic">
          {t('tools.rmb-converter.seoFooter')}
        </p>
      </div>

    </div>
  );
}
