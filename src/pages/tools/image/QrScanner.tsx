import React, { useState, useRef } from 'react';
import { ScanLine, UploadCloud, Copy, RefreshCcw, Check, AlertCircle, FileImage } from 'lucide-react';
import jsQR from 'jsqr';

export default function QrScanner() {
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file) return;
    
    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      setError('请上传有效的图片文件 (JPG, PNG, WebP 等)');
      setResult('');
      return;
    }

    // Reset state
    setError('');
    setResult('');
    setPreviewImage(URL.createObjectURL(file));

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) {
          setError('浏览器不支持 Canvas 渲染，无法解析');
          return;
        }

        // Set canvas size to image size
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0, img.width, img.height);
        
        try {
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: "dontInvert",
            });

            if (code) {
              setResult(code.data);
            } else {
              setError('无法从这张图片中识别到任何二维码信息，请尝试更换清晰度更高的图片。');
            }
        } catch (e) {
            setError('解析图片数据时发生未知错误。');
        }
      };
      img.onerror = () => {
         setError('图片加载失败，请重试');
      };
      // Load image data
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
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
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const resetAll = () => {
    setResult('');
    setError('');
    setPreviewImage(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 lg:p-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-[#2563eb] rounded-xl flex items-center justify-center shrink-0">
            <ScanLine className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1e293b]">二维码识别</h1>
            <p className="text-[#64748b] mt-1 text-sm md:text-base">
              上传二维码图片，基于纯前端引擎离线解析提取隐藏信息。
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Side: Upload Area */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 flex flex-col min-h-[400px]">
           <h3 className="font-bold text-[#1e293b] mb-4 flex items-center gap-2">
              <span className="w-2 h-5 bg-[#2563eb] rounded-sm block"></span>
              输入图像源
           </h3>

           {!previewImage ? (
               <div
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  className={`flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 transition-colors ${
                      isDragging ? 'border-[#2563eb] bg-blue-50/50' : 'border-[#cbd5e1] hover:bg-[#f8fafc] hover:border-[#94a3b8]'
                  }`}
               >
                  <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                          if (e.target.files?.[0]) {
                              handleFile(e.target.files[0]);
                          }
                      }}
                  />
                  <div className="w-16 h-16 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center mb-4 text-[#94a3b8]">
                      <UploadCloud className="w-8 h-8" />
                  </div>
                  <p className="text-[#1e293b] font-medium text-lg mb-2">拖拽二维码图片至此处</p>
                  <p className="text-[#64748b] text-sm text-center mb-6">
                      支持 JPG、PNG、WebP 等格式<br />纯本地解析，不产生任何网络上传
                  </p>
                  <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium rounded-lg transition-colors shadow-sm"
                  >
                      手动选择文件
                  </button>
               </div>
           ) : (
               <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl relative">
                  <button 
                     onClick={resetAll}
                     className="absolute top-4 right-4 p-2 bg-white rounded-lg shadow-sm border border-slate-200 text-slate-500 hover:text-blue-600 transition-colors"
                     title="重新上传"
                  >
                     <RefreshCcw className="w-5 h-5" />
                  </button>
                  <img src={previewImage} alt="Preview" className="max-w-full max-h-[250px] object-contain rounded-lg shadow-sm mb-4" />
                  <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
                     <FileImage className="w-4 h-4" />
                     已载入待解析图片
                  </p>
               </div>
           )}
        </div>

        {/* Right Side: Result Output */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-6 flex flex-col min-h-[400px]">
           <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
               <h3 className="font-bold text-[#1e293b] flex items-center gap-2">
                  <span className="w-2 h-5 bg-purple-500 rounded-sm block"></span>
                  解析结果
               </h3>
               {result && (
                  <button
                   onClick={copyToClipboard}
                   className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors border border-blue-100"
                  >
                   {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                   {copied ? '已拷贝' : '拷贝结果'}
                  </button>
               )}
           </div>

           <div className="flex-1 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-4 md:p-6 overflow-auto">
              {error ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-red-500">
                     <AlertCircle className="w-12 h-12 mb-3 opacity-50" />
                     <p className="font-medium max-w-[250px]">{error}</p>
                  </div>
              ) : result ? (
                  <div className="text-[#0f172a] whitespace-pre-wrap break-all sm:text-lg font-mono">
                     {result}
                  </div>
              ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center text-[#94a3b8]">
                     <ScanLine className="w-12 h-12 mb-3 opacity-20" />
                     <p className="text-sm">等待获取有效图片解析结果</p>
                  </div>
              )}
           </div>
        </div>

      </div>

      {/* Bottom SEO Instructions Panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] p-8 lg:p-12 mt-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">二维码防钓鱼检测与在线图片解码提取工具</h2>
        
        <p className="text-slate-600 mb-6 leading-relaxed">
          互联网到处充斥着不明短链接和加密二维码，我们经常需要在电脑大屏或安全隔离网端去破译这些神秘图案背后的真实网关地址。这款强大的非接触式解码工具，能为您解开图像图层背后的伪装，获取直白的明文链接。
        </p>

        <h3 className="font-bold text-slate-800 text-lg mb-4">这款云端防沉迷扫码器具备哪些应用价值：</h3>
        <ul className="space-y-4 text-slate-600">
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">1. 逆向工程与防患审计：</strong>
            <span>在不主动“扫码即跳转”的物理隔离状态下，通过向面板上传或者拖放图片，强制剥离出底层的 URL 地址与元数据。有效防止流氓推广平台恶意自动唤起 App 及高危网站劫持。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">2. 支持复合图像环境侦测：</strong>
            <span>对于广告长图排版、截图拼接包浆以及嵌入多重水洗滤镜内的复杂环境二维码，内部搭载的图像识别侦查器依然具有优秀的区域捕捉修正以及降噪复原分析能力。</span>
          </li>
          <li className="flex gap-3">
            <strong className="text-slate-800 shrink-0">3. 彻头彻尾的离线隔离墙：</strong>
            <span>为了保证防范“病毒式图片”溯源打点，全部解构渲染运算都是依靠客户端浏览器的计算负荷在内存中解开，切断了任何上传至第三方的网络侦听流浪。</span>
          </li>
        </ul>
        
        <p className="text-slate-500 text-sm mt-8 pt-6 border-t border-slate-100">
          进阶指南：如果您的解码图像特别模糊或角度畸变过度严重，请尝试在画图工具里进行一定强度的锐化剪裁处理后再掷入本平台，成功提取出源信息的概率会大幅度提升。
        </p>
      </div>

    </div>
  );
}
