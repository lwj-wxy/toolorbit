import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TOOLS } from '../../../../data/tools';
import { toolMetadata } from '../../../../lib/metadata';
import { toolJsonLd } from '../../../../lib/structured-data';
import JsonLd from '../../../../components/JsonLd';
import ToolSearchContent from '../../../../components/ToolSearchContent';
import ToolPageClient from '../../../../components/ToolPageClient';

const FALLBACK_TOOL_GUIDE_PATHS = new Set([
  '/tools/ai/youtube-generator',
  '/tools/ai/xiaohongshu',
  '/tools/ai/listing-generator',
  '/tools/ai/keyword-analyzer',
  '/tools/ai/competitor-tracker',
  '/tools/ai/market-insights',
  '/tools/dev/color-converter',
  '/tools/dev/color-palette',
  '/tools/dev/crypto-symmetric',
  '/tools/dev/morse-code',
  '/tools/dev/text-diff',
  '/tools/dev/xml-to-json',
  '/tools/fun/game-2048',
  '/tools/fun/minesweeper',
  '/tools/generator/barcode-generator',
  '/tools/generator/qr-scanner',
  '/tools/image/image-compressor',
  '/tools/image/image-cropper',
  '/tools/image/image-to-base64',
  '/tools/image/image-to-ico',
  '/tools/image/svg-to-png',
  '/tools/pdf/image-to-pdf',
  '/tools/pdf/pdf-merge',
  '/tools/shared/placeholder',
  '/tools/text/symbol-library',
  '/tools/text/text-analyzer',
  '/tools/text/text-cleaner',
]);

export function generateStaticParams() {
  return TOOLS.map((tool) => {
    const [, , section, slug] = tool.path.split('/');
    return { section, slug };
  });
}

export const dynamicParams = false;

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
      {FALLBACK_TOOL_GUIDE_PATHS.has(path) ? <ToolSearchContent path={path} /> : null}
    </>
  );
}
