import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Zap, Loader2, Copy, Check } from 'lucide-react';

export default function KeywordAnalyzer() {
  const { t, i18n } = useTranslation();
  
  const [kwSearch, setKwSearch] = useState('');
  const [kwLanguage, setKwLanguage] = useState(i18n.language === 'zh' ? '中文' : 'English');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    setKwLanguage(i18n.language === 'zh' ? '中文' : 'English');
  }, [i18n.language]);

  const copyToClipboard = (text: string, field: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const requestStream = async () => {
    if (!kwSearch.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    let currentText = '';
    
    try {
      const res = await fetch('/api/keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: kwSearch, 
          language: kwLanguage
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
            const jsonMatch = currentText.match(/\{[\s\S]*\}/);
            if (jsonMatch) setResult(JSON.parse(jsonMatch[0]));
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
            {t('tools.keyword-analyzer.title', isZh ? '关键词分析器' : 'Keyword Analyzer')}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            {t(
              'tools.keyword-analyzer.subtitle',
              isZh
                ? '深入挖掘电商长尾关键词，发现隐藏的高利润利基市场。'
                : 'Deep-dive into e-commerce long-tail keywords, discovering hidden profitable niches.',
            )}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Input Sidebar */}
        <div className="flex h-[500px] flex-col space-y-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#282c34]">
          <h2 className="flex items-center gap-2 text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
            <Zap className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
            {isZh ? '关键词分析器' : 'Keyword Analyzer'}
          </h2>

          <div className="flex flex-1 flex-col space-y-4">
            <div>
              <label className="mb-1 block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">{isZh ? '种子产品词' : 'Seed Product'}</label>
              <input value={kwSearch} onChange={e => setKwSearch(e.target.value)} placeholder={isZh ? '如: 纯银项链' : 'e.g. Silver Necklace'} className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">{isZh ? '输出语言' : 'Language'}</label>
              <select value={kwLanguage} onChange={e => setKwLanguage(e.target.value)} className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                <option value="中文">Chinese</option><option value="English">English</option>
              </select>
            </div>
            <button 
              onClick={requestStream} disabled={loading || !kwSearch.trim()}
              className="mt-auto inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-cyan-600 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-800"
            >
              {loading ? <Loader2 className="animate-spin" size={18}/> : <Zap size={18}/>}
              {isZh ? '深度挖掘' : 'Analyze Keywords'}
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
            {!loading && !result && <div className="h-full flex items-center justify-center opacity-40"><Zap size={48}/></div>}
            {result && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-lg border border-cyan-100 bg-cyan-50 p-4"><p className="mb-1 text-xs font-bold text-cyan-700">Total</p><p className="text-xl font-black text-cyan-950">{result.summary?.total}</p></div>
                  <div className="rounded-lg border border-slate-200 bg-white p-4"><p className="mb-1 text-xs font-bold text-slate-500">Avg Competition</p><p className="text-xl font-black text-slate-900">{result.summary?.avgCompetition}</p></div>
                  <div className="rounded-lg border border-slate-200 bg-white p-4"><p className="mb-1 text-xs font-bold text-slate-500">Top Rec</p><p className="line-clamp-1 text-lg font-black text-slate-900">{result.summary?.topRecommendation}</p></div>
                </div>
                {result.categories?.map((cat: any, i: number) => (
                  <div key={i} className="space-y-3">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100">{cat.name}</h3>
                    <div className="space-y-2">
                      {cat.keywords?.map((k: any, j: number) => (
                        <div key={j} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 transition-colors hover:border-cyan-300 dark:border-slate-700 dark:bg-slate-950">
                          <div><p className="text-sm font-bold text-slate-800 dark:text-slate-100">{k.term}</p><p className="text-xs text-slate-400">{k.volume} • Score: {k.score}</p></div>
                          <button onClick={() => copyToClipboard(k.term, k.term)} className="p-1.5 text-slate-400 hover:text-cyan-600">
                            {copiedField === k.term ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
