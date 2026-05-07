import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TOOLS, Category } from '../data/tools';
import { Star } from 'lucide-react';
import { toast } from 'react-hot-toast';

const getCategoryStyles = (category: Category) => {
  switch(category) {
    case '开发者工具': return { border: 'border-green-500', title: 'text-green-600', icon: 'text-green-500', bg: 'bg-green-50 hover:bg-green-100 hover:text-green-600' };
    case '站长工具': return { border: 'border-blue-500', title: 'text-blue-600', icon: 'text-blue-500', bg: 'bg-blue-50 hover:bg-blue-100 hover:text-blue-600' };
    case '文本排版': return { border: 'border-indigo-500', title: 'text-indigo-600', icon: 'text-indigo-500', bg: 'bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-600' };
    case '生成器': return { border: 'border-orange-500', title: 'text-orange-600', icon: 'text-orange-500', bg: 'bg-orange-50 hover:bg-orange-100 hover:text-orange-600' };
    case '电商工具': return { border: 'border-emerald-500', title: 'text-emerald-600', icon: 'text-emerald-500', bg: 'bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-600' };
    case 'PDF工具': return { border: 'border-rose-500', title: 'text-rose-600', icon: 'text-rose-500', bg: 'bg-rose-50 hover:bg-rose-100 hover:text-rose-600' };
    case '图片处理': return { border: 'border-fuchsia-500', title: 'text-fuchsia-600', icon: 'text-fuchsia-500', bg: 'bg-fuchsia-50 hover:bg-fuchsia-100 hover:text-fuchsia-600' };
    case '计算转换': return { border: 'border-amber-500', title: 'text-amber-600', icon: 'text-amber-500', bg: 'bg-amber-50 hover:bg-amber-100 hover:text-amber-600' };
    case '娱乐工具': return { border: 'border-pink-500', title: 'text-pink-600', icon: 'text-pink-500', bg: 'bg-pink-50 hover:bg-pink-100 hover:text-pink-600' };
    default: return { border: 'border-slate-500', title: 'text-slate-600', icon: 'text-slate-500', bg: 'bg-slate-50 hover:bg-slate-100 hover:text-slate-600' };
  }
};

export default function Home() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category') as Category | null;
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';

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
    setPinnedTools(prev => {
      const isPinned = prev.includes(toolId);
      const next = isPinned ? prev.filter(id => id !== toolId) : [...prev, toolId];
      localStorage.setItem('toolorbit_pinned_tools', JSON.stringify(next));
      
      if (isPinned) {
        toast.success(t('common.unpinned') || 'Tool unpinned');
      } else {
        toast.success(t('common.pinned') || 'Tool pinned to top');
      }
      return next;
    });
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

  // If there's a search or filter, show the flat grid view (like before but adapted)
  if (categoryFilter || searchQuery) {
     return (
        <div className="flex flex-col">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
              {categoryFilter ? t(`common.categories.${categoryFilter}`) : t('search.results', { query: searchQuery })}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredTools.map((tool) => {
              const isPinned = pinnedTools.includes(tool.id);
              return (
                <Link
                  key={tool.id}
                  to={tool.path}
                  className="bg-white border border-slate-200/80 rounded-xl p-4 transition-all duration-200 cursor-pointer flex items-center justify-between text-center hover:-translate-y-1 hover:shadow-md hover:border-slate-300 group"
                >
                  <span className="text-sm font-medium text-slate-600 group-hover:text-blue-600 transition-colors">
                    {t(`tools.${tool.id}.name`, { defaultValue: tool.name })}
                  </span>
                  <button 
                    onClick={(e) => togglePin(e, tool.id)}
                    className={`p-1.5 rounded-md hover:bg-slate-100 transition-colors ${isPinned ? 'text-amber-500' : 'text-slate-300 opacity-0 group-hover:opacity-100'}`}
                  >
                    <Star size={16} fill={isPinned ? "currentColor" : "none"} />
                  </button>
                </Link>
              );
            })}
          </div>

          {filteredTools.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-lg font-semibold text-slate-800">{t('search.noResults')}</h3>
              <p className="mt-2 text-sm text-slate-500">
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
    <div className="flex flex-col gap-12 pb-12">
      {/* Pinned Tools Section */}
      {pinnedToolObjects.length > 0 && (
         <section className="space-y-4">
            <div className="flex items-center gap-3">
               <div className="w-1 h-6 bg-amber-500 rounded-full" />
               <h2 className="text-[17px] font-bold text-amber-600 tracking-tight flex items-center gap-2">
                  <Star size={18} fill="currentColor" />
                  {t('common.pinned_tools') || 'Pinned Tools'}
               </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
               {pinnedToolObjects.map(tool => (
                  <Link
                    key={`pinned-${tool.id}`}
                    to={tool.path}
                    className="bg-white/60 border border-amber-200/50 rounded-xl py-3.5 px-4 flex items-center justify-between text-center transition-all duration-200 hover:shadow-sm hover:-translate-y-[2px] group hover:border-amber-300"
                  >
                     <span className="text-[14px] font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                        {t(`tools.${tool.id}.name`, { defaultValue: tool.name })}
                     </span>
                     <button 
                       onClick={(e) => togglePin(e, tool.id)}
                       className="p-1 text-amber-500 hover:text-slate-400 transition-colors"
                     >
                       <Star size={16} fill="currentColor" />
                     </button>
                  </Link>
               ))}
            </div>
         </section>
      )}

      {categoriesOrder.map((category) => {
         const toolsInCategory = groupedTools[category];
         if (!toolsInCategory || toolsInCategory.length === 0) return null;
         
         const styles = getCategoryStyles(category);

         return (
            <section key={category} className="space-y-4">
               {/* Category Header */}
               <div className="flex items-center gap-3">
                  <div className={`w-1 h-6 ${styles.bg.replace('bg-', 'bg-').split(' ')[0]} rounded-full ${styles.bg.replace('bg-', 'bg-').replace('50', '500').split(' ')[0]}`} />
                  <h2 className={`text-[17px] font-bold ${styles.title} tracking-tight`}>
                     {t(`common.categories.${category}`)}
                  </h2>
               </div>

               {/* Tools Grid */}
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {toolsInCategory.map(tool => {
                     const isPinned = pinnedTools.includes(tool.id);
                     return (
                        <Link
                          key={tool.id}
                          to={tool.path}
                          className="bg-white border border-slate-200/80 rounded-xl py-3.5 px-4 flex items-center justify-between text-center transition-all duration-200 hover:shadow-sm hover:-translate-y-[2px] group hover:border-slate-300"
                        >
                           <span className="text-[14px] font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                              {t(`tools.${tool.id}.name`, { defaultValue: tool.name })}
                           </span>
                           <button 
                             onClick={(e) => togglePin(e, tool.id)}
                             className={`p-1.5 rounded-md hover:bg-slate-100 transition-colors ${isPinned ? 'text-amber-500' : 'text-slate-300 opacity-0 group-hover:opacity-100'}`}
                           >
                             <Star size={16} fill={isPinned ? "currentColor" : "none"} />
                           </button>
                        </Link>
                     );
                  })}
               </div>
            </section>
         );
      })}
    </div>
  );
}
