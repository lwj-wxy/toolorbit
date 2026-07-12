'use client';

import { type CSSProperties, FormEvent, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Calculator,
  Clock,
  Languages,
  type LucideIcon,
  Search,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  ReceiptText,
} from 'lucide-react';
import { Category, ToolItem, TOOLS } from '../data/tools';
import { detectLocaleFromPathname, localizedPath } from '../lib/i18n-routing';
import { Link, useClientSearchParamsWithInitialSearch } from '../lib/navigation';
import { cn } from '../lib/utils';

const TOOL_CARD_REVEAL_DELAY_STEP = 0.035;
const TOOL_CARD_REVEAL_DELAY_MAX = 0.14;
const twoLineDescriptionStyle: CSSProperties = {
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
  overflow: 'hidden',
  minHeight: '2.75rem',
  maxHeight: '2.75rem',
};

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

const HERO_CATEGORIES: Array<{ category: Category; icon: LucideIcon }> = [{ category: '电商工具', icon: ShoppingCart }];

const LANDING_FEATURES: Array<{
  icon: LucideIcon;
  titleZh: string;
  titleEn: string;
  descriptionZh: string;
  descriptionEn: string;
}> = [
  {
    icon: Sparkles,
    titleZh: 'Etsy 上架工作流',
    titleEn: 'Etsy listing workflow',
    descriptionZh: '从商品信息整理到标题、描述和标签草稿，先生成内容，再按商品事实逐项复核。',
    descriptionEn: 'Turn product details into editable titles, descriptions, and tags, then review each claim before publishing.',
  },
  {
    icon: Calculator,
    titleZh: 'Etsy 费用和定价',
    titleEn: 'Etsy fees and pricing',
    descriptionZh: '拆分刊登费、交易费、支付处理费和站外广告费，按成本与目标利润反推售价。',
    descriptionEn: 'Break down listing, transaction, payment, and Offsite Ads costs, then price from real costs and target profit.',
  },
  {
    icon: ShieldCheck,
    titleZh: '商品图和合规检查',
    titleEn: 'Product assets and compliance',
    descriptionZh: '检查商品图片、包装和标签，整理跨境商品的合规风险与报关信息。',
    descriptionEn: 'Review product images, packaging, labels, and customs details before publishing internationally.',
  },
  {
    icon: ShoppingCart,
    titleZh: '市场和竞品判断',
    titleEn: 'Market and competitor checks',
    descriptionZh: '整理搜索词、比较竞品定位，并在发布前检查商品的市场切入点。',
    descriptionEn: 'Group search terms, compare competitor positioning, and review the market angle before publishing.',
  },
];

const LANDING_SOLUTIONS: Array<{
  icon: LucideIcon;
  titleZh: string;
  titleEn: string;
  descriptionZh: string;
  descriptionEn: string;
  tools: Array<{ label: string; href: string }>;
}> = [
  {
    icon: ShoppingCart,
    titleZh: 'Etsy 卖家',
    titleEn: 'Etsy sellers',
    descriptionZh: '写 Listing，检查商品图，计算手续费和税费，完成发布前的关键检查。',
    descriptionEn: 'Write listings, review product images, and estimate fees before publishing an Etsy product.',
    tools: [
      { label: 'AI Listing 生成器', href: '/tools/ai/listing-generator' },
      { label: 'Etsy 手续费计算', href: '/tools/ecommerce/etsy-fee-calculator' },
    ],
  },
  {
    icon: Languages,
    titleZh: '定价和上架决策',
    titleEn: 'Pricing and listing decisions',
    descriptionZh: '先算清平台费用和目标利润，再决定商品售价与上架文案。',
    descriptionEn: 'Calculate platform costs and target profit before deciding the price and listing copy.',
    tools: [
      { label: 'Etsy 费用计算器', href: '/tools/ecommerce/etsy-fee-calculator' },
      { label: 'Etsy 定价计算器', href: '/tools/ecommerce/etsy-pricing-calculator' },
    ],
  },
];

