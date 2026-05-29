import type { Metadata } from 'next';
import JsonLd from '../../components/JsonLd';
import { staticPageMetadata } from '../../lib/metadata';
import { staticPageJsonLd } from '../../lib/structured-data';
import FeaturedTools from '../../views/FeaturedTools';

export const metadata: Metadata = staticPageMetadata('featured-tools');
export const revalidate = 3600;

export default function Page() {
  return (
    <>
      <JsonLd id="structured-data-featured-tools" data={staticPageJsonLd('featured-tools')} />
      <FeaturedTools />
    </>
  );
}
