'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu, Moon, Search, Sparkles, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { getCategoryPath } from '../lib/category-paths';
import { detectLocaleFromPathname, localizedPath } from '../lib/i18n-routing';
import { Link, useCurrentLocation } from '../lib/navigation';
import { cn } from '../lib/utils';
import LanguageSwitcher from './LanguageSwitcher';

const ToolsMegaDropdown = dynamic(
  () => import('./MegaMenuContent').then((mod) => ({ default: mod.ToolsMegaDropdown })),
  { ssr: false },
);
const AiMegaDropdown = dynamic(
  () => import('./MegaMenuContent').then((mod) => ({ default: mod.AiMegaDropdown })),
  { ssr: false },
);
const MobileMenu = dynamic(() => import('./MobileMenu'), { ssr: false });

export default function LayoutHeaderClient() {
  const router = useRouter();
  const { t } = useTranslation();
  const { setTheme, isDark } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isWideDesktop, setIsWideDesktop] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const location = useCurrentLocation();

  useEffect(() => {
    const updateViewport = () => setIsWideDesktop(window.innerWidth > 1280);
    updateViewport();
    window.addEventListener('resize', updateViewport);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('resize', updateViewport);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const aiCategoryPath = getCategoryPath('AI 工具');
  const isAiSection = location.pathname === aiCategoryPath || location.pathname.startsWith('/tools/ai/');
  const isToolSection =
    location.pathname === '/' ||
    (location.pathname.startsWith('/category/') && location.pathname !== aiCategoryPath) ||
    (location.pathname.startsWith('/tools/') && !location.pathname.startsWith('/tools/ai/'));

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = String(formData.get('search') || '').trim();
    const params = new URLSearchParams();
    if (query) params.set('search', query);

    const locale = detectLocaleFromPathname(location.pathname);
    const homePath = localizedPath('/', locale);
    const nextUrl = params.size ? `${homePath}?${params.toString()}` : homePath;
    const nextSearch = params.size ? `?${params.toString()}` : '';

    router.push(nextUrl);
    window.dispatchEvent(new CustomEvent('toolorbit:searchchange', { detail: nextSearch }));
  };

  return (
    <>
      <header className="sticky top-0 z-50 flex h-[64px] items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 shadow-sm backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-4 lg:gap-6 xl:gap-8">
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2 text-[18px] font-extrabold tracking-tight text-blue-600 dark:text-blue-400 lg:gap-[10px] lg:text-[20px]"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-[14px] text-white shadow-sm lg:h-8 lg:w-8 lg:text-[16px]">
              TO
            </div>
            <span className="hidden sm:inline">{t('common.logoName')}</span>
          </Link>

          <nav className="hidden h-full items-stretch gap-1 md:flex lg:gap-2">
            <div className="group flex h-full items-center">
              <Link
                to="/"
                className={cn(
                  'mt-[3px] flex h-full cursor-pointer items-center gap-1.5 whitespace-nowrap border-b-[3px] border-transparent px-2 text-[14px] font-bold transition-all duration-200 lg:px-3 lg:text-[15px]',
                  isToolSection
                    ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                    : 'text-slate-600 group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-slate-100',
                )}
              >
                {t('common.navTools')}
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 transition-transform duration-200 group-hover:rotate-180 lg:h-4 lg:w-4" />
              </Link>
              <ToolsMegaDropdown />
            </div>

            <div className="group flex h-full items-center">
              <Link
                to={aiCategoryPath}
                className={cn(
                  'mt-[3px] flex h-full cursor-pointer items-center gap-1.5 whitespace-nowrap border-b-[3px] border-transparent px-2 text-[14px] font-bold transition-all duration-200 lg:px-3 lg:text-[15px]',
                  isAiSection
                    ? 'border-violet-600 text-violet-600 dark:border-violet-400 dark:text-violet-400'
                    : 'text-slate-600 group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-slate-100',
                )}
              >
                <div className="mr-0.5 flex items-center justify-center text-violet-500 dark:text-violet-400">
                  <Sparkles size={16} className="fill-violet-500/20" />
                </div>
                {t('common.categories.AI 工具') || 'AI Tools'}
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 transition-transform duration-200 group-hover:rotate-180 lg:h-4 lg:w-4" />
              </Link>
              <AiMegaDropdown />
            </div>

            <Link
              to="/blog"
              className={cn(
                'mt-[3px] flex h-full cursor-pointer items-center gap-1.5 whitespace-nowrap border-b-[3px] border-transparent px-2 text-[14px] font-bold transition-all duration-200 lg:px-3 lg:text-[15px]',
                location.pathname.startsWith('/blog')
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100',
              )}
            >
              <Sparkles size={15} className="text-emerald-500" />
              {t('blog.nav')}
            </Link>
          </nav>
        </div>

        <div className="ml-4 flex shrink-0 items-center gap-2 lg:gap-4">
          <div
            className={cn(
              'group relative hidden transition-all duration-300 ease-in-out lg:block',
              isSearchFocused ? 'w-[240px] xl:w-[300px]' : 'w-[40px] xl:w-[150px]',
            )}
          >
            <form onSubmit={handleSearchSubmit}>
              <Search
                className="pointer-events-none absolute left-[14px] top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <input
                id="search-field"
                ref={searchInputRef}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className={cn(
                  'w-full rounded-full border border-slate-200/80 bg-slate-50 py-[8px] pl-[38px] pr-[16px] text-[13px] text-slate-800 outline-none transition-all placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500',
                  isSearchFocused
                    ? 'border-blue-500 bg-white ring-[3px] ring-blue-500/10 dark:bg-slate-900'
                    : 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700',
                )}
                placeholder={isSearchFocused || isWideDesktop ? t('common.searchPlaceholder') : ''}
                type="search"
                name="search"
                defaultValue={new URLSearchParams(location.search).get('search') || ''}
              />
              {!isSearchFocused && (
                <div className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 items-center xl:flex">
                  <kbd className="rounded border border-slate-200 bg-slate-200/50 px-1.5 py-[2px] font-sans text-[10px] font-medium text-slate-400 dark:border-slate-700 dark:bg-slate-700/50 dark:text-slate-300">
                    Ctrl K
                  </kbd>
                </div>
              )}
            </form>
          </div>

          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>

          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <button
            type="button"
            aria-label={t('common.mobileMenu')}
            aria-expanded={mobileMenuOpen}
            className="rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 md:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <MobileMenu
          onClose={() => setMobileMenuOpen(false)}
          pathname={location.pathname}
          searchParams={location.search}
        />
      )}
    </>
  );
}
