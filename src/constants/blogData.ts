
export interface BlogPost {
  id: string;
  slug: string;
  date: string;
  category: string;
  image: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    slug: 'why-use-json-formatter',
    date: '2026-05-06',
    category: 'Development',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    slug: 'benefits-of-chinese-crypto-sm',
    date: '2026-05-05',
    category: 'Security',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '3',
    slug: 'morse-code-guide',
    date: '2026-05-04',
    category: 'Education',
    image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '4',
    slug: 'base64-encoding-deep-dive',
    date: '2026-05-03',
    category: 'Network',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '5',
    slug: 'color-theory-for-developers',
    date: '2026-05-02',
    category: 'Design',
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '6',
    slug: 'regex-mastery-guide',
    date: '2026-05-01',
    category: 'Development',
    image: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '7',
    slug: 'http-status-codes-explained',
    date: '2026-04-30',
    category: 'Network',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '8',
    slug: 'api-security-best-practices',
    date: '2026-04-29',
    category: 'Security',
    image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '9',
    slug: 'sugar-content-rankings',
    date: '2026-04-28',
    category: 'Science',
    image: 'https://images.unsplash.com/photo-1546241072-48010ad2862c?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '10',
    slug: 'coffee-caffeine-guide',
    date: '2026-04-27',
    category: 'Science',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '11',
    slug: 'remote-work-ergonomics',
    date: '2026-04-26',
    category: 'Lifestyle',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800'
  }
];
