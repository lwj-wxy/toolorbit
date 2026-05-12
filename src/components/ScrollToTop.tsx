import { useEffect } from 'react';
import { useCurrentLocation } from '../next/navigation';

export default function ScrollToTop() {
  const { pathname } = useCurrentLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
