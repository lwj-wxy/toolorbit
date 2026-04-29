import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FileKey, Copy, Check } from 'lucide-react';

export default function ChmodCalculator() {
  const { t } = useTranslation();
  const [permissions, setPermissions] = useState({
    owner: { read: false, write: false, execute: false },
    group: { read: false, write: false, execute: false },
    public: { read: false, write: false, execute: false }
  });

  const [copiedOctal, setCopiedOctal] = useState(false);
  const [copiedSymbolic, setCopiedSymbolic] = useState(false);

  // Toggle a specific permission bit
  const handleToggle = (type: 'owner' | 'group' | 'public', perm: 'read' | 'write' | 'execute') => {
    setPermissions(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [perm]: !prev[type][perm]
      }
    }));
  };

  // Derive Octal String (e.g., 755)
  const octalValue = useMemo(() => {
    const calc = (block: { read: boolean, write: boolean, execute: boolean }) => {
      let val = 0;
      if (block.read) val += 4;
      if (block.write) val += 2;
      if (block.execute) val += 1;
      return val.toString();
    };
    return calc(permissions.owner) + calc(permissions.group) + calc(permissions.public);
  }, [permissions]);

  // Derive Symbolic String (e.g., -rwxr-xr-x)
  const symbolicValue = useMemo(() => {
    const calc = (block: { read: boolean, write: boolean, execute: boolean }) => {
      let str = '';
      str += block.read ? 'r' : '-';
      str += block.write ? 'w' : '-';
      str += block.execute ? 'x' : '-';
      return str;
    };
    return '-' + calc(permissions.owner) + calc(permissions.group) + calc(permissions.public); // Assuming file prefix '-'
  }, [permissions]);

  // Preset quick sets
  const setPreset = (preset: string) => {
    const parseDigit = (d: number) => ({
      read: (d & 4) !== 0,
      write: (d & 2) !== 0,
      execute: (d & 1) !== 0
    });
    setPermissions({
      owner: parseDigit(parseInt(preset[0])),
      group: parseDigit(parseInt(preset[1])),
      public: parseDigit(parseInt(preset[2]))
    });
  };

  const copyText = (text: string, type: 'octal' | 'symbolic') => {
    navigator.clipboard.writeText(text);
    if (type === 'octal') {
       setCopiedOctal(true);
       setTimeout(() => setCopiedOctal(false), 2000);
    } else {
       setCopiedSymbolic(true);
       setTimeout(() => setCopiedSymbolic(false), 2000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
            <FileKey className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('tools.chmod-calculator.title')}</h1>
            <p className="text-[#64748b] mt-1 text-sm md:text-base">
              {t('tools.chmod-calculator.subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 lg:p-8">
           <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
             <span className="w-2 h-6 bg-indigo-500 rounded block"></span>
             {t('tools.chmod-calculator.classesTitle')}
           </h3>

           <div className="space-y-6">
              {['owner', 'group', 'public'].map((groupType) => {
                 const typeKey = groupType as 'owner' | 'group' | 'public';
                 const labels = { 
                   owner: t('tools.chmod-calculator.owner'), 
                   group: t('tools.chmod-calculator.group'), 
                   public: t('tools.chmod-calculator.public') 
                 };
                 return (
                 <div key={groupType} className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                    <div className="font-bold text-slate-700 mb-4">{labels[typeKey]}</div>
                    <div className="grid grid-cols-3 gap-4">
                       <label className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-indigo-400 transition-colors">
                          <input 
                            type="checkbox" 
                            checked={permissions[typeKey].read}
                            onChange={() => handleToggle(typeKey, 'read')}
                            className="w-5 h-5 text-indigo-600 rounded bg-gray-100 border-gray-300 focus:ring-indigo-500 cursor-pointer" 
                          />
                          <span className="text-sm font-medium text-slate-700">{t('tools.chmod-calculator.read')}</span>
                       </label>
                       <label className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-indigo-400 transition-colors">
                          <input 
                            type="checkbox" 
                            checked={permissions[typeKey].write}
                            onChange={() => handleToggle(typeKey, 'write')}
                            className="w-5 h-5 text-indigo-600 rounded bg-gray-100 border-gray-300 focus:ring-indigo-500 cursor-pointer" 
                          />
                          <span className="text-sm font-medium text-slate-700">{t('tools.chmod-calculator.write')}</span>
                       </label>
                       <label className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-indigo-400 transition-colors">
                          <input 
                            type="checkbox" 
                            checked={permissions[typeKey].execute}
                            onChange={() => handleToggle(typeKey, 'execute')}
                            className="w-5 h-5 text-indigo-600 rounded bg-gray-100 border-gray-300 focus:ring-indigo-500 cursor-pointer" 
                          />
                          <span className="text-sm font-medium text-slate-700">{t('tools.chmod-calculator.execute')}</span>
                       </label>
                    </div>
                 </div>
              )})}
           </div>

           <div className="mt-8 border-t border-slate-100 pt-6">
              <div className="font-bold text-slate-700 mb-4">{t('tools.chmod-calculator.presets')}</div>
              <div className="flex flex-wrap gap-2">
                 {[
                   {val: '777', tag: t('tools.chmod-calculator.presetAll')},
                   {val: '755', tag: t('tools.chmod-calculator.presetDir')},
                   {val: '644', tag: t('tools.chmod-calculator.presetFile')},
                   {val: '600', tag: t('tools.chmod-calculator.presetKey')}
                 ].map(preset => (
                    <button
                      key={preset.val}
                      onClick={() => setPreset(preset.val)}
                      className="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold rounded-lg transition-colors border border-indigo-200"
                    >
                       chmod {preset.val}
                       <span className="block text-xs font-normal opacity-80">{preset.tag}</span>
                    </button>
                 ))}
              </div>
           </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
           <div className="bg-indigo-900 rounded-2xl shadow-lg p-6 lg:p-8 flex flex-col">
              <h3 className="font-bold text-indigo-100 mb-8 flex items-center gap-2 uppercase tracking-wider text-sm">
                 {t('tools.chmod-calculator.resultTitle')}
              </h3>

              <div className="space-y-8 flex-1">
                 <div>
                    <div className="flex items-center justify-between mb-2">
                       <label className="block text-sm font-medium text-indigo-300">{t('tools.chmod-calculator.octal')}</label>
                       <button
                          onClick={() => copyText(octalValue, 'octal')}
                          className="text-indigo-400 hover:text-white transition-colors p-1"
                       >
                         {copiedOctal ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                       </button>
                    </div>
                    <div className="text-5xl font-mono text-white font-bold tracking-widest pt-2">
                       {octalValue}
                    </div>
                 </div>

                 <div className="pt-8 border-t border-indigo-800">
                    <div className="flex items-center justify-between mb-2">
                       <label className="block text-sm font-medium text-indigo-300">{t('tools.chmod-calculator.symbolic')}</label>
                       <button
                          onClick={() => copyText(symbolicValue, 'symbolic')}
                          className="text-indigo-400 hover:text-white transition-colors p-1"
                       >
                         {copiedSymbolic ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                       </button>
                    </div>
                    <div className="text-3xl font-mono text-indigo-200 font-bold pt-2">
                       {symbolicValue}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
