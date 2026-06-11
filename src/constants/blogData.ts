export interface BlogPost {
  slug: string;
  date: string;
  category: string;
  authorId?: string;
}

const defaultAuthorId = 'luo-wj';

const posts: BlogPost[] = [
  {
    slug: 'codex-cli-configuration-guide',
    date: '2026-06-11',
    category: 'AI',
    authorId: 'toolorbit-editorial-team',
  },
  {
    slug: 'codex-claude-code-skills-must-install',
    date: '2026-06-03',
    category: 'AI',
    authorId: 'toolorbit-editorial-team',
  },
  {
    slug: 'claude-code-cli-deepseek-api-guide',
    date: '2026-06-02',
    category: 'AI',
    authorId: 'toolorbit-editorial-team',
  },
  {
    slug: 'claude-opus-4-8-2026',
    date: '2026-05-29',
    category: 'AI',
  },
  {
    slug: 'mbti-personality-test-guide',
    date: '2026-05-27',
    category: 'Productivity',
  },
  {
    slug: 'mbti-four-dimensions-explained',
    date: '2026-05-27',
    category: 'Productivity',
  },
  {
    slug: 'mbti-16-personality-types-guide',
    date: '2026-05-27',
    category: 'Productivity',
  },
  {
    slug: 'codex-gpt-image-2-workflow',
    date: '2026-05-27',
    category: 'AI',
  },
  {
    slug: 'codex-skill-installation-guide',
    date: '2026-05-27',
    category: 'AI',
  },
  {
    slug: 'codex-ui-ux-pro-max-guide',
    date: '2026-05-27',
    category: 'AI',
  },
  {
    slug: 'paypal-fees-complete-guide',
    date: '2026-05-27',
    category: 'Business',
  },
  {
    slug: 'stripe-vs-paypal-fees-guide',
    date: '2026-05-27',
    category: 'Business',
  },
  {
    slug: 'reverse-payment-fee-calculator-guide',
    date: '2026-05-27',
    category: 'Business',
  },
  {
    slug: 'ecommerce-payment-processing-fees-guide',
    date: '2026-05-27',
    category: 'Business',
  },
  {
    slug: 'etsy-seo-title-tags-guide',
    date: '2026-05-26',
    category: 'Business',
  },
  {
    slug: 'etsy-product-photography-conversion-guide',
    date: '2026-05-25',
    category: 'Business',
  },
  {
    slug: 'etsy-shipping-free-shipping-strategy',
    date: '2026-05-24',
    category: 'Business',
  },
  {
    slug: 'etsy-digital-download-pricing-guide',
    date: '2026-05-23',
    category: 'Business',
  },
  {
    slug: 'uuid-demystified',
    date: '2026-05-16',
    category: 'Development',
  },
  {
    slug: 'url-encoding-demystified',
    date: '2026-05-16',
    category: 'Development',
  },
  {
    slug: 'unicode-character-encoding-guide',
    date: '2026-05-16',
    category: 'Development',
  },
  {
    slug: 'timezone-unix-timestamp-guide',
    date: '2026-05-15',
    category: 'Development',
  },
  {
    slug: 'password-entropy-explained',
    date: '2026-05-14',
    category: 'Security',
  },
  {
    slug: 'how-qr-codes-work',
    date: '2026-05-13',
    category: 'Productivity',
  },
  {
    slug: 'ai-excel-formula-guide',
    date: '2026-05-12',
    category: 'AI',
  },
  {
    slug: 'ai-video-script-guide',
    date: '2026-05-11',
    category: 'AI',
  },
  {
    slug: 'ai-meeting-minutes-guide',
    date: '2026-05-10',
    category: 'AI',
  },
  {
    slug: 'ai-regex-generator-guide',
    date: '2026-05-09',
    category: 'AI',
  },
  {
    slug: 'ai-code-reviewer-guide',
    date: '2026-05-08',
    category: 'AI',
  },
  {
    slug: 'image-converter-web-formats',
    date: '2026-05-07',
    category: 'Development',
  },
  {
    slug: 'svg-to-png-conversion-tips',
    date: '2026-05-06',
    category: 'Design',
  },
  {
    slug: 'image-compression-techniques',
    date: '2026-05-05',
    category: 'Design',
  },
  {
    slug: 'ai-translator-future',
    date: '2026-05-04',
    category: 'AI',
  },
  {
    slug: 'ai-text-polisher-guide',
    date: '2026-05-03',
    category: 'AI',
  },
  {
    slug: 'xml-json-conversion-guide',
    category: 'Development',
    date: '2026-05-02',
  },
  {
    slug: 'why-text-diff-matters',
    category: 'Development',
    date: '2026-04-30',
  },
  {
    slug: 'modern-pdf-workflow-efficiency',
    category: 'Development',
    date: '2026-04-29',
  },
  {
    slug: 'secure-developer-tools-privacy',
    category: 'Security',
    date: '2026-04-27',
  },
  {
    slug: 'why-use-json-formatter',
    date: '2026-04-26',
    category: 'Development',
  },
  {
    slug: 'morse-code-guide',
    date: '2026-04-24',
    category: 'Productivity',
  },
  {
    slug: 'base64-encoding-deep-dive',
    date: '2026-04-23',
    category: 'Development',
  },
  {
    slug: 'color-theory-for-developers',
    date: '2026-04-22',
    category: 'Design',
  },
  {
    slug: 'regex-mastery-guide',
    date: '2026-04-21',
    category: 'Development',
  },
  {
    slug: 'http-status-codes-explained',
    date: '2026-04-20',
    category: 'Development',
  },
  {
    slug: 'api-security-best-practices',
    date: '2026-04-19',
    category: 'Security',
  },
  {
    slug: 'etsy-fee-complete-guide',
    date: '2026-05-20',
    category: 'Business',
  },
  {
    slug: 'etsy-pricing-strategy-guide',
    date: '2026-05-19',
    category: 'Business',
  },
  {
    slug: 'etsy-offsite-ads-explained',
    date: '2026-05-18',
    category: 'Business',
  },
  {
    slug: 'etsy-international-selling-fees',
    date: '2026-05-17',
    category: 'Business',
  },
];

export const BLOG_POSTS: BlogPost[] = posts.map((post) => ({
  authorId: defaultAuthorId,
  ...post,
}));
