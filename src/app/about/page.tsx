import type { Metadata } from 'next';
import JsonLd from '../../components/JsonLd';
import { staticPageMetadata } from '../../lib/metadata';
import { staticPageJsonLd } from '../../lib/structured-data';
import About from '../../views/About';

export const metadata: Metadata = staticPageMetadata('about');

export default function Page() {
  return (
    <>
      <JsonLd id="structured-data-about" data={staticPageJsonLd('about')} />
      <About />
    </>
  );
}
