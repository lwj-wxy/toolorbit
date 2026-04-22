import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Download, Trash2, CheckCircle2, ArrowRight, RefreshCcw } from 'lucide-react';

export default function ImageConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>('');
  
  const [targetFormat, setTargetFormat] = useState<string>('image/jpeg');
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [hasConverted, setHasConverted] = useState<boolean>(false);
  const [convertedUrl, setConvertedUrl] = useState<string>('');
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null);

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
      loadOriginalFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith('image/')) {
        loadOriginalFile(droppedFile);
      } else {
        alert("请上传有效的图片文件！");
      }
    }
  };

  const loadOriginalFile = (selectedFile: File) => {
    setFile(selectedFile);
    setOriginalUrl(URL.createObjectURL(selectedFile));
    setHasConverted(false);
    setConvertedUrl('');
    setConvertedBlob(null);
    
    // Auto switch target format depending on input to suggest something else
    if (selectedFile.type === 'image/jpeg') {
      setTargetFormat('image/png');
    } else {
      setTargetFormat('image/jpeg');
    }
  };

  const convertImage = () => {
    if (!originalUrl || !file) return;
    setIsConverting(true);

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsConverting(false);
        return;
      }
      
      // Fill white background for JPEGs to prevent black backgrounds on transparent PNGs/WebPs
      if (targetFormat === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            setConvertedBlob(blob);
            setConvertedUrl(URL.createObjectURL(blob));
            setHasConverted(true);
          }
          setIsConverting(false);
        },
        targetFormat,
        0.92 // High quality default
      );
    };
    img.src = originalUrl;
  };

  const clearFile = () => {
    setFile(null);
    setOriginalUrl('');
    setConvertedUrl('');
    setConvertedBlob(null);
    setHasConverted(false);
    setIsConverting(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const downloadImage = () => {
    if (!convertedUrl || !file) return;
    const a = document.createElement('a');
    a.href = convertedUrl;
    
    const nameParts = file.name.split('.');
    nameParts.pop(); // Remove original extension
    const ext = targetFormat === 'image/jpeg' ? 'jpg' : (targetFormat === 'image/webp' ? 'webp' : 'png');
    a.download = `${nameParts.join('.')}-converted.${ext}`;
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-[#2563eb] rounded-xl flex items-center justify-center shrink-0">
            <RefreshCcw className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">图片格式在线转换工具</h1>
            <p className="text-[#64748b] mt-1 text-sm md:text-base">
              在本地安全极速地互转 JPEG、PNG、WEBP 等常见图片格式。
            </p>
          </div>
        </div>
      </div>

      {/* Main App Workspace */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 lg:p-10">
        {!file ? (
          <div 
            className={`rounded-2xl border-2 border-dashed transition-all p-12 text-center flex flex-col items-center justify-center min-h-[360px] cursor-pointer
              ${isDragging ? 'border-[#2563eb] bg-blue-50/50' : 'border-[#cbd5e1] hover:border-[#94a3b8] hover:bg-slate-50'}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
            <div className="w-16 h-16 bg-blue-50 text-[#2563eb] rounded-full flex items-center justify-center mb-6 shadow-sm">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#1e293b] mb-2">点击选择图片文件</h3>
            <p className="text-[#64748b] mb-6">或将图片文件拖拽至此框内</p>
            <button className="bg-white border border-[#cbd5e1] text-[#0f172a] px-6 py-2.5 rounded-lg font-bold shadow-sm hover:border-[#94a3b8] hover:bg-slate-50 transition-colors flex items-center gap-2">
              <Upload className="w-4 h-4" />
              选择图片文件...
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-4">
              <h3 className="text-lg font-bold text-[#1e293b] flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-blue-500" />
                已上传文件：{file.name}
              </h3>
              <button 
                onClick={clearFile}
                className="text-sm font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />清除/重新上传
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
              {/* Preview Area */}
              <div className="w-full md:w-[320px] shrink-0">
                <div className="flex flex-col relative group">
                  <div className="aspect-square bg-[#f8fafc] rounded-xl border border-[#e2e8f0] overflow-hidden flex items-center justify-center mb-3">
                    <img 
                      src={hasConverted ? convertedUrl : originalUrl} 
                      alt="Preview" 
                      className="w-full h-full object-contain p-2" 
                    />
                  </div>
                  <div className="flex justify-between items-center px-1 text-sm">
                    <span className="text-[#64748b] font-medium">文件大小</span>
                    <span className="font-bold text-[#0f172a]">
                      {hasConverted && convertedBlob ? formatSize(convertedBlob.size) : formatSize(file.size)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Area */}
              <div className="flex-1 space-y-8 py-2">
                <div>
                  <label className="block text-[14px] font-bold text-[#1e293b] mb-3">目标格式：</label>
                  <select
                    value={targetFormat}
                    onChange={(e) => { 
                      setTargetFormat(e.target.value); 
                      if(hasConverted) setHasConverted(false); 
                    }}
                    className="w-full sm:w-[240px] bg-white border border-[#cbd5e1] px-4 py-3 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-bold text-slate-700 cursor-pointer shadow-sm"
                  >
                    <option value="image/jpeg">JPEG (.jpg)</option>
                    <option value="image/png">PNG (.png)</option>
                    <option value="image/webp">WEBP (.webp)</option>
                  </select>
                </div>

                <div className="pt-2">
                  {!hasConverted ? (
                    <button
                      onClick={convertImage}
                      disabled={isConverting}
                      className="bg-[#10b981] hover:bg-[#059669] disabled:bg-emerald-300 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-bold transition-all shadow-[0_2px_10px_rgba(16,185,129,0.2)] flex items-center gap-2"
                    >
                      {isConverting ? (
                        <>
                          <RefreshCcw className="w-5 h-5 animate-spin" />
                          正在转换...
                        </>
                      ) : (
                        '转换'
                      )}
                    </button>
                  ) : (
                    <div className="flex items-center gap-4">
                      <button
                        onClick={downloadImage}
                        className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-8 py-3 rounded-lg font-bold transition-all shadow-[0_2px_10px_rgba(37,99,235,0.2)] flex items-center gap-2"
                      >
                        <Download className="w-5 h-5" /> 下载转换结果
                      </button>
                      <div className="text-green-600 font-medium flex items-center gap-1.5 text-sm bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
                        <CheckCircle2 className="w-4 h-4" /> 转换成功
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom SEO Instructions Panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8 lg:p-12 mb-8 mt-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">在线图片格式转换器，实现图像无缝互转</h2>
        
        <p className="text-slate-600 mb-6 leading-relaxed">
          图片格式在线转换器是一款专业的实用辅助工具，旨在帮助用户快速将图像资产在不同的格式后缀间无缝互转。不论是为了优化网页加载速度使用的 WEBP，还是支持透明图层的 PNG，亦或是高压缩率的 JPEG，不同格式在压缩算法与使用场景上各有所长。借助此工具，您可以轻松突破文件应用局限。
        </p>

        <div className="bg-rose-50 border border-rose-100/50 rounded-xl p-5 mb-8">
          <p className="text-rose-700 text-sm font-bold leading-relaxed">
            本站坚持纯本地浏览器运算，所有图像数据均直接在您的设备内存中流转，坚决不上传任何私密图片到云端服务器。您在断网的环境下也能正常执行所有的格式转码。
          </p>
        </div>

        <h3 className="font-bold text-slate-800 text-lg mb-4">一款现代化的图片格式转换工具的核心优势：</h3>
        <ul className="space-y-4 text-slate-600">
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">1. 跨格式无损互切：</strong>
            <span>突破文件编码壁垒，让您上传的原始图稿一键输出为指定的新格式，深度全面兼容如 JPEG、PNG、WEBP 等主流图像标准。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">2. 极简的交互美学：</strong>
            <span>采用直观友好的面板设计（如“即拖即转”），把复杂的底层重编码逻辑隐藏在点击操作之下。无需学习专业修图软件的门槛，也能飞速上手完成批处理。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">3. 灵活的云原生与纯前端架构：</strong>
            <span>告别传统老旧软件那繁琐的安装包。基于 Canvas 的纯前端处理引擎兼顾了“无需安装、随时点开就用”的网络便利性，也免去了上传慢、网络受限的弊端。</span>
          </li>
        </ul>
        
        <p className="text-slate-500 text-sm mt-8 pt-6 border-t border-slate-100">
          简而言之，熟练利用图片格式化工具，不仅将极大节约您的数字内容管理时间，更是每一位内容创作者必备的高效利器。
        </p>
      </div>

    </div>
  );
}
