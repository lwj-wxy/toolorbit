'use client';

import { type CSSProperties, FormEvent, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Clock,
  Clapperboard,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { CATEGORY_GUIDES } from '../data/categoryGuides';
import { Category, ToolItem, TOOLS } from '../data/tools';
import { useRecentTools } from '../hooks/useRecentTools';
import { getCategoryPath } from '../lib/category-paths';
import { Link, useClientSearchParamsWithInitialSearch } from '../lib/navigation';
import { cn } from '../lib/utils';

const TOOL_CARD_REVEAL_DELAY_STEP = 0.035;
const TOOL_CARD_REVEAL_DELAY_MAX = 0.14;
const HOME_PRIMARY_CATEGORY: Category = 'AI 工具';
const twoLineDescriptionStyle: CSSProperties = {
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
  overflow: 'hidden',
  minHeight: '2.75rem',
  maxHeight: '2.75rem',
};
const AI_WORKFLOW_GROUPS = [
  {
    id: 'content',
    titleZh: '内容创作',
    titleEn: 'Content',
    toolIds: ['ai-video-script', 'ai-xiaohongshu', 'ai-text-polisher', 'ai-translator'],
  },
  {
    id: 'visual',
    titleZh: '图像与设计',
    titleEn: 'Visuals',
    toolIds: ['ai-prompt-generator', 'logo-generator', 'ai-image-generator', 'ai-svg-generator'],
  },
  {
    id: 'work',
    titleZh: '办公与开发',
    titleEn: 'Work',
    toolIds: ['ai-weekly-report', 'ai-meeting-minutes', 'ai-excel-formula', 'ai-code-reviewer', 'ai-regex'],
  },
  {
    id: 'commerce',
    titleZh: '电商增长',
    titleEn: 'Commerce',
    toolIds: ['listing-generator', 'keyword-analyzer', 'competitor-tracker', 'market-insights'],
  },
];

type YoutubePreviewSectionKey = 'title' | 'description' | 'tags';

const parseYoutubePreviewResult = (text: string): Record<YoutubePreviewSectionKey, string> => {
  const sections = { title: '', description: '', tags: '' };
  if (!text) return sections;

  const sectionPattern = (marker: string) =>
    new RegExp(`\\[${marker}\\]\\s*:?\\s*([\\s\\S]*?)(?=\\n?\\[[A-Z_]+\\]|$)`, 'i');

  sections.title = text.match(sectionPattern('TITLE'))?.[1]?.trim() || '';
  sections.description = text.match(sectionPattern('DESCRIPTION'))?.[1]?.trim() || '';
  sections.tags = text.match(sectionPattern('TAGS'))?.[1]?.trim() || '';

  return sections;
};

const YoutubeHeroTrial = ({ isZh }: { isZh: boolean }) => {
  const [topic, setTopic] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sections = parseYoutubePreviewResult(result);
  const hasStructuredResult = Object.values(sections).some(Boolean);

  const requestYoutubePreview = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTopic = topic.trim();
    if (!trimmedTopic) return;

    setLoading(true);
    setError('');
    setResult('');

    let currentText = '';

    try {
      const response = await fetch('/api/youtube-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: trimmedTopic,
          tone: 'engaging',
          targetAudience: isZh ? 'YouTube 内容创作者' : 'YouTube creators',
          language: isZh ? 'zh-CN' : 'English',
        }),
      });

      if (!response.ok) {
        const responseData = await response.json().catch(() => ({}));
        throw new Error(responseData.error || (isZh ? '生成失败，请稍后再试。' : 'Generation failed. Please try again.'));
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error(isZh ? '生成响应为空。' : 'Empty generation response.');

      const decoder = new TextDecoder();
      let pendingText = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (!value) continue;

        pendingText += decoder.decode(value, { stream: true });
        const lines = pendingText.split('\n');
        pendingText = lines.pop() || '';

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine.startsWith('data: ') || trimmedLine.includes('[DONE]')) continue;

          try {
            const responseData = JSON.parse(trimmedLine.substring(6));
            if (responseData.error) {
              setError(responseData.error);
              continue;
            }
            if (responseData.content) {
              currentText += responseData.content;
              setResult(currentText);
            }
          } catch {
            pendingText = `${line}\n${pendingText}`;
            break;
          }
        }
      }
    } catch (errorValue: unknown) {
      setError(
        errorValue instanceof Error
          ? errorValue.message
          : isZh
            ? '生成失败，请稍后再试。'
            : 'Generation failed. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const fields: Array<{ key: YoutubePreviewSectionKey; label: string }> = [
    { key: 'title', label: isZh ? '标题建议' : 'Title ideas' },
    { key: 'description', label: isZh ? '简介草稿' : 'Description draft' },
    { key: 'tags', label: isZh ? '标签' : 'Tags' },
  ];

  return (
    <form
      onSubmit={requestYoutubePreview}
      className="mx-auto mt-8 max-w-4xl rounded-2xl border border-slate-200/90 bg-white/95 p-5 text-left shadow-sm dark:border-slate-800 dark:bg-[#282c34]/95 sm:p-6"
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_240px]">
        <div className="min-w-0">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--app-accent-soft)] text-[var(--app-accent-ink)] dark:bg-[var(--app-accent-soft)] dark:text-[var(--app-accent-ink)]">
              <Clapperboard className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-base font-semibold text-slate-950 dark:text-white">
                {isZh ? 'YouTube 发布文案生成器' : 'YouTube Upload Copy Generator'}
              </h2>
              <p className="mt-0.5 text-[13px] text-slate-500 dark:text-slate-400">
                {isZh ? '根据视频主题生成标题、简介和标签建议。' : 'Generate title, description, and tag suggestions from a video topic.'}
              </p>
            </div>
          </div>

          <label className="mb-2 block text-[13px] font-semibold text-slate-700 dark:text-slate-200">
            {isZh ? '视频主题' : 'Video topic'}
          </label>
          <textarea
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            placeholder={isZh ? '例如：新手如何拍出好看的咖啡拉花' : 'e.g. How beginners can film better latte art'}
            className="min-h-[112px] w-full resize-none rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-3 text-sm leading-6 text-[var(--app-text)] outline-none transition-colors placeholder:text-[var(--app-muted)] focus:border-[var(--app-accent)] focus:bg-[var(--app-surface-strong)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--app-accent)_14%,transparent)] dark:border-[var(--app-border)] dark:bg-[var(--app-surface)] dark:text-[var(--app-text)] dark:focus:border-[var(--app-accent)]"
          />
        </div>

        <div className="flex flex-col justify-end gap-2">
          <button
            type="submit"
            disabled={loading || !topic.trim()}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[var(--app-accent)] px-4 text-sm font-semibold text-white transition-colors hover:bg-[var(--app-accent-strong)] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[var(--app-accent)] dark:hover:bg-[var(--app-accent-strong)]"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Sparkles className="h-4 w-4" aria-hidden="true" />}
            {loading ? (isZh ? '生成中' : 'Generating') : isZh ? '生成建议' : 'Generate suggestions'}
          </button>
          <Link
            to="/tools/ai/youtube-generator"
            className="inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition-shadow hover:shadow-sm dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-200"
          >
            {isZh ? '打开完整工具' : 'Open full tool'}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {(error || loading || result) ? (
        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/30">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-[13px] font-semibold text-slate-800 dark:text-slate-100">
              {isZh ? '生成结果' : 'Generated copy'}
            </p>
            {loading ? <Loader2 className="h-4 w-4 animate-spin text-[var(--app-accent-ink)] dark:text-[var(--app-accent-ink)]" aria-hidden="true" /> : null}
          </div>

          {loading && !result ? (
            <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
              {isZh ? '正在生成标题、简介和标签建议。' : 'Generating title, description, and tag suggestions.'}
            </p>
          ) : null}

          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-700 dark:border-red-900/60 dark:bg-red-950/20 dark:text-red-200">
              {error}
            </div>
          ) : null}

          {result && hasStructuredResult ? (
            <div className="max-h-[260px] space-y-3 overflow-y-auto pr-1">
              {fields.map(({ key, label }) => {
                const content = sections[key];
                if (!content) return null;

                return (
                  <section key={key} className="border-b border-slate-200 pb-3 last:border-b-0 last:pb-0 dark:border-slate-800">
                    <h3 className="text-[12px] font-semibold text-[var(--app-accent-ink)] dark:text-[var(--app-accent-ink)]">{label}</h3>
                    <p className="mt-1 whitespace-pre-wrap text-[13px] leading-6 text-slate-700 dark:text-slate-300">{content}</p>
                  </section>
                );
              })}
            </div>
          ) : null}

          {result && !hasStructuredResult ? (
            <p className="max-h-[260px] overflow-y-auto whitespace-pre-wrap text-[13px] leading-6 text-slate-700 dark:text-slate-300">{result}</p>
          ) : null}
        </div>
      ) : null}
    </form>
  );
};

