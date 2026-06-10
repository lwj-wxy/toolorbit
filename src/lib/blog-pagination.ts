import { BLOG_POSTS } from '../constants/blogData';

export const POSTS_PER_PAGE = 10;

export function sortedBlogPosts() {
  return [...BLOG_POSTS].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getTotalBlogPages(postCount = BLOG_POSTS.length) {
  return Math.max(1, Math.ceil(postCount / POSTS_PER_PAGE));
}

export function getBlogPagePosts<T>(posts: T[], page: number) {
  const normalizedPage = Math.max(1, page);
  const startIndex = (normalizedPage - 1) * POSTS_PER_PAGE;
  return posts.slice(startIndex, startIndex + POSTS_PER_PAGE);
}

export function normalizeBlogPage(page: string | number) {
  const pageNumber = typeof page === 'number' ? page : Number(page);
  return Number.isInteger(pageNumber) && pageNumber > 0 ? pageNumber : null;
}
