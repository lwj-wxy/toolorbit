'use client';

import { useEffect, useRef, type FormEvent, type MouseEvent } from 'react';
import { toolComponentMap } from '../lib/tool-components';
import { analytics } from '../services/analytics';

type ToolPageClientProps = {
  path: string;
  hideHeader?: boolean;
};

export default function ToolPageClient({ path, hideHeader = false }: ToolPageClientProps) {
  const Tool = toolComponentMap[path];
  const hasTrackedInput = useRef(false);

  useEffect(() => {
    hasTrackedInput.current = false;
    analytics.trackEvent({
      category: 'Tool',
      action: 'tool_opened',
      label: path,
      metadata: { tool_path: path },
    });
  }, [path]);

  const handleInputCapture = (event: FormEvent<HTMLDivElement>) => {
    if (hasTrackedInput.current) return;

    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement || target instanceof HTMLTextAreaElement)) {
      return;
    }

    hasTrackedInput.current = true;
    analytics.trackEvent({
      category: 'Tool',
      action: 'tool_input_started',
      label: path,
      metadata: {
        tool_path: path,
        input_type: target.type || target.tagName.toLowerCase(),
      },
    });
  };

  const handleClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const actionElement = target.closest<HTMLElement>('[data-analytics-action]');
    const action = actionElement?.dataset.analyticsAction;
    if (!action || !actionElement || !event.currentTarget.contains(actionElement)) return;

    analytics.trackEvent({
      category: 'Tool',
      action: `tool_${action}`,
      label: path,
      metadata: { tool_path: path },
    });
  };

  if (!Tool) {
    return null;
  }

  return (
    <div translate="no" className="contents" data-tool-path={path} onInputCapture={handleInputCapture} onClickCapture={handleClickCapture}>
      <Tool hideHeader={hideHeader} />
    </div>
  );
}
