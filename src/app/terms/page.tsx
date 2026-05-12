import type { Metadata } from 'next';
import { staticPageMetadata } from '../../lib/metadata';
import Terms from '../../views/Terms';

export const metadata: Metadata = staticPageMetadata('terms');

export default function Page() {
  return <Terms />;
}
