'use client';

import { useTranslation } from 'react-i18next';

export default function Terms() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-4xl py-4">
      <div>
        <div>
          <h1 className="mb-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{t('terms.title')}</h1>
          <p className="mb-8 border-b border-slate-200 pb-8 text-slate-500 dark:border-slate-800 dark:text-slate-400">{t('terms.lastUpdated')}</p>
          <div 
            className="prose prose-slate max-w-none prose-headings:text-slate-950 prose-headings:font-semibold prose-p:leading-7 prose-a:text-blue-600 dark:prose-invert dark:prose-headings:text-white"
            dangerouslySetInnerHTML={{ __html: t('terms.content') }} 
          />
        </div>
      </div>
    </div>
  );
}
