import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Target, Loader2 } from 'lucide-react';
import ToolSEOCard from '../../../components/ToolSEOCard';

export default function CompetitorTracker() {
  const { t, i18n } = useTranslation();
  
  const [compProduct, setCompProduct] = useState('');
  const [compInfo, setCompInfo] = useState('');
  const [compLanguage, setCompLanguage] = useState(i18n.language === 'zh' ? '中文' : 'English');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setCompLanguage(i18n.language === 'zh' ? '中文' : 'English');
  }, [i18n.language]);

  const requestStream = async () => {
    if (!compProduct.trim() || !compInfo.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    let currentText = '';
    
    try {
      const res = await fetch('/api/competitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          productName: compProduct, 
          competitorInfo: compInfo, 
          language: compLanguage 
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
                }
              } catch (e) {}
            }
          }
        }
      }

      if (currentText) {
        try {
          setResult(JSON.parse(currentText));
        } catch (e) {
           const match = currentText.match(/\{[\s\S]*\}/);
           if (match) setResult(JSON.parse(match[0]));
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
            {t('tools.competitor-tracker.title', isZh ? '竞品分析器' : 'Competitor Tracker')}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            {t(
              'tools.competitor-tracker.subtitle',
              isZh
                ? '分析竞争对手，找出弱点，为你的产品寻找新机会。'
                : 'Analyze competitors, find weaknesses, and identify opportunities for your products.',
            )}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Input Sidebar */}
        <div className="flex h-[500px] flex-col space-y-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#282c34]">
          <h2 className="flex items-center gap-2 text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
            <Target className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
            {isZh ? '竞品分析器' : 'Competitor Tracker'}
          </h2>

          <div className="flex flex-1 flex-col space-y-4">
            <div>
              <label className="mb-1 block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">{isZh ? '我的产品' : 'My Product'}</label>
              <input value={compProduct} onChange={e => setCompProduct(e.target.value)} placeholder={isZh ? '如: 手工编织包' : 'e.g. Handmade Woven Bag'} className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">{isZh ? '竞品详情/链接描述' : 'Competitor Description'}</label>
              <textarea value={compInfo} onChange={e => setCompInfo(e.target.value)} placeholder={isZh ? '竞品的卖点介绍或评论槽点...' : 'Paste competitor features...'} className="min-h-[120px] w-full resize-none rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">{isZh ? '语言' : 'Language'}</label>
              <select value={compLanguage} onChange={e => setCompLanguage(e.target.value)} className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                <option value="中文">Chinese</option><option value="English">English</option>
              </select>
            </div>
            <button 
              onClick={requestStream} disabled={loading || !compProduct.trim() || !compInfo.trim()}
              className="mt-auto inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-cyan-600 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-800"
            >
              {loading ? <Loader2 className="animate-spin" size={18}/> : <Target size={18}/>}
              {isZh ? '分析竞品' : 'Analyze Competitor'}
            </button>
          </div>
        </div>

        {/* Right Result Panel */}
        <div className="flex h-[500px] flex-col rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          {error && (
            <div className="mb-4 rounded-lg border border-rose-100 bg-rose-50 p-4 text-sm font-medium text-rose-600">
              {error}
            </div>
          )}

          <div className="h-full flex-1 overflow-y-auto">
            {loading && <div className="flex h-full items-center justify-center"><Loader2 className="animate-spin text-cyan-500" size={40}/></div>}
            {!loading && !result && <div className="h-full flex items-center justify-center opacity-40"><Target size={48}/></div>}
            {result && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 rounded-lg border border-slate-200 bg-white p-5 text-center dark:border-slate-700 dark:bg-slate-950">
                  <div><p className="text-sm font-bold text-slate-500">My Score</p><p className="text-3xl font-black text-cyan-600">{result.comparison?.score?.mine}</p></div>
                  <div><p className="text-slate-500 font-bold text-sm">Competitor</p><p className="text-3xl font-black text-orange-500">{result.comparison?.score?.competitor}</p></div>
                </div>
                <div>
                  <h3 className="mb-3 font-bold text-slate-800 dark:text-slate-100">{isZh ? '核心差异分析' : 'Key Differences'}</h3>
                  <div className="space-y-2">
                    {result.comparison?.metrics?.map((m: any, i: number) => (
                      <div key={i} className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-950">
                        <div className="flex justify-between items-center mb-1"><span className="font-bold text-sm">{m.name}</span> <span className="text-xs px-2 py-1 bg-slate-100 rounded">You: {m.mine} vs {m.competitor}</span></div>
                        <p className="text-xs text-slate-500">{m.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <ToolSEOCard toolKey="competitor-tracker" />
    </div>
  );
}
