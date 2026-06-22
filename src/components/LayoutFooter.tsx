'use client';

import { useTranslation } from 'react-i18next';
import { usePathname, useRouter } from 'next/navigation';
import { Link } from '../lib/navigation';

export default function LayoutFooter() {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname() || '/';
  const openCookiePreferences = () => {
    window.dispatchEvent(new Event('toolorbit:open-cookie-preferences'));
  };

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleContactClick = (event: React.MouseEvent) => {
    event.preventDefault();
    const onAbout = pathname === '/about' || pathname.endsWith('/about');
    if (onAbout && document.getElementById('contact')) {
      // 已在 About 页：直接滚动到联系区块
      scrollToContact();
      window.history.replaceState(null, '', `${window.location.pathname}#contact`);
    } else {
      // 在其他页：先跳转，等联系区块渲染出来再滚
      const localizedAbout = pathname.startsWith('/zh-CN') ? '/zh-CN/about' : '/about';
      router.push(`${localizedAbout}#contact`);
      let tries = 0;
      const timer = window.setInterval(() => {
        tries += 1;
        const el = document.getElementById('contact');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          window.clearInterval(timer);
        } else if (tries > 40) {
          window.clearInterval(timer);
        }
      }, 50);
    }
  };

  return (
    <footer className="relative z-10 mx-auto mt-auto flex w-full max-w-7xl flex-col items-center justify-center border-t border-slate-200/80 bg-transparent px-4 pb-10 pt-7 text-[13px] text-slate-600 dark:border-slate-800/80 dark:text-slate-400 sm:px-6 lg:px-8">
      <div className="mb-4 flex gap-6 font-medium">
        <Link to="/about" className="uppercase tracking-wide transition-colors hover:text-blue-600 dark:hover:text-blue-400">{t('common.nav_about')}</Link>
        <a href="/about#contact" onClick={handleContactClick} className="uppercase tracking-wide transition-colors hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">{t('common.nav_contact', { defaultValue: 'Contact' })}</a>
        <Link to="/privacy" className="uppercase tracking-wide transition-colors hover:text-blue-600 dark:hover:text-blue-400">{t('common.nav_privacy')}</Link>
        <Link to="/terms" className="uppercase tracking-wide transition-colors hover:text-blue-600 dark:hover:text-blue-400">{t('common.nav_terms')}</Link>
        <button
          type="button"
          onClick={openCookiePreferences}
          className="uppercase tracking-wide transition-colors hover:text-blue-600 dark:hover:text-blue-400"
        >
          {t('cookieConsent.footerLink', { defaultValue: 'Cookie settings' })}
        </button>
      </div>
      <div className="flex flex-col items-center gap-2">
        <p className="text-center text-sm leading-6 text-slate-600 dark:text-slate-400">{t('common.footer_desc')}</p>
        <p className="text-slate-500 dark:text-slate-400">{t('common.footerText')}</p>
      </div>
    </footer>
  );
}
