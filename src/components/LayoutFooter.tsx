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
      router.push('/about#contact');
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
    <footer className="relative z-10 mt-auto border-t border-[var(--app-border)] bg-[var(--app-bg-soft)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-5 px-4 pb-10 pt-9 text-[13px] text-[var(--app-muted)] sm:px-6 lg:px-8">
        <Link
          to="/"
          className="group flex items-center gap-2 text-[15px] font-bold tracking-tight text-[var(--app-text)] transition-colors hover:text-[var(--app-accent-ink)]"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[linear-gradient(135deg,var(--app-accent),var(--app-accent-warm))] text-[11px] font-bold text-white shadow-[0_4px_12px_-2px_color-mix(in_srgb,var(--app-accent)_55%,transparent)]">
            TO
          </span>
          {t('common.logoName')}
        </Link>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-medium">
          <Link to="/about" className="uppercase tracking-wide transition-colors hover:text-[var(--app-accent-ink)]">{t('common.nav_about')}</Link>
          <a href="/about#contact" onClick={handleContactClick} className="cursor-pointer uppercase tracking-wide transition-colors hover:text-[var(--app-accent-ink)]">{t('common.nav_contact', { defaultValue: 'Contact' })}</a>
          <Link to="/privacy" className="uppercase tracking-wide transition-colors hover:text-[var(--app-accent-ink)]">{t('common.nav_privacy')}</Link>
          <Link to="/terms" className="uppercase tracking-wide transition-colors hover:text-[var(--app-accent-ink)]">{t('common.nav_terms')}</Link>
          <button
            type="button"
            onClick={openCookiePreferences}
            className="uppercase tracking-wide transition-colors hover:text-[var(--app-accent-ink)]"
          >
            {t('cookieConsent.footerLink', { defaultValue: 'Cookie settings' })}
          </button>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <p className="max-w-2xl text-center text-sm leading-6 text-[var(--app-muted)]">{t('common.footer_desc')}</p>
          <p className="text-[var(--app-muted)]">{t('common.footerText')}</p>
        </div>
      </div>
    </footer>
  );
}
