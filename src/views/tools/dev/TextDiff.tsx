import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { diffWordsWithSpace, diffLines } from 'diff';
import { FileText, ArrowRightLeft, AlignLeft, RefreshCw, XCircle } from 'lucide-react';
import { cn } from '../../../lib/utils';

export default function TextDiff() {
  const { t } = useTranslation();
  const [original, setOriginal] = useState('');
  const [modified, setModified] = useState('');
  const [mode, setMode] = useState<'words' | 'lines'>('words');

  const diffResult = useMemo(() => {
    if (!original && !modified) return [];
    if (mode === 'words') {
      return diffWordsWithSpace(original, modified);
    } else {
      return diffLines(original, modified);
    }
  }, [original, modified, mode]);

  const handleClear = () => {
    setOriginal('');
    setModified('');
  };

  const hasChanges = diffResult.some(part => part.added || part.removed);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-7 border-b border-slate-200 pb-7 dark:border-slate-800">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
            {t('tools.text-diff.title', '文本内容比对 (Diff)')}
        </h1>
        <p className="mt-3 max-w-3xl text-[15px] leading-7 text-slate-600 dark:text-slate-400">
            {t('tools.text-diff.subtitle', '快速找出两段代码或文案的差异，支持逐行与逐词模式，纯前端离线对比。')}
        </p>
      </div>

      <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-1 rounded-md bg-slate-100 p-1 dark:bg-slate-800">
              <button
                onClick={() => setMode('words')}
                className={cn(
                  "flex items-center gap-2 rounded px-3 py-1.5 text-sm font-medium transition-colors",
                  mode === 'words' ? "bg-white text-blue-700 shadow-sm dark:bg-slate-950 dark:text-blue-300" : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                )}
              >
                <AlignLeft className="w-4 h-4" />
                {t('tools.text-diff.modeWords', '逐词对比')}
              </button>
              <button
                onClick={() => setMode('lines')}
                className={cn(
                  "flex items-center gap-2 rounded px-3 py-1.5 text-sm font-medium transition-colors",
                  mode === 'lines' ? "bg-white text-blue-700 shadow-sm dark:bg-slate-950 dark:text-blue-300" : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                )}
              >
                <AlignLeft className="w-4 h-4" />
                {t('tools.text-diff.modeLines', '逐行对比')}
              </button>
            </div>
            {(original || modified) && (
              <button
                onClick={handleClear}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-400/10"
              >
                <XCircle className="w-4 h-4" />
                {t('common.clear', '清空内容')}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <section className="flex h-[400px] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3 text-sm font-semibold text-slate-950 dark:border-slate-800 dark:text-white">
                <FileText className="w-4 h-4 text-slate-400" />
                {t('tools.text-diff.originalText', '原文 (Old)')}
              </div>
              <textarea
                value={original}
                onChange={(e) => setOriginal(e.target.value)}
                placeholder={t('tools.text-diff.placeholderOriginal', '在此粘贴原始文本...')}
                className="min-h-0 flex-1 resize-none border-0 bg-white p-4 font-mono text-sm leading-7 text-slate-900 dark:bg-slate-900 dark:text-slate-100"
                spellCheck={false}
              />
            </section>

            <section className="flex h-[400px] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-3 text-sm font-semibold text-slate-950 dark:border-slate-800 dark:text-white">
                <RefreshCw className="w-4 h-4 text-slate-400" />
                {t('tools.text-diff.modifiedText', '修改后 (New)')}
              </div>
              <textarea
                value={modified}
                onChange={(e) => setModified(e.target.value)}
                placeholder={t('tools.text-diff.placeholderModified', '在此粘贴修改后的文本...')}
                className="min-h-0 flex-1 resize-none border-0 bg-white p-4 font-mono text-sm leading-7 text-slate-900 dark:bg-slate-900 dark:text-slate-100"
                spellCheck={false}
              />
            </section>
          </div>

          <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-950 dark:text-white">
                <ArrowRightLeft className="w-4 h-4 text-blue-500" />
                {t('tools.text-diff.resultTitle', '对比结果')}
              </div>
              {hasChanges && (
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-200 dark:bg-red-900/50 border border-red-300 dark:border-red-800"></span> 删减部分</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-200 dark:bg-green-900/50 border border-green-300 dark:border-green-800"></span> 新增部分</span>
                </div>
              )}
            </div>
            
            <div className="min-h-[200px] overflow-x-auto whitespace-pre-wrap bg-white p-4 font-mono text-sm leading-relaxed dark:bg-slate-950">
              {!original && !modified ? (
                <p className="text-slate-400 dark:text-slate-500 italic text-center mt-12">
                  {t('tools.text-diff.emptyTip', '等待输入文本以展示差异...')}
                </p>
              ) : diffResult.map((part, index) => {
                const isAdded = part.added;
                const isRemoved = part.removed;
                
                let className = "text-slate-900 dark:text-slate-100";
                
                if (isAdded) {
                  className = "bg-green-100 dark:bg-green-900/40 text-green-900 dark:text-green-100";
                } else if (isRemoved) {
                  className = "bg-red-100 dark:bg-red-900/40 text-red-900 dark:text-red-100 line-through opacity-80";
                }

                // For line mode, ensure block display if needed, but span with pre-wrap works fine
                // because of `whitespace-pre-wrap`
                return (
                  <span key={index} className={cn(className, mode === 'lines' && (isAdded || isRemoved) ? "block" : "")}>
                    {part.value}
                  </span>
                );
              })}
            </div>
          </section>
      </div>
    </div>
  );
}
