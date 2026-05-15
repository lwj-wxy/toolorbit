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
  role: 'Browser tools, developer workflows, and practical AI productivity',
  bio:
    'The ToolOrbit Editorial Team maintains practical guides for browser-based utilities, local-first workflows, developer productivity, PDF and image handling, and AI-assisted content work. Articles are reviewed for hands-on accuracy and linked to tools readers can use immediately.',
  url: '/authors/toolorbit-editorial-team',
  avatarInitials: 'TO',
};

export const AUTHORS = [TOOL_ORBIT_EDITORIAL_TEAM];

