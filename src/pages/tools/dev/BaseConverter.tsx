import React, { useState, useEffect } from 'react';
import { Binary, ArrowRightLeft, Copy, Check } from 'lucide-react';

export default function BaseConverter() {
  const [inputVal, setInputVal] = useState<string>('255');
  const [inputBase, setInputBase] = useState<number>(10);
  const [outputBase, setOutputBase] = useState<number>(16);
  const [outputVal, setOutputVal] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    convert();
  }, [inputVal, inputBase, outputBase]);

  const convert = () => {
    if (!inputVal) {
      setOutputVal('');
      setError('');
      return;
    }

    try {
      // Validate input against the input base
      const validChars = getValidCharsForBase(inputBase);
      const regex = new RegExp(`^[${validChars}]+$`, 'i');
      
      // We allow an optional negative sign at the front
      const cleanInput = inputVal.trim();
      const isNegative = cleanInput.startsWith('-');
      const absInput = isNegative ? cleanInput.substring(1) : cleanInput;

      if (!regex.test(absInput)) {
         setError(`输入的值包含不属于 ${inputBase} 进制的非法字符`);
         setOutputVal('');
         return;
      }

      // Convert from Input Base to Base 10 using BigInt to support massive numbers
      const decimalValue = parseBigInt(absInput, inputBase);
      
      // Convert from Base 10 to Output Base
      let result = formatBigInt(decimalValue, outputBase);
      if (isNegative && result !== '0') {
         result = '-' + result;
      }

      setOutputVal(result.toUpperCase());
      setError('');
    } catch (err) {
      setError('转换失败：数值过大或格式有误');
      setOutputVal('');
    }
  };

  // Helper to get allowed characters for validation
  const getValidCharsForBase = (base: number) => {
      const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      return chars.substring(0, base);
  };

  // BigInt based parsing (Base N -> Base 10)
  const parseBigInt = (str: string, base: number): bigint => {
      const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let result = BigInt(0);
      let multiplier = BigInt(1);
      const baseBig = BigInt(base);
      
      str = str.toUpperCase();
      for (let i = str.length - 1; i >= 0; i--) {
          const charVal = BigInt(chars.indexOf(str[i]));
          result += charVal * multiplier;
          multiplier *= baseBig;
      }
      return result;
  };

  // BigInt based formatting (Base 10 -> Base N)
  const formatBigInt = (num: bigint, base: number): string => {
      if (num === BigInt(0)) return '0';
      const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let result = '';
      const baseBig = BigInt(base);
      
      while (num > BigInt(0)) {
          const remainder = Number(num % baseBig);
          result = chars[remainder] + result;
          num = num / baseBig;
      }
      return result;
  };

  const handleCopy = () => {
    if (!outputVal) return;
    navigator.clipboard.writeText(outputVal).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const swapBases = () => {
      const tempBase = inputBase;
      setInputBase(outputBase);
      setOutputBase(tempBase);
      if (outputVal && !error) {
          setInputVal(outputVal);
      }
  };

  const COMMON_BASES = [
      { value: 2, label: '二进制 (BIN)' },
      { value: 8, label: '八进制 (OCT)' },
      { value: 10, label: '十进制 (DEC)' },
      { value: 16, label: '十六进制 (HEX)' },
      { value: 32, label: '三十二进制 (Base32)' },
      { value: 36, label: '三十六进制 (Base36)' }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 lg:p-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-[#2563eb] rounded-xl flex items-center justify-center shrink-0">
            <Binary className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1e293b]">进制转换</h1>
            <p className="text-[#64748b] mt-1 text-sm md:text-base">
              支持 2 到 36 进制之间的任意互转。采用 BigInt 算法支持无限长度的超大整数。
            </p>
          </div>
        </div>
      </div>

      {/* Main Converter Block */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 lg:p-10 relative">
          
          <div className="grid grid-cols-1 lg:grid-cols-11 gap-6 items-stretch">
              
              {/* Left: Input */}
              <div className="col-span-1 lg:col-span-5 flex flex-col">
                  <div className="mb-4">
                      <label className="block text-sm font-bold text-[#475569] mb-2 flex items-center justify-between">
                          <span>输入数值</span>
                          <span className="text-[#94a3b8] font-normal">{inputVal.length} 字符</span>
                      </label>
                      <textarea
                        value={inputVal}
                        onChange={(e) => setInputVal(e.target.value)}
                        placeholder="请输入需要转换的数值"
                        className="w-full h-32 bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-4 font-mono text-lg outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all resize-none uppercase"
                        spellCheck={false}
                      />
                      {error && <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>}
                  </div>
                  
                  <div>
                      <label className="block text-sm font-bold text-[#475569] mb-2">选择来源进制</label>
                      <select 
                          value={inputBase}
                          onChange={(e) => setInputBase(parseInt(e.target.value))}
                          className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-4 py-3 outline-none focus:border-[#2563eb]"
                      >
                          {COMMON_BASES.map(b => (
                              <option key={`in-${b.value}`} value={b.value}>{b.label}</option>
                          ))}
                          <option disabled>──────</option>
                          {Array.from({length: 35}, (_, i) => i + 2).filter(v => !COMMON_BASES.find(cb => cb.value === v)).map(v => (
                              <option key={`in-other-${v}`} value={v}>{v} 进制</option>
                          ))}
                      </select>
                  </div>
              </div>

              {/* Center: Swap Button */}
              <div className="col-span-1 flex flex-col items-center justify-center">
                  <button 
                      onClick={swapBases}
                      className="w-12 h-12 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-slate-600 rounded-full flex items-center justify-center transition-colors shadow-sm border border-slate-200"
                      title="互换进制类型"
                  >
                     <ArrowRightLeft className="w-5 h-5 lg:rotate-0 rotate-90" />
                  </button>
              </div>

              {/* Right: Output */}
              <div className="col-span-1 lg:col-span-5 flex flex-col">
                  <div className="mb-4">
                      <label className="block text-sm font-bold text-[#475569] mb-2 flex items-center justify-between">
                          <span>转换结果</span>
                          {outputVal && (
                              <button 
                                  onClick={handleCopy}
                                  className="text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center gap-1 transition-colors"
                              >
                                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                  {copied ? '已复制' : '复制结果'}
                              </button>
                          )}
                      </label>
                      <div className="w-full h-32 bg-slate-800 border-none rounded-xl p-4 overflow-y-auto">
                          {outputVal ? (
                              <div className="font-mono text-emerald-400 text-lg break-all">
                                  {outputVal}
                              </div>
                          ) : (
                              <div className="font-mono text-slate-500 text-lg flex items-center justify-center h-full">
                                  等待转换...
                              </div>
                          )}
                      </div>
                  </div>

                  <div>
                      <label className="block text-sm font-bold text-[#475569] mb-2">选择目标进制</label>
                      <select 
                          value={outputBase}
                          onChange={(e) => setOutputBase(parseInt(e.target.value))}
                          className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-4 py-3 outline-none focus:border-[#2563eb]"
                      >
                          {COMMON_BASES.map(b => (
                              <option key={`out-${b.value}`} value={b.value}>{b.label}</option>
                          ))}
                          <option disabled>──────</option>
                          {Array.from({length: 35}, (_, i) => i + 2).filter(v => !COMMON_BASES.find(cb => cb.value === v)).map(v => (
                              <option key={`out-other-${v}`} value={v}>{v} 进制</option>
                          ))}
                      </select>
                  </div>
              </div>

          </div>
      </div>
    
      {/* Quick Conversion Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
              { in: 10, out: 2, label: '十转二', color: 'bg-indigo-50 border-indigo-100 text-indigo-700 hover:bg-indigo-100' },
              { in: 10, out: 16, label: '十转十六', color: 'bg-fuchsia-50 border-fuchsia-100 text-fuchsia-700 hover:bg-fuchsia-100' },
              { in: 16, out: 10, label: '十六转十', color: 'bg-amber-50 border-amber-100 text-amber-700 hover:bg-amber-100' },
              { in: 2, out: 10, label: '二转十', color: 'bg-emerald-50 border-emerald-100 text-emerald-700 hover:bg-emerald-100' },
          ].map((quick, idx) => (
             <button
                key={idx}
                onClick={() => {
                   setInputBase(quick.in);
                   setOutputBase(quick.out);
                }}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-colors shadow-sm ${quick.color}`}
             >
                <span className="font-bold">{quick.label}</span>
                <span className="text-xs opacity-70 mt-1 uppercase font-mono">Base {quick.in} → {quick.out}</span>
             </button>
          ))}
      </div>

      {/* Bottom SEO Instructions Panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-8 lg:p-12 mt-4">
        <h2 className="text-xl font-bold text-slate-800 mb-6">各类数制进制间的高效互换助手，跨越基数转换障碍</h2>
        
        <p className="text-slate-600 mb-6 leading-relaxed">
          进制转换计算器是大中专计算机科学理论学习，以及底层固件开发和网络封包逆向等高阶技术动作中极其常用的小型在线组件。无论你是想弄明白计算机如何理解一长串底层二级制字串，还是需要将网卡地址剥离成十进制进行特定映射编码，这块面板都能够替你抵挡繁琐的人工演算步骤。
        </p>

        <h3 className="font-bold text-slate-800 text-lg mb-4">为什么推荐在此界面处理各个进制进位的转换？</h3>
        <ul className="space-y-4 text-slate-600">
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">1. 对超广维度的基数覆盖：</strong>
            <span>远不止最基础烂大街的二(Bin)、八(Oct)、十(Dec)、十六(Hex)进制四大门阀互逆互拨。我们为您开放了涵盖从基数 2 平铺直拉到基数 36 的近乎所有罕见进制矩阵，哪怕是学术理论中才存在的一些极客转换需求也不漏配。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">2. 支持长数字大数解算不溢出：</strong>
            <span>在前端原生 JS 处理数值时常遇到 <code>MAX_SAFE_INTEGER</code> 位溢出丢失精度的天花板。本转换器配备了 BigInt 以及更为严密的安全数机制，即便是喂进一大长段用于加密或者区块标识的十六进制散列编码串，照样完美转换不丢任何尾数精度。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">3. 附带高频快切卡片板：</strong>
            <span>界面下方预留悬置了日常工程师打交道次数最繁密，比如“十转十六”、“二转十”等四大常用通道口，将过去起码要花 3 步点击挑选下拉框的流程压缩成一键即达，让效率飙升成为日常。</span>
          </li>
        </ul>
        
        <p className="text-slate-500 text-sm mt-8 pt-6 border-t border-slate-100">
          注意！当处于基数大于十进制的情况（如 Hex 十六进制向后排布），超过 9 的部分均采用由小到大的拉丁字母 A 至 Z 进行指代输入和结果回执。
        </p>
      </div>

    </div>
  );
}
