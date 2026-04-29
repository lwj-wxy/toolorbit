import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Languages, Check, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
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
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-slate-200/80 bg-slate-50 hover:bg-white hover:border-blue-500/50 hover:ring-[3px] hover:ring-blue-500/10 transition-all duration-200 text-slate-600 hover:text-slate-900 group whitespace-nowrap min-w-[100px] justify-center"
      >
        <Languages className="w-4 h-4 text-slate-400 group-hover:text-blue-500 shrink-0" />
        <span className="text-[13px] font-bold">{currentLanguage.name}</span>
        <ChevronDown className={cn("w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-200">
          <div className="p-1.5">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => toggleLanguage(lang.code)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-xl text-[14px] font-medium transition-colors",
                  i18n.language.startsWith(lang.code) 
                    ? "bg-blue-50 text-blue-600" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
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
