'use client';

import { notFound } from 'next/navigation';
import SiteShell from '../SiteShell';
import { toolComponentMap } from './tool-registry';

export default function ToolRoute({ path }: { path: string }) {
  const Tool = toolComponentMap[path];

  if (!Tool) {
    notFound();
  }

  return (
    <SiteShell>
      <Tool />
    </SiteShell>
  );
}
