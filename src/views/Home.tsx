'use client';

import { useEffect, useMemo, useState } from 'react';
import { Link, useClientSearchParamsWithInitialSearch } from '../lib/navigation';
import { useTranslation } from 'react-i18next';
import { TOOLS, Category, ToolItem } from '../data/tools';
import { Star, Clock, ChevronRight, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRecentTools } from '../hooks/useRecentTools';
import { motion, AnimatePresence } from 'motion/react';

const getCategoryStyles = (category: Category) => {
  switch(category) {
    case '开发者工具': return { border: 'border-green-500', title: 'text-green-600', icon: 'text-green-500', bg: 'bg-green-50' };
    case '站长工具': return { border: 'border-blue-500', title: 'text-blue-600', icon: 'text-blue-500', bg: 'bg-blue-50' };
    case '文本排版': return { border: 'border-indigo-500', title: 'text-indigo-600', icon: 'text-indigo-500', bg: 'bg-indigo-50' };
    case '生成器': return { border: 'border-orange-500', title: 'text-orange-600', icon: 'text-orange-500', bg: 'bg-orange-50' };
    case '电商工具': return { border: 'border-emerald-500', title: 'text-emerald-600', icon: 'text-emerald-500', bg: 'bg-emerald-50' };
    case 'PDF工具': return { border: 'border-rose-500', title: 'text-rose-600', icon: 'text-rose-500', bg: 'bg-rose-50' };
    case '图片处理': return { border: 'border-fuchsia-500', title: 'text-fuchsia-600', icon: 'text-fuchsia-500', bg: 'bg-fuchsia-50' };
    case '计算转换': return { border: 'border-amber-500', title: 'text-amber-600', icon: 'text-amber-500', bg: 'bg-amber-50' };
    case '娱乐工具': return { border: 'border-pink-500', title: 'text-pink-600', icon: 'text-pink-500', bg: 'bg-pink-50' };
    default: return { border: 'border-slate-500', title: 'text-slate-600', icon: 'text-slate-500', bg: 'bg-slate-50' };
  }
};

