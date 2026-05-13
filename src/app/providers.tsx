'use client';

import '../i18n';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import RecentToolsTracker from '../components/RecentToolsTracker';
import ScrollToTop from '../components/ScrollToTop';
import { ThemeProvider } from '../context/ThemeContext';
import { usePageTracking } from '../hooks/usePageTracking';
import i18n from '../i18n';

function AnalyticsTracker() {
  usePageTracking();
  return null;
}

function LanguageBootstrapper() {
  useEffect(() => {
    const queryLanguage = new URLSearchParams(window.location.search).get('lng');
    const storedLanguage = localStorage.getItem('toolorbit_language') || localStorage.getItem('i18nextLng');
    const browserLanguage = navigator.language?.toLowerCase().startsWith('zh') ? 'zh' : 'en';
    const nextLanguage = queryLanguage || storedLanguage || browserLanguage;
    const normalizedLanguage = nextLanguage.toLowerCase().startsWith('zh') ? 'zh' : 'en';

    if (i18n.language !== normalizedLanguage) {
      i18n.changeLanguage(normalizedLanguage);
    }
  }, []);

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
