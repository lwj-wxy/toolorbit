'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Star } from 'lucide-react';
import { Link } from '../lib/navigation';
import { TOOLS } from '../data/tools';
import { getRandomRelatedTools } from '../lib/related-tools';

interface RelatedToolsProps {
  currentPath: string;
}

export default function RelatedTools({ currentPath }: RelatedToolsProps) {
  const { t, i18n } = useTranslation();
  const currentTool = TOOLS.find((tool) => tool.path === currentPath);
  const related = useMemo(
    () => (currentTool ? getRandomRelatedTools(TOOLS, currentTool, 4) : []),
    [currentTool?.id],
  );

  if (!currentTool) return null;
  const isAiTool = currentTool.category === 'AI 工具';
  const isZh = i18n.language?.startsWith('zh');

  if (isAiTool) {
    return (
      <div className="mt-14 border-t border-[var(--app-border)] pt-9">
        <h3 className="mb-5 text-lg font-semibold text-[var(--app-text)]">
          {t('common.related_tools') || 'Related Tools'}
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {related.map(tool => (
            <Link
              key={tool.id}
              to={tool.path}
              className="flex min-h-[132px] flex-col rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-4 shadow-[var(--app-shadow-sm)] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-[var(--app-accent)] hover:shadow-[var(--app-shadow-md)]"
            >
              <div className="mb-2 flex items-center gap-3">
                <div className="rounded-xl bg-[var(--app-accent-soft)] p-2 text-[var(--app-accent-ink)]">
                  <tool.icon size={20} />
                </div>
                <h4 className="line-clamp-1 font-semibold text-[var(--app-text)]">
                  {t(`tools.${tool.id}.name`, { defaultValue: tool.name })}
                </h4>
              </div>
              <p className="mt-auto line-clamp-2 text-sm leading-6 text-[var(--app-muted)]">
                {t(`tools.${tool.id}.description`, { defaultValue: tool.description })}
              </p>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="mt-10">
      <h3 className="mb-5 inline-flex items-center gap-3 text-xl font-semibold tracking-tight text-[var(--app-text)]">
        <Star className="h-6 w-6 fill-amber-300 text-amber-400" aria-hidden="true" />
        {isZh ? '推荐工具' : (t('common.related_tools') || 'Recommended tools')}
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {related.map(tool => (
          <Link
            key={tool.id}
            to={tool.path}
            className="group flex min-h-[128px] flex-col rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-4 shadow-[var(--app-shadow-sm)] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-[var(--app-accent)] hover:shadow-[var(--app-shadow-md)]"
          >
            <div className="mb-2 flex items-center gap-3">
              <div className="rounded-xl bg-[var(--app-accent-soft)] p-2 text-[var(--app-accent-ink)] transition-transform duration-200 group-hover:scale-105">
                <tool.icon size={20} />
              </div>
              <h4 className="line-clamp-1 font-semibold text-[var(--app-text)]">
                {t(`tools.${tool.id}.name`, { defaultValue: tool.name })}
              </h4>
            </div>
            <p className="mt-auto line-clamp-2 text-sm leading-6 text-[var(--app-muted)]">
              {t(`tools.${tool.id}.description`, { defaultValue: tool.description })}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