const categoryStyles: Record<string, { badge: string; icon: string }> = {
  'AI 工具': { badge: 'bg-[var(--app-accent-soft)] text-[var(--app-accent-ink)] ring-[color-mix(in_srgb,var(--app-accent)_26%,transparent)] dark:bg-[var(--app-accent-soft)] dark:text-[var(--app-accent-ink)] dark:ring-[color-mix(in_srgb,var(--app-accent)_32%,transparent)]', icon: 'text-[var(--app-accent-ink)] bg-[var(--app-accent-soft)] dark:bg-[var(--app-accent-soft)] dark:text-[var(--app-accent-ink)]' },
  '开发者工具': { badge: 'bg-[var(--app-accent-soft)] text-[var(--app-accent-ink)] ring-[color-mix(in_srgb,var(--app-accent)_26%,transparent)] dark:bg-[var(--app-accent-soft)] dark:text-[var(--app-accent-ink)] dark:ring-[color-mix(in_srgb,var(--app-accent)_32%,transparent)]', icon: 'text-[var(--app-accent-ink)] bg-[var(--app-accent-soft)] dark:bg-[var(--app-accent-soft)] dark:text-[var(--app-accent-ink)]' },
  '站长工具': { badge: 'bg-[var(--app-accent-soft)] text-[var(--app-accent-ink)] ring-[color-mix(in_srgb,var(--app-accent)_26%,transparent)] dark:bg-[var(--app-accent-soft)] dark:text-[var(--app-accent-ink)] dark:ring-[color-mix(in_srgb,var(--app-accent)_32%,transparent)]', icon: 'text-[var(--app-accent-ink)] bg-[var(--app-accent-soft)] dark:bg-[var(--app-accent-soft)] dark:text-[var(--app-accent-ink)]' },
  '文本排版': { badge: 'bg-[var(--app-accent-soft)] text-[var(--app-accent-ink)] ring-[color-mix(in_srgb,var(--app-accent)_26%,transparent)] dark:bg-[var(--app-accent-soft)] dark:text-[var(--app-accent-ink)] dark:ring-[color-mix(in_srgb,var(--app-accent)_32%,transparent)]', icon: 'text-[var(--app-accent-ink)] bg-[var(--app-accent-soft)] dark:bg-[var(--app-accent-soft)] dark:text-[var(--app-accent-ink)]' },
  '生成器': { badge: 'bg-[var(--app-accent-soft)] text-[var(--app-accent-ink)] ring-[color-mix(in_srgb,var(--app-accent)_26%,transparent)] dark:bg-[var(--app-accent-soft)] dark:text-[var(--app-accent-ink)] dark:ring-[color-mix(in_srgb,var(--app-accent)_32%,transparent)]', icon: 'text-[var(--app-accent-ink)] bg-[var(--app-accent-soft)] dark:bg-[var(--app-accent-soft)] dark:text-[var(--app-accent-ink)]' },
  '电商工具': { badge: 'bg-[var(--app-accent-warm-soft)] text-[var(--app-accent-warm)] ring-[color-mix(in_srgb,var(--app-accent-warm)_24%,transparent)] dark:bg-[var(--app-accent-warm-soft)] dark:text-[var(--app-accent-warm)] dark:ring-[color-mix(in_srgb,var(--app-accent-warm)_28%,transparent)]', icon: 'text-[var(--app-accent-warm)] bg-[var(--app-accent-warm-soft)] dark:bg-[var(--app-accent-warm-soft)] dark:text-[var(--app-accent-warm)]' },
  'PDF工具': { badge: 'bg-[var(--app-accent-soft)] text-[var(--app-accent-ink)] ring-[color-mix(in_srgb,var(--app-accent)_26%,transparent)] dark:bg-[var(--app-accent-soft)] dark:text-[var(--app-accent-ink)] dark:ring-[color-mix(in_srgb,var(--app-accent)_32%,transparent)]', icon: 'text-[var(--app-accent-ink)] bg-[var(--app-accent-soft)] dark:bg-[var(--app-accent-soft)] dark:text-[var(--app-accent-ink)]' },
  '图片处理': { badge: 'bg-[var(--app-accent-soft)] text-[var(--app-accent-ink)] ring-[color-mix(in_srgb,var(--app-accent)_26%,transparent)] dark:bg-[var(--app-accent-soft)] dark:text-[var(--app-accent-ink)] dark:ring-[color-mix(in_srgb,var(--app-accent)_32%,transparent)]', icon: 'text-[var(--app-accent-ink)] bg-[var(--app-accent-soft)] dark:bg-[var(--app-accent-soft)] dark:text-[var(--app-accent-ink)]' },
  '计算转换': { badge: 'bg-[var(--app-accent-warm-soft)] text-[var(--app-accent-warm)] ring-[color-mix(in_srgb,var(--app-accent-warm)_24%,transparent)] dark:bg-[var(--app-accent-warm-soft)] dark:text-[var(--app-accent-warm)] dark:ring-[color-mix(in_srgb,var(--app-accent-warm)_28%,transparent)]', icon: 'text-[var(--app-accent-warm)] bg-[var(--app-accent-warm-soft)] dark:bg-[var(--app-accent-warm-soft)] dark:text-[var(--app-accent-warm)]' },
  '实用工具': { badge: 'bg-[var(--app-accent-soft)] text-[var(--app-accent-ink)] ring-[color-mix(in_srgb,var(--app-accent)_26%,transparent)] dark:bg-[var(--app-accent-soft)] dark:text-[var(--app-accent-ink)] dark:ring-[color-mix(in_srgb,var(--app-accent)_32%,transparent)]', icon: 'text-[var(--app-accent-ink)] bg-[var(--app-accent-soft)] dark:bg-[var(--app-accent-soft)] dark:text-[var(--app-accent-ink)]' },
  default: { badge: 'bg-[var(--app-accent-soft)] text-[var(--app-accent-ink)] ring-[color-mix(in_srgb,var(--app-accent)_24%,transparent)] dark:bg-[var(--app-accent-soft)] dark:text-[var(--app-accent-ink)] dark:ring-[color-mix(in_srgb,var(--app-accent)_30%,transparent)]', icon: 'text-[var(--app-accent-ink)] bg-[var(--app-accent-soft)] dark:bg-[var(--app-accent-soft)] dark:text-[var(--app-accent-ink)]' },
};

