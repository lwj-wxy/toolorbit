'use client';

import { toolComponentMap } from '../lib/tool-components';

type ToolPageClientProps = {
  path: string;
  hideHeader?: boolean;
};

export default function ToolPageClient({ path, hideHeader = false }: ToolPageClientProps) {
  const Tool = toolComponentMap[path];

  if (!Tool) {
    return null;
  }

  return (
    <div translate="no" className="contents">
      <Tool hideHeader={hideHeader} />
    </div>
  );
}
