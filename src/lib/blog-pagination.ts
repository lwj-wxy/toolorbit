import { BLOG_POSTS } from '../constants/blogData';

export const POSTS_PER_PAGE = 12;
export const FIRST_BLOG_PAGE_POSTS = POSTS_PER_PAGE + 1;

export function sortedBlogPosts() {
  return [...BLOG_POSTS].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getTotalBlogPages(postCount = BLOG_POSTS.length) {
  if (postCount <= FIRST_BLOG_PAGE_POSTS) {
    return 1;
  }

  return 1 + Math.ceil((postCount - FIRST_BLOG_PAGE_POSTS) / POSTS_PER_PAGE);
}

export function getBlogPagePosts<T>(posts: T[], page: number) {
  if (page <= 1) {
    return posts.slice(0, FIRST_BLOG_PAGE_POSTS);
  }

  const startIndex = FIRST_BLOG_PAGE_POSTS + (page - 2) * POSTS_PER_PAGE;
  return posts.slice(startIndex, startIndex + POSTS_PER_PAGE);
}

export function normalizeBlogPage(page: string | number) {
  const pageNumber = typeof page === 'number' ? page : Number(page);
  return Number.isInteger(pageNumber) && pageNumber > 0 ? pageNumber : null;
}
