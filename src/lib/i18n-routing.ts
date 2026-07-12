export type Locale = 'en' | 'zh-CN';
export type I18nLanguage = 'en' | 'zh';

export const DEFAULT_LOCALE: Locale = 'en';
export const CHINESE_LOCALE: Locale = 'zh-CN';

const LOCALE_PREFIX_PATTERN = /^\/(?:zh-CN)(?=\/|$)/i;

export const HREFLANG_CODES: Record<Locale, string> = {
  en: 'en',
  'zh-CN': 'zh-CN',
};

export function normalizePathname(pathname = '/') {
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const withoutLocale = normalized.replace(LOCALE_PREFIX_PATTERN, '') || '/';
  return withoutLocale.replace(/\/{2,}/g, '/');
}

export function detectLocaleFromPathname(pathname = '/'): Locale {
  return DEFAULT_LOCALE;
}

export function localeToI18nLanguage(locale: Locale): I18nLanguage {
  return 'en';
}

export function i18nLanguageToLocale(language: string): Locale {
  return DEFAULT_LOCALE;
}

export function localizedPath(pathname = '/', locale: Locale = DEFAULT_LOCALE) {
  const normalized = normalizePathname(pathname);

  return normalized;
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
