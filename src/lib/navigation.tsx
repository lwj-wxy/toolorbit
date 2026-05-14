'use client';

import NextLink from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { ComponentProps } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { detectLocaleFromPathname, localizedPath, shouldLocalizeHref } from './i18n-routing';

type LinkProps = Omit<ComponentProps<typeof NextLink>, 'href'> & {
  href?: ComponentProps<typeof NextLink>['href'];
  to?: ComponentProps<typeof NextLink>['href'];
};

export function Link({ href, to, onClick, ...props }: LinkProps) {
  const pathname = usePathname() || '/';
  const target = href ?? to ?? '/';
  const targetHref =
    typeof target === 'string' && shouldLocalizeHref(target)
      ? localizedPath(target, detectLocaleFromPathname(pathname))
      : target;

  const handleClick: NonNullable<LinkProps['onClick']> = (event) => {
    onClick?.(event);
    if (event.defaultPrevented || typeof window === 'undefined') return;

    if (typeof targetHref === 'string' || targetHref instanceof URL) {
      const nextUrl = new URL(String(targetHref), window.location.origin);
      window.dispatchEvent(new CustomEvent('toolorbit:searchchange', { detail: nextUrl.search }));
    }
  };

  return <NextLink href={targetHref} onClick={handleClick} {...props} />;
}

export function useCurrentLocation(initialSearch = '') {
  const pathname = usePathname() || '/';
  const [search, setSearch] = useState(initialSearch);

  useEffect(() => {
    setSearch(window.location.search);
  }, [pathname]);

  useEffect(() => {
    const syncSearch = (event?: Event) => {
      if (event instanceof CustomEvent && typeof event.detail === 'string') {
        setSearch(event.detail);
        return;
      }
      setSearch(window.location.search);
    };

    window.addEventListener('popstate', syncSearch);
    window.addEventListener('toolorbit:searchchange', syncSearch);
    return () => {
      window.removeEventListener('popstate', syncSearch);
      window.removeEventListener('toolorbit:searchchange', syncSearch);
    };
  }, []);

  return useMemo(() => ({ pathname, search, hash: '' }), [pathname, search]);
}

export function useClientSearchParams(): [
  URLSearchParams,
  (next: URLSearchParams | Record<string, string> | string) => void,
] {
  return useClientSearchParamsWithInitialSearch('');
}

export function useClientSearchParamsWithInitialSearch(initialSearch: string): [
  URLSearchParams,
  (next: URLSearchParams | Record<string, string> | string) => void,
] {
  const router = useRouter();
  const { pathname, search } = useCurrentLocation(initialSearch);
  const params = useMemo(() => new URLSearchParams(search), [search]);

  const setParams = (next: URLSearchParams | Record<string, string> | string) => {
    const nextParams =
      typeof next === 'string'
        ? new URLSearchParams(next)
        : next instanceof URLSearchParams
          ? next
          : new URLSearchParams(next);
    const query = nextParams.toString();
    const nextSearch = query ? `?${query}` : '';
    router.push(query ? `${pathname}?${query}` : pathname);
    window.dispatchEvent(new CustomEvent('toolorbit:searchchange', { detail: nextSearch }));
  };

  return [params, setParams];
}
