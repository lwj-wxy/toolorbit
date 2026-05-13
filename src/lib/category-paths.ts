import type { Category } from '../data/tools';

export const CATEGORY_SLUGS: Record<Category, string> = {
  'AI 工具': 'ai-tools',
  '开发者工具': 'developer-tools',
  '站长工具': 'webmaster-tools',
  '文本排版': 'text-tools',
  '生成器': 'generators',
  '电商工具': 'ecommerce-tools',
  'PDF工具': 'pdf-tools',
  '图片处理': 'image-tools',
  '计算转换': 'conversion-tools',
  '娱乐工具': 'fun-tools',
};

export const CATEGORY_BY_SLUG = Object.fromEntries(
  Object.entries(CATEGORY_SLUGS).map(([category, slug]) => [slug, category]),
) as Record<string, Category>;

export function getCategoryPath(category: Category) {
  return `/category/${CATEGORY_SLUGS[category]}`;
}

