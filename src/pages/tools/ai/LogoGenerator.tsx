import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, Download, Hexagon, RotateCcw } from 'lucide-react';
import ToolSEOCard from '../../../components/ToolSEOCard';

export default function LogoGenerator() {
  const { t, i18n } = useTranslation();
  
  const [brandName, setBrandName] = useState('');
  const [industry, setIndustry] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('');
  const [style, setStyle] = useState('minimalist');
  
  const [resultUrl, setResultUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const styles = [
    { value: 'minimalist', label: 'Minimalist / 极简风' },
    { value: 'flat', label: 'Flat Design / 扁平化' },
    { value: 'mascot', label: 'Mascot / 卡通拟物' },
    { value: 'abstract', label: 'Abstract / 抽象几何' },
    { value: 'lettermark', label: 'Lettermark / 字母标志' },
    { value: '3d', label: '3D Render / 3D立体' },
    { value: 'vintage', label: 'Vintage / 复古风' },
    { value: 'watercolor', label: 'Watercolor / 水彩风' }
  ];

  const handleGenerate = async () => {
    if (!description.trim() && !brandName.trim()) return;
    
    setLoading(true);
    setError('');
    
    if (resultUrl && resultUrl.startsWith('data:')) {
      // no need to revoke data URL
    }
    setResultUrl('');
    
    // Construct Prompt
    const basePrompt = `Design a high-quality logo. ${brandName ? `Brand Name: "${brandName}".` : ''} ${industry ? `Industry: ${industry}.` : ''} ${color ? `Primary colors: ${color}.` : ''} Description: ${description}. The background should be clean (solid white or transparent), and the logo must be clear, professional, and suitable for app icons or website avatars.`;

    try {
      const response = await fetch('/api/ai-image-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: basePrompt,
          ratio: '1:1',
          style: style,
          language: i18n.language
        })
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'AI service is currently unavailable.');
      }

      setResultUrl(data.imageUrl);
      setLoading(false);

    } catch (err: any) {
      setError(err.message || 'Failed to generate logo. Please try again.');
      setLoading(false);
    }
  };

  const downloadImage = async () => {
    if (!resultUrl) return;
    try {
      if (resultUrl.startsWith('data:')) {
        const a = document.createElement('a');
        a.href = resultUrl;
        a.download = `logo-${brandName || 'ai'}-${Date.now()}.png`;
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
      a.download = `logo-${brandName || 'ai'}-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Download failed", e);
      window.open(resultUrl, '_blank');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-6 relative group">
          <div className="absolute inset-0 bg-indigo-400 opacity-20 blur-xl rounded-full group-hover:opacity-30 transition-opacity"></div>
          <Hexagon className="w-8 h-8 relative z-10" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
          {t('tools.logo-generator.title') || 'AI Logo & Avatar Generator'}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          {t('tools.logo-generator.subtitle') || 'Create professional, unique logos and avatars in seconds.'}
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Input Section */}
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                     {t('tools.logo-generator.brandName') || 'Brand Name / Text'} 
                     <span className="text-xs text-slate-400 font-normal ml-1">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder={t('tools.logo-generator.brandPlaceholder') || 'e.g. Acme Corp'}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-700 dark:text-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                     {t('tools.logo-generator.industry') || 'Industry'}
                  </label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder={t('tools.logo-generator.industryPlaceholder') || 'e.g. Technology, Coffee'}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-700 dark:text-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                   {t('tools.logo-generator.color') || 'Color Palette'}
                </label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder={t('tools.logo-generator.colorPlaceholder') || 'e.g. Blue and White, Vibrant'}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-700 dark:text-slate-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                   {t('tools.logo-generator.description') || 'Core Concept / Symbol'}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('tools.logo-generator.descPlaceholder') || 'e.g. A cute cat holding a coffee cup'}
                  className="w-full h-24 p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none transition-all placeholder:text-slate-400 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t('tools.logo-generator.style') || 'Design Style'}
                </label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 dark:text-slate-300"
                >
                  {styles.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleGenerate}
                disabled={(!description.trim() && !brandName.trim()) || loading}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <>
                     <Loader2 className="w-5 h-5 animate-spin" />
                     {t('tools.logo-generator.generating') || 'Designing...'}
                  </>
                ) : (
                  <>
                     <Hexagon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                     {t('tools.logo-generator.generateBtn') || 'Generate Logo / Avatar'}
                  </>
                )}
              </button>
            </div>

            {/* Output Section */}
            <div className="space-y-6 h-full">
              <div className="h-full flex flex-col">
                 <div className="flex items-center justify-between mb-2 shrink-0">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      {t('tools.logo-generator.resultTitle') || 'Generated Result'}
                    </label>
                    {resultUrl && !loading && (
                      <button
                        onClick={downloadImage}
                        className="flex items-center gap-1.5 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-medium px-3 py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        {t('common.download') || 'Download'}
                      </button>
                    )}
                 </div>
                 
                 <div className="relative flex-1 min-h-[400px]">
                    <div className={`absolute inset-0 rounded-xl border transition-all overflow-hidden flex items-center justify-center
                      ${resultUrl && !loading
                        ? 'bg-slate-100 dark:bg-slate-900 border-indigo-200 dark:border-indigo-900/30' 
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500'}`}
                    >
                      {error ? (
                        <div className="text-red-500 dark:text-red-400 flex flex-col items-center justify-center h-full gap-2 p-5 text-center">
                          <RotateCcw className="w-8 h-8" />
                          <p>{error}</p>
                        </div>
                      ) : loading ? (
                        <div className="flex flex-col items-center justify-center p-5">
                          <Loader2 className="w-10 h-10 mb-4 animate-spin text-indigo-500" />
                          <p className="text-indigo-600 dark:text-indigo-400 font-medium animate-pulse">
                            {t('tools.logo-generator.generating') || 'AI is designing...'}
                          </p>
                        </div>
                      ) : resultUrl ? (
                         <div className="w-full h-full flex items-center justify-center bg-white p-6 shadow-inner relative">
                           {/* Add checkerboard pattern for transparent look */}
                           <div className="absolute inset-0 z-0" style={{ backgroundImage: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px' }}></div>
                           <img 
                              src={resultUrl} 
                              alt="Generated Logo" 
                              className="max-w-[70%] max-h-[70%] object-contain rounded-full shadow-lg relative z-10 hover:scale-105 transition-transform cursor-pointer"
                              title="Logo / Avatar Preview"
                           />
                         </div>
                      ) : (
                        <div className="text-center p-5">
                          <Hexagon className="w-10 h-10 mx-auto mb-3 opacity-20" />
                          <p>{t('tools.logo-generator.waiting') || 'Awaiting input...'}</p>
                        </div>
                      )}
                    </div>
                 </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <ToolSEOCard toolKey="logo-generator" />
    </div>
  );
}
