import type { ToolItem } from '../data/tools';

const shuffleTools = (tools: ToolItem[]) => {
  const shuffledTools = [...tools];

  for (let currentIndex = shuffledTools.length - 1; currentIndex > 0; currentIndex -= 1) {
    const randomIndex = Math.floor(Math.random() * (currentIndex + 1));
    [shuffledTools[currentIndex], shuffledTools[randomIndex]] = [shuffledTools[randomIndex], shuffledTools[currentIndex]];
  }

  return shuffledTools;
};

export const getRandomRelatedTools = (tools: ToolItem[], currentTool: ToolItem, count = 4) => {
  const candidateTools = tools.filter((tool) => tool.id !== currentTool.id && !tool.isNoIndex);

  return shuffleTools(candidateTools).slice(0, count);
};
