import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, Copy, Check, RotateCcw, FileSpreadsheet } from 'lucide-react';
import { motion } from 'motion/react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ToolSEOCard from '../../../components/ToolSEOCard';

export default function ExcelFormula() {
  const { t, i18n } = useTranslation();
  const [requirement, setRequirement] = useState('');
  const [formulaType, setFormulaType] = useState('excel');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  
  const formats = [
    { value: 'excel', label: 'Microsoft Excel' },
    { value: 'google-sheets', label: 'Google Sheets' },
  ];

  const handleGenerate = async () => {
    if (!requirement.trim()) return;
    
    setLoading(true);
    setResult('');
    setError('');
    
    try {
      const response = await fetch('/api/ai-excel-formula', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          requirement,
          formulaType,
          language: i18n.language
        })
      });
      
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'AI service is currently unavailable.');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error('Reader initialization failed');

      let isDone = false;
      while (!isDone) {
        const { value, done: streamDone } = await reader.read();
        isDone = streamDone;
        
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.error) throw new Error(data.error);
                if (data.content) {
                  setResult(prev => prev + data.content);
                }
              } catch (e) {
                if (e instanceof Error && e.message !== 'Unexpected end of JSON input') {
                  console.error('Parse error:', e);
                }
              }
            }
          }
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
        <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
          {t('tools.ai-excel-formula.title') || 'Smart Excel Formula'}
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
          {t('tools.ai-excel-formula.subtitle') || 'Describe what you want to calculate, and get the exact formula.'}
        </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="contents">
          <div className="contents">
            
            {/* Input Section */}
            <div className="flex h-[500px] flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#282c34]">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                   {t('tools.ai-excel-formula.requirement') || 'Requirement'}
                </label>
                <textarea
                  value={requirement}
                  onChange={(e) => setRequirement(e.target.value)}
                  placeholder={t('tools.ai-excel-formula.requirementPlaceholder') || 'e.g. Sum column B if...'}
                  className="w-full h-32 resize-none rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="mt-5">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t('tools.ai-excel-formula.formulaType') || 'Formula Type'}
                </label>
                <select
                  value={formulaType}
                  onChange={(e) => setFormulaType(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 outline-none transition-colors focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  {formats.map(fOption => (
                    <option key={fOption.value} value={fOption.value}>{fOption.label}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleGenerate}
                disabled={!requirement.trim() || loading}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                     <Loader2 className="w-5 h-5 animate-spin" />
                     {t('tools.ai-excel-formula.generating') || 'Generating...'}
                  </>
                ) : (
                  <>
                     <FileSpreadsheet className="w-5 h-5 group-hover:scale-110 transition-transform" />
                     {t('tools.ai-excel-formula.generateBtn') || 'Generate Formula'}
                  </>
                )}
              </button>
            </div>

            {/* Output Section */}
            <div className="flex h-[500px] flex-col rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="h-full flex flex-col">
                 <div className="flex items-center justify-between mb-2 shrink-0">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      {t('tools.ai-excel-formula.resultTitle') || 'Result'}
                    </label>
                    {result && (
                      <button
                        onClick={copyToClipboard}
                        className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-[#282c34] dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? (t('common.copied') || 'Copied') : (t('common.copy') || 'Copy')}
                      </button>
                    )}
                 </div>
                 
                 <div className="relative min-h-0 flex-1">
                    <div className={`absolute inset-0 p-5 rounded-xl border transition-all overflow-y-auto
                      ${result 
                        ? 'bg-white dark:bg-[#282c34] border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 flex items-center justify-center'}`}
                    >
                      {error ? (
                        <div className="text-red-500 dark:text-red-400 flex flex-col items-center gap-2">
                          <RotateCcw className="w-8 h-8" />
                          <p>{error}</p>
                        </div>
                      ) : result ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="prose dark:prose-invert max-w-none text-sm leading-relaxed"
                        >
                          <div className="markdown-body">
                            <Markdown remarkPlugins={[remarkGfm]}>{result}</Markdown>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="text-center">
                          <FileSpreadsheet className="w-8 h-8 mx-auto mb-3 opacity-20" />
                          <p>{t('tools.ai-excel-formula.waiting') || 'Awaiting input...'}</p>
                        </div>
                      )}
                    </div>
                 </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <ToolSEOCard toolKey="ai-excel-formula" />
    </div>
  );
}
