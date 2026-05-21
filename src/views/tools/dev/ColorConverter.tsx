import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Copy, Check } from 'lucide-react';
import tinycolor from 'tinycolor2';
import ToolSEOCard from '../../../components/ToolSEOCard';

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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{t('tools.color-converter.title')}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            {t('tools.color-converter.subtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col space-y-3">
          <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
            {t('tools.color-converter.previewLabel')}
          </label>
          <div className="flex h-[500px] flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#282c34]">
            <div
              className="flex min-h-0 flex-1 items-end justify-start rounded-lg border border-slate-200 p-4 transition-colors dark:border-slate-700"
              style={{ backgroundColor: tc.isValid() ? tc.toHexString() : '#ffffff' }}
            >
              <div className="rounded bg-white/90 px-3 py-1 font-mono text-sm text-slate-800 shadow">
                {tc.isValid() ? tc.toHexString().toUpperCase() : 'INVALID'}
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">{t('tools.color-converter.inputLabel')}</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={tc.isValid() ? tc.toHexString() : '#000000'}
                  onChange={(e) => setInputColor(e.target.value)}
                  className="h-12 w-12 shrink-0 cursor-pointer rounded border border-slate-200 p-1 dark:border-slate-700"
                />
                <input
                  type="text"
                  value={inputColor}
                  onChange={(e) => setInputColor(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm text-slate-900 outline-none transition-colors focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  placeholder={t('tools.color-converter.inputPlaceholder')}
                />
              </div>
              {!tc.isValid() && <p className="mt-2 text-xs font-semibold text-red-500">{t('tools.color-converter.invalidColor')}</p>}
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <label className="block text-sm font-semibold leading-6 text-slate-900 dark:text-slate-100">
            {t('tools.color-converter.resultsTitle')}
          </label>
          <div className="h-[500px] overflow-hidden rounded-lg border border-slate-200 bg-slate-50 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="h-full divide-y divide-slate-200 overflow-y-auto dark:divide-slate-700">
              {colorFormats.map((fmt, idx) => (
                <div key={fmt.label} className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-white dark:hover:bg-[#282c34]">
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    <span className="w-16 shrink-0 text-sm font-semibold text-slate-500 dark:text-slate-400">{fmt.label}</span>
                    <span className="flex-1 break-all font-mono text-sm text-slate-900 dark:text-slate-100">{tc.isValid() ? fmt.value : '-'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => tc.isValid() && handleCopy(fmt.value, idx)}
                    disabled={!tc.isValid()}
                    className="inline-flex shrink-0 items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-[#282c34] dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    {copiedIndex === idx ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedIndex === idx ? t('tools.color-converter.copiedBtn') : t('tools.color-converter.copyBtn')}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <ToolSEOCard toolKey="color-converter" />
    </div>
  );
}
