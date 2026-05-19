'use client';

import { useTranslation } from 'react-i18next';
import { Star } from 'lucide-react';
import { Link } from '../lib/navigation';
import { TOOLS } from '../data/tools';

interface RelatedToolsProps {
  currentPath: string;
}

export default function RelatedTools({ currentPath }: RelatedToolsProps) {
  const { t, i18n } = useTranslation();
  const currentTool = TOOLS.find(t => t.path === currentPath);

  if (!currentTool) return null;
  const isAiTool = currentTool.category === 'AI 工具';
  const isZh = i18n.language?.startsWith('zh');

  const related = TOOLS.filter(
    t => t.category === currentTool.category && t.id !== currentTool.id
  ).slice(0, 4);

  if (isAiTool) {
    return (
      <div className="mt-14 border-t border-slate-200/80 pt-9 dark:border-slate-800/80">
        <h3 className="mb-5 text-lg font-semibold text-slate-950 dark:text-white">
          {t('common.related_tools') || 'Related Tools'}
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {related.map(tool => (
            <Link
              key={tool.id}
              to={tool.path}
              className="flex min-h-[132px] flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-blue-300 hover:bg-blue-50/20 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700 dark:hover:bg-blue-950/20"
            >
              <div className="mb-2 flex items-center gap-3">
                <div className="rounded-md bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
                  <tool.icon size={20} />
                </div>
                <h4 className="line-clamp-1 font-semibold text-slate-950 dark:text-white">
                  {t(`tools.${tool.id}.name`, { defaultValue: tool.name })}
                </h4>
              </div>
              <p className="mt-auto line-clamp-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
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
      <h3 className="mb-5 inline-flex items-center gap-3 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
        <Star className="h-6 w-6 fill-amber-300 text-amber-400" aria-hidden="true" />
        {isZh ? '推荐工具' : (t('common.related_tools') || 'Recommended tools')}
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {related.map(tool => (
          <Link
            key={tool.id}
            to={tool.path}
            className="group flex min-h-[128px] flex-col rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm transition-colors hover:border-blue-300 hover:bg-blue-50/20 dark:border-slate-800 dark:bg-[#282c34] dark:hover:border-blue-700 dark:hover:bg-blue-950/20"
          >
            <div className="mb-2 flex items-center gap-3">
              <div className="rounded-md bg-blue-50 p-2 text-blue-600 transition-colors group-hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-300">
                <tool.icon size={20} />
              </div>
              <h4 className="line-clamp-1 font-semibold text-slate-950 dark:text-white">
                {t(`tools.${tool.id}.name`, { defaultValue: tool.name })}
              </h4>
            </div>
            <p className="mt-auto line-clamp-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              {t(`tools.${tool.id}.description`, { defaultValue: tool.description })}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
