import React, { useState, useEffect, useRef } from 'react';
import { Barcode, Download, RefreshCcw } from 'lucide-react';
import JsBarcode from 'jsbarcode';

export default function BarcodeGenerator() {
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
        setError('生成内容不能为空');
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
                 setError('输入的格式或字符不符合当前条码标准的硬性约束。');
             }
          }
        });
      }
    } catch (err: any) {
      setError('输入的格式或字符不符合当前条码标准。如 EAN-13 必须是 12 或 13 位纯数字。');
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
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">条形码生成</h1>
            <p className="text-[#64748b] mt-1 text-sm md:text-base">
              在线生成主流的各种标准一维条形码，支持 CODE128、CODE39、EAN 等数十种规格。
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
                   <label className="block text-sm font-bold text-[#475569] mb-2">生成内容字符串</label>
                   <input
                     type="text"
                     value={text}
                     onChange={(e) => setText(e.target.value)}
                     className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-4 py-3 outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all"
                     placeholder="输入需要编码的文字或数字"
                   />
                </div>

                <div>
                   <label className="block text-sm font-bold text-[#475569] mb-2">条形码标准协议 (Format)</label>
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
                       <label className="block text-sm font-bold text-[#475569] mb-2">单条宽度 (px)</label>
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
                       <label className="block text-sm font-bold text-[#475569] mb-2">整体高度 (px)</label>
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
                       <label className="block text-sm font-bold text-[#475569] mb-2">条形码颜色</label>
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
                       <label className="block text-sm font-bold text-[#475569] mb-2">背景颜色</label>
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
                     在条码底端显示真实文字
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
                    实时渲染器视图
                </h3>
                <button
                  onClick={handleDownload}
                  disabled={!!error || !text}
                  className="flex items-center gap-1.5 px-4 py-2 font-bold rounded-lg bg-[#2563eb] text-white hover:bg-[#1d4ed8] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-4 h-4" /> 导出 PNG
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
                        <div className="text-slate-400 text-sm">请输入内容开始为您渲染</div>
                    )}
                </div>
             </div>
             
             <div className="mt-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100 text-sm text-slate-600 leading-relaxed font-medium">
                💡 <strong>协议规范温馨提示：</strong><br/>
                • <strong>CODE128：</strong>支持全量 ASCII 码流，兼容性极强，推荐普通业务场景使用。<br/>
                • <strong>EAN13 / EAN8：</strong>全球商品通用的标准，其中 EAN-13 约束为严格的 12 位或 13 位纯数字，EAN-8 为 7 或 8 位数字。如果您的格式不符，右侧会给出校验报错提醒阻止生成。
             </div>
          </div>
        </div>

      </div>

      {/* Bottom SEO Instructions Panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8 lg:p-12 mt-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">在线多形态条码生成引擎：为电商零售提供轻量化商品贴标方案</h2>
        
        <p className="text-slate-600 mb-6 leading-relaxed">
          无论是运营跨境电商店铺、开展同城仓储管理或是进行书店商品打码，不同行业的底层扫描枪需要不同的黑白条栅系统指令规范。这款集成化一站条形画板帮您摆脱安装繁琐 ERP 打印客户端的痛点，即录即渲。
        </p>

        <h3 className="font-bold text-slate-800 text-lg mb-4">全面支持国际化流通格式的工业级优势：</h3>
        <ul className="space-y-4 text-slate-600">
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">1. 贯通全品系条阵图谱：</strong>
            <span>它不但支持能够吞咽全量 ASCII 码的 CODE128（最强万金油协议），也严格遵从适用于全球商品流通的标配 EAN-13、UPC-A 以及仓储货架最爱的 ITF-14 校验渲染标准体系。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">2. 矢量级样式客制与展示：</strong>
            <span>针对美工与排版设计师提供可视化微调旋钮。粗细栅格参数、全包背景色彩抑或展示人眼可直接识别的校验落脚底纹，皆可按照热敏打印机图层规格动态输出并提供 PNG 包络底片下载直达云端打印机。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">3. 即时前置错误容错断言：</strong>
            <span>某些条码具有严苛的位数、校验和规则或只能录入整数值范围。如果在文本框输入违规或少位元值，防呆检测将直接抛出红色致命阻断错误日志，避免无效空标签被批量投放到工业生产中。</span>
          </li>
        </ul>
        
        <p className="text-slate-500 text-sm mt-8 pt-6 border-t border-slate-100">
          声明与拓展：部分快递与航空件经常使用具有特殊标识符开头的长款 CODE_128 作为派递单。建议对于这部分长码，您需要手工调大【单条宽度】像素单位比例防止在长边挤压导致扫描镭射头无法解构的情况。
        </p>
      </div>

    </div>
  );
}
