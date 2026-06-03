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
  role: 'ToolOrbit maintainer and workflow reviewer',
  bio:
    'Luo WJ maintains ToolOrbit and reviews developer, image, PDF, AI, and ecommerce tools for clear inputs, privacy boundaries, and useful results in the browser.',
  url: '/authors/luo-wj',
  avatarInitials: 'LW',
  localized: {
    'zh-CN': {
      name: 'Luo WJ',
      role: 'ToolOrbit 维护者与工具流程复核者',
      bio:
        'Luo WJ 维护 ToolOrbit，并复核开发者、图片、PDF、AI 和电商工具的输入说明、隐私边界和浏览器内使用效果。',
    },
  },
};

export const TOOL_ORBIT_EDITORIAL_TEAM: Author = {
  id: 'toolorbit-editorial-team',
  name: 'ToolOrbit Editorial Team',
  role: 'Browser tools, developer workflows, and AI productivity',
  bio:
    'The ToolOrbit Editorial Team writes guides for browser utilities, local-first workflows, developer productivity, PDF and image tasks, and AI-assisted content work. Editors test the steps and link each guide to tools readers can open on ToolOrbit.',
  url: '/authors/toolorbit-editorial-team',
  avatarInitials: 'TO',
  localized: {
    'zh-CN': {
      name: 'ToolOrbit 编辑团队',
      role: '浏览器工具、开发者工作流和 AI 效率指南',
      bio:
        'ToolOrbit 编辑团队编写浏览器在线工具、本地优先工作流、开发者效率、PDF 与图片处理和 AI 辅助内容指南。编辑会测试步骤，并把文章链接到 ToolOrbit 上可直接打开的工具。',
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
