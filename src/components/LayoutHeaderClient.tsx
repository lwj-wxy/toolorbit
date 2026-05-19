'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu, Moon, Search, Sparkles, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { detectLocaleFromPathname, localizedPath } from '../lib/i18n-routing';
import { Link, useCurrentLocation } from '../lib/navigation';
import type { NavigationMenuData } from '../lib/navigation-menu';
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
  const [navigationMenu, setNavigationMenu] = useState<NavigationMenuData | null>(null);
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

  useEffect(() => {
    let cancelled = false;

    fetch('/api/navigation-menu')
      .then((response) => (response.ok ? response.json() : null))
      .then((data: NavigationMenuData | null) => {
        if (!cancelled && data) setNavigationMenu(data);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  const aiCategoryPath = navigationMenu?.aiCategoryPath || '/category/ai-tools';
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
      <header className="sticky top-0 z-50 flex h-[58px] items-center justify-between border-b border-slate-200/80 bg-[#f7f8fb]/90 px-4 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/88 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-4 lg:gap-6 xl:gap-8">
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2 text-[16px] font-bold tracking-tight text-slate-950 transition-colors hover:text-blue-700 dark:text-white dark:hover:text-blue-300 lg:gap-[10px]"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-[11px] font-bold text-white lg:h-8 lg:w-8">
              TO
            </div>
            <span className="hidden sm:inline">{t('common.logoName')}</span>
          </Link>

          <nav className="hidden h-full items-stretch gap-1 md:flex lg:gap-2">
            <div className="group flex h-full items-center">
              <Link
                to="/"
                className={cn(
                  'mt-[3px] flex h-full cursor-pointer items-center gap-1.5 whitespace-nowrap border-b-2 border-transparent px-2 text-[13px] font-semibold transition-colors duration-200 lg:px-3',
                  isToolSection
                    ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                    : 'text-slate-600 group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-slate-100',
                )}
              >
                {t('common.navTools')}
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 transition-transform duration-200 group-hover:rotate-180 lg:h-4 lg:w-4" />
              </Link>
              <ToolsMegaDropdown categories={navigationMenu?.categories || []} />
            </div>

            <div className="group flex h-full items-center">
              <Link
                to={aiCategoryPath}
                className={cn(
                  'mt-[3px] flex h-full cursor-pointer items-center gap-1.5 whitespace-nowrap border-b-2 border-transparent px-2 text-[13px] font-semibold transition-colors duration-200 lg:px-3',
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
              <AiMegaDropdown aiCategoryPath={aiCategoryPath} aiTools={navigationMenu?.aiTools || []} />
            </div>

            <Link
              to="/blog"
              className={cn(
                'mt-[3px] flex h-full cursor-pointer items-center gap-1.5 whitespace-nowrap border-b-2 border-transparent px-2 text-[13px] font-semibold transition-colors duration-200 lg:px-3',
                location.pathname.startsWith('/blog')
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100',
              )}
            >
              {t('blog.nav')}
            </Link>
          </nav>
        </div>

        <div className="ml-4 flex shrink-0 items-center gap-2 lg:gap-4">
          <div
            className={cn(
                  'group relative hidden transition-all duration-300 ease-in-out lg:block',
              isSearchFocused ? 'w-[240px] xl:w-[300px]' : 'w-[40px] xl:w-[160px]',
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
                  'w-full rounded-md border border-slate-200/80 bg-white/80 py-[8px] pl-[38px] pr-[16px] text-[13px] text-slate-800 outline-none transition-all placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:placeholder:text-slate-500',
                  isSearchFocused
                    ? 'border-blue-500 bg-white ring-[3px] ring-blue-500/10 dark:bg-slate-900'
                    : 'cursor-pointer hover:border-slate-300 dark:hover:border-slate-600',
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
            className="rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-200/70 dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <button
            type="button"
            aria-label={t('common.mobileMenu')}
            aria-expanded={mobileMenuOpen}
            className="rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-200/70 dark:text-slate-400 dark:hover:bg-slate-800 md:hidden"
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
          navigationMenu={navigationMenu}
        />
      )}
    </>
  );
}
