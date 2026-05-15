'use client';

import { Search, X, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from '../lib/navigation';
import { TOOLS } from '../data/tools';
import { cn } from '../lib/utils';
import LanguageSwitcher from './LanguageSwitcher';

const navCategories = Array.from(new Set(TOOLS.map(t => t.category))).filter(
  c => c !== '娱乐工具' && c !== 'AI 工具'
);

interface MobileMenuProps {
  onClose: () => void;
  pathname: string;
  searchParams: string;
}

export default function MobileMenu({ onClose, pathname, searchParams }: MobileMenuProps) {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-[100] md:hidden">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-[300px] bg-white dark:bg-slate-900 shadow-2xl overflow-y-auto flex flex-col transition-colors duration-300">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
          <span className="font-bold text-[18px] text-slate-900 dark:text-slate-100">{t('common.mobileMenu')}</span>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <button
              type="button"
              aria-label="Close navigation"
              onClick={onClose}
              className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="p-6 flex flex-col gap-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const query = formData.get('search');
              onClose();
              window.location.href = `/?search=${query}`;
            }}
            className="relative md:hidden"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              className="w-full py-2.5 pr-4 pl-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-[14px] outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-[2px] focus:ring-blue-500/10 placeholder:text-slate-400 text-slate-900 dark:text-slate-100"
              placeholder={t('common.searchPlaceholder')}
              type="search"
              name="search"
              defaultValue={new URLSearchParams(searchParams).get('search') || ''}
            />
          </form>

          {navCategories.map((category) => {
            const categoryTools = TOOLS.filter(t => t.category === category);
            return (
              <div key={category} className="flex flex-col gap-3">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-[15px] border-b border-slate-200 dark:border-slate-800 pb-2">{t(`common.categories.${category}`)}</h4>
                <div className="flex flex-col gap-2">
                  {categoryTools.map(tool => (
                    <Link
                      key={tool.id}
                      to={tool.path}
                      onClick={onClose}
                      className="flex items-center gap-3 py-2 px-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <tool.icon size={16} />
                      <span className="text-[14px] font-medium">{t(`tools.${tool.id}.name`, { defaultValue: tool.name })}</span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Special AI Category for Mobile */}
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-violet-600 dark:text-violet-400 text-[15px] border-b border-violet-100 dark:border-violet-900/50 pb-2 flex items-center gap-1.5">
              <Sparkles size={16} />
              {t('common.categories.AI 工具') || 'AI Tools'}
            </h4>
            <div className="flex flex-col gap-2">
              {TOOLS.filter(t => t.category === 'AI 工具').map(tool => (
                <Link
                  key={tool.id}
                  to={tool.path}
                  onClick={onClose}
                  className="flex items-center gap-3 py-2 px-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                >
                  <tool.icon size={16} />
                  <span className="text-[14px] font-medium">{t(`tools.${tool.id}.name`, { defaultValue: tool.name })}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Link
              to="/blog"
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 py-3 px-4 rounded-xl font-bold transition-all",
                pathname.startsWith('/blog') ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              )}
            >
              <span className="text-[16px]">{t('blog.nav')}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
