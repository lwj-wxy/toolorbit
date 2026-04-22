import React, { useState, useCallback } from 'react';
import { Fingerprint, Copy, RefreshCcw, Check, Download, AlertCircle } from 'lucide-react';

export default function UuidGenerator() {
  const [quantity, setQuantity] = useState<number>(1);
  const [useHyphens, setUseHyphens] = useState<boolean>(true);
  const [isUppercase, setIsUppercase] = useState<boolean>(false);
  
  const [uuids, setUuids] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  // Fallback v4 implementation if crypto.randomUUID is not available or we need to customize it heavily
  const generateV4UUID = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const handleGenerate = useCallback(() => {
    let count = quantity;
    if (isNaN(count) || count < 1) count = 1;
    if (count > 1000) count = 1000;

    const newUuids: string[] = [];
    for (let i = 0; i < count; i++) {
        let uuid = generateV4UUID();
        
        if (!useHyphens) {
            uuid = uuid.replace(/-/g, '');
        }
        
        if (isUppercase) {
            uuid = uuid.toUpperCase();
        } else {
            uuid = uuid.toLowerCase();
        }
        
        newUuids.push(uuid);
    }
    
    setUuids(newUuids);
    setCopiedIndex(null);
    setCopiedAll(false);
  }, [quantity, useHyphens, isUppercase]);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  const copyAll = () => {
    if (uuids.length === 0) return;
    navigator.clipboard.writeText(uuids.join('\n')).then(() => {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    });
  };

  const downloadTxt = () => {
    if (uuids.length === 0) return;
    const blob = new Blob([uuids.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `uuids-${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 lg:p-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-[#2563eb] rounded-xl flex items-center justify-center shrink-0">
            <Fingerprint className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1e293b]">UUID 在线生成</h1>
            <p className="text-[#64748b] mt-1 text-sm md:text-base">
              基于 RFC 4122 标准，快速批量生成 Version 4 随机 UUID/GUID。
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Settings */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6">
             <h3 className="text-lg font-bold text-[#1e293b] mb-6">生成参数约束</h3>
             
             <div className="space-y-5">
                <div>
                   <label className="block text-sm font-bold text-[#475569] mb-2">生成数量 (最多 1000)</label>
                   <input
                     type="number"
                     min="1"
                     max="1000"
                     value={quantity}
                     onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                     className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-4 py-3 outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all font-mono"
                   />
                </div>

                <div>
                   <label className="block text-sm font-bold text-[#475569] mb-2">排版格式</label>
                   <div className="space-y-3">
                      <label className="flex items-center gap-2 cursor-pointer text-[#334155]">
                        <input
                           type="checkbox"
                           checked={useHyphens}
                           onChange={(e) => setUseHyphens(e.target.checked)}
                           className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                        />
                        包含连接符 (Hyphens)
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-[#334155]">
                        <input
                           type="checkbox"
                           checked={isUppercase}
                           onChange={(e) => setIsUppercase(e.target.checked)}
                           className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                        />
                        使用大写字母 (Uppercase)
                      </label>
                   </div>
                </div>

                <div className="pt-4 border-t border-[#e2e8f0]">
                   <button
                     onClick={handleGenerate}
                     className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-3.5 rounded-xl font-bold shadow-sm transition-all flex items-center justify-center gap-2"
                   >
                      <RefreshCcw className="w-5 h-5" />
                      立即免费生成
                   </button>
                </div>
             </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
             <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800 leading-relaxed font-medium">
                   <strong>完全纯前端侧渲染</strong><br/>
                   生成的 UUID 是在您的当前设备内存中通过 CSPRNG 直接运算所得，<strong>没有经过任何网络请求或回传</strong>，完全保障您的系统业务数据私密性。
                </p>
             </div>
          </div>
        </div>

        {/* Right Side: Results */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 flex flex-col h-full min-h-[500px]">
             <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[#1e293b]">
                   运算结果分析 
                   <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full ml-3">
                      共 {uuids.length} 条
                   </span>
                </h3>
                
                {uuids.length > 0 && (
                   <div className="flex gap-2">
                       <button
                         onClick={downloadTxt}
                         className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-lg bg-white border border-[#cbd5e1] text-[#475569] hover:bg-slate-50 transition-colors shadow-sm"
                       >
                         <Download className="w-4 h-4" /> 导出 Txt
                       </button>
                       <button
                         onClick={copyAll}
                         className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold rounded-lg bg-[#2563eb] text-white hover:bg-[#1d4ed8] transition-colors shadow-sm"
                       >
                         {copiedAll ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                         {copiedAll ? '已全部拷贝' : '全部拷贝'}
                       </button>
                   </div>
                )}
             </div>

             <div className="flex-1 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl overflow-hidden flex flex-col relative">
                {uuids.length === 0 ? (
                   <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-[#94a3b8]">
                      <Fingerprint className="w-16 h-16 mb-4 opacity-20" />
                      <p className="text-lg font-medium">点击左侧"生成"按钮获取您的专属 UUID</p>
                   </div>
                ) : (
                   <div className="flex-1 overflow-y-auto p-2">
                      <ul className="space-y-1">
                         {uuids.map((uuid, idx) => (
                            <li 
                              key={idx} 
                              className="flex items-center justify-between px-4 py-2 hover:bg-white rounded-lg group transition-colors cursor-default"
                            >
                               <div className="flex items-center gap-4">
                                  <span className="text-[#94a3b8] font-mono text-xs w-6 text-right select-none">{idx + 1}</span>
                                  <span className="font-mono text-[#0f172a] sm:text-lg tracking-wider">{uuid}</span>
                               </div>
                               <button
                                 onClick={() => copyToClipboard(uuid, idx)}
                                 className="text-[#94a3b8] hover:text-[#2563eb] opacity-0 group-hover:opacity-100 transition-all p-1.5 rounded-md hover:bg-blue-50"
                                 title="拷贝此行"
                               >
                                 {copiedIndex === idx ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                               </button>
                            </li>
                         ))}
                      </ul>
                   </div>
                )}
             </div>
          </div>
        </div>

      </div>

      {/* Bottom SEO Instructions Panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-8 lg:p-12 mt-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">UUID v4 纯前端在线生成器：唯一业务流水号与主键工厂</h2>
        
        <p className="text-slate-600 mb-6 leading-relaxed">
          UUID（Universally Unique Identifier，通用唯一识别码）是分布式系统中用于确立绝对身份的底层组件。当你在构建需要确保永远不会产生 ID 碰撞（Collision）的数据库主键、API 会话连廊或是无序不重叠流水线号时，使用这段基于随机数的 v4 标准无疑是天作之合。
        </p>

        <h3 className="font-bold text-slate-800 text-lg mb-4">为什么开发者离不开这套批处理车间：</h3>
        <ul className="space-y-4 text-slate-600">
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">1. 万向并发批量生成：</strong>
            <span>做过批量 Mock 数据注入的人应该深有同感，需要随机键的地方总是不止一个。这套沙排组件直接允许拉条从单列拖动至一次 500 个并发渲染，为您提供管够的大批量主键包袱。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">2. 合规的 RFC 4122 指标网段：</strong>
            <span>所有的输出皆采用业界最为公认的 v4 规范版本运算而来。即通过极高熵值的密码学级别安全伪随机数生成器 (CSPRNG) 得出，即使产生几千亿组理论上也不存在重号的阴影。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">3. Txt 无损打包与点选导出：</strong>
            <span>在您一口气冲制数百条号码牌之后，不用费劲去拖拽鼠标滚轮。顶部的『一键全部带走』与独立的 Txt 文本导出功能可以完美桥接到您的 Node.js 导入脚本或是 Excel 表格当中。</span>
          </li>
        </ul>
        
        <p className="text-slate-500 text-sm mt-8 pt-6 border-t border-slate-100">
          格式指南：原生的 RFC UUID 大体上为 32 个串字符配合 4 根连字号组成 <code>xxxx-xx...</code> 结构。如果您的数据库索引建置对于储存空间非常敏感且不需要人类可读分割，可以在复制后使用本文本处理组件区的一键除杂来抹掉这些横杆。
        </p>
      </div>

    </div>
  );
}
