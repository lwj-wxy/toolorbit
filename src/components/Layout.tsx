'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Link, useCurrentLocation } from '../lib/navigation';
import { Search, Menu, X, ChevronDown, ChevronRight, Home, Sun, Moon, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/utils';
import { TOOLS } from '../data/tools';
import { getCategoryPath } from '../lib/category-paths';
import LanguageSwitcher from './LanguageSwitcher';
import { motion, AnimatePresence } from 'motion/react';

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

  const categories = Array.from(new Set(TOOLS.map(t => t.category)));
  const navCategories = categories.filter(c => c !== '娱乐工具' && c !== 'AI 工具');
  const aiCategoryPath = getCategoryPath('AI 工具');
  const isAiSection = location.pathname === aiCategoryPath || location.pathname.startsWith('/tools/ai/');
  const isToolSection =
    location.pathname === '/' ||
    (location.pathname.startsWith('/category/') && location.pathname !== aiCategoryPath) ||
    (location.pathname.startsWith('/tools/') && !location.pathname.startsWith('/tools/ai/'));

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 font-sans relative overflow-x-hidden transition-colors duration-300">
      
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

              {/* Mega Menu - Grouped by Category */}
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

              {/* AI Dropdown Menu */}
              <div className="absolute top-[64px] left-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top -translate-y-1 group-hover:translate-y-0 z-50">
                <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <h3 className="text-[13px] font-extrabold text-violet-500 dark:text-violet-400 uppercase tracking-wider">
                      {t('common.categories.AI 工具') || 'AI Tools'}
                    </h3>
                    <Link
                      to={getCategoryPath('AI 工具')}
                      className="text-[12px] font-bold text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
                    >
                      {t('common.viewMore')} &rarr;
                    </Link>
                  </div>
                  <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-x-6 gap-y-1">
                    {TOOLS.filter(t => t.category === 'AI 工具').map(tool => {
                      const color = tool.color || 'violet';
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
                        indigo: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 hover:border-indigo-100 dark:hover:border-indigo-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 group-hover/item:text-indigo-700 dark:group-hover/item:text-indigo-400'
                      };
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
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <button
            type="button"
            aria-label={t('common.mobileMenu')}
            className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-md transition-colors"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 right-0 w-[300px] bg-white dark:bg-slate-900 shadow-2xl overflow-y-auto flex flex-col transition-colors duration-300">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
              <span className="font-bold text-[18px] text-slate-900 dark:text-slate-100">{t('common.mobileMenu')}</span>
              <div className="flex items-center gap-2">
                <LanguageSwitcher />
                <button
                  type="button"
                  aria-label="Close navigation"
                  onClick={() => setMobileMenuOpen(false)}
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
                  setMobileMenuOpen(false);
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
                  defaultValue={new URLSearchParams(location.search).get('search') || ''}
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
                          onClick={() => setMobileMenuOpen(false)}
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
                      onClick={() => setMobileMenuOpen(false)}
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
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 py-3 px-4 rounded-xl font-bold transition-all",
                    location.pathname.startsWith('/blog') ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  )}
                >
                   <span className="text-[16px]">{t('blog.nav')}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Layout */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col min-w-0 relative z-10">
        <main className="w-full min-w-0">
          
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

          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
        
        {/* Related Tools for Internal Linking / SEO */}
        {location.pathname.startsWith('/tools/') && (
          <div className="mt-16 pt-12 border-t border-slate-200/60 dark:border-slate-800/60">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">{t('common.related_tools') || 'Related Tools'}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(() => {
                const currentTool = TOOLS.find(t => t.path === location.pathname);
                if (!currentTool) return null;
                const related = TOOLS.filter(t => t.category === currentTool.category && t.id !== currentTool.id).slice(0, 4);
                return related.map(tool => (
                  <Link 
                    key={tool.id} 
                    to={tool.path}
                    className="flex flex-col p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
                  >
                    <div className="flex items-center gap-3 mb-2">
                       <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                         <tool.icon size={20} />
                       </div>
                       <h4 className="font-bold text-slate-800 dark:text-slate-200">{t(`tools.${tool.id}.name`, { defaultValue: tool.name })}</h4>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mt-auto">
                      {t(`tools.${tool.id}.description`, { defaultValue: tool.description })}
                    </p>
                  </Link>
                ));
              })()}
            </div>
          </div>
        )}
      </div>

      <footer className="bg-transparent pt-8 pb-12 flex flex-col items-center justify-center text-[13px] text-slate-600 dark:text-slate-400 mt-auto relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200/50 dark:border-slate-800/50">
        <div className="flex gap-6 mb-4 font-medium">
          <Link to="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase tracking-wider">{t('common.nav_about')}</Link>
          <Link to="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase tracking-wider">{t('common.nav_privacy')}</Link>
          <Link to="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase tracking-wider">{t('common.nav_terms')}</Link>
        </div>
        <div className="text-center">
          <p>{t('common.footer_desc')}</p>
          <p>{t('common.footerText')}</p>
        </div>
      </footer>

    </div>
  );
}
