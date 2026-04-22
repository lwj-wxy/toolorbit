import React, { useState, useEffect } from 'react';
import { Clock, ArrowRight, ArrowDown, Copy, Check, RefreshCw, Calculator } from 'lucide-react';

export default function TimestampConverter() {
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
    if (isNaN(d.getTime())) return '无效日期格式';
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
      setTsResult('无效的时间戳');
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
    // robust parsing for Safari and others (replace dashes with slashes)
    const parseableVal = val.replace(/-/g, '/');
    const d = new Date(parseableVal);
    
    if (isNaN(d.getTime())) {
      setDateResultS('无效日期');
      setDateResultMs('无效日期');
      return;
    }
    setDateResultMs(d.getTime().toString());
    setDateResultS(Math.floor(d.getTime() / 1000).toString());
  }

  const copyToClipboard = async (text: string, fieldId: string) => {
    if (!text || text.includes('无效')) return;
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
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">时间戳转换</h1>
            <p className="text-[#64748b] mt-1">
              Unix 时间戳与标准时间（本地/北京时间）在线相互转换工具。
            </p>
          </div>
        </div>
      </div>

      {/* Current Time Widget */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 lg:p-8 relative">
        <button
          onClick={() => setIsLive(!isLive)}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-bold transition-all bg-white shadow-sm hover:shadow-md"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLive ? 'animate-spin text-blue-500' : 'text-amber-500'}`} style={{ animationDuration: '2s' }} />
          <span className={isLive ? 'text-blue-600' : 'text-amber-600'}>{isLive ? '停止刷新' : '恢复刷新'}</span>
        </button>

        <div className="flex items-center justify-center pt-2 pb-4">
          <div className="flex flex-col items-center">
            <span className="text-[#64748b] text-[13px] font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              当前时间 (Current Time)
            </span>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0f172a] tabular-nums tracking-tight">
              {formatDate(now)}
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 border-t border-[#e2e8f0] pt-6 font-mono">
          <div className="flex items-center gap-2">
            <span className="text-[#64748b] text-sm">时间戳(秒):</span>
            <code className="text-[#2563eb] text-lg font-bold px-3 py-1 bg-blue-50 rounded-lg">
              {Math.floor(now.getTime() / 1000)}
            </code>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#64748b] text-sm">时间戳(毫秒):</span>
            <code className="text-[#2563eb] text-lg font-bold px-3 py-1 bg-blue-50 rounded-lg">
              {now.getTime()}
            </code>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timestamp to Date */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 lg:p-8 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
              <ArrowRight className="w-4 h-4 text-[#2563eb]" />
            </div>
            <h2 className="text-xl font-bold text-[#1e293b]">时间戳 转换 标准时间</h2>
          </div>
          
          <div className="space-y-6 flex-1 flex flex-col">
            <div className="bg-[#f8fafc] p-4 rounded-xl border border-[#e2e8f0]">
              <label className="block text-[13px] font-bold text-[#64748b] uppercase tracking-wider mb-2">输入时间戳</label>
              <div className="flex shadow-sm overflow-hidden rounded-lg">
                <input
                  type="text"
                  value={tsInput}
                  onChange={(e) => handleTsConvert(e.target.value, tsUnit)}
                  placeholder="请输入 Unix 时间戳..."
                  className="flex-1 bg-white border border-[#e2e8f0] px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono text-lg min-w-0"
                />
                <select
                  value={tsUnit}
                  onChange={(e) => handleTsConvert(tsInput, e.target.value as 's' | 'ms')}
                  className="bg-[#f1f5f9] border border-y-[#e2e8f0] border-r-[#e2e8f0] border-l-0 px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-bold text-slate-700 cursor-pointer min-w-[100px]"
                >
                  <option value="s">秒(s)</option>
                  <option value="ms">毫秒(ms)</option>
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
                <label className="block text-[13px] font-bold text-[#64748b] uppercase tracking-wider">标准时间格式</label>
                <button
                  onClick={() => handleTsConvert(Math.floor(Date.now() / 1000).toString(), 's')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 px-2 py-1 rounded"
                >
                  填入当前时间戳
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
                  title="复制结果"
                >
                  {copiedField === 'ts_res' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <div className="mt-auto pt-4">
              <p className="text-[13px] text-[#64748b]">10位为秒(s)级别 / 13位为毫秒(ms)级别</p>
            </div>
          </div>
        </div>

        {/* Date to Timestamp */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 lg:p-8 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
              <ArrowRight className="w-4 h-4 text-[#2563eb]" />
            </div>
            <h2 className="text-xl font-bold text-[#1e293b]">标准时间 转换 时间戳</h2>
          </div>
          
          <div className="space-y-6 flex-1 flex flex-col">
            <div className="bg-[#f8fafc] p-4 rounded-xl border border-[#e2e8f0]">
              <label className="block text-[13px] font-bold text-[#64748b] uppercase tracking-wider mb-2">输入时间 (YYYY-MM-DD HH:mm:ss)</label>
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
                <span className="text-[13px] font-bold text-[#64748b] uppercase tracking-wider">转换结果</span>
                <button
                  onClick={() => handleDateConvert(formatDate(new Date()))}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 px-2 py-1 rounded"
                >
                  填入当前时间
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#94a3b8] mb-1">时间戳 (秒 s)</label>
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
                    title="复制结果"
                  >
                    {copiedField === 'dt_res_s' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#94a3b8] mb-1">时间戳 (毫秒 ms)</label>
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
                    title="复制结果"
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
        <h3 className="text-blue-800 font-semibold mb-3">使用说明</h3>
        <ul className="text-sm text-blue-700/80 space-y-2 list-disc pl-4">
          <li>10位的时间戳代表的是秒（s），13位的时间戳代表的是毫秒（ms）。</li>
          <li>当前转换基于您所处环境的本地时区（通常中国大陆为北京时间 UTC+8）。</li>
          <li>输入时间字符串时，推荐使用 <code>YYYY-MM-DD HH:mm:ss</code> 格式，例如 <code>2024-05-20 13:14:00</code>，系统也兼容类似斜杠 <code>/</code> 格式。</li>
        </ul>
      </div>

      {/* Bottom SEO Instructions Panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8 lg:p-12 mt-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">在线 Unix 时间戳转换工具，程序员必备跨时区数据校验准绳</h2>
        
        <p className="text-slate-600 mb-6 leading-relaxed">
          时间戳与标准日期互换是后端开发、数据库管理以及数据埋点分析中一项绕不开的基础节点。一串形如 <code>1713770000</code> 的纯数字序列，虽然在计算机存储和排序上具备着无可匹敌的绝对优势与性能，但对人类开发者却毫无可读性。本网页的时间戳转换器应运而生。
        </p>

        <h3 className="font-bold text-slate-800 text-lg mb-4">为什么开发和测试离不开这套时间刻度转换器？</h3>
        <ul className="space-y-4 text-slate-600">
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">1. 对数级别的运算响应：</strong>
            <span>支持包含 JavaScript 标准的 13 位毫秒级 (ms) 和纯净的 10 位秒级 (s) 纪元时间输入。只要您键入或者粘贴相关的长数字串，毫秒之内界面就会精准定位还原至 <code>YYYY-MM-DD</code> 格式，大幅度降低查阅数据库时靠猜时间的痛点。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">2. 本地化强校验与免上传：</strong>
            <span>与本站贯通的理念一致：为了防范服务器接口带来的网络劫持或是延迟，每一次关于 Epoch Time 的解析都是落在各位用户操作界面的本地执行环境中（Local Context），没有任何请求发送至云端，杜绝数据越界带来的任何隐患。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">3. 活体监控时针面板：</strong>
            <span>除了常规静态的互逆映射功能，这里还提供了一个跟随系统节律滴答作响的时钟视窗。此视窗能让对分秒极其敏感的倒计时抢购开发人员、日志追溯管理员一眼抓取准确至现行当下的活体 Timestamp。</span>
          </li>
        </ul>
        
        <p className="text-slate-500 text-sm mt-8 pt-6 border-t border-slate-100">
          请注意，计算机系统中公认的 1970 纪元 (Epoch) 本质是一道锚点坐标，我们在此渲染的“标准时间”映射，是基于您当前查看所在的地区所换算出的相对当地时间表述，请于排查生产故障时谨记时区偏置 (Timezone Offset) 差异。
        </p>
      </div>

    </div>
  );
}
