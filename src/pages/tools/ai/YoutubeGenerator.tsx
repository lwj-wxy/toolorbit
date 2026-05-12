import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, Loader2, Copy, Check, Clapperboard } from 'lucide-react';
import Markdown from 'react-markdown';

export default function YoutubeGenerator() {
  const { t, i18n } = useTranslation();
  
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('engaging');
  const [targetAudience, setTargetAudience] = useState('');
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
    const sections = { title: '', description: '', tags: '', thumbnails: '' };
    if (!text) return sections;
    const titleMatch = text.match(/\[TITLE\]([\s\S]*?)(?=\[|$)/);
    const descMatch = text.match(/\[DESCRIPTION\]([\s\S]*?)(?=\[|$)/);
    const tagsMatch = text.match(/\[TAGS\]([\s\S]*?)(?=\[|$)/);
    const thumbMatch = text.match(/\[THUMBNAIL_IDEAS\]([\s\S]*?)(?=\[|$)/);
    if (titleMatch) sections.title = titleMatch[1].trim();
    if (descMatch) sections.description = descMatch[1].trim();
    if (tagsMatch) sections.tags = tagsMatch[1].trim();
    if (thumbMatch) sections.thumbnails = thumbMatch[1].trim();
    return sections;
  };

  const currentSections = parseCopyResult(result);

  const requestStream = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setError('');
    setResult('');
    let currentText = '';
    
    try {
      const res = await fetch('/api/youtube-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          tone, targetAudience, language 
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
    <div className="max-w-7xl mx-auto space-y-8 pb-20 pt-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center justify-center gap-3">
          <Clapperboard className="text-rose-500" size={32} />
          {isZh ? 'YouTube 视频标题与简介生成器' : 'YouTube Title & Description Generator'}
        </h1>
        <p className="text-slate-500 mt-3 text-lg">
          {isZh ? '一键生成高点击率的 YouTube 标题、SEO 优化描述及标签。' : 'Generate catchy, high-CTR titles and SEO-optimized descriptions instantly.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[400px,1fr] gap-8 items-start">
        {/* Left Input Sidebar */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6 sm:p-7 space-y-6">
          <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Sparkles className="text-rose-500" />
            {isZh ? '内容设置' : 'Video Idea'}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-slate-700 mb-1 block">{isZh ? '视频主题 / 细节' : 'Video Topic'}</label>
              <textarea value={topic} onChange={e => setTopic(e.target.value)} placeholder={isZh ? '例如：教你如何在家制作咖啡拉花...' : 'e.g. How to create latte art at home...'} className="w-full min-h-[100px] p-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 resize-none" />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 mb-1 block">{isZh ? '目标观众' : 'Target Audience'}</label>
              <input value={targetAudience} onChange={e => setTargetAudience(e.target.value)} placeholder={isZh ? '例如：咖啡初学者' : 'e.g. Coffee beginners'} className="w-full h-11 px-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-rose-500/20 outline-none" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">{isZh ? '输出语言' : 'Language'}</label>
                <select value={language} onChange={e => setLanguage(e.target.value)} className="w-full h-10 px-2 rounded-xl border border-slate-200 bg-white text-xs">
                  <option value="English">English</option><option value="Chinese">Chinese</option><option value="Japanese">Japanese</option><option value="Spanish">Spanish</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">{isZh ? '推荐语气' : 'Tone'}</label>
                <select value={tone} onChange={e => setTone(e.target.value)} className="w-full h-10 px-2 rounded-xl border border-slate-200 bg-white text-xs">
                  <option value="engaging">Engaging</option><option value="educational">Educational</option><option value="dramatic">Dramatic/Clicky</option>
                </select>
              </div>
            </div>
            <button 
              onClick={requestStream} disabled={loading || !topic.trim()}
              className="w-full h-12 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold mt-4 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={18}/> : <Sparkles size={18}/>}
              {isZh ? '开始生成' : 'Generate'}
            </button>
          </div>
        </div>

        {/* Right Result Panel */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 min-h-[600px] flex flex-col p-6 sm:p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 font-medium text-sm">
              {error}
            </div>
          )}

          <div className="flex-1 overflow-y-auto">
            {!result && !loading && (
              <div className="h-full flex flex-col items-center justify-center opacity-40 py-20 text-center">
                <Sparkles size={64} className="mb-4 text-slate-300" />
                <p className="font-bold text-lg">{isZh ? '等待生成...' : 'Waiting for magic...'}</p>
              </div>
            )}
            {loading && !result && (
              <div className="h-full flex flex-col items-center justify-center py-20">
                <Loader2 className="animate-spin text-rose-500 opacity-60" size={48} />
              </div>
            )}
            {result && (
              <div className="space-y-6">
                {['title', 'description', 'tags', 'thumbnails'].map(field => {
                  const content = (currentSections as any)[field];
                  if (!content && !loading) return null;
                  return (
                    <div key={field} className="relative group p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                      <span className="text-xs font-bold text-slate-400 uppercase mb-2 block">{field}</span>
                      {field === 'description' || field === 'title' || field === 'thumbnails' ? 
                        <div className="prose prose-slate prose-sm"><Markdown>{content}</Markdown></div> :
                        <p className={`text-slate-700 ${field==='tags'?'font-mono text-sm leading-relaxed':''}`}>{content}</p>
                      }
                      {content && (
                        <button onClick={() => copyToClipboard(content, field)} className="absolute top-3 right-3 p-2 bg-white rounded-lg shadow-sm border border-slate-200 opacity-0 group-hover:opacity-100 hover:text-rose-600 transition-all">
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
    </div>
  );
}
