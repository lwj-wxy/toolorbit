import { useEffect } from 'react';
import { useCurrentLocation } from '../lib/navigation';
import { useRecentToolIds } from '../hooks/useRecentToolIds';
import type { ToolTrackingItem } from '../lib/navigation-menu';

export default function RecentToolsTracker({ tools }: { tools: ToolTrackingItem[] }) {
  const { pathname } = useCurrentLocation();
  const { addRecentTool } = useRecentToolIds();

  useEffect(() => {
    const currentTool = tools.find(tool => tool.path === pathname);
    if (currentTool) {
      addRecentTool(currentTool.id);
    }
  }, [pathname, addRecentTool, tools]);

  return null;
}
