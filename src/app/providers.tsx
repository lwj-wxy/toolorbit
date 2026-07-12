'use client';

import '../i18n';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import CookieConsentManager from '../components/CookieConsentManager';
import GoogleAnalyticsScript from '../components/GoogleAnalyticsScript';
import RecentToolsTracker from '../components/RecentToolsTracker';
import ScrollToTop from '../components/ScrollToTop';
import { ThemeProvider } from '../context/ThemeContext';
import { usePageTracking } from '../hooks/usePageTracking';
import { analytics } from '../services/analytics';
import i18n from '../i18n';
import type { ToolTrackingItem } from '../lib/navigation-menu';

function AnalyticsTracker() {
  usePageTracking();

  useEffect(() => {
    const handleToolLinkClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest('a[href]');
      const href = link?.getAttribute('href') || '';
      if (!href.startsWith('/tools/')) return;

      const toolPath = href.split(/[?#]/, 1)[0];
      analytics.trackEvent({
        category: 'Navigation',
        action: 'tool_click',
        label: toolPath,
        metadata: {
          linkText: link?.textContent?.trim().slice(0, 100) || undefined,
        },
      });
    };

    document.addEventListener('click', handleToolLinkClick, true);
    return () => document.removeEventListener('click', handleToolLinkClick, true);
  }, []);

  return null;
}

function LanguageBootstrapper() {
  useEffect(() => {
    const normalizedLanguage = 'en';
    document.documentElement.lang = 'en';

    if (i18n.language !== normalizedLanguage) {
      i18n.changeLanguage(normalizedLanguage);
    }

    document.cookie = `toolorbit_language=${normalizedLanguage}; Path=/; Max-Age=31536000; SameSite=Lax`;
  }, []);

  return null;
}

export default function Providers({
  children,
  gaMeasurementId,
  adsenseClient,
  toolTrackingData,
}: {
  children: React.ReactNode;
  gaMeasurementId?: string;
  adsenseClient?: string;
  toolTrackingData: ToolTrackingItem[];
}) {
  return (
    <ThemeProvider>
      <LanguageBootstrapper />
      <GoogleAnalyticsScript measurementId={gaMeasurementId} />
      <ScrollToTop />
      <RecentToolsTracker tools={toolTrackingData} />
      <Toaster position="top-right" toastOptions={{ className: 'text-sm font-medium' }} />
      <AnalyticsTracker />
      {children}
      <CookieConsentManager adsenseClient={adsenseClient} />
    </ThemeProvider>
  );
}
