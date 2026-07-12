import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

type PageProps = {
  params: Promise<{ not_found?: string[] }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  await params;
  return {};
}

export default async function CatchAllNotFound({ params }: PageProps) {
  await params;
  notFound();
}
