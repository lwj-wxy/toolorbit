import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Target, Loader2 } from 'lucide-react';
import ToolSEOCard from '../../../components/ToolSEOCard';
import ToolPageHero from '../../../components/ToolPageHero';

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
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      <ToolPageHero
        icon={Target}
        title={t('tools.competitor-tracker.title', isZh ? '竞品分析器' : 'Competitor Tracker')}
        description={t(
          'tools.competitor-tracker.subtitle',
          isZh
            ? '分析竞争对手，找出弱点，为你的产品寻找新机会。'
            : 'Analyze competitors, find weaknesses, and identify opportunities for your products.',
        )}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[400px,1fr] gap-8 items-start">
        {/* Left Input Sidebar */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6 sm:p-7 space-y-6">
          <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Target className="text-indigo-500" />
            {isZh ? '竞品分析器' : 'Competitor Tracker'}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-slate-700 mb-1 block">{isZh ? '我的产品' : 'My Product'}</label>
              <input value={compProduct} onChange={e => setCompProduct(e.target.value)} placeholder={isZh ? '如: 手工编织包' : 'e.g. Handmade Woven Bag'} className="w-full h-11 px-3 rounded-xl border border-slate-200 outline-none text-sm focus:ring-2 focus:ring-indigo-500/20" />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 mb-1 block">{isZh ? '竞品详情/链接描述' : 'Competitor Description'}</label>
              <textarea value={compInfo} onChange={e => setCompInfo(e.target.value)} placeholder={isZh ? '竞品的卖点介绍或评论槽点...' : 'Paste competitor features...'} className="w-full min-h-[120px] p-3 rounded-xl border border-slate-200 outline-none text-sm resize-none focus:ring-2 focus:ring-indigo-500/20" />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 mb-1 block">{isZh ? '语言' : 'Language'}</label>
              <select value={compLanguage} onChange={e => setCompLanguage(e.target.value)} className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-white text-sm outline-none">
                <option value="中文">Chinese</option><option value="English">English</option>
              </select>
            </div>
            <button 
              onClick={requestStream} disabled={loading || !compProduct.trim() || !compInfo.trim()}
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold mt-4 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={18}/> : <Target size={18}/>}
              {isZh ? '透视竞品' : 'Analyze Competitor'}
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

          <div className="flex-1 h-full">
            {loading && <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-indigo-500" size={40}/></div>}
            {!loading && !result && <div className="h-full flex items-center justify-center opacity-40"><Target size={48}/></div>}
            {result && (
              <div className="space-y-6">
                <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl grid grid-cols-2 text-center">
                  <div><p className="text-slate-500 font-bold text-sm">My Score</p><p className="text-3xl font-black text-indigo-600">{result.comparison?.score?.mine}</p></div>
                  <div><p className="text-slate-500 font-bold text-sm">Competitor</p><p className="text-3xl font-black text-orange-500">{result.comparison?.score?.competitor}</p></div>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 mb-3">{isZh ? '核心差异分析' : 'Key Differences'}</h3>
                  <div className="space-y-2">
                    {result.comparison?.metrics?.map((m: any, i: number) => (
                      <div key={i} className="p-3 border border-slate-100 rounded-xl bg-white">
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