const PopularToolCard = ({ tool, isPinned, togglePin, index }: { tool: ToolItem, isPinned: boolean, togglePin: (e: React.MouseEvent, id: string) => void, index?: number }) => {
  const { t } = useTranslation();
  const Icon = tool.icon;
  const color = tool.color || 'blue';
  
  const bgColors: Record<string, string> = {
    emerald: 'from-emerald-500/10 to-teal-500/5 border-emerald-500/20 text-emerald-700 dark:text-emerald-300',
    blue: 'from-blue-500/10 to-indigo-500/5 border-blue-500/20 text-blue-700 dark:text-blue-300',
    violet: 'from-violet-500/10 to-purple-500/5 border-violet-500/20 text-violet-700 dark:text-violet-300',
    amber: 'from-amber-500/10 to-orange-500/5 border-amber-500/20 text-amber-700 dark:text-amber-300',
    rose: 'from-rose-500/10 to-pink-500/5 border-rose-500/20 text-rose-700 dark:text-rose-300',
    green: 'from-green-500/10 to-emerald-500/5 border-green-500/20 text-green-700 dark:text-green-300',
    orange: 'from-orange-500/10 to-amber-500/5 border-orange-500/20 text-orange-700 dark:text-orange-300',
    pink: 'from-pink-500/10 to-rose-500/5 border-pink-500/20 text-pink-700 dark:text-pink-300',
    fuchsia: 'from-fuchsia-500/10 to-purple-500/5 border-fuchsia-500/20 text-fuchsia-700 dark:text-fuchsia-300',
    indigo: 'from-indigo-500/10 to-blue-500/5 border-indigo-500/20 text-indigo-700 dark:text-indigo-300',
  };

  const accents: Record<string, string> = {
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    violet: 'bg-violet-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    pink: 'bg-pink-500',
    fuchsia: 'bg-fuchsia-500',
    indigo: 'bg-indigo-500',
  };

  const currentBg = bgColors[color] || bgColors.blue;
  const currentAccent = accents[color] || accents.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: (index || 0) * 0.1 }}
      whileHover={{ y: -8 }}
      className="relative group h-48 sm:h-56"
    >
      <Link
        to={tool.path}
        className={`block h-full w-full rounded-[32px] p-6 bg-gradient-to-br ${currentBg} border backdrop-blur-sm shadow-xl shadow-slate-200/40 dark:shadow-none overflow-hidden relative transition-all duration-500 group-hover:border-opacity-50`}
      >
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className={`p-3.5 ${currentAccent} text-white rounded-2xl shadow-lg shadow-${color}-500/20`}>
              <Icon size={24} strokeWidth={2.5} />
            </div>
            <button 
              onClick={(e) => togglePin(e, tool.id)}
              className={`p-2 rounded-xl transition-all ${isPinned ? 'text-amber-500 bg-amber-500/10' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Star size={20} fill={isPinned ? "currentColor" : "none"} />
            </button>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-2">
               <span className={`w-1 h-1 rounded-full ${currentAccent}`} />
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                 {t(`common.categories.${tool.category}`)}
               </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-800 dark:text-white mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-900 group-hover:to-slate-600 dark:group-hover:from-white dark:group-hover:to-slate-400 transition-all">
              {t(`tools.${tool.id}.name`, { defaultValue: tool.name })}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium line-clamp-1">
              {t(`tools.${tool.id}.description`, { defaultValue: tool.description })}
            </p>
          </div>
        </div>

        {/* Decorative Art Background */}
        <div className={`absolute right-0 bottom-0 opacity-[0.03] dark:opacity-[0.07] group-hover:opacity-[0.06] transition-opacity duration-500 pointer-events-none`}>
           <Icon size={200} strokeWidth={1} className="translate-x-1/4 translate-y-1/4 rotate-12" />
        </div>
        <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
           <ChevronRight className="text-slate-300" />
        </div>
      </Link>
    </motion.div>
  );
};

const ToolCard = ({ tool, isPinned, togglePin, index }: { tool: ToolItem, isPinned: boolean, togglePin: (e: React.MouseEvent, id: string) => void, index?: number }) => {
  const { t } = useTranslation();
  const Icon = tool.icon;
  const color = tool.color || 'blue';
  
  const styleMap: Record<string, any> = {
    emerald: { border: 'border-emerald-500', title: 'text-emerald-600 dark:text-emerald-400', icon: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/30' },
    blue: { border: 'border-blue-500', title: 'text-blue-600 dark:text-blue-400', icon: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/30' },
    violet: { border: 'border-violet-500', title: 'text-violet-600 dark:text-violet-400', icon: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-900/30' },
    amber: { border: 'border-amber-500', title: 'text-amber-600 dark:text-amber-400', icon: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/30' },
    rose: { border: 'border-rose-500', title: 'text-rose-600 dark:text-rose-400', icon: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/30' },
    green: { border: 'border-green-500', title: 'text-green-600 dark:text-green-400', icon: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/30' },
    orange: { border: 'border-orange-500', title: 'text-orange-600 dark:text-orange-400', icon: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/30' },
    pink: { border: 'border-pink-500', title: 'text-pink-600 dark:text-pink-400', icon: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-900/30' },
    fuchsia: { border: 'border-fuchsia-500', title: 'text-fuchsia-600 dark:text-fuchsia-400', icon: 'text-fuchsia-500', bg: 'bg-fuchsia-50 dark:bg-fuchsia-900/30' },
    indigo: { border: 'border-indigo-500', title: 'text-indigo-600 dark:text-indigo-400', icon: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/30' }
  };
  const styles = styleMap[color] || styleMap.blue;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: (index || 0) * 0.05 }}
      whileHover={{ y: -4 }}
      className="group h-full"
    >
      <Link
        to={tool.path}
        className={`block h-full border rounded-2xl p-5 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none relative overflow-hidden bg-white dark:bg-slate-900 ${styles.border.replace('border-', 'border-').split(' ')[0]}/10 hover:${styles.border}`}
      >
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-2.5 rounded-xl ${styles.bg} ${styles.icon} shadow-sm transition-transform duration-300 group-hover:scale-110`}>
              <Icon size={20} strokeWidth={2.5} />
            </div>
            <button 
              onClick={(e) => togglePin(e, tool.id)}
              className={`p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 ${isPinned ? 'text-amber-500' : 'text-slate-300 dark:text-slate-600'}`}
            >
              <Star size={16} fill={isPinned ? "currentColor" : "none"} strokeWidth={2} />
            </button>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors tracking-tight">
              {t(`tools.${tool.id}.name`, { defaultValue: tool.name })}
            </h3>
            <p className="text-[12px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-medium">
              {t(`tools.${tool.id}.description`, { defaultValue: tool.description })}
            </p>
          </div>
        </div>

        {/* Decorative Light Background Icon */}
        <div className={`absolute -right-4 -bottom-4 opacity-[0.03] dark:opacity-[0.06] group-hover:opacity-[0.08] transition-all duration-500 pointer-events-none group-hover:scale-110 group-hover:-rotate-6 ${styles.icon}`}>
           <Icon size={100} strokeWidth={1} />
        </div>
      </Link>
    </motion.div>
  );
};

