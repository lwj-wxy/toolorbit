'use client';

import React from 'react';
import { Link, useCurrentLocation } from '../lib/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TOOLS_META } from '../data/tools-meta';
import { CATEGORY_BY_SLUG, getCategoryPath } from '../lib/category-paths';
import { getToolSectionCategory } from '../lib/tool-section-paths';

interface BreadcrumbsProps {
  items?: { label: string; path: string }[];
}

const TOOL_ID_BY_SLUG: Record<string, string> = {
  xiaohongshu: 'ai-xiaohongshu',
  'xml-to-json': 'xml-json',
  'youtube-generator': 'ai-youtube-generator',
  'prompt-generator': 'ai-prompt-generator',
  'video-script': 'ai-video-script',
  'resume-optimizer': 'ai-resume-optimizer',
  'excel-formula': 'ai-excel-formula',
  regex: 'ai-regex',
  'image-generator': 'ai-image-generator',
  'svg-generator': 'ai-svg-generator',
  'text-polisher': 'ai-text-polisher',
  translator: 'ai-translator',
};

function normalizePathname(pathname: string) {
  return pathname.replace(/^\/zh-CN(?=\/|$)/i, '') || '/';
}

function titleFromSlug(slug: string) {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  const { t } = useTranslation();
  const location = useCurrentLocation();

  const pathItems = React.useMemo(() => {
    if (items) return items;

    const normalizedPathname = normalizePathname(location.pathname);
    const parts = normalizedPathname.split('/').filter(Boolean);

    if (parts[0] === 'tools' && parts[1] && parts[2]) {
      const currentTool = TOOLS_META.find((tool) => tool.path === normalizedPathname);
      const category = currentTool?.category || getToolSectionCategory(parts[1]);
      const toolId = TOOL_ID_BY_SLUG[parts[2]] || parts[2];
      const toolName = t(`tools.${toolId}.name`, { defaultValue: titleFromSlug(parts[2]) });

      return [
        ...(category
          ? [
              {
                label: t(`common.categories.${category}`, { defaultValue: category }),
                path: getCategoryPath(category),
              },
            ]
          : []),
        { label: toolName, path: normalizedPathname },
      ];
    }

    if (parts[0] === 'category' && parts[1]) {
      const category = CATEGORY_BY_SLUG[parts[1]];
      return [
        {
          label: category ? t(`common.categories.${category}`, { defaultValue: category }) : titleFromSlug(parts[1]),
          path: normalizedPathname,
        },
      ];
    }

    return parts.map((part, index, array) => {
      const path = '/' + array.slice(0, index + 1).join('/');
      return { label: titleFromSlug(part), path };
    });
  }, [items, location.pathname, t]);

  return (
    <nav className="flex mb-6 overflow-hidden" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 text-sm text-slate-500 dark:text-slate-400">
        <li className="inline-flex items-center">
          <Link to="/" className="inline-flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            <Home className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">{t('common.nav_home')}</span>
          </Link>
        </li>
        {pathItems.map((item, index) => (
          <li key={item.path} className="flex items-center">
            <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 mx-1 shrink-0" />
            {index === pathItems.length - 1 ? (
              <span className="font-medium text-slate-900 dark:text-white truncate max-w-[200px]" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link to={item.path} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
