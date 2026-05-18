import type { Category } from '../data/tools-meta';
import { CATEGORY_SLUGS, getCategoryPath } from './category-paths';

export const TOOL_SECTION_CATEGORIES: Record<string, Category> = {
  ai: 'AI 工具',
  dev: '开发者工具',
  net: '站长工具',
  text: '文本排版',
  generator: '生成器',
  ecommerce: '电商工具',
  pdf: 'PDF工具',
  image: '图片处理',
  calculate: '计算转换',
};

export function getToolSectionCategory(section: string) {
  return TOOL_SECTION_CATEGORIES[section];
}

export function getToolSectionCategoryPath(section: string) {
  const category = getToolSectionCategory(section);
  return category ? getCategoryPath(category) : undefined;
}

export function toolSectionStaticParams() {
  return Object.keys(TOOL_SECTION_CATEGORIES).map((section) => ({ section }));
}

export function categorySlugForSection(section: string) {
  const category = getToolSectionCategory(section);
  return category ? CATEGORY_SLUGS[category] : undefined;
}
