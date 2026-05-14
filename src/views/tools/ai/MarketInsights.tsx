import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart3, Loader2 } from 'lucide-react';
import ToolSEOCard from '../../../components/ToolSEOCard';
import ToolPageHero from '../../../components/ToolPageHero';

export default function MarketInsights() {
  const { t, i18n } = useTranslation();
  
  const [marketPlatform, setMarketPlatform] = useState('Etsy');
  const [marketTimeframe, setMarketTimeframe] = useState('7');
  const [marketLanguage, setMarketLanguage] = useState(i18n.language === 'zh' ? '中文' : 'English');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setMarketLanguage(i18n.language === 'zh' ? '中文' : 'English');
  }, [i18n.language]);

  const dateRangeString = useMemo(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - parseInt(marketTimeframe));
    const formatDt = (d: Date) => d.toISOString().split('T')[0];
    return `${formatDt(start)} to ${formatDt(end)}`;
  }, [marketTimeframe]);

  const requestStream = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    let currentText = '';
    
    try {
      const res = await fetch('/api/market-research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          platform: marketPlatform, 
          timeframe: marketTimeframe, 
          language: marketLanguage 
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
        } catch(e) {
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
        icon={BarChart3}
        title={t('tools.market-insights.title', isZh ? '市场洞察' : 'Market Insights')}
        description={t(
          'tools.market-insights.subtitle',
          isZh
            ? '获取指定平台的市场调研报告、趋势和类目动态。'
            : 'Acquire platform-specific market research reports, trends, and category dynamics.',
        )}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[400px,1fr] gap-8 items-start">
        {/* Left Input Sidebar */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6 sm:p-7 space-y-6">
          <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <BarChart3 className="text-indigo-500" />
            {isZh ? '市场洞察' : 'Market Insights'}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-slate-700 mb-1 block">{isZh ? '目标平台' : 'Platform'}</label>
              <select value={marketPlatform} onChange={e => setMarketPlatform(e.target.value)} className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-indigo-500/20">
                <option>Etsy</option><option>Amazon</option><option>TikTok Shop</option><option>eBay</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 mb-1 block">{isZh ? '语言' : 'Language'}</label>
              <select value={marketLanguage} onChange={e => setMarketLanguage(e.target.value)} className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-white text-sm outline-none">
                <option value="中文">Chinese</option><option value="English">English</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 mb-2 block">{isZh ? '时间周期' : 'Timeframe'}</label>
              <div className="flex gap-2">
                {['1', '3', '7'].map(d => (
                  <button key={d} onClick={() => setMarketTimeframe(d)} className={`flex-1 h-10 rounded-lg text-sm font-bold border transition-colors ${marketTimeframe === d ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                    {d} {isZh ? '天' : 'Days'}
                  </button>
                ))}
              </div>
            </div>
            <button 
              onClick={requestStream} disabled={loading}
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold mt-4 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={18}/> : <BarChart3 size={18}/>}
              {isZh ? '获取市场报告' : 'Get Insight'}
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
            {!loading && !result && <div className="h-full flex items-center justify-center opacity-40"><BarChart3 size={48}/></div>}
            {result && (
              <div className="space-y-6">
                <div className="flex items-center justify-between"><h3 className="font-bold text-lg">{marketPlatform} Insights</h3> <span className="text-xs bg-slate-100 px-2 rounded-md py-0.5 whitespace-nowrap text-slate-600 font-bold">{dateRangeString}</span></div>
                
                <div className="grid grid-cols-2 gap-4">
                  {result.categories?.map((c: any, i: number) => (
                    <div key={i} className="p-4 border border-slate-100 rounded-xl bg-slate-50">
                      <p className="font-bold text-sm">{c.category}</p>
                      <p className="text-xs text-slate-500 mt-1">Vol: {c.searchVolume} / Growth: {c.growth}%</p>
                    </div>
                  ))}
                </div>
                
                <h3 className="font-bold text-md mt-6">{isZh ? '榜单洞察' : 'Insights'}</h3>
                <ul className="list-decimal pl-5 space-y-2">
                  {result.insights?.map((ins: string, i: number) => (
                    <li key={i} className="text-sm text-slate-700">{ins}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      <ToolSEOCard toolKey="market-insights" />
    </div>
  );
}
