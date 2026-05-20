import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowDownUp, Check, Copy, ShieldCheck } from 'lucide-react';
import ToolSEOCard from '../../../components/ToolSEOCard';
import { cn } from '../../../lib/utils';

export default function Base64() {
  const { t, i18n } = useTranslation();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const isZh = i18n.language?.startsWith('zh');

  const processText = (text: string, currentMode: 'encode' | 'decode') => {
    setInput(text);
    if (!text.trim()) {
      setOutput('');
      setError(null);
      return;
    }

    try {
      if (currentMode === 'encode') {
        // Handle utf-8 encoding safely
        const utf8Bytes = new TextEncoder().encode(text);
        const binaryStr = Array.from(utf8Bytes).map(b => String.fromCharCode(b)).join('');
        setOutput(btoa(binaryStr));
      } else {
        const binaryStr = atob(text);
        const bytes = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i++) {
          bytes[i] = binaryStr.charCodeAt(i);
        }
        setOutput(new TextDecoder().decode(bytes));
      }
      setError(null);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('Invalid format');
      }
      setOutput('');
    }
  };

  const toggleMode = () => {
    const newMode = mode === 'encode' ? 'decode' : 'encode';
    setMode(newMode);
    processText(input, newMode);
  };

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
            {t('tools.base64.title', { mode: mode === 'encode' ? t('tools.base64.encode') : t('tools.base64.decode') })}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            {t('tools.base64.subtitle')}
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-[12px] font-semibold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          {isZh ? '浏览器本地实时编解码' : 'Real-time local encode/decode'}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
              {mode === 'encode' ? t('tools.base64.textInput') : t('tools.base64.base64Input')}
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
                <button
                  type="button"
                  onClick={() => { setMode('encode'); processText(input, 'encode'); }}
                  className={cn(
                    'rounded-md px-3 py-1.5 text-xs font-semibold transition-colors duration-200',
                    mode === 'encode' ? 'bg-white text-cyan-700 shadow-sm dark:bg-slate-950 dark:text-cyan-300' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white',
                  )}
                >
                  {t('tools.base64.encodeBtn')}
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('decode'); processText(input, 'decode'); }}
                  className={cn(
                    'rounded-md px-3 py-1.5 text-xs font-semibold transition-colors duration-200',
                    mode === 'decode' ? 'bg-white text-cyan-700 shadow-sm dark:bg-slate-950 dark:text-cyan-300' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white',
                  )}
                >
                  {t('tools.base64.decodeBtn')}
                </button>
              </div>
              <button
                type="button"
                onClick={toggleMode}
                className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors duration-200 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#282c34] dark:text-slate-200 dark:hover:bg-slate-800"
                title="Swap input mode"
              >
                <ArrowDownUp size={14} />
                {t('tools.base64.swapBtn')}
              </button>
            </div>
          </div>
          <div className="relative flex-1">
            <textarea
              spellCheck={false}
              value={input}
              onChange={(event) => processText(event.target.value, mode)}
              className="custom-scrollbar block h-[500px] w-full resize-none break-all rounded-lg border border-slate-200 bg-white px-4 py-3 font-mono text-sm leading-6 text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-cyan-500 dark:border-slate-700 dark:bg-[#282c34] dark:text-slate-100"
              placeholder={mode === 'encode' ? t('tools.base64.inputTextPlaceholder') : t('tools.base64.inputBase64Placeholder')}
            />
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
              {mode === 'encode' ? t('tools.base64.base64Output') : t('tools.base64.textOutput')}
            </label>
            <button
              type="button"
              onClick={copyToClipboard}
              disabled={!output}
              className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors duration-200 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-[#282c34] dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
              {copied ? t('tools.base64.copiedBtn') : t('tools.base64.copyBtn')}
            </button>
          </div>
          <div className="relative flex-1">
            <textarea
              spellCheck={false}
              readOnly
              value={error ? '' : output}
              className={cn(
                'custom-scrollbar block h-[500px] w-full resize-none break-all rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm leading-6 text-slate-900 shadow-sm outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100',
                error && 'border-red-300 bg-red-50 text-red-900 dark:border-red-900/70 dark:bg-red-950/20 dark:text-red-200',
              )}
              placeholder={t('tools.base64.outputPlaceholder')}
            />
            {error && (
              <div className="absolute inset-x-0 bottom-0 rounded-b-lg border-t border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 dark:border-red-900/70 dark:bg-red-950/90 dark:text-red-200">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
      <ToolSEOCard toolKey="base64" />
    </div>
  );
}
