import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, Download, Image as ImageIcon, RotateCcw, Monitor, Smartphone, Square } from 'lucide-react';
import ToolSEOCard from '../../../components/ToolSEOCard';

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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 mb-6 relative group">
          <div className="absolute inset-0 bg-amber-400 opacity-20 blur-xl rounded-full group-hover:opacity-30 transition-opacity"></div>
          <ImageIcon className="w-8 h-8 relative z-10" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
          {t('tools.ai-image-generator.title') || 'AI Image Generator'}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          {t('tools.ai-image-generator.subtitle') || 'Describe what you want to see, and AI will turn it into a beautiful image.'}
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Input Section */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                   {t('tools.ai-image-generator.prompt') || 'Description'}
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={t('tools.ai-image-generator.promptPlaceholder') || 'e.g. A futuristic city bathed in neon lights during heavy rain...'}
                  className="w-full h-32 p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none resize-none transition-all placeholder:text-slate-400 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t('tools.ai-image-generator.ratio') || 'Aspect Ratio'}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {ratios.map((r) => (
                    <button
                      key={r.value}
                      onClick={() => setRatio(r.value)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                        ratio === r.value
                          ? 'bg-amber-50 border-amber-500 text-amber-700 dark:bg-amber-900/20 dark:border-amber-400 dark:text-amber-300'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800'
                      }`}
                    >
                      <r.icon className="w-5 h-5 mb-1.5" />
                      <span className="text-sm font-medium">{r.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t('tools.ai-image-generator.style') || 'Art Style'}
                </label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-slate-700 dark:text-slate-300"
                >
                  {styles.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || loading}
                className="w-full py-4 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 group"
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
            <div className="space-y-6 h-full">
              <div className="h-full flex flex-col">
                 <div className="flex items-center justify-between mb-2 shrink-0">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
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
                          className="flex items-center gap-1.5 text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 font-medium px-3 py-1.5 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          {t('common.download') || 'Download'}
                        </button>
                      )}
                    </div>
                 </div>
                 
                 <div className="relative flex-1 min-h-[400px]">
                    <div className={`absolute inset-0 rounded-xl border transition-all overflow-hidden flex items-center justify-center
                      ${resultUrl && !loading
                        ? 'bg-slate-100 dark:bg-slate-900 border-amber-200 dark:border-amber-900/30' 
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500'}`}
                    >
                      {error ? (
                        <div className="text-red-500 dark:text-red-400 flex flex-col items-center justify-center h-full gap-2 p-5 text-center">
                          <RotateCcw className="w-8 h-8" />
                          <p>{error}</p>
                        </div>
                      ) : loading ? (
                        <div className="flex flex-col items-center justify-center p-5">
                          <Loader2 className="w-10 h-10 mb-4 animate-spin text-amber-500" />
                          <p className="text-amber-600 dark:text-amber-400 font-medium animate-pulse">
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
      </div>

      <ToolSEOCard toolKey="ai-image-generator" />
    </div>
  );
}
