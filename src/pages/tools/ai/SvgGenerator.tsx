import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, Copy, Check, RotateCcw, Image, Download } from 'lucide-react';
import ToolSEOCard from '../../../components/ToolSEOCard';

export default function SvgGenerator() {
  const { t, i18n } = useTranslation();
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('flat');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  
  const styles = [
    { value: 'flat', label: 'Flat Design / 扁平化' },
    { value: 'outline', label: 'Line Art / 线性图标' },
    { value: 'minimalist', label: 'Minimalist / 极简风' },
    { value: 'colorful', label: 'Colorful / 色彩缤纷' },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setResult('');
    setError('');
    
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 mb-6 relative group">
          <div className="absolute inset-0 bg-pink-400 opacity-20 blur-xl rounded-full group-hover:opacity-30 transition-opacity"></div>
          <Image className="w-8 h-8 relative z-10" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
          {t('tools.ai-svg-generator.title') || 'Smart SVG Generator'}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          {t('tools.ai-svg-generator.subtitle') || 'Describe an icon or illustration, and AI will generate the SVG code.'}
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Input Section */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                   {t('tools.ai-svg-generator.prompt') || 'Description'}
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={t('tools.ai-svg-generator.promptPlaceholder') || 'e.g. A cute cat drinking coffee'}
                  className="w-full h-32 p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none resize-none transition-all placeholder:text-slate-400 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t('tools.ai-svg-generator.style') || 'Style'}
                </label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-slate-700 dark:text-slate-300"
                >
                  {styles.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || loading}
                className="w-full py-4 bg-pink-600 hover:bg-pink-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 group"
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
            <div className="space-y-6 h-full">
              <div className="h-full flex flex-col">
                 <div className="flex items-center justify-between mb-2 shrink-0">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      {t('tools.ai-svg-generator.resultTitle') || 'Result'}
                    </label>
                    {result && (
                      <div className="flex gap-2">
                        <button
                          onClick={downloadSvg}
                          className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-amber-400 font-medium px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          {t('common.download') || 'Download'}
                        </button>
                        <button
                          onClick={copyToClipboard}
                          className="flex items-center gap-1.5 text-sm text-pink-600 dark:text-pink-400 hover:text-pink-700 font-medium px-3 py-1.5 rounded-lg hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors"
                        >
                          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          {copied ? (t('common.copied') || 'Copied') : (t('common.copy') || 'Copy code')}
                        </button>
                      </div>
                    )}
                 </div>
                 
                 <div className="relative flex-1 min-h-[400px]">
                    <div className={`absolute inset-0 rounded-xl border transition-all overflow-hidden
                      ${result 
                        ? 'bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border-pink-200 dark:border-pink-900/30 text-slate-800 dark:text-slate-200' 
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 flex items-center justify-center p-5'}`}
                    >
                      {error ? (
                        <div className="text-red-500 dark:text-red-400 flex flex-col items-center justify-center h-full gap-2">
                          <RotateCcw className="w-8 h-8" />
                          <p>{error}</p>
                        </div>
                      ) : loading ? (
                        <div className="text-center w-full h-full flex flex-col items-center justify-center">
                          <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin text-pink-500" />
                          <p className="text-pink-600 dark:text-pink-400 font-medium">{t('tools.ai-svg-generator.generating') || 'Generating SVG...'}</p>
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
      </div>

      <ToolSEOCard toolKey="ai-svg-generator" />
    </div>
  );
}
