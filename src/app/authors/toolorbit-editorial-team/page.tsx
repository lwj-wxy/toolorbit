import type { Metadata } from 'next';
import JsonLd from '../../../components/JsonLd';
import { authorMetadata } from '../../../lib/metadata';
import { authorPageJsonLd } from '../../../lib/structured-data';
import AuthorPage from '../../../views/AuthorPage';

export const revalidate = 86400;
export const metadata: Metadata = authorMetadata();

export default function Page() {
  return (
    <>
      <JsonLd id="structured-data-author-toolorbit-editorial-team" data={authorPageJsonLd()} />
      <AuthorPage />
    </>
  );
}

