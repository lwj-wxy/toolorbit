import { BLOG_POSTS } from '../constants/blogData';

export const POSTS_PER_PAGE = 12;

export function sortedBlogPosts() {
  return [...BLOG_POSTS].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getTotalBlogPages() {
  return Math.max(1, Math.ceil(BLOG_POSTS.length / POSTS_PER_PAGE));
}

export function normalizeBlogPage(page: string | number) {
  const pageNumber = typeof page === 'number' ? page : Number(page);
  return Number.isInteger(pageNumber) && pageNumber > 0 ? pageNumber : null;
}
