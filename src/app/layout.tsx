import type { Metadata } from 'next';
import '../index.css';
import JsonLd from '../components/JsonLd';
import HtmlRoot from '../components/HtmlRoot';
import Layout from '../components/Layout';
import Providers from './providers';
import { BRAND_DESCRIPTION } from '../data/brand';
import { DEFAULT_BLOG_AUTHOR } from '../data/authors';
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
  authors: [{ name: DEFAULT_BLOG_AUTHOR.name, url: `https://toolorbit.site${DEFAULT_BLOG_AUTHOR.url}` }],
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
    <HtmlRoot>
      <head />
      <body suppressHydrationWarning>
        <JsonLd id="structured-data-organization" data={organizationJsonLd()} />
        <JsonLd id="structured-data-website" data={websiteJsonLd()} />
        <Providers
          adsenseClient={googleAdsenseClient}
          gaMeasurementId={gaMeasurementId}
          toolTrackingData={toolTrackingData}
        >
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </HtmlRoot>
  );
}
