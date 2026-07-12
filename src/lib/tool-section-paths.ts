import type { Category } from '../data/tools-meta';
import { CATEGORY_SLUGS } from './category-paths';

export const TOOL_SECTION_CATEGORIES: Record<string, Category> = { ecommerce: '电商工具' };

export function getToolSectionCategory(section: string) {
  return TOOL_SECTION_CATEGORIES[section];
}

export function toolSectionStaticParams() {
  return Object.keys(TOOL_SECTION_CATEGORIES).map((section) => ({ section }));
}

export function categorySlugForSection(section: string) {
  const category = getToolSectionCategory(section);
  return category ? CATEGORY_SLUGS[category] : undefined;
}
