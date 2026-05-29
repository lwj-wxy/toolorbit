'use client';

import '../i18n';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import RecentToolsTracker from '../components/RecentToolsTracker';
import ScrollToTop from '../components/ScrollToTop';
import { ThemeProvider } from '../context/ThemeContext';
import { usePageTracking } from '../hooks/usePageTracking';
import i18n from '../i18n';
import { detectLocaleFromPathname, localeToI18nLanguage } from '../lib/i18n-routing';
import type { ToolTrackingItem } from '../lib/navigation-menu';

function AnalyticsTracker() {
  usePageTracking();
  return null;
}

function LanguageBootstrapper() {
  const pathname = usePathname() || '/';

  useEffect(() => {
    const pathLanguage = localeToI18nLanguage(detectLocaleFromPathname(pathname));
    const hasLocalePrefix = pathname.toLowerCase().startsWith('/zh-cn');
    const nextLanguage = hasLocalePrefix
      ? pathLanguage
      : 'en';
    const normalizedLanguage = nextLanguage.toLowerCase().startsWith('zh') ? 'zh' : 'en';
    document.documentElement.lang = normalizedLanguage === 'zh' ? 'zh-CN' : 'en';

    if (i18n.language !== normalizedLanguage) {
      i18n.changeLanguage(normalizedLanguage);
    }

    document.cookie = `toolorbit_language=${normalizedLanguage}; Path=/; Max-Age=31536000; SameSite=Lax`;
  }, [pathname]);

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
