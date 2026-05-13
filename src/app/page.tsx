import type { Metadata } from 'next';
import { homeMetadata } from '../lib/metadata';
import Home from '../views/Home';

export const metadata: Metadata = homeMetadata();

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const initialSearchParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    if (typeof value === 'string') {
      initialSearchParams.set(key, value);
      return;
    }

    value?.forEach(item => {
      initialSearchParams.append(key, item);
    });
  });

  return <Home initialSearch={initialSearchParams.toString()} />;
}
