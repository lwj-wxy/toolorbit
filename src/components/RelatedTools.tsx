'use client';

import { useTranslation } from 'react-i18next';
import { Link } from '../lib/navigation';
import { TOOLS } from '../data/tools';

interface RelatedToolsProps {
  currentPath: string;
}

export default function RelatedTools({ currentPath }: RelatedToolsProps) {
  const { t } = useTranslation();
  const currentTool = TOOLS.find(t => t.path === currentPath);

  if (!currentTool) return null;

  const related = TOOLS.filter(
    t => t.category === currentTool.category && t.id !== currentTool.id
  ).slice(0, 4);

  return (
    <div className="mt-16 pt-12 border-t border-slate-200/60 dark:border-slate-800/60">
      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">
        {t('common.related_tools') || 'Related Tools'}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {related.map(tool => (
          <Link
            key={tool.id}
            to={tool.path}
            className="flex flex-col p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                <tool.icon size={20} />
              </div>
              <h4 className="font-bold text-slate-800 dark:text-slate-200">
                {t(`tools.${tool.id}.name`, { defaultValue: tool.name })}
              </h4>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mt-auto">
              {t(`tools.${tool.id}.description`, { defaultValue: tool.description })}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
