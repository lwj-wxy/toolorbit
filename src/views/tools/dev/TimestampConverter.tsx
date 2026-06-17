import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, Copy, Check, RefreshCw } from 'lucide-react';

export default function TimestampConverter() {
  const { t } = useTranslation();
  const [now, setNow] = useState(new Date());
  const [isLive, setIsLive] = useState(true);

  // Timestamp to Date
  const [tsInput, setTsInput] = useState(Math.floor(Date.now() / 1000).toString());
  const [tsUnit, setTsUnit] = useState<'s' | 'ms'>('s');
  const [tsResult, setTsResult] = useState('');

  // Date to Timestamp
  const [dateInput, setDateInput] = useState(formatDate(new Date()));
  const [dateResultS, setDateResultS] = useState('');
  const [dateResultMs, setDateResultMs] = useState('');

  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Update current time continuously if live
  useEffect(() => {
    if (!isLive) return;
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, [isLive]);

  // Initial conversion runs
  useEffect(() => {
    handleTsConvert(tsInput, tsUnit);
    handleDateConvert(dateInput);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function formatDate(d: Date) {
    if (isNaN(d.getTime())) return t('tools.timestamp-converter.invalidDate');
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  function handleTsConvert(val: string, unit: 's' | 'ms') {
    setTsInput(val);
    setTsUnit(unit);
    if (!val.trim()) {
      setTsResult('');
      return;
    }
    const num = parseInt(val, 10);
    if (isNaN(num)) {
      setTsResult(t('tools.timestamp-converter.invalidTimestamp'));
      return;
    }
    const d = new Date(unit === 's' ? num * 1000 : num);
    setTsResult(formatDate(d));
  }

  function handleDateConvert(val: string) {
    setDateInput(val);
    if (!val.trim()) {
      setDateResultS('');
      setDateResultMs('');
      return;
    }
    const parseableVal = val.replace(/-/g, '/');
    const d = new Date(parseableVal);
    
    if (isNaN(d.getTime())) {
      setDateResultS(t('tools.timestamp-converter.invalidDate'));
      setDateResultMs(t('tools.timestamp-converter.invalidDate'));
      return;
    }
    setDateResultMs(d.getTime().toString());
    setDateResultS(Math.floor(d.getTime() / 1000).toString());
  }

  const copyToClipboard = async (text: string, fieldId: string) => {
    if (!text || text.includes(t('tools.timestamp-converter.invalidDate')) || text.includes(t('tools.timestamp-converter.invalidTimestamp'))) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{t('tools.timestamp-converter.title')}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            {t('tools.timestamp-converter.subtitle')}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsLive(!isLive)}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-[#282c34] dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLive ? 'animate-spin text-cyan-600' : 'text-amber-500'}`} style={{ animationDuration: '2s' }} />
          {isLive ? t('tools.timestamp-converter.stopRefresh') : t('tools.timestamp-converter.startRefresh')}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col space-y-3">
          <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
            {t('tools.timestamp-converter.tsToDate')}
          </label>
          <div className="flex h-[500px] flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#282c34]">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">{t('tools.timestamp-converter.timestampLabel')}</label>
              <div className="flex overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-[#282c34]">
                <input
                  type="text"
                  value={tsInput}
                  onChange={(e) => handleTsConvert(e.target.value, tsUnit)}
                  placeholder={t('tools.timestamp-converter.inputTsPlaceholder')}
                  className="min-w-0 flex-1 bg-transparent px-4 py-3 font-mono text-lg text-slate-900 outline-none dark:text-slate-100"
                />
                <select
                  value={tsUnit}
                  onChange={(e) => handleTsConvert(tsInput, e.target.value as 's' | 'ms')}
                  className="border-l border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                >
                  <option value="s">s</option>
                  <option value="ms">ms</option>
                </select>
              </div>
            </div>

            <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">{t('tools.timestamp-converter.dateLabel')}</label>
                <button
                  type="button"
                  onClick={() => handleTsConvert(Math.floor(Date.now() / 1000).toString(), 's')}
                  className="text-xs font-semibold text-cyan-700 transition-colors hover:text-cyan-800 dark:text-cyan-300"
                >
                  {t('tools.timestamp-converter.currentTsBtn')}
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={tsResult}
                  className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-4 pr-12 font-mono text-lg text-slate-900 outline-none dark:border-slate-700 dark:bg-[#282c34] dark:text-slate-100"
                />
                <button
                  type="button"
                  onClick={() => copyToClipboard(tsResult, 'ts_res')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md border border-slate-200 bg-white p-2 text-slate-500 transition-colors hover:bg-slate-50 hover:text-cyan-700 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
                  title={t('tools.timestamp-converter.copyTitle')}
                >
                  {copiedField === 'ts_res' ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="mt-auto rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                <Clock className="h-4 w-4" />
                {t('tools.timestamp-converter.currentTimeLabel')}
              </div>
              <div className="font-mono text-xl font-semibold tabular-nums text-slate-950 dark:text-white">
                {formatDate(now)}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
            {t('tools.timestamp-converter.dateToTs')}
          </label>
          <div className="flex h-[500px] flex-col rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-[#282c34]">
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">{t('tools.timestamp-converter.dateLabel')} (YYYY-MM-DD HH:mm:ss)</label>
                <input
                  type="text"
                  value={dateInput}
                  onChange={(e) => handleDateConvert(e.target.value)}
                  placeholder="2026-04-18 12:00:00"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-lg text-slate-900 outline-none transition-colors focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
                <button
                  type="button"
                  onClick={() => handleDateConvert(formatDate(new Date()))}
                  className="mt-3 text-xs font-semibold text-cyan-700 transition-colors hover:text-cyan-800 dark:text-cyan-300"
                >
                  {t('tools.timestamp-converter.currentDateBtn')}
                </button>
            </div>

            <div className="mt-5 space-y-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-[#282c34]">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{t('tools.timestamp-converter.outputTsLabel')}</span>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">{t('tools.timestamp-converter.unitSeconds')}</label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    value={dateResultS}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-4 pr-12 font-mono text-lg text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(dateResultS, 'dt_res_s')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md border border-slate-200 bg-white p-1.5 text-slate-500 transition-colors hover:bg-slate-50 hover:text-cyan-700 dark:border-slate-700 dark:bg-[#282c34] dark:hover:bg-slate-800"
                    title={t('tools.timestamp-converter.copyTitle')}
                  >
                    {copiedField === 'dt_res_s' ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">{t('tools.timestamp-converter.unitMillis')}</label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    value={dateResultMs}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-4 pr-12 font-mono text-lg text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(dateResultMs, 'dt_res_ms')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md border border-slate-200 bg-white p-1.5 text-slate-500 transition-colors hover:bg-slate-50 hover:text-cyan-700 dark:border-slate-700 dark:bg-[#282c34] dark:hover:bg-slate-800"
                    title={t('tools.timestamp-converter.copyTitle')}
                  >
                    {copiedField === 'dt_res_ms' ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-auto grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-[#282c34]">
                <div className="text-xs text-slate-500 dark:text-slate-400">{t('tools.timestamp-converter.unitSeconds')}</div>
                <code className="mt-1 block break-all font-mono text-sm font-semibold text-cyan-700 dark:text-cyan-300">{Math.floor(now.getTime() / 1000)}</code>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-[#282c34]">
                <div className="text-xs text-slate-500 dark:text-slate-400">{t('tools.timestamp-converter.unitMillis')}</div>
                <code className="mt-1 block break-all font-mono text-sm font-semibold text-cyan-700 dark:text-cyan-300">{now.getTime()}</code>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Help Tips */}
      <div className="rounded-lg border border-cyan-100 bg-cyan-50/50 p-5 dark:border-cyan-900/60 dark:bg-cyan-950/20">
        <h3 className="mb-3 font-semibold text-cyan-900 dark:text-cyan-200">{t('tools.timestamp-converter.instructionsTitle')}</h3>
        <ul className="list-disc space-y-2 pl-4 text-sm text-cyan-800/80 dark:text-cyan-200/80">
          <li>{t('tools.timestamp-converter.instruction1')}</li>
          <li>{t('tools.timestamp-converter.instruction2')}</li>
          <li>{t('tools.timestamp-converter.instruction3')}</li>
        </ul>
      </div>
    </div>
  );
}
