import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router-dom', 'react-helmet-async'],
            'vendor-pdf': ['pdfjs-dist', 'pdf-lib', 'jspdf'],
            'vendor-ui': ['lucide-react', 'motion', 'react-hot-toast'],
            'vendor-utils': ['axios', 'dayjs', 'i18next', 'react-i18next'],
            'vendor-charts': ['recharts'],
            'vendor-crypto': ['crypto-js', 'sm-crypto'],
          },
        },
      },
      chunkSizeWarningLimit: 1000,
      minify: 'esbuild',
      cssMinify: true,
      reportCompressedSize: false,
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
