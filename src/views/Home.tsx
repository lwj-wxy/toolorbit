'use client';

import { type CSSProperties, FormEvent, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Bot,
  Calculator,
  Clock,
  Code2,
  FileText,
  Image as ImageIcon,
  Languages,
  Loader2,
  type LucideIcon,
  Search,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Trophy,
  Zap,
} from 'lucide-react';
import { CATEGORY_GUIDES } from '../data/categoryGuides';
import { Category, ToolItem, TOOLS } from '../data/tools';
import { useRecentTools } from '../hooks/useRecentTools';
import { getCategoryPath } from '../lib/category-paths';
import { detectLocaleFromPathname, localizedPath } from '../lib/i18n-routing';
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
    toolIds: ['ai-youtube-generator', 'ai-video-script', 'ai-xiaohongshu', 'ai-text-polisher', 'ai-translator'],
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
    toolIds: ['weekly-report-generator', 'ai-resume-optimizer', 'ai-excel-formula', 'ai-regex'],
  },
  {
    id: 'commerce',
    titleZh: '出海与电商',
    titleEn: 'Global commerce',
    toolIds: [
      'ai-product-image-generator',
      'ai-product-asset-checker',
      'ai-hs-code-assistant',
      'listing-generator',
      'keyword-analyzer',
      'competitor-tracker',
      'market-insights',
    ],
  },
];

// Per-category accent hue. Applied via the --c custom property and color-mix so it
// reads on both light and dark surfaces, and bypasses the global accent-flattening
// layer in index.css (which only targets named tailwind color utilities).
const CATEGORY_ACCENT: Record<string, string> = {
  'AI 工具': '#6366f1',
  '开发者工具': '#3b82f6',
  '站长工具': '#06b6d4',
  '文本排版': '#8b5cf6',
  '生成器': '#d946ef',
  '电商工具': '#f97316',
  'PDF工具': '#ef4444',
  '图片处理': '#14b8a6',
  '计算转换': '#f59e0b',
  '实用工具': '#6366f1',
};

const getCategoryAccent = (category: Category): string => CATEGORY_ACCENT[category] ?? '#6366f1';

const accentStyle = (accent: string): CSSProperties => ({ '--c': accent }) as CSSProperties;

const HERO_CATEGORIES: Array<{ category: Category; icon: LucideIcon }> = [
  { category: 'AI 工具', icon: Bot },
  { category: '开发者工具', icon: Code2 },
  { category: '图片处理', icon: ImageIcon },
  { category: 'PDF工具', icon: FileText },
  { category: '电商工具', icon: ShoppingCart },
  { category: '计算转换', icon: Calculator },
];

type MatchPreviewSectionKey = 'result' | 'scores' | 'reason' | 'risk';

const parseMatchPreviewResult = (text: string): Record<MatchPreviewSectionKey, string> => {
  const sections = { result: '', scores: '', reason: '', risk: '' };
  if (!text) return sections;

  const sectionPattern = (marker: string) =>
    new RegExp(`\\[${marker}\\]\\s*:?\\s*([\\s\\S]*?)(?=\\n?\\[[A-Z_]+\\]|$)`, 'i');

  sections.result = text.match(sectionPattern('RESULT'))?.[1]?.trim() || '';
  sections.scores = text.match(sectionPattern('SCORES'))?.[1]?.trim() || '';
  sections.reason = text.match(sectionPattern('REASON'))?.[1]?.trim() || '';
  sections.risk = text.match(sectionPattern('RISK_NOTES'))?.[1]?.trim() || '';

  return sections;
};

