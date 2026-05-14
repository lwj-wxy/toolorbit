'use client';

import '../i18n';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import RecentToolsTracker from '../components/RecentToolsTracker';
import ScrollToTop from '../components/ScrollToTop';
import { ThemeProvider } from '../context/ThemeContext';
import { usePageTracking } from '../hooks/usePageTracking';
import i18n from '../i18n';
import { detectLocaleFromPathname, i18nLanguageToLocale, localizedPath, localeToI18nLanguage } from '../lib/i18n-routing';

function AnalyticsTracker() {
  usePageTracking();
  return null;
}

function LanguageBootstrapper() {
  const pathname = usePathname() || '/';
  const router = useRouter();

  useEffect(() => {
    const pathLanguage = localeToI18nLanguage(detectLocaleFromPathname(pathname));
    const queryLanguage = new URLSearchParams(window.location.search).get('lng');
    const storedLanguage = localStorage.getItem('toolorbit_language') || localStorage.getItem('i18nextLng');
    const explicitLanguage = queryLanguage || storedLanguage;
    const browserLanguage = navigator.language?.toLowerCase().startsWith('zh') ? 'zh' : 'en';
    const hasLocalePrefix = pathname.toLowerCase().startsWith('/zh-cn');
    const nextLanguage = hasLocalePrefix
      ? pathLanguage
      : explicitLanguage || browserLanguage;
    const normalizedLanguage = nextLanguage.toLowerCase().startsWith('zh') ? 'zh' : 'en';
    document.documentElement.lang = normalizedLanguage === 'zh' ? 'zh-CN' : 'en';

    if (i18n.language !== normalizedLanguage) {
      i18n.changeLanguage(normalizedLanguage);
    }

    if (!hasLocalePrefix && explicitLanguage?.toLowerCase().startsWith('zh')) {
      const nextPath = localizedPath(pathname, i18nLanguageToLocale(explicitLanguage));
      router.replace(`${nextPath}${window.location.search}`);
    }
  }, [pathname, router]);

  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageBootstrapper />
      <ScrollToTop />
      <RecentToolsTracker />
      <Toaster position="top-right" toastOptions={{ className: 'text-sm font-medium' }} />
      <AnalyticsTracker />
      {children}
    </ThemeProvider>
  );
}
