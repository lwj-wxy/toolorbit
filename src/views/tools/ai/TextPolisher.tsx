import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Wand2, Loader2, Copy, Check, RotateCcw, PenTool } from 'lucide-react';
import { motion } from 'motion/react';
import ToolSEOCard from '../../../components/ToolSEOCard';

export default function TextPolisher() {
  const { t, i18n } = useTranslation();
  const [input, setInput] = useState('');
  const [tone, setTone] = useState('Professional / 正式专业');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  
  const tones = [
    'Professional / 正式专业',
    'Casual & Friendly / 轻松友好',
    'Academic / 学术严谨',
    'Persuasive / 营销转化',
    'Concise / 简明扼要',
    'Humorous / 幽默风趣'
  ];

  const handleGenerate = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    setResult('');
    setError('');
    
    try {
      const response = await fetch('/api/ai-polisher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: input,
          tone,
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 mb-6 relative group">
          <div className="absolute inset-0 bg-violet-400 opacity-20 blur-xl rounded-full group-hover:opacity-30 transition-opacity"></div>
          <PenTool className="w-8 h-8 relative z-10" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
          {t('tools.ai-text-polisher.title') || 'AI Text Polisher'}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          {t('tools.ai-text-polisher.description') || 'Instantly rewrite, polish, and adapt your texts to any tone.'}
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Input Section */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                   {t('tools.ai-text-polisher.originalText') || 'Original Text'}
                </label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t('tools.ai-text-polisher.placeholder') || 'Paste your text here...'}
                  className="w-full h-64 p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none resize-none transition-all placeholder:text-slate-400 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t('tools.ai-text-polisher.selectTone') || 'Select Tone'}
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none text-slate-700 dark:text-slate-300"
                >
                  {tones.map(tOption => (
                    <option key={tOption} value={tOption}>{tOption}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleGenerate}
                disabled={!input.trim() || loading}
                className="w-full py-4 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <>
                     <Loader2 className="w-5 h-5 animate-spin" />
                     {t('tools.ai-text-polisher.processing') || 'Polishing...'}
                  </>
                ) : (
                  <>
                     <Wand2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                     {t('tools.ai-text-polisher.generateBtn') || 'Polish Text'}
                  </>
                )}
              </button>
            </div>

            {/* Output Section */}
            <div className="space-y-6">
              <div>
                 <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      {t('tools.ai-text-polisher.result') || 'Polished Result'}
                    </label>
                    {result && (
                      <button
                        onClick={copyToClipboard}
                        className="flex items-center gap-1.5 text-sm text-violet-600 dark:text-violet-400 hover:text-violet-700 font-medium px-3 py-1.5 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? (t('tools.ai-text-polisher.copied') || 'Copied') : (t('tools.ai-text-polisher.copyBtn') || 'Copy')}
                      </button>
                    )}
                 </div>
                 
                 <div className="relative">
                    <div className={`w-full h-[375px] p-5 rounded-xl border transition-all overflow-y-auto whitespace-pre-wrap
                      ${result 
                        ? 'bg-violet-50/50 dark:bg-violet-900/10 border-violet-100 dark:border-violet-900/30 text-slate-800 dark:text-slate-200' 
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
                          <Wand2 className="w-8 h-8 mx-auto mb-3 opacity-20" />
                          <p>{t('tools.ai-text-polisher.waiting') || 'Awaiting input...'}</p>
                        </div>
                      )}
                    </div>
                 </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <ToolSEOCard toolKey="ai-text-polisher" />
    </div>
  );
}
