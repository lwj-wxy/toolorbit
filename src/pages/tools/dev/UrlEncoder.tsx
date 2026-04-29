import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Copy, Check, ArrowDownUp } from 'lucide-react';

export default function UrlEncoder() {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);

  const processText = (text: string, currentMode: 'encode' | 'decode') => {
    setInput(text);
    if (!text.trim()) {
      setOutput('');
      return;
    }

    try {
      if (currentMode === 'encode') {
        setOutput(encodeURIComponent(text));
      } else {
        setOutput(decodeURIComponent(text));
      }
    } catch (e) {
      setOutput(t('tools.url-encoder.errorMsg'));
    }
  };

  const toggleMode = () => {
    const newMode = mode === 'encode' ? 'decode' : 'encode';
    setMode(newMode);
    processText(input, newMode);
  };

  const copyToClipboard = () => {
    if (!output || output === t('tools.url-encoder.errorMsg')) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            {t('tools.url-encoder.title', { mode: mode === 'encode' ? t('tools.url-encoder.encode') : t('tools.url-encoder.decode') })}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {t('tools.url-encoder.subtitle')}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="flex bg-gray-200 rounded-lg p-1">
            <button
              onClick={() => { setMode('encode'); processText(input, 'encode'); }}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                mode === 'encode' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {t('tools.url-encoder.encodeBtn')}
            </button>
            <button
              onClick={() => { setMode('decode'); processText(input, 'decode'); }}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                mode === 'decode' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {t('tools.url-encoder.decodeBtn')}
            </button>
          </div>
          
          <button 
            onClick={toggleMode}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200 rounded-md transition-colors font-medium"
          >
            <ArrowDownUp size={16} /> {t('tools.url-encoder.swapBtn')}
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('tools.url-encoder.inputLabel')}</label>
            <textarea
              value={input}
              spellCheck={false}
              onChange={(e) => processText(e.target.value, mode)}
              className="block w-full rounded-lg border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm font-mono resize-none bg-white min-h-[150px] custom-scrollbar"
              placeholder={mode === 'encode' ? t('tools.url-encoder.placeholderEncode') : t('tools.url-encoder.placeholderDecode')}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">{t('tools.url-encoder.outputLabel')}</label>
              <button 
                onClick={copyToClipboard}
                disabled={!output || output === t('tools.url-encoder.errorMsg')}
                className="inline-flex items-center gap-1 text-xs bg-white text-gray-700 border border-gray-300 px-3 py-1.5 rounded-md font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {copied ? <Check size={14} className="text-green-500"/> : <Copy size={14} />}
                {copied ? t('tools.url-encoder.copiedBtn') : t('tools.url-encoder.copyBtn')}
              </button>
            </div>
            
            <textarea
              readOnly
              spellCheck={false}
              value={output}
              className={`block w-full rounded-lg border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm font-mono resize-none bg-gray-50 min-h-[150px] ring-gray-300 custom-scrollbar`}
              placeholder={t('tools.url-encoder.placeholderEncode')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
