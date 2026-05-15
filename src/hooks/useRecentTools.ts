import { TOOLS } from '../data/tools';
import { useRecentToolIds } from './useRecentToolIds';

export function useRecentTools() {
  const { recentToolIds, addRecentTool } = useRecentToolIds();

  const recentTools = recentToolIds
    .map(id => TOOLS.find(t => t.id === id))
    .filter((t): t is NonNullable<typeof t> => !!t);

  return { recentTools, addRecentTool };
}
