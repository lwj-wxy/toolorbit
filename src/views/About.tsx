'use client';

import { useTranslation } from 'react-i18next';

export default function About() {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8 md:p-12">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-8 pb-8 border-b border-slate-100">{t('about.title')}</h1>
          <div 
            className="prose prose-slate max-w-none prose-headings:text-slate-800"
            dangerouslySetInnerHTML={{ __html: t('about.content') }} 
          />
        </div>
      </div>
    </div>
  );
}
