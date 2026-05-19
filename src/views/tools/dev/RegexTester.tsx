import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ToolSEOCard from '../../../components/ToolSEOCard';
import { 
  Code2,
  Text,
  AlertCircle,
  Hash,
  RotateCcw,
  SlidersHorizontal
} from 'lucide-react';

const RegexTester: React.FC = () => {
  const { t } = useTranslation();
  const [regex, setRegex] = useState('([a-z]+)');
  const [flags, setFlags] = useState('g');
  const [testText, setTestText] = useState('Hello World 2026 ToolOrbit');
  const [matches, setMatches] = useState<RegExpMatchArray[]>([]);
  const [error, setError] = useState<string | null>(null);

  const availableFlags = [
    { key: 'g', label: t('tools.regex-tester.flagGlobalLabel'), description: t('tools.regex-tester.flagGlobalDesc') },
    { key: 'i', label: t('tools.regex-tester.flagInsensitiveLabel'), description: t('tools.regex-tester.flagInsensitiveDesc') },
    { key: 'm', label: t('tools.regex-tester.flagMultilineLabel'), description: t('tools.regex-tester.flagMultilineDesc') },
    { key: 's', label: t('tools.regex-tester.flagSinglelineLabel'), description: t('tools.regex-tester.flagSinglelineDesc') },
    { key: 'u', label: t('tools.regex-tester.flagUnicodeLabel'), description: t('tools.regex-tester.flagUnicodeDesc') },
  ];

  const handleFlagToggle = (flag: string) => {
    setFlags(prev => prev.includes(flag) ? prev.replace(flag, '') : prev + flag);
  };

  useEffect(() => {
    if (!regex) {
      setMatches([]);
      setError(null);
      return;
    }

    try {
      const re = new RegExp(regex, flags);
      const allMatches: RegExpMatchArray[] = [];
      
      if (flags.includes('g')) {
        let match;
        while ((match = re.exec(testText)) !== null) {
          allMatches.push(match);
          if (match.index === re.lastIndex) re.lastIndex++; // Support zero-length matches
          if (allMatches.length > 1000) break; // Limit
        }
      } else {
        const match = testText.match(re);
        if (match) allMatches.push(match);
      }
      
      setMatches(allMatches);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setMatches([]);
    }
  }, [regex, flags, testText]);

  const highlightedText = useMemo(() => {
    if (!testText || error || matches.length === 0) return testText;

    let result: React.ReactNode[] = [];
    let lastIndex = 0;

    matches.forEach((match, idx) => {
      const matchIndex = match.index!;
      const matchText = match[0];
      
      if (matchIndex < lastIndex) return; // Skip overlapping for simple UI

      // Add text before match
      result.push(testText.slice(lastIndex, matchIndex));
      
      // Add highlighted match
      result.push(
        <span 
          key={idx} 
          className="bg-yellow-200 text-yellow-900 rounded-sm px-0.5 border-b border-yellow-400 group relative"
          title={`Match ${idx + 1}: ${matchText}`}
        >
          {matchText}
        </span>
      );
      
      lastIndex = matchIndex + matchText.length;
    });

    result.push(testText.slice(lastIndex));
    return result;
  }, [testText, matches, error]);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="border-b border-slate-200 pb-7 dark:border-slate-800">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
              {t('tools.regex-tester.title')}
            </h1>
            <p className="mt-3 max-w-3xl text-[15px] leading-7 text-slate-600 dark:text-slate-400">
              {t('tools.regex-tester.subtitle')}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setRegex('([a-z]+)');
              setFlags('g');
              setTestText('Hello World 2026 ToolOrbit');
            }}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-900 dark:text-blue-300 dark:hover:bg-blue-950/30"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            {t('tools.regex-tester.resetBtn')}
          </button>
        </div>
      </div>

      <div className="grid min-h-[620px] grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="flex min-h-[520px] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:min-h-[620px]">
          <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-800">
            <h2 className="text-sm font-semibold text-slate-950 dark:text-white">
              {t('tools.regex-tester.inputLabel', { defaultValue: '输入与配置' })}
            </h2>
          </div>

          <div className="space-y-5 p-4">
            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <label htmlFor="regex-pattern" className="flex items-center gap-2 text-sm font-semibold text-slate-950 dark:text-white">
                  <Code2 className="h-4 w-4" aria-hidden="true" />
                  {t('tools.regex-tester.regexLabel')}
                </label>
                {error && (
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 dark:bg-red-950/30 dark:text-red-200">
                    <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                    {t('tools.regex-tester.errorTitle')}
                  </span>
                )}
              </div>
              <div className="flex min-h-14 items-center rounded-xl border border-slate-200 bg-slate-50 px-4 transition-colors focus-within:border-blue-500 focus-within:bg-white dark:border-slate-700 dark:bg-slate-900/50 dark:focus-within:bg-slate-950/40">
                <span className="font-mono text-lg text-slate-400">/</span>
                <input
                  id="regex-pattern"
                  type="text"
                  value={regex}
                  onChange={(e) => setRegex(e.target.value)}
                  placeholder={t('tools.regex-tester.regexPlaceholder')}
                  className="min-w-0 flex-1 bg-transparent px-3 py-4 font-mono text-base text-slate-950 outline-none placeholder:text-slate-400 dark:text-slate-100"
                />
                <span className="font-mono text-lg text-slate-400">/</span>
                <label htmlFor="regex-flags" className="sr-only">
                  {t('tools.regex-tester.sidebarTitle')}
                </label>
                <input
                  id="regex-flags"
                  type="text"
                  value={flags}
                  onChange={(e) => setFlags(e.target.value)}
                  className="ml-3 h-10 w-16 rounded-lg border border-slate-200 bg-white px-2 text-center font-mono text-sm font-semibold text-blue-700 outline-none transition-colors focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-blue-300"
                  placeholder="flags"
                />
              </div>
              {error && <p className="mt-2 font-mono text-xs text-red-600 dark:text-red-300">Error: {error}</p>}
            </div>

            <div>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-950 dark:text-white">
                <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                {t('tools.regex-tester.sidebarTitle')}
              </h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {availableFlags.map((flag) => {
                  const active = flags.includes(flag.key);
                  return (
                    <button
                      key={flag.key}
                      type="button"
                      onClick={() => handleFlagToggle(flag.key)}
                      className={`flex items-start gap-3 rounded-lg border p-3 text-left transition-colors ${
                        active
                          ? 'border-blue-200 bg-blue-50 text-blue-950 dark:border-blue-900/70 dark:bg-blue-950/30 dark:text-blue-100'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-[#282c34] dark:text-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <span className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                        active ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-950'
                      }`}>
                        {active && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold">{flag.label}</span>
                        <span className="mt-0.5 block text-xs leading-5 text-slate-500 dark:text-slate-400">{flag.description}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label htmlFor="regex-test-text" className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-950 dark:text-white">
                <Text className="h-4 w-4" aria-hidden="true" />
                {t('tools.regex-tester.textLabel')}
              </label>
              <div className="relative">
                <textarea
                  id="regex-test-text"
                  value={testText}
                  onChange={(e) => setTestText(e.target.value)}
                  placeholder={t('tools.regex-tester.textPlaceholder')}
                  className="block h-[260px] w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-5 font-mono text-sm leading-7 text-slate-950 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:bg-white dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-100 dark:focus:bg-slate-950/40"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="flex min-h-[520px] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:min-h-[620px]">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
            <h2 className="text-sm font-semibold text-slate-950 dark:text-white">
              {t('tools.regex-tester.outputLabel', { defaultValue: '匹配输出' })}
            </h2>
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {matches.length}
            </span>
          </div>

          <div className="min-h-[220px] border-b border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/40">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-950 dark:text-white">
              <Text className="h-4 w-4" aria-hidden="true" />
              {t('tools.regex-tester.previewLabel', { defaultValue: '高亮预览' })}
            </h3>
            <div className="min-h-[160px] whitespace-pre-wrap break-words rounded-lg border border-slate-200 bg-white p-4 font-mono text-sm leading-7 text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
              {highlightedText || <span className="text-slate-400">{t('tools.regex-tester.noMatches')}</span>}
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-auto p-5">
            <h3 className="mb-3 flex items-center justify-between gap-2 text-sm font-semibold text-slate-950 dark:text-white">
              <span className="inline-flex items-center gap-2">
                <Hash className="h-4 w-4" aria-hidden="true" />
                {t('tools.regex-tester.matchesLabel')}
              </span>
            </h3>
            <div className="space-y-2">
              {matches.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-300 bg-white px-4 py-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-[#282c34] dark:text-slate-400">
                  {t('tools.regex-tester.noMatches')}
                </div>
              ) : (
                matches.map((match, i) => (
                  <div key={`${match.index}-${i}`} className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-[#282c34]">
                    <div className="mb-1 flex items-center justify-between gap-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      <span>Match {i + 1}</span>
                      <span className="rounded bg-blue-50 px-1.5 py-0.5 font-mono text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                        {t('tools.regex-tester.indexLabel')}: {match.index}
                      </span>
                    </div>
                    <div className="break-words font-mono text-sm text-slate-800 dark:text-slate-100">
                      {match[0] || <span className="text-slate-400">(Empty Match)</span>}
                    </div>
                    {match.length > 1 && (
                      <div className="mt-2 space-y-1 border-t border-slate-100 pt-2 text-xs dark:border-slate-800">
                        {Array.from(match).slice(1).map((group, gi) => (
                          <div key={gi} className="grid grid-cols-[64px_minmax(0,1fr)] gap-2">
                            <span className="font-semibold text-slate-500">{t('tools.regex-tester.groupLabel')} {gi + 1}</span>
                            <span className="break-all font-mono text-blue-700 dark:text-blue-300">{group || 'null'}</span>
                          </div>
                        ))}
                        </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>

      <ToolSEOCard toolKey="regex-tester" />
    </div>
  );
};

export default RegexTester;
