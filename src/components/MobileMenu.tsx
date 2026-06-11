'use client';

import { useRouter } from 'next/navigation';
import { Search, X, Sparkles, Star } from 'lucide-react';
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
      <div className="fixed inset-y-0 right-0 flex w-[300px] flex-col overflow-y-auto border-l border-[var(--app-border)] bg-[var(--app-surface)] transition-colors duration-300 dark:bg-[var(--app-bg)]">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--app-border)] bg-[var(--app-surface)] p-5 dark:border-[var(--app-border)] dark:bg-[var(--app-bg)]">
          <span className="text-[16px] font-semibold text-[var(--app-text)] dark:text-[var(--app-text)]">{t('common.mobileMenu')}</span>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <button
              type="button"
              aria-label="Close navigation"
              onClick={onClose}
              className="rounded-md p-2 text-[var(--app-muted)] hover:bg-[var(--app-accent-soft)] hover:text-[var(--app-accent-ink)]"
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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--app-muted)]" />
            <input
              className="w-full rounded-md border border-[var(--app-border)] bg-[var(--app-surface-strong)] py-2.5 pl-9 pr-4 text-[14px] text-[var(--app-text)] outline-none placeholder:text-[var(--app-muted)] focus:border-[var(--app-accent)] focus:bg-[var(--app-surface-strong)] focus:ring-[2px] focus:ring-[color-mix(in_srgb,var(--app-accent)_14%,transparent)] dark:border-[var(--app-border)] dark:bg-[var(--app-surface)] dark:text-[var(--app-text)] dark:focus:bg-[var(--app-surface)]"
              placeholder={t('common.searchPlaceholder')}
              type="search"
              name="search"
              defaultValue={new URLSearchParams(searchParams).get('search') || ''}
            />
          </form>

          <div className="flex flex-col gap-3">
            <h4 className="flex items-center gap-1.5 border-b border-[var(--app-border)] pb-2 text-[14px] font-semibold text-[var(--app-accent-ink)] dark:border-[var(--app-border)] dark:text-[var(--app-accent-ink)]">
              <Sparkles size={16} />
              {t('common.categories.AI 工具') || 'AI Tools'}
            </h4>
            <div className="flex flex-col gap-2">
              {(navigationMenu?.aiTools || []).map(tool => (
                <Link
                  key={tool.id}
                  to={tool.path}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-md px-2 py-2 text-[var(--app-muted)] transition-colors hover:bg-[var(--app-accent-soft)] hover:text-[var(--app-accent-ink)] dark:text-[var(--app-muted)] dark:hover:bg-[var(--app-accent-soft)] dark:hover:text-[var(--app-accent-ink)]"
                >
                  <ToolNavIcon id={tool.id} size={16} />
                  <span className="text-[14px] font-medium">{t(`tools.${tool.id}.name`, { defaultValue: tool.name })}</span>
                </Link>
              ))}
            </div>
          </div>

          {(navigationMenu?.categories || []).map(({ category, tools }) => {
            return (
              <div key={category} className="flex flex-col gap-3">
                <h4 className="border-b border-[var(--app-border)] pb-2 text-[14px] font-semibold text-[var(--app-text)] dark:border-[var(--app-border)] dark:text-[var(--app-text)]">{t(`common.categories.${category}`)}</h4>
                <div className="flex flex-col gap-2">
                  {tools.map(tool => (
                    <Link
                      key={tool.id}
                      to={tool.path}
                      onClick={onClose}
                      className="flex items-center gap-3 rounded-md px-2 py-2 text-[var(--app-muted)] transition-colors hover:bg-[var(--app-accent-soft)] hover:text-[var(--app-accent-ink)] dark:text-[var(--app-muted)] dark:hover:bg-[var(--app-accent-soft)] dark:hover:text-[var(--app-accent-ink)]"
                    >
                      <ToolNavIcon id={tool.id} size={16} />
                      <span className="text-[14px] font-medium">{t(`tools.${tool.id}.name`, { defaultValue: tool.name })}</span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}

          <div className="mt-4 flex flex-col gap-3 border-t border-[var(--app-border)] pt-4 dark:border-[var(--app-border)]">
            <Link
              to="/blog"
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-md px-4 py-3 font-semibold transition-colors",
                pathname.startsWith('/blog') ? "bg-[var(--app-accent-soft)] text-[var(--app-accent-ink)] dark:bg-[var(--app-accent-soft)] dark:text-[var(--app-accent-ink)]" : "text-[var(--app-muted)] hover:bg-[var(--app-accent-soft)] dark:text-[var(--app-muted)] dark:hover:bg-[var(--app-accent-soft)]"
              )}
            >
              <span className="text-[16px]">{t('blog.nav')}</span>
            </Link>
            <Link
              to="/featured-tools"
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-md px-4 py-3 font-semibold transition-colors",
                pathname.startsWith('/featured-tools') ? "bg-[var(--app-accent-warm-soft)] text-[var(--app-accent-warm)] dark:bg-[var(--app-accent-warm-soft)] dark:text-[var(--app-accent-warm)]" : "text-[var(--app-muted)] hover:bg-[var(--app-accent-soft)] dark:text-[var(--app-muted)] dark:hover:bg-[var(--app-accent-soft)]"
              )}
            >
              <Star className="h-5 w-5" />
              <span className="text-[16px]">{t('featured-tools.nav')}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
