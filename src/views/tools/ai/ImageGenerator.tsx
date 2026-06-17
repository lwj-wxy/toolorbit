import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, Download, Image as ImageIcon, RotateCcw, Monitor, Smartphone, Square } from 'lucide-react';

export default function ImageGenerator() {
  const { t, i18n } = useTranslation();
  const [prompt, setPrompt] = useState('');
  const [ratio, setRatio] = useState('1:1');
  const [style, setStyle] = useState('photorealistic');
  const [resultUrl, setResultUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [aiMeta, setAiMeta] = useState<{ model?: string; fallbackUsed?: boolean; elapsedMs?: number } | null>(null);

  const styles = [
    { value: 'photorealistic', label: 'Photorealistic / 真实感' },
    { value: 'anime', label: 'Anime / 动漫' },
    { value: 'digital-art', label: 'Digital Art / 数字艺术' },
    { value: 'oil-painting', label: 'Oil Painting / 油画' },
    { value: '3d-model', label: '3D Render / 3D 渲染' },
    { value: 'cyberpunk', label: 'Cyberpunk / 赛博朋克' },
  ];

  const ratios = [
    { value: '1:1', label: '1:1', icon: Square },
    { value: '16:9', label: '16:9', icon: Monitor },
    { value: '9:16', label: '9:16', icon: Smartphone },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setError('');
    setAiMeta(null);
    
    if (resultUrl && resultUrl.startsWith('blob:')) {
      URL.revokeObjectURL(resultUrl);
    }
    setResultUrl('');
    
    try {
      const response = await fetch('/api/ai-image-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt,
          ratio,
          style,
          language: i18n.language
        })
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'AI service is currently unavailable.');
      }

      setResultUrl(data.imageUrl);
      setAiMeta({ model: data.model, fallbackUsed: data.fallbackUsed, elapsedMs: data.elapsedMs });
      setLoading(false);

    } catch (err: any) {
      setError(err.message || 'Failed to generate image. Please try again.');
      setLoading(false);
    }
  };

  const downloadImage = async () => {
    if (!resultUrl) return;
    try {
      if (resultUrl.startsWith('blob:') || resultUrl.startsWith('data:')) {
        const a = document.createElement('a');
        a.href = resultUrl;
        a.download = `ai-image-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return;
      }
      const response = await fetch(resultUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-image-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Download failed", e);
      // Fallback
      window.open(resultUrl, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
            {t('tools.ai-image-generator.title') || 'AI Image Generator'}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            {t('tools.ai-image-generator.subtitle') || 'Describe what you want to see, and AI will turn it into a beautiful image.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            
            {/* Input Section */}
            <div className="flex h-[500px] flex-col space-y-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#282c34]">
              <div>
                <label className="mb-2 block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
                   {t('tools.ai-image-generator.prompt') || 'Description'}
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={t('tools.ai-image-generator.promptPlaceholder') || 'e.g. A futuristic city bathed in neon lights during heavy rain...'}
                  className="h-36 w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
                  {t('tools.ai-image-generator.ratio') || 'Aspect Ratio'}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {ratios.map((r) => (
                    <button
                      key={r.value}
                      onClick={() => setRatio(r.value)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                        ratio === r.value
                          ? 'bg-cyan-50 border-cyan-500 text-cyan-700 dark:bg-cyan-950/30 dark:border-cyan-400 dark:text-cyan-300'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800'
                      }`}
                    >
                      <r.icon className="w-5 h-5 mb-1.5" />
                      <span className="text-sm font-medium">{r.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
                  {t('tools.ai-image-generator.style') || 'Art Style'}
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
                className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-800"
              >
                {loading ? (
                  <>
                     <Loader2 className="w-5 h-5 animate-spin" />
                     {t('tools.ai-image-generator.generating') || 'Generating...'}
                  </>
                ) : (
                  <>
                     <ImageIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                     {t('tools.ai-image-generator.generateBtn') || 'Generate Image'}
                  </>
                )}
              </button>
            </div>

            {/* Output Section */}
            <div className="flex h-[500px] flex-col space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="h-full flex flex-col">
                 <div className="mb-2 flex shrink-0 items-center justify-between">
                    <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
                      {t('tools.ai-image-generator.resultTitle') || 'Result'}
                    </label>
                    <div className="flex items-center gap-2">
                      {aiMeta?.model && (
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {aiMeta.model}{aiMeta.fallbackUsed ? ' fallback' : ''}
                        </span>
                      )}
                      {resultUrl && !loading && (
                        <button
                          onClick={downloadImage}
                          className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors duration-200 hover:bg-slate-50 dark:border-slate-700 dark:bg-[#282c34] dark:text-slate-200 dark:hover:bg-slate-800"
                        >
                          <Download className="w-4 h-4" />
                          {t('common.download') || 'Download'}
                        </button>
                      )}
                    </div>
                 </div>
                 
                 <div className="relative flex-1 min-h-[400px]">
                    <div className={`absolute inset-0 flex items-center justify-center overflow-hidden rounded-lg border transition-all
                      ${resultUrl && !loading
                        ? 'bg-white dark:bg-slate-950 border-cyan-200 dark:border-cyan-900/40'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500'}`}
                    >
                      {error ? (
                        <div className="text-red-500 dark:text-red-400 flex flex-col items-center justify-center h-full gap-2 p-5 text-center">
                          <RotateCcw className="w-8 h-8" />
                          <p>{error}</p>
                        </div>
                      ) : loading ? (
                        <div className="flex flex-col items-center justify-center p-5">
                          <Loader2 className="w-10 h-10 mb-4 animate-spin text-cyan-500" />
                          <p className="text-cyan-600 dark:text-cyan-400 font-medium animate-pulse">
                            {t('tools.ai-image-generator.generating') || 'AI is painting...'}
                          </p>
                        </div>
                      ) : resultUrl ? (
                         <div className="w-full h-full p-2 flex items-center justify-center group relative">
                           <img 
                              src={resultUrl} 
                              alt="Generated AI Art" 
                              className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
                           />
                         </div>
                      ) : (
                        <div className="text-center p-5">
                          <ImageIcon className="w-10 h-10 mx-auto mb-3 opacity-20" />
                          <p>{t('tools.ai-image-generator.waiting') || 'Awaiting description...'}</p>
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
