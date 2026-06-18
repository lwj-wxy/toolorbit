import { useEffect, useMemo, useRef, useState, type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Clapperboard, Copy, Loader2, Sparkles, Zap } from 'lucide-react';
import Markdown from 'react-markdown';

type LocalizedText = {
  en: string;
  zh: string;
};

type AiRuntimeFieldOption = {
  value: string;
  label: LocalizedText;
};

type AiRuntimeField = {
  key: string;
  type: 'input' | 'textarea' | 'select' | 'language';
  label: LocalizedText;
  placeholder?: LocalizedText;
  required?: boolean;
  defaultValue?: string;
  options?: AiRuntimeFieldOption[];
  helpText?: LocalizedText;
};

type AiRuntimeSection = {
  key: string;
  marker: string;
  label: LocalizedText;
  markdown?: boolean;
  monospace?: boolean;
};

type AiRuntimeToolConfig = {
  toolId?: string;
  endpoint: string;
  icon: 'sparkles' | 'zap' | 'clapperboard';
  title: LocalizedText;
  subtitle: LocalizedText;
  formTitle: LocalizedText;
  generateLabel: LocalizedText;
  waitingLabel: LocalizedText;
  loadingLabel: LocalizedText;
  fields: AiRuntimeField[];
  result:
    | {
        type: 'sections';
        sections: AiRuntimeSection[];
      }
    | {
        type: 'keyword-json';
      };
  buildPayload: (values: Record<string, string>) => Record<string, unknown>;
};

const iconMap: Record<AiRuntimeToolConfig['icon'], ComponentType<{ className?: string; size?: number }>> = {
  sparkles: Sparkles,
  zap: Zap,
  clapperboard: Clapperboard,
};

const text = (value: LocalizedText, isZh: boolean) => (isZh ? value.zh : value.en);

const defaultLanguage = (isZh: boolean) => (isZh ? 'Chinese' : 'English');

const parseSections = (content: string, sections: AiRuntimeSection[]) => {
  const parsedSections: Record<string, string> = {};

  sections.forEach((section) => {
    const pattern = new RegExp(`\\[${section.marker}\\]\\s*:?\\s*([\\s\\S]*?)(?=\\n?\\[[A-Z_]+\\]|$)`, 'i');
    parsedSections[section.key] = content.match(pattern)?.[1]?.trim() || '';
  });

  return parsedSections;
};

const parseSsePayload = async (response: Response) => {
  const reader = response.body?.getReader();
  if (!reader) throw new Error('Response stream is empty.');

  const decoder = new TextDecoder();
  let pendingText = '';
  let resultText = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    if (!value) continue;

    pendingText += decoder.decode(value, { stream: true });
    const lines = pendingText.split('\n');
    pendingText = lines.pop() || '';

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine.startsWith('data: ')) continue;
      if (trimmedLine.includes('[DONE]')) continue;

      const payload = JSON.parse(trimmedLine.slice(6));
      if (payload.error) throw new Error(payload.error);
      if (payload.content) resultText += payload.content;
    }
  }

  return resultText;
};

const initialValuesFor = (fields: AiRuntimeField[], isZh: boolean) =>
  fields.reduce<Record<string, string>>((values, field) => {
    values[field.key] = field.type === 'language' ? defaultLanguage(isZh) : field.defaultValue || '';
    return values;
  }, {});

