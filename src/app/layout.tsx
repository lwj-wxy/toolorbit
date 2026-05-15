import type { Metadata } from 'next';
import Script from 'next/script';
import '../index.css';
import JsonLd from '../components/JsonLd';
import DelayedAdSenseScript from '../components/DelayedAdSenseScript';
import Layout from '../components/Layout';
import Providers from './providers';
import { BRAND_DESCRIPTION } from '../data/brand';
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
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <JsonLd id="structured-data-organization" data={organizationJsonLd()} />
        <JsonLd id="structured-data-website" data={websiteJsonLd()} />
        {gaMeasurementId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
              strategy="lazyOnload"
            />
            <Script id="google-analytics" strategy="lazyOnload">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaMeasurementId}', { send_page_view: false });
              `}
            </Script>
          </>
        ) : null}
        <DelayedAdSenseScript client={googleAdsenseClient} />
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
