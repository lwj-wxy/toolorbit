'use client';

import dynamic from 'next/dynamic';
import Breadcrumbs from './Breadcrumbs';
import { useCurrentLocation } from '../lib/navigation';

const RelatedTools = dynamic(() => import('./RelatedTools'), { ssr: false });

interface LayoutPathEnhancementsProps {
  slot: 'before-content' | 'after-content';
}

export default function LayoutPathEnhancements({ slot }: LayoutPathEnhancementsProps) {
  const { pathname } = useCurrentLocation();
  const normalizedPathname = pathname.replace(/^\/zh-CN(?=\/|$)/i, '') || '/';
  const isToolPage = normalizedPathname.startsWith('/tools/');

  if (!isToolPage) return null;

  if (slot === 'before-content') {
    return <Breadcrumbs />;
  }

  return <RelatedTools currentPath={pathname} />;
}
