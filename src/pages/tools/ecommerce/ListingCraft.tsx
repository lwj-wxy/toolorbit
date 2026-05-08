import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, Loader2, Copy, Check, RotateCcw, LayoutGrid, Globe, Target, Megaphone, Tag, AlignLeft, Box } from 'lucide-react';
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';

export default function ListingCraft() {
  const { t, i18n } = useTranslation();
  const [platform, setPlatform] = useState('Etsy');
  const [input, setInput] = useState('');
  const [details, setDetails] = useState('');
  const [keywords, setKeywords] = useState('');
  const [tone, setTone] = useState('persuasive');
  const [targetAudience, setTargetAudience] = useState('');
  const [language, setLanguage] = useState(i18n.language === 'zh' ? 'Chinese' : 'English');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const parseResult = (text: string) => {
    const sections = {
      title: '',
      description: '',
      tags: '',
      social: ''
    };

    if (!text) return sections;

    const titleMatch = text.match(/\[TITLE\]([\s\S]*?)(?=\[|$)/);
    const descMatch = text.match(/\[DESCRIPTION\]([\s\S]*?)(?=\[|$)/);
    const tagsMatch = text.match(/\[TAGS\]([\s\S]*?)(?=\[|$)/);
    const socialMatch = text.match(/\[SOCIAL\]([\s\S]*?)(?=\[|$)/);

    if (titleMatch) sections.title = titleMatch[1].trim();
    if (descMatch) sections.description = descMatch[1].trim();
    if (tagsMatch) sections.tags = tagsMatch[1].trim();
    if (socialMatch) sections.social = socialMatch[1].trim();

    return sections;
  };

  const sections = parseResult(result);

  useEffect(() => {
    setLanguage(i18n.language === 'zh' ? 'Chinese' : 'English');
  }, [i18n.language]);

  const examples = [
    { label: t('tools.listing-craft-ai.exHome'), icon: '🏠', text: 'Ceramic Mug', details: 'Handmade, minimalist design, 350ml, white matte finish', keywords: 'Mug, Handmade, Gift', audience: 'Home lovers, coffee drinkers' },
    { label: t('tools.listing-craft-ai.exJewelry'), icon: '✨', text: 'Silver Necklace', details: '925 Sterling silver, moonstone pendant, 18-inch chain', keywords: 'Necklace, Moonstone, Jewelry', audience: 'Women, Gift for her' }
  ];

  const applyExample = (ex: any) => {
    setInput(ex.text);
    setDetails(ex.details);
    setKeywords(ex.keywords);
    setTargetAudience(ex.audience);
  };

  const handleGenerate = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    setResult('');
    setError('');
    
    try {
      const response = await fetch('/api/listing-craft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          productInfo: input,
          details: `${details}\nPlatform: ${platform}`,
          keywords,
          tone,
          targetAudience,
          language 
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
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('data: ')) {
              try {
                const jsonStr = trimmedLine.substring(6).trim();
                const data = JSON.parse(jsonStr);
                
                if (data.error) {
                  setError(data.error);
                } else if (data.content) {
                  setResult(prev => prev + data.content);
                }
              } catch (e) {
                // Ignore incomplete JSON chunks from buffer
              }
            }
          }
        }
      }
    } catch (err: any) {
      setError(err.message || t('tools.listing-craft-ai.errorMsg'));
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-[400px,1fr] gap-8 items-start">
        
        {/* Left Input Sidebar */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-7 space-y-8 overflow-hidden relative">
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t('tools.listing-craft-ai.quickEx')}</span>
              <div className="flex gap-2 flex-wrap">
                {examples.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => applyExample(ex)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    <span>{ex.icon}</span>
                    <span>{ex.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <h2 className="text-xl font-black text-slate-800 tracking-tight pt-2">
              {t('tools.listing-craft-ai.paramsTitle') || 'Product Parameters'}
            </h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                <LayoutGrid size={16} className="text-slate-400" />
                {t('tools.listing-craft-ai.platformLabel') || 'Platform'}
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-[14px] focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
              >
                <option value="Etsy">Etsy</option>
                <option value="Amazon">Amazon</option>
                <option value="eBay">eBay</option>
                <option value="Shopify">Shopify</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                <Box size={16} className="text-slate-400" />
                {t('tools.listing-craft-ai.inputLabel')}
              </label>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('tools.listing-craft-ai.placeholder')}
                className="w-full h-11 px-4 rounded-xl border border-slate-200 text-[14px] focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                <AlignLeft size={16} className="text-slate-400" />
                {t('tools.listing-craft-ai.detailsLabel')}
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder={t('tools.listing-craft-ai.detailsPlaceholder')}
                className="w-full min-h-[120px] p-4 rounded-xl border border-slate-200 text-[14px] resize-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium leading-relaxed"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                <Tag size={16} className="text-slate-400" />
                {t('tools.listing-craft-ai.keywordsLabel')}
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder={t('tools.listing-craft-ai.keywordsPlaceholder')}
                className="w-full h-11 px-4 rounded-xl border border-slate-200 text-[14px] focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-2">
                  <Megaphone size={14} className="text-slate-400" />
                  {t('tools.listing-craft-ai.toneLabel')}
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-[13px] font-medium"
                >
                  <option value="professional">{t('tools.listing-craft-ai.toneProfessional')}</option>
                  <option value="persuasive">{t('tools.listing-craft-ai.tonePersuasive')}</option>
                  <option value="urgent">{t('tools.listing-craft-ai.toneUrgent')}</option>
                  <option value="minimalist">{t('tools.listing-craft-ai.toneMinimalist')}</option>
                  <option value="luxury">{t('tools.listing-craft-ai.toneLuxury')}</option>
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-2">
                  <Globe size={14} className="text-slate-400" />
                  {t('tools.listing-craft-ai.langLabel') || 'Output Language'}
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-[13px] font-medium"
                >
                  <option value="English">English</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Spanish">Spanish</option>
                  <option value="German">German</option>
                </select>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                <Target size={16} className="text-slate-400" />
                {t('tools.listing-craft-ai.targetAudienceLabel')}
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder={t('tools.listing-craft-ai.targetAudiencePlaceholder')}
                className="w-full h-11 px-4 rounded-xl border border-slate-200 text-[14px] font-medium"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerate}
              disabled={loading || !input.trim()}
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2 mt-4"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} className="fill-white" />}
              {loading ? (t('tools.listing-craft-ai.generating') || 'Crafting...') : (t('tools.listing-craft-ai.generateBtn') || 'Generate Copy')}
            </motion.button>
          </div>
        </div>

        {/* Right Result Panel */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl shadow-slate-200/40 flex flex-col min-h-[700px]">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
               <h3 className="text-lg font-black text-slate-800 tracking-tight">{t('tools.listing-craft-ai.resultTitle')}</h3>
               <button 
                 onClick={() => setResult('')} 
                 className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
               >
                 <RotateCcw size={16} />
               </button>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-lg text-[10px] font-black text-indigo-500 uppercase tracking-widest leading-none">
                {platform} FORMAT
              </span>
              {result && (
                <button 
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all active:scale-95"
                >
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  {copied ? t('tools.listing-craft-ai.copied') : t('tools.listing-craft-ai.copyBtn')}
                </button>
              )}
            </div>
          </div>
          
          <div className="flex-1 p-8 overflow-y-auto">
            {error && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl max-w-md">
                   <p className="text-rose-600 text-sm font-medium">{error}</p>
                </div>
              </div>
            )}
            
            {!result && !loading && !error && (
              <div className="flex flex-col items-center justify-center h-full text-center text-slate-300">
                <Box size={64} strokeWidth={1.5} className="mb-4 opacity-50" />
                <p className="font-bold text-lg">{t('tools.listing-craft-ai.emptyResult')}</p>
                <p className="text-sm mt-1">{t('tools.listing-craft-ai.readyToCraft') || 'Your high-converting copy will appear here.'}</p>
              </div>
            )}

            {loading && !result && (
               <div className="flex flex-col items-center justify-center h-full space-y-4">
                 <Loader2 className="animate-spin text-indigo-500" size={40} strokeWidth={2.5} />
                 <p className="text-slate-400 font-bold animate-pulse">{t('tools.listing-craft-ai.generating')}</p>
               </div>
            )}

            {result && (
              <div className="space-y-8 animate-in fade-in duration-500">
                {/* Title Section */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {t('tools.listing-craft-ai.labelTitle')}
                  </label>
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-slate-800 leading-relaxed group relative">
                    <p>{sections.title || (loading && '...')}</p>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(sections.title);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="absolute top-3 right-3 p-2 bg-white shadow-sm border border-slate-100 rounded-lg text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-indigo-500"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>

                {/* Description Section */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {t('tools.listing-craft-ai.labelDesc')}
                  </label>
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-slate-600 leading-relaxed text-[15px] group relative">
                    <div className="markdown-body prose prose-slate max-w-none prose-p:my-2 prose-li:my-1">
                      <Markdown>{sections.description || (loading && '...')}</Markdown>
                    </div>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(sections.description);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="absolute top-4 right-4 p-2 bg-white shadow-sm border border-slate-100 rounded-lg text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-indigo-500"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>

                {/* Tags Section */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {t('tools.listing-craft-ai.labelTags')}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(sections.tags || '').split(/[,，]/).filter(t => t.trim()).map((tag, i) => (
                      <span key={i} className="px-3 py-1.5 bg-indigo-50/50 border border-indigo-100 text-indigo-500 rounded-lg text-xs font-bold">
                        #{tag.trim().replace(/^#/, '')}
                      </span>
                    )) || (loading && '...')}
                  </div>
                </div>

                {/* Social Copy Section */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {t('tools.listing-craft-ai.labelSocial')}
                  </label>
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-slate-600 italic leading-relaxed group relative">
                    <p>{sections.social || (loading && '...')}</p>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(sections.social);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="absolute top-3 right-3 p-2 bg-white shadow-sm border border-slate-100 rounded-lg text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-indigo-500"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SEO Education Panel (Bottom) */}
      <div className="bg-slate-900 rounded-[32px] p-8 lg:p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
           <Tag size={300} strokeWidth={1} className="rotate-12" />
        </div>
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1fr,350px] gap-12 items-center">
          <div>
            <h2 className="text-2xl font-black mb-4 tracking-tight">{t('tools.listing-craft-ai.seoTitle')}</h2>
            <p className="text-slate-400 text-base leading-relaxed mb-8 max-w-2xl">
              {t('tools.listing-craft-ai.seoDesc')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
               <div className="space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-2">
                    <Sparkles size={18} />
                  </div>
                  <h4 className="font-bold text-sm">{t('tools.listing-craft-ai.highlight1Title')}</h4>
                  <p className="text-xs text-slate-500">{t('tools.listing-craft-ai.highlight1Desc')}</p>
               </div>
               <div className="space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2">
                    <Target size={18} />
                  </div>
                  <h4 className="font-bold text-sm">{t('tools.listing-craft-ai.highlight2Title')}</h4>
                  <p className="text-xs text-slate-500">{t('tools.listing-craft-ai.highlight2Desc')}</p>
               </div>
               <div className="space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 mb-2">
                    <Globe size={18} />
                  </div>
                  <h4 className="font-bold text-sm">{t('tools.listing-craft-ai.highlight3Title')}</h4>
                  <p className="text-xs text-slate-500">{t('tools.listing-craft-ai.highlight3Desc')}</p>
               </div>
            </div>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm self-start">
             <div className="flex items-center gap-2 mb-4 text-white/40 text-[10px] font-black uppercase tracking-widest">
                <Box size={14} />
                Deep Learning Engine
             </div>
             <p className="text-sm text-slate-300 leading-relaxed italic">
               "{t('tools.listing-craft-ai.techDrive')}"
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}

