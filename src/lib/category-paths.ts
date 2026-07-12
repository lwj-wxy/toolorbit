import type { Category } from '../data/tools';

export const CATEGORY_SLUGS: Partial<Record<Category, string>> = {
  '电商工具': 'ecommerce',
};

export const CATEGORY_BY_SLUG = Object.fromEntries(
  Object.entries(CATEGORY_SLUGS).map(([category, slug]) => [slug, category]),
) as Record<string, Category>;

export function getCategoryPath(category: Category) {
  return category === '电商工具' ? '/tools/ecommerce' : '/tools';
}
