import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileCode2, Loader2, Copy, Check, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function CodeReviewer() {
  const { t, i18n } = useTranslation();
  const [code, setCode] = useState('');
  const [codeLang, setCodeLang] = useState('Auto-Detect');
  const [tone, setTone] = useState('Constructive');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  
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

  const copyCodeToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
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

      <div className="space-y-8">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                {t('tools.ai-code-reviewer.codeLang') || 'Language'}
              </label>
              <select
                value={codeLang}
                onChange={(e) => setCodeLang(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-700 outline-none focus:ring-2 focus:ring-green-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300"
              >
                {langs.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                {t('tools.ai-code-reviewer.tone') || 'Review Focus'}
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-700 outline-none focus:ring-2 focus:ring-green-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300"
              >
                {tones.map(tOption => (
                  <option key={tOption} value={tOption}>{tOption}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              {t('tools.ai-code-reviewer.code') || 'Your Code'}
            </label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={t('tools.ai-code-reviewer.placeholder') || 'Paste your code here...'}
              className="h-[420px] w-full resize-y rounded-xl border border-slate-200 bg-slate-950 p-4 font-mono text-sm leading-7 text-slate-100 outline-none transition-all placeholder:text-slate-500 focus:border-transparent focus:ring-2 focus:ring-green-500 dark:border-slate-700"
              spellCheck="false"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!code.trim() || loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-4 font-medium text-white shadow-sm transition-all hover:bg-green-700 hover:shadow-md disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-800"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {t('tools.ai-code-reviewer.analyzing') || 'Analyzing...'}
              </>
            ) : (
              <>
                <FileCode2 className="h-5 w-5" />
                {t('tools.ai-code-reviewer.analyzeBtn') || 'Start Review'}
              </>
            )}
          </button>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {t('tools.ai-code-reviewer.result') || 'Review Report'}
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {result
                  ? 'Structured review output with separated sections, readable paragraphs, and scrollable code examples.'
                  : 'The AI review will appear here as a readable report after analysis.'}
              </p>
            </div>
            {result && (
              <button
                onClick={copyToClipboard}
                className="flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-green-600 transition-colors hover:bg-green-50 hover:text-green-700 dark:text-green-400 dark:hover:bg-green-900/20"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? (t('common.copied') || 'Copied') : (t('common.copy') || 'Copy')}
              </button>
            )}
          </div>

          <div
            className={`min-h-[360px] rounded-xl border p-5 transition-all sm:p-7 ${
              result
                ? 'border-green-100 bg-green-50/40 text-slate-800 dark:border-green-900/30 dark:bg-green-900/10 dark:text-slate-200'
                : 'flex items-center justify-center border-slate-200 bg-slate-50 text-slate-400 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-500'
            }`}
          >
            {error ? (
              <div className="flex flex-col items-center gap-2 text-red-500 dark:text-red-400">
                <RotateCcw className="h-8 w-8" />
                <p>{error}</p>
              </div>
            ) : result ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="prose prose-slate max-w-none text-[15px] leading-7 dark:prose-invert prose-headings:mt-8 prose-headings:font-black prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:my-4 prose-li:my-2 prose-ol:my-5 prose-ul:my-5 prose-strong:text-slate-950 dark:prose-strong:text-white"
              >
                <Markdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, inline, className, children, ...props }: any) {
                      const match = /language-(\w+)/.exec(className || '');
                      const codeText = String(children).replace(/\n$/, '');
                      if (!inline && match) {
                        return (
                          <div className="my-6 overflow-hidden rounded-xl border border-slate-700 bg-slate-950">
                            <div className="flex items-center justify-between border-b border-slate-700 bg-slate-800 px-4 py-2 text-xs font-medium text-slate-300">
                              <span className="font-mono uppercase tracking-wide">{match[1]}</span>
                              <button
                                onClick={() => copyCodeToClipboard(codeText)}
                                className="flex items-center gap-1.5 transition-colors hover:text-white"
                              >
                                {copiedCode === codeText ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                                {copiedCode === codeText ? (t('common.copied') || 'Copied') : (t('common.copy') || 'Copy')}
                              </button>
                            </div>
                            <SyntaxHighlighter
                              {...props}
                              style={vscDarkPlus}
                              language={match[1]}
                              PreTag="div"
                              customStyle={{
                                margin: 0,
                                border: 'none',
                                borderRadius: 0,
                                padding: '1rem',
                                fontSize: '0.86rem',
                                lineHeight: 1.65,
                                overflowX: 'auto',
                              }}
                            >
                              {codeText}
                            </SyntaxHighlighter>
                          </div>
                        );
                      }
                      return (
                        <code {...props} className="rounded bg-slate-200/70 px-1.5 py-0.5 text-[0.9em] font-semibold text-slate-900 dark:bg-slate-800 dark:text-slate-100">
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {result}
                </Markdown>
              </motion.div>
            ) : (
              <div className="text-center">
                <FileCode2 className="mx-auto mb-3 h-8 w-8 opacity-20" />
                <p>{t('tools.ai-code-reviewer.waiting') || 'Awaiting code input...'}</p>
              </div>
            )}
          </div>
        </section>
      </div>

    </div>
  );
}
