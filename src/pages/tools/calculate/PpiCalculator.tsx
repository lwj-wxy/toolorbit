import { useState, useMemo } from 'react';
import { MonitorSmartphone, LayoutPanelLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { analytics } from '../../../services/analytics';
import ToolSEOCard from '../../../components/ToolSEOCard';

export default function PpiCalculator() {
  const { t } = useTranslation();
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

  const setPreset = (w: string, h: string, d: string, label: string) => {
    setWidth(w);
    setHeight(h);
    setDiagonal(d);

    analytics.trackEvent({
      category: 'Calculation Tools',
      action: 'Select PPI Preset',
      label: `${label} (${w}x${h} @ ${d}")`
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center shrink-0">
            <MonitorSmartphone className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('tools.ppi-calculator.title')}</h1>
            <p className="text-[#64748b] mt-1 text-sm md:text-base">
              {t('tools.ppi-calculator.subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 lg:p-8 space-y-6">
           <div className="grid grid-cols-2 gap-6">
              <div>
                 <label className="block text-sm font-bold text-slate-700 mb-2">{t('tools.ppi-calculator.widthLabel')}</label>
                 <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-lg font-mono outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                    placeholder={t('tools.ppi-calculator.widthPlaceholder')}
                 />
              </div>
              <div>
                 <label className="block text-sm font-bold text-slate-700 mb-2">{t('tools.ppi-calculator.heightLabel')}</label>
                 <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-lg font-mono outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                    placeholder={t('tools.ppi-calculator.heightPlaceholder')}
                 />
              </div>
           </div>

           <div className="pt-4 border-t border-slate-100">
              <label className="block text-sm font-bold text-slate-700 mb-2">{t('tools.ppi-calculator.diagonalLabel')}</label>
              <input
                 type="number"
                 value={diagonal}
                 onChange={(e) => setDiagonal(e.target.value)}
                 className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-lg font-mono outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                 placeholder="如: 27"
              />
           </div>

           <div className="pt-6">
              <label className="block text-sm font-bold text-slate-700 mb-3">{t('tools.ppi-calculator.presetsTitle')}</label>
              <div className="flex flex-wrap gap-2">
                 <button onClick={() => setPreset('2532', '1170', '6.1', 'iPhone 12/13/14')} className="px-3 py-1.5 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-600 rounded-lg text-sm transition-colors border border-transparent hover:border-teal-200">
                    iPhone 12/13/14
                 </button>
                 <button onClick={() => setPreset('2560', '1600', '13.3', 'MacBook Pro 13"')} className="px-3 py-1.5 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-600 rounded-lg text-sm transition-colors border border-transparent hover:border-teal-200">
                    MacBook Pro 13"
                 </button>
                 <button onClick={() => setPreset('3840', '2160', '27', '27" 4K Monitor')} className="px-3 py-1.5 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-600 rounded-lg text-sm transition-colors border border-transparent hover:border-teal-200">
                    27" 4K 桌面显示器
                 </button>
                 <button onClick={() => setPreset('1920', '1080', '24', '24" 1080P Monitor')} className="px-3 py-1.5 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-600 rounded-lg text-sm transition-colors border border-transparent hover:border-teal-200">
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
                <div className="text-slate-400 font-medium tracking-widest text-sm mb-4 uppercase">{t('tools.ppi-calculator.resultTitle')}</div>
                <div className="text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-300">
                   {ppiResult ? ppiResult.toFixed(2) : '-'}
                </div>
              </div>

              {ppiResult && (
                 <div className="inline-block mt-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-6 py-4">
                    <div className="text-sm font-medium text-slate-300 mb-1">
                       {t('tools.ppi-calculator.retinaRatingTitle')}
                    </div>
                    <div className="text-xl font-bold">
                       {ppiResult >= 300 
                         ? <span className="text-teal-400">{t('tools.ppi-calculator.ratingHigh')}</span> 
                         : ppiResult >= 200 
                           ? <span className="text-blue-300">{t('tools.ppi-calculator.ratingMedium')}</span> 
                           : ppiResult >= 100 
                             ? <span className="text-yellow-300">{t('tools.ppi-calculator.ratingLow')}</span> 
                             : <span className="text-red-400">{t('tools.ppi-calculator.ratingVeryLow')}</span>}
                    </div>
                 </div>
              )}
           </div>
        </div>
      </div>

      <ToolSEOCard toolKey="ppi-calculator" />
    </div>
  );
}
