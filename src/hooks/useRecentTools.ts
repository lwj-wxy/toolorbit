import { useState, useEffect, useCallback } from 'react';
import { TOOLS } from '../data/tools';

const RECENT_TOOLS_KEY = 'recent-tools';
const MAX_RECENT_TOOLS = 8;

export function useRecentTools() {
  const [recentToolIds, setRecentToolIds] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(RECENT_TOOLS_KEY);
    if (saved) {
      try {
        setRecentToolIds(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse recent tools', e);
      }
    }
  }, []);

  const addRecentTool = useCallback((toolId: string) => {
    setRecentToolIds(prev => {
      // Remove if already exists to move it to the front
      const filtered = prev.filter(id => id !== toolId);
      const updated = [toolId, ...filtered].slice(0, MAX_RECENT_TOOLS);
      localStorage.setItem(RECENT_TOOLS_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const recentTools = recentToolIds
    .map(id => TOOLS.find(t => t.id === id))
    .filter((t): t is typeof TOOLS[0] => !!t);

  return { recentTools, addRecentTool };
}
