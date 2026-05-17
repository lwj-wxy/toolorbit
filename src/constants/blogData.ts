export interface BlogPost {
  slug: string;
  date: string;
  category: string;
  image: string;
}

const blogImage = (slug: string) => `/images/blog/${slug}.jpg`;

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'uuid-demystified',
    date: '2026-05-16',
    category: 'Development',
    image: blogImage('uuid-demystified'),
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
    category: 'Science',
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
    category: 'Tech',
    image: blogImage('ai-translator-future'),
  },
  {
    slug: 'ai-text-polisher-guide',
    date: '2026-05-03',
    category: 'Tech',
    image: blogImage('ai-text-polisher-guide'),
  },
  {
    slug: 'xml-json-conversion-guide',
    category: 'Development',
    image: blogImage('xml-json-conversion-guide'),
    date: '2026-05-02',
  },
  {
    slug: 'xiaohongshu-copywriting-ai',
    category: 'Design',
    image: blogImage('xiaohongshu-copywriting-ai'),
    date: '2026-05-01',
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
    slug: 'ai-ecommerce-marketing-tips',
    category: 'Lifestyle',
    image: blogImage('ai-ecommerce-marketing-tips'),
    date: '2026-04-28',
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
    slug: 'benefits-of-chinese-crypto-sm',
    date: '2026-04-25',
    category: 'Security',
    image: blogImage('benefits-of-chinese-crypto-sm'),
  },
  {
    slug: 'morse-code-guide',
    date: '2026-04-24',
    category: 'Education',
    image: blogImage('morse-code-guide'),
  },
  {
    slug: 'base64-encoding-deep-dive',
    date: '2026-04-23',
    category: 'Network',
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
    category: 'Network',
    image: blogImage('http-status-codes-explained'),
  },
  {
    slug: 'api-security-best-practices',
    date: '2026-04-19',
    category: 'Security',
    image: blogImage('api-security-best-practices'),
  },
  {
    slug: 'sugar-content-rankings',
    date: '2026-04-18',
    category: 'Science',
    image: blogImage('sugar-content-rankings'),
  },
  {
    slug: 'coffee-caffeine-guide',
    date: '2026-04-17',
    category: 'Science',
    image: blogImage('coffee-caffeine-guide'),
  },
  {
    slug: 'remote-work-ergonomics',
    date: '2026-04-16',
    category: 'Lifestyle',
    image: blogImage('remote-work-ergonomics'),
  },
];
