import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Copy, Trash2, ArrowRightLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { xml2json, json2xml } from 'xml-js';
import { cn } from '../../../lib/utils';

export default function XmlToJson() {
  const { t } = useTranslation();
  
  const [sourceCode, setSourceCode] = useState('');
  const [resultCode, setResultCode] = useState('');
  const [mode, setMode] = useState<'xml2json' | 'json2xml'>('xml2json');
  const [error, setError] = useState<string | null>(null);

  // Conversion logic
  useEffect(() => {
    if (!sourceCode.trim()) {
      setResultCode('');
      setError(null);
      return;
    }

    try {
      if (mode === 'xml2json') {
        // convert XML to JSON
        const jsonResult = xml2json(sourceCode, { compact: true, spaces: 2 });
        setResultCode(jsonResult);
        setError(null);
      } else {
        // convert JSON to XML
        // check if it's valid JSON first
        JSON.parse(sourceCode); 
        const xmlResult = json2xml(sourceCode, { compact: true, spaces: 2 });
        setResultCode(xmlResult);
        setError(null);
      }
    } catch (err: any) {
      setResultCode('');
      setError(err.message || 'Parsing error');
    }
  }, [sourceCode, mode]);

  const toggleMode = () => {
    // If there is valid result code, use it as the new source
    if (resultCode && !error) {
      setSourceCode(resultCode);
    }
    setMode(prev => prev === 'xml2json' ? 'json2xml' : 'xml2json');
  };

  const handleCopy = () => {
    if (resultCode) {
      navigator.clipboard.writeText(resultCode)
        .then(() => toast.success(t('common.copied', '已复制到剪贴板')))
        .catch(() => toast.error('复制失败'));
    }
  };

  const handleClear = () => {
    setSourceCode('');
    setResultCode('');
    setError(null);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            {t('tools.xml-json.title', 'XML ↔ JSON 互转器')}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            {t('tools.xml-json.subtitle', '在两种最流行的 API 数据结构间即时互转，支持深层嵌套与属性映射。')}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
          {/* Action Bar */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3 bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
              <span className={cn("px-4 py-1.5 rounded-md text-sm font-medium transition-colors", mode === 'xml2json' ? "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white" : "text-slate-500")}>
                XML
              </span>
              <button 
                onClick={toggleMode}
                className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full transition-colors"
                title="切换方向"
              >
                <ArrowRightLeft className="w-5 h-5" />
              </button>
              <span className={cn("px-4 py-1.5 rounded-md text-sm font-medium transition-colors", mode === 'json2xml' ? "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white" : "text-slate-500")}>
                JSON
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleClear}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors border border-transparent"
              >
                <Trash2 className="w-4 h-4" />
                {t('common.clear', '清空')}
              </button>
              <button
                onClick={handleCopy}
                disabled={!resultCode || !!error}
                className="flex items-center gap-2 px-4 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <Copy className="w-4 h-4" />
                {t('common.copy', '复制结果')}
              </button>
            </div>
          </div>

          {/* Editor Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-slate-700 h-[600px]">
            {/* Input */}
            <div className="flex flex-col relative">
               <div className="absolute top-2 right-4 text-xs font-mono text-slate-400 bg-white/80 dark:bg-slate-800/80 px-2 py-1 rounded">
                 {mode === 'xml2json' ? 'Input: XML' : 'Input: JSON'}
               </div>
               <textarea
                 value={sourceCode}
                 onChange={(e) => setSourceCode(e.target.value)}
                 placeholder={mode === 'xml2json' ? '<root>\n  <item>Hello</item>\n</root>' : '{\n  "root": {\n    "item": "Hello"\n  }\n}'}
                 className="flex-1 w-full p-4 bg-transparent border-none focus:ring-0 resize-none font-mono text-sm leading-relaxed text-slate-800 dark:text-slate-200"
                 spellCheck={false}
               />
               {error && sourceCode && (
                 <div className="p-3 bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm font-mono overflow-auto max-h-32">
                   {error}
                 </div>
               )}
            </div>

            {/* Output */}
            <div className="flex flex-col relative bg-slate-50 dark:bg-[rgb(13,17,23)]">
               <div className="absolute top-2 right-4 text-xs font-mono text-slate-400 px-2 py-1 bg-slate-50/80 dark:bg-[rgb(13,17,23)]/80 rounded z-10">
                 {mode === 'xml2json' ? 'Output: JSON' : 'Output: XML'}
               </div>
               <textarea
                 readOnly
                 value={resultCode}
                 placeholder="Output..."
                 className="flex-1 w-full p-4 bg-transparent border-none focus:ring-0 resize-none font-mono text-sm leading-relaxed text-slate-800 dark:text-slate-300"
                 spellCheck={false}
               />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
