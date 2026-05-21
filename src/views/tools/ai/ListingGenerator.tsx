import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, Loader2, Copy, Check } from 'lucide-react';
import Markdown from 'react-markdown';
import ToolSEOCard from '../../../components/ToolSEOCard';

export default function ListingGenerator() {
  const { t, i18n } = useTranslation();
  
  const [platform, setPlatform] = useState('Etsy');
  const [input, setInput] = useState('');
  const [details, setDetails] = useState('');
  const [keywords] = useState('');
  const [tone, setTone] = useState('persuasive');
  const [targetAudience] = useState('');
  const [language, setLanguage] = useState(i18n.language === 'zh' ? 'Chinese' : 'English');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    const lang = i18n.language === 'zh' ? 'Chinese' : 'English';
    setLanguage(lang);
  }, [i18n.language]);

  const copyToClipboard = (text: string, field: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const parseCopyResult = (text: string) => {
    const sections = { title: '', description: '', tags: '', social: '' };
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

  const currentSections = parseCopyResult(result);

  const requestStream = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError('');
    setResult('');
    let currentText = '';
    
    try {
      const res = await fetch('/api/listing-craft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productInfo: input,
          details: `${details}\nPlatform: ${platform}`,
          keywords, tone, targetAudience, language 
        })
      });
      
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Service unavailable.');
      }
      
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error('Reader empty');
      
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');
          for (const line of lines) {
            const tline = line.trim();
            if (tline.startsWith('data: ') && !tline.includes('[DONE]')) {
              try {
                const data = JSON.parse(tline.substring(6));
                if (data.error) throw new Error(data.error);
                if (data.content) {
                  currentText += data.content;
                  setResult(currentText);
                }
              } catch (e) {}
            }
          }
        }
      }
    } catch (e: any) {
      setError(e.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  const isZh = i18n.language === 'zh';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
            {t('tools.listing-generator.title', isZh ? 'Listing 生成器' : 'Listing Generator')}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            {t(
              'tools.listing-generator.subtitle',
              isZh
                ? 'AI 驱动的电商商品文案生成器。秒级生成标题、描述和标签。'
                : 'AI-driven e-commerce listing generator. Creates titles, descriptions and tags in seconds.',
            )}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Input Sidebar */}
        <div className="flex h-[560px] flex-col space-y-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#282c34]">
          <h2 className="flex items-center gap-2 text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
            <Sparkles className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
            {isZh ? '商品文案生成器' : 'Listing Generator'}
          </h2>

          <div className="flex flex-1 flex-col space-y-4">
            <div>
              <label className="mb-1 block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">{isZh ? '销售平台' : 'Platform'}</label>
              <select value={platform} onChange={e => setPlatform(e.target.value)} className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                <option>Etsy</option><option>Amazon</option><option>Shopify</option><option>eBay</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">{isZh ? '产品名称' : 'Product Name'}</label>
              <input value={input} onChange={e => setInput(e.target.value)} placeholder={isZh ? '手工陶瓷马克杯' : 'Handmade Ceramic Mug'} className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">{isZh ? '特色与卖点' : 'Features'}</label>
              <textarea value={details} onChange={e => setDetails(e.target.value)} placeholder={isZh ? '极简风格，送礼佳品...' : 'Minimalist, great gift...'} className="min-h-[100px] w-full resize-none rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-200">{isZh ? '语言' : 'Language'}</label>
                <select value={language} onChange={e => setLanguage(e.target.value)} className="h-10 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-900 outline-none focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                  <option value="English">English</option><option value="Chinese">Chinese</option><option value="Japanese">Japanese</option><option value="German">German</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-200">{isZh ? '语气' : 'Tone'}</label>
                <select value={tone} onChange={e => setTone(e.target.value)} className="h-10 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-900 outline-none focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                  <option value="persuasive">Persuasive</option><option value="professional">Professional</option><option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
            <button 
              onClick={requestStream} disabled={loading || !input.trim()}
              className="mt-auto inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-cyan-600 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-800"
            >
              {loading ? <Loader2 className="animate-spin" size={18}/> : <Sparkles size={18}/>}
              {isZh ? '生成文案' : 'Generate'}
            </button>
          </div>
        </div>

        {/* Right Result Panel */}
        <div className="flex h-[560px] flex-col rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          {error && (
            <div className="mb-4 rounded-lg border border-rose-100 bg-rose-50 p-4 text-sm font-medium text-rose-600">
              {error}
            </div>
          )}

          <div className="flex-1 overflow-y-auto">
            {!result && !loading && (
              <div className="h-full flex flex-col items-center justify-center opacity-40 py-20 text-center">
                <Sparkles size={64} className="mb-4 text-slate-300" />
                <p className="font-bold text-lg">{isZh ? '等待生成...' : 'Waiting...'}</p>
              </div>
            )}
            {loading && !result && (
              <div className="h-full flex flex-col items-center justify-center py-20">
                <Loader2 className="animate-spin text-indigo-500 opacity-60" size={48} />
              </div>
            )}
            {result && (
              <div className="space-y-6">
                {['title', 'description', 'tags', 'social'].map(field => {
                  const content = (currentSections as any)[field];
                  if (!content && !loading) return null;
                  return (
                    <div key={field} className="group relative rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-950">
                      <span className="text-xs font-bold text-slate-400 uppercase mb-2 block">{field}</span>
                      {field === 'description' ? 
                        <div className="prose prose-slate prose-sm"><Markdown>{content}</Markdown></div> :
                        <p className={`text-slate-700 ${field==='tags'?'font-mono text-xs':''}`}>{content}</p>
                      }
                      {content && (
                        <button onClick={() => copyToClipboard(content, field)} className="absolute right-3 top-3 rounded-md border border-slate-300 bg-white p-2 opacity-0 shadow-sm transition-all hover:text-cyan-600 group-hover:opacity-100 dark:border-slate-700 dark:bg-[#282c34]">
                          {copiedField === field ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      <ToolSEOCard toolKey="listing-generator" />
    </div>
  );
}
