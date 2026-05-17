import { TOOLS_META, type Category } from '../data/tools-meta';
import { getCategoryPath } from './category-paths';

export interface NavTool {
  id: string;
  name: string;
  path: string;
  category: Category;
  color?: string;
}

export interface NavCategory {
  category: Category;
  path: string;
  tools: NavTool[];
}

export interface NavigationMenuData {
  categories: NavCategory[];
  aiCategoryPath: string;
  aiTools: NavTool[];
}

export interface ToolTrackingItem {
  id: string;
  path: string;
}

export function getNavigationMenuData(): NavigationMenuData {
  const toNavTool = (tool: (typeof TOOLS_META)[number]): NavTool => ({
    id: tool.id,
    name: tool.name,
    path: tool.path,
    category: tool.category,
    color: tool.color,
  });

  const categories = Array.from(new Set(TOOLS_META.map((tool) => tool.category)))
    .filter((category) => category !== '娱乐工具' && category !== 'AI 工具')
    .map((category) => ({
      category,
      path: getCategoryPath(category),
      tools: TOOLS_META.filter((tool) => tool.category === category).map(toNavTool),
    }));

  return {
    categories,
    aiCategoryPath: getCategoryPath('AI 工具'),
    aiTools: TOOLS_META.filter((tool) => tool.category === 'AI 工具').map(toNavTool),
  };
}

export function getToolTrackingData(): ToolTrackingItem[] {
  return TOOLS_META.map((tool) => ({
    id: tool.id,
    path: tool.path,
  }));
}
