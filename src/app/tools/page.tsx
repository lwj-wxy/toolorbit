import type { Metadata } from 'next';
import JsonLd from '../../components/JsonLd';
import { allToolsMetadata } from '../../lib/metadata';
import { allToolsPageJsonLd } from '../../lib/structured-data';
import AllToolsPage from '../../views/AllToolsPage';

export const revalidate = 86400;

export const metadata: Metadata = allToolsMetadata();

export default function Page() {
  return (
    <>
      <JsonLd id="structured-data-all-tools" data={allToolsPageJsonLd()} />
      <AllToolsPage />
    </>
  );
}
