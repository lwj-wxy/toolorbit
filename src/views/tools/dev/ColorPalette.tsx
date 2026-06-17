import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import tinycolor from 'tinycolor2';

export default function ColorPalette() {
  const { t } = useTranslation();
  const [baseColor, setBaseColor] = useState('#2563eb');
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const tc = tinycolor(baseColor);
  
  const tints: string[] = [];
  const shades: string[] = [];
  
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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{t('tools.color-palette.title')}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            {t('tools.color-palette.subtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col space-y-3">
          <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
            {t('tools.color-palette.inputLabel')}
          </label>
          <div className="flex h-[500px] flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#282c34]">
            <div
              className="min-h-0 flex-1 rounded-lg border border-slate-200 dark:border-slate-700"
              style={{ backgroundColor: tc.isValid() ? tc.toHexString() : '#ffffff' }}
            />
            <div className="mt-5 flex items-center gap-4">
              <input
                type="color"
                value={tc.isValid() ? tc.toHexString() : '#000000'}
                onChange={(e) => setBaseColor(e.target.value)}
                className="h-14 w-14 cursor-pointer rounded border border-slate-200 p-1 dark:border-slate-700"
              />
              <input
                type="text"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                placeholder="#2563eb"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm text-slate-900 outline-none transition-colors focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
            {!tc.isValid() && <p className="mt-2 text-xs font-semibold text-red-500">{t('tools.color-palette.invalidColor')}</p>}
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
            {t('tools.color-palette.baseColorLabel')}
          </label>
          <div className="h-[500px] overflow-hidden rounded-lg border border-slate-200 bg-slate-50 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            {tc.isValid() && (
              <div className="grid h-full grid-cols-2 overflow-y-auto md:grid-cols-5">
                {tints.reverse().slice(0, 10).map((c, i) => (
                  <ColorBlock key={`tint-${i}`} color={c} weight={((10-i)*100).toString()} />
                ))}

                <div className="col-span-2 border-y-4 border-white md:col-span-5 dark:border-slate-900">
                  <div
                    title={tc.toHexString().toUpperCase()}
                    onClick={() => handleCopy(tc.toHexString())}
                    className="group relative flex h-20 cursor-pointer items-center justify-between px-6"
                    style={{ backgroundColor: tc.toHexString() }}
                  >
                    <div className={`font-mono text-xl font-bold ${tc.isLight() ? 'text-black/80' : 'text-white'}`}>
                      {tc.toHexString().toUpperCase()}
                    </div>
                    <div className={`text-xs font-black uppercase tracking-widest opacity-40 ${tc.isLight() ? 'text-black' : 'text-white'}`}>
                      {t('tools.color-palette.baseColorLabel')}
                    </div>
                  </div>
                </div>

                {shades.slice(0, 10).map((c, i) => (
                  <ColorBlock key={`shade-${i}`} color={c} weight={`+${(i+1)*100}`} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
