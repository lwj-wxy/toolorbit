type AuthorLocalizedFields = {
  name: string;
  role: string;
  bio: string;
};

export type Author = {
  id: string;
  name: string;
  role: string;
  bio: string;
  url: string;
  avatarInitials: string;
  localized?: Partial<Record<'zh-CN', AuthorLocalizedFields>>;
};

export const LUO_WJ_AUTHOR: Author = {
  id: 'luo-wj',
  name: 'Luo WJ',
  role: 'ToolOrbit maintainer and browser workflow reviewer',
  bio:
    'Luo WJ maintains ToolOrbit as a practical, browser-first utility project, reviewing developer, image, PDF, AI, and ecommerce workflows for clarity, privacy boundaries, and hands-on usefulness.',
  url: '/authors/luo-wj',
  avatarInitials: 'LW',
  localized: {
    'zh-CN': {
      name: 'Luo WJ',
      role: 'ToolOrbit 维护者与浏览器工作流复核者',
      bio:
        'Luo WJ 维护 ToolOrbit 这个实用、浏览器优先的在线工具项目，重点复核开发者、图片、PDF、AI 和电商工作流的清晰度、隐私边界以及实际可用性。',
    },
  },
};

export const TOOL_ORBIT_EDITORIAL_TEAM: Author = {
  id: 'toolorbit-editorial-team',
  name: 'ToolOrbit Editorial Team',
  role: 'Browser tools, developer workflows, and practical AI productivity',
  bio:
    'The ToolOrbit Editorial Team maintains practical guides for browser-based utilities, local-first workflows, developer productivity, PDF and image handling, and AI-assisted content work. Articles are reviewed for hands-on accuracy and linked to tools readers can use immediately.',
  url: '/authors/toolorbit-editorial-team',
  avatarInitials: 'TO',
  localized: {
    'zh-CN': {
      name: 'ToolOrbit 编辑团队',
      role: '浏览器工具、开发者工作流和实用 AI 效率指南',
      bio:
        'ToolOrbit 编辑团队维护浏览器在线工具、本地优先工作流、开发者效率、PDF 与图片处理以及 AI 辅助内容工作的实用指南。文章会复核实际准确性，并链接到读者可以立即使用的工具。',
    },
  },
};

export const DEFAULT_BLOG_AUTHOR = LUO_WJ_AUTHOR;

export const AUTHORS = [LUO_WJ_AUTHOR, TOOL_ORBIT_EDITORIAL_TEAM];

export function getAuthorById(authorId?: string, locale = 'en') {
  const author = AUTHORS.find((authorItem) => authorItem.id === authorId) || DEFAULT_BLOG_AUTHOR;
  const localizedAuthor = locale === 'zh-CN' ? author.localized?.['zh-CN'] : undefined;

  return localizedAuthor ? { ...author, ...localizedAuthor } : author;
}

export function getAuthorByPath(path: string) {
  return AUTHORS.find((author) => author.url === path);
}
