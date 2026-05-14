import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TOOLS } from '../../../../data/tools';
import { toolMetadata } from '../../../../lib/metadata';
import { toolJsonLd } from '../../../../lib/structured-data';
import JsonLd from '../../../../components/JsonLd';
import ToolSEOCard from '../../../../components/ToolSEOCard';
import ToolSearchContent from '../../../../components/ToolSearchContent';
import ToolPageClient from '../../../../components/ToolPageClient';
import { FALLBACK_TOOL_GUIDE_PATHS, INFO_CARD_TOOL_KEYS } from '../../../../lib/tool-page-content';

export function generateStaticParams() {
  return TOOLS.map((tool) => {
    const [, , section, slug] = tool.path.split('/');
    return { section, slug };
  });
}

export const dynamicParams = false;
export const revalidate = 86400;

export async function generateMetadata({ params }: { params: Promise<{ section: string; slug: string }> }): Promise<Metadata> {
  const { section, slug } = await params;
  return toolMetadata(`/tools/${section}/${slug}`);
}

export default async function Page({ params }: { params: Promise<{ section: string; slug: string }> }) {
  const { section, slug } = await params;
  const path = `/tools/${section}/${slug}`;

  if (!TOOLS.some((tool) => tool.path === path)) {
    notFound();
  }

  return (
    <>
      <JsonLd id={`structured-data-tool-${slug}`} data={toolJsonLd(path)} />
      <ToolPageClient path={path} />
      {INFO_CARD_TOOL_KEYS[path] ? <ToolSEOCard toolKey={INFO_CARD_TOOL_KEYS[path]} /> : null}
      {FALLBACK_TOOL_GUIDE_PATHS.has(path) ? <ToolSearchContent path={path} /> : null}
    </>
  );
}
