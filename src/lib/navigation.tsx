'use client';

import NextLink from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { ComponentProps } from 'react';
import { useEffect, useMemo, useState } from 'react';

type LinkProps = Omit<ComponentProps<typeof NextLink>, 'href'> & {
  href?: ComponentProps<typeof NextLink>['href'];
  to?: ComponentProps<typeof NextLink>['href'];
};

export function Link({ href, to, ...props }: LinkProps) {
  return <NextLink href={href ?? to ?? '/'} {...props} />;
}

export function useCurrentLocation() {
  const pathname = usePathname() || '/';
  const [search, setSearch] = useState('');

  useEffect(() => {
    setSearch(window.location.search);
  }, [pathname]);

  return useMemo(() => ({ pathname, search, hash: '' }), [pathname, search]);
}

export function useClientSearchParams(): [
  URLSearchParams,
  (next: URLSearchParams | Record<string, string> | string) => void,
] {
  const router = useRouter();
  const { pathname, search } = useCurrentLocation();
  const params = useMemo(() => new URLSearchParams(search), [search]);

  const setParams = (next: URLSearchParams | Record<string, string> | string) => {
    const nextParams =
      typeof next === 'string'
        ? new URLSearchParams(next)
        : next instanceof URLSearchParams
          ? next
          : new URLSearchParams(next);
    const query = nextParams.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  return [params, setParams];
}
