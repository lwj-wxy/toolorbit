'use client';

import { usePathname } from 'next/navigation';

export default function HtmlRoot({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lang = pathname.startsWith('/zh-CN') ? 'zh-CN' : 'en';

  return (
    <html lang={lang} suppressHydrationWarning>
      {children}
    </html>
  );
}