const WorldCupHeroTrial = ({ isZh }: { isZh: boolean }) => {
  const [teamA, setTeamA] = useState('');
  const [teamB, setTeamB] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sections = parseMatchPreviewResult(result);
  const hasStructuredResult = Object.values(sections).some(Boolean);

  const requestMatchPreview = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTeamA = teamA.trim();
    const trimmedTeamB = teamB.trim();
    if (!trimmedTeamA || !trimmedTeamB) return;

    setLoading(true);
    setError('');
    setResult('');

    let currentText = '';

    try {
      const response = await fetch('/api/worldcup-match-predictor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamA: trimmedTeamA,
          teamB: trimmedTeamB,
          language: isZh ? 'Chinese' : 'English',
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

  const fields: Array<{ key: MatchPreviewSectionKey; label: string }> = [
    { key: 'result', label: isZh ? '结果倾向' : 'Result lean' },
    { key: 'scores', label: isZh ? '可能比分' : 'Likely scores' },
    { key: 'reason', label: isZh ? '简短理由' : 'Why' },
    { key: 'risk', label: isZh ? '风险提示' : 'Risk notes' },
  ];

  return (
    <form
      onSubmit={requestMatchPreview}
      className="mx-auto mt-8 max-w-4xl rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5 text-left shadow-[var(--app-shadow-md)] sm:p-6"
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_240px]">
        <div className="min-w-0">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--app-accent-soft)] text-[var(--app-accent-ink)]">
              <Trophy className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-base font-semibold text-[var(--app-text)]">
                {isZh ? '世界杯比赛结果预测' : 'World Cup Match Predictor'}
              </h2>
              <p className="mt-0.5 text-[13px] text-[var(--app-muted)]">
                {isZh ? '输入两支球队，生成胜平负倾向和比分参考。' : 'Enter two teams to get a result and scoreline preview.'}
              </p>
            </div>
          </div>

          <label className="mb-2 block text-[13px] font-semibold text-[var(--app-text)]">
            {isZh ? '球队' : 'Teams'}
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              value={teamA}
              onChange={(event) => setTeamA(event.target.value)}
              placeholder={isZh ? '球队 A，例如：美国' : 'Team A, e.g. United States'}
              className="h-11 w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] px-3 text-sm text-[var(--app-text)] outline-none transition-colors placeholder:text-[var(--app-muted)] focus:border-[var(--app-accent)] focus:bg-[var(--app-surface-strong)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--app-accent)_14%,transparent)]"
            />
            <input
              value={teamB}
              onChange={(event) => setTeamB(event.target.value)}
              placeholder={isZh ? '球队 B，例如：澳大利亚' : 'Team B, e.g. Australia'}
              className="h-11 w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] px-3 text-sm text-[var(--app-text)] outline-none transition-colors placeholder:text-[var(--app-muted)] focus:border-[var(--app-accent)] focus:bg-[var(--app-surface-strong)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--app-accent)_14%,transparent)]"
            />
          </div>
        </div>

        <div className="flex flex-col justify-end gap-2">
          <button
            type="submit"
            disabled={loading || !teamA.trim() || !teamB.trim()}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[var(--app-accent)] px-4 text-sm font-semibold text-white shadow-[var(--app-shadow-md)] transition-colors hover:bg-[var(--app-accent-strong)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Sparkles className="h-4 w-4" aria-hidden="true" />}
            {loading ? (isZh ? '预测中' : 'Predicting') : isZh ? '预测比赛' : 'Predict match'}
          </button>
          <Link
            to="/tools/ai/worldcup-match-predictor"
            className="inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] px-4 text-sm font-semibold text-[var(--app-text)] transition-colors hover:border-[var(--app-accent)] hover:text-[var(--app-accent-ink)]"
          >
            {isZh ? '打开完整工具' : 'Open full tool'}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {(error || loading || result) ? (
        <div className="mt-5 rounded-xl border border-[var(--app-border)] bg-[var(--app-bg-soft)] p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-[13px] font-semibold text-[var(--app-text)]">
              {isZh ? '预测结果' : 'Prediction result'}
            </p>
            {loading ? <Loader2 className="h-4 w-4 animate-spin text-[var(--app-accent-ink)]" aria-hidden="true" /> : null}
          </div>

          {loading && !result ? (
            <p className="text-sm leading-6 text-[var(--app-muted)]">
              {isZh ? '正在生成胜平负倾向和比分参考。' : 'Generating result and scoreline preview.'}
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
                  <section key={key} className="border-b border-[var(--app-border)] pb-3 last:border-b-0 last:pb-0">
                    <h3 className="text-[12px] font-semibold text-[var(--app-accent-ink)]">{label}</h3>
                    <p className="mt-1 whitespace-pre-wrap text-[13px] leading-6 text-[var(--app-text)]">{content}</p>
                  </section>
                );
              })}
            </div>
          ) : null}

          {result && !hasStructuredResult ? (
            <p className="max-h-[260px] overflow-y-auto whitespace-pre-wrap text-[13px] leading-6 text-[var(--app-text)]">{result}</p>
          ) : null}
        </div>
      ) : null}
    </form>
  );
};

