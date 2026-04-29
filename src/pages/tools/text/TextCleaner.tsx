import React, { useState, useMemo } from 'react';
import { Eraser, Copy, Trash2, Check, Download, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function TextCleaner() {
  const { t } = useTranslation();
  const [inputText, setInputText] = useState('');
  
  // Cleaning Options
  const [removeSpaces, setRemoveSpaces] = useState(false); // only space character ' '
  const [removeNewlines, setRemoveNewlines] = useState(false); // \n and \r
  const [removeTabs, setRemoveTabs] = useState(false); // \t
  const [removePunctuation, setRemovePunctuation] = useState(false); // Symbols and punctuation
  const [removeBlankLines, setRemoveBlankLines] = useState(false); // Multiple newlines to single
  
  const [copied, setCopied] = useState(false);

  const cleanText = (text: string) => {
    let result = text;

    if (removeBlankLines) {
      result = result.replace(/\n\s*\n/g, '\n');
    }
    if (removeSpaces) {
      result = result.replace(/ /g, '');
    }
    if (removeNewlines) {
      result = result.replace(/\r?\n|\r/g, '');
    }
    if (removeTabs) {
      result = result.replace(/\t/g, '');
    }
    if (removePunctuation) {
      // Remove all punctuation (both standard and Chinese/Unicode)
      // Keeps letters, numbers, and whitespaces
      result = result.replace(/[^\p{L}\p{N}\s]/gu, '');
    }

    return result;
  };

  const outputText = useMemo(() => cleanText(inputText), [inputText, removeSpaces, removeNewlines, removeTabs, removePunctuation, removeBlankLines]);

  const copyToClipboard = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const clearAll = () => {
    setInputText('');
  };

  const handleDownload = () => {
    if (!outputText) return;
    const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cleaned-text-${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-[#2563eb] rounded-xl flex items-center justify-center shrink-0">
            <Eraser className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('tools.text-cleaner.title')}</h1>
            <p className="text-[#64748b] mt-1 text-sm md:text-base">
              {t('tools.text-cleaner.subtitle')}
            </p>
          </div>
        </div>
        <div>
           <button 
             onClick={clearAll}
             className="px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-lg flex items-center gap-2 transition-colors border border-transparent hover:border-red-100"
           >
             <Trash2 className="w-4 h-4" /> {t('tools.text-cleaner.clearBtn')}
           </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Side: Input */}
        <div className="flex-1 lg:w-0 bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 flex flex-col min-h-[500px]">
           <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#1e293b] flex items-center gap-2">
                 <span className="w-2 h-6 bg-[#2563eb] rounded-sm block"></span>
                 {t('tools.text-cleaner.inputHeader')}
              </h3>
              <span className="text-sm text-[#94a3b8] font-mono">
                 {t('tools.text-cleaner.charCount', { count: inputText.length })}
              </span>
           </div>
           <textarea
             value={inputText}
             onChange={(e) => setInputText(e.target.value)}
             placeholder={t('tools.text-cleaner.inputPlaceholder')}
             className="flex-1 w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-4 outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all resize-none shadow-inner"
           ></textarea>
        </div>

        {/* Center: Pipeline Settings */}
        <div className="w-full lg:w-[220px] shrink-0 flex flex-col justify-center space-y-4">
           <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 hidden lg:flex flex-col items-center">
              <h4 className="text-sm font-bold text-[#475569] mb-4 w-full text-center border-b border-slate-100 pb-2">{t('tools.text-cleaner.rulesHeader')}</h4>
              <div className="space-y-3 w-full">
                 <label className="flex items-center gap-3 cursor-pointer text-sm font-medium text-[#334155] p-2 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap">
                   <input type="checkbox" checked={removeSpaces} onChange={e => setRemoveSpaces(e.target.checked)} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300" />
                   {t('tools.text-cleaner.ruleSpaces')}
                 </label>
                 <label className="flex items-center gap-3 cursor-pointer text-sm font-medium text-[#334155] p-2 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap">
                   <input type="checkbox" checked={removeNewlines} onChange={e => setRemoveNewlines(e.target.checked)} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300" />
                   {t('tools.text-cleaner.ruleNewlines')}
                 </label>
                 <label className="flex items-center gap-3 cursor-pointer text-sm font-medium text-[#334155] p-2 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap">
                   <input type="checkbox" checked={removeBlankLines} onChange={e => setRemoveBlankLines(e.target.checked)} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300" />
                   {t('tools.text-cleaner.ruleBlankLines')}
                 </label>
                 <label className="flex items-center gap-3 cursor-pointer text-sm font-medium text-[#334155] p-2 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap">
                   <input type="checkbox" checked={removeTabs} onChange={e => setRemoveTabs(e.target.checked)} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300" />
                   {t('tools.text-cleaner.ruleTabs')}
                 </label>
                 <label className="flex items-center gap-3 cursor-pointer text-sm font-medium text-[#334155] p-2 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap">
                   <input type="checkbox" checked={removePunctuation} onChange={e => setRemovePunctuation(e.target.checked)} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300 shrink-0" />
                   <span className="truncate">{t('tools.text-cleaner.rulePunctuation')}</span>
                 </label>
              </div>
              <ArrowRight className="w-6 h-6 text-slate-300 mt-6" />
           </div>

           {/* Mobile View Rules */}
           <div className="lg:hidden bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5">
              <h4 className="text-sm font-bold text-[#475569] mb-3">{t('tools.text-cleaner.rulesHeader')}</h4>
              <div className="grid grid-cols-2 gap-2">
                 <label className="flex items-center gap-2 cursor-pointer text-sm text-[#334155] bg-slate-50 p-2 rounded-lg whitespace-nowrap">
                   <input type="checkbox" checked={removeSpaces} onChange={e => setRemoveSpaces(e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />
                   {t('tools.text-cleaner.ruleSpaces')}
                 </label>
                 <label className="flex items-center gap-2 cursor-pointer text-sm text-[#334155] bg-slate-50 p-2 rounded-lg whitespace-nowrap">
                   <input type="checkbox" checked={removeNewlines} onChange={e => setRemoveNewlines(e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />
                   {t('tools.text-cleaner.ruleNewlines')}
                 </label>
                 <label className="flex items-center gap-2 cursor-pointer text-sm text-[#334155] bg-slate-50 p-2 rounded-lg whitespace-nowrap">
                   <input type="checkbox" checked={removeBlankLines} onChange={e => setRemoveBlankLines(e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />
                   {t('tools.text-cleaner.ruleBlankLines')}
                 </label>
                 <label className="flex items-center gap-2 cursor-pointer text-sm text-[#334155] bg-slate-50 p-2 rounded-lg whitespace-nowrap">
                   <input type="checkbox" checked={removeTabs} onChange={e => setRemoveTabs(e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />
                   {t('tools.text-cleaner.ruleTabs')}
                 </label>
                 <label className="flex items-center gap-2 cursor-pointer text-sm text-[#334155] bg-slate-50 p-2 rounded-lg col-span-2 whitespace-nowrap">
                   <input type="checkbox" checked={removePunctuation} onChange={e => setRemovePunctuation(e.target.checked)} className="w-4 h-4 text-blue-600 rounded shrink-0" />
                   <span className="truncate">{t('tools.text-cleaner.rulePunctuationMobile')}</span>
                 </label>
              </div>
           </div>
        </div>

        {/* Right Side: Output */}
        <div className="flex-1 lg:w-0 bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 flex flex-col min-h-[500px]">
           <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#1e293b] flex items-center gap-2">
                 <span className="w-2 h-6 bg-emerald-500 rounded-sm block"></span>
                 {t('tools.text-cleaner.outputHeader')}
              </h3>
              <div className="flex items-center gap-3">
                 <span className="text-sm text-[#94a3b8] font-mono mr-2">
                    {t('tools.text-cleaner.charCount', { count: outputText.length })}
                 </span>
                 {outputText && (
                    <>
                       <button
                         onClick={handleDownload}
                         className="p-1.5 text-[#64748b] hover:text-[#10b981] hover:bg-emerald-50 rounded-md transition-colors"
                         title={t('tools.text-cleaner.downloadTitle')}
                       >
                         <Download className="w-5 h-5" />
                       </button>
                       <button
                         onClick={copyToClipboard}
                         className="p-1.5 text-[#64748b] hover:text-[#10b981] hover:bg-emerald-50 rounded-md transition-colors bg-slate-50"
                         title={t('tools.text-cleaner.copyTitle')}
                       >
                         {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                       </button>
                    </>
                 )}
              </div>
           </div>
           
           <div className="flex-1 w-full bg-[#f8fafc] border border-emerald-100 rounded-xl overflow-hidden relative shadow-inner">
              <textarea
                value={outputText}
                readOnly
                placeholder={t('tools.text-cleaner.outputPlaceholder')}
                className="w-full h-full p-4 outline-none resize-none bg-transparent text-[#0f172a]"
              ></textarea>
              
              {!outputText && !inputText && (
                 <div className="absolute inset-0 flex flex-col flex-1 items-center justify-center text-[#94a3b8] pointer-events-none p-4 text-center">
                    <Eraser className="w-12 h-12 mb-3 opacity-20" />
                    <p className="text-sm">{t('tools.text-cleaner.supportMsg')}</p>
                 </div>
              )}
           </div>
        </div>

      </div>
    </div>
  );
}
