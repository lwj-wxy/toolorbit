'use client';

import About from '../../views/About';
import Privacy from '../../views/Privacy';
import Terms from '../../views/Terms';
import SiteShell from '../SiteShell';

const pageMap = {
  about: About,
  privacy: Privacy,
  terms: Terms,
};

export default function StaticPageRoute({ page }: { page: keyof typeof pageMap }) {
  const Page = pageMap[page];

  return (
    <SiteShell>
      <Page />
    </SiteShell>
  );
}
