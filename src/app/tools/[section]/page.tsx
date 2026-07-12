import { notFound, redirect } from 'next/navigation';
import AllToolsPage from '../../../views/AllToolsPage';
import { toolSectionStaticParams } from '../../../lib/tool-section-paths';

export function generateStaticParams() {
  return toolSectionStaticParams();
}

export const dynamicParams = false;

export default async function Page({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;

  if (section === 'fun') {
    redirect('/tools');
  }

  if (section !== 'ecommerce') {
    notFound();
  }

  return <AllToolsPage />;
}
