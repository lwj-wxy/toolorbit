import type { Metadata } from 'next';
import JsonLd from '../components/JsonLd';
import { homeMetadata } from '../lib/metadata';
import { homePageJsonLd } from '../lib/structured-data';
import Home from '../views/Home';

export const metadata: Metadata = homeMetadata();
export const revalidate = 3600;

export default function Page() {
  return (
    <>
      <JsonLd id="structured-data-home" data={homePageJsonLd()} />
      <Home />
    </>
  );
}
