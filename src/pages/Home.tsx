import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TOOLS, Category, ToolItem } from '../data/tools';
import { Star, Clock, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRecentTools } from '../hooks/useRecentTools';
import SEO from '../components/SEO';
import { useMemo } from 'react';
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

const ToolCard = ({ tool, isPinned, togglePin, index }: { tool: ToolItem, isPinned: boolean, togglePin: (e: React.MouseEvent, id: string) => void, index?: number }) => {
  const { t } = useTranslation();
  const Icon = tool.icon;
  
  // Use tool.color or a default based on category if not available
  const color = tool.color || 'blue';
  const colorVariants: Record<string, string> = {
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/30',
    blue: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30',
    slate: 'bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-800/30',
    sky: 'bg-sky-50 text-sky-600 border-sky-100 dark:bg-sky-900/20 dark:text-sky-400 dark:border-sky-800/30',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800/30',
    purple: 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800/30',
    cyan: 'bg-cyan-50 text-cyan-600 border-cyan-100 dark:bg-cyan-900/20 dark:text-cyan-400 dark:border-cyan-800/30',
    orange: 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800/30',
    violet: 'bg-violet-50 text-violet-600 border-violet-100 dark:bg-violet-900/20 dark:text-violet-400 dark:border-violet-800/30',
    fuchsia: 'bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100 dark:bg-fuchsia-900/20 dark:text-fuchsia-400 dark:border-fuchsia-800/30',
    pink: 'bg-pink-50 text-pink-600 border-pink-100 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-800/30',
    teal: 'bg-teal-50 text-teal-600 border-teal-100 dark:bg-teal-900/20 dark:text-teal-400 dark:border-teal-800/30',
    neutral: 'bg-neutral-50 text-neutral-600 border-neutral-100 dark:bg-neutral-900/20 dark:text-neutral-400 dark:border-neutral-800/30',
    rose: 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800/30',
    amber: 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/30',
    green: 'bg-green-50 text-green-600 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30',
    gray: 'bg-gray-50 text-gray-600 border-gray-100 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800/30',
    red: 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30',
  };

  const currentVariant = colorVariants[color] || colorVariants.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: (index || 0) * 0.05 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Link
        to={tool.path}
        className="block bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 h-full transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-950/50 hover:border-slate-300 dark:hover:border-slate-700 relative overflow-hidden"
      >
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl border ${currentVariant.split(' ')[2]} ${currentVariant.split(' ')[0]} ${currentVariant.split(' ')[1]} transition-transform duration-300 group-hover:scale-110 shadow-sm`}>
            <Icon size={24} strokeWidth={2.5} />
          </div>
          <button 
            onClick={(e) => togglePin(e, tool.id)}
            className={`p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 ${isPinned ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'text-slate-300 dark:text-slate-600'}`}
          >
            <Star size={18} fill={isPinned ? "currentColor" : "none"} strokeWidth={2} />
          </button>
        </div>
        
        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight flex items-center gap-1.5">
            {t(`tools.${tool.id}.name`, { defaultValue: tool.name })}
            <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-blue-500" />
          </h3>
          <p className="text-[13px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {t(`tools.${tool.id}.description`, { defaultValue: tool.description })}
          </p>
        </div>

        {/* Decorative background element */}
        <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-[0.03] dark:opacity-[0.05] group-hover:opacity-[0.08] dark:group-hover:opacity-[0.1] transition-opacity duration-300 pointer-events-none ${currentVariant.split(' ')[0]}`} />
      </Link>
    </motion.div>
  );
};

export default function Home() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { recentTools } = useRecentTools();
  const categoryFilter = searchParams.get('category') as Category | null;
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';

  const siteDescription = t('common.description') || 'ToolOrbit - A collection of powerful online tools for developers and creators. Helper tools for JSON, Base64, Image, PDF and more.';

  const mainSchema = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ToolOrbit",
    "url": "https://toolorbit.site",
    "description": siteDescription,
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://toolorbit.site/?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }), [siteDescription]);

  const [filteredTools, setFilteredTools] = useState(TOOLS);
  const [pinnedTools, setPinnedTools] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('toolorbit_pinned_tools') || '[]');
    } catch {
      return [];
    }
  });

  const togglePin = (e: React.MouseEvent, toolId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const isPinned = pinnedTools.includes(toolId);
    const next = isPinned ? pinnedTools.filter(id => id !== toolId) : [...pinnedTools, toolId];
    
    setPinnedTools(next);
    localStorage.setItem('toolorbit_pinned_tools', JSON.stringify(next));
    
    if (isPinned) {
      toast.success(t('common.unpinned') || 'Tool unpinned', { id: `unpin-${toolId}` });
    } else {
      toast.success(t('common.pinned') || 'Tool pinned to top', { id: `pin-${toolId}` });
    }
  };

  useEffect(() => {
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
    setFilteredTools(result);
  }, [categoryFilter, searchQuery, t]);

  // If there's a search or filter
  if (categoryFilter || searchQuery) {
     return (
        <div className="flex flex-col">
          <SEO 
            title={categoryFilter ? t(`common.categories.${categoryFilter}`) : t('search.results', { query: searchQuery })}
            description={siteDescription}
          />
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

  return (
    <div className="flex flex-col gap-16 pb-16">
      <SEO 
        description={siteDescription}
        schema={mainSchema}
      />
      
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

