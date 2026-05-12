import type { Metadata } from 'next';
import BlogListRoute from '../../next/routes/BlogListRoute';
import { blogListMetadata } from '../../lib/metadata';

export const metadata: Metadata = blogListMetadata();

export default function Page() {
  return <BlogListRoute />;
}
