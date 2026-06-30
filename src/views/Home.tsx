'use client';

import { type CSSProperties, FormEvent, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Calculator,
  Clock,
  Code2,
  FileText,
  Image as ImageIcon,
  Languages,
  type LucideIcon,
  Search,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
} from 'lucide-react';
import { CATEGORY_GUIDES } from '../data/categoryGuides';
import { Category, ToolItem, TOOLS } from '../data/tools';
import { getCategoryPath } from '../lib/category-paths';
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

const HERO_CATEGORIES: Array<{ category: Category; icon: LucideIcon }> = [
  { category: '开发者工具', icon: Code2 },
  { category: '电商工具', icon: ShoppingCart },
  { category: 'PDF工具', icon: FileText },
  { category: '图片处理', icon: ImageIcon },
  { category: '计算转换', icon: Calculator },
  { category: '文本排版', icon: Languages },
];

const LANDING_FEATURES: Array<{
  icon: LucideIcon;
  titleZh: string;
  titleEn: string;
  descriptionZh: string;
  descriptionEn: string;
}> = [
  {
    icon: Sparkles,
    titleZh: 'AI 写作工具',
    titleEn: 'AI writing tools',
    descriptionZh: '生成商品文案、标题、脚本和翻译，适合上架、社媒和日常内容整理。',
    descriptionEn: 'Create product copy, titles, scripts, and translations for listings, social posts, and everyday writing.',
  },
  {
    icon: ShieldCheck,
    titleZh: '文件和图片工具',
    titleEn: 'File and image tools',
    descriptionZh: '压缩图片、合并 PDF、转换格式，常见文件处理可以直接在浏览器完成。',
    descriptionEn: 'Compress images, merge PDFs, and convert formats directly in the browser.',
  },
  {
    icon: Calculator,
    titleZh: '电商费用计算',
    titleEn: 'Ecommerce fee calculators',
    descriptionZh: '计算 Etsy、Stripe、PayPal、VAT 和 GST，提前看清成本和到手金额。',
    descriptionEn: 'Estimate Etsy, Stripe, PayPal, VAT, and GST costs before you price an order.',
  },
  {
    icon: Code2,
    titleZh: '开发小工具',
    titleEn: 'Developer utilities',
    descriptionZh: '格式化 JSON、调试 JWT、测试正则、对比文本，排查问题更快。',
    descriptionEn: 'Format JSON, inspect JWTs, test regex, and compare text while debugging.',
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
    titleZh: '上架商品',
    titleEn: 'Cross-border sellers',
    descriptionZh: '写 Listing，检查商品图，计算手续费和税费。适合 Etsy、Shopify 等跨境卖家。',
    descriptionEn: 'Write listings, review product images, and estimate fees for Etsy, Shopify, and other marketplaces.',
    tools: [
      { label: 'AI Listing 生成器', href: '/tools/ai/listing-generator' },
      { label: 'Etsy 手续费计算', href: '/tools/ecommerce/etsy-fee-calculator' },
    ],
  },
  {
    icon: Languages,
    titleZh: '写内容',
    titleEn: 'Content teams',
    descriptionZh: '写标题、脚本、社媒文案，翻译和润色已有文本。',
    descriptionEn: 'Draft titles, scripts, and social copy, then translate or polish existing text.',
    tools: [
      { label: 'AI 文本润色', href: '/tools/ai/text-polisher' },
      { label: 'AI 翻译', href: '/tools/ai/translator' },
    ],
  },
  {
    icon: Code2,
    titleZh: '查代码和接口',
    titleEn: 'Developers',
    descriptionZh: '格式化 JSON、查看 JWT、测试正则、对比两段文本。',
    descriptionEn: 'Format JSON, inspect JWTs, test regex, and compare two pieces of text.',
    tools: [
      { label: 'JSON 格式化', href: '/tools/dev/json-formatter' },
      { label: 'JWT 调试器', href: '/tools/dev/jwt-debugger' },
    ],
  },
  {
    icon: ImageIcon,
    titleZh: '文件处理',
    titleEn: 'Files and assets',
    descriptionZh: '压缩图片、转换格式、合并 PDF，适合整理素材和上传前检查。',
    descriptionEn: 'Compress images, convert formats, and merge PDFs before sharing or uploading files.',
    tools: [
      { label: '图片压缩', href: '/tools/image/image-compressor' },
      { label: 'PDF 合并', href: '/tools/pdf/pdf-merge' },
    ],
  },
];

