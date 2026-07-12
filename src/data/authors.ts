export type Author = {
  id: string;
  name: string;
  role: string;
  bio: string;
  url: string;
  avatarInitials: string;
};

export const TOOL_ORBIT_EDITORIAL_TEAM: Author = {
  id: 'toolorbit-editorial-team',
  name: 'ToolOrbit Editorial Team',
  role: 'Browser tools, ecommerce calculations, and workflow reviews',
  bio:
    'The ToolOrbit Editorial Team maintains AI tool guides, browser utility notes, ecommerce fee explanations, and PDF and image workflows. Editors test steps with sample inputs, document limits, and keep feedback routed through the public ToolOrbit contact.',
  url: '/authors/toolorbit-editorial-team',
  avatarInitials: 'TO',
};

export const DEFAULT_BLOG_AUTHOR = TOOL_ORBIT_EDITORIAL_TEAM;

export const AUTHORS = [TOOL_ORBIT_EDITORIAL_TEAM];

export function getAuthorById(authorId?: string) {
  const author = AUTHORS.find((authorItem) => authorItem.id === authorId) || DEFAULT_BLOG_AUTHOR;
  return author;
}

export function getAuthorByPath(path: string) {
  return AUTHORS.find((author) => author.url === path);
}
