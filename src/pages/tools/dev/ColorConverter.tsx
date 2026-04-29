import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Palette, Copy, Check } from 'lucide-react';
import tinycolor from 'tinycolor2';

export default function ColorConverter() {
  const { t } = useTranslation();
  const [inputColor, setInputColor] = useState('#42b983');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const tc = tinycolor(inputColor);
  const rgb = tc.toRgb();
  const hsl = tc.toHsl();
  const hsv = tc.toHsv();
  
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
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('tools.color-converter.title')}</h1>
            <p className="text-slate-500 mt-1 text-sm md:text-base">
              {t('tools.color-converter.subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 border border-slate-200/80 bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-6">
          <div className="space-y-3">
             <label className="block text-sm font-bold text-slate-700">{t('tools.color-converter.previewLabel')}</label>
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
             <label className="block text-sm font-bold text-slate-700 mb-2">{t('tools.color-converter.inputLabel')}</label>
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
                  placeholder={t('tools.color-converter.inputPlaceholder')}
                />
             </div>
             {!tc.isValid() && <p className="text-red-500 text-xs mt-2 font-bold">{t('tools.color-converter.invalidColor')}</p>}
          </div>
        </div>

        <div className="lg:col-span-2 border border-slate-200/80 bg-white rounded-2xl overflow-hidden shadow-sm">
           <div className="px-6 py-4 bg-slate-50 border-b border-slate-200/80">
              <h3 className="font-bold text-slate-700">{t('tools.color-converter.resultsTitle')}</h3>
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
                       {copiedIndex === idx ? t('tools.color-converter.copiedBtn') : t('tools.color-converter.copyBtn')}
                    </button>
                 </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
