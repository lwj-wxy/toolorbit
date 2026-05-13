import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, Loader2, Copy, Check } from 'lucide-react';
import Markdown from 'react-markdown';
import ToolSEOCard from '../../../components/ToolSEOCard';

export default function ListingGenerator() {
  const { i18n } = useTranslation();
  
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
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-[400px,1fr] gap-8 items-start">
        {/* Left Input Sidebar */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6 sm:p-7 space-y-6">
          <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Sparkles className="text-indigo-500" />
            {isZh ? '商品文案生成器' : 'Listing Generator'}
          </h1>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-slate-700 mb-1 block">{isZh ? '销售平台' : 'Platform'}</label>
              <select value={platform} onChange={e => setPlatform(e.target.value)} className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none">
                <option>Etsy</option><option>Amazon</option><option>Shopify</option><option>eBay</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 mb-1 block">{isZh ? '产品名称' : 'Product Name'}</label>
              <input value={input} onChange={e => setInput(e.target.value)} placeholder={isZh ? '手工陶瓷马克杯' : 'Handmade Ceramic Mug'} className="w-full h-11 px-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none" />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 mb-1 block">{isZh ? '特色与卖点' : 'Features'}</label>
              <textarea value={details} onChange={e => setDetails(e.target.value)} placeholder={isZh ? '极简风格，送礼佳品...' : 'Minimalist, great gift...'} className="w-full min-h-[100px] p-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">{isZh ? '语言' : 'Language'}</label>
                <select value={language} onChange={e => setLanguage(e.target.value)} className="w-full h-10 px-2 rounded-xl border border-slate-200 bg-white text-xs">
                  <option value="English">English</option><option value="Chinese">Chinese</option><option value="Japanese">Japanese</option><option value="German">German</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">{isZh ? '语气' : 'Tone'}</label>
                <select value={tone} onChange={e => setTone(e.target.value)} className="w-full h-10 px-2 rounded-xl border border-slate-200 bg-white text-xs">
                  <option value="persuasive">Persuasive</option><option value="professional">Professional</option><option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
            <button 
              onClick={requestStream} disabled={loading || !input.trim()}
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold mt-4 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={18}/> : <Sparkles size={18}/>}
              {isZh ? '生成文案' : 'Generate'}
            </button>
          </div>
        </div>

        {/* Right Result Panel */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 min-h-[600px] flex flex-col p-6 sm:p-8">
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 font-medium text-sm">
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
                    <div key={field} className="relative group p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                      <span className="text-xs font-bold text-slate-400 uppercase mb-2 block">{field}</span>
                      {field === 'description' ? 
                        <div className="prose prose-slate prose-sm"><Markdown>{content}</Markdown></div> :
                        <p className={`text-slate-700 ${field==='tags'?'font-mono text-xs':''}`}>{content}</p>
                      }
                      {content && (
                        <button onClick={() => copyToClipboard(content, field)} className="absolute top-3 right-3 p-2 bg-white rounded-lg shadow-sm border border-slate-200 opacity-0 group-hover:opacity-100 hover:text-indigo-600 transition-all">
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
