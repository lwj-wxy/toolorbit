import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ChineseHomePage, { metadata as chineseHomeMetadata } from '../zh-CN/page';
import ChinesePage, { generateMetadata as generateChineseMetadata } from '../zh-CN/[...segments]/page';

type PageProps = {
  params: Promise<{ not_found?: string[] }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { not_found: segments = [] } = await params;

  if (segments[0] === 'zh-CN') {
    if (segments.length === 1) {
      return chineseHomeMetadata;
    }

    return generateChineseMetadata({
      params: Promise.resolve({ segments: segments.slice(1) }),
    });
  }

  return {};
}

export default async function CatchAllNotFound({ params }: PageProps) {
  const { not_found: segments = [] } = await params;

  if (segments[0] === 'zh-CN') {
    if (segments.length === 1) {
      return <ChineseHomePage />;
    }

    return (
      <ChinesePage
        params={Promise.resolve({
          segments: segments.slice(1),
        })}
      />
    );
  }

  notFound();
}
