import { useEffect } from 'react';
import { useCurrentLocation } from '../lib/navigation';
import { useRecentToolIds } from '../hooks/useRecentToolIds';
import { TOOLS_META } from '../data/tools-meta';

export default function RecentToolsTracker() {
  const { pathname } = useCurrentLocation();
  const { addRecentTool } = useRecentToolIds();

  useEffect(() => {
    const currentTool = TOOLS_META.find(tool => tool.path === pathname);
    if (currentTool) {
      addRecentTool(currentTool.id);
    }
  }, [pathname, addRecentTool]);

  return null;
}
