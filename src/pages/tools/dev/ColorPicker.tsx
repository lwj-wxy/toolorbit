import React, { useState } from 'react';
import { Pipette, Copy, AlertCircle, Check } from 'lucide-react';
import tinycolor from 'tinycolor2';

export default function ColorPicker() {
  const [pickedColor, setPickedColor] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handlePick = async () => {
     try {
         setErrorStatus(null);
         // Check if EyeDropper is supported
         if (!('EyeDropper' in window)) {
             setErrorStatus('哎呀，您当前的浏览器内核不支持原生的 EyeDropper（吸管 API）。请使用最新版的 Chrome, Edge 等 Chromium 系浏览器。');
             return;
         }

         // @ts-ignore - EyeDropper is not fully typed in standard DOM lib yet
         const eyeDropper = new window.EyeDropper();
         const result = await eyeDropper.open();
         setPickedColor(result.sRGBHex);
     } catch (e: any) {
         if (e.message && e.message.includes('canceled')) {
             // User canceled the prompt, ignore.
         } else {
             setErrorStatus(`发生了未知错误或跨域提取限制：${e.message || 'Unknown'}`);
         }
     }
  };

  const handleCopy = () => {
      if(pickedColor) {
          navigator.clipboard.writeText(pickedColor.toUpperCase());
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
      }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
            <Pipette className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">原生态屏幕颜色拾取器</h1>
            <p className="text-slate-500 mt-1 text-sm md:text-base">
              脱离外部截图软件，直接通过浏览器底层接口呼出拾色放大镜捕捉显示器任何像素色块。
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-3xl p-8 lg:p-12 shadow-sm text-center flex flex-col items-center justify-center min-h-[400px]">
          
          {errorStatus ? (
              <div className="flex flex-col items-center text-rose-500 gap-3 max-w-lg mb-8">
                  <AlertCircle className="w-12 h-12" />
                  <p className="font-bold">{errorStatus}</p>
              </div>
          ) : pickedColor ? (
              <div className="w-full max-w-sm mb-12 animate-in fade-in zoom-in duration-300">
                  <div 
                     className="w-full aspect-square rounded-full shadow-inner border-8 border-slate-50 mb-8 mx-auto transition-colors duration-500"
                     style={{ backgroundColor: pickedColor }}
                  />
                  <div className="space-y-4">
                     <div className="flex items-center justify-between bg-slate-50 rounded-xl border border-slate-200/80 p-2">
                         <div className="font-mono text-2xl font-black text-slate-800 ml-4 tracking-wider">
                             {pickedColor.toUpperCase()}
                         </div>
                         <button 
                             onClick={handleCopy}
                             className="flex items-center justify-center w-12 h-12 bg-white border border-slate-200/80 rounded-lg text-slate-500 hover:text-amber-600 hover:border-amber-200 transition-all shadow-sm"
                             title="复制 HEX"
                         >
                             {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                         </button>
                     </div>
                     <div className="font-mono text-slate-500 flex justify-center gap-2 text-sm bg-slate-100 rounded-xl py-2">
                         {tinycolor(pickedColor).toRgbString()}
                     </div>
                  </div>
              </div>
          ) : (
              <div className="w-32 h-32 rounded-full bg-slate-50 border-2 border-dashed border-slate-200 mb-8 flex items-center justify-center">
                  <span className="text-slate-400 text-sm">等待拾色</span>
              </div>
          )}

          <button 
             onClick={handlePick}
             className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-full font-bold text-lg hover:bg-amber-500 hover:shadow-lg hover:shadow-amber-500/20 hover:-translate-y-1 transition-all active:translate-y-0"
          >
             <Pipette className="w-5 h-5" />
             {pickedColor ? '重新在屏幕上拾取' : '立即呼出拾色雷达'}
          </button>
          
          <p className="text-slate-400 text-xs mt-6">
              * 提示：点击按钮后，通常会在光标附近弹出一个带有十字准线的圆圈网格（针对 Chrome/Edge 等），即可精准瞄准屏幕上的任何元素包括网页外壁。
          </p>
      </div>

      <div className="bg-transparent border border-slate-200/60 rounded-2xl p-8 lg:p-12 mb-12 mt-12 bg-gradient-to-b from-white/50 to-transparent">
        <h2 className="text-xl font-bold text-slate-800 mb-6">关于浏览器 EyeDropper API</h2>
        <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
           <p>过去我们想要知道其他参考网站某一个区域的色值，只能通过“截屏 ➔ 导入 Photoshop / 本地抓色器 ➔ 鼠标瞄准提取” 这极其繁琐的步骤完成。而本工具彻底摒弃了插件依赖。</p>
           <p>借助 W3C 规范下最新的 <strong>EyeDropper API</strong> 原力，仅需一键网页点击请求，您即可指挥操作系统去捕足捕捉光标下全域（无论是不是在目前的标签页内）屏幕显示像素的红绿蓝合成参数图，直接安全、高效的提取到网页中使用。</p>
        </div>
      </div>
    </div>
  );
}
