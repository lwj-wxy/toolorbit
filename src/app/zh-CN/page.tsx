import type { Metadata } from 'next';
import JsonLd from '../../components/JsonLd';
import ScopedI18nProvider from '../../components/ScopedI18nProvider';
import { homeMetadata } from '../../lib/metadata';
import { homePageJsonLd } from '../../lib/structured-data';
import Home from '../../views/Home';

const LOCALE = 'zh-CN' as const;

export const metadata: Metadata = homeMetadata(LOCALE);
export const revalidate = 3600;

export default function ChineseHomePage() {
  return (
    <ScopedI18nProvider language="zh">
      <JsonLd id="structured-data-home-zh" data={homePageJsonLd(LOCALE)} />
      <Home />
    </ScopedI18nProvider>
  );
}
