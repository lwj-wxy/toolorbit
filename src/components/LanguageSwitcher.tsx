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
        className="group flex min-w-[100px] items-center justify-center gap-1.5 whitespace-nowrap rounded-md border border-[var(--app-border)] bg-[color-mix(in_srgb,var(--app-surface)_82%,transparent)] px-3 py-2 text-[var(--app-muted)] transition-all duration-200 hover:border-[color-mix(in_srgb,var(--app-accent)_46%,var(--app-border))] hover:bg-[var(--app-surface)] hover:text-[var(--app-text)] hover:ring-[3px] hover:ring-[color-mix(in_srgb,var(--app-accent)_12%,transparent)] dark:border-[var(--app-border)] dark:bg-[color-mix(in_srgb,var(--app-surface)_78%,transparent)] dark:text-[var(--app-muted)]"
      >
        <Languages className="w-4 h-4 text-[var(--app-muted)] group-hover:text-[var(--app-accent)] shrink-0" />
        <span className="text-[13px] font-bold">{currentLanguage.name}</span>
        <ChevronDown className={cn("w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-[100] mt-2 w-48 overflow-hidden rounded-lg border border-[var(--app-border)] bg-[color-mix(in_srgb,var(--app-surface)_96%,transparent)] backdrop-blur-md duration-200 animate-in fade-in zoom-in-95 dark:border-[var(--app-border)] dark:bg-[color-mix(in_srgb,var(--app-surface)_96%,transparent)]">
          <div className="p-1.5">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => toggleLanguage(lang.code)}
                className={cn(
                  "w-full flex items-center justify-between rounded-md px-3 py-2 text-[14px] font-medium transition-colors",
                  i18n.language.startsWith(lang.code) 
                    ? "bg-[var(--app-accent-soft)] text-[var(--app-accent-ink)] dark:bg-[var(--app-accent-soft)] dark:text-[var(--app-accent-ink)]"
                    : "text-[var(--app-muted)] hover:bg-[var(--app-accent-soft)] hover:text-[var(--app-text)] dark:text-[var(--app-muted)] dark:hover:bg-[var(--app-accent-soft)] dark:hover:text-[var(--app-text)]"
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
