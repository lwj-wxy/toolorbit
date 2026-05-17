import type { Metadata } from 'next';
import Script from 'next/script';
import '../index.css';
import JsonLd from '../components/JsonLd';
import DelayedAdSenseScript from '../components/DelayedAdSenseScript';
import Layout from '../components/Layout';
import Providers from './providers';
import { BRAND_DESCRIPTION } from '../data/brand';
import { getGaMeasurementId } from '../lib/analytics-config';
import { getToolTrackingData } from '../lib/navigation-menu';
import { organizationJsonLd, websiteJsonLd } from '../lib/structured-data';

const googleAdsenseClient =
  process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT || 'ca-pub-5608961818345363';

export const metadata: Metadata = {
  title: {
    default: 'ToolOrbit',
    template: '%s | ToolOrbit',
  },
  description: BRAND_DESCRIPTION,
  metadataBase: new URL('https://toolorbit.site'),
  authors: [{ name: 'ToolOrbit Editorial Team', url: 'https://toolorbit.site/about' }],
  creator: 'ToolOrbit',
  publisher: 'ToolOrbit',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    siteName: 'ToolOrbit',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
  other: {
    'google-adsense-account': googleAdsenseClient,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaMeasurementId = getGaMeasurementId();
  const toolTrackingData = getToolTrackingData();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('toolorbit_theme') || 'system';
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var isDark = theme === 'dark' || (theme === 'system' && prefersDark);
                  document.documentElement.classList.toggle('dark', isDark);
                } catch (error) {}
              })();
            `,
          }}
        />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning>
        <JsonLd id="structured-data-organization" data={organizationJsonLd()} />
        <JsonLd id="structured-data-website" data={websiteJsonLd()} />
        {gaMeasurementId ? (
          <>
            <Script id="google-analytics-stub" strategy="beforeInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                window.gtag = window.gtag || function(){window.dataLayer.push(arguments);}
              `}
            </Script>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                window.gtag = window.gtag || function(){window.dataLayer.push(arguments);}
                window.gtag('js', new Date());
                window.gtag('config', '${gaMeasurementId}');
              `}
            </Script>
          </>
        ) : null}
        <DelayedAdSenseScript client={googleAdsenseClient} />
        <Providers toolTrackingData={toolTrackingData}>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
