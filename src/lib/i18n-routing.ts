export type Locale = 'en';
export type I18nLanguage = 'en';

export const DEFAULT_LOCALE: Locale = 'en';

export function normalizePathname(pathname = '/') {
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return normalized.replace(/\/{2,}/g, '/');
}

export function detectLocaleFromPathname(pathname = '/'): Locale {
  return DEFAULT_LOCALE;
}

export function localeToI18nLanguage(_locale: Locale): I18nLanguage {
  return 'en';
}

export function i18nLanguageToLocale(_language: string): Locale {
  return DEFAULT_LOCALE;
}

export function localizedPath(pathname = '/', _locale: Locale = DEFAULT_LOCALE) {
  return normalizePathname(pathname);
}

export function shouldLocalizeHref(href: string) {
  return (
    href.startsWith('/') &&
    !href.startsWith('//') &&
    !href.startsWith('/_next') &&
    !href.startsWith('/api') &&
    !href.startsWith('/og-image') &&
    !href.startsWith('/icon') &&
    !href.startsWith('/manifest') &&
    !href.startsWith('/sitemap') &&
    !href.startsWith('/robots') &&
    !href.startsWith('/llms.txt')
  );
}
