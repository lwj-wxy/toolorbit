import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRightLeft, Copy, Check } from 'lucide-react';

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
    <div className="space-y-6">
      
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{t('tools.base-converter.title')}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            {t('tools.base-converter.subtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
              {t('tools.base-converter.inputLabel')}
            </label>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{inputVal.length} {t('tools.base-converter.chars')}</span>
          </div>
          <div className="flex h-[500px] flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#282c34]">
            <textarea
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={t('tools.base-converter.inputPlaceholder')}
              className="block min-h-0 flex-1 resize-none rounded-lg border border-slate-200 bg-white px-4 py-3 font-mono text-lg leading-7 text-slate-900 shadow-sm outline-none uppercase placeholder:text-slate-400 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              spellCheck={false}
            />
            {error && <p className="mt-3 text-sm font-medium text-red-500">{error}</p>}
            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">{t('tools.base-converter.sourceBaseLabel')}</label>
              <select
                value={inputBase}
                onChange={(e) => setInputBase(parseInt(e.target.value))}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                {COMMON_BASES.map(b => (
                  <option key={`in-${b.value}`} value={b.value}>{b.label}</option>
                ))}
                <option disabled>------</option>
                {Array.from({length: 35}, (_, i) => i + 2).filter(v => !COMMON_BASES.find(cb => cb.value === v)).map(v => (
                  <option key={`in-other-${v}`} value={v}>{v} {t('tools.base-converter.baseSuffix')}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
              {t('tools.base-converter.outputLabel')}
            </label>
            <button
              type="button"
              onClick={handleCopy}
              disabled={!outputVal}
              className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-[#282c34] dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? t('tools.base-converter.copiedBtn') : t('tools.base-converter.copyBtn')}
            </button>
          </div>
          <div className="flex h-[500px] flex-col rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="min-h-0 flex-1 overflow-y-auto rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-[#282c34]">
              {outputVal ? (
                <div className="break-all font-mono text-lg leading-7 text-cyan-700 dark:text-cyan-300">
                  {outputVal}
                </div>
              ) : (
                <div className="flex h-full items-center justify-center font-mono text-lg text-slate-500">
                  {t('tools.base-converter.waiting')}
                </div>
              )}
            </div>
            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">{t('tools.base-converter.targetBaseLabel')}</label>
              <select
                value={outputBase}
                onChange={(e) => setOutputBase(parseInt(e.target.value))}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-cyan-500 dark:border-slate-700 dark:bg-[#282c34] dark:text-slate-100"
              >
                {COMMON_BASES.map(b => (
                  <option key={`out-${b.value}`} value={b.value}>{b.label}</option>
                ))}
                <option disabled>------</option>
                {Array.from({length: 35}, (_, i) => i + 2).filter(v => !COMMON_BASES.find(cb => cb.value === v)).map(v => (
                  <option key={`out-other-${v}`} value={v}>{v} {t('tools.base-converter.baseSuffix')}</option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={swapBases}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-[#282c34] dark:text-slate-200 dark:hover:bg-slate-800"
              title={t('tools.base-converter.swapTitle')}
            >
              <ArrowRightLeft className="h-4 w-4" />
              {t('tools.base-converter.swapTitle')}
            </button>
          </div>
        </div>
      </div>
    
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
              { in: 10, out: 2, label: t('tools.base-converter.quickDecToBin') },
              { in: 10, out: 16, label: t('tools.base-converter.quickDecToHex') },
              { in: 16, out: 10, label: t('tools.base-converter.quickHexToDec') },
              { in: 2, out: 10, label: t('tools.base-converter.quickBinToDec') },
          ].map((quick, idx) => (
             <button
                key={idx}
                onClick={() => {
                   setInputBase(quick.in);
                   setOutputBase(quick.out);
                }}
                className="flex flex-col items-center justify-center rounded-lg border border-slate-200 bg-white p-4 text-slate-700 shadow-sm transition-colors hover:border-cyan-300 hover:bg-cyan-50 dark:border-slate-700 dark:bg-[#282c34] dark:text-slate-200 dark:hover:bg-cyan-950/20"
             >
                <span className="font-bold">{quick.label}</span>
                <span className="text-xs opacity-70 mt-1 uppercase font-mono">Base {quick.in} → {quick.out}</span>
             </button>
          ))}
      </div>

    </div>
  );
}
