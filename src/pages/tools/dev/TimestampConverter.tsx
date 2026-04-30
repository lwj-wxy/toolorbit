import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, ArrowRight, ArrowDown, Copy, Check, RefreshCw, Calculator } from 'lucide-react';
import ToolSEOCard from '../../../components/ToolSEOCard';

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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8 pb-6">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 bg-blue-50 text-[#2563eb] rounded-xl flex items-center justify-center">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('tools.timestamp-converter.title')}</h1>
            <p className="text-[#64748b] mt-1">
              {t('tools.timestamp-converter.subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 lg:p-8 relative">
        <button
          onClick={() => setIsLive(!isLive)}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-bold transition-all bg-white shadow-sm hover:shadow-md"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLive ? 'animate-spin text-blue-500' : 'text-amber-500'}`} style={{ animationDuration: '2s' }} />
          <span className={isLive ? 'text-blue-600' : 'text-amber-600'}>{isLive ? t('tools.timestamp-converter.stopRefresh') : t('tools.timestamp-converter.startRefresh')}</span>
        </button>

        <div className="flex items-center justify-center pt-2 pb-4">
          <div className="flex flex-col items-center">
            <span className="text-[#64748b] text-[13px] font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {t('tools.timestamp-converter.currentTimeLabel')}
            </span>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0f172a] tabular-nums tracking-tight">
              {formatDate(now)}
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 border-t border-[#e2e8f0] pt-6 font-mono">
          <div className="flex items-center gap-2">
            <span className="text-[#64748b] text-sm">{t('tools.timestamp-converter.unitSeconds')}:</span>
            <code className="text-[#2563eb] text-lg font-bold px-3 py-1 bg-blue-50 rounded-lg">
              {Math.floor(now.getTime() / 1000)}
            </code>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#64748b] text-sm">{t('tools.timestamp-converter.unitMillis')}:</span>
            <code className="text-[#2563eb] text-lg font-bold px-3 py-1 bg-blue-50 rounded-lg">
              {now.getTime()}
            </code>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 lg:p-8 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
              <ArrowRight className="w-4 h-4 text-[#2563eb]" />
            </div>
            <h2 className="text-xl font-bold text-[#1e293b]">{t('tools.timestamp-converter.tsToDate')}</h2>
          </div>
          
          <div className="space-y-6 flex-1 flex flex-col">
            <div className="bg-[#f8fafc] p-4 rounded-xl border border-[#e2e8f0]">
              <label className="block text-[13px] font-bold text-[#64748b] uppercase tracking-wider mb-2">{t('tools.timestamp-converter.timestampLabel')}</label>
              <div className="flex shadow-sm overflow-hidden rounded-lg">
                <input
                  type="text"
                  value={tsInput}
                  onChange={(e) => handleTsConvert(e.target.value, tsUnit)}
                  placeholder={t('tools.timestamp-converter.inputTsPlaceholder')}
                  className="flex-1 bg-white border border-[#e2e8f0] px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono text-lg min-w-0"
                />
                <select
                  value={tsUnit}
                  onChange={(e) => handleTsConvert(tsInput, e.target.value as 's' | 'ms')}
                  className="bg-[#f1f5f9] border border-y-[#e2e8f0] border-r-[#e2e8f0] border-l-0 px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-bold text-slate-700 cursor-pointer min-w-[100px]"
                >
                  <option value="s">s</option>
                  <option value="ms">ms</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-[#e2e8f0]">
                <ArrowDown className="w-5 h-5 text-slate-400" />
              </div>
            </div>

            <div className="bg-[#f8fafc] p-4 rounded-xl border border-[#e2e8f0]">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[13px] font-bold text-[#64748b] uppercase tracking-wider">{t('tools.timestamp-converter.dateLabel')}</label>
                <button
                  onClick={() => handleTsConvert(Math.floor(Date.now() / 1000).toString(), 's')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 px-2 py-1 rounded"
                >
                  {t('tools.timestamp-converter.currentTsBtn')}
                </button>
              </div>
              <div className="relative group shadow-sm">
                <input
                  type="text"
                  readOnly
                  value={tsResult}
                  className="w-full bg-white border border-[#e2e8f0] rounded-lg pl-4 pr-12 py-3 outline-none text-[#0f172a] font-mono text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
                <button
                  onClick={() => copyToClipboard(tsResult, 'ts_res')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-slate-50 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all border border-[#e2e8f0] group-hover:border-blue-200"
                  title={t('tools.timestamp-converter.copyTitle')}
                >
                  {copiedField === 'ts_res' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 lg:p-8 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
              <ArrowRight className="w-4 h-4 text-[#2563eb]" />
            </div>
            <h2 className="text-xl font-bold text-[#1e293b]">{t('tools.timestamp-converter.dateToTs')}</h2>
          </div>
          
          <div className="space-y-6 flex-1 flex flex-col">
            <div className="bg-[#f8fafc] p-4 rounded-xl border border-[#e2e8f0]">
              <label className="block text-[13px] font-bold text-[#64748b] uppercase tracking-wider mb-2">{t('tools.timestamp-converter.dateLabel')} (YYYY-MM-DD HH:mm:ss)</label>
              <input
                type="text"
                value={dateInput}
                onChange={(e) => handleDateConvert(e.target.value)}
                placeholder="2026-04-18 12:00:00"
                className="w-full bg-white border border-[#e2e8f0] rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-mono text-lg shadow-sm"
              />
            </div>

            <div className="flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-[#e2e8f0]">
                <ArrowDown className="w-5 h-5 text-slate-400" />
              </div>
            </div>

            <div className="bg-[#f8fafc] p-4 rounded-xl border border-[#e2e8f0] space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] font-bold text-[#64748b] uppercase tracking-wider">{t('tools.timestamp-converter.outputTsLabel')}</span>
                <button
                  onClick={() => handleDateConvert(formatDate(new Date()))}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 px-2 py-1 rounded"
                >
                  {t('tools.timestamp-converter.currentDateBtn')}
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#94a3b8] mb-1">{t('tools.timestamp-converter.unitSeconds')}</label>
                <div className="relative group shadow-sm">
                  <input
                    type="text"
                    readOnly
                    value={dateResultS}
                    className="w-full bg-white border border-[#e2e8f0] rounded-lg pl-4 pr-12 py-2.5 outline-none text-[#0f172a] font-mono text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                  <button
                    onClick={() => copyToClipboard(dateResultS, 'dt_res_s')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-slate-50 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all border border-[#e2e8f0] group-hover:border-blue-200"
                    title={t('tools.timestamp-converter.copyTitle')}
                  >
                    {copiedField === 'dt_res_s' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#94a3b8] mb-1">{t('tools.timestamp-converter.unitMillis')}</label>
                <div className="relative group shadow-sm">
                  <input
                    type="text"
                    readOnly
                    value={dateResultMs}
                    className="w-full bg-white border border-[#e2e8f0] rounded-lg pl-4 pr-12 py-2.5 outline-none text-[#0f172a] font-mono text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                  <button
                    onClick={() => copyToClipboard(dateResultMs, 'dt_res_ms')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-slate-50 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all border border-[#e2e8f0] group-hover:border-blue-200"
                    title={t('tools.timestamp-converter.copyTitle')}
                  >
                    {copiedField === 'dt_res_ms' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Help Tips */}
      <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100">
        <h3 className="text-blue-800 font-semibold mb-3">{t('tools.timestamp-converter.instructionsTitle')}</h3>
        <ul className="text-sm text-blue-700/80 space-y-2 list-disc pl-4">
          <li>{t('tools.timestamp-converter.instruction1')}</li>
          <li>{t('tools.timestamp-converter.instruction2')}</li>
          <li>{t('tools.timestamp-converter.instruction3')}</li>
        </ul>
      </div>
      <ToolSEOCard toolKey="timestamp-converter" />
    </div>
  );
}
