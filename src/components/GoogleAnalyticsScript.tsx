'use client';

import { useEffect } from 'react';
import { analytics } from '../services/analytics';

type GoogleAnalyticsScriptProps = {
  measurementId?: string;
};

export default function GoogleAnalyticsScript({ measurementId }: GoogleAnalyticsScriptProps) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (!measurementId) return;

    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function gtag() {
        window.dataLayer?.push(arguments);
      };

    if (!document.querySelector(`script[data-toolorbit-ga="${measurementId}"]`)) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
      script.dataset.toolorbitGa = measurementId;
      document.head.appendChild(script);
    }

    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      page_path: window.location.pathname + window.location.search,
    });
    analytics.enable();
  }, [measurementId]);

  return null;
}
