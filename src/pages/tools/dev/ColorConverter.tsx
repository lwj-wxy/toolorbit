import React, { useState, useEffect } from 'react';
import { Palette, Copy, Check } from 'lucide-react';
import tinycolor from 'tinycolor2';

export default function ColorConverter() {
  const [inputColor, setInputColor] = useState('#42b983');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const tc = tinycolor(inputColor);
  const rgb = tc.toRgb();
  const hsl = tc.toHsl();
  const hsv = tc.toHsv();
  
  // Custom CMYK logic
  const getCmyk = (r: number, g: number, b: number) => {
    const r01 = r / 255;
    const g01 = g / 255;
    const b01 = b / 255;
    const k = 1 - Math.max(r01, g01, b01);
    const c = (1 - r01 - k) / (1 - k) || 0;
    const m = (1 - g01 - k) / (1 - k) || 0;
    const y = (1 - b01 - k) / (1 - k) || 0;
    return { c: Math.round(c * 100), m: Math.round(m * 100), y: Math.round(y * 100), k: Math.round(k * 100) };
  };

  const cmyk = getCmyk(rgb.r, rgb.g, rgb.b);

  const colorFormats = [
    { label: 'HEX', value: tc.toHexString().toUpperCase() },
    { label: 'HEX8', value: tc.toHex8String().toUpperCase() },
    { label: 'RGB', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { label: 'RGBA', value: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})` },
    { label: 'HSL', value: `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s * 100)}%, ${Math.round(hsl.l * 100)}%)` },
    { label: 'HSLA', value: `hsla(${Math.round(hsl.h)}, ${Math.round(hsl.s * 100)}%, ${Math.round(hsl.l * 100)}%, ${hsl.a})` },
    { label: 'HSV', value: `hsv(${Math.round(hsv.h)}, ${Math.round(hsv.s * 100)}%, ${Math.round(hsv.v * 100)}%)` },
    { label: 'CMYK', value: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)` },
  ];

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-pink-50 text-pink-600 rounded-xl flex items-center justify-center shrink-0">
            <Palette className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">颜色代码转换</h1>
            <p className="text-slate-500 mt-1 text-sm md:text-base">
              在 HEX, RGB, HSL, HSV, CMYK 等多种工业色彩规格之间无损互转，支持透明度提取。
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 border border-slate-200/80 bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-6">
          <div className="space-y-3">
             <label className="block text-sm font-bold text-slate-700">色彩提取控制板</label>
             <div 
               className="w-full h-48 rounded-xl border border-slate-200/80 shadow-inner flex items-end justify-start p-4 transition-colors"
               style={{ backgroundColor: tc.isValid() ? tc.toHexString() : '#ffffff' }}
             >
                <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded text-sm font-mono shadow text-slate-800">
                   {tc.isValid() ? tc.toHexString().toUpperCase() : 'INVALID'}
                </div>
             </div>
          </div>
          
          <div>
             <label className="block text-sm font-bold text-slate-700 mb-2">手动输入色值 (兼容各类格式)</label>
             <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  value={tc.isValid() ? tc.toHexString() : '#000000'}
                  onChange={(e) => setInputColor(e.target.value)}
                  className="w-12 h-12 p-1 rounded border border-slate-200/80 cursor-pointer shrink-0"
                />
                <input 
                  type="text" 
                  value={inputColor}
                  onChange={(e) => setInputColor(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3 font-mono outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
                  placeholder="e.g. #42b983, rgb(66, 185, 131)"
                />
             </div>
             {!tc.isValid() && <p className="text-red-500 text-xs mt-2 font-bold">无法解析当前色值。</p>}
          </div>
        </div>

        <div className="lg:col-span-2 border border-slate-200/80 bg-white rounded-2xl overflow-hidden shadow-sm">
           <div className="px-6 py-4 bg-slate-50 border-b border-slate-200/80">
              <h3 className="font-bold text-slate-700">标准色系解析矩阵</h3>
           </div>
           <div className="divide-y divide-slate-100">
              {colorFormats.map((fmt, idx) => (
                 <div key={fmt.label} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4 w-full">
                       <span className="w-16 text-sm font-bold text-slate-400 shrink-0">{fmt.label}</span>
                       <span className="font-mono text-slate-800 flex-1 break-all">{tc.isValid() ? fmt.value : '-'}</span>
                    </div>
                    <button 
                       onClick={() => tc.isValid() && handleCopy(fmt.value, idx)}
                       disabled={!tc.isValid()}
                       className="ml-4 shrink-0 flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200/80 rounded-lg text-sm text-slate-600 hover:text-pink-600 hover:border-pink-200 hover:bg-pink-50 transition-all disabled:opacity-50"
                    >
                       {copiedIndex === idx ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                       {copiedIndex === idx ? '已复制' : '复制'}
                    </button>
                 </div>
              ))}
           </div>
        </div>
      </div>

      <div className="bg-transparent border border-slate-200/60 rounded-2xl p-8 lg:p-12 mt-12 mb-12 bg-gradient-to-b from-white/50 to-transparent">
        <h2 className="text-xl font-bold text-slate-800 mb-6">全光谱色彩模型互转说明</h2>
        <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
           <p><strong>HEX / RGB:</strong> 网页与显示器最通用的发光三原色（红、绿、蓝）模型，HEX 只是其 16 进制表现形式。完美支持 8 位的 Alpha 透明通道（即 RGBA 或 HEX8）。</p>
           <p><strong>HSL / HSV:</strong> 这是更贴近人眼视觉感知的色相（Hue）、饱和度（Saturation）、与亮度/明度（Lightness/Value）的圆柱坐标系表示法。适合在 UI 调整中基于相近颜色寻找色阶（通过加减亮度或饱和度）。</p>
           <p><strong>CMYK:</strong> 传统的工业印刷四分色模式（青、洋红、黄、黑）。此处的转换为理论推导值，如果您需要进行极其严苛的印前级调色，请使用包含了特定 ICC 色彩配置文件的本地专业排版软件完成。</p>
        </div>
      </div>
    </div>
  );
}