const LANDING_FAQS = [
  {
    questionZh: 'ToolOrbit 是否免费？',
    questionEn: 'Is ToolOrbit free?',
    answerZh: '是。当前卖家工作流工具免费使用，不需要订阅或付费解锁。AI 工具会调用模型接口，生成速度和可用性取决于当前接口配置。',
    answerEn: 'Yes. The seller workflow tools are currently free to use, with no subscription or paid unlocks. AI tools call model APIs, so generation speed and availability depend on the current API configuration.',
  },
  {
    questionZh: '哪些工具会在浏览器本地处理？',
    questionEn: 'Which tools run in the browser?',
    answerZh: 'Etsy 费用、定价、广告和监管费计算会在浏览器中处理，输入的金额不会发送到服务器。涉及 AI 生成、图片检查或 HS 编码的工具需要把输入发送到模型接口。',
    answerEn: 'Etsy fee, pricing, ads, and regulatory calculations run in the browser, so the amounts you enter are not sent to a server. AI generation, image checks, and HS code assistance send input to a model API.',
  },
  {
    questionZh: 'AI 生成结果能直接发布吗？',
    questionEn: 'Can I publish AI output directly?',
    answerZh: '建议先检查事实、商品参数、平台规则、价格、库存和合规表述。ToolOrbit 把 AI 结果当作可编辑草稿。',
    answerEn: 'Review facts, product specs, platform rules, pricing, inventory, and compliance wording before publishing. ToolOrbit treats AI output as an editable draft.',
  },
  {
    questionZh: '费用计算结果等同平台账单吗？',
    questionEn: 'Do fee calculators match platform invoices?',
    answerZh: '计算器用于估算。平台账单还可能包含地区、广告、退款、汇率和账户级规则。',
    answerEn: 'Use calculators for estimates. Platform invoices can include region rules, ads, refunds, exchange rates, and account-level settings.',
  },
];

type ListingTrialSections = {
  title: string;
  description: string;
  tags: string;
  social: string;
};

const parseMarkedSection = (content: string, marker: keyof ListingTrialSections): string => {
  const pattern = new RegExp(`\\[${marker.toUpperCase()}\\]([\\s\\S]*?)(?=\\n\\[[A-Z_]+\\]|$)`, 'i');
  const match = content.match(pattern);
  return match?.[1]?.trim() || '';
};

const parseListingTrialSections = (content: string): ListingTrialSections => ({
  title: parseMarkedSection(content, 'title'),
  description: parseMarkedSection(content, 'description'),
  tags: parseMarkedSection(content, 'tags'),
  social: parseMarkedSection(content, 'social'),
});

const splitPreviewLines = (content: string): string[] =>
  content
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-*]\s*/, '').trim())
    .filter(Boolean)
    .slice(0, 4);

const LandingSectionHeader = ({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) => (
  <div className="mx-auto max-w-3xl text-center">
    <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--app-accent-ink)]">
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--app-accent)]" aria-hidden="true" />
      {eyebrow}
    </div>
    <h2 className="mt-4 text-2xl font-black tracking-[-0.03em] text-[var(--app-text)] sm:text-3xl">
      {title}
    </h2>
    <p className="mt-3 text-[15px] leading-7 text-[var(--app-muted)]">{description}</p>
  </div>
);

