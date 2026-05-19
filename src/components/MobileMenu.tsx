'use client';

import { useRouter } from 'next/navigation';
import { Search, X, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from '../lib/navigation';
import { cn } from '../lib/utils';
import LanguageSwitcher from './LanguageSwitcher';
import { detectLocaleFromPathname, localizedPath } from '../lib/i18n-routing';
import type { NavigationMenuData } from '../lib/navigation-menu';
import { ToolNavIcon } from './MegaMenuContent';

interface MobileMenuProps {
  onClose: () => void;
  pathname: string;
  searchParams: string;
  navigationMenu: NavigationMenuData | null;
}

export default function MobileMenu({ onClose, pathname, searchParams, navigationMenu }: MobileMenuProps) {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-[100] md:hidden">
      <div className="fixed inset-0 bg-slate-950/35 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 flex w-[300px] flex-col overflow-y-auto bg-[#f7f8fb] shadow-xl transition-colors duration-300 dark:bg-slate-950">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-[#f7f8fb] p-5 dark:border-slate-800 dark:bg-slate-950">
          <span className="text-[16px] font-semibold text-slate-950 dark:text-white">{t('common.mobileMenu')}</span>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <button
              type="button"
              aria-label="Close navigation"
              onClick={onClose}
              className="rounded-md p-2 text-slate-500 hover:bg-slate-200/70 dark:hover:bg-slate-800"
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
              const query = String(formData.get('search') || '').trim();
              const params = new URLSearchParams();
              if (query) params.set('search', query);
              const homePath = localizedPath('/', detectLocaleFromPathname(pathname));
              const nextUrl = params.size ? `${homePath}?${params.toString()}` : homePath;
              const nextSearch = params.size ? `?${params.toString()}` : '';
              onClose();
              router.push(nextUrl);
              window.dispatchEvent(new CustomEvent('toolorbit:searchchange', { detail: nextSearch }));
            }}
            className="relative md:hidden"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              className="w-full rounded-md border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-[14px] text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-[2px] focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:focus:bg-slate-900"
              placeholder={t('common.searchPlaceholder')}
              type="search"
              name="search"
              defaultValue={new URLSearchParams(searchParams).get('search') || ''}
            />
          </form>

          {(navigationMenu?.categories || []).map(({ category, tools }) => {
            return (
              <div key={category} className="flex flex-col gap-3">
                <h4 className="border-b border-slate-200 pb-2 text-[14px] font-semibold text-slate-950 dark:border-slate-800 dark:text-white">{t(`common.categories.${category}`)}</h4>
                <div className="flex flex-col gap-2">
                  {tools.map(tool => (
                    <Link
                      key={tool.id}
                      to={tool.path}
                      onClick={onClose}
                      className="flex items-center gap-3 rounded-md px-2 py-2 text-slate-600 transition-colors hover:bg-white hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-blue-400"
                    >
                      <ToolNavIcon id={tool.id} size={16} />
                      <span className="text-[14px] font-medium">{t(`tools.${tool.id}.name`, { defaultValue: tool.name })}</span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Special AI Category for Mobile */}
          <div className="flex flex-col gap-3">
            <h4 className="flex items-center gap-1.5 border-b border-violet-100 pb-2 text-[14px] font-semibold text-violet-600 dark:border-violet-900/50 dark:text-violet-400">
              <Sparkles size={16} />
              {t('common.categories.AI 工具') || 'AI Tools'}
            </h4>
            <div className="flex flex-col gap-2">
              {(navigationMenu?.aiTools || []).map(tool => (
                <Link
                  key={tool.id}
                  to={tool.path}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-md px-2 py-2 text-slate-600 transition-colors hover:bg-violet-50 hover:text-violet-600 dark:text-slate-400 dark:hover:bg-violet-900/20 dark:hover:text-violet-400"
                >
                  <ToolNavIcon id={tool.id} size={16} />
                  <span className="text-[14px] font-medium">{t(`tools.${tool.id}.name`, { defaultValue: tool.name })}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
            <Link
              to="/blog"
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-md px-4 py-3 font-semibold transition-colors",
                pathname.startsWith('/blog') ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" : "text-slate-600 hover:bg-white dark:text-slate-400 dark:hover:bg-slate-900"
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
