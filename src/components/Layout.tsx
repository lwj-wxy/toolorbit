'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Link, useCurrentLocation } from '../lib/navigation';
import { Search, Menu, ChevronDown, ChevronRight, Home, Sun, Moon, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/utils';
import { TOOLS_META as TOOLS } from '../data/tools-meta';
import { getCategoryPath } from '../lib/category-paths';
import LanguageSwitcher from './LanguageSwitcher';

const ToolsMegaDropdown = dynamic(
  () => import('./MegaMenuContent').then(mod => ({ default: mod.ToolsMegaDropdown })),
  { ssr: false }
);
const AiMegaDropdown = dynamic(
  () => import('./MegaMenuContent').then(mod => ({ default: mod.AiMegaDropdown })),
  { ssr: false }
);
const MobileMenu = dynamic(() => import('./MobileMenu'), { ssr: false });
const LayoutFooter = dynamic(() => import('./LayoutFooter'), { ssr: false });
const RelatedTools = dynamic(() => import('./RelatedTools'), { ssr: false });

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
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

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 font-sans relative overflow-x-hidden transition-colors duration-300">

      {/* Skip to content link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[999] focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none focus:font-bold"
      >
        Skip to main content
      </a>

      {/* Subtle Background Elements */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-50/50 dark:bg-blue-900/10 blur-[100px] rounded-full mix-blend-multiply opacity-50" />
      </div>

      {/* Top Header Navigation */}
      <header className="sticky top-0 z-50 flex h-[64px] items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="flex items-center gap-4 lg:gap-6 xl:gap-8 min-w-0">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 lg:gap-[10px] text-[18px] lg:text-[20px] font-extrabold text-blue-600 dark:text-blue-400 tracking-tight shrink-0">
            <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-[14px] lg:text-[16px] shadow-sm">
              Ω
            </div>
            <span className="hidden sm:inline">{t('common.logoName')}</span>
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-stretch gap-1 lg:gap-2 h-full">
            <div className="group flex items-center h-full">
              <Link
                to="/"
                className={cn(
                  "px-2 lg:px-3 flex items-center gap-1.5 h-full text-[14px] lg:text-[15px] font-bold transition-all duration-200 border-b-[3px] border-transparent mt-[3px] cursor-pointer whitespace-nowrap",
                  isToolSection ? "text-blue-600 border-blue-600 dark:text-blue-400 dark:border-blue-400" : "text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-100"
                )}
              >
                {t('common.navTools')}
                <ChevronDown className="w-3.5 h-3.5 lg:w-4 lg:h-4 transition-transform duration-200 group-hover:rotate-180 text-slate-400" />
              </Link>

              <ToolsMegaDropdown />
            </div>

            {/* AI Tools Nav (Highlighted) */}
            <div className="group flex items-center h-full">
              <Link
                to={getCategoryPath('AI 工具')}
                className={cn(
                  "px-2 lg:px-3 flex items-center gap-1.5 h-full text-[14px] lg:text-[15px] font-bold transition-all duration-200 border-b-[3px] border-transparent mt-[3px] cursor-pointer whitespace-nowrap",
                  isAiSection ? "text-violet-600 border-violet-600 dark:text-violet-400 dark:border-violet-400" : "text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-100"
                )}
              >
                <div className="flex items-center justify-center text-violet-500 dark:text-violet-400 mr-0.5">
                  <Sparkles size={16} className="fill-violet-500/20" />
                </div>
                {t('common.categories.AI 工具') || 'AI Tools'}
                <ChevronDown className="w-3.5 h-3.5 lg:w-4 lg:h-4 transition-transform duration-200 group-hover:rotate-180 text-slate-400" />
              </Link>

              <AiMegaDropdown />
            </div>

            <Link
              to="/blog"
              className={cn(
                "px-2 lg:px-3 flex items-center h-full text-[14px] lg:text-[15px] font-bold transition-all duration-200 border-b-[3px] border-transparent mt-[3px] cursor-pointer whitespace-nowrap",
                location.pathname.startsWith('/blog') ? "text-blue-600 border-blue-600" : "text-slate-600 hover:text-slate-900"
              )}
            >
              🚀 {t('blog.nav')}
            </Link>
          </nav>
        </div>

        {/* Right side actions */}
        <div className="flex items-center shrink-0 gap-2 lg:gap-4 ml-4">
          <div className={cn(
            "relative group hidden lg:block transition-all duration-300 ease-in-out",
            isSearchFocused ? "w-[240px] xl:w-[300px]" : "w-[40px] xl:w-[150px]"
          )}>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const query = formData.get('search');
                window.location.href = `/?search=${query}`;
              }}
            >
              <Search
                className="absolute left-[14px] top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="search-field"
                ref={searchInputRef}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className={cn(
                  "w-full py-[8px] pr-[16px] pl-[38px] rounded-full border border-slate-200/80 bg-slate-50 text-[13px] outline-none transition-all placeholder:text-slate-400 text-slate-800",
                  isSearchFocused ? "border-blue-500 bg-white ring-[3px] ring-blue-500/10" : "cursor-pointer hover:bg-slate-100"
                )}
                placeholder={isSearchFocused || isWideDesktop ? t('common.searchPlaceholder') : ""}
                type="search"
                name="search"
                defaultValue={new URLSearchParams(location.search).get('search') || ''}
              />
              {!isSearchFocused && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden xl:flex items-center pointer-events-none">
                  <kbd className="font-sans px-1.5 py-[2px] text-[10px] text-slate-400 bg-slate-200/50 border border-slate-200 rounded font-medium">Ctrl K</kbd>
                </div>
              )}
            </form>
          </div>

          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>

          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
            aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <button
            type="button"
            aria-label={t('common.mobileMenu')}
            aria-expanded={mobileMenuOpen}
            className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-md transition-colors"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <MobileMenu
          onClose={() => setMobileMenuOpen(false)}
          pathname={location.pathname}
          searchParams={location.search}
        />
      )}

      {/* Main Content Layout */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col min-w-0 relative z-10">
        <main id="main-content" className="w-full min-w-0">
          
          {/* Breadcrumbs for Tools */}
          {location.pathname.startsWith('/tools/') && (() => {
            const currentTool = TOOLS.find(t => t.path === location.pathname);
            if (!currentTool) return null;
            return (
              <nav className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium whitespace-nowrap overflow-x-auto pb-2">
                <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5 flex-shrink-0">
                  <Home className="w-4 h-4" />
                  {t('common.nav_home') || 'Home'}
                </Link>
                <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-700 flex-shrink-0" />
                <Link to={getCategoryPath(currentTool.category)} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex-shrink-0">
                  {t(`common.categories.${currentTool.category}`)}
                </Link>
                <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-700 flex-shrink-0" />
                <span className="text-slate-800 dark:text-slate-200 text-ellipsis overflow-hidden break-all flex-shrink-0 max-w-[200px] sm:max-w-none inline-block">
                  {t(`tools.${currentTool.id}.name`, { defaultValue: currentTool.name })}
                </span>
              </nav>
            );
          })()}

          <div key={location.pathname}>{children}</div>
        </main>
        
        {/* Related Tools for Internal Linking / SEO */}
        {location.pathname.startsWith('/tools/') && (
          <RelatedTools currentPath={location.pathname} />
        )}
      </div>

      <LayoutFooter />

    </div>
  );
}
