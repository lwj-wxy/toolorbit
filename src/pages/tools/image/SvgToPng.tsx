import React, { useState, useRef, useEffect } from 'react';
import { FileImage, UploadCloud, Download, Code, Image as ImageIcon, Trash2, ArrowRight } from 'lucide-react';

export default function SvgToPng() {
  const [svgContent, setSvgContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('converted_image');
  const [width, setWidth] = useState<number>(800);
  const [height, setHeight] = useState<number>(800);
  const [maintainRatio, setMaintainRatio] = useState<boolean>(true);
  const [originalAspectRatio, setOriginalAspectRatio] = useState<number>(1);
  const [isDragging, setIsDragging] = useState(false);
  const [previewError, setPreviewError] = useState<string>('');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parse SVG string to establish original dimensions
  useEffect(() => {
    if (!svgContent) {
        setPreviewError('');
        return;
    }

    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgContent, 'image/svg+xml');
        const errNode = doc.querySelector('parsererror');
        if (errNode) {
            setPreviewError('SVG 解析失败，格式可能有误。');
            return;
        }

        const rootSvg = doc.documentElement;
        if (rootSvg.tagName.toLowerCase() !== 'svg') {
            setPreviewError('未找到根 <svg> 元素。');
            return;
        }

        let w = parseFloat(rootSvg.getAttribute('width') || '0');
        let h = parseFloat(rootSvg.getAttribute('height') || '0');
        const viewBox = rootSvg.getAttribute('viewBox');

        if ((!w || !h) && viewBox) {
            const parts = viewBox.split(/\s+|,/);
            if (parts.length >= 4) {
               w = parseFloat(parts[2]);
               h = parseFloat(parts[3]);
            }
        }

        if (w > 0 && h > 0) {
           const ratio = w / h;
           setOriginalAspectRatio(ratio);
           // We ONLY auto-update the setting inputs when they first load the SVG, to be helpful.
           setWidth(Math.round(w));
           setHeight(Math.round(h));
        }

        setPreviewError('');

    } catch (e) {
        setPreviewError('未知解析错误');
    }

  }, [svgContent]);

  const handleWidthChange = (val: number) => {
      setWidth(val);
      if (maintainRatio && originalAspectRatio > 0) {
          setHeight(Math.round(val / originalAspectRatio));
      }
  };

  const handleHeightChange = (val: number) => {
      setHeight(val);
      if (maintainRatio && originalAspectRatio > 0) {
          setWidth(Math.round(val * originalAspectRatio));
      }
  };

  const handleFileUpload = (file: File) => {
    if (!file) return;
    
    // Some SVGs show up as text/xml or similar sometimes, but we prefer image/svg+xml
    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
    setFileName(nameWithoutExt);

    const reader = new FileReader();
    reader.onload = (e) => {
       const text = e.target?.result;
       if (typeof text === 'string') {
          setSvgContent(text);
       }
    };
    reader.readAsText(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDownload = () => {
     if (!svgContent) return;
     const canvas = canvasRef.current;
     if (!canvas) return;

     const ctx = canvas.getContext('2d');
     if (!ctx) return;

     // Ensure SVG has valid width/height attributes for the Image constructor to respect
     const parser = new DOMParser();
     const doc = parser.parseFromString(svgContent, 'image/svg+xml');
     const rootSvg = doc.documentElement;
     rootSvg.setAttribute('width', width.toString());
     rootSvg.setAttribute('height', height.toString());
     const modifiedSvgString = new XMLSerializer().serializeToString(doc);

     const img = new Image();
     const svgBlob = new Blob([modifiedSvgString], { type: 'image/svg+xml;charset=utf-8' });
     const URL = window.URL || window.webkitURL || window;
     const blobURL = URL.createObjectURL(svgBlob);

     img.onload = () => {
         // Clear canvas
         ctx.clearRect(0, 0, canvas.width, canvas.height);
         // Draw
         ctx.drawImage(img, 0, 0, width, height);
         // Export
         const pngUrl = canvas.toDataURL("image/png");
         const downloadLink = document.createElement("a");
         downloadLink.href = pngUrl;
         downloadLink.download = `${fileName}.png`;
         document.body.appendChild(downloadLink);
         downloadLink.click();
         document.body.removeChild(downloadLink);
         URL.revokeObjectURL(blobURL);
     };

     img.src = blobURL;
  };

  const clearAll = () => {
      setSvgContent('');
      setPreviewError('');
      if (fileInputRef.current) {
          fileInputRef.current.value = '';
      }
  };

  // Convert pure SVG string into renderable URI for img tag Preview
  const getEncodedSvgUri = () => {
      if (!svgContent || previewError) return null;
      return "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgContent)));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Hidden Canvas for Processing */}
      <canvas ref={canvasRef} width={width} height={height} className="hidden" />

      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 lg:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-[#2563eb] rounded-xl flex items-center justify-center shrink-0">
            <FileImage className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">SVG 转 PNG</h1>
            <p className="text-[#64748b] mt-1 text-sm md:text-base">
              无需服务器参与，纯净本地浏览器运算，将 SVG 矢量图渲染导出为高清 PNG 图片。
            </p>
          </div>
        </div>
        
        {svgContent && (
             <button 
                 onClick={clearAll}
                 className="px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-lg flex items-center gap-2 transition-colors border border-transparent hover:border-red-100 self-start md:self-auto"
               >
                 <Trash2 className="w-4 h-4" /> 清空重置
             </button>
        )}
      </div>

      {!svgContent ? (
          /* Step 1: Upload Area */
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8 lg:p-16 flex flex-col items-center">
               <div
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  className={`w-full max-w-2xl border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-12 transition-colors ${
                      isDragging ? 'border-[#2563eb] bg-blue-50/50' : 'border-[#cbd5e1] hover:bg-[#f8fafc] hover:border-[#94a3b8]'
                  }`}
               >
                  <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept=".svg,image/svg+xml"
                      onChange={(e) => {
                          if (e.target.files?.[0]) {
                              handleFileUpload(e.target.files[0]);
                          }
                      }}
                  />
                  <div className="w-20 h-20 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center mb-6 text-[#94a3b8]">
                      <UploadCloud className="w-10 h-10" />
                  </div>
                  <p className="text-[#1e293b] font-medium text-xl mb-3">拖拽 SVG 图片文件至此处</p>
                  <p className="text-[#64748b] text-sm text-center mb-8">
                      极速的本地纯前端解析器，所有处理都在您的离线设备完成
                  </p>
                  <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-8 py-3 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium rounded-xl transition-colors shadow-sm"
                  >
                      选择 SVG 文件
                  </button>
               </div>

               <div className="mt-8 flex items-center gap-4 w-full max-w-2xl">
                  <div className="h-px bg-slate-200 flex-1"></div>
                  <span className="text-sm font-medium text-slate-400">或者直接粘贴代码</span>
                  <div className="h-px bg-slate-200 flex-1"></div>
               </div>

               <div className="w-full max-w-2xl mt-8">
                   <textarea
                       onChange={(e) => setSvgContent(e.target.value)}
                       placeholder="<svg viewBox=&#34;0 0 100 100&#34;> ... </svg>"
                       className="w-full h-32 bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-4 font-mono text-sm outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] transition-all resize-none shadow-inner"
                   />
               </div>
          </div>
      ) : (
          /* Step 2: Playground Area */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Code Editor & Export Settings */}
              <div className="lg:col-span-5 space-y-6">
                 {/* Raw Editor */}
                 <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 flex flex-col h-[400px]">
                    <div className="flex items-center gap-2 mb-3">
                        <Code className="w-5 h-5 text-blue-600" />
                        <h3 className="font-bold text-[#1e293b]">SVG 源码编辑</h3>
                    </div>
                    <textarea
                       value={svgContent}
                       onChange={(e) => setSvgContent(e.target.value)}
                       className="flex-1 w-full bg-slate-900 text-slate-50 border-none rounded-xl p-4 font-mono text-xs outline-none focus:ring-2 focus:ring-[#2563eb] transition-all resize-none"
                       spellCheck={false}
                    />
                 </div>

                 {/* Export Engine */}
                 <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5">
                    <h3 className="font-bold text-[#1e293b] mb-4 flex items-center gap-2">
                       <span className="w-2 h-5 bg-emerald-500 rounded-sm block"></span>
                       导出光栅化参数
                    </h3>
                    
                    <div className="space-y-4">
                       <div className="grid grid-cols-2 gap-4">
                           <div>
                               <label className="block text-sm font-bold text-[#475569] mb-2">画布宽度 (px)</label>
                               <input
                                 type="number"
                                 value={width || ''}
                                 onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                                 className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-4 py-2 outline-none focus:border-[#2563eb]"
                               />
                           </div>
                           <div>
                               <label className="block text-sm font-bold text-[#475569] mb-2">画布高度 (px)</label>
                               <input
                                 type="number"
                                 value={height || ''}
                                 onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                                 className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-lg px-4 py-2 outline-none focus:border-[#2563eb]"
                               />
                           </div>
                       </div>
                       
                       <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-[#475569]">
                         <input
                            type="checkbox"
                            checked={maintainRatio}
                            onChange={(e) => setMaintainRatio(e.target.checked)}
                            className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 border-gray-300"
                         />
                         锁定原图宽高比，防止拉伸形变
                       </label>

                       <button
                         onClick={handleDownload}
                         disabled={!!previewError || width === 0 || height === 0}
                         className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 font-bold rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                       >
                         <Download className="w-5 h-5" /> 生成 PNG 并下载
                       </button>
                    </div>
                 </div>
              </div>

              {/* Right Column: Visual Render */}
              <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 min-h-[500px] flex flex-col">
                 <h3 className="font-bold text-[#1e293b] mb-4 flex items-center gap-2 border-b border-slate-100 pb-4">
                    <ImageIcon className="w-5 h-5 text-blue-600" /> WebKit 渲染核心视图
                 </h3>
                 
                 <div className="flex-1 relative flex items-center justify-center bg-checkered p-8 rounded-xl overflow-hidden border border-slate-200">
                    <style dangerouslySetInnerHTML={{__html: `
                        .bg-checkered {
                            background-image: linear-gradient(45deg, #f1f5f9 25%, transparent 25%), linear-gradient(-45deg, #f1f5f9 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f1f5f9 75%), linear-gradient(-45deg, transparent 75%, #f1f5f9 75%);
                            background-size: 20px 20px;
                            background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
                        }
                    `}} />

                    {previewError ? (
                        <div className="bg-white/90 backdrop-blur-sm border border-red-200 rounded-xl p-6 text-center max-w-sm">
                           <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                              <span className="font-bold text-xl">!</span>
                           </div>
                           <h4 className="font-bold text-slate-800 mb-1">解析失败</h4>
                           <p className="text-sm text-slate-600">{previewError}</p>
                        </div>
                    ) : (
                        getEncodedSvgUri() && (
                            <img 
                              src={getEncodedSvgUri()!} 
                              alt="SVG Prefix" 
                              style={{ maxWidth: '100%', maxHeight: '600px' }}
                              className="shadow-sm" 
                            />
                        )
                    )}
                 </div>
              </div>
          </div>
      )}

      {/* Bottom SEO Instructions Panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8 lg:p-12 mb-8 mt-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">在线 SVG 转 PNG 工具，保留矢量的完美细节</h2>
        
        <p className="text-slate-600 mb-6 leading-relaxed">
          SVG 转 PNG 转换器是一款致力于消除前端与平面设计代沟的小巧应用。在互联网开发中，SVG 矢量图凭借无限放大不失真的特性广受欢迎；然而在传统的文档分享、社交媒体配图或是旧版系统的兼容上，我们往往需要将其栅格化为背景透明的 PNG 图片。
        </p>

        <div className="bg-rose-50 border border-rose-100/50 rounded-xl p-5 mb-8">
          <p className="text-rose-700 text-sm font-bold leading-relaxed">
            您的安全始终是第一位的。本工具所进行的一切矢量图解析与 PNG 画布绘制渲染，100% 局限在您个人的浏览器内执行，绝对不会将您的商业 Logo 源文件或私密矢量图纸泄露至外部网络。
          </p>
        </div>

        <h3 className="font-bold text-slate-800 text-lg mb-4">关于纯本地 SVG 转换方案的亮点：</h3>
        <ul className="space-y-4 text-slate-600">
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">1. 透明通道全保留：</strong>
            <span>SVG 设计中常用的 Alpha 透明度以及不规则边框效果，能够在转化为 PNG 时得到原汁原味的保留，不会像粗劣的截图操作一样强制加上难以去掉的白底。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">2. 自定义放大倍率：</strong>
            <span>您可以随心所欲地控制导出结果的尺寸。由于源头是矢量文件，即便将其长宽在此工具中翻倍放大并导出为 PNG，它的边缘与线条依旧清晰锐利，不起毛边。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">3. 告别设计软件的笨重：</strong>
            <span>想要将 UI 同事发来的一个 SVG 图标简单地丢进 PPT，终于不必再为此去苦苦启动重达几个 G 的专业设计工具了，丢进网页瞬间出图。</span>
          </li>
        </ul>
        
        <p className="text-slate-500 text-sm mt-8 pt-6 border-t border-slate-100">
          用高效轻捷的技术手段去承接繁重复杂的设计资产切图任务，是保证工作流顺畅、避免无效加班的绝佳策略。
        </p>
      </div>

    </div>
  );
}
