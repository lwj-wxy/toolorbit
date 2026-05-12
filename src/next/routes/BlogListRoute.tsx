'use client';

import BlogList from '../../views/BlogList';
import SiteShell from '../SiteShell';

export default function BlogListRoute() {
  return (
    <SiteShell>
      <BlogList />
    </SiteShell>
  );
}