const LANDING_FAQS = [
  {
    questionZh: 'ToolOrbit 是否免费？',
    questionEn: 'Is ToolOrbit free?',
    answerZh: '是。ToolOrbit 目前所有工具都免费使用，不需要订阅或付费解锁。AI 工具会调用模型接口，生成速度和可用性取决于当前接口配置。',
    answerEn: 'Yes. ToolOrbit tools are currently free to use, with no subscription or paid unlocks. AI tools call model APIs, so generation speed and availability depend on the current API configuration.',
  },
  {
    questionZh: '哪些工具会在浏览器本地处理？',
    questionEn: 'Which tools run in the browser?',
    answerZh: 'JSON、文本、图片压缩、格式转换和部分 PDF 工具优先在浏览器里处理。涉及 AI 生成的工具需要把输入发送到模型接口。',
    answerEn: 'JSON, text, image compression, format conversion, and selected PDF tools run in the browser first. AI generation tools send input to a model API.',
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
    <div className="inline-flex items-center gap-2 rounded-full border border-[#dbe3f5] bg-white px-3 py-1 text-[12px] font-semibold text-[#335cff] shadow-[0_12px_40px_-34px_rgba(15,23,42,0.45)]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#335cff]" aria-hidden="true" />
      {eyebrow}
    </div>
    <h2 className="mt-4 text-2xl font-black tracking-normal text-[#111936] sm:text-3xl">
      {title}
    </h2>
    <p className="mt-3 text-[15px] leading-7 text-[#52617f]">{description}</p>
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
        <form onSubmit={handleSubmit} className="rounded-[24px] border border-[#d4def6] bg-[#f8fbff] p-5 shadow-[0_28px_90px_-68px_rgba(51,92,255,0.7)] sm:p-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[12px] font-semibold text-[#335cff] ring-1 ring-[#dbe3f5]">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            {isZh ? 'AI Listing 生成器' : 'AI Listing Generator'}
          </div>
          <h2 className="mt-4 text-xl font-black text-[#111936]">
            {isZh ? '生成商品标题、描述和标签' : 'Generate a title, description, and tags'}
          </h2>
          <p className="mt-2 text-[14px] leading-6 text-[#52617f]">
            {isZh
              ? '这里调用同一个 Listing 工具接口。需要更多字段和完整编辑区时，再打开完整工具。'
              : 'This uses the same Listing API. Open the full tool when you need more fields and a larger editor.'}
          </p>

          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="text-[13px] font-semibold text-[#263454]">
                {isZh ? '商品名称' : 'Product name'}
              </span>
              <input
                value={productName}
                onChange={(event) => setProductName(event.target.value)}
                className="mt-2 h-12 w-full rounded-2xl border border-[#dbe3f5] bg-white px-4 text-[14px] text-[#111936] outline-none transition-colors placeholder:text-[#8390aa] focus:border-[#335cff] focus:ring-2 focus:ring-[#cbd8ff]"
                placeholder={isZh ? '例如：可定制猫咪项链' : 'Example: custom cat necklace'}
              />
            </label>

            <label className="block">
              <span className="text-[13px] font-semibold text-[#263454]">
                {isZh ? '销售平台' : 'Marketplace'}
              </span>
              <select
                value={platform}
                onChange={(event) => setPlatform(event.target.value)}
                className="mt-2 h-12 w-full cursor-pointer rounded-2xl border border-[#dbe3f5] bg-white px-4 text-[14px] text-[#111936] outline-none transition-colors focus:border-[#335cff] focus:ring-2 focus:ring-[#cbd8ff]"
              >
                {['Etsy', 'Amazon', 'Shopify', 'eBay'].map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-[13px] font-semibold text-[#263454]">
                {isZh ? '特色与卖点' : 'Features and selling points'}
              </span>
              <textarea
                value={features}
                onChange={(event) => setFeatures(event.target.value)}
                rows={3}
                className="mt-2 w-full resize-none rounded-2xl border border-[#dbe3f5] bg-white px-4 py-3 text-[14px] leading-6 text-[#111936] outline-none transition-colors placeholder:text-[#8390aa] focus:border-[#335cff] focus:ring-2 focus:ring-[#cbd8ff]"
                placeholder={isZh ? '例如：手工皮革，可定制首字母，礼品包装' : 'Example: handmade leather, custom initials, gift packaging'}
              />
            </label>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={isGenerating}
              className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#335cff] px-5 text-[14px] font-bold text-white shadow-[0_18px_38px_-24px_rgba(51,92,255,0.9)] transition-colors hover:bg-[#254be8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9db2ff] disabled:cursor-wait disabled:bg-[#7d96ff]"
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              {isGenerating ? (isZh ? '正在生成...' : 'Generating...') : isZh ? '生成 Listing 文案' : 'Generate listing copy'}
            </button>
            <Link
              to="/tools/ai/listing-generator"
              className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full border border-[#dbe3f5] bg-white px-5 text-[14px] font-bold text-[#24304f] transition-colors hover:border-[#335cff] hover:text-[#335cff]"
            >
              {isZh ? '打开完整工具' : 'Open full tool'}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </form>

        <div className="rounded-[24px] border border-[#dbe3f5] bg-[#0f1b36] p-5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] sm:p-6">
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
  const categoryGuide = categoryFilter ? CATEGORY_GUIDES[categoryFilter]?.[isZh ? 'zh' : 'en'] : null;
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
    <div className="-mt-7 flex flex-col gap-12 pb-12 md:-mt-9">
      <section className="relative left-1/2 min-h-[620px] w-screen -translate-x-1/2 overflow-hidden border-b border-[color-mix(in_srgb,var(--app-accent)_14%,var(--app-border))] bg-[linear-gradient(180deg,#edf4ff_0%,#f7faff_42%,#ffffff_72%,#eef3ff_100%)] px-4 pb-20 pt-8 sm:px-6 sm:pt-10 lg:px-8 lg:pt-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(42rem 22rem at 50% 0%, rgba(59,130,246,0.16), transparent 70%), radial-gradient(30rem 18rem at 72% 18%, rgba(99,102,241,0.12), transparent 72%)',
          }}
        />

        <div className="relative mx-auto flex max-w-5xl flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 text-[12px] font-semibold text-[#335cff]">
            <span className="h-2 w-2 rounded-full bg-[#335cff] shadow-[0_0_0_6px_rgba(51,92,255,0.1)]" aria-hidden="true" />
            {isZh ? 'AI 工具 · 浏览器处理 · 电商费用' : 'AI tools · Browser utilities · Fee calculators'}
          </div>

          <h1 className="mt-7 max-w-5xl text-[38px] font-black leading-[1.06] text-[#111936] sm:text-[64px] sm:leading-[1.04] lg:text-[76px]">
            {isZh ? (
              <>
                <span className="block">ToolOrbit 在线工具</span>
                <span className="mt-1 block text-[#335cff]">AI 生成、文件处理和费用估算</span>
              </>
            ) : (
              <>
                ToolOrbit online tools
                <span className="mt-1 block text-[#335cff]">for AI drafts, files, and fee estimates</span>
              </>
            )}
          </h1>

          <p className="mt-7 max-w-3xl text-[16px] leading-8 text-[#4b587c]">
            {isZh
              ? '生成 Listing、脚本和翻译，处理 JSON、图片、PDF，再估算 Etsy、Stripe、PayPal、VAT 和 GST 成本。'
              : 'Generate listings, scripts, and translations. Work with JSON, images, and PDFs. Estimate Etsy, Stripe, PayPal, VAT, and GST costs.'}
          </p>

          <form
            onSubmit={handleHeroSearch}
            className="hero-search-form mt-10 flex w-full max-w-3xl flex-col gap-2 rounded-[28px] border border-[#dde5fb] bg-white p-2 shadow-[0_24px_80px_-45px_rgba(51,92,255,0.45)] transition-colors focus-within:border-[#335cff] sm:flex-row sm:items-center"
          >
            <div className="flex min-h-14 min-w-0 flex-1 items-center gap-3 px-4">
              <Search className="h-5 w-5 shrink-0 text-[#64708f]" aria-hidden="true" />
              <input
                name="search"
                type="search"
                aria-label={t('common.searchPlaceholder')}
                placeholder={t('common.searchPlaceholder')}
                className="min-w-0 flex-1 border-0 bg-transparent text-[15px] text-[#111936] outline-none placeholder:text-[#7b86a3]"
              />
              <kbd className="hidden shrink-0 rounded-md border border-[#dbe3f5] bg-[#f7f9ff] px-2 py-1 font-sans text-[11px] font-medium text-[#64708f] sm:inline-block">
                Ctrl K
              </kbd>
            </div>
            <button
              type="submit"
              className="inline-flex min-h-14 cursor-pointer items-center justify-center gap-2 rounded-[22px] bg-[#335cff] px-7 text-[15px] font-bold text-white shadow-[0_18px_38px_-22px_rgba(51,92,255,0.9)] transition-colors hover:bg-[#254be8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9db2ff]"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              {isZh ? '搜索工具' : 'Search tools'}
            </button>
          </form>

          <ListingTrialPanel isZh={isZh} />
        </div>
      </section>

      <section className="space-y-8">
        <LandingSectionHeader
          eyebrow={isZh ? '免费在线工具' : 'Free online tools'}
          title={isZh ? '写文案、处理文件、计算费用' : 'Write copy, process files, and calculate fees'}
          description={
            isZh
              ? '打开就能用，不用注册。AI 工具帮你起草内容，本地工具处理文件和代码。'
              : 'Use the tools without sign-up. Draft content with AI, then handle files and code in the browser.'
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
              className="rounded-2xl border border-[#dbe3f5] bg-white p-5 shadow-[0_22px_70px_-54px_rgba(15,23,42,0.55)]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef4ff] text-[#335cff]">
                <FeatureIcon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-[16px] font-black text-[#111936]">{isZh ? titleZh : titleEn}</h3>
              <p className="mt-2 text-[13px] leading-6 text-[#52617f]">{isZh ? descriptionZh : descriptionEn}</p>
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
              ? '从常见任务开始，直接打开需要的工具。'
              : 'Start with a common task and open the tool you need.'
          }
        />
        <div className="grid gap-4 lg:grid-cols-2">
          {LANDING_SOLUTIONS.map(({ icon: SolutionIcon, titleZh, titleEn, descriptionZh, descriptionEn, tools }) => (
            <article key={titleEn} className="rounded-2xl border border-[#dbe3f5] bg-white p-5 shadow-[0_20px_80px_-60px_rgba(15,23,42,0.5)]">
              <div className="flex gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#eef4ff] text-[#335cff]">
                  <SolutionIcon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-[17px] font-black text-[#111936]">{isZh ? titleZh : titleEn}</h3>
                  <p className="mt-2 text-[14px] leading-6 text-[#52617f]">{isZh ? descriptionZh : descriptionEn}</p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {tools.map((tool) => (
                  <Link
                    key={tool.href}
                    to={tool.href}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#dbe3f5] bg-[#f8fbff] px-3 py-1.5 text-[13px] font-semibold text-[#24304f] transition-colors hover:border-[#335cff] hover:text-[#335cff]"
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
              ? '关于免费使用、隐私、AI 结果和费用计算，你可以先看这里。'
              : 'Read about free access, privacy, AI output, and fee estimates.'
          }
        />
        <div className="mx-auto grid max-w-5xl gap-3">
          {LANDING_FAQS.map(({ questionZh, questionEn, answerZh, answerEn }) => (
            <details
              key={questionEn}
              className="group rounded-2xl border border-[#dbe3f5] bg-white px-5 py-4 shadow-[0_18px_70px_-60px_rgba(15,23,42,0.55)]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-black text-[#111936]">
                <span>{isZh ? questionZh : questionEn}</span>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#eef4ff] text-[#335cff] transition-transform group-open:rotate-90">
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </summary>
              <p className="mt-3 max-w-3xl text-[14px] leading-6 text-[#52617f]">
                {isZh ? answerZh : answerEn}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section className="text-center">
        <h2 className="text-xl font-black tracking-normal text-[#111936]">
          {isZh ? '按分类找工具' : 'Browse tool categories'}
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-[13px] leading-6 text-[#52617f]">
          {isZh
            ? '也可以直接进入分类页，查看同类工具。'
            : 'Open a category page to see related tools.'}
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {HERO_CATEGORIES.map(({ category, icon: ChipIcon }) => {
            const accent = getCategoryAccent(category);
            return (
              <Link
                key={category}
                to={getCategoryPath(category)}
                style={accentStyle(accent)}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#dbe3f5] bg-white/70 px-3.5 py-2 text-[13px] font-semibold text-[#344260] transition-colors hover:border-[color-mix(in_srgb,var(--c)_42%,#dbe3f5)] hover:bg-white hover:text-[#111936]"
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
