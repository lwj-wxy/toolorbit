import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getTotalBlogPages, normalizeBlogPage } from '../../../../lib/blog-pagination';
import { blogListMetadata } from '../../../../lib/metadata';
import BlogList from '../../../../views/BlogList';

type PageProps = {
  params: Promise<{ page: string }>;
};

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

  return <BlogList initialPage={page} />;
}
