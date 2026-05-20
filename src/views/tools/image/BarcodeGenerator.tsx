import { useState, useEffect, useRef } from 'react';
import { Download, RefreshCcw } from 'lucide-react';
import JsBarcode from 'jsbarcode';
import { useTranslation } from 'react-i18next';

export default function BarcodeGenerator() {
  const { t } = useTranslation();
  const [text, setText] = useState('123456789012');
  const [format, setFormat] = useState('CODE128');
  const [width, setWidth] = useState(2);
  const [height, setHeight] = useState(100);
  const [displayValue, setDisplayValue] = useState(true);
  const [background, setBackground] = useState('#ffffff');
  const [lineColor, setLineColor] = useState('#000000');
  const [error, setError] = useState('');

  const barcodeRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    generateBarcode();
  }, [text, format, width, height, displayValue, background, lineColor]);

  const generateBarcode = () => {
    if (!text) {
        setError(t('tools.barcode-generator.errors.isEmpty'));
        return;
    }
    setError('');
    
    try {
      if (barcodeRef.current) {
        JsBarcode(barcodeRef.current, text, {
          format: format,
          width: width,
          height: height,
          displayValue: displayValue,
          background: background,
          lineColor: lineColor,
          margin: 10,
          valid: function (valid) {
             if (!valid) {
                 setError(t('tools.barcode-generator.errors.invalidFormat'));
             }
          }
        });
      }
    } catch (err: any) {
      setError(t('tools.barcode-generator.errors.eanError'));
    }
  };

  const handleDownload = () => {
    if (error || !barcodeRef.current) return;
    
    // Convert SVG to canvas then to DataURL
    const svg = barcodeRef.current;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if(ctx) {
        // Draw white background if needed (svg background prop handles it mostly, but just to be safe)
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        const a = document.createElement("a");
        a.download = `barcode-${format}-${new Date().getTime()}.png`;
        a.href = canvas.toDataURL("image/png");
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const FORMATS = [
      'CODE128',
      'CODE128A',
      'CODE128B',
      'CODE128C',
      'CODE39',
      'EAN13',
      'EAN8',
      'UPC',
      'ITF14',
      'MSI',
      'pharmacode'
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">{t('tools.barcode-generator.title')}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            {t('tools.barcode-generator.subtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        
        {/* Left Side: Settings */}
        <div className="flex flex-col space-y-3">
          <h3 className="block text-sm font-semibold leading-6 text-slate-900">{t('tools.barcode-generator.contentLabel')}</h3>

          <div className="flex min-h-[500px] flex-col rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
             
             <div className="space-y-5">
                <div>
                   <label className="mb-2 block text-sm font-semibold text-slate-700">{t('tools.barcode-generator.contentLabel')}</label>
                   <input
                     type="text"
                     value={text}
                     onChange={(e) => setText(e.target.value)}
                     className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition-colors focus:border-cyan-500"
                     placeholder={t('tools.barcode-generator.contentPlaceholder')}
                   />
                </div>

                <div>
                   <label className="mb-2 block text-sm font-semibold text-slate-700">{t('tools.barcode-generator.formatLabel')}</label>
                   <select 
                       value={format}
                       onChange={(e) => {
                           setFormat(e.target.value);
                           // Offer a gentle hint text adaptation
                           if(e.target.value === 'EAN13') setText('123456789012');
                           else if(e.target.value === 'EAN8') setText('1234567');
                           else if(e.target.value === 'UPC') setText('123456789012');
                       }}
                       className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 font-mono text-slate-900 shadow-sm outline-none transition-colors focus:border-cyan-500"
                   >
                       {FORMATS.map(f => (
                           <option key={f} value={f}>{f}</option>
                       ))}
                   </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div>
                       <label className="mb-2 block text-sm font-semibold text-slate-700">{t('tools.barcode-generator.widthLabel')}</label>
                       <input
                         type="number"
                         min="1"
                         max="10"
                         value={width}
                         onChange={(e) => setWidth(parseInt(e.target.value) || 2)}
                         className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none focus:border-cyan-500"
                       />
                   </div>
                   <div>
                       <label className="mb-2 block text-sm font-semibold text-slate-700">{t('tools.barcode-generator.heightLabel')}</label>
                       <input
                         type="number"
                         min="10"
                         max="300"
                         value={height}
                         onChange={(e) => setHeight(parseInt(e.target.value) || 100)}
                         className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none focus:border-cyan-500"
                       />
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div>
                       <label className="mb-2 block text-sm font-semibold text-slate-700">{t('tools.barcode-generator.colorLabel')}</label>
                       <div className="flex items-center">
                          <input
                            type="color"
                            value={lineColor}
                            onChange={(e) => setLineColor(e.target.value)}
                            className="h-10 w-full cursor-pointer rounded border border-slate-200 bg-white p-1"
                          />
                       </div>
                   </div>
                   <div>
                       <label className="mb-2 block text-sm font-semibold text-slate-700">{t('tools.barcode-generator.bgLabel')}</label>
                       <div className="flex items-center">
                          <input
                            type="color"
                            value={background}
                            onChange={(e) => setBackground(e.target.value)}
                            className="h-10 w-full cursor-pointer rounded border border-slate-200 bg-white p-1"
                          />
                       </div>
                   </div>
                </div>

                <div className="pt-2">
                   <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-700">
                     <input
                        type="checkbox"
                        checked={displayValue}
                        onChange={(e) => setDisplayValue(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                     />
                     {t('tools.barcode-generator.displayValueLabel')}
                   </label>
                </div>
             </div>
          </div>
        </div>

        {/* Right Side: Output Preview */}
        <div className="flex flex-col space-y-3">
             
             <div className="flex items-center justify-between">
                <h3 className="block text-sm font-semibold leading-6 text-slate-900">
                    {t('tools.barcode-generator.rendererTitle')}
                </h3>
                <button
                  onClick={handleDownload}
                  disabled={!!error || !text}
                  className="flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Download className="w-4 h-4" /> {t('tools.barcode-generator.downloadBtn')}
                </button>
             </div>

             <div className="relative flex h-[500px] items-center justify-center overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-8 shadow-sm">
                {/* Checkered background for transparency illusion, though technically we specify a background color */}
                
                <div className="flex flex-col items-center justify-center relative">
                    {/* SVG container for JsBarcode */}
                    <svg ref={barcodeRef} className={error ? 'hidden' : 'block shadow-md max-w-full'}></svg>
                    
                    {error && (
                        <div className="bg-red-50 text-red-600 border border-red-200 px-6 py-4 rounded-xl flex items-center gap-3 max-w-md text-center shadow-sm">
                           <RefreshCcw className="w-6 h-6 shrink-0" />
                           <span className="text-sm font-medium">{error}</span>
                        </div>
                    )}
                    
                    {!text && !error && (
                        <div className="text-slate-400 text-sm">{t('tools.barcode-generator.noContentMsg')}</div>
                    )}
                </div>
             </div>
             
             <div className="rounded-lg border border-cyan-100 bg-cyan-50/50 p-4 text-sm font-medium leading-relaxed text-slate-600">
                💡 <strong>{t('tools.barcode-generator.tipsTitle')}</strong><br/>
                • {t('tools.barcode-generator.tip1')}<br/>
                • {t('tools.barcode-generator.tip2')}
             </div>
        </div>

      </div>

    </div>
  );
}
