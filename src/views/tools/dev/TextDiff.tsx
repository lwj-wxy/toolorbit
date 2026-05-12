import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { diffWordsWithSpace, diffLines, Change } from 'diff';
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
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            {t('tools.text-diff.title', '文本内容比对 (Diff)')}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            {t('tools.text-diff.subtitle', '快速找出两段代码或文案的差异，支持逐行与逐词模式，纯前端离线对比。')}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 gap-4">
            <div className="flex items-center space-x-2 bg-slate-200 dark:bg-slate-900 p-1 rounded-lg">
              <button
                onClick={() => setMode('words')}
                className={cn(
                  "px-4 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2",
                  mode === 'words' ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                <AlignLeft className="w-4 h-4" />
                {t('tools.text-diff.modeWords', '逐词对比')}
              </button>
              <button
                onClick={() => setMode('lines')}
                className={cn(
                  "px-4 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2",
                  mode === 'lines' ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                <AlignLeft className="w-4 h-4" />
                {t('tools.text-diff.modeLines', '逐行对比')}
              </button>
            </div>
            {(original || modified) && (
              <button
                onClick={handleClear}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-400/10 rounded-lg transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-400/20"
              >
                <XCircle className="w-4 h-4" />
                {t('common.clear', '清空内容')}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-slate-700">
            {/* Original Input */}
            <div className="flex flex-col h-[400px]">
              <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300 text-sm">
                <FileText className="w-4 h-4 text-slate-400" />
                {t('tools.text-diff.originalText', '原文 (Old)')}
              </div>
              <textarea
                value={original}
                onChange={(e) => setOriginal(e.target.value)}
                placeholder={t('tools.text-diff.placeholderOriginal', '在此粘贴原始文本...')}
                className="flex-1 w-full p-4 bg-transparent border-none focus:ring-0 resize-none font-mono text-sm text-slate-900 dark:text-slate-100"
                spellCheck={false}
              />
            </div>

            {/* Modified Input */}
            <div className="flex flex-col h-[400px]">
              <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300 text-sm">
                <RefreshCw className="w-4 h-4 text-slate-400" />
                {t('tools.text-diff.modifiedText', '修改后 (New)')}
              </div>
              <textarea
                value={modified}
                onChange={(e) => setModified(e.target.value)}
                placeholder={t('tools.text-diff.placeholderModified', '在此粘贴修改后的文本...')}
                className="flex-1 w-full p-4 bg-transparent border-none focus:ring-0 resize-none font-mono text-sm text-slate-900 dark:text-slate-100"
                spellCheck={false}
              />
            </div>
          </div>

          {/* Diff Result */}
          <div className="border-t border-slate-200 dark:border-slate-700">
            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300 text-sm">
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
            
            <div className="p-4 bg-white dark:bg-slate-950 font-mono text-sm overflow-x-auto whitespace-pre-wrap leading-relaxed min-h-[200px]">
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
          </div>

        </div>
      </div>
    </>
  );
}
