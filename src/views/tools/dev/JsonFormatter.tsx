import { useEffect, useState } from 'react';
import { Check, Copy, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { analytics } from '../../../services/analytics';
import ToolSEOCard from '../../../components/ToolSEOCard';
import { cn } from '../../../lib/utils';

export default function JsonFormatter() {
  const { t, i18n } = useTranslation();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isFormatting, setIsFormatting] = useState(false);
  const [spaces, setSpaces] = useState<2 | 4>(2);
  const isZh = i18n.language?.startsWith('zh');

  const runFormat = (value: string, indent: number) => {
    try {
      if (!value.trim()) {
        setOutput('');
        setError(null);
        return;
      }
      const parsed = JSON.parse(value);
      setOutput(JSON.stringify(parsed, null, indent));
      setError(null);
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : 'Invalid JSON';
      setError(errorMsg);
      setOutput('');
    }
  };

  useEffect(() => {
    if (!input.trim()) {
      setOutput('');
      setError(null);
      setIsFormatting(false);
      return;
    }

    setIsFormatting(true);
    const timer = window.setTimeout(() => {
      runFormat(input, spaces);
      setIsFormatting(false);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [input, spaces]);

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    analytics.trackEvent({
      category: 'Dev Tools',
      action: 'Copy JSON Output',
      metadata: { outputLength: output.length }
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const switchSpaces = (nextSpaces: 2 | 4) => {
    setSpaces(nextSpaces);
    analytics.trackEvent({
      category: 'Dev Tools',
      action: 'Format JSON',
      label: `spaces-${nextSpaces}`,
      metadata: { inputLength: input.length },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
            {t('tools.json-formatter.title')}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            {t('tools.json-formatter.subtitle')}
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-[12px] font-semibold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          {isZh ? '浏览器本地处理，不上传 JSON' : 'Runs locally. JSON is not uploaded.'}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Input */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
              {t('tools.json-formatter.inputLabel')}
            </label>
            <div className="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => switchSpaces(2)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-xs font-semibold transition-colors duration-200',
                  spaces === 2 ? 'bg-white text-cyan-700 shadow-sm dark:bg-slate-950 dark:text-cyan-300' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white',
                )}
              >
                {t('tools.json-formatter.btnFormat2')}
              </button>
              <button
                type="button"
                onClick={() => switchSpaces(4)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-xs font-semibold transition-colors duration-200',
                  spaces === 4 ? 'bg-white text-cyan-700 shadow-sm dark:bg-slate-950 dark:text-cyan-300' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white',
                )}
              >
                {t('tools.json-formatter.btnFormat4')}
              </button>
            </div>
          </div>
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="block h-[500px] w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-3 font-mono text-sm leading-6 text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-cyan-500 dark:border-slate-700 dark:bg-[#282c34] dark:text-slate-100"
              placeholder={t('tools.json-formatter.placeholder')}
            />
          </div>
        </div>

        {/* Output */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
              {t('tools.json-formatter.outputLabel')}
              </label>
              {isFormatting ? (
                <span className="text-[12px] font-medium text-cyan-700 dark:text-cyan-300">
                  {t('tools.json-formatter.formatting') || 'Formatting...'}
                </span>
              ) : null}
            </div>
            <button 
              onClick={copyToClipboard}
              disabled={!output}
              className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors duration-200 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-[#282c34] dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {copied ? <Check size={14} className="text-green-500"/> : <Copy size={14} />}
              {copied ? t('tools.json-formatter.btnCopied') : t('tools.json-formatter.btnCopy')}
            </button>
          </div>
          <div className="flex-1 relative">
            <textarea
              readOnly
              value={output}
              className={cn(
                'block h-[500px] w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm leading-6 text-slate-900 shadow-sm outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100',
                error && 'border-red-300 bg-red-50 text-red-900 dark:border-red-900/70 dark:bg-red-950/20 dark:text-red-200',
              )}
            />
            {error && (
              <div className="absolute inset-x-0 bottom-0 rounded-b-lg border-t border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 dark:border-red-900/70 dark:bg-red-950/90 dark:text-red-200">
                {t('tools.json-formatter.errorTitle', { error })}
              </div>
            )}
          </div>
        </div>
      </div>
      <ToolSEOCard toolKey="json-formatter" />
    </div>
  );
}
