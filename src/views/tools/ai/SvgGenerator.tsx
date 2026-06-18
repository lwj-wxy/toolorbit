import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, Copy, Check, RotateCcw, Image, Download } from 'lucide-react';

export default function SvgGenerator() {
  const { t, i18n } = useTranslation();
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('flat');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [aiMeta, setAiMeta] = useState<{ model?: string; fallbackUsed?: boolean; elapsedMs?: number } | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  
  const styles = [
    { value: 'flat', label: 'Flat Design / 扁平化' },
    { value: 'outline', label: 'Line Art / 线性图标' },
    { value: 'minimalist', label: 'Minimalist / 极简风' },
    { value: 'colorful', label: 'Colorful / 色彩缤纷' },
  ];

  useEffect(() => {
    if (!result) return;
    resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [result]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setResult('');
    setError('');
    setAiMeta(null);
    
    try {
      const response = await fetch('/api/ai-svg-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt,
          style,
          language: i18n.language
        })
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'AI service is currently unavailable.');
      }

      setResult(data.content);
      setAiMeta({ model: data.model, fallbackUsed: data.fallbackUsed, elapsedMs: data.elapsedMs });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getCleanSvg = (rawSvg: string) => {
    if (!rawSvg) return '';
    const extractSvg = rawSvg.match(/<svg[\s\S]*?<\/svg>/i);
    let finalSvg = extractSvg ? extractSvg[0] : rawSvg;
    
    if (!finalSvg.includes('xmlns=')) {
      finalSvg = finalSvg.replace(/<svg\s*/i, '<svg xmlns="http://www.w3.org/2000/svg" ');
    }
    return finalSvg.trim();
  };

  const copyToClipboard = () => {
    const finalSvg = getCleanSvg(result);
    navigator.clipboard.writeText(finalSvg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadSvg = () => {
    const finalSvg = getCleanSvg(result);
    if (!finalSvg) return;
    
    const blob = new Blob([finalSvg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-generated-${Date.now()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 尝试提取纯 SVG 代码来渲染
  const renderSvg = () => {
    if (!result) return null;
    const finalSvg = getCleanSvg(result);
    if (finalSvg.toLowerCase().startsWith('<svg')) {
      // 增加宽高保证在容器中显示正常
      const svgStr = finalSvg.replace(/<svg\s*/i, '<svg style="width:100%;height:100%;" ');
      return <div className="w-full h-full flex items-center justify-center p-4" dangerouslySetInnerHTML={{ __html: svgStr }} />;
    }
    return (
      <div className="w-full h-full flex flex-col items-center p-4 bg-slate-900 text-slate-300 overflow-y-auto font-mono text-xs text-left whitespace-pre-wrap">
        {result}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
            {t('tools.ai-svg-generator.title') || 'Smart SVG Generator'}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            {t('tools.ai-svg-generator.subtitle') || 'Describe an icon or illustration, and AI will generate the SVG code.'}
          </p>
        </div>
      </div>

      <div className="space-y-6">
            
            {/* Input Section */}
            <div className="space-y-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#282c34]">
              <div>
                <label className="mb-2 block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
                   {t('tools.ai-svg-generator.prompt') || 'Description'}
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={t('tools.ai-svg-generator.promptPlaceholder') || 'e.g. A cute cat drinking coffee'}
                  className="h-40 w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
                  {t('tools.ai-svg-generator.style') || 'Style'}
                </label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 shadow-sm outline-none focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  {styles.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-800 sm:w-auto sm:px-8"
              >
                {loading ? (
                  <>
                     <Loader2 className="w-5 h-5 animate-spin" />
                     {t('tools.ai-svg-generator.generating') || 'Generating...'}
                  </>
                ) : (
                  <>
                     <Image className="w-5 h-5 group-hover:scale-110 transition-transform" />
                     {t('tools.ai-svg-generator.generateBtn') || 'Generate SVG'}
                  </>
                )}
              </button>
            </div>

            {/* Output Section */}
            <div ref={resultRef} className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="flex flex-col">
                 <div className="mb-2 flex shrink-0 items-center justify-between">
                    <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
                      {t('tools.ai-svg-generator.resultTitle') || 'Result'}
                    </label>
                    <div className="flex items-center gap-2">
                      {aiMeta?.model && (
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {aiMeta.model}{aiMeta.fallbackUsed ? ' fallback' : ''}
                        </span>
                      )}
                      {result && (
                        <>
                        <button
                          onClick={downloadSvg}
                          className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors duration-200 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#282c34] dark:text-slate-200 dark:hover:bg-slate-800"
                        >
                          <Download className="w-4 h-4" />
                          {t('common.download') || 'Download'}
                        </button>
                        <button
                          onClick={copyToClipboard}
                          className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors duration-200 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#282c34] dark:text-slate-200 dark:hover:bg-slate-800"
                        >
                          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          {copied ? (t('common.copied') || 'Copied') : (t('common.copy') || 'Copy code')}
                        </button>
                        </>
                      )}
                    </div>
                 </div>
                 
                 <div className="relative min-h-[180px] sm:min-h-[320px]">
                    <div className={`absolute inset-0 overflow-hidden rounded-lg border transition-all
                      ${result 
                        ? 'bg-white dark:bg-slate-950 border-cyan-200 dark:border-cyan-900/40 text-slate-800 dark:text-slate-200'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 flex items-center justify-center p-5'}`}
                    >
                      {error ? (
                        <div className="text-red-500 dark:text-red-400 flex flex-col items-center justify-center h-full gap-2">
                          <RotateCcw className="w-8 h-8" />
                          <p>{error}</p>
                        </div>
                      ) : loading ? (
                        <div className="text-center w-full h-full flex flex-col items-center justify-center">
                          <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin text-cyan-500" />
                          <p className="text-cyan-600 dark:text-cyan-400 font-medium">{t('tools.ai-svg-generator.generating') || 'Generating SVG...'}</p>
                        </div>
                      ) : result ? (
                        renderSvg()
                      ) : (
                        <div className="text-center w-full h-full flex flex-col items-center justify-center">
                          <Image className="w-8 h-8 mx-auto mb-3 opacity-20" />
                          <p>{t('tools.ai-svg-generator.waiting') || 'Awaiting input...'}</p>
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
