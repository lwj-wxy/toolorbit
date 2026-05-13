import type { Metadata } from 'next';
import Script from 'next/script';
import '../index.css';
import JsonLd from '../components/JsonLd';
import Layout from '../components/Layout';
import Providers from './providers';
import { organizationJsonLd, websiteJsonLd } from '../lib/structured-data';

const googleAdsenseClient =
  process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT || 'ca-pub-5608961818345363';

export const metadata: Metadata = {
  title: {
    default: 'ToolOrbit',
    template: '%s | ToolOrbit',
  },
  description:
    'Free browser-based tools for developers, creators, ecommerce operators, PDF workflows, image processing, and AI-assisted productivity.',
  metadataBase: new URL('https://toolorbit.site'),
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
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
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaMeasurementId}', { send_page_view: false });
              `}
            </Script>
          </>
        ) : null}
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${googleAdsenseClient}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
