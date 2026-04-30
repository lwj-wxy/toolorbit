import { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, RefreshCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import ToolSEOCard from '../../../components/ToolSEOCard';

dayjs.extend(utc);
dayjs.extend(timezone);

const COMMON_TIMEZONES = [
  'Asia/Shanghai',
  'Asia/Tokyo',
  'Asia/Singapore',
  'Europe/London',
  'Europe/Paris',
  'America/New_York',
  'America/Los_Angeles',
  'America/Chicago',
  'Australia/Sydney',
  'UTC'
];

interface TimeBox {
  id: string;
  tz: string;
}

export default function TimeConverter() {
  const { t } = useTranslation();
  const [baseTime, setBaseTime] = useState<string>(dayjs().format('YYYY-MM-DDTHH:mm'));
  const [baseTz, setBaseTz] = useState<string>(dayjs.tz.guess() || 'Asia/Shanghai');
  const [timeBoxes, setTimeBoxes] = useState<TimeBox[]>([]);
  const [newTz, setNewTz] = useState<string>(COMMON_TIMEZONES[0]);

  useEffect(() => {
    // Add some default target zones if empty
    if (timeBoxes.length === 0) {
      const defaultTz = baseTz === 'Asia/Shanghai' ? 'America/New_York' : 'Asia/Shanghai';
      setTimeBoxes([{ id: Date.now().toString(), tz: defaultTz }]);
    }
  }, [baseTz, timeBoxes.length]);

  const addTimeBox = () => {
    if (timeBoxes.length >= 6) return;
    setTimeBoxes([...timeBoxes, { id: Date.now().toString(), tz: newTz }]);
  };

  const removeTimeBox = (id: string) => {
    setTimeBoxes(timeBoxes.filter(box => box.id !== id));
  };

  const handleSetCurrentTime = () => {
    setBaseTime(dayjs().format('YYYY-MM-DDTHH:mm'));
  };

  const parseBaseTime = () => {
    return dayjs.tz(baseTime, baseTz);
  };

  const validBase = parseBaseTime();
  const isValid = validBase.isValid();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('tools.time-converter.title')}</h1>
            <p className="text-[#64748b] mt-1 text-sm md:text-base">
              {t('tools.time-converter.subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Base Time Input */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 flex-1">
            <div className="flex items-center justify-between mb-6">
               <h3 className="font-bold text-[#1e293b] flex items-center gap-2 text-lg">
                 {t('tools.time-converter.baseSettings')}
               </h3>
               <button 
                 onClick={handleSetCurrentTime}
                 className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors border border-slate-200"
               >
                 <RefreshCcw className="w-4 h-4" /> {t('tools.time-converter.nowBtn')}
               </button>
            </div>
            
            <div className="space-y-5">
               <div>
                  <label className="block text-sm font-bold text-[#475569] mb-2">{t('tools.time-converter.tzLabel')}</label>
                  <select
                    value={baseTz}
                    onChange={(e) => setBaseTz(e.target.value)}
                    className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-4 py-3 text-slate-700 outline-none focus:border-orange-500"
                  >
                     {COMMON_TIMEZONES.map(tz => (
                       <option key={tz} value={tz}>{tz}</option>
                     ))}
                  </select>
               </div>

               <div>
                  <label className="block text-sm font-bold text-[#475569] mb-2">{t('tools.time-converter.inputLabel')}</label>
                  <input
                    type="datetime-local"
                    value={baseTime}
                    onChange={(e) => setBaseTime(e.target.value)}
                    className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl px-4 py-3 text-lg font-mono outline-none focus:border-orange-500 text-slate-800"
                  />
               </div>

               {isValid && (
                 <div className="mt-4 p-4 bg-orange-50 border border-orange-100 rounded-xl">
                    <div className="text-sm text-orange-800 font-medium mb-1">
                       {t('tools.time-converter.unixLabel')}
                    </div>
                    <div className="font-mono text-lg text-orange-900 break-all select-all">
                       {validBase.valueOf()}
                    </div>
                 </div>
               )}
            </div>
          </div>
        </div>

        {/* Target Timezones Preview */}
        <div className="lg:col-span-7 flex flex-col gap-6">
           <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 min-h-[500px] flex flex-col">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                 <h3 className="font-bold text-[#1e293b] flex items-center gap-2 text-lg">
                    {t('tools.time-converter.panelTitle')}
                 </h3>
              </div>

              {!isValid ? (
                  <div className="flex-1 flex items-center justify-center text-slate-400">
                     {t('tools.time-converter.emptyTip')}
                  </div>
              ) : (
                 <div className="space-y-4 flex-1">
                    {timeBoxes.map((box) => {
                       const targetTime = validBase.tz(box.tz);
                       return (
                         <div key={box.id} className="relative group bg-slate-50 border border-slate-200 rounded-xl p-5 hover:border-orange-200 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                               <div className="font-bold text-slate-800">{box.tz}</div>
                               <button 
                                 onClick={() => removeTimeBox(box.id)}
                                 className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                               >
                                 <Trash2 className="w-5 h-5" />
                               </button>
                            </div>
                            <div className="text-2xl sm:text-3xl font-mono text-orange-600 font-bold mb-1">
                               {targetTime.format('YYYY-MM-DD HH:mm:ss')}
                            </div>
                            <div className="text-xs sm:text-sm text-slate-500 font-medium">
                               {t('tools.time-converter.diffLabel', { offset: targetTime.utcOffset() / 60 })}
                            </div>
                         </div>
                       );
                    })}

                    {timeBoxes.length < 6 && (
                       <div className="mt-8 p-5 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 flex flex-col sm:flex-row items-center gap-4">
                          <select
                             value={newTz}
                             onChange={(e) => setNewTz(e.target.value)}
                             className="flex-1 bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-slate-700 outline-none focus:border-orange-500"
                          >
                             {COMMON_TIMEZONES.map(tz => (
                               <option key={tz} value={tz}>{tz}</option>
                             ))}
                          </select>
                          <button 
                             onClick={addTimeBox}
                             className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-orange-100 text-orange-600 hover:bg-orange-200 rounded-lg font-bold transition-colors"
                          >
                             <Plus className="w-5 h-5" /> {t('tools.time-converter.addBtn')}
                          </button>
                       </div>
                    )}
                 </div>
              )}
           </div>
        </div>
      </div>

      <ToolSEOCard toolKey="time-converter" />
    </div>
  );
}
