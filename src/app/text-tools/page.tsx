import type { Metadata } from 'next';
import JsonLd from '../../components/JsonLd';
import { getSeoContentPage } from '../../data/seoContent';
import { seoContentMetadata } from '../../lib/metadata';
import { seoContentPageJsonLd } from '../../lib/structured-data';
import SeoContentPageView from '../../views/SeoContentPage';

const PATH = '/text-tools';

export const revalidate = 86400;
export const metadata: Metadata = seoContentMetadata(PATH);

export default function Page() {
  const page = getSeoContentPage(PATH)!;
  return (
    <>
      <JsonLd id="structured-data-text-tools" data={seoContentPageJsonLd(PATH)} />
      <SeoContentPageView page={page} />
    </>
  );
}
