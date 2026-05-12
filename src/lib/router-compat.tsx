'use client';

import React, { Children, isValidElement, useEffect, useMemo, useState } from 'react';
import NextLink from 'next/link';
import { useParams as useNextParams, usePathname, useRouter } from 'next/navigation';

type LinkProps = Omit<React.ComponentProps<typeof NextLink>, 'href'> & {
  to?: string;
  href?: string;
};

export function Link({ to, href, ...props }: LinkProps) {
  return <NextLink href={href || to || '/'} {...props} />;
}

export function BrowserRouter({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function useLocation() {
  const pathname = usePathname() || '/';
  const [search, setSearch] = useState('');

  useEffect(() => {
    setSearch(window.location.search);
  }, [pathname]);

  return {
    pathname,
    search,
    hash: '',
    state: null,
    key: pathname,
  };
}

export function useSearchParams(): [URLSearchParams, (next: URLSearchParams | Record<string, string> | string) => void] {
  const router = useRouter();
  const pathname = usePathname() || '/';
  const [search, setSearch] = useState('');

  useEffect(() => {
    setSearch(window.location.search);
  }, [pathname]);

  const params = useMemo(() => new URLSearchParams(search), [search]);

  const setSearchParams = (next: URLSearchParams | Record<string, string> | string) => {
    const value = typeof next === 'string'
      ? next
      : next instanceof URLSearchParams
        ? next.toString()
        : new URLSearchParams(next).toString();

    setSearch(value ? `?${value}` : '');
    router.push(value ? `${pathname}?${value}` : pathname);
  };

  return [params, setSearchParams];
}

export function useParams<T extends Record<string, string | string[] | undefined> = Record<string, string | string[] | undefined>>() {
  const pathname = usePathname() || '/';
  const params = useNextParams();
  const blogMatch = pathname.match(/^\/blog\/([^/]+)/);

  if (blogMatch) {
    return { ...params, slug: decodeURIComponent(blogMatch[1]) } as unknown as T;
  }

  return params as unknown as T;
}

function matchPath(pattern: string | undefined, pathname: string) {
  if (!pattern) return false;
  if (pattern === '*') return true;
  if (pattern === pathname) return true;

  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = pathname.split('/').filter(Boolean);

  if (patternParts.length !== pathParts.length) return false;

  return patternParts.every((part, index) => part.startsWith(':') || part === pathParts[index]);
}

export function Routes({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const routes = Children.toArray(children);
  const fallback = routes.find((child) => isValidElement(child) && (child.props as { path?: string }).path === '*');
  const route = routes.find((child) => isValidElement(child) && matchPath((child.props as { path?: string }).path, pathname));

  if (isValidElement(route)) return (route.props as { element?: React.ReactNode }).element;
  if (isValidElement(fallback)) return (fallback.props as { element?: React.ReactNode }).element;

  return null;
}

export function Route(_props: { path?: string; element?: React.ReactNode }) {
  return null;
}

export function Navigate({ to, replace = false }: { to: string; replace?: boolean }) {
  const router = useRouter();

  useEffect(() => {
    if (replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  }, [replace, router, to]);

  return null;
}
