import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface BreadcrumbsProps {
  items?: { label: string; path: string }[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  const { t } = useTranslation();
  const location = useLocation();

  // If no items provided, try to generate from path
  const pathItems = items || location.pathname.split('/').filter(Boolean).map((part, index, array) => {
    const path = '/' + array.slice(0, index + 1).join('/');
    
    // Check if it's a category or a tool
    let label = part;
    if (part === 'tools') label = t('common.navTools');
    else if (part === 'dev') label = t('common.categories.开发者工具');
    else if (part === 'image') label = t('common.categories.图片处理');
    else if (part === 'pdf') label = t('common.categories.PDF工具');
    else if (part === 'ecommerce') label = t('common.categories.电商工具');
    else if (part === 'text') label = t('common.categories.文本排版');
    else if (part === 'calculate') label = t('common.categories.计算转换');
    else if (part === 'net') label = t('common.categories.站长工具');
    else if (part === 'fun') label = t('common.categories.娱乐工具');
    else {
      // Try to get tool name from i18n
      let lookupPart = part;
      if (part === 'xiaohongshu') lookupPart = 'ai-xiaohongshu';
      else if (part === 'xml-to-json') lookupPart = 'xml-json';
      else if (part === 'youtube-generator') lookupPart = 'ai-youtube-generator';
      const toolName = t(`tools.${lookupPart}.name`);
      if (toolName && toolName !== `tools.${lookupPart}.name`) {
        label = toolName;
      }
    }

    return { label, path };
  });

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