const ToolCard = ({
  tool,
  revealIndex = 0,
}: {
  tool: ToolItem;
  revealIndex?: number;
}) => {
  const { t } = useTranslation();
  const Icon = tool.icon;
  const accent = getCategoryAccent(tool.category);

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
      className="group relative h-full"
    >
      <Link
        to={tool.path}
        style={accentStyle(accent)}
        className="relative flex h-full min-h-[120px] overflow-hidden rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5 shadow-[var(--app-shadow-sm)] outline-none transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--c)_45%,var(--app-border))] hover:shadow-[var(--app-shadow-lg)] focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--c)_40%,transparent)]"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--c) 30%, transparent), transparent 70%)' }}
        />
        <div className="relative flex min-w-0 flex-1 items-start gap-4">
          <span
            className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ring-black/[0.03] transition-transform duration-200 group-hover:scale-105 dark:ring-white/5"
            style={{ backgroundColor: 'color-mix(in srgb, var(--c) 14%, transparent)', color: 'var(--c)' }}
          >
            <Icon size={20} strokeWidth={2.2} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <h3 className="line-clamp-1 text-[15px] font-semibold tracking-normal text-[var(--app-text)] transition-colors group-hover:text-[color-mix(in_srgb,var(--c)_72%,var(--app-text))]">
                {t(`tools.${tool.id}.name`, { defaultValue: tool.name })}
              </h3>
              <ArrowRight
                className="mt-0.5 h-4 w-4 shrink-0 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
                style={{ color: 'var(--c)' }}
                aria-hidden="true"
              />
            </div>
            <p
              className="mt-2 text-[13px] leading-[1.7] text-[var(--app-muted)]"
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
  const accent = getCategoryAccent(tool.category);

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
      className="group relative"
    >
      <Link
        to={tool.path}
        style={accentStyle(accent)}
        className="flex h-full min-h-[112px] flex-col rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-4 shadow-[var(--app-shadow-sm)] outline-none transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--c)_45%,var(--app-border))] hover:shadow-[var(--app-shadow-md)] focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--c)_40%,transparent)]"
      >
        <div className="flex items-start justify-between gap-3">
          <span
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-105"
            style={{ backgroundColor: 'color-mix(in srgb, var(--c) 14%, transparent)', color: 'var(--c)' }}
          >
            <Icon size={17} strokeWidth={2.2} />
          </span>
          <ArrowRight
            className="h-4 w-4 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
            style={{ color: 'var(--c)' }}
            aria-hidden="true"
          />
        </div>
        <h3 className="mt-4 line-clamp-2 text-[15px] font-semibold leading-5 text-[var(--app-text)] transition-colors group-hover:text-[color-mix(in_srgb,var(--c)_72%,var(--app-text))]">
          {t(`tools.${tool.id}.name`, { defaultValue: tool.name })}
        </h3>
        <p className="mt-2 line-clamp-2 text-[13px] leading-5 text-[var(--app-muted)]">
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
  const router = useRouter();
  const pathname = usePathname() || '/';
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
  const toolCount = Math.max(1, Math.floor(visibleTools.length / 10) * 10);

  const handleHeroSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = String(formData.get('search') || '').trim();
    const params = new URLSearchParams();
    if (query) params.set('search', query);

    const locale = detectLocaleFromPathname(pathname);
    const homePath = localizedPath('/', locale);
    const nextUrl = params.size ? `${homePath}?${params.toString()}` : homePath;
    const nextSearch = params.size ? `?${params.toString()}` : '';

    router.push(nextUrl);
    window.dispatchEvent(new CustomEvent('toolorbit:searchchange', { detail: nextSearch }));
  };

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
    () => {
      const groupedToolIds = new Set(AI_WORKFLOW_GROUPS.flatMap((group) => group.toolIds));
      const configuredGroups = AI_WORKFLOW_GROUPS.map((group) => ({
        ...group,
        tools: group.toolIds
          .map((toolId) => primaryTools.find((tool) => tool.id === toolId))
          .filter((tool): tool is ToolItem => Boolean(tool)),
      })).filter((group) => group.tools.length > 0);
      const ungroupedTools = primaryTools.filter((tool) => !groupedToolIds.has(tool.id));

      if (ungroupedTools.length === 0) return configuredGroups;

      return [
        ...configuredGroups,
        {
          id: 'more',
          titleZh: '更多 AI 工具',
          titleEn: 'More AI tools',
          toolIds: ungroupedTools.map((tool) => tool.id),
          tools: ungroupedTools,
        },
      ];
    },
    [primaryTools],
  );

  if (categoryFilter || searchQuery) {
    return (
      <div className="flex flex-col gap-8">
        <header className="border-b border-[var(--app-border)] pb-7">
          {!categoryFilter ? (
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-[var(--app-accent-ink)]">
              {t('search.results', { query: searchQuery })}
            </p>
          ) : null}
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--app-text)]">
            {categoryFilter ? t(`common.categories.${categoryFilter}`) : t('search.results', { query: searchQuery })}
          </h1>

          {categoryGuide ? (
            <div className="mt-5 max-w-5xl text-sm leading-6 text-[var(--app-muted)]">
              <p>{categoryGuide.intro}</p>
              {categoryGuide.relatedPages && categoryGuide.relatedPages.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {categoryGuide.relatedPages.map((page) => (
                    <Link
                      key={page.href}
                      to={page.href}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[color-mix(in_srgb,var(--app-accent)_32%,var(--app-border))] bg-[var(--app-accent-soft)] px-3 py-1.5 text-[13px] font-medium text-[var(--app-accent-ink)] transition-colors hover:border-[var(--app-accent)] hover:bg-[color-mix(in_srgb,var(--app-accent-soft)_72%,white)]"
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
          <div className="rounded-2xl border border-dashed border-[var(--app-border)] py-20 text-center">
            <Clock className="mx-auto h-8 w-8 text-[var(--app-muted)]" />
            <h3 className="mt-4 text-lg font-semibold text-[var(--app-text)]">{t('search.noResults')}</h3>
            <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-[var(--app-muted)]">
              {t('search.noResultsSub')}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 pb-12">
      <section className="relative isolate px-4 pb-12 pt-3 text-center sm:px-6 sm:pb-16 sm:pt-5">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[-2.75rem] -z-10 h-[34rem] w-screen max-w-none -translate-x-1/2"
          style={{
            background:
              'radial-gradient(44rem 20rem at 50% 0%, color-mix(in srgb, var(--app-accent) 15%, transparent), transparent 72%)',
          }}
        />
        <div className="mx-auto max-w-4xl">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[color-mix(in_srgb,var(--app-accent)_28%,var(--app-border))] bg-[var(--app-accent-soft)] px-3.5 py-1.5 text-[12px] font-semibold tracking-wide text-[var(--app-accent-ink)] shadow-[var(--app-shadow-sm)]">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            {isZh ? '免费在线工具集合' : 'Free online tools'}
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-[var(--app-text)] sm:text-[2.6rem]">
            {isZh
              ? 'ToolOrbit：开发、电商、文档和 AI 的免费在线工具'
              : 'ToolOrbit: Free online tools for developers, ecommerce, documents, and AI'}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-[var(--app-muted)]">
            {isZh
              ? '一站集合 JSON 格式化、文本对比、Base64、图片压缩、PDF 合并、二维码、电商费率计算，以及 AI 文案、翻译、Listing 生成等几十个工具。大多数工具在浏览器本地处理，打开即用，无需注册。'
              : 'JSON formatting, text diff, Base64, image compression, PDF merge, QR codes, ecommerce fee calculators, plus AI copywriting, translation, and listing generators — dozens of tools in one place. Most run locally in your browser, ready to use with no sign-up.'}
          </p>

          <form
            onSubmit={handleHeroSearch}
            className="hero-search-form relative mx-auto mt-7 flex w-full max-w-xl items-center gap-2 rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] py-2 pl-5 pr-2 shadow-[var(--app-shadow-md)] transition-all focus-within:border-[var(--app-accent)] focus-within:shadow-[var(--app-shadow-lg)] focus-within:ring-4 focus-within:ring-[color-mix(in_srgb,var(--app-accent)_12%,transparent)]"
          >
            <Search className="h-[18px] w-[18px] shrink-0 text-[var(--app-muted)]" aria-hidden="true" />
            <input
              name="search"
              type="search"
              aria-label={t('common.searchPlaceholder')}
              placeholder={t('common.searchPlaceholder')}
              className="min-w-0 flex-1 border-0 bg-transparent text-[14px] text-[var(--app-text)] outline-none placeholder:text-[var(--app-muted)]"
            />
            <kbd className="mr-1 hidden shrink-0 rounded border border-[var(--app-border)] bg-[var(--app-bg-soft)] px-1.5 py-0.5 font-sans text-[10px] font-medium text-[var(--app-muted)] sm:inline-block">
              Ctrl K
            </kbd>
            <button
              type="submit"
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-[var(--app-accent)] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[var(--app-accent-strong)]"
            >
              <Search className="h-4 w-4 sm:hidden" aria-hidden="true" />
              <span className="hidden sm:inline">{isZh ? '搜索' : 'Search'}</span>
            </button>
          </form>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <Link
              to="/tools"
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] px-3.5 py-1.5 text-[13px] font-medium text-[var(--app-text)] shadow-[var(--app-shadow-sm)] transition-all hover:-translate-y-0.5 hover:border-[var(--app-accent)] hover:text-[var(--app-accent-ink)]"
            >
              <Zap className="h-3.5 w-3.5 text-[var(--app-accent-ink)]" aria-hidden="true" />
              {isZh ? '全部工具' : 'All tools'}
            </Link>
            {HERO_CATEGORIES.map(({ category, icon: ChipIcon }) => {
              const accent = getCategoryAccent(category);
              return (
                <Link
                  key={category}
                  to={getCategoryPath(category)}
                  style={accentStyle(accent)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] px-3.5 py-1.5 text-[13px] font-medium text-[var(--app-muted)] shadow-[var(--app-shadow-sm)] transition-all hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--c)_45%,var(--app-border))] hover:text-[var(--app-text)]"
                >
                  <ChipIcon className="h-3.5 w-3.5" style={{ color: 'var(--c)' }} aria-hidden="true" />
                  {t(`common.categories.${category}`)}
                </Link>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13px] text-[var(--app-muted)]">
            <span className="inline-flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-[var(--app-accent-ink)]" aria-hidden="true" />
              {isZh ? `${toolCount}+ 个工具` : `${toolCount}+ tools`}
            </span>
            <span className="text-[var(--app-border)]">·</span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-[var(--app-accent-ink)]" aria-hidden="true" />
              {isZh ? '浏览器本地处理' : 'Runs in your browser'}
            </span>
            <span className="text-[var(--app-border)]">·</span>
            <span className="inline-flex items-center gap-1.5">
              <Languages className="h-3.5 w-3.5 text-[var(--app-accent-ink)]" aria-hidden="true" />
              {isZh ? '中英双语 · 免注册' : 'Bilingual · no sign-up'}
            </span>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight text-[var(--app-text)]">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[var(--app-accent-soft)] text-[var(--app-accent-ink)]">
              <Trophy className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            {isZh ? '应景试用 · 世界杯比赛预测' : 'In season · World Cup match predictor'}
          </h2>
          <Link
            to="/tools/ai/worldcup-match-predictor"
            className="text-[13px] font-semibold text-[var(--app-accent-ink)] hover:underline"
          >
            {isZh ? '打开完整工具 →' : 'Open full tool →'}
          </Link>
        </div>
        <div className="mx-auto w-full max-w-4xl text-center">
          <WorldCupHeroTrial isZh={isZh} />
        </div>
      </section>

      {recentPrimaryTools.length > 0 && (
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight text-[var(--app-text)]">
            <Clock className="h-4 w-4 text-[var(--app-accent-ink)]" aria-hidden="true" />
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
              className="inline-flex items-center gap-1.5 rounded-full border border-[color-mix(in_srgb,var(--app-accent)_28%,var(--app-border))] bg-[var(--app-accent-soft)] px-3 py-1.5 text-[13px] font-semibold text-[var(--app-accent-ink)] shadow-[var(--app-shadow-sm)] transition-colors hover:border-[var(--app-accent)]"
            >
              <Bot className="h-3.5 w-3.5" aria-hidden="true" />
              {t(`common.categories.${HOME_PRIMARY_CATEGORY}`)}
            </Link>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-[var(--app-text)]">
              {isZh ? '按使用场景查找 AI 工具' : 'Find AI tools by use case'}
            </h2>
          </div>
          <Link
            to={getCategoryPath(HOME_PRIMARY_CATEGORY)}
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--app-accent-ink)] transition-colors hover:text-[var(--app-accent-strong)]"
          >
            {t('common.viewMore')}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="space-y-8">
          {aiWorkflowGroups.map((group) => (
            <section key={group.id} id={`ai-${group.id}`} className="scroll-mt-24">
              <div className="mb-3 flex items-center justify-between gap-3 border-b border-[var(--app-border)] pb-3">
                <h3 className="flex items-center gap-2 text-[15px] font-semibold text-[var(--app-text)]">
                  <span className="h-4 w-1 rounded-full bg-[var(--app-accent)]" aria-hidden="true" />
                  {isZh ? group.titleZh : group.titleEn}
                </h3>
                <span className="text-[12px] font-medium text-[var(--app-muted)]">
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
          <div className="rounded-2xl border border-dashed border-[var(--app-border)] bg-[var(--app-surface)] py-20 text-center">
            <Clock className="mx-auto h-8 w-8 text-[var(--app-muted)]" />
            <h3 className="mt-4 text-lg font-semibold text-[var(--app-text)]">{t('search.noResults')}</h3>
            <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-[var(--app-muted)]">
              {t('search.noResultsSub')}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
