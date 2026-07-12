import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { metadata as chineseHomeMetadata } from '../zh-CN/page';

type PageProps = {
  params: Promise<{ not_found?: string[] }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { not_found: segments = [] } = await params;

  if (segments[0] === 'zh-CN') {
    return chineseHomeMetadata;
  }

  return {};
}

export default async function CatchAllNotFound({ params }: PageProps) {
  const { not_found: segments = [] } = await params;

  if (segments[0] === 'zh-CN') {
    redirect(segments.length === 1 ? '/' : `/${segments.slice(1).join('/')}`);
  }

  notFound();
}
