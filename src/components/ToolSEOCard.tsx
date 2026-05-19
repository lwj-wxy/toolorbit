'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

interface ToolSEOCardProps {
  toolKey: string;
}

const ToolSEOCard: React.FC<ToolSEOCardProps> = ({ toolKey }) => {
  const { t } = useTranslation();

  const title = t(`tools.${toolKey}.seoTitle`);
  const description = t(`tools.${toolKey}.seoDesc`);

  // Check if at least the title exists to avoid rendering empty cards
  if (!title || title === `tools.${toolKey}.seoTitle`) return null;

  // Dynamically build FAQ content if FAQs exist
  const faqList = [1, 2, 3].map(i => {
    const question = t(`tools.${toolKey}.faq${i}Q`);
    const answer = t(`tools.${toolKey}.faq${i}A`);
    if (question && question !== `tools.${toolKey}.faq${i}Q`) {
      return { question, answer };
    }
    return null;
  }).filter(Boolean);

  const guideList = [1, 2, 3, 4].map(i => {
    const step = t(`tools.${toolKey}.guide${i}`);
    if (step && step !== `tools.${toolKey}.guide${i}`) {
      return step;
    }
    return null;
  }).filter(Boolean);

  return (
    <>
      <div className="mt-10 border-t border-slate-200 pt-10 transition-colors duration-300 dark:border-slate-800">
        <section className="mb-9 max-w-4xl">
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">
            {t('toolGuide.label', { defaultValue: 'Tool guide' })}
          </p>
          <h2 className="mb-4 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">{title}</h2>
          <p className="text-[15px] leading-7 text-slate-600 dark:text-slate-400">
            {description}
          </p>
        </section>

        {guideList.length > 0 && (
          <section className="mb-9 border-y border-blue-100 bg-blue-50/40 py-6 dark:border-blue-950 dark:bg-blue-950/20">
            <h3 className="mb-4 text-lg font-semibold text-slate-950 dark:text-white">{t(`tools.${toolKey}.guideTitle`, { defaultValue: 'Quick Usage Guide' })}</h3>
            <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
              {guideList.map((step, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                   <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-blue-600 text-xs font-semibold text-white">
                     {idx + 1}
                   </div>
                   <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">{step}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mb-9">
          <h3 className="mb-5 text-lg font-semibold text-slate-950 dark:text-white">{t(`tools.${toolKey}.highlightsTitle`)}</h3>
          <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <li key={i} className="border-l-2 border-slate-200 pl-4 dark:border-slate-800">
                <strong className="block font-semibold text-slate-950 dark:text-white">
                  {t(`tools.${toolKey}.highlight${i}Title`)}
                </strong>
                <span className="mt-2 block text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {t(`tools.${toolKey}.highlight${i}Desc`)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {faqList.length > 0 && (
          <section className="mt-10 border-t border-slate-200 pt-9 dark:border-slate-800">
            <h3 className="mb-6 text-lg font-semibold text-slate-950 dark:text-white">{t('common.faqTitle', { defaultValue: 'Frequently Asked Questions' })}</h3>
            <div className="space-y-5">
              {faqList.map((faq, idx) => (
                <div key={idx} className="group border-b border-slate-200 pb-5 last:border-0 dark:border-slate-800">
                  <h4 className="mb-2 text-base font-semibold text-slate-950 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                    {faq?.question}
                  </h4>
                  <p className="leading-7 text-slate-600 dark:text-slate-400">
                    {faq?.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
        
        <p className="mt-8 border-t border-slate-200 pt-6 text-sm leading-6 text-slate-500 dark:border-slate-800 dark:text-slate-400">
          {t(`tools.${toolKey}.disclaimer`)}
        </p>
      </div>
    </>
  );
};

export default ToolSEOCard;