function getCategoryStyles(category: Category) {
  return categoryStyles[category] || categoryStyles.default;
}

const ToolCard = ({
  tool,
  revealIndex = 0,
}: {
  tool: ToolItem;
  revealIndex?: number;
}) => {
  const { t } = useTranslation();
  const Icon = tool.icon;
  const styles = getCategoryStyles(tool.category);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{
        duration: 0.45,
        ease: 'easeOut',
        delay: Math.min(revealIndex * TOOL_CARD_REVEAL_DELAY_STEP, TOOL_CARD_REVEAL_DELAY_MAX),
      }}
      className="group relative h-full overflow-hidden rounded-lg border border-slate-200/80 bg-white/95 transition-colors duration-200 hover:border-[color-mix(in_srgb,var(--app-accent)_34%,var(--app-border))] hover:bg-white dark:border-slate-800 dark:bg-[#282c34]/95 dark:hover:border-[var(--app-accent)] dark:hover:bg-[#2d333d]"
    >
      <Link
        to={tool.path}
        className="flex h-full min-h-[118px] p-5 outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--app-accent)_30%,transparent)]"
      >
        <div className="flex min-w-0 flex-1 items-start gap-4">
          <span
            className={cn(
              'mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ring-1 ring-black/[0.03] transition-transform duration-200 group-hover:scale-105 dark:ring-white/5',
              styles.icon,
            )}
          >
            <Icon size={20} strokeWidth={2.2} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <h3 className="line-clamp-1 text-[15px] font-semibold tracking-normal text-slate-950 transition-colors group-hover:text-[var(--app-accent-ink)] dark:text-white dark:group-hover:text-[var(--app-accent-ink)]">
                {t(`tools.${tool.id}.name`, { defaultValue: tool.name })}
              </h3>
              <ArrowRight
                className="mt-0.5 h-4 w-4 shrink-0 translate-x-1 text-slate-300 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 dark:text-slate-500"
                aria-hidden="true"
              />
            </div>
            <p
              className="mt-2 text-[13px] leading-[1.7] text-slate-600 dark:text-slate-400"
              style={twoLineDescriptionStyle}
            >
              {t(`tools.${tool.id}.description`, { defaultValue: tool.description })}
            </p>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

