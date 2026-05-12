import type { Metadata } from 'next';
import '../index.css';

export const metadata: Metadata = {
  title: {
    default: 'ToolOrbit',
    template: '%s | ToolOrbit',
  },
  description: 'A collection of powerful online tools for developers and creators.',
  metadataBase: new URL('https://toolorbit.site'),
  openGraph: {
    siteName: 'ToolOrbit',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