const ListingTrialPanel = ({ isZh }: { isZh: boolean }) => {
  const [productName, setProductName] = useState(isZh ? '个性化皮革托特包' : 'Personalized leather tote bag');
  const [platform, setPlatform] = useState('Etsy');
  const [features, setFeatures] = useState(
    isZh ? '手工皮革，可定制首字母，礼品包装，适合通勤和日常收纳。' : 'Handmade leather, custom initials, gift packaging, commute and daily carry.',
  );
  const [activePlatform, setActivePlatform] = useState(platform);
  const [generatedText, setGeneratedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const previewSections = parseListingTrialSections(generatedText);
  const descriptionLines = splitPreviewLines(previewSections.description);
  const tagItems = previewSections.tags
    .split(/[,，\n]/)
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 6);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedProductName = productName.trim();
    if (!trimmedProductName) {
      setErrorMessage(isZh ? '请先输入商品名称。' : 'Enter a product name first.');
      return;
    }

    setActivePlatform(platform);
    setGeneratedText('');
    setErrorMessage('');
    setIsGenerating(true);

    try {
      const response = await fetch('/api/listing-craft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          productInfo: trimmedProductName,
          details: features,
          keywords: '',
          tone: 'persuasive',
          targetAudience: '',
          language: isZh ? 'Chinese' : 'English',
        }),
      });

      if (!response.body) {
        throw new Error(isZh ? '接口没有返回内容。' : 'The API returned no content.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let pendingText = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        pendingText += decoder.decode(value, { stream: true });
        const lines = pendingText.split('\n');
        pendingText = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (!data || data === '[DONE]') continue;

          const responseData = JSON.parse(data) as { content?: string; error?: string };
          if (responseData.error) throw new Error(responseData.error);
          if (responseData.content) {
            setGeneratedText((currentText) => currentText + responseData.content);
          }
        }
      }

      if (!response.ok) {
        throw new Error(isZh ? '生成失败，请稍后再试。' : 'Generation failed. Please try again.');
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : isZh ? '生成失败，请稍后再试。' : 'Generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className="mt-10 w-full max-w-6xl text-left">
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={handleSubmit} className="border-t-2 border-[var(--app-accent)] bg-[var(--app-surface)] p-5 shadow-[var(--app-shadow-md)] sm:p-7">
          <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--app-accent-ink)]">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            {isZh ? 'AI Listing 生成器' : 'AI Listing Generator'}
          </div>
          <h2 className="mt-4 text-xl font-black tracking-[-0.02em] text-[var(--app-text)]">
            {isZh ? '生成商品标题、描述和标签' : 'Generate a title, description, and tags'}
          </h2>
          <p className="mt-2 text-[14px] leading-6 text-[var(--app-muted)]">
            {isZh
              ? '先用一个商品样本试写标题、描述和标签。需要语气、语言和更长文案时，再打开完整工具。'
              : 'Try a short listing draft here. Open the full tool when you need tone, language, tags, and longer copy blocks.'}
          </p>

          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="text-[13px] font-semibold text-[var(--app-text)]">
                {isZh ? '商品名称' : 'Product name'}
              </span>
              <input
                value={productName}
                onChange={(event) => setProductName(event.target.value)}
                className="mt-2 h-12 w-full border border-[var(--app-border)] bg-[var(--app-bg)] px-4 text-[14px] text-[var(--app-text)] outline-none transition-colors placeholder:text-[var(--app-muted)] focus:border-[var(--app-accent)]"
                placeholder={isZh ? '例如：可定制猫咪项链' : 'Example: custom cat necklace'}
              />
            </label>

            <label className="block">
              <span className="text-[13px] font-semibold text-[var(--app-text)]">
                {isZh ? '销售平台' : 'Marketplace'}
              </span>
              <select
                value={platform}
                onChange={(event) => setPlatform(event.target.value)}
                className="mt-2 h-12 w-full cursor-pointer border border-[var(--app-border)] bg-[var(--app-bg)] px-4 text-[14px] text-[var(--app-text)] outline-none transition-colors focus:border-[var(--app-accent)]"
              >
                {['Etsy', 'Amazon', 'Shopify', 'eBay'].map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-[13px] font-semibold text-[var(--app-text)]">
                {isZh ? '特色与卖点' : 'Features and selling points'}
              </span>
              <textarea
                value={features}
                onChange={(event) => setFeatures(event.target.value)}
                rows={3}
                className="mt-2 w-full resize-none border border-[var(--app-border)] bg-[var(--app-bg)] px-4 py-3 text-[14px] leading-6 text-[var(--app-text)] outline-none transition-colors placeholder:text-[var(--app-muted)] focus:border-[var(--app-accent)]"
                placeholder={isZh ? '例如：手工皮革，可定制首字母，礼品包装' : 'Example: handmade leather, custom initials, gift packaging'}
              />
            </label>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={isGenerating}
              className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 bg-[var(--app-text)] px-5 text-[14px] font-bold text-[var(--app-bg)] transition-colors hover:bg-[var(--app-accent-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-accent)] disabled:cursor-wait disabled:opacity-60"
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              {isGenerating ? (isZh ? '正在生成...' : 'Generating...') : isZh ? '生成 Listing 文案' : 'Generate listing copy'}
            </button>
            <Link
              to="/tools/ai/listing-generator"
              className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 border border-[var(--app-border)] bg-transparent px-5 text-[14px] font-bold text-[var(--app-text)] transition-colors hover:border-[var(--app-accent)] hover:text-[var(--app-accent-ink)]"
            >
              {isZh ? '打开完整工具' : 'Open full tool'}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </form>

        <div className="bg-[#2b211e] p-5 text-[#fff8ef] shadow-[var(--app-shadow-md)] sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/12 pb-4">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-wide text-[#8db4ff]">
                {isZh ? '输出预览' : 'Output preview'}
              </p>
              <h3 className="mt-1 text-lg font-black">
                {previewSections.title || (isGenerating ? (isZh ? '正在生成标题...' : 'Generating title...') : isZh ? '生成后的标题会显示在这里' : 'The generated title will appear here')}
              </h3>
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-[12px] font-semibold text-[#cfe0ff]">
              {activePlatform}
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {errorMessage ? (
              <p className="rounded-2xl border border-[#ffb4b4]/30 bg-[#ff6b6b]/10 p-3 text-[13px] leading-5 text-[#ffd7d7]">
                {errorMessage}
              </p>
            ) : null}

            <div>
              <p className="text-[12px] font-semibold text-[#8db4ff]">{isZh ? '描述要点' : 'Description notes'}</p>
              {descriptionLines.length > 0 ? (
                <ul className="mt-2 space-y-2 text-[14px] leading-6 text-[#e8efff]">
                  {descriptionLines.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#63e6be]" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-[14px] leading-6 text-[#cfe0ff]">
                  {isGenerating ? (isZh ? '正在接收描述内容...' : 'Receiving description...') : isZh ? '填写左侧内容后生成。' : 'Fill in the form and generate copy.'}
                </p>
              )}
            </div>

            <div>
              <p className="text-[12px] font-semibold text-[#8db4ff]">{isZh ? '标签方向' : 'Tag direction'}</p>
              {tagItems.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {tagItems.map((tag) => (
                    <span key={tag} className="rounded-full border border-white/14 bg-white/8 px-3 py-1 text-[12px] font-semibold text-[#dce7ff]">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-[14px] leading-6 text-[#cfe0ff]">
                  {isZh ? '标签会随结果一起返回。' : 'Tags will return with the generated copy.'}
                </p>
              )}
            </div>

            {previewSections.social ? (
              <p className="rounded-2xl border border-white/14 bg-white/8 p-3 text-[12px] leading-5 text-[#dce7ff]">
                {previewSections.social}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
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

type HomeProps = {
  initialSearch?: string;
  initialCategory?: Category;
};

export default function Home({ initialSearch = '', initialCategory }: HomeProps) {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const pathname = usePathname() || '/';
  const [searchParams] = useClientSearchParamsWithInitialSearch(initialSearch);
  const categoryFilter = initialCategory || (searchParams.get('category') as Category | null);
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';
  const isZh = i18n.language?.startsWith('zh');
  const visibleTools = useMemo(() => TOOLS.filter((tool) => !tool.isNoIndex), []);
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
    <div className="-mt-7 flex flex-col gap-12 pb-12 md:-mt-9">
      <section className="seller-hero-grid relative left-1/2 min-h-[610px] w-screen -translate-x-1/2 overflow-hidden border-b border-[color-mix(in_srgb,var(--app-accent)_18%,var(--app-border))] px-4 pb-16 pt-10 sm:px-8 sm:pt-14 lg:px-14 lg:pt-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(42rem 22rem at 15% 0%, rgba(214,99,70,0.16), transparent 70%), radial-gradient(30rem 18rem at 86% 32%, rgba(46,117,109,0.14), transparent 72%)',
          }}
        />

        <div className="relative mx-auto max-w-[1240px]">
          <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_.98fr] lg:gap-16">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.16em] text-[var(--app-accent-ink)]">
                <span className="h-2 w-2 rounded-full bg-[var(--app-accent)] shadow-[0_0_0_6px_rgba(214,99,70,0.12)]" aria-hidden="true" />
                {isZh ? 'Etsy 卖家工作台' : 'Etsy seller workspace'}
              </div>

              <h1 className="mt-6 max-w-[680px] text-[42px] font-black leading-[0.98] tracking-[-0.04em] text-[var(--app-text)] sm:text-[66px] lg:text-[78px]">
                {isZh ? (
                  <>
                    把每次上架，
                    <span className="block text-[var(--app-accent-ink)]">算清楚再发布</span>
                  </>
                ) : (
                  <>
                    Make every listing
                    <span className="block text-[var(--app-accent-ink)]">ready to publish.</span>
                  </>
                )}
              </h1>

              <p className="mx-auto mt-7 max-w-[570px] text-[16px] leading-8 text-[var(--app-muted)] lg:mx-0">
                {isZh
                  ? '从商品文案、关键词到费用和目标利润，ToolOrbit 帮你在发布前完成一轮卖家检查。'
                  : 'Use ToolOrbit to draft listing copy, check keywords, and work out fees and target profit before publishing.'}
              </p>

              <form
                onSubmit={handleHeroSearch}
                className="hero-search-form mt-9 flex w-full max-w-[620px] flex-col gap-2 border-b-2 border-[var(--app-text)] bg-[var(--app-surface)] p-2 shadow-[0_18px_35px_-28px_rgba(59,38,28,0.6)] transition-colors focus-within:border-[var(--app-accent)] sm:flex-row sm:items-center"
              >
                <div className="flex min-h-14 min-w-0 flex-1 items-center gap-3 px-4">
                  <Search className="h-5 w-5 shrink-0 text-[var(--app-muted)]" aria-hidden="true" />
                  <input
                    name="search"
                    type="search"
                    aria-label={t('common.searchPlaceholder')}
                    placeholder={isZh ? '搜索费用、定价、Listing...' : 'Search fees, pricing, listings...'}
                    className="min-w-0 flex-1 border-0 bg-transparent text-[15px] text-[var(--app-text)] outline-none placeholder:text-[var(--app-muted)]"
                  />
                  <kbd className="hidden shrink-0 border border-[var(--app-border)] bg-[var(--app-bg)] px-2 py-1 font-sans text-[11px] font-medium text-[var(--app-muted)] sm:inline-block">
                    Ctrl K
                  </kbd>
                </div>
                <button
                  type="submit"
                  className="inline-flex min-h-14 cursor-pointer items-center justify-center gap-2 bg-[var(--app-text)] px-7 text-[15px] font-bold text-[var(--app-bg)] transition-colors hover:bg-[var(--app-accent-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-accent)]"
                >
                  {isZh ? '找工具' : 'Find a tool'}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </form>
            </div>

            <div className="seller-hero-visual relative mx-auto w-full max-w-[530px] overflow-hidden p-5 text-[#fff8ef] sm:p-7">
              <div className="flex items-center justify-between border-b border-white/15 pb-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#e79a7e]">Seller check / 01</p>
                  <h2 className="mt-2 text-[21px] font-black tracking-[-0.02em]">{isZh ? '本周商品决策' : 'This week’s listing check'}</h2>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f2c2a9] text-[#2b211e]">
                  <ReceiptText className="h-5 w-5" aria-hidden="true" />
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="border border-white/12 bg-white/8 p-4">
                  <p className="text-[11px] text-[#cbb8ac]">{isZh ? '预计净收入' : 'Estimated payout'}</p>
                  <p className="mt-2 text-3xl font-black tracking-[-0.04em]">$38.42</p>
                  <p className="mt-1 text-[11px] font-semibold text-[#74c3b5]">+18.6% margin</p>
                </div>
                <div className="border border-white/12 bg-white/8 p-4">
                  <p className="text-[11px] text-[#cbb8ac]">{isZh ? '已核对项目' : 'Checks completed'}</p>
                  <p className="mt-2 text-3xl font-black tracking-[-0.04em]">07/09</p>
                  <p className="mt-1 text-[11px] font-semibold text-[#f2c2a9]">2 need review</p>
                </div>
              </div>
              <div className="mt-6 border-t border-white/15 pt-5">
                <div className="flex items-center justify-between text-[12px] font-semibold">
                  <span className="text-[#cbb8ac]">{isZh ? '费用拆分' : 'Fee breakdown'}</span>
                  <span className="text-[#f2c2a9]">$11.58</span>
                </div>
                <div className="seller-workbench-line mt-3 h-3 w-full" />
                <div className="mt-3 flex justify-between text-[11px] text-[#cbb8ac]">
                  <span>{isZh ? '交易费' : 'Transaction'}</span><span>{isZh ? '支付处理' : 'Payment'} </span><span>{isZh ? '广告与其他' : 'Ads + other'}</span>
                </div>
              </div>
              <div className="mt-7 flex items-center gap-3 border-t border-white/15 pt-5">
                <TrendingUp className="h-4 w-4 text-[#74c3b5]" aria-hidden="true" />
                <p className="text-[12px] leading-5 text-[#d8c8be]">{isZh ? '先看成本，再决定标题、价格和发布节奏。' : 'Know the cost before you choose the price and publish.'}</p>
              </div>
            </div>
          </div>

          <ListingTrialPanel isZh={isZh} />
        </div>
      </section>

      <section className="space-y-8">
        <LandingSectionHeader
          eyebrow={isZh ? '按任务选择工具' : 'Choose by task'}
          title={isZh ? '从草稿、检查到提交前复核' : 'Draft, check, and review before publishing'}
          description={
            isZh
              ? 'AI 工具适合起草，浏览器工具适合检查和转换。每个结果都应该在发布、上传或报价前再确认。'
              : 'Use AI tools for drafts and browser tools for checks or conversions. Review each result before publishing, uploading, or quoting.'
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {LANDING_FEATURES.map(({ icon: FeatureIcon, titleZh, titleEn, descriptionZh, descriptionEn }, featureIndex) => (
            <motion.article
              key={titleEn}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.36, ease: 'easeOut', delay: Math.min(featureIndex * 0.04, 0.12) }}
              className="border-t border-[var(--app-border)] bg-[var(--app-surface)] p-5 shadow-[var(--app-shadow-sm)] sm:p-6"
            >
              <span className="flex h-11 w-11 items-center justify-center bg-[var(--app-accent-soft)] text-[var(--app-accent-ink)]">
                <FeatureIcon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-[16px] font-black text-[var(--app-text)]">{isZh ? titleZh : titleEn}</h3>
              <p className="mt-2 text-[13px] leading-6 text-[var(--app-muted)]">{isZh ? descriptionZh : descriptionEn}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <LandingSectionHeader
          eyebrow={isZh ? '常用工具' : 'Popular uses'}
          title={isZh ? '你要做什么？' : 'What do you need to do?'}
          description={
            isZh
              ? '从具体任务进入工具，避免在完整目录里来回寻找。'
              : 'Start from a seller task instead of scanning a general tool catalog.'
          }
        />
        <div className="grid gap-4 lg:grid-cols-2">
          {LANDING_SOLUTIONS.map(({ icon: SolutionIcon, titleZh, titleEn, descriptionZh, descriptionEn, tools }) => (
            <article key={titleEn} className="border-y border-[var(--app-border)] bg-[var(--app-surface)] p-5 sm:p-7">
              <div className="flex gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center bg-[var(--app-accent-warm-soft)] text-[var(--app-accent-warm)]">
                  <SolutionIcon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-[17px] font-black text-[var(--app-text)]">{isZh ? titleZh : titleEn}</h3>
                  <p className="mt-2 text-[14px] leading-6 text-[var(--app-muted)]">{isZh ? descriptionZh : descriptionEn}</p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {tools.map((tool) => (
                  <Link
                    key={tool.href}
                    to={tool.href}
                    className="inline-flex cursor-pointer items-center gap-1.5 border-b border-[var(--app-border)] px-0 py-1.5 text-[13px] font-semibold text-[var(--app-text)] transition-colors hover:border-[var(--app-accent)] hover:text-[var(--app-accent-ink)]"
                  >
                    {tool.label}
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <LandingSectionHeader
          eyebrow={isZh ? 'FAQ' : 'FAQ'}
          title={isZh ? '常见问题' : 'Common questions'}
          description={
            isZh
              ? '先确认哪些输入会留在浏览器、哪些结果需要人工复核、哪些费用只能作为估算。'
              : 'Check what stays in the browser, which results need review, and where fee numbers remain estimates.'
          }
        />
        <div className="mx-auto grid max-w-5xl gap-3">
          {LANDING_FAQS.map(({ questionZh, questionEn, answerZh, answerEn }) => (
            <details
              key={questionEn}
              className="group border-b border-[var(--app-border)] bg-[var(--app-surface)] px-5 py-4"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-black text-[var(--app-text)]">
                <span>{isZh ? questionZh : questionEn}</span>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center bg-[var(--app-accent-soft)] text-[var(--app-accent-ink)] transition-transform group-open:rotate-90">
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </summary>
              <p className="mt-3 max-w-3xl text-[14px] leading-6 text-[var(--app-muted)]">
                {isZh ? answerZh : answerEn}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section className="text-center">
        <h2 className="text-xl font-black tracking-[-0.03em] text-[var(--app-text)]">
          {isZh ? '按分类找工具' : 'Browse tool categories'}
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-[13px] leading-6 text-[var(--app-muted)]">
          Open the Etsy tools directory to see the seller workflow tools.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {HERO_CATEGORIES.map(({ category, icon: ChipIcon }) => {
            const accent = getCategoryAccent(category);
            return (
              <Link
                key={category}
                to="/tools/ecommerce"
                style={accentStyle(accent)}
                className="inline-flex cursor-pointer items-center gap-1.5 border border-[var(--app-border)] bg-[var(--app-surface)] px-3.5 py-2 text-[13px] font-semibold text-[var(--app-text)] transition-colors hover:border-[color-mix(in_srgb,var(--c)_42%,var(--app-border))] hover:text-[var(--app-accent-ink)]"
              >
                <ChipIcon className="h-3.5 w-3.5" style={{ color: 'var(--c)' }} aria-hidden="true" />
                {t(`common.categories.${category}`)}
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
