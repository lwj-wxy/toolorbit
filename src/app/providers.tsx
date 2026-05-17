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
import type { ToolTrackingItem } from '../lib/navigation-menu';

function AnalyticsTracker() {
  usePageTracking();
  return null;
}

function readCookie(name: string) {
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
    ?.split('=')[1];
}

function LanguageBootstrapper() {
  const pathname = usePathname() || '/';
  const router = useRouter();

  useEffect(() => {
    const pathLanguage = localeToI18nLanguage(detectLocaleFromPathname(pathname));
    const queryLanguage = new URLSearchParams(window.location.search).get('lng');
    const cookieLanguage = readCookie('toolorbit_language');
    const storedLanguage = cookieLanguage || localStorage.getItem('toolorbit_language') || localStorage.getItem('i18nextLng');
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

    document.cookie = `toolorbit_language=${normalizedLanguage}; Path=/; Max-Age=31536000; SameSite=Lax`;

    if (!hasLocalePrefix && explicitLanguage?.toLowerCase().startsWith('zh')) {
      const nextPath = localizedPath(pathname, i18nLanguageToLocale(explicitLanguage));
      router.replace(`${nextPath}${window.location.search}`);
    }
  }, [pathname, router]);

  return null;
}

export default function Providers({
  children,
  toolTrackingData,
}: {
  children: React.ReactNode;
  toolTrackingData: ToolTrackingItem[];
}) {
  return (
    <ThemeProvider>
      <LanguageBootstrapper />
      <ScrollToTop />
      <RecentToolsTracker tools={toolTrackingData} />
      <Toaster position="top-right" toastOptions={{ className: 'text-sm font-medium' }} />
      <AnalyticsTracker />
      {children}
    </ThemeProvider>
  );
}
