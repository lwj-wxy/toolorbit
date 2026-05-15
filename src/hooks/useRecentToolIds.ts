import { useState, useEffect, useCallback } from 'react';

const RECENT_TOOLS_KEY = 'recent-tools';
const MAX_RECENT_TOOLS = 8;

export function useRecentToolIds() {
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
      const filtered = prev.filter(id => id !== toolId);
      const updated = [toolId, ...filtered].slice(0, MAX_RECENT_TOOLS);
      localStorage.setItem(RECENT_TOOLS_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return { recentToolIds, addRecentTool };
}
