import type { TechnicalOverview } from '../types/tool-overview';
import { TOOLS } from '../data/tools';
import { DEV_TOOL_OVERVIEWS } from '../views/tools/dev/data';
import { IMAGE_TOOL_OVERVIEWS } from '../views/tools/image/data';
import { TEXT_TOOL_OVERVIEWS } from '../views/tools/text/data';
import { ECOMMERCE_TOOL_OVERVIEWS } from '../views/tools/ecommerce/data';
import { PDF_TOOL_OVERVIEWS } from '../views/tools/pdf/data';
import { CALCULATE_TOOL_OVERVIEWS } from '../views/tools/calculate/data';
import { NET_TOOL_OVERVIEWS } from '../views/tools/net/data';
import { AI_TOOL_OVERVIEWS } from '../views/tools/ai/data';
import { UTILITY_TOOL_OVERVIEWS } from '../views/tools/utility/data';
import en from '../locales/en.json';
import zh from '../locales/zh.json';

type Locale = 'en' | 'zh';
type BilingualOverview = { zh: TechnicalOverview; en: TechnicalOverview };

const ALL_OVERVIEWS: Record<string, BilingualOverview> = {
  ...DEV_TOOL_OVERVIEWS,
  ...IMAGE_TOOL_OVERVIEWS,
  ...TEXT_TOOL_OVERVIEWS,
  ...ECOMMERCE_TOOL_OVERVIEWS,
  ...PDF_TOOL_OVERVIEWS,
  ...CALCULATE_TOOL_OVERVIEWS,
  ...NET_TOOL_OVERVIEWS,
  ...AI_TOOL_OVERVIEWS,
  ...UTILITY_TOOL_OVERVIEWS,
};

// en.json/zh.json mix flat string copy with a few nested objects; we only read string
// fields (seoTitle/guide*/highlight*/faq*/disclaimer), so widen via unknown.
const COPY: Record<Locale, Record<string, Record<string, string>>> = {
  en: (en as unknown as { tools?: Record<string, Record<string, string>> }).tools ?? {},
  zh: (zh as unknown as { tools?: Record<string, Record<string, string>> }).tools ?? {},
};

const LABELS: Record<Locale, {
  about: (n: string) => string;
  howToUse: (n: string) => string;
  input: string;
  output: string;
  howItWorks: string;
  modes: string;
  whyUse: (n: string) => string;
  faq: string;
  inputExample: string;
  outputExample: string;
}> = {
  en: {
    about: (n) => `About ${n}`,
    howToUse: (n) => `How to use ${n}`,
    input: 'Input',
    output: 'Output',
    howItWorks: 'How it works',
    modes: 'Supported modes',
    whyUse: (n) => `Why use ${n}`,
    faq: 'Frequently Asked Questions',
    inputExample: 'Input example',
    outputExample: 'Output example',
  },
  zh: {
    about: (n) => `关于${n}`,
    howToUse: (n) => `如何使用${n}`,
    input: '输入内容',
    output: '输出结果',
    howItWorks: '处理方式',
    modes: '支持能力',
    whyUse: (n) => `为什么使用${n}`,
    faq: '常见问题',
    inputExample: '输入示例',
    outputExample: '输出示例',
  },
};

function overviewKeyFor(toolId: string): string {
  return toolId === 'xml-to-json' ? 'xml-json' : toolId;
}

const sectionHeading = 'text-xl font-semibold tracking-tight text-slate-950 dark:text-white';
const bodyText = 'mt-3 text-[15px] leading-7 text-slate-700 dark:text-slate-300';

/**
 * Server-rendered, always-expanded tool content. Pulls the long-form overview from each
 * category data file plus the localized guide/highlight/FAQ copy and emits it as plain
 * semantic HTML so crawlers (and AdSense review) see the full article without running JS.
 * Replaces the old client-side <ToolSEOCard>, whose i18n-driven copy was empty during SSR.
 */
