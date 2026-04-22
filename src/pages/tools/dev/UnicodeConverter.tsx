import React, { useState } from 'react';
import { FileCode2, Copy, Trash2, ArrowRightLeft, Check } from 'lucide-react';

export default function UnicodeConverter() {
  const [nativeText, setNativeText] = useState('');
  const [unicodeText, setUnicodeText] = useState('');

  const [copiedNative, setCopiedNative] = useState(false);
  const [copiedUnicode, setCopiedUnicode] = useState(false);

  // Native -> Unicode (\uXXXX)
  const handleEncode = () => {
    if (!nativeText) return;
    const res = nativeText.split('').map((char) => {
      const code = char.charCodeAt(0).toString(16);
      return '\\u' + '0000'.substring(0, 4 - code.length) + code;
    }).join('');
    setUnicodeText(res);
  };

  // Unicode (\uXXXX) -> Native
  const handleDecode = () => {
    if (!unicodeText) return;
    try {
      // Decode unicode string back to native. Replacing all \\u sequences.
      // E.g. \u4e2d\u6587 -> 中文
      const unescaped = unicodeText.replace(/\\u([0-9a-fA-F]{4})/g, (match, grp) => {
        return String.fromCharCode(parseInt(grp, 16));
      });
      setNativeText(unescaped);
    } catch (e) {
        alert("请输入合法的 Unicode 转义格式 (例如: \\u4e2d)");
    }
  };

  // Convert on typing
  const onNativeChange = (val: string) => {
    setNativeText(val);
  };

  const onUnicodeChange = (val: string) => {
    setUnicodeText(val);
  };

  const clearAll = () => {
    setNativeText('');
    setUnicodeText('');
  };

  const copyText = (text: string, type: 'native' | 'unicode') => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      if (type === 'native') {
        setCopiedNative(true);
        setTimeout(() => setCopiedNative(false), 2000);
      } else {
        setCopiedUnicode(true);
        setTimeout(() => setCopiedUnicode(false), 2000);
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-[#2563eb] rounded-xl flex items-center justify-center shrink-0">
            <FileCode2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Unicode 编码转换</h1>
            <p className="text-[#64748b] mt-1 text-sm md:text-base">
              一键实现中文字符、符号与 \uXXXX 格式的 Unicode 编码互转还原。
            </p>
          </div>
        </div>
        <div>
            <button 
              onClick={clearAll}
              className="px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-lg flex items-center gap-2 transition-colors border border-transparent hover:border-red-100"
            >
              <Trash2 className="w-4 h-4" /> 彻底清空
            </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-stretch min-h-[500px]">
        
        {/* Left Side: Native Text */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[#1e293b] flex items-center gap-2">
                    <span className="w-2 h-6 bg-[#2563eb] rounded-sm block"></span>
                    原始文本 (中文等)
                </h3>
                <button
                  onClick={() => copyText(nativeText, 'native')}
                  className="p-1.5 text-[#64748b] hover:text-[#2563eb] hover:bg-blue-50 rounded-md transition-colors"
                  title="复制内容"
                >
                  {copiedNative ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                </button>
            </div>
            <textarea
                value={nativeText}
                onChange={(e) => onNativeChange(e.target.value)}
                placeholder="在此输入您的原始中文、符号或任意文本..."
                className="flex-1 w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-4 outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all resize-none shadow-inner"
            ></textarea>
        </div>

        {/* Center: Action Buttons */}
        <div className="flex lg:flex-col justify-center items-center gap-4 py-4 lg:py-0">
            <button
               onClick={handleEncode}
               className="w-full lg:w-auto px-6 py-3 lg:px-4 lg:py-4 bg-[#2563eb] text-white hover:bg-[#1d4ed8] rounded-xl shadow-lg transition-transform hover:scale-105 group font-bold flex flex-row lg:flex-col items-center gap-2"
               title="原生文本转为 Unicode"
            >
               <span className="text-sm">转码</span>
               <ArrowRightLeft className="w-5 h-5 hidden lg:block rotate-90 lg:rotate-0" />
               <span className="lg:hidden">为 Unicode</span>
            </button>
            
            <button
               onClick={handleDecode}
               className="w-full lg:w-auto px-6 py-3 lg:px-4 lg:py-4 bg-white text-[#2563eb] border-2 border-[#2563eb] hover:bg-blue-50 rounded-xl shadow-sm transition-transform hover:scale-105 group font-bold flex flex-row lg:flex-col items-center gap-2"
               title="Unicode 解码为文本"
            >
               <span className="lg:hidden">从 Unicode</span>
               <ArrowRightLeft className="w-5 h-5 hidden lg:block rotate-90 lg:rotate-180" />
               <span className="text-sm">解码</span>
            </button>
        </div>

        {/* Right Side: Unicode Text */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[#1e293b] flex items-center gap-2">
                    <span className="w-2 h-6 bg-purple-500 rounded-sm block"></span>
                    Unicode 编码 (\u)
                </h3>
                <button
                  onClick={() => copyText(unicodeText, 'unicode')}
                  className="p-1.5 text-[#64748b] hover:text-[#2563eb] hover:bg-blue-50 rounded-md transition-colors"
                  title="复制内容"
                >
                  {copiedUnicode ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                </button>
            </div>
            <textarea
                value={unicodeText}
                onChange={(e) => onUnicodeChange(e.target.value)}
                placeholder="例如: \u4e2d\u6587"
                className="flex-1 w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-4 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none shadow-inner font-mono text-[#0f172a] text-[15px]"
            ></textarea>
        </div>
      </div>
      
      {/* Bottom SEO Instructions Panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8 lg:p-12 mt-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">在线 Unicode 双向转换计算器：解析底层字符编码之谜</h2>
        
        <p className="text-slate-600 mb-6 leading-relaxed">
          当你打开一段老旧的 Java 或 C# 项目的配置属性文档，原本整洁的中文很可能会被强制转码成一堆形如 <code>\u4e2d\u6587</code> 带着斜杠的“生僻文书”。使用这款基于正则表达式逆转封装的 Unicode/原生文本格式转换站，能让你跨越国际化 (i18n) 环境里的沟通高墙。
        </p>

        <h3 className="font-bold text-slate-800 text-lg mb-4">掌握转义字符编解的三重优势：</h3>
        <ul className="space-y-4 text-slate-600">
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">1. 万国语言的全量支撑：</strong>
            <span>除了常用的简体中文转换之外，这套强有力的引擎兼容所有的韩、日文甚至极度偏僻生辉的颜文字、Emoji 脸谱。您可以在这两列宽阔的文字大仓中放飞测试任何语言组合包。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">2. 防止 JSON 和数据库底层转义吞噬：</strong>
            <span>在把数据推送给不支持高位宽或者是纯 English 语系的古老 SQL 之前，将其全部映射推导为反斜杠 u 结构，将最大可能地防止字段内容被硬生生吞噬变成 `???` 号的杯具。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">3. 桌面级别的交互体验反馈：</strong>
            <span>摆脱早年网页工具简陋狭窄的布局。这组控件为您赋予了宏大的三模块分屏视图。无论是从原文强制序列化，还是把满天飞絮的密文解压缩成可被人眼所阅读的神清气爽，均只需要动用中间那颗带指向灯的直觉按钮。</span>
          </li>
        </ul>
        
        <p className="text-slate-500 text-sm mt-8 pt-6 border-t border-slate-100">
          进阶说明：ASCII 表内的基本西文字符（涵盖英文 26 键表及常用符号）在编码过程中会被算法智能留白，不参与 `\u` 的裹挟。这是确保长难句代码的体积可控范围以及日志可读性的国际共识机制。
        </p>
      </div>

    </div>
  );
}
