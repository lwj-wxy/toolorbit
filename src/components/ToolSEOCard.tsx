import React from 'react';
import { useTranslation } from 'react-i18next';

interface ToolSEOCardProps {
  toolKey: string;
}

const ToolSEOCard: React.FC<ToolSEOCardProps> = ({ toolKey }) => {
  const { t } = useTranslation();

  // Check if at least the title exists to avoid rendering empty cards
  const title = t(`tools.${toolKey}.seoTitle`);
  if (!title || title === `tools.${toolKey}.seoTitle`) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8 lg:p-12 mt-8">
      <h2 className="text-xl font-bold text-slate-800 mb-6">{t(`tools.${toolKey}.seoTitle`)}</h2>
      
      <p className="text-slate-600 mb-6 leading-relaxed">
        {t(`tools.${toolKey}.seoDesc`)}
      </p>

      <h3 className="font-bold text-slate-800 text-lg mb-4">{t(`tools.${toolKey}.highlightsTitle`)}</h3>
      <ul className="space-y-4 text-slate-600">
        <li className="flex gap-3">
          <strong className="text-slate-800 shrink-0">{t(`tools.${toolKey}.highlight1Title`)}</strong>
          <span>{t(`tools.${toolKey}.highlight1Desc`)}</span>
        </li>
        <li className="flex gap-3">
          <strong className="text-slate-800 shrink-0">{t(`tools.${toolKey}.highlight2Title`)}</strong>
          <span>{t(`tools.${toolKey}.highlight2Desc`)}</span>
        </li>
        <li className="flex gap-3">
          <strong className="text-slate-800 shrink-0">{t(`tools.${toolKey}.highlight3Title`)}</strong>
          <span>{t(`tools.${toolKey}.highlight3Desc`)}</span>
        </li>
      </ul>
      
      <p className="text-slate-500 text-sm mt-8 pt-6 border-t border-slate-100">
        {t(`tools.${toolKey}.disclaimer`)}
      </p>
    </div>
  );
};

export default ToolSEOCard;
