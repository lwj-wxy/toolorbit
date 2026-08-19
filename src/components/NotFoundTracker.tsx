'use client';

import { useEffect } from 'react';
import { analytics } from '../services/analytics';

export default function NotFoundTracker() {
  useEffect(() => {
    const path = window.location.pathname + window.location.search;
    analytics.trackEvent({
      category: 'Routing',
      action: 'page_not_found',
      label: path,
      metadata: { requested_path: path },
    });
  }, []);

  return null;
}
