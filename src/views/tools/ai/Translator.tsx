import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Languages, Loader2, Copy, Check, RotateCcw, ArrowRightLeft } from 'lucide-react';
import { motion } from 'motion/react';

export default function Translator() {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [targetLang, setTargetLang] = useState('English');
  const [tone, setTone] = useState('Native / 地道母语');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  
  const targetLanguages = [
    'English',
    'Simplified Chinese',
    'Traditional Chinese',
    'Japanese',
    'Korean',
    'French',
    'German',
    'Spanish',
    'Portuguese',
    'Russian'
  ];

  const tones = [
    'Native / 地道母语',
    'Professional / 专业严谨',
    'Literary / 文学优美',
    'Casual / 轻松随意'
  ];

  const handleGenerate = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    setResult('');
    setError('');
    
    try {
      const response = await fetch('/api/ai-translator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: input,
          targetLang,
          tone
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
        const { value, done } = await reader.read();
        isDone = done;
        
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
            {t('tools.ai-translator.title') || 'AI Translator'}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            {t('tools.ai-translator.description') || '超越传统机翻，提供更具母语感的高度精准翻译。'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            
            {/* Input Section */}
            <div className="flex h-[500px] flex-col space-y-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#282c34]">
              <div>
                <label className="mb-2 block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
                   {t('tools.ai-translator.originalText') || 'Source Text'}
                </label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t('tools.ai-translator.placeholder') || 'Paste text to translate...'}
                  className="h-56 w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
                    {t('tools.ai-translator.targetLang') || 'Target'}
                  </label>
                  <select
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 text-slate-900 shadow-sm outline-none focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  >
                    {targetLanguages.map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
                    {t('tools.ai-translator.selectTone') || 'Tone Style'}
                  </label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 text-slate-900 shadow-sm outline-none focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  >
                    {tones.map(tOption => (
                      <option key={tOption} value={tOption}>{tOption}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={!input.trim() || loading}
                className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-800"
              >
                {loading ? (
                  <>
                     <Loader2 className="w-5 h-5 animate-spin" />
                     {t('tools.ai-translator.processing') || 'Translating...'}
                  </>
                ) : (
                  <>
                     <ArrowRightLeft className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                     {t('tools.ai-translator.generateBtn') || 'Translate Now'}
                  </>
                )}
              </button>
            </div>

            {/* Output Section */}
            <div className="flex h-[500px] flex-col space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div>
                 <div className="mb-2 flex items-center justify-between">
                    <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
                      {t('tools.ai-translator.result') || 'Translation Result'}
                    </label>
                    {result && (
                      <button
                        onClick={copyToClipboard}
                        className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors duration-200 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#282c34] dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? (t('tools.ai-translator.copied') || 'Copied') : (t('tools.ai-translator.copyBtn') || 'Copy')}
                      </button>
                    )}
                 </div>
                 
                 <div className="relative">
                    <div className={`w-full h-[335px] p-5 rounded-xl border transition-all overflow-y-auto whitespace-pre-wrap
                      ${result 
                        ? 'bg-white dark:bg-slate-950 border-cyan-200 dark:border-cyan-900/40 text-slate-800 dark:text-slate-200'
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
                          {result}
                        </motion.div>
                      ) : (
                        <div className="text-center">
                          <Languages className="w-8 h-8 mx-auto mb-3 opacity-20" />
                          <p>{t('tools.ai-translator.waiting') || 'Awaiting input...'}</p>
                        </div>
                      )}
                    </div>
                 </div>
              </div>
            </div>

      </div>

    </div>
  );
}
