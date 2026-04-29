import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { analytics } from '../../../services/analytics';

export default function JsonFormatter() {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const formatJson = (spaces: number) => {
    try {
      if (!input.trim()) {
        setOutput('');
        setError(null);
        return;
      }
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, spaces));
      setError(null);

      analytics.trackEvent({
        category: 'Dev Tools',
        action: 'Format JSON',
        label: `spaces-${spaces}`,
        metadata: { inputLength: input.length }
      });
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : 'Invalid JSON';
      setError(errorMsg);
      analytics.trackEvent({
        category: 'Dev Tools',
        action: 'Format JSON Error',
        label: errorMsg.substring(0, 50)
      });
    }
  };

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            {t('tools.json-formatter.title')}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {t('tools.json-formatter.subtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium leading-6 text-gray-900">
              {t('tools.json-formatter.inputLabel')}
            </label>
            <div className="space-x-2">
              <button onClick={() => formatJson(2)} className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-md font-medium hover:bg-indigo-100 transition-colors">
                {t('tools.json-formatter.btnFormat2')}
              </button>
              <button onClick={() => formatJson(4)} className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-md font-medium hover:bg-indigo-100 transition-colors">
                {t('tools.json-formatter.btnFormat4')}
              </button>
            </div>
          </div>
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="block w-full h-[500px] rounded-lg border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-mono resize-none bg-white"
              placeholder={t('tools.json-formatter.placeholder')}
            />
          </div>
        </div>

        {/* Output */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium leading-6 text-gray-900">
              {t('tools.json-formatter.outputLabel')}
            </label>
            <button 
              onClick={copyToClipboard}
              disabled={!output}
              className="inline-flex items-center gap-1 text-xs bg-white text-gray-700 border border-gray-300 px-3 py-1.5 rounded-md font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {copied ? <Check size={14} className="text-green-500"/> : <Copy size={14} />}
              {copied ? t('tools.json-formatter.btnCopied') : t('tools.json-formatter.btnCopy')}
            </button>
          </div>
          <div className="flex-1 relative">
            <textarea
              readOnly
              value={output}
              className={`block w-full h-[500px] rounded-lg border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-mono resize-none bg-gray-50 ${
                error ? 'ring-red-300 text-red-900 bg-red-50 focus:ring-red-500' : 'ring-gray-300'
              }`}
            />
            {error && (
              <div className="absolute inset-x-0 bottom-0 p-4 bg-red-50 text-red-700 text-sm font-medium border-t border-red-200 rounded-b-lg">
                {t('tools.json-formatter.errorTitle', { error })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
