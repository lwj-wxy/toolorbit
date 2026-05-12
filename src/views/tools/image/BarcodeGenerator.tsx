import React, { useState, useEffect, useRef } from 'react';
import { Barcode, Download, RefreshCcw } from 'lucide-react';
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
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-[#2563eb] rounded-xl flex items-center justify-center shrink-0">
            <Barcode className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('tools.barcode-generator.title')}</h1>
            <p className="text-[#64748b] mt-1 text-sm md:text-base">
              {t('tools.barcode-generator.subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Settings */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6">
             
             <div className="space-y-5">
                <div>
                   <label className="block text-sm font-bold text-[#475569] mb-2">{t('tools.barcode-generator.contentLabel')}</label>
                   <input
                     type="text"
                     value={text}
                     onChange={(e) => setText(e.target.value)}
                     className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-4 py-3 outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all"
                     placeholder={t('tools.barcode-generator.contentPlaceholder')}
                   />
                </div>

                <div>
                   <label className="block text-sm font-bold text-[#475569] mb-2">{t('tools.barcode-generator.formatLabel')}</label>
                   <select 
                       value={format}
                       onChange={(e) => {
                           setFormat(e.target.value);
                           // Offer a gentle hint text adaptation
                           if(e.target.value === 'EAN13') setText('123456789012');
                           else if(e.target.value === 'EAN8') setText('1234567');
                           else if(e.target.value === 'UPC') setText('123456789012');
                       }}
                       className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-4 py-3 outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all font-mono"
                   >
                       {FORMATS.map(f => (
                           <option key={f} value={f}>{f}</option>
                       ))}
                   </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div>
                       <label className="block text-sm font-bold text-[#475569] mb-2">{t('tools.barcode-generator.widthLabel')}</label>
                       <input
                         type="number"
                         min="1"
                         max="10"
                         value={width}
                         onChange={(e) => setWidth(parseInt(e.target.value) || 2)}
                         className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-4 py-3 outline-none focus:border-[#2563eb]"
                       />
                   </div>
                   <div>
                       <label className="block text-sm font-bold text-[#475569] mb-2">{t('tools.barcode-generator.heightLabel')}</label>
                       <input
                         type="number"
                         min="10"
                         max="300"
                         value={height}
                         onChange={(e) => setHeight(parseInt(e.target.value) || 100)}
                         className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-4 py-3 outline-none focus:border-[#2563eb]"
                       />
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div>
                       <label className="block text-sm font-bold text-[#475569] mb-2">{t('tools.barcode-generator.colorLabel')}</label>
                       <div className="flex items-center">
                          <input
                            type="color"
                            value={lineColor}
                            onChange={(e) => setLineColor(e.target.value)}
                            className="h-10 w-full rounded cursor-pointer border border-[#cbd5e1] p-1 bg-white"
                          />
                       </div>
                   </div>
                   <div>
                       <label className="block text-sm font-bold text-[#475569] mb-2">{t('tools.barcode-generator.bgLabel')}</label>
                       <div className="flex items-center">
                          <input
                            type="color"
                            value={background}
                            onChange={(e) => setBackground(e.target.value)}
                            className="h-10 w-full rounded cursor-pointer border border-[#cbd5e1] p-1 bg-white"
                          />
                       </div>
                   </div>
                </div>

                <div className="pt-2">
                   <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-[#475569]">
                     <input
                        type="checkbox"
                        checked={displayValue}
                        onChange={(e) => setDisplayValue(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                     />
                     {t('tools.barcode-generator.displayValueLabel')}
                   </label>
                </div>
             </div>
          </div>
        </div>

        {/* Right Side: Output Preview */}
        <div className="lg:col-span-8 flex flex-col">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 flex flex-col min-h-[500px]">
             
             <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-4">
                <h3 className="font-bold text-[#1e293b] flex items-center gap-2">
                    <span className="w-2 h-6 bg-blue-500 rounded-sm block"></span>
                    {t('tools.barcode-generator.rendererTitle')}
                </h3>
                <button
                  onClick={handleDownload}
                  disabled={!!error || !text}
                  className="flex items-center gap-1.5 px-4 py-2 font-bold rounded-lg bg-[#2563eb] text-white hover:bg-[#1d4ed8] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-4 h-4" /> {t('tools.barcode-generator.downloadBtn')}
                </button>
             </div>

             <div className="flex-1 bg-transparent rounded-xl flex items-center justify-center p-8 overflow-x-auto relative min-h-[250px]">
                {/* Checkered background for transparency illusion, though technically we specify a background color */}
                <div className="absolute inset-0 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl -z-10" />
                
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
             
             <div className="mt-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100 text-sm text-slate-600 leading-relaxed font-medium">
                💡 <strong>{t('tools.barcode-generator.tipsTitle')}</strong><br/>
                • {t('tools.barcode-generator.tip1')}<br/>
                • {t('tools.barcode-generator.tip2')}
             </div>
          </div>
        </div>

      </div>

      {/* Bottom SEO Instructions Panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8 lg:p-12 mt-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">{t('tools.barcode-generator.seoTitle')}</h2>
        
        <p className="text-slate-600 mb-6 leading-relaxed">
          {t('tools.barcode-generator.seoDesc')}
        </p>

        <h3 className="font-bold text-slate-800 text-lg mb-4">{t('tools.barcode-generator.seoHighlightsTitle')}</h3>
        <ul className="space-y-4 text-slate-600">
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">{t('tools.barcode-generator.highlight1Title')}</strong>
            <span>{t('tools.barcode-generator.highlight1Desc')}</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">{t('tools.barcode-generator.highlight2Title')}</strong>
            <span>{t('tools.barcode-generator.highlight2Desc')}</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">{t('tools.barcode-generator.highlight3Title')}</strong>
            <span>{t('tools.barcode-generator.highlight3Desc')}</span>
          </li>
        </ul>
        
        <p className="text-slate-500 text-sm mt-8 pt-6 border-t border-slate-100">
          {t('tools.barcode-generator.seoFooter')}
        </p>
      </div>

    </div>
  );
}
