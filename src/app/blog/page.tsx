import type { Metadata } from 'next';
import { blogListMetadata } from '../../lib/metadata';
import BlogList from '../../views/BlogList';

export const metadata: Metadata = blogListMetadata();

export default function Page() {
  return <BlogList />;
}
