'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { BookOpen, LayoutDashboard, Menu, Moon, Search, Sun, Wrench } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { detectLocaleFromPathname, localizedPath, normalizePathname } from '../lib/i18n-routing';
import { Link, useCurrentLocation } from '../lib/navigation';
import { getNavigationMenuData, type NavigationMenuData } from '../lib/navigation-menu';
import { cn } from '../lib/utils';
import MobileMenu from './MobileMenu';

const navItemBaseClass =
  'relative mt-[3px] flex cursor-pointer items-center gap-1.5 self-center whitespace-nowrap px-2 pb-3 pt-2 text-[13px] font-semibold leading-none transition-colors duration-200 after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:rounded-full after:bg-transparent after:content-[""] lg:px-3 lg:after:left-3 lg:after:right-3';

const navItemActiveClass =
  'text-[var(--app-accent-ink)] after:bg-[var(--app-accent)] dark:text-[var(--app-accent-ink)] dark:after:bg-[var(--app-accent)]';

const navItemInactiveClass =
  'text-[var(--app-muted)] hover:text-[var(--app-text)] dark:text-[var(--app-muted)] dark:hover:text-[var(--app-text)]';

export default function LayoutHeaderClient() {
  const router = useRouter();
  const { t } = useTranslation();
  const { setTheme, isDark } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isWideDesktop, setIsWideDesktop] = useState(false);
  const [navigationMenu, setNavigationMenu] = useState<NavigationMenuData>(() => getNavigationMenuData());
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

  const normalizedPathname = normalizePathname(location.pathname);
  const isToolSection =
    normalizedPathname === '/tools' ||
    normalizedPathname.startsWith('/category/') ||
    normalizedPathname.startsWith('/tools/');
  const isBlogSection = normalizedPathname.startsWith('/blog');

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
      <header className="fixed inset-x-0 top-0 z-50 flex h-[68px] items-center justify-between border-b border-[var(--app-border)] bg-[color-mix(in_srgb,var(--app-bg)_90%,transparent)] px-4 backdrop-blur-md sm:px-6 lg:px-10">
        <div className="flex min-w-0 items-center gap-4 lg:gap-6 xl:gap-8">
          <Link to="/" className="group flex shrink-0 items-center gap-3 text-[var(--app-text)]">
            <div className="flex h-9 w-9 items-center justify-center rounded-[13px] bg-[var(--app-text)] text-[12px] font-black tracking-tight text-[var(--app-bg)] transition-transform group-hover:-rotate-6">
              TO
            </div>
            <span className="hidden text-[17px] font-black tracking-[-0.02em] sm:inline">ToolOrbit</span>
            <span className="hidden border-l border-[var(--app-border)] pl-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--app-muted)] lg:inline">Seller workspace</span>
          </Link>

          <nav className="hidden h-full items-stretch gap-1 md:flex lg:gap-2">
            <Link to="/" className={cn(navItemBaseClass, normalizedPathname === '/' ? navItemActiveClass : navItemInactiveClass)}>
              <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
              {t('common.navHome', { defaultValue: 'Workspace' })}
            </Link>

            <div className="flex h-full items-center">
              <Link
                to="/tools"
                className={cn(
                  navItemBaseClass,
                  isToolSection ? navItemActiveClass : navItemInactiveClass,
                )}
              >
                <Wrench className="h-4 w-4" aria-hidden="true" />
                {t('common.navTools', { defaultValue: 'Seller tools' })}
              </Link>
            </div>

            <Link
              to="/blog"
              className={cn(
                navItemBaseClass,
                isBlogSection ? navItemActiveClass : navItemInactiveClass,
              )}
            >
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              {t('blog.nav', { defaultValue: 'Guides' })}
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
                className="pointer-events-none absolute left-[14px] top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--app-muted)]"
                aria-hidden="true"
              />
              <input
                id="search-field"
                ref={searchInputRef}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className={cn(
                  'w-full rounded-md border border-[var(--app-border)] bg-[color-mix(in_srgb,var(--app-surface)_86%,transparent)] py-[8px] pl-[38px] pr-[16px] text-[13px] text-[var(--app-text)] outline-none transition-all placeholder:text-[var(--app-muted)] dark:border-[var(--app-border)] dark:bg-[color-mix(in_srgb,var(--app-surface)_82%,transparent)] dark:text-[var(--app-text)] dark:placeholder:text-[var(--app-muted)]',
                  isSearchFocused
                    ? 'border-[var(--app-accent)] bg-[var(--app-surface)] ring-[3px] ring-[color-mix(in_srgb,var(--app-accent)_16%,transparent)] dark:bg-[var(--app-surface)]'
                    : 'cursor-pointer hover:border-[color-mix(in_srgb,var(--app-accent)_38%,var(--app-border))]',
                )}
                placeholder={isSearchFocused || isWideDesktop ? t('common.searchPlaceholder') : ''}
                type="search"
                name="search"
                defaultValue={new URLSearchParams(location.search).get('search') || ''}
              />
              {!isSearchFocused && (
                <div className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 items-center xl:flex">
                  <kbd className="rounded border border-[var(--app-border)] bg-[var(--app-accent-soft)] px-1.5 py-[2px] font-sans text-[10px] font-medium text-[var(--app-accent-ink)] dark:border-[var(--app-border)] dark:bg-[var(--app-accent-soft)] dark:text-[var(--app-accent-ink)]">
                    Ctrl K
                  </kbd>
                </div>
              )}
            </form>
          </div>

          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="rounded-md p-2 text-[var(--app-muted)] transition-colors hover:bg-[var(--app-accent-soft)] hover:text-[var(--app-accent-ink)] dark:text-[var(--app-muted)] dark:hover:bg-[var(--app-accent-soft)]"
            aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <button
            type="button"
            aria-label={t('common.mobileMenu')}
            aria-expanded={mobileMenuOpen}
            className="rounded-md p-2 text-[var(--app-muted)] transition-colors hover:bg-[var(--app-accent-soft)] hover:text-[var(--app-accent-ink)] dark:text-[var(--app-muted)] dark:hover:bg-[var(--app-accent-soft)] md:hidden"
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
