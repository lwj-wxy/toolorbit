import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { homeMetadata } from '../../lib/metadata';

export const metadata: Metadata = homeMetadata();
export const dynamic = 'force-static';
export const revalidate = false;

export default function ChineseHomePage() {
  redirect('/');
}
