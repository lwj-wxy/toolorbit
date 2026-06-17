import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Copy, Check } from 'lucide-react';
import { cn } from '../../../lib/utils';

export default function UrlEncoder() {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);
  const errorMessage = t('tools.url-encoder.errorMsg');
  const hasError = output === errorMessage;

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
      setOutput(errorMessage);
    }
  };

  const copyToClipboard = () => {
    if (!output || hasError) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {t('tools.url-encoder.title', { mode: mode === 'encode' ? t('tools.url-encoder.encode') : t('tools.url-encoder.decode') })}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {t('tools.url-encoder.subtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="block text-sm font-semibold leading-6 text-slate-900">
              {t('tools.url-encoder.inputLabel')}
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex rounded-lg bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => { setMode('encode'); processText(input, 'encode'); }}
                  className={cn(
                    'rounded-md px-3 py-1.5 text-xs font-semibold transition-colors duration-200',
                    mode === 'encode' ? 'bg-white text-cyan-700 shadow-sm' : 'text-slate-500 hover:text-slate-900',
                  )}
                >
                  {t('tools.url-encoder.encodeBtn')}
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('decode'); processText(input, 'decode'); }}
                  className={cn(
                    'rounded-md px-3 py-1.5 text-xs font-semibold transition-colors duration-200',
                    mode === 'decode' ? 'bg-white text-cyan-700 shadow-sm' : 'text-slate-500 hover:text-slate-900',
                  )}
                >
                  {t('tools.url-encoder.decodeBtn')}
                </button>
              </div>
            </div>
          </div>
          <div className="relative flex-1">
            <textarea
              value={input}
              spellCheck={false}
              onChange={(event) => processText(event.target.value, mode)}
              className="custom-scrollbar block h-[500px] w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-3 font-mono text-sm leading-6 text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-cyan-500"
              placeholder={mode === 'encode' ? t('tools.url-encoder.placeholderEncode') : t('tools.url-encoder.placeholderDecode')}
            />
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold leading-6 text-slate-900">
              {t('tools.url-encoder.outputLabel')}
            </label>
            <button
              type="button"
              onClick={copyToClipboard}
              disabled={!output || hasError}
              className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors duration-200 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
              {copied ? t('tools.url-encoder.copiedBtn') : t('tools.url-encoder.copyBtn')}
            </button>
          </div>
          <div className="relative flex-1">
            <textarea
              readOnly
              spellCheck={false}
              value={hasError ? '' : output}
              className={cn(
                'custom-scrollbar block h-[500px] w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm leading-6 text-slate-900 shadow-sm outline-none',
                hasError && 'border-red-300 bg-red-50 text-red-900',
              )}
              placeholder={t('tools.url-encoder.placeholderEncode')}
            />
            {hasError && (
              <div className="absolute inset-x-0 bottom-0 rounded-b-lg border-t border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                {errorMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
