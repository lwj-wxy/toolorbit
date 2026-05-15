import { useEffect, useRef } from 'react';
import { useCurrentLocation } from '../lib/navigation';
import { analytics } from '../services/analytics';

export const usePageTracking = () => {
  const location = useCurrentLocation();
  const trackedInitialPageView = useRef(false);

  useEffect(() => {
    if (!trackedInitialPageView.current) {
      trackedInitialPageView.current = true;
      return;
    }

    analytics.trackPageView(location.pathname + location.search);
  }, [location]);
};
