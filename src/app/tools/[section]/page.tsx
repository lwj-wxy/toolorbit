import { notFound, redirect } from 'next/navigation';
import { getToolSectionCategoryPath, toolSectionStaticParams } from '../../../lib/tool-section-paths';

export function generateStaticParams() {
  return toolSectionStaticParams();
}

export const dynamicParams = false;

export default async function Page({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const categoryPath = getToolSectionCategoryPath(section);

  if (!categoryPath) {
    notFound();
  }

  redirect(categoryPath);
}
