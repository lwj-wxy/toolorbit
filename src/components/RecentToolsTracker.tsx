import { useEffect } from 'react';
import { useCurrentLocation } from '../next/navigation';
import { useRecentTools } from '../hooks/useRecentTools';
import { TOOLS } from '../data/tools';

export default function RecentToolsTracker() {
  const { pathname } = useCurrentLocation();
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
