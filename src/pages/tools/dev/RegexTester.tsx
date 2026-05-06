import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ToolSEOCard from '../../../components/ToolSEOCard';
import { 
  Search,
  Settings2,
  Trash2,
  Code2,
  Text,
  AlertCircle,
  Hash,
  Info
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
    <div className="max-w-6xl mx-auto p-4 sm:p-6 pb-24">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-sm">
              <Search className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                {t('tools.regex-tester.title')}
              </h1>
              <p className="text-slate-500 text-sm mt-0.5">
                {t('tools.regex-tester.subtitle')}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setRegex('([a-z]+)');
              setFlags('g');
              setTestText('Hello World 2026 ToolOrbit');
            }}
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
          >
            {t('tools.regex-tester.resetBtn')}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Regex Input Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Code2 size={16} /> {t('tools.regex-tester.regexLabel')}
                </label>
                {error && (
                  <span className="text-xs text-red-500 bg-red-50 px-3 py-1 rounded-full flex items-center gap-1.5 animate-pulse">
                    <AlertCircle size={14} />
                    {t('tools.regex-tester.errorTitle')}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 p-1 bg-slate-50 rounded-2xl border border-slate-100 focus-within:ring-4 focus-within:ring-blue-100 focus-within:border-blue-200 transition-all">
                <span className="pl-4 font-mono text-xl text-slate-400">/</span>
                <input
                  type="text"
                  value={regex}
                  onChange={(e) => setRegex(e.target.value)}
                  placeholder={t('tools.regex-tester.regexPlaceholder')}
                  className="flex-1 bg-transparent py-4 font-mono text-lg text-slate-900 outline-none border-none placeholder:text-slate-300"
                />
                <span className="font-mono text-xl text-slate-400">/</span>
                <input
                  type="text"
                  value={flags}
                  onChange={(e) => setFlags(e.target.value)}
                  className="w-16 bg-white border border-slate-200 rounded-xl py-2 px-3 mr-1 font-mono text-blue-600 text-center focus:ring-2 focus:ring-blue-200 outline-none transition-shadow"
                  placeholder="flags"
                />
              </div>
              {error && <p className="mt-3 text-xs text-red-400 font-mono italic">Error: {error}</p>}
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
              <label className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Text size={16} /> {t('tools.regex-tester.textLabel')}
              </label>
              <div className="relative group">
                <textarea
                  value={testText}
                  onChange={(e) => setTestText(e.target.value)}
                  placeholder={t('tools.regex-tester.textPlaceholder')}
                  className="w-full h-48 sm:h-64 p-5 font-mono text-sm bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-200 transition-all resize-none outline-none leading-relaxed"
                />
                <div className="absolute inset-0 p-5 pointer-events-none font-mono text-sm leading-relaxed text-transparent overflow-auto whitespace-pre-wrap break-words text-left">
                  {highlightedText}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Tools Column */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-wider">
                <Settings2 size={16} /> {t('tools.regex-tester.sidebarTitle')}
              </h3>
              <div className="space-y-3">
                {availableFlags.map((flag) => (
                  <button
                    key={flag.key}
                    onClick={() => handleFlagToggle(flag.key)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 ${
                      flags.includes(flag.key)
                        ? 'border-blue-200 bg-blue-50/50 shadow-sm ring-1 ring-blue-100'
                        : 'border-slate-50 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                      flags.includes(flag.key) ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-200'
                    }`}>
                      {flags.includes(flag.key) && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <div>
                      <div className={`text-sm font-bold ${flags.includes(flag.key) ? 'text-blue-900' : 'text-slate-700'}`}>
                        {flag.label}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 leading-tight">{flag.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wider">
                  <Hash size={16} /> {t('tools.regex-tester.matchesLabel')} ({matches.length})
                </h3>
              </div>
              <div className="space-y-2 max-h-[400px] overflow-auto pr-2 custom-scrollbar">
                {matches.length === 0 ? (
                  <div className="text-center py-10 text-slate-300 italic text-sm border-2 border-dashed border-slate-50 rounded-2xl">
                    {t('tools.regex-tester.noMatches')}
                  </div>
                ) : (
                  matches.map((match, i) => (
                    <div key={i} className="p-3 bg-slate-50 border border-slate-100 rounded-xl hover:border-blue-200 transition-colors group">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-widest">
                        <span>MATCH {i + 1}</span>
                        <span className="font-mono bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded tracking-normal">{t('tools.regex-tester.indexLabel')}: {match.index}</span>
                      </div>
                      <div className="font-mono text-sm text-slate-700 break-words line-clamp-2">
                        {match[0] || <span className="text-slate-300 italic">(Empty Match)</span>}
                      </div>
                      {match.length > 1 && (
                        <div className="mt-2 pt-2 border-t border-slate-100 space-y-1">
                          {Array.from(match).slice(1).map((group, gi) => (
                            <div key={gi} className="flex gap-2 text-[10px]">
                              <span className="text-slate-400 font-bold">{t('tools.regex-tester.groupLabel')} {gi + 1}:</span>
                              <span className="text-blue-600 font-mono break-all line-clamp-1">{group || 'null'}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-lg shadow-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <Info size={18} />
                <h4 className="font-bold">{t('tools.regex-tester.didYouKnow')}</h4>
              </div>
              <p className="text-sm text-blue-100 leading-relaxed mb-4">
                {t('tools.regex-tester.didYouKnowDesc')}
              </p>
              <a 
                href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions" 
                target="_blank" 
                rel="noreferrer"
                className="inline-block w-full py-2 bg-white/10 hover:bg-white/20 rounded-xl text-center text-xs font-bold transition-all"
              >
                {t('tools.regex-tester.learnMore')}
              </a>
            </div>
          </div>
        </div>
        <ToolSEOCard toolKey="regex-tester" />
      </div>
    </div>
  );
};

export default RegexTester;
