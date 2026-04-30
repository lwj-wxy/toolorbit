import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Fingerprint, Copy, RefreshCcw, Check, Download, ShieldCheck } from 'lucide-react';
import ToolSEOCard from '../../../components/ToolSEOCard';

export default function UuidGenerator() {
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState<number>(1);
  const [useHyphens, setUseHyphens] = useState<boolean>(true);
  const [isUppercase, setIsUppercase] = useState<boolean>(false);
  
  const [uuids, setUuids] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

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
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
            <Fingerprint className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{t('tools.uuid-generator.title')}</h1>
            <p className="text-slate-500 mt-1 text-sm md:text-base font-medium">
              {t('tools.uuid-generator.subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Settings */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200/80 p-8">
             <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-indigo-500 rounded-full block"></span>
                {t('tools.uuid-generator.configTitle')}
             </h3>
             
             <div className="space-y-6">
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">{t('tools.uuid-generator.countLabel')}</label>
                   <input
                     type="number"
                     min="1"
                     max="1000"
                     value={quantity}
                     onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                     className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all font-mono font-bold text-lg"
                   />
                </div>

                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-4">排版格式</label>
                   <div className="space-y-3">
                      <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl cursor-pointer hover:border-indigo-200 transition-colors group">
                        <input
                           type="checkbox"
                           checked={useHyphens}
                           onChange={(e) => setUseHyphens(e.target.checked)}
                           className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                        <span className="text-sm font-bold text-slate-600 group-hover:text-indigo-600">{t('tools.uuid-generator.optHyphens')}</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl cursor-pointer hover:border-indigo-200 transition-colors group">
                        <input
                           type="checkbox"
                           checked={isUppercase}
                           onChange={(e) => setIsUppercase(e.target.checked)}
                           className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                        <span className="text-sm font-bold text-slate-600 group-hover:text-indigo-600">{t('tools.uuid-generator.optUppercase')}</span>
                      </label>
                   </div>
                </div>

                <button
                  onClick={handleGenerate}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 px-6 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-3 text-lg mt-4 group"
                >
                   <RefreshCcw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
                   {t('tools.uuid-generator.generateBtn')}
                </button>
             </div>
          </div>

          <div className="bg-amber-50 border-2 border-amber-100 rounded-[1.5rem] p-6 flex gap-4">
             <ShieldCheck className="w-10 h-10 text-amber-600 shrink-0" />
             <div className="space-y-1">
                <div className="font-black text-amber-900 leading-tight">{t('tools.uuid-generator.securityTitle')}</div>
                <p className="text-xs font-bold text-amber-700/80 leading-relaxed">
                  {t('tools.uuid-generator.securityDesc')}
                </p>
             </div>
          </div>
        </div>

        {/* Right Side: Results */}
        <div className="lg:col-span-8 flex flex-col">
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200/80 p-8 flex flex-col h-full min-h-[500px]">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-3">
                   {t('tools.uuid-generator.resultTitle')}
                   {uuids.length > 0 && (
                     <span className="bg-indigo-100 text-indigo-600 text-[10px] px-2 py-1 rounded-full font-black uppercase tracking-wider">
                        {t('tools.uuid-generator.resultCount', { count: uuids.length })}
                     </span>
                   )}
                </h3>
                
                {uuids.length > 0 && (
                   <div className="flex gap-2">
                       <button
                         onClick={downloadTxt}
                         className="text-xs font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 border-slate-50 hover:bg-slate-50 transition-all"
                       >
                         <Download className="w-4 h-4" /> TXT
                       </button>
                       <button
                         onClick={copyAll}
                         className="text-xs font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-widest flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 border-indigo-50 hover:bg-indigo-50 transition-all"
                       >
                         {copiedAll ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                         {copiedAll ? 'SUCCESS' : t('tools.uuid-generator.copyAll')}
                       </button>
                   </div>
                )}
             </div>

             <div className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-3xl p-2 sm:p-6 overflow-hidden relative">
                {uuids.length === 0 ? (
                   <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 drop-shadow-sm opacity-60">
                      <Fingerprint className="w-20 h-20 mb-4 animate-pulse" />
                      <p className="font-black text-lg text-center px-6">{t('tools.uuid-generator.placeholder')}</p>
                   </div>
                ) : (
                   <div className="h-full overflow-y-auto custom-scrollbar pr-2 space-y-2">
                      <ul className="space-y-2">
                         {uuids.map((uuid, idx) => (
                            <li 
                              key={idx} 
                              className="bg-white border border-slate-200 rounded-xl p-4 font-mono font-bold text-slate-700 shadow-sm flex items-center justify-between hover:border-indigo-400 group transition-all"
                            >
                               <div className="flex items-center gap-4">
                                  <span className="text-slate-400 font-mono text-xs w-6 text-right select-none">{idx + 1}</span>
                                  <span className="font-mono text-slate-700 sm:text-lg tracking-wider break-all">{uuid}</span>
                               </div>
                               <button
                                 onClick={() => copyToClipboard(uuid, idx)}
                                 className="text-slate-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-all p-1.5 rounded-md hover:bg-indigo-50"
                               >
                                 {copiedIndex === idx ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
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
      <ToolSEOCard toolKey="uuid-generator" />
    </div>
  );
}
