import React from 'react';
import { useTranslation } from 'react-i18next';
import { useCurrentLocation } from '../next/navigation';
import SEO from './SEO';

interface ToolSEOCardProps {
  toolKey: string;
}

const ToolSEOCard: React.FC<ToolSEOCardProps> = ({ toolKey }) => {
  const { t } = useTranslation();
  const location = useCurrentLocation();

  const title = t(`tools.${toolKey}.seoTitle`);
  const description = t(`tools.${toolKey}.seoDesc`);

  // Check if at least the title exists to avoid rendering empty cards
  if (!title || title === `tools.${toolKey}.seoTitle`) return null;

  const toolName = t(`tools.${toolKey}.name`);
  const pathParts = location.pathname.split('/').filter(Boolean);
  
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://toolorbit.site"
      },
      ...pathParts.map((part, index) => {
        const url = `https://toolorbit.site/${pathParts.slice(0, index + 1).join('/')}`;
        let name = part;
        if (part === 'tools') name = 'Tools';
        if (index === pathParts.length - 1) name = toolName;
        
        return {
          "@type": "ListItem",
          "position": index + 2,
          "name": name,
          "item": url
        };
      })
    ]
  };

  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": toolName,
    "url": `https://toolorbit.site${location.pathname}`,
    "softwareCategory": "UtilitiesApplication",
    "operatingSystem": "Web",
    "applicationCategory": "DeveloperApplication",
    "description": description,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "120"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  // Dynamically build FAQ Schema if FAQs exist
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

  const faqSchema = faqList.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqList.map(item => ({
      "@type": "Question",
      "name": item?.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item?.answer
      }
    }))
  } : null;

  return (
    <>
      <SEO 
        title={title}
        description={description}
        schema={faqSchema ? [toolSchema, faqSchema, breadcrumbSchema] : [toolSchema, breadcrumbSchema]}
      />
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 p-8 lg:p-12 mt-8 transition-colors duration-300">
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">{title}</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
            {description}
          </p>
        </section>

        {guideList.length > 0 && (
          <section className="mb-10 p-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100/50 dark:border-blue-800/30">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-xl mb-4">{t(`tools.${toolKey}.guideTitle`, { defaultValue: 'Quick Usage Guide' })}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {guideList.map((step, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                   <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold mt-0.5">
                     {idx + 1}
                   </div>
                   <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mb-10">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-xl mb-6">{t(`tools.${toolKey}.highlightsTitle`)}</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <li key={i} className="flex flex-col gap-2 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 transition-all hover:shadow-md">
                <strong className="text-slate-900 dark:text-slate-100 font-bold block border-b border-slate-200 dark:border-slate-700 pb-2 mb-2">
                  {t(`tools.${toolKey}.highlight${i}Title`)}
                </strong>
                <span className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {t(`tools.${toolKey}.highlight${i}Desc`)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {faqList.length > 0 && (
          <section className="mt-12 border-t border-slate-100 dark:border-slate-800 pt-10">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-8">{t('common.faqTitle', { defaultValue: 'Frequently Asked Questions' })}</h3>
            <div className="space-y-6">
              {faqList.map((faq, idx) => (
                <div key={idx} className="group border-b border-slate-100 dark:border-slate-800 pb-6 last:border-0">
                  <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {faq?.question}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {faq?.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
        
        <p className="text-slate-500 dark:text-slate-500 text-sm mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 italic">
          {t(`tools.${toolKey}.disclaimer`)}
        </p>
      </div>
    </>
  );
};

export default ToolSEOCard;
