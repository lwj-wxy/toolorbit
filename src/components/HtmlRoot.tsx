'use client';

export default function HtmlRoot({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" translate="no" suppressHydrationWarning>
      {children}
    </html>
  );
}
