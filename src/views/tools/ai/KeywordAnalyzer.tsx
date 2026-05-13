import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Zap, Loader2, Copy, Check } from 'lucide-react';

export default function KeywordAnalyzer() {
  const { i18n } = useTranslation();
  
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
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-[400px,1fr] gap-8 items-start">
        {/* Left Input Sidebar */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6 sm:p-7 space-y-6">
          <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Zap className="text-indigo-500" />
            {isZh ? '关键词分析器' : 'Keyword Analyzer'}
          </h1>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-slate-700 mb-1 block">{isZh ? '种子产品词' : 'Seed Product'}</label>
              <input value={kwSearch} onChange={e => setKwSearch(e.target.value)} placeholder={isZh ? '如: 纯银项链' : 'e.g. Silver Necklace'} className="w-full h-11 px-3 rounded-xl border border-slate-200 outline-none text-sm focus:ring-2 focus:ring-indigo-500/20" />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 mb-1 block">{isZh ? '输出语言' : 'Language'}</label>
              <select value={kwLanguage} onChange={e => setKwLanguage(e.target.value)} className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-white text-sm outline-none">
                <option value="中文">Chinese</option><option value="English">English</option>
              </select>
            </div>
            <button 
              onClick={requestStream} disabled={loading || !kwSearch.trim()}
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold mt-4 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={18}/> : <Zap size={18}/>}
              {isZh ? '深度挖掘' : 'Analyze Keywords'}
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
            {!loading && !result && <div className="h-full flex items-center justify-center opacity-40"><Zap size={48}/></div>}
            {result && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl"><p className="text-xs text-indigo-600 font-bold mb-1">Total</p><p className="text-xl font-black text-indigo-900">{result.summary?.total}</p></div>
                  <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl"><p className="text-xs text-orange-600 font-bold mb-1">Avg Competition</p><p className="text-xl font-black text-orange-900">{result.summary?.avgCompetition}</p></div>
                  <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl"><p className="text-xs text-emerald-600 font-bold mb-1">Top Rec</p><p className="text-lg font-black text-emerald-900 line-clamp-1">{result.summary?.topRecommendation}</p></div>
                </div>
                {result.categories?.map((cat: any, i: number) => (
                  <div key={i} className="space-y-3">
                    <h3 className="font-bold text-slate-800">{cat.name}</h3>
                    <div className="space-y-2">
                      {cat.keywords?.map((k: any, j: number) => (
                        <div key={j} className="flex justify-between items-center p-3 border border-slate-100 rounded-xl bg-white hover:border-indigo-200 transition-colors">
                          <div><p className="font-bold text-sm text-slate-800">{k.term}</p><p className="text-xs text-slate-400">{k.volume} • Score: {k.score}</p></div>
                          <button onClick={() => copyToClipboard(k.term, k.term)} className="p-1.5 text-slate-400 hover:text-indigo-600">
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
