import React from 'react';
import LayoutFooter from './LayoutFooter';
import LayoutHeaderClient from './LayoutHeaderClient';
import LayoutPathEnhancements from './LayoutPathEnhancements';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip bg-[#f7f8fb] font-sans text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-200">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[999] focus:rounded-md focus:bg-blue-600 focus:px-4 focus:py-2 focus:font-semibold focus:text-white focus:outline-none"
      >
        Skip to main content
      </a>

      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[linear-gradient(to_bottom,#f7f8fb_0%,#f2f5f9_42%,#f7f8fb_100%)] dark:bg-[linear-gradient(to_bottom,#0b1120_0%,#0f172a_45%,#0b1120_100%)]">
        <div className="absolute inset-x-0 top-0 h-px bg-slate-200/80 dark:bg-slate-800/80" />
      </div>

      <LayoutHeaderClient />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl min-w-0 flex-1 flex-col px-4 pb-7 pt-[calc(58px+1.75rem)] sm:px-6 md:pb-9 md:pt-[calc(58px+2.25rem)] lg:px-8">
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
