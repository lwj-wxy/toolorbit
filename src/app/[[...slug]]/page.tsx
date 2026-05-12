'use client';

import dynamic from 'next/dynamic';

const ClientApp = dynamic(() => import('../../next/ClientApp'), { ssr: false });

export default function Page() {
  return <ClientApp />;
}
