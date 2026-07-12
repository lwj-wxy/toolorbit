import type { Category } from '../data/tools';

export const CATEGORY_SLUGS: Partial<Record<Category, string>> = {
  'AI 工具': 'ai',
  '电商工具': 'ecommerce',
};

export const CATEGORY_BY_SLUG = Object.fromEntries(
  Object.entries(CATEGORY_SLUGS).map(([category, slug]) => [slug, category]),
) as Record<string, Category>;

export function getCategoryPath(category: Category) {
  return CATEGORY_SLUGS[category] ? `/tools/${CATEGORY_SLUGS[category]}` : '/tools';
}
