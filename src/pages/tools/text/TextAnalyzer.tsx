import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export default function TextAnalyzer() {
  const { t } = useTranslation();
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentences = text.trim() ? text.split(/[.!?]+/).filter(Boolean).length : 0;
    const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(Boolean).length : 0;
    const lines = text.trim() ? text.split('\n').length : 0;

      return [
      { name: t('tools.text-analyzer.wordCount'), value: words },
      { name: t('tools.text-analyzer.charCount'), value: chars },
      { name: t('tools.text-analyzer.charCountNoSpace'), value: charsNoSpaces },
      { name: t('tools.text-analyzer.sentenceCount'), value: sentences },
      { name: t('tools.text-analyzer.paragraphCount'), value: paragraphs },
      { name: t('tools.text-analyzer.lineCount'), value: lines },
    ];
  }, [text, t]);

  const letterFrequency = useMemo(() => {
    if (!text) return [];
    const counts: Record<string, number> = {};
    const lowerText = text.toLowerCase().replace(/[^a-z]/g, '');
    for (const char of lowerText) {
      counts[char] = (counts[char] || 0) + 1;
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  }, [text]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            {t('tools.text-analyzer.title')}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {t('tools.text-analyzer.subtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Input */}
        <div className="lg:col-span-2 flex flex-col">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="block w-full flex-1 rounded-xl border-0 py-4 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-relaxed resize-none bg-white min-h-[500px]"
            placeholder={t('tools.text-analyzer.placeholder')}
          />
        </div>

        {/* Stats Panel */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 shrink-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 tracking-tight">{t('tools.text-analyzer.standardStats')}</h3>
            <dl className="space-y-4">
              {stats.map((stat) => (
                <div key={stat.name} className="flex flex-wrap items-center justify-between">
                  <dt className="text-sm font-medium text-gray-500">{stat.name}</dt>
                  <dd className="text-md font-bold text-gray-900">{stat.value.toLocaleString()}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 tracking-tight">{t('tools.text-analyzer.letterFreq')}</h3>
            {letterFrequency.length > 0 ? (
              <div className="space-y-3 flex-1 overflow-auto">
                {letterFrequency.map(([letter, count]) => {
                  const maxCount = letterFrequency[0][1];
                  const percentage = Math.round((count / maxCount) * 100);
                  
                  return (
                    <div key={letter} className="flex items-center text-sm">
                      <span className="w-4 font-mono font-bold text-gray-700 capitalize">{letter}</span>
                      <div className="flex-1 ml-3 mr-3 bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-indigo-500 h-full rounded-full" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="w-8 text-right font-medium text-gray-600">{count}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic mt-auto mb-auto">{t('tools.text-analyzer.noLetterFound')}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
