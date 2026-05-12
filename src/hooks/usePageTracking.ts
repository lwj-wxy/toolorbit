import { useEffect } from 'react';
import { useCurrentLocation } from '../next/navigation';
import { analytics } from '../services/analytics';

export const usePageTracking = () => {
  const location = useCurrentLocation();

  useEffect(() => {
    // Track page view on route change
    analytics.trackPageView(location.pathname + location.search);
  }, [location]);
};
