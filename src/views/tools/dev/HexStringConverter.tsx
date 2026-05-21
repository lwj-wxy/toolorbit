import { useState } from 'react';
import { ArrowRightLeft, Copy, CheckCircle2, Trash2, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ToolSEOCard from '../../../components/ToolSEOCard';

export default function HexStringConverter() {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [hex, setHex] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const textToHex = (str: string) => {
    try {
      return Array.from(new TextEncoder().encode(str))
        .map(b => b.toString(16).padStart(2, '0'))
        .join(' ');
    } catch { return ''; }
  };

  const hexToText = (hexStr: string) => {
    try {
      const cleanHex = hexStr.replace(/[^0-9a-fA-F]/g, '');
      if (cleanHex.length % 2 !== 0) return null;
      
      const bytes = new Uint8Array(cleanHex.length / 2);
      for (let i = 0; i < cleanHex.length; i += 2) {
        bytes[i / 2] = parseInt(cleanHex.substr(i, 2), 16);
      }
      return new TextDecoder().decode(bytes);
    } catch { return null; }
  };

  const handleTextChange = (val: string) => {
    setText(val);
    setHex(textToHex(val));
    setError(null);
  };

  const handleHexChange = (val: string) => {
    setHex(val);
    const decoded = hexToText(val);
    if (decoded === null && val.trim().length > 0) {
      setError(t('tools.hex-string-converter.errorInvalid'));
    } else {
      setText(decoded || '');
      setError(null);
    }
  };

  const handleCopy = (val: string) => {
    if (!val) return;
    navigator.clipboard.writeText(val);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{t('tools.hex-string-converter.title')}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            {t('tools.hex-string-converter.subtitle')}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">{t('tools.hex-string-converter.textLabel')}</label>
              <button
                onClick={() => handleCopy(text)}
                className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-[#282c34] dark:text-slate-200 dark:hover:bg-slate-800"
                title={t('tools.hex-string-converter.copyText')}
              >
                {copied ? <CheckCircle2 size={14} className="text-green-500" /> : <Copy size={14} />}
              </button>
            </div>
            <textarea
              value={text}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder={t('tools.hex-string-converter.textPlaceholder')}
              className="block h-[500px] w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-3 font-mono text-sm leading-6 text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-cyan-500 dark:border-slate-700 dark:bg-[#282c34] dark:text-slate-100"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">{t('tools.hex-string-converter.hexLabel')}</label>
              <button
                onClick={() => handleCopy(hex)}
                className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-[#282c34] dark:text-slate-200 dark:hover:bg-slate-800"
                title={t('tools.hex-string-converter.copyHex')}
              >
                {copied ? <CheckCircle2 size={14} className="text-green-500" /> : <Copy size={14} />}
              </button>
            </div>
            <div className="relative">
              <textarea
                value={hex}
                onChange={(e) => handleHexChange(e.target.value)}
                placeholder={t('tools.hex-string-converter.hexPlaceholder')}
                className="block h-[500px] w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm leading-6 text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
              {error && (
                <div className="absolute inset-x-0 bottom-0 rounded-b-lg border-t border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 dark:border-red-900/70 dark:bg-red-950/90 dark:text-red-200">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900 sm:flex-row">
           <div className="flex items-center gap-3">
             <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 dark:border-slate-700 dark:bg-[#282c34]">
                <ArrowRightLeft size={18} />
             </div>
             <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
               {t('tools.hex-string-converter.statusMsg')}
             </p>
           </div>
           <button
             onClick={() => { setText(''); setHex(''); setError(null); }}
             className="flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold text-slate-500 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/20"
           >
             <Trash2 size={16} /> {t('tools.hex-string-converter.clearBtn')}
           </button>
        </div>

        <div className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-5 dark:border-emerald-900/60 dark:bg-emerald-950/20">
          <div className="mb-3 flex items-center gap-2 font-semibold text-emerald-900 dark:text-emerald-200">
            <Info size={16} />
            <h4 className="text-sm">{t('tools.hex-string-converter.didYouKnowTitle')}</h4>
          </div>
          <p className="text-xs leading-relaxed text-emerald-700 dark:text-emerald-300">
            {t('tools.hex-string-converter.didYouKnowDesc')}
          </p>
        </div>
      </div>
      <ToolSEOCard toolKey="hex-string-converter" />
    </div>
  );
}
