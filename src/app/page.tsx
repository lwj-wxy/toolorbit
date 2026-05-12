import type { Metadata } from 'next';
import HomeRoute from '../next/routes/HomeRoute';
import { homeMetadata } from '../lib/metadata';

export const metadata: Metadata = homeMetadata();

export default function Page() {
  return <HomeRoute />;
}