const AiWorkflowToolCard = ({
  tool,
  revealIndex = 0,
}: {
  tool: ToolItem;
  revealIndex?: number;
}) => {
  const { t } = useTranslation();
  const Icon = tool.icon;
  const styles = getCategoryStyles(tool.category);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{
        duration: 0.36,
        ease: 'easeOut',
        delay: Math.min(revealIndex * 0.025, 0.1),
      }}
      className="group rounded-lg border border-slate-200/75 bg-white/75 transition-colors duration-200 hover:border-[color-mix(in_srgb,var(--app-accent)_34%,var(--app-border))] hover:bg-white dark:border-slate-800 dark:bg-[#282c34]/80 dark:hover:border-[var(--app-accent)] dark:hover:bg-[#2d333d]"
    >
      <Link to={tool.path} className="flex h-full min-h-[112px] flex-col p-4 outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--app-accent)_30%,transparent)]">
        <div className="flex items-start justify-between gap-3">
          <span className={cn('inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md', styles.icon)}>
            <Icon size={17} strokeWidth={2.2} />
          </span>
          <ArrowRight className="h-4 w-4 translate-x-1 text-slate-300 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 dark:text-slate-500" aria-hidden="true" />
        </div>
        <h3 className="mt-4 line-clamp-2 text-[15px] font-semibold leading-5 text-slate-950 transition-colors group-hover:text-[var(--app-accent-ink)] dark:text-white dark:group-hover:text-[var(--app-accent-ink)]">
          {t(`tools.${tool.id}.name`, { defaultValue: tool.name })}
        </h3>
        <p className="mt-2 line-clamp-2 text-[13px] leading-5 text-slate-600 dark:text-slate-400">
          {t(`tools.${tool.id}.description`, { defaultValue: tool.description })}
        </p>
      </Link>
    </motion.article>
  );
};

