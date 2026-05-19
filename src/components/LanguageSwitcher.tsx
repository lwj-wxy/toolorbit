'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usePathname, useRouter } from 'next/navigation';
import { Languages, Check, ChevronDown } from 'lucide-react';
import { i18nLanguageToLocale, localizedPath } from '../lib/i18n-routing';
import { cn } from '../lib/utils';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const pathname = usePathname() || '/';
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'zh', name: '简体中文' },
    { code: 'en', name: 'English' }
  ];

  const currentLanguage = languages.find(lang => i18n.language.startsWith(lang.code)) || languages[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleLanguage = (code: string) => {
    const locale = i18nLanguageToLocale(code);
    const query = typeof window === 'undefined' ? '' : window.location.search.replace(/^\?/, '');
    const nextPath = localizedPath(pathname, locale);

    localStorage.setItem('toolorbit_language', code);
    document.cookie = `toolorbit_language=${code}; Path=/; Max-Age=31536000; SameSite=Lax`;
    i18n.changeLanguage(code);
    document.documentElement.lang = code === 'zh' ? 'zh-CN' : 'en';
    router.push(query ? `${nextPath}?${query}` : nextPath);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex min-w-[100px] items-center justify-center gap-1.5 whitespace-nowrap rounded-md border border-slate-200/80 bg-white/80 px-3 py-2 text-slate-600 transition-all duration-200 hover:border-blue-500/50 hover:bg-white hover:text-slate-900 hover:ring-[3px] hover:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300"
      >
        <Languages className="w-4 h-4 text-slate-400 group-hover:text-blue-500 shrink-0" />
        <span className="text-[13px] font-bold">{currentLanguage.name}</span>
        <ChevronDown className={cn("w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-[100] mt-2 w-48 overflow-hidden rounded-lg border border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-md duration-200 animate-in fade-in zoom-in-95 dark:border-slate-800 dark:bg-slate-900/95">
          <div className="p-1.5">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => toggleLanguage(lang.code)}
                className={cn(
                  "w-full flex items-center justify-between rounded-md px-3 py-2 text-[14px] font-medium transition-colors",
                  i18n.language.startsWith(lang.code) 
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                )}
              >
                {lang.name}
                {i18n.language.startsWith(lang.code) && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
