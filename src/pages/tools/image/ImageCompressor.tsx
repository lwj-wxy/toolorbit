import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Image as ImageIcon, Download, Settings, Trash2, ArrowRight, CheckCircle2, Zap } from 'lucide-react';

export default function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>('');
  const [compressedUrl, setCompressedUrl] = useState<string>('');
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  
  const [quality, setQuality] = useState<number>(80);
  const [targetFormat, setTargetFormat] = useState<string>('image/jpeg');
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      loadAndCompressFile(e.target.files[0], quality, targetFormat);
    }
  };

  const loadAndCompressFile = (selectedFile: File, q: number, format: string) => {
    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setOriginalUrl(url);
    
    // Auto-select best format
    let defaultFormat = format;
    if (!file && selectedFile.type === 'image/png') {
       defaultFormat = 'image/webp'; // Better for PNG compression while keeping transparency
       setTargetFormat('image/webp');
    } else if (!file) {
       defaultFormat = 'image/jpeg';
       setTargetFormat('image/jpeg');
    }

    triggerCompression(url, selectedFile.type, q, defaultFormat);
  };

  const triggerCompression = useCallback((sourceUrl: string, originalType: string, q: number, format: string) => {
    setIsCompressing(true);
    
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      
      // Auto-scale down insanely huge images to prevent memory crash (max 4K)
      const MAX_WIDTH = 3840;
      const MAX_HEIGHT = 2160;
      let width = img.width;
      let height = img.height;

      if (width > MAX_WIDTH) {
        height = Math.round((height * MAX_WIDTH) / width);
        width = MAX_WIDTH;
      }
      if (height > MAX_HEIGHT) {
        width = Math.round((width * MAX_HEIGHT) / height);
        height = MAX_HEIGHT;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Fill white background for JPEGs (in case of transparent PNG original)
      if (format === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
      }
      
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            setCompressedBlob(blob);
            setCompressedUrl(URL.createObjectURL(blob));
          }
          setIsCompressing(false);
        },
        format,
        q / 100
      );
    };
    img.src = sourceUrl;
  }, []);

  // Re-compress when quality or format changes
  useEffect(() => {
    if (originalUrl) {
      const timer = setTimeout(() => {
        triggerCompression(originalUrl, file?.type || '', quality, targetFormat);
      }, 300); // debounce slider
      return () => clearTimeout(timer);
    }
  }, [quality, targetFormat, originalUrl, triggerCompression, file]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith('image/')) {
        loadAndCompressFile(droppedFile, quality, targetFormat);
      } else {
        alert("请上传图片文件！");
      }
    }
  };

  const clearFile = () => {
    setFile(null);
    setOriginalUrl('');
    setCompressedUrl('');
    setCompressedBlob(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const downloadCompressed = () => {
    if (!compressedUrl || !file) return;
    const a = document.createElement('a');
    a.href = compressedUrl;
    
    // Create new filename: original-compressed.jpg
    const nameParts = file.name.split('.');
    nameParts.pop(); // remove original extension
    const ext = targetFormat === 'image/jpeg' ? 'jpg' : (targetFormat === 'image/webp' ? 'webp' : 'png');
    a.download = `${nameParts.join('.')}-compressed.${ext}`;
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const originalSize = file?.size || 0;
  const compressedSize = compressedBlob?.size || 0;
  const savedPercent = originalSize > 0 && compressedSize > 0 
    ? Math.max(0, ((originalSize - compressedSize) / originalSize) * 100).toFixed(1) 
    : '0.0';
  const isBigger = compressedSize > originalSize;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 lg:p-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-[#2563eb] rounded-xl flex items-center justify-center shrink-0">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1e293b]">图片在线压缩</h1>
            <p className="text-[#64748b] mt-1 text-sm md:text-base">
              在本地浏览器中极速压缩图片体积，保护隐私不传服务器，一键提升网页加载速度。
            </p>
          </div>
        </div>
      </div>

      {!file ? (
        <div 
          className={`bg-white rounded-2xl border-2 border-dashed transition-all p-12 text-center flex flex-col items-center justify-center min-h-[400px] cursor-pointer
            ${isDragging ? 'border-[#2563eb] bg-blue-50/50' : 'border-[#cbd5e1] hover:border-[#94a3b8] hover:bg-slate-50'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/jpeg, image/png, image/webp" 
            className="hidden" 
          />
          <div className="w-20 h-20 bg-blue-50 text-[#2563eb] rounded-full flex items-center justify-center mb-6 shadow-sm">
            <Upload className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-[#1e293b] mb-2">点击选择图片或拖拽图片到此</h3>
          <p className="text-[#64748b] mb-6">支持 JPG, PNG, WebP 格式（最大推荐 20MB）</p>
          <button className="bg-[#2563eb] text-white px-8 py-3 rounded-full font-bold shadow-sm hover:bg-[#1d4ed8] transition-colors">
            选择本地图片
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Workspace (Preview) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6">
              <div className="flex items-center justify-between mb-6 border-b border-[#e2e8f0] pb-4">
                <h3 className="text-lg font-bold text-[#1e293b] flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  预览与对比
                </h3>
                <button 
                  onClick={clearFile}
                  className="text-sm font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />重新选择
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
                {/* Arrow Connector */}
                <div className="hidden sm:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-[#e2e8f0] rounded-full items-center justify-center z-10 shadow-sm text-slate-400">
                  <ArrowRight className="w-5 h-5" />
                </div>

                {/* Original */}
                <div className="flex flex-col">
                  <div className="aspect-square bg-slate-100 rounded-xl border border-slate-200 overflow-hidden relative flex items-center justify-center mb-3">
                    <img src={originalUrl} alt="Original" className="w-full h-full object-contain" />
                    <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm font-medium">原始图片</div>
                  </div>
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[#64748b] text-sm">大小</span>
                    <span className="font-bold text-[#1e293b]">{formatSize(originalSize)}</span>
                  </div>
                </div>

                {/* Compressed */}
                <div className="flex flex-col">
                  <div className="aspect-square bg-slate-100 rounded-xl border border-slate-200 overflow-hidden relative flex items-center justify-center mb-3">
                    {isCompressing && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                        <Zap className="w-8 h-8 text-blue-500 animate-pulse mb-2" />
                        <span className="font-bold text-blue-600 text-sm">正在压缩...</span>
                      </div>
                    )}
                    <img src={compressedUrl} alt="Compressed" className="w-full h-full object-contain" />
                    <div className="absolute top-2 left-2 bg-blue-600/90 text-white text-xs px-2 py-1 rounded backdrop-blur-sm font-medium shadow-sm">压缩后</div>
                  </div>
                  <div className="flex flex-col gap-1 px-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[#64748b] text-sm">大小</span>
                      <span className={`font-bold ${isBigger ? 'text-red-500' : 'text-green-600'}`}>
                        {formatSize(compressedSize)}
                      </span>
                    </div>
                    {!isCompressing && !isBigger && (
                       <div className="flex justify-between items-center">
                         <span className="text-[#64748b] text-sm">节省体积</span>
                         <span className="font-bold text-[#2563eb]">-{savedPercent}%</span>
                       </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 relative overflow-hidden">
              <div className="flex items-center gap-2 mb-6">
                <Settings className="w-5 h-5 text-[#2563eb]" />
                <h3 className="font-bold text-[#1e293b]">压缩设置</h3>
              </div>

              <div className="space-y-6">
                
                {/* Quality Slider */}
                <div>
                  <div className="flex justify-between items-end mb-3">
                    <label className="text-sm font-bold text-[#64748b]">压缩强度 (Quality)</label>
                    <span className="font-bold text-[#2563eb] bg-blue-50 px-2 py-0.5 rounded-md text-sm">{quality}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="100" 
                    value={quality} 
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#2563eb]"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
                    <span>极速/小体积</span>
                    <span>最高画质</span>
                  </div>
                </div>

                {/* Target Format */}
                <div>
                   <label className="text-sm font-bold text-[#64748b] mb-3 block">输出格式</label>
                   <div className="grid grid-cols-2 gap-3">
                     <button 
                       onClick={() => setTargetFormat('image/jpeg')}
                       className={`py-2 rounded-lg font-bold text-sm transition-all border ${targetFormat === 'image/jpeg' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-[#e2e8f0] text-slate-600 hover:border-slate-300'}`}
                     >
                       JPEG
                     </button>
                     <button 
                       onClick={() => setTargetFormat('image/webp')}
                       className={`py-2 rounded-lg font-bold text-sm transition-all border flex flex-col items-center justify-center leading-tight ${targetFormat === 'image/webp' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-[#e2e8f0] text-slate-600 hover:border-slate-300'}`}
                     >
                       WebP
                     </button>
                   </div>
                   <p className="text-[12px] text-slate-400 mt-2 leading-relaxed">
                     WebP 格式通常比 JPEG 体积小 20-30% 且支持透明度，但旧版浏览器兼容性稍欠。
                   </p>
                </div>

              </div>
              
              <div className="border-t border-[#e2e8f0] mt-6 pt-6">
                <button 
                  onClick={downloadCompressed}
                  disabled={isCompressing || !compressedUrl}
                  className="w-full bg-[#2563eb] text-white hover:bg-[#1d4ed8] disabled:bg-slate-300 disabled:cursor-not-allowed py-3.5 rounded-xl font-bold shadow-sm transition-all flex justify-center items-center gap-2 text-[15px]"
                >
                  <Download className="w-5 h-5" />
                  保存压缩后的图片
                </button>
              </div>

            </div>
            
          </div>
        </div>
      )}

      {/* Bottom SEO Instructions Panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-8 lg:p-12 mb-8 mt-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">图片在线压缩工具，提升网页性能的神器</h2>
        
        <p className="text-slate-600 mb-6 leading-relaxed">
          图片在线压缩器是一款专为站长、新媒体运营及设计师打造的提效助手。当您需要将超大的单反照片或高清素材应用于网站建设、推文配图以减少加载时间时，这款工具能为您在画质与体积之间找到完美的平衡点。
        </p>

        <div className="bg-rose-50 border border-rose-100/50 rounded-xl p-5 mb-8">
          <p className="text-rose-700 text-sm font-bold leading-relaxed">
            本站坚持纯本地浏览器级运算，您的所有原图与压缩后的图稿均直接在您的设备内存中进行流转，绝不上传任何包含隐私的自拍、商业设计图或机密照片到云端服务器，保障您的数据 100% 留存在本地。
          </p>
        </div>

        <h3 className="font-bold text-slate-800 text-lg mb-4">为什么选择我们的前端图片压缩引擎？</h3>
        <ul className="space-y-4 text-slate-600">
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">1. 本地极速处理：</strong>
            <span>免去了将几十张大体积高清图缓慢上传至云端再排队下载的折磨。基于浏览器原生的 Canvas 计算能力，即便是几个 G 的素材也能在几秒内瞬间完成瘦身。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">2. 可视化参数调节：</strong>
            <span>在处理面板中，您可以自由拉动滑块来调节输出的图片质量。左侧对比原图，右侧对比压缩结果及预估体积，所见即所得，精准控制压缩率。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">3. 卓越的跨平台性：</strong>
            <span>不需要再四处寻找各种破译版的图片处理软件，打开网页即可快速搞定。无论是 JPEG 的高压缩比还是 PNG 的透明图层处理，均能游刃有余。</span>
          </li>
        </ul>
        
        <p className="text-slate-500 text-sm mt-8 pt-6 border-t border-slate-100">
          简而言之，熟练利用好本地图片压缩工具，不仅能大幅节约服务器带宽与内容托管成本，更能给您的终端受众提供丝滑畅快的阅览体验。
        </p>
      </div>

    </div>
  );
}
