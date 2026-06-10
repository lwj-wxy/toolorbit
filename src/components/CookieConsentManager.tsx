'use client';

import '../i18n';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Link } from '../lib/navigation';
import { detectLocaleFromPathname, localeToI18nLanguage } from '../lib/i18n-routing';
import { cn } from '../lib/utils';

const CONSENT_STORAGE_KEY = 'toolorbit_cookie_consent_v1';

type ConsentState = {
  analytics: boolean;
  ads: boolean;
  updatedAt: string;
};

type CookieConsentManagerProps = {
  adsenseClient?: string;
};

function readConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentState>;
    if (typeof parsed.analytics !== 'boolean' || typeof parsed.ads !== 'boolean') return null;

    return {
      analytics: parsed.analytics,
      ads: parsed.ads,
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

function writeConsent(next: Omit<ConsentState, 'updatedAt'>): ConsentState {
  const value = { ...next, updatedAt: new Date().toISOString() };
  window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(value));
  return value;
}

function loadAdSense(client: string) {
  if (document.querySelector(`script[data-toolorbit-adsense="${client}"]`)) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`;
  script.crossOrigin = 'anonymous';
  script.dataset.toolorbitAdsense = client;
  document.head.appendChild(script);
}

export default function CookieConsentManager({ adsenseClient }: CookieConsentManagerProps) {
  const { t } = useTranslation();
  const pathname = usePathname() || '/';
  const language = localeToI18nLanguage(detectLocaleFromPathname(pathname));
  const tr = (key: string, defaultValue: string) => t(key, { lng: language, defaultValue });
  const [consent, setConsent] = useState<ConsentState | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isBannerOpen, setIsBannerOpen] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [analyticsAllowed, setAnalyticsAllowed] = useState(false);
  const [adsAllowed, setAdsAllowed] = useState(false);

  useEffect(() => {
    const saved = readConsent();
    setConsent(saved);
    setAnalyticsAllowed(saved?.analytics ?? false);
    setAdsAllowed(saved?.ads ?? false);
    setIsBannerOpen(!saved);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const openPreferences = () => {
      const saved = readConsent();
      setConsent(saved);
      setAnalyticsAllowed(saved?.analytics ?? false);
      setAdsAllowed(saved?.ads ?? false);
      setIsCustomizing(true);
      setIsBannerOpen(true);
    };

    window.addEventListener('toolorbit:open-cookie-preferences', openPreferences);
    return () => window.removeEventListener('toolorbit:open-cookie-preferences', openPreferences);
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (!consent?.ads || !adsenseClient) {
      window.gtag?.('consent', 'update', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      });
      return;
    }

    const load = () => loadAdSense(adsenseClient);
    window.gtag?.('consent', 'update', {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
    });
    const timeoutId = window.setTimeout(load, 1200);
    const idleId =
      'requestIdleCallback' in window
        ? window.requestIdleCallback(load, { timeout: 1800 })
        : undefined;

    return () => {
      window.clearTimeout(timeoutId);
      if (idleId !== undefined && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId);
      }
    };
  }, [consent?.ads, adsenseClient]);

  const saveConsent = (next: Omit<ConsentState, 'updatedAt'>) => {
    const saved = writeConsent(next);
    setConsent(saved);
    setAnalyticsAllowed(saved.analytics);
    setAdsAllowed(saved.ads);
    setIsCustomizing(false);
    setIsBannerOpen(false);
  };

  if (!isLoaded || !isBannerOpen) return null;

  return (
    <section
      className="pointer-events-none fixed inset-x-0 bottom-4 z-[120] flex justify-center px-4 sm:bottom-6"
      aria-label={tr('cookieConsent.title', 'Cookie preferences')}
    >
      <div className="pointer-events-auto w-full max-w-2xl rounded-lg border border-slate-200 bg-white/95 p-4 text-center shadow-[0_16px_48px_rgba(15,23,42,0.16)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 sm:p-5">
        <div>
          <h2 className="text-sm font-semibold text-slate-950 dark:text-white">
            {tr('cookieConsent.title', 'Cookie preferences')}
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {tr(
              'cookieConsent.description',
              'ToolOrbit uses essential browser storage for preferences. With your consent, we also use analytics and advertising cookies to improve the site and support free tools.',
            )}{' '}
            <Link to="/privacy" className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-200">
              {tr('cookieConsent.privacyLink', 'Privacy Policy')}
            </Link>
          </p>

          {isCustomizing ? (
            <div className="mt-4 flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-5">
              <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="h-4 w-4 rounded border-slate-300 text-blue-600"
                />
                {tr('cookieConsent.necessary', 'Necessary')}
              </label>
              <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={analyticsAllowed}
                  onChange={(event) => setAnalyticsAllowed(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600"
                />
                {tr('cookieConsent.analytics', 'Analytics')}
              </label>
              <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={adsAllowed}
                  onChange={(event) => setAdsAllowed(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600"
                />
                {tr('cookieConsent.ads', 'Advertising')}
              </label>
            </div>
          ) : null}
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {isCustomizing ? (
            <button
              type="button"
              onClick={() => saveConsent({ analytics: analyticsAllowed, ads: adsAllowed })}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
            >
              {tr('cookieConsent.save', 'Save choices')}
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setIsCustomizing(true)}
                className="rounded-md px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white dark:focus:ring-offset-slate-950"
              >
                {tr('cookieConsent.manage', 'Manage')}
              </button>
              <button
                type="button"
                onClick={() => saveConsent({ analytics: false, ads: false })}
                className="rounded-md px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white dark:focus:ring-offset-slate-950"
              >
                {tr('cookieConsent.reject', 'Reject optional')}
              </button>
              <button
                type="button"
                onClick={() => saveConsent({ analytics: true, ads: true })}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
              >
                {tr('cookieConsent.accept', 'Accept all')}
              </button>
            </>
          )}
          {isCustomizing ? (
            <button
              type="button"
              onClick={() => saveConsent({ analytics: false, ads: false })}
              className={cn(
                'rounded-md px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                'dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white dark:focus:ring-offset-slate-950',
              )}
            >
              {tr('cookieConsent.reject', 'Reject optional')}
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
