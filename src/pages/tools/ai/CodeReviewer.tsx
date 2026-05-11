import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileCode2, Loader2, Copy, Check, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ToolSEOCard from '../../../components/ToolSEOCard';

export default function CodeReviewer() {
  const { t, i18n } = useTranslation();
  const [code, setCode] = useState('');
  const [codeLang, setCodeLang] = useState('Auto-Detect');
  const [tone, setTone] = useState('Constructive');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  
  const langs = [
    'Auto-Detect', 'JavaScript', 'TypeScript', 'React (JSX/TSX)', 'Python', 'Java', 'Go', 'Rust', 'C++', 'CSS/SCSS'
  ];

  const tones = [
    'Constructive / 建设性建议',
    'Strict / 严厉挑剔',
    'Beginner Friendly / 新手友好指导',
    'Performance Focus / 性能优化导向'
  ];

  const handleGenerate = async () => {
    if (!code.trim()) return;
    
    setLoading(true);
    setResult('');
    setError('');
    
    try {
      const response = await fetch('/api/ai-code-reviewer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          code,
          codeLang,
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-6 relative group">
          <div className="absolute inset-0 bg-green-400 opacity-20 blur-xl rounded-full group-hover:opacity-30 transition-opacity"></div>
          <FileCode2 className="w-8 h-8 relative z-10" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
          {t('tools.ai-code-reviewer.title') || 'AI Code Reviewer'}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          {t('tools.ai-code-reviewer.description') || 'Get expert feedback on your code quality, performance, and security.'}
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Input Section */}
            <div className="space-y-6">
              <div>
                <div className="flex gap-4 mb-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {t('tools.ai-code-reviewer.codeLang') || 'Language'}
                    </label>
                    <select
                      value={codeLang}
                      onChange={(e) => setCodeLang(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-slate-700 dark:text-slate-300"
                    >
                      {langs.map(l => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {t('tools.ai-code-reviewer.tone') || 'Review Focus'}
                    </label>
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-slate-700 dark:text-slate-300"
                    >
                      {tones.map(tOption => (
                        <option key={tOption} value={tOption}>{tOption}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                   {t('tools.ai-code-reviewer.code') || 'Your Code'}
                </label>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder={t('tools.ai-code-reviewer.placeholder') || 'Paste your code here...'}
                  className="w-full h-[400px] p-4 bg-slate-900 text-slate-100 font-mono text-sm border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none transition-all placeholder:text-slate-500"
                  spellCheck="false"
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={!code.trim() || loading}
                className="w-full py-4 bg-green-600 hover:bg-green-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <>
                     <Loader2 className="w-5 h-5 animate-spin" />
                     {t('tools.ai-code-reviewer.analyzing') || 'Analyzing...'}
                  </>
                ) : (
                  <>
                     <FileCode2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                     {t('tools.ai-code-reviewer.analyzeBtn') || 'Start Review'}
                  </>
                )}
              </button>
            </div>

            {/* Output Section */}
            <div className="space-y-6 h-full">
              <div className="h-full flex flex-col">
                 <div className="flex items-center justify-between mb-2 shrink-0">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      {t('tools.ai-code-reviewer.result') || 'Review Report'}
                    </label>
                    {result && (
                      <button
                        onClick={copyToClipboard}
                        className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400 hover:text-green-700 font-medium px-3 py-1.5 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? (t('common.copied') || 'Copied') : (t('common.copy') || 'Copy')}
                      </button>
                    )}
                 </div>
                 
                 <div className="relative flex-1 min-h-[500px]">
                    <div className={`absolute inset-0 p-5 rounded-xl border transition-all overflow-y-auto
                      ${result 
                        ? 'bg-green-50/50 dark:bg-green-900/10 border-green-100 dark:border-green-900/30 text-slate-800 dark:text-slate-200' 
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
                          className="prose prose-green dark:prose-invert max-w-none text-sm leading-relaxed"
                        >
                          <div className="markdown-body">
                            <Markdown remarkPlugins={[remarkGfm]}>{result}</Markdown>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="text-center">
                          <FileCode2 className="w-8 h-8 mx-auto mb-3 opacity-20" />
                          <p>{t('tools.ai-code-reviewer.waiting') || 'Awaiting code input...'}</p>
                        </div>
                      )}
                    </div>
                 </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <ToolSEOCard toolKey="ai-code-reviewer" />
    </div>
  );
}
