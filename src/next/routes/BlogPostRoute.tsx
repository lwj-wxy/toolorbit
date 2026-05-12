'use client';

import BlogPost from '../../views/BlogPost';
import SiteShell from '../SiteShell';

export default function BlogPostRoute({
  slug,
  initialMarkdown,
}: {
  slug: string;
  initialMarkdown?: string;
}) {
  return (
    <SiteShell>
      <BlogPost slug={slug} initialMarkdown={initialMarkdown} />
    </SiteShell>
  );
}
