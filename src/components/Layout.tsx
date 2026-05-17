import React from 'react';
import LayoutFooter from './LayoutFooter';
import LayoutHeaderClient from './LayoutHeaderClient';
import LayoutPathEnhancements from './LayoutPathEnhancements';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-slate-50 font-sans text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-200">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[999] focus:rounded-lg focus:bg-blue-600 focus:px-4 focus:py-2 focus:font-bold focus:text-white focus:shadow-lg focus:outline-none"
      >
        Skip to main content
      </a>

      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-blue-50/50 opacity-50 blur-[100px] mix-blend-multiply dark:bg-blue-900/10" />
      </div>

      <LayoutHeaderClient />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl min-w-0 flex-1 flex-col px-4 py-8 sm:px-6 md:py-12 lg:px-8">
        <main id="main-content" className="w-full min-w-0">
          <LayoutPathEnhancements slot="before-content" />
          <div>{children}</div>
        </main>

        <LayoutPathEnhancements slot="after-content" />
      </div>

      <LayoutFooter />
    </div>
  );
}
