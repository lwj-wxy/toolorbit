'use client';

import { useTranslation } from 'react-i18next';
import { Link } from '../lib/navigation';

export default function LayoutFooter() {
  const { t } = useTranslation();

  return (
    <footer className="relative z-10 mx-auto mt-auto flex w-full max-w-7xl flex-col items-center justify-center border-t border-slate-200/80 bg-transparent px-4 pb-10 pt-7 text-[13px] text-slate-600 dark:border-slate-800/80 dark:text-slate-400 sm:px-6 lg:px-8">
      <div className="mb-4 flex gap-6 font-medium">
        <Link to="/about" className="uppercase tracking-wide transition-colors hover:text-blue-600 dark:hover:text-blue-400">{t('common.nav_about')}</Link>
        <Link to="/privacy" className="uppercase tracking-wide transition-colors hover:text-blue-600 dark:hover:text-blue-400">{t('common.nav_privacy')}</Link>
        <Link to="/terms" className="uppercase tracking-wide transition-colors hover:text-blue-600 dark:hover:text-blue-400">{t('common.nav_terms')}</Link>
      </div>
      <div className="flex flex-col items-center gap-2">
        <p className="text-center text-sm leading-6 text-slate-600 dark:text-slate-400">{t('common.footer_desc')}</p>
        <p className="text-slate-500 dark:text-slate-400">{t('common.footerText')}</p>
      </div>
    </footer>
  );
}
