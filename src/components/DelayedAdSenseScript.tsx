'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

type DelayedAdSenseScriptProps = {
  client: string;
};

export default function DelayedAdSenseScript({ client }: DelayedAdSenseScriptProps) {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
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

  if (!shouldLoad) return null;

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
