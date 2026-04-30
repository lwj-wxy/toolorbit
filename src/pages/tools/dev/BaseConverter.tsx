import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Binary, ArrowRightLeft, Copy, Check } from 'lucide-react';
import ToolSEOCard from '../../../components/ToolSEOCard';

export default function BaseConverter() {
  const { t } = useTranslation();
  const [inputVal, setInputVal] = useState<string>('255');
  const [inputBase, setInputBase] = useState<number>(10);
  const [outputBase, setOutputBase] = useState<number>(16);
  const [outputVal, setOutputVal] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    convert();
  }, [inputVal, inputBase, outputBase]);

  const convert = () => {
    if (!inputVal) {
      setOutputVal('');
      setError('');
      return;
    }

    try {
      const validChars = getValidCharsForBase(inputBase);
      const regex = new RegExp(`^[${validChars}]+$`, 'i');
      
      const cleanInput = inputVal.trim();
      const isNegative = cleanInput.startsWith('-');
      const absInput = isNegative ? cleanInput.substring(1) : cleanInput;

      if (!regex.test(absInput)) {
         setError(t('tools.base-converter.errorInvalidChars', { base: inputBase }));
         setOutputVal('');
         return;
       }

      const decimalValue = parseBigInt(absInput, inputBase);
      
      let result = formatBigInt(decimalValue, outputBase);
      if (isNegative && result !== '0') {
         result = '-' + result;
      }

      setOutputVal(result.toUpperCase());
      setError('');
    } catch (err) {
      setError(t('tools.base-converter.errorGeneric'));
      setOutputVal('');
    }
  };

  const getValidCharsForBase = (base: number) => {
      const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      return chars.substring(0, base);
  };

  const parseBigInt = (str: string, base: number): bigint => {
      const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let result = BigInt(0);
      let multiplier = BigInt(1);
      const baseBig = BigInt(base);
      
      str = str.toUpperCase();
      for (let i = str.length - 1; i >= 0; i--) {
          const charVal = BigInt(chars.indexOf(str[i]));
          result += charVal * multiplier;
          multiplier *= baseBig;
      }
      return result;
  };

  const formatBigInt = (num: bigint, base: number): string => {
      if (num === BigInt(0)) return '0';
      const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let result = '';
      const baseBig = BigInt(base);
      
      while (num > BigInt(0)) {
          const remainder = Number(num % baseBig);
          result = chars[remainder] + result;
          num = num / baseBig;
      }
      return result;
  };

  const handleCopy = () => {
    if (!outputVal) return;
    navigator.clipboard.writeText(outputVal).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const swapBases = () => {
      const tempBase = inputBase;
      setInputBase(outputBase);
      setOutputBase(tempBase);
      if (outputVal && !error) {
          setInputVal(outputVal);
      }
  };

  const COMMON_BASES = [
      { value: 2, label: t('tools.base-converter.base2') },
      { value: 8, label: t('tools.base-converter.base8') },
      { value: 10, label: t('tools.base-converter.base10') },
      { value: 16, label: t('tools.base-converter.base16') },
      { value: 32, label: t('tools.base-converter.base32') },
      { value: 36, label: t('tools.base-converter.base36') }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-[#2563eb] rounded-xl flex items-center justify-center shrink-0">
            <Binary className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('tools.base-converter.title')}</h1>
            <p className="text-[#64748b] mt-1 text-sm md:text-base">
              {t('tools.base-converter.subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 lg:p-10 relative">
          
          <div className="grid grid-cols-1 lg:grid-cols-11 gap-6 items-stretch">
              
              <div className="col-span-1 lg:col-span-5 flex flex-col">
                  <div className="mb-4">
                      <label className="block text-sm font-bold text-[#475569] mb-2 flex items-center justify-between">
                          <span>{t('tools.base-converter.inputLabel')}</span>
                          <span className="text-[#94a3b8] font-normal">{inputVal.length} {t('tools.base-converter.chars')}</span>
                      </label>
                      <textarea
                        value={inputVal}
                        onChange={(e) => setInputVal(e.target.value)}
                        placeholder={t('tools.base-converter.inputPlaceholder')}
                        className="w-full h-32 bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-4 font-mono text-lg outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all resize-none uppercase"
                        spellCheck={false}
                      />
                      {error && <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>}
                  </div>
                  
                  <div>
                      <label className="block text-sm font-bold text-[#475569] mb-2">{t('tools.base-converter.sourceBaseLabel')}</label>
                      <select 
                          value={inputBase}
                          onChange={(e) => setInputBase(parseInt(e.target.value))}
                          className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-4 py-3 outline-none focus:border-[#2563eb]"
                      >
                          {COMMON_BASES.map(b => (
                              <option key={`in-${b.value}`} value={b.value}>{b.label}</option>
                          ))}
                          <option disabled>──────</option>
                          {Array.from({length: 35}, (_, i) => i + 2).filter(v => !COMMON_BASES.find(cb => cb.value === v)).map(v => (
                              <option key={`in-other-${v}`} value={v}>{v} {t('tools.base-converter.baseSuffix')}</option>
                          ))}
                      </select>
                  </div>
              </div>

              <div className="col-span-1 flex flex-col items-center justify-center">
                  <button 
                      onClick={swapBases}
                      className="w-12 h-12 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-slate-600 rounded-full flex items-center justify-center transition-colors shadow-sm border border-slate-200"
                      title={t('tools.base-converter.swapTitle')}
                  >
                     <ArrowRightLeft className="w-5 h-5 lg:rotate-0 rotate-90" />
                  </button>
              </div>

              <div className="col-span-1 lg:col-span-5 flex flex-col">
                  <div className="mb-4">
                      <label className="block text-sm font-bold text-[#475569] mb-2 flex items-center justify-between">
                          <span>{t('tools.base-converter.outputLabel')}</span>
                          {outputVal && (
                              <button 
                                  onClick={handleCopy}
                                  className="text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center gap-1 transition-colors"
                              >
                                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                  {copied ? t('tools.base-converter.copiedBtn') : t('tools.base-converter.copyBtn')}
                              </button>
                          )}
                      </label>
                      <div className="w-full h-32 bg-slate-800 border-none rounded-xl p-4 overflow-y-auto">
                          {outputVal ? (
                              <div className="font-mono text-emerald-400 text-lg break-all">
                                  {outputVal}
                              </div>
                          ) : (
                              <div className="font-mono text-slate-500 text-lg flex items-center justify-center h-full">
                                  {t('tools.base-converter.waiting')}
                              </div>
                          )}
                      </div>
                  </div>

                  <div>
                      <label className="block text-sm font-bold text-[#475569] mb-2">{t('tools.base-converter.targetBaseLabel')}</label>
                      <select 
                          value={outputBase}
                          onChange={(e) => setOutputBase(parseInt(e.target.value))}
                          className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-4 py-3 outline-none focus:border-[#2563eb]"
                      >
                          {COMMON_BASES.map(b => (
                              <option key={`out-${b.value}`} value={b.value}>{b.label}</option>
                          ))}
                          <option disabled>──────</option>
                          {Array.from({length: 35}, (_, i) => i + 2).filter(v => !COMMON_BASES.find(cb => cb.value === v)).map(v => (
                              <option key={`out-other-${v}`} value={v}>{v} {t('tools.base-converter.baseSuffix')}</option>
                          ))}
                      </select>
                  </div>
              </div>

          </div>
      </div>
    
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
              { in: 10, out: 2, label: t('tools.base-converter.quickDecToBin'), color: 'bg-indigo-50 border-indigo-100 text-indigo-700 hover:bg-indigo-100' },
              { in: 10, out: 16, label: t('tools.base-converter.quickDecToHex'), color: 'bg-fuchsia-50 border-fuchsia-100 text-fuchsia-700 hover:bg-fuchsia-100' },
              { in: 16, out: 10, label: t('tools.base-converter.quickHexToDec'), color: 'bg-amber-50 border-amber-100 text-amber-700 hover:bg-amber-100' },
              { in: 2, out: 10, label: t('tools.base-converter.quickBinToDec'), color: 'bg-emerald-50 border-emerald-100 text-emerald-700 hover:bg-emerald-100' },
          ].map((quick, idx) => (
             <button
                key={idx}
                onClick={() => {
                   setInputBase(quick.in);
                   setOutputBase(quick.out);
                }}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-colors shadow-sm ${quick.color}`}
             >
                <span className="font-bold">{quick.label}</span>
                <span className="text-xs opacity-70 mt-1 uppercase font-mono">Base {quick.in} → {quick.out}</span>
             </button>
          ))}
      </div>

      <ToolSEOCard toolKey="base-converter" />
    </div>
  );
}
