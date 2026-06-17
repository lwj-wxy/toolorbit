import { useState, useEffect } from 'react';
import { Clock, Plus, Trash2, RefreshCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{t('tools.time-converter.title')}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            {t('tools.time-converter.subtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Base Time Input */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
              {t('tools.time-converter.baseSettings')}
            </label>
            <button
              type="button"
              onClick={handleSetCurrentTime}
              className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-[#282c34] dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <RefreshCcw className="h-3.5 w-3.5" />
              {t('tools.time-converter.nowBtn')}
            </button>
          </div>
          <div className="flex h-[500px] flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#282c34]">
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">{t('tools.time-converter.tzLabel')}</label>
                <select
                  value={baseTz}
                  onChange={(e) => setBaseTz(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  {COMMON_TIMEZONES.map(tz => (
                    <option key={tz} value={tz}>{tz}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">{t('tools.time-converter.inputLabel')}</label>
                <input
                  type="datetime-local"
                  value={baseTime}
                  onChange={(e) => setBaseTime(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-lg text-slate-900 outline-none transition-colors focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            {isValid && (
              <div className="mt-auto rounded-lg border border-cyan-100 bg-cyan-50 p-4 dark:border-cyan-900/60 dark:bg-cyan-950/20">
                <div className="mb-1 text-sm font-medium text-cyan-800 dark:text-cyan-200">
                  {t('tools.time-converter.unixLabel')}
                </div>
                <div className="select-all break-all font-mono text-lg text-cyan-900 dark:text-cyan-100">
                  {validBase.valueOf()}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Target Timezones Preview */}
        <div className="flex flex-col space-y-3">
          <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
            {t('tools.time-converter.panelTitle')}
          </label>
          <div className="flex h-[500px] flex-col rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">

              {!isValid ? (
                  <div className="flex flex-1 items-center justify-center text-slate-400">
                     {t('tools.time-converter.emptyTip')}
                  </div>
              ) : (
                 <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
                    {timeBoxes.map((box) => {
                       const targetTime = validBase.tz(box.tz);
                       return (
                         <div key={box.id} className="group relative rounded-lg border border-slate-200 bg-white p-5 transition-colors hover:border-cyan-300 dark:border-slate-700 dark:bg-[#282c34]">
                            <div className="mb-2 flex items-start justify-between">
                               <div className="font-semibold text-slate-900 dark:text-slate-100">{box.tz}</div>
                               <button
                                 onClick={() => removeTimeBox(box.id)}
                                 className="text-slate-400 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
                               >
                                 <Trash2 className="h-5 w-5" />
                               </button>
                            </div>
                            <div className="mb-1 font-mono text-2xl font-semibold text-cyan-700 dark:text-cyan-300 sm:text-3xl">
                               {targetTime.format('YYYY-MM-DD HH:mm:ss')}
                            </div>
                            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm">
                               {t('tools.time-converter.diffLabel', { offset: targetTime.utcOffset() / 60 })}
                            </div>
                         </div>
                       );
                    })}

                    {timeBoxes.length < 6 && (
                       <div className="mt-5 flex flex-col items-center gap-4 rounded-lg border border-dashed border-slate-300 bg-white p-5 dark:border-slate-700 dark:bg-[#282c34] sm:flex-row">
                          <select
                             value={newTz}
                             onChange={(e) => setNewTz(e.target.value)}
                             className="w-full flex-1 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                          >
                             {COMMON_TIMEZONES.map(tz => (
                               <option key={tz} value={tz}>{tz}</option>
                             ))}
                          </select>
                          <button
                             onClick={addTimeBox}
                             className="flex w-full items-center justify-center gap-2 rounded-md bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cyan-700 sm:w-auto"
                          >
                             <Plus className="h-5 w-5" /> {t('tools.time-converter.addBtn')}
                          </button>
                       </div>
                    )}
                 </div>
              )}
          </div>
        </div>
      </div>

    </div>
  );
}
