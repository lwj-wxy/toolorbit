'use client';

import { useTranslation } from 'react-i18next';
import { Link } from '../lib/navigation';
import { TOOLS } from '../data/tools';
import { getCategoryPath } from '../lib/category-paths';

const navCategories = Array.from(new Set(TOOLS.map(t => t.category))).filter(
  c => c !== '娱乐工具' && c !== 'AI 工具'
);

export function ToolsMegaDropdown() {
  const { t } = useTranslation();

  return (
    <div className="absolute top-[64px] left-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top -translate-y-1 group-hover:translate-y-0 z-50">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <div className="grid grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-6">
          {navCategories.map(category => {
            const categoryTools = TOOLS.filter(t => t.category === category);
            return (
              <div key={category} className="flex flex-col gap-3">
                <h3 className="text-[13px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 px-2">
                  {t(`common.categories.${category}`)}
                </h3>
                <div className="flex flex-col gap-1">
                  {categoryTools.slice(0, 6).map(tool => (
                    <Link
                      key={tool.id}
                      to={tool.path}
                      className="group/item flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                    >
                      <div className="w-6 h-6 rounded flex items-center justify-center text-slate-400 group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors">
                        <tool.icon size={16} />
                      </div>
                      <span className="text-[13px] font-bold text-slate-700 dark:text-slate-300 group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 truncate">
                        {t(`tools.${tool.id}.name`, { defaultValue: tool.name })}
                      </span>
                    </Link>
                  ))}
                  {categoryTools.length > 6 && (
                    <Link
                      to={getCategoryPath(category)}
                      className="text-[12px] font-bold text-blue-500 hover:text-blue-700 px-2 mt-1"
                    >
                      {t('common.viewMore')}
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const bgClassMap: Record<string, string> = {
  emerald: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 hover:border-emerald-100 dark:hover:border-emerald-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 group-hover/item:text-emerald-700 dark:group-hover/item:text-emerald-400',
  blue: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 hover:border-blue-100 dark:hover:border-blue-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 group-hover/item:text-blue-700 dark:group-hover/item:text-blue-400',
  violet: 'bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 hover:border-violet-100 dark:hover:border-violet-800/50 hover:bg-violet-50 dark:hover:bg-violet-900/20 group-hover/item:text-violet-700 dark:group-hover/item:text-violet-400',
  amber: 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 hover:border-amber-100 dark:hover:border-amber-800/50 hover:bg-amber-50 dark:hover:bg-amber-900/20 group-hover/item:text-amber-700 dark:group-hover/item:text-amber-400',
  rose: 'bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 hover:border-rose-100 dark:hover:border-rose-800/50 hover:bg-rose-50 dark:hover:bg-rose-900/20 group-hover/item:text-rose-700 dark:group-hover/item:text-rose-400',
  green: 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 hover:border-green-100 dark:hover:border-green-800/50 hover:bg-green-50 dark:hover:bg-green-900/20 group-hover/item:text-green-700 dark:group-hover/item:text-green-400',
  orange: 'bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 hover:border-orange-100 dark:hover:border-orange-800/50 hover:bg-orange-50 dark:hover:bg-orange-900/20 group-hover/item:text-orange-700 dark:group-hover/item:text-orange-400',
  pink: 'bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-400 hover:border-pink-100 dark:hover:border-pink-800/50 hover:bg-pink-50 dark:hover:bg-pink-900/20 group-hover/item:text-pink-700 dark:group-hover/item:text-pink-400',
  fuchsia: 'bg-fuchsia-100 dark:bg-fuchsia-900/40 text-fuchsia-600 dark:text-fuchsia-400 hover:border-fuchsia-100 dark:hover:border-fuchsia-800/50 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-900/20 group-hover/item:text-fuchsia-700 dark:group-hover/item:text-fuchsia-400',
  indigo: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 hover:border-indigo-100 dark:hover:border-indigo-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 group-hover/item:text-indigo-700 dark:group-hover/item:text-indigo-400',
};

export function AiMegaDropdown() {
  const { t } = useTranslation();
  const aiCategoryPath = getCategoryPath('AI 工具');
  const aiTools = TOOLS.filter(t => t.category === 'AI 工具');

  return (
    <div className="absolute top-[64px] left-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top -translate-y-1 group-hover:translate-y-0 z-50">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h3 className="text-[13px] font-extrabold text-violet-500 dark:text-violet-400 uppercase tracking-wider">
            {t('common.categories.AI 工具') || 'AI Tools'}
          </h3>
          <Link
            to={aiCategoryPath}
            className="text-[12px] font-bold text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
          >
            {t('common.viewMore')} &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-x-6 gap-y-1">
          {aiTools.map(tool => {
            const color = tool.color || 'violet';
            const classes = bgClassMap[color] || bgClassMap.violet;
            const titleHover = classes.split(' ').find(c => c.startsWith('group-hover/item:text-')) || '';
            const titleDarkHover = classes.split(' ').find(c => c.startsWith('dark:group-hover/item:text-')) || '';
            const iconBg = classes.split(' ').find(c => c.startsWith('bg-')) || '';
            const iconDarkBg = classes.split(' ').find(c => c.startsWith('dark:bg-')) || '';
            const iconText = classes.split(' ').find(c => c.startsWith('text-')) || '';
            const iconDarkText = classes.split(' ').find(c => c.startsWith('dark:text-')) || '';

            return (
              <Link
                key={tool.id}
                to={tool.path}
                className="group/item flex items-center gap-2 rounded-lg p-2 transition-all hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <div className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 ${iconBg} ${iconDarkBg} ${iconText} ${iconDarkText} transition-colors`}>
                  <tool.icon size={15} />
                </div>
                <span className={`min-w-0 truncate text-[13px] font-bold text-slate-700 dark:text-slate-300 ${titleHover} ${titleDarkHover} transition-colors`}>
                  {t(`tools.${tool.id}.name`, { defaultValue: tool.name })}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
