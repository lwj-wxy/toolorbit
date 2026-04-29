import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileCode2, Trash2, Copy, Check, ArrowRightLeft } from 'lucide-react';

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
      const unescaped = unicodeText.replace(/\\u([0-9a-fA-F]{4})/g, (match, grp) => {
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

      <div className="flex flex-col lg:flex-row gap-4 items-stretch min-h-[500px]">
        
        {/* Left Side: Native Text */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[#1e293b] flex items-center gap-2">
                    <span className="w-2 h-6 bg-[#2563eb] rounded-sm block"></span>
                    {t('tools.unicode-converter.nativeHeader')}
                </h3>
                <button
                  onClick={() => copyText(nativeText, 'native')}
                  className="p-1.5 text-[#64748b] hover:text-[#2563eb] hover:bg-blue-50 rounded-md transition-colors"
                  title={t('tools.unicode-converter.copyTitle')}
                >
                  {copiedNative ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                </button>
            </div>
            <textarea
                value={nativeText}
                onChange={(e) => onNativeChange(e.target.value)}
                placeholder={t('tools.unicode-converter.nativePlaceholder')}
                className="flex-1 w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-4 outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all resize-none shadow-inner"
            ></textarea>
        </div>

        {/* Center: Action Buttons */}
        <div className="flex lg:flex-col justify-center items-center gap-4 py-4 lg:py-0">
            <button
               onClick={handleEncode}
               className="w-full lg:w-auto px-6 py-3 lg:px-4 lg:py-4 bg-[#2563eb] text-white hover:bg-[#1d4ed8] rounded-xl shadow-lg transition-transform hover:scale-105 group font-bold flex flex-row lg:flex-col items-center gap-2"
               title={t('tools.unicode-converter.encodeBtn')}
            >
               <span className="text-sm">{t('tools.unicode-converter.encodeBtn')}</span>
               <ArrowRightLeft className="w-5 h-5 hidden lg:block rotate-90 lg:rotate-0" />
               <span className="lg:hidden">{t('tools.unicode-converter.encodeTo')}</span>
            </button>
            
            <button
               onClick={handleDecode}
               className="w-full lg:w-auto px-6 py-3 lg:px-4 lg:py-4 bg-white text-[#2563eb] border-2 border-[#2563eb] hover:bg-blue-50 rounded-xl shadow-sm transition-transform hover:scale-105 group font-bold flex flex-row lg:flex-col items-center gap-2"
               title={t('tools.unicode-converter.decodeBtn')}
            >
               <span className="lg:hidden">{t('tools.unicode-converter.decodeFrom')}</span>
               <ArrowRightLeft className="w-5 h-5 hidden lg:block rotate-90 lg:rotate-180" />
               <span className="text-sm">{t('tools.unicode-converter.decodeBtn')}</span>
            </button>
        </div>

        {/* Right Side: Unicode Text */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[#1e293b] flex items-center gap-2">
                    <span className="w-2 h-6 bg-purple-500 rounded-sm block"></span>
                    {t('tools.unicode-converter.unicodeHeader')}
                </h3>
                <button
                  onClick={() => copyText(unicodeText, 'unicode')}
                  className="p-1.5 text-[#64748b] hover:text-[#2563eb] hover:bg-blue-50 rounded-md transition-colors"
                  title={t('tools.unicode-converter.copyTitle')}
                >
                  {copiedUnicode ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                </button>
            </div>
            <textarea
                value={unicodeText}
                onChange={(e) => onUnicodeChange(e.target.value)}
                placeholder={t('tools.unicode-converter.unicodePlaceholder')}
                className="flex-1 w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-4 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none shadow-inner font-mono text-[#0f172a] text-[15px]"
            ></textarea>
        </div>
      </div>
    </div>
  );
}
