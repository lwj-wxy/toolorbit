import type { NextConfig } from 'next';

const contentCacheHeaders = [
  {
    key: 'Cache-Control',
    value: 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
  },
];

const isProduction = process.env.NODE_ENV === 'production';
const REMOVED_BLOG_SLUGS = [
  'coffee-caffeine-guide',
  'sugar-content-rankings',
  'remote-work-ergonomics',
  'ai-ecommerce-marketing-tips',
  'xiaohongshu-copywriting-ai',
  'benefits-of-chinese-crypto-sm',
];

const scriptSrc = [
  "'self'",
  "'unsafe-inline'",
  ...(!isProduction ? ["'unsafe-eval'"] : []),
  'https://www.googletagmanager.com',
  'https://pagead2.googlesyndication.com',
  'https://partner.googleadservices.com',
  'https://adservice.google.com',
  'https://googleads.g.doubleclick.net',
  'https://ep1.adtrafficquality.google',
  'https://ep2.adtrafficquality.google',
  'https://*.adtrafficquality.google',
].join(' ');

const frameSrc = [
  'https://googleads.g.doubleclick.net',
  'https://pagead2.googlesyndication.com',
  'https://tpc.googlesyndication.com',
  'https://www.google.com',
  'https://ep1.adtrafficquality.google',
  'https://ep2.adtrafficquality.google',
  'https://*.adtrafficquality.google',
].join(' ');

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src ${scriptSrc}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' https: data: blob:",
  "font-src 'self' data:",
  "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://analytics.google.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://stats.g.doubleclick.net https://ep1.adtrafficquality.google https://ep2.adtrafficquality.google https://*.adtrafficquality.google",
  `frame-src ${frameSrc}`,
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'self'",
].join('; ');

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  turbopack: {
    root: process.cwd(),
  },
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'recharts',
      'motion',
      'react-i18next',
      'react-markdown',
      'react-syntax-highlighter',
    ],
  },
  async redirects() {
    return [
      ...REMOVED_BLOG_SLUGS.flatMap((slug) => [
        {
          source: `/blog/${slug}`,
          destination: '/blog',
          permanent: true,
        },
        {
          source: `/zh-CN/blog/${slug}`,
          destination: '/zh-CN/blog',
          permanent: true,
        },
      ]),
      {
        source: '/tools/shared/placeholder',
        destination: '/tools',
        permanent: true,
      },
      {
        source: '/zh-CN/tools/shared/placeholder',
        destination: '/zh-CN/tools',
        permanent: true,
      },
      {
        source: '/tools/dev/chinese-crypto',
        destination: '/tools/dev/crypto-symmetric',
        permanent: true,
      },
      {
        source: '/zh-CN/tools/dev/chinese-crypto',
        destination: '/zh-CN/tools/dev/crypto-symmetric',
        permanent: true,
      },
      {
        source: '/tools/fun/game-2048',
        destination: '/tools',
        permanent: true,
      },
      {
        source: '/zh-CN/tools/fun/game-2048',
        destination: '/zh-CN/tools',
        permanent: true,
      },
      {
        source: '/tools/fun/minesweeper',
        destination: '/tools',
        permanent: true,
      },
      {
        source: '/zh-CN/tools/fun/minesweeper',
        destination: '/zh-CN/tools',
        permanent: true,
      },
      {
        source: '/category/fun-tools',
        destination: '/tools',
        permanent: true,
      },
      {
        source: '/zh-CN/category/fun-tools',
        destination: '/zh-CN/tools',
        permanent: true,
      },
    ];
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
          {
            key: 'Content-Security-Policy',
            value: contentSecurityPolicy,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
