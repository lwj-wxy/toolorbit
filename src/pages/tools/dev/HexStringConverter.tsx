import React, { useState } from 'react';
import { FileCode, ArrowRightLeft, Copy, CheckCircle2, Trash2, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-100 text-white">
          <FileCode size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('tools.hex-string-converter.title')}</h1>
          <p className="text-slate-500 text-sm">{t('tools.hex-string-converter.subtitle')}</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('tools.hex-string-converter.textLabel')}</label>
              <button 
                onClick={() => handleCopy(text)}
                className="text-slate-400 hover:text-emerald-500 transition-colors"
                title={t('tools.hex-string-converter.copyText')}
              >
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg hover:bg-slate-50 transition-all">
                   {copied ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Copy size={16} />}
                </div>
              </button>
            </div>
            <textarea
              value={text}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder={t('tools.hex-string-converter.textPlaceholder')}
              className="w-full h-48 p-5 font-mono text-sm bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-200 transition-all resize-none outline-none"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('tools.hex-string-converter.hexLabel')}</label>
              <button 
                onClick={() => handleCopy(hex)}
                className="text-slate-400 hover:text-emerald-500 transition-colors"
                title={t('tools.hex-string-converter.copyHex')}
              >
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg hover:bg-slate-50 transition-all">
                   {copied ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Copy size={16} />}
                </div>
              </button>
            </div>
            <textarea
              value={hex}
              onChange={(e) => handleHexChange(e.target.value)}
              placeholder={t('tools.hex-string-converter.hexPlaceholder')}
              className="w-full h-48 p-5 font-mono text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-200 transition-all resize-none outline-none"
            />
            {error && <p className="text-[10px] text-red-500 font-bold uppercase">{error}</p>}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 justify-between bg-slate-50 p-6 rounded-3xl border border-slate-100">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-slate-400">
                <ArrowRightLeft size={18} />
             </div>
             <p className="text-sm text-slate-600 font-medium tracking-tight">
               {t('tools.hex-string-converter.statusMsg')}
             </p>
           </div>
           <button
             onClick={() => { setText(''); setHex(''); setError(null); }}
             className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all flex items-center gap-2"
           >
             <Trash2 size={16} /> {t('tools.hex-string-converter.clearBtn')}
           </button>
        </div>

        <div className="bg-emerald-50/50 rounded-3xl p-6 border border-emerald-100">
          <div className="flex items-center gap-2 mb-3 text-emerald-900 font-bold">
            <Info size={16} />
            <h4 className="text-sm">{t('tools.hex-string-converter.didYouKnowTitle')}</h4>
          </div>
          <p className="text-xs text-emerald-700 leading-relaxed">
            {t('tools.hex-string-converter.didYouKnowDesc')}
          </p>
        </div>
      </div>
    </div>
  );
}
