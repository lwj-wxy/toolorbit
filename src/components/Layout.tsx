import React from 'react';
import LayoutFooter from './LayoutFooter';
import LayoutHeaderClient from './LayoutHeaderClient';
import LayoutPathEnhancements from './LayoutPathEnhancements';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip bg-[var(--app-bg)] font-sans text-[var(--app-text)] transition-colors duration-300 dark:bg-[var(--app-bg)] dark:text-[var(--app-text)]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[999] focus:rounded-md focus:bg-[var(--app-accent-strong)] focus:px-4 focus:py-2 focus:font-semibold focus:text-white focus:outline-none"
      >
        Skip to main content
      </a>

      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[var(--app-bg)] dark:bg-[var(--app-bg)]">
        <div className="absolute inset-x-0 top-0 h-px bg-[color-mix(in_srgb,var(--app-accent)_34%,transparent)]" />
      </div>

      <LayoutHeaderClient />

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] min-w-0 flex-1 flex-col px-4 pb-7 pt-[calc(68px+1.75rem)] sm:px-6 md:pb-9 md:pt-[calc(68px+2.5rem)] lg:px-10">
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
