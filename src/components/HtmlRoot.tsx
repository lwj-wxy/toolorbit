'use client';

export default function HtmlRoot({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      {children}
    </html>
  );
}
