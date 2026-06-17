import { useState } from 'react';
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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{t('tools.color-picker.title')}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            {t('tools.color-picker.subtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col space-y-3">
          <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
            {t('tools.color-picker.title')}
          </label>
          <div className="flex h-[500px] flex-col items-center justify-center rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-700 dark:bg-[#282c34]">
            {errorStatus ? (
              <div className="flex max-w-lg flex-col items-center gap-3 text-rose-500">
                <AlertCircle className="h-12 w-12" />
                <p className="font-semibold">{errorStatus}</p>
              </div>
            ) : pickedColor ? (
              <div className="w-full max-w-sm animate-in fade-in zoom-in duration-300">
                <div
                  className="mx-auto mb-8 aspect-square w-full rounded-lg border border-slate-200 shadow-inner transition-colors duration-500 dark:border-slate-700"
                  style={{ backgroundColor: pickedColor }}
                />
              </div>
            ) : (
              <div className="flex h-32 w-32 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                <span className="text-sm text-slate-400">{t('tools.color-picker.waiting')}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
            {t('tools.color-picker.copyTitle')}
          </label>
          <div className="flex h-[500px] flex-col rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="space-y-4">
              <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-[#282c34]">
                <div className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">HEX</div>
                <div className="mt-2 font-mono text-2xl font-semibold tracking-wider text-slate-900 dark:text-slate-100">
                  {pickedColor ? pickedColor.toUpperCase() : '--'}
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-[#282c34]">
                <div className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">RGB</div>
                <div className="mt-2 font-mono text-sm text-slate-700 dark:text-slate-300">
                  {pickedColor ? tinycolor(pickedColor).toRgbString() : '--'}
                </div>
              </div>
              <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                {t('tools.color-picker.tip')}
              </p>
            </div>

            <div className="mt-auto space-y-3">
              <button
                type="button"
                onClick={handlePick}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-cyan-700"
              >
                <Pipette className="h-4 w-4" />
                {pickedColor ? t('tools.color-picker.rePickBtn') : t('tools.color-picker.pickBtn')}
              </button>
              <button
                type="button"
                onClick={handleCopy}
                disabled={!pickedColor}
                className="flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-[#282c34] dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                {t('tools.color-picker.copyTitle')}
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
