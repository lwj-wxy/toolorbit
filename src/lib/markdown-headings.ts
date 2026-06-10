export type MarkdownHeading = {
  id: string;
  text: string;
};

const normalizeHeadingText = (text: string) => {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[`*_~]/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

export const createHeadingId = (text: string) => {
  const normalizedText = normalizeHeadingText(text)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\u4e00-\u9fff\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

  return normalizedText || 'section';
};

export const createUniqueHeadingId = (text: string, headingCounts: Map<string, number>) => {
  const baseId = createHeadingId(text);
  const count = headingCounts.get(baseId) || 0;
  headingCounts.set(baseId, count + 1);

  return count === 0 ? baseId : `${baseId}-${count + 1}`;
};

export const extractMarkdownH2Headings = (markdown: string): MarkdownHeading[] => {
  const headingCounts = new Map<string, number>();
  const headings: MarkdownHeading[] = [];
  const h2Pattern = /^##(?!#)\s+(.+?)\s*#*\s*$/gm;

  for (const match of markdown.matchAll(h2Pattern)) {
    const text = normalizeHeadingText(match[1]);
    if (!text) continue;

    headings.push({
      id: createUniqueHeadingId(text, headingCounts),
      text,
    });
  }

  return headings;
};
