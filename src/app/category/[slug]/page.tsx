import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { categoryMetadata } from '../../../lib/metadata';
import { CATEGORY_BY_SLUG, CATEGORY_SLUGS } from '../../../lib/category-paths';
import Home from '../../../views/Home';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return Object.values(CATEGORY_SLUGS).map((slug) => ({ slug }));
}

export const dynamicParams = false;
export const revalidate = 86400;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = CATEGORY_BY_SLUG[slug];

  if (!category) {
    return {};
  }

  return categoryMetadata(category);
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const category = CATEGORY_BY_SLUG[slug];

  if (!category) {
    notFound();
  }

  return <Home initialCategory={category} />;
}

