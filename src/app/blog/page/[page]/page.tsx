import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import JsonLd from '../../../../components/JsonLd';
import { getTotalBlogPages, normalizeBlogPage } from '../../../../lib/blog-pagination';
import { blogListMetadata } from '../../../../lib/metadata';
import { blogListJsonLd } from '../../../../lib/structured-data';
import BlogList from '../../../../views/BlogList';

type PageProps = {
  params: Promise<{ page: string }>;
};

export const dynamicParams = false;
export const revalidate = 3600;

export function generateStaticParams() {
  return Array.from({ length: getTotalBlogPages() - 1 }, (_, index) => ({
    page: String(index + 2),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const page = normalizeBlogPage((await params).page);

  if (!page || page > getTotalBlogPages()) {
    return {};
  }

  return blogListMetadata('en', page);
}

export default async function Page({ params }: PageProps) {
  const page = normalizeBlogPage((await params).page);

  if (page === 1) {
    redirect('/blog');
  }

  if (!page || page > getTotalBlogPages()) {
    notFound();
  }

  return (
    <>
      <JsonLd id={`structured-data-blog-list-page-${page}`} data={blogListJsonLd('en', page)} />
      <BlogList initialPage={page} />
    </>
  );
}
