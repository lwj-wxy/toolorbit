import type { Metadata } from 'next';
import JsonLd from '../../components/JsonLd';
import { blogListMetadata } from '../../lib/metadata';
import { blogListJsonLd } from '../../lib/structured-data';
import BlogList from '../../views/BlogList';

export const metadata: Metadata = blogListMetadata();
export const revalidate = 3600;

export default function Page() {
  return (
    <>
      <JsonLd id="structured-data-blog-list" data={blogListJsonLd()} />
      <BlogList />
    </>
  );
}
