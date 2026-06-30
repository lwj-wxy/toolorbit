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
  role: 'Browser tools, ecommerce calculations, and workflow reviews',
  bio:
    'The ToolOrbit Editorial Team maintains AI tool guides, browser utility notes, ecommerce fee explanations, and PDF and image workflows. Editors test steps with sample inputs, document limits, and keep feedback routed through the public ToolOrbit contact.',
  url: '/authors/toolorbit-editorial-team',
  avatarInitials: 'TO',
  localized: {
    'zh-CN': {
      name: 'ToolOrbit 编辑团队',
      role: '浏览器工具、电商计算和工作流复核',
      bio:
        'ToolOrbit 编辑团队维护 AI 工具指南、浏览器工具说明、电商费用说明，以及 PDF 与图片工作流。编辑会用样本输入测试步骤，记录限制，并通过 ToolOrbit 公开联系方式接收反馈。',
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
