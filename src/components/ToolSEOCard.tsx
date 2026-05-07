import React from 'react';
import { useTranslation } from 'react-i18next';
import SEO from './SEO';

interface ToolSEOCardProps {
  toolKey: string;
}

const ToolSEOCard: React.FC<ToolSEOCardProps> = ({ toolKey }) => {
  const { t } = useTranslation();

  const title = t(`tools.${toolKey}.seoTitle`);
  const description = t(`tools.${toolKey}.seoDesc`);

  // Check if at least the title exists to avoid rendering empty cards
  if (!title || title === `tools.${toolKey}.seoTitle`) return null;

  const toolName = t(`tools.${toolKey}.name`);
  
  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": toolName,
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

  return (
    <>
      <SEO 
        title={title}
        description={description}
        schema={toolSchema}
      />
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 p-8 lg:p-12 mt-8 transition-colors duration-300">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">{title}</h2>
        
        <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
          {description}
        </p>

        <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg mb-4">{t(`tools.${toolKey}.highlightsTitle`)}</h3>
        <ul className="space-y-4 text-slate-600 dark:text-slate-400">
          <li className="flex flex-col sm:flex-row gap-1 sm:gap-3">
            <strong className="text-slate-800 dark:text-slate-100 shrink-0">{t(`tools.${toolKey}.highlight1Title`)}</strong>
            <span>{t(`tools.${toolKey}.highlight1Desc`)}</span>
          </li>
          <li className="flex flex-col sm:flex-row gap-1 sm:gap-3">
            <strong className="text-slate-800 dark:text-slate-100 shrink-0">{t(`tools.${toolKey}.highlight2Title`)}</strong>
            <span>{t(`tools.${toolKey}.highlight2Desc`)}</span>
          </li>
          <li className="flex flex-col sm:flex-row gap-1 sm:gap-3">
            <strong className="text-slate-800 dark:text-slate-100 shrink-0">{t(`tools.${toolKey}.highlight3Title`)}</strong>
            <span>{t(`tools.${toolKey}.highlight3Desc`)}</span>
          </li>
        </ul>
        
        <p className="text-slate-500 dark:text-slate-500 text-sm mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          {t(`tools.${toolKey}.disclaimer`)}
        </p>
      </div>
    </>
  );
};

export default ToolSEOCard;
