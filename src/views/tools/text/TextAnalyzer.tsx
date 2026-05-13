import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { 
  Clock, 
  Search, 
  BarChart3, 
  Zap, 
  Type,
  TrendingUp,
  Sparkles,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Common stop words for filtering
const STOP_WORDS = new Set([
  'the', 'is', 'at', 'which', 'and', 'on', 'a', 'an', 'of', 'for', 'in', 'to', 'with', 'that', 'it', 'from',
  '的', '了', '和', '是', '就', '都', '而', '及', '与', '着', '或', '一个', '没有', '我们', '你们', '他们'
]);

export default function TextAnalyzer() {
  const { t, i18n } = useTranslation();
  const [text, setText] = useState('');
  const [activeTab, setActiveTab] = useState<'stats' | 'trends'>('stats');
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAIAnalysis = async () => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    setAiAnalysis('');

    try {
      const response = await fetch('/api/listing-craft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          productInfo: "Text Analysis Request", 
          details: text,
          keywords: "sentiment, tone, structure, insights",
          tone: "analytical",
          targetAudience: "Author",
          language: i18n.language,
          isDeepAnalysis: true // Flag for server to change prompt
        })
      });

      if (!response.ok) throw new Error('Analysis failed');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) return;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.substring(6));
            if (data.content) setAiAnalysis(prev => prev + data.content);
            if (data === '[DONE]') break;
          }
        }
      }
    } catch {
      setAiAnalysis('AI Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const stats = useMemo(() => {
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentences = text.trim() ? text.split(/[.!?。！？]+/).filter(Boolean).length : 0;
    const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(Boolean).length : 0;
    // Estimate reading time (avg 200 words per minute for EN, 400 chars for mainland CN)
    const readingTimeSec = Math.ceil((words / 200) * 60) || Math.ceil((chars / 400) * 60);

    return {
      standard: [
        { name: t('tools.text-analyzer.wordCount'), value: words, icon: <Search size={16} /> },
        { name: t('tools.text-analyzer.charCount'), value: chars, icon: <Type size={16} /> },
        { name: t('tools.text-analyzer.charCountNoSpace'), value: charsNoSpaces, icon: <Zap size={16} /> },
        { name: t('tools.text-analyzer.sentenceCount'), value: sentences, icon: <TrendingUp size={16} /> },
        { name: t('tools.text-analyzer.paragraphCount'), value: paragraphs, icon: <BarChart3 size={16} /> },
      ],
      readingTime: readingTimeSec
    };
  }, [text, t]);

  const analysis = useMemo(() => {
    if (!text.trim()) return { letters: [], topWords: [] };
    
    // Letter frequency
    const letterCounts: Record<string, number> = {};
    const lowerText = text.toLowerCase().replace(/[^a-z]/g, '');
    for (const char of lowerText) {
      letterCounts[char] = (letterCounts[char] || 0) + 1;
    }
    const letters = Object.entries(letterCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, value]) => ({ name: name.toUpperCase(), value }));

    // Word frequency (Enhanced for both CN and EN)
    const wordCounts: Record<string, number> = {};
    const words = text.toLowerCase().split(/[\s,.;:!?()\[\]"']+/).filter(w => w.length > 1 && !STOP_WORDS.has(w));
    
    for (const word of words) {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    }
    
    const topWords = Object.entries(wordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, value]) => ({ name, value }));

    return { letters, topWords };
  }, [text]);

  const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#ef4444', '#f97316', '#f59e0b', '#eab308'];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {t('tools.text-analyzer.title')}
          </h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            {t('tools.text-analyzer.subtitle')}
          </p>
        </motion.div>
        
        {text.trim() && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2 rounded-2xl border border-indigo-100 dark:border-indigo-800/30"
          >
            <Clock size={16} className="text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300">
              {t('tools.text-analyzer.readingTime')}: {stats.readingTime > 60 ? t('tools.text-analyzer.minutes', { count: Math.ceil(stats.readingTime/60) }) : t('tools.text-analyzer.seconds', { count: stats.readingTime })}
            </span>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Editor Area */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="relative group flex-1">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="block w-full h-full min-h-[500px] lg:min-h-0 rounded-3xl border-0 p-8 text-slate-800 dark:text-slate-100 shadow-2xl shadow-indigo-100/50 dark:shadow-none bg-white dark:bg-slate-900 ring-1 ring-inset ring-slate-100 dark:ring-slate-800 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg leading-relaxed resize-none transition-all duration-300"
              placeholder={t('tools.text-analyzer.placeholder')}
            />
            {text.length > 0 && (
              <button 
                onClick={() => setText('')}
                className="absolute top-6 right-6 p-2 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-500 transition-colors"
              >
                <Zap size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Sidebar Analysis */}
        <div className="lg:col-span-5 space-y-6">
          {/* Stats Summary Grid */}
          <div className="grid grid-cols-2 gap-4">
            {stats.standard.map((item, idx) => (
              <motion.div 
                key={item.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm"
              >
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  {item.icon}
                  <span className="text-[10px] font-bold uppercase tracking-wider">{item.name}</span>
                </div>
                <div className="text-2xl font-black text-slate-800 dark:text-white tabular-nums tracking-tight">
                  {item.value.toLocaleString()}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-[400px]">
            <div className="p-4 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
               <div className="flex bg-slate-50 dark:bg-slate-800 p-1 rounded-xl">
                 <button 
                  onClick={() => setActiveTab('stats')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'stats' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600' : 'text-slate-400'}`}
                 >
                   {t('tools.text-analyzer.letterFreq')}
                 </button>
                 <button 
                  onClick={() => setActiveTab('trends')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'trends' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600' : 'text-slate-400'}`}
                  >
                   {t('tools.text-analyzer.topWords')}
                 </button>
               </div>
            </div>

            <div className="flex-1 p-6">
              {text.trim() ? (
                <div className="h-full w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={activeTab === 'stats' ? analysis.letters : analysis.topWords}
                      layout="vertical"
                      margin={{ left: 10, right: 30, top: 0, bottom: 0 }}
                    >
                      <XAxis type="number" hide />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                        width={80}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                      />
                      <Bar 
                        dataKey="value" 
                        radius={[0, 4, 4, 0]}
                        barSize={20}
                      >
                        {(activeTab === 'stats' ? analysis.letters : analysis.topWords).map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} opacity={0.8} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-30 grayscale">
                  <BarChart3 size={48} className="mb-4" />
                  <p className="text-sm font-medium">{t('tools.text-analyzer.noLetterFound')}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* AI Insights */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 text-white overflow-hidden relative group">
             <div className="relative z-10">
               <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                 <Zap size={20} className="fill-white" />
                 {t('tools.text-analyzer.sentimentTitle')}
               </h3>
               {aiAnalysis ? (
                 <div className="bg-white/10 rounded-xl p-4 text-xs leading-relaxed max-h-[300px] overflow-y-auto mb-4 border border-white/5 backdrop-blur-sm">
                   <div className="prose prose-invert prose-sm">
                     {aiAnalysis}
                   </div>
                 </div>
               ) : (
                 <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
                   {t('tools.text-analyzer.sentimentTip')}
                 </p>
               )}
               
               <motion.button 
                 whileHover={{ scale: 1.02 }}
                 whileTap={{ scale: 0.98 }}
                 onClick={handleAIAnalysis}
                 disabled={!text.trim() || isAnalyzing}
                 className="w-full bg-white/20 hover:bg-white/30 transition-all py-3 rounded-xl text-sm font-black backdrop-blur-md border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 h-11 overflow-hidden"
               >
                 <AnimatePresence mode="wait">
                   {isAnalyzing ? (
                     <motion.div 
                       key="analyzing"
                       initial={{ opacity: 0, scale: 0.9 }}
                       animate={{ opacity: 1, scale: 1 }}
                       exit={{ opacity: 0, scale: 0.9 }}
                       className="flex items-center gap-2"
                     >
                       <Loader2 size={16} className="animate-spin" />
                       <span>{t('tools.listing-craft-ai.generating')}</span>
                     </motion.div>
                   ) : (
                     <motion.div 
                       key="ready"
                       initial={{ opacity: 0, scale: 0.9 }}
                       animate={{ opacity: 1, scale: 1 }}
                       exit={{ opacity: 0, scale: 0.9 }}
                       className="flex items-center gap-2"
                     >
                       <Sparkles size={16} className="fill-white" />
                       <span>{t('tools.text-analyzer.analyzeBtn')}</span>
                     </motion.div>
                   ) }
                 </AnimatePresence>
               </motion.button>
             </div>
             <Sparkles className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5 rotate-12 transition-transform duration-500 group-hover:scale-110" />
          </div>
        </div>
      </div>
    </div>
  );
}
