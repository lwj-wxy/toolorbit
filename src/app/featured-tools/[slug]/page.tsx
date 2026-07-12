import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import JsonLd from '../../../components/JsonLd';
import { FEATURED_TOOLS } from '../../../data/featured-tools';
import { SITE_NAME, SITE_URL } from '../../../lib/metadata';
import { organizationEntity } from '../../../lib/structured-data';
import FeaturedToolDetail from '../../../views/FeaturedToolDetail';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return FEATURED_TOOLS.map((tool) => ({ slug: tool.slug }));
}

export const dynamicParams = false;
export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = FEATURED_TOOLS.find((t) => t.slug === slug);
  if (!tool) return {};

  const title = `${tool.title} — Featured Tools | ${SITE_NAME}`;
  const description = tool.description.join(' ');

  return {
    title,
    description,
    robots: {
      index: false,
      follow: true,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      images: [{ url: `${SITE_URL}/featured-tools/${tool.slug}.png`, width: 1280, height: 720 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}/featured-tools/${tool.slug}.png`],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const tool = FEATURED_TOOLS.find((t) => t.slug === slug);
  if (!tool) notFound();

  return (
    <>
      <JsonLd
        id={`structured-data-featured-tool-${slug}`}
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: `${tool.title} — Featured Tools`,
            url: `${SITE_URL}/featured-tools/${slug}`,
            isPartOf: {
              '@type': 'WebSite',
              '@id': `${SITE_URL}/#website`,
              name: SITE_NAME,
              url: SITE_URL,
            },
            publisher: organizationEntity(),
          },
        ]}
      />
      <FeaturedToolDetail slug={slug} />
    </>
  );
}