type HomeProps = {
  initialSearch?: string;
};

export default function Home({ initialSearch = '' }: HomeProps) {
  const { t } = useTranslation();
  const [searchParams] = useClientSearchParamsWithInitialSearch(initialSearch);
  const { recentTools } = useRecentTools();
  const categoryFilter = searchParams.get('category') as Category | null;
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';

  const [pinnedTools, setPinnedTools] = useState<string[]>([]);

  useEffect(() => {
    try {
      setPinnedTools(JSON.parse(localStorage.getItem('toolorbit_pinned_tools') || '[]'));
    } catch {
      setPinnedTools([]);
    }
  }, []);

  const togglePin = (e: React.MouseEvent, toolId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const isPinned = pinnedTools.includes(toolId);
    const next = isPinned ? pinnedTools.filter(id => id !== toolId) : [...pinnedTools, toolId];
    
    setPinnedTools(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('toolorbit_pinned_tools', JSON.stringify(next));
    }
    
    if (isPinned) {
      toast.success(t('common.unpinned') || 'Tool unpinned', { id: `unpin-${toolId}` });
    } else {
      toast.success(t('common.pinned') || 'Tool pinned to top', { id: `pin-${toolId}` });
    }
  };

  const filteredTools = useMemo(() => {
    let result = TOOLS;
    if (categoryFilter) {
      result = result.filter(t => t.category === categoryFilter);
    }
    if (searchQuery) {
      result = result.filter(tool => {
        const name = t(`tools.${tool.id}.name`, { defaultValue: tool.name }).toLowerCase();
        const description = t(`tools.${tool.id}.description`, { defaultValue: tool.description }).toLowerCase();
        return name.includes(searchQuery) || description.includes(searchQuery);
      });
    }
    return result;
  }, [categoryFilter, searchQuery, t]);

  // If there's a search or filter
  if (categoryFilter || searchQuery) {
     return (
        <div className="flex flex-col">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight transition-colors">
              {categoryFilter ? t(`common.categories.${categoryFilter}`) : t('search.results', { query: searchQuery })}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTools.map((tool, index) => (
              <ToolCard 
                key={tool.id} 
                tool={tool} 
                isPinned={pinnedTools.includes(tool.id)} 
                togglePin={togglePin}
                index={index}
              />
            ))}
          </div>

          {filteredTools.length === 0 && (
            <div className="text-center py-24 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
              <div className="inline-flex p-4 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                 <Clock size={32} className="text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{t('search.noResults')}</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                {t('search.noResultsSub')}
              </p>
            </div>
          )}
        </div>
     );
  }

  // Otherwise, group by categories (Default View)
  const groupedTools = TOOLS.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<Category, typeof TOOLS>);

  const categoriesOrder = Array.from(new Set(TOOLS.map(t => t.category)));
  const pinnedToolObjects = pinnedTools.map(id => TOOLS.find(t => t.id === id)).filter(Boolean) as typeof TOOLS;
  const popularTools = TOOLS.filter(t => t.isPopular);

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Dynamic Hero Section */}
      {!categoryFilter && !searchQuery && (
        <section className="relative pt-8 pb-12 overflow-hidden rounded-[40px] bg-slate-900 border border-slate-800 shadow-2xl">
          <div className="absolute inset-0 opacity-20">
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600 blur-[120px] rounded-full mix-blend-screen -translate-y-1/2 translate-x-1/2" />
             <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600 blur-[100px] rounded-full mix-blend-screen translate-y-1/3 -translate-x-1/4" />
          </div>
          
          <div className="relative z-10 px-8 sm:px-12 flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, type: 'spring' }}
              className="flex items-center gap-3 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-black uppercase tracking-widest mb-6"
            >
              <Sparkles size={14} className="fill-blue-400" />
              {t('common.hero_badge') || 'Pro Efficiency Suite'}
            </motion.div>
            
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-6 leading-[1.1] max-w-4xl">
               {t('common.hero_title') || 'Simple Tools for Big Ideas'}
            </h1>
            
            <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mb-12 font-medium">
               {t('common.hero_subtitle') || 'A collection of developer-first tools powered by AI to supercharge your workflow.'}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-2xl">
               {[
                 { label: 'PDF 转图片', path: '/tools/pdf/pdf-to-image', icon: '📄' },
                 { label: '图片压缩', path: '/tools/image/image-compressor', icon: '🖼️' },
                 { label: 'AI 文案', path: '/tools/ai/listing-generator', icon: '✨' },
                 { label: 'JSON 格式化', path: '/tools/dev/json-formatter', icon: '⚡' }
               ].map((fav) => (
                 <Link 
                   key={fav.path} 
                   to={fav.path}
                   className="flex items-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all group"
                 >
                   <span className="text-lg">{fav.icon}</span>
                   <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">{fav.label}</span>
                 </Link>
               ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular Tools Visual Banner */}
      {!categoryFilter && !searchQuery && (
        <section className="space-y-8">
          <div className="flex items-center gap-3">
             <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
             <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
               {t('common.popular_tools') || '热门推荐'}
               <Sparkles className="text-amber-500 fill-amber-500" size={16} />
             </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularTools.map((tool, idx) => (
              <PopularToolCard 
                key={`pop-${tool.id}`}
                tool={tool}
                isPinned={pinnedTools.includes(tool.id)}
                togglePin={togglePin}
                index={idx}
              />
            ))}
          </div>
        </section>
      )}

      {/* Why ToolOrbit Section */}
      <section className="bg-white dark:bg-slate-900 rounded-[32px] p-8 sm:p-12 border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden relative group">
        <div className="absolute top-0 right-0 p-12 opacity-5 translate-x-1/4 -translate-y-1/4 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
          <Sparkles size={300} className="text-slate-900 dark:text-white" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-12 text-center tracking-tight">
            {t('common.why_title')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-xl border border-indigo-100 dark:border-indigo-800">
                  {i}
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 italic tracking-tight">
                    {t(`common.why_item${i}_title`)}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    {t(`common.why_item${i}_desc`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Pinned & Recent Split Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <AnimatePresence mode="popLayout">
          {pinnedToolObjects.length > 0 && (
            <motion.section 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-amber-500 rounded-full" />
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
                  {t('common.pinned_tools') || '收藏工具'}
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pinnedToolObjects.map((tool, idx) => (
                  <ToolCard 
                    key={`pinned-${tool.id}`} 
                    tool={tool} 
                    isPinned={true} 
                    togglePin={togglePin}
                    index={idx}
                  />
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {recentTools.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
                {t('common.recent_tools') || '最近使用'}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recentTools.slice(0, 4).map((tool, idx) => (
                <ToolCard 
                  key={`recent-${tool.id}`} 
                  tool={tool} 
                  isPinned={pinnedTools.includes(tool.id)} 
                  togglePin={togglePin}
                  index={idx}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="space-y-16">
        {categoriesOrder.map((category) => {
          const toolsInCategory = groupedTools[category];
          if (!toolsInCategory || toolsInCategory.length === 0) return null;
          
          const styles = getCategoryStyles(category);

          return (
            <section key={category} className="space-y-8">
              <div className="flex items-center gap-4">
                <div className={`px-4 py-1.5 rounded-full ${styles.bg} ${styles.title} text-xs font-bold uppercase tracking-wider border ${styles.border.replace('border-', 'border-').split(' ')[0]}/20`}>
                  {t(`common.categories.${category}`)}
                </div>
                <div className="flex-1 h-[1px] bg-slate-100 dark:bg-slate-800" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {toolsInCategory.map((tool, idx) => (
                  <ToolCard 
                    key={tool.id} 
                    tool={tool} 
                    isPinned={pinnedTools.includes(tool.id)} 
                    togglePin={togglePin}
                    index={idx}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

