import type { Metadata } from 'next';
import JsonLd from '../../components/JsonLd';
import { staticPageMetadata } from '../../lib/metadata';
import { staticPageJsonLd } from '../../lib/structured-data';
import Terms from '../../views/Terms';

export const metadata: Metadata = staticPageMetadata('terms');

export default function Page() {
  return (
    <>
      <JsonLd id="structured-data-terms" data={staticPageJsonLd('terms')} />
      <Terms />
    </>
  );
}
