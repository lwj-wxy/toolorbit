export interface BlogPost {
  slug: string;
  date: string;
  updatedAt?: string;
  category: string;
  authorId?: string;
}

const defaultAuthorId = 'toolorbit-editorial-team';

const posts: BlogPost[] = [
  {
    slug: 'etsy-fee-complete-guide',
    date: '2026-08-11',
    updatedAt: '2026-08-11',
    category: 'Business',
    authorId: defaultAuthorId,
  },
  {
    slug: 'etsy-digital-download-pricing-guide',
    date: '2026-08-11',
    updatedAt: '2026-08-11',
    category: 'Business',
    authorId: defaultAuthorId,
  },
  {
    slug: 'etsy-seo-title-tags-guide',
    date: '2026-08-11',
    updatedAt: '2026-08-11',
    category: 'Business',
    authorId: defaultAuthorId,
  },
  {
    slug: 'etsy-offsite-ads-explained',
    date: '2026-08-11',
    updatedAt: '2026-08-11',
    category: 'Business',
    authorId: defaultAuthorId,
  },
  {
    slug: 'etsy-shipping-free-shipping-strategy',
    date: '2026-08-11',
    updatedAt: '2026-08-11',
    category: 'Business',
    authorId: defaultAuthorId,
  },
  {
    slug: 'etsy-product-photography-conversion-guide',
    date: '2026-08-11',
    updatedAt: '2026-08-11',
    category: 'Business',
    authorId: defaultAuthorId,
  },
  {
    slug: 'etsy-international-selling-fees',
    date: '2026-08-11',
    updatedAt: '2026-08-11',
    category: 'Business',
    authorId: defaultAuthorId,
  },
  {
    slug: 'stripe-vs-paypal-fees-guide',
    date: '2026-08-11',
    updatedAt: '2026-08-11',
    category: 'Business',
    authorId: defaultAuthorId,
  },
  {
    slug: 'how-much-does-etsy-take-per-sale',
    date: '2026-08-10',
    updatedAt: '2026-08-10',
    category: 'Business',
    authorId: defaultAuthorId,
  },
  {
    slug: 'etsy-pricing-strategy-guide',
    date: '2026-08-09',
    updatedAt: '2026-08-09',
    category: 'Business',
    authorId: defaultAuthorId,
  },
];

export const BLOG_POSTS: BlogPost[] = posts.map((post) => ({
  authorId: defaultAuthorId,
  ...post,
}));

export const PUBLISHED_BLOG_POSTS = BLOG_POSTS;

export const isPublishedBlogPost = (slug: string) => BLOG_POSTS.some((post) => post.slug === slug);
