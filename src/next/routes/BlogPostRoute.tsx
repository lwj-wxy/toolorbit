'use client';

import BlogPost from '../../views/BlogPost';
import SiteShell from '../SiteShell';

export default function BlogPostRoute({ initialMarkdown }: { initialMarkdown?: string }) {
  return (
    <SiteShell>
      <BlogPost initialMarkdown={initialMarkdown} />
    </SiteShell>
  );
}
