import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Fingerprint, Copy, RefreshCcw, Check, Download } from 'lucide-react';
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
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">{t('tools.uuid-generator.title')}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            {t('tools.uuid-generator.subtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        
        {/* Left Side: Settings */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
             <h3 className="block text-sm font-semibold leading-6 text-slate-900">
                {t('tools.uuid-generator.configTitle')}
             </h3>
          </div>

          <div className="flex min-h-[500px] flex-col rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
             
             <div className="space-y-6">
                <div>
                   <label className="mb-2 block text-sm font-semibold text-slate-700">{t('tools.uuid-generator.countLabel')}</label>
                   <input
                     type="number"
                     min="1"
                     max="1000"
                     value={quantity}
                     onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                     className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 font-mono text-lg font-semibold text-slate-900 shadow-sm outline-none transition-colors focus:border-cyan-500"
                   />
                </div>

                <div>
                   <label className="mb-3 block text-sm font-semibold text-slate-700">排版格式</label>
                   <div className="space-y-3">
                      <label className="group flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 transition-colors hover:border-cyan-300">
                        <input
                           type="checkbox"
                           checked={useHyphens}
                           onChange={(e) => setUseHyphens(e.target.checked)}
                           className="h-5 w-5 cursor-pointer rounded text-cyan-600 focus:ring-cyan-500"
                        />
                        <span className="text-sm font-semibold text-slate-600 group-hover:text-cyan-700">{t('tools.uuid-generator.optHyphens')}</span>
                      </label>
                      <label className="group flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 transition-colors hover:border-cyan-300">
                        <input
                           type="checkbox"
                           checked={isUppercase}
                           onChange={(e) => setIsUppercase(e.target.checked)}
                           className="h-5 w-5 cursor-pointer rounded text-cyan-600 focus:ring-cyan-500"
                        />
                        <span className="text-sm font-semibold text-slate-600 group-hover:text-cyan-700">{t('tools.uuid-generator.optUppercase')}</span>
                      </label>
                   </div>
                </div>

                <button
                  onClick={handleGenerate}
                  className="mt-4 flex w-full items-center justify-center gap-3 rounded-lg bg-cyan-600 px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-cyan-700 active:scale-[0.99]"
                >
                   <RefreshCcw className="h-5 w-5" />
                   {t('tools.uuid-generator.generateBtn')}
                </button>
             </div>
          </div>
        </div>

        {/* Right Side: Results */}
        <div className="flex flex-col space-y-3">
             <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-3 text-sm font-semibold leading-6 text-slate-900">
                   {t('tools.uuid-generator.resultTitle')}
                   {uuids.length > 0 && (
                     <span className="rounded-full bg-cyan-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-cyan-700">
                        {t('tools.uuid-generator.resultCount', { count: uuids.length })}
                     </span>
                   )}
                </h3>
                
                {uuids.length > 0 && (
                   <div className="flex gap-2">
                       <button
                         onClick={downloadTxt}
                         className="flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                       >
                         <Download className="w-4 h-4" /> TXT
                       </button>
                       <button
                         onClick={copyAll}
                         className="flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                       >
                         {copiedAll ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                         {copiedAll ? 'SUCCESS' : t('tools.uuid-generator.copyAll')}
                       </button>
                   </div>
                )}
             </div>

             <div className="relative h-[500px] overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-2 shadow-sm sm:p-4">
                {uuids.length === 0 ? (
                   <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <Fingerprint className="mb-4 h-16 w-16 text-slate-300" />
                      <p className="px-6 text-base font-semibold text-slate-500">{t('tools.uuid-generator.placeholder')}</p>
                   </div>
                ) : (
                   <div className="h-full overflow-y-auto custom-scrollbar pr-2 space-y-2">
                      <ul className="space-y-2">
                         {uuids.map((uuid, idx) => (
                            <li 
                              key={idx} 
                              className="group flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 font-mono font-semibold text-slate-700 shadow-sm transition-colors hover:border-cyan-400"
                            >
                               <div className="flex items-center gap-4">
                                  <span className="text-slate-400 font-mono text-xs w-6 text-right select-none">{idx + 1}</span>
                                  <span className="font-mono text-slate-700 sm:text-lg tracking-wider break-all">{uuid}</span>
                               </div>
                               <button
                                 onClick={() => copyToClipboard(uuid, idx)}
                                 className="rounded-md p-1.5 text-slate-400 opacity-0 transition-all hover:bg-cyan-50 hover:text-cyan-700 group-hover:opacity-100"
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
      <ToolSEOCard toolKey="uuid-generator" />
    </div>
  );
}
