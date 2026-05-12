import type { Metadata } from 'next';
import { staticPageMetadata } from '../../lib/metadata';
import About from '../../views/About';

export const metadata: Metadata = staticPageMetadata('about');

export default function Page() {
  return <About />;
}
