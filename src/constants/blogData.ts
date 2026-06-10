export interface BlogPost {
  slug: string;
  date: string;
  category: string;
  image: string;
  authorId?: string;
}

const blogImage = (slug: string) => `/images/blog/${slug}.jpg`;
const defaultAuthorId = 'luo-wj';

const posts: BlogPost[] = [
  {
    slug: 'codex-claude-code-skills-must-install',
    date: '2026-06-03',
    category: 'AI',
    image: '/images/blog/codex-claude-code-skills-must-install.png',
    authorId: 'toolorbit-editorial-team',
  },
  {
    slug: 'claude-code-cli-deepseek-api-guide',
    date: '2026-06-02',
    category: 'AI',
    image: blogImage('codex-skill-installation-guide'),
    authorId: 'toolorbit-editorial-team',
  },
  {
    slug: 'claude-opus-4-8-2026',
    date: '2026-05-29',
    category: 'AI',
    image: blogImage('claude-opus-4-8-2026'),
  },
  {
    slug: 'mbti-personality-test-guide',
    date: '2026-05-27',
    category: 'Productivity',
    image: '/images/blog/mbti-personality-test-guide.png',
  },
  {
    slug: 'mbti-four-dimensions-explained',
    date: '2026-05-27',
    category: 'Productivity',
    image: '/images/blog/mbti-four-dimensions-explained.png',
  },
  {
    slug: 'mbti-16-personality-types-guide',
    date: '2026-05-27',
    category: 'Productivity',
    image: '/images/blog/mbti-16-personality-types-guide.png',
  },
  {
    slug: 'codex-gpt-image-2-workflow',
    date: '2026-05-27',
    category: 'AI',
    image: blogImage('codex-gpt-image-2-workflow'),
  },
  {
    slug: 'codex-skill-installation-guide',
    date: '2026-05-27',
    category: 'AI',
    image: blogImage('codex-skill-installation-guide'),
  },
  {
    slug: 'codex-ui-ux-pro-max-guide',
    date: '2026-05-27',
    category: 'AI',
    image: blogImage('codex-ui-ux-pro-max-guide'),
  },
  {
    slug: 'paypal-fees-complete-guide',
    date: '2026-05-27',
    category: 'Business',
    image: blogImage('paypal-fees-complete-guide'),
  },
  {
    slug: 'stripe-vs-paypal-fees-guide',
    date: '2026-05-27',
    category: 'Business',
    image: blogImage('stripe-vs-paypal-fees-guide'),
  },
  {
    slug: 'reverse-payment-fee-calculator-guide',
    date: '2026-05-27',
    category: 'Business',
    image: blogImage('reverse-payment-fee-calculator-guide'),
  },
  {
    slug: 'ecommerce-payment-processing-fees-guide',
    date: '2026-05-27',
    category: 'Business',
    image: blogImage('ecommerce-payment-processing-fees-guide'),
  },
  {
    slug: 'etsy-seo-title-tags-guide',
    date: '2026-05-26',
    category: 'Business',
    image: blogImage('etsy-pricing-strategy-guide'),
  },
  {
    slug: 'etsy-product-photography-conversion-guide',
    date: '2026-05-25',
    category: 'Business',
    image: blogImage('etsy-fee-complete-guide'),
  },
  {
    slug: 'etsy-shipping-free-shipping-strategy',
    date: '2026-05-24',
    category: 'Business',
    image: blogImage('etsy-international-selling-fees'),
  },
  {
    slug: 'etsy-digital-download-pricing-guide',
    date: '2026-05-23',
    category: 'Business',
    image: blogImage('etsy-offsite-ads-explained'),
  },
  {
    slug: 'uuid-demystified',
    date: '2026-05-16',
    category: 'Development',
    image: blogImage('uuid-demystified'),
  },
  {
    slug: 'url-encoding-demystified',
    date: '2026-05-16',
    category: 'Development',
    image: blogImage('url-encoding-demystified'),
  },
  {
    slug: 'unicode-character-encoding-guide',
    date: '2026-05-16',
    category: 'Development',
    image: blogImage('unicode-character-encoding-guide'),
  },
  {
    slug: 'timezone-unix-timestamp-guide',
    date: '2026-05-15',
    category: 'Development',
    image: blogImage('timezone-unix-timestamp-guide'),
  },
  {
    slug: 'password-entropy-explained',
    date: '2026-05-14',
    category: 'Security',
    image: blogImage('password-entropy-explained'),
  },
  {
    slug: 'how-qr-codes-work',
    date: '2026-05-13',
    category: 'Productivity',
    image: blogImage('how-qr-codes-work'),
  },
  {
    slug: 'ai-excel-formula-guide',
    date: '2026-05-12',
    category: 'AI',
    image: blogImage('ai-excel-formula-guide'),
  },
  {
    slug: 'ai-video-script-guide',
    date: '2026-05-11',
    category: 'AI',
    image: blogImage('ai-video-script-guide'),
  },
  {
    slug: 'ai-meeting-minutes-guide',
    date: '2026-05-10',
    category: 'AI',
    image: blogImage('ai-meeting-minutes-guide'),
  },
  {
    slug: 'ai-regex-generator-guide',
    date: '2026-05-09',
    category: 'AI',
    image: blogImage('ai-regex-generator-guide'),
  },
  {
    slug: 'ai-code-reviewer-guide',
    date: '2026-05-08',
    category: 'AI',
    image: blogImage('ai-code-reviewer-guide'),
  },
  {
    slug: 'image-converter-web-formats',
    date: '2026-05-07',
    category: 'Development',
    image: blogImage('image-converter-web-formats'),
  },
  {
    slug: 'svg-to-png-conversion-tips',
    date: '2026-05-06',
    category: 'Design',
    image: blogImage('svg-to-png-conversion-tips'),
  },
  {
    slug: 'image-compression-techniques',
    date: '2026-05-05',
    category: 'Design',
    image: blogImage('image-compression-techniques'),
  },
  {
    slug: 'ai-translator-future',
    date: '2026-05-04',
    category: 'AI',
    image: blogImage('ai-translator-future'),
  },
  {
    slug: 'ai-text-polisher-guide',
    date: '2026-05-03',
    category: 'AI',
    image: blogImage('ai-text-polisher-guide'),
  },
  {
    slug: 'xml-json-conversion-guide',
    category: 'Development',
    image: blogImage('xml-json-conversion-guide'),
    date: '2026-05-02',
  },
  {
    slug: 'why-text-diff-matters',
    category: 'Development',
    image: blogImage('why-text-diff-matters'),
    date: '2026-04-30',
  },
  {
    slug: 'modern-pdf-workflow-efficiency',
    category: 'Development',
    image: blogImage('modern-pdf-workflow-efficiency'),
    date: '2026-04-29',
  },
  {
    slug: 'secure-developer-tools-privacy',
    category: 'Security',
    image: blogImage('secure-developer-tools-privacy'),
    date: '2026-04-27',
  },
  {
    slug: 'why-use-json-formatter',
    date: '2026-04-26',
    category: 'Development',
    image: blogImage('why-use-json-formatter'),
  },
  {
    slug: 'morse-code-guide',
    date: '2026-04-24',
    category: 'Productivity',
    image: blogImage('morse-code-guide'),
  },
  {
    slug: 'base64-encoding-deep-dive',
    date: '2026-04-23',
    category: 'Development',
    image: blogImage('base64-encoding-deep-dive'),
  },
  {
    slug: 'color-theory-for-developers',
    date: '2026-04-22',
    category: 'Design',
    image: blogImage('color-theory-for-developers'),
  },
  {
    slug: 'regex-mastery-guide',
    date: '2026-04-21',
    category: 'Development',
    image: blogImage('regex-mastery-guide'),
  },
  {
    slug: 'http-status-codes-explained',
    date: '2026-04-20',
    category: 'Development',
    image: blogImage('http-status-codes-explained'),
  },
  {
    slug: 'api-security-best-practices',
    date: '2026-04-19',
    category: 'Security',
    image: blogImage('api-security-best-practices'),
  },
  {
    slug: 'etsy-fee-complete-guide',
    date: '2026-05-20',
    category: 'Business',
    image: blogImage('etsy-fee-complete-guide'),
  },
  {
    slug: 'etsy-pricing-strategy-guide',
    date: '2026-05-19',
    category: 'Business',
    image: blogImage('etsy-pricing-strategy-guide'),
  },
  {
    slug: 'etsy-offsite-ads-explained',
    date: '2026-05-18',
    category: 'Business',
    image: blogImage('etsy-offsite-ads-explained'),
  },
  {
    slug: 'etsy-international-selling-fees',
    date: '2026-05-17',
    category: 'Business',
    image: blogImage('etsy-international-selling-fees'),
  },
];

export const BLOG_POSTS: BlogPost[] = posts.map((post) => ({
  authorId: defaultAuthorId,
  ...post,
}));
