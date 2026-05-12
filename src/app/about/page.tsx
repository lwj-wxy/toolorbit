import type { Metadata } from 'next';
import { staticPageMetadata } from '../../lib/metadata';
import StaticPageRoute from '../../next/routes/StaticPageRoute';

export const metadata: Metadata = staticPageMetadata('about');

export default function Page() {
  return <StaticPageRoute page="about" />;
}
