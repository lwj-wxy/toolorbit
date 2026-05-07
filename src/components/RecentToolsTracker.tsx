import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useRecentTools } from '../hooks/useRecentTools';
import { TOOLS } from '../data/tools';

export default function RecentToolsTracker() {
  const { pathname } = useLocation();
  const { addRecentTool } = useRecentTools();

  useEffect(() => {
    // Find if current path matches any tool
    const currentTool = TOOLS.find(tool => tool.path === pathname);
    if (currentTool) {
      addRecentTool(currentTool.id);
    }
  }, [pathname, addRecentTool]);

  return null;
}
