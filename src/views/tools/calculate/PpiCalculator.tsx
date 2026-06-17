import { useState, useMemo } from 'react';
import { LayoutPanelLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { analytics } from '../../../services/analytics';

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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{t('tools.ppi-calculator.title')}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            {t('tools.ppi-calculator.subtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col space-y-3">
          <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
            {t('tools.ppi-calculator.presetsTitle')}
          </label>
          <div className="flex h-[500px] flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#282c34]">
           <div className="grid grid-cols-2 gap-5">
              <div>
                 <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">{t('tools.ppi-calculator.widthLabel')}</label>
                 <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-lg text-slate-900 outline-none transition-colors focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    placeholder={t('tools.ppi-calculator.widthPlaceholder')}
                 />
              </div>
              <div>
                 <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">{t('tools.ppi-calculator.heightLabel')}</label>
                 <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-lg text-slate-900 outline-none transition-colors focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    placeholder={t('tools.ppi-calculator.heightPlaceholder')}
                 />
              </div>
           </div>

           <div className="mt-5 border-t border-slate-200 pt-5 dark:border-slate-700">
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">{t('tools.ppi-calculator.diagonalLabel')}</label>
              <input
                 type="number"
                 value={diagonal}
                 onChange={(e) => setDiagonal(e.target.value)}
                 className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-lg text-slate-900 outline-none transition-colors focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                 placeholder="如: 27"
              />
           </div>

           <div className="mt-auto">
              <label className="mb-3 block text-sm font-semibold text-slate-700 dark:text-slate-200">{t('tools.ppi-calculator.presetsTitle')}</label>
              <div className="flex flex-wrap gap-2">
                 <button onClick={() => setPreset('2532', '1170', '6.1', 'iPhone 12/13/14')} className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-600 transition-colors hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                    iPhone 12/13/14
                 </button>
                 <button onClick={() => setPreset('2560', '1600', '13.3', 'MacBook Pro 13"')} className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-600 transition-colors hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                    MacBook Pro 13"
                 </button>
                 <button onClick={() => setPreset('3840', '2160', '27', '27" 4K Monitor')} className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-600 transition-colors hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                    27" 4K 桌面显示器
                 </button>
                 <button onClick={() => setPreset('1920', '1080', '24', '24" 1080P Monitor')} className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-600 transition-colors hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                    24" 1080P 办公屏
                 </button>
              </div>
           </div>
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
            {t('tools.ppi-calculator.resultTitle')}
          </label>
          <div className="relative flex h-[500px] flex-col justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-6 text-slate-950 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white lg:p-8">
           <div className="pointer-events-none absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 opacity-5">
             <LayoutPanelLeft className="h-64 w-64" />
           </div>

           <div className="relative z-10 space-y-6 text-center">
              <div>
                <div className="mb-4 text-sm font-medium uppercase tracking-widest text-slate-500 dark:text-slate-400">{t('tools.ppi-calculator.resultTitle')}</div>
                <div className="text-7xl font-semibold text-cyan-700 dark:text-cyan-300 lg:text-8xl">
                   {ppiResult ? ppiResult.toFixed(2) : '-'}
                </div>
              </div>

              {ppiResult && (
                 <div className="mt-8 inline-block rounded-lg border border-slate-200 bg-white px-6 py-4 dark:border-slate-700 dark:bg-[#282c34]">
                    <div className="mb-1 text-sm font-medium text-slate-500 dark:text-slate-400">
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
      </div>

    </div>
  );
}
