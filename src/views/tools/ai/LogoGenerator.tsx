import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, Download, Hexagon, RotateCcw, Image as ImageIcon } from 'lucide-react';

export default function LogoGenerator() {
  const { t, i18n } = useTranslation();
  
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('');
  const [style, setStyle] = useState('minimalist');
  
  const [resultUrl, setResultUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [analyzingImage, setAnalyzingImage] = useState(false);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleGenerate = async (overrideDescription?: string, imageBase64?: string) => {
    const finalDescription = overrideDescription || description;
    if (!finalDescription.trim()) return;
    
    setLoading(true);
    setError('');
    
    if (resultUrl && resultUrl.startsWith('data:')) {
      // no need to revoke data URL
    }
    setResultUrl('');
    
    // Construct Prompt
    const basePrompt = `Design a high-quality logo. ${color ? `Primary colors: ${color}.` : ''} Description: ${finalDescription}. The background should be clean (solid white or transparent), and the logo must be clear, professional, and suitable for app icons or website avatars.`;

    try {
      const response = await fetch('/api/ai-image-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: basePrompt,
          ratio: '1:1',
          style: style,
          language: i18n.language,
          imageBase64: imageBase64
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError(i18n.language.startsWith('zh') ? '图片太大，请上传5MB以内的图片' : 'Image too large. Please upload an image under 5MB.');
      return;
    }

    setAnalyzingImage(true);
    setError('');

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        try {
          const response = await fetch('/api/ai-vision-describe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              imageBase64: base64String,
              language: i18n.language
            })
          });
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error || 'Failed to analyze image.');
          }
          const newDesc = data.description;
          setDescription(newDesc);
          
          // Wait a tick to let state settle if needed, or just manually pass newDesc
          setAnalyzingImage(false);
          await handleGenerate(newDesc, base64String);
        } catch (err: any) {
          setError(err.message || 'Failed to analyze image.');
          setAnalyzingImage(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (e: any) {
      setError(e.message);
      setAnalyzingImage(false);
    }
  };

  const downloadImage = async () => {
    if (!resultUrl) return;
    try {
      if (resultUrl.startsWith('data:')) {
        const a = document.createElement('a');
        a.href = resultUrl;
        a.download = `logo-ai-${Date.now()}.png`;
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
      a.download = `logo-ai-${Date.now()}.png`;
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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
            {t('tools.logo-generator.title') || 'AI Logo & Avatar Generator'}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            {t('tools.logo-generator.subtitle') || 'Create professional, unique logos and avatars in seconds.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            
            {/* Input Section */}
            <div className="flex h-[500px] flex-col space-y-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#282c34]">
              <div>
                <label className="mb-2 block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
                   {t('tools.logo-generator.color') || 'Color Palette'}
                </label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder={t('tools.logo-generator.colorPlaceholder') || 'e.g. Blue and White, Vibrant'}
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
                     {t('tools.logo-generator.description') || 'Core Concept / Symbol'}
                  </label>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={analyzingImage || loading}
                    className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors duration-200 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                    title={i18n.language.startsWith('zh') ? '上传参考图片，AI自动提取视觉概念' : 'Upload reference image, AI will extract visual concepts'}
                  >
                    {analyzingImage ? <Loader2 className="w-3.5 h-3.5 animate-spin"/> : <ImageIcon className="w-3.5 h-3.5" />}
                    {i18n.language.startsWith('zh') ? '传图识别 (GLM-4V)' : 'Upload Ref Image (GLM-4V)'}
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/png, image/jpeg, image/webp" 
                    onChange={handleImageUpload} 
                  />
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={analyzingImage 
                    ? (i18n.language.startsWith('zh') ? '正在使用 GLM-4V-Flash 分析图片...' : 'Analyzing image with GLM-4V-Flash...')
                    : (t('tools.logo-generator.descPlaceholder') || 'e.g. A cute cat holding a coffee cup')}
                  disabled={analyzingImage || loading}
                  className="h-28 w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-cyan-500 disabled:opacity-70 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
                  {t('tools.logo-generator.style') || 'Design Style'}
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
                onClick={() => handleGenerate()}
                disabled={!description.trim() || loading || analyzingImage}
                className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-800"
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
            <div className="flex h-[500px] flex-col space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="h-full flex flex-col">
                 <div className="mb-2 flex shrink-0 items-center justify-between">
                    <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
                      {t('tools.logo-generator.resultTitle') || 'Generated Result'}
                    </label>
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
  );
}
