'use client';

import { useEffect, useState } from 'react';

type DelayedAdSenseScriptProps = {
  client: string;
};

export default function DelayedAdSenseScript({ client }: DelayedAdSenseScriptProps) {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (!client || !shouldLoad) return;

    if (document.querySelector(`script[data-toolorbit-adsense="${client}"]`)) return;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`;
    script.crossOrigin = 'anonymous';
    script.dataset.toolorbitAdsense = client;
    document.head.appendChild(script);
  }, [client, shouldLoad]);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (!client) return;

    const load = () => setShouldLoad(true);
    const timeoutId = window.setTimeout(load, 4500);
    const idleId =
      'requestIdleCallback' in window
        ? window.requestIdleCallback(load, { timeout: 4500 })
        : undefined;

    return () => {
      window.clearTimeout(timeoutId);
      if (idleId !== undefined && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId);
      }
    };
  }, [client]);

  return null;
}
