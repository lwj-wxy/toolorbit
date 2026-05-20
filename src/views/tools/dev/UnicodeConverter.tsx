import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileCode2, Trash2, Copy, Check, ArrowRightLeft } from 'lucide-react';
import ToolSEOCard from '../../../components/ToolSEOCard';

export default function UnicodeConverter() {
  const { t } = useTranslation();
  const [nativeText, setNativeText] = useState('');
  const [unicodeText, setUnicodeText] = useState('');

  const [copiedNative, setCopiedNative] = useState(false);
  const [copiedUnicode, setCopiedUnicode] = useState(false);

  // Native -> Unicode (\uXXXX)
  const handleEncode = () => {
    if (!nativeText) return;
    const res = nativeText.split('').map((char) => {
      const code = char.charCodeAt(0).toString(16);
      return '\\u' + '0000'.substring(0, 4 - code.length) + code;
    }).join('');
    setUnicodeText(res);
  };

  // Unicode (\uXXXX) -> Native
  const handleDecode = () => {
    if (!unicodeText) return;
    try {
      // Decode unicode string back to native. Replacing all \\u sequences.
      // E.g. \u4e2d\u6587 -> 中文
      const unescaped = unicodeText.replace(/\\u([0-9a-fA-F]{4})/g, (_match, grp) => {
        return String.fromCharCode(parseInt(grp, 16));
      });
      setNativeText(unescaped);
    } catch (e) {
        alert(t('tools.unicode-converter.errorFormat'));
    }
  };

  // Convert on typing
  const onNativeChange = (val: string) => {
    setNativeText(val);
  };

  const onUnicodeChange = (val: string) => {
    setUnicodeText(val);
  };

  const clearAll = () => {
    setNativeText('');
    setUnicodeText('');
  };

  const copyText = (text: string, type: 'native' | 'unicode') => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      if (type === 'native') {
        setCopiedNative(true);
        setTimeout(() => setCopiedNative(false), 2000);
      } else {
        setCopiedUnicode(true);
        setTimeout(() => setCopiedUnicode(false), 2000);
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-[#2563eb] rounded-xl flex items-center justify-center shrink-0">
            <FileCode2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('tools.unicode-converter.title')}</h1>
            <p className="text-[#64748b] mt-1 text-sm md:text-base">
              {t('tools.unicode-converter.subtitle')}
            </p>
          </div>
        </div>
        <div>
            <button 
              onClick={clearAll}
              className="px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-lg flex items-center gap-2 transition-colors border border-transparent hover:border-red-100"
            >
              <Trash2 className="w-4 h-4" /> {t('tools.unicode-converter.clearBtn')}
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="block text-sm font-semibold leading-6 text-slate-900">
              {t('tools.unicode-converter.nativeHeader')}
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleEncode}
                className="inline-flex items-center gap-1 rounded-md border border-blue-600 bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors duration-200 hover:bg-blue-700"
                title={t('tools.unicode-converter.encodeBtn')}
              >
                {t('tools.unicode-converter.encodeBtn')}
                <ArrowRightLeft className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => copyText(nativeText, 'native')}
                disabled={!nativeText}
                className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors duration-200 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                title={t('tools.unicode-converter.copyTitle')}
              >
                {copiedNative ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                {copiedNative ? t('tools.unicode-converter.copiedBtn', { defaultValue: 'Copied' }) : t('tools.unicode-converter.copyTitle')}
              </button>
            </div>
          </div>
          <div className="relative flex-1">
            <textarea
              value={nativeText}
              onChange={(event) => onNativeChange(event.target.value)}
              placeholder={t('tools.unicode-converter.nativePlaceholder')}
              className="block h-[500px] w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="block text-sm font-semibold leading-6 text-slate-900">
              {t('tools.unicode-converter.unicodeHeader')}
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleDecode}
                className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors duration-200 hover:bg-slate-50"
                title={t('tools.unicode-converter.decodeBtn')}
              >
                <ArrowRightLeft className="h-3.5 w-3.5" />
                {t('tools.unicode-converter.decodeBtn')}
              </button>
              <button
                type="button"
                onClick={() => copyText(unicodeText, 'unicode')}
                disabled={!unicodeText}
                className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors duration-200 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                title={t('tools.unicode-converter.copyTitle')}
              >
                {copiedUnicode ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                {copiedUnicode ? t('tools.unicode-converter.copiedBtn', { defaultValue: 'Copied' }) : t('tools.unicode-converter.copyTitle')}
              </button>
            </div>
          </div>
          <div className="relative flex-1">
            <textarea
              value={unicodeText}
              onChange={(event) => onUnicodeChange(event.target.value)}
              placeholder={t('tools.unicode-converter.unicodePlaceholder')}
              className="block h-[500px] w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm leading-6 text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-cyan-500"
            />
          </div>
        </div>
      </div>
      <ToolSEOCard toolKey="unicode-converter" />
    </div>
  );
}
