'use client';

import { toolComponentMap } from '../lib/tool-components';

export default function ToolPageClient({ path }: { path: string }) {
  const Tool = toolComponentMap[path];

  if (!Tool) {
    return null;
  }

  return <Tool />;
}