export default function ToolContent({ path, locale = 'en' }: { path: string; locale?: Locale }) {
  const tool = TOOLS.find((item) => item.path === path);
  if (!tool) return null;

  const overview = ALL_OVERVIEWS[overviewKeyFor(tool.id)]?.[locale];
  const copy = COPY[locale][tool.id] ?? {};
  const L = LABELS[locale];

  const heading = copy.seoTitle || copy.title || L.about(tool.name);
  const intro = overview?.summary || copy.seoDesc || tool.description;

  const guides = [copy.guide1, copy.guide2, copy.guide3, copy.guide4].filter(Boolean) as string[];
  const highlights = [1, 2, 3]
    .map((i) => ({ title: copy[`highlight${i}Title`], desc: copy[`highlight${i}Desc`] }))
    .filter((h) => h.title && h.desc) as Array<{ title: string; desc: string }>;
  const faqs = [1, 2, 3]
    .map((i) => ({ q: copy[`faq${i}Q`], a: copy[`faq${i}A`] }))
    .filter((f) => f.q && f.a) as Array<{ q: string; a: string }>;

  if (!intro && guides.length === 0 && faqs.length === 0) return null;

  return (
    <section
      aria-labelledby="tool-content-heading"
      className="mt-8 rounded-2xl border border-slate-200/90 bg-white px-5 py-8 shadow-sm dark:border-slate-800 dark:bg-[#282c34] sm:px-7"
    >
      <h2 id="tool-content-heading" className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
        {heading}
      </h2>
      {intro ? <p className="mt-4 text-[15px] leading-7 text-slate-700 dark:text-slate-300">{intro}</p> : null}

      {guides.length > 0 ? (
        <div className="mt-8">
          <h3 className={sectionHeading}>{copy.guideTitle || L.howToUse(tool.name)}</h3>
          <ol className="mt-3 space-y-2 text-[15px] leading-7 text-slate-700 dark:text-slate-300">
            {guides.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded bg-blue-600 text-xs font-semibold text-white">
                  {i + 1}
                </span>
                <span>{step.replace(/^\d+\.\s*/, '')}</span>
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      {overview ? (
        <div className="mt-8 space-y-6">
          <div>
            <h3 className={sectionHeading}>{L.input}</h3>
            <p className={bodyText}>{overview.input}</p>
          </div>
          <div>
            <h3 className={sectionHeading}>{L.output}</h3>
            <p className={bodyText}>{overview.output}</p>
          </div>
          <div>
            <h3 className={sectionHeading}>{L.howItWorks}</h3>
            <p className={bodyText}>{overview.processing}</p>
          </div>
          {overview.modes?.length ? (
            <div>
              <h3 className={sectionHeading}>{L.modes}</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {overview.modes.map((mode) => (
                  <li
                    key={mode}
                    className="rounded-md border border-blue-100 bg-blue-50 px-2.5 py-1 text-sm font-semibold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-200"
                  >
                    {mode}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {overview.example ? (
            <div>
              <h3 className={sectionHeading}>{overview.example.title}</h3>
              <div className="mt-3 space-y-4">
                <div>
                  <p className="mb-2 text-sm font-semibold text-slate-600 dark:text-slate-400">{L.inputExample}</p>
                  <pre className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950 p-4 text-[13px] leading-7 text-slate-100">
                    <code>{overview.example.input}</code>
                  </pre>
                </div>
                <div>
                  <p className="mb-2 text-sm font-semibold text-slate-600 dark:text-slate-400">{L.outputExample}</p>
                  <pre className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950 p-4 text-[13px] leading-7 text-slate-100">
                    <code>{overview.example.output}</code>
                  </pre>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {highlights.length > 0 ? (
        <div className="mt-8">
          <h3 className={sectionHeading}>{copy.highlightsTitle || L.whyUse(tool.name)}</h3>
          <ul className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-3">
            {highlights.map((h, i) => (
              <li key={i} className="border-l-2 border-slate-200 pl-4 dark:border-slate-800">
                <strong className="block font-semibold text-slate-950 dark:text-white">{h.title}</strong>
                <span className="mt-2 block text-sm leading-6 text-slate-600 dark:text-slate-400">{h.desc}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {faqs.length > 0 ? (
        <div className="mt-10 border-t border-slate-200 pt-8 dark:border-slate-800">
          <h3 className={sectionHeading}>{L.faq}</h3>
          <div className="mt-5 space-y-5">
            {faqs.map((f, i) => (
              <div key={i} className="border-b border-slate-200 pb-5 last:border-0 dark:border-slate-800">
                <h4 className="mb-2 text-base font-semibold text-slate-950 dark:text-white">{f.q}</h4>
                <p className="leading-7 text-slate-600 dark:text-slate-400">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {copy.disclaimer ? (
        <p className="mt-8 border-t border-slate-200 pt-6 text-sm leading-6 text-slate-500 dark:border-slate-800 dark:text-slate-400">
          {copy.disclaimer}
        </p>
      ) : null}
    </section>
  );
}
