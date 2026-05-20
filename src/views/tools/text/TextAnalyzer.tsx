import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Clock, 
  Search, 
  BarChart3, 
  Zap, 
  Type,
  TrendingUp
} from 'lucide-react';
import { motion } from 'motion/react';
import ToolSEOCard from '../../../components/ToolSEOCard';
import type { TechnicalOverview } from '../../../types/tool-overview';

// Common stop words for filtering
const STOP_WORDS = new Set([
  'the', 'is', 'at', 'which', 'and', 'on', 'a', 'an', 'of', 'for', 'in', 'to', 'with', 'that', 'it', 'from',
  '的', '了', '和', '是', '就', '都', '而', '及', '与', '着', '或', '一个', '没有', '我们', '你们', '他们'
]);

const CJK_PATTERN = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u;
const TOKEN_PATTERN = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]|[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu;
const CHARACTER_PATTERN = /[\p{L}\p{N}]/gu;

const tokenizeText = (value: string) => value.match(TOKEN_PATTERN) ?? [];

const TEXT_ANALYZER_OVERVIEW: TechnicalOverview = {
  summary:
    '文本分析器用于实时统计文本字数、字符数、句子数、段落数，并提取字符频率和核心热词分布。适合写作校对、SEO 内容初检、文案长度控制、社媒发布前检查、论文摘要整理和运营文本评估。',
  input:
    '任意纯文本内容，可包含中文、英文、数字、标点、换行和段落。工具会实时读取输入框内容并更新统计结果。',
  output:
    '总字数/词数、总字符数、不含空格字符数、句子数、段落数、预计阅读时长，以及字符/词频排行图。中文按字符计数，英文和数字按词或 token 计数。',
  processing:
    '通过浏览器端正则和 Unicode 脚本匹配进行本地统计。中文、日文、韩文按单字符 token 处理，英文和数字按连续词元处理；字符频率和热词分布按出现次数排序，不上传输入内容。',
  modes: ['实时字数统计', '字符数统计', '句子 / 段落统计', '中文字符计数', '英文词频统计', '预计阅读时长', '频率排行图'],
  example: {
    title: '文本分析输入到输出示例',
    input: '测试测试测试 water water text',
    output: '总字数/词数: 9\n总字符数: 23\n高频项: 测 x 3, 试 x 3, water x 2',
    inputLanguage: 'text',
    outputLanguage: 'text',
  },
};

export default function TextAnalyzer() {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [activeTab, setActiveTab] = useState<'stats' | 'trends'>('stats');

  const stats = useMemo(() => {
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const words = tokenizeText(text).length;
    const sentences = text.trim() ? text.split(/[.!?。！？]+/).filter(Boolean).length : 0;
    const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(Boolean).length : 0;
    // Estimate reading time (avg 200 words per minute for EN, 400 chars for mainland CN)
    const hasCjkText = CJK_PATTERN.test(text);
    const readingTimeSec = text.trim()
      ? Math.max(1, Math.ceil(((hasCjkText ? charsNoSpaces / 400 : words / 200) * 60)))
      : 0;

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
    const characterCounts: Record<string, number> = {};
    const textCharacters = text.match(CHARACTER_PATTERN) ?? [];
    for (const char of textCharacters) {
      const normalizedChar = char.toLocaleLowerCase();
      characterCounts[normalizedChar] = (characterCounts[normalizedChar] || 0) + 1;
    }
    const letters = Object.entries(characterCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, value]) => ({ name: name.toLocaleUpperCase(), value }));

    // Word frequency (Enhanced for both CN and EN)
    const wordCounts: Record<string, number> = {};
    const words = tokenizeText(text.toLocaleLowerCase()).filter(word => !STOP_WORDS.has(word));
    
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
  const frequencyData = activeTab === 'stats' ? analysis.letters : analysis.topWords;
  const maxFrequency = Math.max(...frequencyData.map((item) => item.value), 0);
  const totalFrequency = frequencyData.reduce((total, item) => total + item.value, 0);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
            {t('tools.text-analyzer.title')}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            {t('tools.text-analyzer.subtitle')}
          </p>
        </motion.div>
        
        {text.trim() && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <Clock size={14} className="text-cyan-700 dark:text-cyan-300" />
            <span>
              {t('tools.text-analyzer.readingTime')}: {stats.readingTime > 60 ? t('tools.text-analyzer.minutes', { count: Math.ceil(stats.readingTime/60) }) : t('tools.text-analyzer.seconds', { count: stats.readingTime })}
            </span>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Editor Area */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
              {t('tools.text-analyzer.title')}
            </h3>
            <span className="font-mono text-sm text-slate-400">{text.length.toLocaleString()}</span>
          </div>
          <div className="relative h-[500px]">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="block h-full w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-cyan-500 dark:border-slate-700 dark:bg-[#282c34] dark:text-slate-100"
              placeholder={t('tools.text-analyzer.placeholder')}
            />
            {text.length > 0 && (
              <button 
                onClick={() => setText('')}
                className="absolute right-4 top-4 rounded-md border border-slate-300 bg-white p-2 text-slate-500 transition-colors hover:bg-slate-50 hover:text-red-500 dark:border-slate-700 dark:bg-slate-900"
              >
                <Zap size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Sidebar Analysis */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
              {t('tools.text-analyzer.wordCount')}
            </h3>
            <div className="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
              <button 
                onClick={() => setActiveTab('stats')}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${activeTab === 'stats' ? 'bg-white text-cyan-700 shadow-sm dark:bg-slate-950 dark:text-cyan-300' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
              >
                {t('tools.text-analyzer.letterFreq')}
              </button>
              <button 
                onClick={() => setActiveTab('trends')}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${activeTab === 'trends' ? 'bg-white text-cyan-700 shadow-sm dark:bg-slate-950 dark:text-cyan-300' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                >
                {t('tools.text-analyzer.topWords')}
              </button>
            </div>
          </div>

          <div className="flex h-[500px] flex-col overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          {/* Stats Summary Grid */}
          <div className="grid grid-cols-2 gap-3">
            {stats.standard.map((item, idx) => (
              <motion.div 
                key={item.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-[#282c34]"
              >
                <div className="mb-1.5 flex items-center gap-2 text-slate-400">
                  <span className="shrink-0">{item.icon}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider">{item.name}</span>
                </div>
                <div className="text-xl font-black tabular-nums tracking-tight text-slate-800 dark:text-white">
                  {item.value.toLocaleString()}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="mt-4 flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#282c34]">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {activeTab === 'stats' ? t('tools.text-analyzer.letterFreq') : t('tools.text-analyzer.topWords')}
              </span>
              <span className="font-mono text-xs text-slate-400">
                {frequencyData.length ? `${frequencyData.length} / ${totalFrequency}` : '0'}
              </span>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              {text.trim() && frequencyData.length ? (
                <div className="space-y-3">
                  {frequencyData.map((item, index) => {
                    const percent = maxFrequency > 0 ? Math.max((item.value / maxFrequency) * 100, 6) : 0;
                    const share = totalFrequency > 0 ? Math.round((item.value / totalFrequency) * 100) : 0;
                    const color = COLORS[index % COLORS.length];

                    return (
                      <div key={`${item.name}-${index}`} className="grid grid-cols-[32px_1fr_48px] items-center gap-2">
                        <div className="truncate text-right text-sm font-semibold text-slate-600 dark:text-slate-300" title={item.name}>
                          {item.name}
                        </div>
                        <div className="h-8 rounded-md bg-slate-100 p-1 dark:bg-slate-800">
                          <div
                            className="flex h-full items-center justify-end rounded px-2 text-[11px] font-bold text-white shadow-sm transition-all"
                            style={{ width: `${percent}%`, backgroundColor: color }}
                          >
                            {item.value}
                          </div>
                        </div>
                        <div className="text-right font-mono text-xs text-slate-400">{share}%</div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-center text-slate-400">
                  <BarChart3 size={48} className="mb-4" />
                  <p className="text-sm font-medium">{t('tools.text-analyzer.noLetterFound')}</p>
                </div>
              )}
            </div>
          </div>
          </div>
        </div>
      </div>

      <ToolSEOCard toolKey="text-analyzer" overview={TEXT_ANALYZER_OVERVIEW} />
    </div>
  );
}
