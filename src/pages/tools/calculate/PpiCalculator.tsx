import { useState, useMemo } from 'react';
import { MonitorSmartphone, LayoutPanelLeft } from 'lucide-react';

export default function PpiCalculator() {
  const [width, setWidth] = useState('1920');
  const [height, setHeight] = useState('1080');
  const [diagonal, setDiagonal] = useState('27'); // Inches

  const ppiResult = useMemo(() => {
    const w = parseFloat(width);
    const h = parseFloat(height);
    const d = parseFloat(diagonal);

    if (isNaN(w) || isNaN(h) || isNaN(d) || d <= 0) return null;

    const diagonalPixels = Math.sqrt(w * w + h * h);
    return diagonalPixels / d;
  }, [width, height, diagonal]);

  const setPreset = (w: string, h: string, d: string) => {
    setWidth(w);
    setHeight(h);
    setDiagonal(d);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center shrink-0">
            <MonitorSmartphone className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">屏幕 PPI 像素密度计算器</h1>
            <p className="text-[#64748b] mt-1 text-sm md:text-base">
              输入物理设备属性以及屏幕分辨率，换算得出面板的每英寸像素密度及视网膜效果评估。
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 lg:p-8 space-y-6">
           <div className="grid grid-cols-2 gap-6">
              <div>
                 <label className="block text-sm font-bold text-slate-700 mb-2">水平分辨率宽度 (px)</label>
                 <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-lg font-mono outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                    placeholder="如: 1920"
                 />
              </div>
              <div>
                 <label className="block text-sm font-bold text-slate-700 mb-2">垂直分辨率高度 (px)</label>
                 <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-lg font-mono outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                    placeholder="如: 1080"
                 />
              </div>
           </div>

           <div className="pt-4 border-t border-slate-100">
              <label className="block text-sm font-bold text-slate-700 mb-2">物理对角线尺寸 (英寸 inch)</label>
              <input
                 type="number"
                 value={diagonal}
                 onChange={(e) => setDiagonal(e.target.value)}
                 className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-lg font-mono outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                 placeholder="如: 27"
              />
           </div>

           <div className="pt-6">
              <label className="block text-sm font-bold text-slate-700 mb-3">典型设备参照</label>
              <div className="flex flex-wrap gap-2">
                 <button onClick={() => setPreset('2532', '1170', '6.1')} className="px-3 py-1.5 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-600 rounded-lg text-sm transition-colors border border-transparent hover:border-teal-200">
                    iPhone 12/13/14
                 </button>
                 <button onClick={() => setPreset('2560', '1600', '13.3')} className="px-3 py-1.5 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-600 rounded-lg text-sm transition-colors border border-transparent hover:border-teal-200">
                    MacBook Pro 13"
                 </button>
                 <button onClick={() => setPreset('3840', '2160', '27')} className="px-3 py-1.5 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-600 rounded-lg text-sm transition-colors border border-transparent hover:border-teal-200">
                    27" 4K 桌面显示器
                 </button>
                 <button onClick={() => setPreset('1920', '1080', '24')} className="px-3 py-1.5 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-600 rounded-lg text-sm transition-colors border border-transparent hover:border-teal-200">
                    24" 1080P 办公屏
                 </button>
              </div>
           </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-lg p-6 lg:p-8 text-white relative overflow-hidden flex flex-col justify-center">
           <div className="absolute right-0 top-0 opacity-10 pointer-events-none translate-x-1/4 -translate-y-1/4">
             <LayoutPanelLeft className="w-64 h-64" />
           </div>
           
           <div className="relative z-10 text-center space-y-6">
              <div>
                <div className="text-slate-400 font-medium tracking-widest text-sm mb-4 uppercase">Pixels Per Inch (PPI) 计算结果</div>
                <div className="text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-300">
                   {ppiResult ? ppiResult.toFixed(2) : '-'}
                </div>
              </div>

              {ppiResult && (
                 <div className="inline-block mt-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-6 py-4">
                    <div className="text-sm font-medium text-slate-300 mb-1">
                       视网膜视觉评估 (Retina Rating)
                    </div>
                    <div className="text-xl font-bold">
                       {ppiResult >= 300 
                         ? <span className="text-teal-400">达到手机/平板级惊艳细腻基准 (≥300)</span> 
                         : ppiResult >= 200 
                           ? <span className="text-blue-300">达到近远距桌面级极佳清晰度 (≥200)</span> 
                           : ppiResult >= 100 
                             ? <span className="text-yellow-300">普通日常办公用具颗粒感 (≥100)</span> 
                             : <span className="text-red-400">大果粒显像面板 / 极低密度 ({"<"}100)</span>}
                    </div>
                 </div>
              )}
           </div>
        </div>
      </div>

      {/* Bottom SEO Instructions Panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8 lg:p-12 mt-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">屏幕 PPI 在线换算器，精准测评手机与显示器的“细腻度”谎言</h2>
        
        <p className="text-slate-600 mb-6 leading-relaxed">
          当你在选购新款智能手机或者桌面端显示器的时候，厂商广告往往铺天盖地宣发“极清 4K”、“超广角大屏”。实际上单纯的分辨率（如 1080P 或 4K）以及单一的屏幕对角线尺寸都无法单独决定你肉眼看到的画面是否具备狗牙颗粒感。唯有计算出结合前二者的 PPI (Pixels Per Inch) 像素密度，才是判断画质细腻指标的金标准。
        </p>

        <h3 className="font-bold text-slate-800 text-lg mb-4">掌握屏幕密度测评标准与勾股运算原理：</h3>
        <ul className="space-y-4 text-slate-600">
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">1. 利用勾股定理解剖像素总纵深：</strong>
            <span>PPI 的推导计算并不是将面积简单相除。而是依据初中讲授过的“勾股定理公式”，将当前填入面板内的水平 px 数字与垂直 px 宽高的平方和开个根号计算出“纯像素对角线”，进而再和以英寸为单位的面框规格相除，得出每平方英寸究竟塞下了多少个灯珠阵列。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">2. 视网膜 Retina 界线的黄金区标：</strong>
            <span>在乔布斯奠定的智能手机近距离审美框架下，PPI 若跨过能够达到“326” 屏障槛就意味着人眼如果在距离面部 10-12 英寸时已经无法辨析细小像素块。当然这套评判标注随着视线距后移会剧烈缩减，例如购买在书桌上距离眼球较远的 27 寸 4K 显示器，往往拥有着 163 PPI 就已是非常通透艳丽。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">3. 为 UI 设计师的矢量位图输出把关：</strong>
            <span>除了消费者做硬件背调，这套小巧纯净的前端画板还服务于 App 界面切图开发人员，协助通过计算 @2x 甚至 @3x 的倍数导出比率确认产品线渲染密度区间。</span>
          </li>
        </ul>
        
        <p className="text-slate-500 text-sm mt-8 pt-6 border-t border-slate-100">
          极客背调：请注意区别 PPI (图像采样率单位) 和 DPI (打印机油墨输出单位界限点阵) 的本质区别。在本屏幕素质考核业务中，我们仅对真实的点光源显色阵列进行探讨与约束测定。
        </p>
      </div>

    </div>
  );
}
