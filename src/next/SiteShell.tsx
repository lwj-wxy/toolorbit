'use client';

import '../i18n';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import Layout from '../components/Layout';
import RecentToolsTracker from '../components/RecentToolsTracker';
import ScrollToTop from '../components/ScrollToTop';
import { ThemeProvider } from '../context/ThemeContext';
import { usePageTracking } from '../hooks/usePageTracking';

function AnalyticsTracker() {
  usePageTracking();
  return null;
}

export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <HelmetProvider>
        <ScrollToTop />
        <RecentToolsTracker />
        <Toaster position="top-right" toastOptions={{ className: 'text-sm font-medium' }} />
        <AnalyticsTracker />
        <Layout>{children}</Layout>
      </HelmetProvider>
    </ThemeProvider>
  );
}
