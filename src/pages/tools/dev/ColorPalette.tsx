import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Palette, Copy, Check } from 'lucide-react';
import tinycolor from 'tinycolor2';

export default function ColorPalette() {
  const { t } = useTranslation();
  const [baseColor, setBaseColor] = useState('#2563eb');
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const tc = tinycolor(baseColor);
  
  const tints = [];
  const shades = [];
  
  for(let i=1; i<=9; i++) {
     tints.push(tinycolor(baseColor).lighten(i * 5).toHexString());
     shades.push(tinycolor(baseColor).darken(i * 5).toHexString());
  }

  tints.push('#ffffff');
  shades.push('#000000');
  
  const handleCopy = (color: string) => {
    navigator.clipboard.writeText(color.toUpperCase());
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 1500);
  };

  const ColorBlock = ({ color, weight }: { color: string, weight: string }) => {
     const isLight = tinycolor(color).isLight();
     return (
        <div 
           title={color.toUpperCase()}
           onClick={() => handleCopy(color)}
           className="relative h-24 lg:h-32 flex flex-col items-start justify-end p-3 cursor-pointer group transition-transform hover:scale-[1.02] hover:z-10 shadow-sm"
           style={{ backgroundColor: color }}
        >
           <div className={`absolute top-3 left-3 text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest ${isLight ? 'text-black/60' : 'text-white/60'}`}>
              {t('tools.color-palette.clickToCopy')}
           </div>
           {copiedColor === color && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[1px]">
                 <Check className={`w-8 h-8 ${isLight ? 'text-black' : 'text-white'}`} />
              </div>
           )}
           <div className={`font-mono font-bold text-sm ${isLight ? 'text-black/80' : 'text-white/90'}`}>
              {color.toUpperCase()}
           </div>
           <div className={`text-[10px] font-bold mt-1 ${isLight ? 'text-black/40' : 'text-white/40'}`}>
              Weight {weight}
           </div>
        </div>
     );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-fuchsia-50 text-fuchsia-600 rounded-xl flex items-center justify-center shrink-0">
            <Palette className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('tools.color-palette.title')}</h1>
            <p className="text-slate-500 mt-1 text-sm md:text-base">
              {t('tools.color-palette.subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="border border-slate-200/80 bg-white rounded-2xl p-6 shadow-sm mb-6">
         <label className="block text-sm font-bold text-slate-700 mb-3">{t('tools.color-palette.inputLabel')}</label>
         <div className="flex gap-4 items-center">
             <input
               type="color"
               value={tc.isValid() ? tc.toHexString() : '#000000'}
               onChange={(e) => setBaseColor(e.target.value)}
               className="w-14 h-14 p-1 border border-slate-200/80 rounded cursor-pointer" 
             />
             <input
               type="text"
               value={baseColor}
               onChange={(e) => setBaseColor(e.target.value)}
               placeholder="#2563eb"
               className="font-mono text-lg px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl outline-none focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-100"
             />
         </div>
         {!tc.isValid() && <p className="text-red-500 text-xs font-bold mt-2">{t('tools.color-palette.invalidColor')}</p>}
      </div>

      {tc.isValid() && (
         <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="grid grid-cols-2 md:grid-cols-5 2xl:grid-cols-10">
               {tints.reverse().slice(0, 10).map((c, i) => (
                  <ColorBlock key={`tint-${i}`} color={c} weight={((10-i)*100).toString()} />
               ))}
               
               <div className="col-span-2 md:col-span-12 border-y-4 border-white">
                  <div 
                     title={tc.toHexString().toUpperCase()}
                     onClick={() => handleCopy(tc.toHexString())}
                     className="relative h-20 md:h-28 flex items-center justify-between px-6 cursor-pointer group"
                     style={{ backgroundColor: tc.toHexString() }}
                  >
                     <div className={`font-bold font-mono text-xl ${tc.isLight() ? 'text-black/80' : 'text-white'}`}>
                        {tc.toHexString().toUpperCase()}
                     </div>
                     <div className={`font-black tracking-widest text-xs opacity-40 uppercase ${tc.isLight() ? 'text-black' : 'text-white'}`}>
                        {t('tools.color-palette.baseColorLabel')}
                     </div>
                  </div>
               </div>

               {shades.slice(0, 10).map((c, i) => (
                  <ColorBlock key={`shade-${i}`} color={c} weight={`+${(i+1)*100}`} />
               ))}
            </div>
         </div>
      )}
    </div>
  );
}
