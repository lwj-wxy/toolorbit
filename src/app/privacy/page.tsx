import type { Metadata } from 'next';
import { staticPageMetadata } from '../../lib/metadata';
import Privacy from '../../views/Privacy';

export const metadata: Metadata = staticPageMetadata('privacy');

export default function Page() {
  return <Privacy />;
}
