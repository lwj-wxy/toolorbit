import type { Metadata } from 'next';
import JsonLd from '../../components/JsonLd';
import { staticPageMetadata } from '../../lib/metadata';
import { staticPageJsonLd } from '../../lib/structured-data';
import Privacy from '../../views/Privacy';

export const metadata: Metadata = staticPageMetadata('privacy');

export default function Page() {
  return (
    <>
      <JsonLd id="structured-data-privacy" data={staticPageJsonLd('privacy')} />
      <Privacy />
    </>
  );
}
