import type { NextConfig } from 'next';

const contentCacheHeaders = [
  {
    key: 'Cache-Control',
    value: 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
  },
];

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  turbopack: {
    root: __dirname,
  },
  async headers() {
    return [
      {
        source: '/',
        headers: contentCacheHeaders,
      },
      {
        source: '/:locale(zh-CN)',
        headers: contentCacheHeaders,
      },
      {
        source: '/blog',
        headers: contentCacheHeaders,
      },
      {
        source: '/blog/page/:page',
        headers: contentCacheHeaders,
      },
      {
        source: '/blog/:slug',
        headers: contentCacheHeaders,
      },
      {
        source: '/category/:slug',
        headers: contentCacheHeaders,
      },
      {
        source: '/tools/:section/:slug',
        headers: contentCacheHeaders,
      },
      {
        source: '/:locale(zh-CN)/blog',
        headers: contentCacheHeaders,
      },
      {
        source: '/:locale(zh-CN)/blog/page/:page',
        headers: contentCacheHeaders,
      },
      {
        source: '/:locale(zh-CN)/blog/:slug',
        headers: contentCacheHeaders,
      },
      {
        source: '/:locale(zh-CN)/category/:slug',
        headers: contentCacheHeaders,
      },
      {
        source: '/:locale(zh-CN)/tools/:section/:slug',
        headers: contentCacheHeaders,
      },
      {
        source: '/:path*.(ico|svg|png|jpg|jpeg|gif|webp|avif|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(self), microphone=(), geolocation=(), payment=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
