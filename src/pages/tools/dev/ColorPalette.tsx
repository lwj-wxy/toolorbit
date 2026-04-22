import React, { useState } from 'react';
import { Palette, Copy, Check } from 'lucide-react';
import tinycolor from 'tinycolor2';

export default function ColorPalette() {
  const [baseColor, setBaseColor] = useState('#2563eb');
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const tc = tinycolor(baseColor);
  
  // Generate 10 tints (lighter) and 10 shades (darker)
  const tints = [];
  const shades = [];
  
  for(let i=1; i<=9; i++) {
     tints.push(tinycolor(baseColor).lighten(i * 5).toHexString());
     shades.push(tinycolor(baseColor).darken(i * 5).toHexString());
  }

  // Add white/black extremities
  tints.push('#ffffff');
  shades.push('#000000');
  
  const handleCopy = (color: string) => {
    navigator.clipboard.writeText(color.toUpperCase());
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 1500);
  };

  const ColorBlock = ({ color, weight }: { color: string, weight: string }) => {
     const isLight = tinycolor(color).isLight();
     const tcObj = tinycolor(color);
     return (
        <div 
           title={color.toUpperCase()}
           onClick={() => handleCopy(color)}
           className="relative h-24 lg:h-32 flex flex-col items-start justify-end p-3 cursor-pointer group transition-transform hover:scale-[1.02] hover:z-10 shadow-sm"
           style={{ backgroundColor: color }}
        >
           <div className={`absolute top-3 left-3 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity ${isLight ? 'text-black/60' : 'text-white/60'}`}>
              Click to copy
           </div>
           {copiedColor === color && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[1px]">
                 <Check className={`w-8 h-8 ${isLight ? 'text-black' : 'text-white'}`} />
              </div>
           )}
           <div className={`font-mono font-bold text-sm ${isLight ? 'text-black/80' : 'text-white/90'}`}>
              {color.toUpperCase()}
           </div>
           <div className={`text-xs mt-1 ${isLight ? 'text-black/50' : 'text-white/50'}`}>
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
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">阶梯调色板推演工具</h1>
            <p className="text-slate-500 mt-1 text-sm md:text-base">
              针对主色调自动演化同色系更具层次的高级 Tints (明亮色阶) 与 Shades (暗黑环境色阶)。
            </p>
          </div>
        </div>
      </div>

      <div className="border border-slate-200/80 bg-white rounded-2xl p-6 shadow-sm mb-6">
         <label className="block text-sm font-bold text-slate-700 mb-3">设定 Base (基准色)</label>
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
         {!tc.isValid() && <p className="text-red-500 text-xs font-bold mt-2">色值格式不合法。</p>}
      </div>

      {tc.isValid() && (
         <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="grid grid-cols-2 md:grid-cols-5 2xl:grid-cols-10">
               {/* Tints in reverse (white to near-base) */}
               {tints.reverse().slice(0, 10).map((c, i) => (
                  <ColorBlock key={`tint-${i}`} color={c} weight={((10-i)*100).toString()} />
               ))}
               
               {/* Base Color spanning horizontally or isolated */}
               <div className="col-span-2 md:col-span-5 2xl:col-span-10 border-y-4 border-white">
                  <div 
                     title={tc.toHexString().toUpperCase()}
                     onClick={() => handleCopy(tc.toHexString())}
                     className="relative h-20 md:h-28 flex items-center justify-between px-6 cursor-pointer group"
                     style={{ backgroundColor: tc.toHexString() }}
                  >
                     <div className={`font-bold font-mono text-xl ${tc.isLight() ? 'text-black/80' : 'text-white'}`}>
                        {tc.toHexString().toUpperCase()}
                     </div>
                     <div className={`font-bold tracking-widest text-sm opacity-50 ${tc.isLight() ? 'text-black' : 'text-white'}`}>
                        BASE COLOR
                     </div>
                  </div>
               </div>

               {/* Shades (near-base to black) */}
               {shades.slice(0, 10).map((c, i) => (
                  <ColorBlock key={`shade-${i}`} color={c} weight={`+${(i+1)*100}`} />
               ))}
            </div>
         </div>
      )}

      <div className="bg-transparent border border-slate-200/60 rounded-2xl p-8 lg:p-12 mt-12 mb-12 bg-gradient-to-b from-white/50 to-transparent">
        <h2 className="text-xl font-bold text-slate-800 mb-6">为什么要构建 Tints 与 Shades 矩阵？</h2>
        <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
           <p>在 UI/UX 设计或是现代 Tailwind CSS 中，绝不能只采用单一的一种颜色去生硬地涂抹按钮框线。这会使页面极度扁平且缺少互动深度。</p>
           <p>通过掺入白色（Tint 推演）我们能获取更轻盈的高光色，常用于卡片背景、警报器的柔和底色。而掺加黑色（Shade 调暗）则带来了更有重量的厚重边界块以及用于聚焦视线和激活效果的极深悬停反馈。</p>
        </div>
      </div>
    </div>
  );
}
