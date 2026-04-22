import React, { useState, useMemo } from 'react';
import { Eraser, Copy, Trash2, Check, Download, AlertCircle, ArrowRight } from 'lucide-react';

export default function TextCleaner() {
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
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">字符串清洗</h1>
            <p className="text-[#64748b] mt-1 text-sm md:text-base">
              在线批量去除文本中的多余空格、换行符、制表符及各类标点符号。
            </p>
          </div>
        </div>
        <div>
           <button 
             onClick={clearAll}
             className="px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-lg flex items-center gap-2 transition-colors border border-transparent hover:border-red-100"
           >
             <Trash2 className="w-4 h-4" /> 清空内容
           </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Side: Input */}
        <div className="flex-1 lg:w-0 bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 flex flex-col min-h-[500px]">
           <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#1e293b] flex items-center gap-2">
                 <span className="w-2 h-6 bg-[#2563eb] rounded-sm block"></span>
                 源文本输入
              </h3>
              <span className="text-sm text-[#94a3b8] font-mono">
                 {inputText.length} 字符
              </span>
           </div>
           <textarea
             value={inputText}
             onChange={(e) => setInputText(e.target.value)}
             placeholder="在此粘贴需要清洗的原始文本..."
             className="flex-1 w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-4 outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all resize-none shadow-inner"
           ></textarea>
        </div>

        {/* Center: Pipeline Settings */}
        <div className="w-full lg:w-[220px] shrink-0 flex flex-col justify-center space-y-4">
           <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 hidden lg:flex flex-col items-center">
              <h4 className="text-sm font-bold text-[#475569] mb-4 w-full text-center border-b border-slate-100 pb-2">过滤规则</h4>
              <div className="space-y-3 w-full">
                 <label className="flex items-center gap-3 cursor-pointer text-sm font-medium text-[#334155] p-2 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap">
                   <input type="checkbox" checked={removeSpaces} onChange={e => setRemoveSpaces(e.target.checked)} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300" />
                   去除所有空格
                 </label>
                 <label className="flex items-center gap-3 cursor-pointer text-sm font-medium text-[#334155] p-2 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap">
                   <input type="checkbox" checked={removeNewlines} onChange={e => setRemoveNewlines(e.target.checked)} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300" />
                   去除所有换行符
                 </label>
                 <label className="flex items-center gap-3 cursor-pointer text-sm font-medium text-[#334155] p-2 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap">
                   <input type="checkbox" checked={removeBlankLines} onChange={e => setRemoveBlankLines(e.target.checked)} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300" />
                   去除多余空行
                 </label>
                 <label className="flex items-center gap-3 cursor-pointer text-sm font-medium text-[#334155] p-2 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap">
                   <input type="checkbox" checked={removeTabs} onChange={e => setRemoveTabs(e.target.checked)} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300" />
                   去除制表符(Tab)
                 </label>
                 <label className="flex items-center gap-3 cursor-pointer text-sm font-medium text-[#334155] p-2 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap">
                   <input type="checkbox" checked={removePunctuation} onChange={e => setRemovePunctuation(e.target.checked)} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300 shrink-0" />
                   <span className="truncate">去除所有标点集</span>
                 </label>
              </div>
              <ArrowRight className="w-6 h-6 text-slate-300 mt-6" />
           </div>

           {/* Mobile View Rules */}
           <div className="lg:hidden bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5">
              <h4 className="text-sm font-bold text-[#475569] mb-3">勾选过滤规则</h4>
              <div className="grid grid-cols-2 gap-2">
                 <label className="flex items-center gap-2 cursor-pointer text-sm text-[#334155] bg-slate-50 p-2 rounded-lg whitespace-nowrap">
                   <input type="checkbox" checked={removeSpaces} onChange={e => setRemoveSpaces(e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />
                   去空格
                 </label>
                 <label className="flex items-center gap-2 cursor-pointer text-sm text-[#334155] bg-slate-50 p-2 rounded-lg whitespace-nowrap">
                   <input type="checkbox" checked={removeNewlines} onChange={e => setRemoveNewlines(e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />
                   去换行
                 </label>
                 <label className="flex items-center gap-2 cursor-pointer text-sm text-[#334155] bg-slate-50 p-2 rounded-lg whitespace-nowrap">
                   <input type="checkbox" checked={removeBlankLines} onChange={e => setRemoveBlankLines(e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />
                   去空行
                 </label>
                 <label className="flex items-center gap-2 cursor-pointer text-sm text-[#334155] bg-slate-50 p-2 rounded-lg whitespace-nowrap">
                   <input type="checkbox" checked={removeTabs} onChange={e => setRemoveTabs(e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />
                   去Tab
                 </label>
                 <label className="flex items-center gap-2 cursor-pointer text-sm text-[#334155] bg-slate-50 p-2 rounded-lg col-span-2 whitespace-nowrap">
                   <input type="checkbox" checked={removePunctuation} onChange={e => setRemovePunctuation(e.target.checked)} className="w-4 h-4 text-blue-600 rounded shrink-0" />
                   <span className="truncate">去除所有标点集(含中文)</span>
                 </label>
              </div>
           </div>
        </div>

        {/* Right Side: Output */}
        <div className="flex-1 lg:w-0 bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 flex flex-col min-h-[500px]">
           <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#1e293b] flex items-center gap-2">
                 <span className="w-2 h-6 bg-emerald-500 rounded-sm block"></span>
                 清洗结果呈现
              </h3>
              <div className="flex items-center gap-3">
                 <span className="text-sm text-[#94a3b8] font-mono mr-2">
                    {outputText.length} 字符
                 </span>
                 {outputText && (
                    <>
                       <button
                         onClick={handleDownload}
                         className="p-1.5 text-[#64748b] hover:text-[#10b981] hover:bg-emerald-50 rounded-md transition-colors"
                         title="另存为 txt"
                       >
                         <Download className="w-5 h-5" />
                       </button>
                       <button
                         onClick={copyToClipboard}
                         className="p-1.5 text-[#64748b] hover:text-[#10b981] hover:bg-emerald-50 rounded-md transition-colors bg-slate-50"
                         title="一键拷贝"
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
                placeholder="勾选中间的过滤规则，结果将在此处实时秒级显示..."
                className="w-full h-full p-4 outline-none resize-none bg-transparent text-[#0f172a]"
              ></textarea>
              
              {!outputText && !inputText && (
                 <div className="absolute inset-0 flex flex-col flex-1 items-center justify-center text-[#94a3b8] pointer-events-none p-4 text-center">
                    <Eraser className="w-12 h-12 mb-3 opacity-20" />
                    <p className="text-sm">支持百万级字符实时无损清洗</p>
                 </div>
              )}
           </div>
        </div>

      </div>

      {/* Bottom SEO Instructions Panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8 lg:p-12 mt-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">在线文本清洗与格式化工具，高效净化杂乱字符串</h2>
        
        <p className="text-slate-600 mb-6 leading-relaxed">
          在处理从网页复制的数据、清理代码片段或是对接异构系统生成的日志文档时，混杂的制表符、多余空格和违规换行往往让人抓狂。在线字符串清洗工具为您提供了一键式的数据净化方案，让杂乱无章的文本瞬间归位，成为可用的规范化语料。
        </p>

        <h3 className="font-bold text-slate-800 text-lg mb-4">掌握批量数据清洗的三重优势：</h3>
        <ul className="space-y-4 text-slate-600">
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">1. 多维度深度清理：</strong>
            <span>支持一键去除首尾空白、多余换行符、甚至剥离全语种标点符号，精准切中程序员和数据分析师在数据预处理（Data Cleaning）过程中的各种底层痛点。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">2. 实时可见的极简反馈：</strong>
            <span>左侧填入脏数据，通过中间灵活的复选框勾选漏斗规则，右侧就能无延迟地吐出清洗后的纯净结果。搭配毫秒级的拷贝与 TXT 导出按钮，告别使用传统代码编辑器中繁琐替换正则表达式的硬核操作。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">3. 零云端留痕的安全策略：</strong>
            <span>和本站的所有处理程序一样，我们关注您的文稿安全。所有的全角半角转换、字符过滤擦除均利用 JavaScript 引擎在本地浏览器跑完逻辑闭环，无需担心您抛入排版的商业密码或病历档案有外泄的风险。</span>
          </li>
        </ul>
        
        <p className="text-slate-500 text-sm mt-8 pt-6 border-t border-slate-100">
          温馨建议：不同的“清洗”复选框选项是可以自由叠加组合使用的！您可以根据对接第三方系统的数据规格要求，组装出自己的专属过滤工作流。
        </p>
      </div>

    </div>
  );
}