const AiRuntimeTool = ({ config }: { config: AiRuntimeToolConfig }) => {
  const { i18n, t } = useTranslation();
  const isZh = i18n.language.startsWith('zh');
  const Icon = iconMap[config.icon];
  const [values, setValues] = useState<Record<string, string>>(() => initialValuesFor(config.fields, isZh));
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setValues((currentValues) => {
      const nextValues = { ...currentValues };
      config.fields.forEach((field) => {
        if (field.type === 'language') nextValues[field.key] = defaultLanguage(isZh);
      });
      return nextValues;
    });
  }, [config.fields, isZh]);

  const canSubmit = useMemo(
    () => config.fields.every((field) => !field.required || values[field.key]?.trim()),
    [config.fields, values],
  );
  const pageTitle = config.toolId
    ? t(`tools.${config.toolId}.title`, { defaultValue: text(config.title, isZh) })
    : text(config.title, isZh);
  const localeSubtitle = config.toolId ? t(`tools.${config.toolId}.subtitle`, { defaultValue: '' }) : '';
  const pageDescription = config.toolId
    ? localeSubtitle || t(`tools.${config.toolId}.description`, { defaultValue: text(config.subtitle, isZh) })
    : text(config.subtitle, isZh);

  const copyToClipboard = (content: string, fieldKey: string) => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 1600);
  };

  useEffect(() => {
    if (!result) return;
    resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [result]);

  const updateValue = (key: string, value: string) => {
    setValues((currentValues) => ({ ...currentValues, [key]: value }));
  };

  const requestGeneration = async () => {
    if (!canSubmit || loading) return;

    setLoading(true);
    setError('');
    setResult('');

    try {
      const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config.buildPayload(values)),
      });

      if (!response.ok) {
        const responseData = await response.json().catch(() => ({}));
        throw new Error(responseData.error || 'Service unavailable.');
      }

      setResult(await parseSsePayload(response));
    } catch (generationError: any) {
      setError(generationError.message || 'Generation failed.');
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field: AiRuntimeField) => {
    const commonClassName =
      'w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100';
    const fieldValue = values[field.key] || '';

    return (
      <div key={field.key} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
        <div className="mb-1 flex items-center justify-between gap-3">
          <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
            {text(field.label, isZh)}
          </label>
          {field.type === 'textarea' ? <span className="text-xs text-slate-400">{fieldValue.length}</span> : null}
        </div>
        {field.type === 'textarea' ? (
          <textarea
            value={fieldValue}
            onChange={(event) => updateValue(field.key, event.target.value)}
            placeholder={field.placeholder ? text(field.placeholder, isZh) : undefined}
            className={`${commonClassName} min-h-[112px] resize-none py-3`}
            aria-label={text(field.label, isZh)}
          />
        ) : field.type === 'select' || field.type === 'language' ? (
          <select
            value={fieldValue}
            onChange={(event) => updateValue(field.key, event.target.value)}
            className={`${commonClassName} h-11`}
            aria-label={text(field.label, isZh)}
          >
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {text(option.label, isZh)}
              </option>
            ))}
          </select>
        ) : (
          <input
            value={fieldValue}
            onChange={(event) => updateValue(field.key, event.target.value)}
            placeholder={field.placeholder ? text(field.placeholder, isZh) : undefined}
            className={`${commonClassName} h-11`}
            aria-label={text(field.label, isZh)}
          />
        )}
        {field.helpText ? (
          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{text(field.helpText, isZh)}</p>
        ) : null}
      </div>
    );
  };

  const renderSectionResults = () => {
    if (config.result.type !== 'sections') return null;
    const sections = parseSections(result, config.result.sections);
    const allSectionText = config.result.sections
      .map((section) => {
        const content = sections[section.key];
        return content ? `${text(section.label, isZh)}\n${content}` : '';
      })
      .filter(Boolean)
      .join('\n\n');

    return (
      <div className="space-y-4">
        {allSectionText ? (
          <div className="flex justify-end">
            <button
              onClick={() => copyToClipboard(allSectionText, 'all')}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:border-cyan-300 hover:text-cyan-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
            >
              {copiedField === 'all' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              {copiedField === 'all' ? (isZh ? '已复制' : 'Copied') : (isZh ? '复制全部' : 'Copy all')}
            </button>
          </div>
        ) : null}
        {config.result.sections.map((section) => {
          const content = sections[section.key];
          if (!content) return null;

          return (
            <div key={section.key} className="group relative rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-950">
              <span className="mb-2 block text-xs font-bold uppercase text-slate-400">{text(section.label, isZh)}</span>
              {section.markdown ? (
                <div className="prose prose-slate prose-sm max-w-none dark:prose-invert">
                  <Markdown>{content}</Markdown>
                </div>
              ) : (
                <p className={`whitespace-pre-wrap text-sm leading-6 text-slate-700 dark:text-slate-200 ${section.monospace ? 'font-mono' : ''}`}>
                  {content}
                </p>
              )}
              <button
                onClick={() => copyToClipboard(content, section.key)}
                className="absolute right-3 top-3 rounded-md border border-slate-300 bg-white p-2 opacity-0 shadow-sm transition-all hover:text-cyan-600 group-hover:opacity-100 dark:border-slate-700 dark:bg-[#282c34]"
                aria-label={`Copy ${section.key}`}
              >
                {copiedField === section.key ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  const renderKeywordResults = () => {
    if (config.result.type !== 'keyword-json') return null;

    let parsedResult: any = null;
    try {
      parsedResult = JSON.parse(result);
    } catch {
      return (
        <pre className="whitespace-pre-wrap rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
          {result}
        </pre>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-end">
          <button
            onClick={() => copyToClipboard(result, 'keyword-all')}
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:border-cyan-300 hover:text-cyan-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
          >
            {copiedField === 'keyword-all' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            {copiedField === 'keyword-all' ? (isZh ? '已复制' : 'Copied') : (isZh ? '复制全部' : 'Copy all')}
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-cyan-100 bg-cyan-50 p-4 dark:border-cyan-900/50 dark:bg-cyan-950/30">
            <p className="mb-1 text-xs font-bold text-cyan-700 dark:text-cyan-200">Total</p>
            <p className="text-xl font-black text-cyan-950 dark:text-cyan-100">{parsedResult.summary?.total ?? 0}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
            <p className="mb-1 text-xs font-bold text-slate-500">Data basis</p>
            <p className="text-base font-bold text-slate-900 dark:text-slate-100">{parsedResult.summary?.avgCompetition || 'not measured'}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
            <p className="mb-1 text-xs font-bold text-slate-500">Top idea</p>
            <p className="line-clamp-1 text-base font-bold text-slate-900 dark:text-slate-100">{parsedResult.summary?.topRecommendation}</p>
          </div>
        </div>

        {parsedResult.warnings?.length ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
            {parsedResult.warnings.join(' ')}
          </div>
        ) : null}

        {parsedResult.categories?.map((category: any, categoryIndex: number) => (
          <div key={`${category.name}-${categoryIndex}`} className="space-y-3">
            <h3 className="font-bold text-slate-800 dark:text-slate-100">{category.name}</h3>
            <div className="space-y-2">
              {category.keywords?.map((keyword: any, keywordIndex: number) => {
                const copyKey = `${categoryIndex}-${keywordIndex}`;
                return (
                  <div
                    key={copyKey}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 transition-colors hover:border-cyan-300 dark:border-slate-700 dark:bg-slate-950"
                  >
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{keyword.term}</p>
                      <p className="text-xs text-slate-400">{keyword.volume} | Score: {keyword.score}</p>
                    </div>
                    <button onClick={() => copyToClipboard(keyword.term, copyKey)} className="p-1.5 text-slate-400 hover:text-cyan-600" aria-label="Copy keyword">
                      {copiedField === copyKey ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{pageTitle}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">{pageDescription}</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#282c34]">
          <h2 className="flex items-center gap-2 text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
            <Icon className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
            {text(config.formTitle, isZh)}
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            {config.fields.map(renderField)}
          </div>
          <button
            onClick={requestGeneration}
            disabled={loading || !canSubmit}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-cyan-600 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-800 sm:w-auto sm:px-8"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Icon size={18} />}
            {loading ? text(config.loadingLabel, isZh) : text(config.generateLabel, isZh)}
          </button>
        </div>

        <div ref={resultRef} className="rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{isZh ? '结果' : 'Result'}</h2>
            {!result && !loading ? <span className="text-xs text-slate-400">{isZh ? '等待生成' : 'Waiting'}</span> : null}
          </div>

          {error ? (
            <div className="mb-4 rounded-lg border border-rose-100 bg-rose-50 p-4 text-sm font-medium text-rose-600 dark:border-rose-900/70 dark:bg-rose-950/20 dark:text-rose-200">
              {error}
            </div>
          ) : null}

          <div>
            {loading && !result ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500 dark:text-slate-400">
                <Loader2 className="mb-3 animate-spin text-cyan-500" size={34} />
                <p className="text-sm font-semibold">{text(config.loadingLabel, isZh)}</p>
              </div>
            ) : null}

            {!loading && !result ? (
              <div className="flex items-center gap-3 rounded-lg border border-dashed border-slate-200 bg-white px-4 py-4 text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
                <Icon className="h-5 w-5 flex-none text-slate-300 dark:text-slate-600" />
                <p className="text-sm leading-6">{text(config.waitingLabel, isZh)}</p>
              </div>
            ) : null}

            {result ? (
              config.result.type === 'sections' ? renderSectionResults() : renderKeywordResults()
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiRuntimeTool;
export type { AiRuntimeToolConfig };
