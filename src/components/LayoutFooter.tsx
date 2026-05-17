'use client';

import { useTranslation } from 'react-i18next';
import { Link } from '../lib/navigation';
import { BRAND_PRIVACY_SUMMARY } from '../data/brand';

export default function LayoutFooter() {
  const { t } = useTranslation();

  return (
    <footer className="bg-transparent pt-8 pb-12 flex flex-col items-center justify-center text-[13px] text-slate-600 dark:text-slate-400 mt-auto relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200/50 dark:border-slate-800/50">
      <div className="flex gap-6 mb-4 font-medium">
        <Link to="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase tracking-wider">{t('common.nav_about')}</Link>
        <Link to="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase tracking-wider">{t('common.nav_privacy')}</Link>
        <Link to="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase tracking-wider">{t('common.nav_terms')}</Link>
      </div>
      <div className="text-center">
        <p>{t('common.footer_desc')}</p>
        <p className="mt-2 max-w-2xl text-xs leading-5 text-slate-500 dark:text-slate-400">
          {t('common.footer_trust', { defaultValue: BRAND_PRIVACY_SUMMARY })}
        </p>
        <p>{t('common.footerText')}</p>
      </div>
    </footer>
  );
}
