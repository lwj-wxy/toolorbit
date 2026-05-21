import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart3, Loader2 } from 'lucide-react';
import ToolSEOCard from '../../../components/ToolSEOCard';

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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
            {t('tools.market-insights.title', isZh ? '市场洞察' : 'Market Insights')}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            {t(
              'tools.market-insights.subtitle',
              isZh
                ? '获取指定平台的市场调研报告、趋势和类目动态。'
                : 'Acquire platform-specific market research reports, trends, and category dynamics.',
            )}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Input Sidebar */}
        <div className="flex h-[500px] flex-col space-y-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#282c34]">
          <h2 className="flex items-center gap-2 text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
            <BarChart3 className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
            {isZh ? '市场洞察' : 'Market Insights'}
          </h2>

          <div className="flex flex-1 flex-col space-y-4">
            <div>
              <label className="mb-1 block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">{isZh ? '目标平台' : 'Platform'}</label>
              <select value={marketPlatform} onChange={e => setMarketPlatform(e.target.value)} className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                <option>Etsy</option><option>Amazon</option><option>TikTok Shop</option><option>eBay</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">{isZh ? '语言' : 'Language'}</label>
              <select value={marketLanguage} onChange={e => setMarketLanguage(e.target.value)} className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                <option value="中文">Chinese</option><option value="English">English</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">{isZh ? '时间周期' : 'Timeframe'}</label>
              <div className="flex gap-2">
                {['1', '3', '7'].map(d => (
                  <button key={d} onClick={() => setMarketTimeframe(d)} className={`h-10 flex-1 rounded-lg border text-sm font-semibold transition-colors ${marketTimeframe === d ? 'bg-cyan-50 text-cyan-700 border-cyan-500 dark:bg-cyan-950/30 dark:text-cyan-300 dark:border-cyan-400' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700'}`}>
                    {d} {isZh ? '天' : 'Days'}
                  </button>
                ))}
              </div>
            </div>
            <button 
              onClick={requestStream} disabled={loading}
              className="mt-auto inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-cyan-600 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-800"
            >
              {loading ? <Loader2 className="animate-spin" size={18}/> : <BarChart3 size={18}/>}
              {isZh ? '获取市场报告' : 'Get Insight'}
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
            {!loading && !result && <div className="h-full flex items-center justify-center opacity-40"><BarChart3 size={48}/></div>}
            {result && (
              <div className="space-y-6">
                <div className="flex items-center justify-between"><h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{marketPlatform} Insights</h3> <span className="whitespace-nowrap rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">{dateRangeString}</span></div>
                
                <div className="grid grid-cols-2 gap-4">
                  {result.categories?.map((c: any, i: number) => (
                    <div key={i} className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{c.category}</p>
                      <p className="text-xs text-slate-500 mt-1">Vol: {c.searchVolume} / Growth: {c.growth}%</p>
                    </div>
                  ))}
                </div>
                
                <h3 className="mt-6 text-base font-bold text-slate-900 dark:text-slate-100">{isZh ? '榜单洞察' : 'Insights'}</h3>
                <ul className="list-decimal pl-5 space-y-2">
                  {result.insights?.map((ins: string, i: number) => (
                    <li key={i} className="text-sm text-slate-700 dark:text-slate-300">{ins}</li>
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
