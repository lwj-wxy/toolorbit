import type { Metadata } from 'next';
import JsonLd from '../../../components/JsonLd';
import { LUO_WJ_AUTHOR } from '../../../data/authors';
import { authorMetadata } from '../../../lib/metadata';
import { authorPageJsonLd } from '../../../lib/structured-data';
import AuthorPage from '../../../views/AuthorPage';

export const revalidate = 86400;
export const metadata: Metadata = authorMetadata(LUO_WJ_AUTHOR.id);

export default function Page() {
  return (
    <>
      <JsonLd id="structured-data-author-luo-wj" data={authorPageJsonLd(LUO_WJ_AUTHOR.id)} />
      <AuthorPage authorId={LUO_WJ_AUTHOR.id} />
    </>
  );
}