type HomeProps = {
  initialSearch?: string;
  initialCategory?: Category;
};

export default function Home({ initialSearch = '', initialCategory }: HomeProps) {
  const { t, i18n } = useTranslation();
  const [searchParams] = useClientSearchParamsWithInitialSearch(initialSearch);
  const { recentTools } = useRecentTools();
  const categoryFilter = initialCategory || (searchParams.get('category') as Category | null);
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';
  const isZh = i18n.language?.startsWith('zh');
  const visibleTools = useMemo(() => TOOLS.filter((tool) => !tool.isNoIndex), []);
  const primaryTools = useMemo(
    () => visibleTools.filter((tool) => tool.category === HOME_PRIMARY_CATEGORY),
    [visibleTools],
  );
  const recentPrimaryTools = recentTools.filter((tool) => tool.category === HOME_PRIMARY_CATEGORY);
  const categoryGuide = categoryFilter ? CATEGORY_GUIDES[categoryFilter]?.[isZh ? 'zh' : 'en'] : null;

  const filteredTools = useMemo(() => {
    let result = visibleTools;

    if (categoryFilter) {
      result = result.filter((tool) => tool.category === categoryFilter);
    }

    if (searchQuery) {
      result = result.filter((tool) => {
        const name = t(`tools.${tool.id}.name`, { defaultValue: tool.name }).toLowerCase();
        const description = t(`tools.${tool.id}.description`, { defaultValue: tool.description }).toLowerCase();
        return name.includes(searchQuery) || description.includes(searchQuery);
      });
    }

    return result;
  }, [categoryFilter, searchQuery, t, visibleTools]);

  const aiWorkflowGroups = useMemo(
    () =>
      AI_WORKFLOW_GROUPS.map((group) => ({
        ...group,
        tools: group.toolIds
          .map((toolId) => primaryTools.find((tool) => tool.id === toolId))
          .filter((tool): tool is ToolItem => Boolean(tool)),
      })).filter((group) => group.tools.length > 0),
    [primaryTools],
  );

  if (categoryFilter || searchQuery) {
    return (
      <div className="flex flex-col gap-8">
        <header className="border-b border-slate-200 pb-7 dark:border-slate-800">
          {!categoryFilter ? (
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-[var(--app-accent-ink)] dark:text-[var(--app-accent-ink)]">
              {t('search.results', { query: searchQuery })}
            </p>
          ) : null}
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            {categoryFilter ? t(`common.categories.${categoryFilter}`) : t('search.results', { query: searchQuery })}
          </h1>

          {categoryGuide ? (
            <div className="mt-5 max-w-5xl text-sm leading-6 text-slate-600 dark:text-slate-400">
              <p>{categoryGuide.intro}</p>
              {categoryGuide.relatedPages && categoryGuide.relatedPages.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {categoryGuide.relatedPages.map((page) => (
                    <Link
                      key={page.href}
                      to={page.href}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[color-mix(in_srgb,var(--app-accent)_32%,var(--app-border))] bg-[var(--app-accent-soft)] px-3 py-1.5 text-[13px] font-medium text-[var(--app-accent-ink)] transition-colors hover:border-[var(--app-accent)] hover:bg-[color-mix(in_srgb,var(--app-accent-soft)_72%,white)] dark:border-[color-mix(in_srgb,var(--app-accent)_40%,var(--app-border))] dark:bg-[var(--app-accent-soft)] dark:text-[var(--app-accent-ink)] dark:hover:border-[var(--app-accent)] dark:hover:bg-[var(--app-accent-soft)]"
                    >
                      {page.label}
                      <ArrowRight size={14} />
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </header>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredTools.map((tool, toolIndex) => (
            <ToolCard key={tool.id} tool={tool} revealIndex={toolIndex} />
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-300 py-20 text-center dark:border-slate-700">
            <Clock className="mx-auto h-8 w-8 text-slate-400" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">{t('search.noResults')}</h3>
            <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-500 dark:text-slate-400">
              {t('search.noResultsSub')}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-12">
      <section className="bg-transparent px-4 py-10 text-center sm:px-6 sm:py-12">
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-[var(--app-accent-ink)] dark:text-[var(--app-accent-ink)]">
            {isZh ? 'YouTube 内容工具' : 'YouTube content tool'}
          </p>
          <h1 className="mx-auto max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            {isZh ? '生成适合发布的 YouTube 标题与简介' : 'Generate YouTube titles and descriptions for publishing'}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-slate-600 dark:text-slate-400">
            {isZh
              ? '输入视频主题，获取标题、简介和标签建议，减少发布前的元数据整理时间。'
              : 'Enter a video topic to get title, description, and tag suggestions before you publish.'}
          </p>

          <YoutubeHeroTrial isZh={isZh} />
        </div>
      </section>

      {recentPrimaryTools.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight text-slate-950 dark:text-white">
            {isZh ? '常用工具' : t('common.recent_tools') || 'Recent tools'}
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {recentPrimaryTools.slice(0, 4).map((tool, toolIndex) => (
              <ToolCard key={`recent-${tool.id}`} tool={tool} revealIndex={toolIndex} />
            ))}
          </div>
        </section>
      )}

      <section className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              to={getCategoryPath(HOME_PRIMARY_CATEGORY)}
              className={cn(
                'inline-flex items-center rounded-full px-3 py-1.5 text-[13px] font-semibold ring-1 transition-colors',
                getCategoryStyles(HOME_PRIMARY_CATEGORY).badge,
              )}
            >
              {t(`common.categories.${HOME_PRIMARY_CATEGORY}`)}
            </Link>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
              {isZh ? '按使用场景查找 AI 工具' : 'Find AI tools by use case'}
            </h2>
          </div>
          <Link
            to={getCategoryPath(HOME_PRIMARY_CATEGORY)}
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--app-accent-ink)] transition-colors hover:text-[var(--app-accent-strong)] dark:text-[var(--app-accent-ink)] dark:hover:text-[var(--app-accent-strong)]"
          >
            {t('common.viewMore')}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="space-y-8">
          {aiWorkflowGroups.map((group) => (
            <section key={group.id} id={`ai-${group.id}`} className="scroll-mt-24">
              <div className="mb-3 flex items-center justify-between gap-3 border-b border-slate-200/80 pb-3 dark:border-slate-800">
                <h3 className="text-[15px] font-semibold text-slate-950 dark:text-white">
                  {isZh ? group.titleZh : group.titleEn}
                </h3>
                <span className="text-[12px] font-medium text-slate-500 dark:text-slate-400">
                  {isZh ? `${group.tools.length} 个工具` : `${group.tools.length} tools`}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {group.tools.map((tool, toolIndex) => (
                  <AiWorkflowToolCard key={tool.id} tool={tool} revealIndex={toolIndex} />
                ))}
              </div>
            </section>
          ))}
        </div>

        {primaryTools.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white/60 py-20 text-center dark:border-slate-700 dark:bg-[#282c34]/60">
            <Clock className="mx-auto h-8 w-8 text-slate-400" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">{t('search.noResults')}</h3>
            <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-500 dark:text-slate-400">
              {t('search.noResultsSub')}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
