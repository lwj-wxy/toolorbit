import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pipette, Copy, AlertCircle, Check } from 'lucide-react';
import tinycolor from 'tinycolor2';

export default function ColorPicker() {
  const { t } = useTranslation();
  const [pickedColor, setPickedColor] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handlePick = async () => {
     try {
         setErrorStatus(null);
         // Check if EyeDropper is supported
         if (!('EyeDropper' in window)) {
             setErrorStatus(t('tools.color-picker.browserNotSupported'));
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
             setErrorStatus(`${t('tools.color-picker.unknownError')}: ${e.message || 'Unknown'}`);
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
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('tools.color-picker.title')}</h1>
            <p className="text-slate-500 mt-1 text-sm md:text-base">
              {t('tools.color-picker.subtitle')}
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
                              title={t('tools.color-picker.copyTitle')}
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
                  <span className="text-slate-400 text-sm">{t('tools.color-picker.waiting')}</span>
              </div>
          )}

          <button 
             onClick={handlePick}
             className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-full font-bold text-lg hover:bg-amber-500 hover:shadow-lg hover:shadow-amber-500/20 hover:-translate-y-1 transition-all active:translate-y-0"
          >
             <Pipette className="w-5 h-5" />
             {pickedColor ? t('tools.color-picker.rePickBtn') : t('tools.color-picker.pickBtn')}
          </button>
          
          <p className="text-slate-400 text-xs mt-6 font-medium">
             {t('tools.color-picker.tip')}
          </p>
      </div>
    </div>
  );
}
