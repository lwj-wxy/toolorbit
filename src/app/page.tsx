import type { Metadata } from 'next';
import { homeMetadata } from '../lib/metadata';
import Home from '../views/Home';

export const metadata: Metadata = homeMetadata();
export const revalidate = 3600;

export default function Page() {
  return <Home />;
}
