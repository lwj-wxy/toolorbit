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
      <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 lg:p-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-[#2563eb] rounded-xl flex items-center justify-center shrink-0">
            <RefreshCcw className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1e293b]">图片格式在线转换工具</h1>
            <p className="text-[#64748b] mt-1 text-sm md:text-base">
              在本地安全极速地互转 JPEG、PNG、WEBP 等常见图片格式。
            </p>
          </div>
        </div>
      </div>

      {/* Main App Workspace */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 lg:p-10">
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

      {/* SEO & Descriptions */}
      <div className="bg-[#f8fafc] rounded-2xl shadow-sm border border-[#e2e8f0] p-6 lg:p-8 mt-6">
        <div className="prose max-w-none text-[14px] leading-loose text-[#475569]">
          <p className="mb-4">
            图片格式转换工具是一种用于将图片从一种格式转换为另一种格式的应用或在线单页网页应用。通常情况下，不同的图片格式在压缩算法、图像质量、透明度支持等方面具有不同的特点和优势。有时候，你可能需要将一种格式的图片转换为另一种格式，以满足特定需求，比如在网页中显示、打印、编辑等。
          </p>

          <p className="text-red-500 font-bold mb-6 bg-red-50/50 p-4 rounded-xl border border-red-100/50">
            数据仅记录于本地浏览器缓存，不会上传云端生成以及缓存。切勿转换违法违规图片，否则出现问题自行负责。
          </p>

          <p className="mb-4 text-[#1e293b] font-bold">
            图片格式转换工具通常具有以下功能和特点：
          </p>
          
          <ul className="space-y-4">
            <li>
              <strong className="text-[#0f172a]">1. 格式互转：</strong> 主要功能是将用户上传的图片文件从一种格式转换为另一种格式。常见的图片格式包括 JPEG、PNG、WEBP 等。
            </li>
            <li>
              <strong className="text-[#0f172a]">2. 画质保障：</strong> 使用现代浏览器内置的原生 Canvas API，可最大程度保障图像转换质量，且针对带透明层 PNG 转换为 JPEG 等需求做了专业的纯白全填充处理。
            </li>
            <li>
              <strong className="text-[#0f172a]">3. 极速隐私：</strong> 所有的计算进程严格锁定在您的实体机器前端环境中，即插即用，不用排队，文件永不面临公网泄漏危机。
            </li>
          </ul>
        </div>
      </div>

    </div>
  );
}
