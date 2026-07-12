import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { TOOLS } from '../../../../data/tools';
import { toolMetadata } from '../../../../lib/metadata';
import { toolJsonLd } from '../../../../lib/structured-data';
import JsonLd from '../../../../components/JsonLd';
import ToolSearchContent from '../../../../components/ToolSearchContent';
import ToolContent from '../../../../components/ToolContent';
import ToolPageClient from '../../../../components/ToolPageClient';
import EtsyFeeServerHero from '../../../../components/EtsyFeeServerHero';
import { FALLBACK_TOOL_GUIDE_PATHS } from '../../../../lib/tool-page-content';

export function generateStaticParams() {
  return TOOLS.filter((tool) => !tool.isNoIndex).map((tool) => {
    const [, , section, slug] = tool.path.split('/');
    return { section, slug };
  });
}

export const dynamicParams = false;
export const revalidate = 86400;

export async function generateMetadata({ params }: { params: Promise<{ section: string; slug: string }> }): Promise<Metadata> {
  const { section, slug } = await params;
  if (section === 'fun') {
    return {};
  }
  return toolMetadata(`/tools/${section}/${slug}`);
}

export default async function Page({ params }: { params: Promise<{ section: string; slug: string }> }) {
  const { section, slug } = await params;
  const path = `/tools/${section}/${slug}`;

  if (section === 'fun') {
    redirect('/tools');
  }

  const tool = TOOLS.find((toolItem) => toolItem.path === path);

  if (!tool) {
    notFound();
  }

  const isEtsyFeeCalculator = tool.path === '/tools/ecommerce/etsy-fee-calculator';

  return (
    <>
      <JsonLd id={`structured-data-tool-${slug}`} data={toolJsonLd(path)} />
      {isEtsyFeeCalculator ? <EtsyFeeServerHero /> : null}
      <ToolPageClient path={path} hideHeader={isEtsyFeeCalculator} />
      <ToolContent path={path} />
      {FALLBACK_TOOL_GUIDE_PATHS.has(path) ? <ToolSearchContent path={path} /> : null}
    </>
  );
}
