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
  const [streamingText, setStreamingText] = useState('');
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
    setStreamingText('');
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
                  setStreamingText(currentText);
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
  const hasStructuredResult = Boolean(result?.comparison?.score && Array.isArray(result?.comparison?.metrics));
  const fallbackText = result && !hasStructuredResult ? JSON.stringify(result, null, 2) : '';
  const hasStreamStarted = Boolean(streamingText);

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
            {loading && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 rounded-lg border border-slate-200 bg-white p-5 text-center dark:border-slate-700 dark:bg-slate-950">
                  <div>
                    <p className="text-sm font-bold text-slate-500">My Score</p>
                    <div className="mx-auto mt-2 h-9 w-16 rounded-md bg-cyan-100 dark:bg-cyan-950/50" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-500">Competitor</p>
                    <div className="mx-auto mt-2 h-9 w-16 rounded-md bg-orange-100 dark:bg-orange-950/50" />
                  </div>
                </div>
                <div>
                  <div className="mb-3 flex items-center gap-2 font-bold text-slate-800 dark:text-slate-100">
                    <Loader2 className="h-4 w-4 animate-spin text-cyan-600" />
                    {hasStreamStarted
                      ? (isZh ? '正在整理核心差异...' : 'Organizing key differences...')
                      : (isZh ? '正在生成竞品分析...' : 'Generating competitor analysis...')}
                  </div>
                  <div className="space-y-3">
                    {[0, 1].map((placeholderIndex) => (
                      <div key={placeholderIndex} className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
                        <div className="h-5 w-32 rounded bg-slate-200 dark:bg-slate-800" />
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div className="rounded-md border border-cyan-100 bg-cyan-50 px-3 py-2 dark:border-cyan-900/50 dark:bg-cyan-950/30">
                            <span className="text-[11px] font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">
                              {isZh ? '我的产品' : 'You'}
                            </span>
                            <div className="mt-2 space-y-2">
                              <div className="h-3 rounded bg-cyan-100 dark:bg-cyan-900/50" />
                              <div className="h-3 w-3/4 rounded bg-cyan-100 dark:bg-cyan-900/50" />
                            </div>
                          </div>
                          <div className="rounded-md border border-orange-100 bg-orange-50 px-3 py-2 dark:border-orange-900/50 dark:bg-orange-950/30">
                            <span className="text-[11px] font-semibold uppercase tracking-wide text-orange-700 dark:text-orange-300">
                              {isZh ? '竞品' : 'Competitor'}
                            </span>
                            <div className="mt-2 space-y-2">
                              <div className="h-3 rounded bg-orange-100 dark:bg-orange-900/50" />
                              <div className="h-3 w-2/3 rounded bg-orange-100 dark:bg-orange-900/50" />
                            </div>
                          </div>
                        </div>
                        <div className="border-t border-slate-100 pt-3 dark:border-slate-800">
                          <div className="h-3 rounded bg-slate-200 dark:bg-slate-800" />
                          <div className="mt-2 h-3 w-4/5 rounded bg-slate-200 dark:bg-slate-800" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {!loading && !result && <div className="h-full flex items-center justify-center opacity-40"><Target size={48}/></div>}
            {!loading && fallbackText && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/20 dark:text-amber-200">
                {isZh ? '分析已返回，但结构化结果解析不完整。请重新生成一次。' : 'The analysis returned, but the structured result could not be fully parsed. Please generate again.'}
              </div>
            )}
            {hasStructuredResult && !loading && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 rounded-lg border border-slate-200 bg-white p-5 text-center dark:border-slate-700 dark:bg-slate-950">
                  <div><p className="text-sm font-bold text-slate-500">My Score</p><p className="text-3xl font-black text-cyan-600">{result.comparison?.score?.mine}</p></div>
                  <div><p className="text-slate-500 font-bold text-sm">Competitor</p><p className="text-3xl font-black text-orange-500">{result.comparison?.score?.competitor}</p></div>
                </div>
                <div>
                  <h3 className="mb-3 font-bold text-slate-800 dark:text-slate-100">{isZh ? '核心差异分析' : 'Key Differences'}</h3>
                  <div className="space-y-2">
                    {result.comparison?.metrics?.map((metric: any, metricIndex: number) => (
                      <div key={metricIndex} className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
                        <h4 className="text-base font-bold leading-6 text-slate-900 dark:text-slate-100">
                          {metric.name}
                        </h4>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div className="rounded-md border border-cyan-100 bg-cyan-50 px-3 py-2 dark:border-cyan-900/50 dark:bg-cyan-950/30">
                            <span className="text-[11px] font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">
                              {isZh ? '我的产品' : 'You'}
                            </span>
                            <p className="mt-1 break-words text-sm leading-5 text-slate-800 dark:text-slate-200">
                              {metric.mine}
                            </p>
                          </div>
                          <div className="rounded-md border border-orange-100 bg-orange-50 px-3 py-2 dark:border-orange-900/50 dark:bg-orange-950/30">
                            <span className="text-[11px] font-semibold uppercase tracking-wide text-orange-700 dark:text-orange-300">
                              {isZh ? '竞品' : 'Competitor'}
                            </span>
                            <p className="mt-1 break-words text-sm leading-5 text-slate-800 dark:text-slate-200">
                              {metric.competitor}
                            </p>
                          </div>
                        </div>
                        {metric.comment ? (
                          <p className="border-t border-slate-100 pt-3 text-sm leading-6 text-slate-600 dark:border-slate-800 dark:text-slate-400">
                            {metric.comment}
                          </p>
                        ) : null}
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
