export type Author = {
  id: string;
  name: string;
  role: string;
  bio: string;
  url: string;
  avatarInitials: string;
};

export const LUO_WJ_AUTHOR: Author = {
  id: 'luo-wj',
  name: 'Luo WJ',
  role: 'ToolOrbit maintainer and browser workflow reviewer',
  bio:
    'Luo WJ maintains ToolOrbit as a practical, browser-first utility project, reviewing developer, image, PDF, AI, and ecommerce workflows for clarity, privacy boundaries, and hands-on usefulness.',
  url: '/authors/luo-wj',
  avatarInitials: 'LW',
};

export const TOOL_ORBIT_EDITORIAL_TEAM: Author = {
  id: 'toolorbit-editorial-team',
  name: 'ToolOrbit Editorial Team',
  role: 'Browser tools, developer workflows, and practical AI productivity',
  bio:
    'The ToolOrbit Editorial Team maintains practical guides for browser-based utilities, local-first workflows, developer productivity, PDF and image handling, and AI-assisted content work. Articles are reviewed for hands-on accuracy and linked to tools readers can use immediately.',
  url: '/authors/toolorbit-editorial-team',
  avatarInitials: 'TO',
};

export const DEFAULT_BLOG_AUTHOR = LUO_WJ_AUTHOR;

export const AUTHORS = [LUO_WJ_AUTHOR, TOOL_ORBIT_EDITORIAL_TEAM];

export function getAuthorById(authorId?: string) {
  return AUTHORS.find((author) => author.id === authorId) || DEFAULT_BLOG_AUTHOR;
}

export function getAuthorByPath(path: string) {
  return AUTHORS.find((author) => author.url === path);
}
