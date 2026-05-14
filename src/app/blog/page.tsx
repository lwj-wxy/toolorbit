import type { Metadata } from 'next';
import { blogListMetadata } from '../../lib/metadata';
import BlogList from '../../views/BlogList';

export const metadata: Metadata = blogListMetadata();
export const revalidate = 3600;

export default function Page() {
  return <BlogList />;
}
