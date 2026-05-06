
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
  }
];
