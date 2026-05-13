import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { categoryMetadata } from '../../../lib/metadata';
import { CATEGORY_BY_SLUG, CATEGORY_SLUGS } from '../../../lib/category-paths';
import Home from '../../../views/Home';

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export function generateStaticParams() {
  return Object.values(CATEGORY_SLUGS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = CATEGORY_BY_SLUG[slug];

  if (!category) {
    return {};
  }

  return categoryMetadata(category);
}

export default async function Page({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const category = CATEGORY_BY_SLUG[slug];

  if (!category) {
    notFound();
  }

  const paramsValue = await searchParams;
  const initialSearchParams = new URLSearchParams();

  Object.entries(paramsValue || {}).forEach(([key, value]) => {
    if (typeof value === 'string') {
      initialSearchParams.set(key, value);
      return;
    }

    value?.forEach((item) => {
      initialSearchParams.append(key, item);
    });
  });

  return <Home initialSearch={initialSearchParams.toString()} initialCategory={category} />;
}

