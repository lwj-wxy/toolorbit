import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, Loader2, Copy, Check } from 'lucide-react';
import Markdown from 'react-markdown';

export default function YoutubeGenerator() {
  const { i18n } = useTranslation();
  
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

    const sectionPattern = (marker: string) =>
      new RegExp(`\\[${marker}\\]\\s*:?\\s*([\\s\\S]*?)(?=\\n?\\[[A-Z_]+\\]|$)`, 'i');

    const titleMatch = text.match(sectionPattern('TITLE'));
    const descMatch = text.match(sectionPattern('DESCRIPTION'));
    const tagsMatch = text.match(sectionPattern('TAGS'));
    const thumbMatch = text.match(sectionPattern('THUMBNAIL_IDEAS'));

    if (titleMatch) sections.title = titleMatch[1].trim();
    if (descMatch) sections.description = descMatch[1].trim();
    if (tagsMatch) sections.tags = tagsMatch[1].trim();
    if (thumbMatch) sections.thumbnails = thumbMatch[1].trim();
    return sections;
  };

  const currentSections = parseCopyResult(result);
  const hasStructuredResult = Object.values(currentSections).some(Boolean);

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
      let pending = '';
      
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (value) {
          pending += decoder.decode(value, { stream: true });
          const lines = pending.split('\n');
          pending = lines.pop() || '';

          for (const line of lines) {
            const tline = line.trim();
            if (tline.startsWith('data: ') && !tline.includes('[DONE]')) {
              const payload = tline.substring(6);
              try {
                const data = JSON.parse(payload);
                if (data.error) {
                  setError(data.error);
                  continue;
                }
                if (data.content) {
                  currentText += data.content;
                  setResult(currentText);
                }
              } catch {
                pending = `${line}\n${pending}`;
                break;
              }
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
          {isZh ? 'YouTube 视频标题与简介生成器' : 'YouTube Title & Description Generator'}
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
          {isZh ? '一键生成高点击率的 YouTube 标题、SEO 优化描述及标签。' : 'Generate catchy, high-CTR titles and SEO-optimized descriptions instantly.'}
        </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Input Sidebar */}
        <div className="flex h-[500px] flex-col overflow-y-auto rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#282c34]">
          <h2 className="flex items-center gap-2 text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
            <Sparkles className="h-4 w-4 text-cyan-600" />
            {isZh ? '内容设置' : 'Video Idea'}
          </h2>

          <div className="mt-5">
            <div>
              <label className="text-sm font-bold text-slate-700 mb-1 block">{isZh ? '视频主题 / 细节' : 'Video Topic'}</label>
              <textarea value={topic} onChange={e => setTopic(e.target.value)} placeholder={isZh ? '例如：教你如何在家制作咖啡拉花...' : 'e.g. How to create latte art at home...'} className="h-32 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
            </div>
            <div className="mt-5">
              <label className="text-sm font-bold text-slate-700 mb-1 block">{isZh ? '目标观众' : 'Target Audience'}</label>
              <input value={targetAudience} onChange={e => setTargetAudience(e.target.value)} placeholder={isZh ? '例如：咖啡初学者' : 'e.g. Coffee beginners'} className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
            </div>
            
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">{isZh ? '输出语言' : 'Language'}</label>
                <select value={language} onChange={e => setLanguage(e.target.value)} className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs text-slate-900 outline-none transition-colors focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                  <option value="English">English</option><option value="Chinese">Chinese</option><option value="Japanese">Japanese</option><option value="Spanish">Spanish</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">{isZh ? '推荐语气' : 'Tone'}</label>
                <select value={tone} onChange={e => setTone(e.target.value)} className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs text-slate-900 outline-none transition-colors focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                  <option value="engaging">Engaging</option><option value="educational">Educational</option><option value="dramatic">Dramatic/Clicky</option>
                </select>
              </div>
            </div>
            <button 
              onClick={requestStream} disabled={loading || !topic.trim()}
              className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-md bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={18}/> : <Sparkles size={18}/>}
              {isZh ? '开始生成' : 'Generate'}
            </button>
          </div>
        </div>

        {/* Right Result Panel */}
        <div className="flex h-[500px] flex-col rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 dark:border-red-900/70 dark:bg-red-950/20 dark:text-red-200">
              {error}
            </div>
          )}

          <div className="min-h-0 flex-1 overflow-y-auto rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-[#282c34]">
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
            {result && hasStructuredResult && (
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
                        <button onClick={() => copyToClipboard(content, field)} className="absolute top-3 right-3 rounded-md border border-slate-200 bg-white p-2 opacity-0 shadow-sm transition-all hover:text-cyan-700 group-hover:opacity-100 dark:border-slate-700 dark:bg-slate-900">
                          {copiedField === field ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            {result && !hasStructuredResult && (
              <div className="relative group p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                <span className="text-xs font-bold text-slate-400 uppercase mb-3 block">
                  {isZh ? '生成结果' : 'Generated Result'}
                </span>
                <div className="prose prose-slate prose-sm max-w-none">
                  <Markdown>{result}</Markdown>
                </div>
                <button onClick={() => copyToClipboard(result, 'raw')} className="absolute top-3 right-3 rounded-md border border-slate-200 bg-white p-2 opacity-0 shadow-sm transition-all hover:text-cyan-700 group-hover:opacity-100 dark:border-slate-700 dark:bg-slate-900">
                  {copiedField === 'raw' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
