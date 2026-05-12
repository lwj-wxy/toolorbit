import path from 'path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-router-dom': path.resolve(__dirname, 'src/lib/router-compat.tsx'),
    };

    config.module.rules.push({
      resourceQuery: /url/,
      type: 'asset/resource',
    });

    return config;
  },
};

export default nextConfig;
