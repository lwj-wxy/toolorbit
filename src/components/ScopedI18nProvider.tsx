'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import type { I18nLanguage } from '../lib/i18n-routing';

export default function ScopedI18nProvider({
  language,
  children,
}: {
  language: I18nLanguage;
  children: ReactNode;
}) {
  const [instance] = useState(() =>
    i18n.cloneInstance({
      lng: language,
      fallbackLng: 'en',
    }),
  );

  useEffect(() => {
    instance.changeLanguage(language);
  }, [instance, language]);

  return <I18nextProvider i18n={instance}>{children}</I18nextProvider>;
}
